window.StrengthSolverData = window.StrengthSolverData || {};

window.StrengthSolverData.questions = {
  bank: [
    {
      id: "bank-stress-1",
      topic: "stress",
      difficulty: "easy",
      title: { en: "Tension in a steel bar", ar: "شد في قضيب فولاذي" },
      statement: {
        en: "A steel bar carries a tensile load of 48 kN and has a cross-sectional area of 600 mm^2. Find the normal stress in MPa.",
        ar: "يحمل قضيب فولاذي حملاً شدياً مقداره 48 كيلونيوتن ومساحة مقطعه 600 ملم^2. أوجد الإجهاد العمودي بوحدة ميغاباسكال."
      },
      hint: {
        en: "Use sigma = P / A and convert kN to N if needed.",
        ar: "استخدم sigma = P / A مع تحويل كيلونيوتن إلى نيوتن عند الحاجة."
      },
      answer: {
        en: "Stress = 48,000 / 600 = 80 N/mm^2 = 80 MPa.",
        ar: "الإجهاد = 48000 / 600 = 80 نيوتن/ملم^2 = 80 ميغاباسكال."
      }
    },
    {
      id: "bank-stress-2",
      topic: "stress",
      difficulty: "medium",
      title: { en: "Compression in an aluminum column", ar: "ضغط في عمود ألمنيوم" },
      statement: {
        en: "An aluminum column carries a compressive load of 95 kN over an area of 2,500 mm^2. Determine the average compressive stress.",
        ar: "يتعرض عمود ألمنيوم إلى حمل ضاغط مقداره 95 كيلونيوتن على مساحة 2500 ملم^2. احسب إجهاد الضغط المتوسط."
      },
      hint: {
        en: "Compression is usually reported with a negative sign or noted as compressive stress.",
        ar: "يمكن تمثيل الضغط بإشارة سالبة أو وصفه كإجهاد ضاغط."
      },
      answer: {
        en: "Stress = 95,000 / 2,500 = 38 MPa in compression.",
        ar: "الإجهاد = 95000 / 2500 = 38 ميغاباسكال ضغطاً."
      }
    },
    {
      id: "bank-strain-1",
      topic: "strain",
      difficulty: "easy",
      title: { en: "Measured elongation", ar: "الاستطالة المقاسة" },
      statement: {
        en: "A rod originally 2.0 m long elongates by 1.6 mm. Find the normal strain and express it in microstrain.",
        ar: "قضيب طوله الأصلي 2.0 م ازداد طوله بمقدار 1.6 ملم. أوجد الانفعال العمودي وعبّر عنه بالمايكروسترين."
      },
      hint: {
        en: "Convert 1.6 mm into meters before dividing by the original length.",
        ar: "حوّل 1.6 ملم إلى متر قبل القسمة على الطول الأصلي."
      },
      answer: {
        en: "Strain = 0.0016 / 2 = 0.0008 = 800 microstrain.",
        ar: "الانفعال = 0.0016 / 2 = 0.0008 = 800 مايكروسترين."
      }
    },
    {
      id: "bank-strain-2",
      topic: "strain",
      difficulty: "medium",
      title: { en: "Shortening under compression", ar: "النقصان تحت الضغط" },
      statement: {
        en: "A 750 mm specimen shortens by 0.45 mm under compressive load. Calculate the normal strain.",
        ar: "عينة طولها 750 ملم قصرت بمقدار 0.45 ملم تحت حمل ضاغط. احسب الانفعال العمودي."
      },
      hint: {
        en: "Shortening gives a negative strain value.",
        ar: "النقصان في الطول يعطي قيمة سالبة للانفعال."
      },
      answer: {
        en: "Strain = -0.45 / 750 = -0.0006.",
        ar: "الانفعال = -0.45 / 750 = -0.0006."
      }
    },
    {
      id: "bank-torsion-1",
      topic: "torsion",
      difficulty: "medium",
      title: { en: "Solid shaft in torsion", ar: "عمود مصمت تحت اللي" },
      statement: {
        en: "A shaft is subjected to a torque of 1.8 kN*m. The outer radius is 22 mm and the polar moment of inertia is 3.2e5 mm^4. Find the maximum torsional shear stress.",
        ar: "يتعرض عمود لعزم لي مقداره 1.8 كيلونيوتن.م. نصف القطر الخارجي 22 ملم وعزم العطالة القطبي 3.2e5 ملم^4. أوجد إجهاد القص الأعظمي."
      },
      hint: {
        en: "Use tau = T r / J with consistent units.",
        ar: "استخدم tau = T r / J مع توحيد الوحدات."
      },
      answer: {
        en: "Convert torque to N*mm, then tau = (1.8e6 x 22) / 3.2e5 = 123.75 MPa.",
        ar: "حوّل العزم إلى نيوتن.ملم ثم tau = (1.8e6 x 22) / 3.2e5 = 123.75 ميغاباسكال."
      }
    },
    {
      id: "bank-torsion-2",
      topic: "torsion",
      difficulty: "hard",
      title: { en: "Hollow shaft comparison", ar: "مقارنة عمود أجوف" },
      statement: {
        en: "A hollow shaft carries the same torque as a solid shaft but has a larger polar moment of inertia. Explain what happens to the torsional shear stress.",
        ar: "يحمل عمود أجوف نفس العزم الذي يحمله عمود مصمت لكنه يملك عزماً قطبياً أكبر. وضّح ما الذي يحدث لإجهاد القص الناتج عن اللي."
      },
      hint: {
        en: "Look at J in the denominator of tau = T r / J.",
        ar: "انظر إلى J في مقام العلاقة tau = T r / J."
      },
      answer: {
        en: "For the same torque and radius, a larger J reduces the torsional shear stress.",
        ar: "لنفس العزم ونصف القطر، زيادة J تؤدي إلى تقليل إجهاد القص الناتج عن اللي."
      }
    },
    {
      id: "bank-bending-1",
      topic: "bending",
      difficulty: "medium",
      title: { en: "Rectangular beam section", ar: "مقطع جائز مستطيل" },
      statement: {
        en: "A beam section experiences a bending moment of 12 kN*m. A point 60 mm from the neutral axis is considered, and I = 8.5e6 mm^4. Find the bending stress.",
        ar: "يتعرض مقطع جائز لعزم انحناء مقداره 12 كيلونيوتن.م. تؤخذ نقطة تبعد 60 ملم عن المحور المتعادل، و I = 8.5e6 ملم^4. أوجد إجهاد الانحناء."
      },
      hint: {
        en: "Use sigma = M y / I after converting the moment into N*mm.",
        ar: "استخدم sigma = M y / I بعد تحويل العزم إلى نيوتن.ملم."
      },
      answer: {
        en: "Stress = (12e6 x 60) / 8.5e6 = 84.71 MPa.",
        ar: "الإجهاد = (12e6 x 60) / 8.5e6 = 84.71 ميغاباسكال."
      }
    },
    {
      id: "bank-bending-2",
      topic: "bending",
      difficulty: "hard",
      title: { en: "Top and bottom fibers", ar: "الألياف العليا والسفلى" },
      statement: {
        en: "For a symmetric beam in pure bending, explain why the top and bottom fibers carry equal magnitudes of bending stress with opposite signs.",
        ar: "في جائز متماثل تحت انحناء خالص، اشرح لماذا تحمل الألياف العليا والسفلى مقادير متساوية من إجهاد الانحناء لكن بإشارتين متعاكستين."
      },
      hint: {
        en: "Think about the neutral axis and the sign of y above and below it.",
        ar: "فكّر في المحور المتعادل وفي إشارة y فوقه وتحته."
      },
      answer: {
        en: "Because sigma = M y / I and the top and bottom fibers are the same distance from the neutral axis. Their y values have opposite signs, so the stresses are equal in magnitude and opposite in sign.",
        ar: "لأن sigma = M y / I والألياف العليا والسفلى تقعان على المسافة نفسها من المحور المتعادل. لكن قيمة y تتغير إشارتها، لذلك تكون الإجهادات متساوية في المقدار ومتعاكسة في الإشارة."
      }
    },
    {
      id: "bank-mohr-1",
      topic: "mohrsCircle",
      difficulty: "medium",
      title: { en: "Average stress from plane stress", ar: "الإجهاد المتوسط في حالة إجهاد مستو" },
      statement: {
        en: "Given sigma_x = 90 MPa and sigma_y = 30 MPa, find the average normal stress used in Mohr's Circle.",
        ar: "إذا كانت sigma_x = 90 ميغاباسكال و sigma_y = 30 ميغاباسكال، أوجد الإجهاد العمودي المتوسط المستخدم في دائرة مور."
      },
      hint: {
        en: "Average stress is the midpoint between sigma_x and sigma_y.",
        ar: "الإجهاد المتوسط هو نقطة المنتصف بين sigma_x و sigma_y."
      },
      answer: {
        en: "Average stress = (90 + 30) / 2 = 60 MPa.",
        ar: "الإجهاد المتوسط = (90 + 30) / 2 = 60 ميغاباسكال."
      }
    },
    {
      id: "bank-mohr-2",
      topic: "mohrsCircle",
      difficulty: "hard",
      title: { en: "Effect of shear on principal stress", ar: "تأثير القص في الإجهادات الرئيسية" },
      statement: {
        en: "Explain how increasing tau_xy affects the radius of Mohr's Circle when sigma_x and sigma_y stay constant.",
        ar: "اشرح كيف تؤثر زيادة tau_xy في نصف قطر دائرة مور عندما تبقى sigma_x و sigma_y ثابتتين."
      },
      hint: {
        en: "Radius = sqrt(((sigma_x - sigma_y)/2)^2 + tau_xy^2).",
        ar: "نصف القطر = sqrt(((sigma_x - sigma_y)/2)^2 + tau_xy^2)."
      },
      answer: {
        en: "Increasing tau_xy increases the radius, which increases the separation between the principal stresses and raises the maximum shear stress.",
        ar: "زيادة tau_xy تزيد نصف القطر، وبالتالي تزيد المسافة بين الإجهادين الرئيسيين وتزيد إجهاد القص الأعظمي."
      }
    },
    {
      id: "bank-beam-1",
      topic: "beamReactions",
      difficulty: "easy",
      title: { en: "Center point load", ar: "حمل نقطي في المنتصف" },
      statement: {
        en: "A simply supported beam carries a 20 kN point load at midspan. Find the support reactions.",
        ar: "جائز بسيط الارتكاز يحمل حملاً نقطياً مقداره 20 كيلونيوتن عند المنتصف. أوجد ردود الأفعال عند المساند."
      },
      hint: {
        en: "Symmetry is your friend.",
        ar: "التماثل يساعدك هنا."
      },
      answer: {
        en: "RA = RB = 10 kN.",
        ar: "RA = RB = 10 كيلونيوتن."
      }
    },
    {
      id: "bank-beam-2",
      topic: "beamReactions",
      difficulty: "medium",
      title: { en: "Off-center point load", ar: "حمل نقطي خارج المنتصف" },
      statement: {
        en: "A 6 m simply supported beam carries a 12 kN point load located 2 m from the left support. Find RA and RB.",
        ar: "جائز بسيط الارتكاز طوله 6 م يحمل حملاً نقطياً مقداره 12 كيلونيوتن على بعد 2 م من المسند الأيسر. أوجد RA و RB."
      },
      hint: {
        en: "Take moments about one support first.",
        ar: "خذ العزوم حول أحد المساند أولاً."
      },
      answer: {
        en: "RB = (12 x 2) / 6 = 4 kN, then RA = 12 - 4 = 8 kN.",
        ar: "RB = (12 x 2) / 6 = 4 كيلونيوتن، ثم RA = 12 - 4 = 8 كيلونيوتن."
      }
    },
    {
      id: "bank-thermal-1",
      topic: "thermalStress",
      difficulty: "medium",
      title: { en: "Free thermal expansion", ar: "التمدد الحراري الحر" },
      statement: {
        en: "A bar has alpha = 12e-6 /C and experiences a temperature rise of 45 C. Find the thermal strain if expansion is unrestrained.",
        ar: "قضيب له alpha = 12e-6 /درجة مئوية ويتعرض لزيادة حرارية مقدارها 45 درجة مئوية. أوجد الانفعال الحراري إذا كان التمدد حراً."
      },
      hint: {
        en: "Use epsilon_th = alpha deltaT.",
        ar: "استخدم epsilon_th = alpha deltaT."
      },
      answer: {
        en: "Thermal strain = 12e-6 x 45 = 540e-6 = 540 microstrain.",
        ar: "الانفعال الحراري = 12e-6 x 45 = 540e-6 = 540 مايكروسترين."
      }
    },
    {
      id: "bank-thermal-2",
      topic: "thermalStress",
      difficulty: "hard",
      title: { en: "Restrained thermal stress", ar: "الإجهاد الحراري المقيد" },
      statement: {
        en: "A fully restrained steel bar has E = 200 GPa, alpha = 12e-6 /C, and deltaT = 35 C. Find the thermal stress.",
        ar: "قضيب فولاذي مقيد تماماً له E = 200 غيغاباسكال و alpha = 12e-6 /درجة مئوية و deltaT = 35 درجة مئوية. أوجد الإجهاد الحراري."
      },
      hint: {
        en: "Use sigma = E alpha deltaT with E in Pa.",
        ar: "استخدم sigma = E alpha deltaT مع التعبير عن E بوحدة باسكال."
      },
      answer: {
        en: "Thermal stress = 200e9 x 12e-6 x 35 = 84e6 Pa = 84 MPa.",
        ar: "الإجهاد الحراري = 200e9 x 12e-6 x 35 = 84e6 باسكال = 84 ميغاباسكال."
      }
    }
  ],
  quiz: [
    {
      id: "quiz-stress-1",
      topic: "stress",
      prompt: { en: "Which formula is used for average normal stress?", ar: "أي علاقة تستخدم لحساب الإجهاد العمودي المتوسط؟" },
      options: [
        { en: "sigma = P / A", ar: "sigma = P / A" },
        { en: "epsilon = deltaL / L", ar: "epsilon = deltaL / L" },
        { en: "tau = T r / J", ar: "tau = T r / J" },
        { en: "sigma = M y / I", ar: "sigma = M y / I" }
      ],
      correctIndex: 0,
      explanation: {
        en: "Average normal stress equals the axial load divided by the cross-sectional area.",
        ar: "الإجهاد العمودي المتوسط يساوي الحمل المحوري مقسوماً على مساحة المقطع."
      }
    },
    {
      id: "quiz-stress-2",
      topic: "stress",
      prompt: { en: "If load doubles and area stays the same, average normal stress will:", ar: "إذا تضاعف الحمل وبقيت المساحة ثابتة فإن الإجهاد العمودي المتوسط سوف:" },
      options: [
        { en: "Stay the same", ar: "يبقى ثابتاً" },
        { en: "Double", ar: "يتضاعف" },
        { en: "Be halved", ar: "ينخفض إلى النصف" },
        { en: "Become zero", ar: "يصبح صفراً" }
      ],
      correctIndex: 1,
      explanation: {
        en: "Stress is directly proportional to load when area does not change.",
        ar: "الإجهاد يتناسب طردياً مع الحمل عندما لا تتغير المساحة."
      }
    },
    {
      id: "quiz-strain-1",
      topic: "strain",
      prompt: { en: "Normal strain compares:", ar: "الانفعال العمودي يقارن بين:" },
      options: [
        { en: "Stress and area", ar: "الإجهاد والمساحة" },
        { en: "Load and modulus", ar: "الحمل ومعامل المرونة" },
        { en: "Length change and original length", ar: "التغير في الطول والطول الأصلي" },
        { en: "Torque and radius", ar: "العزم ونصف القطر" }
      ],
      correctIndex: 2,
      explanation: {
        en: "Strain measures deformation relative to the original length.",
        ar: "الانفعال يقيس التشوه نسبةً إلى الطول الأصلي."
      }
    },
    {
      id: "quiz-strain-2",
      topic: "strain",
      prompt: { en: "A shortening member under compression has strain that is usually:", ar: "العضو الذي يقصر تحت الضغط تكون قيمة انفعاله عادةً:" },
      options: [
        { en: "Positive", ar: "موجبة" },
        { en: "Negative", ar: "سالبة" },
        { en: "Always zero", ar: "صفر دائماً" },
        { en: "Greater than one", ar: "أكبر من واحد" }
      ],
      correctIndex: 1,
      explanation: {
        en: "Compression causes shortening, which is typically written as negative strain.",
        ar: "الضغط يسبب نقصاناً في الطول، لذلك يكتب الانفعال عادةً بإشارة سالبة."
      }
    },
    {
      id: "quiz-torsion-1",
      topic: "torsion",
      prompt: { en: "In tau = T r / J, increasing J while keeping T and r constant will:", ar: "في العلاقة tau = T r / J، فإن زيادة J مع ثبات T و r سوف:" },
      options: [
        { en: "Increase tau", ar: "تزيد tau" },
        { en: "Reduce tau", ar: "تقلل tau" },
        { en: "Not affect tau", ar: "لا تؤثر في tau" },
        { en: "Reverse the stress sign only", ar: "تعكس إشارة الإجهاد فقط" }
      ],
      correctIndex: 1,
      explanation: {
        en: "J is in the denominator, so a larger polar moment lowers the torsional stress.",
        ar: "J موجود في المقام، لذا فإن زيادة العزم القطبي تقلل إجهاد اللي."
      }
    },
    {
      id: "quiz-torsion-2",
      topic: "torsion",
      prompt: { en: "The radius term in the torsion equation shows that shear stress is largest:", ar: "يوضح حد نصف القطر في معادلة اللي أن إجهاد القص يكون أعظمياً:" },
      options: [
        { en: "At the center", ar: "عند المركز" },
        { en: "At the outer surface", ar: "عند السطح الخارجي" },
        { en: "At every point equally", ar: "ومتساوياً عند كل النقاط" },
        { en: "Only at supports", ar: "عند المساند فقط" }
      ],
      correctIndex: 1,
      explanation: {
        en: "Stress increases with radius, so the outer surface carries the maximum value.",
        ar: "الإجهاد يزداد مع نصف القطر، لذلك تكون قيمته العظمى عند السطح الخارجي."
      }
    },
    {
      id: "quiz-bending-1",
      topic: "bending",
      prompt: { en: "Which term represents the distance from the neutral axis in the bending equation?", ar: "أي حد يمثل المسافة عن المحور المتعادل في معادلة الانحناء؟" },
      options: [
        { en: "M", ar: "M" },
        { en: "I", ar: "I" },
        { en: "y", ar: "y" },
        { en: "A", ar: "A" }
      ],
      correctIndex: 2,
      explanation: {
        en: "The term y measures the distance from the neutral axis to the point of interest.",
        ar: "الحد y يمثل المسافة من المحور المتعادل إلى النقطة المطلوبة."
      }
    },
    {
      id: "quiz-bending-2",
      topic: "bending",
      prompt: { en: "For a given moment and distance y, increasing I will:", ar: "للعزم نفسه ولنفس قيمة y، فإن زيادة I سوف:" },
      options: [
        { en: "Increase stress", ar: "تزيد الإجهاد" },
        { en: "Reduce stress", ar: "تقلل الإجهاد" },
        { en: "Keep stress constant", ar: "تجعل الإجهاد ثابتاً" },
        { en: "Make the stress zero", ar: "تجعل الإجهاد صفراً" }
      ],
      correctIndex: 1,
      explanation: {
        en: "I is in the denominator of sigma = M y / I, so a larger I lowers the bending stress.",
        ar: "I موجود في مقام sigma = M y / I، لذا فإن زيادته تقلل إجهاد الانحناء."
      }
    },
    {
      id: "quiz-mohr-1",
      topic: "mohrsCircle",
      prompt: { en: "The center of Mohr's Circle is located at:", ar: "مركز دائرة مور يقع عند:" },
      options: [
        { en: "((sigma_x - sigma_y)/2, tau_xy)", ar: "((sigma_x - sigma_y)/2, tau_xy)" },
        { en: "((sigma_x + sigma_y)/2, 0)", ar: "((sigma_x + sigma_y)/2, 0)" },
        { en: "(tau_xy, sigma_x)", ar: "(tau_xy, sigma_x)" },
        { en: "(0, sigma_y)", ar: "(0, sigma_y)" }
      ],
      correctIndex: 1,
      explanation: {
        en: "The circle center lies on the horizontal axis at the average normal stress.",
        ar: "يقع مركز الدائرة على المحور الأفقي عند قيمة الإجهاد العمودي المتوسط."
      }
    },
    {
      id: "quiz-mohr-2",
      topic: "mohrsCircle",
      prompt: { en: "The maximum in-plane shear stress equals:", ar: "إجهاد القص الأعظمي في المستوى يساوي:" },
      options: [
        { en: "The circle diameter", ar: "قطر الدائرة" },
        { en: "The circle radius", ar: "نصف قطر الدائرة" },
        { en: "The average normal stress", ar: "الإجهاد العمودي المتوسط" },
        { en: "sigma_x + sigma_y", ar: "sigma_x + sigma_y" }
      ],
      correctIndex: 1,
      explanation: {
        en: "The maximum in-plane shear stress is equal to the Mohr's Circle radius.",
        ar: "إجهاد القص الأعظمي في المستوى يساوي نصف قطر دائرة مور."
      }
    },
    {
      id: "quiz-beam-1",
      topic: "beamReactions",
      prompt: { en: "For a simply supported beam with a center point load, the reactions are:", ar: "في جائز بسيط الارتكاز يحمل حملاً في المنتصف، تكون ردود الأفعال:" },
      options: [
        { en: "Unequal unless the beam is steel", ar: "غير متساوية إلا إذا كان الجائز من الفولاذ" },
        { en: "Both equal to P/2", ar: "كلاهما يساوي P/2" },
        { en: "Both equal to P", ar: "كلاهما يساوي P" },
        { en: "Zero at both supports", ar: "صفراً عند كلا المسندين" }
      ],
      correctIndex: 1,
      explanation: {
        en: "Symmetry makes each support carry half of the center load.",
        ar: "بسبب التماثل يحمل كل مسند نصف الحمل المركزي."
      }
    },
    {
      id: "quiz-beam-2",
      topic: "beamReactions",
      prompt: { en: "When finding beam reactions, the most useful equilibrium equations are:", ar: "عند إيجاد ردود الأفعال في الجائز فإن معادلات الاتزان الأكثر فائدة هي:" },
      options: [
        { en: "sum F = m a only", ar: "sum F = m a فقط" },
        { en: "sum V = 0 and sum M = 0", ar: "sum V = 0 و sum M = 0" },
        { en: "Bernoulli's equation", ar: "معادلة برنولي" },
        { en: "Hooke's law only", ar: "قانون هوك فقط" }
      ],
      correctIndex: 1,
      explanation: {
        en: "Vertical force balance and moment balance determine the reactions.",
        ar: "اتزان القوى الرأسية واتزان العزوم يحددان ردود الأفعال."
      }
    },
    {
      id: "quiz-thermal-1",
      topic: "thermalStress",
      prompt: { en: "Thermal strain for an unrestrained member is calculated from:", ar: "الانفعال الحراري لعضو غير مقيد يحسب من:" },
      options: [
        { en: "epsilon_th = alpha deltaT", ar: "epsilon_th = alpha deltaT" },
        { en: "sigma = P / A", ar: "sigma = P / A" },
        { en: "tau = V / A", ar: "tau = V / A" },
        { en: "sigma = M y / I", ar: "sigma = M y / I" }
      ],
      correctIndex: 0,
      explanation: {
        en: "Free thermal strain depends on the expansion coefficient and the temperature change.",
        ar: "الانفعال الحراري الحر يعتمد على معامل التمدد والتغير الحراري."
      }
    },
    {
      id: "quiz-thermal-2",
      topic: "thermalStress",
      prompt: { en: "If a member is fully restrained and heated, thermal stress will generally:", ar: "إذا كان العضو مقيداً بالكامل وتعرض للتسخين فإن الإجهاد الحراري غالباً:" },
      options: [
        { en: "Be zero", ar: "يكون صفراً" },
        { en: "Develop because expansion is prevented", ar: "يتولد لأن التمدد ممنوع" },
        { en: "Depend only on area", ar: "يعتمد فقط على المساحة" },
        { en: "Always be tensile and independent of E", ar: "يكون شدياً دائماً ومستقلاً عن E" }
      ],
      correctIndex: 1,
      explanation: {
        en: "Restraining the free thermal expansion generates internal stress.",
        ar: "منع التمدد الحراري الحر يؤدي إلى تولد إجهاد داخلي."
      }
    }
  ]
};
