(function () {
  // 1) 색상 팔레트
  const PICKERING_COLORS = [
    "#A5E4FF","#7FD8FF","#58CCFF","#33C0FF","#11B0FF",
    "#009EF9","#0086F0","#006FE6","#0086F0","#009EF9",
    "#11B0FF","#69D1FF","#7FD8FF"
  ];

  const CERNAVODA_COLORS = [
    "#FFD98D","#FFCC66","#FFBE3A","#FFAF1A","#FFA000",
    "#FF8A00","#FF7300","#FF8A00","#FFA000","#FFAF1A",
    "#FFC54E","#FFCC66","#FFD98D"
  ];

  // 2) 여기에는 “사용자가 준 더미”가 전역에 있다고 가정
  //    (procWeeklyByPlantDummy가 현재 dummy.html에 있다면, 이 파일보다 먼저 로드되어야 함)
  function adaptProcWeeklyRows(plantId) {
    const src = window.procWeeklyByPlantDummy || [];
    const rows = src.filter(r => r.plantId === plantId);

    const palette = plantId === "pickering" ? PICKERING_COLORS : CERNAVODA_COLORS;

    return rows.map((r, idx) => {
      const plan = Number(r.plan || 0);
      const actual = Number(r.actual || 0);

      // %는 실제/계획 기준 (원하면 plan 대신 total 등으로 바꾸면 됨)
      const pct = plan > 0 ? Math.round((actual / plan) * 100) : 0;

      return {
        short: r.shortLabel || r.label || r.key,
        pct,
        color: palette[idx % palette.length]
      };
    });
  }

  window.adaptProcWeeklyRows = adaptProcWeeklyRows;
})();
