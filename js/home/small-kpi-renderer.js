// js/home/small-kpi-renderer.js
(function () {
  /**
   * 1) 캔버스를 CSS 크기에 맞춰서(레티나 포함) 선명하게 그리기 위한 헬퍼
   *    - canvas의 실제 픽셀 해상도 = CSS 크기 * dpr
   *    - 이후 ctx 좌표계는 CSS 픽셀 기준으로 사용 가능
   */
  function fitCanvasToCSS(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // rect가 0이면(숨김/레이아웃 전) fallback
    const cssW = Math.max(1, rect.width || 90);
    const cssH = Math.max(1, rect.height || 32);

    const pxW = Math.round(cssW * dpr);
    const pxH = Math.round(cssH * dpr);

    if (canvas.width !== pxW) canvas.width = pxW;
    if (canvas.height !== pxH) canvas.height = pxH;

    const ctx = canvas.getContext("2d");
    // 좌표계를 CSS px 기준으로 맞춤
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    return { ctx, w: cssW, h: cssH };
  }

  /**
   * 2) 스파크라인 (선 + 선 아래 면 채움)
   * @param {HTMLCanvasElement} canvas
   * @param {number[]} series
   * @param {string} lineColor
   * @param {string|null} fillColor  ex) "rgba(144,189,239,0.18)"
   */
  function drawSparkline(canvas, series, lineColor, fillColor) {
    if (!canvas || !series || series.length < 2) return;

    const { ctx, w, h } = fitCanvasToCSS(canvas);

    ctx.clearRect(0, 0, w, h);

    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = Math.max(1, max - min);

    const pad = 10;
    const fillBottomGap = -100; // ★ 여기서 조절 (선 아래 면 채움 여유 공간)

    const xStep = (w - pad * 2) / (series.length - 1);
    const yOf = (v) => {
      const t = (v - min) / range;
      return h - pad - t * (h - pad * 2);
    };

    const firstX = pad;
    const lastX  = pad + (series.length - 1) * xStep;

    const strokeBottomY = h - pad;
    const fillBottomY   = h - pad - fillBottomGap;

    // 1) 선 path
    ctx.beginPath();
    series.forEach((v, i) => {
      const x = pad + i * xStep;
      const y = yOf(v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    // 2) 선 아래 면 채우기 (여유 공간 있음)
    if (fillColor) {
      ctx.lineTo(lastX, fillBottomY);
      ctx.lineTo(firstX, fillBottomY);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    // 3) 선 다시 그리기
    ctx.beginPath();
    series.forEach((v, i) => {
      const x = pad + i * xStep;
      const y = yOf(v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.5; // 얇으면 2.75~3.0까지 올리세요
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  /**
   * 3) 카드 렌더
   */
  function renderSmallKpiCardInto(card, model) {
    if (!card || !model) return;

    // 카드 전체 배경은 흰색 유지 (전체에 색 먹는 문제 방지)
    card.style.background = "#fff";

    // title + stitle
    const titleEl = card.querySelector('[data-field="title"]');
    if (titleEl) {
      titleEl.innerHTML = `${model.title} <span class="stitle">${model.stitle}</span>`;
    }

    // value
    const valueEl = card.querySelector('[data-field="value"]');
    if (valueEl) valueEl.textContent = Number(model.value ?? 0).toLocaleString();

    // label
    const labelEl = card.querySelector('[data-field="label"]');
    if (labelEl) labelEl.textContent = model.label ?? "";

    // delta (arrow + %)
    const deltaEl = card.querySelector('[data-field="delta"]');
    if (deltaEl) {
      deltaEl.innerHTML = `
        <img class="delta-arrow" src="${model.arrowSrc}" alt="up">
        <span class="delta-text">${model.deltaPct}%</span>
      `;
      const txt = deltaEl.querySelector(".delta-text");
      if (txt) txt.style.color = model.deltaColor || "#5DAF3B";
    }

    // spark-box 배경 (캔버스 영역에만 연한 배경)
    const box = card.querySelector('[data-field="spark-box"]');
    if (box) {
      box.style.background = model.theme?.bg || "transparent";
    }

    // canvas
    const canvas = card.querySelector("canvas.spark");
    if (canvas) {
      // CSS로 크기 제어 중이면 width/height 속성은 의미가 약함.
      // 그래도 레이아웃 0일 때 대비용으로만 기본값:
      if (!canvas.width) canvas.width = 90;
      if (!canvas.height) canvas.height = 32;

      const line = model.theme?.line || "#90BDEF";

      // 선 아래 면(투명) 색상: 라인 컬러에 맞춰 고정
      // Pickering(#90BDEF), Cernavoda(#F6A255)
      const fill =
        line.toUpperCase() === "#90BDEF"
          ? "rgba(144,189,239,0.18)"
          : "rgba(246,162,85,0.18)";

      drawSparkline(canvas, model.series || [], line, fill);
    }
  }

  // 전역 노출
  window.renderSmallKpiCardInto = renderSmallKpiCardInto;
})();
