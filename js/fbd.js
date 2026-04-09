(function () {
  "use strict";

  const app = window.StrengthSolverApp;

  if (!app) {
    return;
  }

  function translate(key) {
    return app.t(key, app.getLanguage());
  }

  function formatNumber(value, decimals) {
    if (!Number.isFinite(value)) {
      return "--";
    }

    return new Intl.NumberFormat(app.getLanguage() === "ar" ? "ar" : "en-US", {
      maximumFractionDigits: typeof decimals === "number" ? decimals : 3,
      minimumFractionDigits: 0
    }).format(value);
  }

    function setStatus(element, message, state) {
    if (!message) {
      element.classList.remove("is-visible");
      element.textContent = "";
      element.setAttribute("data-state", "neutral");
      return;
    }

    element.textContent = message;
    element.setAttribute("data-state", state || "neutral");
      element.classList.add("is-visible");
    }

    function degreeLabel() {
      return translate("interactive.fbd.degreeShort");
    }

  function initFreeBodyDiagram() {
    const form = document.getElementById("fbd-form");

    if (!form) {
      return;
    }

    const labelField = document.getElementById("fbd-label");
    const magnitudeField = document.getElementById("fbd-magnitude");
    const angleField = document.getElementById("fbd-angle");
    const clearButton = document.getElementById("fbd-clear-forces");
    const statusBanner = document.getElementById("fbd-status");
    const canvas = document.getElementById("fbd-canvas");
    const summaryGrid = document.getElementById("fbd-summary-grid");
    const chipsContainer = document.getElementById("fbd-force-chips");
    const tableContainer = document.getElementById("fbd-force-table");
    const context = canvas.getContext("2d");

    const state = {
      forces: [],
      nextIndex: 1,
      statusKey: "interactive.shared.ready",
      statusState: "neutral"
    };

    const palette = ["#5dd3ff", "#ffc857", "#ff7b72", "#7fffd4", "#c7f464", "#7da7ff"];

    function createForce(forceInput) {
      const radians = (forceInput.angle * Math.PI) / 180;
      const fx = forceInput.magnitude * Math.cos(radians);
      const fy = forceInput.magnitude * Math.sin(radians);

      return {
        id: Date.now() + Math.random(),
        label: forceInput.label,
        magnitude: forceInput.magnitude,
        angle: forceInput.angle,
        fx: fx,
        fy: fy
      };
    }

    function getSummary() {
      const sumFx = state.forces.reduce(function (total, force) {
        return total + force.fx;
      }, 0);

      const sumFy = state.forces.reduce(function (total, force) {
        return total + force.fy;
      }, 0);

      const resultant = Math.sqrt((sumFx * sumFx) + (sumFy * sumFy));
      const angle = resultant === 0 ? 0 : (Math.atan2(sumFy, sumFx) * 180) / Math.PI;

      return {
        sumFx: sumFx,
        sumFy: sumFy,
        resultant: resultant,
        angle: angle,
        count: state.forces.length
      };
    }

    function renderSummary() {
      const summary = getSummary();
      const cards = [
        { label: translate("interactive.fbd.forceCount"), value: formatNumber(summary.count, 0) },
        { label: translate("interactive.fbd.sumFx"), value: `${formatNumber(summary.sumFx, 3)} N` },
        { label: translate("interactive.fbd.sumFy"), value: `${formatNumber(summary.sumFy, 3)} N` },
        { label: translate("interactive.fbd.resultant"), value: `${formatNumber(summary.resultant, 3)} N` },
        { label: translate("interactive.fbd.resultantAngle"), value: `${formatNumber(summary.angle, 2)} ${degreeLabel()}` }
      ];

      summaryGrid.innerHTML = cards.map(function (card) {
        return `
          <div class="metric-card">
            <span>${card.label}</span>
            <strong>${card.value}</strong>
          </div>
        `;
      }).join("");
    }

    function renderForceChips() {
      if (!state.forces.length) {
        chipsContainer.innerHTML = `
          <div class="empty-state">
            <p>${translate("interactive.fbd.emptyList")}</p>
          </div>
        `;
        return;
      }

      chipsContainer.innerHTML = state.forces.map(function (force) {
        return `
          <article class="force-chip">
            <div class="force-chip__meta">
              <span class="force-chip__title">${force.label}</span>
              <span class="force-chip__detail">${formatNumber(force.magnitude, 3)} N | ${formatNumber(force.angle, 2)} ${degreeLabel()}</span>
            </div>
            <button
              type="button"
              class="force-chip__remove"
              data-remove-force="${force.id}"
              aria-label="${translate("interactive.fbd.remove")} ${force.label}"
              title="${translate("interactive.fbd.remove")} ${force.label}"
            >
              x
            </button>
          </article>
        `;
      }).join("");
    }

    function renderForceTable() {
      if (!state.forces.length) {
        tableContainer.innerHTML = `
          <div class="empty-state">
            <p>${translate("interactive.fbd.emptyList")}</p>
          </div>
        `;
        return;
      }

      tableContainer.innerHTML = `
        <div class="table-wrap">
          <table class="tool-table">
            <thead>
              <tr>
                <th>${translate("interactive.fbd.table.label")}</th>
                <th>${translate("interactive.fbd.table.magnitude")}</th>
                <th>${translate("interactive.fbd.table.angle")}</th>
                <th>${translate("interactive.fbd.table.fx")}</th>
                <th>${translate("interactive.fbd.table.fy")}</th>
                <th>${translate("interactive.fbd.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              ${state.forces.map(function (force) {
                return `
                  <tr>
                    <td>${force.label}</td>
                    <td>${formatNumber(force.magnitude, 3)} N</td>
                    <td>${formatNumber(force.angle, 2)} ${degreeLabel()}</td>
                    <td>${formatNumber(force.fx, 3)} N</td>
                    <td>${formatNumber(force.fy, 3)} N</td>
                    <td>
                      <button type="button" class="table-action" data-remove-force="${force.id}">
                        ${translate("interactive.fbd.remove")}
                      </button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    function drawGrid(width, height) {
      const spacing = 40;

      context.save();

      for (let x = 0; x <= width; x += spacing) {
        context.beginPath();
        context.strokeStyle = x % (spacing * 5) === 0 ? "rgba(123, 172, 228, 0.14)" : "rgba(123, 172, 228, 0.07)";
        context.lineWidth = x % (spacing * 5) === 0 ? 1.3 : 1;
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }

      for (let y = 0; y <= height; y += spacing) {
        context.beginPath();
        context.strokeStyle = y % (spacing * 5) === 0 ? "rgba(123, 172, 228, 0.14)" : "rgba(123, 172, 228, 0.07)";
        context.lineWidth = y % (spacing * 5) === 0 ? 1.3 : 1;
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      context.restore();
    }

    function drawValueTag(anchorX, anchorY, lines, color) {
      const paddingX = 10;
      const lineHeight = 16;
      const visibleWidth = canvas.getBoundingClientRect().width || (canvas.width / (window.devicePixelRatio || 1));

      context.save();
      context.font = "600 12px Space Grotesk, sans-serif";

      const tagWidth = lines.reduce(function (longest, line) {
        return Math.max(longest, context.measureText(line).width);
      }, 0) + (paddingX * 2);
      const tagHeight = (lines.length * lineHeight) + 12;
      const tagX = Math.max(10, Math.min(anchorX, visibleWidth - tagWidth - 20));
      const tagY = Math.max(10, anchorY - tagHeight);

      context.fillStyle = "rgba(5, 16, 28, 0.92)";
      context.strokeStyle = color;
      context.lineWidth = 1.4;
      context.beginPath();
      context.rect(tagX, tagY, tagWidth, tagHeight);
      context.fill();
      context.stroke();

      context.fillStyle = "#eff6ff";
      context.font = "600 12px Space Grotesk, sans-serif";
      lines.forEach(function (line, index) {
        context.fillText(line, tagX + paddingX, tagY + 18 + (index * lineHeight));
      });
      context.restore();
    }

    function drawArrow(startX, startY, endX, endY, color, options) {
      const angle = Math.atan2(endY - startY, endX - startX);
      const headLength = options && options.headLength ? options.headLength : 16;
      const dashed = options && options.dashed;

      context.save();
      context.strokeStyle = color;
      context.fillStyle = color;
      context.lineWidth = options && options.lineWidth ? options.lineWidth : 3.5;
      context.lineCap = "round";
      context.lineJoin = "round";

      if (dashed) {
        context.setLineDash([8, 8]);
      }

      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(endX, endY);
      context.stroke();
      context.setLineDash([]);

      context.beginPath();
      context.moveTo(endX, endY);
      context.lineTo(endX - (headLength * Math.cos(angle - Math.PI / 6)), endY - (headLength * Math.sin(angle - Math.PI / 6)));
      context.lineTo(endX - (headLength * Math.cos(angle + Math.PI / 6)), endY - (headLength * Math.sin(angle + Math.PI / 6)));
      context.closePath();
      context.fill();

      if (options && options.labelLines && options.labelLines.length) {
        const midX = startX + ((endX - startX) * 0.6);
        const midY = startY + ((endY - startY) * 0.6);
        const normalX = -Math.sin(angle);
        const normalY = Math.cos(angle);
        const offsetDistance = options.offsetDistance || 22;

        drawValueTag(
          midX + (normalX * offsetDistance),
          midY + (normalY * offsetDistance),
          options.labelLines,
          color
        );
      }

      context.restore();
    }

    function drawAxes(width, height, centerX, centerY) {
      context.save();
      context.strokeStyle = "rgba(123, 172, 228, 0.75)";
      context.fillStyle = "rgba(123, 172, 228, 0.92)";
      context.lineWidth = 2;

      context.beginPath();
      context.moveTo(30, centerY);
      context.lineTo(width - 30, centerY);
      context.stroke();

      context.beginPath();
      context.moveTo(centerX, height - 30);
      context.lineTo(centerX, 30);
      context.stroke();

      drawArrow(width - 70, centerY, width - 30, centerY, "rgba(123, 172, 228, 0.92)", {
        labelLines: ["x"],
        headLength: 12,
        lineWidth: 2.5,
        offsetDistance: 18
      });

      drawArrow(centerX, 70, centerX, 30, "rgba(123, 172, 228, 0.92)", {
        labelLines: ["y"],
        headLength: 12,
        lineWidth: 2.5,
        offsetDistance: 18
      });

      context.beginPath();
      context.arc(centerX, centerY, 8, 0, Math.PI * 2);
      context.fillStyle = "rgba(255, 255, 255, 0.9)";
      context.fill();
      context.restore();
    }

    function drawDiagram() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(300, Math.round(rect.width));
      const height = Math.max(320, Math.round(rect.height));

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      drawGrid(width, height);
      drawAxes(width, height, centerX, centerY);

      if (!state.forces.length) {
        context.save();
        context.fillStyle = "rgba(255, 255, 255, 0.72)";
        context.font = "500 16px Space Grotesk, sans-serif";
        context.fillText(translate("interactive.fbd.emptyList"), 38, 42);
        context.restore();
        return;
      }

      const summary = getSummary();
      const maximumMagnitude = Math.max.apply(null, state.forces.map(function (force) {
        return force.magnitude;
      }).concat(summary.resultant || 0, 1));
      const scale = (Math.min(width, height) * 0.32) / maximumMagnitude;

      state.forces.forEach(function (force, index) {
        const radians = (force.angle * Math.PI) / 180;
        const endX = centerX + (Math.cos(radians) * force.magnitude * scale);
        const endY = centerY - (Math.sin(radians) * force.magnitude * scale);

        drawArrow(centerX, centerY, endX, endY, palette[index % palette.length], {
          labelLines: [
            force.label,
            `${formatNumber(force.magnitude, 2)} N`,
            `${formatNumber(force.angle, 1)} ${degreeLabel()}`
          ],
          offsetDistance: 18 + ((index % 3) * 14)
        });
      });

      if (summary.resultant > 0.000001) {
        const resultantAngle = Math.atan2(summary.sumFy, summary.sumFx);
        const endX = centerX + (Math.cos(resultantAngle) * summary.resultant * scale);
        const endY = centerY - (Math.sin(resultantAngle) * summary.resultant * scale);

        drawArrow(centerX, centerY, endX, endY, "#ffc857", {
          labelLines: [
            "R",
            `${formatNumber(summary.resultant, 2)} N`,
            `${formatNumber((resultantAngle * 180) / Math.PI, 1)} ${degreeLabel()}`
          ],
          dashed: true,
          headLength: 18,
          offsetDistance: 34
        });
      }
    }

    function validateForceInput() {
      const magnitudeWrapper = magnitudeField.closest(".field");
      const angleWrapper = angleField.closest(".field");

      magnitudeWrapper.classList.remove("field-error");
      angleWrapper.classList.remove("field-error");

      const magnitude = Number(magnitudeField.value);
      const angle = Number(angleField.value);
      const hasMagnitude = magnitudeField.value.trim() !== "";
      const hasAngle = angleField.value.trim() !== "";

      if (!hasMagnitude || !Number.isFinite(magnitude) || magnitude <= 0) {
        magnitudeWrapper.classList.add("field-error");
        state.statusKey = "interactive.fbd.magnitudeValidation";
        state.statusState = "error";
        setStatus(statusBanner, translate(state.statusKey), state.statusState);
        return null;
      }

      if (!hasAngle || !Number.isFinite(angle)) {
        angleWrapper.classList.add("field-error");
        state.statusKey = "interactive.fbd.angleValidation";
        state.statusState = "error";
        setStatus(statusBanner, translate(state.statusKey), state.statusState);
        return null;
      }

      return {
        label: labelField.value.trim() || `F${state.nextIndex}`,
        magnitude: magnitude,
        angle: angle
      };
    }

    function addForce() {
      const validated = validateForceInput();

      if (!validated) {
        return;
      }

      state.forces.push(createForce(validated));
      state.nextIndex += 1;
      state.statusKey = "interactive.fbd.addMessage";
      state.statusState = "success";

      labelField.value = "";
      magnitudeField.value = "";
      angleField.value = "";
      magnitudeField.closest(".field").classList.remove("field-error");
      angleField.closest(".field").classList.remove("field-error");

      renderAll();
    }

    function removeForce(forceId) {
      state.forces = state.forces.filter(function (force) {
        return String(force.id) !== String(forceId);
      });
      state.statusKey = state.forces.length ? "interactive.fbd.removeMessage" : "interactive.shared.ready";
      state.statusState = state.forces.length ? "success" : "neutral";
      renderAll();
    }

    function clearForces() {
      state.forces = [];
      state.nextIndex = 1;
      state.statusKey = "interactive.fbd.clearMessage";
      state.statusState = "success";
      renderAll();
    }

    function renderAll() {
      renderSummary();
      renderForceChips();
      renderForceTable();
      drawDiagram();
      setStatus(statusBanner, translate(state.statusKey), state.statusState);
    }

    function handleRemoveClick(event) {
      const removeButton = event.target.closest("[data-remove-force]");

      if (!removeButton) {
        return;
      }

      removeForce(removeButton.getAttribute("data-remove-force"));
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      addForce();
    });

    clearButton.addEventListener("click", function () {
      clearForces();
    });

    tableContainer.addEventListener("click", handleRemoveClick);
    chipsContainer.addEventListener("click", handleRemoveClick);

    window.addEventListener("resize", function () {
      drawDiagram();
    });

    document.addEventListener(app.eventName, function () {
      renderAll();
    });

    renderAll();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initFreeBodyDiagram();
  });
})();
