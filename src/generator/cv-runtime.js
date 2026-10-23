// CV Runtime Script - embedded into generated HTML
// This is exported as a string template for the generator

export function getCvRuntimeScript(langMap, supportedLangs, defaultLang = 'en') {
  return `
(function(){
  var _i18n = ${JSON.stringify(langMap)};
  var _supportedLangs = ${JSON.stringify(supportedLangs)};
  var _defaultLang = ${JSON.stringify(defaultLang)};

  function init() {
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
      var t = _i18n[lang] || _i18n[_defaultLang];
      if (!t) return;
      var els = document.querySelectorAll('[data-i18n-key]');
      els.forEach(function(el) {
        var k = el.getAttribute('data-i18n-key');
        if (t[k] !== undefined && t[k] !== null) {
          el.innerHTML = t[k];
        }
      });
      if (t['page_title']) {
        document.title = t['page_title'];
      }
    }

    function setLanguage(lang, notifyParent) {
      var eLang = _supportedLangs.indexOf(lang) >= 0 ? lang : _defaultLang;
      docEl.setAttribute('lang', eLang);
      localStorage.setItem('language', eLang);
      if (currentLangSpan) currentLangSpan.textContent = eLang.toUpperCase();
      if (langMenu) {
        var items = langMenu.querySelectorAll('li');
        items.forEach(function(li) {
          if (li.getAttribute('data-lang') === eLang) {
            li.classList.add('active');
          } else {
            li.classList.remove('active');
          }
        });
      }
      applyTranslations(eLang);

      if (notifyParent !== false) {
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'CV_LANG_CHANGE', lang: eLang }, '*');
          }
        } catch (e) {}
      }
    }

    // Expose helpers for direct control by preview panel
    window.__setLanguage = function(l) { setLanguage(l, false); };
    window.__setTheme = applyTheme;
    window.__applyTranslations = applyTranslations;

    // Determine initial language
    var urlParams = new URLSearchParams(window.location.search);
    var langFromUrl = urlParams.get('lang');
    var docLang = docEl.getAttribute('lang');

    var isInsideIframe = false;
    try { isInsideIframe = window.parent && window.parent !== window; } catch(e){}

    var initLang = langFromUrl || docLang || _defaultLang;
    if (!isInsideIframe) {
      var storedLang = localStorage.getItem('language');
      if (storedLang && _supportedLangs.indexOf(storedLang) >= 0) {
        initLang = storedLang;
      }
    }

    setLanguage(initLang, false);

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
          var targetLang = e.target.getAttribute('data-lang');
          setLanguage(targetLang, true);
          if (langBtn) langBtn.classList.remove('active');
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
        if (langBtn) langBtn.classList.remove('active');
        langMenu.classList.remove('show');
      }
    });

    // Listen for postMessage from parent
    window.addEventListener('message', function(ev) {
      if (ev.data && ev.data.type === 'SET_PREVIEW_LANG') {
        setLanguage(ev.data.lang, false);
      }
      if (ev.data && ev.data.type === 'SET_PREVIEW_THEME') {
        applyTheme(ev.data.theme);
      }
    });
  }

  // Handle both normal document load and dynamic doc.write load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;
}
