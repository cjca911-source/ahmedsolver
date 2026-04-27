(function () {
  "use strict";

  const utils = window.AhmedSolverEngineering;

  if (!utils) {
    return;
  }

  function mmToM(value) {
    return value * 1e-3;
  }

  function mm2ToM2(value) {
    return value * 1e-6;
  }

  function mm3ToM3(value) {
    return value * 1e-9;
  }

  function mm4ToM4(value) {
    return value * 1e-12;
  }

  function parsePositiveDimension(value) {
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

  function buildResult(shape, raw, geometry) {
    const cTopMm = geometry.depthMm - geometry.ybarMm;
    const cBottomMm = geometry.ybarMm;
    const sTopMm3 = geometry.iMm4 / cTopMm;
    const sBottomMm3 = geometry.iMm4 / cBottomMm;

    return {
      ok: true,
      shape: shape,
      raw: raw,
      areaMm2: geometry.areaMm2,
      areaM2: mm2ToM2(geometry.areaMm2),
      ybarMm: geometry.ybarMm,
      ybarM: mmToM(geometry.ybarMm),
      depthMm: geometry.depthMm,
      depthM: mmToM(geometry.depthMm),
      iMm4: geometry.iMm4,
      iM4: mm4ToM4(geometry.iMm4),
      cTopMm: cTopMm,
      cBottomMm: cBottomMm,
      cTopM: mmToM(cTopMm),
      cBottomM: mmToM(cBottomMm),
      sTopMm3: sTopMm3,
      sBottomMm3: sBottomMm3,
      sTopM3: mm3ToM3(sTopMm3),
      sBottomM3: mm3ToM3(sBottomMm3),
      sMinMm3: Math.min(sTopMm3, sBottomMm3),
      sMinM3: mm3ToM3(Math.min(sTopMm3, sBottomMm3)),
      drawData: geometry.drawData,
      detailLines: geometry.detailLines || [],
      formula: geometry.formula || ""
    };
  }

  function rectangle(raw) {
    const width = parsePositiveDimension(raw.width);
    const height = parsePositiveDimension(raw.height);

    if (!width.ok || !height.ok) {
      return { ok: false, reason: width.ok ? height.reason : width.reason };
    }

    return buildResult("rectangle", raw, {
      areaMm2: width.value * height.value,
      ybarMm: height.value / 2,
      depthMm: height.value,
      iMm4: (width.value * Math.pow(height.value, 3)) / 12,
      formula: "A = b h, ȳ = h / 2, I = b h^3 / 12",
      detailLines: [
        `b = ${width.value} mm`,
        `h = ${height.value} mm`
      ],
      drawData: {
        type: "rectangle",
        widthMm: width.value,
        heightMm: height.value
      }
    });
  }

  function circle(raw) {
    const diameter = parsePositiveDimension(raw.diameter);

    if (!diameter.ok) {
      return { ok: false, reason: diameter.reason };
    }

    return buildResult("circle", raw, {
      areaMm2: (Math.PI * Math.pow(diameter.value, 2)) / 4,
      ybarMm: diameter.value / 2,
      depthMm: diameter.value,
      iMm4: (Math.PI * Math.pow(diameter.value, 4)) / 64,
      formula: "A = π d^2 / 4, ȳ = d / 2, I = π d^4 / 64",
      detailLines: [
        `d = ${diameter.value} mm`
      ],
      drawData: {
        type: "circle",
        diameterMm: diameter.value
      }
    });
  }

  function hollowRectangle(raw) {
    const width = parsePositiveDimension(raw.width);
    const height = parsePositiveDimension(raw.height);
    const thickness = parsePositiveDimension(raw.thickness);

    if (!width.ok || !height.ok || !thickness.ok) {
      return {
        ok: false,
        reason: !width.ok ? width.reason : !height.ok ? height.reason : thickness.reason
      };
    }

    const innerWidth = width.value - 2 * thickness.value;
    const innerHeight = height.value - 2 * thickness.value;

    if (innerWidth <= 0 || innerHeight <= 0) {
      return { ok: false, reason: "hollowThickness" };
    }

    return buildResult("hollowRectangle", raw, {
      areaMm2: width.value * height.value - innerWidth * innerHeight,
      ybarMm: height.value / 2,
      depthMm: height.value,
      iMm4: ((width.value * Math.pow(height.value, 3)) - (innerWidth * Math.pow(innerHeight, 3))) / 12,
      formula: "A = b h - (b - 2t)(h - 2t), ȳ = h / 2, I = [b h^3 - (b - 2t)(h - 2t)^3] / 12",
      detailLines: [
        `b = ${width.value} mm`,
        `h = ${height.value} mm`,
        `t = ${thickness.value} mm`
      ],
      drawData: {
        type: "hollowRectangle",
        widthMm: width.value,
        heightMm: height.value,
        thicknessMm: thickness.value
      }
    });
  }

  function iBeam(raw) {
    const flangeWidth = parsePositiveDimension(raw.flangeWidth);
    const flangeThickness = parsePositiveDimension(raw.flangeThickness);
    const webHeight = parsePositiveDimension(raw.webHeight);
    const webThickness = parsePositiveDimension(raw.webThickness);

    if (!flangeWidth.ok || !flangeThickness.ok || !webHeight.ok || !webThickness.ok) {
      return {
        ok: false,
        reason: !flangeWidth.ok
          ? flangeWidth.reason
          : !flangeThickness.ok
            ? flangeThickness.reason
            : !webHeight.ok
              ? webHeight.reason
              : webThickness.reason
      };
    }

    if (webThickness.value > flangeWidth.value) {
      return { ok: false, reason: "webTooWide" };
    }

    const totalHeight = 2 * flangeThickness.value + webHeight.value;
    const flangeArea = flangeWidth.value * flangeThickness.value;
    const webArea = webThickness.value * webHeight.value;
    const flangeDistance = webHeight.value / 2 + flangeThickness.value / 2;
    const iMm4 =
      2 * ((flangeWidth.value * Math.pow(flangeThickness.value, 3)) / 12 + flangeArea * Math.pow(flangeDistance, 2)) +
      (webThickness.value * Math.pow(webHeight.value, 3)) / 12;

    return buildResult("iBeam", raw, {
      areaMm2: 2 * flangeArea + webArea,
      ybarMm: totalHeight / 2,
      depthMm: totalHeight,
      iMm4: iMm4,
      formula: "I = 2[(B tf^3)/12 + B tf (hw/2 + tf/2)^2] + tw hw^3 / 12",
      detailLines: [
        `B = ${flangeWidth.value} mm`,
        `tf = ${flangeThickness.value} mm`,
        `hw = ${webHeight.value} mm`,
        `tw = ${webThickness.value} mm`
      ],
      drawData: {
        type: "iBeam",
        flangeWidthMm: flangeWidth.value,
        flangeThicknessMm: flangeThickness.value,
        webHeightMm: webHeight.value,
        webThicknessMm: webThickness.value,
        totalHeightMm: totalHeight
      }
    });
  }

  function tBeam(raw) {
    const flangeWidth = parsePositiveDimension(raw.flangeWidth);
    const flangeThickness = parsePositiveDimension(raw.flangeThickness);
    const webHeight = parsePositiveDimension(raw.webHeight);
    const webThickness = parsePositiveDimension(raw.webThickness);

    if (!flangeWidth.ok || !flangeThickness.ok || !webHeight.ok || !webThickness.ok) {
      return {
        ok: false,
        reason: !flangeWidth.ok
          ? flangeWidth.reason
          : !flangeThickness.ok
            ? flangeThickness.reason
            : !webHeight.ok
              ? webHeight.reason
              : webThickness.reason
      };
    }

    if (webThickness.value > flangeWidth.value) {
      return { ok: false, reason: "webTooWide" };
    }

    const totalHeight = flangeThickness.value + webHeight.value;
    const flangeArea = flangeWidth.value * flangeThickness.value;
    const webArea = webThickness.value * webHeight.value;
    const yFlange = webHeight.value + flangeThickness.value / 2;
    const yWeb = webHeight.value / 2;
    const ybar = (flangeArea * yFlange + webArea * yWeb) / (flangeArea + webArea);
    const iFlange = (flangeWidth.value * Math.pow(flangeThickness.value, 3)) / 12;
    const iWeb = (webThickness.value * Math.pow(webHeight.value, 3)) / 12;
    const iMm4 =
      iFlange +
      flangeArea * Math.pow(yFlange - ybar, 2) +
      iWeb +
      webArea * Math.pow(yWeb - ybar, 2);

    return buildResult("tBeam", raw, {
      areaMm2: flangeArea + webArea,
      ybarMm: ybar,
      depthMm: totalHeight,
      iMm4: iMm4,
      formula: "I = If + Af(df)^2 + Iw + Aw(dw)^2",
      detailLines: [
        `B = ${flangeWidth.value} mm`,
        `tf = ${flangeThickness.value} mm`,
        `hw = ${webHeight.value} mm`,
        `tw = ${webThickness.value} mm`
      ],
      drawData: {
        type: "tBeam",
        flangeWidthMm: flangeWidth.value,
        flangeThicknessMm: flangeThickness.value,
        webHeightMm: webHeight.value,
        webThicknessMm: webThickness.value,
        totalHeightMm: totalHeight
      }
    });
  }

  function computeShapeProperties(shape, raw) {
    if (shape === "rectangle") {
      return rectangle(raw);
    }

    if (shape === "circle") {
      return circle(raw);
    }

    if (shape === "hollowRectangle") {
      return hollowRectangle(raw);
    }

    if (shape === "iBeam") {
      return iBeam(raw);
    }

    if (shape === "tBeam") {
      return tBeam(raw);
    }

    return { ok: false, reason: "shape" };
  }

  window.AhmedSolverSections = {
    mmToM: mmToM,
    mm2ToM2: mm2ToM2,
    mm3ToM3: mm3ToM3,
    mm4ToM4: mm4ToM4,
    computeShapeProperties: computeShapeProperties
  };
})();
