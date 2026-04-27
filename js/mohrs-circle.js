(function () {
  "use strict";

  const app = window.StrengthSolverApp;
  const utils = window.AhmedSolverEngineering;
  const root = document.getElementById("mohrs-circle-root");

  if (!app || !utils || !root) {
    return;
  }

  const defaultInput = {
    sigmaX: "120",
    sigmaY: "60",
    tauXY: "40",
    unit: "MPa"
  };

  const copy = {
    en: {
      kicker: "Stress Transformation Tool",
      title: "Mohr's Circle Analyzer",
      intro:
        "Enter the in-plane stress components, inspect the linked stress element, and explore Mohr's Circle through interactive engineering points.",
      summaryTitle: "What this page solves",
      summaryPoints: [
        "Average stress, principal stresses, maximum in-plane shear stress, and principal angle.",
        "Linked physical stress elements for the original, principal, and maximum-shear states.",
        "Interactive Mohr points with tooltip values and a dedicated point-information panel."
      ],
      equationChips: [
        "σavg = (σx + σy) / 2",
        "R = sqrt(((σx - σy)/2)^2 + τxy^2)",
        "σ1 = σavg + R",
        "σ2 = σavg - R"
      ],
      inputTitle: "Stress inputs",
      inputDescription:
        "Use one stress unit for σx, σy, and τxy. Positive normal stress is tensile, and the shear sign follows the value you enter.",
      unitLabel: "Stress unit",
      solve: "Solve Mohr's Circle",
      reset: "Reset to test case",
      ready: "Default test case loaded. You can solve again after editing the values.",
      missing: "Please enter values for σx, σy, and τxy.",
      invalid: "Invalid number format in one or more stress inputs.",
      success: "Mohr's Circle solved successfully.",
      resultsTitle: "Computed results",
      stepsTitle: "Step-by-step solution",
      elementTitle: "Stress Element Diagram",
      elementDescription:
        "Use the state buttons or click a Mohr point to switch the linked physical stress element.",
      circleTitle: "Mohr's Circle drawing",
      circleDescription:
        "Hover or click a highlighted point to inspect its coordinates and the corresponding physical state.",
      pointInfoTitle: "Point Information",
      pointInfoDescription:
        "The selected point describes a specific stress state and updates the linked stress element when applicable.",
      drawingPlaceholder: "The diagrams will appear after solving the stress state.",
      circleCaption:
        "Point A and point B describe the original orthogonal faces. Principal and shear points map to rotated physical elements.",
      fields: {
        sigmaX: { badge: "σx", title: "Normal stress on the x-face", hint: "Positive in tension." },
        sigmaY: { badge: "σy", title: "Normal stress on the y-face", hint: "Use the same unit as σx." },
        tauXY: { badge: "τxy", title: "In-plane shear stress", hint: "The sign affects the principal angle." }
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
      elementStates: {
        original: "Original Element",
        principal: "Principal Element",
        maxShear: "Maximum Shear Element",
        average: "Average Stress Element"
      },
      elementLabels: {
        rotation: "Physical angle θ",
        circleAngle: "Mohr angle 2θ",
        sigmaX: "σx",
        sigmaY: "σy",
        sigma1: "σ1",
        sigma2: "σ2",
        sigmaAvg: "σavg",
        tauXY: "τxy",
        tauMax: "τmax",
        zeroShear: "τ = 0",
        tensile: "Tension",
        compressive: "Compression",
        shear: "Shear"
      },
      stateDescriptions: {
        original: "Original element aligned with the x and y axes.",
        principal: "Principal element rotated to the plane where shear stress is zero.",
        maxShear: "Maximum-shear element rotated to the plane where |τ| is largest.",
        average: "Average-stress center state with σavg and zero shear."
      },
      pointNames: {
        pointA: "Point A",
        pointB: "Point B",
        principal1: "Principal Point σ1",
        principal2: "Principal Point σ2",
        shearTop: "Maximum Shear Point +τmax",
        shearBottom: "Maximum Shear Point -τmax",
        center: "Center C"
      },
      pointRepresentations: {
        pointA: "Represents the stress state on the original x-face.",
        pointB: "Represents the stress state on the original y-face.",
        principal1: "Represents the first principal plane where shear stress is zero.",
        principal2: "Represents the second principal plane where shear stress is zero.",
        shearTop: "Represents the maximum positive in-plane shear plane.",
        shearBottom: "Represents the maximum negative in-plane shear plane.",
        center: "Represents the circle center, which stores the average normal stress."
      },
      pointInfoLabels: {
        sigma: "σ value",
        tau: "τ value",
        twoTheta: "Mohr angle 2θ",
        theta: "Physical angle θ",
        meaning: "Meaning"
      },
      drawingLabels: {
        sigmaAxis: "σ axis",
        tauAxis: "τ axis",
        center: "C",
        radius: "R",
        sigma1: "σ1",
        sigma2: "σ2",
        topShear: "+τmax",
        bottomShear: "-τmax",
        pointA: "A",
        pointB: "B"
      },
      noResult: "Solve the stress state to activate the linked diagrams and point information."
    },
    ar: {
      kicker: "أداة تحويلات الإجهاد",
      title: "محلل دائرة مور",
      intro:
        "أدخل مركبات الإجهاد المستوي، ثم استعرض عنصر الإجهاد المرتبط ودائرة مور بشكل تفاعلي من خلال النقاط الهندسية.",
      summaryTitle: "ما الذي تحله هذه الصفحة",
      summaryPoints: [
        "الإجهاد المتوسط والإجهادات الرئيسية والقص الأعظمي والزاوية الرئيسية.",
        "عناصر إجهاد مرتبطة للحالات الأصلية والرئيسية وحالة القص الأعظمي.",
        "نقاط تفاعلية على دائرة مور مع تلميحات قيم وبطاقة معلومات مخصصة."
      ],
      equationChips: [
        "σavg = (σx + σy) / 2",
        "R = sqrt(((σx - σy)/2)^2 + τxy^2)",
        "σ1 = σavg + R",
        "σ2 = σavg - R"
      ],
      inputTitle: "مدخلات الإجهاد",
      inputDescription:
        "استخدم وحدة إجهاد واحدة لكل من σx و σy و τxy. يكون الإجهاد العمودي الموجب شدّاً وتتبع إشارة القص القيمة المدخلة.",
      unitLabel: "وحدة الإجهاد",
      solve: "احسب دائرة مور",
      reset: "إعادة ضبط إلى الحالة الاختبارية",
      ready: "تم تحميل الحالة الاختبارية الافتراضية. يمكنك إعادة الحل بعد تعديل القيم.",
      missing: "يرجى إدخال قيم σx و σy و τxy.",
      invalid: "تنسيق الرقم غير صالح في واحد أو أكثر من مدخلات الإجهاد.",
      success: "تم حل دائرة مور بنجاح.",
      resultsTitle: "النتائج المحسوبة",
      stepsTitle: "الحل خطوة بخطوة",
      elementTitle: "مخطط عنصر الإجهاد",
      elementDescription:
        "استخدم أزرار الحالة أو انقر نقطة على دائرة مور لتبديل عنصر الإجهاد المرتبط.",
      circleTitle: "رسم دائرة مور",
      circleDescription:
        "مرر المؤشر أو انقر نقطة مميزة لعرض إحداثياتها والحالة الفيزيائية المقابلة.",
      pointInfoTitle: "معلومات النقطة",
      pointInfoDescription:
        "تعرض النقطة المحددة حالة إجهاد معينة وتحدّث عنصر الإجهاد المرتبط عند الإمكان.",
      drawingPlaceholder: "ستظهر الرسومات بعد حل حالة الإجهاد.",
      circleCaption:
        "تمثل النقطتان A و B الوجهين الأصليين المتعامدين. وترتبط النقاط الرئيسية ونقاط القص بعناصر مدوّرة.",
      fields: {
        sigmaX: { badge: "σx", title: "الإجهاد العمودي على وجه x", hint: "الموجب في حالة الشد." },
        sigmaY: { badge: "σy", title: "الإجهاد العمودي على وجه y", hint: "استخدم نفس وحدة σx." },
        tauXY: { badge: "τxy", title: "إجهاد القص داخل المستوى", hint: "تؤثر إشارة القص في الزاوية الرئيسية." }
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
      elementStates: {
        original: "العنصر الأصلي",
        principal: "العنصر الرئيسي",
        maxShear: "عنصر القص الأعظمي",
        average: "عنصر الإجهاد المتوسط"
      },
      elementLabels: {
        rotation: "الزاوية الفيزيائية θ",
        circleAngle: "زاوية دائرة مور 2θ",
        sigmaX: "σx",
        sigmaY: "σy",
        sigma1: "σ1",
        sigma2: "σ2",
        sigmaAvg: "σavg",
        tauXY: "τxy",
        tauMax: "τmax",
        zeroShear: "τ = 0",
        tensile: "شد",
        compressive: "ضغط",
        shear: "قص"
      },
      stateDescriptions: {
        original: "العنصر الأصلي المحاذي لمحوري x و y.",
        principal: "العنصر الرئيسي المدوّر إلى المستوى الذي ينعدم فيه القص.",
        maxShear: "عنصر القص الأعظمي المدوّر إلى المستوى الذي تبلغ فيه قيمة |τ| أقصاها.",
        average: "حالة المركز بجهد متوسط σavg وقص معدوم."
      },
      pointNames: {
        pointA: "النقطة A",
        pointB: "النقطة B",
        principal1: "النقطة الرئيسية σ1",
        principal2: "النقطة الرئيسية σ2",
        shearTop: "نقطة القص الأعظمي +τmax",
        shearBottom: "نقطة القص الأعظمي -τmax",
        center: "المركز C"
      },
      pointRepresentations: {
        pointA: "تمثل حالة الإجهاد على الوجه الأصلي x.",
        pointB: "تمثل حالة الإجهاد على الوجه الأصلي y.",
        principal1: "تمثل المستوى الرئيسي الأول حيث ينعدم القص.",
        principal2: "تمثل المستوى الرئيسي الثاني حيث ينعدم القص.",
        shearTop: "تمثل مستوى القص الأعظمي الموجب داخل المستوى.",
        shearBottom: "تمثل مستوى القص الأعظمي السالب داخل المستوى.",
        center: "يمثل مركز الدائرة الذي يخزن الإجهاد العمودي المتوسط."
      },
      pointInfoLabels: {
        sigma: "قيمة σ",
        tau: "قيمة τ",
        twoTheta: "زاوية دائرة مور 2θ",
        theta: "الزاوية الفيزيائية θ",
        meaning: "المعنى"
      },
      drawingLabels: {
        sigmaAxis: "محور σ",
        tauAxis: "محور τ",
        center: "C",
        radius: "R",
        sigma1: "σ1",
        sigma2: "σ2",
        topShear: "+τmax",
        bottomShear: "-τmax",
        pointA: "A",
        pointB: "B"
      },
      noResult: "احسب حالة الإجهاد لتفعيل الرسومات المترابطة وبطاقة معلومات النقطة."
    }
  };

  const state = {
    sigmaX: defaultInput.sigmaX,
    sigmaY: defaultInput.sigmaY,
    tauXY: defaultInput.tauXY,
    unit: defaultInput.unit,
    result: null,
    status: {
      state: "neutral",
      key: "ready"
    },
    selectedPointKey: "pointA",
    elementMode: "original"
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
    return utils.formatNumber(value, app.getLanguage(), typeof decimals === "number" ? decimals : 4);
  }

  function formatStressDisplay(value, unit, decimals) {
    return utils.formatWithUnit("stress", value, unit, app.getLanguage(), typeof decimals === "number" ? decimals : 4);
  }

  function formatStressBase(valueBase, decimals) {
    return formatStressDisplay(utils.fromBase("stress", valueBase, state.unit), state.unit, decimals);
  }

  function normalizeAngle(angle) {
    let normalized = angle;

    while (normalized <= -180) {
      normalized += 360;
    }

    while (normalized > 180) {
      normalized -= 360;
    }

    return normalized;
  }

  function getPointMode(pointKey) {
    if (pointKey === "principal1" || pointKey === "principal2") {
      return "principal";
    }

    if (pointKey === "shearTop" || pointKey === "shearBottom") {
      return "maxShear";
    }

    if (pointKey === "center") {
      return "average";
    }

    return "original";
  }

  function canonicalPointForMode(mode) {
    if (mode === "principal") {
      return "principal1";
    }

    if (mode === "maxShear") {
      return "shearTop";
    }

    if (mode === "average") {
      return "center";
    }

    return "pointA";
  }

  function solve() {
    const sigmaX = utils.parseNumber(state.sigmaX);
    const sigmaY = utils.parseNumber(state.sigmaY);
    const tauXY = utils.parseNumber(state.tauXY);
    const parsed = [sigmaX, sigmaY, tauXY];

    if (parsed.some(function (item) { return item.empty; })) {
      state.result = null;
      state.status = { state: "error", key: "missing" };
      return;
    }

    if (parsed.some(function (item) { return !item.ok; })) {
      state.result = null;
      state.status = { state: "error", key: "invalid" };
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
    const thetaShearDegrees = thetaDegrees + 45;

    state.result = {
      sigmaXBase: sigmaXBase,
      sigmaYBase: sigmaYBase,
      tauXYBase: tauXYBase,
      sigmaAvgBase: sigmaAvgBase,
      radiusBase: radiusBase,
      sigma1Base: sigma1Base,
      sigma2Base: sigma2Base,
      thetaDegrees: thetaDegrees,
      thetaShearDegrees: thetaShearDegrees
    };
    state.status = { state: "success", key: "success" };
  }

  function reset() {
    state.sigmaX = defaultInput.sigmaX;
    state.sigmaY = defaultInput.sigmaY;
    state.tauXY = defaultInput.tauXY;
    state.unit = defaultInput.unit;
    state.selectedPointKey = "pointA";
    state.elementMode = "original";
    solve();
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
        <span class="input-card__badge">${esc(fieldCopy.badge)}</span>
        <span class="input-card__title">${esc(fieldCopy.title)}</span>
        <span class="input-card__hint">${esc(fieldCopy.hint)}</span>
        <input
          id="${fieldKey}"
          name="${fieldKey}"
          class="input-control"
          type="text"
          inputmode="decimal"
          value="${esc(state[fieldKey])}"
          placeholder="${esc(fieldCopy.badge)}"
        >
      </label>
    `;
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
          `σavg = (${format(sigmaXDisplay)} + ${format(sigmaYDisplay)}) / 2 = ${formatStressDisplay(sigmaAvgDisplay, state.unit, 4)}`
      },
      {
        title: texts.stepLabels.radius,
        equation:
          `R = sqrt(((σx - σy) / 2)^2 + τxy^2)\n` +
          `R = sqrt(((${format(sigmaXDisplay)} - ${format(sigmaYDisplay)}) / 2)^2 + (${format(tauXYDisplay)})^2) = ${formatStressDisplay(radiusDisplay, state.unit, 4)}`
      },
      {
        title: texts.stepLabels.principal,
        equation:
          `σ1 = σavg + R = ${format(sigmaAvgDisplay)} + ${format(radiusDisplay)} = ${formatStressDisplay(sigma1Display, state.unit, 4)}\n` +
          `σ2 = σavg - R = ${format(sigmaAvgDisplay)} - ${format(radiusDisplay)} = ${formatStressDisplay(sigma2Display, state.unit, 4)}`
      },
      {
        title: texts.stepLabels.shear,
        equation: `τmax = R = ${formatStressDisplay(radiusDisplay, state.unit, 4)}`
      },
      {
        title: texts.stepLabels.angle,
        equation:
          `θp = 0.5 × atan2(2τxy, σx - σy)\n` +
          `θp = 0.5 × atan2(2 × ${format(tauXYDisplay)}, ${format(sigmaXDisplay)} - ${format(sigmaYDisplay)}) = ${format(state.result.thetaDegrees, 4)} deg`
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

  function buildPointMap() {
    const texts = currentCopy();

    if (!state.result) {
      return {};
    }

    const twoThetaPrincipal = normalizeAngle(state.result.thetaDegrees * 2);
    const twoThetaShear = normalizeAngle(state.result.thetaShearDegrees * 2);

    return {
      pointA: {
        key: "pointA",
        label: texts.drawingLabels.pointA,
        name: texts.pointNames.pointA,
        sigmaBase: state.result.sigmaXBase,
        tauBase: state.result.tauXYBase,
        twoThetaDeg: 0,
        thetaDeg: 0,
        representation: texts.pointRepresentations.pointA,
        mode: "original"
      },
      pointB: {
        key: "pointB",
        label: texts.drawingLabels.pointB,
        name: texts.pointNames.pointB,
        sigmaBase: state.result.sigmaYBase,
        tauBase: -state.result.tauXYBase,
        twoThetaDeg: 180,
        thetaDeg: 90,
        representation: texts.pointRepresentations.pointB,
        mode: "original"
      },
      principal1: {
        key: "principal1",
        label: texts.drawingLabels.sigma1,
        name: texts.pointNames.principal1,
        sigmaBase: state.result.sigma1Base,
        tauBase: 0,
        twoThetaDeg: twoThetaPrincipal,
        thetaDeg: normalizeAngle(state.result.thetaDegrees),
        representation: texts.pointRepresentations.principal1,
        mode: "principal"
      },
      principal2: {
        key: "principal2",
        label: texts.drawingLabels.sigma2,
        name: texts.pointNames.principal2,
        sigmaBase: state.result.sigma2Base,
        tauBase: 0,
        twoThetaDeg: normalizeAngle(twoThetaPrincipal + 180),
        thetaDeg: normalizeAngle(state.result.thetaDegrees + 90),
        representation: texts.pointRepresentations.principal2,
        mode: "principal"
      },
      shearTop: {
        key: "shearTop",
        label: texts.drawingLabels.topShear,
        name: texts.pointNames.shearTop,
        sigmaBase: state.result.sigmaAvgBase,
        tauBase: state.result.radiusBase,
        twoThetaDeg: twoThetaShear,
        thetaDeg: normalizeAngle(state.result.thetaShearDegrees),
        representation: texts.pointRepresentations.shearTop,
        mode: "maxShear"
      },
      shearBottom: {
        key: "shearBottom",
        label: texts.drawingLabels.bottomShear,
        name: texts.pointNames.shearBottom,
        sigmaBase: state.result.sigmaAvgBase,
        tauBase: -state.result.radiusBase,
        twoThetaDeg: normalizeAngle(twoThetaShear + 180),
        thetaDeg: normalizeAngle(state.result.thetaShearDegrees + 90),
        representation: texts.pointRepresentations.shearBottom,
        mode: "maxShear"
      },
      center: {
        key: "center",
        label: texts.drawingLabels.center,
        name: texts.pointNames.center,
        sigmaBase: state.result.sigmaAvgBase,
        tauBase: 0,
        twoThetaDeg: null,
        thetaDeg: null,
        representation: texts.pointRepresentations.center,
        mode: "average"
      }
    };
  }

  function getElementData() {
    const texts = currentCopy();

    if (!state.result) {
      return null;
    }

    const pointMap = buildPointMap();
    const selectedPoint = pointMap[state.selectedPointKey];
    const shearSign = selectedPoint && selectedPoint.key === "shearBottom" ? -1 : 1;

    if (state.elementMode === "principal") {
      return {
        title: texts.elementStates.principal,
        description: texts.stateDescriptions.principal,
        rotationDeg: normalizeAngle(state.result.thetaDegrees),
        twoThetaDeg: normalizeAngle(state.result.thetaDegrees * 2),
        sigmaXBase: state.result.sigma1Base,
        sigmaYBase: state.result.sigma2Base,
        tauBase: 0,
        normalXLabel: texts.elementLabels.sigma1,
        normalYLabel: texts.elementLabels.sigma2,
        shearLabel: texts.elementLabels.zeroShear
      };
    }

    if (state.elementMode === "maxShear") {
      return {
        title: texts.elementStates.maxShear,
        description: texts.stateDescriptions.maxShear,
        rotationDeg: normalizeAngle(state.result.thetaShearDegrees),
        twoThetaDeg: normalizeAngle(state.result.thetaShearDegrees * 2),
        sigmaXBase: state.result.sigmaAvgBase,
        sigmaYBase: state.result.sigmaAvgBase,
        tauBase: state.result.radiusBase * shearSign,
        normalXLabel: texts.elementLabels.sigmaAvg,
        normalYLabel: texts.elementLabels.sigmaAvg,
        shearLabel: texts.elementLabels.tauMax
      };
    }

    if (state.elementMode === "average") {
      return {
        title: texts.elementStates.average,
        description: texts.stateDescriptions.average,
        rotationDeg: 0,
        twoThetaDeg: null,
        sigmaXBase: state.result.sigmaAvgBase,
        sigmaYBase: state.result.sigmaAvgBase,
        tauBase: 0,
        normalXLabel: texts.elementLabels.sigmaAvg,
        normalYLabel: texts.elementLabels.sigmaAvg,
        shearLabel: texts.elementLabels.zeroShear
      };
    }

    return {
      title: texts.elementStates.original,
      description: texts.stateDescriptions.original,
      rotationDeg: 0,
      twoThetaDeg: 0,
      sigmaXBase: state.result.sigmaXBase,
      sigmaYBase: state.result.sigmaYBase,
      tauBase: state.result.tauXYBase,
      normalXLabel: texts.elementLabels.sigmaX,
      normalYLabel: texts.elementLabels.sigmaY,
      shearLabel: texts.elementLabels.tauXY
    };
  }

  function describeNormalType(valueBase) {
    const texts = currentCopy();
    return valueBase >= 0 ? texts.elementLabels.tensile : texts.elementLabels.compressive;
  }

  function createElementDiagram() {
    const texts = currentCopy();

    if (!state.result) {
      return `
        <div class="placeholder-card">
          <p>${esc(texts.drawingPlaceholder)}</p>
        </div>
      `;
    }

    const element = getElementData();
    const width = 520;
    const height = 380;
    const centerX = width / 2;
    const centerY = 190;
    const size = 132;
    const half = size / 2;
    const rotation = element.rotationDeg;
    const tauDisplay = utils.fromBase("stress", element.tauBase, state.unit);
    const normalColorX = element.sigmaXBase >= 0 ? "#ff5d5d" : "#56a7ff";
    const normalColorY = element.sigmaYBase >= 0 ? "#ff5d5d" : "#56a7ff";
    const shearColor = "#bf7bff";
    const shearZero = Math.abs(tauDisplay) < 1e-9;

    function markerIdFor(color) {
      if (color === shearColor) {
        return "arrow-shear";
      }

      return color === "#ff5d5d" ? "arrow-normal-tension" : "arrow-normal-compression";
    }

    function arrowH(face, outward, color) {
      const xFace = face === "right" ? half : -half;
      const near = face === "right" ? xFace + (outward ? 8 : 28) : xFace - (outward ? 8 : 28);
      const far = face === "right" ? xFace + (outward ? 52 : 8) : xFace - (outward ? 52 : 8);
      return `<line x1="${near}" y1="0" x2="${far}" y2="0" stroke="${color}" stroke-width="5" marker-end="url(#${markerIdFor(color)})"></line>`;
    }

    function arrowV(face, outward, color) {
      const yFace = face === "top" ? -half : half;
      const near = face === "top" ? yFace - (outward ? 8 : 28) : yFace + (outward ? 8 : 28);
      const far = face === "top" ? yFace - (outward ? 52 : 8) : yFace + (outward ? 52 : 8);
      return `<line x1="0" y1="${near}" x2="0" y2="${far}" stroke="${color}" stroke-width="5" marker-end="url(#${markerIdFor(color)})"></line>`;
    }

    function shearArrows() {
      if (shearZero) {
        return "";
      }

      const dir = tauDisplay >= 0 ? 1 : -1;
      return `
        <line x1="${-18 * dir}" y1="${-half - 26}" x2="${40 * dir}" y2="${-half - 26}" stroke="${shearColor}" stroke-width="5" marker-end="url(#arrow-shear)"></line>
        <line x1="${18 * dir}" y1="${half + 26}" x2="${-40 * dir}" y2="${half + 26}" stroke="${shearColor}" stroke-width="5" marker-end="url(#arrow-shear)"></line>
        <line x1="${half + 26}" y1="${-18 * dir}" x2="${half + 26}" y2="${40 * dir}" stroke="${shearColor}" stroke-width="5" marker-end="url(#arrow-shear)"></line>
        <line x1="${-half - 26}" y1="${18 * dir}" x2="${-half - 26}" y2="${-40 * dir}" stroke="${shearColor}" stroke-width="5" marker-end="url(#arrow-shear)"></line>
      `;
    }

    return `
      <div class="element-state-selector">
        ${["original", "principal", "maxShear", "average"].map(function (modeKey) {
          return `
            <button
              type="button"
              class="state-chip ${state.elementMode === modeKey ? "is-active" : ""}"
              data-element-mode="${modeKey}"
            >
              ${esc(texts.elementStates[modeKey])}
            </button>
          `;
        }).join("")}
      </div>

      <article class="preview-card element-card">
        <div class="element-card__header">
          <div>
            <h3>${esc(element.title)}</h3>
            <p>${esc(element.description)}</p>
          </div>
          <div class="element-card__angles">
            <span>${esc(`${texts.elementLabels.rotation}: ${format(rotation, 4)}°`)}</span>
            <span>${esc(element.twoThetaDeg == null ? `${texts.elementLabels.circleAngle}: —` : `${texts.elementLabels.circleAngle}: ${format(element.twoThetaDeg, 4)}°`)}</span>
          </div>
        </div>

        <div class="drawing-shell drawing-shell--diagram drawing-shell--interactive">
          <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(texts.elementTitle)}">
            <defs>
              <marker id="arrow-normal-tension" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#ff5d5d"></path></marker>
              <marker id="arrow-normal-compression" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#56a7ff"></path></marker>
              <marker id="arrow-shear" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#bf7bff"></path></marker>
            </defs>
            <line x1="${centerX}" y1="44" x2="${centerX}" y2="${height - 44}" stroke="rgba(255,255,255,0.12)" stroke-dasharray="8 8"></line>
            <line x1="56" y1="${centerY}" x2="${width - 56}" y2="${centerY}" stroke="rgba(255,255,255,0.12)" stroke-dasharray="8 8"></line>
            <g transform="translate(${centerX} ${centerY}) rotate(${-rotation})">
              <rect x="${-half}" y="${-half}" width="${size}" height="${size}" rx="14" fill="rgba(255,255,255,0.03)" stroke="#ffffff" stroke-width="3"></rect>
              ${arrowH("right", element.sigmaXBase >= 0, normalColorX)}
              ${arrowH("left", element.sigmaXBase >= 0, normalColorX)}
              ${arrowV("top", element.sigmaYBase >= 0, normalColorY)}
              ${arrowV("bottom", element.sigmaYBase >= 0, normalColorY)}
              ${shearArrows()}
            </g>
            <text x="${width - 170}" y="62" fill="#ff5d5d" font-size="14">${esc(`${element.normalXLabel} = ${formatStressBase(element.sigmaXBase, 4)}`)}</text>
            <text x="${width - 170}" y="84" fill="#56a7ff" font-size="14">${esc(`${element.normalYLabel} = ${formatStressBase(element.sigmaYBase, 4)}`)}</text>
            <text x="${width - 170}" y="106" fill="#bf7bff" font-size="14">${esc(`${element.shearLabel} = ${formatStressBase(element.tauBase, 4)}`)}</text>
            <text x="56" y="${centerY - 78}" fill="#ff5d5d" font-size="13">${esc(`${texts.elementLabels.sigmaX}: ${describeNormalType(element.sigmaXBase)}`)}</text>
            <text x="56" y="${centerY - 56}" fill="#56a7ff" font-size="13">${esc(`${texts.elementLabels.sigmaY}: ${describeNormalType(element.sigmaYBase)}`)}</text>
            <text x="56" y="${centerY - 34}" fill="#bf7bff" font-size="13">${esc(texts.elementLabels.shear)}</text>
          </svg>
        </div>
      </article>
    `;
  }

  function createCircleDrawing() {
    const texts = currentCopy();

    if (!state.result) {
      return `
        <div class="placeholder-card">
          <p>${esc(texts.drawingPlaceholder)}</p>
        </div>
      `;
    }

    const pointMap = buildPointMap();
    const sigmaX = utils.fromBase("stress", state.result.sigmaXBase, state.unit);
    const sigmaY = utils.fromBase("stress", state.result.sigmaYBase, state.unit);
    const tauXY = utils.fromBase("stress", state.result.tauXYBase, state.unit);
    const sigmaAvg = utils.fromBase("stress", state.result.sigmaAvgBase, state.unit);
    const radius = utils.fromBase("stress", state.result.radiusBase, state.unit);
    const sigma1 = utils.fromBase("stress", state.result.sigma1Base, state.unit);
    const sigma2 = utils.fromBase("stress", state.result.sigma2Base, state.unit);
    const maxX = Math.max(Math.abs(sigma1), Math.abs(sigma2), Math.abs(sigmaX), Math.abs(sigmaY), 1);
    const maxY = Math.max(Math.abs(radius), Math.abs(tauXY), 1);
    const margin = 54;
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

    const circleCenterX = x(sigmaAvg);
    const radiusPx = radius * scale;
    const coordinates = {
      pointA: { x: x(sigmaX), y: y(tauXY), color: "#ff6d6d" },
      pointB: { x: x(sigmaY), y: y(-tauXY), color: "#ff6d6d" },
      principal1: { x: x(sigma1), y: y(0), color: "#ffd166" },
      principal2: { x: x(sigma2), y: y(0), color: "#ffd166" },
      shearTop: { x: x(sigmaAvg), y: y(radius), color: "#8cffc1" },
      shearBottom: { x: x(sigmaAvg), y: y(-radius), color: "#8cffc1" },
      center: { x: circleCenterX, y: originY, color: "#ffffff" }
    };

    function pointGroup(pointKey) {
      const point = pointMap[pointKey];
      const coord = coordinates[pointKey];
      const selected = state.selectedPointKey === pointKey;
      return `
        <g
          class="mohr-point ${selected ? "is-selected" : ""}"
          data-mohr-point="${pointKey}"
          tabindex="0"
          role="button"
          aria-label="${esc(point.name)}"
        >
          <title>${esc(`${point.name}: σ = ${formatStressBase(point.sigmaBase, 4)}, τ = ${formatStressBase(point.tauBase, 4)}`)}</title>
          <circle cx="${coord.x}" cy="${coord.y}" r="${selected ? "7.6" : "5.6"}" fill="${coord.color}" stroke="${selected ? "#ffffff" : "rgba(255,255,255,0.45)"}" stroke-width="${selected ? "3.2" : "2"}"></circle>
        </g>
      `;
    }

    function label(px, py, textLabel, dx, dy) {
      return `<text x="${px + dx}" y="${py + dy}" fill="#f5f5f5" font-size="14" font-family="Poppins, sans-serif">${esc(textLabel)}</text>`;
    }

    return `
      <div class="drawing-shell drawing-shell--interactive" data-tooltip-host>
        <div class="drawing-tooltip" data-point-tooltip hidden></div>
        <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(texts.circleTitle)}">
          <defs>
            <marker id="mohrs-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
              <path d="M0 0L10 5L0 10Z" fill="#ff6d6d"></path>
            </marker>
          </defs>
          <line x1="${margin / 2}" y1="${originY}" x2="${width - margin / 2}" y2="${originY}" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" marker-end="url(#mohrs-arrow)"></line>
          <line x1="${originX}" y1="${height - margin / 2}" x2="${originX}" y2="${margin / 2}" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" marker-end="url(#mohrs-arrow)"></line>
          <text x="${width - margin}" y="${originY - 10}" fill="#ff9d9d" font-size="14">${esc(texts.drawingLabels.sigmaAxis)}</text>
          <text x="${originX + 12}" y="${margin - 8}" fill="#ff9d9d" font-size="14">${esc(texts.drawingLabels.tauAxis)}</text>
          <circle cx="${circleCenterX}" cy="${originY}" r="${radiusPx}" fill="none" stroke="#ff5a5a" stroke-width="3"></circle>
          <line x1="${circleCenterX}" y1="${originY}" x2="${coordinates.pointA.x}" y2="${coordinates.pointA.y}" stroke="#ff9d9d" stroke-width="2.5"></line>
          <line x1="${coordinates.pointA.x}" y1="${coordinates.pointA.y}" x2="${coordinates.pointB.x}" y2="${coordinates.pointB.y}" stroke="rgba(255,255,255,0.38)" stroke-dasharray="8 6" stroke-width="1.5"></line>
          ${pointGroup("center")}
          ${pointGroup("pointA")}
          ${pointGroup("pointB")}
          ${pointGroup("principal1")}
          ${pointGroup("principal2")}
          ${pointGroup("shearTop")}
          ${pointGroup("shearBottom")}
          ${label(coordinates.center.x, coordinates.center.y, texts.drawingLabels.center, 10, -10)}
          ${label(coordinates.pointA.x, coordinates.pointA.y, texts.drawingLabels.pointA, 12, -10)}
          ${label(coordinates.pointB.x, coordinates.pointB.y, texts.drawingLabels.pointB, 12, 20)}
          ${label(coordinates.principal1.x, coordinates.principal1.y, texts.drawingLabels.sigma1, 8, -12)}
          ${label(coordinates.principal2.x, coordinates.principal2.y, texts.drawingLabels.sigma2, 8, -12)}
          ${label(coordinates.shearTop.x, coordinates.shearTop.y, texts.drawingLabels.topShear, 12, -10)}
          ${label(coordinates.shearBottom.x, coordinates.shearBottom.y, texts.drawingLabels.bottomShear, 12, 22)}
          ${label((circleCenterX + coordinates.pointA.x) / 2, (originY + coordinates.pointA.y) / 2, texts.drawingLabels.radius, 10, -10)}
        </svg>
      </div>
    `;
  }

  function createPointInfoCard(pointKey) {
    const texts = currentCopy();

    if (!state.result) {
      return `
        <article class="preview-card">
          <p>${esc(texts.noResult)}</p>
        </article>
      `;
    }

    const point = buildPointMap()[pointKey || state.selectedPointKey];

    return `
      <article class="preview-card point-info-card">
        <div class="point-info-card__header">
          <h3>${esc(point.name)}</h3>
          <span class="point-info-badge">${esc(point.label)}</span>
        </div>
        <div class="point-info-grid">
          <div>
            <strong>${esc(texts.pointInfoLabels.sigma)}</strong>
            <span>${esc(formatStressBase(point.sigmaBase, 4))}</span>
          </div>
          <div>
            <strong>${esc(texts.pointInfoLabels.tau)}</strong>
            <span>${esc(formatStressBase(point.tauBase, 4))}</span>
          </div>
          <div>
            <strong>${esc(texts.pointInfoLabels.twoTheta)}</strong>
            <span>${esc(point.twoThetaDeg == null ? "—" : `${format(point.twoThetaDeg, 4)}°`)}</span>
          </div>
          <div>
            <strong>${esc(texts.pointInfoLabels.theta)}</strong>
            <span>${esc(point.thetaDeg == null ? "—" : `${format(point.thetaDeg, 4)}°`)}</span>
          </div>
        </div>
        <div class="point-info-note">
          <strong>${esc(texts.pointInfoLabels.meaning)}</strong>
          <p>${esc(point.representation)}</p>
        </div>
      </article>
    `;
  }

  function render() {
    const texts = currentCopy();
    const statusMessage = texts[state.status.key] || texts.ready;
    const statusState = state.status.state === "neutral" ? "success" : state.status.state;
    const unitOptions = utils.optionsFor("stress").map(function (unitKey) {
      return `
        <option value="${esc(unitKey)}" ${state.unit === unitKey ? "selected" : ""}>
          ${esc(unitKey)}
        </option>
      `;
    }).join("");

    const metrics = state.result ? [
      createMetricCard(texts.metrics.sigmaAvg, formatStressBase(state.result.sigmaAvgBase, 4)),
      createMetricCard(texts.metrics.radius, formatStressBase(state.result.radiusBase, 4)),
      createMetricCard(texts.metrics.sigma1, formatStressBase(state.result.sigma1Base, 4)),
      createMetricCard(texts.metrics.sigma2, formatStressBase(state.result.sigma2Base, 4)),
      createMetricCard(texts.metrics.tauMax, formatStressBase(state.result.radiusBase, 4)),
      createMetricCard(texts.metrics.theta, `${format(state.result.thetaDegrees, 4)} deg`)
    ].join("") : `
      <article class="placeholder-card" style="grid-column: 1 / -1;">
        <p>${esc(texts.noResult)}</p>
      </article>
    `;

    root.innerHTML = `
      <section class="tool-page">
        <section class="page-hero glass-card">
          <div class="page-hero__grid">
            <div>
              <span class="page-kicker">${esc(texts.kicker)}</span>
              <h1 class="page-title">${esc(texts.title)}</h1>
              <p class="page-intro">${esc(texts.intro)}</p>
              <div class="equation-row">
                ${texts.equationChips.map(function (chip) {
                  return `<span class="equation-chip">${esc(chip)}</span>`;
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
          <div class="visual-stack">
            <form id="mohrs-form" class="solver-panel glass-card" novalidate>
              <div class="panel-header">
                <h2>${esc(texts.inputTitle)}</h2>
                <p>${esc(texts.inputDescription)}</p>
              </div>

              <div class="field-grid">
                ${createFieldCard("sigmaX", texts.fields.sigmaX)}
                ${createFieldCard("sigmaY", texts.fields.sigmaY)}
                ${createFieldCard("tauXY", texts.fields.tauXY)}

                <label class="input-card field--full" for="stress-unit">
                  <span class="input-card__badge">U</span>
                  <span class="input-card__title">${esc(texts.unitLabel)}</span>
                  <span class="input-card__hint">${esc(texts.inputDescription)}</span>
                  <select id="stress-unit" name="unit" class="select-control">
                    ${unitOptions}
                  </select>
                </label>
              </div>

              <div class="action-row">
                <button type="submit" class="button button-primary">${esc(texts.solve)}</button>
                <button type="button" class="button button-secondary" data-reset>${esc(texts.reset)}</button>
              </div>

              <div class="status-banner is-visible" data-state="${esc(statusState)}" aria-live="polite">
                ${esc(statusMessage)}
              </div>
            </form>

            <section class="result-panel glass-card">
              <div class="panel-header">
                <h2>${esc(texts.resultsTitle)}</h2>
                <p>${esc(texts.circleCaption)}</p>
              </div>
              <div class="result-grid">
                ${metrics}
              </div>
            </section>

            <section class="result-panel glass-card">
              <div class="panel-header">
                <h2>${esc(texts.stepsTitle)}</h2>
                <p>${esc(texts.elementDescription)}</p>
              </div>
              <div class="steps-grid">
                ${createSteps()}
              </div>
            </section>
          </div>

          <div class="visual-stack">
            <section class="solver-panel glass-card">
              <div class="panel-header">
                <h2>${esc(texts.elementTitle)}</h2>
                <p>${esc(texts.elementDescription)}</p>
              </div>
              ${createElementDiagram()}
            </section>

            <section class="solver-panel glass-card">
              <div class="panel-header">
                <h2>${esc(texts.circleTitle)}</h2>
                <p>${esc(texts.circleDescription)}</p>
              </div>
              ${createCircleDrawing()}
              <p class="drawing-caption">${esc(texts.circleCaption)}</p>
            </section>

            <section class="solver-panel glass-card">
              <div class="panel-header">
                <h2>${esc(texts.pointInfoTitle)}</h2>
                <p>${esc(texts.pointInfoDescription)}</p>
              </div>
              <div data-point-info-panel>
                ${createPointInfoCard(state.selectedPointKey)}
              </div>
            </section>
          </div>
        </div>
      </section>
    `;

    const form = root.querySelector("#mohrs-form");
    const resetButton = root.querySelector("[data-reset]");
    const tooltip = root.querySelector("[data-point-tooltip]");
    const tooltipHost = root.querySelector("[data-tooltip-host]");
    const infoPanel = root.querySelector("[data-point-info-panel]");

    if (!form) {
      return;
    }

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

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        reset();
        render();
      });
    }

    root.querySelectorAll("[data-element-mode]").forEach(function (button) {
      button.addEventListener("click", function () {
        const nextMode = button.getAttribute("data-element-mode");

        if (!nextMode) {
          return;
        }

        state.elementMode = nextMode;
        state.selectedPointKey = canonicalPointForMode(nextMode);
        render();
      });
    });

    function renderPointInfo(pointKey) {
      if (!infoPanel) {
        return;
      }

      infoPanel.innerHTML = createPointInfoCard(pointKey);
    }

    function showTooltip(event, pointKey) {
      if (!tooltip || !tooltipHost || !state.result) {
        return;
      }

      const point = buildPointMap()[pointKey];

      if (!point) {
        return;
      }

      const hostRect = tooltipHost.getBoundingClientRect();
      const sourceNode = event && event.currentTarget ? event.currentTarget : null;
      const sourceRect = sourceNode ? sourceNode.getBoundingClientRect() : null;
      const clientX = event && typeof event.clientX === "number"
        ? event.clientX
        : sourceRect
          ? sourceRect.left + sourceRect.width / 2
          : hostRect.left + hostRect.width / 2;
      const clientY = event && typeof event.clientY === "number"
        ? event.clientY
        : sourceRect
          ? sourceRect.top + sourceRect.height / 2
          : hostRect.top + hostRect.height / 2;
      const maxLeft = Math.max(hostRect.width - 170, 16);
      const left = Math.min(Math.max(clientX - hostRect.left + 14, 16), maxLeft);
      const top = Math.max(clientY - hostRect.top - 18, 16);

      tooltip.hidden = false;
      tooltip.innerHTML = `
        <strong>${esc(point.label)}</strong>
        <span>${esc(`σ = ${formatStressBase(point.sigmaBase, 4)}`)}</span>
        <span>${esc(`τ = ${formatStressBase(point.tauBase, 4)}`)}</span>
      `;
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    }

    function hideTooltip() {
      if (!tooltip) {
        return;
      }

      tooltip.hidden = true;
    }

    root.querySelectorAll("[data-mohr-point]").forEach(function (pointNode) {
      const pointKey = pointNode.getAttribute("data-mohr-point");

      if (!pointKey) {
        return;
      }

      pointNode.addEventListener("mouseenter", function (event) {
        renderPointInfo(pointKey);
        showTooltip(event, pointKey);
      });

      pointNode.addEventListener("mousemove", function (event) {
        showTooltip(event, pointKey);
      });

      pointNode.addEventListener("mouseleave", function () {
        renderPointInfo(state.selectedPointKey);
        hideTooltip();
      });

      pointNode.addEventListener("focus", function (event) {
        renderPointInfo(pointKey);
        showTooltip(event, pointKey);
      });

      pointNode.addEventListener("blur", function () {
        renderPointInfo(state.selectedPointKey);
        hideTooltip();
      });

      pointNode.addEventListener("click", function () {
        state.selectedPointKey = pointKey;
        state.elementMode = getPointMode(pointKey);
        render();
      });

      pointNode.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          state.selectedPointKey = pointKey;
          state.elementMode = getPointMode(pointKey);
          render();
        }
      });
    });
  }

  document.addEventListener(app.eventName, function () {
    render();
  });

  reset();
  render();
})();
