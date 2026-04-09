window.StrengthSolverI18n = {
  translations: {
    en: {
      meta: {
        appName: "AhmedSolver",
        languageCode: "en",
        dir: "ltr"
      },
      common: {
        solve: "Solve",
        clear: "Clear",
        backToTopics: "Back to Topics",
        viewRoadmap: "View Roadmap",
        moduleScaffold: "Module Scaffold",
        formulaLabel: "Primary Formula",
        available: "Available",
        comingSoon: "Coming Soon",
        footerNote: "AhmedSolver is built as a student-friendly engineering platform."
      },
      nav: {
        brandCaption: "Smart Engineering Platform for Strength of Materials",
        home: "Home",
        topics: "Topics",
        tools: "Platform",
        roadmap: "Roadmap",
        featured: "Stress Page",
        quiz: "Quiz",
        languageToggle: "العربية",
        languageToggleLabel: "Switch language to Arabic",
        menu: "Toggle navigation"
      },
      hero: {
        eyebrow: "Engineering Learning Platform",
        title: "AhmedSolver",
        description: "Smart Engineering Platform for Strength of Materials",
        primaryCta: "Browse Topics",
        secondaryCta: "See Build Roadmap",
        statModules: "scaffolded learning modules",
        statLanguages: "language-ready interface",
        statResponsive: "responsive and RTL-ready layout",
        visualBadge: "Foundation Preview",
        visualTitle: "AhmedSolver brings calculators, diagrams, and study tools into one workspace.",
        visualDescription:
          "Built for university students with bilingual navigation, responsive engineering layouts, and modular tools ready to grow.",
        formulas: {
          stress: "Normal stress",
          strain: "Normal strain",
          torsion: "Torsion",
          bending: "Bending stress"
        }
      },
      features: {
        stepByStep: {
          title: "Step-by-step architecture",
          description:
            "The app is scaffolded for reusable calculators, shared result panels, validation helpers, and export-friendly sections."
        },
        bilingual: {
          title: "Arabic and English from day one",
          description:
            "Every core label is translation-driven, with layout direction and typography switching smoothly between LTR and RTL."
        },
        engineeringUi: {
          title: "Modern engineering theme",
          description:
            "A dark academic interface uses high-contrast cards, technical spacing, and subtle motion suited for long study sessions."
        }
      },
      sections: {
        topics: {
          kicker: "Module Library",
          title: "The homepage now maps the full platform.",
          description:
            "Each card already points to a dedicated module page so we can build the calculators and tools incrementally without restructuring later."
        }
      },
      groups: {
        core: {
          title: "Core Calculators",
          description: "Essential mechanics formulas that will become interactive solver pages."
        },
        visual: {
          title: "Visual Analysis Tools",
          description: "Diagram-focused modules for beams, reactions, force systems, and stress transformation."
        },
        tools: {
          title: "Study and Utility Tools",
          description: "Question practice, quiz flows, unit conversion, and export support."
        }
      },
      roadmap: {
        kicker: "Build Sequence",
        title: "This first phase builds the platform spine.",
        description:
          "The structure below keeps the project modular so each future feature can plug into a stable shared shell.",
        steps: {
          solve: {
            title: "Shared Shell",
            description: "Navbar, footer, responsive layout, and page scaffolding are ready across the app."
          },
          visualize: {
            title: "Language Engine",
            description: "Translations, direction switching, and document titles are centralized in reusable code."
          },
          practice: {
            title: "Module Routing",
            description: "Dedicated pages already exist for calculators, quizzes, diagrams, and question-bank features."
          },
          share: {
            title: "Future Expansion",
            description: "Placeholder JavaScript and data files are in place for the next implementation steps."
          }
        }
      },
      bilingual: {
        kicker: "Bilingual UX",
        title: "The language system is part of the foundation, not an afterthought.",
        description:
          "Switching language updates shared navigation, homepage content, page placeholders, and interface direction while keeping the layout polished on desktop and mobile.",
        points: {
          toggle: {
            title: "Instant toggle",
            description: "Language preference is saved locally so students return to the same interface next time."
          },
          layout: {
            title: "Directional support",
            description: "Arabic activates RTL layout rules and the Cairo font pairing without breaking spacing or components."
          },
          foundation: {
            title: "Ready for growth",
            description: "Future calculators only need translation keys and reusable markup patterns to join the system."
          }
        },
        previewLabel: "Live Interface Preview",
        previewTitle: "A consistent interface for every mechanics topic",
        previewRows: {
          stress: "Stress Solver",
          strain: "Strain Solver",
          result: "Example Result",
          resultValue: "Ready for step-by-step output"
        }
      },
      moduleTypes: {
        calculator: "Calculator",
        visualizer: "Visualizer",
        practice: "Practice",
        utility: "Utility"
      },
      topics: {
        stress: {
          title: "Normal Stress",
          description: "Compute axial stress from load and cross-sectional area."
        },
        strain: {
          title: "Normal Strain",
          description: "Measure elongation relative to original member length."
        },
        hookesLaw: {
          title: "Hooke's Law",
          description: "Relate stress and strain through the elastic modulus."
        },
        axialDeformation: {
          title: "Axial Deformation",
          description: "Find member elongation under axial loading."
        },
        shearStress: {
          title: "Shear Stress",
          description: "Evaluate average shear stress from force and area."
        },
        torsion: {
          title: "Torsion",
          description: "Estimate torsional shear stress using torque, radius, and polar inertia."
        },
        bending: {
          title: "Bending Stress",
          description: "Determine flexural stress due to moment, distance, and inertia."
        },
        beamReactions: {
          title: "Beam Reactions",
          description: "Solve reactions for a simply supported beam with center loading."
        },
        mohrsCircle: {
          title: "Mohr's Circle",
          description: "Transform plane stress to average, principal, and maximum shear values."
        },
        thermalStress: {
          title: "Thermal Stress and Strain",
          description: "Study restrained expansion and thermal effects in members."
        },
        fbd: {
          title: "Free Body Diagram Tool",
          description: "Add forces, inspect components, and study equilibrium visually."
        },
        unitConverter: {
          title: "Unit Converter",
          description: "Convert engineering values across force, stress, length, area, and torque."
        },
        questionBank: {
          title: "Question Bank",
          description: "Filter curated practice problems by topic and difficulty."
        },
        quiz: {
          title: "Quiz Section",
          description: "Test understanding with topic-based multiple-choice quizzes."
        },
        beamDiagrams: {
          title: "Beam Diagrams",
          description: "Visualize supports, point loads, shear force, and bending moment basics."
        },
        pdfExport: {
          title: "Export Results as PDF",
          description: "Prepare solver outputs for printable student-friendly study records."
        }
      },
      placeholder: {
        readyTitle: "Ready in this phase",
        nextTitle: "Planned next additions",
        readyItems: [
          "Shared navbar and footer render automatically across the site.",
          "Arabic and English translations are already wired into the page shell.",
          "Responsive layout and dark engineering styling are active on every scaffolded page."
        ],
        nextDescription:
          "The next implementation pass will replace this scaffold with interactive calculators, diagrams, result panels, and topic-specific JavaScript logic.",
        nextChip: "Next phase: calculators, canvas tools, and quizzes"
      },
      footer: {
        description:
          "AhmedSolver is a smart engineering platform for Strength of Materials with bilingual calculators, visual tools, and guided study support.",
        quickLinks: "Quick Links",
        starterPages: "Starter Pages",
        rights: "All core layouts, translations, and page scaffolds are ready for expansion."
      }
    },
    ar: {
      meta: {
        appName: "AhmedSolver",
        languageCode: "ar",
        dir: "rtl"
      },
      common: {
        solve: "احسب",
        clear: "مسح",
        backToTopics: "العودة إلى الموضوعات",
        viewRoadmap: "عرض خطة التطوير",
        moduleScaffold: "هيكل أولي للصفحة",
        formulaLabel: "المعادلة الأساسية",
        available: "متاح الآن",
        comingSoon: "قريباً",
        footerNote: "AhmedSolver منصة هندسية تعليمية مناسبة للطلاب."
      },
      nav: {
        brandCaption: "منصة هندسية ذكية لمقاومة المواد",
        home: "الرئيسية",
        topics: "الموضوعات",
        tools: "المنصة",
        roadmap: "الخطة",
        featured: "صفحة الإجهاد",
        quiz: "الاختبار",
        languageToggle: "English",
        languageToggleLabel: "التبديل إلى اللغة الإنجليزية",
        menu: "فتح قائمة التنقل"
      },
      hero: {
        eyebrow: "منصة هندسية ذكية",
        title: "AhmedSolver",
        description: "منصة هندسية ذكية لمقاومة المواد",
        primaryCta: "استعراض الموضوعات",
        secondaryCta: "عرض مراحل البناء",
        statModules: "وحدة تعليمية مهيأة",
        statLanguages: "واجهة جاهزة للغتين",
        statResponsive: "تصميم متجاوب ويدعم RTL",
        visualBadge: "معاينة الأساس",
        visualTitle: "يجمع AhmedSolver الحاسبات والرسومات وأدوات الدراسة في مساحة واحدة.",
        visualDescription:
          "تم تصميمه لطلاب الجامعة مع تنقل ثنائي اللغة وتخطيط هندسي متجاوب وأدوات قابلة للتوسع.",
        formulas: {
          stress: "الإجهاد العمودي",
          strain: "الانفعال العمودي",
          torsion: "اللي",
          bending: "إجهاد الانحناء"
        }
      },
      features: {
        stepByStep: {
          title: "بنية تدعم الحل خطوة بخطوة",
          description:
            "تم تجهيز المشروع ليعتمد على حاسبات قابلة لإعادة الاستخدام ولوحات نتائج مشتركة وأقسام مناسبة للتصدير لاحقاً."
        },
        bilingual: {
          title: "العربية والإنجليزية من البداية",
          description:
            "كل العناصر الأساسية مرتبطة ببيانات الترجمة مع تبديل سلس بين الاتجاهين والخطوط المناسبة لكل لغة."
        },
        engineeringUi: {
          title: "واجهة هندسية حديثة",
          description:
            "تصميم أكاديمي داكن يعتمد على بطاقات واضحة وتباين مرتفع وحركة خفيفة مناسبة لجلسات الدراسة الطويلة."
        }
      },
      sections: {
        topics: {
          kicker: "مكتبة الوحدات",
          title: "الصفحة الرئيسية ترسم الآن خريطة المنصة كاملة.",
          description:
            "كل بطاقة ترتبط بصفحة مستقلة مهيأة مسبقاً حتى نبني الحاسبات والأدوات تدريجياً من دون إعادة هيكلة لاحقاً."
        }
      },
      groups: {
        core: {
          title: "الحاسبات الأساسية",
          description: "معادلات الميكانيكا الأساسية التي ستتحول إلى صفحات حل تفاعلية."
        },
        visual: {
          title: "أدوات التحليل البصري",
          description: "وحدات مخصصة للرسومات ومخططات القوى والجوائز وتحويلات الإجهاد."
        },
        tools: {
          title: "أدوات الدراسة والخدمات",
          description: "بنك الأسئلة والاختبارات والتحويل بين الوحدات ودعم التصدير."
        }
      },
      roadmap: {
        kicker: "تسلسل البناء",
        title: "هذه المرحلة الأولى تبني العمود الفقري للمنصة.",
        description:
          "الهيكل التالي يحافظ على المشروع منظماً بحيث يمكن إضافة كل ميزة لاحقة بسهولة داخل إطار مشترك ثابت.",
        steps: {
          solve: {
            title: "القالب المشترك",
            description: "شريط التنقل والتذييل والتصميم المتجاوب وهيكل الصفحات أصبح جاهزاً في كامل التطبيق."
          },
          visualize: {
            title: "محرك اللغة",
            description: "الترجمات وتبديل الاتجاه وعناوين الصفحات تمت مركزتها في كود قابل لإعادة الاستخدام."
          },
          practice: {
            title: "ربط الوحدات",
            description: "تم إنشاء صفحات مستقلة بالفعل للحاسبات والاختبارات والرسومات وبنك الأسئلة."
          },
          share: {
            title: "التوسعة القادمة",
            description: "ملفات JavaScript والبيانات الأساسية موجودة وجاهزة للمرحلة التنفيذية التالية."
          }
        }
      },
      bilingual: {
        kicker: "تجربة ثنائية اللغة",
        title: "نظام اللغة جزء من الأساس وليس إضافة متأخرة.",
        description:
          "عند تبديل اللغة يتم تحديث شريط التنقل ومحتوى الصفحة الرئيسية والصفحات المهيأة واتجاه الواجهة مع الحفاظ على مظهر مرتب في الهاتف والحاسوب.",
        points: {
          toggle: {
            title: "تبديل فوري",
            description: "يتم حفظ اللغة المختارة محلياً ليعود الطالب إلى نفس الواجهة في الزيارة التالية."
          },
          layout: {
            title: "دعم كامل للاتجاه",
            description: "عند استخدام العربية يتم تفعيل RTL وخط Cairo من دون إفساد المسافات أو المكونات."
          },
          foundation: {
            title: "جاهز للتوسع",
            description: "أي حاسبة جديدة تحتاج فقط إلى مفاتيح ترجمة وبنية مشتركة حتى تنضم إلى النظام."
          }
        },
        previewLabel: "معاينة مباشرة للواجهة",
        previewTitle: "واجهة متسقة لكل موضوع في مقاومة المواد",
        previewRows: {
          stress: "حاسبة الإجهاد",
          strain: "حاسبة الانفعال",
          result: "مثال على النتيجة",
          resultValue: "جاهزة لعرض الخطوات بالتفصيل"
        }
      },
      moduleTypes: {
        calculator: "حاسبة",
        visualizer: "أداة بصرية",
        practice: "تدريب",
        utility: "خدمة"
      },
      topics: {
        stress: {
          title: "الإجهاد العمودي",
          description: "حساب الإجهاد المحوري من الحمل والمساحة العرضية."
        },
        strain: {
          title: "الانفعال العمودي",
          description: "قياس الاستطالة نسبةً إلى الطول الأصلي للعضو."
        },
        hookesLaw: {
          title: "قانون هوك",
          description: "ربط الإجهاد بالانفعال من خلال معامل المرونة."
        },
        axialDeformation: {
          title: "الاستطالة المحورية",
          description: "إيجاد مقدار التغير في الطول تحت حمل محوري."
        },
        shearStress: {
          title: "إجهاد القص",
          description: "حساب إجهاد القص المتوسط من القوة والمساحة."
        },
        torsion: {
          title: "اللي",
          description: "تقدير إجهاد القص الناتج عن العزم ونصف القطر والعزم القطبي."
        },
        bending: {
          title: "إجهاد الانحناء",
          description: "إيجاد الإجهاد الناتج عن العزم والمسافة ومحور العطالة."
        },
        beamReactions: {
          title: "ردود الأفعال في الجوائز",
          description: "حساب ردود الأفعال لجائز بسيط الارتكاز تحت حمل مركزي."
        },
        mohrsCircle: {
          title: "دائرة مور",
          description: "تحويل حالة الإجهاد المستوي إلى إجهادات رئيسية وقص أعظمي."
        },
        thermalStress: {
          title: "الإجهاد والانفعال الحراري",
          description: "دراسة التمدد المقيد وتأثيرات الحرارة في العناصر."
        },
        fbd: {
          title: "أداة مخطط الجسم الحر",
          description: "إضافة قوى متعددة ومتابعة المركبات والاتزان بصرياً."
        },
        unitConverter: {
          title: "محول الوحدات",
          description: "التحويل بين وحدات القوة والإجهاد والطول والمساحة والعزم."
        },
        questionBank: {
          title: "بنك الأسئلة",
          description: "تصفية مسائل تدريبية هندسية حسب الموضوع ومستوى الصعوبة."
        },
        quiz: {
          title: "قسم الاختبارات",
          description: "اختبر فهمك من خلال أسئلة اختيار من متعدد حسب الموضوع."
        },
        beamDiagrams: {
          title: "مخططات الجوائز",
          description: "عرض الركائز والأحمال ومخططات القص والعزم بشكل تعليمي مبسط."
        },
        pdfExport: {
          title: "تصدير النتائج إلى PDF",
          description: "تهيئة مخرجات الحل للتخزين والطباعة بطريقة مناسبة للطلاب."
        }
      },
      placeholder: {
        readyTitle: "المتاح في هذه المرحلة",
        nextTitle: "الإضافات المخطط لها لاحقاً",
        readyItems: [
          "يتم عرض شريط التنقل والتذييل المشتركين تلقائياً في جميع الصفحات.",
          "الترجمة بين العربية والإنجليزية مرتبطة بالفعل بالقالب العام للصفحات.",
          "التصميم المتجاوب والواجهة الهندسية الداكنة يعملان الآن في كل الصفحات المهيأة."
        ],
        nextDescription:
          "في المرحلة التالية سيتم استبدال هذا الهيكل بحاسبات تفاعلية ورسومات ولوحات نتائج ومنطق JavaScript خاص بكل موضوع.",
        nextChip: "المرحلة التالية: الحاسبات والأدوات الرسومية والاختبارات"
      },
      footer: {
        description:
          "AhmedSolver منصة هندسية ذكية لمقاومة المواد تضم حاسبات ثنائية اللغة وأدوات بصرية ودعماً دراسياً موجهاً.",
        quickLinks: "روابط سريعة",
        starterPages: "صفحات البداية",
        rights: "جميع القوالب الأساسية والترجمات وهياكل الصفحات أصبحت جاهزة للتوسعة."
      }
    }
  }
};
