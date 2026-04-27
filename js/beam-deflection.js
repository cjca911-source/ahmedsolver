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
      kicker: "Serviceability and Section Tool",
      title: "Beam Deflection Calculator",
      intro:
        "Choose a beam case, define the section geometry, and let AhmedSolver calculate the moment of inertia automatically before solving deflection, reactions, slope, shear, and bending moment.",
      summaryTitle: "What this page now does",
      summaryPoints: [
        "Automatic section property calculation from geometry only, with no manual inertia input.",
        "Beam, deflection, SFD, and BMD diagrams that update from the solved case.",
        "Reactions, maximum moment, slope, and engineering warnings for presentation-ready study output."
      ],
      caseTitle: "Beam type",
      caseDescription: "Select one standard beam case. The active formulas and diagrams update automatically.",
      sectionTitle: "Section geometry",
      sectionDescription:
        "Enter all section dimensions in millimeters. AhmedSolver calculates I about the centroidal x-axis and converts it to m^4 for beam calculations.",
      beamInputTitle: "Beam inputs",
      beamInputDescription:
        "Enter beam length L in meters, point load P in newtons, uniformly distributed load w in N/m, and elastic modulus E in GPa.",
      sectionPreviewTitle: "Section property preview",
      resultsTitle: "Solved results",
      stepsTitle: "Step-by-step solution",
      warningsTitle: "Engineering notes",
      diagramsTitle: "Beam and diagram visuals",
      diagramsDescription:
        "These SVG diagrams are scaled for clear study presentation while keeping the solved deflection, shear, and bending values numerically correct.",
      buttons: {
        solve: "Solve Beam Deflection",
        reset: "Reset"
      },
      status: {
        ready: "Select a beam case and fill in the section geometry and beam data.",
        missing: "Please complete all required geometry and beam inputs.",
        invalid: "Invalid number format in one or more fields.",
        positive: "All dimensions and beam inputs must be greater than zero.",
        hollowRectangle: "Inner hollow rectangle dimensions must be smaller than the outer rectangle.",
        iBeamDepth: "For the I-beam, flange thickness must satisfy 2tf < H.",
        iBeamWidth: "For the I-beam, web thickness must be smaller than or equal to flange width.",
        tBeamDepth: "For the T-beam, flange thickness must be smaller than the overall height.",
        tBeamWidth: "For the T-beam, web thickness must be smaller than or equal to flange width.",
        success: "Beam deflection solved successfully."
      },
      fields: {
        length: "Beam length L (m)",
        modulus: "Elastic modulus E (GPa)",
        pointLoad: "Point load P (N)",
        lineLoad: "Uniform load w (N/m)",
        sectionShape: "Section shape",
        rectWidth: "Width b (mm)",
        rectHeight: "Height h (mm)",
        circleDiameter: "Diameter d (mm)",
        hollowOuterWidth: "Outer width B (mm)",
        hollowOuterHeight: "Outer height H (mm)",
        hollowInnerWidth: "Inner width b (mm)",
        hollowInnerHeight: "Inner height h (mm)",
        iBeamHeight: "Overall height H (mm)",
        iBeamWidth: "Flange width B (mm)",
        iBeamFlangeThickness: "Flange thickness tf (mm)",
        iBeamWebThickness: "Web thickness tw (mm)",
        tBeamHeight: "Overall height H (mm)",
        tBeamWidth: "Flange width B (mm)",
        tBeamFlangeThickness: "Flange thickness tf (mm)",
        tBeamWebThickness: "Web thickness tw (mm)"
      },
      hints: {
        length: "Use the clear span between supports or the full cantilever length.",
        modulus: "Typical structural steel is about 200 GPa.",
        pointLoad: "Use the point load in newtons for the selected point-load case.",
        lineLoad: "Use the uniform load intensity in newtons per meter.",
        geometry: "All section dimensions are entered in millimeters."
      },
      shapes: {
        rectangle: "Rectangle",
        circle: "Circle",
        hollowRectangle: "Hollow Rectangle",
        iBeam: "I-Beam",
        tBeam: "T-Beam"
      },
      formulas: {
        rectangle: "I = b h^3 / 12",
        circle: "I = pi d^4 / 64",
        hollowRectangle: "I = (B H^3 - b h^3) / 12",
        iBeam: "I = [B H^3 - (B - tw) (H - 2tf)^3] / 12",
        tBeam: "Composite section about the centroidal x-axis",
        simplySupportedPoint: "delta_max = P L^3 / (48 E I)",
        simplySupportedUdl: "delta_max = 5 w L^4 / (384 E I)",
        cantileverPoint: "delta_max = P L^3 / (3 E I)",
        cantileverUdl: "delta_max = w L^4 / (8 E I)"
      },
      caseLabels: {
        simplySupportedPoint: "Simply supported beam with center point load",
        simplySupportedUdl: "Simply supported beam with uniformly distributed load",
        cantileverPoint: "Cantilever beam with end point load",
        cantileverUdl: "Cantilever beam with uniformly distributed load"
      },
      metrics: {
        inertiaMm4: "Moment of inertia I (mm^4)",
        inertiaM4: "Moment of inertia I (m^4)",
        deflectionMm: "Maximum deflection delta_max (mm)",
        slope: "Support / free-end slope",
        reactions: "Reactions",
        maxMoment: "Maximum bending moment"
      },
      labels: {
        supportSlope: "Support slope",
        freeEndSlope: "Free-end slope",
        beam: "Beam Setup",
        deflection: "Deflection Curve",
        sfd: "Shear Force Diagram",
        bmd: "Bending Moment Diagram",
        sectionIncomplete: "Complete the active shape dimensions to preview I.",
        maxDeflection: "delta_max",
        maxMoment: "Mmax",
        sectionWarning: "Section warning",
        neutralAxis: "Neutral axis from bottom",
        fixedMoment: "Fixed-end moment",
        siConversion: "SI conversion"
      },
      reactions: {
        ra: "RA",
        rb: "RB",
        r: "R"
      },
      stepLabels: {
        geometry: "1. Calculate the section moment of inertia",
        conversion: "2. Convert section and material data to SI",
        reactions: "3. Calculate reactions and bending maximum",
        deflection: "4. Substitute into the beam deflection formula",
        slope: "5. Compute the support or free-end slope"
      },
      warnings: {
        tinyInertia: "Moment of inertia is extremely small. Check the section dimensions and shape selection.",
        hugeDeflection: "This deflection is very large relative to the span and may be unrealistic for normal serviceability.",
        serviceability: "The deflection ratio delta/L exceeds a common L/360 serviceability reference.",
        tinyDimensions: "One or more section dimensions are very small for a practical beam. Check the units and intended scale.",
        hugeDimensions: "One or more section dimensions are very large for a typical classroom beam example. Verify the geometry.",
        lowModulus: "Elastic modulus is outside the common range for most structural materials. Recheck E in GPa."
      },
      diagramNotes: {
        beam: "Support symbols, loads, reactions, and maximum deflection location are shown on the main beam sketch.",
        deflection: "The deflection curve is plotted from the exact case equation and scaled visually for readability.",
        sfd: "The SFD follows the standard sign convention used in textbooks for these simple beam cases.",
        bmd: "The BMD updates from the solved reactions and loading model."
      }
    },
    ar: {
      kicker: "أداة المقاطع والخدمة",
      title: "حاسبة انحراف الجوائز",
      intro:
        "اختر حالة الجائز، ثم أدخل أبعاد المقطع، ودع AhmedSolver يحسب عزم العطالة تلقائياً قبل حل الانحراف وردود الأفعال والميل ومخططات القص والعزم.",
      summaryTitle: "ما الذي تفعله الصفحة الآن",
      summaryPoints: [
        "حساب تلقائي لخواص المقطع من الأبعاد فقط من دون إدخال يدوي لعزم العطالة.",
        "رسومات للجائز والانحراف ومخطط القص ومخطط العزم تتحدث مباشرة من الحالة المحلولة.",
        "عرض لردود الأفعال والعزم الأعظمي والميل وتحذيرات هندسية مناسبة للدراسة والعرض."
      ],
      caseTitle: "نوع الجائز",
      caseDescription: "اختر حالة جائز قياسية واحدة. تتغير المعادلات والرسومات تلقائياً.",
      sectionTitle: "هندسة المقطع",
      sectionDescription:
        "أدخل جميع أبعاد المقطع بالميليمتر. يقوم AhmedSolver بحساب I حول المحور x المار بالمركز ثم يحوله إلى m^4 لاستخدامه في حل الجائز.",
      beamInputTitle: "بيانات الجائز",
      beamInputDescription:
        "أدخل طول الجائز L بالمتر، والحمل المركز P بالنيوتن، والحمل الموزع w بالنيوتن لكل متر، ومعامل المرونة E بالجيجا باسكال.",
      sectionPreviewTitle: "معاينة خواص المقطع",
      resultsTitle: "النتائج المحلولة",
      stepsTitle: "الحل خطوة بخطوة",
      warningsTitle: "ملاحظات هندسية",
      diagramsTitle: "رسومات الجائز والمخططات",
      diagramsDescription:
        "يتم ضبط رسومات SVG بصرياً لتكون واضحة في الدراسة والعرض مع الحفاظ على صحة قيم الانحراف والقص والعزم المحسوبة.",
      buttons: {
        solve: "احسب انحراف الجائز",
        reset: "إعادة ضبط"
      },
      status: {
        ready: "اختر حالة الجائز ثم املأ أبعاد المقطع وبيانات الجائز.",
        missing: "يرجى إكمال جميع مدخلات المقطع والجائز المطلوبة.",
        invalid: "تنسيق الرقم غير صالح في واحد أو أكثر من الحقول.",
        positive: "يجب أن تكون جميع الأبعاد والقيم المدخلة أكبر من الصفر.",
        hollowRectangle: "يجب أن تكون أبعاد المستطيل الداخلي المجوف أصغر من أبعاد المستطيل الخارجي.",
        iBeamDepth: "في مقطع I يجب أن يحقق سمك الجناح الشرط 2tf < H.",
        iBeamWidth: "في مقطع I يجب أن يكون سمك الروح أصغر من أو مساوياً لعرض الجناح.",
        tBeamDepth: "في مقطع T يجب أن يكون سمك الجناح أصغر من الارتفاع الكلي.",
        tBeamWidth: "في مقطع T يجب أن يكون سمك الروح أصغر من أو مساوياً لعرض الجناح.",
        success: "تم حل انحراف الجائز بنجاح."
      },
      fields: {
        length: "طول الجائز L (m)",
        modulus: "معامل المرونة E (GPa)",
        pointLoad: "الحمل المركز P (N)",
        lineLoad: "الحمل المنتظم w (N/m)",
        sectionShape: "شكل المقطع",
        rectWidth: "العرض b (mm)",
        rectHeight: "الارتفاع h (mm)",
        circleDiameter: "القطر d (mm)",
        hollowOuterWidth: "العرض الخارجي B (mm)",
        hollowOuterHeight: "الارتفاع الخارجي H (mm)",
        hollowInnerWidth: "العرض الداخلي b (mm)",
        hollowInnerHeight: "الارتفاع الداخلي h (mm)",
        iBeamHeight: "الارتفاع الكلي H (mm)",
        iBeamWidth: "عرض الجناح B (mm)",
        iBeamFlangeThickness: "سمك الجناح tf (mm)",
        iBeamWebThickness: "سمك الروح tw (mm)",
        tBeamHeight: "الارتفاع الكلي H (mm)",
        tBeamWidth: "عرض الجناح B (mm)",
        tBeamFlangeThickness: "سمك الجناح tf (mm)",
        tBeamWebThickness: "سمك الروح tw (mm)"
      },
      hints: {
        length: "استخدم البحر الصافي بين الركائز أو طول الكابولي الكامل.",
        modulus: "قيمة الفولاذ الإنشائي الشائعة تقارب 200 GPa.",
        pointLoad: "أدخل الحمل المركز بالنيوتن للحالة المختارة.",
        lineLoad: "أدخل شدة الحمل المنتظم بالنيوتن لكل متر.",
        geometry: "جميع أبعاد المقطع تدخل بالميليمتر."
      },
      shapes: {
        rectangle: "مستطيل",
        circle: "دائرة",
        hollowRectangle: "مستطيل مجوف",
        iBeam: "مقطع I",
        tBeam: "مقطع T"
      },
      formulas: {
        rectangle: "I = b h^3 / 12",
        circle: "I = pi d^4 / 64",
        hollowRectangle: "I = (B H^3 - b h^3) / 12",
        iBeam: "I = [B H^3 - (B - tw) (H - 2tf)^3] / 12",
        tBeam: "مقطع مركب حول المحور x المار بالمركز",
        simplySupportedPoint: "delta_max = P L^3 / (48 E I)",
        simplySupportedUdl: "delta_max = 5 w L^4 / (384 E I)",
        cantileverPoint: "delta_max = P L^3 / (3 E I)",
        cantileverUdl: "delta_max = w L^4 / (8 E I)"
      },
      caseLabels: {
        simplySupportedPoint: "جائز بسيط مع حمل مركز في المنتصف",
        simplySupportedUdl: "جائز بسيط مع حمل موزع منتظم",
        cantileverPoint: "جائز كابولي مع حمل مركز عند الطرف",
        cantileverUdl: "جائز كابولي مع حمل موزع منتظم"
      },
      metrics: {
        inertiaMm4: "عزم العطالة I (mm^4)",
        inertiaM4: "عزم العطالة I (m^4)",
        deflectionMm: "الانحراف الأعظمي delta_max (mm)",
        slope: "الميل عند الركيزة أو الطرف الحر",
        reactions: "ردود الأفعال",
        maxMoment: "العزم الأعظمي"
      },
      labels: {
        supportSlope: "ميل الركيزة",
        freeEndSlope: "ميل الطرف الحر",
        beam: "رسم الجائز",
        deflection: "منحنى الانحراف",
        sfd: "مخطط قوى القص",
        bmd: "مخطط عزوم الانحناء",
        sectionIncomplete: "أكمل أبعاد الشكل النشط لمعاينة عزم العطالة.",
        maxDeflection: "delta_max",
        maxMoment: "Mmax",
        sectionWarning: "تحذير مقطع",
        neutralAxis: "المحور المتعادل من الأسفل",
        fixedMoment: "العزم عند التثبيت",
        siConversion: "التحويل إلى وحدات SI"
      },
      reactions: {
        ra: "RA",
        rb: "RB",
        r: "R"
      },
      stepLabels: {
        geometry: "1. حساب عزم عطالة المقطع",
        conversion: "2. تحويل الخواص إلى وحدات SI",
        reactions: "3. حساب ردود الأفعال والعزم الأعظمي",
        deflection: "4. التعويض في معادلة الانحراف",
        slope: "5. حساب الميل عند الركيزة أو الطرف الحر"
      },
      warnings: {
        tinyInertia: "عزم العطالة صغير جداً. تحقق من أبعاد المقطع واختيار الشكل.",
        hugeDeflection: "الانحراف كبير جداً مقارنة بطول الجائز وقد يكون غير واقعي إنشائياً.",
        serviceability: "نسبة الانحراف delta/L تتجاوز مرجع الخدمة الشائع L/360.",
        tinyDimensions: "يوجد بعد أو أكثر صغير جداً بالنسبة إلى جائز عملي. تحقق من الوحدات والمقياس المقصود.",
        hugeDimensions: "يوجد بعد أو أكثر كبير جداً بالنسبة إلى مثال تدريسي معتاد. تحقق من صحة الأبعاد.",
        lowModulus: "معامل المرونة خارج الحدود الشائعة لمعظم المواد الإنشائية. تحقق من E بوحدة GPa."
      },
      diagramNotes: {
        beam: "يظهر الرسم الرئيسي نوع الارتكاز والأحمال وردود الأفعال وموقع الانحراف الأعظمي.",
        deflection: "يتم رسم منحنى الانحراف من المعادلة الدقيقة للحالة مع تكبير بصري مناسب للعرض.",
        sfd: "يعرض مخطط القص وفق إشارة الكتب الدراسية لهذه الحالات البسيطة.",
        bmd: "يتحدث مخطط العزم مباشرة من ردود الأفعال ونموذج التحميل المحلول."
      }
    }
  };

  const sectionShapes = {
    rectangle: {
      fieldNames: ["rectWidth", "rectHeight"]
    },
    circle: {
      fieldNames: ["circleDiameter"]
    },
    hollowRectangle: {
      fieldNames: ["hollowOuterWidth", "hollowOuterHeight", "hollowInnerWidth", "hollowInnerHeight"]
    },
    iBeam: {
      fieldNames: ["iBeamHeight", "iBeamWidth", "iBeamFlangeThickness", "iBeamWebThickness"]
    },
    tBeam: {
      fieldNames: ["tBeamHeight", "tBeamWidth", "tBeamFlangeThickness", "tBeamWebThickness"]
    }
  };

  const beamCases = {
    simplySupportedPoint: {
      loadType: "point",
      deflection: function (input) {
        return (input.loadN * Math.pow(input.lengthM, 3)) / (48 * input.modulusPa * input.section.iM4);
      },
      slope: function (input) {
        return (input.loadN * Math.pow(input.lengthM, 2)) / (16 * input.modulusPa * input.section.iM4);
      },
      reactions: function (input, texts) {
        return [
          { label: texts.reactions.ra, value: input.loadN / 2, unit: "N" },
          { label: texts.reactions.rb, value: input.loadN / 2, unit: "N" }
        ];
      },
      maxMoment: function (input) {
        return (input.loadN * input.lengthM) / 4;
      },
      slopeLabelKey: "supportSlope",
      maxDeflectionX: function (input) {
        return input.lengthM / 2;
      },
      shearPoints: function (input) {
        return [
          { x: 0, y: input.loadN / 2 },
          { x: input.lengthM / 2, y: input.loadN / 2 },
          { x: input.lengthM / 2, y: -input.loadN / 2 },
          { x: input.lengthM, y: -input.loadN / 2 }
        ];
      },
      momentPoints: function (input) {
        return [
          { x: 0, y: 0 },
          { x: input.lengthM / 2, y: (input.loadN * input.lengthM) / 4 },
          { x: input.lengthM, y: 0 }
        ];
      },
      deflectionCurve: function (input, samples) {
        const points = [];

        for (let index = 0; index <= samples; index += 1) {
          const x = (input.lengthM * index) / samples;
          let y;

          if (x <= input.lengthM / 2) {
            y = (input.loadN * x * (3 * Math.pow(input.lengthM, 2) - 4 * Math.pow(x, 2))) / (48 * input.modulusPa * input.section.iM4);
          } else {
            const xr = input.lengthM - x;
            y = (input.loadN * xr * (3 * Math.pow(input.lengthM, 2) - 4 * Math.pow(xr, 2))) / (48 * input.modulusPa * input.section.iM4);
          }

          points.push({ x: x, y: y });
        }

        return points;
      }
    },
    simplySupportedUdl: {
      loadType: "distributed",
      deflection: function (input) {
        return (5 * input.loadPerMeter * Math.pow(input.lengthM, 4)) / (384 * input.modulusPa * input.section.iM4);
      },
      slope: function (input) {
        return (input.loadPerMeter * Math.pow(input.lengthM, 3)) / (24 * input.modulusPa * input.section.iM4);
      },
      reactions: function (input, texts) {
        return [
          { label: texts.reactions.ra, value: (input.loadPerMeter * input.lengthM) / 2, unit: "N" },
          { label: texts.reactions.rb, value: (input.loadPerMeter * input.lengthM) / 2, unit: "N" }
        ];
      },
      maxMoment: function (input) {
        return (input.loadPerMeter * Math.pow(input.lengthM, 2)) / 8;
      },
      slopeLabelKey: "supportSlope",
      maxDeflectionX: function (input) {
        return input.lengthM / 2;
      },
      shearPoints: function (input) {
        return sampleLine(input.lengthM, 48, function (x) {
          return (input.loadPerMeter * input.lengthM) / 2 - input.loadPerMeter * x;
        });
      },
      momentPoints: function (input) {
        return sampleLine(input.lengthM, 48, function (x) {
          const reaction = (input.loadPerMeter * input.lengthM) / 2;
          return reaction * x - (input.loadPerMeter * Math.pow(x, 2)) / 2;
        });
      },
      deflectionCurve: function (input, samples) {
        return sampleLine(input.lengthM, samples, function (x) {
          return (input.loadPerMeter * x * (Math.pow(input.lengthM, 3) - 2 * input.lengthM * Math.pow(x, 2) + Math.pow(x, 3))) / (24 * input.modulusPa * input.section.iM4);
        });
      }
    },
    cantileverPoint: {
      loadType: "point",
      deflection: function (input) {
        return (input.loadN * Math.pow(input.lengthM, 3)) / (3 * input.modulusPa * input.section.iM4);
      },
      slope: function (input) {
        return (input.loadN * Math.pow(input.lengthM, 2)) / (2 * input.modulusPa * input.section.iM4);
      },
      reactions: function (input, texts) {
        return [
          { label: texts.reactions.r, value: input.loadN, unit: "N" }
        ];
      },
      fixedMoment: function (input) {
        return input.loadN * input.lengthM;
      },
      maxMoment: function (input) {
        return input.loadN * input.lengthM;
      },
      slopeLabelKey: "freeEndSlope",
      maxDeflectionX: function (input) {
        return input.lengthM;
      },
      shearPoints: function (input) {
        return [
          { x: 0, y: -input.loadN },
          { x: input.lengthM, y: -input.loadN }
        ];
      },
      momentPoints: function (input) {
        return sampleLine(input.lengthM, 48, function (x) {
          return -input.loadN * (input.lengthM - x);
        });
      },
      deflectionCurve: function (input, samples) {
        return sampleLine(input.lengthM, samples, function (x) {
          return (input.loadN * Math.pow(x, 2) * (3 * input.lengthM - x)) / (6 * input.modulusPa * input.section.iM4);
        });
      }
    },
    cantileverUdl: {
      loadType: "distributed",
      deflection: function (input) {
        return (input.loadPerMeter * Math.pow(input.lengthM, 4)) / (8 * input.modulusPa * input.section.iM4);
      },
      slope: function (input) {
        return (input.loadPerMeter * Math.pow(input.lengthM, 3)) / (6 * input.modulusPa * input.section.iM4);
      },
      reactions: function (input, texts) {
        return [
          { label: texts.reactions.r, value: input.loadPerMeter * input.lengthM, unit: "N" }
        ];
      },
      fixedMoment: function (input) {
        return (input.loadPerMeter * Math.pow(input.lengthM, 2)) / 2;
      },
      maxMoment: function (input) {
        return (input.loadPerMeter * Math.pow(input.lengthM, 2)) / 2;
      },
      slopeLabelKey: "freeEndSlope",
      maxDeflectionX: function (input) {
        return input.lengthM;
      },
      shearPoints: function (input) {
        return sampleLine(input.lengthM, 48, function (x) {
          return -input.loadPerMeter * (input.lengthM - x);
        });
      },
      momentPoints: function (input) {
        return sampleLine(input.lengthM, 48, function (x) {
          return -(input.loadPerMeter * Math.pow(input.lengthM - x, 2)) / 2;
        });
      },
      deflectionCurve: function (input, samples) {
        return sampleLine(input.lengthM, samples, function (x) {
          return (input.loadPerMeter * Math.pow(x, 2) * (6 * Math.pow(input.lengthM, 2) - 4 * input.lengthM * x + Math.pow(x, 2))) / (24 * input.modulusPa * input.section.iM4);
        });
      }
    }
  };

  const state = {
    beamCase: "simplySupportedPoint",
    sectionShape: "rectangle",
    length: "",
    modulus: "",
    load: "",
    rectWidth: "",
    rectHeight: "",
    circleDiameter: "",
    hollowOuterWidth: "",
    hollowOuterHeight: "",
    hollowInnerWidth: "",
    hollowInnerHeight: "",
    iBeamHeight: "",
    iBeamWidth: "",
    iBeamFlangeThickness: "",
    iBeamWebThickness: "",
    tBeamHeight: "",
    tBeamWidth: "",
    tBeamFlangeThickness: "",
    tBeamWebThickness: "",
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
    return utils.formatNumber(value, app.getLanguage(), typeof decimals === "number" ? decimals : 4);
  }

  function parsePositiveNumber(fieldName, texts) {
    const parsed = utils.parseNumber(state[fieldName]);

    if (parsed.empty) {
      return {
        ok: false,
        reason: "missing",
        field: fieldName,
        label: texts.fields[fieldName]
      };
    }

    if (!parsed.ok) {
      return {
        ok: false,
        reason: "invalid",
        field: fieldName,
        label: texts.fields[fieldName]
      };
    }

    if (parsed.value <= 0) {
      return {
        ok: false,
        reason: "positive",
        field: fieldName,
        label: texts.fields[fieldName]
      };
    }

    return {
      ok: true,
      value: parsed.value
    };
  }

  function sampleLine(lengthM, count, fn) {
    const points = [];

    for (let index = 0; index <= count; index += 1) {
      const x = (lengthM * index) / count;
      points.push({
        x: x,
        y: fn(x)
      });
    }

    return points;
  }

  function getShapeFields() {
    return sectionShapes[state.sectionShape].fieldNames;
  }

  function shapeFormulaTexts(texts) {
    return texts.formulas[state.sectionShape];
  }

  function getSectionPreview() {
    const texts = currentCopy();
    const warnings = [];

    function genericWarnings(values) {
      const numbers = values.filter(function (value) {
        return Number.isFinite(value);
      });

      if (numbers.some(function (value) { return value < 5; })) {
        warnings.push(texts.warnings.tinyDimensions);
      }

      if (numbers.some(function (value) { return value > 5000; })) {
        warnings.push(texts.warnings.hugeDimensions);
      }
    }

    if (state.sectionShape === "rectangle") {
      const width = parsePositiveNumber("rectWidth", texts);
      const height = parsePositiveNumber("rectHeight", texts);

      if (!width.ok || !height.ok) {
        return {
          ok: false,
          formula: texts.formulas.rectangle
        };
      }

      const iMm4 = (width.value * Math.pow(height.value, 3)) / 12;
      genericWarnings([width.value, height.value]);

      return {
        ok: true,
        formula: texts.formulas.rectangle,
        detailLines: [
          `b = ${format(width.value, 4)} mm`,
          `h = ${format(height.value, 4)} mm`
        ],
        iMm4: iMm4,
        iM4: iMm4 * 1e-12,
        warnings: warnings
      };
    }

    if (state.sectionShape === "circle") {
      const diameter = parsePositiveNumber("circleDiameter", texts);

      if (!diameter.ok) {
        return {
          ok: false,
          formula: texts.formulas.circle
        };
      }

      const iMm4 = (Math.PI * Math.pow(diameter.value, 4)) / 64;
      genericWarnings([diameter.value]);

      return {
        ok: true,
        formula: texts.formulas.circle,
        detailLines: [
          `d = ${format(diameter.value, 4)} mm`
        ],
        iMm4: iMm4,
        iM4: iMm4 * 1e-12,
        warnings: warnings
      };
    }

    if (state.sectionShape === "hollowRectangle") {
      const outerWidth = parsePositiveNumber("hollowOuterWidth", texts);
      const outerHeight = parsePositiveNumber("hollowOuterHeight", texts);
      const innerWidth = parsePositiveNumber("hollowInnerWidth", texts);
      const innerHeight = parsePositiveNumber("hollowInnerHeight", texts);

      if (!outerWidth.ok || !outerHeight.ok || !innerWidth.ok || !innerHeight.ok) {
        return {
          ok: false,
          formula: texts.formulas.hollowRectangle
        };
      }

      if (innerWidth.value >= outerWidth.value || innerHeight.value >= outerHeight.value) {
        return {
          ok: false,
          formula: texts.formulas.hollowRectangle,
          error: texts.status.hollowRectangle
        };
      }

      const iMm4 = ((outerWidth.value * Math.pow(outerHeight.value, 3)) - (innerWidth.value * Math.pow(innerHeight.value, 3))) / 12;
      genericWarnings([outerWidth.value, outerHeight.value, innerWidth.value, innerHeight.value]);

      return {
        ok: true,
        formula: texts.formulas.hollowRectangle,
        detailLines: [
          `B = ${format(outerWidth.value, 4)} mm`,
          `H = ${format(outerHeight.value, 4)} mm`,
          `b = ${format(innerWidth.value, 4)} mm`,
          `h = ${format(innerHeight.value, 4)} mm`
        ],
        iMm4: iMm4,
        iM4: iMm4 * 1e-12,
        warnings: warnings
      };
    }

    if (state.sectionShape === "iBeam") {
      const height = parsePositiveNumber("iBeamHeight", texts);
      const width = parsePositiveNumber("iBeamWidth", texts);
      const flangeThickness = parsePositiveNumber("iBeamFlangeThickness", texts);
      const webThickness = parsePositiveNumber("iBeamWebThickness", texts);

      if (!height.ok || !width.ok || !flangeThickness.ok || !webThickness.ok) {
        return {
          ok: false,
          formula: texts.formulas.iBeam
        };
      }

      if (2 * flangeThickness.value >= height.value) {
        return {
          ok: false,
          formula: texts.formulas.iBeam,
          error: texts.status.iBeamDepth
        };
      }

      if (webThickness.value > width.value) {
        return {
          ok: false,
          formula: texts.formulas.iBeam,
          error: texts.status.iBeamWidth
        };
      }

      const iMm4 = ((width.value * Math.pow(height.value, 3)) - ((width.value - webThickness.value) * Math.pow(height.value - 2 * flangeThickness.value, 3))) / 12;
      genericWarnings([height.value, width.value, flangeThickness.value, webThickness.value]);

      return {
        ok: true,
        formula: texts.formulas.iBeam,
        detailLines: [
          `H = ${format(height.value, 4)} mm`,
          `B = ${format(width.value, 4)} mm`,
          `tf = ${format(flangeThickness.value, 4)} mm`,
          `tw = ${format(webThickness.value, 4)} mm`
        ],
        iMm4: iMm4,
        iM4: iMm4 * 1e-12,
        warnings: warnings
      };
    }

    const height = parsePositiveNumber("tBeamHeight", texts);
    const width = parsePositiveNumber("tBeamWidth", texts);
    const flangeThickness = parsePositiveNumber("tBeamFlangeThickness", texts);
    const webThickness = parsePositiveNumber("tBeamWebThickness", texts);

    if (!height.ok || !width.ok || !flangeThickness.ok || !webThickness.ok) {
      return {
        ok: false,
        formula: texts.formulas.tBeam
      };
    }

    if (flangeThickness.value >= height.value) {
      return {
        ok: false,
        formula: texts.formulas.tBeam,
        error: texts.status.tBeamDepth
      };
    }

    if (webThickness.value > width.value) {
      return {
        ok: false,
        formula: texts.formulas.tBeam,
        error: texts.status.tBeamWidth
      };
    }

    const flangeArea = width.value * flangeThickness.value;
    const webArea = webThickness.value * (height.value - flangeThickness.value);
    const yf = height.value - flangeThickness.value / 2;
    const yw = (height.value - flangeThickness.value) / 2;
    const ybar = (flangeArea * yf + webArea * yw) / (flangeArea + webArea);
    const iFlangeCentroid = (width.value * Math.pow(flangeThickness.value, 3)) / 12;
    const iWebCentroid = (webThickness.value * Math.pow(height.value - flangeThickness.value, 3)) / 12;
    const iMm4 = iFlangeCentroid + flangeArea * Math.pow(yf - ybar, 2) + iWebCentroid + webArea * Math.pow(yw - ybar, 2);
    genericWarnings([height.value, width.value, flangeThickness.value, webThickness.value]);

    return {
      ok: true,
      formula: texts.formulas.tBeam,
      detailLines: [
        `H = ${format(height.value, 4)} mm`,
        `B = ${format(width.value, 4)} mm`,
        `tf = ${format(flangeThickness.value, 4)} mm`,
        `tw = ${format(webThickness.value, 4)} mm`,
        `${texts.labels.neutralAxis} = ${format(ybar, 4)} mm`
      ],
      iMm4: iMm4,
      iM4: iMm4 * 1e-12,
      ybarMm: ybar,
      warnings: warnings
    };
  }

  function getBeamInputPreview() {
    const texts = currentCopy();
    const length = parsePositiveNumber("length", texts);
    const modulus = parsePositiveNumber("modulus", texts);
    const loadField = beamCases[state.beamCase].loadType === "point" ? "pointLoad" : "lineLoad";
    const load = parsePositiveNumber("load", Object.assign({}, texts, { fields: Object.assign({}, texts.fields, { load: texts.fields[loadField] }) }));

    if (!length.ok || !modulus.ok || !load.ok) {
      return null;
    }

    return {
      lengthM: length.value,
      modulusGPa: modulus.value,
      modulusPa: modulus.value * 1e9,
      loadInput: load.value,
      loadField: loadField
    };
  }

  function buildSolvedResult(section, beamInput) {
    const texts = currentCopy();
    const beamCase = beamCases[state.beamCase];
    const input = {
      lengthM: beamInput.lengthM,
      modulusGPa: beamInput.modulusGPa,
      modulusPa: beamInput.modulusPa,
      section: section
    };

    if (beamCase.loadType === "point") {
      input.loadN = beamInput.loadInput;
    } else {
      input.loadPerMeter = beamInput.loadInput;
    }

    const reactions = beamCase.reactions(input, texts);
    const maxMomentNm = beamCase.maxMoment(input);
    const slopeRad = beamCase.slope(input);
    const deltaM = beamCase.deflection(input);
    const deltaMm = deltaM * 1000;
    const slopeDeg = slopeRad * (180 / Math.PI);
    const deflectionRatio = deltaM / input.lengthM;
    const warnings = section.warnings.slice();

    if (section.iM4 < 1e-10) {
      warnings.push(texts.warnings.tinyInertia);
    }

    if (deltaM > input.lengthM / 180) {
      warnings.push(texts.warnings.hugeDeflection);
    } else if (deltaM > input.lengthM / 360) {
      warnings.push(texts.warnings.serviceability);
    }

    if (input.modulusGPa < 1 || input.modulusGPa > 400) {
      warnings.push(texts.warnings.lowModulus);
    }

    return {
      caseKey: state.beamCase,
      caseConfig: beamCase,
      section: section,
      input: input,
      reactions: reactions,
      maxMomentNm: maxMomentNm,
      deltaM: deltaM,
      deltaMm: deltaMm,
      slopeRad: slopeRad,
      slopeDeg: slopeDeg,
      deflectionRatio: deflectionRatio,
      maxDeflectionX: beamCase.maxDeflectionX(input),
      fixedMomentNm: typeof beamCase.fixedMoment === "function" ? beamCase.fixedMoment(input) : null,
      warnings: uniqueList(warnings)
    };
  }

  function uniqueList(items) {
    return items.filter(function (item, index) {
      return items.indexOf(item) === index;
    });
  }

  function solve() {
    const texts = currentCopy();
    const section = getSectionPreview();
    const beamInput = getBeamInputPreview();

    if (section.error) {
      state.result = null;
      state.status = { state: "error", message: section.error };
      return;
    }

    if (!section.ok || !beamInput) {
      const firstInvalid = findFirstInvalidInput(texts);

      state.result = null;
      state.status = {
        state: "error",
        message: firstInvalid || texts.status.missing
      };
      return;
    }

    state.result = buildSolvedResult(section, beamInput);
    state.status = { state: "success", message: texts.status.success };
  }

  function findFirstInvalidInput(texts) {
    const shapeFields = getShapeFields().concat(["length", "modulus", "load"]);

    for (let index = 0; index < shapeFields.length; index += 1) {
      const fieldName = shapeFields[index];
      const parsed = utils.parseNumber(state[fieldName]);

      if (parsed.empty) {
        return texts.status.missing;
      }

      if (!parsed.ok) {
        return texts.status.invalid;
      }

      if (parsed.value <= 0) {
        return texts.status.positive;
      }
    }

    const sectionPreview = getSectionPreview();

    if (sectionPreview.error) {
      return sectionPreview.error;
    }

    return null;
  }

  function reset() {
    state.beamCase = "simplySupportedPoint";
    state.sectionShape = "rectangle";
    state.length = "";
    state.modulus = "";
    state.load = "";
    state.rectWidth = "";
    state.rectHeight = "";
    state.circleDiameter = "";
    state.hollowOuterWidth = "";
    state.hollowOuterHeight = "";
    state.hollowInnerWidth = "";
    state.hollowInnerHeight = "";
    state.iBeamHeight = "";
    state.iBeamWidth = "";
    state.iBeamFlangeThickness = "";
    state.iBeamWebThickness = "";
    state.tBeamHeight = "";
    state.tBeamWidth = "";
    state.tBeamFlangeThickness = "";
    state.tBeamWebThickness = "";
    state.result = null;
    state.status = {
      state: "neutral",
      message: currentCopy().status.ready
    };
  }

  function createFieldCard(fieldName, texts) {
    return `
      <label class="input-card" for="${fieldName}">
        <span class="input-card__badge">${esc(fieldNameBadge(fieldName))}</span>
        <span class="input-card__title">${esc(texts.fields[fieldName])}</span>
        <span class="input-card__hint">${esc(fieldHint(fieldName, texts))}</span>
        <input
          id="${fieldName}"
          name="${fieldName}"
          class="input-control"
          type="text"
          inputmode="decimal"
          value="${esc(state[fieldName])}"
        >
      </label>
    `;
  }

  function fieldNameBadge(fieldName) {
    const badges = {
      length: "L",
      modulus: "E",
      load: beamCases[state.beamCase].loadType === "point" ? "P" : "w",
      rectWidth: "b",
      rectHeight: "h",
      circleDiameter: "d",
      hollowOuterWidth: "B",
      hollowOuterHeight: "H",
      hollowInnerWidth: "b",
      hollowInnerHeight: "h",
      iBeamHeight: "H",
      iBeamWidth: "B",
      iBeamFlangeThickness: "tf",
      iBeamWebThickness: "tw",
      tBeamHeight: "H",
      tBeamWidth: "B",
      tBeamFlangeThickness: "tf",
      tBeamWebThickness: "tw"
    };

    return badges[fieldName] || fieldName;
  }

  function fieldHint(fieldName, texts) {
    if (fieldName === "length") {
      return texts.hints.length;
    }

    if (fieldName === "modulus") {
      return texts.hints.modulus;
    }

    if (fieldName === "load") {
      return beamCases[state.beamCase].loadType === "point" ? texts.hints.pointLoad : texts.hints.lineLoad;
    }

    return texts.hints.geometry;
  }

  function buildSectionPreview(texts) {
    const preview = getSectionPreview();

    if (!preview.ok) {
      return `
        <article class="preview-card">
          <h3>${esc(texts.sectionPreviewTitle)}</h3>
          <p>${esc(shapeFormulaTexts(texts))}</p>
          <p>${esc(preview.error || texts.labels.sectionIncomplete)}</p>
        </article>
      `;
    }

    return `
      <article class="preview-card">
        <h3>${esc(texts.sectionPreviewTitle)}</h3>
        <p>${esc(preview.formula)}</p>
        <ul class="summary-list">
          ${preview.detailLines.map(function (line) {
            return `<li>${esc(line)}</li>`;
          }).join("")}
        </ul>
        <p><strong>${esc(texts.metrics.inertiaMm4)}:</strong> ${esc(`${format(preview.iMm4, 4)} mm^4`)}</p>
        <p><strong>${esc(texts.metrics.inertiaM4)}:</strong> ${esc(`${preview.iM4.toExponential(4)} m^4`)}</p>
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

    const slopeLabel = texts.labels[state.result.caseConfig.slopeLabelKey];
    const reactionSummary = state.result.reactions.map(function (item) {
      return `${item.label} = ${format(item.value, 3)} ${item.unit}`;
    }).join(" | ");
    const maxMomentText = `${format(state.result.maxMomentNm, 4)} N·m`;

    return [
      metricCard(texts.metrics.inertiaMm4, `${format(state.result.section.iMm4, 4)} mm^4`),
      metricCard(texts.metrics.inertiaM4, `${state.result.section.iM4.toExponential(4)} m^4`),
      metricCard(texts.metrics.deflectionMm, `${format(state.result.deltaMm, 6)} mm`),
      metricCard(texts.metrics.slope, `${slopeLabel}: ${format(state.result.slopeRad, 6)} rad (${format(state.result.slopeDeg, 4)} deg)`),
      metricCard(texts.metrics.reactions, reactionSummary),
      metricCard(
        texts.metrics.maxMoment,
        state.result.fixedMomentNm == null
          ? `${texts.labels.maxMoment}: ${maxMomentText}`
          : `${texts.labels.fixedMoment}: ${format(state.result.fixedMomentNm, 4)} N·m | ${texts.labels.maxMoment}: ${maxMomentText}`
      )
    ].join("");
  }

  function metricCard(title, value) {
    return `
      <article class="metric-card">
        <h3>${esc(title)}</h3>
        <span class="metric-value">${esc(value)}</span>
      </article>
    `;
  }

  function buildWarnings(texts) {
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
          <p>${esc(app.getLanguage() === "ar"
            ? "لا توجد تحذيرات هندسية رئيسية لهذه القيم. استمر في تفسير الحالة إنشائياً بصورة طبيعية."
            : "No major engineering warnings were triggered for this case. Continue with normal interpretation.")}</p>
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

  function buildSteps(texts) {
    if (!state.result) {
      return `
        <article class="placeholder-card">
          <p>${esc(texts.status.ready)}</p>
        </article>
      `;
    }

    const beamFormula = texts.formulas[state.result.caseKey];
    const sectionFormula = texts.formulas[state.sectionShape];
    const loadSymbol = state.result.caseConfig.loadType === "point" ? "P" : "w";
    const loadText = state.result.caseConfig.loadType === "point"
      ? `${loadSymbol} = ${format(state.result.input.loadN, 4)} N`
      : `${loadSymbol} = ${format(state.result.input.loadPerMeter, 4)} N/m`;
    const reactionText = state.result.reactions.map(function (item) {
      return `${item.label} = ${format(item.value, 4)} ${item.unit}`;
    }).join(", ");
    const reactionStepText = state.result.fixedMomentNm == null
      ? reactionText
      : `${reactionText}\n${texts.labels.fixedMoment} = ${format(state.result.fixedMomentNm, 4)} N·m`;

    const steps = [
      {
        title: texts.stepLabels.geometry,
        equation:
          `${sectionFormula}\n` +
          `${state.result.section.detailLines.join("\n")}\n` +
          `I = ${format(state.result.section.iMm4, 4)} mm^4`
      },
      {
        title: texts.stepLabels.conversion,
        equation:
          `${texts.labels.siConversion}\n` +
          `I = ${state.result.section.iMm4.toExponential(4)} mm^4 = ${state.result.section.iM4.toExponential(4)} m^4\n` +
          `E = ${format(state.result.input.modulusGPa, 4)} GPa = ${state.result.input.modulusPa.toExponential(4)} Pa`
      },
      {
        title: texts.stepLabels.reactions,
        equation:
          `${reactionStepText}\n` +
          `${texts.labels.maxMoment} = ${format(state.result.maxMomentNm, 4)} N·m`
      },
      {
        title: texts.stepLabels.deflection,
        equation:
          `${beamFormula}\n` +
          `L = ${format(state.result.input.lengthM, 4)} m\n` +
          `${loadText}\n` +
          `delta_max = ${state.result.deltaM.toExponential(4)} m = ${format(state.result.deltaMm, 6)} mm`
      },
      {
        title: texts.stepLabels.slope,
        equation:
          `${texts.labels[state.result.caseConfig.slopeLabelKey]} = ${format(state.result.slopeRad, 6)} rad\n` +
          `= ${format(state.result.slopeDeg, 4)} deg`
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

  function buildDiagramCards(texts) {
    return `
      <div class="diagram-grid">
        ${diagramCard(texts.labels.beam, texts.diagramNotes.beam, state.result ? buildBeamDiagram(texts) : null)}
        ${diagramCard(texts.labels.deflection, texts.diagramNotes.deflection, state.result ? buildDeflectionDiagram(texts) : null)}
        ${diagramCard(texts.labels.sfd, texts.diagramNotes.sfd, state.result ? buildSfdDiagram(texts) : null)}
        ${diagramCard(texts.labels.bmd, texts.diagramNotes.bmd, state.result ? buildBmdDiagram(texts) : null)}
      </div>
    `;
  }

  function diagramCard(title, note, svg) {
    return `
      <article class="result-panel glass-card diagram-card">
        <div class="panel-header">
          <h3>${esc(title)}</h3>
          <p>${esc(note)}</p>
        </div>
        <div class="drawing-shell drawing-shell--diagram">
          ${svg || `<div class="placeholder-card"><p>${esc(currentCopy().status.ready)}</p></div>`}
        </div>
      </article>
    `;
  }

  function buildBeamDiagram(texts) {
    const result = state.result;
    const width = 760;
    const height = 260;
    const left = 90;
    const right = 680;
    const beamY = 110;
    const centerX = (left + right) / 2;
    const maxDeflectionX = left + ((right - left) * result.maxDeflectionX) / result.input.lengthM;
    let supports = "";
    let loads = "";
    let reactions = "";
    let fixedMoment = "";

    function downArrow(x, topY, bottomY, label) {
      return `
        <line x1="${x}" y1="${topY}" x2="${x}" y2="${bottomY}" stroke="#ff6d6d" stroke-width="4" marker-end="url(#beam-arrow-down)"></line>
        <text x="${x + 10}" y="${topY + 8}" fill="#f5f5f5" font-size="15">${esc(label)}</text>
      `;
    }

    function upArrow(x, bottomY, topY, label) {
      return `
        <line x1="${x}" y1="${bottomY}" x2="${x}" y2="${topY}" stroke="#8cffc1" stroke-width="4" marker-end="url(#beam-arrow-up)"></line>
        <text x="${x + 10}" y="${topY - 8}" fill="#f5f5f5" font-size="15">${esc(label)}</text>
      `;
    }

    function udl(label) {
      const arrows = [];

      for (let index = 0; index < 8; index += 1) {
        const x = left + ((right - left) * index) / 7;
        arrows.push(`<line x1="${x}" y1="36" x2="${x}" y2="${beamY - 10}" stroke="#ff6d6d" stroke-width="2.4" marker-end="url(#beam-arrow-down)"></line>`);
      }

      arrows.push(`<text x="${centerX - 8}" y="30" fill="#f5f5f5" font-size="15">${esc(label)}</text>`);
      return arrows.join("");
    }

    if (result.caseKey === "simplySupportedPoint" || result.caseKey === "simplySupportedUdl") {
      supports = `
        <polygon points="${left},${beamY + 10} ${left - 18},${beamY + 40} ${left + 18},${beamY + 40}" fill="rgba(255,255,255,0.76)"></polygon>
        <circle cx="${right}" cy="${beamY + 22}" r="10" fill="rgba(255,255,255,0.76)"></circle>
        <line x1="${right - 20}" y1="${beamY + 34}" x2="${right + 20}" y2="${beamY + 34}" stroke="rgba(255,255,255,0.76)" stroke-width="4"></line>
      `;
      reactions = result.reactions.map(function (item, index) {
        return upArrow(index === 0 ? left : right, beamY + 70, beamY + 22, `${item.label} = ${format(item.value, 2)} N`);
      }).join("");
      loads = result.caseKey === "simplySupportedPoint"
        ? downArrow(centerX, 36, beamY - 10, `P = ${format(result.input.loadN, 2)} N`)
        : udl(`w = ${format(result.input.loadPerMeter, 2)} N/m`);
    } else {
      supports = `
        <rect x="${left - 26}" y="${beamY - 52}" width="26" height="104" fill="rgba(255,255,255,0.82)"></rect>
        <line x1="${left - 26}" y1="${beamY - 52}" x2="${left - 48}" y2="${beamY - 72}" stroke="rgba(255,255,255,0.44)" stroke-width="4"></line>
        <line x1="${left - 26}" y1="${beamY - 24}" x2="${left - 48}" y2="${beamY - 44}" stroke="rgba(255,255,255,0.44)" stroke-width="4"></line>
        <line x1="${left - 26}" y1="${beamY + 4}" x2="${left - 48}" y2="${beamY - 16}" stroke="rgba(255,255,255,0.44)" stroke-width="4"></line>
        <line x1="${left - 26}" y1="${beamY + 32}" x2="${left - 48}" y2="${beamY + 12}" stroke="rgba(255,255,255,0.44)" stroke-width="4"></line>
        <line x1="${left - 26}" y1="${beamY + 60}" x2="${left - 48}" y2="${beamY + 40}" stroke="rgba(255,255,255,0.44)" stroke-width="4"></line>
      `;
      reactions = upArrow(left + 16, beamY + 74, beamY + 20, `${result.reactions[0].label} = ${format(result.reactions[0].value, 2)} N`);
      fixedMoment = `
        <path d="M ${left + 8} ${beamY - 18} A 22 22 0 1 1 ${left + 8} ${beamY + 18}" fill="none" stroke="#ffd166" stroke-width="4" marker-end="url(#beam-arrow-up)"></path>
        <text x="${left + 34}" y="${beamY - 24}" fill="#ffd166" font-size="14">${esc(`${texts.labels.fixedMoment} = ${format(result.fixedMomentNm, 2)} N·m`)}</text>
      `;
      loads = result.caseKey === "cantileverPoint"
        ? downArrow(right, 36, beamY - 10, `P = ${format(result.input.loadN, 2)} N`)
        : udl(`w = ${format(result.input.loadPerMeter, 2)} N/m`);
    }

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(texts.labels.beam)}">
        <defs>
          <marker id="beam-arrow-down" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0 0L10 5L0 10Z" fill="#ff6d6d"></path>
          </marker>
          <marker id="beam-arrow-up" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0 10L10 5L0 0Z" fill="#8cffc1"></path>
          </marker>
        </defs>
        <line x1="${left}" y1="${beamY}" x2="${right}" y2="${beamY}" stroke="#ffffff" stroke-width="8" stroke-linecap="round"></line>
        ${supports}
        ${loads}
        ${reactions}
        ${fixedMoment}
        <circle cx="${maxDeflectionX}" cy="${beamY + 42}" r="5" fill="#ffd166"></circle>
        <text x="${maxDeflectionX + 10}" y="${beamY + 48}" fill="#ffd166" font-size="14">${esc(texts.labels.maxDeflection)}</text>
        <line x1="${left}" y1="${beamY + 92}" x2="${right}" y2="${beamY + 92}" stroke="rgba(255,255,255,0.46)" stroke-width="2"></line>
        <line x1="${left}" y1="${beamY + 82}" x2="${left}" y2="${beamY + 102}" stroke="rgba(255,255,255,0.46)" stroke-width="2"></line>
        <line x1="${right}" y1="${beamY + 82}" x2="${right}" y2="${beamY + 102}" stroke="rgba(255,255,255,0.46)" stroke-width="2"></line>
        <text x="${centerX - 18}" y="${beamY + 118}" fill="#f5f5f5" font-size="15">0 ... L = ${format(result.input.lengthM, 3)} m</text>
      </svg>
    `;
  }

  function buildDeflectionDiagram(texts) {
    const result = state.result;
    const width = 760;
    const height = 260;
    const left = 70;
    const right = 700;
    const top = 54;
    const bottom = 214;
    const referenceY = 78;
    const maxGraphDepth = 90;
    const points = result.caseConfig.deflectionCurve(result.input, 80);
    const maxValue = points.reduce(function (max, point) {
      return Math.max(max, point.y);
    }, 0) || 1;
    const scaleX = (right - left) / result.input.lengthM;
    const scaleY = maxGraphDepth / maxValue;
    const path = points.map(function (point, index) {
      const x = left + point.x * scaleX;
      const y = referenceY + point.y * scaleY;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
    const maxX = left + result.maxDeflectionX * scaleX;
    const maxY = referenceY + result.deltaM * scaleY;

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(texts.labels.deflection)}">
        <line x1="${left}" y1="${referenceY}" x2="${right}" y2="${referenceY}" stroke="rgba(255,255,255,0.42)" stroke-width="2" stroke-dasharray="10 8"></line>
        <path d="${path}" fill="none" stroke="#ff7a7a" stroke-width="4" stroke-linecap="round"></path>
        <line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" stroke="rgba(255,255,255,0.5)" stroke-width="2"></line>
        <line x1="${left}" y1="${bottom - 8}" x2="${left}" y2="${bottom + 8}" stroke="rgba(255,255,255,0.5)" stroke-width="2"></line>
        <line x1="${right}" y1="${bottom - 8}" x2="${right}" y2="${bottom + 8}" stroke="rgba(255,255,255,0.5)" stroke-width="2"></line>
        <circle cx="${maxX}" cy="${maxY}" r="5" fill="#ffd166"></circle>
        <text x="${maxX + 12}" y="${maxY + 6}" fill="#ffd166" font-size="14">${esc(`${texts.labels.maxDeflection} = ${format(result.deltaMm, 6)} mm`)}</text>
        <text x="${left}" y="${top}" fill="#f5f5f5" font-size="14">undeformed</text>
        <text x="${left}" y="${bottom + 24}" fill="#f5f5f5" font-size="14">x = 0</text>
        <text x="${right - 86}" y="${bottom + 24}" fill="#f5f5f5" font-size="14">x = L</text>
      </svg>
    `;
  }

  function buildSfdDiagram(texts) {
    return buildGraphSvg(
      texts.labels.sfd,
      state.result.caseConfig.shearPoints(state.result.input),
      "V (N)",
      texts.diagramNotes.sfd
    );
  }

  function buildBmdDiagram(texts) {
    return buildGraphSvg(
      texts.labels.bmd,
      state.result.caseConfig.momentPoints(state.result.input),
      "M (N·m)",
      texts.diagramNotes.bmd
    );
  }

  function buildGraphSvg(title, points, yLabel) {
    const width = 760;
    const height = 260;
    const marginLeft = 70;
    const marginRight = 30;
    const marginTop = 24;
    const marginBottom = 44;
    const graphWidth = width - marginLeft - marginRight;
    const graphHeight = height - marginTop - marginBottom;
    const xMax = state.result.input.lengthM || 1;
    let minY = 0;
    let maxY = 0;

    points.forEach(function (point) {
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });

    const amplitude = Math.max(Math.abs(minY), Math.abs(maxY), 1);
    minY = -amplitude;
    maxY = amplitude;

    function xPosition(xValue) {
      return marginLeft + (xValue / xMax) * graphWidth;
    }

    function yPosition(yValue) {
      return marginTop + ((maxY - yValue) / (maxY - minY)) * graphHeight;
    }

    const polyline = points.map(function (point) {
      return `${xPosition(point.x)},${yPosition(point.y)}`;
    }).join(" ");
    const baselineY = yPosition(0);
    const peak = points.reduce(function (best, point) {
      return Math.abs(point.y) > Math.abs(best.y) ? point : best;
    }, points[0]);

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title)}">
        <line x1="${marginLeft}" y1="${baselineY}" x2="${width - marginRight}" y2="${baselineY}" stroke="rgba(255,255,255,0.48)" stroke-width="2"></line>
        <line x1="${marginLeft}" y1="${marginTop}" x2="${marginLeft}" y2="${height - marginBottom}" stroke="rgba(255,255,255,0.34)" stroke-width="2"></line>
        <polyline fill="none" stroke="#ff6d6d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="${polyline}"></polyline>
        <circle cx="${xPosition(peak.x)}" cy="${yPosition(peak.y)}" r="5" fill="#ffd166"></circle>
        <text x="${xPosition(peak.x) + 10}" y="${yPosition(peak.y) - 10}" fill="#ffd166" font-size="14">${esc(`${yLabel}max = ${format(Math.abs(peak.y), 4)}`)}</text>
        <text x="${marginLeft}" y="${height - 14}" fill="#f5f5f5" font-size="14">0</text>
        <text x="${width - marginRight - 78}" y="${height - 14}" fill="#f5f5f5" font-size="14">L = ${format(xMax, 3)} m</text>
        <text x="${marginLeft + 6}" y="${marginTop + 14}" fill="#f5f5f5" font-size="14">${esc(yLabel)}</text>
      </svg>
    `;
  }

  function render() {
    const texts = currentCopy();
    const sectionPreview = getSectionPreview();
    const loadFieldName = beamCases[state.beamCase].loadType === "point" ? "pointLoad" : "lineLoad";
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
                <span class="equation-chip">${esc(texts.formulas[state.beamCase])}</span>
                <span class="equation-chip">${esc(shapeFormulaTexts(texts))}</span>
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
              ${Object.keys(beamCases).map(function (caseKey) {
                return `
                  <label class="case-option">
                    <input type="radio" name="beamCase" value="${caseKey}" ${state.beamCase === caseKey ? "checked" : ""}>
                    <span>${esc(texts.caseLabels[caseKey])}</span>
                  </label>
                `;
              }).join("")}
            </div>

            <div class="subsection">
              <div class="panel-header">
                <h3>${esc(texts.sectionTitle)}</h3>
                <p>${esc(texts.sectionDescription)}</p>
              </div>

              <div class="field-grid">
                <div class="field field--full">
                  <label for="sectionShape">${esc(texts.fields.sectionShape)}</label>
                  <select id="sectionShape" name="sectionShape" class="select-control">
                    ${Object.keys(sectionShapes).map(function (shapeKey) {
                      return `<option value="${shapeKey}" ${state.sectionShape === shapeKey ? "selected" : ""}>${esc(texts.shapes[shapeKey])}</option>`;
                    }).join("")}
                  </select>
                </div>
                ${getShapeFields().map(function (fieldName) {
                  return createFieldCard(fieldName, texts);
                }).join("")}
              </div>
            </div>

            <div class="subsection">
              <div class="panel-header">
                <h3>${esc(texts.beamInputTitle)}</h3>
                <p>${esc(texts.beamInputDescription)}</p>
              </div>

              <div class="field-grid">
                ${createFieldCard("length", texts)}
                ${createFieldCard("modulus", texts)}
                ${createFieldCard("load", {
                  fields: Object.assign({}, texts.fields, { load: texts.fields[loadFieldName] }),
                  hints: texts.hints
                })}
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
                <h2>${esc(texts.sectionPreviewTitle)}</h2>
                <p>${esc(sectionPreview.ok ? texts.sectionDescription : texts.labels.sectionIncomplete)}</p>
              </div>
              ${buildSectionPreview(texts)}
            </section>

            <section class="result-panel glass-card">
              <div class="panel-header">
                <h2>${esc(texts.diagramsTitle)}</h2>
                <p>${esc(texts.diagramsDescription)}</p>
              </div>
              ${buildDiagramCards(texts)}
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
            <div class="panel-header" style="margin-top: 1rem;">
              <h3>${esc(texts.warningsTitle)}</h3>
            </div>
            ${buildWarnings(texts)}
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

      if (event.target.name === "beamCase" || event.target.name === "sectionShape") {
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
