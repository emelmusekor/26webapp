import { AREAS, findModule } from "../data/catalog.js";
import { TASK_TOTALS } from "../modules/registry.js";

export function createModuleMapController({ state, els, onStartModule }) {
  function renderPlatformMap() {
    els.moduleBoard.className = "module-board";
    els.moduleBoard.innerHTML = AREAS.map(
      (area) => `
        <section class="area-lane" style="--area:${area.accent}">
          <header class="area-head">
            <div>
              <span class="area-kicker">${area.name}</span>
              <h3>${area.subtitle}</h3>
            </div>
            <strong>${area.modules.length}개 모듈</strong>
          </header>
          <div class="module-row">
            ${area.modules.map((module) => renderModuleCard(area, module)).join("")}
          </div>
        </section>
      `,
    ).join("");

    els.moduleBoard.querySelectorAll(".module-card").forEach((card) => {
      card.addEventListener("click", () => selectModule(card.dataset.moduleId));
    });
  }

  function renderModuleCard(area, module) {
    const done = state.progress[module.id]?.complete;
    const statusClass = done ? "done" : module.status === "자리" ? "placeholder" : "open";
    return `
      <button class="module-card ${statusClass} ${state.selectedModuleId === module.id ? "selected" : ""}" data-module-id="${module.id}" type="button">
        <span class="module-status">${done ? "완료" : module.status}</span>
        <strong>${module.title}</strong>
        <span>${module.subtitle}</span>
        <small>${module.skills.join(" · ")}</small>
        <em>${TASK_TOTALS[module.type] || 1}단계 구성</em>
      </button>
    `;
  }

  function selectModule(moduleId) {
    state.selectedModuleId = moduleId;
    const module = findModule(moduleId);
    els.currentPathLabel.textContent = `${module.area.name} · ${module.title}`;
    renderPlatformMap();
    renderModuleDetail();
  }

  function renderModuleDetail() {
    const module = findModule(state.selectedModuleId);
    const done = state.progress[module.id]?.complete;
    els.moduleDetail.innerHTML = `
      <div class="module-detail-header">
        <span class="module-pill" style="background:${module.area.accent}18;color:${module.area.accent}">
          ${module.area.name} · ${done ? "완료" : module.status}
        </span>
        <h3>${module.title}</h3>
      </div>
      <dl class="detail-list">
        <div><dt>의도</dt><dd>${module.subtitle}</dd></div>
        <div><dt>핵심 경험</dt><dd>${module.skills.join(", ")}</dd></div>
        <div><dt>과제 구성</dt><dd>${TASK_TOTALS[module.type] || 1}단계 체험${module.type === "ictControls" ? " · 포인터 이동은 10개 목표 연속 수행" : ""}</dd></div>
        <div><dt>구현 상태</dt><dd>${getModuleNote(module)}</dd></div>
      </dl>
      <button class="primary-button" id="moduleActionButton" type="button">
        ${module.status === "자리" ? "준비 중" : module.type === "external" && module.status !== "체험" ? "연결 열기" : "체험 시작"}
      </button>
    `;
    const actionButton = els.moduleDetail.querySelector("#moduleActionButton");
    if (module.status === "자리") {
      actionButton.disabled = true;
      return;
    }
    actionButton.addEventListener("click", () => onStartModule(module.id));
  }

  return {
    renderModuleDetail,
    renderPlatformMap,
    selectModule,
  };
}

function getModuleNote(module) {
  if (module.type === "external") return "첨부 콘텐츠를 공통 미션 프레임 안에서 전체 화면으로 엽니다.";
  if (module.type === "placeholder") return "전문 콘텐츠를 붙이기 위한 자리와 화면 흐름만 잡아둡니다.";
  if (module.type === "valueDilemma") return "가치 성향을 드러내는 딜레마 시뮬레이션입니다.";
  return "직접 조작하는 미니 체험으로 구현되어 있습니다.";
}
