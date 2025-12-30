/* =========================
   nfpms.app.js
   - 렌더/도넛/전환 로직(공통)
   ========================= */
(function () {
  "use strict";

  /* =========================================================
     0) 유틸
  ========================================================= */
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, Number(v) || 0));
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(text);
  }

  function getCssVar(varName, fallback) {
    const wrap = document.querySelector(".nfpms-wrap") || document.documentElement;
    const v = getComputedStyle(wrap).getPropertyValue(varName).trim();
    return v || fallback;
  }

  /* =========================================================
     0-1) 페이지별 라인 필터/시작키 지원
  ========================================================= */
  function getActiveLines() {
    const all = Array.isArray(window.NFPMS_LINES) ? window.NFPMS_LINES : [];
    const page = window.NFPMS_PAGE || {};

    if (page.filterPrefix) {
      return all.filter((l) => String(l.key || "").startsWith(page.filterPrefix));
    }
    return all;
  }

  function findIndexByKey(lines, key) {
    if (!key) return 0;
    const idx = lines.findIndex((l) => l.key === key);
    return idx >= 0 ? idx : 0;
  }

  /* =========================================================
     1) 좌측 카드 더미 값 생성(실데이터 붙기 전)
     - Target은 line.totalTarget 고정
     - Actual은 공정별로 약간씩 다르게 
  ========================================================= */
  function makeProcMetrics(line) {
    const t = line.totalTarget;
    const base = Math.max(0, Math.min(t, line.totalActual));
    const n = line.processes.length;

    // 공정이 아래로 갈수록 약간 낮아지는 시각적 흐름
    return line.processes.map((name, idx) => {
      const drift = Math.round((idx / Math.max(1, n - 1)) * 120); // 0..120
      const actual = Math.max(0, Math.min(t, base - drift));
      const remain = Math.max(0, t - actual);
      const pct = t > 0 ? (actual / t) * 100 : 0;
      return { name, target: t, actual, remain, pct };
    });
  }

  /* =========================================================
     2) 도넛(톱니)
     - CSS 변수로 컬러 변경 가능:
       .nfpms-wrap { --donut-start:#FF8A1E; --donut-end:#FFD84F; }
  ========================================================= */
  const CONFIG = {
    totalTeeth: 23,
    gapPx: 8,
    slantDegree: 7.5,
    rOut: 165,
    rIn: 138,
    startAngle: -90,
    borderRadius: 1,
    colors: {
      empty: "#2d323e",
      start: null,
      end: null,
    },
  };

  function polarToCartesian(cx, cy, r, deg) {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function createFixedGapPath(cx, cy, rOut, rIn, aStart, aStep, gapPx, slant) {
    const gapDegOut = (gapPx / rOut) * (180 / Math.PI);
    const gapDegIn = (gapPx / rIn) * (180 / Math.PI);

    const a0_out = aStart + gapDegOut / 2;
    const a1_out = aStart + aStep - gapDegOut / 2;

    const a0_in = aStart + gapDegIn / 2 + slant;
    const a1_in = aStart + aStep - gapDegIn / 2 + slant;

    const p0 = polarToCartesian(cx, cy, rOut, a0_out);
    const p1 = polarToCartesian(cx, cy, rOut, a1_out);
    const p2 = polarToCartesian(cx, cy, rIn, a1_in);
    const p3 = polarToCartesian(cx, cy, rIn, a0_in);

    return `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}
            L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}
            L ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}
            L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)} Z`;
  }

  function interpolateColor(c1, c2, factor) {
    const hex = (x) => parseInt(x.replace("#", ""), 16);
    const r1 = (hex(c1) >> 16) & 255,
      g1 = (hex(c1) >> 8) & 255,
      b1 = hex(c1) & 255;
    const r2 = (hex(c2) >> 16) & 255,
      g2 = (hex(c2) >> 8) & 255,
      b2 = hex(c2) & 255;
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function resolveDonutColors() {
    // CSS에서 지정하면 그걸 우선 사용
    const start = getCssVar("--donut-start", "#00f2ff");
    const end = getCssVar("--donut-end", "#8a2be2");
    CONFIG.colors.start = start;
    CONFIG.colors.end = end;
  }

  function renderDashboard(value) {
    const svg = document.getElementById("pgGearSvg");
    if (!svg) return;

    svg.innerHTML = "";
    const cx = 180,
      cy = 180;
    const step = 360 / CONFIG.totalTeeth;
    const filledCount = Math.round(CONFIG.totalTeeth * (value / 100));

    const drawTeeth = (count, isHighlight) => {
      for (let i = 0; i < count; i++) {
        const aStart = CONFIG.startAngle + i * step;
        const factor = count > 1 ? i / (count - 1) : 0;

        const color = isHighlight
          ? interpolateColor(CONFIG.colors.start, CONFIG.colors.end, factor)
          : CONFIG.colors.empty;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute(
          "d",
          createFixedGapPath(
            cx,
            cy,
            CONFIG.rOut,
            CONFIG.rIn,
            aStart,
            step,
            CONFIG.gapPx,
            CONFIG.slantDegree
          )
        );
        path.setAttribute("fill", color);
        path.setAttribute("stroke", color);
        path.setAttribute("stroke-width", CONFIG.borderRadius * 2);
        path.setAttribute("stroke-linejoin", "round");
        svg.appendChild(path);
      }
    };

    drawTeeth(CONFIG.totalTeeth, false);
    drawTeeth(filledCount, true);
  }

  function updateProgress(val) {
    const el = document.getElementById("pgPctValue");
    if (!el) return;

    const duration = 900;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = `${Math.floor(progress * val)}%`;
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
    renderDashboard(val);
  }

  /* =========================================================
     3) 메인 렌더
  ========================================================= */
  function renderLine(line) {
    // 상단 메타 (HTML에 metaOrder가 없으면 그냥 무시됨)
    setText("metaOrder", line.order);
    setText("metaTotal", line.totalTarget);
    setText("metaActual", line.totalActual);
    setText("metaRemain", Math.max(0, line.totalTarget - line.totalActual));

    // 라인 타이틀
    setText("lineName", line.lineName);

    // 우측 메인 타이틀
    setText("metaOrder", line.order || "");

    // 우측 서브 타이틀 (UPPER FEEDER IN PRODUCTION)
    setText("metaSub", line.subTitle || "");

    // 우측 빅넘버
    setText("bigActual", line.totalActual);
    setText("bigTarget", line.totalTarget);

    // 우측 딜레이
    const delayList = document.getElementById("delayList");
    if (delayList) {
      delayList.innerHTML = "";

      if (!line.delays || line.delays.length === 0) {
        const ok = document.createElement("div");
        ok.className = "delay-item delay-item--ok";
        ok.innerHTML = `<span class="delay-text">NO DELAYS</span>`;
        delayList.appendChild(ok);
      } else {
        line.delays.forEach((d) => {
          const item = document.createElement("div");
          item.className = "delay-item";
          item.innerHTML = `
            <img src="./images/causion.png" alt="delay" class="delay-icon" />
            <span class="delay-text">${escapeHtml(d)}</span>
          `;
          delayList.appendChild(item);
        });
      }
    }

    // 좌측 공정 카드
    const grid = document.getElementById("procGrid");
    if (grid) {
      grid.innerHTML = "";
      const metrics = makeProcMetrics(line);

      metrics.forEach((m) => {
        const card = document.createElement("article");
        card.className = "proc-card";

        const isDelayed = (line.delays || []).some(
          (x) => String(x).toUpperCase() === String(m.name).toUpperCase()
        );
        if (isDelayed) card.classList.add("proc-card--delay");

        card.innerHTML = `
          <div class="proc-head">
            <div class="proc-name">${escapeHtml(m.name).toUpperCase()}</div>
            <div class="proc-mini">
              <span class="proc-mini-label">Target</span>
              <span class="proc-mini-val">${m.target}</span>
              <span class="proc-mini-sep">|</span>
              <span class="proc-mini-label">Remain</span>
              <span class="proc-mini-val ${m.remain > 0 ? "proc-mini-val--remain" : ""}">${m.remain}</span>
            </div>
          </div>

          <div class="proc-bar">
            <div class="proc-track">
              <div class="proc-fill" style="width:${clamp(m.pct, 0, 100).toFixed(1)}%"></div>
            </div>
            <div class="proc-pct">${clamp(m.pct, 0, 100).toFixed(0)}%</div>
          </div>

          <div class="proc-numbers">
            <div class="num-chip"><span>TGT</span><b>${m.target}</b></div>
            <div class="num-chip num-chip--actual"><span>ACT</span><b>${m.actual}</b></div>
            <div class="num-chip num-chip--remain ${isDelayed ? "num-chip--danger" : ""}"><span>REM</span><b>${m.remain}</b></div>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    // 도넛 퍼센트
    const pct = line.totalTarget > 0 ? Math.round((line.totalActual / line.totalTarget) * 100) : 0;
    updateProgress(clamp(pct, 0, 100));
  }

  /* =========================================================
     4) 초기 렌더 + 페이지(라인) 전환
  ========================================================= */
  let activeIndex = 0;
  let rotateTimer = null;

  function showIndex(i) {
    const lines = getActiveLines();
    if (!lines.length) {
      console.warn("[nfpms] no lines for this page. check filterPrefix/key.");
      return;
    }
    activeIndex = (i + lines.length) % lines.length;
    renderLine(lines[activeIndex]);
  }

  // 외부에서 전환이 필요하면 window로 노출(선택)
  window.NFPMS_showIndex = showIndex;

  window.addEventListener("load", () => {
    resolveDonutColors();

    const lines = getActiveLines();
    if (!lines.length) {
      console.warn("[nfpms] window.NFPMS_LINES is empty or filtered out. Check nfpms.line.js + NFPMS_PAGE.");
      return;
    }

    const page = window.NFPMS_PAGE || {};
    activeIndex = findIndexByKey(lines, page.startKey);
    renderLine(lines[activeIndex]);

    // 자동 전환(페이지별 옵션)
    if (rotateTimer) clearInterval(rotateTimer);
    if (page.autoRotate) {
      rotateTimer = setInterval(() => showIndex(activeIndex + 1), page.rotateMs || 10000);
    }
  });
})();
