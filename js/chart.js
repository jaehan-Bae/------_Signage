// ===========================
// 1. 도넛 게이지
// ===========================
function drawFeederDonut(canvas, percent, colors) {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) / 2 - 10;

  ctx.clearRect(0, 0, w, h);

  // 배경 원
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#eeeeee";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.stroke();

  // 진행 원
  const start = -Math.PI / 2;
  const end = start + (2 * Math.PI * percent) / 100;

  ctx.beginPath();
  ctx.arc(cx, cy, radius, start, end);

  const gradient = ctx.createLinearGradient(cx - radius, 0, cx + radius, 0);
  gradient.addColorStop(0, colors.from);
  gradient.addColorStop(1, colors.to);

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.stroke();
}

// ===========================
// 2. 공정별 진행현황 막대 + 데일리 실선
// ===========================
function renderProcBarChart(targetId, items, dailyAccumItems) {

  const container = document.getElementById(targetId);
  if (!container || !Array.isArray(items)) return;

  // dailyAccumItems 없으면 전역 더미(procDailyAccumDummy)가 있으면 사용
  if (!Array.isArray(dailyAccumItems)) {
    if (typeof procDailyAccumDummy !== "undefined") {
      dailyAccumItems = procDailyAccumDummy;
    } else {
      dailyAccumItems = [];
    }
  }

  container.innerHTML = "";
  container.style.position = "relative";

  // 최대값: plan/actual + 데일리 value 고려
  let maxVal =
    Math.max(
      ...items.map((item) => Math.max(item.plan, item.actual))
    ) || 1;

  if (dailyAccumItems.length > 0) {
    const keySet = new Set(items.map((i) => i.key));
    const dailyMax = Math.max(
      ...dailyAccumItems
        .filter((d) => keySet.has(d.key))
        .map((d) => d.value)
    );
    if (dailyMax && dailyMax > maxVal) maxVal = dailyMax;
  }

  // 막대들 생성 (그라데이션 색상 적용)
  items.forEach((item, index) => {
    const col = document.createElement("div");
    col.className = "proc-bar-column";

    const wrapper = document.createElement("div");
    wrapper.className = "proc-bar-wrapper";

    const planBar = document.createElement("div");
    planBar.className = "proc-bar--plan";
    planBar.style.height = `${(item.plan / maxVal) * 100}%`;
    // 계획 막대는 연한 회색 그라데이션
    planBar.style.background = "(#eeeee)";

    const actualBar = document.createElement("div");
    actualBar.className = "proc-bar--actual";
    actualBar.style.height = `${(item.actual / maxVal) * 100}%`;

    // BLUE_GRADIENT 팔레트에서 색 선택
    const colorIndex = index % BLUE_GRADIENT.length;
    const baseColor = BLUE_GRADIENT[colorIndex];
    const topColor =
      BLUE_GRADIENT[Math.min(colorIndex + 1, BLUE_GRADIENT.length - 1)];

    // 막대 자체를 파란 그라데이션으로
    actualBar.style.background = `linear-gradient(to top, ${baseColor}, ${topColor})`;

    wrapper.appendChild(planBar);
    wrapper.appendChild(actualBar);

    const label = document.createElement("div");
    label.className = "proc-bar-label";
    label.textContent = item.shortLabel;

    col.appendChild(wrapper);
    col.appendChild(label);
    container.appendChild(col);
  });

  // ==== 여기부터 Canvas로 실선 오버레이 ====

  // 캔버스 생성 (막대 위 overlay)
  const canvas = document.createElement("canvas");
  canvas.width = container.clientWidth || 600;
  canvas.height = container.clientHeight || 240;
  canvas.style.position = "absolute";
  canvas.style.zIndex = "10";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.pointerEvents = "none"; // 마우스 이벤트 통과

  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  // 각 막대의 중앙 x좌표 + 선용 y좌표 계산
  const cols = container.querySelectorAll(".proc-bar-column");
  const points = [];

  const containerRect = container.getBoundingClientRect();

cols.forEach((col, index) => {
  
  const rect = col.getBoundingClientRect();
  const centerX = rect.left - containerRect.left + rect.width / 2;

  const wrapper = col.querySelector(".proc-bar-wrapper");
  if (!wrapper) return;

  const wrapperRect = wrapper.getBoundingClientRect();

  const item = items[index];
  const found =
    dailyAccumItems.find((d) => d.key === item.key) || null;

  const value = found ? found.value : item.actual;
  const ratio = value / maxVal;

  const topY = wrapperRect.top - containerRect.top;
  const bottomY = wrapperRect.bottom - containerRect.top;

  const LEGEND_GAP = 70; // 범례 영역 무시할 높이(px)

const chartTop = 0;
const chartBottom = canvas.height - LEGEND_GAP;
const chartHeight = chartBottom - chartTop;

let y = chartBottom - ratio * chartHeight;

// 안전 클램프
y = Math.max(chartTop, Math.min(chartBottom, y));

points.push({ x: centerX, y });


});


  // 실선 그리기
  if (points.length > 1) {
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.strokeStyle = "#69DCF6"; // 공정별 진행현황 실선
    ctx.lineWidth = 1;
    ctx.stroke();

    // 꼭짓점 원 그리기
    ctx.fillStyle = "#69DCF6";  // 점 색상
    points.forEach(p => {
  ctx.beginPath();
  ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); // 3 → 동그라미 크기
  ctx.fill();
});

  }
}

// ===========================
// 3. Thin-bar용 그라데이션 팔레트
// ===========================
const BLUE_GRADIENT = [
  "#0096FA",
  "#0087F5",
  "#0077EF",
  "#0069E8",
  "#005CE1",
  "#0050DA",
  "#0045D4",
  "#0039CC",
  "#002FBF",
  "#0025B5"
];

const ORANGE_GRADIENT = [
  "#FFE5B5",
  "#FFD98A",
  "#FFCC66",
  "#FFBE3A",
  "#FFAF1A",
  "#FFA000",
  "#FF8A00",
  "#FF73000",
  "#FF5C00",
  "#FF4500"
];

// ===========================
// 4. Thin-bar 초기화
// ===========================
function initThinBars() {
  const bars = document.querySelectorAll(".thin-bar");

  bars.forEach((bar) => {
    const total = 10;
    const value = parseInt(bar.dataset.value, 10) || 0;
    const active = Math.round((value / 100) * total);

    const name = bar.dataset.name || "";
    const upper = name.toUpperCase();

    // 이름에 PICKERING이 들어가면 파랑, 아니면 주황
    const palette = upper.includes("PICKERING")
      ? BLUE_GRADIENT
      : ORANGE_GRADIENT;

    bar.innerHTML = "";

    for (let i = 0; i < total; i += 1) {
      const seg = document.createElement("div");
      seg.className = "thin-bar__seg";

      if (i < active) {
        seg.style.background = palette[i];
      }

      bar.appendChild(seg);
    }
  });
}

