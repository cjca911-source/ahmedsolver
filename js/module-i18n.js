(function () {
  "use strict";

  const root = window.StrengthSolverI18n = window.StrengthSolverI18n || { translations: { en: {}, ar: {} } };

  function mergeDeep(target, source) {
    Object.keys(source).forEach(function (key) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (sourceValue && typeof sourceValue === "object" && !Array.isArray(sourceValue)) {
        target[key] = mergeDeep(targetValue && typeof targetValue === "object" ? targetValue : {}, sourceValue);
        return;
      }

      target[key] = sourceValue;
    });

    return target;
  }

  mergeDeep(root.translations.en, {
    interactive: {
      shared: {
        explanation: "Concept Overview",
        formula: "Main Formula",
        inputs: "Inputs",
        results: "Results",
        steps: "Step-by-Step Solution",
        summary: "Summary",
        notes: "Study Notes",
        validation: "Please review the highlighted inputs and try again.",
        ready: "Enter your values to begin.",
        noData: "No data to display yet.",
        resetHint: "Use Clear to reset the tool instantly."
      },
      stress: {
        kicker: "Interactive Solver",
        subtitle: "Leave one variable empty and AhmedSolver will detect the unknown, solve sigma = P / A, and show the full engineering workflow.",
        explanation:
          "Normal stress relates axial load, cross-sectional area, and stress in one equation. Leave exactly one value empty to solve for stress, load, or area with unit-aware steps.",
        formTitle: "Stress Solver Inputs",
        loadValue: "Applied Load (P)",
        loadUnit: "Load Unit",
        loadPlaceholder: "Leave empty to solve for P",
        loadHint: "Use a positive value for tension and a negative value for compression when load is known.",
        areaValue: "Area (A)",
        areaUnit: "Area Unit",
        areaPlaceholder: "Leave empty to solve for A",
        areaHint: "Area must stay positive. The selected unit is also used for the solved answer when A is unknown.",
        stressValue: "Normal Stress (sigma)",
        stressUnit: "Stress Unit",
        stressPlaceholder: "Leave empty to solve for sigma",
        stressHint: "Use the stress unit for both entered values and the final answer when sigma is the unknown.",
        solverHint: "Leave exactly one value field empty. The solver will detect the unknown automatically.",
        resultTitle: "Stress Solver Result",
        resultPlaceholder: "Leave one value blank, then solve to generate the worked solution with units.",
        finalLabel: "Final Answer",
        inputSummaryTitle: "Solution Summary",
        loadSummary: "Applied load",
        areaSummary: "Cross-sectional area",
        stressSummary: "Normal stress",
        solvedForSummary: "Solved for",
        stepsTitle: "Worked Solution",
        originalFormulaLabel: "Original formula",
        detectedUnknownLabel: "Detected unknown",
        rearrangedFormulaLabel: "Rearranged formula",
        conversionLabel: "Convert known values to SI units",
        substitutionLabel: "Numerical substitution",
        finalAnswerLabel: "Final answer",
        substitutionLineLabel: "Substitution",
        baseResultLabel: "SI base result",
        unknownStress: "Normal Stress (sigma)",
        unknownLoad: "Applied Load (P)",
        unknownArea: "Area (A)",
        validationLoad: "Enter a valid load value.",
        validationArea: "Area must be greater than zero.",
        validationStress: "Enter a valid stress value.",
        validationSingleUnknown: "Leave exactly one value empty so the solver knows which variable to find.",
        validationInsufficient: "Insufficient data. Leave only one field empty and fill the other two values.",
        validationStressZeroForArea: "Stress cannot be zero when solving for area.",
        validationAreaResult: "The solved area must be greater than zero. Check the signs and values entered.",
        solvedStressMessage: "Normal stress solved successfully.",
        solvedLoadMessage: "Applied load solved successfully.",
        solvedAreaMessage: "Area solved successfully."
      },
      converter: {
        kicker: "Engineering Utility",
        subtitle: "Convert common engineering units for force, stress, length, area, moment of inertia, and torque.",
        explanation:
          "The converter uses a base SI unit for each category, then transforms the entered value from the source unit to the destination unit.",
        panelTitle: "Conversion Controls",
        category: "Category",
        value: "Value",
        fromUnit: "From Unit",
        toUnit: "To Unit",
        convertButton: "Convert",
        resultTitle: "Converted Result",
        resultPlaceholder: "Choose a category, enter a value, and convert between engineering units.",
        formulaLine: "Converted value = input x (from factor / to factor)",
        baseStep: "Convert the input value into the category base unit.",
        targetStep: "Convert the base-unit value into the selected target unit.",
        factorLabel: "Factor ratio",
        baseValueLabel: "Base-unit value",
        convertedValueLabel: "Converted value",
        convertMessage: "Conversion completed.",
        validationValue: "Enter a valid numeric value to convert.",
        categories: {
          force: "Force",
          stress: "Stress / Pressure",
          length: "Length",
          area: "Area",
          inertia: "Moment of Inertia",
          torque: "Torque"
        }
      },
      fbd: {
        kicker: "Canvas Visualizer",
        subtitle: "Add forces to a free body diagram, inspect their x and y components, and study the resultant.",
        explanation:
          "Angles are measured counterclockwise from the positive x-axis. Each force is resolved into components, then summed to show overall equilibrium trends.",
        controlTitle: "Force Entry",
        magnitude: "Magnitude",
        angle: "Angle (deg)",
        label: "Label",
        labelHint: "Leave blank to auto-generate F1, F2, and so on.",
        canvasTitle: "Diagram Canvas",
        canvasHint: "Axes, force arrows, and the resultant update dynamically whenever the force list changes.",
        addForce: "Add Force",
        clearAll: "Clear All Forces",
        activeTitle: "Active Forces",
        activeHint: "Remove a force instantly from the chip list or the detailed table below.",
        listTitle: "Force Components",
        emptyList: "No forces added yet. Start by entering a magnitude and angle.",
        remove: "Remove",
        summaryTitle: "Equilibrium Summary",
        sumFx: "Sum Fx",
        sumFy: "Sum Fy",
        resultant: "Resultant",
        resultantAngle: "Resultant Angle",
        degreeShort: "deg",
        forceCount: "Forces",
        magnitudeValidation: "Magnitude must be greater than zero.",
        angleValidation: "Enter a valid angle in degrees.",
        addMessage: "Force added to the diagram.",
        removeMessage: "Force removed from the diagram.",
        clearMessage: "All forces removed from the diagram.",
        table: {
          label: "Label",
          magnitude: "Magnitude",
          angle: "Angle",
          fx: "Fx",
          fy: "Fy",
          actions: "Actions"
        }
      },
      units: {
        newton: "newton",
        kilonewton: "kilonewton",
        poundForce: "pound-force",
        pascal: "pascal",
        kilopascal: "kilopascal",
        megapascal: "megapascal",
        gigapascal: "gigapascal",
        psi: "psi",
        millimeter: "millimeter",
        centimeter: "centimeter",
        meter: "meter",
        inch: "inch",
        foot: "foot",
        millimeterSquared: "square millimeter",
        centimeterSquared: "square centimeter",
        meterSquared: "square meter",
        inchSquared: "square inch",
        millimeterFourth: "millimeter to the fourth",
        centimeterFourth: "centimeter to the fourth",
        meterFourth: "meter to the fourth",
        inchFourth: "inch to the fourth",
        newtonMeter: "newton-meter",
        kilonewtonMeter: "kilonewton-meter",
        poundFoot: "pound-foot"
      }
    }
  });

  mergeDeep(root.translations.ar, {
    interactive: {
      shared: {
        explanation: "شرح المفهوم",
        formula: "المعادلة الأساسية",
        inputs: "المدخلات",
        results: "النتائج",
        steps: "الحل خطوة بخطوة",
        summary: "الملخص",
        notes: "ملاحظات دراسية",
        validation: "يرجى مراجعة القيم المميزة ثم المحاولة مرة أخرى.",
        ready: "أدخل القيم للبدء.",
        noData: "لا توجد بيانات للعرض بعد.",
        resetHint: "استخدم زر المسح لإعادة ضبط الأداة فوراً."
      },
      stress: {
        kicker: "حاسبة تفاعلية",
        subtitle: "احسب الإجهاد العمودي من الحمل المحوري والمساحة المقطعية مع تحويل الوحدات وإظهار خطوات الحل.",
        explanation:
          "الإجهاد العمودي يوضح شدة التحميل على العضو بالنسبة إلى مساحته المقطعية. عادةً تعتبر القيمة الموجبة شدّاً بينما تمثل القيمة السالبة ضغطاً.",
        formTitle: "مدخلات الإجهاد",
        loadValue: "الحمل المؤثر (P)",
        loadUnit: "وحدة الحمل",
        areaValue: "المساحة (A)",
        areaUnit: "وحدة المساحة",
        outputUnit: "وحدة الإجهاد المطلوبة",
        inputHint: "يمكن إدخال الشد بقيمة موجبة والضغط بقيمة سالبة.",
        resultTitle: "نتيجة الإجهاد",
        resultPlaceholder: "ستظهر قيمة الإجهاد المحسوبة هنا مع الوحدات وخطوات الحل.",
        finalLabel: "الإجهاد النهائي",
        inputSummaryTitle: "ملخص المدخلات",
        loadSummary: "الحمل المؤثر",
        areaSummary: "المساحة المقطعية",
        outputSummary: "وحدة العرض",
        stepsTitle: "الحل المفصل",
        stepConvertLoad: "حوّل الحمل المؤثر إلى نيوتن.",
        stepConvertArea: "حوّل المساحة المقطعية إلى متر مربع.",
        stepSubstitute: "عوّض في معادلة الإجهاد العمودي.",
        stepConvertOutput: "حوّل قيمة الإجهاد إلى وحدة العرض المختارة.",
        validationLoad: "أدخل قيمة حمل صحيحة.",
        validationArea: "يجب أن تكون المساحة أكبر من الصفر.",
        solvedMessage: "تم حساب الإجهاد بنجاح."
      },
      converter: {
        kicker: "أداة هندسية",
        subtitle: "حوّل بين الوحدات الهندسية الشائعة للقوة والإجهاد والطول والمساحة وعزم العطالة والعزم.",
        explanation:
          "يعتمد المحول على وحدة أساسية في النظام الدولي لكل فئة، ثم يحول القيمة المدخلة من وحدة المصدر إلى وحدة الهدف.",
        panelTitle: "عناصر التحويل",
        category: "الفئة",
        value: "القيمة",
        fromUnit: "من وحدة",
        toUnit: "إلى وحدة",
        convertButton: "تحويل",
        resultTitle: "النتيجة المحولة",
        resultPlaceholder: "اختر الفئة وأدخل القيمة ثم حوّل بين الوحدات الهندسية.",
        formulaLine: "القيمة المحولة = القيمة المدخلة x (معامل المصدر / معامل الهدف)",
        baseStep: "حوّل القيمة المدخلة إلى الوحدة الأساسية للفئة.",
        targetStep: "حوّل قيمة الوحدة الأساسية إلى وحدة الهدف المختارة.",
        factorLabel: "نسبة المعامل",
        baseValueLabel: "قيمة الوحدة الأساسية",
        convertedValueLabel: "القيمة المحولة",
        convertMessage: "تم التحويل بنجاح.",
        validationValue: "أدخل قيمة رقمية صحيحة للتحويل.",
        categories: {
          force: "القوة",
          stress: "الإجهاد / الضغط",
          length: "الطول",
          area: "المساحة",
          inertia: "عزم العطالة",
          torque: "العزم"
        }
      },
      fbd: {
        kicker: "أداة رسم تفاعلية",
        subtitle: "أضف قوى إلى مخطط الجسم الحر، واطلع على مركباتها في الاتجاهين x و y، وادرس المحصلة.",
        explanation:
          "تقاس الزوايا عكس اتجاه عقارب الساعة انطلاقاً من المحور x الموجب. يتم تحليل كل قوة إلى مركبات ثم جمعها لإظهار اتجاه الاتزان العام.",
        controlTitle: "إدخال القوة",
        magnitude: "المقدار",
        angle: "الزاوية (درجة)",
        label: "الرمز",
        labelHint: "اتركه فارغاً ليتم توليد F1 و F2 وهكذا تلقائياً.",
        canvasTitle: "منطقة الرسم",
        canvasHint: "تتحدث المحاور والأسهم والمحصلة مباشرة عند تعديل قائمة القوى.",
        addForce: "إضافة قوة",
        clearAll: "مسح جميع القوى",
        activeTitle: "القوى الحالية",
        activeHint: "يمكن حذف أي قوة مباشرة من الشريط السريع أو من الجدول التفصيلي بالأسفل.",
        listTitle: "مركبات القوى",
        emptyList: "لا توجد قوى مضافة بعد. ابدأ بإدخال مقدار وزاوية.",
        remove: "حذف",
        summaryTitle: "ملخص الاتزان",
        sumFx: "مجموع Fx",
        sumFy: "مجموع Fy",
        resultant: "المحصلة",
        resultantAngle: "زاوية المحصلة",
        degreeShort: "درجة",
        forceCount: "عدد القوى",
        magnitudeValidation: "يجب أن يكون مقدار القوة أكبر من الصفر.",
        angleValidation: "أدخل زاوية صحيحة بالدرجات.",
        addMessage: "تمت إضافة القوة إلى المخطط.",
        removeMessage: "تم حذف القوة من المخطط.",
        clearMessage: "تم حذف جميع القوى من المخطط.",
        table: {
          label: "الرمز",
          magnitude: "المقدار",
          angle: "الزاوية",
          fx: "Fx",
          fy: "Fy",
          actions: "الإجراءات"
        }
      },
      units: {
        newton: "نيوتن",
        kilonewton: "كيلو نيوتن",
        poundForce: "رطل-قوة",
        pascal: "باسكال",
        kilopascal: "كيلو باسكال",
        megapascal: "ميغاباسكال",
        gigapascal: "غيغاباسكال",
        psi: "رطل لكل بوصة مربعة",
        millimeter: "ملليمتر",
        centimeter: "سنتيمتر",
        meter: "متر",
        inch: "بوصة",
        foot: "قدم",
        millimeterSquared: "ملليمتر مربع",
        centimeterSquared: "سنتيمتر مربع",
        meterSquared: "متر مربع",
        inchSquared: "بوصة مربعة",
        millimeterFourth: "ملليمتر للقوة الرابعة",
        centimeterFourth: "سنتيمتر للقوة الرابعة",
        meterFourth: "متر للقوة الرابعة",
        inchFourth: "بوصة للقوة الرابعة",
        newtonMeter: "نيوتن.متر",
        kilonewtonMeter: "كيلو نيوتن.متر",
        poundFoot: "رطل.قدم"
      }
    }
  });

  mergeDeep(root.translations.ar, {
    interactive: {
      stress: {
        kicker: "محلل تفاعلي",
        subtitle: "اترك متغيراً واحداً فارغاً وسيكتشف AhmedSolver المجهول ويحل المعادلة sigma = P / A مع عرض الخطوات الهندسية كاملة.",
        explanation:
          "تربط معادلة الإجهاد العمودي بين الحمل المحوري والمساحة المقطعية والإجهاد في علاقة واحدة. اترك قيمة واحدة فقط فارغة ليتم حل الإجهاد أو الحمل أو المساحة مع خطوات واضحة وتحويل للوحدات.",
        formTitle: "مدخلات محلل الإجهاد",
        loadPlaceholder: "اتركه فارغاً لإيجاد P",
        loadHint: "استخدم قيمة موجبة للشد وسالبة للضغط عندما يكون الحمل معلوماً.",
        areaPlaceholder: "اتركها فارغة لإيجاد A",
        areaHint: "يجب أن تبقى المساحة موجبة، وتُستخدم الوحدة المختارة أيضاً في الإجابة النهائية عندما تكون A مجهولة.",
        stressValue: "الإجهاد العمودي (sigma)",
        stressUnit: "وحدة الإجهاد",
        stressPlaceholder: "اتركه فارغاً لإيجاد sigma",
        stressHint: "تُستخدم وحدة الإجهاد للقيم المدخلة وللإجابة النهائية عندما يكون sigma هو المجهول.",
        solverHint: "اترك خانة قيمة واحدة فقط فارغة حتى يكتشف المحلل المجهول تلقائياً.",
        resultTitle: "نتيجة محلل الإجهاد",
        resultPlaceholder: "اترك قيمة واحدة فارغة ثم اضغط احسب لعرض الحل التفصيلي مع الوحدات.",
        finalLabel: "الإجابة النهائية",
        inputSummaryTitle: "ملخص الحل",
        stressSummary: "الإجهاد العمودي",
        solvedForSummary: "تم الحل من أجل",
        originalFormulaLabel: "المعادلة الأصلية",
        detectedUnknownLabel: "المجهول المكتشف",
        rearrangedFormulaLabel: "المعادلة بعد إعادة الترتيب",
        conversionLabel: "تحويل القيم المعلومة إلى وحدات النظام الدولي",
        substitutionLabel: "التعويض العددي",
        finalAnswerLabel: "الإجابة النهائية",
        substitutionLineLabel: "التعويض",
        baseResultLabel: "النتيجة بوحدة الأساس",
        unknownStress: "الإجهاد العمودي (sigma)",
        unknownLoad: "الحمل المؤثر (P)",
        unknownArea: "المساحة (A)",
        validationStress: "أدخل قيمة إجهاد صحيحة.",
        validationSingleUnknown: "اترك قيمة واحدة فقط فارغة حتى يعرف المحلل المتغير المطلوب.",
        validationInsufficient: "البيانات غير كافية. اترك خانة واحدة فقط فارغة واملأ القيمتين الأخريين.",
        validationStressZeroForArea: "لا يمكن أن يكون الإجهاد صفراً عند حل المساحة.",
        validationAreaResult: "يجب أن تكون المساحة المحسوبة أكبر من الصفر. راجع الإشارات والقيم المدخلة.",
        solvedStressMessage: "تم حساب الإجهاد العمودي بنجاح.",
        solvedLoadMessage: "تم حساب الحمل بنجاح.",
        solvedAreaMessage: "تم حساب المساحة بنجاح."
      }
    }
  });
})();
