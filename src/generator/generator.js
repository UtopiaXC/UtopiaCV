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
  if (!cvData) return '';
  const defaultLang = cvData.meta?.defaultLanguage || 'en';
  const supportedLangs = (cvData.meta?.supportedLanguages && cvData.meta.supportedLanguages.length > 0)
    ? cvData.meta.supportedLanguages
    : [defaultLang];

  const langMap = {};

  // Initialize langMap for all supported languages
  supportedLangs.forEach(lang => {
    langMap[lang] = {};
  });

  // Render navbar
  const navbarHtml = renderNavbar(cvData, langMap, supportedLangs);

  // Render sections (only enabled ones, sorted by order)
  const enabledSections = (cvData.sections || [])
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);

  const sectionsHtml = enabledSections.map(section => {
    const renderer = sectionRenderers[section.type];
    if (!renderer) {
      console.warn(`Unknown section type: ${section.type}`);
      return `<!-- Unknown section type: ${section.type} -->`;
    }
    return renderer(section, defaultLang, langMap, supportedLangs);
  }).join('\n\n    ');

  // Render footer
  const footerHtml = renderFooter(cvData);

  // Page title i18n key
  const pageTitle = (cvData.navbar?.brand || cvData.meta?.name || 'Resume') + ' - CV';
  supportedLangs.forEach(lang => {
    langMap[lang]['page_title'] = pageTitle;
  });

  // Generate runtime script with i18n data
  const runtimeScript = getCvRuntimeScript(langMap, supportedLangs, defaultLang);

  // Custom CSS injection
  const customCssHtml = cvData.custom?.css
    ? `\n    <!-- Custom CSS -->\n    <style id="custom-css">\n${cvData.custom.css}\n    </style>`
    : '';

  // Custom JS injection
  const customJsHtml = cvData.custom?.js
    ? `\n    <!-- Custom JavaScript -->\n    <script id="custom-js">\n${cvData.custom.js}\n    </script>`
    : '';

  // Assemble full HTML
  const html = `<!DOCTYPE html>
<html lang="${escapeHtmlAttr(defaultLang)}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="darkreader-lock">
    <title data-i18n-key="page_title">${escapeHtmlAttr(pageTitle)}</title>
    <style>
${cvStyleRaw}
    </style>${customCssHtml}
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
</script>${customJsHtml}
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
