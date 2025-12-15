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
}

// ======================= 지연 공정 카드 =======================

function renderDelayStatusList() {
  const delayCard = document.querySelector('[data-delay-id="delay-main"]');
  const delayData = window.delayStatusDummy;

  if (!delayCard || !Array.isArray(delayData)) return;

  const listEl = delayCard.querySelector(".delay-list");
  if (!listEl) return;

  listEl.innerHTML = "";

  const subtitleEl = delayCard.querySelector('[data-field="delay-subtitle"]');
  if (subtitleEl) subtitleEl.textContent = "";

  const pickeringDelay = delayData
    .filter((item) => item.plantId === "pickering")
    .sort((a, b) => (b.delayQty ?? 0) - (a.delayQty ?? 0));

  pickeringDelay.forEach((item) => {
    const li = document.createElement("li");
    li.className = "delay-simple-item";

    const shortName = shortenProcessName(item.label, item.shortLabel);

    li.innerHTML = `
      <div class="delay-left">
        <span class="delay-bar"></span>
        <span class="delay-proc">${shortName}</span>
      </div>
      <div class="delay-right">
        <span class="delay-count">${item.delayQty ?? 0}</span>
        <span class="delay-unit">건</span>
      </div>
    `;
    listEl.appendChild(li);
  });
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
});
