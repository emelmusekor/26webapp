import { createEl } from "../core/dom.js";

export function renderExternalModule(canvas, ctx) {
  const module = ctx.state.activeModule;
  const targetUrl = module.externalUrl || module.externalPath;
  const isRemote = Boolean(module.externalUrl);
  ctx.setGuide("연결 활동", isRemote ? "새 창에서 활동을 해 본 뒤, 다시 돌아와 다음으로 넘어갑니다." : "첨부된 활동을 이 화면에서 크게 열어봅니다.");
  const panel = createEl("div", "external-panel");
  panel.innerHTML = `
    <div class="program-frame">
      <header class="program-frame-head">
        <div>
          <span>${module.area.name} · ${isRemote ? "외부 링크" : "연결 콘텐츠"}</span>
          <strong>${module.title}</strong>
        </div>
        <a class="secondary-button" href="${targetUrl}" target="_blank" rel="noreferrer">새 창으로 열기</a>
      </header>
      ${
        isRemote
          ? `
            <div class="remote-launch">
              <div class="mission-prompt">
                <span>외부 실습</span>
                <strong>${module.subtitle}</strong>
              </div>
              <p>이 활동은 새 창에서 열립니다. 활동을 해 본 뒤, 이 화면으로 돌아와 아래 버튼을 누르면 됩니다.</p>
              <a class="primary-button" href="${targetUrl}" target="_blank" rel="noreferrer">실습 열기</a>
            </div>
          `
          : `<iframe class="embedded-legacy-frame" title="${module.title}" src="${targetUrl}"></iframe>`
      }
      <div class="external-actions">
        <button class="primary-button" type="button">다 했어요</button>
      </div>
    </div>
  `;
  const frame = panel.querySelector(".embedded-legacy-frame");
  frame?.addEventListener("load", () => {
    try {
      const doc = frame.contentDocument;
      const style = doc.createElement("style");
      style.textContent = `
        body { font-family: Pretendard, "Segoe UI", Arial, sans-serif !important; background: #f6f9fd !important; }
        button, input, select, textarea { border-radius: 8px !important; font-family: inherit !important; }
        .rounded-2xl, .rounded-3xl, .rounded-full { border-radius: 8px !important; }
        .shadow-2xl, .shadow-xl, .shadow-lg { box-shadow: 0 18px 42px rgba(35, 52, 80, 0.14) !important; }
      `;
      doc.head.append(style);
    } catch (error) {
      // Remote pages and some legacy pages may block style injection.
    }
  });
  panel.querySelector("button").addEventListener("click", () => ctx.completeTask());
  canvas.append(panel);
}

export function renderPlaceholder(canvas, ctx) {
  const module = ctx.state.activeModule;
  ctx.setGuide("준비 중인 활동", "나중에 붙일 활동의 자리를 먼저 살펴봅니다.");
  const panel = createEl("div", "placeholder-panel");
  panel.innerHTML = `
    <div class="program-frame">
      <header class="program-frame-head">
        <div>
          <span>${module.area.name} · 추가 예정</span>
          <strong>${module.title}</strong>
        </div>
      </header>
      <div class="remote-launch">
        <div class="mission-prompt">
          <span>추가 예정</span>
          <strong>${module.title}</strong>
        </div>
        <p>${module.subtitle}</p>
        <ul>${module.skills.map((skill) => `<li>${skill}</li>`).join("")}</ul>
        <button class="primary-button" type="button">자리 봤어요</button>
      </div>
    </div>
  `;
  panel.querySelector("button").addEventListener("click", () => ctx.completeTask());
  canvas.append(panel);
}
