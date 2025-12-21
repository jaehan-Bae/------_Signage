// js/pages/index-summary-adapter.js
(function () {
  const homeSummaryDummy = {
    pickering: {
      title: "PICKERING",
      subtitle: "TOTAL",
      produced: 240,
      total: 740,
      bars: { upper: 80, middle: 40, lower: 60 }
    },
    cernavoda: {
      title: "CERNAVODA",
      subtitle: "TOTAL",
      produced: 120,
      total: 300,
      bars: { upper: 55, lower: 35 } // middle 없음
    }
  };

  function getColorsByPlant(plantId) {
    return plantId === "pickering"
        ? { from: "#6CCBFF", to: "#2F7BEF" }
        : { from: "#FFC266", to: "#FF8A00" };
  }

  function adaptHomeSummaryToModel(plantId) {
    const data = homeSummaryDummy[plantId];
    if (!data) return null;

    const produced = Number(data.produced ?? 0);
    const total = Number(data.total ?? 0);
    const percent = total > 0 ? Math.round((produced / total) * 100) : 0;

    return {
      title: data.title ?? "",
      subtitle: data.subtitle ?? "",
      produced,
      total,
      percent,
      colors: getColorsByPlant(plantId),
      bars: data.bars || {},

        donutStyle: {
        lineWidth: 12   // 여기서 조절
        }
    };
  }

  window.adaptHomeSummaryToModel = adaptHomeSummaryToModel;
})();
