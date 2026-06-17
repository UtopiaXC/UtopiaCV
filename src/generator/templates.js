// HTML template functions for each section type

/**
 * Get localized text for the default language, and build i18n key mapping
 * @param {Object} i18nObj - { en: "...", zh: "...", ja: "..." }
 * @param {string} key - i18n key name
 * @param {string} defaultLang - default language code
 * @param {Object} langMap - accumulator for lang->key->value mapping
 */
function t(i18nObj, key, defaultLang, langMap) {
  if (!i18nObj || typeof i18nObj === 'string') return i18nObj || '';
  const defaultText = i18nObj[defaultLang] || i18nObj['en'] || Object.values(i18nObj)[0] || '';
  // Register all translations
  for (const [lang, text] of Object.entries(i18nObj)) {
    if (!langMap[lang]) langMap[lang] = {};
    langMap[lang][key] = text;
  }
  return defaultText;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- Section Renderers ---

export function renderNavbar(cvData, langMap) {
  const defaultLang = cvData.meta.defaultLanguage || 'en';
  const sections = cvData.sections.filter(s => s.enabled).sort((a, b) => a.order - b.order);
  const langNames = {
    en: 'English', zh: '中文', ja: '日本語', ko: '한국어',
    fr: 'Français', de: 'Deutsch', es: 'Español',
  };

  const navItems = sections.map(section => {
    const key = `nav_${section.id}`;
    const label = t(section.data.title, key, defaultLang, langMap);
    return `<li><a href="#${section.id}" class="nav-link" data-i18n-key="${key}">${escapeHtml(label)}</a></li>`;
  }).join('\n            ');

  const langOptions = cvData.meta.supportedLanguages.map(lang =>
    `<li data-lang="${lang}">${langNames[lang] || lang}</li>`
  ).join('\n                    ');

  return `<header class="navbar">
    <div class="container">
        <a href="#about" class="navbar-brand">${escapeHtml(cvData.navbar.brand)}</a>
        <ul class="nav-links">
            ${navItems}
            <li class="language-switcher">
                <button id="lang-switcher-button">
                    <i class="fas fa-globe"></i>
                    <span id="current-lang">${(defaultLang).toUpperCase()}</span>
                    <i class="fas fa-caret-down"></i>
                </button>
                <ul id="lang-switcher-menu">
                    ${langOptions}
                </ul>
            </li>
            <li>
                <button id="theme-toggle" class="theme-toggle" title="Toggle dark/light mode">
                    <i class="fas fa-moon fa-fw"></i>
                    <i class="fas fa-sun fa-fw"></i>
                </button>
            </li>
        </ul>
    </div>
</header>`;
}

export function renderAbout(section, defaultLang, langMap) {
  const d = section.data;
  const name = t(d.name, 'about_name', defaultLang, langMap);
  const title = t(d.title, 'about_title', defaultLang, langMap);
  const bio = t(d.bio, 'about_bio', defaultLang, langMap);

  const photoHtml = d.photo
    ? `<img src="${escapeHtml(d.photo)}" alt="${escapeHtml(name)}'s Photo" class="about-photo">`
    : '';

  const socialHtml = (d.socialLinks || []).map(link => {
    const targetAttr = link.type !== 'email' ? ' target="_blank"' : '';
    return `<a href="${escapeHtml(link.url)}" data-tooltip="${escapeHtml(link.tooltip)}"${targetAttr}><i class="${escapeHtml(link.icon)}"></i></a>`;
  }).join('\n                        ');

  return `<section id="${section.id}">
        <div class="container">
            <div class="about-grid">
                ${photoHtml}
                <div class="about-text">
                    <h1 data-i18n-key="about_name">${name}</h1>
                    <p class="title" data-i18n-key="about_title">${title}</p>
                    <p class="bio" data-i18n-key="about_bio">${bio}</p>
                    <div class="social-icons">
                        ${socialHtml}
                    </div>
                </div>
            </div>
        </div>
    </section>`;
}

export function renderTimeline(section, defaultLang, langMap) {
  const d = section.data;
  const sectionTitle = t(d.title, `${section.id}_title`, defaultLang, langMap);

  const cardsHtml = (d.items || []).map(item => {
    const itemTitle = t(item.title, `${section.id}_${item.id}_title`, defaultLang, langMap);
    const institution = t(item.institution, `${section.id}_${item.id}_institution`, defaultLang, langMap);
    const description = t(item.description, `${section.id}_${item.id}_description`, defaultLang, langMap);
    const department = t(item.department, `${section.id}_${item.id}_department`, defaultLang, langMap);

    const logoHtml = item.logo
      ? `<a href="${escapeHtml(item.logoLink || '#')}" target="_blank">
                        <img src="${escapeHtml(item.logo)}" alt="Logo" class="card-logo">
                    </a>`
      : '';

    const deptHtml = department
      ? `<a href="${escapeHtml(item.departmentLink || '#')}" target="_blank">
                            <blockquote class="card-department" data-i18n-key="${section.id}_${item.id}_department">${department}</blockquote>
                        </a>`
      : '';

    return `<div class="card">
                    ${logoHtml}
                    <div class="card-content">
                        <div class="card-header">
                            <div class="card-title-group">
                                <h3 data-i18n-key="${section.id}_${item.id}_title">${itemTitle}</h3>
                                <a href="${escapeHtml(item.logoLink || '#')}" target="_blank">
                                    <p class="card-location" data-i18n-key="${section.id}_${item.id}_institution">${institution}</p>
                                </a>
                            </div>
                            <span class="card-date">${escapeHtml(item.dateRange)}</span>
                        </div>
                        <p class="card-description" data-i18n-key="${section.id}_${item.id}_description">${description}</p>
                        ${deptHtml}
                    </div>
                </div>`;
  }).join('\n\n                ');

  return `<section id="${section.id}">
        <div class="container">
            <h2 data-i18n-key="${section.id}_title">${sectionTitle}</h2>
            <div class="experience-cards">
                ${cardsHtml}
            </div>
        </div>
    </section>`;
}

export function renderCardGrid(section, defaultLang, langMap) {
  const d = section.data;
  const sectionTitle = t(d.title, `${section.id}_title`, defaultLang, langMap);

  const cardsHtml = (d.items || []).map(item => {
    const itemTitle = t(item.title, `${section.id}_${item.id}_title`, defaultLang, langMap);
    const description = t(item.description, `${section.id}_${item.id}_description`, defaultLang, langMap);

    const linksHtml = (item.links || []).map((link, li) => {
      const linkLabel = t(link.label, `${section.id}_${item.id}_link_${li}`, defaultLang, langMap);
      return `<a href="${escapeHtml(link.url)}" target="_blank"><span data-i18n-key="${section.id}_${item.id}_link_${li}">${linkLabel}</span> <i class="${escapeHtml(link.icon)}"></i></a>`;
    }).join('\n                        ');

    return `<div class="project-card">
                    <h3 data-i18n-key="${section.id}_${item.id}_title">${itemTitle}</h3>
                    <p data-i18n-key="${section.id}_${item.id}_description">${description}</p>
                    <div class="project-links">
                        ${linksHtml}
                    </div>
                </div>`;
  }).join('\n                ');

  return `<section id="${section.id}">
        <div class="container">
            <h2 data-i18n-key="${section.id}_title">${sectionTitle}</h2>
            <div class="research-grid">
                ${cardsHtml}
            </div>
        </div>
    </section>`;
}

export function renderProjectGrid(section, defaultLang, langMap) {
  const d = section.data;
  const sectionTitle = t(d.title, `${section.id}_title`, defaultLang, langMap);

  const cardsHtml = (d.items || []).map(item => {
    const itemTitle = t(item.title, `${section.id}_${item.id}_title`, defaultLang, langMap);
    const institution = t(item.institution, `${section.id}_${item.id}_institution`, defaultLang, langMap);
    const description = t(item.description, `${section.id}_${item.id}_description`, defaultLang, langMap);

    const techHtml = (item.techTags || []).map(tag =>
      `<span class="tech-tag">${escapeHtml(tag)}</span>`
    ).join('\n                        ');

    return `<div class="project-card">
                    <h3 data-i18n-key="${section.id}_${item.id}_title">${itemTitle}</h3>
                    <p class="project-meta">
                        <span data-i18n-key="${section.id}_${item.id}_institution">${institution}</span> | <span>${escapeHtml(item.dateRange)}</span>
                    </p>
                    <p data-i18n-key="${section.id}_${item.id}_description">${description}</p>
                    <div class="tech-stack">
                        ${techHtml}
                    </div>
                </div>`;
  }).join('\n                ');

  return `<section id="${section.id}">
        <div class="container">
            <h2 data-i18n-key="${section.id}_title">${sectionTitle}</h2>
            <div class="research-grid">
                ${cardsHtml}
            </div>
        </div>
    </section>`;
}

export function renderContact(section, defaultLang, langMap) {
  const d = section.data;
  const sectionTitle = t(d.title, `${section.id}_title`, defaultLang, langMap);
  const contactText = t(d.contactText, `${section.id}_text`, defaultLang, langMap);

  // Language title
  const langTitle = t(
    { en: 'Languages', zh: '语言能力', ja: '言語能力' },
    'language_title', defaultLang, langMap
  );

  const langItems = (d.languages || []).map((lang, i) => {
    const name = t(lang.name, `lang_${i}_name`, defaultLang, langMap);
    const level = t(lang.level, `lang_${i}_level`, defaultLang, langMap);
    return `<li><span data-i18n-key="lang_${i}_name">${name}</span><span class="level" data-i18n-key="lang_${i}_level">${level}</span></li>`;
  }).join('\n                    ');

  const additionalLinksHtml = (d.additionalLinks || []).map((link, i) => {
    const sep = i === 0 ? '' : ' · ';
    return `${sep}<a href="${escapeHtml(link.url)}" target="_blank">${escapeHtml(link.label)}</a>`;
  }).join('');

  return `<section id="${section.id}">
        <div class="container">
            <h2 data-i18n-key="${section.id}_title">${sectionTitle}</h2>
            <div class="language-card">
                <h3 data-i18n-key="language_title">${langTitle}</h3>
                <ul>
                    ${langItems}
                </ul>
            </div>
            <div class="contact-content">
                <p><a href="mailto:${escapeHtml(d.email)}">${escapeHtml(d.email)}</a></p>
                <p data-i18n-key="${section.id}_text">${contactText}</p>
                <p></p>
                ${additionalLinksHtml}
            </div>
        </div>
    </section>`;
}

export function renderFooter(cvData) {
  const f = cvData.footer;
  return `<footer class="site-footer">
    <div class="container">
        <p>${escapeHtml(f.text)}</p>
        <p>Copyright &copy; ${f.copyright.startYear}-<span id="current-year"></span> <a href="${escapeHtml(f.copyright.url)}" target="_blank">${escapeHtml(f.copyright.name)}</a>. All rights reserved.</p>
    </div>
</footer>`;
}

// Section type to renderer mapping
export const sectionRenderers = {
  about: renderAbout,
  timeline: renderTimeline,
  'card-grid': renderCardGrid,
  'project-grid': renderProjectGrid,
  contact: renderContact,
};
