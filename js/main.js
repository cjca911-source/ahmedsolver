(function () {
  "use strict";

  const i18nStore = window.StrengthSolverI18n;
  const translations = i18nStore ? i18nStore.translations : {};
  const storageKey = "ahmedsolver-language";
  const eventName = "ahmedsolver:languagechange";
  const pageMap = {
    "index.html": "home",
    "mohrs-circle.html": "mohrsCircle",
    "beam-deflection.html": "beamDeflection",
    "bending-stress.html": "bendingStress",
    "composite-beam.html": "compositeBeam"
  };

  function getStoredLanguage() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function setStoredLanguage(language) {
    try {
      window.localStorage.setItem(storageKey, language);
    } catch (error) {
      /* Ignore storage issues. */
    }
  }

  function getLanguage() {
    const storedLanguage = getStoredLanguage();
    return storedLanguage && translations[storedLanguage] ? storedLanguage : "en";
  }

  function getCurrentFileName() {
    const fileName = window.location.pathname.split("/").pop();
    return fileName || "index.html";
  }

  function getCurrentPageKey() {
    return pageMap[getCurrentFileName()] || "home";
  }

  function isHomePage() {
    return getCurrentPageKey() === "home";
  }

  function getBasePath() {
    return window.location.pathname.includes("/pages/") ? "../" : "";
  }

  function buildUrl(path) {
    return `${getBasePath()}${path}`;
  }

  function getValueByPath(source, path) {
    return path.split(".").reduce(function (current, key) {
      if (current && Object.prototype.hasOwnProperty.call(current, key)) {
        return current[key];
      }

      return "";
    }, source);
  }

  function translate(key, language) {
    return getValueByPath(translations[language || getLanguage()], key);
  }

  function createBrandLogo() {
    return `
      <svg viewBox="0 0 64 64" class="brand-logo" aria-hidden="true" focusable="false">
        <circle cx="32" cy="34" r="17" class="brand-logo__gear"></circle>
        <circle cx="32" cy="34" r="8" class="brand-logo__hub"></circle>
        <path class="brand-logo__tooth" d="M30 7h4v8h-4zM30 49h4v8h-4zM7 30h8v4H7zM49 30h8v4h-8zM13.8 15.9l2.8-2.8 5.7 5.7-2.8 2.8zM41.7 43.8l2.8-2.8 5.7 5.7-2.8 2.8zM41.6 18.8l5.7-5.7 2.8 2.8-5.7 5.7zM13.7 47l5.7-5.7 2.8 2.8-5.7 5.7z"></path>
        <path class="brand-logo__helmet" d="M16 31c0-9.9 7.8-18 17.4-18S51 21.1 51 31v2H16z"></path>
        <path class="brand-logo__brim" d="M12 33h40a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z"></path>
      </svg>
    `;
  }

  function createNavLink(href, label, isActive) {
    return `
      <li>
        <a href="${href}" class="${isActive ? "is-active" : ""}" ${isActive ? 'aria-current="page"' : ""} data-nav-link>
          ${label}
        </a>
      </li>
    `;
  }

  function renderNavbar(language) {
    const target = document.getElementById("site-navbar");

    if (!target) {
      return;
    }

    const currentPageKey = getCurrentPageKey();
    const homeHref = isHomePage() ? "#top" : buildUrl("index.html");
    const mohrsHref = buildUrl("pages/mohrs-circle.html");
    const beamHref = buildUrl("pages/beam-deflection.html");
    const bendingHref = buildUrl("pages/bending-stress.html");
    const compositeHref = buildUrl("pages/composite-beam.html");

    target.className = "site-header";
    target.innerHTML = `
      <div class="nav-shell glass-card">
        <a class="brand-mark" href="${homeHref}">
          <span class="brand-icon">${createBrandLogo()}</span>
          <span class="brand-copy">
            <strong>${translate("meta.appName", language)}</strong>
            <span>${translate("meta.brandCaption", language)}</span>
          </span>
        </a>

        <button
          type="button"
          class="nav-toggle"
          data-nav-toggle
          aria-expanded="false"
          aria-label="${translate("nav.menu", language)}"
          title="${translate("nav.menu", language)}"
        >
          <span></span>
        </button>

        <div class="nav-panel" data-nav-panel>
          <ul class="nav-links">
            ${createNavLink(homeHref, translate("nav.home", language), currentPageKey === "home")}
            ${createNavLink(mohrsHref, translate("nav.mohrsCircle", language), currentPageKey === "mohrsCircle")}
            ${createNavLink(beamHref, translate("nav.beamDeflection", language), currentPageKey === "beamDeflection")}
            ${createNavLink(bendingHref, translate("nav.bendingStress", language), currentPageKey === "bendingStress")}
            ${createNavLink(compositeHref, translate("nav.compositeBeam", language), currentPageKey === "compositeBeam")}
          </ul>

          <div class="nav-actions">
            <button
              type="button"
              class="button button-secondary lang-toggle"
              data-language-toggle
              aria-label="${translate("nav.languageToggleLabel", language)}"
              title="${translate("nav.languageToggleLabel", language)}"
            >
              ${translate("nav.languageToggle", language)}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderFooter(language) {
    const target = document.getElementById("site-footer");

    if (!target) {
      return;
    }

    target.className = "site-footer";
    target.innerHTML = `
      <div class="footer-shell glass-card">
        <div class="footer-meta">
          <span class="footer-kicker">${translate("meta.appName", language)}</span>
          <h3>${translate("meta.brandCaption", language)}</h3>
          <p>${translate("footer.description", language)}</p>
        </div>

        <div class="footer-links-wrap">
          <h3>${translate("footer.quickLinks", language)}</h3>
          <ul class="footer-links">
            <li><a href="${isHomePage() ? "#top" : buildUrl("index.html")}">${translate("nav.home", language)}</a></li>
            <li><a href="${buildUrl("pages/mohrs-circle.html")}">${translate("nav.mohrsCircle", language)}</a></li>
            <li><a href="${buildUrl("pages/beam-deflection.html")}">${translate("nav.beamDeflection", language)}</a></li>
            <li><a href="${buildUrl("pages/bending-stress.html")}">${translate("nav.bendingStress", language)}</a></li>
            <li><a href="${buildUrl("pages/composite-beam.html")}">${translate("nav.compositeBeam", language)}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>${translate("footer.rights", language)}</span>
        <span>${new Date().getFullYear()} | ${translate("meta.appName", language)}</span>
      </div>
    `;
  }

  function applyTranslations(language) {
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      const key = element.getAttribute("data-i18n");
      const value = translate(key, language);

      if (value) {
        element.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
      const key = element.getAttribute("data-i18n-placeholder");
      const value = translate(key, language);

      if (value) {
        element.setAttribute("placeholder", value);
      }
    });
  }

  function updateDocumentTitle(language) {
    const appName = translate("meta.appName", language);
    const currentPageKey = getCurrentPageKey();

    if (currentPageKey === "home") {
      document.title = appName;
      return;
    }

    const pageTitle = translate(`pageTitles.${currentPageKey}`, language);
    document.title = `${pageTitle} | ${appName}`;
  }

  function syncMenuState() {
    const navToggle = document.querySelector("[data-nav-toggle]");

    if (navToggle) {
      navToggle.setAttribute("aria-expanded", document.body.classList.contains("menu-open") ? "true" : "false");
    }
  }

  function wireInteractiveControls(language) {
    const navToggle = document.querySelector("[data-nav-toggle]");

    if (navToggle) {
      navToggle.addEventListener("click", function () {
        document.body.classList.toggle("menu-open");
        syncMenuState();
      });
    }

    document.querySelectorAll("[data-nav-link]").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        syncMenuState();
      });
    });

    document.querySelectorAll("[data-language-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        syncMenuState();
        applyLanguage(language === "en" ? "ar" : "en");
      });
    });

    syncMenuState();
  }

  function emitLanguageChange(language) {
    document.dispatchEvent(new CustomEvent(eventName, {
      detail: { language: language }
    }));
  }

  function applyLanguage(language) {
    const meta = translations[language].meta;

    document.documentElement.lang = meta.languageCode;
    document.documentElement.dir = meta.dir;
    document.body.classList.toggle("lang-ar", language === "ar");
    document.body.classList.toggle("lang-en", language === "en");
    document.body.classList.remove("menu-open");

    renderNavbar(language);
    renderFooter(language);
    applyTranslations(language);
    updateDocumentTitle(language);
    wireInteractiveControls(language);
    setStoredLanguage(language);

    window.StrengthSolverApp.currentLanguage = language;
    emitLanguageChange(language);
  }

  window.StrengthSolverApp = {
    currentLanguage: getLanguage(),
    eventName: eventName,
    getLanguage: function () {
      return getLanguage();
    },
    buildUrl: function (path) {
      return buildUrl(path);
    },
    t: function (key, language) {
      return translate(key, language);
    },
    applyLanguage: function (language) {
      applyLanguage(language);
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (!translations.en || !translations.ar) {
      return;
    }

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && document.body.classList.contains("menu-open")) {
        document.body.classList.remove("menu-open");
        syncMenuState();
      }
    });

    applyLanguage(getLanguage());
  });
})();
