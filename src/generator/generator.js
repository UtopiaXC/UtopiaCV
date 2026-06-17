// Core Generator - assembles all parts into a single HTML file
import { renderNavbar, renderFooter, sectionRenderers } from './templates.js';
import { getCvRuntimeScript } from './cv-runtime.js';
import cvStyleRaw from './cv-style.css?raw';

/**
 * Generate a complete single-file HTML from CV data
 * @param {Object} cvData - the full cv-data.json object
 * @returns {string} - complete HTML string
 */
export function generateHtml(cvData) {
  const defaultLang = cvData.meta.defaultLanguage || 'en';
  const langMap = {}; // will be populated by template renderers

  // Initialize langMap for all supported languages
  cvData.meta.supportedLanguages.forEach(lang => {
    langMap[lang] = {};
  });

  // Render navbar
  const navbarHtml = renderNavbar(cvData, langMap);

  // Render sections
  const enabledSections = cvData.sections
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);

  const sectionsHtml = enabledSections.map(section => {
    const renderer = sectionRenderers[section.type];
    if (!renderer) {
      console.warn(`Unknown section type: ${section.type}`);
      return `<!-- Unknown section type: ${section.type} -->`;
    }
    return renderer(section, defaultLang, langMap);
  }).join('\n\n    ');

  // Render footer
  const footerHtml = renderFooter(cvData);

  // Generate runtime script with i18n data
  const runtimeScript = getCvRuntimeScript(langMap, cvData.meta.supportedLanguages);

  // Matomo analytics script
  let analyticsScript = '';
  if (cvData.meta.analytics?.matomo?.enabled) {
    const m = cvData.meta.analytics.matomo;
    analyticsScript = `
    <!-- Matomo -->
    <script>
        var _paq = window._paq = window._paq || [];
        _paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
        _paq.push(["setCookieDomain", "${m.cookieDomain || ''}"]);
        _paq.push(["setDomains", ${JSON.stringify(m.domains || [])}]);
        _paq.push(["enableCrossDomainLinking"]);
        _paq.push(["setDoNotTrack", true]);
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function () {
            var u = "${m.url}";
            _paq.push(['setTrackerUrl', u + 'matomo.php']);
            _paq.push(['setSiteId', '${m.siteId}']);
            var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
            g.async = true; g.src = u + 'matomo.js'; s.parentNode.insertBefore(g, s);
        })();
    </script>
    <!-- End Matomo Code -->`;
  }

  // Page title i18n key
  const pageTitle = cvData.meta.name + ' - CV';

  // Assemble full HTML
  const html = `<!DOCTYPE html>
<html lang="${defaultLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="darkreader-lock">
    <title data-i18n-key="page_title">${escapeHtmlAttr(pageTitle)}</title>
    <style>
${cvStyleRaw}
    </style>
    ${analyticsScript}
    <script>
        (function () {
            var userTheme = localStorage.getItem('theme');
            var systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (userTheme === 'dark' || (!userTheme && systemPrefersDark)) {
                document.documentElement.classList.add('dark-mode');
            }
        })();
    </script>
</head>
<body>
${navbarHtml}

<main>
    ${sectionsHtml}
</main>

${footerHtml}

<script>
${runtimeScript}
</script>
</body>
</html>`;

  return html;
}

function escapeHtmlAttr(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Trigger download of the generated HTML
 * @param {Object} cvData
 */
export function downloadGeneratedHtml(cvData) {
  const html = generateHtml(cvData);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'index.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download CV data as JSON
 * @param {Object} cvData
 */
export function downloadJson(cvData) {
  const json = JSON.stringify(cvData, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cv-data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
