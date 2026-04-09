(function () {
  "use strict";

  const app = window.StrengthSolverApp;
  const dataset = window.StrengthSolverData && window.StrengthSolverData.questions;
  const root = document.getElementById("question-bank-root");
  const state = { topic: "all", difficulty: "all", openAnswers: {} };

  if (!app || !dataset || !root) {
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

  function topicLabel(topic) {
    const map = {
      stress: "topics.stress.title",
      strain: "topics.strain.title",
      torsion: "topics.torsion.title",
      bending: "topics.bending.title",
      mohrsCircle: "topics.mohrsCircle.title",
      beamReactions: "topics.beamReactions.title",
      thermalStress: "topics.thermalStress.title"
    };

    return app.t(map[topic], app.getLanguage());
  }

  function difficultyLabel(level) {
    const labels = {
      easy: pair("Easy", "سهل"),
      medium: pair("Medium", "متوسط"),
      hard: pair("Hard", "صعب")
    };

    return text(labels[level] || level);
  }

  function filteredQuestions() {
    return dataset.bank.filter(function (item) {
      const topicMatch = state.topic === "all" || item.topic === state.topic;
      const difficultyMatch = state.difficulty === "all" || item.difficulty === state.difficulty;
      return topicMatch && difficultyMatch;
    });
  }

  function render() {
    const questions = filteredQuestions();
    const topics = Array.from(new Set(dataset.bank.map(function (item) { return item.topic; })));

    root.innerHTML = `
      <section class="page-hero fade-in-up">
        <div class="page-hero__split">
          <div>
            <span class="page-badge">${esc(text(pair("Practice Library", "مكتبة تدريبية")))}</span>
            <h1>${esc(app.t("topics.questionBank.title", app.getLanguage()))}</h1>
            <p>${esc(text(pair("Browse categorized Strength of Materials problems and reveal hints or solutions when you need them.", "استعرض مسائل مقاومة المواد المصنفة حسب الموضوع والصعوبة مع إمكانية إظهار التلميحات والحلول عند الحاجة.")))}</p>
          </div>
          <aside class="hero-side-card">
            <span class="section-chip">${esc(text(pair("Filter tools", "أدوات التصفية")))}</span>
            <p>${esc(text(pair("Use the topic and difficulty filters to build focused study sets before quizzes or homework practice.", "استخدم تصفية الموضوع والصعوبة لبناء مجموعة دراسة مركزة قبل الاختبارات أو حل الواجبات.")))}</p>
            <div class="formula-display">${esc(text(pair(`${questions.length} visible problems`, `${questions.length} مسألة ظاهرة`)))}</div>
          </aside>
        </div>
      </section>

      <section class="tool-page section-block">
        <div class="module-grid">
          <article class="module-panel glass-card">
            <div class="module-panel__header">
              <span class="section-chip">${esc(text(pair("Filters", "عوامل التصفية")))}</span>
              <h2>${esc(text(pair("Build a study set", "كوّن مجموعة دراسة")))}</h2>
            </div>
            <div class="field-grid">
              <div class="field">
                <label for="question-topic">${esc(text(pair("Topic", "الموضوع")))}</label>
                <select id="question-topic" class="select-control">
                  <option value="all">${esc(text(pair("All topics", "كل الموضوعات")))}</option>
                  ${topics.map(function (topic) { return `<option value="${topic}"${topic === state.topic ? " selected" : ""}>${esc(topicLabel(topic))}</option>`; }).join("")}
                </select>
              </div>
              <div class="field">
                <label for="question-difficulty">${esc(text(pair("Difficulty", "الصعوبة")))}</label>
                <select id="question-difficulty" class="select-control">
                  <option value="all">${esc(text(pair("All levels", "كل المستويات")))}</option>
                  <option value="easy"${state.difficulty === "easy" ? " selected" : ""}>${esc(difficultyLabel("easy"))}</option>
                  <option value="medium"${state.difficulty === "medium" ? " selected" : ""}>${esc(difficultyLabel("medium"))}</option>
                  <option value="hard"${state.difficulty === "hard" ? " selected" : ""}>${esc(difficultyLabel("hard"))}</option>
                </select>
              </div>
            </div>
            <div class="action-row">
              <button type="button" class="button button-secondary" id="question-reset">${esc(text(pair("Reset filters", "إعادة تعيين التصفية")))}</button>
              <a class="button button-primary" href="${app.buildUrl("pages/quiz.html")}">${esc(app.t("topics.quiz.title", app.getLanguage()))}</a>
            </div>
          </article>

          <article class="module-panel glass-card">
            <div class="module-panel__header">
              <span class="section-chip">${esc(text(pair("Results", "النتائج")))}</span>
              <h2>${esc(text(pair("Question set summary", "ملخص مجموعة الأسئلة")))}</h2>
            </div>
            <div class="summary-list">
              <div class="summary-item"><span>${esc(text(pair("Visible problems", "المسائل الظاهرة")))}</span><strong>${questions.length}</strong></div>
              <div class="summary-item"><span>${esc(text(pair("Active topic", "الموضوع الحالي")))}</span><strong>${esc(state.topic === "all" ? text(pair("All topics", "كل الموضوعات")) : topicLabel(state.topic))}</strong></div>
              <div class="summary-item"><span>${esc(text(pair("Active difficulty", "الصعوبة الحالية")))}</span><strong>${esc(state.difficulty === "all" ? text(pair("All levels", "كل المستويات")) : difficultyLabel(state.difficulty))}</strong></div>
            </div>
          </article>
        </div>

        <div class="question-list">
          ${questions.length ? questions.map(function (question) {
            const isOpen = !!state.openAnswers[question.id];
            return `
              <article class="glass-card question-card">
                <div class="question-card__meta">
                  <span class="section-chip">${esc(topicLabel(question.topic))}</span>
                  <span class="section-chip">${esc(difficultyLabel(question.difficulty))}</span>
                </div>
                <h3>${esc(text(question.title))}</h3>
                <p>${esc(text(question.statement))}</p>
                ${question.hint ? `<div class="question-card__hint"><strong>${esc(text(pair("Hint", "تلميح")))}:</strong> ${esc(text(question.hint))}</div>` : ""}
                <div class="action-row">
                  <button type="button" class="button button-secondary" data-answer-toggle="${question.id}">${esc(text(isOpen ? pair("Hide answer", "إخفاء الإجابة") : pair("Reveal answer", "إظهار الإجابة")))}</button>
                </div>
                ${isOpen ? `<div class="question-card__answer"><strong>${esc(text(pair("Answer", "الإجابة")))}:</strong> ${esc(text(question.answer))}</div>` : ""}
              </article>
            `;
          }).join("") : `<div class="empty-state"><p>${esc(text(pair("No questions match the selected filters yet.", "لا توجد أسئلة تطابق التصفية الحالية.")))}</p></div>`}
        </div>
      </section>
    `;

    root.querySelector("#question-topic").addEventListener("change", function (event) {
      state.topic = event.target.value;
      render();
    });

    root.querySelector("#question-difficulty").addEventListener("change", function (event) {
      state.difficulty = event.target.value;
      render();
    });

    root.querySelector("#question-reset").addEventListener("click", function () {
      state.topic = "all";
      state.difficulty = "all";
      render();
    });

    root.querySelectorAll("[data-answer-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        const id = button.getAttribute("data-answer-toggle");
        state.openAnswers[id] = !state.openAnswers[id];
        render();
      });
    });
  }

  render();
  document.addEventListener(app.eventName, render);
})();
