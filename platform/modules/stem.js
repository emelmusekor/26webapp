import { createEl } from "../core/dom.js";

const FINTECH_SCENARIOS = [
  { title: "균형 예산", guide: "용돈 10칸을 저축, 소비, 투자에 나누세요.", rule: ({ total }) => total === 10, hint: "합계가 10칸이 되게 맞춰보세요." },
  { title: "안전한 저축", guide: "저축을 5칸 이상 두고 합계 10칸을 맞추세요.", rule: ({ total, save }) => total === 10 && save >= 5, hint: "저축을 5칸 이상 두고 합계 10칸을 맞춰보세요." },
  { title: "위험 줄이기", guide: "투자는 3칸 이하로 두고 합계 10칸을 맞추세요.", rule: ({ total, invest }) => total === 10 && invest <= 3, hint: "투자를 3칸 이하로 줄이고 합계 10칸을 맞춰보세요." },
  { title: "계획 있는 소비", guide: "소비는 4칸 이하, 저축은 3칸 이상, 투자는 2칸 이상으로 맞추세요.", rule: ({ total, save, spend, invest }) => total === 10 && save >= 3 && spend <= 4 && invest >= 2, hint: "소비를 줄이고 저축과 투자를 모두 남겨보세요." },
  { title: "위험 균형 포트폴리오", guide: "저축 4칸 이상, 소비 2칸 이상, 투자는 2~4칸 사이로 맞추세요.", rule: ({ total, save, spend, invest }) => total === 10 && save >= 4 && spend >= 2 && invest >= 2 && invest <= 4, hint: "투자를 너무 크지 않게 두면서 저축과 소비를 모두 남겨보세요." },
];

const DRUG_SCENARIOS = [
  { title: "첫 후보 찾기", min: 70, guide: "효과와 안전성은 높게, 부작용은 낮게 조정합니다." },
  { title: "안전성 우선", min: 76, guide: "안전성을 특히 높이고 부작용을 낮춰보세요.", safety: 7 },
  { title: "최종 후보", min: 82, guide: "효과와 안전성을 모두 높게 유지하고 부작용을 최소화하세요.", side: 3 },
  { title: "효과 검증", min: 86, guide: "효과를 8 이상으로 높이고 부작용은 2 이하로 낮춰보세요.", effect: 8, side: 2 },
  { title: "임상 후보 확정", min: 90, guide: "효과와 안전성을 8 이상, 부작용은 1 이하로 맞춰 최종 후보를 고르세요.", effect: 8, safety: 8, side: 1 },
];

export function renderFintech(canvas, ctx) {
  const scenario = FINTECH_SCENARIOS[ctx.state.taskIndex] || FINTECH_SCENARIOS[0];
  ctx.setGuide("핀테크", scenario.guide);
  const panel = createEl("div", "sim-panel");
  panel.innerHTML = `
    <div class="mission-prompt"><span>${scenario.title}</span><strong>저축, 소비, 투자 칸을 움직여 봅니다.</strong></div>
    ${["저축", "소비", "투자"].map((label, index) => `
      <label class="slider-row"><span>${label}</span><input type="range" min="0" max="10" value="${index === 0 ? 4 : 3}" /></label>
    `).join("")}
    <div class="sim-result">합계 10 · 계획을 만들어 보세요.</div>
    <button class="primary-button" type="button">이 계획으로 할래요</button>
  `;
  const sliders = Array.from(panel.querySelectorAll("input"));
  const result = panel.querySelector(".sim-result");
  const read = () => ({ save: Number(sliders[0].value), spend: Number(sliders[1].value), invest: Number(sliders[2].value) });
  const update = () => {
    const values = read();
    const total = values.save + values.spend + values.invest;
    const ok = scenario.rule({ ...values, total });
    result.textContent = ok ? `합계 ${total} · 좋은 계획이에요.` : `합계 ${total} · 조건을 맞춰볼까요?`;
    ctx.updateProgress(ok ? 0.95 : Math.min(0.8, total / 10));
  };
  sliders.forEach((input) => input.addEventListener("input", update));
  panel.querySelector("button").addEventListener("click", () => {
    const values = read();
    const total = values.save + values.spend + values.invest;
    if (scenario.rule({ ...values, total })) ctx.completeTask();
    else ctx.showWrong(scenario.hint);
  });
  canvas.append(panel);
  update();
}

export function renderDrugLab(canvas, ctx) {
  const scenario = DRUG_SCENARIOS[ctx.state.taskIndex] || DRUG_SCENARIOS[0];
  ctx.setGuide("신약 개발 실험", scenario.guide);
  const panel = createEl("div", "sim-panel");
  panel.innerHTML = `
    <div class="mission-prompt"><span>${scenario.title}</span><strong>효과, 안전성, 부작용 칸을 움직여 AI 예측을 살펴봅니다.</strong></div>
    <label class="slider-row"><span>효과</span><input type="range" min="0" max="10" value="5" /></label>
    <label class="slider-row"><span>안전성</span><input type="range" min="0" max="10" value="5" /></label>
    <label class="slider-row"><span>부작용</span><input type="range" min="0" max="10" value="5" /></label>
    <div class="sim-result">AI 예측 50</div>
    <button class="primary-button" type="button">이 후보 고르기</button>
  `;
  const [effect, safety, side] = panel.querySelectorAll("input");
  const result = panel.querySelector(".sim-result");
  const score = () => Number(effect.value) * 4 + Number(safety.value) * 4 + (10 - Number(side.value)) * 2;
  const meetsRule = () =>
    score() >= scenario.min &&
    (!scenario.effect || Number(effect.value) >= scenario.effect) &&
    (!scenario.safety || Number(safety.value) >= scenario.safety) &&
    (!scenario.side || Number(side.value) <= scenario.side);
  const update = () => {
    const current = score();
    const limits = [
      scenario.effect ? `효과 ${scenario.effect} 이상` : "",
      scenario.safety ? `안전성 ${scenario.safety} 이상` : "",
      scenario.side ? `부작용 ${scenario.side} 이하` : "",
    ].filter(Boolean).join(" · ");
    result.textContent = `AI 예측 ${current} · 목표 ${scenario.min} 이상${limits ? ` · ${limits}` : ""}`;
    ctx.updateProgress(Math.min(0.95, current / scenario.min));
  };
  panel.querySelectorAll("input").forEach((input) => input.addEventListener("input", update));
  panel.querySelector("button").addEventListener("click", () => {
    if (meetsRule()) ctx.completeTask();
    else ctx.showWrong("효과와 안전성은 높이고, 부작용은 낮게 움직여 볼까요?");
  });
  canvas.append(panel);
  update();
}
