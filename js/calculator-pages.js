(function () {
  "use strict";

  const app = window.StrengthSolverApp;
  const root = document.getElementById("tool-root");
  const exportStorageKey = "ahmedsolver-export-history";

  if (!app || !root) {
    return;
  }

  const state = { values: {}, result: null };
  const configs = {};
  const unitCatalog = {
    force: {
      units: {
        N: { symbol: "N", factor: 1, label: { en: "newton", ar: "نيوتن" } },
        kN: { symbol: "kN", factor: 1000, label: { en: "kilonewton", ar: "كيلو نيوتن" } },
        lbf: { symbol: "lbf", factor: 4.4482216152605, label: { en: "pound-force", ar: "رطل-قوة" } }
      }
    },
    stress: {
      units: {
        Pa: { symbol: "Pa", factor: 1, label: { en: "pascal", ar: "باسكال" } },
        kPa: { symbol: "kPa", factor: 1000, label: { en: "kilopascal", ar: "كيلو باسكال" } },
        MPa: { symbol: "MPa", factor: 1000000, label: { en: "megapascal", ar: "ميغاباسكال" } },
        GPa: { symbol: "GPa", factor: 1000000000, label: { en: "gigapascal", ar: "غيغاباسكال" } },
        psi: { symbol: "psi", factor: 6894.757293168, label: { en: "psi", ar: "رطل لكل بوصة مربعة" } }
      }
    },
    length: {
      units: {
        mm: { symbol: "mm", factor: 0.001, label: { en: "millimeter", ar: "ملليمتر" } },
        cm: { symbol: "cm", factor: 0.01, label: { en: "centimeter", ar: "سنتيمتر" } },
        m: { symbol: "m", factor: 1, label: { en: "meter", ar: "متر" } },
        in: { symbol: "in", factor: 0.0254, label: { en: "inch", ar: "بوصة" } },
        ft: { symbol: "ft", factor: 0.3048, label: { en: "foot", ar: "قدم" } }
      }
    },
    area: {
      units: {
        mm2: { symbol: "mm^2", factor: 1e-6, label: { en: "square millimeter", ar: "ملليمتر مربع" } },
        cm2: { symbol: "cm^2", factor: 1e-4, label: { en: "square centimeter", ar: "سنتيمتر مربع" } },
        m2: { symbol: "m^2", factor: 1, label: { en: "square meter", ar: "متر مربع" } },
        in2: { symbol: "in^2", factor: 0.00064516, label: { en: "square inch", ar: "بوصة مربعة" } }
      }
    },
    inertia: {
      units: {
        mm4: { symbol: "mm^4", factor: 1e-12, label: { en: "mm to the fourth", ar: "ملليمتر للقوة الرابعة" } },
        cm4: { symbol: "cm^4", factor: 1e-8, label: { en: "cm to the fourth", ar: "سنتيمتر للقوة الرابعة" } },
        m4: { symbol: "m^4", factor: 1, label: { en: "m to the fourth", ar: "متر للقوة الرابعة" } },
        in4: { symbol: "in^4", factor: 4.162314256e-7, label: { en: "in to the fourth", ar: "بوصة للقوة الرابعة" } }
      }
    },
    torque: {
      units: {
        Nm: { symbol: "N*m", factor: 1, label: { en: "newton-meter", ar: "نيوتن.متر" } },
        kNm: { symbol: "kN*m", factor: 1000, label: { en: "kilonewton-meter", ar: "كيلو نيوتن.متر" } },
        lbfft: { symbol: "lbf*ft", factor: 1.3558179483314, label: { en: "pound-foot", ar: "رطل.قدم" } }
      }
    },
    strain: {
      units: {
        ratio: { symbol: "m/m", factor: 1, label: { en: "ratio", ar: "نسبة" } },
        microstrain: { symbol: "µε", factor: 1e-6, label: { en: "microstrain", ar: "مايكروسترين" } },
        percent: { symbol: "%", factor: 0.01, label: { en: "percent", ar: "بالمئة" } }
      }
    },
    tempDiff: {
      units: {
        C: { symbol: "°C", factor: 1, label: { en: "degree Celsius", ar: "درجة مئوية" } },
        K: { symbol: "K", factor: 1, label: { en: "kelvin difference", ar: "فرق كلفن" } },
        F: { symbol: "°F", factor: 5 / 9, label: { en: "degree Fahrenheit", ar: "درجة فهرنهايت" } }
      }
    },
    thermalCoeff: {
      units: {
        perC: { symbol: "/°C", factor: 1, label: { en: "per degree Celsius", ar: "لكل درجة مئوية" } },
        perK: { symbol: "/K", factor: 1, label: { en: "per kelvin", ar: "لكل كلفن" } },
        perF: { symbol: "/°F", factor: 1.8, label: { en: "per degree Fahrenheit", ar: "لكل درجة فهرنهايت" } }
      }
    }
  };

  function pair(en, ar) {
    return { en: en, ar: ar };
  }

  function lang() {
    return app.getLanguage();
  }

  function text(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (Object.prototype.hasOwnProperty.call(value, "en") || Object.prototype.hasOwnProperty.call(value, "ar")) {
        return value[lang()] || value.en || value.ar || "";
      }
    }

    return value == null ? "" : String(value);
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character];
    });
  }

  function num(value, decimals) {
    if (!Number.isFinite(value)) {
      return "--";
    }

    const precision = typeof decimals === "number" ? decimals : 4;
    const absolute = Math.abs(value);

    if (absolute !== 0 && (absolute >= 1000000 || absolute < 0.001)) {
      return value.toExponential(4);
    }

    return new Intl.NumberFormat(lang() === "ar" ? "ar" : "en-US", {
      maximumFractionDigits: precision
    }).format(value);
  }

  function unitDef(category, key) {
    return unitCatalog[category] && unitCatalog[category].units[key] ? unitCatalog[category].units[key] : null;
  }

  function toBase(category, value, key) {
    const unit = unitDef(category, key);
    return unit ? value * unit.factor : NaN;
  }

  function fromBase(category, value, key) {
    const unit = unitDef(category, key);
    return unit ? value / unit.factor : NaN;
  }

  function unitLabel(category, key) {
    const unit = unitDef(category, key);
    return unit ? `${unit.symbol} - ${text(unit.label)}` : key;
  }

  function withUnit(category, key, value, decimals) {
    return `${num(value, decimals)} ${unitDef(category, key).symbol}`;
  }

  function saveReport(report) {
    try {
      const current = JSON.parse(window.localStorage.getItem(exportStorageKey) || "[]");
      current.unshift(Object.assign({ createdAt: new Date().toISOString() }, report));
      window.localStorage.setItem(exportStorageKey, JSON.stringify(current.slice(0, 15)));
    } catch (error) {
      /* Ignore storage failures. */
    }
  }

  function validateField(field, input, wrapper) {
    const value = Number(input.value);

    if (input.value.trim() === "" || !Number.isFinite(value)) {
      wrapper.classList.add("field-error");
      throw new Error(lang() === "ar" ? `أدخل قيمة صحيحة لـ ${text(field.label)}.` : `Enter a valid ${text(field.label)}.`);
    }

    if (field.positive && value <= 0) {
      wrapper.classList.add("field-error");
      throw new Error(lang() === "ar" ? `يجب أن تكون ${text(field.label)} أكبر من الصفر.` : `${text(field.label)} must be greater than zero.`);
    }

    return value;
  }

  function summaryRow(item) {
    return `<div class="summary-item"><span>${esc(item.label)}</span><strong>${esc(item.value)}</strong></div>`;
  }

  function stepCard(index, item) {
    return `<article class="step-card"><h4>${index}. ${esc(item.title)}</h4>${item.body}</article>`;
  }

  function metricCard(item) {
    return `<div class="metric-card"><span>${esc(item.label)}</span><strong>${esc(item.value)}</strong></div>`;
  }

  function noteCard(item) {
    return `<div class="step-card"><h4>${esc(text(item.title))}</h4><p>${esc(text(item.text))}</p></div>`;
  }

  function renderField(field) {
    const value = state.values[field.name];
    const unitValue = state.values[`${field.name}Unit`] || field.defaultUnit;
    const input = `<input id="tool-${esc(field.name)}" name="${esc(field.name)}" class="input-control" type="number" inputmode="decimal" step="any" ${field.positive ? 'min="0"' : ""} value="${value == null ? "" : esc(value)}" placeholder="${esc(text(field.label))}">`;

    if (!field.category) {
      return `<div class="field ${field.full ? "field--full" : ""}" data-field="${esc(field.name)}"><label for="tool-${esc(field.name)}">${esc(text(field.label))}</label>${input}</div>`;
    }

    return `<div class="field ${field.full ? "field--full" : ""}" data-field="${esc(field.name)}"><label for="tool-${esc(field.name)}">${esc(text(field.label))}</label><div class="control-inline">${input}<select id="tool-${esc(field.name)}-unit" name="${esc(field.name)}Unit" class="select-control" data-unit-category="${esc(field.category)}" data-selected="${esc(unitValue)}"></select></div></div>`;
  }

  function renderSelector(field) {
    const value = state.values[field.name] || field.defaultUnit;
    return `<div class="field ${field.full ? "field--full" : ""}" data-field="${esc(field.name)}"><label for="tool-${esc(field.name)}">${esc(text(field.label))}</label><select id="tool-${esc(field.name)}" name="${esc(field.name)}" class="select-control" data-unit-category="${esc(field.category)}" data-selected="${esc(value)}"></select></div>`;
  }

  function buildExportPayload(config, view) {
    return {
      topic: app.t(`topics.${config.moduleKey}.title`, lang()),
      formula: config.formula,
      inputs: view.exportInputs,
      finalAnswer: view.exportAnswer,
      steps: view.exportSteps
    };
  }

  function mohrSvg(result) {
    const max = Math.max(Math.abs(result.sigma1Out), Math.abs(result.sigma2Out), Math.abs(result.avgOut), Math.abs(result.tauOut), 1);
    const width = 560;
    const height = 280;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 180 / max;
    const cx = centerX + result.avgOut * scale;
    const radius = Math.abs(result.tauOut) * scale;
    const ax = centerX + result.sigmaXOut * scale;
    const ay = centerY - result.tauXYOut * scale;
    const bx = centerX + result.sigmaYOut * scale;
    const by = centerY + result.tauXYOut * scale;

    return `
      <div class="diagram-shell">
        <div class="diagram-shell__header">
          <h3>${esc(text(pair("Mohr's Circle Preview", "معاينة دائرة مور")))}</h3>
          <p>${esc(text(pair("The circle center equals the average stress and the radius equals the maximum in-plane shear stress.", "مركز الدائرة يساوي الإجهاد المتوسط ونصف القطر يساوي إجهاد القص الأعظمي في المستوى.")))}</p>
        </div>
        <svg viewBox="0 0 ${width} ${height}" class="diagram-svg" role="img" aria-label="${esc(text(pair("Mohr's Circle diagram", "رسم دائرة مور")))}">
          <line x1="20" y1="${centerY}" x2="${width - 20}" y2="${centerY}" class="diagram-axis"></line>
          <line x1="${centerX}" y1="20" x2="${centerX}" y2="${height - 20}" class="diagram-axis"></line>
          <circle cx="${cx}" cy="${centerY}" r="${radius}" class="diagram-circle"></circle>
          <line x1="${cx - radius}" y1="${centerY}" x2="${cx + radius}" y2="${centerY}" class="diagram-span"></line>
          <circle cx="${ax}" cy="${ay}" r="4" class="diagram-point"></circle>
          <circle cx="${bx}" cy="${by}" r="4" class="diagram-point"></circle>
          <circle cx="${cx}" cy="${centerY}" r="4" class="diagram-point diagram-point--accent"></circle>
          <text x="${ax + 8}" y="${ay - 8}" class="diagram-label">A</text>
          <text x="${bx + 8}" y="${by - 8}" class="diagram-label">B</text>
          <text x="${cx + 8}" y="${centerY - 8}" class="diagram-label">C</text>
        </svg>
      </div>
    `;
  }

  configs["strain"] = {
    moduleKey: "strain",
    formula: "epsilon = deltaL / L",
    subtitle: pair("Compute normal strain from the member elongation and original gauge length.", "احسب الانفعال العمودي من الاستطالة والطول الأصلي للعضو."),
    explanation: pair("Normal strain is dimensionless and represents deformation relative to the original length.", "الانفعال العمودي كمية لا بعدية وتمثل مقدار التشوه نسبة إلى الطول الأصلي."),
    formTitle: pair("Strain inputs", "مدخلات الانفعال"),
    resultPlaceholder: pair("The strain result and the worked solution will appear here.", "ستظهر هنا قيمة الانفعال وخطوات الحل."),
    notes: [
      { title: pair("Sign convention", "إشارة الانفعال"), text: pair("Positive strain indicates elongation, while negative strain indicates shortening.", "الانفعال الموجب يدل على الاستطالة، بينما الانفعال السالب يدل على النقصان في الطول.") },
      { title: pair("Unit tip", "ملاحظة الوحدات"), text: pair("Convert both lengths into the same length system before dividing.", "حوّل الطولين إلى نفس نظام الوحدات قبل إجراء القسمة.") }
    ],
    inputs: [
      { name: "deltaLength", label: pair("Change in length (ΔL)", "التغير في الطول (ΔL)"), category: "length", defaultUnit: "mm" },
      { name: "originalLength", label: pair("Original length (L)", "الطول الأصلي (L)"), category: "length", defaultUnit: "m", positive: true }
    ],
    selectors: [
      { name: "outputUnit", label: pair("Output strain unit", "وحدة خرج الانفعال"), category: "strain", defaultUnit: "microstrain", full: true }
    ],
    calculate: function (values) {
      const deltaBase = toBase("length", values.deltaLength, values.deltaLengthUnit);
      const lengthBase = toBase("length", values.originalLength, values.originalLengthUnit);
      const strainBase = deltaBase / lengthBase;

      return {
        deltaBase: deltaBase,
        lengthBase: lengthBase,
        strainBase: strainBase,
        outputValue: fromBase("strain", strainBase, values.outputUnit),
        values: values
      };
    },
    present: function (result) {
      return {
        final: withUnit("strain", result.values.outputUnit, result.outputValue, 6),
        secondary: `${num(result.strainBase, 6)} m/m`,
        summary: [
          { label: text(pair("Change in length", "التغير في الطول")), value: withUnit("length", result.values.deltaLengthUnit, result.values.deltaLength, 4) },
          { label: text(pair("Original length", "الطول الأصلي")), value: withUnit("length", result.values.originalLengthUnit, result.values.originalLength, 4) },
          { label: text(pair("Displayed unit", "وحدة العرض")), value: unitDef("strain", result.values.outputUnit).symbol }
        ],
        steps: [
          { title: text(pair("Convert the length change to meters", "حوّل التغير في الطول إلى متر")), body: `<p>${withUnit("length", result.values.deltaLengthUnit, result.values.deltaLength, 6)} = ${num(result.deltaBase, 6)} m</p>` },
          { title: text(pair("Convert the original length to meters", "حوّل الطول الأصلي إلى متر")), body: `<p>${withUnit("length", result.values.originalLengthUnit, result.values.originalLength, 6)} = ${num(result.lengthBase, 6)} m</p>` },
          { title: text(pair("Substitute into the strain equation", "عوّض في معادلة الانفعال")), body: `<div class="equation-line">epsilon = ${num(result.deltaBase, 6)} / ${num(result.lengthBase, 6)} = ${num(result.strainBase, 6)} m/m</div>` },
          { title: text(pair("Convert to the requested display unit", "حوّل إلى وحدة العرض المطلوبة")), body: `<p>${num(result.strainBase, 6)} m/m = ${withUnit("strain", result.values.outputUnit, result.outputValue, 6)}</p>` }
        ],
        exportInputs: [
          `${text(pair("Change in length", "التغير في الطول"))}: ${withUnit("length", result.values.deltaLengthUnit, result.values.deltaLength, 4)}`,
          `${text(pair("Original length", "الطول الأصلي"))}: ${withUnit("length", result.values.originalLengthUnit, result.values.originalLength, 4)}`
        ],
        exportAnswer: `${withUnit("strain", result.values.outputUnit, result.outputValue, 6)} (${num(result.strainBase, 6)} m/m)`,
        exportSteps: [
          `${withUnit("length", result.values.deltaLengthUnit, result.values.deltaLength, 6)} = ${num(result.deltaBase, 6)} m`,
          `${withUnit("length", result.values.originalLengthUnit, result.values.originalLength, 6)} = ${num(result.lengthBase, 6)} m`,
          `epsilon = ${num(result.deltaBase, 6)} / ${num(result.lengthBase, 6)} = ${num(result.strainBase, 6)} m/m`,
          `${num(result.strainBase, 6)} m/m = ${withUnit("strain", result.values.outputUnit, result.outputValue, 6)}`
        ]
      };
    }
  };

  configs["hookes-law"] = {
    moduleKey: "hookesLaw",
    formula: "sigma = E epsilon",
    subtitle: pair("Relate elastic modulus and strain to predict the normal stress in the linear range.", "اربط معامل المرونة مع الانفعال للتنبؤ بالإجهاد العمودي في المجال الخطي."),
    explanation: pair("Hooke's Law is valid while the material stays within the elastic region.", "يُستخدم قانون هوك عندما تبقى المادة ضمن المجال المرن."),
    formTitle: pair("Hooke's Law inputs", "مدخلات قانون هوك"),
    resultPlaceholder: pair("Stress will appear here after solving.", "ستظهر قيمة الإجهاد هنا بعد الحل."),
    notes: [
      { title: pair("Elastic behavior", "السلوك المرن"), text: pair("The relation sigma = E epsilon assumes no permanent deformation.", "العلاقة sigma = E epsilon تفترض عدم حدوث تشوه دائم.") },
      { title: pair("Strain units", "وحدات الانفعال"), text: pair("Microstrain and percent can be converted into the base ratio automatically.", "يمكن تحويل المايكروسترين أو النسبة المئوية إلى النسبة الأساسية تلقائياً.") }
    ],
    inputs: [
      { name: "elasticModulus", label: pair("Elastic modulus (E)", "معامل المرونة (E)"), category: "stress", defaultUnit: "GPa", positive: true },
      { name: "strainValue", label: pair("Normal strain (ε)", "الانفعال العمودي (ε)"), category: "strain", defaultUnit: "microstrain" }
    ],
    selectors: [
      { name: "outputUnit", label: pair("Output stress unit", "وحدة خرج الإجهاد"), category: "stress", defaultUnit: "MPa", full: true }
    ],
    calculate: function (values) {
      const eBase = toBase("stress", values.elasticModulus, values.elasticModulusUnit);
      const strainBase = toBase("strain", values.strainValue, values.strainValueUnit);
      const stressBase = eBase * strainBase;

      return {
        eBase: eBase,
        strainBase: strainBase,
        stressBase: stressBase,
        outputValue: fromBase("stress", stressBase, values.outputUnit),
        values: values
      };
    },
    present: function (result) {
      return {
        final: withUnit("stress", result.values.outputUnit, result.outputValue, 6),
        secondary: `${num(result.stressBase, 6)} Pa`,
        summary: [
          { label: text(pair("Elastic modulus", "معامل المرونة")), value: withUnit("stress", result.values.elasticModulusUnit, result.values.elasticModulus, 4) },
          { label: text(pair("Applied strain", "الانفعال المطبق")), value: withUnit("strain", result.values.strainValueUnit, result.values.strainValue, 4) },
          { label: text(pair("Displayed unit", "وحدة العرض")), value: unitDef("stress", result.values.outputUnit).symbol }
        ],
        steps: [
          { title: text(pair("Convert elastic modulus to pascal", "حوّل معامل المرونة إلى باسكال")), body: `<p>${withUnit("stress", result.values.elasticModulusUnit, result.values.elasticModulus, 6)} = ${num(result.eBase, 6)} Pa</p>` },
          { title: text(pair("Convert strain to the base ratio", "حوّل الانفعال إلى النسبة الأساسية")), body: `<p>${withUnit("strain", result.values.strainValueUnit, result.values.strainValue, 6)} = ${num(result.strainBase, 6)} m/m</p>` },
          { title: text(pair("Multiply E by ε", "اضرب E في ε")), body: `<div class="equation-line">sigma = ${num(result.eBase, 6)} x ${num(result.strainBase, 6)} = ${num(result.stressBase, 6)} Pa</div>` },
          { title: text(pair("Convert to the selected unit", "حوّل إلى الوحدة المختارة")), body: `<p>${num(result.stressBase, 6)} Pa = ${withUnit("stress", result.values.outputUnit, result.outputValue, 6)}</p>` }
        ],
        exportInputs: [
          `${text(pair("Elastic modulus", "معامل المرونة"))}: ${withUnit("stress", result.values.elasticModulusUnit, result.values.elasticModulus, 4)}`,
          `${text(pair("Applied strain", "الانفعال المطبق"))}: ${withUnit("strain", result.values.strainValueUnit, result.values.strainValue, 4)}`
        ],
        exportAnswer: withUnit("stress", result.values.outputUnit, result.outputValue, 6),
        exportSteps: [
          `${withUnit("stress", result.values.elasticModulusUnit, result.values.elasticModulus, 6)} = ${num(result.eBase, 6)} Pa`,
          `${withUnit("strain", result.values.strainValueUnit, result.values.strainValue, 6)} = ${num(result.strainBase, 6)} m/m`,
          `sigma = ${num(result.eBase, 6)} x ${num(result.strainBase, 6)} = ${num(result.stressBase, 6)} Pa`,
          `${num(result.stressBase, 6)} Pa = ${withUnit("stress", result.values.outputUnit, result.outputValue, 6)}`
        ]
      };
    }
  };

  configs["axial-deformation"] = {
    moduleKey: "axialDeformation",
    formula: "deltaL = (P L) / (A E)",
    subtitle: pair("Estimate axial elongation or shortening under a direct load.", "احسب الاستطالة أو القصر المحوري الناتج عن حمل مباشر."),
    explanation: pair("This relation assumes a prismatic member with uniform cross section and elastic behavior.", "تفترض هذه العلاقة أن المقطع ثابت والسلوك مرن على طول العضو."),
    formTitle: pair("Axial deformation inputs", "مدخلات الاستطالة المحورية"),
    resultPlaceholder: pair("The deformation result will appear here.", "ستظهر هنا نتيجة التغير في الطول."),
    notes: [
      { title: pair("Direction", "الاتجاه"), text: pair("Positive load can be used for tension and negative load for compression if you want a signed deformation.", "يمكن استخدام حمل موجب للشد وحمل سالب للضغط إذا رغبت في إظهار إشارة التغير في الطول.") },
      { title: pair("Material stiffness", "صلابة المادة"), text: pair("Larger area or larger elastic modulus reduces the axial deformation.", "المساحة الأكبر أو معامل المرونة الأكبر يقللان من الاستطالة المحورية.") }
    ],
    inputs: [
      { name: "load", label: pair("Axial load (P)", "الحمل المحوري (P)"), category: "force", defaultUnit: "kN" },
      { name: "length", label: pair("Member length (L)", "طول العضو (L)"), category: "length", defaultUnit: "m", positive: true },
      { name: "area", label: pair("Area (A)", "المساحة (A)"), category: "area", defaultUnit: "mm2", positive: true },
      { name: "elasticModulus", label: pair("Elastic modulus (E)", "معامل المرونة (E)"), category: "stress", defaultUnit: "GPa", positive: true }
    ],
    selectors: [
      { name: "outputUnit", label: pair("Output deformation unit", "وحدة خرج التغير في الطول"), category: "length", defaultUnit: "mm", full: true }
    ],
    calculate: function (values) {
      const loadBase = toBase("force", values.load, values.loadUnit);
      const lengthBase = toBase("length", values.length, values.lengthUnit);
      const areaBase = toBase("area", values.area, values.areaUnit);
      const eBase = toBase("stress", values.elasticModulus, values.elasticModulusUnit);
      const deformationBase = (loadBase * lengthBase) / (areaBase * eBase);

      return {
        loadBase: loadBase,
        lengthBase: lengthBase,
        areaBase: areaBase,
        eBase: eBase,
        deformationBase: deformationBase,
        outputValue: fromBase("length", deformationBase, values.outputUnit),
        values: values
      };
    },
    present: function (result) {
      return {
        final: withUnit("length", result.values.outputUnit, result.outputValue, 6),
        secondary: `${num(result.deformationBase, 6)} m`,
        summary: [
          { label: text(pair("Axial load", "الحمل المحوري")), value: withUnit("force", result.values.loadUnit, result.values.load, 4) },
          { label: text(pair("Member length", "طول العضو")), value: withUnit("length", result.values.lengthUnit, result.values.length, 4) },
          { label: text(pair("Cross-sectional area", "المساحة المقطعية")), value: withUnit("area", result.values.areaUnit, result.values.area, 4) },
          { label: text(pair("Elastic modulus", "معامل المرونة")), value: withUnit("stress", result.values.elasticModulusUnit, result.values.elasticModulus, 4) }
        ],
        steps: [
          { title: text(pair("Convert the load and length to base SI units", "حوّل الحمل والطول إلى وحدات SI الأساسية")), body: `<p>${withUnit("force", result.values.loadUnit, result.values.load, 6)} = ${num(result.loadBase, 6)} N<br>${withUnit("length", result.values.lengthUnit, result.values.length, 6)} = ${num(result.lengthBase, 6)} m</p>` },
          { title: text(pair("Convert area and modulus", "حوّل المساحة ومعامل المرونة")), body: `<p>${withUnit("area", result.values.areaUnit, result.values.area, 6)} = ${num(result.areaBase, 6)} m^2<br>${withUnit("stress", result.values.elasticModulusUnit, result.values.elasticModulus, 6)} = ${num(result.eBase, 6)} Pa</p>` },
          { title: text(pair("Substitute into δL = PL / AE", "عوّض في δL = PL / AE")), body: `<div class="equation-line">deltaL = (${num(result.loadBase, 6)} x ${num(result.lengthBase, 6)}) / (${num(result.areaBase, 6)} x ${num(result.eBase, 6)}) = ${num(result.deformationBase, 6)} m</div>` },
          { title: text(pair("Convert to the requested output unit", "حوّل إلى وحدة الخرج المطلوبة")), body: `<p>${num(result.deformationBase, 6)} m = ${withUnit("length", result.values.outputUnit, result.outputValue, 6)}</p>` }
        ],
        exportInputs: [
          `${text(pair("Axial load", "الحمل المحوري"))}: ${withUnit("force", result.values.loadUnit, result.values.load, 4)}`,
          `${text(pair("Member length", "طول العضو"))}: ${withUnit("length", result.values.lengthUnit, result.values.length, 4)}`,
          `${text(pair("Cross-sectional area", "المساحة المقطعية"))}: ${withUnit("area", result.values.areaUnit, result.values.area, 4)}`,
          `${text(pair("Elastic modulus", "معامل المرونة"))}: ${withUnit("stress", result.values.elasticModulusUnit, result.values.elasticModulus, 4)}`
        ],
        exportAnswer: withUnit("length", result.values.outputUnit, result.outputValue, 6),
        exportSteps: [
          `${withUnit("force", result.values.loadUnit, result.values.load, 6)} = ${num(result.loadBase, 6)} N`,
          `${withUnit("length", result.values.lengthUnit, result.values.length, 6)} = ${num(result.lengthBase, 6)} m`,
          `${withUnit("area", result.values.areaUnit, result.values.area, 6)} = ${num(result.areaBase, 6)} m^2`,
          `${withUnit("stress", result.values.elasticModulusUnit, result.values.elasticModulus, 6)} = ${num(result.eBase, 6)} Pa`,
          `deltaL = (${num(result.loadBase, 6)} x ${num(result.lengthBase, 6)}) / (${num(result.areaBase, 6)} x ${num(result.eBase, 6)}) = ${num(result.deformationBase, 6)} m`
        ]
      };
    }
  };

  configs["shear-stress"] = {
    moduleKey: "shearStress",
    formula: "tau = V / A",
    subtitle: pair("Compute average shear stress from a direct shear force and resisting area.", "احسب إجهاد القص المتوسط من قوة القص والمساحة المقاومة."),
    explanation: pair("Average shear stress is useful for introductory checks before using more detailed shear-flow or section formulas.", "يفيد إجهاد القص المتوسط في الفحوصات الأولية قبل استخدام علاقات أكثر تفصيلاً."),
    formTitle: pair("Shear stress inputs", "مدخلات إجهاد القص"),
    resultPlaceholder: pair("The shear stress result will appear here.", "ستظهر هنا نتيجة إجهاد القص."),
    notes: [
      { title: pair("Average value", "قيمة متوسطة"), text: pair("This page gives average shear stress, not the exact distribution across the section.", "تعطي هذه الصفحة إجهاد القص المتوسط وليس التوزيع الدقيق على المقطع.") },
      { title: pair("Sign use", "استخدام الإشارة"), text: pair("Use a negative force only if you want the final result to keep the chosen sign convention.", "استخدم قوة سالبة فقط إذا أردت أن تحافظ النتيجة على اتفاقية الإشارة المختارة.") }
    ],
    inputs: [
      { name: "shearForce", label: pair("Shear force (V)", "قوة القص (V)"), category: "force", defaultUnit: "kN" },
      { name: "area", label: pair("Area (A)", "المساحة (A)"), category: "area", defaultUnit: "mm2", positive: true }
    ],
    selectors: [
      { name: "outputUnit", label: pair("Output shear-stress unit", "وحدة خرج إجهاد القص"), category: "stress", defaultUnit: "MPa", full: true }
    ],
    calculate: function (values) {
      const forceBase = toBase("force", values.shearForce, values.shearForceUnit);
      const areaBase = toBase("area", values.area, values.areaUnit);
      const stressBase = forceBase / areaBase;

      return {
        forceBase: forceBase,
        areaBase: areaBase,
        stressBase: stressBase,
        outputValue: fromBase("stress", stressBase, values.outputUnit),
        values: values
      };
    },
    present: function (result) {
      return {
        final: withUnit("stress", result.values.outputUnit, result.outputValue, 6),
        secondary: `${num(result.stressBase, 6)} Pa`,
        summary: [
          { label: text(pair("Shear force", "قوة القص")), value: withUnit("force", result.values.shearForceUnit, result.values.shearForce, 4) },
          { label: text(pair("Area", "المساحة")), value: withUnit("area", result.values.areaUnit, result.values.area, 4) },
          { label: text(pair("Displayed unit", "وحدة العرض")), value: unitDef("stress", result.values.outputUnit).symbol }
        ],
        steps: [
          { title: text(pair("Convert the shear force to newtons", "حوّل قوة القص إلى نيوتن")), body: `<p>${withUnit("force", result.values.shearForceUnit, result.values.shearForce, 6)} = ${num(result.forceBase, 6)} N</p>` },
          { title: text(pair("Convert the area to square meters", "حوّل المساحة إلى متر مربع")), body: `<p>${withUnit("area", result.values.areaUnit, result.values.area, 6)} = ${num(result.areaBase, 6)} m^2</p>` },
          { title: text(pair("Substitute into τ = V / A", "عوّض في τ = V / A")), body: `<div class="equation-line">tau = ${num(result.forceBase, 6)} / ${num(result.areaBase, 6)} = ${num(result.stressBase, 6)} Pa</div>` },
          { title: text(pair("Convert to the selected output unit", "حوّل إلى وحدة الخرج المختارة")), body: `<p>${num(result.stressBase, 6)} Pa = ${withUnit("stress", result.values.outputUnit, result.outputValue, 6)}</p>` }
        ],
        exportInputs: [
          `${text(pair("Shear force", "قوة القص"))}: ${withUnit("force", result.values.shearForceUnit, result.values.shearForce, 4)}`,
          `${text(pair("Area", "المساحة"))}: ${withUnit("area", result.values.areaUnit, result.values.area, 4)}`
        ],
        exportAnswer: withUnit("stress", result.values.outputUnit, result.outputValue, 6),
        exportSteps: [
          `${withUnit("force", result.values.shearForceUnit, result.values.shearForce, 6)} = ${num(result.forceBase, 6)} N`,
          `${withUnit("area", result.values.areaUnit, result.values.area, 6)} = ${num(result.areaBase, 6)} m^2`,
          `tau = ${num(result.forceBase, 6)} / ${num(result.areaBase, 6)} = ${num(result.stressBase, 6)} Pa`,
          `${num(result.stressBase, 6)} Pa = ${withUnit("stress", result.values.outputUnit, result.outputValue, 6)}`
        ]
      };
    }
  };

  configs["torsion"] = {
    moduleKey: "torsion",
    formula: "tau = (T r) / J",
    subtitle: pair("Find the torsional shear stress from torque, shaft radius, and polar moment of inertia.", "أوجد إجهاد القص الناتج عن اللي من العزم ونصف القطر والعزم القطبي."),
    explanation: pair("The maximum torsional shear stress occurs at the outer radius of the shaft.", "يظهر إجهاد القص الأعظمي الناتج عن اللي عند السطح الخارجي للعمود."),
    formTitle: pair("Torsion inputs", "مدخلات اللي"),
    resultPlaceholder: pair("The torsional shear stress will appear here.", "ستظهر هنا نتيجة إجهاد القص الناتج عن اللي."),
    notes: [
      { title: pair("Outer surface", "السطح الخارجي"), text: pair("Use the outer radius when you want the maximum torsional shear stress.", "استخدم نصف القطر الخارجي عندما تريد إجهاد القص الأعظمي.") },
      { title: pair("Section effect", "تأثير المقطع"), text: pair("A larger polar moment of inertia reduces torsional stress for the same torque.", "العزم القطبي الأكبر يقلل إجهاد اللي لنفس مقدار العزم.") }
    ],
    inputs: [
      { name: "torque", label: pair("Torque (T)", "العزم (T)"), category: "torque", defaultUnit: "kNm" },
      { name: "radius", label: pair("Radius (r)", "نصف القطر (r)"), category: "length", defaultUnit: "mm", positive: true },
      { name: "polarInertia", label: pair("Polar inertia (J)", "العزم القطبي (J)"), category: "inertia", defaultUnit: "mm4", positive: true }
    ],
    selectors: [
      { name: "outputUnit", label: pair("Output stress unit", "وحدة خرج الإجهاد"), category: "stress", defaultUnit: "MPa", full: true }
    ],
    calculate: function (values) {
      const torqueBase = toBase("torque", values.torque, values.torqueUnit);
      const radiusBase = toBase("length", values.radius, values.radiusUnit);
      const inertiaBase = toBase("inertia", values.polarInertia, values.polarInertiaUnit);
      const stressBase = (torqueBase * radiusBase) / inertiaBase;

      return {
        torqueBase: torqueBase,
        radiusBase: radiusBase,
        inertiaBase: inertiaBase,
        stressBase: stressBase,
        outputValue: fromBase("stress", stressBase, values.outputUnit),
        values: values
      };
    },
    present: function (result) {
      return {
        final: withUnit("stress", result.values.outputUnit, result.outputValue, 6),
        secondary: `${num(result.stressBase, 6)} Pa`,
        summary: [
          { label: text(pair("Torque", "العزم")), value: withUnit("torque", result.values.torqueUnit, result.values.torque, 4) },
          { label: text(pair("Radius", "نصف القطر")), value: withUnit("length", result.values.radiusUnit, result.values.radius, 4) },
          { label: text(pair("Polar inertia", "العزم القطبي")), value: withUnit("inertia", result.values.polarInertiaUnit, result.values.polarInertia, 4) }
        ],
        steps: [
          { title: text(pair("Convert torque and radius", "حوّل العزم ونصف القطر")), body: `<p>${withUnit("torque", result.values.torqueUnit, result.values.torque, 6)} = ${num(result.torqueBase, 6)} N*m<br>${withUnit("length", result.values.radiusUnit, result.values.radius, 6)} = ${num(result.radiusBase, 6)} m</p>` },
          { title: text(pair("Convert the polar inertia", "حوّل العزم القطبي")), body: `<p>${withUnit("inertia", result.values.polarInertiaUnit, result.values.polarInertia, 6)} = ${num(result.inertiaBase, 6)} m^4</p>` },
          { title: text(pair("Substitute into τ = Tr/J", "عوّض في τ = Tr/J")), body: `<div class="equation-line">tau = (${num(result.torqueBase, 6)} x ${num(result.radiusBase, 6)}) / ${num(result.inertiaBase, 6)} = ${num(result.stressBase, 6)} Pa</div>` },
          { title: text(pair("Convert to the chosen unit", "حوّل إلى الوحدة المختارة")), body: `<p>${num(result.stressBase, 6)} Pa = ${withUnit("stress", result.values.outputUnit, result.outputValue, 6)}</p>` }
        ],
        exportInputs: [
          `${text(pair("Torque", "العزم"))}: ${withUnit("torque", result.values.torqueUnit, result.values.torque, 4)}`,
          `${text(pair("Radius", "نصف القطر"))}: ${withUnit("length", result.values.radiusUnit, result.values.radius, 4)}`,
          `${text(pair("Polar inertia", "العزم القطبي"))}: ${withUnit("inertia", result.values.polarInertiaUnit, result.values.polarInertia, 4)}`
        ],
        exportAnswer: withUnit("stress", result.values.outputUnit, result.outputValue, 6),
        exportSteps: [
          `${withUnit("torque", result.values.torqueUnit, result.values.torque, 6)} = ${num(result.torqueBase, 6)} N*m`,
          `${withUnit("length", result.values.radiusUnit, result.values.radius, 6)} = ${num(result.radiusBase, 6)} m`,
          `${withUnit("inertia", result.values.polarInertiaUnit, result.values.polarInertia, 6)} = ${num(result.inertiaBase, 6)} m^4`,
          `tau = (${num(result.torqueBase, 6)} x ${num(result.radiusBase, 6)}) / ${num(result.inertiaBase, 6)} = ${num(result.stressBase, 6)} Pa`
        ]
      };
    }
  };

  configs["bending-stress"] = {
    moduleKey: "bending",
    formula: "sigma = (M y) / I",
    subtitle: pair("Evaluate flexural stress at a point located a distance y from the neutral axis.", "احسب إجهاد الانحناء عند نقطة تبعد مسافة y عن المحور المتعادل."),
    explanation: pair("For a given moment, stresses increase with distance from the neutral axis and decrease with larger inertia.", "يزداد إجهاد الانحناء كلما ابتعدت النقطة عن المحور المتعادل ويقل مع زيادة عزم العطالة."),
    formTitle: pair("Bending-stress inputs", "مدخلات إجهاد الانحناء"),
    resultPlaceholder: pair("The bending stress result will appear here.", "ستظهر هنا نتيجة إجهاد الانحناء."),
    notes: [
      { title: pair("Fiber location", "موضع الليف"), text: pair("The sign of y depends on your coordinate convention above or below the neutral axis.", "تعتمد إشارة y على اتفاقية المحاور التي تعتمدها فوق أو تحت المحور المتعادل.") },
      { title: pair("Section stiffness", "صلابة المقطع"), text: pair("Increasing the second moment of area reduces the flexural stress for the same moment.", "زيادة عزم العطالة للمقطع تقلل إجهاد الانحناء لنفس العزم.") }
    ],
    inputs: [
      { name: "moment", label: pair("Bending moment (M)", "عزم الانحناء (M)"), category: "torque", defaultUnit: "kNm" },
      { name: "distance", label: pair("Distance from neutral axis (y)", "المسافة عن المحور المتعادل (y)"), category: "length", defaultUnit: "mm" },
      { name: "inertia", label: pair("Second moment of area (I)", "عزم العطالة (I)"), category: "inertia", defaultUnit: "mm4", positive: true }
    ],
    selectors: [
      { name: "outputUnit", label: pair("Output stress unit", "وحدة خرج الإجهاد"), category: "stress", defaultUnit: "MPa", full: true }
    ],
    calculate: function (values) {
      const momentBase = toBase("torque", values.moment, values.momentUnit);
      const distanceBase = toBase("length", values.distance, values.distanceUnit);
      const inertiaBase = toBase("inertia", values.inertia, values.inertiaUnit);
      const stressBase = (momentBase * distanceBase) / inertiaBase;

      return {
        momentBase: momentBase,
        distanceBase: distanceBase,
        inertiaBase: inertiaBase,
        stressBase: stressBase,
        outputValue: fromBase("stress", stressBase, values.outputUnit),
        values: values
      };
    },
    present: function (result) {
      return {
        final: withUnit("stress", result.values.outputUnit, result.outputValue, 6),
        secondary: `${num(result.stressBase, 6)} Pa`,
        summary: [
          { label: text(pair("Bending moment", "عزم الانحناء")), value: withUnit("torque", result.values.momentUnit, result.values.moment, 4) },
          { label: text(pair("Distance y", "المسافة y")), value: withUnit("length", result.values.distanceUnit, result.values.distance, 4) },
          { label: text(pair("Second moment I", "عزم العطالة I")), value: withUnit("inertia", result.values.inertiaUnit, result.values.inertia, 4) }
        ],
        steps: [
          { title: text(pair("Convert moment and distance", "حوّل العزم والمسافة")), body: `<p>${withUnit("torque", result.values.momentUnit, result.values.moment, 6)} = ${num(result.momentBase, 6)} N*m<br>${withUnit("length", result.values.distanceUnit, result.values.distance, 6)} = ${num(result.distanceBase, 6)} m</p>` },
          { title: text(pair("Convert the second moment of area", "حوّل عزم العطالة")), body: `<p>${withUnit("inertia", result.values.inertiaUnit, result.values.inertia, 6)} = ${num(result.inertiaBase, 6)} m^4</p>` },
          { title: text(pair("Substitute into σ = My/I", "عوّض في σ = My/I")), body: `<div class="equation-line">sigma = (${num(result.momentBase, 6)} x ${num(result.distanceBase, 6)}) / ${num(result.inertiaBase, 6)} = ${num(result.stressBase, 6)} Pa</div>` },
          { title: text(pair("Convert to the selected unit", "حوّل إلى الوحدة المختارة")), body: `<p>${num(result.stressBase, 6)} Pa = ${withUnit("stress", result.values.outputUnit, result.outputValue, 6)}</p>` }
        ],
        exportInputs: [
          `${text(pair("Bending moment", "عزم الانحناء"))}: ${withUnit("torque", result.values.momentUnit, result.values.moment, 4)}`,
          `${text(pair("Distance y", "المسافة y"))}: ${withUnit("length", result.values.distanceUnit, result.values.distance, 4)}`,
          `${text(pair("Second moment I", "عزم العطالة I"))}: ${withUnit("inertia", result.values.inertiaUnit, result.values.inertia, 4)}`
        ],
        exportAnswer: withUnit("stress", result.values.outputUnit, result.outputValue, 6),
        exportSteps: [
          `${withUnit("torque", result.values.momentUnit, result.values.moment, 6)} = ${num(result.momentBase, 6)} N*m`,
          `${withUnit("length", result.values.distanceUnit, result.values.distance, 6)} = ${num(result.distanceBase, 6)} m`,
          `${withUnit("inertia", result.values.inertiaUnit, result.values.inertia, 6)} = ${num(result.inertiaBase, 6)} m^4`,
          `sigma = (${num(result.momentBase, 6)} x ${num(result.distanceBase, 6)}) / ${num(result.inertiaBase, 6)} = ${num(result.stressBase, 6)} Pa`
        ]
      };
    }
  };

  configs["thermal-stress"] = {
    moduleKey: "thermalStress",
    formula: "epsilon_th = alpha deltaT, sigma_th = E alpha deltaT",
    subtitle: pair("Compute free thermal strain and the restrained thermal stress in one place.", "احسب الانفعال الحراري الحر والإجهاد الحراري المقيد في صفحة واحدة."),
    explanation: pair("The stress result assumes the member is fully restrained against free expansion or contraction.", "تفترض نتيجة الإجهاد أن العضو مقيد تماماً ضد التمدد أو الانكماش الحر."),
    formTitle: pair("Thermal inputs", "المدخلات الحرارية"),
    resultPlaceholder: pair("The thermal strain and stress results will appear here.", "ستظهر هنا نتائج الانفعال والإجهاد الحراري."),
    notes: [
      { title: pair("Free response", "الاستجابة الحرة"), text: pair("If the member is free to expand, only thermal strain develops.", "إذا كان العضو حراً في التمدد فلن يتولد إلا الانفعال الحراري.") },
      { title: pair("Restrained response", "الاستجابة المقيدة"), text: pair("When expansion is prevented, internal stress develops according to sigma = E alpha deltaT.", "عند منع التمدد يتولد إجهاد داخلي حسب العلاقة sigma = E alpha deltaT.") }
    ],
    inputs: [
      { name: "elasticModulus", label: pair("Elastic modulus (E)", "معامل المرونة (E)"), category: "stress", defaultUnit: "GPa", positive: true },
      { name: "alpha", label: pair("Thermal coefficient (α)", "معامل التمدد الحراري (α)"), category: "thermalCoeff", defaultUnit: "perC", positive: true },
      { name: "deltaT", label: pair("Temperature change (ΔT)", "التغير الحراري (ΔT)"), category: "tempDiff", defaultUnit: "C" }
    ],
    selectors: [
      { name: "stressUnit", label: pair("Output stress unit", "وحدة خرج الإجهاد"), category: "stress", defaultUnit: "MPa" },
      { name: "strainUnit", label: pair("Output strain unit", "وحدة خرج الانفعال"), category: "strain", defaultUnit: "microstrain" }
    ],
    calculate: function (values) {
      const eBase = toBase("stress", values.elasticModulus, values.elasticModulusUnit);
      const alphaBase = toBase("thermalCoeff", values.alpha, values.alphaUnit);
      const deltaTBase = toBase("tempDiff", values.deltaT, values.deltaTUnit);
      const strainBase = alphaBase * deltaTBase;
      const stressBase = eBase * strainBase;

      return {
        eBase: eBase,
        alphaBase: alphaBase,
        deltaTBase: deltaTBase,
        strainBase: strainBase,
        stressBase: stressBase,
        strainOut: fromBase("strain", strainBase, values.strainUnit),
        stressOut: fromBase("stress", stressBase, values.stressUnit),
        values: values
      };
    },
    present: function (result) {
      return {
        final: withUnit("stress", result.values.stressUnit, result.stressOut, 6),
        secondary: `${text(pair("Thermal strain", "الانفعال الحراري"))}: ${withUnit("strain", result.values.strainUnit, result.strainOut, 6)}`,
        metrics: [
          { label: text(pair("Free thermal strain", "الانفعال الحراري الحر")), value: withUnit("strain", result.values.strainUnit, result.strainOut, 6) },
          { label: text(pair("Restrained thermal stress", "الإجهاد الحراري المقيد")), value: withUnit("stress", result.values.stressUnit, result.stressOut, 6) }
        ],
        summary: [
          { label: text(pair("Elastic modulus", "معامل المرونة")), value: withUnit("stress", result.values.elasticModulusUnit, result.values.elasticModulus, 4) },
          { label: text(pair("Thermal coefficient", "معامل التمدد الحراري")), value: withUnit("thermalCoeff", result.values.alphaUnit, result.values.alpha, 6) },
          { label: text(pair("Temperature change", "التغير الحراري")), value: withUnit("tempDiff", result.values.deltaTUnit, result.values.deltaT, 4) }
        ],
        steps: [
          { title: text(pair("Convert the material properties", "حوّل خواص المادة")), body: `<p>${withUnit("stress", result.values.elasticModulusUnit, result.values.elasticModulus, 6)} = ${num(result.eBase, 6)} Pa<br>${withUnit("thermalCoeff", result.values.alphaUnit, result.values.alpha, 6)} = ${num(result.alphaBase, 6)} /°C equivalent</p>` },
          { title: text(pair("Convert the temperature change", "حوّل التغير الحراري")), body: `<p>${withUnit("tempDiff", result.values.deltaTUnit, result.values.deltaT, 6)} = ${num(result.deltaTBase, 6)} °C equivalent</p>` },
          { title: text(pair("Find the free thermal strain", "أوجد الانفعال الحراري الحر")), body: `<div class="equation-line">epsilon_th = ${num(result.alphaBase, 6)} x ${num(result.deltaTBase, 6)} = ${num(result.strainBase, 6)} m/m</div>` },
          { title: text(pair("Find the restrained thermal stress", "أوجد الإجهاد الحراري المقيد")), body: `<div class="equation-line">sigma_th = ${num(result.eBase, 6)} x ${num(result.strainBase, 6)} = ${num(result.stressBase, 6)} Pa</div>` },
          { title: text(pair("Convert the outputs", "حوّل المخرجات")), body: `<p>${num(result.strainBase, 6)} m/m = ${withUnit("strain", result.values.strainUnit, result.strainOut, 6)}<br>${num(result.stressBase, 6)} Pa = ${withUnit("stress", result.values.stressUnit, result.stressOut, 6)}</p>` }
        ],
        exportInputs: [
          `${text(pair("Elastic modulus", "معامل المرونة"))}: ${withUnit("stress", result.values.elasticModulusUnit, result.values.elasticModulus, 4)}`,
          `${text(pair("Thermal coefficient", "معامل التمدد الحراري"))}: ${withUnit("thermalCoeff", result.values.alphaUnit, result.values.alpha, 6)}`,
          `${text(pair("Temperature change", "التغير الحراري"))}: ${withUnit("tempDiff", result.values.deltaTUnit, result.values.deltaT, 4)}`
        ],
        exportAnswer: `${withUnit("stress", result.values.stressUnit, result.stressOut, 6)} | ${withUnit("strain", result.values.strainUnit, result.strainOut, 6)}`,
        exportSteps: [
          `${withUnit("stress", result.values.elasticModulusUnit, result.values.elasticModulus, 6)} = ${num(result.eBase, 6)} Pa`,
          `${withUnit("thermalCoeff", result.values.alphaUnit, result.values.alpha, 6)} = ${num(result.alphaBase, 6)} /°C equivalent`,
          `${withUnit("tempDiff", result.values.deltaTUnit, result.values.deltaT, 6)} = ${num(result.deltaTBase, 6)} °C equivalent`,
          `epsilon_th = ${num(result.alphaBase, 6)} x ${num(result.deltaTBase, 6)} = ${num(result.strainBase, 6)} m/m`,
          `sigma_th = ${num(result.eBase, 6)} x ${num(result.strainBase, 6)} = ${num(result.stressBase, 6)} Pa`
        ]
      };
    }
  };

  configs["mohrs-circle"] = {
    moduleKey: "mohrsCircle",
    formula: "sigma_avg = (sigma_x + sigma_y)/2, R = sqrt(((sigma_x - sigma_y)/2)^2 + tau_xy^2)",
    subtitle: pair("Transform a plane-stress state into average stress, principal stresses, and maximum shear stress.", "حوّل حالة الإجهاد المستوي إلى إجهاد متوسط وإجهادات رئيسية وإجهاد قص أعظمي."),
    explanation: pair("Mohr's Circle gives a visual and algebraic way to understand stress transformation.", "تمنح دائرة مور طريقة بصرية وجبرية لفهم تحويلات الإجهاد."),
    formTitle: pair("Mohr's Circle inputs", "مدخلات دائرة مور"),
    resultPlaceholder: pair("Principal stresses and the circle preview will appear here.", "ستظهر هنا الإجهادات الرئيسية ومعاينة الدائرة."),
    notes: [
      { title: pair("Circle center", "مركز الدائرة"), text: pair("The center of Mohr's Circle lies at the average normal stress on the horizontal axis.", "يقع مركز دائرة مور عند الإجهاد العمودي المتوسط على المحور الأفقي.") },
      { title: pair("Radius meaning", "معنى نصف القطر"), text: pair("The circle radius equals the maximum in-plane shear stress.", "يساوي نصف قطر الدائرة إجهاد القص الأعظمي في المستوى.") }
    ],
    inputs: [
      { name: "sigmaX", label: pair("sigma_x", "sigma_x") },
      { name: "sigmaY", label: pair("sigma_y", "sigma_y") },
      { name: "tauXY", label: pair("tau_xy", "tau_xy") }
    ],
    selectors: [
      { name: "stressUnit", label: pair("Stress unit", "وحدة الإجهاد"), category: "stress", defaultUnit: "MPa", full: true }
    ],
    calculate: function (values) {
      const sigmaXBase = toBase("stress", values.sigmaX, values.stressUnit);
      const sigmaYBase = toBase("stress", values.sigmaY, values.stressUnit);
      const tauBase = toBase("stress", values.tauXY, values.stressUnit);
      const avgBase = (sigmaXBase + sigmaYBase) / 2;
      const radiusBase = Math.sqrt(Math.pow((sigmaXBase - sigmaYBase) / 2, 2) + Math.pow(tauBase, 2));
      const sigma1Base = avgBase + radiusBase;
      const sigma2Base = avgBase - radiusBase;

      return {
        sigmaXBase: sigmaXBase,
        sigmaYBase: sigmaYBase,
        tauBase: tauBase,
        avgBase: avgBase,
        radiusBase: radiusBase,
        sigma1Base: sigma1Base,
        sigma2Base: sigma2Base,
        sigmaXOut: fromBase("stress", sigmaXBase, values.stressUnit),
        sigmaYOut: fromBase("stress", sigmaYBase, values.stressUnit),
        tauXYOut: fromBase("stress", tauBase, values.stressUnit),
        avgOut: fromBase("stress", avgBase, values.stressUnit),
        tauOut: fromBase("stress", radiusBase, values.stressUnit),
        sigma1Out: fromBase("stress", sigma1Base, values.stressUnit),
        sigma2Out: fromBase("stress", sigma2Base, values.stressUnit),
        values: values
      };
    },
    present: function (result) {
      return {
        final: `${text(pair("Principal stress σ1", "الإجهاد الرئيسي σ1"))}: ${withUnit("stress", result.values.stressUnit, result.sigma1Out, 6)}`,
        secondary: `${text(pair("Principal stress σ2", "الإجهاد الرئيسي σ2"))}: ${withUnit("stress", result.values.stressUnit, result.sigma2Out, 6)}`,
        metrics: [
          { label: text(pair("Average stress", "الإجهاد المتوسط")), value: withUnit("stress", result.values.stressUnit, result.avgOut, 6) },
          { label: text(pair("Maximum shear stress", "إجهاد القص الأعظمي")), value: withUnit("stress", result.values.stressUnit, result.tauOut, 6) }
        ],
        summary: [
          { label: "sigma_x", value: withUnit("stress", result.values.stressUnit, result.values.sigmaX, 4) },
          { label: "sigma_y", value: withUnit("stress", result.values.stressUnit, result.values.sigmaY, 4) },
          { label: "tau_xy", value: withUnit("stress", result.values.stressUnit, result.values.tauXY, 4) }
        ],
        visual: mohrSvg(result),
        steps: [
          { title: text(pair("Convert the input stresses", "حوّل الإجهادات المدخلة")), body: `<p>sigma_x = ${num(result.sigmaXBase, 6)} Pa<br>sigma_y = ${num(result.sigmaYBase, 6)} Pa<br>tau_xy = ${num(result.tauBase, 6)} Pa</p>` },
          { title: text(pair("Compute the average stress", "احسب الإجهاد المتوسط")), body: `<div class="equation-line">sigma_avg = (${num(result.sigmaXBase, 6)} + ${num(result.sigmaYBase, 6)}) / 2 = ${num(result.avgBase, 6)} Pa</div>` },
          { title: text(pair("Compute the circle radius", "احسب نصف قطر الدائرة")), body: `<div class="equation-line">R = sqrt(((${num(result.sigmaXBase, 6)} - ${num(result.sigmaYBase, 6)}) / 2)^2 + ${num(result.tauBase, 6)}^2) = ${num(result.radiusBase, 6)} Pa</div>` },
          { title: text(pair("Find the principal stresses", "أوجد الإجهادات الرئيسية")), body: `<p>sigma1 = ${num(result.avgBase, 6)} + ${num(result.radiusBase, 6)} = ${num(result.sigma1Base, 6)} Pa<br>sigma2 = ${num(result.avgBase, 6)} - ${num(result.radiusBase, 6)} = ${num(result.sigma2Base, 6)} Pa</p>` },
          { title: text(pair("Convert the outputs", "حوّل المخرجات")), body: `<p>sigma1 = ${withUnit("stress", result.values.stressUnit, result.sigma1Out, 6)}<br>sigma2 = ${withUnit("stress", result.values.stressUnit, result.sigma2Out, 6)}<br>tau_max = ${withUnit("stress", result.values.stressUnit, result.tauOut, 6)}</p>` }
        ],
        exportInputs: [
          `sigma_x: ${withUnit("stress", result.values.stressUnit, result.values.sigmaX, 4)}`,
          `sigma_y: ${withUnit("stress", result.values.stressUnit, result.values.sigmaY, 4)}`,
          `tau_xy: ${withUnit("stress", result.values.stressUnit, result.values.tauXY, 4)}`
        ],
        exportAnswer: `${withUnit("stress", result.values.stressUnit, result.sigma1Out, 6)} | ${withUnit("stress", result.values.stressUnit, result.sigma2Out, 6)}`,
        exportSteps: [
          `sigma_avg = (${num(result.sigmaXBase, 6)} + ${num(result.sigmaYBase, 6)}) / 2 = ${num(result.avgBase, 6)} Pa`,
          `R = sqrt(((${num(result.sigmaXBase, 6)} - ${num(result.sigmaYBase, 6)}) / 2)^2 + ${num(result.tauBase, 6)}^2) = ${num(result.radiusBase, 6)} Pa`,
          `sigma1 = ${num(result.avgBase, 6)} + ${num(result.radiusBase, 6)} = ${num(result.sigma1Base, 6)} Pa`,
          `sigma2 = ${num(result.avgBase, 6)} - ${num(result.radiusBase, 6)} = ${num(result.sigma2Base, 6)} Pa`
        ]
      };
    }
  };

  function render() {
    const config = configs[root.getAttribute("data-tool-slug")];

    if (!config) {
      return;
    }

    const view = state.result ? config.present(state.result) : null;
    root.innerHTML = `
      <section class="page-hero fade-in-up">
        <div class="page-hero__split">
          <div>
            <span class="page-badge">${esc(text(pair("Interactive Solver", "حاسبة تفاعلية")))}</span>
            <h1>${esc(app.t(`topics.${config.moduleKey}.title`, lang()))}</h1>
            <p>${esc(text(config.subtitle))}</p>
            <div class="placeholder-actions">
              <a class="button button-primary" href="${app.buildUrl("index.html#topics")}">${esc(app.t("common.backToTopics", lang()))}</a>
              <a class="button button-secondary" href="${app.buildUrl("pages/pdf-export.html")}">${esc(text(pair("PDF Export", "تصدير PDF")))}</a>
            </div>
          </div>
          <aside class="hero-side-card">
            <span class="section-chip">${esc(app.t("interactive.shared.formula", lang()))}</span>
            <p>${esc(text(config.explanation))}</p>
            <div class="formula-display">${esc(config.formula)}</div>
          </aside>
        </div>
      </section>
      <section class="tool-page section-block">
        <div class="module-grid">
          <article class="module-panel glass-card">
            <div class="module-panel__header"><span class="section-chip">${esc(app.t("interactive.shared.inputs", lang()))}</span><h2>${esc(text(config.formTitle))}</h2></div>
            <form id="dynamic-tool-form" novalidate>
              <div class="field-grid">
                ${config.inputs.map(renderField).join("")}
                ${(config.selectors || []).map(renderSelector).join("")}
              </div>
              <div class="action-row">
                <button type="submit" class="button button-primary">${esc(app.t("common.solve", lang()))}</button>
                <button type="button" class="button button-secondary" id="dynamic-tool-clear">${esc(app.t("common.clear", lang()))}</button>
              </div>
              <div class="status-banner is-visible" id="dynamic-tool-status" data-state="${view ? "success" : "neutral"}">${esc(view ? text(pair("Calculation completed.", "تم الحساب بنجاح.")) : app.t("interactive.shared.ready", lang()))}</div>
            </form>
          </article>
          <article class="module-panel glass-card">
            <div class="module-panel__header"><span class="section-chip">${esc(app.t("interactive.shared.results", lang()))}</span><h2>${esc(text(pair("Solved result", "النتيجة المحسوبة")))}</h2></div>
            <div class="result-block">
              <div class="result-card">
                <div class="field-title">${esc(text(pair("Final answer", "الإجابة النهائية")))}</div>
                <div class="result-value">${view ? view.final : "--"}</div>
                <div class="result-subline">${view ? view.secondary : esc(text(config.resultPlaceholder))}</div>
              </div>
              ${view && view.metrics ? `<div class="metric-grid">${view.metrics.map(metricCard).join("")}</div>` : ""}
              <div class="result-card">
                <div class="field-title">${esc(app.t("interactive.shared.summary", lang()))}</div>
                <div class="summary-list">${view ? view.summary.map(summaryRow).join("") : `<div class="empty-state"><p>${esc(text(config.resultPlaceholder))}</p></div>`}</div>
              </div>
              ${view && view.visual ? `<div class="result-card">${view.visual}</div>` : ""}
            </div>
          </article>
        </div>
        <div class="module-grid">
          <article class="module-panel glass-card">
            <div class="module-panel__header"><span class="section-chip">${esc(app.t("interactive.shared.notes", lang()))}</span><h2>${esc(app.t("interactive.shared.explanation", lang()))}</h2></div>
            <div class="support-list">${config.notes.map(noteCard).join("")}</div>
          </article>
          <article class="module-panel glass-card">
            <div class="module-panel__header"><span class="section-chip">${esc(app.t("interactive.shared.steps", lang()))}</span><h2>${esc(text(pair("Step-by-step solution", "الحل خطوة بخطوة")))}</h2></div>
            <div class="steps-list">${view ? view.steps.map(function (item, index) { return stepCard(index + 1, item); }).join("") : `<div class="empty-state"><p>${esc(text(config.resultPlaceholder))}</p></div>`}</div>
          </article>
        </div>
      </section>
    `;

    root.querySelectorAll("[data-unit-category]").forEach(function (select) {
      const category = select.getAttribute("data-unit-category");
      const selected = select.getAttribute("data-selected");
      select.innerHTML = Object.keys(unitCatalog[category].units).map(function (key) {
        return `<option value="${key}"${key === selected ? " selected" : ""}>${unitLabel(category, key)}</option>`;
      }).join("");
    });

    const form = root.querySelector("#dynamic-tool-form");
    const status = root.querySelector("#dynamic-tool-status");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      root.querySelectorAll("[data-field]").forEach(function (field) { field.classList.remove("field-error"); });

      try {
        const values = {};
        config.inputs.forEach(function (field) {
          const wrapper = root.querySelector(`[data-field="${field.name}"]`);
          const input = form.elements[field.name];
          values[field.name] = validateField(field, input, wrapper);
          if (field.category) {
            values[`${field.name}Unit`] = form.elements[`${field.name}Unit`].value;
          }
        });
        (config.selectors || []).forEach(function (field) {
          values[field.name] = form.elements[field.name].value;
        });
        state.values = values;
        state.result = config.calculate(values);
        saveReport(buildExportPayload(config, config.present(state.result)));
        render();
      } catch (error) {
        status.textContent = error.message || app.t("interactive.shared.validation", lang());
        status.setAttribute("data-state", "error");
      }
    });

    root.querySelector("#dynamic-tool-clear").addEventListener("click", function () {
      state.values = {};
      state.result = null;
      render();
    });
  }

  render();
  document.addEventListener(app.eventName, render);
})();
