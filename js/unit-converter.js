(function () {
  "use strict";

  const app = window.StrengthSolverApp;
  const unitsApi = window.StrengthSolverUnits;

  if (!app || !unitsApi) {
    return;
  }

  const categories = ["force", "stress", "length", "area", "inertia", "torque"];

  function translate(key) {
    return app.t(key, app.getLanguage());
  }

  function getCategoryLabel(category) {
    return translate(`interactive.converter.categories.${category}`);
  }

  function initUnitConverter() {
    const form = document.getElementById("unit-converter-form");

    if (!form) {
      return;
    }

    const categoryField = document.getElementById("converter-category");
    const valueField = document.getElementById("converter-value");
    const fromField = document.getElementById("converter-from");
    const toField = document.getElementById("converter-to");
    const clearButton = document.getElementById("converter-clear");
    const statusBanner = document.getElementById("converter-status");
    const finalAnswer = document.getElementById("converter-final-answer");
    const secondaryAnswer = document.getElementById("converter-secondary-answer");
    const metricGrid = document.getElementById("converter-metric-grid");
    const referenceList = document.getElementById("converter-reference-list");
    const stepsList = document.getElementById("converter-steps-list");

    const state = {
      result: null
    };

    function populateCategorySelect(selectedValue) {
      const currentValue = selectedValue || categoryField.value || "force";

      categoryField.innerHTML = categories.map(function (category) {
        const isSelected = category === currentValue ? " selected" : "";
        return `<option value="${category}"${isSelected}>${getCategoryLabel(category)}</option>`;
      }).join("");
    }

    function populateUnitSelects() {
      const currentCategory = categoryField.value || "force";
      const fromValue = fromField.value;
      const toValue = toField.value;

      unitsApi.populateSelect(fromField, currentCategory, fromValue);
      unitsApi.populateSelect(toField, currentCategory, toValue);

      if (!fromField.value) {
        fromField.selectedIndex = 0;
      }

      if (!toField.value || toField.value === fromField.value) {
        const unitKeys = Object.keys(unitsApi.getUnitsForCategory(currentCategory));
        toField.value = unitKeys[Math.min(1, unitKeys.length - 1)];
      }
    }

    function renderReferenceList() {
      referenceList.innerHTML = categories.map(function (category) {
        const units = Object.keys(unitsApi.getUnitsForCategory(category)).map(function (unitKey) {
          return unitsApi.getUnitDefinition(category, unitKey).symbol;
        }).join(", ");

        return `
          <article class="reference-item">
            <strong>${getCategoryLabel(category)}</strong>
            <span>${units}</span>
          </article>
        `;
      }).join("");

      referenceList.insertAdjacentHTML("beforeend", `<span class="helper-code">${translate("interactive.converter.formulaLine")}</span>`);
    }

    function renderMetrics(result) {
      const cards = result
        ? [
            { label: translate("interactive.converter.factorLabel"), value: result.factorRatio },
            { label: translate("interactive.converter.baseValueLabel"), value: `${unitsApi.formatNumber(result.baseValue, 6)} ${unitsApi.getUnitDefinition(result.category, unitsApi.unitCatalog[result.category].baseUnit).symbol}` }
          ]
        : [
            { label: translate("interactive.converter.factorLabel"), value: "--" },
            { label: translate("interactive.converter.baseValueLabel"), value: "--" }
          ];

      metricGrid.innerHTML = cards.map(function (card) {
        return `
          <div class="metric-card">
            <span>${card.label}</span>
            <strong>${card.value}</strong>
          </div>
        `;
      }).join("");
    }

    function renderSteps(result) {
      if (!result) {
        stepsList.innerHTML = `
          <div class="empty-state">
            <p>${translate("interactive.converter.resultPlaceholder")}</p>
          </div>
        `;
        return;
      }

      stepsList.innerHTML = `
        <article class="step-card">
          <h4>1. ${translate("interactive.converter.baseStep")}</h4>
          <p>${unitsApi.formatNumber(result.inputValue, 6)} ${unitsApi.getUnitDefinition(result.category, result.fromUnit).symbol} x ${unitsApi.formatNumber(unitsApi.getUnitDefinition(result.category, result.fromUnit).factor, 8)} = ${unitsApi.formatNumber(result.baseValue, 6)} ${unitsApi.getUnitDefinition(result.category, unitsApi.unitCatalog[result.category].baseUnit).symbol}</p>
        </article>
        <article class="step-card">
          <h4>2. ${translate("interactive.converter.targetStep")}</h4>
          <p>${unitsApi.formatNumber(result.baseValue, 6)} ${unitsApi.getUnitDefinition(result.category, unitsApi.unitCatalog[result.category].baseUnit).symbol} / ${unitsApi.formatNumber(unitsApi.getUnitDefinition(result.category, result.toUnit).factor, 8)} = ${unitsApi.formatNumber(result.outputValue, 6)} ${unitsApi.getUnitDefinition(result.category, result.toUnit).symbol}</p>
        </article>
      `;
    }

    function renderResult(result) {
      if (!result) {
        finalAnswer.textContent = "--";
        secondaryAnswer.textContent = translate("interactive.converter.resultPlaceholder");
        renderMetrics(null);
        renderSteps(null);
        return;
      }

      finalAnswer.textContent = `${unitsApi.formatNumber(result.outputValue, 6)} ${unitsApi.getUnitDefinition(result.category, result.toUnit).symbol}`;
      secondaryAnswer.textContent = `${unitsApi.formatNumber(result.inputValue, 6)} ${unitsApi.getUnitDefinition(result.category, result.fromUnit).symbol}`;
      renderMetrics(result);
      renderSteps(result);
    }

    function convert(silent) {
      const numericValue = Number(valueField.value);
      const hasValue = valueField.value.trim() !== "";

      if (!hasValue || !Number.isFinite(numericValue)) {
        state.result = null;
        renderResult(null);
        if (!silent) {
          unitsApi.setStatus(statusBanner, translate("interactive.converter.validationValue"), "error");
        }
        if (!silent) {
          valueField.closest(".field").classList.add("field-error");
        }
        return null;
      }

      valueField.closest(".field").classList.remove("field-error");

      const category = categoryField.value;
      const fromUnit = fromField.value;
      const toUnit = toField.value;
      const baseValue = unitsApi.toBaseValue(category, numericValue, fromUnit);
      const outputValue = unitsApi.fromBaseValue(category, baseValue, toUnit);

      state.result = {
        category: category,
        fromUnit: fromUnit,
        toUnit: toUnit,
        inputValue: numericValue,
        baseValue: baseValue,
        outputValue: outputValue,
        factorRatio: `${unitsApi.formatNumber(unitsApi.getUnitDefinition(category, fromUnit).factor, 8)} / ${unitsApi.formatNumber(unitsApi.getUnitDefinition(category, toUnit).factor, 8)}`
      };

      unitsApi.setStatus(statusBanner, translate("interactive.converter.convertMessage"), "success");
      renderResult(state.result);
      return state.result;
    }

    function resetConverter() {
      form.reset();
      categoryField.value = "force";
      populateUnitSelects();
      state.result = null;
      valueField.closest(".field").classList.remove("field-error");
      unitsApi.setStatus(statusBanner, translate("interactive.shared.ready"), "neutral");
      renderResult(null);
    }

    function syncLanguage() {
      const selectedCategory = categoryField.value || "force";
      const selectedFrom = fromField.value;
      const selectedTo = toField.value;

      populateCategorySelect(selectedCategory);
      unitsApi.populateSelect(fromField, categoryField.value, selectedFrom);
      unitsApi.populateSelect(toField, categoryField.value, selectedTo);
      populateUnitSelects();
      renderReferenceList();

      if (state.result) {
        renderResult(state.result);
        unitsApi.setStatus(statusBanner, translate("interactive.converter.convertMessage"), "success");
      } else {
        renderResult(null);
        unitsApi.setStatus(statusBanner, translate("interactive.shared.ready"), "neutral");
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      convert(false);
    });

    clearButton.addEventListener("click", function () {
      resetConverter();
    });

    categoryField.addEventListener("change", function () {
      populateUnitSelects();
      renderReferenceList();
      if (valueField.value.trim() !== "") {
        convert(true);
      }
    });

    fromField.addEventListener("change", function () {
      if (valueField.value.trim() !== "") {
        convert(true);
      }
    });

    toField.addEventListener("change", function () {
      if (valueField.value.trim() !== "") {
        convert(true);
      }
    });

    valueField.addEventListener("input", function () {
      if (valueField.value.trim() === "") {
        state.result = null;
        unitsApi.setStatus(statusBanner, translate("interactive.shared.ready"), "neutral");
        renderResult(null);
        valueField.closest(".field").classList.remove("field-error");
        return;
      }

      convert(true);
    });

    document.addEventListener(app.eventName, function () {
      syncLanguage();
    });

    categoryField.value = "force";
    populateCategorySelect("force");
    populateUnitSelects();
    renderReferenceList();
    renderResult(null);
    unitsApi.setStatus(statusBanner, translate("interactive.shared.ready"), "neutral");
  }

  document.addEventListener("DOMContentLoaded", function () {
    initUnitConverter();
  });
})();
