// 더미 데이터 원형 그래프
// 피더 원형/바 공통 더미데이터
const feederDummy = [
  {
    id: "pickering-upper",
    groupId: "pickering",
    groupName: "Pickering",
    name: "Pickering#1",
    position: "Upper",
    produced: 540,
    total: 740
  },
  {
    id: "pickering-middle",
    groupId: "pickering",
    groupName: "Pickering",
    name: "Pickering#1",
    position: "Middle",
    produced: 420,
    total: 740
  },
  {
    id: "pickering-lower",
    groupId: "pickering",
    groupName: "Pickering",
    name: "Pickering#1",
    position: "Lower",
    produced: 740,
    total: 740
  },
  {
    id: "cernavoda-upper",
    groupId: "cernavoda",
    groupName: "Cernavoda",
    name: "Cernavoda#1",
    position: "Upper",
    produced: 380,
    total: 600
  },
  {
    id: "cernavoda-lower",
    groupId: "cernavoda",
    groupName: "Cernavoda",
    name: "Cernavoda#1",
    position: "Lower",
    produced: 600,
    total: 600
  }
];

// pickering-upper, pickering-middle, pickering-lower, Cernavoda-upper, Cernavoda-lower

// 더미 데이터 막대 그래프
const procWeeklyDummy = [
  {
    key: "default",
    label: "Material Inspection & cutting (Default)",
    shortLabel: "Default",
    plan: 20,
    actual: 12
  },
  {
    key: "swage",
    label: "Swage",
    shortLabel: "Swage",
    plan: 20,
    actual: 15
  },
  {
    key: "bend",
    label: "Bending",
    shortLabel: "Bend",
    plan: 20,
    actual: 17
  },
  {
    key: "bend_crb",
    label: "Bending (CRB)",
    shortLabel: "Bend(CRB)",
    plan: 20,
    actual: 8
  },
  {
    key: "bend_lrb",
    label: "Bending (LRB)",
    shortLabel: "Bend(LRB)",
    plan: 20,
    actual: 18
  },
  {
    key: "heat",
    label: "열처리",
    shortLabel: "열처리",
    plan: 20,
    actual: 11
  },
  {
    key: "heat_lrb",
    label: "열처리 (LRB)",
    shortLabel: "HT(LRB)",
    plan: 20,
    actual: 16
  },
  {
    key: "ptop",
    label: "Pipe to Pipe Welding",
    shortLabel: "PtoP",
    plan: 20,
    actual: 10
  },
  {
    key: "pipe_pbo",
    label: "Pipe+PBO 용접",
    shortLabel: "P+PBO",
    plan: 20,
    actual: 19
  },
  {
    key: "final",
    label: "Final inspection",
    shortLabel: "Final",
    plan: 20,
    actual: 12
  }
];


// ===============================
// 3. 플랜트 + 공정별 주간 계획/실적/잔여 더미 데이터
//    (막대 그래프 등에서 사용)
// ===============================
const procWeeklyByPlantDummy = [
  // ===== Pickering 공정별 =====
  {
    plantId: "pickering",
    plantName: "Pickering",
    key: "default",
    label: "Material Inspection & cutting (Default)",
    shortLabel: "Default",
    plan: 40,
    actual: 32,
    remaining: 8 // plan - actual
  },
  {
    plantId: "pickering",
    plantName: "Pickering",
    key: "swage",
    label: "Swage",
    shortLabel: "Swage",
    plan: 40,
    actual: 35,
    remaining: 5
  },
  {
    plantId: "pickering",
    plantName: "Pickering",
    key: "bend",
    label: "Bending",
    shortLabel: "Bend",
    plan: 40,
    actual: 37,
    remaining: 3
  },
  {
    plantId: "pickering",
    plantName: "Pickering",
    key: "bend_crb",
    label: "Bending (CRB)",
    shortLabel: "Bend(CRB)",
    plan: 40,
    actual: 28,
    remaining: 12
  },
  {
    plantId: "pickering",
    plantName: "Pickering",
    key: "bend_lrb",
    label: "Bending (LRB)",
    shortLabel: "Bend(LRB)",
    plan: 40,
    actual: 38,
    remaining: 2
  },
  {
    plantId: "pickering",
    plantName: "Pickering",
    key: "heat",
    label: "열처리",
    shortLabel: "열처리",
    plan: 40,
    actual: 31,
    remaining: 9
  },
  {
    plantId: "pickering",
    plantName: "Pickering",
    key: "heat_crb",
    label: "열처리 (CRB)",
    shortLabel: "HT(CRB)",
    plan: 40,
    actual: 30,
    remaining: 10
  },
  {
    plantId: "pickering",
    plantName: "Pickering",
    key: "heat_lrb",
    label: "열처리 (LRB)",
    shortLabel: "HT(LRB)",
    plan: 40,
    actual: 36,
    remaining: 4
  },
  {
    plantId: "pickering",
    plantName: "Pickering",
    key: "ptop",
    label: "Pipe to Pipe Welding",
    shortLabel: "PtoP",
    plan: 40,
    actual: 29,
    remaining: 11
  },
  {
    plantId: "pickering",
    plantName: "Pickering",
    key: "pipe_pbo",
    label: "Pipe+PBO 용접",
    shortLabel: "P+PBO",
    plan: 40,
    actual: 39,
    remaining: 1
  },
  {
    plantId: "pickering",
    plantName: "Pickering",
    key: "pipe_fe",
    label: "Pipe+FE 용접",
    shortLabel: "P+FE",
    plan: 40,
    actual: 34,
    remaining: 6
  },
  {
    plantId: "pickering",
    plantName: "Pickering",
    key: "hub",
    label: "Hub welding",
    shortLabel: "Hub",
    plan: 40,
    actual: 33,
    remaining: 7
  },
  {
    plantId: "pickering",
    plantName: "Pickering",
    key: "final",
    label: "Final inspection",
    shortLabel: "Final",
    plan: 40,
    actual: 32,
    remaining: 8
  },

  // ===== Cernavoda 공정별 =====
  {
    plantId: "cernavoda",
    plantName: "Cernavoda",
    key: "default",
    label: "Material Inspection & cutting (Default)",
    shortLabel: "Default",
    plan: 30,
    actual: 22,
    remaining: 8
  },
  {
    plantId: "cernavoda",
    plantName: "Cernavoda",
    key: "swage",
    label: "Swage",
    shortLabel: "Swage",
    plan: 30,
    actual: 24,
    remaining: 6
  },
  {
    plantId: "cernavoda",
    plantName: "Cernavoda",
    key: "bend",
    label: "Bending",
    shortLabel: "Bend",
    plan: 30,
    actual: 27,
    remaining: 3
  },
  {
    plantId: "cernavoda",
    plantName: "Cernavoda",
    key: "bend_crb",
    label: "Bending (CRB)",
    shortLabel: "Bend(CRB)",
    plan: 30,
    actual: 20,
    remaining: 10
  },
  {
    plantId: "cernavoda",
    plantName: "Cernavoda",
    key: "bend_lrb",
    label: "Bending (LRB)",
    shortLabel: "Bend(LRB)",
    plan: 30,
    actual: 28,
    remaining: 2
  },
  {
    plantId: "cernavoda",
    plantName: "Cernavoda",
    key: "heat",
    label: "열처리",
    shortLabel: "열처리",
    plan: 30,
    actual: 21,
    remaining: 9
  },
  {
    plantId: "cernavoda",
    plantName: "Cernavoda",
    key: "heat_lrb",
    label: "열처리 (LRB)",
    shortLabel: "HT(LRB)",
    plan: 30,
    actual: 26,
    remaining: 4
  },
  {
    plantId: "cernavoda",
    plantName: "Cernavoda",
    key: "ptop",
    label: "Pipe to Pipe Welding",
    shortLabel: "PtoP",
    plan: 30,
    actual: 23,
    remaining: 7
  },
  {
    plantId: "cernavoda",
    plantName: "Cernavoda",
    key: "pipe_pbo",
    label: "Pipe+PBO 용접",
    shortLabel: "P+PBO",
    plan: 30,
    actual: 29,
    remaining: 1
  },
  {
    plantId: "cernavoda",
    plantName: "Cernavoda",
    key: "pipe_fe",
    label: "Pipe+FE 용접",
    shortLabel: "P+FE",
    plan: 30,
    actual: 25,
    remaining: 5
  },
  {
    plantId: "cernavoda",
    plantName: "Cernavoda",
    key: "hub",
    label: "Hub welding",
    shortLabel: "Hub",
    plan: 30,
    actual: 24,
    remaining: 6
  },
  {
    plantId: "cernavoda",
    plantName: "Cernavoda",
    key: "adaptor",
    label: "Adaptor",
    shortLabel: "Adaptor",
    plan: 30,
    actual: 27,
    remaining: 3
  },
  {
    plantId: "cernavoda",
    plantName: "Cernavoda",
    key: "final",
    label: "Final inspection",
    shortLabel: "Final",
    plan: 30,
    actual: 23,
    remaining: 7
  }
];

// 공정별 데일리 누적 실적 (선 그래프용)
const procDailyAccumDummy = [
  { key: "default", value: 14 },
  { key: "swage", value: 18 },
  { key: "bend", value: 9 },
  { key: "bend_crb", value: 9 },
  { key: "bend_lrb", value: 13 },
  { key: "heat", value: 13 },
  { key: "heat_crd", value: 13 },
  { key: "heat_lrb", value: 13 },
  { key: "ptop", value: 13 },
  { key: "pipe_pbo", value: 17 },
  { key: "pipe_fe", value: 2 },
  { key: "final", value: 9 },
  { key: "adaptor", value: 19 },
];


// ===============================
// 4. 지연 공정 리스트용 더미데이터
//    (공정 지연 현황 카드에서 사용)
// ===============================
//
// remaining(잔여 수량)을 "지연 건수"로 보고,
// plan 대비 지연률까지 계산해서 정렬해 둔다.
// main.js에서 plantId나 상위 N개 등으로 필터링해서 사용 가능.
//
const delayStatusDummy = procWeeklyByPlantDummy
  // 계획 대비 실적이 모자라는 공정만
  .filter(proc => proc.actual < proc.plan)
  .map(proc => {
    const delayQty = proc.remaining; // 또는 proc.plan - proc.actual
    const delayRate = Math.round((delayQty / proc.plan) * 100);

    return {
      plantId: proc.plantId,
      plantName: proc.plantName,
      key: proc.key,
      label: proc.label,
      shortLabel: proc.shortLabel,
      plan: proc.plan,
      actual: proc.actual,
      remaining: proc.remaining,
      delayQty,   // 지연 수량
      delayRate   // 지연률 (%)
    };
  })
  // 기본 정렬: 지연 건수 큰 순
  .sort((a, b) => b.delayQty - a.delayQty);



const pickeringDelayViewData = [
  { name: "Bend(CRB)", count: 12 },
  { name: "PtoP", count: 11 },
  { name: "HT(CRB)", count: 10 },
  { name: "열처리", count: 9 },
  { name: "Default", count: 8 },
  { name: "Final", count: 8 },
  { name: "Hub", count: 7 },
  { name: "P+FE", count: 6 },
  { name: "Swage", count: 5 },
  { name: "HT(LRB)", count: 4 },
  { name: "Bend", count: 3 },
  { name: "Bend(LRB)", count: 2 },
  { name: "P+PBO", count: 1 }
];
