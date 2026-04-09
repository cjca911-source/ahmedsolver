(function () {
  "use strict";

  const app = window.StrengthSolverApp;
  const root = document.getElementById("beam-diagrams-root");
  const exportStorageKey = "ahmedsolver-export-history";
  const state = {
    span: 6,
    loadMagnitude: 20,
    loadPosition: 3,
    loads: [{ id: "L1", label: "P1", magnitude: 20, position: 3 }]
  };

  if (!app || !root) {
    return;
  }

  function pair(en, ar) {
    return { en: en, ar: ar };
  }

  function text(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value[app.getLanguage()] || value.en || value.ar || "";
    }

    return value == null ? "" : String(value);
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character];
    });
  }

  function num(value) {
    return new Intl.NumberFormat(app.getLanguage() === "ar" ? "ar" : "en-US", { maximumFractionDigits: 4 }).format(value);
  }

  function reactions() {
    const totalLoad = state.loads.reduce(function (sum, load) { return sum + load.magnitude; }, 0);
    const momentAboutA = state.loads.reduce(function (sum, load) { return sum + load.magnitude * load.position; }, 0);
    const rb = state.span ? momentAboutA / state.span : 0;
    const ra = totalLoad - rb;
    return { ra: ra, rb: rb, totalLoad: totalLoad };
  }

  function shearSegments(ra, rb) {
    const ordered = state.loads.slice().sort(function (a, b) { return a.position - b.position; });
    const segments = [{ x: 0, value: ra }];
    let current = ra;

    ordered.forEach(function (load) {
      segments.push({ x: load.position, value: current });
      current -= load.magnitude;
      segments.push({ x: load.position, value: current });
    });

    segments.push({ x: state.span, value: current });
    segments.push({ x: state.span, value: current + rb });
    return segments;
  }

  function momentPoints(ra) {
    const ordered = state.loads.slice().sort(function (a, b) { return a.position - b.position; });
    const points = [{ x: 0, value: 0 }];
    let currentMoment = 0;
    let currentShear = ra;
    let previousX = 0;

    ordered.forEach(function (load) {
      currentMoment += currentShear * (load.position - previousX);
      points.push({ x: load.position, value: currentMoment });
      currentShear -= load.magnitude;
      previousX = load.position;
    });

    currentMoment += currentShear * (state.span - previousX);
    points.push({ x: state.span, value: currentMoment });
    return points;
  }

  function beamSvg(ra, rb, shear, moment) {
    const width = 620;
    const beamY = 120;
    const startX = 60;
    const endX = width - 60;
    const scaleX = (endX - startX) / state.span;
    const maxShear = Math.max.apply(null, shear.map(function (item) { return Math.abs(item.value); }).concat([1]));
    const maxMoment = Math.max.apply(null, moment.map(function (item) { return Math.abs(item.value); }).concat([1]));

    function x(position) {
      return startX + position * scaleX;
    }

    function shearY(value) {
      return 260 - (value / maxShear) * 45;
    }

    function momentY(value) {
      return 380 - (value / maxMoment) * 55;
    }

    const loadArrows = state.loads.map(function (load) {
      return `
        <line x1="${x(load.position)}" y1="70" x2="${x(load.position)}" y2="${beamY}" class="diagram-load"></line>
        <polygon points="${x(load.position) - 7},84 ${x(load.position) + 7},84 ${x(load.position)},98" class="diagram-load-head"></polygon>
        <text x="${x(load.position) + 8}" y="72" class="diagram-label">${esc(load.label)} = ${num(load.magnitude)} kN</text>
      `;
    }).join("");

    const shearPath = shear.map(function (point, index) {
      return `${index === 0 ? "M" : "L"} ${x(point.x)} ${shearY(point.value)}`;
    }).join(" ");

    const momentPath = moment.map(function (point, index) {
      return `${index === 0 ? "M" : "L"} ${x(point.x)} ${momentY(point.value)}`;
    }).join(" ");

    return `
      <svg viewBox="0 0 ${width} 430" class="beam-svg" role="img" aria-label="${esc(text(pair("Beam diagrams", "مخططات الجائز")))}">
        <line x1="${startX}" y1="${beamY}" x2="${endX}" y2="${beamY}" class="diagram-beam"></line>
        <polygon points="${startX - 18},150 ${startX + 18},150 ${startX},120" class="diagram-support"></polygon>
        <circle cx="${endX}" cy="145" r="10" class="diagram-support-wheel"></circle>
        <circle cx="${endX + 20}" cy="145" r="10" class="diagram-support-wheel"></circle>
        <line x1="${startX}" y1="175" x2="${endX + 22}" y2="175" class="diagram-ground"></line>
        <line x1="${startX}" y1="175" x2="${startX}" y2="${beamY}" class="diagram-reaction"></line>
        <polygon points="${startX - 7},133 ${startX + 7},133 ${startX},119" class="diagram-reaction-head"></polygon>
        <text x="${startX + 8}" y="135" class="diagram-label">RA = ${num(ra)} kN</text>
        <line x1="${endX}" y1="175" x2="${endX}" y2="${beamY}" class="diagram-reaction"></line>
        <polygon points="${endX - 7},133 ${endX + 7},133 ${endX},119" class="diagram-reaction-head"></polygon>
        <text x="${endX - 86}" y="135" class="diagram-label">RB = ${num(rb)} kN</text>
        ${loadArrows}
        <text x="${startX}" y="230" class="diagram-caption">${esc(text(pair("Shear force diagram", "مخطط القص")))} </text>
        <line x1="${startX}" y1="260" x2="${endX}" y2="260" class="diagram-axis"></line>
        <path d="${shearPath}" class="diagram-plot"></path>
        <text x="${startX}" y="350" class="diagram-caption">${esc(text(pair("Bending moment diagram", "مخطط العزم")))} </text>
        <line x1="${startX}" y1="380" x2="${endX}" y2="380" class="diagram-axis"></line>
        <path d="${momentPath}" class="diagram-plot diagram-plot--moment"></path>
      </svg>
    `;
  }

  function saveReport(ra, rb, moment) {
    try {
      const current = JSON.parse(window.localStorage.getItem(exportStorageKey) || "[]");
      current.unshift({
        createdAt: new Date().toISOString(),
        topic: app.t("topics.beamDiagrams.title", app.getLanguage()),
        formula: "sum Fy = 0, sum MA = 0",
        inputs: [
          `${text(pair("Beam span", "بحر الجائز"))}: ${num(state.span)} m`,
          `${text(pair("Point loads", "الأحمال النقطية"))}: ${state.loads.map(function (load) { return `${load.label} ${num(load.magnitude)} kN @ ${num(load.position)} m`; }).join(", ")}`
        ],
        finalAnswer: `RA = ${num(ra)} kN, RB = ${num(rb)} kN`,
        steps: [
          `sum Fy = 0 -> RA + RB = ${num(ra + rb)} kN`,
          `sum MA = 0 -> RB = ${num(rb)} kN`,
          `RA = ${num(ra)} kN`,
          `Peak moment shown = ${num(Math.max.apply(null, moment.map(function (item) { return item.value; })))} kN*m`
        ]
      });
      window.localStorage.setItem(exportStorageKey, JSON.stringify(current.slice(0, 15)));
    } catch (error) {
      /* Ignore storage failures. */
    }
  }

  function saveCurrentBeamReport() {
    if (!state.loads.length) {
      return;
    }

    const result = reactions();
    saveReport(result.ra, result.rb, momentPoints(result.ra));
  }

  function render() {
    const result = reactions();
    const shear = shearSegments(result.ra, result.rb);
    const moment = momentPoints(result.ra);

    root.innerHTML = `
      <section class="page-hero fade-in-up">
        <div class="page-hero__split">
          <div>
            <span class="page-badge">${esc(text(pair("Beam Visualizer", "أداة الجائز")))}</span>
            <h1>${esc(app.t("topics.beamDiagrams.title", app.getLanguage()))}</h1>
            <p>${esc(text(pair("Create a simply supported beam, place point loads, and study the reaction, shear-force, and bending-moment behavior.", "أنشئ جائزاً بسيط الارتكاز وضع أحمالاً نقطية وادرس ردود الأفعال وسلوك القص والعزم.")))}</p>
          </div>
          <aside class="hero-side-card">
            <span class="section-chip">${esc(text(pair("Educational scope", "النطاق التعليمي")))}</span>
            <p>${esc(text(pair("This first version focuses on point loads and clear diagrams for classroom use.", "تركّز هذه النسخة الأولى على الأحمال النقطية والمخططات الواضحة للاستخدام الدراسي.")))}</p>
            <div class="formula-display">RA + RB = ΣP</div>
          </aside>
        </div>
      </section>

      <section class="tool-page section-block">
        <div class="module-grid">
          <article class="module-panel glass-card">
            <div class="module-panel__header"><span class="section-chip">${esc(text(pair("Load builder", "بناء الأحمال")))}</span><h2>${esc(text(pair("Add point loads", "أضف الأحمال النقطية")))}</h2></div>
            <div class="field-grid">
              <div class="field"><label for="beam-span">${esc(text(pair("Beam span (m)", "بحر الجائز (م)")))}</label><input id="beam-span" class="input-control" type="number" inputmode="decimal" min="0" step="any" value="${esc(state.span)}"></div>
              <div class="field"><label for="beam-load">${esc(text(pair("Load magnitude (kN)", "مقدار الحمل (kN)")))}</label><input id="beam-load" class="input-control" type="number" inputmode="decimal" min="0" step="any" value="${esc(state.loadMagnitude)}"></div>
              <div class="field"><label for="beam-position">${esc(text(pair("Load position from left (m)", "موضع الحمل من اليسار (م)")))}</label><input id="beam-position" class="input-control" type="number" inputmode="decimal" min="0" step="any" value="${esc(state.loadPosition)}"></div>
            </div>
            <div class="action-row">
              <button type="button" class="button button-primary" id="beam-add">${esc(text(pair("Add load", "إضافة حمل")))}</button>
              <button type="button" class="button button-secondary" id="beam-update">${esc(text(pair("Update beam", "تحديث الجائز")))}</button>
              <button type="button" class="button button-secondary" id="beam-center">${esc(text(pair("Center load", "حمل في المنتصف")))}</button>
              <button type="button" class="button button-secondary" id="beam-clear">${esc(text(pair("Clear loads", "مسح الأحمال")))}</button>
            </div>
            <div class="load-chip-list">
              ${state.loads.map(function (load) {
                return `<div class="force-chip"><div class="force-chip__meta"><span class="force-chip__title">${esc(load.label)}</span><span class="force-chip__detail">${num(load.magnitude)} kN @ ${num(load.position)} m</span></div><button type="button" class="force-chip__remove" data-load-remove="${load.id}">×</button></div>`;
              }).join("")}
            </div>
          </article>

          <article class="module-panel glass-card">
            <div class="module-panel__header"><span class="section-chip">${esc(text(pair("Reactions", "ردود الأفعال")))}</span><h2>${esc(text(pair("Support results", "نتائج المساند")))}</h2></div>
            <div class="metric-grid">
              <div class="metric-card"><span>RA</span><strong>${num(result.ra)} kN</strong></div>
              <div class="metric-card"><span>RB</span><strong>${num(result.rb)} kN</strong></div>
            </div>
            <div class="summary-list">
              <div class="summary-item"><span>${esc(text(pair("Beam span", "بحر الجائز")))}</span><strong>${num(state.span)} m</strong></div>
              <div class="summary-item"><span>${esc(text(pair("Total load", "مجموع الأحمال")))}</span><strong>${num(result.totalLoad)} kN</strong></div>
              <div class="summary-item"><span>${esc(text(pair("Number of point loads", "عدد الأحمال النقطية")))}</span><strong>${state.loads.length}</strong></div>
            </div>
          </article>
        </div>

        <article class="module-panel glass-card">
          <div class="module-panel__header"><span class="section-chip">${esc(text(pair("Beam diagrams", "مخططات الجائز")))}</span><h2>${esc(text(pair("Beam, shear, and moment views", "عرض الجائز والقص والعزم")))}</h2></div>
          ${beamSvg(result.ra, result.rb, shear, moment)}
        </article>

        <div class="module-grid">
          <article class="module-panel glass-card">
            <div class="module-panel__header"><span class="section-chip">${esc(text(pair("Step-by-step", "خطوات الحل")))}</span><h2>${esc(text(pair("Reaction calculations", "حسابات ردود الأفعال")))}</h2></div>
            <div class="steps-list">
              <article class="step-card"><h4>1. ${esc(text(pair("Sum of vertical forces", "مجموع القوى الرأسية")))}</h4><div class="equation-line">RA + RB = ${num(result.totalLoad)} kN</div></article>
              <article class="step-card"><h4>2. ${esc(text(pair("Take moments about the left support", "خذ العزوم حول المسند الأيسر")))}</h4><div class="equation-line">RB x ${num(state.span)} = ${num(state.loads.reduce(function (sum, load) { return sum + load.magnitude * load.position; }, 0))}</div></article>
              <article class="step-card"><h4>3. ${esc(text(pair("Solve the reactions", "احسب ردود الأفعال")))}</h4><p>RA = ${num(result.ra)} kN, RB = ${num(result.rb)} kN</p></article>
            </div>
          </article>

          <article class="module-panel glass-card">
            <div class="module-panel__header"><span class="section-chip">${esc(text(pair("Study notes", "ملاحظات دراسية")))}</span><h2>${esc(text(pair("How to read the diagrams", "كيف تقرأ المخططات")))}</h2></div>
            <div class="support-list">
              <div class="step-card"><h4>${esc(text(pair("Shear jumps", "قفزات القص")))}</h4><p>${esc(text(pair("Each downward point load causes a downward jump in the shear-force diagram.", "كل حمل نقطي هابط يسبب قفزة هابطة في مخطط القص.")))}</p></div>
              <div class="step-card"><h4>${esc(text(pair("Moment slope", "ميل العزم")))}</h4><p>${esc(text(pair("The slope of the bending-moment diagram equals the shear force between loads.", "يمثل ميل مخطط العزم قيمة القص بين الأحمال.")))}</p></div>
            </div>
          </article>
        </div>
      </section>
    `;

    root.querySelector("#beam-add").addEventListener("click", function () {
      const span = Number(root.querySelector("#beam-span").value);
      const magnitude = Number(root.querySelector("#beam-load").value);
      const position = Number(root.querySelector("#beam-position").value);

      if (!Number.isFinite(span) || span <= 0 || !Number.isFinite(magnitude) || magnitude <= 0 || !Number.isFinite(position) || position <= 0 || position >= span) {
        return;
      }

      state.span = span;
      state.loadMagnitude = magnitude;
      state.loadPosition = position;
      state.loads.push({ id: `L${Date.now()}`, label: `P${state.loads.length + 1}`, magnitude: magnitude, position: position });
      saveCurrentBeamReport();
      render();
    });

    root.querySelector("#beam-update").addEventListener("click", function () {
      const span = Number(root.querySelector("#beam-span").value);
      const magnitude = Number(root.querySelector("#beam-load").value);
      const position = Number(root.querySelector("#beam-position").value);

      if (!Number.isFinite(span) || span <= 0) {
        return;
      }

      state.span = span;
      state.loadMagnitude = Number.isFinite(magnitude) && magnitude > 0 ? magnitude : state.loadMagnitude;
      state.loadPosition = Number.isFinite(position) ? position : state.loadPosition;
      state.loads = state.loads.filter(function (load) { return load.position > 0 && load.position < state.span; });
      saveCurrentBeamReport();
      render();
    });

    root.querySelector("#beam-center").addEventListener("click", function () {
      const span = Number(root.querySelector("#beam-span").value);
      const magnitude = Number(root.querySelector("#beam-load").value);

      if (!Number.isFinite(span) || span <= 0 || !Number.isFinite(magnitude) || magnitude <= 0) {
        return;
      }

      state.span = span;
      state.loadMagnitude = magnitude;
      state.loadPosition = state.span / 2;
      state.loads.push({ id: `L${Date.now()}`, label: `P${state.loads.length + 1}`, magnitude: state.loadMagnitude, position: state.span / 2 });
      saveCurrentBeamReport();
      render();
    });

    root.querySelector("#beam-clear").addEventListener("click", function () {
      state.loads = [];
      saveCurrentBeamReport();
      render();
    });

    root.querySelectorAll("[data-load-remove]").forEach(function (button) {
      button.addEventListener("click", function () {
        const id = button.getAttribute("data-load-remove");
        state.loads = state.loads.filter(function (load) { return load.id !== id; });
        saveCurrentBeamReport();
        render();
      });
    });
  }

  render();
  document.addEventListener(app.eventName, render);
})();
