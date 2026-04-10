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
      baseUnit: "N",
      units: {
        N: { symbol: "N", factor: 1, label: { en: "newton", ar: "نيوتن" } },
        kN: { symbol: "kN", factor: 1000, label: { en: "kilonewton", ar: "كيلو نيوتن" } },
        lbf: { symbol: "lbf", factor: 4.4482216152605, label: { en: "pound-force", ar: "رطل-قوة" } }
      }
    },
    stress: {
      baseUnit: "Pa",
      units: {
        Pa: { symbol: "Pa", factor: 1, label: { en: "pascal", ar: "باسكال" } },
        kPa: { symbol: "kPa", factor: 1000, label: { en: "kilopascal", ar: "كيلو باسكال" } },
        MPa: { symbol: "MPa", factor: 1000000, label: { en: "megapascal", ar: "ميغاباسكال" } },
        GPa: { symbol: "GPa", factor: 1000000000, label: { en: "gigapascal", ar: "غيغاباسكال" } },
        psi: { symbol: "psi", factor: 6894.757293168, label: { en: "psi", ar: "رطل لكل بوصة مربعة" } }
      }
    },
    length: {
      baseUnit: "m",
      units: {
        mm: { symbol: "mm", factor: 0.001, label: { en: "millimeter", ar: "ملليمتر" } },
        cm: { symbol: "cm", factor: 0.01, label: { en: "centimeter", ar: "سنتيمتر" } },
        m: { symbol: "m", factor: 1, label: { en: "meter", ar: "متر" } },
        in: { symbol: "in", factor: 0.0254, label: { en: "inch", ar: "بوصة" } },
        ft: { symbol: "ft", factor: 0.3048, label: { en: "foot", ar: "قدم" } }
      }
    },
    area: {
      baseUnit: "m2",
      units: {
        mm2: { symbol: "mm^2", factor: 1e-6, label: { en: "square millimeter", ar: "ملليمتر مربع" } },
        cm2: { symbol: "cm^2", factor: 1e-4, label: { en: "square centimeter", ar: "سنتيمتر مربع" } },
        m2: { symbol: "m^2", factor: 1, label: { en: "square meter", ar: "متر مربع" } },
        in2: { symbol: "in^2", factor: 0.00064516, label: { en: "square inch", ar: "بوصة مربعة" } }
      }
    },
    inertia: {
      baseUnit: "m4",
      units: {
        mm4: { symbol: "mm^4", factor: 1e-12, label: { en: "mm to the fourth", ar: "ملليمتر للقوة الرابعة" } },
        cm4: { symbol: "cm^4", factor: 1e-8, label: { en: "cm to the fourth", ar: "سنتيمتر للقوة الرابعة" } },
        m4: { symbol: "m^4", factor: 1, label: { en: "m to the fourth", ar: "متر للقوة الرابعة" } },
        in4: { symbol: "in^4", factor: 4.162314256e-7, label: { en: "in to the fourth", ar: "بوصة للقوة الرابعة" } }
      }
    },
    torque: {
      baseUnit: "Nm",
      units: {
        Nm: { symbol: "N*m", factor: 1, label: { en: "newton-meter", ar: "نيوتن.متر" } },
        kNm: { symbol: "kN*m", factor: 1000, label: { en: "kilonewton-meter", ar: "كيلو نيوتن.متر" } },
        lbfft: { symbol: "lbf*ft", factor: 1.3558179483314, label: { en: "pound-foot", ar: "رطل.قدم" } }
      }
    },
    strain: {
      baseUnit: "ratio",
      units: {
        ratio: { symbol: "m/m", factor: 1, label: { en: "ratio", ar: "نسبة" } },
        microstrain: { symbol: "µε", factor: 1e-6, label: { en: "microstrain", ar: "مايكروسترين" } },
        percent: { symbol: "%", factor: 0.01, label: { en: "percent", ar: "بالمئة" } }
      }
    },
    tempDiff: {
      baseUnit: "C",
      units: {
        C: { symbol: "°C", factor: 1, label: { en: "degree Celsius", ar: "درجة مئوية" } },
        K: { symbol: "K", factor: 1, label: { en: "kelvin difference", ar: "فرق كلفن" } },
        F: { symbol: "°F", factor: 5 / 9, label: { en: "degree Fahrenheit", ar: "درجة فهرنهايت" } }
      }
    },
    thermalCoeff: {
      baseUnit: "perC",
      units: {
        perC: { symbol: "/°C", factor: 1, label: { en: "per degree Celsius", ar: "لكل درجة مئوية" } },
        perK: { symbol: "/K", factor: 1, label: { en: "per kelvin", ar: "لكل كلفن" } },
        perF: { symbol: "/°F", factor: 1.8, label: { en: "per degree Fahrenheit", ar: "لكل درجة فهرنهايت" } }
      }
    }
  };

  const state = {
    values: {},
    result: null
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
    const unit = unitDef(category, key);
    return `${num(value, decimals)} ${unit ? unit.symbol : ""}`.trim();
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

  function getFieldValue(field) {
    return state.values[field.name];
  }

  function getFieldUnit(field) {
    return state.values[`${field.name}Unit`] || field.defaultUnit;
  }

  function getFieldWrapper(fieldName) {
    return root.querySelector(`[data-field="${fieldName}"]`);
  }

  function captureCurrentFormState(config) {
    const form = root.querySelector("#solver-form");

    if (!form) {
      return;
    }

    let changed = false;

    config.fields.forEach(function (field) {
      const input = form.elements[field.name];
      const unit = form.elements[`${field.name}Unit`];
      const rawValue = input ? input.value.trim() : "";
      const normalizedValue = rawValue === "" ? null : rawValue;
      const currentStoredValue = state.values[field.name] == null ? null : String(state.values[field.name]);
      const currentStoredUnit = state.values[`${field.name}Unit`] || field.defaultUnit;

      if (currentStoredValue !== normalizedValue) {
        changed = true;
      }

      if (unit && currentStoredUnit !== unit.value) {
        changed = true;
      }

      state.values[field.name] = normalizedValue;
      state.values[`${field.name}Unit`] = unit ? unit.value : field.defaultUnit;
    });

    if (changed) {
      state.result = null;
    }
  }

  function solverHint() {
    return text(pair(
      "Enter the known values and leave exactly one field empty. AhmedSolver will detect the unknown automatically.",
      "أدخل القيم المعروفة واترك خانة واحدة فقط فارغة. سيكتشف AhmedSolver المتغير المجهول تلقائياً."
    ));
  }

  function readyMessage() {
    return text(pair(
      "Leave one variable empty to solve automatically.",
      "اترك متغيراً واحداً فارغاً ليتم الحل تلقائياً."
    ));
  }

  function successMessage() {
    return text(pair(
      "Single-unknown solution completed successfully.",
      "تم حل المتغير المجهول بنجاح."
    ));
  }

  function insufficientDataMessage() {
    return text(pair(
      "Insufficient data. Leave exactly one field empty.",
      "البيانات غير كافية. اترك خانة واحدة فقط فارغة."
    ));
  }

  function leaveOneEmptyMessage() {
    return text(pair(
      "All fields are filled. Leave one variable empty so AhmedSolver can solve for it.",
      "جميع الحقول ممتلئة. اترك متغيراً واحداً فارغاً ليقوم AhmedSolver بحله."
    ));
  }

  function invalidFieldMessage(field) {
    return lang() === "ar"
      ? `أدخل قيمة صحيحة لـ ${text(field.title)}.`
      : `Enter a valid value for ${text(field.title)}.`;
  }

  function positiveFieldMessage(field) {
    return lang() === "ar"
      ? `يجب أن تكون قيمة ${text(field.title)} أكبر من الصفر.`
      : `${text(field.title)} must be greater than zero.`;
  }

  function zeroDividerMessage(label) {
    return lang() === "ar"
      ? `لا يمكن أن تكون قيمة ${label} صفراً في هذه الصيغة المعاد ترتيبها.`
      : `${label} cannot be zero for this rearranged formula.`;
  }

  function baseUnitSymbol(category) {
    const definition = unitDef(category, unitCatalog[category].baseUnit);
    return definition ? definition.symbol : "";
  }

  function assertNonZero(value, label) {
    if (Math.abs(value) < 1e-12) {
      throw new Error(zeroDividerMessage(label));
    }

    return value;
  }

  function parseSolverInputs(config, form) {
    const values = {};
    const emptyFields = [];

    config.fields.forEach(function (field) {
      const wrapper = getFieldWrapper(field.name);
      const input = form.elements[field.name];
      const rawValue = input.value.trim();

      values[`${field.name}Unit`] = form.elements[`${field.name}Unit`].value;

      if (wrapper) {
        wrapper.classList.remove("field-error", "field-unknown");
      }

      if (!rawValue) {
        values[field.name] = null;
        emptyFields.push(field.name);
        return;
      }

      const numericValue = Number(rawValue);

      if (!Number.isFinite(numericValue)) {
        if (wrapper) {
          wrapper.classList.add("field-error");
        }

        throw new Error(invalidFieldMessage(field));
      }

      if (field.positive && numericValue <= 0) {
        if (wrapper) {
          wrapper.classList.add("field-error");
        }

        throw new Error(positiveFieldMessage(field));
      }

      values[field.name] = numericValue;
    });

    if (emptyFields.length > 1) {
      emptyFields.forEach(function (fieldName) {
        const wrapper = getFieldWrapper(fieldName);

        if (wrapper) {
          wrapper.classList.add("field-error");
        }
      });

      throw new Error(insufficientDataMessage());
    }

    if (emptyFields.length === 0) {
      throw new Error(leaveOneEmptyMessage());
    }

    return {
      values: values,
      unknownKey: emptyFields[0]
    };
  }

  function calculateSolverResult(config, payload) {
    const values = payload.values;
    const unknownKey = payload.unknownKey;
    const baseValues = {};
    const unknownField = config.fields.find(function (field) {
      return field.name === unknownKey;
    });

    config.fields.forEach(function (field) {
      if (values[field.name] == null) {
        return;
      }

      baseValues[field.name] = toBase(field.category, values[field.name], values[`${field.name}Unit`]);
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
      solvedDisplayValue: solvedDisplayValue
    };

    if (typeof config.decorateResult === "function") {
      config.decorateResult(result);
    }

    return result;
  }

  function buildConversionLines(config, result) {
    return config.fields.filter(function (field) {
      return field.name !== result.unknownKey;
    }).map(function (field) {
      const rawValue = result.values[field.name];
      const unitKey = result.values[`${field.name}Unit`];
      const baseValue = result.baseValues[field.name];
      return `${text(field.title)} = ${withUnit(field.category, unitKey, rawValue, 6)} = ${num(baseValue, 6)} ${baseUnitSymbol(field.category)}`;
    });
  }

  function buildSummary(config, result) {
    const solvedSuffix = text(pair(" (solved)", " (محسوب)"));

    return config.fields.map(function (field) {
      const unitKey = result.values[`${field.name}Unit`];
      const displayValue = field.name === result.unknownKey
        ? result.solvedDisplayValue
        : result.values[field.name];

      return {
        label: `${text(field.title)}${field.name === result.unknownKey ? solvedSuffix : ""}`,
        value: withUnit(field.category, unitKey, displayValue, 6)
      };
    });
  }

  function buildSolverView(config, result) {
    const unknownField = result.unknownField;
    const unitKey = result.values[`${result.unknownKey}Unit`];
    const baseAnswer = `${num(result.solvedBaseValue, 6)} ${baseUnitSymbol(unknownField.category)}`;
    const finalAnswer = `${unknownField.badge} = ${withUnit(unknownField.category, unitKey, result.solvedDisplayValue, 6)}`;
    const conversionLines = buildConversionLines(config, result);
    const summary = buildSummary(config, result);
    const metrics = typeof config.metrics === "function" ? config.metrics(result) : [];

    return {
      final: finalAnswer,
      secondary: `${text(pair("Detected unknown", "المتغير المجهول"))}: ${text(unknownField.title)} | ${text(pair("Base SI result", "النتيجة بوحدة الأساس"))}: ${baseAnswer}`,
      summary: summary,
      metrics: metrics,
      steps: [
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
      ],
      exportInputs: summary.map(function (item) {
        return `${item.label}: ${item.value}`;
      }),
      exportAnswer: finalAnswer,
      exportSteps: [
        `${text(pair("Original formula", "المعادلة الأصلية"))}: ${config.formula}`,
        `${text(pair("Detected unknown", "المتغير المجهول"))}: ${text(unknownField.title)}`,
        `${text(pair("Rearranged formula", "إعادة ترتيب المعادلة"))}: ${config.rearranged[result.unknownKey]}`
      ].concat(conversionLines).concat([
        config.substitution[result.unknownKey](result),
        `${text(pair("Final answer", "الإجابة النهائية"))}: ${finalAnswer}`,
        `${text(pair("Base SI result", "النتيجة بوحدة الأساس"))}: ${baseAnswer}`
      ])
    };
  }

  function renderSolverField(field) {
    const value = getFieldValue(field);
    const unitValue = getFieldUnit(field);
    const isUnknown = state.result && state.result.unknownKey === field.name ? " field-unknown" : "";
    const description = text(field.description || pair(
      "Enter the value in the selected unit, or leave this variable empty to solve for it.",
      "أدخل القيمة بالوحدة المختارة، أو اترك هذا المتغير فارغاً ليتم حله."
    ));
    const hint = text(field.hint || pair(
      "Leave this card empty only when it is the unknown variable.",
      "اترك هذه البطاقة فارغة فقط عندما تكون هي المتغير المجهول."
    ));

    return `
      <section class="solver-variable${isUnknown}" data-field="${esc(field.name)}">
        <div class="solver-variable__header">
          <div class="solver-variable__badge">${esc(field.badge)}</div>
          <h3 class="solver-variable__title">${esc(text(field.title))}</h3>
          <p class="solver-variable__description">${esc(description)}</p>
        </div>
        <div class="solver-variable__body">
          <div class="field">
            <label for="solver-${esc(field.name)}">${esc(text(pair("Value", "القيمة")))}</label>
            <input
              id="solver-${esc(field.name)}"
              name="${esc(field.name)}"
              class="input-control"
              type="number"
              inputmode="decimal"
              step="any"
              ${field.positive ? 'min="0"' : ""}
              value="${value == null ? "" : esc(value)}"
              placeholder="${esc(text(pair("Enter a value or leave empty to solve", "أدخل قيمة أو اترك الحقل فارغاً للحل")))}"
            >
          </div>
          <div class="field">
            <label for="solver-${esc(field.name)}-unit">${esc(text(pair("Unit", "الوحدة")))}</label>
            <select
              id="solver-${esc(field.name)}-unit"
              name="${esc(field.name)}Unit"
              class="select-control"
              data-unit-category="${esc(field.category)}"
              data-selected="${esc(unitValue)}"
            ></select>
          </div>
        </div>
        <p class="field-help solver-variable__hint">${esc(hint)}</p>
      </section>
    `;
  }

  const solverConfigs = {
    "strain": {
      moduleKey: "strain",
      formula: "ε = ΔL / L",
      subtitle: pair(
        "Solve normal strain, change in length, or original length by leaving one variable empty.",
        "احسب الانفعال العمودي أو التغير في الطول أو الطول الأصلي من خلال ترك متغير واحد فارغاً."
      ),
      explanation: pair(
        "Normal strain is a dimensionless measure of deformation relative to the original member length.",
        "الانفعال العمودي هو مقياس لا بعدي للتشوه نسبةً إلى الطول الأصلي للعضو."
      ),
      resultPlaceholder: pair(
        "The solved strain variable and full steps will appear here.",
        "سيظهر هنا المتغير المحسوب للانفعال مع خطوات الحل كاملة."
      ),
      notes: [
        {
          title: pair("Sign convention", "إشارة الانفعال"),
          text: pair(
            "Positive strain indicates elongation, while negative strain indicates shortening.",
            "الانفعال الموجب يدل على الاستطالة، بينما الانفعال السالب يدل على النقصان في الطول."
          )
        },
        {
          title: pair("Unit consistency", "توافق الوحدات"),
          text: pair(
            "AhmedSolver converts both lengths automatically, but the physical interpretation still depends on consistent measurements.",
            "يقوم AhmedSolver بتحويل الطولين تلقائياً، لكن التفسير الفيزيائي يبقى معتمداً على اتساق القياسات."
          )
        }
      ],
      fields: [
        {
          name: "deltaLength",
          badge: "ΔL",
          title: pair("Change in length (ΔL)", "التغير في الطول (ΔL)"),
          description: pair("Member elongation or shortening over the loaded length.", "استطالة العضو أو قصره على طول الجزء المحمل."),
          category: "length",
          defaultUnit: "mm"
        },
        {
          name: "originalLength",
          badge: "L",
          title: pair("Original length (L)", "الطول الأصلي (L)"),
          description: pair("Gauge length before any deformation occurs.", "طول القياس قبل حدوث أي تشوه."),
          category: "length",
          defaultUnit: "m",
          positive: true
        },
        {
          name: "strain",
          badge: "ε",
          title: pair("Normal strain (ε)", "الانفعال العمودي (ε)"),
          description: pair("Dimensionless deformation relative to the original length.", "تشوه لا بعدي نسبةً إلى الطول الأصلي."),
          category: "strain",
          defaultUnit: "microstrain"
        }
      ],
      rearranged: {
        strain: "ε = ΔL / L",
        deltaLength: "ΔL = ε × L",
        originalLength: "L = ΔL / ε"
      },
      solve: {
        strain: function (base) {
          return base.deltaLength / base.originalLength;
        },
        deltaLength: function (base) {
          return base.strain * base.originalLength;
        },
        originalLength: function (base) {
          return base.deltaLength / assertNonZero(base.strain, text(pair("Normal strain (ε)", "الانفعال العمودي (ε)")));
        }
      },
      substitution: {
        strain: function (result) {
          return `ε = ${num(result.baseValues.deltaLength, 6)} / ${num(result.baseValues.originalLength, 6)} = ${num(result.solvedBaseValue, 6)} m/m`;
        },
        deltaLength: function (result) {
          return `ΔL = ${num(result.baseValues.strain, 6)} × ${num(result.baseValues.originalLength, 6)} = ${num(result.solvedBaseValue, 6)} m`;
        },
        originalLength: function (result) {
          return `L = ${num(result.baseValues.deltaLength, 6)} / ${num(result.baseValues.strain, 6)} = ${num(result.solvedBaseValue, 6)} m`;
        }
      }
    },
    "hookes-law": {
      moduleKey: "hookesLaw",
      formula: "σ = E × ε",
      subtitle: pair(
        "Solve stress, elastic modulus, or strain using Hooke's Law by leaving one field empty.",
        "احسب الإجهاد أو معامل المرونة أو الانفعال باستخدام قانون هوك عبر ترك حقل واحد فارغاً."
      ),
      explanation: pair(
        "Hooke's Law relates stress and strain in the elastic range of a material.",
        "يربط قانون هوك بين الإجهاد والانفعال ضمن المجال المرن للمادة."
      ),
      resultPlaceholder: pair(
        "The solved Hooke's Law variable and the full derivation will appear here.",
        "سيظهر هنا المتغير المحسوب في قانون هوك مع الاشتقاق الكامل."
      ),
      notes: [
        {
          title: pair("Elastic range", "المجال المرن"),
          text: pair(
            "The relation σ = E × ε is valid while the material remains in its linear elastic region.",
            "العلاقة σ = E × ε تكون صحيحة ما دامت المادة ضمن المجال المرن الخطي."
          )
        },
        {
          title: pair("Strain units", "وحدات الانفعال"),
          text: pair(
            "Microstrain and percent are converted automatically into the base ratio before solving.",
            "يتم تحويل المايكروسترين والنسبة المئوية تلقائياً إلى النسبة الأساسية قبل الحل."
          )
        }
      ],
      fields: [
        {
          name: "stress",
          badge: "σ",
          title: pair("Normal stress (σ)", "الإجهاد العمودي (σ)"),
          description: pair("Material stress produced within the elastic range.", "الإجهاد المتولد في المادة ضمن المجال المرن."),
          category: "stress",
          defaultUnit: "MPa"
        },
        {
          name: "elasticModulus",
          badge: "E",
          title: pair("Elastic modulus (E)", "معامل المرونة (E)"),
          description: pair("Material stiffness that links stress to strain.", "صلابة المادة التي تربط الإجهاد بالانفعال."),
          category: "stress",
          defaultUnit: "GPa",
          positive: true
        },
        {
          name: "strain",
          badge: "ε",
          title: pair("Normal strain (ε)", "الانفعال العمودي (ε)"),
          description: pair("Dimensionless deformation used in Hooke's Law.", "التشوه اللابعدي المستخدم في قانون هوك."),
          category: "strain",
          defaultUnit: "microstrain"
        }
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
      }
    },
    "axial-deformation": {
      moduleKey: "axialDeformation",
      formula: "ΔL = (P × L) / (A × E)",
      subtitle: pair(
        "Solve any single unknown in the axial deformation equation by leaving that variable empty.",
        "احسب أي متغير مجهول واحد في معادلة الاستطالة المحورية من خلال ترك ذلك المتغير فارغاً."
      ),
      explanation: pair(
        "This equation models elastic axial deformation for a prismatic member under direct load.",
        "تمثل هذه المعادلة التشوه المحوري المرن لعضو منشوري تحت حمل مباشر."
      ),
      resultPlaceholder: pair(
        "The solved axial variable and full engineering steps will appear here.",
        "سيظهر هنا المتغير المحوري المحسوب مع الخطوات الهندسية الكاملة."
      ),
      notes: [
        {
          title: pair("Member assumptions", "افتراضات العضو"),
          text: pair(
            "The relation assumes a uniform cross-section, constant material properties, and elastic behavior.",
            "تفترض العلاقة أن المقطع ثابت وأن خصائص المادة ثابتة وأن السلوك مرن."
          )
        },
        {
          title: pair("Stiffness effect", "تأثير الصلابة"),
          text: pair(
            "A larger area or larger elastic modulus reduces the axial deformation under the same load.",
            "المساحة الأكبر أو معامل المرونة الأكبر يقللان من الاستطالة المحورية تحت نفس الحمل."
          )
        }
      ],
      fields: [
        {
          name: "load",
          badge: "P",
          title: pair("Applied load (P)", "الحمل المطبق (P)"),
          description: pair("Direct axial force acting on the member.", "القوة المحورية المباشرة المؤثرة على العضو."),
          category: "force",
          defaultUnit: "kN"
        },
        {
          name: "length",
          badge: "L",
          title: pair("Member length (L)", "طول العضو (L)"),
          description: pair("Loaded member length measured along the axis.", "طول العضو المحمل المقاس على امتداد المحور."),
          category: "length",
          defaultUnit: "m",
          positive: true
        },
        {
          name: "area",
          badge: "A",
          title: pair("Area (A)", "المساحة (A)"),
          description: pair("Cross-sectional area resisting the axial load.", "المساحة المقطعية المقاومة للحمل المحوري."),
          category: "area",
          defaultUnit: "mm2",
          positive: true
        },
        {
          name: "elasticModulus",
          badge: "E",
          title: pair("Elastic modulus (E)", "معامل المرونة (E)"),
          description: pair("Material stiffness used in the axial deformation model.", "صلابة المادة المستخدمة في نموذج التشوه المحوري."),
          category: "stress",
          defaultUnit: "GPa",
          positive: true
        },
        {
          name: "deltaLength",
          badge: "ΔL",
          title: pair("Axial deformation (ΔL)", "الاستطالة المحورية (ΔL)"),
          description: pair("Total change in member length due to the axial load.", "التغير الكلي في طول العضو بسبب الحمل المحوري."),
          category: "length",
          defaultUnit: "mm"
        }
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
          return (base.deltaLength * base.area * base.elasticModulus) / assertNonZero(base.load, text(pair("Applied load (P)", "الحمل المطبق (P)")));
        },
        area: function (base) {
          return (base.load * base.length) / (assertNonZero(base.deltaLength, text(pair("Axial deformation (ΔL)", "الاستطالة المحورية (ΔL)"))) * base.elasticModulus);
        },
        elasticModulus: function (base) {
          return (base.load * base.length) / (base.area * assertNonZero(base.deltaLength, text(pair("Axial deformation (ΔL)", "الاستطالة المحورية (ΔL)"))));
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
      }
    },
    "shear-stress": {
      moduleKey: "shearStress",
      formula: "τ = V / A",
      subtitle: pair(
        "Solve shear stress, shear force, or resisting area by leaving one variable empty.",
        "احسب إجهاد القص أو قوة القص أو المساحة المقاومة عبر ترك متغير واحد فارغاً."
      ),
      explanation: pair(
        "Average shear stress is found by dividing the direct shear force by the resisting area.",
        "يُحسب إجهاد القص المتوسط بقسمة قوة القص المباشرة على المساحة المقاومة."
      ),
      resultPlaceholder: pair(
        "The solved shear variable and the worked solution will appear here.",
        "سيظهر هنا متغير القص المحسوب مع الحل التفصيلي."
      ),
      notes: [
        {
          title: pair("Average value", "القيمة المتوسطة"),
          text: pair(
            "This equation gives the average shear stress over the resisting area.",
            "تعطي هذه المعادلة إجهاد القص المتوسط على كامل المساحة المقاومة."
          )
        },
        {
          title: pair("Area matters", "أثر المساحة"),
          text: pair(
            "A larger resisting area lowers the average shear stress under the same shear force.",
            "المساحة المقاومة الأكبر تقلل إجهاد القص المتوسط تحت نفس قوة القص."
          )
        }
      ],
      fields: [
        {
          name: "shearForce",
          badge: "V",
          title: pair("Shear force (V)", "قوة القص (V)"),
          description: pair("Direct shear force acting on the section.", "قوة القص المباشرة المؤثرة على المقطع."),
          category: "force",
          defaultUnit: "kN"
        },
        {
          name: "area",
          badge: "A",
          title: pair("Resisting area (A)", "المساحة المقاومة (A)"),
          description: pair("Area resisting the applied shear force.", "المساحة التي تقاوم قوة القص المطبقة."),
          category: "area",
          defaultUnit: "mm2",
          positive: true
        },
        {
          name: "tau",
          badge: "τ",
          title: pair("Shear stress (τ)", "إجهاد القص (τ)"),
          description: pair("Average shear stress developed on the resisting area.", "إجهاد القص المتوسط المتولد على المساحة المقاومة."),
          category: "stress",
          defaultUnit: "MPa"
        }
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
      }
    },
    "torsion": {
      moduleKey: "torsion",
      formula: "τ = (T × r) / J",
      subtitle: pair(
        "Solve torsional shear stress or any one missing torsion variable from the same equation.",
        "احسب إجهاد القص الالتوائي أو أي متغير مفقود واحد من نفس معادلة الالتواء."
      ),
      explanation: pair(
        "The torsion relation links torque, radius, and polar moment of inertia to the resulting shear stress.",
        "تربط علاقة الالتواء بين العزم ونصف القطر والعزم القطبي وبين إجهاد القص الناتج."
      ),
      resultPlaceholder: pair(
        "The solved torsion variable and step-by-step work will appear here.",
        "سيظهر هنا المتغير المحسوب في الالتواء مع خطوات الحل."
      ),
      notes: [
        {
          title: pair("Outer radius", "نصف القطر الخارجي"),
          text: pair(
            "Using the outer radius gives the maximum torsional shear stress in a circular shaft.",
            "استخدام نصف القطر الخارجي يعطي إجهاد القص الالتوائي الأعظمي في العمود الدائري."
          )
        },
        {
          title: pair("Section resistance", "مقاومة المقطع"),
          text: pair(
            "A larger polar moment of inertia reduces torsional stress for the same torque.",
            "العزم القطبي الأكبر يقلل الإجهاد الالتوائي عند نفس قيمة العزم."
          )
        }
      ],
      fields: [
        {
          name: "torque",
          badge: "T",
          title: pair("Torque (T)", "العزم (T)"),
          description: pair("Applied twisting moment on the shaft.", "عزم الالتواء المطبق على العمود."),
          category: "torque",
          defaultUnit: "kNm"
        },
        {
          name: "radius",
          badge: "r",
          title: pair("Radius (r)", "نصف القطر (r)"),
          description: pair("Distance from the shaft center to the evaluation point.", "المسافة من مركز العمود إلى نقطة التقييم."),
          category: "length",
          defaultUnit: "mm",
          positive: true
        },
        {
          name: "polarInertia",
          badge: "J",
          title: pair("Polar inertia (J)", "العزم القطبي (J)"),
          description: pair("Polar moment of inertia of the shaft section.", "العزم القطبي لعطالة مقطع العمود."),
          category: "inertia",
          defaultUnit: "mm4",
          positive: true
        },
        {
          name: "tau",
          badge: "τ",
          title: pair("Torsional shear stress (τ)", "إجهاد القص الالتوائي (τ)"),
          description: pair("Maximum or evaluated torsional shear stress.", "إجهاد القص الالتوائي المحسوب أو الأعظمي."),
          category: "stress",
          defaultUnit: "MPa"
        }
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
          return (base.tau * base.polarInertia) / base.radius;
        },
        radius: function (base) {
          return (base.tau * base.polarInertia) / assertNonZero(base.torque, text(pair("Torque (T)", "العزم (T)")));
        },
        polarInertia: function (base) {
          return (base.torque * base.radius) / assertNonZero(base.tau, text(pair("Torsional shear stress (τ)", "إجهاد القص الالتوائي (τ)")));
        }
      },
      substitution: {
        tau: function (result) {
          return `τ = (${num(result.baseValues.torque, 6)} × ${num(result.baseValues.radius, 6)}) / ${num(result.baseValues.polarInertia, 6)} = ${num(result.solvedBaseValue, 6)} Pa`;
        },
        torque: function (result) {
          return `T = (${num(result.baseValues.tau, 6)} × ${num(result.baseValues.polarInertia, 6)}) / ${num(result.baseValues.radius, 6)} = ${num(result.solvedBaseValue, 6)} N*m`;
        },
        radius: function (result) {
          return `r = (${num(result.baseValues.tau, 6)} × ${num(result.baseValues.polarInertia, 6)}) / ${num(result.baseValues.torque, 6)} = ${num(result.solvedBaseValue, 6)} m`;
        },
        polarInertia: function (result) {
          return `J = (${num(result.baseValues.torque, 6)} × ${num(result.baseValues.radius, 6)}) / ${num(result.baseValues.tau, 6)} = ${num(result.solvedBaseValue, 6)} m^4`;
        }
      }
    },
    "bending-stress": {
      moduleKey: "bending",
      formula: "σ = (M × y) / I",
      subtitle: pair(
        "Solve bending stress or any one missing bending variable by leaving exactly one field empty.",
        "احسب إجهاد الانحناء أو أي متغير مفقود واحد في الانحناء من خلال ترك حقل واحد فارغاً."
      ),
      explanation: pair(
        "Flexural stress depends on bending moment, distance from the neutral axis, and section inertia.",
        "يعتمد إجهاد الانحناء على عزم الانحناء والمسافة عن المحور المتعادل وعزم عطالة المقطع."
      ),
      resultPlaceholder: pair(
        "The solved bending variable and the full derivation will appear here.",
        "سيظهر هنا المتغير المحسوب في الانحناء مع الاشتقاق الكامل."
      ),
      notes: [
        {
          title: pair("Distance sign", "إشارة المسافة"),
          text: pair(
            "The sign of y depends on your chosen coordinate convention relative to the neutral axis.",
            "تعتمد إشارة y على اتفاقية المحاور التي تعتمدها بالنسبة إلى المحور المتعادل."
          )
        },
        {
          title: pair("Section stiffness", "صلابة المقطع"),
          text: pair(
            "Increasing the second moment of area reduces flexural stress for the same bending moment.",
            "زيادة عزم العطالة للمقطع تقلل إجهاد الانحناء عند نفس عزم الانحناء."
          )
        }
      ],
      fields: [
        {
          name: "moment",
          badge: "M",
          title: pair("Bending moment (M)", "عزم الانحناء (M)"),
          description: pair("Internal or applied bending moment at the section.", "عزم الانحناء الداخلي أو المطبق عند المقطع."),
          category: "torque",
          defaultUnit: "kNm"
        },
        {
          name: "distance",
          badge: "y",
          title: pair("Distance from neutral axis (y)", "المسافة عن المحور المتعادل (y)"),
          description: pair("Location of the evaluated fiber from the neutral axis.", "موضع الليف المراد تقييمه بالنسبة إلى المحور المتعادل."),
          category: "length",
          defaultUnit: "mm"
        },
        {
          name: "inertia",
          badge: "I",
          title: pair("Second moment of area (I)", "عزم العطالة (I)"),
          description: pair("Section property governing resistance to bending.", "خاصية مقطعية تتحكم في مقاومة الانحناء."),
          category: "inertia",
          defaultUnit: "mm4",
          positive: true
        },
        {
          name: "stress",
          badge: "σ",
          title: pair("Bending stress (σ)", "إجهاد الانحناء (σ)"),
          description: pair("Flexural stress at the selected distance from the neutral axis.", "إجهاد الانحناء عند المسافة المحددة عن المحور المتعادل."),
          category: "stress",
          defaultUnit: "MPa"
        }
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
          return `M = (${num(result.baseValues.stress, 6)} × ${num(result.baseValues.inertia, 6)}) / ${num(result.baseValues.distance, 6)} = ${num(result.solvedBaseValue, 6)} N*m`;
        },
        distance: function (result) {
          return `y = (${num(result.baseValues.stress, 6)} × ${num(result.baseValues.inertia, 6)}) / ${num(result.baseValues.moment, 6)} = ${num(result.solvedBaseValue, 6)} m`;
        },
        inertia: function (result) {
          return `I = (${num(result.baseValues.moment, 6)} × ${num(result.baseValues.distance, 6)}) / ${num(result.baseValues.stress, 6)} = ${num(result.solvedBaseValue, 6)} m^4`;
        }
      }
    },
    "thermal-stress": {
      moduleKey: "thermalStress",
      formula: "σ = E × α × ΔT",
      subtitle: pair(
        "Solve restrained thermal stress or any one missing thermal variable from the same relation.",
        "احسب الإجهاد الحراري المقيد أو أي متغير حراري مفقود واحد من نفس العلاقة."
      ),
      explanation: pair(
        "This stress equation assumes the member is restrained against free thermal expansion or contraction.",
        "تفترض معادلة الإجهاد هذه أن العضو مقيد ضد التمدد أو الانكماش الحراري الحر."
      ),
      resultPlaceholder: pair(
        "The solved thermal variable and the derived thermal strain will appear here.",
        "سيظهر هنا المتغير الحراري المحسوب مع الانفعال الحراري المشتق."
      ),
      notes: [
        {
          title: pair("Restrained condition", "حالة التقييد"),
          text: pair(
            "Thermal stress develops only when expansion or contraction is restrained.",
            "يتولد الإجهاد الحراري فقط عندما يكون التمدد أو الانكماش مقيداً."
          )
        },
        {
          title: pair("Thermal strain", "الانفعال الحراري"),
          text: pair(
            "Even when solving for stress, the page also reports the thermal strain ε_th = α × ΔT.",
            "حتى عند حل الإجهاد، تعرض الصفحة أيضاً الانفعال الحراري ε_th = α × ΔT."
          )
        }
      ],
      fields: [
        {
          name: "stress",
          badge: "σ",
          title: pair("Thermal stress (σ)", "الإجهاد الحراري (σ)"),
          description: pair("Restrained stress caused by temperature change.", "الإجهاد المقيد الناتج عن التغير الحراري."),
          category: "stress",
          defaultUnit: "MPa"
        },
        {
          name: "elasticModulus",
          badge: "E",
          title: pair("Elastic modulus (E)", "معامل المرونة (E)"),
          description: pair("Material stiffness used in thermal stress calculations.", "صلابة المادة المستخدمة في حسابات الإجهاد الحراري."),
          category: "stress",
          defaultUnit: "GPa",
          positive: true
        },
        {
          name: "alpha",
          badge: "α",
          title: pair("Thermal coefficient (α)", "معامل التمدد الحراري (α)"),
          description: pair("Coefficient of thermal expansion for the material.", "معامل التمدد الحراري للمادة."),
          category: "thermalCoeff",
          defaultUnit: "perC",
          positive: true
        },
        {
          name: "deltaT",
          badge: "ΔT",
          title: pair("Temperature change (ΔT)", "التغير الحراري (ΔT)"),
          description: pair("Temperature increase or decrease experienced by the member.", "الزيادة أو النقصان الحراري الذي يتعرض له العضو."),
          category: "tempDiff",
          defaultUnit: "C"
        }
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
      }
    }
  };

  const slug = root.getAttribute("data-tool-slug");

  if (!solverConfigs[slug]) {
    return;
  }

  function render() {
    const config = solverConfigs[slug];
    const view = state.result ? buildSolverView(config, state.result) : null;

    root.innerHTML = `
      <section class="page-hero fade-in-up">
        <div class="page-hero__split">
          <div>
            <span class="page-badge">${esc(text(pair("Single-Unknown Solver", "محلل المتغير المجهول")))}</span>
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
            <p class="hint-line">${esc(solverHint())}</p>
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
                  <p class="field-help">${esc(solverHint())}</p>
                </div>
              </div>

              <div class="action-row">
                <button type="submit" class="button button-primary">${esc(app.t("common.solve", lang()))}</button>
                <button type="button" class="button button-secondary" id="solver-clear">${esc(app.t("common.clear", lang()))}</button>
              </div>

              <div class="status-banner is-visible" id="solver-status" data-state="${view ? "success" : "neutral"}">${esc(view ? successMessage() : readyMessage())}</div>
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
        return `<option value="${key}"${key === selected ? " selected" : ""}>${unitLabel(category, key)}</option>`;
      }).join("");
    });

    const form = root.querySelector("#solver-form");
    const status = root.querySelector("#solver-status");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      try {
        const payload = parseSolverInputs(config, form);
        state.values = payload.values;
        state.result = calculateSolverResult(config, payload);
        saveReport(buildExportPayload(config, buildSolverView(config, state.result)));
        render();
      } catch (error) {
        status.textContent = error.message || readyMessage();
        status.setAttribute("data-state", "error");
      }
    });

    root.querySelector("#solver-clear").addEventListener("click", function () {
      state.values = {};
      state.result = null;
      render();
    });
  }

  render();
  document.addEventListener(app.eventName, function () {
    captureCurrentFormState(solverConfigs[slug]);
    render();
  });
})();
