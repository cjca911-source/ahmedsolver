(function () {
  "use strict";

  const app = window.StrengthSolverApp;
  const dataset = window.StrengthSolverData && window.StrengthSolverData.questions;
  const root = document.getElementById("quiz-root");
  const state = { topic: "all", started: false, index: 0, score: 0, submitted: false, selected: null, questions: [] };

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

  function buildQuizSet() {
    const filtered = dataset.quiz.filter(function (item) {
      return state.topic === "all" || item.topic === state.topic;
    });

    state.questions = filtered.slice();
    state.started = true;
    state.index = 0;
    state.score = 0;
    state.submitted = false;
    state.selected = null;
  }

  function currentQuestion() {
    return state.questions[state.index] || null;
  }

  function choiceClass(index, question) {
    if (!state.submitted) {
      return "";
    }

    if (index === question.correctIndex) {
      return " is-correct";
    }

    if (index === state.selected) {
      return " is-wrong";
    }

    return "";
  }

  function render() {
    const topics = Array.from(new Set(dataset.quiz.map(function (item) { return item.topic; })));
    const question = currentQuestion();
    const isFinished = state.started && state.index >= state.questions.length && state.questions.length > 0;

    root.innerHTML = `
      <section class="page-hero fade-in-up">
        <div class="page-hero__split">
          <div>
            <span class="page-badge">${esc(text(pair("Quiz Mode", "وضع الاختبار")))}</span>
            <h1>${esc(app.t("topics.quiz.title", app.getLanguage()))}</h1>
            <p>${esc(text(pair("Practice one question at a time with instant feedback, topic selection, and a final score summary.", "تدرّب على سؤال واحد في كل مرة مع تغذية راجعة فورية واختيار الموضوع وملخص نهائي للنتيجة.")))}</p>
          </div>
          <aside class="hero-side-card">
            <span class="section-chip">${esc(text(pair("Quiz setup", "إعداد الاختبار")))}</span>
            <p>${esc(text(pair("Choose a topic to focus your review, or keep all topics for mixed practice.", "اختر موضوعاً للتركيز في المراجعة أو اترك جميع الموضوعات لممارسة متنوعة.")))}</p>
            <div class="formula-display">${esc(text(pair(`${dataset.quiz.length} sample questions`, `${dataset.quiz.length} سؤالاً تجريبياً`)))}</div>
          </aside>
        </div>
      </section>

      <section class="tool-page section-block">
        <div class="module-grid">
          <article class="module-panel glass-card">
            <div class="module-panel__header">
              <span class="section-chip">${esc(text(pair("Topic filter", "تصفية الموضوع")))}</span>
              <h2>${esc(text(pair("Choose your quiz set", "اختر مجموعة الاختبار")))}</h2>
            </div>
            <div class="field">
              <label for="quiz-topic">${esc(text(pair("Topic", "الموضوع")))}</label>
              <select id="quiz-topic" class="select-control">
                <option value="all">${esc(text(pair("All topics", "كل الموضوعات")))}</option>
                ${topics.map(function (topic) { return `<option value="${topic}"${topic === state.topic ? " selected" : ""}>${esc(topicLabel(topic))}</option>`; }).join("")}
              </select>
            </div>
            <div class="action-row">
              <button type="button" class="button button-primary" id="quiz-start">${esc(text(pair(state.started ? "Restart quiz" : "Start quiz", state.started ? "إعادة الاختبار" : "بدء الاختبار")))}</button>
              <a class="button button-secondary" href="${app.buildUrl("pages/question-bank.html")}">${esc(app.t("topics.questionBank.title", app.getLanguage()))}</a>
            </div>
          </article>

          <article class="module-panel glass-card">
            <div class="module-panel__header">
              <span class="section-chip">${esc(text(pair("Progress", "التقدم")))}</span>
              <h2>${esc(text(pair("Quiz status", "حالة الاختبار")))}</h2>
            </div>
            <div class="summary-list">
              <div class="summary-item"><span>${esc(text(pair("Selected topic", "الموضوع المختار")))}</span><strong>${esc(state.topic === "all" ? text(pair("All topics", "كل الموضوعات")) : topicLabel(state.topic))}</strong></div>
              <div class="summary-item"><span>${esc(text(pair("Questions in set", "عدد أسئلة المجموعة")))}</span><strong>${state.questions.length || (state.topic === "all" ? dataset.quiz.length : dataset.quiz.filter(function (item) { return item.topic === state.topic; }).length)}</strong></div>
              <div class="summary-item"><span>${esc(text(pair("Current score", "النتيجة الحالية")))}</span><strong>${state.score}</strong></div>
            </div>
          </article>
        </div>

        ${!state.started ? `<div class="empty-state"><p>${esc(text(pair("Start a quiz to answer one question at a time.", "ابدأ الاختبار للإجابة عن الأسئلة واحداً تلو الآخر.")))}</p></div>` : ""}

        ${question ? `
          <article class="glass-card quiz-card">
            <div class="quiz-card__meta">
              <span class="section-chip">${esc(topicLabel(question.topic))}</span>
              <span class="section-chip">${esc(text(pair(`Question ${state.index + 1} of ${state.questions.length}`, `السؤال ${state.index + 1} من ${state.questions.length}`)))}</span>
            </div>
            <h2>${esc(text(question.prompt))}</h2>
            <div class="quiz-choice-list">
              ${question.options.map(function (option, index) {
                return `<button type="button" class="quiz-choice${state.selected === index && !state.submitted ? " is-selected" : ""}${choiceClass(index, question)}" data-choice="${index}">${esc(text(option))}</button>`;
              }).join("")}
            </div>
            ${state.submitted ? `<div class="quiz-feedback ${state.selected === question.correctIndex ? "is-correct" : "is-wrong"}"><strong>${esc(text(state.selected === question.correctIndex ? pair("Correct", "صحيح") : pair("Incorrect", "غير صحيح")))}:</strong> ${esc(text(question.explanation))}</div>` : ""}
            <div class="action-row">
              <button type="button" class="button button-primary" id="quiz-submit">${esc(text(pair("Check answer", "تحقق من الإجابة")))}</button>
              ${state.submitted ? `<button type="button" class="button button-secondary" id="quiz-next">${esc(text(pair(state.index === state.questions.length - 1 ? "Finish quiz" : "Next question", state.index === state.questions.length - 1 ? "إنهاء الاختبار" : "السؤال التالي")))}</button>` : ""}
            </div>
          </article>
        ` : ""}

        ${isFinished ? `
          <article class="glass-card quiz-card">
            <h2>${esc(text(pair("Quiz completed", "اكتمل الاختبار")))}</h2>
            <p>${esc(text(pair(`You scored ${state.score} out of ${state.questions.length}.`, `لقد حصلت على ${state.score} من ${state.questions.length}.`)))}</p>
            <div class="metric-grid">
              <div class="metric-card"><span>${esc(text(pair("Final score", "النتيجة النهائية")))}</span><strong>${state.score}/${state.questions.length}</strong></div>
              <div class="metric-card"><span>${esc(text(pair("Topic set", "مجموعة الموضوع")))}</span><strong>${esc(state.topic === "all" ? text(pair("Mixed", "متنوع")) : topicLabel(state.topic))}</strong></div>
            </div>
            <div class="action-row">
              <button type="button" class="button button-primary" id="quiz-restart">${esc(text(pair("Restart quiz", "إعادة الاختبار")))}</button>
            </div>
          </article>
        ` : ""}
      </section>
    `;

    root.querySelector("#quiz-topic").addEventListener("change", function (event) {
      state.topic = event.target.value;
      if (!state.started) {
        render();
      }
    });

    root.querySelector("#quiz-start").addEventListener("click", function () {
      buildQuizSet();
      render();
    });

    if (question) {
      root.querySelectorAll("[data-choice]").forEach(function (button) {
        button.addEventListener("click", function () {
          if (state.submitted) {
            return;
          }

          state.selected = Number(button.getAttribute("data-choice"));
          root.querySelectorAll("[data-choice]").forEach(function (item) { item.classList.remove("is-selected"); });
          button.classList.add("is-selected");
        });
      });

      root.querySelector("#quiz-submit").addEventListener("click", function () {
        if (state.selected == null || state.submitted) {
          return;
        }

        state.submitted = true;
        if (state.selected === question.correctIndex) {
          state.score += 1;
        }
        render();
      });

      if (state.submitted) {
        root.querySelector("#quiz-next").addEventListener("click", function () {
          state.index += 1;
          state.selected = null;
          state.submitted = false;
          render();
        });
      }
    }

    if (isFinished) {
      root.querySelector("#quiz-restart").addEventListener("click", function () {
        buildQuizSet();
        render();
      });
    }
  }

  render();
  document.addEventListener(app.eventName, render);
})();
