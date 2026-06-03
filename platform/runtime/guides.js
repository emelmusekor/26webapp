const START_GUIDES = {
  ictControls: "마우스와 키보드 조작을 하나씩 직접 해봅니다.",
  virtualOS: "가상 컴퓨터에서 앱을 열고 결과를 저장해봅니다.",
  typingPractice: "제시된 글자를 정확히 입력해봅니다.",
  codingPuzzle: "명령을 쌓아서 캐릭터를 목표까지 이동시킵니다.",
  flowchartCode: "순서도 블록을 누르면 코드가 만들어지는 모습을 봅니다.",
  unpluggedViz: "전구를 켜고 끄며 이진 표현을 시각화합니다.",
  aiHistory: "AI 기술 흐름을 시대별 체험으로 살펴봅니다.",
  fintech: "돈을 어떻게 나눌지 조절하며 결과를 봅니다.",
  drugLab: "AI 예측을 보며 실험 조건을 조정합니다.",
  valueDilemma: "딜레마 상황에서 나의 AI 성향을 확인합니다.",
  external: "첨부된 콘텐츠를 플랫폼 안에서 엽니다.",
  placeholder: "앞으로 붙일 콘텐츠의 자리를 확인합니다.",
};

export function getStartGuide(module) {
  return START_GUIDES[module.type] || "체험을 시작합니다.";
}

export function clearGuidePulse() {
  document.querySelectorAll(".guide-pulse").forEach((node) => node.classList.remove("guide-pulse"));
}

export function highlightGuideTarget() {
  const target = document.querySelector("[data-guide-target='true']");
  if (target) target.classList.add("guide-pulse");
}
