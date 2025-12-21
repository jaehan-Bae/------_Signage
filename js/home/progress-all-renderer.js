// js/home/proc-weekly-renderer.js
(function () {
  function renderProcCard(container, title, rows) {
    if (!container) return;

    container.innerHTML = `
      <div class="proc-title">${title}</div>
      <div class="proc-list"></div>
    `;

    const list = container.querySelector(".proc-list");
    if (!list) return;

    rows.forEach((row) => {
      const item = document.createElement("div");
      item.className = "proc-item";
      item.innerHTML = `
        <div class="proc-row">
          <div class="proc-name">${row.short}</div>
          <div class="proc-pct">${row.pct}%</div>
          <div class="proc-track">
            <div class="proc-fill"></div>
          </div>
        </div>
      `;

      const fill = item.querySelector(".proc-fill");
      if (fill) {
        fill.style.width = `${Math.max(0, Math.min(100, row.pct))}%`;
        fill.style.background = row.color;
      }

      list.appendChild(item);
    });
  }

  window.renderProcCard = renderProcCard;
})();
