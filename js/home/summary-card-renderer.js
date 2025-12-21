// js/components/summary-card-renderer.js
(function () {
  function renderMiniBarsFromModel(card, bars = {}) {
    const upperFill  = card.querySelector('[data-role="mini-upper"]');
    const middleFill = card.querySelector('[data-role="mini-middle"]');
    const lowerFill  = card.querySelector('[data-role="mini-lower"]');

    const upperPctEl  = card.querySelector('[data-role="mini-upper-pct"]');
    const middlePctEl = card.querySelector('[data-role="mini-middle-pct"]');
    const lowerPctEl  = card.querySelector('[data-role="mini-lower-pct"]');

    const setBar = (fillEl, pctEl, pct) => {
      if (fillEl) fillEl.style.width = `${pct}%`;
      if (pctEl)  pctEl.textContent  = `${pct}%`;
    };

    const u = Number(bars.upper ?? 0);
    const l = Number(bars.lower ?? 0);

    setBar(upperFill, upperPctEl, u);
    setBar(lowerFill, lowerPctEl, l);

    // middle은 값이 있을 때만 표시
    const m = bars.middle;
    const middleRow = middleFill?.closest(".mini-row");
    if (m === undefined || m === null) {
      if (middleRow) middleRow.style.display = "none";
    } else {
      if (middleRow) middleRow.style.display = "";
      setBar(middleFill, middlePctEl, Number(m));
    }
  }

  function renderSummaryCardInto(card, model) {
    if (!card || !model) return;

    const titleEl = card.querySelector('[data-field="title"]');
    const subEl   = card.querySelector('[data-field="subtitle"]');
    const prodEl  = card.querySelector('[data-field="produced"]');
    const totalEl = card.querySelector('[data-field="total"]');
    const pctEl   = card.querySelector('[data-field="percent"]');

    if (titleEl) titleEl.textContent = model.title ?? "";
    if (subEl)   subEl.textContent   = model.subtitle ?? "";
    if (prodEl)  prodEl.textContent  = Number(model.produced ?? 0).toLocaleString();
    if (totalEl) totalEl.textContent = Number(model.total ?? 0).toLocaleString();
    if (pctEl)   pctEl.textContent   = `${Number(model.percent ?? 0)}%`;

    const canvas = card.querySelector(".feeder-canvas");
    if (canvas && typeof window.drawFeederDonut === "function") {
      window.drawFeederDonut(
        canvas,
        Number(model.percent ?? 0),
        model.colors,
        model.donutStyle 
      );
    }
    renderMiniBarsFromModel(card, model.bars);
  }

  window.renderSummaryCardInto = renderSummaryCardInto;
})();
