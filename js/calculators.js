(function () {
  "use strict";

  const app = window.StrengthSolverApp;

  if (!app) {
    return;
  }

  const unitCatalog = {
    force: {
      baseUnit: "N",
      units: {
        N: { symbol: "N", factor: 1, labelKey: "interactive.units.newton" },
        kN: { symbol: "kN", factor: 1000, labelKey: "interactive.units.kilonewton" },
        lbf: { symbol: "lbf", factor: 4.4482216152605, labelKey: "interactive.units.poundForce" }
      }
    },
    stress: {
      baseUnit: "Pa",
      units: {
        Pa: { symbol: "Pa", factor: 1, labelKey: "interactive.units.pascal" },
        kPa: { symbol: "kPa", factor: 1000, labelKey: "interactive.units.kilopascal" },
        MPa: { symbol: "MPa", factor: 1000000, labelKey: "interactive.units.megapascal" },
        GPa: { symbol: "GPa", factor: 1000000000, labelKey: "interactive.units.gigapascal" },
        psi: { symbol: "psi", factor: 6894.757293168, labelKey: "interactive.units.psi" }
      }
    },
    length: {
      baseUnit: "m",
      units: {
        mm: { symbol: "mm", factor: 0.001, labelKey: "interactive.units.millimeter" },
        cm: { symbol: "cm", factor: 0.01, labelKey: "interactive.units.centimeter" },
        m: { symbol: "m", factor: 1, labelKey: "interactive.units.meter" },
        in: { symbol: "in", factor: 0.0254, labelKey: "interactive.units.inch" },
        ft: { symbol: "ft", factor: 0.3048, labelKey: "interactive.units.foot" }
      }
    },
    area: {
      baseUnit: "m2",
      units: {
        mm2: { symbol: "mm^2", factor: 1e-6, labelKey: "interactive.units.millimeterSquared" },
        cm2: { symbol: "cm^2", factor: 1e-4, labelKey: "interactive.units.centimeterSquared" },
        m2: { symbol: "m^2", factor: 1, labelKey: "interactive.units.meterSquared" },
        in2: { symbol: "in^2", factor: 0.00064516, labelKey: "interactive.units.inchSquared" }
      }
    },
    inertia: {
      baseUnit: "m4",
      units: {
        mm4: { symbol: "mm^4", factor: 1e-12, labelKey: "interactive.units.millimeterFourth" },
        cm4: { symbol: "cm^4", factor: 1e-8, labelKey: "interactive.units.centimeterFourth" },
        m4: { symbol: "m^4", factor: 1, labelKey: "interactive.units.meterFourth" },
        in4: { symbol: "in^4", factor: 4.162314256e-7, labelKey: "interactive.units.inchFourth" }
      }
    },
    torque: {
      baseUnit: "Nm",
      units: {
        Nm: { symbol: "N*m", factor: 1, labelKey: "interactive.units.newtonMeter" },
        kNm: { symbol: "kN*m", factor: 1000, labelKey: "interactive.units.kilonewtonMeter" },
        lbfft: { symbol: "lbf*ft", factor: 1.3558179483314, labelKey: "interactive.units.poundFoot" }
      }
    }
  };

  function getLanguage() {
    return app.getLanguage();
  }

  function translate(key) {
    return app.t(key, getLanguage());
  }

  function getNumberFormatter(decimals) {
    return new Intl.NumberFormat(getLanguage() === "ar" ? "ar" : "en-US", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: 0
    });
  }

  function formatNumber(value, decimals) {
    if (!Number.isFinite(value)) {
      return "--";
    }

    const precision = typeof decimals === "number" ? decimals : 4;
    const absolute = Math.abs(value);

    if (absolute !== 0 && (absolute >= 1000000 || absolute < 0.001)) {
      return value.toExponential(4);
    }

    return getNumberFormatter(precision).format(value);
  }

  function getUnitDefinition(category, unitKey) {
    return unitCatalog[category] && unitCatalog[category].units[unitKey]
      ? unitCatalog[category].units[unitKey]
      : null;
  }

  function getUnitsForCategory(category) {
    return unitCatalog[category] ? unitCatalog[category].units : {};
  }

  function toBaseValue(category, value, unitKey) {
    const unitDefinition = getUnitDefinition(category, unitKey);
    return unitDefinition ? value * unitDefinition.factor : NaN;
  }

  function fromBaseValue(category, value, unitKey) {
    const unitDefinition = getUnitDefinition(category, unitKey);
    return unitDefinition ? value / unitDefinition.factor : NaN;
  }

  function convertValue(category, value, fromUnit, toUnit) {
    const baseValue = toBaseValue(category, value, fromUnit);
    return fromBaseValue(category, baseValue, toUnit);
  }

  function getUnitLabel(category, unitKey) {
    const unitDefinition = getUnitDefinition(category, unitKey);

    if (!unitDefinition) {
      return unitKey;
    }

    return `${unitDefinition.symbol} - ${translate(unitDefinition.labelKey)}`;
  }

  function populateSelect(selectElement, category, selectedValue) {
    const units = getUnitsForCategory(category);
    const currentValue = selectedValue || selectElement.value;

    selectElement.innerHTML = Object.keys(units).map(function (unitKey) {
      const isSelected = unitKey === currentValue ? " selected" : "";
      return `<option value="${unitKey}"${isSelected}>${getUnitLabel(category, unitKey)}</option>`;
    }).join("");

    if (!selectElement.value) {
      selectElement.selectedIndex = 0;
    }
  }

  function setStatus(element, message, state) {
    if (!element) {
      return;
    }

    if (!message) {
      element.classList.remove("is-visible");
      element.textContent = "";
      element.setAttribute("data-state", "neutral");
      return;
    }

    element.textContent = message;
    element.setAttribute("data-state", state || "neutral");
    element.classList.add("is-visible");
  }

  function clearFieldStates(fieldElements) {
    fieldElements.forEach(function (fieldElement) {
      fieldElement.classList.remove("field-error", "field-unknown");
    });
  }

  function getBaseUnitKey(category) {
    return unitCatalog[category] ? unitCatalog[category].baseUnit : "";
  }

  function getBaseUnitSymbol(category) {
    const baseUnitDefinition = getUnitDefinition(category, getBaseUnitKey(category));
    return baseUnitDefinition ? baseUnitDefinition.symbol : "";
  }

  function formatValueWithUnit(category, value, unitKey, decimals) {
    const unitDefinition = getUnitDefinition(category, unitKey);
    const unitSymbol = unitDefinition ? unitDefinition.symbol : unitKey;
    return `${formatNumber(value, decimals)} ${unitSymbol}`;
  }

  function initStressCalculator() {
    const form = document.getElementById("stress-form");

    if (!form) {
      return;
    }

    const loadField = form.querySelector("#stress-load-value");
    const loadUnitField = form.querySelector("#stress-load-unit");
    const areaField = form.querySelector("#stress-area-value");
    const areaUnitField = form.querySelector("#stress-area-unit");
    const stressField = form.querySelector("#stress-value");
    const stressUnitField = form.querySelector("#stress-unit");
    const clearButton = document.getElementById("stress-clear");
    const statusBanner = document.getElementById("stress-status");
    const finalAnswer = document.getElementById("stress-final-answer");
    const secondaryAnswer = document.getElementById("stress-secondary-answer");
    const summaryList = document.getElementById("stress-summary-list");
    const stepsList = document.getElementById("stress-steps-list");

    const state = {
      result: null
    };

    const fieldConfig = {
      load: {
        input: loadField,
        unit: loadUnitField,
        category: "force",
        symbol: "P",
        unknownLabelKey: "interactive.stress.unknownLoad",
        summaryLabelKey: "interactive.stress.loadSummary"
      },
      area: {
        input: areaField,
        unit: areaUnitField,
        category: "area",
        symbol: "A",
        unknownLabelKey: "interactive.stress.unknownArea",
        summaryLabelKey: "interactive.stress.areaSummary"
      },
      stress: {
        input: stressField,
        unit: stressUnitField,
        category: "stress",
        symbol: "sigma",
        unknownLabelKey: "interactive.stress.unknownStress",
        summaryLabelKey: "interactive.stress.stressSummary"
      }
    };

    const fieldKeys = Object.keys(fieldConfig);

    function getFieldWrappers(key) {
      const wrappers = [
        fieldConfig[key].input.closest(".solver-variable") || fieldConfig[key].input.closest(".field"),
        fieldConfig[key].unit.closest(".solver-variable") || fieldConfig[key].unit.closest(".field")
      ].filter(Boolean);

      return wrappers.filter(function (wrapper, index) {
        return wrappers.indexOf(wrapper) === index;
      });
    }

    function getAllWrappers() {
      return fieldKeys.reduce(function (collection, key) {
        return collection.concat(getFieldWrappers(key));
      }, []);
    }

    function getUnknownLabel(key) {
      return translate(fieldConfig[key].unknownLabelKey);
    }

    function getSummaryRows(result) {
      if (!result) {
        return [
          { label: translate("interactive.stress.solvedForSummary"), value: "--" },
          { label: translate("interactive.stress.loadSummary"), value: "--" },
          { label: translate("interactive.stress.areaSummary"), value: "--" },
          { label: translate("interactive.stress.stressSummary"), value: "--" }
        ];
      }

      return [
        { label: translate("interactive.stress.solvedForSummary"), value: getUnknownLabel(result.unknownKey) },
        {
          label: translate("interactive.stress.loadSummary"),
          value: formatValueWithUnit("force", result.rawValues.load, result.units.load, 6)
        },
        {
          label: translate("interactive.stress.areaSummary"),
          value: formatValueWithUnit("area", result.rawValues.area, result.units.area, 6)
        },
        {
          label: translate("interactive.stress.stressSummary"),
          value: formatValueWithUnit("stress", result.rawValues.stress, result.units.stress, 6)
        }
      ];
    }

    function buildDisplayLine(result) {
      return `${fieldConfig[result.unknownKey].symbol} = ${formatValueWithUnit(fieldConfig[result.unknownKey].category, result.rawValues[result.unknownKey], result.units[result.unknownKey], 6)}`;
    }

    function buildBaseResultLine(result) {
      return `${fieldConfig[result.unknownKey].symbol} = ${formatValueWithUnit(fieldConfig[result.unknownKey].category, result.baseValues[result.unknownKey], getBaseUnitKey(fieldConfig[result.unknownKey].category), 6)}`;
    }

    function renderSummary(result) {
      const rows = getSummaryRows(result);

      summaryList.innerHTML = rows.map(function (row) {
        return `
          <div class="summary-item">
            <span>${row.label}</span>
            <strong>${row.value}</strong>
          </div>
        `;
      }).join("");
    }

    function renderSteps(result) {
      if (!result) {
        stepsList.innerHTML = `
          <div class="empty-state">
            <p>${translate("interactive.stress.resultPlaceholder")}</p>
          </div>
        `;
        return;
      }

      const conversionMarkup = buildConversionLines(result.unknownKey, result.rawValues, result.units, result.baseValues).map(function (line) {
        return `<p>${line}</p>`;
      }).join("");
      const unknownLabel = getUnknownLabel(result.unknownKey);
      const baseResultLine = buildBaseResultLine(result);
      const displayLine = buildDisplayLine(result);

      stepsList.innerHTML = `
        <article class="step-card">
          <h4>1. ${translate("interactive.stress.originalFormulaLabel")}</h4>
          <div class="equation-line">sigma = P / A</div>
        </article>
        <article class="step-card">
          <h4>2. ${translate("interactive.stress.detectedUnknownLabel")}</h4>
          <p>${unknownLabel}</p>
        </article>
        <article class="step-card">
          <h4>3. ${translate("interactive.stress.rearrangedFormulaLabel")}</h4>
          <div class="equation-line">${getRearrangedFormula(result.unknownKey)}</div>
        </article>
        <article class="step-card">
          <h4>4. ${translate("interactive.stress.conversionLabel")}</h4>
          ${conversionMarkup}
        </article>
        <article class="step-card">
          <h4>5. ${translate("interactive.stress.substitutionLabel")}</h4>
          <p>${translate("interactive.stress.substitutionLineLabel")}</p>
          <div class="equation-line">${getSubstitutionLine(result.unknownKey, result.baseValues)}</div>
          <p>${translate("interactive.stress.baseResultLabel")}: ${baseResultLine}</p>
        </article>
        <article class="step-card">
          <h4>6. ${translate("interactive.stress.finalAnswerLabel")}</h4>
          <div class="equation-line">${displayLine}</div>
        </article>
      `;
    }

    function renderResult(result) {
      if (!result) {
        finalAnswer.textContent = "--";
        secondaryAnswer.textContent = translate("interactive.stress.resultPlaceholder");
        renderSummary(null);
        renderSteps(null);
        return;
      }

      finalAnswer.textContent = buildDisplayLine(result);
      secondaryAnswer.textContent = `${translate("interactive.stress.detectedUnknownLabel")}: ${getUnknownLabel(result.unknownKey)} | ${translate("interactive.stress.baseResultLabel")}: ${buildBaseResultLine(result)}`;
      renderSummary(result);
      renderSteps(result);
    }

    function setErrorState(keys, messageKey) {
      keys.forEach(function (key) {
        getFieldWrappers(key).forEach(function (wrapper) {
          wrapper.classList.add("field-error");
        });
      });

      state.result = null;
      renderResult(null);
      setStatus(statusBanner, translate(messageKey), "error");
    }

    function markUnknownField(key) {
      getFieldWrappers(key).forEach(function (wrapper) {
        wrapper.classList.add("field-unknown");
      });
    }

    function getRearrangedFormula(unknownKey) {
      const formulas = {
        stress: "sigma = P / A",
        load: "P = sigma x A",
        area: "A = P / sigma"
      };

      return formulas[unknownKey];
    }

    function getSubstitutionLine(unknownKey, baseValues) {
      if (unknownKey === "stress") {
        return `sigma = ${formatNumber(baseValues.load, 6)} ${getBaseUnitSymbol("force")} / ${formatNumber(baseValues.area, 6)} ${getBaseUnitSymbol("area")} = ${formatNumber(baseValues.stress, 6)} ${getBaseUnitSymbol("stress")}`;
      }

      if (unknownKey === "load") {
        return `P = (${formatNumber(baseValues.stress, 6)} ${getBaseUnitSymbol("stress")}) x (${formatNumber(baseValues.area, 6)} ${getBaseUnitSymbol("area")}) = ${formatNumber(baseValues.load, 6)} ${getBaseUnitSymbol("force")}`;
      }

      return `A = ${formatNumber(baseValues.load, 6)} ${getBaseUnitSymbol("force")} / ${formatNumber(baseValues.stress, 6)} ${getBaseUnitSymbol("stress")} = ${formatNumber(baseValues.area, 6)} ${getBaseUnitSymbol("area")}`;
    }

    function getSolvedMessageKey(unknownKey) {
      const keys = {
        stress: "interactive.stress.solvedStressMessage",
        load: "interactive.stress.solvedLoadMessage",
        area: "interactive.stress.solvedAreaMessage"
      };

      return keys[unknownKey];
    }

    function buildConversionLines(unknownKey, rawValues, units, baseValues) {
      return fieldKeys.filter(function (key) {
        return key !== unknownKey;
      }).map(function (key) {
        return `${getUnknownLabel(key)}: ${formatValueWithUnit(fieldConfig[key].category, rawValues[key], units[key], 6)} = ${formatValueWithUnit(fieldConfig[key].category, baseValues[key], getBaseUnitKey(fieldConfig[key].category), 6)}`;
      });
    }

    function validateAndCollect() {
      clearFieldStates(getAllWrappers());

      const rawEntries = {};
      const emptyKeys = [];

      fieldKeys.forEach(function (key) {
        rawEntries[key] = fieldConfig[key].input.value.trim();

        if (rawEntries[key] === "") {
          emptyKeys.push(key);
        }
      });

      if (emptyKeys.length > 1) {
        setErrorState(emptyKeys, "interactive.stress.validationInsufficient");
        return null;
      }

      if (emptyKeys.length === 0) {
        setErrorState(fieldKeys, "interactive.stress.validationSingleUnknown");
        return null;
      }

      const unknownKey = emptyKeys[0];
      const numericValues = {};

      for (let index = 0; index < fieldKeys.length; index += 1) {
        const key = fieldKeys[index];

        if (key === unknownKey) {
          continue;
        }

        const numericValue = Number(rawEntries[key]);

        if (!Number.isFinite(numericValue)) {
          setErrorState([key], `interactive.stress.validation${key.charAt(0).toUpperCase()}${key.slice(1)}`);
          return null;
        }

        if (key === "area" && numericValue <= 0) {
          setErrorState([key], "interactive.stress.validationArea");
          return null;
        }

        numericValues[key] = numericValue;
      }

      return {
        unknownKey: unknownKey,
        numericValues: numericValues
      };
    }

    function solveStress() {
      const validated = validateAndCollect();

      if (!validated) {
        return;
      }

      const unknownKey = validated.unknownKey;
      const units = {
        load: loadUnitField.value,
        area: areaUnitField.value,
        stress: stressUnitField.value
      };
      const rawValues = {
        load: validated.numericValues.load,
        area: validated.numericValues.area,
        stress: validated.numericValues.stress
      };
      const baseValues = {
        load: validated.numericValues.load != null ? toBaseValue("force", validated.numericValues.load, units.load) : null,
        area: validated.numericValues.area != null ? toBaseValue("area", validated.numericValues.area, units.area) : null,
        stress: validated.numericValues.stress != null ? toBaseValue("stress", validated.numericValues.stress, units.stress) : null
      };

      if (unknownKey === "area" && baseValues.stress === 0) {
        setErrorState(["stress"], "interactive.stress.validationStressZeroForArea");
        return;
      }

      if (unknownKey === "stress") {
        baseValues.stress = baseValues.load / baseValues.area;
      } else if (unknownKey === "load") {
        baseValues.load = baseValues.stress * baseValues.area;
      } else {
        baseValues.area = baseValues.load / baseValues.stress;
      }

      if (unknownKey === "area" && (!Number.isFinite(baseValues.area) || baseValues.area <= 0)) {
        setErrorState(["area"], "interactive.stress.validationAreaResult");
        return;
      }

      if (!Number.isFinite(baseValues[unknownKey])) {
        setErrorState([unknownKey], "interactive.shared.validation");
        return;
      }

      rawValues[unknownKey] = fromBaseValue(fieldConfig[unknownKey].category, baseValues[unknownKey], units[unknownKey]);

      if (unknownKey === "area" && rawValues.area <= 0) {
        setErrorState(["area"], "interactive.stress.validationAreaResult");
        return;
      }

      clearFieldStates(getAllWrappers());
      markUnknownField(unknownKey);

      state.result = {
        unknownKey: unknownKey,
        units: units,
        rawValues: rawValues,
        baseValues: baseValues
      };

      setStatus(statusBanner, translate(getSolvedMessageKey(unknownKey)), "success");
      renderResult(state.result);
    }

    function resetForm() {
      form.reset();
      loadUnitField.value = "kN";
      areaUnitField.value = "mm2";
      stressUnitField.value = "MPa";
      state.result = null;
      clearFieldStates(getAllWrappers());
      setStatus(statusBanner, translate("interactive.shared.ready"), "neutral");
      renderResult(null);
    }

    function syncLanguage() {
      const loadUnit = loadUnitField.value || "kN";
      const areaUnit = areaUnitField.value || "mm2";
      const stressUnit = stressUnitField.value || "MPa";

      populateSelect(loadUnitField, "force", loadUnit);
      populateSelect(areaUnitField, "area", areaUnit);
      populateSelect(stressUnitField, "stress", stressUnit);

      if (state.result) {
        renderResult(state.result);
        setStatus(statusBanner, translate(getSolvedMessageKey(state.result.unknownKey)), "success");
      } else {
        renderResult(null);
        setStatus(statusBanner, translate("interactive.shared.ready"), "neutral");
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      solveStress();
    });

    clearButton.addEventListener("click", function () {
      resetForm();
    });

    form.addEventListener("input", function () {
      clearFieldStates(getAllWrappers());

      if (state.result || statusBanner.getAttribute("data-state") !== "neutral") {
        state.result = null;
        renderResult(null);
        setStatus(statusBanner, translate("interactive.shared.ready"), "neutral");
      }
    });

    form.addEventListener("change", function () {
      clearFieldStates(getAllWrappers());

      if (state.result || statusBanner.getAttribute("data-state") !== "neutral") {
        state.result = null;
        renderResult(null);
        setStatus(statusBanner, translate("interactive.shared.ready"), "neutral");
      }
    });

    document.addEventListener(app.eventName, function () {
      syncLanguage();
    });

    loadUnitField.value = "kN";
    areaUnitField.value = "mm2";
    stressUnitField.value = "MPa";
    syncLanguage();
  }

  window.StrengthSolverUnits = {
    unitCatalog: unitCatalog,
    getUnitsForCategory: getUnitsForCategory,
    getUnitDefinition: getUnitDefinition,
    getUnitLabel: getUnitLabel,
    convertValue: convertValue,
    toBaseValue: toBaseValue,
    fromBaseValue: fromBaseValue,
    formatNumber: formatNumber,
    populateSelect: populateSelect,
    setStatus: setStatus
  };

  document.addEventListener("DOMContentLoaded", function () {
    initStressCalculator();
  });
})();
