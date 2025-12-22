// ======================= 공통 함수 =======================

// 공통 퍼센트 계산
function calcPercent(produced, total) {
  if (!total || total <= 0) return 0;
  return Math.round((produced / total) * 100);
}

// 공정명 축약 (10글자 이내)
function shortenProcessName(label, shortLabel) {
  if (shortLabel && shortLabel.length <= 10) return shortLabel;

  const bracket = label && label.match(/\((.*?)\)/);
  if (bracket && bracket[1] && bracket[1].length <= 10) return bracket[1];

  if (label && /default/i.test(label)) return "Default";
  if (label && label.includes("FE")) return "FE용접";
  if (label && label.includes("PBO")) return "PBO용접";

  return (label || "").replace(/\s+/g, "").slice(0, 10);
}

// ======================= 도넛 카드 =======================

function renderFeederCard(data) {
  const card = document.querySelector(`.feeder-card[data-feeder-id="${data.id}"]`);
  if (!card) return;

  const percent = calcPercent(data.produced, data.total);

  const titleEl = card.querySelector(".feeder-title-main");
  const subTitleEl = card.querySelector(".feeder-stitle");
  const producedEl = card.querySelector('[data-field="produced"]');
  const totalEl = card.querySelector('[data-field="total"]');
  const percentEl = card.querySelector('[data-field="percent"]');

  if (titleEl) titleEl.textContent = data.name ?? "";
  if (subTitleEl) subTitleEl.textContent = data.position ?? "";
  if (producedEl) producedEl.textContent = data.produced ?? 0;
  if (totalEl) totalEl.textContent = data.total ?? 0;
  if (percentEl) percentEl.textContent = `${percent}%`;

  const canvas = card.querySelector(".feeder-canvas");
  if (
    canvas &&
    typeof window.getChartColors === "function" &&
    typeof window.drawFeederDonut === "function"
  ) {
    const colors = window.getChartColors(data.name);
    window.drawFeederDonut(canvas, percent, colors);
  }

  // ===========================
// 5. Feeder 그라데이션 바 차트
// ===========================
function renderFeederBars(targetId, items) {
  const container = document.getElementById(targetId);
  if (!container) return;

  // 기존 내용 삭제
  container.innerHTML = "";

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "pipe-bar-row";

    const label = document.createElement("span");
    label.className = "pipe-bar-label";
    label.textContent = item.position; // Upper / Middle / Lower 등

    const percent = calcPercent(item.produced, item.total);

    const percentSpan = document.createElement("span");
    percentSpan.className = "pipe-bar-percent";
    percentSpan.textContent = `${percent}%`;

    // thin-bar 생성
    const bar = document.createElement("div");
    bar.className = "thin-bar";
    bar.dataset.value = percent; // initThinBars에서 이 값을 기반으로 10칸 채움
    bar.dataset.name = item.name;

    row.appendChild(label);
    row.appendChild(percentSpan);
    row.appendChild(bar);
    container.appendChild(row);
  });

  // 실제로 10칸 세그먼트를 채우는 함수 호출
  initThinBars();
}
}

// ======================= 페이지 로딩 후 실행 =======================

document.addEventListener("DOMContentLoaded", () => {
  try {
    // 1) 도넛 카드
    const feederDummySafe = window.feederDummy;
    if (Array.isArray(feederDummySafe)) {
      feederDummySafe.forEach((data) => {
        const card = document.querySelector(`.feeder-card[data-feeder-id="${data.id}"]`);
        if (card) renderFeederCard(data);
      });
    }

    // 2) 공정별 진행현황 (HTML id는 procBarChart 가 맞음)
    const barChartEl = document.getElementById("procBarChart");
    if (barChartEl && typeof window.renderProcBarChart === "function") {
      const hasPlantWeekly =
        Array.isArray(window.procWeeklyByPlantDummy) &&
        Array.isArray(window.procDailyAccumDummy);

      if (hasPlantWeekly) {
        const weeklyItems = window.procWeeklyByPlantDummy.filter(
          (item) => item.plantId === "pickering"
        );
        window.renderProcBarChart("procBarChart", weeklyItems, window.procDailyAccumDummy);
      } else if (Array.isArray(window.procWeeklyDummy)) {
        window.renderProcBarChart("procBarChart", window.procWeeklyDummy.slice(0, 10));
      }
    }

    // 3) 지연 공정
    renderDelayStatusList();
  } catch (e) {
    console.error("[main] render failed:", e);
  }

  // ===== mini bars 채우기 =====
const cardEl = card;

// 같은 그룹(Pickering) 데이터 가져오기
const groupItems = window.feederDummy.filter(
  d => d.groupId === data.groupId
);

// UPPER / MIDDLE / LOWER 각각 매핑
groupItems.forEach(item => {
  const pct = calcPercent(item.produced, item.total);
  const key = item.position.toLowerCase(); // upper / middle / lower

  const bar = cardEl.querySelector(`[data-role="mini-${key}"]`);
  const pctEl = cardEl.querySelector(`[data-role="mini-${key}-pct"]`);

  if (bar) bar.style.width = `${pct}%`;
  if (pctEl) pctEl.textContent = `${pct}%`;
});

});

// ===========================
// Summary 카드(도넛+KPI+미니바)
// ===========================
(function () {
  function calcPercentSafe(current, total) {
    const t = Number(total || 0);
    if (!t) return 0;
    return Math.round((Number(current || 0) / t) * 100);
  }

  function renderFeederSummaryCardPatch(card) {
    if (!card) return;

    const feederId = card.dataset.feederId || "";           // pickering-upper
    const groupKey = feederId.split("-")[0].toUpperCase();  // PICKERING
    const list = window.feederDummy || window.feederDummyByContext?.[groupKey.toLowerCase()] || [];

    if (!Array.isArray(list) || !list.length) return;

    // 이 카드의 메인 데이터: feederId로 정확히 찾고, 없으면 UPPER fallback
    let main =
      list.find(d => String(d.id || "").toLowerCase() === feederId.toLowerCase()) ||
      list.find(d =>
        (String(d.name || "").toUpperCase().includes(groupKey)) &&
        (String(d.position || "").toUpperCase() === "UPPER")
      );

    if (!main) return;

    const produced = Number(main.produced || 0);
    const total = Number(main.total || 0);
    const percent = calcPercentSafe(produced, total);

    // 텍스트 
    const prodEl = card.querySelector('[data-field="produced"]');
    const totalEl = card.querySelector('[data-field="total"]');
    const pctEl = card.querySelector('[data-field="percent"]');

    if (prodEl) prodEl.textContent = produced.toLocaleString();
    if (totalEl) totalEl.textContent = total.toLocaleString();
    if (pctEl) pctEl.textContent = `${percent}%`;

    // 제목(있으면) - 기존 바인딩이 있으면 건드리기 싫으면 주석 처리 가능
    const titleEl = card.querySelector(".feeder-title-main");
    const subEl = card.querySelector(".feeder-stitle");
    if (titleEl && !titleEl.textContent) titleEl.textContent = groupKey;
    if (subEl && !subEl.textContent) subEl.textContent = "Upper Feeder";

    // 도넛 (drawFeederDonut / getChartColors 그대로 사용)
    const canvas = card.querySelector(".feeder-canvas");
    if (
      canvas &&
      typeof window.drawFeederDonut === "function" &&
      typeof window.getChartColors === "function"
    ) {
      const colors = window.getChartColors(groupKey);
      window.drawFeederDonut(canvas, percent, colors);
    }

    // 미니바 (mini-fill은 width를 JS에서 주입)
    // 같은 그룹의 UPPER/MIDDLE/LOWER 모두 채움
    list.forEach(d => {
      const nameOK = String(d.name || "").toUpperCase().includes(groupKey);
      const idOK = String(d.id || "").toUpperCase().includes(groupKey);
      if (!nameOK && !idOK) return;

      const pos = String(d.position || "").toUpperCase();
      let key = "";
      if (pos.includes("UP")) key = "upper";
      else if (pos.includes("MID")) key = "middle";
      else if (pos.includes("LOW")) key = "lower";
      else return;

      const pct = calcPercentSafe(d.produced, d.total);

      const bar = card.querySelector(`[data-role="mini-${key}"]`);
      const txt = card.querySelector(`[data-role="mini-${key}-pct"]`);

      if (bar) bar.style.width = `${pct}%`;
      if (txt) txt.textContent = `${pct}%`;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document
      .querySelectorAll('.feeder-card[data-feeder-id]')
      .forEach(renderFeederSummaryCardPatch);
  });
})();

