// ===== 시간 표시 함수 =====
function updateTime() {
  const now = new Date();

  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');

  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  const timeEl = document.getElementById("time");
  if (!timeEl) return;   // 안전장치

  timeEl.textContent = `${y}/${m}/${d} ${hh}:${mm}:${ss}`;
}

function startClock() {
  updateTime();
  setInterval(updateTime, 1000);
}

// ===== header 불러오고 → 시계 시작 =====
document.addEventListener("DOMContentLoaded", () => {
  fetch("/header.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("header").innerHTML = html;
      startClock();
    });
});
