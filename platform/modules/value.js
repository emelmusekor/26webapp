import { createEl } from "../core/dom.js";
import { ETHICS_RULES } from "../data/ethics.js";

const SCENARIOS = [
  {
    title: "친구 사진을 AI로 재미있게 바꾸기",
    text: "친구 허락 없이 사진을 바꾸어 학급 게시판에 올리면 모두 웃을 것 같습니다.",
    left: "재미있으니 올린다",
    right: "허락을 먼저 받는다",
    safer: "right",
    rules: ["privacy", "dignity", "noHarm"],
  },
  {
    title: "AI가 뽑은 팀",
    text: "AI가 체육팀을 짰는데 늘 같은 친구들이 뒤로 밀립니다.",
    left: "AI가 정했으니 그대로 한다",
    right: "기준을 확인하고 다시 조정한다",
    safer: "right",
    rules: ["diversity", "rights", "publicGood"],
  },
  {
    title: "숙제를 대신 써주는 AI",
    text: "AI가 글을 아주 잘 써줍니다. 내 생각 없이 그대로 제출할 수 있습니다.",
    left: "그대로 제출한다",
    right: "도움을 받고 내 생각을 넣는다",
    safer: "right",
    rules: ["purpose", "rights", "publicGood"],
  },
  {
    title: "복도 안전 카메라",
    text: "AI 카메라가 뛰는 학생을 바로 찾아낼 수 있지만, 쉬는 시간의 모든 행동도 계속 기록됩니다.",
    left: "안전을 위해 모두 기록한다",
    right: "필요한 순간만 제한해 쓴다",
    safer: "right",
    rules: ["privacy", "publicGood", "noHarm"],
  },
  {
    title: "AI 추천 친구",
    text: "AI가 비슷한 친구끼리만 모둠을 만들면 편하지만, 새로운 친구와 만날 기회가 줄어듭니다.",
    left: "비슷한 친구끼리만 둔다",
    right: "다양한 친구가 섞이게 조정한다",
    safer: "right",
    rules: ["diversity", "rights", "publicGood"],
  },
];

export function renderValueDilemma(canvas, ctx) {
  const scenario = SCENARIOS[ctx.state.taskIndex] || SCENARIOS[0];
  ctx.setGuide("AI 성향 딜레마", "하나만 맞히는 문제가 아니에요. 내가 중요하게 보는 가치를 살펴봅니다.");
  const panel = createEl("div", "dilemma-panel");
  panel.innerHTML = `
    <div class="mission-prompt"><span>딜레마</span><strong>${scenario.title}</strong></div>
    <p>${scenario.text}</p>
    <div class="dilemma-actions">
      <button type="button" data-side="left">${scenario.left}</button>
      <button type="button" data-side="right">${scenario.right}</button>
    </div>
    <label class="value-line">
      <span>나의 판단 위치</span>
      <input type="range" min="0" max="100" value="50" />
    </label>
    <div class="value-profile">중간에서 생각을 시작합니다.</div>
    <div class="ethics-grid">
      ${ETHICS_RULES
        .map((rule) => `<span class="${scenario.rules.includes(rule.id) ? "active" : ""}"><strong>${rule.label}</strong><small>${rule.detail}</small></span>`)
        .join("")}
    </div>
  `;
  panel.querySelectorAll(".dilemma-actions button").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.add("picked");
      const pickedSafer = button.dataset.side === scenario.safer;
      ctx.setGuide(pickedSafer ? "가치 살피기" : "한 번 더 생각", pickedSafer ? "이 선택은 사람과 권리를 먼저 살핍니다." : "다른 사람의 정보와 안전도 함께 생각해봅니다.");
      window.setTimeout(() => ctx.completeTask(), pickedSafer ? 450 : 900);
    });
  });
  const range = panel.querySelector(".value-line input");
  const profile = panel.querySelector(".value-profile");
  range.addEventListener("input", () => {
    const value = Number(range.value);
    ctx.markAction();
    ctx.updateProgress(Math.min(0.85, Math.abs(value - 50) / 50 + 0.25));
    profile.textContent = value < 35 ? "위험을 줄이고 보호를 우선합니다." : value > 65 ? "도전과 편리함을 크게 봅니다." : "두 가치를 비교하며 균형을 찾고 있습니다.";
  });
  canvas.append(panel);
}
