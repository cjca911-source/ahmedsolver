(function () {
  "use strict";

  const app = window.StrengthSolverApp;
  const utils = window.AhmedSolverEngineering;
  const root = document.getElementById("beam-deflection-root");

  if (!app || !utils || !root) {
    return;
  }

  const copy = {
    en: {
      kicker: "Serviceability and Stiffness Tool",
      title: "Beam Deflection Calculator",
      intro:
        "Choose a classic beam case, define stiffness and loading, calculate the maximum deflection, and inspect the beam drawing with supports, loads, and the deflected shape.",
      summaryTitle: "What this page includes",
      summaryPoints: [
        "Four common beam cases: simply supported or cantilever, each with point load or uniformly distributed load.",
        "Moment of inertia can be entered directly or computed from rectangle, circle, and hollow circle sections.",
        "Unit-aware calculations, step-by-step substitution, and warnings for suspicious engineering values."
      ],
      caseTitle: "Beam type selection",
      caseDescription: "Select one loading case. The active deflection formula and drawing will update automatically.",
      inputTitle: "Beam inputs",
      inputDescription:
        "AhmedSolver converts everything to SI units internally, then reports the final deflection in the output unit you choose.",
      inertiaTitle: "Moment of inertia I",
      inertiaDescription: "Either enter I directly or compute it from a simple section shape.",
      directMode: "Enter I directly",
      shapeMode: "Calculate I from shape",
      unitLabels: {
        length: "Beam length unit",
        load: "Load unit",
        modulus: "Elastic modulus unit",
        output: "Deflection output unit",
        inertia: "Moment of inertia unit",
        shape: "Shape",
        dimension: "Dimension unit"
      },
      fieldLabels: {
        length: "Beam length L",
        load: "Load magnitude",
        modulus: "Elastic modulus E",
        inertia: "Area moment of inertia I",
        width: "Rectangle width b",
        height: "Rectangle height h",
        diameter: "Circle diameter d",
        outerDiameter: "Outer diameter D",
        innerDiameter: "Inner diameter d"
      },
      fieldHints: {
        length: "Use the clear span of the beam.",
        loadPoint: "Point load applied at the key location for the selected case.",
        loadDistributed: "Uniform load intensity along the span.",
        modulus: "Typical steel is about 200 GPa.",
        inertia: "Use the section property about the bending axis.",
        output: "Choose the unit used for the reported deflection."
      },
      shapes: {
        rectangle: "Rectangle",
        circle: "Circle",
        hollowCircle: "Hollow Circle"
      },
      formulas: {
        simplySupportedPoint: "δmax = (P L^3) / (48 E I)",
        simplySupportedUdl: "δmax = (5 w L^4) / (384 E I)",
        cantileverPoint: "δmax = (P L^3) / (3 E I)",
        cantileverUdl: "δmax = (w L^4) / (8 E I)",
        rectangle: "I = (b h^3) / 12",
        circle: "I = (pi d^4) / 64",
        hollowCircle: "I = (pi (D^4 - d^4)) / 64"
      },
      buttons: {
        solve: "Solve Deflection",
        reset: "Reset"
      },
      status: {
        ready: "Choose a beam case and enter the required geometry, stiffness, and loading.",
        missing: "Please complete all required beam inputs.",
        invalid: "Invalid number format in one or more inputs.",
        positive: "All numerical inputs must be greater than zero.",
        hollowOrder: "Inner diameter must be smaller than outer diameter.",
        success: "Beam deflection solved successfully."
      },
      drawingTitle: "Beam drawing",
      drawingDescription:
        "The drawing shows the selected support condition, the applied load, and a simple deflected shape for educational visualization.",
      drawingPlaceholder: "The beam drawing updates immediately when you change the beam type.",
      drawingCaption:
        "The deflected curve is intentionally simple and educational. It illustrates the location of maximum deflection rather than a full exact elastic curve.",
      resultsTitle: "Calculated results",
      stepsTitle: "Step-by-step solution",
      warningsTitle: "Engineering notes and warnings",
      metrics: {
        deflection: "Maximum deflection δmax",
        inertia: "Moment of inertia used",
        spanRatio: "Span / deflection ratio"
      },
      labels: {
        inertiaSi: "I in SI",
        siPreview: "SI"
      },
      caseLabels: {
        simplySupportedPoint: "Simply supported beam with center point load",
        simplySupportedUdl: "Simply supported beam with uniformly distributed load",
        cantileverPoint: "Cantilever beam with end point load",
        cantileverUdl: "Cantilever beam with uniformly distributed load"
      },
      caseLoadLabels: {
        point: "Point load P",
        distributed: "Distributed load w"
      },
      stepLabels: {
        units: "1. Convert inputs to SI base units",
        inertia: "2. Determine the moment of inertia",
        formula: "3. Select the beam formula",
        substitution: "4. Substitute the numerical values",
        result: "5. Final deflection"
      },
      warnings: {
        longSpan: "This span is very long for a simple classroom beam example. Consider whether other effects should matter.",
        shortSpan: "This span is very short. Check whether beam theory is the right model for the problem.",
        lowModulus: "Elastic modulus is outside common ranges for most structural materials. Check units and material data.",
        tinyInertia: "Moment of inertia seems very small. Check section dimensions and units carefully.",
        hugeInertia: "Moment of inertia seems unusually large for a typical student example. Verify units and shape dimensions.",
        largeDeflection: "This result may be mathematically correct but very large for common serviceability expectations.",
        serviceability: "Deflection exceeds a common L/360 serviceability reference. Review the structural stiffness.",
        tinyDeflection: "Deflection is extremely small. Check whether the load magnitude or units were entered correctly."
      }
    },
    ar: {
      kicker: "أداة الخدمة والصلابة",
      title: "حاسبة انحراف الجوائز",
      intro:
        "اختر حالة جائز شائعة، وحدد الصلابة والحمل، واحسب الانحراف الأعظمي، ثم اعرض رسم الجائز مع الركائز والأحمال والشكل المنحرف.",
      summaryTitle: "ما الذي تتضمنه هذه الصفحة",
      summaryPoints: [
        "أربع حالات شائعة: جائز بسيط أو كابولي، وكل منهما مع حمل مركز أو حمل موزع منتظم.",
        "يمكن إدخال عزم العطالة مباشرة أو حسابه من مقطع مستطيل أو دائري أو دائري مجوف.",
        "حسابات واعية للوحدات، وتعويضات خطوة بخطوة، وتحذيرات للقيم الهندسية المريبة."
      ],
      caseTitle: "اختيار نوع الجائز",
      caseDescription: "اختر حالة تحميل واحدة. ستتغير المعادلة الفعالة والرسم تلقائياً.",
      inputTitle: "مدخلات الجائز",
      inputDescription:
        "يقوم AhmedSolver بتحويل جميع القيم داخلياً إلى وحدات SI ثم يعرض الانحراف النهائي بوحدة الإخراج التي تختارها.",
      inertiaTitle: "عزم العطالة I",
      inertiaDescription: "يمكنك إدخال I مباشرة أو حسابه من شكل مقطع بسيط.",
      directMode: "إدخال I مباشرة",
      shapeMode: "حساب I من الشكل",
      unitLabels: {
        length: "وحدة طول الجائز",
        load: "وحدة الحمل",
        modulus: "وحدة معامل المرونة",
        output: "وحدة إخراج الانحراف",
        inertia: "وحدة عزم العطالة",
        shape: "الشكل",
        dimension: "وحدة الأبعاد"
      },
      fieldLabels: {
        length: "طول الجائز L",
        load: "مقدار الحمل",
        modulus: "معامل المرونة E",
        inertia: "عزم العطالة حول محور الانحناء I",
        width: "عرض المستطيل b",
        height: "ارتفاع المستطيل h",
        diameter: "قطر الدائرة d",
        outerDiameter: "القطر الخارجي D",
        innerDiameter: "القطر الداخلي d"
      },
      fieldHints: {
        length: "استخدم البحر الصافي للجائز.",
        loadPoint: "الحمل المركز عند الموقع المحدد للحالة المختارة.",
        loadDistributed: "شدة الحمل المنتظم على طول الجائز.",
        modulus: "الفولاذ النموذجي يقارب 200 GPa.",
        inertia: "استخدم خاصية المقطع حول محور الانحناء.",
        output: "اختر الوحدة التي سيعرض بها الانحراف النهائي."
      },
      shapes: {
        rectangle: "مستطيل",
        circle: "دائرة",
        hollowCircle: "دائرة مجوفة"
      },
      formulas: {
        simplySupportedPoint: "δmax = (P L^3) / (48 E I)",
        simplySupportedUdl: "δmax = (5 w L^4) / (384 E I)",
        cantileverPoint: "δmax = (P L^3) / (3 E I)",
        cantileverUdl: "δmax = (w L^4) / (8 E I)",
        rectangle: "I = (b h^3) / 12",
        circle: "I = (pi d^4) / 64",
        hollowCircle: "I = (pi (D^4 - d^4)) / 64"
      },
      buttons: {
        solve: "احسب الانحراف",
        reset: "إعادة ضبط"
      },
      status: {
        ready: "اختر حالة الجائز ثم أدخل الأبعاد والصلابة والحمل المطلوب.",
        missing: "يرجى إكمال جميع المدخلات المطلوبة للجائز.",
        invalid: "تنسيق الرقم غير صالح في واحد أو أكثر من المدخلات.",
        positive: "يجب أن تكون جميع القيم العددية أكبر من الصفر.",
        hollowOrder: "يجب أن يكون القطر الداخلي أصغر من القطر الخارجي.",
        success: "تم حل انحراف الجائز بنجاح."
      },
      drawingTitle: "رسم الجائز",
      drawingDescription:
        "يعرض الرسم نوع الارتكاز المختار والحمل المطبق وشكلاً تعليمياً بسيطاً للانحراف.",
      drawingPlaceholder: "يتم تحديث رسم الجائز مباشرة عند تغيير نوع الجائز.",
      drawingCaption:
        "المنحنى المنحرف هنا تعليمي ومبسط. يوضح موضع الانحراف الأعظمي ولا يمثل منحنى المرونة الدقيق بالكامل.",
      resultsTitle: "النتائج المحسوبة",
      stepsTitle: "الحل خطوة بخطوة",
      warningsTitle: "ملاحظات وتحذيرات هندسية",
      metrics: {
        deflection: "الانحراف الأعظمي δmax",
        inertia: "عزم العطالة المستخدم",
        spanRatio: "نسبة البحر إلى الانحراف"
      },
      labels: {
        inertiaSi: "I بوحدات SI",
        siPreview: "SI"
      },
      caseLabels: {
        simplySupportedPoint: "جائز بسيط مع حمل مركز في المنتصف",
        simplySupportedUdl: "جائز بسيط مع حمل موزع منتظم",
        cantileverPoint: "جائز كابولي مع حمل مركز عند الطرف",
        cantileverUdl: "جائز كابولي مع حمل موزع منتظم"
      },
      caseLoadLabels: {
        point: "الحمل المركز P",
        distributed: "شدة الحمل الموزع w"
      },
      stepLabels: {
        units: "1. تحويل المدخلات إلى وحدات SI",
        inertia: "2. تحديد عزم العطالة",
        formula: "3. اختيار معادلة الجائز",
        substitution: "4. التعويض بالقيم العددية",
        result: "5. الانحراف النهائي"
      },
      warnings: {
        longSpan: "هذا البحر طويل جداً بالنسبة إلى مثال تدريسي بسيط. فكر فيما إذا كانت هناك تأثيرات إضافية يجب أخذها بالحسبان.",
        shortSpan: "هذا البحر قصير جداً. تحقق مما إذا كانت نظرية الجوائز هي النموذج المناسب للمسألة.",
        lowModulus: "معامل المرونة خارج الحدود الشائعة لمعظم المواد الإنشائية. تحقق من الوحدات وبيانات المادة.",
        tinyInertia: "عزم العطالة يبدو صغيراً جداً. تحقق من أبعاد المقطع ووحداته بعناية.",
        hugeInertia: "عزم العطالة يبدو كبيراً بشكل غير معتاد بالنسبة إلى مثال طلابي نموذجي. تحقق من الوحدات وأبعاد الشكل.",
        largeDeflection: "قد تكون النتيجة صحيحة رياضياً لكنها كبيرة جداً مقارنة بتوقعات الخدمة الشائعة.",
        serviceability: "الانحراف يتجاوز مرجع خدمة شائع من نوع L/360. راجع صلابة العنصر الإنشائي.",
        tinyDeflection: "الانحراف صغير جداً. تحقق مما إذا كانت قيمة الحمل أو الوحدات قد أُدخلت بشكل صحيح."
      }
    }
  };

  const cases = {
    simplySupportedPoint: {
      loadType: "point",
      solve: function (base) {
        return (base.load * Math.pow(base.length, 3)) / (48 * base.modulus * base.inertia);
      }
    },
    simplySupportedUdl: {
      loadType: "distributed",
      solve: function (base) {
        return (5 * base.load * Math.pow(base.length, 4)) / (384 * base.modulus * base.inertia);
      }
    },
    cantileverPoint: {
      loadType: "point",
      solve: function (base) {
        return (base.load * Math.pow(base.length, 3)) / (3 * base.modulus * base.inertia);
      }
    },
    cantileverUdl: {
      loadType: "distributed",
      solve: function (base) {
        return (base.load * Math.pow(base.length, 4)) / (8 * base.modulus * base.inertia);
      }
    }
  };

  const beamUnits = {
    length: ["mm", "cm", "m"],
    pointLoad: ["N", "kN"],
    lineLoad: ["N/m", "kN/m"],
    modulus: ["MPa", "GPa"],
    inertia: ["mm4", "cm4", "m4"],
    output: ["mm", "cm", "m"],
    dimensions: ["mm", "cm", "m"]
  };

  const state = {
    beamCase: "simplySupportedPoint",
    length: "",
    lengthUnit: "m",
    load: "",
    loadUnit: "kN",
    modulus: "",
    modulusUnit: "GPa",
    outputUnit: "mm",
    inertiaMode: "direct",
    inertia: "",
    inertiaUnit: "mm4",
    inertiaShape: "rectangle",
    inertiaDimensionUnit: "mm",
    shapeWidth: "",
    shapeHeight: "",
    shapeDiameter: "",
    shapeOuterDiameter: "",
    shapeInnerDiameter: "",
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

  function formatUnit(category, value, unitKey, decimals) {
    return utils.formatWithUnit(category, value, unitKey, app.getLanguage(), decimals);
  }

  function buildCaseOptions(texts) {
    return Object.keys(cases).map(function (caseKey) {
      return `
        <label class="case-option">
          <input type="radio" name="beamCase" value="${caseKey}" ${state.beamCase === caseKey ? "checked" : ""}>
          <span>${esc(texts.caseLabels[caseKey])}</span>
        </label>
      `;
    }).join("");
  }

  function getAllowedLoadUnits() {
    return cases[state.beamCase].loadType === "point" ? beamUnits.pointLoad : beamUnits.lineLoad;
  }

  function buildShapeFields(texts) {
    const sharedUnitSelect = `
      <div class="field">
        <label for="inertiaDimensionUnit">${esc(texts.unitLabels.dimension)}</label>
        <select id="inertiaDimensionUnit" name="inertiaDimensionUnit" class="select-control">
          ${beamUnits.dimensions.map(function (unitKey) {
            return `<option value="${unitKey}" ${state.inertiaDimensionUnit === unitKey ? "selected" : ""}>${unitKey}</option>`;
          }).join("")}
        </select>
      </div>
      <div class="field">
        <label for="inertiaUnit">${esc(texts.unitLabels.inertia)}</label>
        <select id="inertiaUnit" name="inertiaUnit" class="select-control">
          ${beamUnits.inertia.map(function (unitKey) {
            return `<option value="${unitKey}" ${state.inertiaUnit === unitKey ? "selected" : ""}>${unitKey}</option>`;
          }).join("")}
        </select>
      </div>
    `;

    let fields = "";

    if (state.inertiaShape === "rectangle") {
      fields = `
        <div class="field">
          <label for="shapeWidth">${esc(texts.fieldLabels.width)}</label>
          <input id="shapeWidth" name="shapeWidth" class="input-control" type="text" inputmode="decimal" value="${esc(state.shapeWidth)}">
        </div>
        <div class="field">
          <label for="shapeHeight">${esc(texts.fieldLabels.height)}</label>
          <input id="shapeHeight" name="shapeHeight" class="input-control" type="text" inputmode="decimal" value="${esc(state.shapeHeight)}">
        </div>
      `;
    } else if (state.inertiaShape === "circle") {
      fields = `
        <div class="field">
          <label for="shapeDiameter">${esc(texts.fieldLabels.diameter)}</label>
          <input id="shapeDiameter" name="shapeDiameter" class="input-control" type="text" inputmode="decimal" value="${esc(state.shapeDiameter)}">
        </div>
      `;
    } else {
      fields = `
        <div class="field">
          <label for="shapeOuterDiameter">${esc(texts.fieldLabels.outerDiameter)}</label>
          <input id="shapeOuterDiameter" name="shapeOuterDiameter" class="input-control" type="text" inputmode="decimal" value="${esc(state.shapeOuterDiameter)}">
        </div>
        <div class="field">
          <label for="shapeInnerDiameter">${esc(texts.fieldLabels.innerDiameter)}</label>
          <input id="shapeInnerDiameter" name="shapeInnerDiameter" class="input-control" type="text" inputmode="decimal" value="${esc(state.shapeInnerDiameter)}">
        </div>
      `;
    }

    return `
      <div class="field-grid">
        <div class="field">
          <label for="inertiaShape">${esc(texts.unitLabels.shape)}</label>
          <select id="inertiaShape" name="inertiaShape" class="select-control">
            ${Object.keys(texts.shapes).map(function (shapeKey) {
              return `<option value="${shapeKey}" ${state.inertiaShape === shapeKey ? "selected" : ""}>${esc(texts.shapes[shapeKey])}</option>`;
            }).join("")}
          </select>
        </div>
        ${sharedUnitSelect}
      </div>

      <div class="field-grid" style="margin-top: 0.9rem;">
        ${fields}
      </div>
    `;
  }

  function computeShapeInertia() {
    const texts = currentCopy();
    const dimensionUnit = state.inertiaDimensionUnit;
    const formulaLabel = texts.formulas[state.inertiaShape];
    let result = null;

    if (state.inertiaShape === "rectangle") {
      const width = utils.parseNumber(state.shapeWidth);
      const height = utils.parseNumber(state.shapeHeight);

      if (width.empty || height.empty) {
        return { ok: false, missing: true };
      }

      if (!width.ok || !height.ok) {
        return { ok: false, invalid: true };
      }

      if (width.value <= 0 || height.value <= 0) {
        return { ok: false, positive: true };
      }

      const widthBase = utils.convertLengthToMeters(width.value, dimensionUnit);
      const heightBase = utils.convertLengthToMeters(height.value, dimensionUnit);

      result = (widthBase * Math.pow(heightBase, 3)) / 12;

      return {
        ok: true,
        value: result,
        formulaLabel: formulaLabel,
        detail:
          `b = ${formatUnit("length", width.value, dimensionUnit, 4)}, ` +
          `h = ${formatUnit("length", height.value, dimensionUnit, 4)}`
      };
    }

    if (state.inertiaShape === "circle") {
      const diameter = utils.parseNumber(state.shapeDiameter);

      if (diameter.empty) {
        return { ok: false, missing: true };
      }

      if (!diameter.ok) {
        return { ok: false, invalid: true };
      }

      if (diameter.value <= 0) {
        return { ok: false, positive: true };
      }

      const diameterBase = utils.convertLengthToMeters(diameter.value, dimensionUnit);
      result = (Math.PI * Math.pow(diameterBase, 4)) / 64;

      return {
        ok: true,
        value: result,
        formulaLabel: formulaLabel,
        detail: `d = ${formatUnit("length", diameter.value, dimensionUnit, 4)}`
      };
    }

    const outer = utils.parseNumber(state.shapeOuterDiameter);
    const inner = utils.parseNumber(state.shapeInnerDiameter);

    if (outer.empty || inner.empty) {
      return { ok: false, missing: true };
    }

    if (!outer.ok || !inner.ok) {
      return { ok: false, invalid: true };
    }

    if (outer.value <= 0 || inner.value <= 0) {
      return { ok: false, positive: true };
    }

    if (inner.value >= outer.value) {
      return { ok: false, order: true };
    }

    const outerBase = utils.convertLengthToMeters(outer.value, dimensionUnit);
    const innerBase = utils.convertLengthToMeters(inner.value, dimensionUnit);
    result = (Math.PI * (Math.pow(outerBase, 4) - Math.pow(innerBase, 4))) / 64;

    return {
      ok: true,
      value: result,
      formulaLabel: formulaLabel,
      detail:
        `D = ${formatUnit("length", outer.value, dimensionUnit, 4)}, ` +
        `d = ${formatUnit("length", inner.value, dimensionUnit, 4)}`
    };
  }

  function evaluateWarnings(base, deflectionBase) {
    const texts = currentCopy();
    const warnings = [];

    if (base.length > 30) {
      warnings.push(texts.warnings.longSpan);
    }

    if (base.length < 0.05) {
      warnings.push(texts.warnings.shortSpan);
    }

    if (base.modulus < 1e9 || base.modulus > 3.5e11) {
      warnings.push(texts.warnings.lowModulus);
    }

    if (base.inertia < 1e-10) {
      warnings.push(texts.warnings.tinyInertia);
    }

    if (base.inertia > 1) {
      warnings.push(texts.warnings.hugeInertia);
    }

    if (deflectionBase > base.length / 50) {
      warnings.push(texts.warnings.largeDeflection);
    } else if (deflectionBase > base.length / 360) {
      warnings.push(texts.warnings.serviceability);
    }

    if (deflectionBase < 1e-9) {
      warnings.push(texts.warnings.tinyDeflection);
    }

    return warnings;
  }

  function solve() {
    const texts = currentCopy();
    const activeCase = cases[state.beamCase];
    const length = utils.parseNumber(state.length);
    const load = utils.parseNumber(state.load);
    const modulus = utils.parseNumber(state.modulus);

    if (length.empty || load.empty || modulus.empty) {
      state.result = null;
      state.status = { state: "error", message: texts.status.missing };
      return;
    }

    if (!length.ok || !load.ok || !modulus.ok) {
      state.result = null;
      state.status = { state: "error", message: texts.status.invalid };
      return;
    }

    if (length.value <= 0 || load.value <= 0 || modulus.value <= 0) {
      state.result = null;
      state.status = { state: "error", message: texts.status.positive };
      return;
    }

    let inertiaBase = NaN;
    let inertiaSummary = null;

    if (state.inertiaMode === "direct") {
      const inertia = utils.parseNumber(state.inertia);

      if (inertia.empty) {
        state.result = null;
        state.status = { state: "error", message: texts.status.missing };
        return;
      }

      if (!inertia.ok) {
        state.result = null;
        state.status = { state: "error", message: texts.status.invalid };
        return;
      }

      if (inertia.value <= 0) {
        state.result = null;
        state.status = { state: "error", message: texts.status.positive };
        return;
      }

      inertiaBase = utils.convertInertiaToMetersFourth(inertia.value, state.inertiaUnit);
      inertiaSummary = {
        mode: "direct",
        label: texts.fieldLabels.inertia,
        detail: `${formatUnit("inertia", inertia.value, state.inertiaUnit, 4)}`
      };
    } else {
      const shapeResult = computeShapeInertia();

      if (!shapeResult.ok) {
        state.result = null;
        state.status = {
          state: "error",
          message: shapeResult.order ? texts.status.hollowOrder : shapeResult.invalid ? texts.status.invalid : shapeResult.positive ? texts.status.positive : texts.status.missing
        };
        return;
      }

      inertiaBase = shapeResult.value;
      inertiaSummary = {
        mode: "shape",
        label: shapeResult.formulaLabel,
        detail: shapeResult.detail
      };
    }

    const base = {
      length: utils.convertLengthToMeters(length.value, state.lengthUnit),
      load: activeCase.loadType === "point"
        ? utils.convertForceToNewtons(load.value, state.loadUnit)
        : utils.convertLineLoadToNewtonPerMeter(load.value, state.loadUnit),
      modulus: utils.convertModulusToPascals(modulus.value, state.modulusUnit),
      inertia: inertiaBase
    };

    const deflectionBase = activeCase.solve(base);
    const outputDeflection = utils.convertMetersToLength(deflectionBase, state.outputUnit);
    const inertiaDisplay = utils.convertMetersFourthToInertia(inertiaBase, state.inertiaUnit);
    const inertiaOutputUnit = state.inertiaUnit;

    state.result = {
      base: base,
      deflectionBase: deflectionBase,
      outputDeflection: outputDeflection,
      inertiaDisplay: inertiaDisplay,
      inertiaOutputUnit: inertiaOutputUnit,
      inertiaSummary: inertiaSummary,
      warnings: evaluateWarnings(base, deflectionBase)
    };
    state.status = { state: "success", message: texts.status.success };
  }

  function reset() {
    state.beamCase = "simplySupportedPoint";
    state.length = "";
    state.lengthUnit = "m";
    state.load = "";
    state.loadUnit = "kN";
    state.modulus = "";
    state.modulusUnit = "GPa";
    state.outputUnit = "mm";
    state.inertiaMode = "direct";
    state.inertia = "";
    state.inertiaUnit = "mm4";
    state.inertiaShape = "rectangle";
    state.inertiaDimensionUnit = "mm";
    state.shapeWidth = "";
    state.shapeHeight = "";
    state.shapeDiameter = "";
    state.shapeOuterDiameter = "";
    state.shapeInnerDiameter = "";
    state.result = null;
    state.status = {
      state: "neutral",
      message: currentCopy().status.ready
    };
  }

  function buildSteps() {
    const texts = currentCopy();

    if (!state.result) {
      return `
        <article class="placeholder-card">
          <p>${esc(texts.status.ready)}</p>
        </article>
      `;
    }

    const activeCase = cases[state.beamCase];
    const loadCategory = activeCase.loadType === "point" ? "force" : "lineLoad";
    const loadLabel = activeCase.loadType === "point" ? texts.caseLoadLabels.point : texts.caseLoadLabels.distributed;
    const formula = texts.formulas[state.beamCase];
    const loadSymbol = activeCase.loadType === "point" ? "P" : "w";
    const loadDisplay = utils.parseNumber(state.load).value;
    const modulusDisplay = utils.parseNumber(state.modulus).value;
    const lengthDisplay = utils.parseNumber(state.length).value;
    const inertiaInfo = state.result.inertiaSummary;
    const inertiaUsedDisplay = formatUnit("inertia", state.result.inertiaDisplay, state.result.inertiaOutputUnit, 4);
    const inertiaBaseDisplay = formatUnit("inertia", state.result.base.inertia, "m4", 8);
    const steps = [
      {
        title: texts.stepLabels.units,
        equation:
          `L = ${formatUnit("length", lengthDisplay, state.lengthUnit, 4)} = ${formatUnit("length", state.result.base.length, "m", 6)}\n` +
          `${loadSymbol} = ${formatUnit(loadCategory, loadDisplay, state.loadUnit, 4)} = ${formatUnit(loadCategory, state.result.base.load, loadCategory === "force" ? "N" : "N/m", 6)}\n` +
          `E = ${formatUnit("modulus", modulusDisplay, state.modulusUnit, 4)} = ${formatUnit("modulus", state.result.base.modulus, "Pa", 6)}`
      },
      {
        title: texts.stepLabels.inertia,
        equation:
          `${inertiaInfo.label}\n` +
          `${inertiaInfo.detail}\n` +
          `I used = ${inertiaUsedDisplay}\n` +
          `${texts.labels.inertiaSi} = ${inertiaBaseDisplay}`
      },
      {
        title: texts.stepLabels.formula,
        equation: formula
      },
      {
        title: texts.stepLabels.substitution,
        equation:
          `δmax = ${activeCase.loadType === "point"
            ? state.beamCase === "simplySupportedPoint"
              ? `(P L^3) / (48 E I)`
              : `(P L^3) / (3 E I)`
            : state.beamCase === "simplySupportedUdl"
              ? `(5 w L^4) / (384 E I)`
              : `(w L^4) / (8 E I)`}\n` +
          `δmax = ${format(state.result.deflectionBase, 8)} m`
      },
      {
        title: texts.stepLabels.result,
        equation:
          `δmax = ${formatUnit("length", state.result.outputDeflection, state.outputUnit, 6)}\n` +
          `Span / deflection = ${format(state.result.base.length / state.result.deflectionBase, 2)}`
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

  function buildWarnings() {
    const texts = currentCopy();

    if (!state.result) {
      return `
        <article class="placeholder-card">
          <p>${esc(texts.status.ready)}</p>
        </article>
      `;
    }

    if (!state.result.warnings.length) {
      return `
        <article class="preview-card">
          <p>${app.getLanguage() === "ar" ? "لا توجد مؤشرات تحذيرية واضحة لهذه القيم. استمر مع التفسير الهندسي المعتاد." : "No major realism warnings were triggered for these values. Continue with normal engineering interpretation."}</p>
        </article>
      `;
    }

    return `
      <article class="preview-card">
        <ul class="warning-list">
          ${state.result.warnings.map(function (warning) {
            return `<li>${esc(warning)}</li>`;
          }).join("")}
        </ul>
      </article>
    `;
  }

  function buildDrawing() {
    const texts = currentCopy();
    const width = 760;
    const height = 320;
    const left = 90;
    const right = 680;
    const beamY = 150;
    const centerX = (left + right) / 2;
    const activeCase = state.beamCase;
    let supports = "";
    let loads = "";
    let deflection = "";
    let maxPointX = centerX;

    function pointLoad(xPosition, label) {
      return `
        <line x1="${xPosition}" y1="46" x2="${xPosition}" y2="${beamY - 10}" stroke="#ff6d6d" stroke-width="4" marker-end="url(#beam-arrow)"></line>
        <text x="${xPosition + 10}" y="52" fill="#f5f5f5" font-size="15">${esc(label)}</text>
      `;
    }

    function udl(label) {
      const arrows = [];
      for (let index = 0; index < 8; index += 1) {
        const xPosition = left + ((right - left) / 7) * index;
        arrows.push(`<line x1="${xPosition}" y1="62" x2="${xPosition}" y2="${beamY - 10}" stroke="#ff6d6d" stroke-width="2.4" marker-end="url(#beam-arrow)"></line>`);
      }

      arrows.push(`<text x="${centerX - 12}" y="48" fill="#f5f5f5" font-size="15">${esc(label)}</text>`);
      return arrows.join("");
    }

    if (activeCase === "simplySupportedPoint" || activeCase === "simplySupportedUdl") {
      supports = `
        <polygon points="${left},${beamY + 8} ${left - 18},${beamY + 42} ${left + 18},${beamY + 42}" fill="rgba(255,255,255,0.72)"></polygon>
        <circle cx="${right}" cy="${beamY + 28}" r="10" fill="rgba(255,255,255,0.72)"></circle>
        <line x1="${right - 20}" y1="${beamY + 40}" x2="${right + 20}" y2="${beamY + 40}" stroke="rgba(255,255,255,0.72)" stroke-width="4"></line>
      `;
      maxPointX = centerX;
      deflection = activeCase === "simplySupportedPoint"
        ? `M ${left} ${beamY} Q ${centerX} ${beamY + 42} ${right} ${beamY}`
        : `M ${left} ${beamY} C ${left + 160} ${beamY + 18}, ${right - 160} ${beamY + 18}, ${right} ${beamY} M ${left} ${beamY} Q ${centerX} ${beamY + 34} ${right} ${beamY}`;
    } else {
      supports = `
        <rect x="${left - 24}" y="${beamY - 54}" width="24" height="108" fill="rgba(255,255,255,0.78)"></rect>
        <line x1="${left - 24}" y1="${beamY - 54}" x2="${left - 44}" y2="${beamY - 76}" stroke="rgba(255,255,255,0.45)" stroke-width="4"></line>
        <line x1="${left - 24}" y1="${beamY - 26}" x2="${left - 44}" y2="${beamY - 48}" stroke="rgba(255,255,255,0.45)" stroke-width="4"></line>
        <line x1="${left - 24}" y1="${beamY + 2}" x2="${left - 44}" y2="${beamY - 20}" stroke="rgba(255,255,255,0.45)" stroke-width="4"></line>
        <line x1="${left - 24}" y1="${beamY + 30}" x2="${left - 44}" y2="${beamY + 8}" stroke="rgba(255,255,255,0.45)" stroke-width="4"></line>
        <line x1="${left - 24}" y1="${beamY + 58}" x2="${left - 44}" y2="${beamY + 36}" stroke="rgba(255,255,255,0.45)" stroke-width="4"></line>
      `;
      maxPointX = right;
      deflection = activeCase === "cantileverPoint"
        ? `M ${left} ${beamY} C ${left + 140} ${beamY + 2}, ${left + 300} ${beamY + 18}, ${right} ${beamY + 48}`
        : `M ${left} ${beamY} C ${left + 120} ${beamY + 4}, ${left + 280} ${beamY + 24}, ${right} ${beamY + 58}`;
    }

    loads = activeCase === "simplySupportedPoint" || activeCase === "cantileverPoint"
      ? pointLoad(activeCase === "cantileverPoint" ? right : centerX, activeCase === "cantileverPoint" || activeCase === "simplySupportedPoint" ? "P" : "w")
      : udl("w");

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(texts.drawingTitle)}">
        <defs>
          <marker id="beam-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0 0L10 5L0 10Z" fill="#ff6d6d"></path>
          </marker>
        </defs>
        <line x1="${left}" y1="${beamY}" x2="${right}" y2="${beamY}" stroke="#ffffff" stroke-width="8" stroke-linecap="round"></line>
        ${supports}
        ${loads}
        <path d="${deflection}" fill="none" stroke="#ff7a7a" stroke-width="4" stroke-linecap="round"></path>
        <circle cx="${maxPointX}" cy="${activeCase.indexOf("cantilever") === 0 ? beamY + 48 : beamY + 34}" r="5" fill="#ffd166"></circle>
        <text x="${maxPointX + 10}" y="${activeCase.indexOf("cantilever") === 0 ? beamY + 62 : beamY + 48}" fill="#ffd166" font-size="15">δmax</text>
        <line x1="${left}" y1="${beamY + 92}" x2="${right}" y2="${beamY + 92}" stroke="rgba(255,255,255,0.46)" stroke-width="2"></line>
        <line x1="${left}" y1="${beamY + 82}" x2="${left}" y2="${beamY + 102}" stroke="rgba(255,255,255,0.46)" stroke-width="2"></line>
        <line x1="${right}" y1="${beamY + 82}" x2="${right}" y2="${beamY + 102}" stroke="rgba(255,255,255,0.46)" stroke-width="2"></line>
        <text x="${centerX - 6}" y="${beamY + 118}" fill="#f5f5f5" font-size="15">L</text>
      </svg>
    `;
  }

  function buildShapePreview(texts) {
    if (state.inertiaMode !== "shape") {
      return "";
    }

    const preview = computeShapeInertia();

    if (!preview.ok) {
      return `
        <div class="preview-card">
          <p>${esc(texts.formulas[state.inertiaShape])}</p>
        </div>
      `;
    }

    const inertiaSelected = utils.convertMetersFourthToInertia(preview.value, state.inertiaUnit);
    const inertiaM4 = preview.value;

    return `
      <div class="preview-card" style="margin-top: 0.9rem;">
        <h3>${esc(texts.formulas[state.inertiaShape])}</h3>
        <p>${esc(preview.detail)}</p>
        <p>${esc("I = ")}${esc(formatUnit("inertia", inertiaSelected, state.inertiaUnit, 4))}</p>
        <p>${esc(`${texts.labels.siPreview}: `)}${esc(formatUnit("inertia", inertiaM4, "m4", 8))}</p>
      </div>
    `;
  }

  function render() {
    const texts = currentCopy();
    const activeCase = cases[state.beamCase];
    const loadLabel = activeCase.loadType === "point" ? texts.caseLoadLabels.point : texts.caseLoadLabels.distributed;
    const loadHint = activeCase.loadType === "point" ? texts.fieldHints.loadPoint : texts.fieldHints.loadDistributed;
    const loadUnits = getAllowedLoadUnits();
    const formula = texts.formulas[state.beamCase];
    const statusMessage = state.status.message || texts.status.ready;
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
                <span class="equation-chip">${esc(formula)}</span>
                ${state.inertiaMode === "shape" ? `<span class="equation-chip">${esc(texts.formulas[state.inertiaShape])}</span>` : ""}
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
          <form id="beam-form" class="solver-panel glass-card">
            <div class="panel-header">
              <h2>${esc(texts.caseTitle)}</h2>
              <p>${esc(texts.caseDescription)}</p>
            </div>

            <div class="option-grid">
              ${buildCaseOptions(texts)}
            </div>

            <div class="subsection">
              <div class="panel-header">
                <h3>${esc(texts.inputTitle)}</h3>
                <p>${esc(texts.inputDescription)}</p>
              </div>

              <div class="field-grid">
                <label class="input-card" for="length">
                  <span class="input-card__badge">L</span>
                  <span class="input-card__title">${esc(texts.fieldLabels.length)}</span>
                  <span class="input-card__hint">${esc(texts.fieldHints.length)}</span>
                  <input id="length" name="length" class="input-control" type="text" inputmode="decimal" value="${esc(state.length)}">
                  <select id="lengthUnit" name="lengthUnit" class="select-control">
                    ${beamUnits.length.map(function (unitKey) {
                      return `<option value="${unitKey}" ${state.lengthUnit === unitKey ? "selected" : ""}>${unitKey}</option>`;
                    }).join("")}
                  </select>
                </label>

                <label class="input-card" for="load">
                  <span class="input-card__badge">${activeCase.loadType === "point" ? "P" : "w"}</span>
                  <span class="input-card__title">${esc(loadLabel)}</span>
                  <span class="input-card__hint">${esc(loadHint)}</span>
                  <input id="load" name="load" class="input-control" type="text" inputmode="decimal" value="${esc(state.load)}">
                  <select id="loadUnit" name="loadUnit" class="select-control">
                    ${loadUnits.map(function (unitKey) {
                      return `<option value="${unitKey}" ${state.loadUnit === unitKey ? "selected" : ""}>${unitKey}</option>`;
                    }).join("")}
                  </select>
                </label>

                <label class="input-card" for="modulus">
                  <span class="input-card__badge">E</span>
                  <span class="input-card__title">${esc(texts.fieldLabels.modulus)}</span>
                  <span class="input-card__hint">${esc(texts.fieldHints.modulus)}</span>
                  <input id="modulus" name="modulus" class="input-control" type="text" inputmode="decimal" value="${esc(state.modulus)}">
                  <select id="modulusUnit" name="modulusUnit" class="select-control">
                    ${beamUnits.modulus.map(function (unitKey) {
                      return `<option value="${unitKey}" ${state.modulusUnit === unitKey ? "selected" : ""}>${unitKey}</option>`;
                    }).join("")}
                  </select>
                </label>

                <label class="input-card" for="outputUnit">
                  <span class="input-card__badge">δ</span>
                  <span class="input-card__title">${esc(texts.unitLabels.output)}</span>
                  <span class="input-card__hint">${esc(texts.fieldHints.output)}</span>
                  <select id="outputUnit" name="outputUnit" class="select-control">
                    ${beamUnits.output.map(function (unitKey) {
                      return `<option value="${unitKey}" ${state.outputUnit === unitKey ? "selected" : ""}>${unitKey}</option>`;
                    }).join("")}
                  </select>
                </label>
              </div>
            </div>

            <div class="subsection">
              <div class="panel-header">
                <h3>${esc(texts.inertiaTitle)}</h3>
                <p>${esc(texts.inertiaDescription)}</p>
              </div>

              <div class="toggle-grid">
                <label class="toggle-option">
                  <input type="radio" name="inertiaMode" value="direct" ${state.inertiaMode === "direct" ? "checked" : ""}>
                  <span>${esc(texts.directMode)}</span>
                </label>
                <label class="toggle-option">
                  <input type="radio" name="inertiaMode" value="shape" ${state.inertiaMode === "shape" ? "checked" : ""}>
                  <span>${esc(texts.shapeMode)}</span>
                </label>
              </div>

              ${state.inertiaMode === "direct" ? `
                <div class="field-grid" style="margin-top: 0.9rem;">
                  <label class="input-card" for="inertia">
                    <span class="input-card__badge">I</span>
                    <span class="input-card__title">${esc(texts.fieldLabels.inertia)}</span>
                    <span class="input-card__hint">${esc(texts.fieldHints.inertia)}</span>
                    <input id="inertia" name="inertia" class="input-control" type="text" inputmode="decimal" value="${esc(state.inertia)}">
                    <select id="inertiaUnit" name="inertiaUnit" class="select-control">
                      ${beamUnits.inertia.map(function (unitKey) {
                        return `<option value="${unitKey}" ${state.inertiaUnit === unitKey ? "selected" : ""}>${unitKey}</option>`;
                      }).join("")}
                    </select>
                  </label>
                </div>
              ` : `
                ${buildShapeFields(texts)}
                ${buildShapePreview(texts)}
              `}
            </div>

            <div class="action-row">
              <button class="button button-primary" type="submit">${esc(texts.buttons.solve)}</button>
              <button class="button button-secondary" type="button" data-reset>${esc(texts.buttons.reset)}</button>
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
              ${buildDrawing()}
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
                `
                  <article class="metric-card">
                    <h3>${esc(texts.metrics.deflection)}</h3>
                    <span class="metric-value">${esc(formatUnit("length", state.result.outputDeflection, state.outputUnit, 6))}</span>
                  </article>
                `,
                `
                  <article class="metric-card">
                    <h3>${esc(texts.metrics.inertia)}</h3>
                    <span class="metric-value">${esc(formatUnit("inertia", state.result.inertiaDisplay, state.result.inertiaOutputUnit, 4))}</span>
                  </article>
                `,
                `
                  <article class="metric-card">
                    <h3>${esc(texts.metrics.spanRatio)}</h3>
                    <span class="metric-value">${esc(format(state.result.base.length / state.result.deflectionBase, 2))}</span>
                  </article>
                `
              ].join("") : `
                <article class="placeholder-card" style="grid-column: 1 / -1;">
                  <p>${esc(texts.status.ready)}</p>
                </article>
              `}
            </div>
            <div class="panel-header" style="margin-top: 1.1rem;">
              <h3>${esc(texts.warningsTitle)}</h3>
            </div>
            ${buildWarnings()}
          </section>

          <section class="result-panel glass-card">
            <div class="panel-header">
              <h2>${esc(texts.stepsTitle)}</h2>
            </div>
            <div class="steps-grid">
              ${buildSteps()}
            </div>
          </section>
        </div>
      </section>
    `;

    const form = root.querySelector("#beam-form");
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

      if (
        event.target.name === "beamCase" ||
        event.target.name === "inertiaMode" ||
        event.target.name === "inertiaShape"
      ) {
        if (event.target.name === "beamCase") {
          state.loadUnit = cases[state.beamCase].loadType === "point" ? "kN" : "kN/m";
        }

        render();
      }
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
