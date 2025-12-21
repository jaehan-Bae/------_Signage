// js/home/index-kpi-adapter.js 
(function () {
  const kpiSmallDummy = {
    "weekly-pickering": {
      title: "Weekly",
      stitle: "(Pickering)",
      value: 650,
      label: "이번 주 목표",
      deltaPct: 9,
      series: [520, 540, 535, 560, 575, 610, 650], // 스파크라인용
      theme: { line: "#90BDEF", bg: "#F8FAFE" }
    },
    "weekly-cernavoda": {
      title: "Weekly",
      stitle: "(Cernavoda)",
      value: 650,
      label: "이번 주 목표",
      deltaPct: 12,
      series: [610, 590, 605, 625, 615, 635, 650],
      theme: { line: "#F6A255", bg: "#FFF4E9" }
    },
    "monthly-pickering": {
      title: "Monthly",
      stitle: "(Pickering)",
      value: 650,
      label: "이번 달 목표",
      deltaPct: 3,
      series: [430, 460, 480, 500, 540, 600, 650],
      theme: { line: "#90BDEF", bg: "#F8FAFE" }
    },
    "monthly-cernavoda": {
      title: "Monthly",
      stitle: "(Cernavoda)",
      value: 650,
      label: "이번 달 목표",
      deltaPct: 7,
      series: [380, 410, 450, 470, 520, 590, 650],
      theme: { line: "#F6A255", bg: "#FFF4E9" }
    }
  };

  function adaptSmallKpiToModel(cardId) {
    const d = kpiSmallDummy[cardId];
    if (!d) return null;

    return {
      title: d.title,
      stitle: d.stitle,
      value: d.value,
      label: d.label,
      deltaPct: d.deltaPct,
      deltaColor: "#5DAF3B",
      arrowSrc: "./images/up.png",
      series: d.series || [],
      theme: d.theme
    };
  }

  window.adaptSmallKpiToModel = adaptSmallKpiToModel;
})();
