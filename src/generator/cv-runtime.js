// CV Runtime Script - embedded into generated HTML
// This is exported as a string template for the generator

export function getCvRuntimeScript(langMap, supportedLangs) {
  // langMap: { en: { key: val }, zh: { key: val }, ja: { key: val } }
  // supportedLangs: ['en', 'zh', 'ja']
  const langNames = {
    en: 'English',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
  };

  return `
(function(){
  var _i18n = ${JSON.stringify(langMap)};
  var _supportedLangs = ${JSON.stringify(supportedLangs)};
  var _langNames = ${JSON.stringify(langNames)};

  document.addEventListener('DOMContentLoaded', function() {
    var docEl = document.documentElement;
    var themeToggle = document.getElementById('theme-toggle');
    var langBtn = document.getElementById('lang-switcher-button');
    var langMenu = document.getElementById('lang-switcher-menu');
    var currentLangSpan = document.getElementById('current-lang');
    var yearSpan = document.getElementById('current-year');
    var sections = document.querySelectorAll('section');
    var navLinks = document.querySelectorAll('.nav-link');

    // Theme
    function applyTheme(t) {
      if (t === 'dark') docEl.classList.add('dark-mode');
      else docEl.classList.remove('dark-mode');
    }
    if (themeToggle) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', function(e) {
        localStorage.removeItem('theme');
        applyTheme(e.matches ? 'dark' : 'light');
      });
      themeToggle.addEventListener('click', function() {
        var nt = docEl.classList.contains('dark-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', nt);
        applyTheme(nt);
      });
    }

    // i18n
    function applyTranslations(lang) {
      var t = _i18n[lang];
      if (!t) return;
      var els = document.querySelectorAll('[data-i18n-key]');
      els.forEach(function(el) {
        var k = el.getAttribute('data-i18n-key');
        if (t[k]) el.innerHTML = t[k];
      });
    }
    function setLanguage(lang) {
      var eLang = _supportedLangs.indexOf(lang) >= 0 ? lang : 'en';
      docEl.setAttribute('lang', eLang);
      localStorage.setItem('language', eLang);
      if (currentLangSpan) currentLangSpan.textContent = eLang.toUpperCase();
      applyTranslations(eLang);
    }

    var urlParams = new URLSearchParams(window.location.search);
    var langFromUrl = urlParams.get('lang');
    var navLang = navigator.language || 'en';
    var initLang = langFromUrl || localStorage.getItem('language') || (navLang.startsWith('zh') ? 'zh' : (navLang.startsWith('ja') ? 'ja' : 'en'));
    setLanguage(initLang);

    if (langBtn) {
      langBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        langBtn.classList.toggle('active');
        langMenu.classList.toggle('show');
      });
    }
    if (langMenu) {
      langMenu.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
          setLanguage(e.target.getAttribute('data-lang'));
          langBtn.classList.remove('active');
          langMenu.classList.remove('show');
        }
      });
    }

    // Scroll observer
    if (sections.length > 0) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function(link) { link.classList.remove('active'); });
            var id = entry.target.getAttribute('id');
            var al = document.querySelector('.nav-link[href="#' + id + '"]');
            if (al) al.classList.add('active');
          }
        });
      }, { root: null, rootMargin: '0px', threshold: 0.4 });
      sections.forEach(function(s) { observer.observe(s); });
    }

    // Footer year
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Close language menu on outside click
    document.addEventListener('click', function() {
      if (langMenu && langMenu.classList.contains('show')) {
        langBtn.classList.remove('active');
        langMenu.classList.remove('show');
      }
    });
  });
})();
`;
}
