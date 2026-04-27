(function () {
  "use strict";

  const app = window.StrengthSolverApp;
  const utils = window.AhmedSolverEngineering;
  const sections = window.AhmedSolverSections;
  const root = document.getElementById("composite-beam-root");

  if (!app || !utils || !sections || !root) {
    return;
  }

  const momentUnits = ["N·m", "kN·m"];
  const palette = ["#ff6d6d", "#ff9f43", "#ffd166", "#8cffc1", "#59c3ff", "#a78bfa"];

  const copy = {
    en: {
      kicker: "Transformed-Section Tool",
      title: "Composite Beam Solver",
      intro:
        "Stack material layers, transform the section to a reference modulus, and solve the neutral axis, transformed inertia, and flexural stress in each layer.",
      summaryTitle: "What this page solves",
      summaryPoints: [
        "Automatic transformed-section widths from each layer modulus relative to E_ref.",
        "Neutral axis and total transformed inertia from composite-area and parallel-axis calculations.",
        "Layer-by-layer bending stress results with a transformed preview and responsive stress charts."
      ],
      setupTitle: "Composite section inputs",
      setupDescription:
        "Define the number of stacked layers, the reference modulus E_ref, the applied moment, and each layer width, height, and modulus.",
      previewTitle: "Transformed section preview",
      previewDescription:
        "Each colored layer is drawn with its transformed width b' = (E / E_ref) b. The dashed line marks the transformed neutral axis.",
      resultsTitle: "Solved results",
      stepsTitle: "Step-by-step solution",
      chartsTitle: "Stress charts",
      chartsDescription:
        "The stress plot shows how the actual stress changes through the depth as stiffness changes from layer to layer.",
      buttons: {
        solve: "Solve Composite Beam",
        reset: "Reset"
      },
      status: {
        ready: "Set the layer stack and enter the section and loading data.",
        missing: "Please complete all layer fields, E_ref, and the applied moment.",
        invalid: "Invalid number format in one or more fields.",
        positive: "All layer dimensions and moduli must be greater than zero.",
        moment: "The applied bending moment must be a non-zero number.",
        success: "Composite beam solved successfully."
      },
      warnings: {
        highStress: "One or more layer stresses are very high for common engineering materials. Recheck the loading and stiffness values.",
        smallInertia: "The transformed inertia is very small. Check the layer geometry and modulus inputs.",
        strongMismatch: "The modulus contrast between layers is large, so interface stress jumps are expected."
      },
      fields: {
        layerCount: "Number of layers",
        referenceModulus: "Reference modulus E_ref (GPa)",
        moment: "Applied moment M",
        momentUnit: "Moment unit",
        width: "Width b (mm)",
        height: "Height h (mm)",
        modulus: "Layer modulus E (GPa)"
      },
      hints: {
        referenceModulus: "Choose the base material modulus used for the transformed section.",
        moment: "Use the bending sign convention that matches your analysis.",
        layer: "Layers are stacked vertically from bottom to top."
      },
      labels: {
        transformedWidth: "Transformed width b'",
        neutralAxis: "Neutral axis",
        distribution: "Stress through depth",
        layerBar: "Maximum stress by layer",
        noWarnings: "No major engineering warnings were triggered for this case.",
        sectionIncomplete: "Complete all active layer inputs to preview the transformed section."
      },
      metrics: {
        referenceModulus: "Reference modulus E_ref",
        neutralAxis: "Neutral axis ȳ",
        inertia: "Transformed inertia I_tr",
        maxStress: "Maximum layer stress"
      },
      tables: {
        transformedWidths: "Transformed widths",
        layerStresses: "Layer stresses",
        layer: "Layer",
        width: "b (mm)",
        transformed: "b' (mm)",
        ratio: "n = E / E_ref",
        top: "Top stress",
        bottom: "Bottom stress",
        max: "Max |σ|"
      },
      formulas: {
        transform: "b' = (E / E_ref) b",
        centroid: "ȳ = Σ(A' y) / ΣA'",
        inertia: "I_tr = Σ(I_c' + A' d^2)",
        stress: "σ_i = (E_i / E_ref) M y / I_tr"
      },
      steps: {
        transform: "1. Transform each layer width",
        centroid: "2. Compute the transformed neutral axis",
        inertia: "3. Compute the transformed inertia",
        stress: "4. Recover stress in each layer"
      }
    },
    ar: {
      kicker: "أداة المقطع المحول",
      title: "محلل الجائز المركب",
      intro:
        "كوّن طبقات المواد، وحول المقطع إلى معامل مرجعي، ثم احسب المحور المتعادل وعزم العطالة المحول وإجهاد الانحناء في كل طبقة.",
      summaryTitle: "ما الذي تحله هذه الصفحة",
      summaryPoints: [
        "حساب تلقائي للعروض المحولة لكل طبقة نسبةً إلى معامل المرجع E_ref.",
        "حساب المحور المتعادل وعزم العطالة الكلي المحول باستخدام المساحات المركبة ومحور التوازي.",
        "نتائج إجهاد طبقة بطبقة مع معاينة للمقطع المحول ومخططات إجهاد متجاوبة."
      ],
      setupTitle: "مدخلات المقطع المركب",
      setupDescription:
        "حدد عدد الطبقات، ومعامل المرجع E_ref، والعزم المؤثر، ثم أدخل عرض وارتفاع ومعامل مرونة كل طبقة.",
      previewTitle: "معاينة المقطع المحول",
      previewDescription:
        "يتم رسم كل طبقة بعرض محول b' = (E / E_ref) b. ويمثل الخط المتقطع المحور المتعادل المحول.",
      resultsTitle: "النتائج المحلولة",
      stepsTitle: "الحل خطوة بخطوة",
      chartsTitle: "مخططات الإجهاد",
      chartsDescription:
        "يوضح مخطط الإجهاد كيف يتغير الإجهاد الفعلي عبر العمق مع تغير الصلابة من طبقة إلى أخرى.",
      buttons: {
        solve: "احسب الجائز المركب",
        reset: "إعادة ضبط"
      },
      status: {
        ready: "حدد الطبقات وأدخل بيانات المقطع والحمل.",
        missing: "يرجى إكمال جميع حقول الطبقات وE_ref والعزم المؤثر.",
        invalid: "تنسيق الرقم غير صالح في واحد أو أكثر من الحقول.",
        positive: "يجب أن تكون جميع أبعاد الطبقات ومعاملاتها أكبر من الصفر.",
        moment: "يجب أن يكون عزم الانحناء المؤثر عدداً غير صفري.",
        success: "تم حل الجائز المركب بنجاح."
      },
      warnings: {
        highStress: "إجهاد طبقة أو أكثر مرتفع جداً مقارنةً بمواد هندسية شائعة. تحقق من الحمل والصلابة.",
        smallInertia: "عزم العطالة المحول صغير جداً. تحقق من هندسة الطبقات ومعاملاتها.",
        strongMismatch: "يوجد فرق كبير بين معاملات الطبقات، لذا من المتوقع حدوث قفزات في الإجهاد عند الفواصل."
      },
      fields: {
        layerCount: "عدد الطبقات",
        referenceModulus: "معامل المرجع E_ref (GPa)",
        moment: "العزم المؤثر M",
        momentUnit: "وحدة العزم",
        width: "العرض b (mm)",
        height: "الارتفاع h (mm)",
        modulus: "معامل الطبقة E (GPa)"
      },
      hints: {
        referenceModulus: "اختر معامل المادة المرجعية المستخدمة في المقطع المحول.",
        moment: "استخدم اصطلاح إشارة الانحناء المناسب لتحليلك.",
        layer: "تتراص الطبقات عمودياً من الأسفل إلى الأعلى."
      },
      labels: {
        transformedWidth: "العرض المحول b'",
        neutralAxis: "المحور المتعادل",
        distribution: "الإجهاد عبر العمق",
        layerBar: "الإجهاد الأعظمي لكل طبقة",
        noWarnings: "لا توجد تحذيرات هندسية رئيسية لهذه الحالة.",
        sectionIncomplete: "أكمل جميع مدخلات الطبقات النشطة لمعاينة المقطع المحول."
      },
      metrics: {
        referenceModulus: "معامل المرجع E_ref",
        neutralAxis: "المحور المتعادل ȳ",
        inertia: "عزم العطالة المحول I_tr",
        maxStress: "الإجهاد الأعظمي في الطبقات"
      },
      tables: {
        transformedWidths: "العروض المحولة",
        layerStresses: "إجهادات الطبقات",
        layer: "الطبقة",
        width: "b (mm)",
        transformed: "b' (mm)",
        ratio: "n = E / E_ref",
        top: "إجهاد الأعلى",
        bottom: "إجهاد الأسفل",
        max: "Max |σ|"
      },
      formulas: {
        transform: "b' = (E / E_ref) b",
        centroid: "ȳ = Σ(A' y) / ΣA'",
        inertia: "I_tr = Σ(I_c' + A' d^2)",
        stress: "σ_i = (E_i / E_ref) M y / I_tr"
      },
      steps: {
        transform: "1. تحويل عرض كل طبقة",
        centroid: "2. حساب المحور المتعادل المحول",
        inertia: "3. حساب عزم العطالة المحول",
        stress: "4. استرجاع الإجهاد في كل طبقة"
      }
    }
  };

  const state = {
    layerCount: "3",
    referenceModulus: "",
    moment: "",
    momentUnit: "kN·m",
    layers: createLayers(3),
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

  function createLayers(count) {
    const layers = [];
    let index = 0;

    while (index < count) {
      layers.push({
        width: "",
        height: "",
        modulus: ""
      });
      index += 1;
    }

    return layers;
  }

  function syncLayerCount(nextCount) {
    const safeCount = Math.max(2, Math.min(6, nextCount));

    if (state.layers.length === safeCount) {
      return;
    }

    while (state.layers.length < safeCount) {
      state.layers.push({ width: "", height: "", modulus: "" });
    }

    if (state.layers.length > safeCount) {
      state.layers = state.layers.slice(0, safeCount);
    }
  }

  function parsePositive(value) {
    const parsed = utils.parseNumber(value);

    if (parsed.empty) {
      return { ok: false, reason: "missing" };
    }

    if (!parsed.ok) {
      return { ok: false, reason: "invalid" };
    }

    if (parsed.value <= 0) {
      return { ok: false, reason: "positive" };
    }

    return { ok: true, value: parsed.value };
  }

  function parseMoment() {
    const parsed = utils.parseNumber(state.moment);

    if (parsed.empty) {
      return { ok: false, reason: "missing" };
    }

    if (!parsed.ok) {
      return { ok: false, reason: "invalid" };
    }

    if (parsed.value === 0) {
      return { ok: false, reason: "zero" };
    }

    return { ok: true, value: parsed.value };
  }

  function parseLayers() {
    const parsedLayers = [];
    let runningBottom = 0;

    for (let index = 0; index < state.layers.length; index += 1) {
      const layer = state.layers[index];
      const width = parsePositive(layer.width);
      const height = parsePositive(layer.height);
      const modulus = parsePositive(layer.modulus);

      if (!width.ok || !height.ok || !modulus.ok) {
        return {
          ok: false,
          reason: !width.ok ? width.reason : !height.ok ? height.reason : modulus.reason
        };
      }

      const bottomMm = runningBottom;
      const topMm = runningBottom + height.value;
      const centroidMm = bottomMm + height.value / 2;
      parsedLayers.push({
        index: index,
        label: `L${index + 1}`,
        widthMm: width.value,
        heightMm: height.value,
        modulusGPa: modulus.value,
        bottomMm: bottomMm,
        topMm: topMm,
        centroidMm: centroidMm,
        color: palette[index % palette.length]
      });
      runningBottom = topMm;
    }

    return {
      ok: true,
      layers: parsedLayers,
      totalDepthMm: runningBottom
    };
  }

  function buildPreviewResult() {
    const texts = currentCopy();
    const parsedLayers = parseLayers();
    const referenceModulus = parsePositive(state.referenceModulus);

    if (!parsedLayers.ok) {
      return { ok: false, reason: parsedLayers.reason };
    }

    if (!referenceModulus.ok) {
      return { ok: false, reason: referenceModulus.reason };
    }

    const transformedLayers = parsedLayers.layers.map(function (layer) {
      const ratio = layer.modulusGPa / referenceModulus.value;
      const transformedWidthMm = ratio * layer.widthMm;
      const areaTransMm2 = transformedWidthMm * layer.heightMm;

      return Object.assign({}, layer, {
        ratio: ratio,
        transformedWidthMm: transformedWidthMm,
        areaTransMm2: areaTransMm2
      });
    });

    const totalArea = transformedLayers.reduce(function (sum, layer) {
      return sum + layer.areaTransMm2;
    }, 0);
    const ybarMm = transformedLayers.reduce(function (sum, layer) {
      return sum + layer.areaTransMm2 * layer.centroidMm;
    }, 0) / totalArea;
    const iTransMm4 = transformedLayers.reduce(function (sum, layer) {
      const localI = (layer.transformedWidthMm * Math.pow(layer.heightMm, 3)) / 12;
      return sum + localI + layer.areaTransMm2 * Math.pow(layer.centroidMm - ybarMm, 2);
    }, 0);

    return {
      ok: true,
      referenceModulusGPa: referenceModulus.value,
      transformedLayers: transformedLayers,
      totalDepthMm: parsedLayers.totalDepthMm,
      ybarMm: ybarMm,
      ybarM: sections.mmToM(ybarMm),
      iTransMm4: iTransMm4,
      iTransM4: sections.mm4ToM4(iTransMm4),
      formulaLines: [
        texts.formulas.transform,
        texts.formulas.centroid,
        texts.formulas.inertia
      ]
    };
  }

  function buildSolvedResult() {
    const preview = buildPreviewResult();
    const moment = parseMoment();

    if (!preview.ok) {
      return preview;
    }

    if (!moment.ok) {
      return {
        ok: false,
        reason: moment.reason === "invalid" ? "invalid" : moment.reason === "zero" ? "moment" : "missing"
      };
    }

    const momentNm = utils.convertMomentToNewtonMeters(moment.value, state.momentUnit);
    const layers = preview.transformedLayers.map(function (layer) {
      const yTopM = sections.mmToM(layer.topMm - preview.ybarMm);
      const yBottomM = sections.mmToM(layer.bottomMm - preview.ybarMm);
      const yCentroidM = sections.mmToM(layer.centroidMm - preview.ybarMm);
      const sigmaTopPa = layer.ratio * (momentNm * yTopM) / preview.iTransM4;
      const sigmaBottomPa = layer.ratio * (momentNm * yBottomM) / preview.iTransM4;
      const sigmaCentroidPa = layer.ratio * (momentNm * yCentroidM) / preview.iTransM4;

      return Object.assign({}, layer, {
        sigmaTopPa: sigmaTopPa,
        sigmaBottomPa: sigmaBottomPa,
        sigmaCentroidPa: sigmaCentroidPa,
        sigmaMaxPa: Math.max(Math.abs(sigmaTopPa), Math.abs(sigmaBottomPa))
      });
    });

    const warnings = [];
    const maxStress = layers.reduce(function (max, layer) {
      return Math.max(max, layer.sigmaMaxPa);
    }, 0);
    const moduli = layers.map(function (layer) {
      return layer.modulusGPa;
    });

    if (preview.iTransM4 < 1e-10) {
      warnings.push("smallInertia");
    }

    if (maxStress > 600e6) {
      warnings.push("highStress");
    }

    if (Math.max.apply(null, moduli) / Math.min.apply(null, moduli) > 4) {
      warnings.push("strongMismatch");
    }

    return {
      ok: true,
      referenceModulusGPa: preview.referenceModulusGPa,
      momentInput: moment.value,
      momentNm: momentNm,
      transformedLayers: layers,
      totalDepthMm: preview.totalDepthMm,
      ybarMm: preview.ybarMm,
      ybarM: preview.ybarM,
      iTransMm4: preview.iTransMm4,
      iTransM4: preview.iTransM4,
      warnings: warnings,
      maxStressPa: maxStress
    };
  }

  function solve() {
    const texts = currentCopy();
    const result = buildSolvedResult();

    if (!result.ok) {
      state.result = null;
      state.status = {
        state: "error",
        key:
          result.reason === "invalid"
            ? "invalid"
            : result.reason === "positive"
              ? "positive"
              : result.reason === "moment"
                ? "moment"
                : "missing"
      };
      return;
    }

    state.result = result;
    state.status = { state: "success", key: "success" };
  }

  function reset() {
    state.layerCount = "3";
    state.referenceModulus = "";
    state.moment = "";
    state.momentUnit = "kN·m";
    state.layers = createLayers(3);
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

  function buildMetrics(texts) {
    if (!state.result) {
      return `
        <article class="placeholder-card" style="grid-column: 1 / -1;">
          <p>${esc(texts.status.ready)}</p>
        </article>
      `;
    }

    return [
      metricCard(texts.metrics.referenceModulus, `${format(state.result.referenceModulusGPa, 4)} GPa`),
      metricCard(texts.metrics.neutralAxis, `${format(state.result.ybarMm, 4)} mm`),
      metricCard(texts.metrics.inertia, `${format(state.result.iTransMm4, 4)} mm^4`),
      metricCard(texts.metrics.maxStress, formatStressPa(state.result.maxStressPa))
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

  function buildLayerTables(texts) {
    if (!state.result) {
      return "";
    }

    return `
      <div class="detail-grid">
        <article class="preview-card">
          <h3>${esc(texts.tables.transformedWidths)}</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>${esc(texts.tables.layer)}</th>
                <th>${esc(texts.tables.width)}</th>
                <th>${esc(texts.tables.ratio)}</th>
                <th>${esc(texts.tables.transformed)}</th>
              </tr>
            </thead>
            <tbody>
              ${state.result.transformedLayers.map(function (layer) {
                return `
                  <tr>
                    <td>${esc(layer.label)}</td>
                    <td>${esc(format(layer.widthMm, 3))}</td>
                    <td>${esc(format(layer.ratio, 4))}</td>
                    <td>${esc(format(layer.transformedWidthMm, 3))}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </article>

        <article class="preview-card">
          <h3>${esc(texts.tables.layerStresses)}</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>${esc(texts.tables.layer)}</th>
                <th>${esc(texts.tables.top)}</th>
                <th>${esc(texts.tables.bottom)}</th>
                <th>${esc(texts.tables.max)}</th>
              </tr>
            </thead>
            <tbody>
              ${state.result.transformedLayers.map(function (layer) {
                return `
                  <tr>
                    <td>${esc(layer.label)}</td>
                    <td>${esc(format(utils.fromBase("stress", layer.sigmaTopPa, "MPa"), 4))} MPa</td>
                    <td>${esc(format(utils.fromBase("stress", layer.sigmaBottomPa, "MPa"), 4))} MPa</td>
                    <td>${esc(format(utils.fromBase("stress", layer.sigmaMaxPa, "MPa"), 4))} MPa</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </article>
      </div>
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

    const transformLines = state.result.transformedLayers.map(function (layer) {
      return `${layer.label}: n = ${format(layer.ratio, 4)}, b' = ${format(layer.transformedWidthMm, 4)} mm`;
    }).join("\n");
    const inertiaLines = state.result.transformedLayers.map(function (layer) {
      return `${layer.label}: I' = ${format((layer.transformedWidthMm * Math.pow(layer.heightMm, 3)) / 12, 4)} mm^4`;
    }).join("\n");
    const stressLines = state.result.transformedLayers.map(function (layer) {
      return `${layer.label}: σmax = ${format(utils.fromBase("stress", layer.sigmaMaxPa, "MPa"), 4)} MPa`;
    }).join("\n");
    const steps = [
      {
        title: texts.steps.transform,
        body: `${texts.formulas.transform}\n${transformLines}`
      },
      {
        title: texts.steps.centroid,
        body:
          `${texts.formulas.centroid}\n` +
          `ȳ = ${format(state.result.ybarMm, 4)} mm`
      },
      {
        title: texts.steps.inertia,
        body:
          `${texts.formulas.inertia}\n` +
          `${inertiaLines}\n` +
          `I_tr = ${format(state.result.iTransMm4, 4)} mm^4 = ${state.result.iTransM4.toExponential(4)} m^4`
      },
      {
        title: texts.steps.stress,
        body:
          `${texts.formulas.stress}\n` +
          `M = ${format(state.result.momentInput, 4)} ${state.momentUnit} = ${format(state.result.momentNm, 4)} N·m\n` +
          `${stressLines}`
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

  function layerInputCard(layer, index, texts) {
    return `
      <article class="input-card layer-card">
        <span class="input-card__badge">${esc(`L${index + 1}`)}</span>
        <span class="input-card__title">${esc(`${texts.tables.layer} ${index + 1}`)}</span>
        <span class="input-card__hint">${esc(texts.hints.layer)}</span>
        <div class="mini-field-grid">
          <label class="field-stack">
            <span>${esc(texts.fields.width)}</span>
            <input class="input-control" type="text" inputmode="decimal" data-layer-index="${index}" data-layer-field="width" value="${esc(layer.width)}">
          </label>
          <label class="field-stack">
            <span>${esc(texts.fields.height)}</span>
            <input class="input-control" type="text" inputmode="decimal" data-layer-index="${index}" data-layer-field="height" value="${esc(layer.height)}">
          </label>
          <label class="field-stack">
            <span>${esc(texts.fields.modulus)}</span>
            <input class="input-control" type="text" inputmode="decimal" data-layer-index="${index}" data-layer-field="modulus" value="${esc(layer.modulus)}">
          </label>
        </div>
      </article>
    `;
  }

  function buildPreview(texts) {
    const preview = buildPreviewResult();

    if (!preview.ok) {
      return `
        <article class="preview-card">
          <h3>${esc(texts.previewTitle)}</h3>
          <p>${esc(texts.labels.sectionIncomplete)}</p>
        </article>
      `;
    }

    const width = 360;
    const height = 300;
    const pad = 36;
    const maxWidth = preview.transformedLayers.reduce(function (max, layer) {
      return Math.max(max, layer.transformedWidthMm);
    }, 1);
    const scaleX = (width - 2 * pad) / maxWidth;
    const scaleY = (height - 2 * pad) / preview.totalDepthMm;
    const topOffset = (height - preview.totalDepthMm * scaleY) / 2;
    const naY = topOffset + (preview.totalDepthMm - preview.ybarMm) * scaleY;

    return `
      <article class="preview-card">
        <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(texts.previewTitle)}">
          ${preview.transformedLayers.map(function (layer) {
            const rectWidth = layer.transformedWidthMm * scaleX;
            const rectHeight = layer.heightMm * scaleY;
            const x = (width - rectWidth) / 2;
            const y = topOffset + (preview.totalDepthMm - layer.topMm) * scaleY;

            return `
              <rect x="${x}" y="${y}" width="${rectWidth}" height="${rectHeight}" rx="16" fill="${layer.color}" opacity="0.72" stroke="#ffffff" stroke-width="2"></rect>
              <text x="${x + rectWidth / 2}" y="${y + rectHeight / 2 + 5}" fill="#050505" font-size="13" text-anchor="middle">${esc(layer.label)}</text>
            `;
          }).join("")}
          <line x1="28" y1="${naY}" x2="${width - 28}" y2="${naY}" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="8 7"></line>
          <text x="34" y="${naY - 10}" fill="#ffffff" font-size="13">${esc(texts.labels.neutralAxis)}</text>
        </svg>
        <ul class="summary-list">
          <li>${esc(`ȳ = ${format(preview.ybarMm, 4)} mm`)}</li>
          <li>${esc(`I_tr = ${format(preview.iTransMm4, 4)} mm^4`)}</li>
          <li>${esc(`max b' = ${format(maxWidth, 4)} mm`)}</li>
        </ul>
      </article>
    `;
  }

  function distributionSvg(texts) {
    if (!state.result) {
      return `<div class="placeholder-card"><p>${esc(texts.status.ready)}</p></div>`;
    }

    const width = 760;
    const height = 300;
    const left = 86;
    const right = 700;
    const top = 24;
    const bottom = 258;
    const amplitude = Math.max.apply(null, state.result.transformedLayers.map(function (layer) {
      return Math.max(
        Math.abs(utils.fromBase("stress", layer.sigmaTopPa, "MPa")),
        Math.abs(utils.fromBase("stress", layer.sigmaBottomPa, "MPa"))
      );
    }).concat([1]));
    const xZero = (left + right) / 2;
    const scaleX = ((right - left) / 2 - 34) / amplitude;
    const scaleY = (bottom - top) / state.result.totalDepthMm;
    const naY = top + (state.result.totalDepthMm - state.result.ybarMm) * scaleY;

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(texts.labels.distribution)}">
        <line x1="${xZero}" y1="${top}" x2="${xZero}" y2="${bottom}" stroke="rgba(255,255,255,0.38)" stroke-width="2"></line>
        <line x1="${left}" y1="${naY}" x2="${right}" y2="${naY}" stroke="#ffffff" stroke-width="2" stroke-dasharray="8 7"></line>
        ${state.result.transformedLayers.map(function (layer) {
          const sigmaBottom = utils.fromBase("stress", layer.sigmaBottomPa, "MPa");
          const sigmaTop = utils.fromBase("stress", layer.sigmaTopPa, "MPa");
          const yBottom = top + (state.result.totalDepthMm - layer.bottomMm) * scaleY;
          const yTop = top + (state.result.totalDepthMm - layer.topMm) * scaleY;
          return `
            <path
              d="M ${xZero + sigmaBottom * scaleX} ${yBottom} L ${xZero + sigmaTop * scaleX} ${yTop}"
              fill="none"
              stroke="${layer.color}"
              stroke-width="4"
              stroke-linecap="round"
            ></path>
            <circle cx="${xZero + sigmaTop * scaleX}" cy="${yTop}" r="4" fill="${layer.color}"></circle>
            <circle cx="${xZero + sigmaBottom * scaleX}" cy="${yBottom}" r="4" fill="${layer.color}"></circle>
          `;
        }).join("")}
        <text x="${xZero + 10}" y="${naY - 8}" fill="#ffffff" font-size="13">${esc(texts.labels.neutralAxis)}</text>
        <text x="${left}" y="${height - 12}" fill="#f5f5f5" font-size="13">-σ</text>
        <text x="${right - 26}" y="${height - 12}" fill="#f5f5f5" font-size="13">+σ</text>
      </svg>
    `;
  }

  function layerBarSvg(texts) {
    if (!state.result) {
      return `<div class="placeholder-card"><p>${esc(texts.status.ready)}</p></div>`;
    }

    const width = 760;
    const height = 300;
    const left = 70;
    const right = 700;
    const bottom = 240;
    const top = 34;
    const maxStress = Math.max.apply(null, state.result.transformedLayers.map(function (layer) {
      return utils.fromBase("stress", layer.sigmaMaxPa, "MPa");
    }).concat([1]));
    const barWidth = 74;
    const gap = (right - left - barWidth * state.result.transformedLayers.length) / Math.max(state.result.transformedLayers.length - 1, 1);

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(texts.labels.layerBar)}">
        <line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" stroke="rgba(255,255,255,0.42)" stroke-width="2"></line>
        ${state.result.transformedLayers.map(function (layer, index) {
          const value = utils.fromBase("stress", layer.sigmaMaxPa, "MPa");
          const barHeight = ((bottom - top) * value) / maxStress;
          const x = left + index * (barWidth + gap);
          const y = bottom - barHeight;
          return `
            <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="18" fill="${layer.color}" opacity="0.82"></rect>
            <text x="${x + barWidth / 2}" y="${bottom + 24}" fill="#f5f5f5" font-size="13" text-anchor="middle">${esc(layer.label)}</text>
            <text x="${x + barWidth / 2}" y="${y - 10}" fill="#f5f5f5" font-size="13" text-anchor="middle">${esc(`${format(value, 4)} MPa`)}</text>
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
                <span class="equation-chip">${esc(texts.formulas.transform)}</span>
                <span class="equation-chip">${esc(texts.formulas.stress)}</span>
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
          <form id="composite-form" class="solver-panel glass-card">
            <div class="subsection" style="margin-top: 0;">
              <div class="panel-header">
                <h2>${esc(texts.setupTitle)}</h2>
                <p>${esc(texts.setupDescription)}</p>
              </div>
              <div class="field-grid">
                <div class="field">
                  <label for="layerCount">${esc(texts.fields.layerCount)}</label>
                  <select id="layerCount" name="layerCount" class="select-control">
                    ${[2, 3, 4, 5, 6].map(function (count) {
                      return `<option value="${count}" ${Number(state.layerCount) === count ? "selected" : ""}>${count}</option>`;
                    }).join("")}
                  </select>
                </div>
                <label class="input-card" for="referenceModulus">
                  <span class="input-card__badge">Eref</span>
                  <span class="input-card__title">${esc(texts.fields.referenceModulus)}</span>
                  <span class="input-card__hint">${esc(texts.hints.referenceModulus)}</span>
                  <input id="referenceModulus" name="referenceModulus" class="input-control" type="text" inputmode="decimal" value="${esc(state.referenceModulus)}">
                </label>
                <label class="input-card" for="moment">
                  <span class="input-card__badge">M</span>
                  <span class="input-card__title">${esc(texts.fields.moment)}</span>
                  <span class="input-card__hint">${esc(texts.hints.moment)}</span>
                  <input id="moment" name="moment" class="input-control" type="text" inputmode="decimal" value="${esc(state.moment)}">
                  <select id="momentUnit" name="momentUnit" class="select-control">
                    ${momentUnits.map(function (unitKey) {
                      return `<option value="${unitKey}" ${state.momentUnit === unitKey ? "selected" : ""}>${esc(unitKey)}</option>`;
                    }).join("")}
                  </select>
                </label>
              </div>
            </div>

            <div class="subsection">
              <div class="panel-header">
                <h3>${esc(texts.fields.layerCount)}: ${esc(state.layerCount)}</h3>
                <p>${esc(texts.hints.layer)}</p>
              </div>
              <div class="layer-stack">
                ${state.layers.map(function (layer, index) {
                  return layerInputCard(layer, index, texts);
                }).join("")}
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
                ${chartCard(texts.labels.distribution, distributionSvg(texts))}
                ${chartCard(texts.labels.layerBar, layerBarSvg(texts))}
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
            ${buildLayerTables(texts)}
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

    const form = root.querySelector("#composite-form");
    const resetButton = root.querySelector("[data-reset]");

    form.addEventListener("input", function (event) {
      if (event.target && event.target.dataset.layerIndex != null) {
        const index = Number(event.target.dataset.layerIndex);
        const field = event.target.dataset.layerField;
        state.layers[index][field] = event.target.value;
        return;
      }

      if (event.target && event.target.name) {
        state[event.target.name] = event.target.value;
      }
    });

    form.addEventListener("change", function (event) {
      if (event.target && event.target.dataset.layerIndex != null) {
        const index = Number(event.target.dataset.layerIndex);
        const field = event.target.dataset.layerField;
        state.layers[index][field] = event.target.value;
        render();
        return;
      }

      if (event.target && event.target.name) {
        state[event.target.name] = event.target.value;

        if (event.target.name === "layerCount") {
          syncLayerCount(Number(state.layerCount));
        }
      }

      render();
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      syncLayerCount(Number(state.layerCount));
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
