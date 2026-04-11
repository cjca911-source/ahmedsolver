(function () {
  "use strict";

  const app = window.StrengthSolverApp;
  const root = document.getElementById("ai-input-root");
  const state = {
    prompt: "",
    loading: false,
    result: null,
    error: ""
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

  function statusMessage() {
    if (state.loading) {
      return {
        text: app.t("interactive.aiInput.loading", app.getLanguage()),
        state: "success"
      };
    }

    if (state.error) {
      return {
        text: state.error,
        state: "error"
      };
    }

    if (state.result) {
      return {
        text: app.t("interactive.aiInput.success", app.getLanguage()),
        state: "success"
      };
    }

    return {
      text: app.t("interactive.aiInput.ready", app.getLanguage()),
      state: "neutral"
    };
  }

  function getApiBase() {
    if (window.AhmedSolverConfig && typeof window.AhmedSolverConfig.apiBase === "string") {
      return window.AhmedSolverConfig.apiBase.replace(/\/$/, "");
    }

    if (window.location.protocol === "file:") {
      return "http://localhost:3000";
    }

    return "";
  }

  function formatKnown(known) {
    if (typeof known === "string") {
      return known;
    }

    if (!known || typeof known !== "object") {
      return "";
    }

    const label = known.name || known.symbol || "";
    const symbolPart = known.symbol && known.symbol !== known.name ? ` (${known.symbol})` : "";
    const valuePart = known.value ? `: ${known.value}` : "";
    const unitPart = known.unit ? ` ${known.unit}` : "";
    return `${label}${symbolPart}${valuePart}${unitPart}`.trim();
  }

  function buildSolutionSteps(result) {
    if (result && !result.structured && typeof result.result === "string" && result.result.trim()) {
      return result.result.split(/\n+/).filter(Boolean).map(function (step, index) {
        return `<article class="step-card"><h4>${index + 1}. ${esc(app.t("interactive.aiInput.stepLabel", app.getLanguage()))}</h4><p>${esc(step)}</p></article>`;
      }).join("");
    }

    const steps = result && result.structured && Array.isArray(result.structured.steps)
      ? result.structured.steps
      : [];

    if (!steps.length) {
      return `<div class="empty-state"><p>${esc(app.t("interactive.aiInput.noSteps", app.getLanguage()))}</p></div>`;
    }

    return steps.map(function (step, index) {
      return `<article class="step-card"><h4>${index + 1}. ${esc(app.t("interactive.aiInput.stepLabel", app.getLanguage()))}</h4><p>${esc(step)}</p></article>`;
    }).join("");
  }

  function buildKnowns(result) {
    const knowns = result && result.structured && Array.isArray(result.structured.knowns)
      ? result.structured.knowns
      : [];

    if (!knowns.length) {
      return `<div class="empty-state"><p>${esc(app.t("interactive.aiInput.noKnowns", app.getLanguage()))}</p></div>`;
    }

    return `<div class="summary-list">${knowns.map(function (known, index) {
      return `<div class="summary-item"><span>${esc(`${app.t("interactive.aiInput.knownLabel", app.getLanguage())} ${index + 1}`)}</span><strong>${esc(formatKnown(known))}</strong></div>`;
    }).join("")}</div>`;
  }

  function render() {
    const status = statusMessage();
    const result = state.result;
    const structured = result && result.structured ? result.structured : null;
    const solutionText = result
      ? (typeof result.solution === "string" && result.solution.trim()
        ? result.solution
        : (typeof result.result === "string" && result.result.trim() ? result.result : ""))
      : "";
    const summaryRows = structured ? [
      {
        label: app.t("interactive.aiInput.detectedTopic", app.getLanguage()),
        value: structured.topic || "--"
      },
      {
        label: app.t("interactive.aiInput.unknownLabel", app.getLanguage()),
        value: structured.unknown || "--"
      },
      {
        label: app.t("interactive.aiInput.formulaLabel", app.getLanguage()),
        value: structured.formula || "--"
      }
    ] : [];

    root.innerHTML = `
      <section class="page-hero fade-in-up">
        <div class="page-hero__split">
          <div>
            <span class="page-badge">${esc(app.t("interactive.aiInput.kicker", app.getLanguage()))}</span>
            <h1>${esc(app.t("topics.aiInput.title", app.getLanguage()))}</h1>
            <p>${esc(app.t("interactive.aiInput.subtitle", app.getLanguage()))}</p>

            <div class="placeholder-actions">
              <a class="button button-primary" href="${app.buildUrl("index.html#platform-tools")}">${esc(app.t("common.backToTopics", app.getLanguage()))}</a>
              <a class="button button-secondary" href="${app.buildUrl("pages/question-bank.html")}">${esc(app.t("topics.questionBank.title", app.getLanguage()))}</a>
            </div>
          </div>

          <aside class="hero-side-card">
            <span class="section-chip">${esc(app.t("interactive.shared.formula", app.getLanguage()))}</span>
            <p>${esc(app.t("interactive.aiInput.explanation", app.getLanguage()))}</p>
            <div class="formula-display">${esc(app.t("interactive.aiInput.flowLine", app.getLanguage()))}</div>
            <p class="hint-line">${esc(app.t("interactive.aiInput.apiNote", app.getLanguage()))}</p>
          </aside>
        </div>
      </section>

      <section class="tool-page section-block">
        <div class="module-grid">
          <article class="module-panel glass-card">
            <div class="module-panel__header">
              <span class="section-chip">${esc(app.t("interactive.shared.inputs", app.getLanguage()))}</span>
              <h2>${esc(app.t("interactive.aiInput.panelTitle", app.getLanguage()))}</h2>
            </div>

            <form id="ai-input-form" novalidate>
              <div class="field-grid">
                <div class="field field--full">
                  <label for="ai-problem-text">${esc(app.t("interactive.aiInput.problemLabel", app.getLanguage()))}</label>
                  <textarea
                    id="ai-problem-text"
                    class="text-control ai-textarea"
                    placeholder="${esc(app.t("interactive.aiInput.problemPlaceholder", app.getLanguage()))}"
                  >${esc(state.prompt)}</textarea>
                </div>
              </div>

              <div class="action-row">
                <button type="submit" class="button button-primary" ${state.loading ? "disabled" : ""}>${esc(app.t("interactive.aiInput.solveButton", app.getLanguage()))}</button>
                <button type="button" class="button button-secondary" id="ai-input-clear" ${state.loading ? "disabled" : ""}>${esc(app.t("common.clear", app.getLanguage()))}</button>
              </div>

              <div class="status-banner is-visible" id="ai-input-status" data-state="${esc(status.state)}">${esc(status.text)}</div>
            </form>
          </article>

          <article class="module-panel glass-card">
            <div class="module-panel__header">
              <span class="section-chip">${esc(app.t("interactive.shared.results", app.getLanguage()))}</span>
              <h2>${esc(app.t("interactive.aiInput.resultTitle", app.getLanguage()))}</h2>
            </div>

            <div class="result-block" aria-live="polite">
              <div class="result-card">
                <div class="field-title">${esc(app.t("interactive.aiInput.solutionLabel", app.getLanguage()))}</div>
                <div class="ai-solution-text">${solutionText ? esc(solutionText) : esc(app.t("interactive.aiInput.resultPlaceholder", app.getLanguage()))}</div>
              </div>

              ${summaryRows.length ? `<div class="result-card"><div class="field-title">${esc(app.t("interactive.shared.summary", app.getLanguage()))}</div><div class="summary-list">${summaryRows.map(function (item) { return `<div class="summary-item"><span>${esc(item.label)}</span><strong>${esc(item.value)}</strong></div>`; }).join("")}</div></div>` : ""}
            </div>
          </article>
        </div>

        <div class="module-grid">
          <article class="module-panel glass-card">
            <div class="module-panel__header">
              <span class="section-chip">${esc(app.t("interactive.aiInput.knownsTitle", app.getLanguage()))}</span>
              <h2>${esc(app.t("interactive.aiInput.structuredTitle", app.getLanguage()))}</h2>
            </div>
            ${buildKnowns(result)}
          </article>

          <article class="module-panel glass-card">
            <div class="module-panel__header">
              <span class="section-chip">${esc(app.t("interactive.shared.steps", app.getLanguage()))}</span>
              <h2>${esc(app.t("interactive.aiInput.stepsTitle", app.getLanguage()))}</h2>
            </div>
            <div class="steps-list">
              ${buildSolutionSteps(result)}
            </div>
          </article>
        </div>
      </section>
    `;

    const form = root.querySelector("#ai-input-form");
    const textarea = root.querySelector("#ai-problem-text");
    const clearButton = root.querySelector("#ai-input-clear");

    textarea.addEventListener("input", function () {
      state.prompt = textarea.value;
      state.error = "";
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (state.loading) {
        return;
      }

      const prompt = textarea.value.trim();
      state.prompt = textarea.value;
      state.error = "";

      if (!prompt) {
        state.result = null;
        state.error = app.t("interactive.aiInput.validationPrompt", app.getLanguage());
        render();
        return;
      }

      state.loading = true;
      render();

      try {
        const response = await fetch("http://127.0.0.1:3000/api/solve-text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ prompt: prompt })
        });

      const text = await response.text();
console.log("RAW RESPONSE:", text);

let payload;
try {
  payload = JSON.parse(text);
} catch (e) {
  throw new Error("Server did not return valid JSON: " + text);
}

        if (!response.ok) {
          throw new Error(payload.error || app.t("interactive.aiInput.errorFallback", app.getLanguage()));
        }

        state.result = payload;
      } catch (error) {
        state.result = null;
        state.error = error.message || app.t("interactive.aiInput.errorFallback", app.getLanguage());
      } finally {
        state.loading = false;
        render();
      }
    });

    clearButton.addEventListener("click", function () {
      state.prompt = "";
      state.loading = false;
      state.result = null;
      state.error = "";
      render();
    });
  }

  render();
  document.addEventListener(app.eventName, render);
})();
