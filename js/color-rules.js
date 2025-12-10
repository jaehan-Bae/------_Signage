function getChartColors(name) {
  const upper = (name || "").toUpperCase();

  if (upper.includes("PICKERING")) {
    return { from: "#005BEA", to: "#00C6FB" }; // 파랑
  }

  return { from: "#F7971E", to: "#FFD200" };   // 주황
}

