(function () {
  "use strict";

  const app = window.StrengthSolverApp;
  const root = document.getElementById("ai-solver-root");
  const state = {
    file: null,
    previewUrl: "",
    loading: false,
    error: "",
    result: null
  };

  if (!app || !root) {
    return;
  }

  function pair(en, ar) {
    return { en: en, ar: ar };
  }

  function text(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value[app.getLanguage()] || value.en || value.ar || "";
    }

    return value == null ? "" : String(value);
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character];
    });
  }

  function setPreview(file) {
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }

    state.previewUrl = file ? URL.createObjectURL(file) : "";
  }

  async function sendImageToApi(file) {
    const configuredEndpoint = window.AhmedSolverConfig && window.AhmedSolverConfig.aiSolverEndpoint;

    if (configuredEndpoint) {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch(configuredEndpoint, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(text(pair("The analysis request failed. Please try again.", "فشل طلب التحليل. يرجى المحاولة مرة أخرى.")));
      }

      return response.json();
    }

    await new Promise(function (resolve) { window.setTimeout(resolve, 1200); });
    return {
      extractedText: pair(
        "A steel bar carries 48 kN in tension and has an area of 600 mm^2. Find the normal stress.",
        "قضيب فولاذي يحمل قوة شد مقدارها 48 كيلو نيوتن ومساحة مقطعه 600 ملم^2. أوجد الإجهاد العمودي."
      ),
      detectedTopic: pair("Normal Stress", "الإجهاد العمودي"),
      givenValues: [
        pair("P = 48 kN", "P = 48 kN"),
        pair("A = 600 mm^2", "A = 600 mm^2")
      ],
      formula: "sigma = P / A",
      steps: [
        pair("Convert the load: 48 kN = 48,000 N.", "حوّل الحمل: 48 كيلو نيوتن = 48,000 نيوتن."),
        pair("Use the area directly in mm^2 for an MPa-friendly solution: 600 mm^2.", "استخدم المساحة مباشرة بوحدة ملم^2 للحصول على حل مناسب بوحدة ميغاباسكال: 600 ملم^2."),
        pair("Compute stress: sigma = 48,000 / 600 = 80 N/mm^2.", "احسب الإجهاد: sigma = 48,000 / 600 = 80 نيوتن/ملم^2."),
        pair("Recognize that 1 N/mm^2 = 1 MPa.", "لاحظ أن 1 نيوتن/ملم^2 = 1 ميغاباسكال.")
      ],
      finalAnswer: pair("sigma = 80 MPa", "sigma = 80 MPa")
    };
  }

  async function analyzeProblem() {
    if (!state.file || state.loading) {
      return;
    }

    state.loading = true;
    state.error = "";
    state.result = null;
    render();

    try {
      state.result = await sendImageToApi(state.file);
    } catch (error) {
      state.error = error.message || text(pair("Image analysis failed.", "فشل تحليل الصورة."));
    } finally {
      state.loading = false;
      render();
    }
  }

  function listMarkup(items) {
    if (!items || !items.length) {
      return `<p>${esc(text(pair("No data yet.", "لا توجد بيانات بعد.")))}</p>`;
    }

    return `<ul class="export-preview-list">${items.map(function (item) { return `<li>${esc(text(item))}</li>`; }).join("")}</ul>`;
  }

  function render() {
    root.innerHTML = `
      <section class="page-hero fade-in-up">
        <div class="page-hero__split">
          <div>
            <span class="page-badge">${esc(text(pair("AI Engineering Assistant", "مساعد هندسي بالذكاء الاصطناعي")))}</span>
            <h1>${esc(app.t("topics.aiSolver.title", app.getLanguage()))}</h1>
            <p>${esc(text(pair("Upload a problem image to extract the question, classify the topic, and prepare a guided solution flow.", "ارفع صورة لمسألة لاستخراج نص السؤال وتصنيف الموضوع وإعداد مسار حل موجه.")))}</p>
            <div class="placeholder-actions">
              <a class="button button-primary" href="${app.buildUrl("index.html#platform-tools")}">${esc(app.t("nav.tools", app.getLanguage()))}</a>
              <a class="button button-secondary" href="${app.buildUrl("pages/pdf-export.html")}">${esc(app.t("topics.pdfExport.title", app.getLanguage()))}</a>
            </div>
          </div>
          <aside class="hero-side-card">
            <span class="section-chip">${esc(text(pair("Backend-ready flow", "تدفق جاهز للربط الخلفي")))}</span>
            <p>${esc(text(pair("The frontend is ready to send the uploaded image to an API endpoint. When no endpoint is configured, the page returns a local demo response so the UI remains testable.", "الواجهة الأمامية جاهزة لإرسال الصورة المرفوعة إلى واجهة API. وعند عدم ضبط نقطة نهاية، تعرض الصفحة استجابة تجريبية محلية حتى تبقى الواجهة قابلة للاختبار.")))}</p>
            <div class="formula-display">${esc(text(pair("Upload -> Analyze -> Solve", "رفع -> تحليل -> حل")))}</div>
          </aside>
        </div>
      </section>

      <section class="tool-page section-block">
        <div class="module-grid">
          <article class="module-panel glass-card">
            <div class="module-panel__header">
              <span class="section-chip">${esc(text(pair("Image input", "إدخال الصورة")))}</span>
              <h2>${esc(text(pair("Upload the engineering problem", "ارفع المسألة الهندسية")))}</h2>
            </div>
            <div class="field">
              <label for="ai-image-input">${esc(text(pair("Problem image", "صورة المسألة")))}</label>
              <input id="ai-image-input" class="input-control" type="file" accept="image/*">
            </div>
            <div class="action-row">
              <button type="button" class="button button-primary" id="ai-analyze"${state.file && !state.loading ? "" : " disabled"}>${esc(state.loading ? text(pair("Analyzing...", "جارٍ التحليل...")) : text(pair("Analyze Problem", "تحليل المسألة")))}</button>
              <button type="button" class="button button-secondary" id="ai-clear">${esc(text(pair("Clear", "مسح")))}</button>
            </div>
            ${state.error ? `<div class="status-banner is-visible" data-state="error">${esc(state.error)}</div>` : ""}
            <div class="ai-upload-preview">
              ${state.previewUrl ? `<img src="${state.previewUrl}" alt="${esc(text(pair("Uploaded problem preview", "معاينة الصورة المرفوعة")))}" class="ai-upload-preview__image">` : `<div class="empty-state"><p>${esc(text(pair("Upload an image to preview it here.", "ارفع صورة لمعاينتها هنا.")))}</p></div>`}
            </div>
          </article>

          <article class="module-panel glass-card">
            <div class="module-panel__header">
              <span class="section-chip">${esc(text(pair("Analysis result", "نتيجة التحليل")))}</span>
              <h2>${esc(text(pair("Detected problem details", "تفاصيل المسألة المكتشفة")))}</h2>
            </div>
            <div class="result-block">
              <div class="result-card">
                <div class="field-title">${esc(text(pair("Detected topic", "الموضوع المكتشف")))}</div>
                <div class="result-value">${state.result ? esc(text(state.result.detectedTopic)) : "--"}</div>
                <div class="result-subline">${state.loading ? esc(text(pair("The image is being analyzed right now.", "تجري الآن عملية تحليل الصورة."))) : esc(text(pair("The topic will appear after analysis.", "سيظهر الموضوع بعد اكتمال التحليل.")))}</div>
              </div>
              <div class="result-card">
                <div class="field-title">${esc(text(pair("Extracted text", "النص المستخرج")))}</div>
                <p>${state.result ? esc(text(state.result.extractedText)) : esc(text(pair("OCR output will appear here.", "سيظهر هنا النص المستخرج من الصورة.")))}</p>
              </div>
            </div>
          </article>
        </div>

        <div class="module-grid">
          <article class="module-panel glass-card">
            <div class="module-panel__header">
              <span class="section-chip">${esc(text(pair("Detected values", "القيم المكتشفة")))}</span>
              <h2>${esc(text(pair("Problem data", "بيانات المسألة")))}</h2>
            </div>
            <div class="result-card">${state.result ? listMarkup(state.result.givenValues) : `<div class="empty-state"><p>${esc(text(pair("Given values will be listed here after analysis.", "ستدرج القيم المعطاة هنا بعد التحليل.")))}</p></div>`}</div>
            <div class="result-card">
              <div class="field-title">${esc(text(pair("Formula used", "المعادلة المستخدمة")))}</div>
              <div class="helper-code">${esc(state.result ? text(state.result.formula) : text(pair("The selected formula will appear here.", "ستظهر هنا المعادلة المختارة.")))}</div>
            </div>
          </article>

          <article class="module-panel glass-card">
            <div class="module-panel__header">
              <span class="section-chip">${esc(text(pair("Final result", "النتيجة النهائية")))}</span>
              <h2>${esc(text(pair("Solved answer", "الإجابة المحلولة")))}</h2>
            </div>
            <div class="result-card">
              <div class="result-value">${state.result ? esc(text(state.result.finalAnswer)) : "--"}</div>
              <div class="result-subline">${esc(text(pair("The final answer appears after the solver finishes the analysis.", "تظهر الإجابة النهائية بعد أن ينهي المحلل المهمة.")))}</div>
            </div>
          </article>
        </div>

        <article class="module-panel glass-card">
          <div class="module-panel__header">
            <span class="section-chip">${esc(text(pair("Step-by-step solution", "الحل خطوة بخطوة")))}</span>
            <h2>${esc(text(pair("Solution flow", "تدفق الحل")))}</h2>
          </div>
          <div class="steps-list">
            ${state.result ? state.result.steps.map(function (step, index) {
              return `<article class="step-card"><h4>${esc(text(pair("Step", "الخطوة")))} ${index + 1}</h4><p>${esc(text(step))}</p></article>`;
            }).join("") : `<div class="empty-state"><p>${esc(text(pair("The guided solution steps will appear here after image analysis.", "ستظهر هنا خطوات الحل الموجه بعد تحليل الصورة.")))}</p></div>`}
          </div>
        </article>
      </section>
    `;

    root.querySelector("#ai-image-input").addEventListener("change", function (event) {
      const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
      state.file = file;
      state.error = "";
      state.result = null;
      setPreview(file);
      render();
    });

    root.querySelector("#ai-analyze").addEventListener("click", analyzeProblem);

    root.querySelector("#ai-clear").addEventListener("click", function () {
      state.file = null;
      state.error = "";
      state.result = null;
      setPreview(null);
      render();
    });
  }

  render();
  document.addEventListener(app.eventName, render);
})();
