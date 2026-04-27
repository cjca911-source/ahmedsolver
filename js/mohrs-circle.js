(function () {
  "use strict";

  const app = window.StrengthSolverApp;
  const utils = window.AhmedSolverEngineering;
  const root = document.getElementById("mohrs-circle-root");

  if (!app || !utils || !root) {
    return;
  }

  const copy = {
    en: {
      kicker: "Stress Transformation Tool",
      title: "Mohr's Circle Analyzer",
      intro:
        "Enter the in-plane stress components, compute the transformed stress values, and inspect the full circle with labeled engineering points.",
      summaryTitle: "What this page solves",
      summaryPoints: [
        "Average stress, principal stresses, and maximum in-plane shear stress.",
        "Principal angle from the original x-face to the principal plane.",
        "A responsive SVG diagram with the original stress points, center, radius, and key intercepts."
      ],
      equationChips: [
        "σavg = (σx + σy) / 2",
        "R = sqrt(((σx - σy)/2)^2 + τxy^2)",
        "σ1 = σavg + R",
        "σ2 = σavg - R"
      ],
      inputTitle: "Stress inputs",
      inputDescription:
        "Use one consistent unit for σx, σy, and τxy. Positive normal stress is tensile and positive shear follows the sign you enter.",
      unitLabel: "Stress unit",
      solve: "Solve Mohr's Circle",
      reset: "Reset",
      ready: "Enter σx, σy, and τxy to generate the circle.",
      missing: "Please enter values for σx, σy, and τxy.",
      invalid: "Invalid number format in one or more stress inputs.",
      success: "Mohr's Circle solved successfully.",
      drawingTitle: "Mohr's Circle drawing",
      drawingDescription:
        "The SVG drawing updates after solving and marks the original state, principal stresses, and maximum shear points.",
      resultsTitle: "Computed results",
      stepsTitle: "Step-by-step solution",
      drawingPlaceholder: "The circle will appear here after you solve the stress state.",
      drawingCaption:
        "Points A and B represent the original orthogonal stress faces. The circle center and radius define the principal and maximum shear values.",
      fields: {
        sigmaX: {
          badge: "σx",
          title: "Normal stress on the x-face",
          hint: "Positive in tension."
        },
        sigmaY: {
          badge: "σy",
          title: "Normal stress on the y-face",
          hint: "Use the same unit as σx."
        },
        tauXY: {
          badge: "τxy",
          title: "In-plane shear stress",
          hint: "Sign affects the principal angle."
        }
      },
      metrics: {
        sigmaAvg: "Average stress σavg",
        radius: "Circle radius R",
        sigma1: "Principal stress σ1",
        sigma2: "Principal stress σ2",
        tauMax: "Maximum shear τmax",
        theta: "Principal angle θp"
      },
      stepLabels: {
        average: "1. Average stress",
        radius: "2. Circle radius",
        principal: "3. Principal stresses",
        shear: "4. Maximum in-plane shear",
        angle: "5. Principal angle"
      },
      drawingLabels: {
        sigmaAxis: "σ axis",
        tauAxis: "τ axis",
        center: "C",
        radius: "R",
        sigma1: "σ1",
        sigma2: "σ2",
        topShear: "τmax",
        bottomShear: "-τmax",
        pointA: "A",
        pointB: "B"
      }
    },
    ar: {
      kicker: "أداة تحويلات الإجهاد",
      title: "محلل دائرة مور",
      intro:
        "أدخل مركبات الإجهاد المستوي، واحسب قيم التحويل، واعرض الدائرة كاملة مع النقاط الهندسية الأساسية.",
      summaryTitle: "ما الذي تحله هذه الصفحة",
      summaryPoints: [
        "الإجهاد المتوسط والإجهادات الرئيسية والقص الأعظمي داخل المستوى.",
        "الزاوية الرئيسية من وجه x الأصلي إلى المستوى الرئيسي.",
        "رسم SVG متجاوب يوضح الحالة الأصلية ومركز الدائرة ونصف القطر ونقاط التقاطع المهمة."
      ],
      equationChips: [
        "σavg = (σx + σy) / 2",
        "R = sqrt(((σx - σy)/2)^2 + τxy^2)",
        "σ1 = σavg + R",
        "σ2 = σavg - R"
      ],
      inputTitle: "مدخلات الإجهاد",
      inputDescription:
        "استخدم وحدة واحدة متسقة لكل من σx و σy و τxy. يؤخذ الإجهاد العمودي الموجب على أنه شد، ويُستخدم اتجاه القص كما تدخله.",
      unitLabel: "وحدة الإجهاد",
      solve: "احسب دائرة مور",
      reset: "إعادة ضبط",
      ready: "أدخل σx و σy و τxy لرسم الدائرة.",
      missing: "يرجى إدخال قيم σx و σy و τxy.",
      invalid: "تنسيق الرقم غير صالح في واحد أو أكثر من مدخلات الإجهاد.",
      success: "تم حل دائرة مور بنجاح.",
      drawingTitle: "رسم دائرة مور",
      drawingDescription:
        "يتم تحديث الرسم بعد الحل ويعرض الحالة الأصلية والإجهادات الرئيسية ونقاط القص الأعظمي.",
      resultsTitle: "النتائج المحسوبة",
      stepsTitle: "الحل خطوة بخطوة",
      drawingPlaceholder: "سيظهر الرسم هنا بعد حل حالة الإجهاد.",
      drawingCaption:
        "تمثل النقطتان A و B وجهي الإجهاد المتعامدين في الحالة الأصلية. يحدد مركز الدائرة ونصف قطرها الإجهادات الرئيسية وقيم القص العظمى.",
      fields: {
        sigmaX: {
          badge: "σx",
          title: "الإجهاد العمودي على وجه x",
          hint: "الموجب في حالة الشد."
        },
        sigmaY: {
          badge: "σy",
          title: "الإجهاد العمودي على وجه y",
          hint: "استخدم نفس وحدة σx."
        },
        tauXY: {
          badge: "τxy",
          title: "إجهاد القص داخل المستوى",
          hint: "إشارة القص تؤثر في الزاوية الرئيسية."
        }
      },
      metrics: {
        sigmaAvg: "الإجهاد المتوسط σavg",
        radius: "نصف قطر الدائرة R",
        sigma1: "الإجهاد الرئيسي σ1",
        sigma2: "الإجهاد الرئيسي σ2",
        tauMax: "القص الأعظمي τmax",
        theta: "الزاوية الرئيسية θp"
      },
      stepLabels: {
        average: "1. الإجهاد المتوسط",
        radius: "2. نصف قطر الدائرة",
        principal: "3. الإجهادات الرئيسية",
        shear: "4. القص الأعظمي داخل المستوى",
        angle: "5. الزاوية الرئيسية"
      },
      drawingLabels: {
        sigmaAxis: "محور σ",
        tauAxis: "محور τ",
        center: "C",
        radius: "R",
        sigma1: "σ1",
        sigma2: "σ2",
        topShear: "τmax",
        bottomShear: "-τmax",
        pointA: "A",
        pointB: "B"
      }
    }
  };

  const state = {
    sigmaX: "",
    sigmaY: "",
    tauXY: "",
    unit: "MPa",
    result: null,
    status: {
      state: "neutral",
      message: ""
    }
  };

  function currentCopy() {
    return copy[app.getLanguage()] || copy.en;
  }

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function format(value, decimals) {
    return utils.formatNumber(value, app.getLanguage(), decimals);
  }

  function formatStress(value, unit, decimals) {
    return utils.formatWithUnit("stress", value, unit, app.getLanguage(), decimals);
  }

  function createMetricCard(title, value) {
    return `
      <article class="metric-card">
        <h3>${esc(title)}</h3>
        <span class="metric-value">${esc(value)}</span>
      </article>
    `;
  }

  function createFieldCard(fieldKey, fieldCopy) {
    return `
      <label class="input-card" for="${fieldKey}">
        <span class="input-card__badge">${fieldCopy.badge}</span>
        <span class="input-card__title">${esc(fieldCopy.title)}</span>
        <span class="input-card__hint">${esc(fieldCopy.hint)}</span>
        <input
          id="${fieldKey}"
          name="${fieldKey}"
          class="input-control"
          type="text"
          inputmode="decimal"
          value="${esc(state[fieldKey])}"
          placeholder="${fieldCopy.badge}"
        >
      </label>
    `;
  }

  function solve() {
    const texts = currentCopy();
    const sigmaX = utils.parseNumber(state.sigmaX);
    const sigmaY = utils.parseNumber(state.sigmaY);
    const tauXY = utils.parseNumber(state.tauXY);
    const parsed = [sigmaX, sigmaY, tauXY];

    if (parsed.some(function (item) { return item.empty; })) {
      state.result = null;
      state.status = { state: "error", message: texts.missing };
      return;
    }

    if (parsed.some(function (item) { return !item.ok; })) {
      state.result = null;
      state.status = { state: "error", message: texts.invalid };
      return;
    }

    const sigmaXBase = utils.toBase("stress", sigmaX.value, state.unit);
    const sigmaYBase = utils.toBase("stress", sigmaY.value, state.unit);
    const tauXYBase = utils.toBase("stress", tauXY.value, state.unit);
    const sigmaAvgBase = (sigmaXBase + sigmaYBase) / 2;
    const radiusBase = Math.sqrt(Math.pow((sigmaXBase - sigmaYBase) / 2, 2) + Math.pow(tauXYBase, 2));
    const sigma1Base = sigmaAvgBase + radiusBase;
    const sigma2Base = sigmaAvgBase - radiusBase;
    const thetaDegrees = 0.5 * Math.atan2(2 * tauXYBase, sigmaXBase - sigmaYBase) * (180 / Math.PI);

    state.result = {
      sigmaXBase: sigmaXBase,
      sigmaYBase: sigmaYBase,
      tauXYBase: tauXYBase,
      sigmaAvgBase: sigmaAvgBase,
      radiusBase: radiusBase,
      sigma1Base: sigma1Base,
      sigma2Base: sigma2Base,
      thetaDegrees: thetaDegrees
    };
    state.status = { state: "success", message: texts.success };
  }

  function reset() {
    state.sigmaX = "";
    state.sigmaY = "";
    state.tauXY = "";
    state.unit = "MPa";
    state.result = null;
    state.status = {
      state: "neutral",
      message: currentCopy().ready
    };
  }

  function createSteps() {
    const texts = currentCopy();

    if (!state.result) {
      return `
        <article class="placeholder-card">
          <p>${esc(texts.drawingPlaceholder)}</p>
        </article>
      `;
    }

    const sigmaXDisplay = utils.fromBase("stress", state.result.sigmaXBase, state.unit);
    const sigmaYDisplay = utils.fromBase("stress", state.result.sigmaYBase, state.unit);
    const tauXYDisplay = utils.fromBase("stress", state.result.tauXYBase, state.unit);
    const sigmaAvgDisplay = utils.fromBase("stress", state.result.sigmaAvgBase, state.unit);
    const radiusDisplay = utils.fromBase("stress", state.result.radiusBase, state.unit);
    const sigma1Display = utils.fromBase("stress", state.result.sigma1Base, state.unit);
    const sigma2Display = utils.fromBase("stress", state.result.sigma2Base, state.unit);

    const steps = [
      {
        title: texts.stepLabels.average,
        equation:
          `σavg = (σx + σy) / 2\n` +
          `σavg = (${format(sigmaXDisplay)} + ${format(sigmaYDisplay)}) / 2 = ${formatStress(sigmaAvgDisplay, state.unit, 4)}`
      },
      {
        title: texts.stepLabels.radius,
        equation:
          `R = sqrt(((σx - σy) / 2)^2 + τxy^2)\n` +
          `R = sqrt(((${format(sigmaXDisplay)} - ${format(sigmaYDisplay)}) / 2)^2 + (${format(tauXYDisplay)})^2) = ${formatStress(radiusDisplay, state.unit, 4)}`
      },
      {
        title: texts.stepLabels.principal,
        equation:
          `σ1 = σavg + R = ${format(sigmaAvgDisplay)} + ${format(radiusDisplay)} = ${formatStress(sigma1Display, state.unit, 4)}\n` +
          `σ2 = σavg - R = ${format(sigmaAvgDisplay)} - ${format(radiusDisplay)} = ${formatStress(sigma2Display, state.unit, 4)}`
      },
      {
        title: texts.stepLabels.shear,
        equation: `τmax = R = ${formatStress(radiusDisplay, state.unit, 4)}`
      },
      {
        title: texts.stepLabels.angle,
        equation:
          `θp = 0.5 * atan2(2τxy, σx - σy)\n` +
          `θp = 0.5 * atan2(2 × ${format(tauXYDisplay)}, ${format(sigmaXDisplay)} - ${format(sigmaYDisplay)}) = ${format(state.result.thetaDegrees, 4)} deg`
      }
    ];

    return steps.map(function (step) {
      return `
        <article class="step-card">
          <h4>${esc(step.title)}</h4>
          <span class="equation-line">${esc(step.equation)}</span>
        </article>
      `;
    }).join("");
  }

  function createDrawing() {
    const texts = currentCopy();

    if (!state.result) {
      return `
        <div class="placeholder-card">
          <p>${esc(texts.drawingPlaceholder)}</p>
        </div>
      `;
    }

    const sigmaX = utils.fromBase("stress", state.result.sigmaXBase, state.unit);
    const sigmaY = utils.fromBase("stress", state.result.sigmaYBase, state.unit);
    const tauXY = utils.fromBase("stress", state.result.tauXYBase, state.unit);
    const sigmaAvg = utils.fromBase("stress", state.result.sigmaAvgBase, state.unit);
    const radius = utils.fromBase("stress", state.result.radiusBase, state.unit);
    const sigma1 = utils.fromBase("stress", state.result.sigma1Base, state.unit);
    const sigma2 = utils.fromBase("stress", state.result.sigma2Base, state.unit);
    const maxX = Math.max(Math.abs(sigma1), Math.abs(sigma2), Math.abs(sigmaX), Math.abs(sigmaY), 1);
    const maxY = Math.max(Math.abs(radius), Math.abs(tauXY), 1);
    const margin = 48;
    const width = 720;
    const height = 420;
    const plotWidth = width - margin * 2;
    const plotHeight = height - margin * 2;
    const spanX = maxX * 2.4;
    const spanY = maxY * 2.4;
    const scale = Math.min(plotWidth / spanX, plotHeight / spanY);
    const originX = width / 2;
    const originY = height / 2;

    function x(value) {
      return originX + value * scale;
    }

    function y(value) {
      return originY - value * scale;
    }

    const centerX = x(sigmaAvg);
    const radiusPx = radius * scale;
    const pointA = { x: x(sigmaX), y: y(tauXY) };
    const pointB = { x: x(sigmaY), y: y(-tauXY) };
    const principal1 = { x: x(sigma1), y: y(0) };
    const principal2 = { x: x(sigma2), y: y(0) };
    const shearTop = { x: x(sigmaAvg), y: y(radius) };
    const shearBottom = { x: x(sigmaAvg), y: y(-radius) };

    function point(cx, cy, fill) {
      return `<circle cx="${cx}" cy="${cy}" r="5" fill="${fill}"></circle>`;
    }

    function label(px, py, textLabel, dx, dy) {
      return `<text x="${px + dx}" y="${py + dy}" fill="#f5f5f5" font-size="14" font-family="Poppins, sans-serif">${esc(textLabel)}</text>`;
    }

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(texts.drawingTitle)}">
        <defs>
          <marker id="mohrs-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0 0L10 5L0 10Z" fill="#ff6d6d"></path>
          </marker>
        </defs>

        <line x1="${margin / 2}" y1="${originY}" x2="${width - margin / 2}" y2="${originY}" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" marker-end="url(#mohrs-arrow)"></line>
        <line x1="${originX}" y1="${height - margin / 2}" x2="${originX}" y2="${margin / 2}" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" marker-end="url(#mohrs-arrow)"></line>
        <text x="${width - margin}" y="${originY - 10}" fill="#ff9d9d" font-size="14">${esc(texts.drawingLabels.sigmaAxis)}</text>
        <text x="${originX + 12}" y="${margin - 8}" fill="#ff9d9d" font-size="14">${esc(texts.drawingLabels.tauAxis)}</text>

        <circle cx="${centerX}" cy="${originY}" r="${radiusPx}" fill="none" stroke="#ff5a5a" stroke-width="3"></circle>
        <line x1="${centerX}" y1="${originY}" x2="${pointA.x}" y2="${pointA.y}" stroke="#ff9d9d" stroke-width="2.5"></line>
        <line x1="${pointA.x}" y1="${pointA.y}" x2="${pointB.x}" y2="${pointB.y}" stroke="rgba(255,255,255,0.38)" stroke-dasharray="8 6" stroke-width="1.5"></line>

        ${point(centerX, originY, "#ffffff")}
        ${point(pointA.x, pointA.y, "#ff6d6d")}
        ${point(pointB.x, pointB.y, "#ff6d6d")}
        ${point(principal1.x, principal1.y, "#ffd166")}
        ${point(principal2.x, principal2.y, "#ffd166")}
        ${point(shearTop.x, shearTop.y, "#8cffc1")}
        ${point(shearBottom.x, shearBottom.y, "#8cffc1")}

        ${label(centerX, originY, texts.drawingLabels.center, 10, -10)}
        ${label(pointA.x, pointA.y, texts.drawingLabels.pointA, 12, -10)}
        ${label(pointB.x, pointB.y, texts.drawingLabels.pointB, 12, 20)}
        ${label(principal1.x, principal1.y, texts.drawingLabels.sigma1, 8, -12)}
        ${label(principal2.x, principal2.y, texts.drawingLabels.sigma2, 8, -12)}
        ${label(shearTop.x, shearTop.y, texts.drawingLabels.topShear, 12, -10)}
        ${label(shearBottom.x, shearBottom.y, texts.drawingLabels.bottomShear, 12, 22)}
        ${label((centerX + pointA.x) / 2, (originY + pointA.y) / 2, texts.drawingLabels.radius, 10, -10)}
      </svg>
    `;
  }

  function render() {
    const texts = currentCopy();
    const statusMessage = state.status.message || texts.ready;
    const statusState = state.status.state === "neutral" ? "success" : state.status.state;

    root.innerHTML = `
      <section class="tool-page">
        <section class="page-hero glass-card">
          <div class="page-hero__grid">
            <div>
              <span class="page-kicker">${esc(texts.kicker)}</span>
              <h1 class="page-title">${esc(texts.title)}</h1>
              <p class="page-intro">${esc(texts.intro)}</p>
              <div class="equation-row">
                ${texts.equationChips.map(function (item) {
                  return `<span class="equation-chip">${esc(item)}</span>`;
                }).join("")}
              </div>
            </div>

            <aside class="page-summary-card">
              <h2>${esc(texts.summaryTitle)}</h2>
              <ul class="summary-list">
                ${texts.summaryPoints.map(function (item) {
                  return `<li>${esc(item)}</li>`;
                }).join("")}
              </ul>
            </aside>
          </div>
        </section>

        <div class="solver-layout">
          <form id="mohrs-form" class="solver-panel glass-card">
            <div class="panel-header">
              <h2>${esc(texts.inputTitle)}</h2>
              <p>${esc(texts.inputDescription)}</p>
            </div>

            <div class="field-grid field-grid--three">
              ${createFieldCard("sigmaX", texts.fields.sigmaX)}
              ${createFieldCard("sigmaY", texts.fields.sigmaY)}
              ${createFieldCard("tauXY", texts.fields.tauXY)}
            </div>

            <div class="subsection">
              <div class="field">
                <label for="unit">${esc(texts.unitLabel)}</label>
                <select id="unit" name="unit" class="select-control">
                  ${utils.optionsFor("stress").map(function (unitKey) {
                    return `<option value="${unitKey}" ${state.unit === unitKey ? "selected" : ""}>${unitKey}</option>`;
                  }).join("")}
                </select>
              </div>
            </div>

            <div class="action-row">
              <button class="button button-primary" type="submit">${esc(texts.solve)}</button>
              <button class="button button-secondary" type="button" data-reset>${esc(texts.reset)}</button>
            </div>

            <div class="status-banner is-visible" data-state="${statusState}">
              ${esc(statusMessage)}
            </div>
          </form>

          <section class="solver-panel glass-card">
            <div class="panel-header">
              <h2>${esc(texts.drawingTitle)}</h2>
              <p>${esc(texts.drawingDescription)}</p>
            </div>
            <div class="drawing-shell">
              ${createDrawing()}
            </div>
            <p class="drawing-caption">${esc(texts.drawingCaption)}</p>
          </section>
        </div>

        <div class="result-layout">
          <section class="result-panel glass-card">
            <div class="panel-header">
              <h2>${esc(texts.resultsTitle)}</h2>
            </div>
            <div class="result-grid">
              ${state.result ? [
                createMetricCard(texts.metrics.sigmaAvg, formatStress(utils.fromBase("stress", state.result.sigmaAvgBase, state.unit), state.unit, 4)),
                createMetricCard(texts.metrics.radius, formatStress(utils.fromBase("stress", state.result.radiusBase, state.unit), state.unit, 4)),
                createMetricCard(texts.metrics.sigma1, formatStress(utils.fromBase("stress", state.result.sigma1Base, state.unit), state.unit, 4)),
                createMetricCard(texts.metrics.sigma2, formatStress(utils.fromBase("stress", state.result.sigma2Base, state.unit), state.unit, 4)),
                createMetricCard(texts.metrics.tauMax, formatStress(utils.fromBase("stress", state.result.radiusBase, state.unit), state.unit, 4)),
                createMetricCard(texts.metrics.theta, `${format(state.result.thetaDegrees, 4)} deg`)
              ].join("") : `
                <article class="placeholder-card" style="grid-column: 1 / -1;">
                  <p>${esc(texts.ready)}</p>
                </article>
              `}
            </div>
          </section>

          <section class="result-panel glass-card">
            <div class="panel-header">
              <h2>${esc(texts.stepsTitle)}</h2>
            </div>
            <div class="steps-grid">
              ${createSteps()}
            </div>
          </section>
        </div>
      </section>
    `;

    const form = root.querySelector("#mohrs-form");
    const resetButton = root.querySelector("[data-reset]");

    form.addEventListener("input", function (event) {
      if (!event.target || !event.target.name) {
        return;
      }

      state[event.target.name] = event.target.value;
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      solve();
      render();
    });

    resetButton.addEventListener("click", function () {
      reset();
      render();
    });
  }

  document.addEventListener(app.eventName, function () {
    render();
  });

  reset();
  render();
})();
