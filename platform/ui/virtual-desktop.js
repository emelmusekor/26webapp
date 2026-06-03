import { wireDrag } from "../core/dom.js";
import { AREAS, getAllModules } from "../data/catalog.js";

const AREA_ICON_CLASS = {
  ict: "computer-mark",
  ct: "code-icon",
  ait: "browser-icon",
  stem: "science-icon",
  value: "badge-mark",
};

const AREA_FOLDER_LABEL = {
  ict: "ICT 연습",
  ct: "CT 퍼즐",
  ait: "AIT 실험",
  stem: "STEM 연구",
  value: "AI 가치",
};

const OS_APPS = [
  { id: "explorer", label: "파일 탐색기", icon: "folder-icon" },
  { id: "paint", label: "그림판", icon: "paint-icon" },
  { id: "notepad", label: "메모장", icon: "note-icon" },
  { id: "calculator", label: "계산기", icon: "calculator-icon" },
  { id: "minesweeper", label: "지뢰찾기", icon: "mine-icon" },
  { id: "spreadsheet", label: "스프레드시트", icon: "sheet-icon" },
];

export function createVirtualDesktopController({ els, onOpenModule, onSelectModule }) {
  let selectedModuleId = null;
  let explorerArea = "all";
  let explorerMode = "folders";

  function render() {
    const modules = getAllModules();
    els.virtualDesktop.innerHTML = `
      <div class="desktop-wallpaper"></div>

      <div class="desktop-icon-grid windows-desktop-grid">
        <button class="desktop-icon os-system-icon" data-open-system="explorer" type="button">
          <span class="app-icon pc-icon"></span>
          <span>내 컴퓨터</span>
        </button>
        ${AREAS.map((area) => renderAreaFolder(area)).join("")}
        <button class="desktop-icon os-system-icon" data-open-app="paint" type="button">
          <span class="app-icon paint-icon"></span>
          <span>그림판</span>
        </button>
        <button class="desktop-icon os-system-icon" data-open-app="notepad" type="button">
          <span class="app-icon note-icon"></span>
          <span>메모장</span>
        </button>
        <button class="desktop-icon os-system-icon" data-open-app="calculator" type="button">
          <span class="app-icon calculator-icon"></span>
          <span>계산기</span>
        </button>
      </div>

      <button class="desktop-file-icon desktop-doc-file" data-desktop-file="practice" type="button">연습.txt</button>
      <button class="desktop-file-icon desktop-note-file desktop-saved-file hidden" data-desktop-file="saved" type="button">내메모.txt</button>
      <button class="desktop-file-icon desktop-image-file desktop-paint-file hidden" data-desktop-file="paint" type="button">그림.png</button>
      <button class="desktop-file-icon desktop-temp-file" data-desktop-file="temp" type="button">임시.tmp</button>
      <div class="desktop-drop desktop-folder-drop" data-desktop-drop="folder">학습 폴더</div>
      <div class="desktop-drop desktop-trash-drop" data-desktop-drop="trash">휴지통</div>

      ${renderExplorerWindow(modules)}
      ${renderAppWindows()}

      <nav class="desktop-start-menu" aria-label="시작 메뉴">
        <strong>디지터시 시작</strong>
        <span class="start-menu-label">기본 앱</span>
        ${OS_APPS.map((app) => `<button type="button" data-open-app="${app.id}"><span class="app-icon ${app.icon}"></span>${app.label}</button>`).join("")}
        <span class="start-menu-label">학습 폴더</span>
        ${AREAS.map((area) => `<button type="button" data-area-shortcut="${area.id}"><span class="app-icon ${AREA_ICON_CLASS[area.id]}"></span>${AREA_FOLDER_LABEL[area.id]}</button>`).join("")}
      </nav>

      <div class="desktop-taskbar">
        <button class="start-button desktop-start-button" type="button">시작</button>
        ${OS_APPS.map((app) => `<button class="taskbar-app" type="button" data-task-app="${app.id}" aria-label="${app.label}"><span class="app-icon ${app.icon}"></span></button>`).join("")}
        <span class="task-chip desktop-status">준비됨</span>
        <span class="clock" data-desktop-clock></span>
      </div>
    `;

    wireDesktopInteractions(modules);
    renderExplorerContent(modules);
    updateClock();
  }

  function renderAreaFolder(area) {
    return `
      <button class="desktop-icon os-area-folder" data-open-area="${area.id}" type="button">
        <span class="app-icon folder-icon area-folder-icon" style="--area-color:${area.accent}"></span>
        <span>${AREA_FOLDER_LABEL[area.id]}</span>
      </button>
    `;
  }

  function renderExplorerWindow() {
    return `
      <section class="desktop-window explorer-window" data-utility-window="explorer" aria-label="파일 탐색기">
        <header>
          <div class="window-title">
            <strong>파일 탐색기</strong>
            <span data-explorer-title>내 컴퓨터</span>
          </div>
          ${renderWindowControls("explorer", "utility")}
        </header>
        <div class="explorer-shell">
          <aside class="explorer-sidebar">
            <button type="button" data-explorer-area="all">내 컴퓨터</button>
            ${AREAS.map((area) => `<button type="button" data-explorer-area="${area.id}">${AREA_FOLDER_LABEL[area.id]}</button>`).join("")}
            <button type="button" data-explorer-area="apps">기본 앱</button>
            <button type="button" data-explorer-area="trash">휴지통</button>
          </aside>
          <main class="explorer-main">
            <div class="explorer-address">
              <span data-explorer-address>내 컴퓨터</span>
              <button class="secondary-button" type="button" data-explorer-mode="folders">폴더 보기</button>
              <button class="secondary-button" type="button" data-explorer-mode="practice">파일 정리</button>
            </div>
            <div class="explorer-content" data-explorer-content></div>
          </main>
        </div>
      </section>
    `;
  }

  function renderAppWindows() {
    return `
      <section class="desktop-app-window desktop-paint-window" data-app-window="paint" aria-label="그림판">
        <header><strong>그림판</strong>${renderWindowControls("paint", "app")}</header>
        <div class="desktop-paint-body">
          <div class="desktop-paint-toolbar">
            <button type="button" class="paint-tool active" data-paint-tool="pen">연필</button>
            <button type="button" class="paint-tool" data-paint-tool="eraser">지우개</button>
            <button type="button" class="paint-swatch active" style="--swatch:#2b6eea" data-paint-color="#2b6eea" aria-label="파랑"></button>
            <button type="button" class="paint-swatch" style="--swatch:#e45b55" data-paint-color="#e45b55" aria-label="빨강"></button>
            <button type="button" class="paint-swatch" style="--swatch:#2d9d64" data-paint-color="#2d9d64" aria-label="초록"></button>
            <button type="button" class="paint-swatch" style="--swatch:#172033" data-paint-color="#172033" aria-label="검정"></button>
            <label class="paint-size-label">굵기 <input type="range" min="3" max="22" value="8" data-paint-size /></label>
            <button type="button" data-clear-paint>전체 지우기</button>
            <button type="button" data-save-paint>저장</button>
          </div>
          <canvas class="desktop-paint-canvas" width="1180" height="680"></canvas>
        </div>
      </section>

      <section class="desktop-app-window desktop-notepad-window" data-app-window="notepad" aria-label="메모장">
        <header><strong>메모장</strong>${renderWindowControls("notepad", "app")}</header>
        <div class="desktop-notepad-body">
          <div class="notepad-menu"><button type="button" data-save-note>저장</button><span data-note-status>아직 저장하지 않았습니다.</span></div>
          <textarea class="desktop-notepad" spellcheck="false">오늘 컴퓨터에서 해 본 일을 적어보세요.</textarea>
        </div>
      </section>

      <section class="desktop-app-window desktop-image-viewer-window" data-app-window="image-viewer" aria-label="사진 보기">
        <header><strong>사진 보기 - 그림.png</strong>${renderWindowControls("image-viewer", "app")}</header>
        <div class="image-viewer-body"><img alt="저장한 그림" data-paint-preview /></div>
      </section>

      <section class="desktop-app-window desktop-calculator-window" data-app-window="calculator" aria-label="계산기">
        <header><strong>계산기</strong>${renderWindowControls("calculator", "app")}</header>
        <div class="calculator-body">
          <output class="calculator-display" data-calculator-display>0</output>
          <div class="calculator-grid">
            ${["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+", "C", "←"].map((key) => `<button type="button" data-calc-key="${key}">${key}</button>`).join("")}
          </div>
        </div>
      </section>

      <section class="desktop-app-window desktop-mine-window" data-app-window="minesweeper" aria-label="지뢰찾기">
        <header><strong>지뢰찾기</strong>${renderWindowControls("minesweeper", "app")}</header>
        <div class="mine-body">
          <p>안전한 칸을 눌러 숫자를 확인하세요. 별 칸은 다시 시작하면 됩니다.</p>
          <div class="mine-grid">${Array.from({ length: 25 }).map((_, index) => `<button type="button" data-mine-cell="${index}"></button>`).join("")}</div>
          <button class="secondary-button" type="button" data-reset-mines>다시 시작</button>
        </div>
      </section>

      <section class="desktop-app-window desktop-sheet-window" data-app-window="spreadsheet" aria-label="스프레드시트">
        <header><strong>스프레드시트</strong>${renderWindowControls("spreadsheet", "app")}</header>
        <div class="sheet-body">
          <table>
            <thead><tr><th>칸</th><th>값</th></tr></thead>
            <tbody>
              <tr><td>A1</td><td><input type="number" value="3" /></td></tr>
              <tr><td>A2</td><td><input type="number" value="4" /></td></tr>
              <tr><td>A3</td><td><input type="number" value="5" /></td></tr>
            </tbody>
          </table>
          <button class="primary-button" type="button" data-sheet-sum>합계 계산</button>
          <strong class="sheet-result">합계 12</strong>
        </div>
      </section>
    `;
  }

  function renderWindowControls(id, kind) {
    return `
      <div class="window-controls" aria-label="창 제어">
        <button class="window-control minimize" type="button" title="최소화" aria-label="최소화" data-window-action="minimize" data-window-kind="${kind}" data-window-id="${id}"></button>
        <button class="window-control maximize" type="button" title="최대화" aria-label="최대화" data-window-action="maximize" data-window-kind="${kind}" data-window-id="${id}"></button>
        <button class="window-control close" type="button" title="닫기" aria-label="닫기" data-window-action="close" data-window-kind="${kind}" data-window-id="${id}"></button>
      </div>
    `;
  }

  function wireDesktopInteractions(modules) {
    const startButton = els.virtualDesktop.querySelector(".desktop-start-button");
    const startMenu = els.virtualDesktop.querySelector(".desktop-start-menu");
    const status = els.virtualDesktop.querySelector(".desktop-status");

    startButton.addEventListener("click", () => startMenu.classList.toggle("open"));

    els.virtualDesktop.querySelectorAll("[data-open-system='explorer']").forEach((button) => {
      button.addEventListener("dblclick", () => openExplorer("all"));
      button.addEventListener("click", () => selectDesktopIcon(button, "내 컴퓨터"));
    });

    els.virtualDesktop.querySelectorAll("[data-open-area]").forEach((button) => {
      button.addEventListener("click", () => selectDesktopIcon(button, `${AREA_FOLDER_LABEL[button.dataset.openArea]} 폴더`));
      button.addEventListener("dblclick", () => openExplorer(button.dataset.openArea));
    });

    els.virtualDesktop.querySelectorAll("[data-open-app], [data-task-app]").forEach((button) => {
      button.addEventListener("click", () => {
        openApp(button.dataset.openApp || button.dataset.taskApp);
        startMenu.classList.remove("open");
      });
    });

    els.virtualDesktop.querySelectorAll("[data-area-shortcut]").forEach((button) => {
      button.addEventListener("click", () => {
        openExplorer(button.dataset.areaShortcut);
        startMenu.classList.remove("open");
      });
    });

    els.virtualDesktop.querySelectorAll("[data-window-action]").forEach((button) => {
      button.addEventListener("click", () => handleWindowAction(button));
    });

    els.virtualDesktop.querySelectorAll("[data-explorer-area]").forEach((button) => {
      button.addEventListener("click", () => {
        explorerArea = button.dataset.explorerArea;
        explorerMode = explorerArea === "trash" || explorerArea === "apps" ? "folders" : explorerMode;
        renderExplorerContent(modules);
      });
    });

    els.virtualDesktop.querySelectorAll("[data-explorer-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        explorerMode = button.dataset.explorerMode;
        renderExplorerContent(modules);
      });
    });

    wireDesktopFiles(status);
    wireFreeDesktopDrag();
    els.virtualDesktop.querySelectorAll(".desktop-window, .desktop-app-window").forEach((windowNode) => wireDesktopWindowDrag(windowNode));
    wireDesktopPaint(status);
    wireDesktopCalculator();
    wireDesktopNotepad(status);
    wireDesktopMinesweeper();
    wireDesktopSheet();
  }

  function renderExplorerContent(modules) {
    const content = els.virtualDesktop.querySelector("[data-explorer-content]");
    const address = els.virtualDesktop.querySelector("[data-explorer-address]");
    const title = els.virtualDesktop.querySelector("[data-explorer-title]");
    if (!content || !address || !title) return;

    const label = explorerLabel();
    address.textContent = label;
    title.textContent = label;
    els.virtualDesktop.querySelectorAll("[data-explorer-area]").forEach((button) => {
      button.classList.toggle("active", button.dataset.explorerArea === explorerArea);
    });
    els.virtualDesktop.querySelectorAll("[data-explorer-mode]").forEach((button) => {
      button.classList.toggle("active", button.dataset.explorerMode === explorerMode);
      button.disabled = explorerArea === "apps" || explorerArea === "trash";
    });

    if (explorerArea === "trash") {
      content.innerHTML = `<div class="empty-folder"><strong>휴지통</strong><span>파일을 끌어 놓으면 이곳으로 이동합니다.</span></div>`;
      return;
    }

    if (explorerArea === "apps") {
      content.innerHTML = `
        <div class="explorer-grid app-grid">
          ${OS_APPS.map((app) => `<button class="explorer-app-card" type="button" data-open-app="${app.id}"><span class="app-icon ${app.icon}"></span><strong>${app.label}</strong></button>`).join("")}
        </div>
      `;
      content.querySelectorAll("[data-open-app]").forEach((button) => button.addEventListener("click", () => openApp(button.dataset.openApp)));
      return;
    }

    if (explorerMode === "practice") {
      content.innerHTML = `
        <div class="explorer-practice-board">
          <button class="explorer-file-card explorer-practice-doc" type="button">학습정리.txt</button>
          <button class="explorer-file-card explorer-practice-temp" type="button">임시파일.tmp</button>
          <div class="explorer-drop-zone explorer-study-drop">학습 폴더</div>
          <div class="explorer-drop-zone explorer-bin-drop">휴지통</div>
          <strong class="explorer-practice-status">파일을 알맞은 곳으로 끌어다 놓으세요.</strong>
        </div>
        ${renderAreaModules(modules)}
      `;
      wireExplorerPractice(content);
      wireExplorerModuleActions(content);
      return;
    }

    content.innerHTML = explorerArea === "all" ? renderRootFolders() : renderAreaModules(modules);
    content.querySelectorAll("[data-open-area-folder]").forEach((button) => button.addEventListener("dblclick", () => openExplorer(button.dataset.openAreaFolder)));
    content.querySelectorAll("[data-open-area-folder]").forEach((button) => button.addEventListener("click", () => setExplorerStatus(`${AREA_FOLDER_LABEL[button.dataset.openAreaFolder]} 폴더`)));
    content.querySelectorAll("[data-explorer-area]").forEach((button) => button.addEventListener("dblclick", () => {
      explorerArea = button.dataset.explorerArea;
      renderExplorerContent(modules);
    }));
    wireExplorerModuleActions(content);
  }

  function wireExplorerModuleActions(content) {
    content.querySelectorAll("[data-open-module]").forEach((button) => {
      button.addEventListener("click", () => selectModule(button.dataset.openModule));
      button.addEventListener("dblclick", () => launchModuleFromExplorer(button.dataset.openModule));
    });
    content.querySelectorAll("[data-launch-module]").forEach((button) => button.addEventListener("click", () => launchModuleFromExplorer(button.dataset.launchModule)));
  }

  function renderRootFolders() {
    return `
      <div class="explorer-grid folder-grid">
        ${AREAS.map((area) => `
          <button class="explorer-folder-card" data-open-area-folder="${area.id}" type="button">
            <span class="app-icon folder-icon area-folder-icon" style="--area-color:${area.accent}"></span>
            <strong>${AREA_FOLDER_LABEL[area.id]}</strong>
            <small>${area.modules.length}개 활동</small>
          </button>
        `).join("")}
        <button class="explorer-folder-card" data-explorer-area="apps" type="button">
          <span class="app-icon pc-icon"></span>
          <strong>기본 앱</strong>
          <small>그림판, 계산기, 메모장</small>
        </button>
      </div>
    `;
  }

  function renderAreaModules(modules) {
    const areaModules = explorerArea === "all" ? modules : modules.filter((module) => module.area.id === explorerArea);
    return `
      <div class="explorer-grid module-file-grid">
        ${areaModules.map((module) => `
          <article class="explorer-module-file" data-open-module="${module.id}" tabindex="0">
            <span class="app-icon ${AREA_ICON_CLASS[module.area.id] || "folder-icon"}"></span>
            <div>
              <strong>${module.title}</strong>
              <small>${module.area.name} · ${module.skills.slice(0, 3).join(" · ")}</small>
            </div>
            <button class="primary-button" type="button" ${module.status === "자리" ? "disabled" : `data-launch-module="${module.id}"`}>
              ${module.status === "자리" ? "준비 중" : "활동 시작"}
            </button>
          </article>
        `).join("")}
      </div>
    `;
  }

  function explorerLabel() {
    if (explorerArea === "all") return "내 컴퓨터";
    if (explorerArea === "apps") return "기본 앱";
    if (explorerArea === "trash") return "휴지통";
    const area = AREAS.find((item) => item.id === explorerArea);
    return area ? AREA_FOLDER_LABEL[area.id] : "내 컴퓨터";
  }

  function openExplorer(areaId = "all") {
    explorerArea = areaId;
    openUtilityWindow("explorer");
    renderExplorerContent(getAllModules());
    setExplorerStatus(`${explorerLabel()}을 열었습니다.`);
  }

  function selectModule(moduleId) {
    selectedModuleId = moduleId;
    const module = getAllModules().find((item) => item.id === moduleId);
    if (!module) return;
    setExplorerStatus(`${module.area.name} · ${module.title}`);
    onSelectModule?.(moduleId);
  }

  function launchModuleFromExplorer(moduleId) {
    const module = getAllModules().find((item) => item.id === moduleId);
    if (!module) return;
    selectModule(moduleId);
    if (module.status === "자리") {
      setExplorerStatus(`${module.title}는 아직 연결하지 않습니다.`);
      return;
    }
    onOpenModule(moduleId);
  }

  function selectDesktopIcon(button, label) {
    els.virtualDesktop.querySelectorAll(".desktop-icon").forEach((icon) => icon.classList.toggle("selected", icon === button));
    setExplorerStatus(label);
  }

  function setExplorerStatus(text) {
    const status = els.virtualDesktop.querySelector(".desktop-status");
    if (status) status.textContent = text;
  }

  function wireDesktopFiles(status) {
    const doc = els.virtualDesktop.querySelector(".desktop-doc-file");
    const saved = els.virtualDesktop.querySelector(".desktop-saved-file");
    const paintFile = els.virtualDesktop.querySelector(".desktop-paint-file");
    const temp = els.virtualDesktop.querySelector(".desktop-temp-file");
    const folder = els.virtualDesktop.querySelector(".desktop-folder-drop");
    const trash = els.virtualDesktop.querySelector(".desktop-trash-drop");

    [doc, saved, paintFile, temp].forEach((file) => {
      file?.addEventListener("click", () => {
        els.virtualDesktop.querySelectorAll(".desktop-file-icon").forEach((node) => node.classList.toggle("selected", node === file));
        status.textContent = `${file.textContent.trim()} 파일`;
      });
    });

    doc.addEventListener("dblclick", () => openApp("notepad"));
    saved.addEventListener("dblclick", () => openApp("notepad"));
    paintFile.addEventListener("dblclick", () => openApp("image-viewer"));

    makeFreeDraggable(doc, {
      dropTarget: folder,
      onDrop: () => {
        doc.classList.add("file-in-folder");
        status.textContent = "연습.txt를 학습 폴더에 정리했습니다.";
      },
      onMiss: () => {
        status.textContent = "연습.txt를 원하는 위치에 놓았습니다. 학습 폴더 위에 놓으면 정리됩니다.";
      },
    });

    makeFreeDraggable(temp, {
      dropTarget: trash,
      onDrop: () => {
        temp.classList.add("hidden");
        status.textContent = "임시.tmp를 휴지통으로 보냈습니다.";
      },
      onMiss: () => {
        status.textContent = "임시.tmp를 원하는 위치에 놓았습니다. 휴지통 위에 놓으면 삭제됩니다.";
      },
    });
  }

  function wireFreeDesktopDrag() {
    els.virtualDesktop.querySelectorAll(".desktop-icon, .desktop-drop").forEach((item) => {
      makeFreeDraggable(item);
    });
    els.virtualDesktop.querySelectorAll(".desktop-saved-file, .desktop-paint-file").forEach((item) => {
      makeFreeDraggable(item);
    });
  }

  function makeFreeDraggable(item, options = {}) {
    let drag = null;
    let suppressClick = false;

    const startDrag = (clientX, clientY) => {
      if (drag) return;
      const rect = item.getBoundingClientRect();
      const box = els.virtualDesktop.getBoundingClientRect();
      const computed = getComputedStyle(item);
      item.style.position = "absolute";
      item.style.left = `${rect.left - box.left}px`;
      item.style.top = `${rect.top - box.top}px`;
      item.style.right = "auto";
      item.style.bottom = "auto";
      item.style.zIndex = String(nextWindowZ());
      drag = {
        x: clientX - rect.left,
        y: clientY - rect.top,
        startX: clientX,
        startY: clientY,
        display: computed.display,
        moved: false,
      };
    };

    const moveDrag = (clientX, clientY) => {
      if (!drag) return;
      const box = els.virtualDesktop.getBoundingClientRect();
      const left = Math.max(6, Math.min(box.width - item.offsetWidth - 6, clientX - box.left - drag.x));
      const top = Math.max(6, Math.min(box.height - item.offsetHeight - 66, clientY - box.top - drag.y));
      item.style.left = `${left}px`;
      item.style.top = `${top}px`;
      drag.moved = Math.abs(clientX - drag.startX) + Math.abs(clientY - drag.startY) > 4;
      item.classList.toggle("dragging", drag.moved);
      options.dropTarget?.classList.toggle("drop-hover", isInsideDrop(item, options.dropTarget));
    };

    const finishDrag = (event) => {
      if (!drag) return;
      const moved = drag.moved;
      item.classList.remove("dragging");
      drag = null;
      if (options.dropTarget) {
        const inside = isInsideDrop(item, options.dropTarget);
        options.dropTarget.classList.remove("drop-hover");
        if (inside) {
          snapFreeItemIntoDrop(item, options.dropTarget, options.onDrop);
          suppressClick = true;
          return;
        }
      }
      if (moved) {
        options.onMiss?.();
        suppressClick = true;
        event?.preventDefault();
      }
    };

    item.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      startDrag(event.clientX, event.clientY);
      item.setPointerCapture?.(event.pointerId);
    });
    item.addEventListener("pointermove", (event) => moveDrag(event.clientX, event.clientY));
    item.addEventListener("pointerup", finishDrag);
    item.addEventListener("mousedown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      startDrag(event.clientX, event.clientY);
    });
    els.virtualDesktop.addEventListener("mousemove", (event) => moveDrag(event.clientX, event.clientY));
    els.virtualDesktop.addEventListener("mouseup", finishDrag);
    item.addEventListener("click", (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    }, true);
  }

  function isInsideDrop(item, drop) {
    const a = item.getBoundingClientRect();
    const b = drop.getBoundingClientRect();
    const center = { x: a.left + a.width / 2, y: a.top + a.height / 2 };
    return center.x >= b.left && center.x <= b.right && center.y >= b.top && center.y <= b.bottom;
  }

  function snapFreeItemIntoDrop(item, drop, callback) {
    const box = els.virtualDesktop.getBoundingClientRect();
    const b = drop.getBoundingClientRect();
    item.classList.add("dropped");
    item.style.left = `${b.left - box.left + (b.width - item.offsetWidth) / 2}px`;
    item.style.top = `${b.top - box.top + (b.height - item.offsetHeight) / 2}px`;
    window.setTimeout(() => {
      item.classList.remove("dropped");
      callback?.();
    }, 220);
  }

  function wireExplorerPractice(content) {
    const board = content.querySelector(".explorer-practice-board");
    const doc = content.querySelector(".explorer-practice-doc");
    const temp = content.querySelector(".explorer-practice-temp");
    const folder = content.querySelector(".explorer-study-drop");
    const bin = content.querySelector(".explorer-bin-drop");
    const status = content.querySelector(".explorer-practice-status");
    const done = new Set();
    const mark = (id, text) => {
      done.add(id);
      status.textContent = done.size >= 2 ? "파일 정리를 마쳤습니다." : text;
    };
    wireDrag(board, doc, folder, () => mark("doc", "학습정리.txt를 학습 폴더에 넣었습니다."), () => {
      status.textContent = "학습정리.txt는 학습 폴더로 옮겨보세요.";
    });
    wireDrag(board, temp, bin, () => {
      temp.classList.add("hidden");
      mark("temp", "임시파일.tmp를 휴지통에 넣었습니다.");
    }, () => {
      status.textContent = "임시파일.tmp는 휴지통으로 옮겨보세요.";
    });
  }

  function openApp(appId) {
    if (appId === "explorer") {
      openExplorer(explorerArea);
      return;
    }
    const windowNode = els.virtualDesktop.querySelector(`[data-app-window="${appId}"]`);
    if (!windowNode) return;
    windowNode.classList.remove("minimized");
    windowNode.classList.add("open");
    windowNode.style.zIndex = String(nextWindowZ());
  }

  function openUtilityWindow(id) {
    const windowNode = els.virtualDesktop.querySelector(`[data-utility-window="${id}"]`);
    if (!windowNode) return;
    windowNode.classList.remove("minimized");
    windowNode.classList.add("open");
    windowNode.style.zIndex = String(nextWindowZ());
  }

  function getWindowNode(button) {
    const selector = button.dataset.windowKind === "app" ? `[data-app-window="${button.dataset.windowId}"]` : `[data-utility-window="${button.dataset.windowId}"]`;
    return els.virtualDesktop.querySelector(selector);
  }

  function handleWindowAction(button) {
    const windowNode = getWindowNode(button);
    if (!windowNode) return;
    if (button.dataset.windowAction === "close") closeWindow(windowNode);
    if (button.dataset.windowAction === "minimize") minimizeWindow(windowNode);
    if (button.dataset.windowAction === "maximize") maximizeWindow(windowNode);
  }

  function closeWindow(windowNode) {
    windowNode.classList.remove("open", "minimized", "maximized");
  }

  function minimizeWindow(windowNode) {
    windowNode.classList.add("minimized");
    windowNode.classList.remove("open");
  }

  function maximizeWindow(windowNode) {
    windowNode.classList.remove("minimized");
    windowNode.classList.add("open");
    windowNode.classList.toggle("maximized");
    windowNode.style.zIndex = String(nextWindowZ());
  }

  function nextWindowZ() {
    const windows = Array.from(els.virtualDesktop.querySelectorAll(".desktop-window, .desktop-app-window"));
    return Math.max(8, ...windows.map((node) => Number(node.style.zIndex) || 8)) + 1;
  }

  function wireDesktopWindowDrag(windowNode) {
    const header = windowNode.querySelector("header");
    let drag = null;
    header.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button") || windowNode.classList.contains("maximized")) return;
      const rect = windowNode.getBoundingClientRect();
      drag = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      windowNode.style.zIndex = String(nextWindowZ());
      header.setPointerCapture?.(event.pointerId);
    });
    header.addEventListener("pointermove", (event) => {
      if (!drag) return;
      const box = els.virtualDesktop.getBoundingClientRect();
      windowNode.style.left = `${Math.max(8, Math.min(box.width - windowNode.offsetWidth - 8, event.clientX - box.left - drag.x))}px`;
      windowNode.style.top = `${Math.max(8, Math.min(box.height - windowNode.offsetHeight - 78, event.clientY - box.top - drag.y))}px`;
    });
    header.addEventListener("pointerup", () => {
      drag = null;
    });
  }

  function wireDesktopPaint(status) {
    const paintCanvas = els.virtualDesktop.querySelector(".desktop-paint-canvas");
    const clearButton = els.virtualDesktop.querySelector("[data-clear-paint]");
    const sizeInput = els.virtualDesktop.querySelector("[data-paint-size]");
    const painter = paintCanvas.getContext("2d");
    const paintState = { tool: "pen", color: "#2b6eea", drawing: false };

    painter.lineWidth = Number(sizeInput.value);
    painter.lineCap = "round";
    painter.lineJoin = "round";
    painter.strokeStyle = paintState.color;

    const point = (event) => {
      const rect = paintCanvas.getBoundingClientRect();
      return { x: ((event.clientX - rect.left) / rect.width) * paintCanvas.width, y: ((event.clientY - rect.top) / rect.height) * paintCanvas.height };
    };

    els.virtualDesktop.querySelectorAll("[data-paint-tool]").forEach((button) => {
      button.addEventListener("click", () => {
        paintState.tool = button.dataset.paintTool;
        els.virtualDesktop.querySelectorAll("[data-paint-tool]").forEach((node) => node.classList.toggle("active", node === button));
      });
    });

    els.virtualDesktop.querySelectorAll("[data-paint-color]").forEach((button) => {
      button.addEventListener("click", () => {
        paintState.color = button.dataset.paintColor;
        els.virtualDesktop.querySelectorAll("[data-paint-color]").forEach((node) => node.classList.toggle("active", node === button));
      });
    });

    sizeInput.addEventListener("input", () => {
      painter.lineWidth = Number(sizeInput.value);
    });

    paintCanvas.addEventListener("pointerdown", (event) => {
      paintState.drawing = true;
      paintCanvas.setPointerCapture?.(event.pointerId);
      const p = point(event);
      painter.beginPath();
      painter.moveTo(p.x, p.y);
      status.textContent = "그림판에서 선을 그리고 있습니다.";
    });
    paintCanvas.addEventListener("pointermove", (event) => {
      if (!paintState.drawing) return;
      const p = point(event);
      painter.globalCompositeOperation = paintState.tool === "eraser" ? "destination-out" : "source-over";
      painter.strokeStyle = paintState.color;
      painter.lineTo(p.x, p.y);
      painter.stroke();
    });
    paintCanvas.addEventListener("pointerup", () => {
      paintState.drawing = false;
      painter.globalCompositeOperation = "source-over";
    });
    paintCanvas.addEventListener("pointerleave", () => {
      paintState.drawing = false;
      painter.globalCompositeOperation = "source-over";
    });
    clearButton.addEventListener("click", () => {
      painter.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
      status.textContent = "그림판을 비웠습니다.";
    });
    els.virtualDesktop.querySelector("[data-save-paint]").addEventListener("click", () => {
      const paintFile = els.virtualDesktop.querySelector(".desktop-paint-file");
      const preview = els.virtualDesktop.querySelector("[data-paint-preview]");
      preview.src = paintCanvas.toDataURL("image/png");
      paintFile.classList.remove("hidden");
      status.textContent = "그림을 그림.png로 저장했습니다.";
    });
  }

  function wireDesktopCalculator() {
    const display = els.virtualDesktop.querySelector("[data-calculator-display]");
    let expression = "";
    const renderValue = () => {
      display.textContent = expression || "0";
    };
    els.virtualDesktop.querySelectorAll("[data-calc-key]").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.calcKey;
        if (key === "C") {
          expression = "";
        } else if (key === "←") {
          expression = expression.slice(0, -1);
        } else if (key === "=") {
          expression = calculateExpression(expression);
        } else {
          expression += key;
        }
        renderValue();
      });
    });
  }

  function calculateExpression(expression) {
    if (!expression || !/^[0-9+\-*/.() ]+$/.test(expression)) return "0";
    try {
      const result = Function(`"use strict"; return (${expression})`)();
      return Number.isFinite(result) ? String(Math.round(result * 1000000) / 1000000) : "0";
    } catch {
      return "0";
    }
  }

  function wireDesktopNotepad(status) {
    const saveButton = els.virtualDesktop.querySelector("[data-save-note]");
    const noteStatus = els.virtualDesktop.querySelector("[data-note-status]");
    const savedFile = els.virtualDesktop.querySelector(".desktop-saved-file");
    saveButton.addEventListener("click", () => {
      savedFile.classList.remove("hidden");
      noteStatus.textContent = "바탕화면에 내메모.txt로 저장했습니다.";
      status.textContent = "메모장을 저장했습니다.";
    });
  }

  function wireDesktopMinesweeper() {
    const numbers = [1, 0, 2, 1, 0, 0, 1, "★", 2, 1, 1, 2, 2, 2, "★", 0, 1, "★", 2, 1, 0, 1, 1, 1, 0];
    const reset = () => {
      els.virtualDesktop.querySelectorAll("[data-mine-cell]").forEach((button) => {
        button.textContent = "";
        button.classList.remove("open", "mine");
      });
    };
    els.virtualDesktop.querySelectorAll("[data-mine-cell]").forEach((button) => {
      button.addEventListener("click", () => {
        const value = numbers[Number(button.dataset.mineCell)];
        button.textContent = value || "";
        button.classList.add(value === "★" ? "mine" : "open");
      });
    });
    els.virtualDesktop.querySelector("[data-reset-mines]").addEventListener("click", reset);
  }

  function wireDesktopSheet() {
    const sumButton = els.virtualDesktop.querySelector("[data-sheet-sum]");
    const result = els.virtualDesktop.querySelector(".sheet-result");
    sumButton.addEventListener("click", () => {
      const total = Array.from(els.virtualDesktop.querySelectorAll(".sheet-body input")).reduce((acc, input) => acc + Number(input.value || 0), 0);
      result.textContent = `합계 ${total}`;
    });
  }

  function updateClock() {
    const clock = els.virtualDesktop.querySelector("[data-desktop-clock]");
    if (!clock) return;
    const now = new Date();
    clock.textContent = now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  }

  return { render };
}
