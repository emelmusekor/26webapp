import { createEl } from "../core/dom.js";

export function renderAiHistory(canvas, ctx) {
  const steps = [
    ["추상화", "복잡한 세상을 규칙과 기호로 간단히 표현합니다."],
    ["자동화", "정해진 규칙을 컴퓨터가 빠르게 실행합니다."],
    ["탐색", "여러 가능성을 비교하며 더 나은 길을 찾습니다."],
    ["데이터", "예시와 기록을 모아 판단의 근거로 삼습니다."],
    ["지능화", "데이터와 학습으로 더 나은 판단을 시도합니다."],
    ["자율화", "목표를 받고 스스로 다음 행동을 고릅니다."],
  ];
  const [title, text] = steps[ctx.state.taskIndex];
  ctx.setGuide("AI 기술 흐름", `${title} 단계를 살펴보고 다음으로 넘겨보세요.`);
  const panel = createEl("div", "timeline-panel");
  panel.innerHTML = `
    <div class="timeline-line">${steps.map((step, index) => `<span class="${index <= ctx.state.taskIndex ? "on" : ""}">${step[0]}</span>`).join("")}</div>
    <div class="timeline-card"><h3>${title}</h3><p>${text}</p></div>
    <button class="primary-button" type="button">이해했어요</button>
  `;
  panel.querySelector("button").addEventListener("click", () => ctx.completeTask());
  canvas.append(panel);
}
