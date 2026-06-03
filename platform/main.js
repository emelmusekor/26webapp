import { resetProgressFromQuery } from "./core/storage.js";
import { createPlatformState } from "./core/state.js";
import { createMissionRuntime } from "./runtime/mission-runtime.js";
import { getPlatformElements } from "./ui/elements.js";
import { createModuleMapController } from "./ui/module-map.js";
import { renderBadges, renderTeacherBoard, updateStatus } from "./ui/progress-panels.js";
import { createVirtualDesktopController } from "./ui/virtual-desktop.js?v=20260603-os5";
import { openView } from "./ui/views.js";

export function bootPlatform() {
  resetProgressFromQuery();

  const state = createPlatformState();
  const els = getPlatformElements();

  let moduleMap;

  const refreshPlatformPanels = () => {
    moduleMap.renderPlatformMap();
    moduleMap.renderModuleDetail();
    renderBadges(els.badgeBoard, state.progress);
    renderTeacherBoard(els.teacherBoard, state.progress);
    updateStatus(els.badgeCountLabel, state.progress);
  };

  const missionRuntime = createMissionRuntime({
    state,
    els,
    onClose: refreshPlatformPanels,
  });

  moduleMap = createModuleMapController({
    state,
    els,
    onStartModule: missionRuntime.startModule,
  });

  const virtualDesktop = createVirtualDesktopController({
    els,
    onOpenModule: missionRuntime.startModule,
    onSelectModule: (moduleId) => moduleMap.selectModule(moduleId),
  });

  document.querySelectorAll(".dock-button").forEach((button) => {
    button.addEventListener("click", () => {
      openView(button.dataset.view);
      if (button.dataset.view === "computer") virtualDesktop.render();
      if (button.dataset.view === "badges") renderBadges(els.badgeBoard, state.progress);
      if (button.dataset.view === "teacher") renderTeacherBoard(els.teacherBoard, state.progress);
    });
  });

  els.backToMapButton.addEventListener("click", missionRuntime.closeMission);
  els.demoButton.addEventListener("click", missionRuntime.highlightGuideTarget);

  refreshPlatformPanels();
  virtualDesktop.render();
  openView("computer");
  els.currentPathLabel.textContent = "컴퓨터 · 바탕화면";
}
