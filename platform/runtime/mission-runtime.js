import { findModule } from "../data/catalog.js";
import { createEl } from "../core/dom.js";
import { playClearEffect, playRoundEffect } from "../core/effects.js";
import { resetMissionState } from "../core/state.js";
import { saveProgress } from "../core/storage.js";
import { MODULE_RENDERERS, TASK_TOTALS } from "../modules/registry.js";
import { clearGuidePulse, getStartGuide, highlightGuideTarget } from "./guides.js";

const QUOTE_AUTHORS = [
  "에이다 러브레이스", "앨런 튜링", "그레이스 호퍼", "도널드 커누스", "바버라 리스코프",
  "앨런 케이", "마거릿 해밀턴", "클로드 섀넌", "팀 버너스리", "데니스 리치",
  "켄 톰프슨", "에드거 다익스트라", "존 폰 노이만", "캐서린 존슨", "프랜 앨런",
  "라드야 펄먼", "아델 골드버그", "이반 서덜랜드", "존 매카시", "마빈 민스키",
  "피터 노빅", "제프리 힌턴", "요슈아 벤지오", "페이페이 리", "샤피 골드와서",
];

const QUOTE_IDEAS = [
  "작은 순서를 정확히 해내면 큰 문제도 풀 수 있습니다",
  "컴퓨터는 빠르지만, 방향은 사람이 차분히 정합니다",
  "좋은 생각은 먼저 실험해 보고 다시 고치면서 자랍니다",
  "복잡한 일도 한 단계씩 나누면 이해할 수 있습니다",
  "실수는 고칠 곳을 알려주는 중요한 신호입니다",
  "같은 일을 반복하면 손과 생각이 함께 익숙해집니다",
  "문제를 잘 읽는 일이 해결의 절반입니다",
  "좋은 도구는 사람을 더 안전하고 편하게 도와야 합니다",
  "코드는 컴퓨터에게 차례를 알려주는 약속입니다",
  "자료를 잘 정리하면 다음 일을 더 쉽게 찾을 수 있습니다",
  "모르는 것을 천천히 확인하는 태도가 좋은 학습입니다",
  "화면의 신호를 보고 다음 행동을 고르는 힘이 중요합니다",
  "짧은 길을 찾는 것보다 먼저 도착해 보는 경험이 필요합니다",
  "컴퓨터를 배운다는 것은 조작과 생각을 함께 연습하는 일입니다",
  "정확한 입력은 컴퓨터와 대화하는 첫 번째 방법입니다",
  "파일 이름과 폴더는 생각을 정리하는 지도입니다",
  "좋은 질문은 좋은 프로그램을 만드는 시작입니다",
  "관찰하고 누르고 확인하는 과정이 디지털 탐구입니다",
  "안전하게 멈추고 다시 시도하는 것도 중요한 기술입니다",
  "친절한 기술은 사람이 이해할 수 있게 설명합니다",
];

const QUOTE_ENDINGS = [
  "지금 한 행동도 그 연습의 한 부분입니다.",
  "방금 한 선택이 다음 활동의 기초가 됩니다.",
  "이렇게 확인하면 컴퓨터가 왜 반응했는지 알 수 있습니다.",
  "천천히 반복하면 더 자연스럽게 할 수 있습니다.",
  "다음에는 같은 원리를 다른 화면에서도 찾아볼 수 있습니다.",
  "손으로 해 본 경험이 생각의 재료가 됩니다.",
  "방금 배운 순서를 기억해 두면 다시 사용할 수 있습니다.",
  "잘못 눌러도 다시 고치는 방법을 알면 괜찮습니다.",
  "작은 성공을 모으면 큰 활동도 할 수 있습니다.",
  "눈으로 보고 손으로 확인한 것이 진짜 실력입니다.",
  "이유를 알면 우연이 아니라 내 힘으로 다시 할 수 있습니다.",
  "컴퓨터는 정확한 위치와 순서를 기다립니다.",
  "좋은 사용자는 결과뿐 아니라 과정을 살펴봅니다.",
  "다음 활동에서는 조금 더 스스로 판단해 볼 수 있습니다.",
  "반복하면 속도보다 정확함이 먼저 자랍니다.",
  "파일과 앱의 역할을 알면 컴퓨터가 덜 낯설어집니다.",
  "오늘의 조작은 미래의 문제 해결로 이어집니다.",
  "생각을 나누고 순서를 세우면 더 쉽게 배울 수 있습니다.",
  "확인하고 넘어가는 습관이 안전한 사용을 만듭니다.",
  "지금처럼 이유를 살피면 더 오래 기억됩니다.",
];

export function createMissionRuntime({ state, els, onClose }) {
  const ctx = {
    state,
    setGuide,
    updateProgress,
    markAction,
    completeTask,
    showWrong,
  };

  function startModule(moduleId) {
    const module = findModule(moduleId);
    clearInterval(state.hintTimer);
    resetMissionState(state, module, TASK_TOTALS[module.type] || 1);

    els.missionOverlay.classList.add("active");
    els.missionOverlay.setAttribute("aria-hidden", "false");
    els.missionAreaLabel.textContent = module.area.name;
    els.missionTitle.textContent = module.title;
    els.demoButton.classList.remove("visible");

    setGuide("시작", getStartGuide(module));
    updateProgress(0);
    renderActiveTask();
    state.hintTimer = setInterval(checkIdleGuide, 1000);
  }

  function closeMission() {
    clearInterval(state.hintTimer);
    els.missionOverlay.classList.remove("active");
    els.missionOverlay.setAttribute("aria-hidden", "true");
    onClose?.();
  }

  function renderActiveTask() {
    const module = state.activeModule;
    els.missionDesktop.innerHTML = '<div class="mission-canvas module-canvas" id="missionCanvas"></div>';
    const canvas = document.querySelector("#missionCanvas");
    renderTaskHud(canvas);
    const renderer = MODULE_RENDERERS[module.type] || MODULE_RENDERERS.placeholder;
    renderer(canvas, ctx);
  }

  function renderTaskHud(canvas) {
    const hud = createEl("div", "round-strip");
    hud.innerHTML = `
      <span class="round-label">체험 ${Math.min(state.taskIndex + 1, state.taskTotal)}/${state.taskTotal}</span>
      <span class="round-dots">
        ${Array.from({ length: state.taskTotal })
          .map((_, index) => `<i class="round-dot ${index < state.taskIndex ? "done" : index === state.taskIndex ? "active" : ""}"></i>`)
          .join("")}
      </span>
    `;
    canvas.append(hud);
  }

  function setGuide(title, text) {
    els.guideTitle.textContent = title;
    els.guideText.textContent = text;
  }

  function updateProgress(partial = 0) {
    const progress = ((state.taskIndex + partial) / state.taskTotal) * 100;
    els.missionStepLabel.textContent = `${Math.min(state.taskIndex + 1, state.taskTotal)} / ${state.taskTotal}`;
    els.missionProgressFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
  }

  function markAction() {
    state.lastActionAt = Date.now();
    state.hintLevel = 0;
    clearGuidePulse();
  }

  function completeTask(message = "잘했어요. 다음 활동으로 가볼까요?", feedback = {}) {
    if (state.taskLocked) return;
    state.taskLocked = true;
    markAction();
    updateProgress(1);
    const canvas = document.querySelector("#missionCanvas");
    playRoundEffect(canvas, feedback.toast || "잘했어요!");
    setGuide(feedback.guideTitle || "잘했어요!", feedback.guideText || "무엇이 잘 되었는지 함께 확인한 뒤 다음 활동으로 가요.");
    window.setTimeout(() => showSubmitPanel(canvas, message, feedback), feedback.delay ?? 850);
  }

  function showSubmitPanel(canvas, message, feedback = {}) {
    canvas.querySelector(".answer-submit-panel")?.remove();
    const isLastTask = state.taskIndex + 1 >= state.taskTotal;
    const buttonText = isLastTask ? feedback.finalButtonText || "활동 마치기" : feedback.buttonText || "다음 활동";
    const reason = feedback.reason || message || "목표 행동을 정확한 위치와 순서로 해냈기 때문입니다.";
    const quote = feedback.quote || getRandomScientistQuote();
    const panel = createEl("div", "answer-submit-panel");
    panel.innerHTML = `
      <div class="answer-mark">${feedback.mark || "좋아"}</div>
      <div>
        <strong>${feedback.title || "잘했어요!"}</strong>
        <p>${isLastTask ? "이 활동을 마쳤어요. 돌아가 볼까요?" : message}</p>
        <small><b>왜 됐을까요?</b> ${reason}</small>
        <blockquote>${quote}</blockquote>
      </div>
      <button class="primary-button" type="button">${buttonText}</button>
    `;
    panel.querySelector("button").addEventListener("click", () => {
      panel.querySelector("button").disabled = true;
      if (isLastTask) {
        completeModule();
        return;
      }
      state.taskIndex += 1;
      state.taskLocked = false;
      renderActiveTask();
      updateProgress(0);
    });
    canvas.append(panel);
  }

  function getRandomScientistQuote() {
    const index = Math.floor(Math.random() * 10000);
    const author = QUOTE_AUTHORS[index % QUOTE_AUTHORS.length];
    const idea = QUOTE_IDEAS[Math.floor(index / QUOTE_AUTHORS.length) % QUOTE_IDEAS.length];
    const ending = QUOTE_ENDINGS[Math.floor(index / (QUOTE_AUTHORS.length * QUOTE_IDEAS.length)) % QUOTE_ENDINGS.length];
    return `${author}의 생각: ${idea}. ${ending}`;
  }

  function completeModule() {
    clearInterval(state.hintTimer);
    const canvas = document.querySelector("#missionCanvas");
    canvas?.querySelector(".answer-submit-panel")?.remove();
    if (canvas) canvas.classList.add("success");
    document.querySelectorAll(".round-dot").forEach((dot) => {
      dot.classList.remove("active");
      dot.classList.add("done");
    });
    playClearEffect(canvas);
    setGuide("활동 끝!", "잘 해냈어요. 배지가 생겼어요.");
    updateProgress(1);
    els.missionStepLabel.textContent = `${state.taskTotal} / ${state.taskTotal}`;

    state.progress[state.activeModule.id] = {
      complete: true,
      title: state.activeModule.title,
      area: state.activeModule.area.name,
      completedAt: new Date().toISOString(),
    };
    saveProgress(state.progress);

    const panel = createEl("div", "success-panel");
    panel.innerHTML = `
      <div class="success-badge">완료</div>
      <div>
        <h3>${state.activeModule.title} 활동 끝!</h3>
        <p>${state.activeModule.area.name} 활동을 잘 해냈어요.</p>
      </div>
      <button class="next-button" type="button">돌아가기</button>
    `;
    panel.querySelector(".next-button").addEventListener("click", closeMission);
    els.missionDesktop.append(panel);
  }

  function showWrong(text) {
    state.wrongAttempts += 1;
    setGuide("천천히 다시", text);
    highlightGuideTarget();
  }

  function checkIdleGuide() {
    if (!state.activeModule || state.taskLocked) return;
    const elapsed = Date.now() - state.lastActionAt;
    if (elapsed > 8000 && state.hintLevel === 0) {
      state.hintLevel = 1;
      setGuide("어디를 눌러볼까요?", "빛나는 곳을 천천히 눌러보세요.");
      highlightGuideTarget();
    }
    if (elapsed > 18000 && state.hintLevel === 1) {
      state.hintLevel = 2;
      setGuide("괜찮아요", "마우스를 천천히 움직여도 됩니다. 먼저 큰 버튼이나 입력칸을 찾아보세요.");
    }
  }

  return {
    closeMission,
    highlightGuideTarget,
    startModule,
  };
}
