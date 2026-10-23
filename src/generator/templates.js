import { getLangFullLabel } from '../utils/lang.js';

/**
 * Get localized text for the default language, and build robust i18n key mapping for all supported languages
 * @param {Object|string} i18nObj - { en: "...", zh: "...", ja: "..." } or plain string
 * @param {string} key - i18n key name
 * @param {string} defaultLang - default language code
 * @param {Object} langMap - accumulator for lang->key->value mapping
 * @param {Array} supportedLangs - list of supported languages
 */
function t(i18nObj, key, defaultLang, langMap, supportedLangs = []) {
  if (!i18nObj) return '';
  if (typeof i18nObj === 'string') return i18nObj;

  const defaultText = (i18nObj[defaultLang] && String(i18nObj[defaultLang]).trim() !== '')
    ? i18nObj[defaultLang]
    : (i18nObj['en'] || Object.values(i18nObj).find(v => v && String(v).trim()) || '');

  for (const lang of supportedLangs) {
    if (!langMap[lang]) langMap[lang] = {};
    const val = i18nObj[lang];
    langMap[lang][key] = (val !== undefined && val !== null && String(val).trim() !== '') ? val : defaultText;
  }

  for (const [lang, text] of Object.entries(i18nObj)) {
    if (!langMap[lang]) langMap[lang] = {};
    if (langMap[lang][key] === undefined) {
      langMap[lang][key] = text;
    }
  }

  return defaultText;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- Section Renderers ---

export function renderNavbar(cvData, langMap, supportedLangs) {
  const defaultLang = cvData.meta.defaultLanguage || 'en';
  const sections = (cvData.sections || []).filter(s => s.enabled).sort((a, b) => a.order - b.order);

  const navItems = sections
    .filter(section => section.type !== 'about')
    .map(section => {
      const key = `nav_${section.id}`;
      const label = t(section.data?.title, key, defaultLang, langMap, supportedLangs);
      return `<li><a href="#${escapeHtml(section.id)}" class="nav-link" data-i18n-key="${key}">${escapeHtml(label || section.id)}</a></li>`;
    }).join('\n            ');

  const langOptions = (supportedLangs || []).map(lang =>
    `<li data-lang="${escapeHtml(lang)}">${escapeHtml(getLangFullLabel(lang) || lang)}</li>`
  ).join('\n                    ');

  return `<header class="navbar">
    <div class="container">
        <a href="#about" class="navbar-brand">${escapeHtml(cvData.navbar?.brand || '')}</a>
        <ul class="nav-links">
            ${navItems}
            <li class="language-switcher">
                <button id="lang-switcher-button" type="button">
                    <i class="fas fa-globe"></i>
                    <span id="current-lang">${escapeHtml(defaultLang).toUpperCase()}</span>
                    <i class="fas fa-caret-down"></i>
                </button>
                <ul id="lang-switcher-menu">
                    ${langOptions}
                </ul>
            </li>
            <li>
                <button id="theme-toggle" class="theme-toggle" type="button" title="Toggle dark/light mode">
                    <i class="fas fa-moon fa-fw"></i>
                    <i class="fas fa-sun fa-fw"></i>
                </button>
            </li>
        </ul>
    </div>
</header>`;
}

export function renderAbout(section, defaultLang, langMap, supportedLangs) {
  const d = section.data || {};
  const name = t(d.name, 'about_name', defaultLang, langMap, supportedLangs);
  const title = t(d.title, 'about_title', defaultLang, langMap, supportedLangs);
  const bio = t(d.bio, 'about_bio', defaultLang, langMap, supportedLangs);

  const photoHtml = d.photo
    ? `<img src="${escapeHtml(d.photo)}" alt="${escapeHtml(name)}'s Photo" class="about-photo">`
    : '';

  const socialHtml = (d.socialLinks || []).map(link => {
    const targetAttr = link.type !== 'email' ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${escapeHtml(link.url)}" data-tooltip="${escapeHtml(link.tooltip)}"${targetAttr}><i class="${escapeHtml(link.icon)}"></i></a>`;
  }).join('\n                        ');

  return `<section id="${escapeHtml(section.id)}">
        <div class="container">
            <div class="${d.photo ? 'about-grid' : 'about-grid no-photo'}">
                ${photoHtml}
                <div class="about-text">
                    <h1 data-i18n-key="about_name">${escapeHtml(name)}</h1>
                    <p class="title" data-i18n-key="about_title">${escapeHtml(title)}</p>
                    <p class="bio" data-i18n-key="about_bio">${escapeHtml(bio)}</p>
                    <div class="social-icons">
                        ${socialHtml}
                    </div>
                </div>
            </div>
        </div>
    </section>`;
}

export function renderTimeline(section, defaultLang, langMap, supportedLangs) {
  const d = section.data || {};
  const sectionTitle = t(d.title, `${section.id}_title`, defaultLang, langMap, supportedLangs);

  const cardsHtml = (d.items || []).map(item => {
    const itemTitle = t(item.title, `${section.id}_${item.id}_title`, defaultLang, langMap, supportedLangs);
    const institution = t(item.institution, `${section.id}_${item.id}_institution`, defaultLang, langMap, supportedLangs);
    const description = t(item.description, `${section.id}_${item.id}_description`, defaultLang, langMap, supportedLangs);
    const department = t(item.department, `${section.id}_${item.id}_department`, defaultLang, langMap, supportedLangs);

    const logoHtml = item.logo
      ? `<a href="${escapeHtml(item.logoLink || '#')}" target="_blank" rel="noopener noreferrer">
                        <img src="${escapeHtml(item.logo)}" alt="Logo" class="card-logo">
                    </a>`
      : '';

    const deptHtml = department
      ? `<a href="${escapeHtml(item.departmentLink || '#')}" target="_blank" rel="noopener noreferrer">
                            <blockquote class="card-department" data-i18n-key="${section.id}_${item.id}_department">${escapeHtml(department)}</blockquote>
                        </a>`
      : '';

    return `<div class="${item.logo ? 'card' : 'card no-logo'}">
                    ${logoHtml}
                    <div class="card-content">
                        <div class="card-header">
                            <div class="card-title-group">
                                <h3 data-i18n-key="${section.id}_${item.id}_title">${escapeHtml(itemTitle)}</h3>
                                <a href="${escapeHtml(item.logoLink || '#')}" target="_blank" rel="noopener noreferrer">
                                    <p class="card-location" data-i18n-key="${section.id}_${item.id}_institution">${escapeHtml(institution)}</p>
                                </a>
                            </div>
                            <span class="card-date">${escapeHtml(item.dateRange)}</span>
                        </div>
                        <p class="card-description" data-i18n-key="${section.id}_${item.id}_description">${escapeHtml(description)}</p>
                        ${deptHtml}
                    </div>
                </div>`;
  }).join('\n\n                ');

  return `<section id="${escapeHtml(section.id)}">
        <div class="container">
            <h2 data-i18n-key="${section.id}_title">${escapeHtml(sectionTitle)}</h2>
            <div class="experience-cards">
                ${cardsHtml}
            </div>
        </div>
    </section>`;
}

export function renderCardGrid(section, defaultLang, langMap, supportedLangs) {
  const d = section.data || {};
  const sectionTitle = t(d.title, `${section.id}_title`, defaultLang, langMap, supportedLangs);

  const cardsHtml = (d.items || []).map(item => {
    const itemTitle = t(item.title, `${section.id}_${item.id}_title`, defaultLang, langMap, supportedLangs);
    const description = t(item.description, `${section.id}_${item.id}_description`, defaultLang, langMap, supportedLangs);

    const linksHtml = (item.links || []).map((link, li) => {
      const linkLabel = t(link.label, `${section.id}_${item.id}_link_${li}`, defaultLang, langMap, supportedLangs);
      return `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer"><span data-i18n-key="${section.id}_${item.id}_link_${li}">${escapeHtml(linkLabel)}</span> <i class="${escapeHtml(link.icon)}"></i></a>`;
    }).join('\n                        ');

  return `<div class="project-card">
                    <h3 data-i18n-key="${section.id}_${item.id}_title">${escapeHtml(itemTitle)}</h3>
                    <p data-i18n-key="${section.id}_${item.id}_description">${escapeHtml(description)}</p>
                    <div class="project-links">
                        ${linksHtml}
                    </div>
                </div>`;
  }).join('\n                ');

  return `<section id="${escapeHtml(section.id)}">
        <div class="container">
            <h2 data-i18n-key="${section.id}_title">${escapeHtml(sectionTitle)}</h2>
            <div class="research-grid">
                ${cardsHtml}
            </div>
        </div>
    </section>`;
}

export function renderProjectGrid(section, defaultLang, langMap, supportedLangs) {
  const d = section.data || {};
  const sectionTitle = t(d.title, `${section.id}_title`, defaultLang, langMap, supportedLangs);

  const cardsHtml = (d.items || []).map(item => {
    const itemTitle = t(item.title, `${section.id}_${item.id}_title`, defaultLang, langMap, supportedLangs);
    const institution = t(item.institution, `${section.id}_${item.id}_institution`, defaultLang, langMap, supportedLangs);
    const description = t(item.description, `${section.id}_${item.id}_description`, defaultLang, langMap, supportedLangs);

    const techHtml = (item.techTags || []).map(tag =>
      `<span class="tech-tag">${escapeHtml(tag)}</span>`
    ).join('\n                        ');

    return `<div class="project-card">
                    <h3 data-i18n-key="${section.id}_${item.id}_title">${escapeHtml(itemTitle)}</h3>
                    <p class="project-meta">
                        <span data-i18n-key="${section.id}_${item.id}_institution">${escapeHtml(institution)}</span>${item.dateRange ? ' | <span>' + escapeHtml(item.dateRange) + '</span>' : ''}
                    </p>
                    <p data-i18n-key="${section.id}_${item.id}_description">${escapeHtml(description)}</p>
                    <div class="tech-stack">
                        ${techHtml}
                    </div>
                </div>`;
  }).join('\n                ');

  return `<section id="${escapeHtml(section.id)}">
        <div class="container">
            <h2 data-i18n-key="${section.id}_title">${escapeHtml(sectionTitle)}</h2>
            <div class="research-grid">
                ${cardsHtml}
            </div>
        </div>
    </section>`;
}

export function renderContact(section, defaultLang, langMap, supportedLangs) {
  const d = section.data || {};
  const sectionTitle = t(d.title, `${section.id}_title`, defaultLang, langMap, supportedLangs);
  const contactText = t(d.contactText, `${section.id}_text`, defaultLang, langMap, supportedLangs);

  const langTitle = t(
    { en: 'Languages', zh: '语言能力', ja: '言語能力' },
    'language_title', defaultLang, langMap, supportedLangs
  );

  const langItems = (d.languages || []).map((lang, i) => {
    const name = t(lang.name, `lang_${i}_name`, defaultLang, langMap, supportedLangs);
    const level = t(lang.level, `lang_${i}_level`, defaultLang, langMap, supportedLangs);
    return `<li><span data-i18n-key="lang_${i}_name">${escapeHtml(name)}</span><span class="level" data-i18n-key="lang_${i}_level">${escapeHtml(level)}</span></li>`;
  }).join('\n                    ');

  const additionalLinksHtml = (d.additionalLinks || []).map((link, i) => {
    const sep = i === 0 ? '' : ' · ';
    return `${sep}<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`;
  }).join('');

  const emailHtml = d.email ? `<p><a href="mailto:${escapeHtml(d.email)}">${escapeHtml(d.email)}</a></p>` : '';
  const langCardHtml = (d.languages && d.languages.length > 0)
    ? `<div class="language-card">
                <h3 data-i18n-key="language_title">${escapeHtml(langTitle)}</h3>
                <ul>
                    ${langItems}
                </ul>
            </div>`
    : '';

  return `<section id="${escapeHtml(section.id)}">
        <div class="container">
            <h2 data-i18n-key="${section.id}_title">${escapeHtml(sectionTitle)}</h2>
            ${langCardHtml}
            <div class="contact-content">
                ${emailHtml}
                <p data-i18n-key="${section.id}_text">${escapeHtml(contactText)}</p>
                <p></p>
                ${additionalLinksHtml}
            </div>
        </div>
    </section>`;
}

export function renderFooter(cvData) {
  const f = cvData.footer || {};
  const copyright = f.copyright || {};
  const startYear = copyright.startYear ? `${escapeHtml(copyright.startYear)}-` : '';

  return `<footer class="site-footer">
    <div class="container">
        <p>${escapeHtml(f.text || '')}</p>
        <p>Copyright &copy; ${startYear}<span id="current-year"></span> <a href="${escapeHtml(copyright.url || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(copyright.name || '')}</a>. All rights reserved.</p>
    </div>
</footer>`;
}

export const sectionRenderers = {
  about: renderAbout,
  timeline: renderTimeline,
  'card-grid': renderCardGrid,
  'project-grid': renderProjectGrid,
  contact: renderContact,
};
