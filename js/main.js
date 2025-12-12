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


/* =====================================================
   피더 원판 이미지 (SVG + RENDER LOGIC)
   1) SVG 템플릿
   - feeder.html 에 풀코드 있음
   ----------------------------------------------------- */
const FEEDER_SVG = `
<svg id="plateSvg"
  viewBox="0 0 1201 822"
  preserveAspectRatio="xMidYMid meet"
  aria-label="Feeder plate overlay">

  <defs>
    <!-- 음각 홀 -->
    <radialGradient id="concaveGrad" cx="50%" cy="50%" r="60%">
      <stop offset="0%"   stop-color="#0A0D02"/>
      <stop offset="50%"  stop-color="#141908"/>
      <stop offset="80%"  stop-color="#3B4450"/>
      <stop offset="100%" stop-color="#AEB6C0"/>
    </radialGradient>

    <!-- 홀 립 하이라이트 -->
    <radialGradient id="lipGrad" cx="50%" cy="50%" r="60%">
      <stop offset="78%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="90%" stop-color="#ffffff" stop-opacity="0.25"/>
    </radialGradient>

    <!-- 상태 원 경사 테두리 -->
    <linearGradient id="bevelStroke" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.70"/>
      <stop offset="45%"  stop-color="#ffffff" stop-opacity="0.12"/>
      <stop offset="55%"  stop-color="#000000" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
    </linearGradient>

    <!-- 상태 원 하이라이트 -->
    <radialGradient id="statusSpec" cx="35%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="40%" stop-color="#ffffff" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <image href="./images/feeder.png" x="0" y="0" width="1201" height="822"></image>
  <g id="holesLayer"></g>
</svg>
`;

/* -----------------------------------------------------
   2) 마운트
   - HTML의 #feederMount에 SVG 삽입
   ----------------------------------------------------- */
function mountFeeder() {
  const mount = document.getElementById("feederMount");
  if (!mount) return;
  mount.innerHTML = FEEDER_SVG;
}

/* -----------------------------------------------------
   3) 데이터
   - holes: 좌표 배열 (holes.json)
   - statusById: 상태 맵
   ----------------------------------------------------- */
let holes = [];          // ← 여기서 JSON 불러와도 됨
const statusById = {};

/* -----------------------------------------------------
   4) 렌더 파라미터
   ----------------------------------------------------- */
const BASE_R   = 13.4;
const LIP_R    = 13.9;
const STATUS_R = 12.2;

/* -----------------------------------------------------
   5) 상태 색상 결정
   ----------------------------------------------------- */
function colorOf(status) {
  switch (status) {
    case "ok":     return "#159C61";
    case "before": return "#F3F4F6";
    case "delay":  return "#E6243C";
    default:       return "transparent";
  }
}

/* -----------------------------------------------------
   6) 렌더링
   ----------------------------------------------------- */
function renderHoles() {
  const ns = "http://www.w3.org/2000/svg";
  const layer = document.getElementById("holesLayer");
  if (!layer) return;

  layer.innerHTML = "";

  holes.forEach((h) => {
    const status = statusById[h.id];

    // [1] 음각 홀 베이스(항상 그림) : 배경의 검은 구멍 가리기
    const base = document.createElementNS(ns, "circle");
    base.setAttribute("cx", h.x);
    base.setAttribute("cy", h.y);
    base.setAttribute("r", BASE_R);
    base.setAttribute("fill", "url(#concaveGrad)");
    base.setAttribute("opacity", "0.98");
    layer.appendChild(base);

    // [2] 홀 립 하이라이트(항상 그림) : 우푹 파인 립 강조
    const lip = document.createElementNS(ns, "circle");
    lip.setAttribute("cx", h.x);
    lip.setAttribute("cy", h.y);
    lip.setAttribute("r", LIP_R);
    lip.setAttribute("fill", "url(#lipGrad)");
    lip.setAttribute("opacity", "0.55");
    layer.appendChild(lip);

    // [3] 상태 원(볼록 버튼) : status가 있을 때만 그림
    const fill = colorOf(status);
    if (fill === "transparent") return;

    // 3-1) 바탕색(초록/흰/빨강)
    const dot = document.createElementNS(ns, "circle");
    dot.setAttribute("cx", h.x);
    dot.setAttribute("cy", h.y);
    dot.setAttribute("r", STATUS_R);
    dot.setAttribute("fill", fill);
    dot.setAttribute("opacity", "0.92");
    layer.appendChild(dot);

    // 3-2) 경사/엠보스 테두리 : bevelStroke를 stroke로 써야 볼록해짐
    const rim = document.createElementNS(ns, "circle");
    rim.setAttribute("cx", h.x);
    rim.setAttribute("cy", h.y);
    rim.setAttribute("r", STATUS_R - 0.5);
    rim.setAttribute("fill", "none");
    rim.setAttribute("stroke", "url(#bevelStroke)");     // 강한 효과
    // rim.setAttribute("stroke-width", "1.2");             // 선명한 보더
    rim.setAttribute("vector-effect", "non-scaling-stroke");
    rim.setAttribute("opacity", "0.95");
    layer.appendChild(rim);

    // 3-3) 상단 좌측 하이라이트(광택) : statusSpec 반짝이?
    const hi = document.createElementNS(ns, "circle");
    hi.setAttribute("cx", h.x - STATUS_R * 0.28);
    hi.setAttribute("cy", h.y - STATUS_R * 0.30);
    hi.setAttribute("r", STATUS_R * 0.55);
    hi.setAttribute("fill", "url(#statusSpec)");
    hi.setAttribute("opacity", "0.35");
    layer.appendChild(hi);
  });
}

/* -----------------------------------------------------
   7) 외부 제어 API
   ----------------------------------------------------- */
function updateStatus(nextMap) {
  Object.assign(statusById, nextMap);
  renderHoles();
}
window.updateStatus = updateStatus;

/* -----------------------------------------------------
   8) 초기 실행
   ----------------------------------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  mountFeeder();

  // JSON 로드
  const res = await fetch("./holes.json");
  holes = await res.json();

  renderHoles();

  // 랜덤/리셋 버튼 이벤트
  document.getElementById("demoBtn")?.addEventListener("click", () => {
    const ids = holes.map(h => h.id);
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const states = ["ok", "before", "delay", ""];
    const next = {};

    for (let i = 0; i < Math.min(120, ids.length); i++) {
      next[pick(ids)] = pick(states);
    }
    updateStatus(next);
  });

  document.getElementById("resetBtn")?.addEventListener("click", () => {
    for (const k in statusById) delete statusById[k];
    renderHoles();
  });
});
