(function () {
  "use strict";

  const app = window.StrengthSolverApp;
  const root = document.getElementById("pdf-export-root");
  const exportStorageKey = "ahmedsolver-export-history";
  const state = {
    selectedIndex: 0,
    topic: "",
    formula: "",
    inputs: "",
    finalAnswer: "",
    steps: ""
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

  function reports() {
    try {
      return JSON.parse(window.localStorage.getItem(exportStorageKey) || "[]");
    } catch (error) {
      return [];
    }
  }

  function loadReport(index) {
    const report = reports()[index];

    if (!report) {
      return;
    }

    state.selectedIndex = index;
    state.topic = report.topic || "";
    state.formula = report.formula || "";
    state.inputs = (report.inputs || []).join("\n");
    state.finalAnswer = report.finalAnswer || "";
    state.steps = (report.steps || []).join("\n");
  }

  function previewList(multiline) {
    return multiline.split("\n").map(function (item) { return item.trim(); }).filter(Boolean);
  }

  function render() {
    const savedReports = reports();
    const inputsList = previewList(state.inputs);
    const stepsList = previewList(state.steps);

    root.innerHTML = `
      <section class="page-hero fade-in-up">
        <div class="page-hero__split">
          <div>
            <span class="page-badge">${esc(text(pair("PDF Workspace", "مساحة تصدير PDF")))}</span>
            <h1>${esc(app.t("topics.pdfExport.title", app.getLanguage()))}</h1>
            <p>${esc(text(pair("Load a recent solved result or prepare a custom study sheet, then use the browser print dialog to save it as PDF.", "حمّل نتيجة محلولة حديثاً أو جهّز ورقة دراسة مخصصة ثم استخدم نافذة الطباعة في المتصفح للحفظ بصيغة PDF.")))}</p>
          </div>
          <aside class="hero-side-card">
            <span class="section-chip">${esc(text(pair("How export works", "آلية التصدير")))}</span>
            <p>${esc(text(pair("This page formats the visible result cleanly for printing or PDF saving without any external dependency.", "تنظم هذه الصفحة النتيجة الظاهرة بطريقة مناسبة للطباعة أو الحفظ بصيغة PDF من دون أي مكتبة خارجية.")))}</p>
            <div class="formula-display">${esc(text(pair("Preview -> Print -> Save as PDF", "معاينة -> طباعة -> حفظ PDF")))}</div>
          </aside>
        </div>
      </section>

      <section class="tool-page section-block">
        <div class="module-grid">
          <article class="module-panel glass-card">
            <div class="module-panel__header"><span class="section-chip">${esc(text(pair("Export controls", "عناصر التصدير")))}</span><h2>${esc(text(pair("Prepare your report", "جهّز تقريرك")))}</h2></div>
            <div class="field-grid">
              <div class="field field--full">
                <label for="export-report-select">${esc(text(pair("Saved solved result", "نتيجة محلولة محفوظة")))}</label>
                <select id="export-report-select" class="select-control">
                  <option value="">${esc(text(pair("Select a recent result", "اختر نتيجة حديثة")))}</option>
                  ${savedReports.map(function (report, index) {
                    return `<option value="${index}"${index === state.selectedIndex && state.topic ? " selected" : ""}>${esc(report.topic)} - ${esc(new Date(report.createdAt).toLocaleString(app.getLanguage() === "ar" ? "ar" : "en-US"))}</option>`;
                  }).join("")}
                </select>
              </div>
              <div class="field field--full"><label for="export-topic">${esc(text(pair("Topic name", "اسم الموضوع")))}</label><input id="export-topic" class="input-control" type="text" value="${esc(state.topic)}"></div>
              <div class="field field--full"><label for="export-formula">${esc(text(pair("Formula", "المعادلة")))}</label><input id="export-formula" class="input-control" type="text" value="${esc(state.formula)}"></div>
              <div class="field field--full"><label for="export-inputs">${esc(text(pair("Inputs (one per line)", "المدخلات (سطر لكل عنصر)")))}</label><textarea id="export-inputs" class="text-control" rows="5">${esc(state.inputs)}</textarea></div>
              <div class="field field--full"><label for="export-answer">${esc(text(pair("Final answer", "الإجابة النهائية")))}</label><input id="export-answer" class="input-control" type="text" value="${esc(state.finalAnswer)}"></div>
              <div class="field field--full"><label for="export-steps">${esc(text(pair("Solution steps (one per line)", "خطوات الحل (سطر لكل خطوة)")))}</label><textarea id="export-steps" class="text-control" rows="6">${esc(state.steps)}</textarea></div>
            </div>
            <div class="action-row">
              <button type="button" class="button button-primary" id="export-preview">${esc(text(pair("Update preview", "تحديث المعاينة")))}</button>
              <button type="button" class="button button-secondary" id="export-print">${esc(text(pair("Print / Save PDF", "طباعة / حفظ PDF")))}</button>
              <button type="button" class="button button-secondary" id="export-clear">${esc(text(pair("Clear form", "مسح النموذج")))}</button>
            </div>
          </article>

          <article class="module-panel glass-card export-preview-card">
            <div class="module-panel__header"><span class="section-chip">${esc(text(pair("Preview", "المعاينة")))}</span><h2>${esc(text(pair("Printable report", "تقرير قابل للطباعة")))}</h2></div>
            <div class="export-preview-sheet" id="export-preview-sheet">
              <span class="section-kicker">AhmedSolver</span>
              <h2>${esc(state.topic || text(pair("Untitled engineering result", "نتيجة هندسية بلا عنوان")))}</h2>
              <p>${esc(text(pair("Smart Engineering Platform for Strength of Materials", "منصة هندسية ذكية لمقاومة المواد")))}</p>
              <div class="helper-code">${esc(state.formula || text(pair("Add a formula to the report.", "أضف معادلة إلى التقرير.")))}</div>
              <div class="export-preview-block">
                <h3>${esc(text(pair("Inputs", "المدخلات")))}</h3>
                ${inputsList.length ? `<ul class="export-preview-list">${inputsList.map(function (item) { return `<li>${esc(item)}</li>`; }).join("")}</ul>` : `<p>${esc(text(pair("No inputs added yet.", "لم تتم إضافة مدخلات بعد.")))}</p>`}
              </div>
              <div class="export-preview-block">
                <h3>${esc(text(pair("Final answer", "الإجابة النهائية")))}</h3>
                <div class="result-value">${esc(state.finalAnswer || "--")}</div>
              </div>
              <div class="export-preview-block">
                <h3>${esc(text(pair("Step-by-step solution", "الحل خطوة بخطوة")))}</h3>
                ${stepsList.length ? `<ol class="export-preview-list">${stepsList.map(function (item) { return `<li>${esc(item)}</li>`; }).join("")}</ol>` : `<p>${esc(text(pair("No steps added yet.", "لم تتم إضافة خطوات بعد.")))}</p>`}
              </div>
            </div>
          </article>
        </div>
      </section>
    `;

    root.querySelector("#export-report-select").addEventListener("change", function (event) {
      if (event.target.value === "") {
        return;
      }

      loadReport(Number(event.target.value));
      render();
    });

    root.querySelector("#export-preview").addEventListener("click", function () {
      state.topic = root.querySelector("#export-topic").value.trim();
      state.formula = root.querySelector("#export-formula").value.trim();
      state.inputs = root.querySelector("#export-inputs").value;
      state.finalAnswer = root.querySelector("#export-answer").value.trim();
      state.steps = root.querySelector("#export-steps").value;
      render();
    });

    root.querySelector("#export-print").addEventListener("click", function () {
      window.print();
    });

    root.querySelector("#export-clear").addEventListener("click", function () {
      state.topic = "";
      state.formula = "";
      state.inputs = "";
      state.finalAnswer = "";
      state.steps = "";
      render();
    });
  }

  if (reports().length) {
    loadReport(0);
  }

  render();
  document.addEventListener(app.eventName, render);
})();
