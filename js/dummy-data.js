/* ======================================================
 * 1. 피더 원형 / 미니바 공통 더미
 * ====================================================== */
const feederDummy = [
  {
    id: "pickering-upper",
    groupId: "pickering",
    groupName: "Pickering",
    position: "Upper",
    produced: 540,
    total: 740
  },
  {
    id: "pickering-middle",
    groupId: "pickering",
    groupName: "Pickering",
    position: "Middle",
    produced: 420,
    total: 740
  },
  {
    id: "pickering-lower",
    groupId: "pickering",
    groupName: "Pickering",
    position: "Lower",
    produced: 740,
    total: 740
  },
  {
    id: "cernavoda-upper",
    groupId: "cernavoda",
    groupName: "Cernavoda",
    position: "Upper",
    produced: 380,
    total: 600
  },
  {
    id: "cernavoda-lower",
    groupId: "cernavoda",
    groupName: "Cernavoda",
    position: "Lower",
    produced: 600,
    total: 600
  }
];


/* ======================================================
 * 2. 공정 주간 기본 더미 (plant 구분 없음)
 * ====================================================== */
const procWeeklyDummy = [
  { key: "default", shortLabel: "Default", plan: 20, actual: 12 },
  { key: "swage", shortLabel: "Swage", plan: 20, actual: 15 },
  { key: "bend", shortLabel: "Bend", plan: 20, actual: 17 },
  { key: "bend_crb", shortLabel: "Bend(CRB)", plan: 20, actual: 8 },
  { key: "bend_lrb", shortLabel: "Bend(LRB)", plan: 20, actual: 18 },
  { key: "heat", shortLabel: "HT", plan: 20, actual: 11 },
  { key: "heat_lrb", shortLabel: "HT(LRB)", plan: 20, actual: 16 },
  { key: "ptop", shortLabel: "PtoP", plan: 20, actual: 10 },
  { key: "pipe_pbo", shortLabel: "P+PBO", plan: 20, actual: 19 },
  { key: "final", shortLabel: "Final", plan: 20, actual: 12 }
];


/* ======================================================
 * 3. 플랜트 + 공정별 주간 더미 (핵심)
 *    어댑터(adaptProcWeeklyRows)가 읽는 데이터
 * ====================================================== */
const procWeeklyByPlantDummy = [
  /* ===== Pickering ===== */
  { plantId:"pickering", key:"default", shortLabel:"Def", uiLabel:"Def", plan:40, actual:32 },
  { plantId:"pickering", key:"swage", shortLabel:"Swg", uiLabel:"Swg", plan:40, actual:35 },
  { plantId:"pickering", key:"bend", shortLabel:"Bnd", uiLabel:"Bnd", plan:40, actual:37 },
  { plantId:"pickering", key:"bend_crb", shortLabel:"CRB", uiLabel:"CRB", plan:40, actual:28 },
  { plantId:"pickering", key:"bend_lrb", shortLabel:"LRB", uiLabel:"LRB", plan:40, actual:38 },
  { plantId:"pickering", key:"heat", shortLabel:"HT", uiLabel:"HT", plan:40, actual:31 },
  { plantId:"pickering", key:"heat_crb", shortLabel:"HT-C", uiLabel:"HT-C", plan:40, actual:30 },
  { plantId:"pickering", key:"heat_lrb", shortLabel:"HT-L", uiLabel:"HT-L", plan:40, actual:36 },
  { plantId:"pickering", key:"ptop", shortLabel:"P2P", uiLabel:"P2P", plan:40, actual:29 },
  { plantId:"pickering", key:"pipe_pbo", shortLabel:"PBO", uiLabel:"PBO", plan:40, actual:39 },
  { plantId:"pickering", key:"pipe_fe", shortLabel:"FE", uiLabel:"FE", plan:40, actual:34 },
  { plantId:"pickering", key:"hub", shortLabel:"Hub", uiLabel:"Hub", plan:40, actual:33 },
  { plantId:"pickering", key:"final", shortLabel:"Fin", uiLabel:"Fin", plan:40, actual:32 },

  /* ===== Cernavoda ===== */
  { plantId:"cernavoda", key:"default", shortLabel:"Def", uiLabel:"Def", plan:30, actual:22 },
  { plantId:"cernavoda", key:"swage", shortLabel:"Swg", uiLabel:"Swg", plan:30, actual:24 },
  { plantId:"cernavoda", key:"bend", shortLabel:"Bnd", uiLabel:"Bnd", plan:30, actual:27 },
  { plantId:"cernavoda", key:"bend_crb", shortLabel:"CRB", uiLabel:"CRB", plan:30, actual:20 },
  { plantId:"cernavoda", key:"bend_lrb", shortLabel:"LRB", uiLabel:"LRB", plan:30, actual:28 },
  { plantId:"cernavoda", key:"heat", shortLabel:"HT", uiLabel:"HT", plan:30, actual:21 },
  { plantId:"cernavoda", key:"heat_lrb", shortLabel:"HT-L", uiLabel:"HT-L", plan:30, actual:26 },
  { plantId:"cernavoda", key:"ptop", shortLabel:"P2P", uiLabel:"P2P", plan:30, actual:23 },
  { plantId:"cernavoda", key:"pipe_pbo", shortLabel:"PBO", uiLabel:"PBO", plan:30, actual:29 },
  { plantId:"cernavoda", key:"pipe_fe", shortLabel:"FE", uiLabel:"FE", plan:30, actual:25 },
  { plantId:"cernavoda", key:"hub", shortLabel:"Hub", uiLabel:"Hub", plan:30, actual:24 },
  { plantId:"cernavoda", key:"adaptor", shortLabel:"Adp", uiLabel:"Adp", plan:30, actual:27 },
  { plantId:"cernavoda", key:"final", shortLabel:"Fin", uiLabel:"Fin", plan:30, actual:23 }
].map(r => ({
  ...r,
  remaining: r.plan - r.actual
}));


/* ======================================================
 * 4. 공정별 데일리 누적 (라인 차트용)
 * ====================================================== */
const procDailyAccumDummy = [
  { key:"default", value:14 },
  { key:"swage", value:18 },
  { key:"bend", value:9 },
  { key:"bend_crb", value:9 },
  { key:"bend_lrb", value:13 },
  { key:"heat", value:13 },
  { key:"heat_crb", value:13 },
  { key:"heat_lrb", value:13 },
  { key:"ptop", value:13 },
  { key:"pipe_pbo", value:17 },
  { key:"pipe_fe", value:2 },
  { key:"final", value:9 },
  { key:"adaptor", value:19 }
];


/* ======================================================
 * 5. 공정 지연 현황 (remaining 기준)
 * ====================================================== */
const delayStatusDummy = procWeeklyByPlantDummy
  .filter(p => p.remaining > 0)
  .map(p => ({
    ...p,
    delayQty: p.remaining,
    delayRate: Math.round((p.remaining / p.plan) * 100)
  }))
  .sort((a,b) => b.delayQty - a.delayQty);


/* ======================================================
 * 6. 전역 바인딩 (★★ 매우 중요 ★★)
 * ====================================================== */
window.feederDummy = feederDummy;
window.procWeeklyDummy = procWeeklyDummy;
window.procWeeklyByPlantDummy = procWeeklyByPlantDummy;
window.procDailyAccumDummy = procDailyAccumDummy;
window.delayStatusDummy = delayStatusDummy;
