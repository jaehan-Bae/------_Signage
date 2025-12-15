/* =====================================================
   Feeder Plate (SVG + Holes Rendering)
   - mounts SVG into #feederMount
   - loads ./holes.json
   - snaps each row to a single y (row-aligned)
   - exposes window.updateStatus(nextMap)
   ===================================================== */

(() => {
  /* ---------------------------
     1) SVG Template
     --------------------------- */
  const FEEDER_SVG = `
  <svg id="plateSvg"
    viewBox="0 0 1201 822"
    preserveAspectRatio="xMidYMid meet"
    aria-label="Feeder plate overlay">

    <defs>
      <!-- concave hole -->
      <radialGradient id="concaveGrad" cx="50%" cy="50%" r="60%">
        <stop offset="0%"   stop-color="#3d4248ff"/>
        <stop offset="50%"  stop-color="#4e5156ff"/>
        <stop offset="80%"  stop-color="#525354ff"/>
        <stop offset="100%" stop-color="#AEB6C0"/>
      </radialGradient>

      <!-- lip highlight -->
      <radialGradient id="lipGrad" cx="50%" cy="50%" r="60%">
        <stop offset="78%" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="90%" stop-color="#ffffff" stop-opacity="0.25"/>
      </radialGradient>

      <!-- status bevel stroke -->
      <linearGradient id="bevelStroke" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.70"/>
        <stop offset="45%"  stop-color="#ffffff" stop-opacity="0.12"/>
        <stop offset="55%"  stop-color="#000000ff" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
      </linearGradient>

      <!-- status spec -->
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

  /* ---------------------------
     2) Data / State
     --------------------------- */
  let holes = [];
  const statusById = {};
  let rowYMap = null;

  /* ---------------------------
     3) Render parameters
     --------------------------- */
  const BASE_R   = 13.4;
  const LIP_R    = 13.9;
  const STATUS_R = 12.2;

  /* ---------------------------
     4) Helpers
     --------------------------- */
  function mountFeeder() {
    const mount = document.getElementById("feederMount");
    if (!mount) return;
    mount.innerHTML = FEEDER_SVG;
  }

  // Build row->Y map using median (robust to outliers)
  function buildRowYMap(list) {
    const byRow = new Map();

    list.forEach((h) => {
      const row = h?.row;
      const y = Number(h?.y);
      if (!row || Number.isNaN(y)) return;

      if (!byRow.has(row)) byRow.set(row, []);
      byRow.get(row).push(y);
    });

    const map = {};
    for (const [row, ys] of byRow.entries()) {
      ys.sort((a, b) => a - b);
      const mid = Math.floor(ys.length / 2);
      map[row] = (ys.length % 2)
        ? ys[mid]
        : (ys[mid - 1] + ys[mid]) / 2;
    }
    return map;
  }

  function colorOf(status) {
    switch (status) {
      case "ok":     return "#159C61";
      case "before": return "#F3F4F6";
      case "delay":  return "#E6243C";
      default:       return "transparent";
    }
  }

  /* ---------------------------
     5) Rendering
     --------------------------- */
  function renderHoles() {
    const ns = "http://www.w3.org/2000/svg";
    const layer = document.getElementById("holesLayer");
    if (!layer) return;

    layer.innerHTML = "";

    // Lazy compute row map (in case called before json loaded)
    if (!rowYMap && Array.isArray(holes) && holes.length) {
      rowYMap = buildRowYMap(holes);
      // Optional debug: window.__rowYMap = rowYMap;
      window.__rowYMap = rowYMap;
    }

    holes.forEach((h) => {
      const status = statusById[h.id];
      const fill = colorOf(status);

      // Snap Y by row (if row exists)
      const cy = (h.row && rowYMap && rowYMap[h.row] != null) ? rowYMap[h.row] : h.y;

      // [1] concave base
      const base = document.createElementNS(ns, "circle");
      base.setAttribute("cx", h.x);
      base.setAttribute("cy", cy);
      base.setAttribute("r", BASE_R);
      base.setAttribute("fill", "url(#concaveGrad)");
      base.setAttribute("opacity", "1");
      layer.appendChild(base);

      // [2] lip highlight
      const lip = document.createElementNS(ns, "circle");
      lip.setAttribute("cx", h.x);
      lip.setAttribute("cy", cy);
      lip.setAttribute("r", LIP_R);
      lip.setAttribute("fill", "url(#lipGrad)");
      lip.setAttribute("opacity", "1");
      layer.appendChild(lip);

      // [3] status dot only if status exists
      if (fill === "transparent") return;

      const dot = document.createElementNS(ns, "circle");
      dot.setAttribute("cx", h.x);
      dot.setAttribute("cy", cy);
      dot.setAttribute("r", STATUS_R);
      dot.setAttribute("fill", fill);
      dot.setAttribute("opacity", "0.92");
      layer.appendChild(dot);

      const rim = document.createElementNS(ns, "circle");
      rim.setAttribute("cx", h.x);
      rim.setAttribute("cy", cy);
      rim.setAttribute("r", STATUS_R - 0.5);
      rim.setAttribute("fill", "none");
      rim.setAttribute("stroke", "url(#bevelStroke)");
      rim.setAttribute("vector-effect", "non-scaling-stroke");
      rim.setAttribute("opacity", "0.95");
      layer.appendChild(rim);

      const hi = document.createElementNS(ns, "circle");
      hi.setAttribute("cx", h.x - STATUS_R * 0.28);
      hi.setAttribute("cy", cy - STATUS_R * 0.30);
      hi.setAttribute("r", STATUS_R * 0.55);
      hi.setAttribute("fill", "url(#statusSpec)");
      hi.setAttribute("opacity", "0.35");
      layer.appendChild(hi);
    });
  }

  /* ---------------------------
     6) External API
     --------------------------- */
  function updateStatus(nextMap) {
    Object.assign(statusById, nextMap);
    renderHoles();
  }
  window.updateStatus = updateStatus;

  /* ---------------------------
     7) Boot
     --------------------------- */
  document.addEventListener("DOMContentLoaded", async () => {
    mountFeeder();

    try {
      const res = await fetch("./holes.json");
      holes = await res.json();
      rowYMap = buildRowYMap(holes);
      window.__rowYMap = rowYMap; // debug
      renderHoles();
    } catch (e) {
      console.error("[feeder-plate] holes.json load failed:", e);
    }

    // Buttons (optional)
    document.getElementById("demoBtn")?.addEventListener("click", () => {
      if (!holes?.length) return;
      const ids = holes.map((h) => h.id);
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
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
})();
