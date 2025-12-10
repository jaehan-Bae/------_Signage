// ======================= 공통 함수 =======================

// 공통 퍼센트 계산
function calcPercent(produced, total) {
  if (!total || total <= 0) return 0;
  return Math.round((produced / total) * 100);
}

// 공정명 축약 (10글자 이내)
function shortenProcessName(label, shortLabel) {
  // 1) shortLabel이 10글자 이하면 우선 사용
  if (shortLabel && shortLabel.length <= 10) return shortLabel;

  // 2) 괄호 안 내용이 있으면 우선 사용 (예: Bending (LRB) → LRB)
  const bracket = label && label.match(/\((.*?)\)/);
  if (bracket && bracket[1] && bracket[1].length <= 10) {
    return bracket[1];
  }

  // 3) Default 포함된 긴 문장 → Default
  if (label && /default/i.test(label)) return "Default";

  // 4) Pipe+FE 용접 / Pipe+PBO 용접 → FE용접 / PBO용접
  if (label && label.includes("FE")) return "FE용접";
  if (label && label.includes("PBO")) return "PBO용접";

  // 5) 그 외: 공백 제거 후 앞 10글자
  return (label || "").replace(/\s+/g, "").slice(0, 10);
}

// ======================= 도넛 카드 =======================

// 도넛 카드 한 장 렌더링
function renderFeederCard(data) {
  // data.id와 같은 data-feeder-id를 가진 카드 찾기
  const card = document.querySelector(
    `.feeder-card[data-feeder-id="${data.id}"]`
  );
  if (!card) return;

  const percent = calcPercent(data.produced, data.total);

  // 텍스트 채우기
  const titleEl = card.querySelector(".feeder-title-main");
  const subTitleEl = card.querySelector(".feeder-stitle");
  const producedEl = card.querySelector('[data-field="produced"]');
  const totalEl = card.querySelector('[data-field="total"]');
  const percentEl = card.querySelector('[data-field="percent"]');

  if (titleEl) titleEl.textContent = data.name;
  if (subTitleEl) subTitleEl.textContent = data.position;
  if (producedEl) producedEl.textContent = data.produced;
  if (totalEl) totalEl.textContent = data.total;
  if (percentEl) percentEl.textContent = `${percent}%`;

  // 색 규칙 불러와서 도넛 색 결정
  const canvas = card.querySelector(".feeder-canvas");
  if (canvas) {
    const colors = getChartColors(data.name); // color-rules.js에 정의
    drawFeederDonut(canvas, percent, colors); // chart.js에 정의
  }
}

// ======================= 지연 공정 카드 =======================

// Pickering 공정 지연 현황 렌더링
function renderDelayStatusList() {
  const delayCard = document.querySelector('[data-delay-id="delay-main"]');
  if (!delayCard || !Array.isArray(delayStatusDummy)) return;

  const listEl = delayCard.querySelector(".delay-list");
  if (!listEl) return;

  // 기존 내용 초기화
  listEl.innerHTML = "";

  // 서브타이틀 문구 (원하면 수정 가능)
  const subtitleEl = delayCard.querySelector('[data-field="delay-subtitle"]');
  if (subtitleEl) {
    subtitleEl.textContent = "";
  }

  // 1) Pickering 공정만 필터 + 지연 건수 많은 순으로 정렬
  const pickeringDelay = delayStatusDummy
    .filter((item) => item.plantId === "pickering")
    .sort((a, b) => b.delayQty - a.delayQty);

  // 2) 화면에 2열용 리스트로 렌더링
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
        <span class="delay-count">${item.delayQty}</span>
        <span class="delay-unit">건</span>
      </div>
    `;

    listEl.appendChild(li);
  });
}

// ======================= 페이지 로딩 후 실행 =======================

document.addEventListener("DOMContentLoaded", () => {
  // 1. 도넛 카드들 렌더 (feederDummy가 배열인 경우)
  if (Array.isArray(feederDummy)) {
    feederDummy.forEach((data) => {
      // 이 페이지에 해당 카드가 실제로 있을 때만 렌더
      const card = document.querySelector(
        `.feeder-card[data-feeder-id="${data.id}"]`
      );
      if (card) {
        renderFeederCard(data);
      }
    });
  }

  // 2. 공정별 진행현황 막대 그래프 (이 페이지에 있을 때만)
  const barChartEl = document.getElementById("procBarChart");
  if (barChartEl && Array.isArray(procWeeklyDummy)) {
    const weeklyItems = procWeeklyDummy.slice(0, 10);
    renderProcBarChart("procBarChart", weeklyItems); // chart.js
  }

  // 3. 피커링 / 체르나보다 그룹별 그라데이션 바차트
  if (Array.isArray(feederDummy) && typeof renderFeederBars === "function") {
    const pickeringItems = feederDummy.filter(
      (item) => item.groupId === "pickering"
    );
    const cernavodaItems = feederDummy.filter(
      (item) => item.groupId === "cernavoda"
    );

    const hasPickering = document.getElementById("pickeringBars");
    const hasCernavoda = document.getElementById("cernavodaBars");

    if (hasPickering && pickeringItems.length) {
      renderFeederBars("pickeringBars", pickeringItems);
    }
    if (hasCernavoda && cernavodaItems.length) {
      renderFeederBars("cernavodaBars", cernavodaItems);
    }
  }

  // 4. 공정 지연 현황 카드 렌더
  renderDelayStatusList();
});

// 위클리 선
const weeklyItems = procWeeklyByPlantDummy.filter(
  item => item.plantId === "pickering"
);
renderProcBarChart("procBarChart", weeklyItems, procDailyAccumDummy);
