(function () {
  "use strict";

  const i18nStore = window.StrengthSolverI18n;
  const translations = i18nStore ? i18nStore.translations : {};
  const storageKey = "som-language";
  const languageChangeEventName = "strengthsolver:languagechange";

  const modules = {
    stress: { slug: "stress", path: "pages/stress.html", group: "core", type: "calculator", formula: "sigma = P / A", ready: true },
    strain: { slug: "strain", path: "pages/strain.html", group: "core", type: "calculator", formula: "epsilon = deltaL / L", ready: true },
    hookesLaw: { slug: "hookes-law", path: "pages/hookes-law.html", group: "core", type: "calculator", formula: "sigma = E epsilon", ready: true },
    axialDeformation: {
      slug: "axial-deformation",
      path: "pages/axial-deformation.html",
      group: "core",
      type: "calculator",
      formula: "deltaL = (P L) / (A E)",
      ready: true
    },
    shearStress: { slug: "shear-stress", path: "pages/shear-stress.html", group: "core", type: "calculator", formula: "tau = V / A", ready: true },
    torsion: { slug: "torsion", path: "pages/torsion.html", group: "core", type: "calculator", formula: "tau = (T r) / J", ready: true },
    bending: { slug: "bending-stress", path: "pages/bending-stress.html", group: "core", type: "calculator", formula: "sigma = (M y) / I", ready: true },
    thermalStress: {
      slug: "thermal-stress",
      path: "pages/thermal-stress.html",
      group: "core",
      type: "calculator",
      formula: "sigma = E alpha deltaT",
      ready: true
    },
    beamReactions: {
      slug: "beam-reactions",
      path: "pages/beam-reactions.html",
      group: "visual",
      type: "visualizer",
      formula: "RA = RB = P / 2",
      ready: false
    },
    mohrsCircle: {
      slug: "mohrs-circle",
      path: "pages/mohrs-circle.html",
      group: "visual",
      type: "visualizer",
      formula: "sigma_avg = (sigma_x + sigma_y) / 2",
      ready: true
    },
    fbd: { slug: "fbd", path: "pages/fbd.html", group: "visual", type: "visualizer", formula: "sum Fx = 0, sum Fy = 0", ready: true },
    beamDiagrams: {
      slug: "beam-diagrams",
      path: "pages/beam-diagrams.html",
      group: "visual",
      type: "visualizer",
      formula: "V(x), M(x)",
      ready: true
    },
    unitConverter: {
      slug: "unit-converter",
      path: "pages/unit-converter.html",
      group: "tools",
      type: "utility",
      formula: "value x (from / to)",
      ready: true
    },
    aiInput: {
      slug: "ai-input",
      path: "pages/ai-input.html",
      group: "tools",
      type: "utility",
      formula: "Prompt -> Structured Solution",
      ready: true
    },
    questionBank: {
      slug: "question-bank",
      path: "pages/question-bank.html",
      group: "tools",
      type: "practice",
      formula: "Topic + Difficulty",
      ready: true
    },
    quiz: { slug: "quiz", path: "pages/quiz.html", group: "tools", type: "practice", formula: "Score / Total", ready: true },
    pdfExport: {
      slug: "pdf-export",
      path: "pages/pdf-export.html",
      group: "tools",
      type: "utility",
      formula: "Visible Result to PDF",
      ready: true
    }
  };

  const topicGroups = {
    core: ["stress", "strain", "hookesLaw", "axialDeformation", "shearStress", "torsion", "bending", "thermalStress"],
    visual: ["beamReactions", "mohrsCircle", "fbd", "beamDiagrams"],
    tools: ["aiInput", "unitConverter", "questionBank", "quiz", "pdfExport"]
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
      /* Ignore storage failures. */
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

  function isHomePage() {
    return getCurrentFileName() === "index.html";
  }

  function getCurrentModuleKey() {
    return findModuleKeyBySlug(getCurrentFileName().replace(".html", ""));
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

      return null;
    }, source);
  }

  function translate(key, language) {
    const activeLanguage = language || getLanguage();
    const value = getValueByPath(translations[activeLanguage], key);
    return value == null ? "" : value;
  }

  function findModuleKeyBySlug(slug) {
    return Object.keys(modules).find(function (moduleKey) {
      return modules[moduleKey].slug === slug;
    });
  }

  function createNavLink(href, label, isActive, useAriaCurrent) {
    const activeClass = isActive ? "is-active" : "";
    const currentAttribute = useAriaCurrent ? ' aria-current="page"' : "";

    return `
      <li>
        <a href="${href}" class="${activeClass}" data-nav-link${currentAttribute}>${label}</a>
      </li>
    `;
  }

  function createActionLink(href, label, className, isActive) {
    const activeClass = isActive ? " is-active" : "";
    const currentAttribute = isActive ? ' aria-current="page"' : "";

    return `<a class="${className}${activeClass}" href="${href}"${currentAttribute}>${label}</a>`;
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

  function renderNavbar(language) {
    const navbarTarget = document.getElementById("site-navbar");

    if (!navbarTarget) {
      return;
    }

    const homeHref = isHomePage() ? "#top" : buildUrl("index.html");
    const topicsHref = isHomePage() ? "#topics" : buildUrl("index.html#topics");
    const toolsHref = isHomePage() ? "#platform-tools" : buildUrl("index.html#platform-tools");
    const aiInputHref = buildUrl("pages/ai-input.html");
    const roadmapHref = isHomePage() ? "#roadmap" : buildUrl("index.html#roadmap");
    const currentModuleKey = getCurrentModuleKey();
    const currentModule = currentModuleKey ? modules[currentModuleKey] : null;
    const isTopicsActive = !!currentModule && (currentModule.group === "core" || currentModule.group === "visual");
    const isToolsActive = !!currentModule && currentModule.group === "tools";
    const isQuizActive = currentModuleKey === "quiz";
    const isAiInputActive = currentModuleKey === "aiInput";
    const isFeaturedActive = currentModuleKey === "stress";

    navbarTarget.className = "site-header fade-in-up";
    navbarTarget.innerHTML = `
      <div class="nav-shell">
        <a class="brand-mark" href="${homeHref}">
          <span class="brand-icon">${createBrandLogo()}</span>
          <span class="brand-copy">
            <strong>${translate("meta.appName", language)}</strong>
            <span>${translate("nav.brandCaption", language)}</span>
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
            ${createNavLink(homeHref, translate("nav.home", language), isHomePage(), isHomePage())}
            ${createNavLink(topicsHref, translate("nav.topics", language), isTopicsActive, false)}
            ${createNavLink(toolsHref, translate("nav.tools", language), isToolsActive, false)}
            ${createNavLink(aiInputHref, translate("topics.aiInput.title", language), isAiInputActive, isAiInputActive)}
            ${createNavLink(roadmapHref, translate("nav.roadmap", language), false, false)}
          </ul>

          <div class="nav-actions">
            ${createActionLink(buildUrl("pages/quiz.html"), translate("nav.quiz", language), "button button-secondary", isQuizActive)}
            ${createActionLink(buildUrl("pages/stress.html"), translate("nav.featured", language), "button button-primary", isFeaturedActive)}
            <button
              type="button"
              class="button lang-toggle"
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

  function syncMenuState() {
    const navToggle = document.querySelector("[data-nav-toggle]");

    if (navToggle) {
      navToggle.setAttribute("aria-expanded", document.body.classList.contains("menu-open") ? "true" : "false");
    }
  }

  function renderFooter(language) {
    const footerTarget = document.getElementById("site-footer");

    if (!footerTarget) {
      return;
    }

    footerTarget.className = "site-footer";
    footerTarget.innerHTML = `
      <div class="footer-shell glass-card">
        <div class="footer-column footer-brand">
          <span class="section-kicker">${translate("meta.appName", language)}</span>
          <h3>${translate("nav.brandCaption", language)}</h3>
          <p>${translate("footer.description", language)}</p>
        </div>

        <div class="footer-column">
          <h3>${translate("footer.quickLinks", language)}</h3>
          <ul class="footer-links">
            <li><a href="${isHomePage() ? "#top" : buildUrl("index.html")}">${translate("nav.home", language)}</a></li>
            <li><a href="${isHomePage() ? "#topics" : buildUrl("index.html#topics")}">${translate("nav.topics", language)}</a></li>
            <li><a href="${buildUrl("pages/ai-input.html")}">${translate("topics.aiInput.title", language)}</a></li>
            <li><a href="${buildUrl("pages/question-bank.html")}">${translate("topics.questionBank.title", language)}</a></li>
            <li><a href="${buildUrl("pages/unit-converter.html")}">${translate("topics.unitConverter.title", language)}</a></li>
          </ul>
        </div>

        <div class="footer-column">
          <h3>${translate("footer.starterPages", language)}</h3>
          <ul class="footer-links">
            <li><a href="${buildUrl("pages/stress.html")}">${translate("topics.stress.title", language)}</a></li>
            <li><a href="${buildUrl("pages/mohrs-circle.html")}">${translate("topics.mohrsCircle.title", language)}</a></li>
            <li><a href="${buildUrl("pages/fbd.html")}">${translate("topics.fbd.title", language)}</a></li>
            <li><a href="${buildUrl("pages/beam-diagrams.html")}">${translate("topics.beamDiagrams.title", language)}</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>${translate("common.footerNote", language)}</span>
        <span>${new Date().getFullYear()} | ${translate("footer.rights", language)}</span>
      </div>
    `;
  }

  function renderTopicCards(language) {
    const containers = document.querySelectorAll("[data-topic-group]");

    containers.forEach(function (container) {
      const groupName = container.getAttribute("data-topic-group");
      const entries = topicGroups[groupName] || [];

      container.innerHTML = entries
        .map(function (moduleKey) {
          const moduleConfig = modules[moduleKey];
          const statusKey = moduleConfig.ready ? "common.available" : "common.comingSoon";

          return `
            <a class="topic-card" href="${buildUrl(moduleConfig.path)}">
              <div class="topic-card__meta">
                <span class="topic-card__tag">${translate(`moduleTypes.${moduleConfig.type}`, language)}</span>
                <span class="topic-card__status">${translate(statusKey, language)}</span>
              </div>
              <div class="topic-card__body">
                <h3>${translate(`topics.${moduleKey}.title`, language)}</h3>
                <p>${translate(`topics.${moduleKey}.description`, language)}</p>
              </div>
              <div class="topic-card__formula">${moduleConfig.formula}</div>
            </a>
          `;
        })
        .join("");
    });
  }

  function renderModulePage(language) {
    const titleTarget = document.querySelector("[data-module-title]");
    const descriptionTarget = document.querySelector("[data-module-description]");
    const badgeTarget = document.querySelector("[data-module-badge]");
    const formulaTarget = document.querySelector("[data-module-formula]");
    const readyList = document.querySelector("[data-placeholder-ready-list]");

    if (!titleTarget || !descriptionTarget || !badgeTarget || !formulaTarget) {
      return;
    }

    const moduleKey = getCurrentModuleKey();

    if (!moduleKey) {
      return;
    }

    titleTarget.textContent = translate(`topics.${moduleKey}.title`, language);
    descriptionTarget.textContent = translate(`topics.${moduleKey}.description`, language);
    badgeTarget.textContent = translate(`moduleTypes.${modules[moduleKey].type}`, language);
    formulaTarget.textContent = modules[moduleKey].formula;

    if (readyList) {
      const readyItems = getValueByPath(translations[language], "placeholder.readyItems") || [];
      readyList.innerHTML = readyItems.map(function (item) {
        return `<li>${item}</li>`;
      }).join("");
    }
  }

  function updateDocumentTitle(language) {
    const appName = translate("meta.appName", language);

    if (isHomePage()) {
      document.title = appName;
      return;
    }

    const moduleKey = getCurrentModuleKey();
    const pageTitle = moduleKey ? translate(`topics.${moduleKey}.title`, language) : appName;
    document.title = `${pageTitle} | ${appName}`;
  }

  function applyTranslations(language) {
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      const key = element.getAttribute("data-i18n");
      const translatedValue = translate(key, language);

      if (translatedValue) {
        element.textContent = translatedValue;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
      const key = element.getAttribute("data-i18n-placeholder");
      const translatedValue = translate(key, language);

      if (translatedValue) {
        element.setAttribute("placeholder", translatedValue);
      }
    });

    document.querySelectorAll("[data-i18n-title]").forEach(function (element) {
      const key = element.getAttribute("data-i18n-title");
      const translatedValue = translate(key, language);

      if (translatedValue) {
        element.setAttribute("title", translatedValue);
      }
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (element) {
      const key = element.getAttribute("data-i18n-aria-label");
      const translatedValue = translate(key, language);

      if (translatedValue) {
        element.setAttribute("aria-label", translatedValue);
      }
    });
  }

  function emitLanguageChange(language) {
    document.dispatchEvent(new CustomEvent(languageChangeEventName, {
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
    renderTopicCards(language);
    renderModulePage(language);
    applyTranslations(language);
    updateDocumentTitle(language);
    wireInteractiveControls(language);

    window.StrengthSolverApp.currentLanguage = language;
    setStoredLanguage(language);
    emitLanguageChange(language);
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
        const nextLanguage = language === "en" ? "ar" : "en";
        document.body.classList.remove("menu-open");
        syncMenuState();
        applyLanguage(nextLanguage);
      });
    });

    syncMenuState();
  }

  window.StrengthSolverApp = {
    currentLanguage: getLanguage(),
    eventName: languageChangeEventName,
    getLanguage: function () {
      return getLanguage();
    },
    getBasePath: function () {
      return getBasePath();
    },
    buildUrl: function (path) {
      return buildUrl(path);
    },
    t: function (key, language) {
      return translate(key, language);
    },
    getValueByPath: function (source, path) {
      return getValueByPath(source, path);
    },
    applyLanguage: function (language) {
      applyLanguage(language);
    },
    getModules: function () {
      return modules;
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (!translations.en || !translations.ar) {
      return;
    }

    if (!isHomePage()) {
      document.body.classList.add("page-wrap");
    }

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860 && document.body.classList.contains("menu-open")) {
        document.body.classList.remove("menu-open");
        syncMenuState();
      }
    });

   applyLanguage(getLanguage());
  });
})();
