function queryRequired(selector, root = document) {
  const node = root.querySelector(selector);
  if (!node) throw new Error(`필수 UI 요소를 찾을 수 없습니다: ${selector}`);
  return node;
}

export function getPlatformElements() {
  return {
    moduleBoard: queryRequired("#moduleMap"),
    moduleDetail: queryRequired("#moduleDetail"),
    currentPathLabel: queryRequired("#currentPathLabel"),
    badgeCountLabel: queryRequired("#badgeCountLabel"),
    badgeBoard: queryRequired("#badgeBoard"),
    teacherBoard: queryRequired("#teacherBoard"),
    virtualDesktop: queryRequired("#virtualDesktop"),
    missionOverlay: queryRequired("#missionOverlay"),
    missionAreaLabel: queryRequired("#missionAreaLabel"),
    missionTitle: queryRequired("#missionTitle"),
    missionStepLabel: queryRequired("#missionStepLabel"),
    missionProgressFill: queryRequired("#missionProgressFill"),
    missionDesktop: queryRequired("#missionDesktop"),
    guideTitle: queryRequired("#guideTitle"),
    guideText: queryRequired("#guideText"),
    demoButton: queryRequired("#demoButton"),
    backToMapButton: queryRequired("#backToMapButton"),
  };
}
