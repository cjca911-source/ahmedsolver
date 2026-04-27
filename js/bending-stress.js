(function () {
  "use strict";

  const app = window.StrengthSolverApp;
  const utils = window.AhmedSolverEngineering;
  const sections = window.AhmedSolverSections;
  const root = document.getElementById("bending-stress-root");

  if (!app || !utils || !sections || !root) {
    return;
  }

  const momentUnits = ["N·m", "kN·m"];
  const shapeFields = {
    rectangle: ["rectWidth", "rectHeight"],
    circle: ["circleDiameter"],
    hollowRectangle: ["hollowWidth", "hollowHeight", "hollowThickness"],
    iBeam: ["flangeWidth", "flangeThickness", "webHeight", "webThickness"],
    tBeam: ["flangeWidth", "flangeThickness", "webHeight", "webThickness"]
  };

  const copy = {
    en: {
      kicker: "Geometry-Driven Flexure Tool",
      title: "Bending Stress Solver",
      intro:
        "Select a section shape, enter its geometry, and solve bending stress from the neutral axis outward with a live section preview and stress charts.",
      summaryTitle: "What this page solves",
      summaryPoints: [
        "Automatic area, centroid, inertia, and section modulus from section geometry.",
        "Stress at any entered distance y from the neutral axis plus the governing extreme-fiber stress.",
        "Responsive section preview, stress distribution chart, and top-versus-bottom stress comparison."
      ],
      sectionTitle: "Section geometry",
      sectionDescription:
        "Choose a shape and enter all dimensions in millimeters. AhmedSolver computes the centroidal properties automatically.",
      loadingTitle: "Bending inputs",
      loadingDescription:
        "Enter the applied bending moment and the signed distance y from the neutral axis. Positive y is above the neutral axis.",
      previewTitle: "Section preview",
      previewDescription:
        "The dashed line marks the neutral axis. The optional marker shows the entered y position used for stress evaluation.",
      resultsTitle: "Solved results",
      stepsTitle: "Step-by-step solution",
      chartsTitle: "Stress charts",
      chartsDescription:
        "The charts show the linear stress field produced by pure bending and compare the top and bottom extreme-fiber stresses.",
      buttons: {
        solve: "Solve Bending Stress",
        reset: "Reset"
      },
      status: {
        ready: "Choose a section and fill in the bending inputs.",
        missing: "Please complete the active geometry fields, moment, and y position.",
        invalid: "Invalid number format in one or more fields.",
        positive: "All section dimensions must be greater than zero.",
        moment: "The bending moment must be a non-zero number.",
        y: "The stress evaluation distance y must be a valid number.",
        hollowThickness: "For the hollow rectangle, the wall thickness must leave a positive inner opening.",
        webTooWide: "The web thickness must be smaller than or equal to the flange width.",
        success: "Bending stress solved successfully."
      },
      warnings: {
        yOutside: "The selected y value lies outside the section depth. The computed stress is mathematical only.",
        highStress: "The stress result is very high for common structural materials. Check the moment magnitude and geometry.",
        tinyInertia: "The computed inertia is very small. Verify the section dimensions and units.",
        thinWall: "Very thin dimensions may be sensitive to unit mistakes or local buckling in real members."
      },
      shapes: {
        rectangle: "Rectangle",
        circle: "Circle",
        hollowRectangle: "Hollow Rectangle",
        iBeam: "I-Beam",
        tBeam: "T-Beam"
      },
      fields: {
        shape: "Section shape",
        rectWidth: "Width b (mm)",
        rectHeight: "Height h (mm)",
        circleDiameter: "Diameter d (mm)",
        hollowWidth: "Outer width b (mm)",
        hollowHeight: "Outer height h (mm)",
        hollowThickness: "Wall thickness t (mm)",
        flangeWidth: "Flange width B (mm)",
        flangeThickness: "Flange thickness tf (mm)",
        webHeight: "Web height hw (mm)",
        webThickness: "Web thickness tw (mm)",
        moment: "Bending moment M",
        y: "Distance y from NA (mm)",
        momentUnit: "Moment unit"
      },
      hints: {
        geometry: "All section dimensions are entered in millimeters.",
        moment: "Use the sign that matches your bending convention.",
        y: "Positive above the neutral axis, negative below it."
      },
      formulas: {
        stress: "σ = M y / I",
        sectionModulus: "S = I / c_max"
      },
      metrics: {
        area: "Area A",
        centroid: "Centroid ȳ",
        inertia: "Moment of inertia I",
        sectionModulus: "Section modulus S",
        sigmaMax: "Maximum stress σmax",
        sigmaAtY: "Stress at y"
      },
      labels: {
        neutralAxis: "Neutral axis",
        pointY: "y location",
        topStress: "Top fiber stress",
        bottomStress: "Bottom fiber stress",
        distribution: "Stress distribution",
        barChart: "Top vs bottom stress",
        sectionIncomplete: "Complete the active geometry fields to preview the section.",
        noWarnings: "No major engineering warnings were triggered for this case."
      },
      steps: {
        geometry: "1. Compute geometry properties",
        inertia: "2. Compute centroidal inertia and section modulus",
        conversion: "3. Convert the solved quantities to SI",
        stress: "4. Apply σ = M y / I"
      }
    },
    ar: {
      kicker: "أداة الانحناء المعتمدة على الهندسة",
      title: "محلل إجهاد الانحناء",
      intro:
        "اختر شكل المقطع، وأدخل أبعاده، ثم احسب إجهاد الانحناء انطلاقاً من المحور المتعادل مع معاينة حية للمقطع ومخططات للإجهاد.",
      summaryTitle: "ما الذي تحله هذه الصفحة",
      summaryPoints: [
        "حساب تلقائي للمساحة والمركز وعزم العطالة ومعامل المقطع من هندسة المقطع.",
        "حساب الإجهاد عند أي بعد y عن المحور المتعادل مع إظهار الإجهاد الأعظمي عند الألياف القصوى.",
        "معاينة متجاوبة للمقطع مع المحور المتعادل ومخطط توزيع الإجهاد ومقارنة إجهاد أعلى وأسفل المقطع."
      ],
      sectionTitle: "هندسة المقطع",
      sectionDescription:
        "اختر شكل المقطع ثم أدخل جميع الأبعاد بالميليمتر. يحسب AhmedSolver خواص المقطع تلقائياً.",
      loadingTitle: "مدخلات الانحناء",
      loadingDescription:
        "أدخل عزم الانحناء المؤثر والمسافة الموقعة y من المحور المتعادل. تكون y الموجبة أعلى المحور المتعادل.",
      previewTitle: "معاينة المقطع",
      previewDescription:
        "يمثل الخط المتقطع المحور المتعادل. وتشير العلامة الاختيارية إلى موضع y المستخدم في حساب الإجهاد.",
      resultsTitle: "النتائج المحلولة",
      stepsTitle: "الحل خطوة بخطوة",
      chartsTitle: "مخططات الإجهاد",
      chartsDescription:
        "تعرض المخططات مجال الإجهاد الخطي الناتج عن الانحناء النقي وتقارن بين إجهاد الألياف العليا والسفلى.",
      buttons: {
        solve: "احسب إجهاد الانحناء",
        reset: "إعادة ضبط"
      },
      status: {
        ready: "اختر مقطعاً واملأ بيانات الانحناء.",
        missing: "يرجى إكمال حقول الهندسة النشطة وقيمة العزم وموضع y.",
        invalid: "تنسيق الرقم غير صالح في واحد أو أكثر من الحقول.",
        positive: "يجب أن تكون جميع أبعاد المقطع أكبر من الصفر.",
        moment: "يجب أن يكون عزم الانحناء عدداً غير صفري.",
        y: "يجب أن تكون المسافة y قيمة رقمية صالحة.",
        hollowThickness: "في المستطيل المجوف يجب أن يترك السمك الداخلي فتحة داخلية موجبة.",
        webTooWide: "يجب أن يكون سمك الروح أصغر من أو مساوياً لعرض الجناح.",
        success: "تم حل إجهاد الانحناء بنجاح."
      },
      warnings: {
        yOutside: "تقع قيمة y المدخلة خارج عمق المقطع. الإجهاد المحسوب رياضي فقط.",
        highStress: "قيمة الإجهاد عالية جداً مقارنةً بمواد إنشائية شائعة. تحقق من العزم والأبعاد.",
        tinyInertia: "عزم العطالة المحسوب صغير جداً. تحقق من أبعاد المقطع والوحدات.",
        thinWall: "الأبعاد الرقيقة جداً قد تكون حساسة لأخطاء الوحدات أو لانبعاج موضعي في الواقع."
      },
      shapes: {
        rectangle: "مستطيل",
        circle: "دائرة",
        hollowRectangle: "مستطيل مجوف",
        iBeam: "مقطع I",
        tBeam: "مقطع T"
      },
      fields: {
        shape: "شكل المقطع",
        rectWidth: "العرض b (mm)",
        rectHeight: "الارتفاع h (mm)",
        circleDiameter: "القطر d (mm)",
        hollowWidth: "العرض الخارجي b (mm)",
        hollowHeight: "الارتفاع الخارجي h (mm)",
        hollowThickness: "سماكة الجدار t (mm)",
        flangeWidth: "عرض الجناح B (mm)",
        flangeThickness: "سماكة الجناح tf (mm)",
        webHeight: "ارتفاع الروح hw (mm)",
        webThickness: "سماكة الروح tw (mm)",
        moment: "عزم الانحناء M",
        y: "المسافة y من المحور المتعادل (mm)",
        momentUnit: "وحدة العزم"
      },
      hints: {
        geometry: "تدخل جميع أبعاد المقطع بالميليمتر.",
        moment: "استخدم الإشارة التي توافق اصطلاحك في الانحناء.",
        y: "موجب فوق المحور المتعادل وسالب تحته."
      },
      formulas: {
        stress: "σ = M y / I",
        sectionModulus: "S = I / c_max"
      },
      metrics: {
        area: "المساحة A",
        centroid: "المركز ȳ",
        inertia: "عزم العطالة I",
        sectionModulus: "معامل المقطع S",
        sigmaMax: "الإجهاد الأعظمي σmax",
        sigmaAtY: "الإجهاد عند y"
      },
      labels: {
        neutralAxis: "المحور المتعادل",
        pointY: "موضع y",
        topStress: "إجهاد الليف العلوي",
        bottomStress: "إجهاد الليف السفلي",
        distribution: "توزيع الإجهاد",
        barChart: "مقارنة إجهاد الأعلى والأسفل",
        sectionIncomplete: "أكمل حقول الهندسة النشطة لمعاينة المقطع.",
        noWarnings: "لا توجد تحذيرات هندسية رئيسية لهذه الحالة."
      },
      steps: {
        geometry: "1. حساب الخواص الهندسية",
        inertia: "2. حساب عزم العطالة ومعامل المقطع",
        conversion: "3. التحويل إلى وحدات SI",
        stress: "4. التعويض في σ = M y / I"
      }
    }
  };

  const state = {
    shape: "rectangle",
    rectWidth: "",
    rectHeight: "",
    circleDiameter: "",
    hollowWidth: "",
    hollowHeight: "",
    hollowThickness: "",
    flangeWidth: "",
    flangeThickness: "",
    webHeight: "",
    webThickness: "",
    moment: "",
    momentUnit: "kN·m",
    y: "",
    result: null,
    status: {
      state: "neutral",
      key: "ready"
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

  function formatStressPa(valuePa) {
    return utils.formatWithUnit("stress", utils.fromBase("stress", valuePa, "MPa"), "MPa", app.getLanguage(), 4);
  }

  function activeFields() {
    return shapeFields[state.shape];
  }

  function parseSignedNumber(fieldName) {
    const parsed = utils.parseNumber(state[fieldName]);

    if (parsed.empty) {
      return { ok: false, reason: "missing" };
    }

    if (!parsed.ok) {
      return { ok: false, reason: "invalid" };
    }

    return { ok: true, value: parsed.value };
  }

  function parseNonZeroNumber(fieldName) {
    const parsed = parseSignedNumber(fieldName);

    if (!parsed.ok) {
      return parsed;
    }

    if (parsed.value === 0) {
      return { ok: false, reason: "zero" };
    }

    return parsed;
  }

  function shapeInputMap() {
    return {
      rectangle: {
        width: state.rectWidth,
        height: state.rectHeight
      },
      circle: {
        diameter: state.circleDiameter
      },
      hollowRectangle: {
        width: state.hollowWidth,
        height: state.hollowHeight,
        thickness: state.hollowThickness
      },
      iBeam: {
        flangeWidth: state.flangeWidth,
        flangeThickness: state.flangeThickness,
        webHeight: state.webHeight,
        webThickness: state.webThickness
      },
      tBeam: {
        flangeWidth: state.flangeWidth,
        flangeThickness: state.flangeThickness,
        webHeight: state.webHeight,
        webThickness: state.webThickness
      }
    };
  }

  function getSectionPreview() {
    return sections.computeShapeProperties(state.shape, shapeInputMap()[state.shape]);
  }

  function buildSolvedResult(section, momentValue, yValue) {
    const momentNm = utils.convertMomentToNewtonMeters(momentValue, state.momentUnit);
    const yM = sections.mmToM(yValue);
    const sigmaAtYPa = (momentNm * yM) / section.iM4;
    const sigmaTopPa = (momentNm * section.cTopM) / section.iM4;
    const sigmaBottomPa = (-momentNm * section.cBottomM) / section.iM4;
    const sigmaMaxPa = Math.max(Math.abs(sigmaTopPa), Math.abs(sigmaBottomPa));
    const warnings = [];

    if (Math.abs(yValue) > Math.max(section.cTopMm, section.cBottomMm)) {
      warnings.push("yOutside");
    }

    if (section.iM4 < 1e-10) {
      warnings.push("tinyInertia");
    }

    if (section.shape === "hollowRectangle" && Number(state.hollowThickness) < 5) {
      warnings.push("thinWall");
    }

    if (sigmaMaxPa > 600e6) {
      warnings.push("highStress");
    }

    return {
      section: section,
      momentInput: momentValue,
      momentNm: momentNm,
      yMm: yValue,
      yM: yM,
      sigmaAtYPa: sigmaAtYPa,
      sigmaTopPa: sigmaTopPa,
      sigmaBottomPa: sigmaBottomPa,
      sigmaMaxPa: sigmaMaxPa,
      warnings: warnings
    };
  }

  function solve() {
    const texts = currentCopy();
    const section = getSectionPreview();
    const moment = parseNonZeroNumber("moment");
    const yValue = parseSignedNumber("y");

    if (!section.ok) {
      state.result = null;
      state.status = {
        state: "error",
        key:
          section.reason === "invalid"
            ? "invalid"
            : section.reason === "positive"
              ? "positive"
              : section.reason === "hollowThickness"
                ? "hollowThickness"
                : section.reason === "webTooWide"
                  ? "webTooWide"
                  : "missing"
      };
      return;
    }

    if (!moment.ok) {
      state.result = null;
      state.status = {
        state: "error",
        key: moment.reason === "invalid" ? "invalid" : moment.reason === "zero" ? "moment" : "missing"
      };
      return;
    }

    if (!yValue.ok) {
      state.result = null;
      state.status = {
        state: "error",
        key: yValue.reason === "invalid" ? "invalid" : "y"
      };
      return;
    }

    state.result = buildSolvedResult(section, moment.value, yValue.value);
    state.status = { state: "success", key: "success" };
  }

  function reset() {
    state.shape = "rectangle";
    state.rectWidth = "";
    state.rectHeight = "";
    state.circleDiameter = "";
    state.hollowWidth = "";
    state.hollowHeight = "";
    state.hollowThickness = "";
    state.flangeWidth = "";
    state.flangeThickness = "";
    state.webHeight = "";
    state.webThickness = "";
    state.moment = "";
    state.momentUnit = "kN·m";
    state.y = "";
    state.result = null;
    state.status = {
      state: "neutral",
      key: "ready"
    };
  }

  function metricCard(title, value) {
    return `
      <article class="metric-card">
        <h3>${esc(title)}</h3>
        <span class="metric-value">${esc(value)}</span>
      </article>
    `;
  }

  function createFieldCard(fieldName, texts) {
    const badges = {
      rectWidth: "b",
      rectHeight: "h",
      circleDiameter: "d",
      hollowWidth: "b",
      hollowHeight: "h",
      hollowThickness: "t",
      flangeWidth: "B",
      flangeThickness: "tf",
      webHeight: "hw",
      webThickness: "tw",
      moment: "M",
      y: "y"
    };
    const hints = {
      moment: texts.hints.moment,
      y: texts.hints.y
    };

    return `
      <label class="input-card" for="${fieldName}">
        <span class="input-card__badge">${esc(badges[fieldName] || fieldName)}</span>
        <span class="input-card__title">${esc(texts.fields[fieldName])}</span>
        <span class="input-card__hint">${esc(hints[fieldName] || texts.hints.geometry)}</span>
        <input
          id="${fieldName}"
          name="${fieldName}"
          class="input-control"
          type="text"
          inputmode="decimal"
          value="${esc(state[fieldName])}"
        >
      </label>
    `;
  }

  function createMomentCard(texts) {
    return `
      <label class="input-card" for="moment">
        <span class="input-card__badge">M</span>
        <span class="input-card__title">${esc(texts.fields.moment)}</span>
        <span class="input-card__hint">${esc(texts.hints.moment)}</span>
        <input
          id="moment"
          name="moment"
          class="input-control"
          type="text"
          inputmode="decimal"
          value="${esc(state.moment)}"
        >
        <select id="momentUnit" name="momentUnit" class="select-control">
          ${momentUnits.map(function (unitKey) {
            return `<option value="${unitKey}" ${state.momentUnit === unitKey ? "selected" : ""}>${esc(unitKey)}</option>`;
          }).join("")}
        </select>
      </label>
    `;
  }

  function buildMetrics(texts) {
    if (!state.result) {
      return `
        <article class="placeholder-card" style="grid-column: 1 / -1;">
          <p>${esc(texts.status.ready)}</p>
        </article>
      `;
    }

    return [
      metricCard(texts.metrics.area, `${format(state.result.section.areaMm2, 3)} mm^2`),
      metricCard(texts.metrics.centroid, `${format(state.result.section.ybarMm, 4)} mm`),
      metricCard(texts.metrics.inertia, `${format(state.result.section.iMm4, 4)} mm^4`),
      metricCard(texts.metrics.sectionModulus, `${format(state.result.section.sMinMm3, 4)} mm^3`),
      metricCard(texts.metrics.sigmaMax, formatStressPa(state.result.sigmaMaxPa)),
      metricCard(texts.metrics.sigmaAtY, formatStressPa(state.result.sigmaAtYPa))
    ].join("");
  }

  function buildWarnings(texts) {
    if (!state.result) {
      return "";
    }

    if (!state.result.warnings.length) {
      return `
        <article class="preview-card result-note-card">
          <p>${esc(texts.labels.noWarnings)}</p>
        </article>
      `;
    }

    return `
      <article class="preview-card result-note-card">
        <ul class="warning-list">
          ${state.result.warnings.map(function (warningKey) {
            return `<li>${esc(texts.warnings[warningKey])}</li>`;
          }).join("")}
        </ul>
      </article>
    `;
  }

  function buildSteps(texts) {
    if (!state.result) {
      return `
        <article class="placeholder-card">
          <p>${esc(texts.status.ready)}</p>
        </article>
      `;
    }

    const section = state.result.section;
    const steps = [
      {
        title: texts.steps.geometry,
        body:
          `${section.formula}\n` +
          `${section.detailLines.join("\n")}\n` +
          `A = ${format(section.areaMm2, 4)} mm^2\n` +
          `ȳ = ${format(section.ybarMm, 4)} mm`
      },
      {
        title: texts.steps.inertia,
        body:
          `I = ${format(section.iMm4, 4)} mm^4\n` +
          `${texts.formulas.sectionModulus}\n` +
          `c_max = ${format(Math.max(section.cTopMm, section.cBottomMm), 4)} mm\n` +
          `S = ${format(section.sMinMm3, 4)} mm^3`
      },
      {
        title: texts.steps.conversion,
        body:
          `M = ${format(state.result.momentInput, 4)} ${state.momentUnit} = ${format(state.result.momentNm, 4)} N·m\n` +
          `y = ${format(state.result.yMm, 4)} mm = ${state.result.yM.toExponential(4)} m\n` +
          `I = ${format(section.iMm4, 4)} mm^4 = ${section.iM4.toExponential(4)} m^4`
      },
      {
        title: texts.steps.stress,
        body:
          `${texts.formulas.stress}\n` +
          `σ(y) = (${format(state.result.momentNm, 4)} × ${state.result.yM.toExponential(4)}) / ${section.iM4.toExponential(4)}\n` +
          `σ(y) = ${formatStressPa(state.result.sigmaAtYPa)}\n` +
          `σmax = ${formatStressPa(state.result.sigmaMaxPa)}`
      }
    ];

    return steps.map(function (step) {
      return `
        <article class="step-card">
          <h4>${esc(step.title)}</h4>
          <span class="equation-line">${esc(step.body)}</span>
        </article>
      `;
    }).join("");
  }

  function previewSvg(section, texts) {
    const width = 360;
    const height = 280;
    const pad = 44;
    const maxWidthMm = section.drawData.type === "circle"
      ? section.drawData.diameterMm
      : section.drawData.type === "rectangle"
        ? section.drawData.widthMm
        : section.drawData.type === "hollowRectangle"
          ? section.drawData.widthMm
          : section.drawData.type === "iBeam"
            ? section.drawData.flangeWidthMm
            : section.drawData.flangeWidthMm;
    const maxHeightMm = section.depthMm;
    const scale = Math.min((width - 2 * pad) / maxWidthMm, (height - 2 * pad) / maxHeightMm);
    const drawWidth = maxWidthMm * scale;
    const drawHeight = maxHeightMm * scale;
    const left = (width - drawWidth) / 2;
    const top = (height - drawHeight) / 2;
    const naY = top + (section.depthMm - section.ybarMm) * scale;
    const yParsed = utils.parseNumber(state.y);
    const yMarker = yParsed.ok
      ? `
          <circle cx="${width - 34}" cy="${naY - yParsed.value * scale}" r="5" fill="#ffd166"></circle>
          <text x="${width - 118}" y="${naY - yParsed.value * scale - 10}" fill="#ffd166" font-size="13">${esc(texts.labels.pointY)}</text>
        `
      : "";
    let shapeMarkup = "";

    if (section.drawData.type === "rectangle") {
      shapeMarkup = `<rect x="${left}" y="${top}" width="${drawWidth}" height="${drawHeight}" fill="rgba(255,66,66,0.16)" stroke="#ffffff" stroke-width="3"></rect>`;
    } else if (section.drawData.type === "circle") {
      shapeMarkup = `<circle cx="${width / 2}" cy="${height / 2}" r="${drawWidth / 2}" fill="rgba(255,66,66,0.16)" stroke="#ffffff" stroke-width="3"></circle>`;
    } else if (section.drawData.type === "hollowRectangle") {
      const innerWidth = (section.drawData.widthMm - 2 * section.drawData.thicknessMm) * scale;
      const innerHeight = (section.drawData.heightMm - 2 * section.drawData.thicknessMm) * scale;
      const innerLeft = left + section.drawData.thicknessMm * scale;
      const innerTop = top + section.drawData.thicknessMm * scale;
      shapeMarkup = `
        <rect x="${left}" y="${top}" width="${drawWidth}" height="${drawHeight}" fill="rgba(255,66,66,0.16)" stroke="#ffffff" stroke-width="3"></rect>
        <rect x="${innerLeft}" y="${innerTop}" width="${innerWidth}" height="${innerHeight}" fill="#060606" stroke="#ffffff" stroke-width="2"></rect>
      `;
    } else if (section.drawData.type === "iBeam") {
      const flangeHeight = section.drawData.flangeThicknessMm * scale;
      const webWidth = section.drawData.webThicknessMm * scale;
      const webHeight = section.drawData.webHeightMm * scale;
      const webLeft = left + (drawWidth - webWidth) / 2;
      shapeMarkup = `
        <rect x="${left}" y="${top}" width="${drawWidth}" height="${flangeHeight}" fill="rgba(255,66,66,0.16)" stroke="#ffffff" stroke-width="3"></rect>
        <rect x="${webLeft}" y="${top + flangeHeight}" width="${webWidth}" height="${webHeight}" fill="rgba(255,66,66,0.16)" stroke="#ffffff" stroke-width="3"></rect>
        <rect x="${left}" y="${top + flangeHeight + webHeight}" width="${drawWidth}" height="${flangeHeight}" fill="rgba(255,66,66,0.16)" stroke="#ffffff" stroke-width="3"></rect>
      `;
    } else {
      const flangeHeight = section.drawData.flangeThicknessMm * scale;
      const webWidth = section.drawData.webThicknessMm * scale;
      const webHeight = section.drawData.webHeightMm * scale;
      const webLeft = left + (drawWidth - webWidth) / 2;
      shapeMarkup = `
        <rect x="${left}" y="${top}" width="${drawWidth}" height="${flangeHeight}" fill="rgba(255,66,66,0.16)" stroke="#ffffff" stroke-width="3"></rect>
        <rect x="${webLeft}" y="${top + flangeHeight}" width="${webWidth}" height="${webHeight}" fill="rgba(255,66,66,0.16)" stroke="#ffffff" stroke-width="3"></rect>
      `;
    }

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(texts.previewTitle)}">
        ${shapeMarkup}
        <line x1="${left - 14}" y1="${naY}" x2="${left + drawWidth + 14}" y2="${naY}" stroke="#ffd166" stroke-width="2.5" stroke-dasharray="8 7"></line>
        <text x="${left}" y="${naY - 10}" fill="#ffd166" font-size="14">${esc(texts.labels.neutralAxis)}</text>
        ${yMarker}
      </svg>
    `;
  }

  function buildPreview(texts) {
    const section = getSectionPreview();

    if (!section.ok) {
      return `
        <article class="preview-card">
          <h3>${esc(texts.previewTitle)}</h3>
          <p>${esc(texts.labels.sectionIncomplete)}</p>
        </article>
      `;
    }

    return `
      <article class="preview-card">
        ${previewSvg(section, texts)}
        <ul class="summary-list">
          <li>${esc(`A = ${format(section.areaMm2, 4)} mm^2`)}</li>
          <li>${esc(`ȳ = ${format(section.ybarMm, 4)} mm`)}</li>
          <li>${esc(`I = ${format(section.iMm4, 4)} mm^4`)}</li>
        </ul>
      </article>
    `;
  }

  function stressDistributionSvg(texts) {
    if (!state.result) {
      return `<div class="placeholder-card"><p>${esc(texts.status.ready)}</p></div>`;
    }

    const width = 760;
    const height = 280;
    const left = 86;
    const right = 700;
    const top = 26;
    const bottom = 242;
    const amplitude = Math.max(
      Math.abs(utils.fromBase("stress", state.result.sigmaTopPa, "MPa")),
      Math.abs(utils.fromBase("stress", state.result.sigmaBottomPa, "MPa")),
      Math.abs(utils.fromBase("stress", state.result.sigmaAtYPa, "MPa")),
      1
    );
    const xZero = (left + right) / 2;
    const scaleX = ((right - left) / 2 - 32) / amplitude;
    const scaleY = (bottom - top) / state.result.section.depthMm;
    const topSigma = utils.fromBase("stress", state.result.sigmaTopPa, "MPa");
    const bottomSigma = utils.fromBase("stress", state.result.sigmaBottomPa, "MPa");
    const pointSigma = utils.fromBase("stress", state.result.sigmaAtYPa, "MPa");
    const naY = top + (state.result.section.depthMm - state.result.section.ybarMm) * scaleY;
    const pointY = naY - state.result.yMm * scaleY;

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(texts.labels.distribution)}">
        <line x1="${xZero}" y1="${top}" x2="${xZero}" y2="${bottom}" stroke="rgba(255,255,255,0.38)" stroke-width="2"></line>
        <line x1="${left}" y1="${naY}" x2="${right}" y2="${naY}" stroke="#ffd166" stroke-width="2" stroke-dasharray="8 7"></line>
        <path
          d="M ${xZero + bottomSigma * scaleX} ${bottom} L ${xZero + topSigma * scaleX} ${top}"
          fill="none"
          stroke="#ff6d6d"
          stroke-width="4"
          stroke-linecap="round"
        ></path>
        <circle cx="${xZero + pointSigma * scaleX}" cy="${pointY}" r="5" fill="#8cffc1"></circle>
        <text x="${xZero + topSigma * scaleX + 10}" y="${top + 18}" fill="#f5f5f5" font-size="13">${esc(`${texts.labels.topStress}: ${format(topSigma, 4)} MPa`)}</text>
        <text x="${xZero + bottomSigma * scaleX + 10}" y="${bottom - 10}" fill="#f5f5f5" font-size="13">${esc(`${texts.labels.bottomStress}: ${format(bottomSigma, 4)} MPa`)}</text>
        <text x="${xZero + 12}" y="${naY - 10}" fill="#ffd166" font-size="13">${esc(texts.labels.neutralAxis)}</text>
        <text x="${xZero + pointSigma * scaleX + 12}" y="${pointY - 8}" fill="#8cffc1" font-size="13">${esc(`${texts.labels.pointY}: ${format(pointSigma, 4)} MPa`)}</text>
        <text x="${left}" y="${height - 12}" fill="#f5f5f5" font-size="13">-σ</text>
        <text x="${right - 26}" y="${height - 12}" fill="#f5f5f5" font-size="13">+σ</text>
      </svg>
    `;
  }

  function stressBarSvg(texts) {
    if (!state.result) {
      return `<div class="placeholder-card"><p>${esc(texts.status.ready)}</p></div>`;
    }

    const width = 760;
    const height = 280;
    const zeroY = 150;
    const amplitude = Math.max(
      Math.abs(utils.fromBase("stress", state.result.sigmaTopPa, "MPa")),
      Math.abs(utils.fromBase("stress", state.result.sigmaBottomPa, "MPa")),
      1
    );
    const scale = 90 / amplitude;
    const topSigma = utils.fromBase("stress", state.result.sigmaTopPa, "MPa");
    const bottomSigma = utils.fromBase("stress", state.result.sigmaBottomPa, "MPa");
    const bars = [
      { x: 210, value: topSigma, color: "#ff6d6d", label: texts.labels.topStress },
      { x: 460, value: bottomSigma, color: "#8cffc1", label: texts.labels.bottomStress }
    ];

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(texts.labels.barChart)}">
        <line x1="70" y1="${zeroY}" x2="690" y2="${zeroY}" stroke="rgba(255,255,255,0.42)" stroke-width="2"></line>
        ${bars.map(function (bar) {
          const barHeight = Math.abs(bar.value) * scale;
          const y = bar.value >= 0 ? zeroY - barHeight : zeroY;
          return `
            <rect x="${bar.x}" y="${y}" width="90" height="${barHeight}" rx="18" fill="${bar.color}" opacity="0.78"></rect>
            <text x="${bar.x + 45}" y="${zeroY + 30}" fill="#f5f5f5" font-size="13" text-anchor="middle">${esc(bar.label)}</text>
            <text x="${bar.x + 45}" y="${bar.value >= 0 ? y - 10 : y + barHeight + 18}" fill="#f5f5f5" font-size="13" text-anchor="middle">${esc(`${format(bar.value, 4)} MPa`)}</text>
          `;
        }).join("")}
      </svg>
    `;
  }

  function chartCard(title, svg) {
    return `
      <article class="result-panel glass-card diagram-card">
        <div class="panel-header">
          <h3>${esc(title)}</h3>
        </div>
        <div class="drawing-shell drawing-shell--diagram">
          ${svg}
        </div>
      </article>
    `;
  }

  function render() {
    const texts = currentCopy();
    const statusMessage = texts.status[state.status.key] || texts.status.ready;
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
                <span class="equation-chip">${esc(texts.formulas.stress)}</span>
                <span class="equation-chip">${esc(texts.formulas.sectionModulus)}</span>
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
          <form id="bending-form" class="solver-panel glass-card">
            <div class="subsection" style="margin-top: 0;">
              <div class="panel-header">
                <h2>${esc(texts.sectionTitle)}</h2>
                <p>${esc(texts.sectionDescription)}</p>
              </div>
              <div class="field-grid">
                <div class="field field--full">
                  <label for="shape">${esc(texts.fields.shape)}</label>
                  <select id="shape" name="shape" class="select-control">
                    ${Object.keys(shapeFields).map(function (shapeKey) {
                      return `<option value="${shapeKey}" ${state.shape === shapeKey ? "selected" : ""}>${esc(texts.shapes[shapeKey])}</option>`;
                    }).join("")}
                  </select>
                </div>
                ${activeFields().map(function (fieldName) {
                  return createFieldCard(fieldName, texts);
                }).join("")}
              </div>
            </div>

            <div class="subsection">
              <div class="panel-header">
                <h3>${esc(texts.loadingTitle)}</h3>
                <p>${esc(texts.loadingDescription)}</p>
              </div>
              <div class="field-grid">
                ${createMomentCard(texts)}
                ${createFieldCard("y", texts)}
              </div>
            </div>

            <div class="action-row">
              <button class="button button-primary" type="submit">${esc(texts.buttons.solve)}</button>
              <button class="button button-secondary" type="button" data-reset>${esc(texts.buttons.reset)}</button>
            </div>

            <div class="status-banner is-visible" data-state="${statusState}">
              ${esc(statusMessage)}
            </div>
          </form>

          <div class="visual-stack">
            <section class="solver-panel glass-card">
              <div class="panel-header">
                <h2>${esc(texts.previewTitle)}</h2>
                <p>${esc(texts.previewDescription)}</p>
              </div>
              ${buildPreview(texts)}
            </section>

            <section class="result-panel glass-card">
              <div class="panel-header">
                <h2>${esc(texts.chartsTitle)}</h2>
                <p>${esc(texts.chartsDescription)}</p>
              </div>
              <div class="diagram-grid">
                ${chartCard(texts.labels.distribution, stressDistributionSvg(texts))}
                ${chartCard(texts.labels.barChart, stressBarSvg(texts))}
              </div>
            </section>
          </div>
        </div>

        <div class="result-layout">
          <section class="result-panel glass-card">
            <div class="panel-header">
              <h2>${esc(texts.resultsTitle)}</h2>
            </div>
            <div class="result-grid">
              ${buildMetrics(texts)}
            </div>
            ${buildWarnings(texts)}
          </section>

          <section class="result-panel glass-card">
            <div class="panel-header">
              <h2>${esc(texts.stepsTitle)}</h2>
            </div>
            <div class="steps-grid">
              ${buildSteps(texts)}
            </div>
          </section>
        </div>

      </section>
    `;

    const form = root.querySelector("#bending-form");
    const resetButton = root.querySelector("[data-reset]");

    form.addEventListener("input", function (event) {
      if (!event.target || !event.target.name) {
        return;
      }

      state[event.target.name] = event.target.value;
    });

    form.addEventListener("change", function (event) {
      if (!event.target || !event.target.name) {
        return;
      }

      state[event.target.name] = event.target.value;
      render();
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
