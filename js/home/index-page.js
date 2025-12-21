// js/pages/index-page.js
document.addEventListener("DOMContentLoaded", () => {
  // ===== 1) Summary cards (Pickering / Cernavoda) =====
  const pickeringCard = document.querySelector('[data-card="pickering"]');
  const cernavodaCard = document.querySelector('[data-card="cernavoda"]');

  const pickModel = window.adaptHomeSummaryToModel?.("pickering");
  const cerModel  = window.adaptHomeSummaryToModel?.("cernavoda");

  if (pickeringCard && pickModel && window.renderSummaryCardInto) {
    window.renderSummaryCardInto(pickeringCard, pickModel);
  }
  if (cernavodaCard && cerModel && window.renderSummaryCardInto) {
    window.renderSummaryCardInto(cernavodaCard, cerModel);
  }

  // ===== 2) Process cards (left/right) =====
  const pickEl = document.querySelector('[data-role="proc-card"][data-plant="pickering"]');
  const cerEl  = document.querySelector('[data-role="proc-card"][data-plant="cernavoda"]');

  if (pickEl && cerEl && window.adaptProcWeeklyRows && window.renderProcCard) {
    const pickRows = window.adaptProcWeeklyRows("pickering");
    const cerRows  = window.adaptProcWeeklyRows("cernavoda");

    window.renderProcCard(pickEl, "PICKERING", pickRows);
    window.renderProcCard(cerEl, "CERENAVODA", cerRows);
  } else {
    console.warn("[proc] missing elements or functions", {
      pickEl: !!pickEl,
      cerEl: !!cerEl,
      adaptProcWeeklyRows: typeof window.adaptProcWeeklyRows,
      renderProcCard: typeof window.renderProcCard
    });
  }

  // ===== 3) Weekly/Monthly small KPI cards =====
  const smallIds = [
    "weekly-pickering",
    "weekly-cernavoda",
    "monthly-pickering",
    "monthly-cernavoda"
  ];

  smallIds.forEach((id) => {
    const card = document.querySelector(`[data-card="${id}"]`);
    const model = window.adaptSmallKpiToModel?.(id);
    if (card && model && window.renderSmallKpiCardInto) {
      window.renderSmallKpiCardInto(card, model);
    }
  });
});
