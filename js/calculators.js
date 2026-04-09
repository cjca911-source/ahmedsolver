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

  function clearFieldErrors(fieldElements) {
    fieldElements.forEach(function (fieldElement) {
      fieldElement.classList.remove("field-error");
    });
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
    const outputUnitField = form.querySelector("#stress-output-unit");
    const clearButton = document.getElementById("stress-clear");
    const statusBanner = document.getElementById("stress-status");
    const finalAnswer = document.getElementById("stress-final-answer");
    const secondaryAnswer = document.getElementById("stress-secondary-answer");
    const summaryList = document.getElementById("stress-summary-list");
    const stepsList = document.getElementById("stress-steps-list");

    const state = {
      result: null
    };

    function renderSummary(result) {
      const rows = [
        { label: translate("interactive.stress.loadSummary"), value: result ? `${formatNumber(result.rawLoad, 4)} ${getUnitDefinition("force", result.loadUnit).symbol}` : "--" },
        { label: translate("interactive.stress.areaSummary"), value: result ? `${formatNumber(result.rawArea, 4)} ${getUnitDefinition("area", result.areaUnit).symbol}` : "--" },
        { label: translate("interactive.stress.outputSummary"), value: result ? getUnitDefinition("stress", result.outputUnit).symbol : "--" }
      ];

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

      stepsList.innerHTML = `
        <article class="step-card">
          <h4>1. ${translate("interactive.stress.stepConvertLoad")}</h4>
          <p>${formatNumber(result.rawLoad, 6)} ${getUnitDefinition("force", result.loadUnit).symbol} = ${formatNumber(result.loadBase, 6)} N</p>
        </article>
        <article class="step-card">
          <h4>2. ${translate("interactive.stress.stepConvertArea")}</h4>
          <p>${formatNumber(result.rawArea, 6)} ${getUnitDefinition("area", result.areaUnit).symbol} = ${formatNumber(result.areaBase, 6)} m^2</p>
        </article>
        <article class="step-card">
          <h4>3. ${translate("interactive.stress.stepSubstitute")}</h4>
          <p>sigma = P / A</p>
          <div class="equation-line">sigma = ${formatNumber(result.loadBase, 6)} / ${formatNumber(result.areaBase, 6)} = ${formatNumber(result.stressBase, 6)} Pa</div>
        </article>
        <article class="step-card">
          <h4>4. ${translate("interactive.stress.stepConvertOutput")}</h4>
          <p>${formatNumber(result.stressBase, 6)} Pa to ${formatNumber(result.outputValue, 6)} ${getUnitDefinition("stress", result.outputUnit).symbol}</p>
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

      finalAnswer.textContent = `${formatNumber(result.outputValue, 6)} ${getUnitDefinition("stress", result.outputUnit).symbol}`;
      secondaryAnswer.textContent = `${formatNumber(result.stressBase, 6)} Pa`;
      renderSummary(result);
      renderSteps(result);
    }

    function validateInputs() {
      const loadFieldWrapper = loadField.closest(".field");
      const areaFieldWrapper = areaField.closest(".field");

      clearFieldErrors([loadFieldWrapper, areaFieldWrapper]);

      const loadValue = Number(loadField.value);
      const areaValue = Number(areaField.value);
      const hasLoad = loadField.value.trim() !== "";
      const hasArea = areaField.value.trim() !== "";

      if (!hasLoad || !Number.isFinite(loadValue)) {
        loadFieldWrapper.classList.add("field-error");
        state.result = null;
        renderResult(null);
        setStatus(statusBanner, translate("interactive.stress.validationLoad"), "error");
        return null;
      }

      if (!hasArea || !Number.isFinite(areaValue) || areaValue <= 0) {
        areaFieldWrapper.classList.add("field-error");
        state.result = null;
        renderResult(null);
        setStatus(statusBanner, translate("interactive.stress.validationArea"), "error");
        return null;
      }

      return {
        loadValue: loadValue,
        areaValue: areaValue
      };
    }

    function solveStress() {
      const validated = validateInputs();

      if (!validated) {
        return;
      }

      const loadBase = toBaseValue("force", validated.loadValue, loadUnitField.value);
      const areaBase = toBaseValue("area", validated.areaValue, areaUnitField.value);
      const stressBase = loadBase / areaBase;
      const outputValue = fromBaseValue("stress", stressBase, outputUnitField.value);

      state.result = {
        rawLoad: validated.loadValue,
        rawArea: validated.areaValue,
        loadUnit: loadUnitField.value,
        areaUnit: areaUnitField.value,
        outputUnit: outputUnitField.value,
        loadBase: loadBase,
        areaBase: areaBase,
        stressBase: stressBase,
        outputValue: outputValue
      };

      setStatus(statusBanner, translate("interactive.stress.solvedMessage"), "success");
      renderResult(state.result);
    }

    function resetForm() {
      form.reset();
      loadUnitField.value = "kN";
      areaUnitField.value = "mm2";
      outputUnitField.value = "MPa";
      state.result = null;
      clearFieldErrors([
        loadField.closest(".field"),
        areaField.closest(".field")
      ]);
      setStatus(statusBanner, translate("interactive.shared.ready"), "neutral");
      renderResult(null);
    }

    function syncLanguage() {
      const loadUnit = loadUnitField.value || "kN";
      const areaUnit = areaUnitField.value || "mm2";
      const outputUnit = outputUnitField.value || "MPa";

      populateSelect(loadUnitField, "force", loadUnit);
      populateSelect(areaUnitField, "area", areaUnit);
      populateSelect(outputUnitField, "stress", outputUnit);

      if (state.result) {
        renderResult(state.result);
        setStatus(statusBanner, translate("interactive.stress.solvedMessage"), "success");
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

    document.addEventListener(app.eventName, function () {
      syncLanguage();
    });

    loadUnitField.value = "kN";
    areaUnitField.value = "mm2";
    outputUnitField.value = "MPa";
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
