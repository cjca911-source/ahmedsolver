(function () {
  "use strict";

  const unitCatalog = {
    stress: {
      Pa: { factor: 1, symbol: "Pa" },
      kPa: { factor: 1e3, symbol: "kPa" },
      MPa: { factor: 1e6, symbol: "MPa" },
      GPa: { factor: 1e9, symbol: "GPa" },
      psi: { factor: 6894.757293168, symbol: "psi" }
    },
    length: {
      mm: { factor: 1e-3, symbol: "mm" },
      cm: { factor: 1e-2, symbol: "cm" },
      m: { factor: 1, symbol: "m" },
      in: { factor: 0.0254, symbol: "in" },
      ft: { factor: 0.3048, symbol: "ft" }
    },
    force: {
      N: { factor: 1, symbol: "N" },
      kN: { factor: 1e3, symbol: "kN" },
      lbf: { factor: 4.4482216152605, symbol: "lbf" }
    },
    lineLoad: {
      "N/m": { factor: 1, symbol: "N/m" },
      "kN/m": { factor: 1e3, symbol: "kN/m" },
      "N/mm": { factor: 1e3, symbol: "N/mm" },
      "lbf/ft": { factor: 14.593902937206, symbol: "lbf/ft" }
    },
    modulus: {
      Pa: { factor: 1, symbol: "Pa" },
      MPa: { factor: 1e6, symbol: "MPa" },
      GPa: { factor: 1e9, symbol: "GPa" },
      psi: { factor: 6894.757293168, symbol: "psi" }
    },
    inertia: {
      mm4: { factor: 1e-12, symbol: "mm^4" },
      cm4: { factor: 1e-8, symbol: "cm^4" },
      m4: { factor: 1, symbol: "m^4" },
      in4: { factor: 4.162314256e-7, symbol: "in^4" }
    }
  };

  function normalizeText(value) {
    return value == null ? "" : String(value).trim();
  }

  function parseNumber(value) {
    const raw = normalizeText(value);

    if (raw === "") {
      return {
        ok: false,
        empty: true,
        raw: raw,
        value: NaN
      };
    }

    const normalized = raw.replace(/,/g, "");
    const numeric = Number(normalized);

    return {
      ok: Number.isFinite(numeric),
      empty: false,
      raw: raw,
      normalized: normalized,
      value: numeric
    };
  }

  function getUnit(category, key) {
    return unitCatalog[category] && unitCatalog[category][key] ? unitCatalog[category][key] : null;
  }

  function toBase(category, value, unitKey) {
    const unit = getUnit(category, unitKey);
    return unit ? value * unit.factor : NaN;
  }

  function fromBase(category, value, unitKey) {
    const unit = getUnit(category, unitKey);
    return unit ? value / unit.factor : NaN;
  }

  function formatNumber(value, language, decimals) {
    if (!Number.isFinite(value)) {
      return "--";
    }

    const precision = typeof decimals === "number" ? decimals : 4;
    const absolute = Math.abs(value);

    if (absolute !== 0 && (absolute >= 1e6 || absolute < 1e-4)) {
      return value.toExponential(4);
    }

    return new Intl.NumberFormat(language === "ar" ? "ar" : "en-US", {
      maximumFractionDigits: precision
    }).format(value);
  }

  function formatWithUnit(category, value, unitKey, language, decimals) {
    const unit = getUnit(category, unitKey);
    const formattedValue = formatNumber(value, language, decimals);
    return unit ? `${formattedValue} ${unit.symbol}` : formattedValue;
  }

  function optionsFor(category) {
    return Object.keys(unitCatalog[category] || {});
  }

  function convertLengthToMeters(value, unitKey) {
    return toBase("length", value, unitKey);
  }

  function convertForceToNewtons(value, unitKey) {
    return toBase("force", value, unitKey);
  }

  function convertLineLoadToNewtonPerMeter(value, unitKey) {
    return toBase("lineLoad", value, unitKey);
  }

  function convertModulusToPascals(value, unitKey) {
    return toBase("modulus", value, unitKey);
  }

  function convertInertiaToMetersFourth(value, unitKey) {
    return toBase("inertia", value, unitKey);
  }

  function convertMetersToLength(value, unitKey) {
    return fromBase("length", value, unitKey);
  }

  function convertMetersFourthToInertia(value, unitKey) {
    return fromBase("inertia", value, unitKey);
  }

  window.AhmedSolverEngineering = {
    unitCatalog: unitCatalog,
    normalizeText: normalizeText,
    parseNumber: parseNumber,
    getUnit: getUnit,
    toBase: toBase,
    fromBase: fromBase,
    formatNumber: formatNumber,
    formatWithUnit: formatWithUnit,
    optionsFor: optionsFor,
    convertLengthToMeters: convertLengthToMeters,
    convertForceToNewtons: convertForceToNewtons,
    convertLineLoadToNewtonPerMeter: convertLineLoadToNewtonPerMeter,
    convertModulusToPascals: convertModulusToPascals,
    convertInertiaToMetersFourth: convertInertiaToMetersFourth,
    convertMetersToLength: convertMetersToLength,
    convertMetersFourthToInertia: convertMetersFourthToInertia
  };
})();
