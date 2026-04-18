(function () {
  "use strict";

  const app = window.StrengthSolverApp;
  const root = document.getElementById("tool-root");
  const exportStorageKey = "ahmedsolver-export-history";

  if (!app || !root) {
    return;
  }

  const unitCatalog = {
    force: {
      baseKey: "N",
      units: {
        N: { symbol: "N", factor: 1, label: { en: "newton", ar: "نيوتن" } },
        kN: { symbol: "kN", factor: 1000, label: { en: "kilonewton", ar: "كيلو نيوتن" } },
        lbf: { symbol: "lbf", factor: 4.4482216152605, label: { en: "pound-force", ar: "رطل-قوة" } }
      }
    },
    stress: {
      baseKey: "Pa",
      units: {
        Pa: { symbol: "Pa", factor: 1, label: { en: "pascal", ar: "باسكال" } },
        kPa: { symbol: "kPa", factor: 1000, label: { en: "kilopascal", ar: "كيلو باسكال" } },
        MPa: { symbol: "MPa", factor: 1000000, label: { en: "megapascal", ar: "ميغاباسكال" } },
        GPa: { symbol: "GPa", factor: 1000000000, label: { en: "gigapascal", ar: "غيغاباسكال" } },
        psi: { symbol: "psi", factor: 6894.757293168, label: { en: "psi", ar: "رطل لكل بوصة مربعة" } }
      }
    },
    length: {
      baseKey: "m",
      units: {
        mm: { symbol: "mm", factor: 0.001, label: { en: "millimeter", ar: "ملليمتر" } },
        cm: { symbol: "cm", factor: 0.01, label: { en: "centimeter", ar: "سنتيمتر" } },
        m: { symbol: "m", factor: 1, label: { en: "meter", ar: "متر" } },
        in: { symbol: "in", factor: 0.0254, label: { en: "inch", ar: "بوصة" } },
        ft: { symbol: "ft", factor: 0.3048, label: { en: "foot", ar: "قدم" } }
      }
    },
    area: {
      baseKey: "m2",
      units: {
        mm2: { symbol: "mm^2", factor: 1e-6, label: { en: "square millimeter", ar: "ملليمتر مربع" } },
        cm2: { symbol: "cm^2", factor: 1e-4, label: { en: "square centimeter", ar: "سنتيمتر مربع" } },
        m2: { symbol: "m^2", factor: 1, label: { en: "square meter", ar: "متر مربع" } },
        in2: { symbol: "in^2", factor: 0.00064516, label: { en: "square inch", ar: "بوصة مربعة" } }
      }
    },
    inertia: {
      baseKey: "m4",
      units: {
        mm4: { symbol: "mm^4", factor: 1e-12, label: { en: "mm to the fourth", ar: "ملليمتر للقوة الرابعة" } },
        cm4: { symbol: "cm^4", factor: 1e-8, label: { en: "cm to the fourth", ar: "سنتيمتر للقوة الرابعة" } },
        m4: { symbol: "m^4", factor: 1, label: { en: "m to the fourth", ar: "متر للقوة الرابعة" } },
        in4: { symbol: "in^4", factor: 4.162314256e-7, label: { en: "in to the fourth", ar: "بوصة للقوة الرابعة" } }
      }
    },
    torque: {
      baseKey: "Nm",
      units: {
        Nm: { symbol: "N·m", factor: 1, label: { en: "newton-meter", ar: "نيوتن.متر" } },
        kNm: { symbol: "kN·m", factor: 1000, label: { en: "kilonewton-meter", ar: "كيلو نيوتن.متر" } },
        lbfft: { symbol: "lbf·ft", factor: 1.3558179483314, label: { en: "pound-foot", ar: "رطل.قدم" } }
      }
    },
    strain: {
      baseKey: "ratio",
      units: {
        ratio: { symbol: "m/m", factor: 1, label: { en: "ratio", ar: "نسبة" } },
        microstrain: { symbol: "µε", factor: 1e-6, label: { en: "microstrain", ar: "مايكروسترين" } },
        percent: { symbol: "%", factor: 0.01, label: { en: "percent", ar: "بالمئة" } }
      }
    },
    tempDiff: {
      baseKey: "C",
      units: {
        C: { symbol: "°C", factor: 1, label: { en: "degree Celsius", ar: "درجة مئوية" } },
        K: { symbol: "K", factor: 1, label: { en: "kelvin difference", ar: "فرق كلفن" } },
        F: { symbol: "°F", factor: 5 / 9, label: { en: "degree Fahrenheit", ar: "درجة فهرنهايت" } }
      }
    },
    thermalCoeff: {
      baseKey: "perC",
      units: {
        perC: { symbol: "/°C", factor: 1, label: { en: "per degree Celsius", ar: "لكل درجة مئوية" } },
        perK: { symbol: "/K", factor: 1, label: { en: "per kelvin", ar: "لكل كلفن" } },
        perF: { symbol: "/°F", factor: 1.8, label: { en: "per degree Fahrenheit", ar: "لكل درجة فهرنهايت" } }
      }
    }
  };

  const inertiaShapeCatalog = {
    rectangle: {
      title: { en: "Rectangle", ar: "مستطيل" },
      formula: "I = (b × h^3) / 12",
      fields: [
        { name: "shapeWidth", label: { en: "Width (b)", ar: "العرض (b)" } },
        { name: "shapeHeight", label: { en: "Height (h)", ar: "الارتفاع (h)" } }
      ],
      calculate: function (dimensions) {
        return (dimensions.shapeWidth * Math.pow(dimensions.shapeHeight, 3)) / 12;
      }
    },
    circle: {
      title: { en: "Circle", ar: "دائرة" },
      formula: "I = (π × d^4) / 64",
      fields: [
        { name: "shapeDiameter", label: { en: "Diameter (d)", ar: "القطر (d)" } }
      ],
      calculate: function (dimensions) {
        return (Math.PI * Math.pow(dimensions.shapeDiameter, 4)) / 64;
      }
    },
    hollowCircle: {
      title: { en: "Hollow circle", ar: "دائرة مجوفة" },
      formula: "I = (π × (D^4 - d^4)) / 64",
      fields: [
        { name: "shapeOuterDiameter", label: { en: "Outer diameter (D)", ar: "القطر الخارجي (D)" } },
        { name: "shapeInnerDiameter", label: { en: "Inner diameter (d)", ar: "القطر الداخلي (d)" } }
      ],
      calculate: function (dimensions) {
        return (Math.PI * (Math.pow(dimensions.shapeOuterDiameter, 4) - Math.pow(dimensions.shapeInnerDiameter, 4))) / 64;
      },
      validate: function (dimensions) {
        return dimensions.shapeInnerDiameter < dimensions.shapeOuterDiameter;
      }
    }
  };

  const state = {
    values: {},
    result: null,
    statusState: "neutral",
    statusMessage: ""
  };

  function pair(en, ar) {
    return { en: en, ar: ar };
  }

  function note(titleEn, titleAr, textEn, textAr) {
    return {
      title: pair(titleEn, titleAr),
      text: pair(textEn, textAr)
    };
  }

  function field(config) {
    return config;
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
    const unit = unitDef(category, key);
    return `${num(value, decimals)} ${unit ? unit.symbol : ""}`.trim();
  }

  function baseUnitSymbol(category) {
    const baseKey = unitCatalog[category] ? unitCatalog[category].baseKey : null;
    const unit = baseKey ? unitDef(category, baseKey) : null;
    return unit ? unit.symbol : "";
  }

  function readyMessage() {
    return text(pair(
      "Leave exactly one variable empty and AhmedSolver will solve for it.",
      "اترك متغيراً واحداً فارغاً تماماً وسيقوم AhmedSolver بحله."
    ));
  }

  function successMessage() {
    return text(pair(
      "Solution completed with engineering checks.",
      "اكتمل الحل مع التحقق الهندسي."
    ));
  }

  function insufficientDataMessage() {
    return text(pair(
      "Insufficient data: more than one variable is empty.",
      "البيانات غير كافية: أكثر من متغير واحد فارغ."
    ));
  }

  function leaveOneEmptyMessage() {
    return text(pair(
      "Please leave exactly one variable empty to solve.",
      "يرجى ترك متغير واحد فقط فارغاً من أجل الحل."
    ));
  }

  function invalidFieldMessage(fieldConfig) {
    return lang() === "ar"
      ? `تنسيق الرقم غير صالح في ${text(fieldConfig.title)}.`
      : `Invalid number format in ${text(fieldConfig.title)}.`;
  }

  function positiveFieldMessage(fieldConfig) {
    return lang() === "ar"
      ? `يجب أن تكون قيمة ${text(fieldConfig.title)} أكبر من الصفر.`
      : `${text(fieldConfig.title)} must be greater than zero.`;
  }

  function zeroDividerMessage(label) {
    return lang() === "ar"
      ? `لا يمكن أن تكون قيمة ${label} صفراً في هذه الصيغة المعاد ترتيبها.`
      : `${label} cannot be zero for this rearranged formula.`;
  }

  function valueLabel() {
    return text(pair("Value", "القيمة"));
  }

  function unitHeading() {
    return text(pair("Unit", "الوحدة"));
  }

  function inconsistentInputMessage() {
    return text(pair(
      "Could not solve due to inconsistent inputs.",
      "تعذر الحل بسبب قيم غير متسقة."
    ));
  }

  function logSolverDebug(message, details) {
    if (typeof console === "undefined" || typeof console.log !== "function") {
      return;
    }

    if (typeof details === "undefined") {
      console.log(`[AhmedSolver Solver] ${message}`);
      return;
    }

    console.log(`[AhmedSolver Solver] ${message}`, details);
  }

  function normalizeInputValue(rawValue) {
    const raw = rawValue == null ? "" : String(rawValue);
    const trimmed = raw.trim();

    return {
      raw: raw,
      normalized: trimmed,
      isEmpty: trimmed === ""
    };
  }

  function collectRawInputSnapshot(form) {
    const snapshot = {};

    Array.from(form.elements).forEach(function (element) {
      if (!element || !element.name) {
        return;
      }

      if (element.type === "radio") {
        if (element.checked) {
          snapshot[element.name] = element.value;
        }

        return;
      }

      snapshot[element.name] = typeof element.value === "string" ? element.value : "";
    });

    return snapshot;
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

  function buildExportPayload(config, view) {
    return {
      topic: app.t(`topics.${config.moduleKey}.title`, lang()),
      formula: config.formula,
      inputs: view.exportInputs,
      finalAnswer: view.exportAnswer,
      steps: view.exportSteps
    };
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

  function getFieldValue(fieldConfig) {
    return state.values[fieldConfig.name];
  }

  function getFieldUnit(fieldConfig) {
    return state.values[`${fieldConfig.name}Unit`] || fieldConfig.defaultUnit;
  }

  function getFieldWrapper(fieldName) {
    return root.querySelector(`[data-field="${fieldName}"]`);
  }

  function clearFieldStates() {
    root.querySelectorAll("[data-field]").forEach(function (node) {
      node.classList.remove("field-error", "field-unknown");
    });
  }

  function defaultCaptureState(config, form, values) {
    config.fields.forEach(function (fieldConfig) {
      if (fieldConfig.customType) {
        return;
      }

      const input = form.elements[fieldConfig.name];
      const unit = form.elements[`${fieldConfig.name}Unit`];
      values[fieldConfig.name] = input ? (input.value.trim() === "" ? null : input.value.trim()) : null;
      values[`${fieldConfig.name}Unit`] = unit ? unit.value : fieldConfig.defaultUnit;
    });
  }

  function captureBendingExtras(form, values) {
    values.inertiaMode = form.elements.inertiaMode ? form.elements.inertiaMode.value : (values.inertiaMode || "direct");
    values.inertiaShape = form.elements.inertiaShape ? form.elements.inertiaShape.value : (values.inertiaShape || "rectangle");
    values.inertiaDimensionUnit = form.elements.inertiaDimensionUnit ? form.elements.inertiaDimensionUnit.value : (values.inertiaDimensionUnit || "mm");
    values.inertiaUnit = form.elements.inertiaUnit ? form.elements.inertiaUnit.value : (values.inertiaUnit || "mm4");
    values.inertia = form.elements.inertia ? (form.elements.inertia.value.trim() === "" ? null : form.elements.inertia.value.trim()) : null;
    values.shapeWidth = form.elements.shapeWidth ? (form.elements.shapeWidth.value.trim() === "" ? null : form.elements.shapeWidth.value.trim()) : null;
    values.shapeHeight = form.elements.shapeHeight ? (form.elements.shapeHeight.value.trim() === "" ? null : form.elements.shapeHeight.value.trim()) : null;
    values.shapeDiameter = form.elements.shapeDiameter ? (form.elements.shapeDiameter.value.trim() === "" ? null : form.elements.shapeDiameter.value.trim()) : null;
    values.shapeOuterDiameter = form.elements.shapeOuterDiameter ? (form.elements.shapeOuterDiameter.value.trim() === "" ? null : form.elements.shapeOuterDiameter.value.trim()) : null;
    values.shapeInnerDiameter = form.elements.shapeInnerDiameter ? (form.elements.shapeInnerDiameter.value.trim() === "" ? null : form.elements.shapeInnerDiameter.value.trim()) : null;
  }

  function captureCurrentFormState(config) {
    const form = root.querySelector("#solver-form");

    if (!form) {
      return;
    }

    const nextValues = {};
    defaultCaptureState(config, form, nextValues);

    if (typeof config.captureExtraState === "function") {
      config.captureExtraState(form, nextValues);
    }

    const changed = JSON.stringify(nextValues) !== JSON.stringify(state.values);
    state.values = nextValues;

    if (changed) {
      state.result = null;
    }
  }

  function setStatusState(message, nextState) {
    state.statusMessage = message || "";
    state.statusState = nextState || "neutral";
  }

  function currentStatusMessage(viewExists) {
    if (state.statusMessage) {
      return state.statusMessage;
    }

    return viewExists ? successMessage() : readyMessage();
  }

  function currentStatusState(viewExists) {
    if (state.statusMessage) {
      return state.statusState || "neutral";
    }

    return viewExists ? "success" : "neutral";
  }

  function assertNonZero(value, label) {
    if (Math.abs(value) < 1e-12) {
      throw new Error(zeroDividerMessage(label));
    }

    return value;
  }

  function parseNumber(rawValue) {
    const normalized = normalizeInputValue(rawValue);

    if (normalized.isEmpty) {
      return null;
    }

    const value = Number(normalized.normalized);
    return Number.isFinite(value) ? value : NaN;
  }

  function parseStandardField(fieldConfig, form, values, emptyFields) {
    const wrapper = getFieldWrapper(fieldConfig.name);
    const input = form.elements[fieldConfig.name];
    const normalizedInput = normalizeInputValue(input ? input.value : "");

    values[`${fieldConfig.name}Unit`] = form.elements[`${fieldConfig.name}Unit`]
      ? form.elements[`${fieldConfig.name}Unit`].value
      : fieldConfig.defaultUnit;

    logSolverDebug("Field normalization", {
      field: fieldConfig.name,
      raw: normalizedInput.raw,
      normalized: normalizedInput.normalized,
      isEmpty: normalizedInput.isEmpty,
      unit: values[`${fieldConfig.name}Unit`]
    });

    if (normalizedInput.isEmpty) {
      values[fieldConfig.name] = null;
      emptyFields.push(fieldConfig.name);
      return;
    }

    const numericValue = parseNumber(normalizedInput.normalized);

    if (!Number.isFinite(numericValue)) {
      if (wrapper) {
        wrapper.classList.add("field-error");
      }

      logSolverDebug("Validation failed", {
        field: fieldConfig.name,
        reason: "invalid-number-format",
        raw: normalizedInput.raw,
        normalized: normalizedInput.normalized
      });

      throw new Error(invalidFieldMessage(fieldConfig));
    }

    if (fieldConfig.positive && numericValue <= 0) {
      if (wrapper) {
        wrapper.classList.add("field-error");
      }

      logSolverDebug("Validation failed", {
        field: fieldConfig.name,
        reason: "non-positive-value",
        value: numericValue
      });

      throw new Error(positiveFieldMessage(fieldConfig));
    }

    values[fieldConfig.name] = numericValue;
  }

  function buildShapePreview(sourceValues) {
    const mode = sourceValues.inertiaMode || "direct";

    if (mode !== "shape") {
      return null;
    }

    const shapeKey = sourceValues.inertiaShape || "rectangle";
    const shapeConfig = inertiaShapeCatalog[shapeKey];
    const dimensionUnit = sourceValues.inertiaDimensionUnit || "mm";
    const outputUnit = sourceValues.inertiaUnit || "mm4";
    const parsedDimensions = {};
    const dimensionRows = [];
    let invalidField = null;
    let missingField = null;

    shapeConfig.fields.forEach(function (dimensionField) {
      const rawValue = sourceValues[dimensionField.name];
      const parsed = parseNumber(rawValue);

      if (parsed === null) {
        missingField = missingField || dimensionField;
        return;
      }

      if (!Number.isFinite(parsed) || parsed <= 0) {
        invalidField = invalidField || dimensionField;
        return;
      }

      parsedDimensions[dimensionField.name] = toBase("length", parsed, dimensionUnit);
      dimensionRows.push(`${text(dimensionField.label)} = ${withUnit("length", dimensionUnit, parsed, 6)}`);
    });

    if (invalidField) {
      return {
        mode: mode,
        complete: false,
        error: lang() === "ar"
          ? `أدخل بعداً صحيحاً وموجباً لـ ${text(invalidField.label)}.`
          : `Enter a valid positive dimension for ${text(invalidField.label)}.`
      };
    }

    if (missingField) {
      return {
        mode: mode,
        complete: false
      };
    }

    if (typeof shapeConfig.validate === "function" && !shapeConfig.validate(parsedDimensions)) {
      return {
        mode: mode,
        complete: false,
        error: text(pair(
          "Inner diameter must be smaller than outer diameter.",
          "يجب أن يكون القطر الداخلي أصغر من القطر الخارجي."
        ))
      };
    }

    const baseValue = shapeConfig.calculate(parsedDimensions);
    const displayValue = fromBase("inertia", baseValue, outputUnit);

    return {
      mode: mode,
      complete: true,
      shapeKey: shapeKey,
      shapeTitle: shapeConfig.title,
      formula: shapeConfig.formula,
      baseValue: baseValue,
      displayValue: displayValue,
      outputUnit: outputUnit,
      dimensionUnit: dimensionUnit,
      dimensionRows: dimensionRows
    };
  }

  function parseBendingSubmission(config, form) {
    const values = {};
    const emptyFields = [];
    const meta = {};

    config.fields.forEach(function (fieldConfig) {
      if (fieldConfig.name === "inertia") {
        return;
      }

      parseStandardField(fieldConfig, form, values, emptyFields);
    });

    values.inertiaMode = form.elements.inertiaMode ? form.elements.inertiaMode.value : "direct";
    values.inertiaShape = form.elements.inertiaShape ? form.elements.inertiaShape.value : "rectangle";
    values.inertiaDimensionUnit = form.elements.inertiaDimensionUnit ? form.elements.inertiaDimensionUnit.value : "mm";
    values.inertiaUnit = form.elements.inertiaUnit ? form.elements.inertiaUnit.value : "mm4";

    logSolverDebug("Bending extras", {
      inertiaMode: values.inertiaMode,
      inertiaShape: values.inertiaShape,
      inertiaDimensionUnit: values.inertiaDimensionUnit,
      inertiaUnit: values.inertiaUnit
    });

    const inertiaWrapper = getFieldWrapper("inertia");

    if (values.inertiaMode === "direct") {
      parseStandardField(config.fields.find(function (fieldConfig) {
        return fieldConfig.name === "inertia";
      }), form, values, emptyFields);
    } else {
      const preview = buildShapePreview({
        inertiaMode: values.inertiaMode,
        inertiaShape: values.inertiaShape,
        inertiaDimensionUnit: values.inertiaDimensionUnit,
        inertiaUnit: values.inertiaUnit,
        shapeWidth: form.elements.shapeWidth ? form.elements.shapeWidth.value.trim() : null,
        shapeHeight: form.elements.shapeHeight ? form.elements.shapeHeight.value.trim() : null,
        shapeDiameter: form.elements.shapeDiameter ? form.elements.shapeDiameter.value.trim() : null,
        shapeOuterDiameter: form.elements.shapeOuterDiameter ? form.elements.shapeOuterDiameter.value.trim() : null,
        shapeInnerDiameter: form.elements.shapeInnerDiameter ? form.elements.shapeInnerDiameter.value.trim() : null
      });

      if (!preview || !preview.complete) {
        if (inertiaWrapper) {
          inertiaWrapper.classList.add("field-error");
        }

        logSolverDebug("Validation failed", {
          field: "inertia",
          reason: "shape-preview-incomplete",
          preview: preview || null
        });

        throw new Error(preview && preview.error ? preview.error : text(pair(
          "Complete the section dimensions or switch to direct I entry.",
          "أكمل أبعاد المقطع أو ارجع إلى إدخال I مباشرة."
        )));
      }

      values.inertia = preview.displayValue;
      meta.inertia = preview;
    }

    if (emptyFields.length > 1) {
      logSolverDebug("Unknown detection failed", {
        reason: "multiple-empty-fields",
        emptyFields: emptyFields.slice()
      });

      emptyFields.forEach(function (fieldName) {
        const wrapper = getFieldWrapper(fieldName);

        if (wrapper) {
          wrapper.classList.add("field-error");
        }
      });

      throw new Error(insufficientDataMessage());
    }

    if (emptyFields.length === 0) {
      logSolverDebug("Unknown detection failed", {
        reason: "no-empty-fields"
      });

      throw new Error(leaveOneEmptyMessage());
    }

    const unknownWrapper = getFieldWrapper(emptyFields[0]);

    if (unknownWrapper) {
      unknownWrapper.classList.add("field-unknown");
    }

    logSolverDebug("Unknown detected", {
      field: emptyFields[0],
      emptyFields: emptyFields.slice()
    });

    return {
      values: values,
      unknownKey: emptyFields[0],
      meta: meta
    };
  }

  function parseDefaultSubmission(config, form) {
    const values = {};
    const emptyFields = [];

    config.fields.forEach(function (fieldConfig) {
      parseStandardField(fieldConfig, form, values, emptyFields);
    });

    if (emptyFields.length > 1) {
      logSolverDebug("Unknown detection failed", {
        reason: "multiple-empty-fields",
        emptyFields: emptyFields.slice()
      });

      emptyFields.forEach(function (fieldName) {
        const wrapper = getFieldWrapper(fieldName);

        if (wrapper) {
          wrapper.classList.add("field-error");
        }
      });

      throw new Error(insufficientDataMessage());
    }

    if (emptyFields.length === 0) {
      logSolverDebug("Unknown detection failed", {
        reason: "no-empty-fields"
      });

      throw new Error(leaveOneEmptyMessage());
    }

    const unknownWrapper = getFieldWrapper(emptyFields[0]);

    if (unknownWrapper) {
      unknownWrapper.classList.add("field-unknown");
    }

    logSolverDebug("Unknown detected", {
      field: emptyFields[0],
      emptyFields: emptyFields.slice()
    });

    return {
      values: values,
      unknownKey: emptyFields[0],
      meta: {}
    };
  }

  function parseSolverInputs(config, form) {
    clearFieldStates();

    logSolverDebug("Solve attempt started", {
      slug: slug,
      rawInputs: collectRawInputSnapshot(form),
      normalizedInputs: JSON.parse(JSON.stringify(state.values || {}))
    });

    if (typeof config.parseSubmission === "function") {
      return config.parseSubmission(config, form);
    }

    return parseDefaultSubmission(config, form);
  }

  function pushWarning(list, kind, title, message) {
    const resolvedTitle = text(title);
    const resolvedMessage = text(message);
    const signature = `${kind}|${resolvedTitle}|${resolvedMessage}`;

    if (list.some(function (item) { return item.signature === signature; })) {
      return;
    }

    list.push({
      kind: kind,
      title: resolvedTitle,
      message: resolvedMessage,
      signature: signature
    });
  }

  function addMaterialWarning(list, title, condition) {
    if (!condition) {
      return;
    }

    pushWarning(list, "warning", title, pair(
      "This result may be mathematically correct but not realistic for common engineering materials.",
      "قد تكون هذه النتيجة صحيحة رياضياً لكنها غير واقعية للمواد الهندسية الشائعة."
    ));
  }

  function addUnitsWarning(list, title, condition) {
    if (!condition) {
      return;
    }

    pushWarning(list, "review", title, pair(
      "Check units or dimensions: the value seems outside common engineering ranges.",
      "تحقق من الوحدات أو الأبعاد: تبدو القيمة خارج النطاقات الهندسية الشائعة."
    ));
  }

  function calculateSolverResult(config, payload) {
    const values = payload.values;
    const unknownKey = payload.unknownKey;
    const baseValues = {};
    const unknownField = config.fields.find(function (fieldConfig) {
      return fieldConfig.name === unknownKey;
    });

    config.fields.forEach(function (fieldConfig) {
      if (values[fieldConfig.name] == null) {
        return;
      }

      baseValues[fieldConfig.name] = toBase(fieldConfig.category, values[fieldConfig.name], values[`${fieldConfig.name}Unit`]);
    });

    const solvedBaseValue = config.solve[unknownKey](baseValues);

    if (!Number.isFinite(solvedBaseValue)) {
      throw new Error(text(pair(
        "AhmedSolver could not compute a finite answer from the provided values.",
        "لم يتمكن AhmedSolver من حساب ناتج عددي صحيح من القيم المدخلة."
      )));
    }

    if (unknownField.positive && solvedBaseValue <= 0) {
      throw new Error(positiveFieldMessage(unknownField));
    }

    baseValues[unknownKey] = solvedBaseValue;

    const solvedDisplayValue = fromBase(unknownField.category, solvedBaseValue, values[`${unknownKey}Unit`]);
    const result = {
      config: config,
      values: values,
      baseValues: baseValues,
      unknownKey: unknownKey,
      unknownField: unknownField,
      solvedBaseValue: solvedBaseValue,
      solvedDisplayValue: solvedDisplayValue,
      meta: payload.meta || {},
      engineeringWarnings: []
    };

    if (typeof config.decorateResult === "function") {
      config.decorateResult(result);
    }

    if (typeof config.engineeringChecks === "function") {
      config.engineeringChecks(result, result.engineeringWarnings);
    }

    return result;
  }

  function buildConversionLines(config, result) {
    const lines = [];

    if (typeof config.preConversionLines === "function") {
      config.preConversionLines(result).forEach(function (line) {
        lines.push(line);
      });
    }

    config.fields.forEach(function (fieldConfig) {
      if (fieldConfig.name === result.unknownKey) {
        return;
      }

      const rawValue = result.values[fieldConfig.name];
      const unitKey = result.values[`${fieldConfig.name}Unit`];
      const baseValue = result.baseValues[fieldConfig.name];
      lines.push(`${text(fieldConfig.title)} = ${withUnit(fieldConfig.category, unitKey, rawValue, 6)} = ${num(baseValue, 6)} ${baseUnitSymbol(fieldConfig.category)}`);
    });

    return lines;
  }

  function buildSummary(config, result) {
    return config.fields.map(function (fieldConfig) {
      const unitKey = result.values[`${fieldConfig.name}Unit`];
      const displayValue = fieldConfig.name === result.unknownKey ? result.solvedDisplayValue : result.values[fieldConfig.name];
      const solvedSuffix = fieldConfig.name === result.unknownKey ? text(pair(" (solved)", " (محسوب)")) : "";
      const shapeSuffix = fieldConfig.name === "inertia" && result.meta.inertia && result.meta.inertia.mode === "shape"
        ? text(pair(" (from shape)", " (من الشكل)"))
        : "";

      return {
        label: `${text(fieldConfig.title)}${solvedSuffix}${shapeSuffix}`,
        value: withUnit(fieldConfig.category, unitKey, displayValue, 6)
      };
    });
  }

  function buildValidationView(result) {
    if (result.engineeringWarnings.length) {
      return {
        state: "warning",
        summary: text(pair(
          "AhmedSolver found one or more values that need engineering review.",
          "اكتشف AhmedSolver قيمة أو أكثر تحتاج إلى مراجعة هندسية."
        )),
        warnings: result.engineeringWarnings
      };
    }

    return {
      state: "ok",
      summary: text(pair(
        "No obvious realism warnings were detected. Continue to compare against actual material limits and design requirements.",
        "لم تظهر تحذيرات واضحة في الواقعية الهندسية. استمر في المقارنة مع حدود المواد ومتطلبات التصميم الفعلية."
      )),
      warnings: []
    };
  }

  function renderValidationCard(validation) {
    const badgeText = validation.state === "warning"
      ? text(pair("Engineering review", "مراجعة هندسية"))
      : text(pair("Checks passed", "التحقق سليم"));

    return `
      <div class="result-card result-card--validation" data-state="${esc(validation.state)}">
        <div class="field-title">${esc(text(pair("Engineering validation", "التحقق الهندسي")))}</div>
        <div class="validation-summary">
          <span class="validation-badge">${esc(badgeText)}</span>
          <p>${esc(validation.summary)}</p>
        </div>
        ${validation.warnings.length ? `<div class="validation-list">${validation.warnings.map(function (warning) {
          return `<article class="validation-item" data-kind="${esc(warning.kind)}"><h4>${esc(warning.title)}</h4><p>${esc(warning.message)}</p></article>`;
        }).join("")}</div>` : ""}
      </div>
    `;
  }

  function buildSolverView(config, result) {
    const unknownField = result.unknownField;
    const unitKey = result.values[`${result.unknownKey}Unit`];
    const finalAnswer = `${unknownField.badge} = ${withUnit(unknownField.category, unitKey, result.solvedDisplayValue, 6)}`;
    const baseAnswer = `${num(result.solvedBaseValue, 6)} ${baseUnitSymbol(unknownField.category)}`;
    const conversionLines = buildConversionLines(config, result);
    const summary = buildSummary(config, result);
    const metrics = typeof config.metrics === "function" ? config.metrics(result) : [];
    const validation = buildValidationView(result);
    const preSteps = typeof config.preSteps === "function" ? config.preSteps(result) : [];

    return {
      final: finalAnswer,
      secondary: `${text(pair("Detected unknown", "المتغير المجهول"))}: ${text(unknownField.title)} | ${text(pair("Base SI result", "النتيجة بوحدة الأساس"))}: ${baseAnswer}`,
      summary: summary,
      metrics: metrics,
      validation: validation,
      steps: preSteps.concat([
        {
          title: text(pair("Original formula", "المعادلة الأصلية")),
          body: `<div class="equation-line">${esc(config.formula)}</div>`
        },
        {
          title: text(pair("Detected unknown", "المتغير المجهول")),
          body: `<p>${esc(text(unknownField.title))}</p>`
        },
        {
          title: text(pair("Rearranged formula", "إعادة ترتيب المعادلة")),
          body: `<div class="equation-line">${esc(config.rearranged[result.unknownKey])}</div>`
        },
        {
          title: text(pair("Convert known values to base units", "تحويل القيم المعروفة إلى وحدات الأساس")),
          body: `<p>${conversionLines.map(esc).join("<br>")}</p>`
        },
        {
          title: text(pair("Numerical substitution", "التعويض العددي")),
          body: `<div class="equation-line">${esc(config.substitution[result.unknownKey](result))}</div>`
        },
        {
          title: text(pair("Final answer", "الإجابة النهائية")),
          body: `<p>${esc(finalAnswer)}<br>${esc(`${text(pair("Base SI result", "النتيجة بوحدة الأساس"))}: ${baseAnswer}`)}</p>`
        }
      ]),
      exportInputs: summary.map(function (item) {
        return `${item.label}: ${item.value}`;
      }),
      exportAnswer: finalAnswer,
      exportSteps: [
        `${text(pair("Original formula", "المعادلة الأصلية"))}: ${config.formula}`,
        `${text(pair("Detected unknown", "المتغير المجهول"))}: ${text(unknownField.title)}`,
        `${text(pair("Rearranged formula", "إعادة ترتيب المعادلة"))}: ${config.rearranged[result.unknownKey]}`,
        `${text(pair("Convert known values to base units", "تحويل القيم المعروفة إلى وحدات الأساس"))}: ${conversionLines.join(" | ")}`,
        `${text(pair("Numerical substitution", "التعويض العددي"))}: ${config.substitution[result.unknownKey](result)}`,
        `${text(pair("Final answer", "الإجابة النهائية"))}: ${finalAnswer}`,
        `${text(pair("Engineering validation", "التحقق الهندسي"))}: ${validation.summary}`
      ]
    };
  }

  function renderStandardField(fieldConfig) {
    const value = getFieldValue(fieldConfig);
    const unitValue = getFieldUnit(fieldConfig);
    const isUnknown = state.result && state.result.unknownKey === fieldConfig.name ? " field-unknown" : "";
    const description = text(fieldConfig.description || pair(
      "Enter the value in the selected unit, or leave this card empty to solve for it.",
      "أدخل القيمة بالوحدة المختارة، أو اترك هذه البطاقة فارغة ليتم حلها."
    ));
    const hint = text(fieldConfig.hint || pair(
      "Leave this variable empty only when it is the unknown.",
      "اترك هذا المتغير فارغاً فقط عندما يكون هو المجهول."
    ));

    return `
      <section class="solver-variable${isUnknown}" data-field="${esc(fieldConfig.name)}">
        <div class="solver-variable__header">
          <div class="solver-variable__badge">${esc(fieldConfig.badge)}</div>
          <h3 class="solver-variable__title">${esc(text(fieldConfig.title))}</h3>
          <p class="solver-variable__description">${esc(description)}</p>
        </div>
        <div class="solver-variable__body">
          <div class="field">
            <label for="solver-${esc(fieldConfig.name)}">${esc(valueLabel())}</label>
            <input
              id="solver-${esc(fieldConfig.name)}"
              name="${esc(fieldConfig.name)}"
              class="input-control"
              type="number"
              inputmode="decimal"
              step="any"
              ${fieldConfig.positive ? 'min="0"' : ""}
              value="${value == null ? "" : esc(value)}"
              placeholder="${esc(text(fieldConfig.placeholder || pair("Enter a value or leave empty to solve", "أدخل قيمة أو اترك الحقل فارغاً للحل")))}"
            >
          </div>
          <div class="field">
            <label for="solver-${esc(fieldConfig.name)}-unit">${esc(unitHeading())}</label>
            <select
              id="solver-${esc(fieldConfig.name)}-unit"
              name="${esc(fieldConfig.name)}Unit"
              class="select-control"
              data-unit-category="${esc(fieldConfig.category)}"
              data-selected="${esc(unitValue)}"
            ></select>
          </div>
        </div>
        <p class="field-help solver-variable__hint">${esc(hint)}</p>
      </section>
    `;
  }

  function renderInertiaField(fieldConfig) {
    const isUnknown = state.result && state.result.unknownKey === fieldConfig.name ? " field-unknown" : "";
    const mode = state.values.inertiaMode || "direct";
    const shape = state.values.inertiaShape || "rectangle";
    const inertiaUnit = state.values.inertiaUnit || fieldConfig.defaultUnit;
    const dimensionUnit = state.values.inertiaDimensionUnit || "mm";
    const preview = buildShapePreview({
      inertiaMode: mode,
      inertiaShape: shape,
      inertiaDimensionUnit: dimensionUnit,
      inertiaUnit: inertiaUnit,
      shapeWidth: state.values.shapeWidth,
      shapeHeight: state.values.shapeHeight,
      shapeDiameter: state.values.shapeDiameter,
      shapeOuterDiameter: state.values.shapeOuterDiameter,
      shapeInnerDiameter: state.values.shapeInnerDiameter
    });
    const shapeConfig = inertiaShapeCatalog[shape];

    return `
      <section class="solver-variable${isUnknown}" data-field="${esc(fieldConfig.name)}">
        <div class="solver-variable__header">
          <div class="solver-variable__badge">${esc(fieldConfig.badge)}</div>
          <h3 class="solver-variable__title">${esc(text(fieldConfig.title))}</h3>
          <p class="solver-variable__description">${esc(text(fieldConfig.description))}</p>
        </div>
        <div class="solver-variable__body">
          <div class="field">
            <label>${esc(text(pair("Moment of inertia input mode", "طريقة إدخال عزم العطالة")))}</label>
            <div class="solver-toggle">
              <label class="solver-toggle__option">
                <input type="radio" name="inertiaMode" value="direct"${mode === "direct" ? " checked" : ""}>
                <span>${esc(text(pair("Enter I directly", "إدخال I مباشرة")))}</span>
              </label>
              <label class="solver-toggle__option">
                <input type="radio" name="inertiaMode" value="shape"${mode === "shape" ? " checked" : ""}>
                <span>${esc(text(pair("Calculate I from shape", "حساب I من الشكل")))}</span>
              </label>
            </div>
          </div>

          ${mode === "direct" ? `
            <div class="field">
              <label for="solver-inertia">${esc(valueLabel())}</label>
              <input
                id="solver-inertia"
                name="inertia"
                class="input-control"
                type="number"
                inputmode="decimal"
                step="any"
                min="0"
                value="${state.values.inertia == null ? "" : esc(state.values.inertia)}"
                placeholder="${esc(text(pair("Leave empty to solve for I", "اتركه فارغاً لحساب I")))}"
              >
            </div>
            <div class="field">
              <label for="solver-inertia-unit">${esc(unitHeading())}</label>
              <select
                id="solver-inertia-unit"
                name="inertiaUnit"
                class="select-control"
                data-unit-category="inertia"
                data-selected="${esc(inertiaUnit)}"
              ></select>
            </div>
          ` : `
            <div class="field">
              <label for="solver-inertia-shape">${esc(text(pair("Section shape", "شكل المقطع")))}</label>
              <select id="solver-inertia-shape" name="inertiaShape" class="select-control">
                ${Object.keys(inertiaShapeCatalog).map(function (shapeKey) {
                  return `<option value="${esc(shapeKey)}"${shapeKey === shape ? " selected" : ""}>${esc(text(inertiaShapeCatalog[shapeKey].title))}</option>`;
                }).join("")}
              </select>
            </div>
            <div class="field">
              <label for="solver-inertia-dimension-unit">${esc(text(pair("Dimension unit", "وحدة الأبعاد")))}</label>
              <select
                id="solver-inertia-dimension-unit"
                name="inertiaDimensionUnit"
                class="select-control"
                data-unit-category="length"
                data-selected="${esc(dimensionUnit)}"
              ></select>
            </div>
            <div class="shape-field-grid">
              ${shapeConfig.fields.map(function (dimensionField) {
                const rawValue = state.values[dimensionField.name];
                return `
                  <div class="field">
                    <label for="solver-${esc(dimensionField.name)}">${esc(text(dimensionField.label))}</label>
                    <input
                      id="solver-${esc(dimensionField.name)}"
                      name="${esc(dimensionField.name)}"
                      class="input-control"
                      type="number"
                      inputmode="decimal"
                      min="0"
                      step="any"
                      value="${rawValue == null ? "" : esc(rawValue)}"
                      placeholder="${esc(text(pair("Enter dimension", "أدخل البعد")))}"
                    >
                  </div>
                `;
              }).join("")}
            </div>
            <div class="field">
              <label for="solver-inertia-unit">${esc(text(pair("Computed I unit", "وحدة I المحسوب")))}</label>
              <select
                id="solver-inertia-unit"
                name="inertiaUnit"
                class="select-control"
                data-unit-category="inertia"
                data-selected="${esc(inertiaUnit)}"
              ></select>
            </div>
            <div class="inertia-preview">
              <h4>${esc(text(pair("Shape-based inertia preview", "معاينة عزم العطالة من الشكل")))}</h4>
              <div class="equation-line">${esc(shapeConfig.formula)}</div>
              ${preview && preview.complete ? `
                <p>${preview.dimensionRows.map(esc).join("<br>")}</p>
                <p><strong>${esc(text(pair("Computed I", "قيمة I المحسوبة")))}:</strong> ${esc(withUnit("inertia", inertiaUnit, preview.displayValue, 6))}</p>
              ` : `<p>${esc(preview && preview.error ? preview.error : text(pair(
                "Enter the section dimensions to calculate I automatically.",
                "أدخل أبعاد المقطع ليتم حساب I تلقائياً."
              )))}</p>`}
            </div>
          `}
        </div>
        <p class="field-help solver-variable__hint">${esc(mode === "direct"
          ? text(pair("Leave this card empty only if you want AhmedSolver to solve for I itself.", "اترك هذه البطاقة فارغة فقط إذا أردت من AhmedSolver حل I نفسه."))
          : text(pair("Shape mode treats I as a computed known value. Leave another variable empty to solve the bending equation.", "وضع الشكل يعتبر I قيمة معلومة محسوبة. اترك متغيراً آخر فارغاً لحل معادلة الانحناء.")))}</p>
      </section>
    `;
  }

  function renderSolverField(fieldConfig) {
    if (fieldConfig.customType === "inertia") {
      return renderInertiaField(fieldConfig);
    }

    return renderStandardField(fieldConfig);
  }

  function createStressWarningChecks(result, warnings, areaKey, stressKey) {
    const stressValue = Math.abs(result.baseValues[stressKey]);
    const areaValue = areaKey ? result.baseValues[areaKey] : null;

    addMaterialWarning(warnings, pair("Stress level warning", "تحذير مستوى الإجهاد"), stressValue > 1.5e9);
    addUnitsWarning(warnings, pair("Stress level review", "مراجعة مستوى الإجهاد"), stressValue > 5e9);

    if (areaValue != null) {
      addUnitsWarning(warnings, pair("Area realism check", "فحص واقعية المساحة"), areaValue < 1e-10 || areaValue > 1);
    }
  }

  function createLengthWarningChecks(warnings, value, title) {
    addUnitsWarning(warnings, title, value < 1e-5 || value > 100);
  }

  const solverConfigs = {
    stress: {
      moduleKey: "stress",
      formula: "σ = P / A",
      subtitle: pair(
        "Solve normal stress, applied load, or area by leaving one variable empty.",
        "احسب الإجهاد العمودي أو الحمل أو المساحة عبر ترك متغير واحد فارغاً."
      ),
      explanation: pair(
        "Normal stress links axial load to the resisting cross-sectional area of the member.",
        "يربط الإجهاد العمودي الحمل المحوري بمساحة المقطع المقاومة للعضو."
      ),
      resultPlaceholder: pair(
        "The solved stress variable, engineering checks, and full steps will appear here.",
        "سيظهر هنا المتغير المحسوب في الإجهاد مع التحقق الهندسي والخطوات كاملة."
      ),
      notes: [
        note("Sign convention", "إشارة الحمل", "Use positive load for tension and negative load for compression when the load is known.", "استخدم حملاً موجباً للشد وحملاً سالباً للضغط عندما يكون الحمل معلوماً."),
        note("Area meaning", "معنى المساحة", "Use the net resisting area that actually carries the axial force.", "استخدم المساحة الصافية المقاومة التي تنقل الحمل المحوري فعلياً.")
      ],
      fields: [
        field({
          name: "load",
          badge: "P",
          title: pair("Applied load (P)", "الحمل المؤثر (P)"),
          description: pair("Known axial force acting on the member.", "القوة المحورية المعلومة المؤثرة على العضو."),
          category: "force",
          defaultUnit: "kN",
          placeholder: pair("Leave empty to solve for P", "اتركه فارغاً لحساب P")
        }),
        field({
          name: "area",
          badge: "A",
          title: pair("Area (A)", "المساحة (A)"),
          description: pair("Net cross-sectional area resisting the load.", "مساحة المقطع الصافية المقاومة للحمل."),
          category: "area",
          defaultUnit: "mm2",
          positive: true,
          placeholder: pair("Leave empty to solve for A", "اتركها فارغة لحساب A")
        }),
        field({
          name: "stress",
          badge: "σ",
          title: pair("Normal stress (σ)", "الإجهاد العمودي (σ)"),
          description: pair("Average normal stress on the loaded section.", "الإجهاد العمودي المتوسط على المقطع المحمل."),
          category: "stress",
          defaultUnit: "MPa",
          placeholder: pair("Leave empty to solve for σ", "اتركه فارغاً لحساب σ")
        })
      ],
      rearranged: {
        stress: "σ = P / A",
        load: "P = σ × A",
        area: "A = P / σ"
      },
      solve: {
        stress: function (base) {
          return base.load / base.area;
        },
        load: function (base) {
          return base.stress * base.area;
        },
        area: function (base) {
          return base.load / assertNonZero(base.stress, text(pair("Normal stress (σ)", "الإجهاد العمودي (σ)")));
        }
      },
      substitution: {
        stress: function (result) {
          return `σ = ${num(result.baseValues.load, 6)} / ${num(result.baseValues.area, 6)} = ${num(result.solvedBaseValue, 6)} Pa`;
        },
        load: function (result) {
          return `P = ${num(result.baseValues.stress, 6)} × ${num(result.baseValues.area, 6)} = ${num(result.solvedBaseValue, 6)} N`;
        },
        area: function (result) {
          return `A = ${num(result.baseValues.load, 6)} / ${num(result.baseValues.stress, 6)} = ${num(result.solvedBaseValue, 6)} m^2`;
        }
      },
      engineeringChecks: function (result, warnings) {
        createStressWarningChecks(result, warnings, "area", "stress");
        addUnitsWarning(warnings, pair("Load realism check", "فحص واقعية الحمل"), Math.abs(result.baseValues.load) > 1e8);
      }
    },
    strain: {
      moduleKey: "strain",
      formula: "ε = ΔL / L",
      subtitle: pair(
        "Solve strain, change in length, or original length by leaving one variable empty.",
        "احسب الانفعال أو التغير في الطول أو الطول الأصلي عبر ترك متغير واحد فارغاً."
      ),
      explanation: pair(
        "Normal strain measures deformation relative to the original length of the member.",
        "يقيس الانفعال العمودي مقدار التشوه نسبةً إلى الطول الأصلي للعضو."
      ),
      resultPlaceholder: pair(
        "The solved strain variable, engineering checks, and full steps will appear here.",
        "سيظهر هنا المتغير المحسوب في الانفعال مع التحقق الهندسي والخطوات كاملة."
      ),
      notes: [
        note("Elastic interpretation", "التفسير المرن", "Small strains usually correspond to elastic behavior for common structural materials.", "الانفعالات الصغيرة غالباً ما تتوافق مع السلوك المرن للمواد الإنشائية الشائعة."),
        note("Length consistency", "اتساق الأطوال", "AhmedSolver converts lengths automatically, but your dimensions should still match the physical problem.", "يقوم AhmedSolver بتحويل الأطوال تلقائياً، لكن يجب أن تظل الأبعاد متسقة مع المسألة الفعلية.")
      ],
      fields: [
        field({
          name: "deltaLength",
          badge: "ΔL",
          title: pair("Change in length (ΔL)", "التغير في الطول (ΔL)"),
          description: pair("Total elongation or shortening of the member.", "الاستطالة أو النقصان الكلي في طول العضو."),
          category: "length",
          defaultUnit: "mm",
          placeholder: pair("Leave empty to solve for ΔL", "اتركه فارغاً لحساب ΔL")
        }),
        field({
          name: "length",
          badge: "L",
          title: pair("Original length (L)", "الطول الأصلي (L)"),
          description: pair("Reference length before deformation occurs.", "الطول المرجعي قبل حدوث التشوه."),
          category: "length",
          defaultUnit: "m",
          positive: true,
          placeholder: pair("Leave empty to solve for L", "اتركه فارغاً لحساب L")
        }),
        field({
          name: "strain",
          badge: "ε",
          title: pair("Normal strain (ε)", "الانفعال العمودي (ε)"),
          description: pair("Dimensionless deformation ratio.", "نسبة التشوه اللابعدية."),
          category: "strain",
          defaultUnit: "microstrain",
          placeholder: pair("Leave empty to solve for ε", "اتركه فارغاً لحساب ε")
        })
      ],
      rearranged: {
        strain: "ε = ΔL / L",
        deltaLength: "ΔL = ε × L",
        length: "L = ΔL / ε"
      },
      solve: {
        strain: function (base) {
          return base.deltaLength / base.length;
        },
        deltaLength: function (base) {
          return base.strain * base.length;
        },
        length: function (base) {
          return base.deltaLength / assertNonZero(base.strain, text(pair("Normal strain (ε)", "الانفعال العمودي (ε)")));
        }
      },
      substitution: {
        strain: function (result) {
          return `ε = ${num(result.baseValues.deltaLength, 6)} / ${num(result.baseValues.length, 6)} = ${num(result.solvedBaseValue, 6)} m/m`;
        },
        deltaLength: function (result) {
          return `ΔL = ${num(result.baseValues.strain, 6)} × ${num(result.baseValues.length, 6)} = ${num(result.solvedBaseValue, 6)} m`;
        },
        length: function (result) {
          return `L = ${num(result.baseValues.deltaLength, 6)} / ${num(result.baseValues.strain, 6)} = ${num(result.solvedBaseValue, 6)} m`;
        }
      },
      engineeringChecks: function (result, warnings) {
        const strainMagnitude = Math.abs(result.baseValues.strain);
        addMaterialWarning(warnings, pair("Strain realism check", "فحص واقعية الانفعال"), strainMagnitude > 0.02);
        addUnitsWarning(warnings, pair("Large deformation review", "مراجعة التشوه الكبير"), Math.abs(result.baseValues.deltaLength) > Math.abs(result.baseValues.length));
        createLengthWarningChecks(warnings, result.baseValues.length, pair("Original length review", "مراجعة الطول الأصلي"));
      }
    },
    "hookes-law": {
      moduleKey: "hookesLaw",
      formula: "σ = E × ε",
      subtitle: pair(
        "Solve stress, elastic modulus, or strain using Hooke's Law by leaving one variable empty.",
        "احسب الإجهاد أو معامل المرونة أو الانفعال باستخدام قانون هوك عبر ترك متغير واحد فارغاً."
      ),
      explanation: pair(
        "Hooke's Law is valid while the material response remains in the linear elastic range.",
        "يكون قانون هوك صالحاً عندما تبقى استجابة المادة ضمن المجال المرن الخطي."
      ),
      resultPlaceholder: pair(
        "The solved Hooke's Law variable, engineering checks, and full steps will appear here.",
        "سيظهر هنا المتغير المحسوب في قانون هوك مع التحقق الهندسي والخطوات كاملة."
      ),
      notes: [
        note("Elastic limit", "الحد المرن", "If strain becomes too large, the linear relation may no longer represent the material accurately.", "إذا أصبح الانفعال كبيراً جداً فقد لا تمثل العلاقة الخطية المادة بدقة."),
        note("Material stiffness", "صلابة المادة", "Use an elastic modulus consistent with the chosen material and temperature.", "استخدم معامل مرونة متوافقاً مع المادة ودرجة الحرارة المختارتين.")
      ],
      fields: [
        field({
          name: "stress",
          badge: "σ",
          title: pair("Normal stress (σ)", "الإجهاد العمودي (σ)"),
          description: pair("Stress developed under elastic loading.", "الإجهاد المتولد تحت تحميل مرن."),
          category: "stress",
          defaultUnit: "MPa",
          placeholder: pair("Leave empty to solve for σ", "اتركه فارغاً لحساب σ")
        }),
        field({
          name: "elasticModulus",
          badge: "E",
          title: pair("Elastic modulus (E)", "معامل المرونة (E)"),
          description: pair("Young's modulus for the material.", "معامل يونغ للمادة."),
          category: "stress",
          defaultUnit: "GPa",
          positive: true,
          placeholder: pair("Leave empty to solve for E", "اتركه فارغاً لحساب E")
        }),
        field({
          name: "strain",
          badge: "ε",
          title: pair("Normal strain (ε)", "الانفعال العمودي (ε)"),
          description: pair("Elastic strain corresponding to the stress level.", "الانفعال المرن الموافق لمستوى الإجهاد."),
          category: "strain",
          defaultUnit: "microstrain",
          placeholder: pair("Leave empty to solve for ε", "اتركه فارغاً لحساب ε")
        })
      ],
      rearranged: {
        stress: "σ = E × ε",
        elasticModulus: "E = σ / ε",
        strain: "ε = σ / E"
      },
      solve: {
        stress: function (base) {
          return base.elasticModulus * base.strain;
        },
        elasticModulus: function (base) {
          return base.stress / assertNonZero(base.strain, text(pair("Normal strain (ε)", "الانفعال العمودي (ε)")));
        },
        strain: function (base) {
          return base.stress / assertNonZero(base.elasticModulus, text(pair("Elastic modulus (E)", "معامل المرونة (E)")));
        }
      },
      substitution: {
        stress: function (result) {
          return `σ = ${num(result.baseValues.elasticModulus, 6)} × ${num(result.baseValues.strain, 6)} = ${num(result.solvedBaseValue, 6)} Pa`;
        },
        elasticModulus: function (result) {
          return `E = ${num(result.baseValues.stress, 6)} / ${num(result.baseValues.strain, 6)} = ${num(result.solvedBaseValue, 6)} Pa`;
        },
        strain: function (result) {
          return `ε = ${num(result.baseValues.stress, 6)} / ${num(result.baseValues.elasticModulus, 6)} = ${num(result.solvedBaseValue, 6)} m/m`;
        }
      },
      engineeringChecks: function (result, warnings) {
        createStressWarningChecks(result, warnings, null, "stress");
        addMaterialWarning(warnings, pair("Strain realism check", "فحص واقعية الانفعال"), Math.abs(result.baseValues.strain) > 0.02);
        addUnitsWarning(warnings, pair("Elastic modulus review", "مراجعة معامل المرونة"), result.baseValues.elasticModulus < 1e8 || result.baseValues.elasticModulus > 5e11);
      }
    },
    "axial-deformation": {
      moduleKey: "axialDeformation",
      formula: "ΔL = (P × L) / (A × E)",
      subtitle: pair(
        "Solve any one missing variable in the axial deformation equation by leaving it empty.",
        "احسب أي متغير مفقود واحد في معادلة الاستطالة المحورية عبر تركه فارغاً."
      ),
      explanation: pair(
        "This relation models elastic axial deformation for a prismatic member under direct load.",
        "تمثل هذه العلاقة الاستطالة المحورية المرنة لعضو منشوري تحت حمل مباشر."
      ),
      resultPlaceholder: pair(
        "The solved axial variable, engineering checks, and full steps will appear here.",
        "سيظهر هنا المتغير المحسوب في الاستطالة المحورية مع التحقق الهندسي والخطوات كاملة."
      ),
      notes: [
        note("Uniform member", "عضو منتظم", "This equation assumes a prismatic member with uniform area and elastic modulus along the length.", "تفترض هذه المعادلة عضواً منشورياً بمساحة ومعامل مرونة منتظمين على الطول."),
        note("Small deformation", "تشوه صغير", "The formulation is most reliable when deformation remains small relative to the member length.", "تكون الصيغة أكثر موثوقية عندما يبقى التشوه صغيراً مقارنة بطول العضو.")
      ],
      fields: [
        field({
          name: "deltaLength",
          badge: "ΔL",
          title: pair("Axial deformation (ΔL)", "الاستطالة المحورية (ΔL)"),
          description: pair("Net elastic elongation or shortening of the member.", "الاستطالة أو النقصان المرن الصافي للعضو."),
          category: "length",
          defaultUnit: "mm",
          placeholder: pair("Leave empty to solve for ΔL", "اتركه فارغاً لحساب ΔL")
        }),
        field({
          name: "load",
          badge: "P",
          title: pair("Applied load (P)", "الحمل المؤثر (P)"),
          description: pair("Axial load applied to the member.", "الحمل المحوري المؤثر على العضو."),
          category: "force",
          defaultUnit: "kN",
          placeholder: pair("Leave empty to solve for P", "اتركه فارغاً لحساب P")
        }),
        field({
          name: "length",
          badge: "L",
          title: pair("Original length (L)", "الطول الأصلي (L)"),
          description: pair("Member length before loading.", "طول العضو قبل التحميل."),
          category: "length",
          defaultUnit: "m",
          positive: true,
          placeholder: pair("Leave empty to solve for L", "اتركه فارغاً لحساب L")
        }),
        field({
          name: "area",
          badge: "A",
          title: pair("Area (A)", "المساحة (A)"),
          description: pair("Uniform cross-sectional area of the member.", "المساحة المقطعية المنتظمة للعضو."),
          category: "area",
          defaultUnit: "mm2",
          positive: true,
          placeholder: pair("Leave empty to solve for A", "اتركها فارغة لحساب A")
        }),
        field({
          name: "elasticModulus",
          badge: "E",
          title: pair("Elastic modulus (E)", "معامل المرونة (E)"),
          description: pair("Young's modulus for the member material.", "معامل يونغ لمادة العضو."),
          category: "stress",
          defaultUnit: "GPa",
          positive: true,
          placeholder: pair("Leave empty to solve for E", "اتركه فارغاً لحساب E")
        })
      ],
      rearranged: {
        deltaLength: "ΔL = (P × L) / (A × E)",
        load: "P = (ΔL × A × E) / L",
        length: "L = (ΔL × A × E) / P",
        area: "A = (P × L) / (ΔL × E)",
        elasticModulus: "E = (P × L) / (A × ΔL)"
      },
      solve: {
        deltaLength: function (base) {
          return (base.load * base.length) / (base.area * base.elasticModulus);
        },
        load: function (base) {
          return (base.deltaLength * base.area * base.elasticModulus) / base.length;
        },
        length: function (base) {
          return (base.deltaLength * base.area * base.elasticModulus) / assertNonZero(base.load, text(pair("Applied load (P)", "الحمل المؤثر (P)")));
        },
        area: function (base) {
          return (base.load * base.length) / assertNonZero(base.deltaLength * base.elasticModulus, text(pair("ΔL × E", "ΔL × E")));
        },
        elasticModulus: function (base) {
          return (base.load * base.length) / assertNonZero(base.area * base.deltaLength, text(pair("A × ΔL", "A × ΔL")));
        }
      },
      substitution: {
        deltaLength: function (result) {
          return `ΔL = (${num(result.baseValues.load, 6)} × ${num(result.baseValues.length, 6)}) / (${num(result.baseValues.area, 6)} × ${num(result.baseValues.elasticModulus, 6)}) = ${num(result.solvedBaseValue, 6)} m`;
        },
        load: function (result) {
          return `P = (${num(result.baseValues.deltaLength, 6)} × ${num(result.baseValues.area, 6)} × ${num(result.baseValues.elasticModulus, 6)}) / ${num(result.baseValues.length, 6)} = ${num(result.solvedBaseValue, 6)} N`;
        },
        length: function (result) {
          return `L = (${num(result.baseValues.deltaLength, 6)} × ${num(result.baseValues.area, 6)} × ${num(result.baseValues.elasticModulus, 6)}) / ${num(result.baseValues.load, 6)} = ${num(result.solvedBaseValue, 6)} m`;
        },
        area: function (result) {
          return `A = (${num(result.baseValues.load, 6)} × ${num(result.baseValues.length, 6)}) / (${num(result.baseValues.deltaLength, 6)} × ${num(result.baseValues.elasticModulus, 6)}) = ${num(result.solvedBaseValue, 6)} m^2`;
        },
        elasticModulus: function (result) {
          return `E = (${num(result.baseValues.load, 6)} × ${num(result.baseValues.length, 6)}) / (${num(result.baseValues.area, 6)} × ${num(result.baseValues.deltaLength, 6)}) = ${num(result.solvedBaseValue, 6)} Pa`;
        }
      },
      decorateResult: function (result) {
        result.axialStressBase = result.baseValues.load / result.baseValues.area;
        result.axialStrainBase = result.baseValues.deltaLength / result.baseValues.length;
      },
      metrics: function (result) {
        return [
          {
            label: text(pair("Implied axial stress", "الإجهاد المحوري الضمني")),
            value: withUnit("stress", "MPa", fromBase("stress", result.axialStressBase, "MPa"), 6)
          },
          {
            label: text(pair("Implied axial strain", "الانفعال المحوري الضمني")),
            value: withUnit("strain", "microstrain", fromBase("strain", result.axialStrainBase, "microstrain"), 6)
          }
        ];
      },
      engineeringChecks: function (result, warnings) {
        createStressWarningChecks({ baseValues: { area: result.baseValues.area, stress: result.axialStressBase } }, warnings, "area", "stress");
        addMaterialWarning(warnings, pair("Axial strain review", "مراجعة الانفعال المحوري"), Math.abs(result.axialStrainBase) > 0.02);
        addUnitsWarning(warnings, pair("Deformation review", "مراجعة الاستطالة"), Math.abs(result.baseValues.deltaLength) > Math.abs(result.baseValues.length));
        addUnitsWarning(warnings, pair("Elastic modulus review", "مراجعة معامل المرونة"), result.baseValues.elasticModulus < 1e8 || result.baseValues.elasticModulus > 5e11);
      }
    },
    "shear-stress": {
      moduleKey: "shearStress",
      formula: "τ = V / A",
      subtitle: pair(
        "Solve average shear stress, direct shear force, or resisting area by leaving one variable empty.",
        "احسب إجهاد القص المتوسط أو قوة القص المباشرة أو المساحة المقاومة عبر ترك متغير واحد فارغاً."
      ),
      explanation: pair(
        "Average shear stress is the direct shear force divided by the resisting area.",
        "إجهاد القص المتوسط يساوي قوة القص المباشرة مقسومة على المساحة المقاومة."
      ),
      resultPlaceholder: pair(
        "The solved shear variable, engineering checks, and full steps will appear here.",
        "سيظهر هنا المتغير المحسوب في القص مع التحقق الهندسي والخطوات كاملة."
      ),
      notes: [
        note("Average value", "قيمة متوسطة", "This relation gives average shear stress and does not capture the full nonuniform distribution in all shapes.", "تعطي هذه العلاقة إجهاد قص متوسطاً ولا تمثل التوزيع غير المنتظم بالكامل في جميع الأشكال."),
        note("Area selection", "اختيار المساحة", "Use the area that actually resists the direct shear path.", "استخدم المساحة التي تقاوم مسار القص المباشر فعلياً.")
      ],
      fields: [
        field({
          name: "shearForce",
          badge: "V",
          title: pair("Shear force (V)", "قوة القص (V)"),
          description: pair("Direct shear force acting on the section.", "قوة القص المباشرة المؤثرة على المقطع."),
          category: "force",
          defaultUnit: "kN",
          placeholder: pair("Leave empty to solve for V", "اتركه فارغاً لحساب V")
        }),
        field({
          name: "area",
          badge: "A",
          title: pair("Area (A)", "المساحة (A)"),
          description: pair("Area resisting the direct shear force.", "المساحة المقاومة لقوة القص المباشرة."),
          category: "area",
          defaultUnit: "mm2",
          positive: true,
          placeholder: pair("Leave empty to solve for A", "اتركها فارغة لحساب A")
        }),
        field({
          name: "tau",
          badge: "τ",
          title: pair("Shear stress (τ)", "إجهاد القص (τ)"),
          description: pair("Average direct shear stress.", "إجهاد القص المباشر المتوسط."),
          category: "stress",
          defaultUnit: "MPa",
          placeholder: pair("Leave empty to solve for τ", "اتركه فارغاً لحساب τ")
        })
      ],
      rearranged: {
        tau: "τ = V / A",
        shearForce: "V = τ × A",
        area: "A = V / τ"
      },
      solve: {
        tau: function (base) {
          return base.shearForce / base.area;
        },
        shearForce: function (base) {
          return base.tau * base.area;
        },
        area: function (base) {
          return base.shearForce / assertNonZero(base.tau, text(pair("Shear stress (τ)", "إجهاد القص (τ)")));
        }
      },
      substitution: {
        tau: function (result) {
          return `τ = ${num(result.baseValues.shearForce, 6)} / ${num(result.baseValues.area, 6)} = ${num(result.solvedBaseValue, 6)} Pa`;
        },
        shearForce: function (result) {
          return `V = ${num(result.baseValues.tau, 6)} × ${num(result.baseValues.area, 6)} = ${num(result.solvedBaseValue, 6)} N`;
        },
        area: function (result) {
          return `A = ${num(result.baseValues.shearForce, 6)} / ${num(result.baseValues.tau, 6)} = ${num(result.solvedBaseValue, 6)} m^2`;
        }
      },
      engineeringChecks: function (result, warnings) {
        createStressWarningChecks({ baseValues: { area: result.baseValues.area, stress: result.baseValues.tau } }, warnings, "area", "stress");
        addUnitsWarning(warnings, pair("Shear force review", "مراجعة قوة القص"), Math.abs(result.baseValues.shearForce) > 1e8);
      }
    },
    torsion: {
      moduleKey: "torsion",
      formula: "τ = (T × r) / J",
      subtitle: pair(
        "Solve torsional shear stress or any one missing torsion variable by leaving it empty.",
        "احسب إجهاد القص الالتوائي أو أي متغير التواء مفقود عبر تركه فارغاً."
      ),
      explanation: pair(
        "The torsion relation links torque, outer radius, and polar moment to the resulting shear stress.",
        "تربط علاقة الالتواء العزم ونصف القطر الخارجي والعزم القطبي بإجهاد القص الناتج."
      ),
      resultPlaceholder: pair(
        "The solved torsion variable, engineering checks, and full steps will appear here.",
        "سيظهر هنا المتغير المحسوب في الالتواء مع التحقق الهندسي والخطوات كاملة."
      ),
      notes: [
        note("Section assumption", "افتراض المقطع", "Use this relation for circular shafts where the torsion formula is directly applicable.", "استخدم هذه العلاقة للأعمدة الدائرية حيث تكون صيغة الالتواء قابلة للتطبيق مباشرة."),
        note("Outer radius", "نصف القطر الخارجي", "The highest shear stress occurs at the outer radius of the shaft.", "يحدث أكبر إجهاد قص عند نصف القطر الخارجي للعمود.")
      ],
      fields: [
        field({
          name: "tau",
          badge: "τ",
          title: pair("Shear stress (τ)", "إجهاد القص (τ)"),
          description: pair("Torsional shear stress at the chosen radius.", "إجهاد القص الالتوائي عند نصف القطر المختار."),
          category: "stress",
          defaultUnit: "MPa",
          placeholder: pair("Leave empty to solve for τ", "اتركه فارغاً لحساب τ")
        }),
        field({
          name: "torque",
          badge: "T",
          title: pair("Torque (T)", "العزم (T)"),
          description: pair("Applied torque carried by the shaft.", "العزم المطبق الذي يحمله العمود."),
          category: "torque",
          defaultUnit: "kNm",
          placeholder: pair("Leave empty to solve for T", "اتركه فارغاً لحساب T")
        }),
        field({
          name: "radius",
          badge: "r",
          title: pair("Radius (r)", "نصف القطر (r)"),
          description: pair("Distance from the shaft center to the evaluated point.", "المسافة من مركز العمود إلى النقطة المقيمة."),
          category: "length",
          defaultUnit: "mm",
          positive: true,
          placeholder: pair("Leave empty to solve for r", "اتركه فارغاً لحساب r")
        }),
        field({
          name: "polarInertia",
          badge: "J",
          title: pair("Polar moment (J)", "العزم القطبي (J)"),
          description: pair("Polar moment of inertia of the shaft section.", "عزم العطالة القطبي لمقطع العمود."),
          category: "inertia",
          defaultUnit: "mm4",
          positive: true,
          placeholder: pair("Leave empty to solve for J", "اتركه فارغاً لحساب J")
        })
      ],
      rearranged: {
        tau: "τ = (T × r) / J",
        torque: "T = (τ × J) / r",
        radius: "r = (τ × J) / T",
        polarInertia: "J = (T × r) / τ"
      },
      solve: {
        tau: function (base) {
          return (base.torque * base.radius) / base.polarInertia;
        },
        torque: function (base) {
          return (base.tau * base.polarInertia) / assertNonZero(base.radius, text(pair("Radius (r)", "نصف القطر (r)")));
        },
        radius: function (base) {
          return (base.tau * base.polarInertia) / assertNonZero(base.torque, text(pair("Torque (T)", "العزم (T)")));
        },
        polarInertia: function (base) {
          return (base.torque * base.radius) / assertNonZero(base.tau, text(pair("Shear stress (τ)", "إجهاد القص (τ)")));
        }
      },
      substitution: {
        tau: function (result) {
          return `τ = (${num(result.baseValues.torque, 6)} × ${num(result.baseValues.radius, 6)}) / ${num(result.baseValues.polarInertia, 6)} = ${num(result.solvedBaseValue, 6)} Pa`;
        },
        torque: function (result) {
          return `T = (${num(result.baseValues.tau, 6)} × ${num(result.baseValues.polarInertia, 6)}) / ${num(result.baseValues.radius, 6)} = ${num(result.solvedBaseValue, 6)} N·m`;
        },
        radius: function (result) {
          return `r = (${num(result.baseValues.tau, 6)} × ${num(result.baseValues.polarInertia, 6)}) / ${num(result.baseValues.torque, 6)} = ${num(result.solvedBaseValue, 6)} m`;
        },
        polarInertia: function (result) {
          return `J = (${num(result.baseValues.torque, 6)} × ${num(result.baseValues.radius, 6)}) / ${num(result.baseValues.tau, 6)} = ${num(result.solvedBaseValue, 6)} m^4`;
        }
      },
      engineeringChecks: function (result, warnings) {
        addMaterialWarning(warnings, pair("Torsional stress warning", "تحذير إجهاد الالتواء"), Math.abs(result.baseValues.tau) > 1.2e9);
        addUnitsWarning(warnings, pair("Radius review", "مراجعة نصف القطر"), result.baseValues.radius < 1e-6 || result.baseValues.radius > 5);
        addUnitsWarning(warnings, pair("Polar moment review", "مراجعة العزم القطبي"), result.baseValues.polarInertia < 1e-16 || result.baseValues.polarInertia > 10);
        addUnitsWarning(warnings, pair("Torque review", "مراجعة العزم"), Math.abs(result.baseValues.torque) > 1e8);
      }
    },
    "bending-stress": {
      moduleKey: "bending",
      formula: "σ = (M × y) / I",
      subtitle: pair(
        "Solve bending stress or any one missing bending variable by leaving exactly one field empty.",
        "احسب إجهاد الانحناء أو أي متغير انحناء مفقود عبر ترك حقل واحد فارغاً تماماً."
      ),
      explanation: pair(
        "Flexural stress depends on bending moment, distance from the neutral axis, and the section moment of inertia.",
        "يعتمد إجهاد الانحناء على عزم الانحناء والمسافة عن المحور المتعادل وعزم عطالة المقطع."
      ),
      resultPlaceholder: pair(
        "The solved bending variable, engineering checks, and full steps will appear here.",
        "سيظهر هنا المتغير المحسوب في الانحناء مع التحقق الهندسي والخطوات كاملة."
      ),
      notes: [
        note("Neutral axis distance", "المسافة عن المحور المتعادل", "Use the distance from the neutral axis to the fiber where stress is being evaluated.", "استخدم المسافة من المحور المتعادل إلى الليف الذي يتم تقييم الإجهاد عنده."),
        note("Section property", "خاصية المقطع", "If the section shape is known, AhmedSolver can calculate I automatically from the entered dimensions.", "إذا كان شكل المقطع معروفاً، يمكن لـ AhmedSolver حساب I تلقائياً من الأبعاد المدخلة.")
      ],
      captureExtraState: captureBendingExtras,
      parseSubmission: parseBendingSubmission,
      fields: [
        field({
          name: "moment",
          badge: "M",
          title: pair("Bending moment (M)", "عزم الانحناء (M)"),
          description: pair("Bending moment at the section of interest.", "عزم الانحناء عند المقطع المدروس."),
          category: "torque",
          defaultUnit: "kNm",
          placeholder: pair("Leave empty to solve for M", "اتركه فارغاً لحساب M")
        }),
        field({
          name: "distance",
          badge: "y",
          title: pair("Distance from neutral axis (y)", "المسافة عن المحور المتعادل (y)"),
          description: pair("Distance from the neutral axis to the evaluated fiber.", "المسافة من المحور المتعادل إلى الليف المقيم."),
          category: "length",
          defaultUnit: "mm",
          positive: true,
          placeholder: pair("Leave empty to solve for y", "اتركه فارغاً لحساب y")
        }),
        field({
          name: "inertia",
          badge: "I",
          title: pair("Second moment of area (I)", "عزم العطالة (I)"),
          description: pair("Section property that governs resistance to bending.", "خاصية المقطع التي تتحكم في مقاومة الانحناء."),
          category: "inertia",
          defaultUnit: "mm4",
          positive: true,
          customType: "inertia"
        }),
        field({
          name: "stress",
          badge: "σ",
          title: pair("Bending stress (σ)", "إجهاد الانحناء (σ)"),
          description: pair("Flexural stress at the selected distance from the neutral axis.", "إجهاد الانحناء عند المسافة المحددة عن المحور المتعادل."),
          category: "stress",
          defaultUnit: "MPa",
          placeholder: pair("Leave empty to solve for σ", "اتركه فارغاً لحساب σ")
        })
      ],
      rearranged: {
        stress: "σ = (M × y) / I",
        moment: "M = (σ × I) / y",
        distance: "y = (σ × I) / M",
        inertia: "I = (M × y) / σ"
      },
      solve: {
        stress: function (base) {
          return (base.moment * base.distance) / base.inertia;
        },
        moment: function (base) {
          return (base.stress * base.inertia) / assertNonZero(base.distance, text(pair("Distance from neutral axis (y)", "المسافة عن المحور المتعادل (y)")));
        },
        distance: function (base) {
          return (base.stress * base.inertia) / assertNonZero(base.moment, text(pair("Bending moment (M)", "عزم الانحناء (M)")));
        },
        inertia: function (base) {
          return (base.moment * base.distance) / assertNonZero(base.stress, text(pair("Bending stress (σ)", "إجهاد الانحناء (σ)")));
        }
      },
      substitution: {
        stress: function (result) {
          return `σ = (${num(result.baseValues.moment, 6)} × ${num(result.baseValues.distance, 6)}) / ${num(result.baseValues.inertia, 6)} = ${num(result.solvedBaseValue, 6)} Pa`;
        },
        moment: function (result) {
          return `M = (${num(result.baseValues.stress, 6)} × ${num(result.baseValues.inertia, 6)}) / ${num(result.baseValues.distance, 6)} = ${num(result.solvedBaseValue, 6)} N·m`;
        },
        distance: function (result) {
          return `y = (${num(result.baseValues.stress, 6)} × ${num(result.baseValues.inertia, 6)}) / ${num(result.baseValues.moment, 6)} = ${num(result.solvedBaseValue, 6)} m`;
        },
        inertia: function (result) {
          return `I = (${num(result.baseValues.moment, 6)} × ${num(result.baseValues.distance, 6)}) / ${num(result.baseValues.stress, 6)} = ${num(result.solvedBaseValue, 6)} m^4`;
        }
      },
      preSteps: function (result) {
        if (!result.meta.inertia || result.meta.inertia.mode !== "shape") {
          return [];
        }

        return [
          {
            title: text(pair("Compute I from the selected shape", "احسب I من الشكل المختار")),
            body: `<div class="equation-line">${esc(result.meta.inertia.formula)}</div><p>${result.meta.inertia.dimensionRows.map(esc).join("<br>")}<br><strong>${esc(text(pair("Computed I", "قيمة I المحسوبة")))}:</strong> ${esc(withUnit("inertia", result.meta.inertia.outputUnit, result.meta.inertia.displayValue, 6))}</p>`
          }
        ];
      },
      metrics: function (result) {
        const metrics = [];

        if (result.meta.inertia && result.meta.inertia.mode === "shape") {
          metrics.push({
            label: text(pair("Computed I from shape", "قيمة I من الشكل")),
            value: withUnit("inertia", result.meta.inertia.outputUnit, result.meta.inertia.displayValue, 6)
          });
        }

        return metrics;
      },
      preConversionLines: function (result) {
        if (!result.meta.inertia || result.meta.inertia.mode !== "shape") {
          return [];
        }

        return [
          `${text(pair("Selected shape", "الشكل المختار"))}: ${text(result.meta.inertia.shapeTitle)}`
        ];
      },
      engineeringChecks: function (result, warnings) {
        addMaterialWarning(warnings, pair("Bending stress warning", "تحذير إجهاد الانحناء"), Math.abs(result.baseValues.stress) > 1.5e9);
        addUnitsWarning(warnings, pair("Distance review", "مراجعة المسافة y"), result.baseValues.distance < 1e-6 || result.baseValues.distance > 5);
        addUnitsWarning(warnings, pair("Moment of inertia review", "مراجعة عزم العطالة"), result.baseValues.inertia < 1e-16 || result.baseValues.inertia > 10);
        addUnitsWarning(warnings, pair("Bending moment review", "مراجعة عزم الانحناء"), Math.abs(result.baseValues.moment) > 1e8);
      }
    },
    "thermal-stress": {
      moduleKey: "thermalStress",
      formula: "σ = E × α × ΔT",
      subtitle: pair(
        "Solve restrained thermal stress or any one missing thermal variable by leaving it empty.",
        "احسب الإجهاد الحراري المقيد أو أي متغير حراري مفقود عبر تركه فارغاً."
      ),
      explanation: pair(
        "This relation assumes the member is restrained against free thermal expansion or contraction.",
        "تفترض هذه العلاقة أن العضو مقيد ضد التمدد أو الانكماش الحراري الحر."
      ),
      resultPlaceholder: pair(
        "The solved thermal variable, engineering checks, and full steps will appear here.",
        "سيظهر هنا المتغير الحراري المحسوب مع التحقق الهندسي والخطوات كاملة."
      ),
      notes: [
        note("Restrained condition", "حالة التقييد", "Thermal stress develops only when the member cannot freely expand or contract.", "يتولد الإجهاد الحراري فقط عندما لا يستطيع العضو التمدد أو الانكماش بحرية."),
        note("Temperature compatibility", "توافق درجات الحرارة", "Use a temperature difference value, not an absolute temperature, in this equation.", "استخدم فرق درجة الحرارة وليس درجة حرارة مطلقة في هذه المعادلة.")
      ],
      fields: [
        field({
          name: "stress",
          badge: "σ",
          title: pair("Thermal stress (σ)", "الإجهاد الحراري (σ)"),
          description: pair("Restrained stress caused by the temperature change.", "الإجهاد المقيد الناتج عن التغير الحراري."),
          category: "stress",
          defaultUnit: "MPa",
          placeholder: pair("Leave empty to solve for σ", "اتركه فارغاً لحساب σ")
        }),
        field({
          name: "elasticModulus",
          badge: "E",
          title: pair("Elastic modulus (E)", "معامل المرونة (E)"),
          description: pair("Young's modulus used in the thermal stress relation.", "معامل يونغ المستخدم في علاقة الإجهاد الحراري."),
          category: "stress",
          defaultUnit: "GPa",
          positive: true,
          placeholder: pair("Leave empty to solve for E", "اتركه فارغاً لحساب E")
        }),
        field({
          name: "alpha",
          badge: "α",
          title: pair("Thermal expansion coefficient (α)", "معامل التمدد الحراري (α)"),
          description: pair("Coefficient of thermal expansion for the material.", "معامل التمدد الحراري للمادة."),
          category: "thermalCoeff",
          defaultUnit: "perC",
          positive: true,
          placeholder: pair("Leave empty to solve for α", "اتركه فارغاً لحساب α")
        }),
        field({
          name: "deltaT",
          badge: "ΔT",
          title: pair("Temperature change (ΔT)", "التغير الحراري (ΔT)"),
          description: pair("Increase or decrease in temperature experienced by the member.", "الزيادة أو النقصان الحراري الذي يتعرض له العضو."),
          category: "tempDiff",
          defaultUnit: "C",
          placeholder: pair("Leave empty to solve for ΔT", "اتركه فارغاً لحساب ΔT")
        })
      ],
      rearranged: {
        stress: "σ = E × α × ΔT",
        elasticModulus: "E = σ / (α × ΔT)",
        alpha: "α = σ / (E × ΔT)",
        deltaT: "ΔT = σ / (E × α)"
      },
      solve: {
        stress: function (base) {
          return base.elasticModulus * base.alpha * base.deltaT;
        },
        elasticModulus: function (base) {
          return base.stress / assertNonZero(base.alpha * base.deltaT, text(pair("α × ΔT", "α × ΔT")));
        },
        alpha: function (base) {
          return base.stress / assertNonZero(base.elasticModulus * base.deltaT, text(pair("E × ΔT", "E × ΔT")));
        },
        deltaT: function (base) {
          return base.stress / assertNonZero(base.elasticModulus * base.alpha, text(pair("E × α", "E × α")));
        }
      },
      substitution: {
        stress: function (result) {
          return `σ = ${num(result.baseValues.elasticModulus, 6)} × ${num(result.baseValues.alpha, 6)} × ${num(result.baseValues.deltaT, 6)} = ${num(result.solvedBaseValue, 6)} Pa`;
        },
        elasticModulus: function (result) {
          return `E = ${num(result.baseValues.stress, 6)} / (${num(result.baseValues.alpha, 6)} × ${num(result.baseValues.deltaT, 6)}) = ${num(result.solvedBaseValue, 6)} Pa`;
        },
        alpha: function (result) {
          return `α = ${num(result.baseValues.stress, 6)} / (${num(result.baseValues.elasticModulus, 6)} × ${num(result.baseValues.deltaT, 6)}) = ${num(result.solvedBaseValue, 6)} /°C`;
        },
        deltaT: function (result) {
          return `ΔT = ${num(result.baseValues.stress, 6)} / (${num(result.baseValues.elasticModulus, 6)} × ${num(result.baseValues.alpha, 6)}) = ${num(result.solvedBaseValue, 6)} °C`;
        }
      },
      decorateResult: function (result) {
        result.thermalStrainBase = result.baseValues.alpha * result.baseValues.deltaT;
      },
      metrics: function (result) {
        return [
          {
            label: text(pair("Thermal strain ε_th", "الانفعال الحراري ε_th")),
            value: withUnit("strain", "microstrain", fromBase("strain", result.thermalStrainBase, "microstrain"), 6)
          }
        ];
      },
      engineeringChecks: function (result, warnings) {
        addMaterialWarning(warnings, pair("Thermal stress warning", "تحذير الإجهاد الحراري"), Math.abs(result.baseValues.stress) > 1.5e9);
        addMaterialWarning(warnings, pair("Thermal strain review", "مراجعة الانفعال الحراري"), Math.abs(result.thermalStrainBase) > 0.03);
        addUnitsWarning(warnings, pair("Elastic modulus review", "مراجعة معامل المرونة"), result.baseValues.elasticModulus < 1e8 || result.baseValues.elasticModulus > 5e11);
        addUnitsWarning(warnings, pair("Expansion coefficient review", "مراجعة معامل التمدد"), result.baseValues.alpha < 1e-7 || result.baseValues.alpha > 1e-4);
        addUnitsWarning(warnings, pair("Temperature change review", "مراجعة التغير الحراري"), Math.abs(result.baseValues.deltaT) > 1000);
      }
    }
  };

  const slug = root.getAttribute("data-tool-slug");
  const config = solverConfigs[slug];

  if (!config) {
    return;
  }

  function render() {
    const view = state.result ? buildSolverView(config, state.result) : null;

    root.innerHTML = `
      <section class="page-hero fade-in-up">
        <div class="page-hero__split">
          <div>
            <span class="page-badge">${esc(text(pair("Engineering Solver", "محلل هندسي")))}</span>
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
            <p class="hint-line">${esc(readyMessage())}</p>
          </aside>
        </div>
      </section>

      <section class="tool-page section-block">
        <div class="module-grid">
          <article class="module-panel glass-card">
            <div class="module-panel__header">
              <span class="section-chip">${esc(app.t("interactive.shared.inputs", lang()))}</span>
              <h2>${esc(text(pair("Solver variables", "متغيرات المحلل")))}</h2>
            </div>

            <form id="solver-form" novalidate>
              <div class="field-grid field-grid--solver">
                ${config.fields.map(renderSolverField).join("")}
                <div class="field field--full solver-note">
                  <p class="field-help">${esc(readyMessage())}</p>
                </div>
              </div>

              <div class="action-row">
                <button type="submit" class="button button-primary">${esc(app.t("common.solve", lang()))}</button>
                <button type="button" class="button button-secondary" id="solver-clear">${esc(app.t("common.clear", lang()))}</button>
              </div>

              <div class="status-banner is-visible" id="solver-status" data-state="${esc(currentStatusState(Boolean(view)))}">${esc(currentStatusMessage(Boolean(view)))}</div>
            </form>
          </article>

          <article class="module-panel glass-card">
            <div class="module-panel__header">
              <span class="section-chip">${esc(app.t("interactive.shared.results", lang()))}</span>
              <h2>${esc(text(pair("Solved result", "النتيجة المحسوبة")))}</h2>
            </div>

            <div class="result-block" aria-live="polite">
              <div class="result-card">
                <div class="field-title">${esc(text(pair("Final answer", "الإجابة النهائية")))}</div>
                <div class="result-value">${view ? esc(view.final) : "--"}</div>
                <div class="result-subline">${view ? esc(view.secondary) : esc(text(config.resultPlaceholder))}</div>
              </div>

              ${view && view.metrics.length ? `<div class="metric-grid">${view.metrics.map(metricCard).join("")}</div>` : ""}

              <div class="result-card">
                <div class="field-title">${esc(app.t("interactive.shared.summary", lang()))}</div>
                <div class="summary-list">${view ? view.summary.map(summaryRow).join("") : `<div class="empty-state"><p>${esc(text(config.resultPlaceholder))}</p></div>`}</div>
              </div>

              ${view ? renderValidationCard(view.validation) : ""}
            </div>
          </article>
        </div>

        <div class="module-grid">
          <article class="module-panel glass-card">
            <div class="module-panel__header">
              <span class="section-chip">${esc(app.t("interactive.shared.notes", lang()))}</span>
              <h2>${esc(app.t("interactive.shared.explanation", lang()))}</h2>
            </div>

            <div class="support-list">
              ${config.notes.map(noteCard).join("")}
            </div>
          </article>

          <article class="module-panel glass-card">
            <div class="module-panel__header">
              <span class="section-chip">${esc(app.t("interactive.shared.steps", lang()))}</span>
              <h2>${esc(text(pair("Step-by-step solution", "الحل خطوة بخطوة")))}</h2>
            </div>

            <div class="steps-list">
              ${view ? view.steps.map(function (item, index) { return stepCard(index + 1, item); }).join("") : `<div class="empty-state"><p>${esc(text(config.resultPlaceholder))}</p></div>`}
            </div>
          </article>
        </div>
      </section>
    `;

    root.querySelectorAll("[data-unit-category]").forEach(function (select) {
      const category = select.getAttribute("data-unit-category");
      const selected = select.getAttribute("data-selected");
      select.innerHTML = Object.keys(unitCatalog[category].units).map(function (key) {
        return `<option value="${key}"${key === selected ? " selected" : ""}>${esc(unitLabel(category, key))}</option>`;
      }).join("");
    });

    const form = root.querySelector("#solver-form");
    const status = root.querySelector("#solver-status");
    
    function markInputsChanged() {
      const hadResult = Boolean(state.result);
      captureCurrentFormState(config);
      clearFieldStates();
      setStatusState(
        hadResult
          ? text(pair("Inputs changed. Solve again to refresh the result.", "تم تعديل القيم. اضغط احسب مرة أخرى لتحديث النتيجة."))
          : readyMessage(),
        "neutral"
      );
      status.textContent = state.statusMessage;
      status.setAttribute("data-state", state.statusState);
    }

    form.addEventListener("input", function () {
      markInputsChanged();
    });

    form.addEventListener("change", function (event) {
      markInputsChanged();

      if (event.target && ["inertiaMode", "inertiaShape", "inertiaDimensionUnit", "inertiaUnit"].indexOf(event.target.name) !== -1) {
        render();
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      captureCurrentFormState(config);

      try {
        const payload = parseSolverInputs(config, form);
        state.result = calculateSolverResult(config, payload);
        setStatusState(successMessage(), "success");
        logSolverDebug("Solve success", {
          slug: slug,
          unknownField: state.result.unknownKey,
          solvedBaseValue: state.result.solvedBaseValue
        });
        saveReport(buildExportPayload(config, buildSolverView(config, state.result)));
        render();
      } catch (error) {
        state.result = null;
        setStatusState(error && error.message ? error.message : inconsistentInputMessage(), "error");
        logSolverDebug("Solve failed", {
          slug: slug,
          reason: error && error.message ? error.message : "unknown-error"
        });
        render();
      }
    });

    root.querySelector("#solver-clear").addEventListener("click", function () {
      state.values = {};
      state.result = null;
      setStatusState(readyMessage(), "neutral");
      render();
    });
  }

  setStatusState(readyMessage(), "neutral");
  render();
  document.addEventListener(app.eventName, function () {
    captureCurrentFormState(config);
    render();
  });
})();
