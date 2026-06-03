import { countMatchingPrefix, createEl, wireDrag } from "../core/dom.js";

export function renderIctControls(canvas, ctx) {
  const tasks = [
    renderPointerTask,
    renderMousePathTask,
    renderDialogClickTask,
    renderDoubleClickTask,
    renderFileDragTask,
    renderTrashDragTask,
    renderScrollTask,
    renderKeyboardBriefingTask,
    renderKeyboardTask,
    renderCorrectionTask,
    renderShortcutSaveTask,
    renderTabEnterTask,
    renderPaintTraceKoreanTask,
    renderPaintTraceNumberTask,
    renderPaintTraceEnglishTask,
  ];
  tasks[ctx.state.taskIndex](canvas, ctx);
}

function renderPointerTask(canvas, ctx) {
  ctx.setGuide("포인터 이동", "파란 선택 영역 10개를 순서대로 찾아 커서를 옮겨보세요.");
  const points = [
    [12, 18], [76, 16], [42, 28], [18, 54], [70, 50],
    [48, 68], [24, 78], [82, 76], [58, 38], [36, 44],
  ];
  let targetIndex = 0;
  const panel = createEl("div", "control-desktop");
  panel.innerHTML = `
    <div class="control-window">
      <header><strong>마우스 연습</strong><span class="pointer-count">1 / ${points.length}</span></header>
      <div class="pointer-track">
        <div class="soft-grid"></div>
        <div class="mission-object target-zone" data-guide-target="true">1</div>
      </div>
    </div>
  `;
  const target = panel.querySelector(".target-zone");
  const counter = panel.querySelector(".pointer-count");
  const placeTarget = () => {
    const [left, top] = points[targetIndex];
    target.style.left = `${left}%`;
    target.style.top = `${top}%`;
    target.textContent = `${targetIndex + 1}`;
    counter.textContent = `${targetIndex + 1} / ${points.length}`;
    ctx.updateProgress(targetIndex / points.length);
  };
  const hitTarget = () => {
    if (ctx.state.taskLocked) return;
    target.classList.add("target-hit");
    window.setTimeout(() => target.classList.remove("target-hit"), 160);
    targetIndex += 1;
    ctx.markAction();
    ctx.updateProgress(targetIndex / points.length);
    if (targetIndex >= points.length) {
      ctx.completeTask("10개의 선택 영역을 모두 찾아 움직였습니다.", {
        reason: "마우스 포인터가 목표 영역 안으로 들어가면 컴퓨터가 그 위치를 알아차리기 때문입니다.",
      });
      return;
    }
    ctx.setGuide("잘했어요!", `다음 위치 ${targetIndex + 1}번으로 천천히 이동해보세요.`);
    placeTarget();
  };
  target.addEventListener("mouseenter", hitTarget);
  target.addEventListener("click", hitTarget);
  panel.addEventListener("mousemove", (event) => {
    const rect = target.getBoundingClientRect();
    if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
      hitTarget();
    }
  });
  placeTarget();
  canvas.append(panel);
}

function renderMousePathTask(canvas, ctx) {
  ctx.setGuide("정해진 경로 이동", "출발점에서 도착점까지 점선을 따라 천천히 마우스를 움직여보세요.");
  const checkpoints = [
    [16, 74], [28, 42], [44, 54], [58, 28], [72, 46], [84, 22],
  ];
  let current = 0;
  const panel = createEl("div", "control-desktop");
  panel.innerHTML = `
    <div class="control-window">
      <header><strong>경로 따라가기</strong><span class="path-count">출발 준비</span></header>
      <div class="mouse-path-track" data-guide-target="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M16 74 C24 46, 33 34, 44 54 S58 26, 72 46 S78 32, 84 22" />
        </svg>
        ${checkpoints.map((point, index) => `<span class="path-check ${index === 0 ? "active" : ""}" style="left:${point[0]}%;top:${point[1]}%">${index === 0 ? "출발" : index === checkpoints.length - 1 ? "도착" : index}</span>`).join("")}
        <div class="path-feedback">출발점을 지나가세요.</div>
      </div>
    </div>
  `;
  const counter = panel.querySelector(".path-count");
  const feedback = panel.querySelector(".path-feedback");
  const checks = Array.from(panel.querySelectorAll(".path-check"));
  const hitCheckpoint = (index) => {
    if (index !== current || ctx.state.taskLocked) return;
    checks[index].classList.add("done");
    checks[index].classList.remove("active");
    current += 1;
    ctx.markAction();
    ctx.updateProgress(current / checkpoints.length);
    feedback.textContent = current >= checkpoints.length ? "잘했어요. 경로를 끝까지 따라왔습니다." : `잘했어요. 다음 표시 ${current + 1}로 이동하세요.`;
    counter.textContent = `${Math.min(current + 1, checkpoints.length)} / ${checkpoints.length}`;
    checks[current]?.classList.add("active");
    if (current >= checkpoints.length) ctx.completeTask("이번에는 알림창의 버튼을 정확히 눌러봅니다.");
  };
  panel.addEventListener("mousemove", (event) => {
    checks.forEach((check, index) => {
      const rect = check.getBoundingClientRect();
      if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) hitCheckpoint(index);
    });
  });
  checks.forEach((check, index) => check.addEventListener("mouseenter", () => hitCheckpoint(index)));
  canvas.append(panel);
}

function renderDialogClickTask(canvas, ctx) {
  ctx.setGuide("버튼 고르기", "알림창에서 '확인' 버튼을 찾아 눌러보세요.");
  const panel = createEl("div", "control-desktop");
  panel.innerHTML = `
    <div class="dialog-task">
      <div class="system-dialog">
        <header>디지터시 컴퓨터</header>
        <p>새 학습 파일을 열 준비가 되었습니다.</p>
        <div class="dialog-actions">
          <button class="secondary-button" type="button">나중에</button>
          <button class="primary-button" data-guide-target="true" type="button">확인</button>
        </div>
      </div>
    </div>
  `;
  panel.querySelector(".secondary-button").addEventListener("click", () => ctx.showWrong("'확인' 버튼을 찾아 다시 눌러보세요."));
  panel.querySelector(".primary-button").addEventListener("click", () => ctx.completeTask("이번에는 파일을 폴더로 옮겨봅니다."));
  canvas.append(panel);
}

function renderDoubleClickTask(canvas, ctx) {
  ctx.setGuide("두 번 클릭", "문서 아이콘을 두 번 빠르게 눌러 파일을 열어보세요.");
  const panel = createEl("div", "control-desktop");
  panel.innerHTML = `
    <div class="icon-open-task">
      <button class="file-card double-open-file" data-guide-target="true" type="button">오늘의 연습.txt</button>
      <div class="system-dialog mini-doc-preview" aria-live="polite">
        <header>문서 미리보기</header>
        <p>아이콘을 두 번 누르면 문서가 열립니다.</p>
      </div>
    </div>
  `;
  const icon = panel.querySelector(".double-open-file");
  const preview = panel.querySelector(".mini-doc-preview");
  icon.addEventListener("click", () => {
    ctx.markAction();
    ctx.updateProgress(0.35);
    ctx.setGuide("두 번 클릭", "좋아요. 같은 아이콘을 빠르게 한 번 더 눌러보세요.");
  });
  icon.addEventListener("dblclick", () => {
    preview.classList.add("open");
    ctx.completeTask("이번에는 파일을 폴더로 옮겨봅니다.");
  });
  canvas.append(panel);
}

function renderFileDragTask(canvas, ctx) {
  ctx.setGuide("드래그", "왼쪽의 파일을 오른쪽 '연습 폴더' 안으로 끌어다 놓으세요.");
  const panel = createEl("div", "control-desktop");
  panel.innerHTML = `
    <div class="file-sort-area">
      <div class="file-card" data-guide-target="true">연습.txt</div>
      <div class="folder-drop">연습 폴더</div>
    </div>
  `;
  const area = panel.querySelector(".file-sort-area");
  wireDrag(
    area,
    panel.querySelector(".file-card"),
    panel.querySelector(".folder-drop"),
    () => ctx.completeTask("이번에는 긴 화면에서 필요한 항목을 찾아봅니다."),
    () => ctx.showWrong("파일의 가운데가 폴더 안에 들어가도록 놓아보세요."),
  );
  canvas.append(panel);
}

function renderTrashDragTask(canvas, ctx) {
  ctx.setGuide("정리 드래그", "필요 없는 임시 파일을 휴지통 위로 끌어다 놓으세요.");
  const panel = createEl("div", "control-desktop");
  panel.innerHTML = `
    <div class="file-sort-area">
      <div class="file-card temp-practice-file" data-guide-target="true">임시.tmp</div>
      <div class="practice-trash-bin">휴지통</div>
    </div>
  `;
  const area = panel.querySelector(".file-sort-area");
  wireDrag(
    area,
    panel.querySelector(".temp-practice-file"),
    panel.querySelector(".practice-trash-bin"),
    () => ctx.completeTask("이번에는 긴 화면에서 필요한 항목을 찾아봅니다."),
    () => ctx.showWrong("파일을 휴지통 가운데에 놓아보세요."),
  );
  canvas.append(panel);
}

function renderScrollTask(canvas, ctx) {
  ctx.setGuide("스크롤", "목록을 아래로 내려 '다 찾았어요' 버튼을 찾아 누르세요.");
  const panel = createEl("div", "control-desktop");
  const rows = Array.from({ length: 12 }, (_, index) => `<li>연습 항목 ${index + 1}</li>`).join("");
  panel.innerHTML = `
    <div class="scroll-task">
      <div class="mission-prompt"><span>스크롤 연습</span><strong>아래쪽에 숨어 있는 버튼을 찾습니다.</strong></div>
      <div class="scroll-list" data-guide-target="true">
        <ul>
          ${rows}
          <li class="finish-row"><button class="primary-button" type="button">다 찾았어요</button></li>
        </ul>
      </div>
    </div>
  `;
  const list = panel.querySelector(".scroll-list");
  list.addEventListener("scroll", () => {
    ctx.markAction();
    const max = list.scrollHeight - list.clientHeight;
    ctx.updateProgress(max > 0 ? Math.min(0.9, list.scrollTop / max) : 0);
  });
  panel.querySelector(".finish-row button").addEventListener("click", () => ctx.completeTask("마지막으로 키보드를 써봅니다."));
  canvas.append(panel);
}

function renderKeyboardBriefingTask(canvas, ctx) {
  ctx.setGuide("키 역할 알아보기", "키 카드를 하나씩 눌러 어떤 일을 하는지 살펴보세요.");
  const keys = [
    ["letter", "글자키", "글자와 숫자를 입력합니다."],
    ["shift", "Shift", "누른 채 글자키를 누르면 큰 글자나 위쪽 기호가 입력됩니다."],
    ["tab", "Tab", "다음 입력칸이나 버튼으로 이동합니다."],
    ["control", "Ctrl", "다른 키와 함께 눌러 빠른 일을 합니다."],
    ["alt", "Alt", "메뉴나 보조 명령을 선택할 때 씁니다."],
    ["space", "Space", "글자 사이를 띄웁니다."],
    ["enter", "Enter", "줄을 바꾸거나 선택한 버튼을 누릅니다."],
  ];
  const checked = new Set();
  const board = createEl("div", "key-brief-board");
  board.innerHTML = `
    <div class="mission-prompt"><span>키보드 브리핑</span><strong>키가 하는 일을 하나씩 살펴봅니다.</strong></div>
    <div class="key-card-grid">
      ${keys.map(([id, label, desc]) => `<button type="button" data-key-card="${id}"><strong>${label}</strong><span>${desc}</span></button>`).join("")}
    </div>
    <div class="key-brief-status">0 / ${keys.length} 확인</div>
  `;
  const status = board.querySelector(".key-brief-status");
  board.querySelectorAll("[data-key-card]").forEach((button) => {
    button.addEventListener("click", () => {
      checked.add(button.dataset.keyCard);
      button.classList.add("checked");
      ctx.markAction();
      ctx.updateProgress(checked.size / keys.length);
      status.textContent = `${checked.size} / ${keys.length} 확인`;
      if (checked.size >= keys.length) ctx.completeTask("이제 실제 글자를 입력해봅니다.");
    });
  });
  canvas.append(board);
}

function renderKeyboardTask(canvas, ctx) {
  const targetText = "저장 완료";
  ctx.setGuide("키보드", "입력칸에 '저장 완료'를 정확히 입력해보세요.");
  const board = createEl("div", "type-board compact");
  board.innerHTML = `
    <div class="mission-prompt"><span>키보드 입력</span><strong>${targetText}</strong></div>
    <label class="type-input-wrap"><span>입력칸</span><input class="type-input" data-guide-target="true" autocomplete="off" /></label>
  `;
  const input = board.querySelector("input");
  input.addEventListener("input", () => {
    ctx.markAction();
    const match = countMatchingPrefix(input.value, targetText);
    ctx.updateProgress(match / targetText.length);
    input.classList.toggle("wrong", Boolean(input.value && !targetText.startsWith(input.value)));
    if (input.value.trim() === targetText) ctx.completeTask();
  });
  canvas.append(board);
  input.focus();
}

function renderCorrectionTask(canvas, ctx) {
  const targetText = "저장 완료";
  ctx.setGuide("오타 고치기", "입력칸의 틀린 글자를 지우고 '저장 완료'로 고쳐보세요.");
  const board = createEl("div", "type-board compact");
  board.innerHTML = `
    <div class="mission-prompt"><span>수정 연습</span><strong>${targetText}</strong></div>
    <label class="type-input-wrap"><span>입력칸</span><input class="type-input" data-guide-target="true" autocomplete="off" value="저장 완려" /></label>
  `;
  const input = board.querySelector("input");
  input.addEventListener("input", () => {
    ctx.markAction();
    const match = countMatchingPrefix(input.value, targetText);
    ctx.updateProgress(match / targetText.length);
    input.classList.toggle("wrong", Boolean(input.value && input.value !== targetText));
    if (input.value === targetText) ctx.completeTask("이번에는 저장 단축키를 눌러봅니다.");
  });
  canvas.append(board);
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

function renderShortcutSaveTask(canvas, ctx) {
  ctx.setGuide("저장 단축키", "Ctrl 키를 계속 누른 채 S 키를 한 번 눌러 저장해보세요. + 키는 누르지 않습니다.");
  const board = createEl("div", "type-board compact shortcut-task");
  board.innerHTML = `
    <div class="mission-prompt"><span>저장 단축키</span><strong>Ctrl 키를 누른 채 S 키 누르기</strong></div>
    <textarea class="shortcut-editor" data-guide-target="true" autocomplete="off">내 파일을 저장해요</textarea>
    <div class="shortcut-keys" aria-hidden="true"><span>Ctrl 계속 누르기</span><span>S 한 번 누르기</span></div>
    <div class="shortcut-status">아직 저장되지 않았습니다.</div>
  `;
  const editor = board.querySelector(".shortcut-editor");
  const status = board.querySelector(".shortcut-status");
  editor.addEventListener("input", () => {
    ctx.markAction();
    ctx.updateProgress(0.35);
  });
  editor.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      status.textContent = "저장되었습니다.";
      board.classList.add("saved");
      ctx.completeTask("마지막으로 키보드 이동을 연습합니다.");
    }
  });
  canvas.append(board);
  editor.focus();
}

function renderTabEnterTask(canvas, ctx) {
  ctx.setGuide("키보드 이동", "Tab 키로 '확인' 버튼까지 이동한 뒤 Enter 키를 눌러보세요.");
  const panel = createEl("div", "control-desktop");
  panel.innerHTML = `
    <div class="dialog-task">
      <div class="system-dialog">
        <header>키보드로 조작하기</header>
        <p>마우스 없이도 Tab과 Enter로 버튼을 고를 수 있습니다.</p>
        <div class="dialog-actions">
          <button class="secondary-button" type="button">취소</button>
          <button class="primary-button keyboard-confirm" data-guide-target="true" type="button">확인</button>
        </div>
      </div>
    </div>
  `;
  const cancel = panel.querySelector(".secondary-button");
  const confirm = panel.querySelector(".keyboard-confirm");
  cancel.addEventListener("click", () => ctx.showWrong("Tab 키로 '확인' 버튼까지 가서 Enter 키를 눌러보세요."));
  confirm.addEventListener("click", () => ctx.completeTask());
  panel.addEventListener("keydown", (event) => {
    ctx.markAction();
    if (event.key === "Tab") ctx.updateProgress(0.55);
    if (event.key === "Enter" && document.activeElement === confirm) ctx.completeTask();
  });
  canvas.append(panel);
  cancel.focus();
}

function renderPaintTraceKoreanTask(canvas, ctx) {
  renderPaintTraceTask(canvas, ctx, {
    title: "한글 따라 그리기",
    target: "가",
    guide: "그림판 위에서 한글 '가'의 흐린 선을 따라 마우스로 그려보세요.",
    next: "이번에는 숫자를 따라 그려봅니다.",
  });
}

function renderPaintTraceNumberTask(canvas, ctx) {
  renderPaintTraceTask(canvas, ctx, {
    title: "숫자 따라 그리기",
    target: "3",
    guide: "그림판 위에서 숫자 3의 흐린 선을 따라 마우스로 그려보세요.",
    next: "이번에는 영어 글자를 따라 그려봅니다.",
  });
}

function renderPaintTraceEnglishTask(canvas, ctx) {
  renderPaintTraceTask(canvas, ctx, {
    title: "영어 따라 그리기",
    target: "A",
    guide: "그림판 위에서 영어 A의 흐린 선을 따라 마우스로 그려보세요.",
    next: "기능 조작 체험을 마무리합니다.",
  });
}

function renderPaintTraceTask(canvas, ctx, config) {
  ctx.setGuide(config.title, config.guide);
  let drawing = false;
  let drawCount = 0;
  const panel = createEl("div", "paint-trace-board");
  panel.innerHTML = `
    <div class="paint-toolbar">
      <strong>그림판 연습</strong>
      <span>마우스로 선을 그리세요.</span>
    </div>
    <div class="paint-stage">
      <div class="trace-letter" aria-hidden="true">${config.target}</div>
      <canvas class="paint-practice-canvas" data-guide-target="true" width="900" height="470"></canvas>
      <div class="paint-feedback">흐린 글자 위에 선을 그리면 진행됩니다.</div>
    </div>
  `;
  const paintCanvas = panel.querySelector("canvas");
  const feedback = panel.querySelector(".paint-feedback");
  const painter = paintCanvas.getContext("2d");
  painter.lineWidth = 10;
  painter.lineCap = "round";
  painter.lineJoin = "round";
  painter.strokeStyle = "#2b6eea";
  const point = (event) => {
    const rect = paintCanvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * paintCanvas.width,
      y: ((event.clientY - rect.top) / rect.height) * paintCanvas.height,
    };
  };
  paintCanvas.addEventListener("pointerdown", (event) => {
    drawing = true;
    paintCanvas.setPointerCapture(event.pointerId);
    const p = point(event);
    painter.beginPath();
    painter.moveTo(p.x, p.y);
    ctx.markAction();
  });
  paintCanvas.addEventListener("pointermove", (event) => {
    if (!drawing || ctx.state.taskLocked) return;
    const p = point(event);
    painter.lineTo(p.x, p.y);
    painter.stroke();
    drawCount += 1;
    const progress = Math.min(1, drawCount / 70);
    ctx.updateProgress(progress);
    feedback.textContent = progress < 1 ? "잘했어요. 선을 조금 더 이어서 그려보세요." : "잘했어요. 따라 그리기를 마쳤습니다.";
    if (progress >= 1) ctx.completeTask(config.next);
  });
  paintCanvas.addEventListener("pointerup", () => {
    drawing = false;
  });
  canvas.append(panel);
}

export function renderVirtualOS(canvas, ctx) {
  const tasks = [
    renderStartMenuTask,
    renderNotepadTypingTask,
    renderSaveFileTask,
    renderExplorerTask,
    renderRenameTask,
    renderMoveToFolderTask,
    renderRecycleBinTask,
    renderPaintLaunchTask,
    renderPaintTraceKoreanTask,
    renderPaintTraceNumberTask,
    renderPaintTraceEnglishTask,
    renderWindowsFreePractice,
  ];
  tasks[ctx.state.taskIndex](canvas, ctx);
}

function renderWindowsFreePractice(canvas, ctx) {
  ctx.setGuide("윈도우 자유 조작", "시작 메뉴, 메모장, 저장, 파일 탐색기, 휴지통을 자유롭게 조작해 체크리스트를 채워보세요.");
  const desktop = createWindowsDesktop({ trashTask: true });
  const steps = [
    ["start", "시작 메뉴 열기"],
    ["notepad", "메모장 실행"],
    ["type", "메모장에 글 입력"],
    ["save", "저장 버튼 누르기"],
    ["explorer", "파일 탐색기 열기"],
    ["trash", "임시 파일 휴지통으로 이동"],
  ];
  const done = new Set();
  const checklist = createEl("aside", "os-checklist");
  checklist.innerHTML = `
    <strong>자유 조작 체크리스트</strong>
    <ul>
      ${steps.map(([id, label]) => `<li data-check="${id}">${label}</li>`).join("")}
    </ul>
  `;
  desktop.append(checklist);

  const startButton = desktop.querySelector(".win-start");
  const startMenu = desktop.querySelector(".start-menu");
  const notepadItem = desktop.querySelector("[data-app='notepad']");
  const notepadIcon = desktop.querySelector(".note-app");
  const folderIcon = desktop.querySelector(".folder-app");
  const notepadWindow = desktop.querySelector(".notepad-window");
  const explorerWindow = desktop.querySelector(".explorer-window");
  const editor = desktop.querySelector(".notepad-editor");
  const saveButton = desktop.querySelector(".win-save");
  const explorerButton = desktop.querySelector(".taskbar-folder");
  const savedFile = desktop.querySelector(".saved-file");
  const tempFile = desktop.querySelector(".temp-file");

  const mark = (id) => {
    if (done.has(id)) return;
    done.add(id);
    checklist.querySelector(`[data-check="${id}"]`)?.classList.add("done");
    ctx.markAction();
    ctx.updateProgress(done.size / steps.length);
    if (done.size === steps.length) ctx.completeTask();
  };

  const openNotepad = () => {
    startMenu.classList.remove("open");
    notepadWindow.classList.add("open");
    mark("notepad");
    editor.focus();
  };

  const openExplorer = () => {
    explorerWindow.classList.add("open");
    mark("explorer");
  };

  startButton.dataset.guideTarget = "true";
  startButton.addEventListener("click", () => {
    startMenu.classList.toggle("open");
    startButton.dataset.guideTarget = "false";
    notepadItem.dataset.guideTarget = "true";
    mark("start");
  });
  notepadItem.addEventListener("click", openNotepad);
  notepadIcon.addEventListener("dblclick", openNotepad);
  notepadIcon.addEventListener("click", () => ctx.setGuide("아이콘", "아이콘을 두 번 빠르게 누르면 앱이 열립니다. 시작 메뉴를 써도 됩니다."));
  folderIcon.addEventListener("dblclick", openExplorer);
  explorerButton.addEventListener("click", openExplorer);
  editor.addEventListener("input", () => {
    if (editor.value.trim().length >= 4) mark("type");
  });
  saveButton.addEventListener("click", () => {
    savedFile.classList.add("show");
    mark("save");
  });
  wireDrag(
    desktop,
    tempFile,
    desktop.querySelector(".recycle-bin"),
    () => {
      tempFile.classList.remove("show");
      mark("trash");
    },
    () => ctx.showWrong("임시 파일을 휴지통 위에 놓아보세요."),
  );
  wireWindowDrag(desktop, notepadWindow);
  wireWindowDrag(desktop, explorerWindow);
  canvas.append(desktop);
}

function renderStartMenuTask(canvas, ctx) {
  ctx.setGuide("시작 메뉴", "왼쪽 아래 시작 버튼을 누른 뒤 메모장을 실행하세요.");
  const desktop = createWindowsDesktop({ startOpen: false });
  const startButton = desktop.querySelector(".win-start");
  const startMenu = desktop.querySelector(".start-menu");
  const notepadItem = desktop.querySelector("[data-app='notepad']");

  startButton.dataset.guideTarget = "true";
  startButton.addEventListener("click", () => {
    ctx.markAction();
    ctx.updateProgress(0.45);
    startButton.dataset.guideTarget = "false";
    notepadItem.dataset.guideTarget = "true";
    startMenu.classList.add("open");
  });
  notepadItem.addEventListener("click", () => ctx.completeTask("메모장이 열렸습니다. 이제 글자를 입력해봅니다."));
  canvas.append(desktop);
}

function renderNotepadTypingTask(canvas, ctx) {
  const targetText = "오늘 배운 것을 저장해요";
  ctx.setGuide("메모장 입력", "열린 메모장에 제시된 문장을 그대로 입력하세요.");
  const desktop = createWindowsDesktop({ notepadOpen: true });
  const editor = desktop.querySelector(".notepad-editor");
  desktop.querySelector(".note-target").textContent = targetText;
  editor.dataset.guideTarget = "true";
  editor.addEventListener("input", () => {
    ctx.markAction();
    const match = countMatchingPrefix(editor.value, targetText);
    ctx.updateProgress(match / targetText.length);
    editor.classList.toggle("wrong", Boolean(editor.value && !targetText.startsWith(editor.value)));
    if (editor.value === targetText) ctx.completeTask("좋아요. 이번에는 저장 버튼을 눌러 파일로 남깁니다.");
  });
  canvas.append(desktop);
  editor.focus();
}

function renderSaveFileTask(canvas, ctx) {
  ctx.setGuide("저장", "메모장 위쪽의 저장 버튼을 눌러 바탕화면에 파일을 만드세요.");
  const desktop = createWindowsDesktop({ notepadOpen: true, noteText: "오늘 배운 것을 저장해요" });
  const saveButton = desktop.querySelector(".win-save");
  saveButton.dataset.guideTarget = "true";
  saveButton.addEventListener("click", () => ctx.completeTask("바탕화면에 메모 파일이 생겼습니다."));
  canvas.append(desktop);
}

function renderExplorerTask(canvas, ctx) {
  ctx.setGuide("파일 탐색기", "작업 표시줄의 폴더 아이콘을 눌러 파일 탐색기를 여세요.");
  const desktop = createWindowsDesktop({ savedFile: true });
  const explorerButton = desktop.querySelector(".taskbar-folder");
  const explorerWindow = desktop.querySelector(".explorer-window");
  explorerButton.dataset.guideTarget = "true";
  explorerButton.addEventListener("click", () => {
    ctx.markAction();
    explorerWindow.classList.add("open");
    ctx.updateProgress(0.75);
    window.setTimeout(() => ctx.completeTask("탐색기에서 파일을 확인했습니다."), 420);
  });
  canvas.append(desktop);
}

function renderRenameTask(canvas, ctx) {
  ctx.setGuide("이름 바꾸기", "파일 이름 입력칸에 '연습메모'라고 적어보세요.");
  const desktop = createWindowsDesktop({ explorerOpen: true, renameOpen: true });
  const input = desktop.querySelector(".rename-input");
  input.dataset.guideTarget = "true";
  input.addEventListener("input", () => {
    ctx.markAction();
    const target = "연습메모";
    ctx.updateProgress(Math.min(0.95, countMatchingPrefix(input.value, target) / target.length));
    input.classList.toggle("wrong", Boolean(input.value && !target.startsWith(input.value)));
    if (input.value.trim() === target) ctx.completeTask("파일 이름을 알아보기 쉽게 바꿨습니다.");
  });
  canvas.append(desktop);
  input.focus();
}

function renderMoveToFolderTask(canvas, ctx) {
  ctx.setGuide("파일 분류", "파일 탐색기에서 문서, 사진, 임시 파일을 알맞은 위치로 끌어다 놓으세요.");
  const desktop = createWindowsDesktop({ explorerOpen: true, sortOpen: true });
  const area = desktop.querySelector(".explorer-file-area");
  const done = new Set();
  const status = desktop.querySelector(".sort-status");
  const mark = (id, label) => {
    if (done.has(id)) return;
    done.add(id);
    status.textContent = `${done.size} / 3 정리 · ${label}`;
    ctx.markAction();
    ctx.updateProgress(done.size / 3);
    if (done.size >= 3) ctx.completeTask("파일 탐색기에서 여러 파일을 목적에 맞게 정리했습니다.");
  };
  wireDrag(
    area,
    desktop.querySelector(".document-file"),
    desktop.querySelector(".homework-folder"),
    () => mark("document", "문서를 숙제 폴더에 넣었습니다."),
    () => ctx.showWrong("문서 파일은 숙제 폴더 안에 놓아보세요."),
  );
  wireDrag(
    area,
    desktop.querySelector(".photo-file"),
    desktop.querySelector(".photo-folder"),
    () => mark("photo", "사진을 사진 폴더에 넣었습니다."),
    () => ctx.showWrong("사진 파일은 사진 폴더 안에 놓아보세요."),
  );
  wireDrag(
    area,
    desktop.querySelector(".tmp-sort-file"),
    desktop.querySelector(".explorer-trash-folder"),
    () => mark("tmp", "임시 파일을 휴지통에 넣었습니다."),
    () => ctx.showWrong("임시 파일은 휴지통 안에 놓아보세요."),
  );
  canvas.append(desktop);
}

function renderRecycleBinTask(canvas, ctx) {
  ctx.setGuide("휴지통", "필요 없는 임시 파일을 휴지통으로 옮기세요.");
  const desktop = createWindowsDesktop({ trashTask: true });
  wireDrag(
    desktop,
    desktop.querySelector(".temp-file"),
    desktop.querySelector(".recycle-bin"),
    () => ctx.completeTask(),
    () => ctx.showWrong("파일을 휴지통 위에 놓아보세요."),
  );
  canvas.append(desktop);
}

function renderPaintLaunchTask(canvas, ctx) {
  ctx.setGuide("그림판 실행", "시작 메뉴에서 그림판을 열어보세요. 바탕화면 아이콘을 두 번 눌러도 됩니다.");
  const desktop = createWindowsDesktop();
  const startButton = desktop.querySelector(".win-start");
  const startMenu = desktop.querySelector(".start-menu");
  const paintItem = desktop.querySelector("[data-app='paint']");
  const paintIcon = desktop.querySelector(".paint-app");
  const paintWindow = desktop.querySelector(".paint-window");
  const openPaint = () => {
    startMenu.classList.remove("open");
    paintWindow.classList.add("open");
    ctx.completeTask("그림판에서 한글을 따라 그려봅니다.");
  };
  startButton.dataset.guideTarget = "true";
  startButton.addEventListener("click", () => {
    startMenu.classList.toggle("open");
    paintItem.dataset.guideTarget = "true";
    ctx.markAction();
    ctx.updateProgress(0.45);
  });
  paintItem.addEventListener("click", openPaint);
  paintIcon.addEventListener("dblclick", openPaint);
  canvas.append(desktop);
}

function createWindowsDesktop(options = {}) {
  const desktop = createEl("div", "os-sim windows-os");
  const notepadOpen = options.notepadOpen ? "open" : "";
  const explorerOpen = options.explorerOpen ? "open" : "";
  const paintOpen = options.paintOpen ? "open" : "";
  const startOpen = options.startOpen ? "open" : "";
  const noteText = options.noteText || "";
  desktop.innerHTML = `
    <div class="os-wallpaper"></div>
    <button class="os-icon paint-app" type="button"><span class="app-icon paint-icon"></span><strong>그림판</strong></button>
    <button class="os-icon note-app" type="button"><span class="app-icon note-icon"></span><strong>메모장</strong></button>
    <button class="os-icon folder-app" type="button"><span class="app-icon folder-icon"></span><strong>문서</strong></button>
    <div class="desktop-file saved-file ${options.savedFile || options.trashTask ? "show" : ""}">메모.txt</div>
    <div class="desktop-file temp-file ${options.trashTask ? "show" : ""}" data-guide-target="${options.trashTask ? "true" : "false"}">임시.tmp</div>
    <div class="recycle-bin">휴지통</div>

    <div class="os-window notepad-window ${notepadOpen}">
      <header>
        <span class="window-dots"><i></i><i></i><i></i></span>
        <strong>메모장 - 새 파일</strong>
        <button class="win-save" type="button">저장</button>
      </header>
      <div class="note-target"></div>
      <textarea class="notepad-editor" autocomplete="off">${noteText}</textarea>
    </div>

    <div class="os-window explorer-window ${explorerOpen}">
      <header>
        <span class="window-dots"><i></i><i></i><i></i></span>
        <strong>파일 탐색기</strong>
        <span>문서</span>
      </header>
      <div class="explorer-body">
        <aside>빠른 실행<br />바탕화면<br />문서</aside>
        <section class="explorer-file-area">
          ${
            options.renameOpen
              ? `<label class="rename-box"><span>메모.txt</span><input class="rename-input" autocomplete="off" /></label>`
              : options.sortOpen
                ? `
                  <div class="explorer-address">문서 > 오늘의 학습 파일</div>
                  <div class="desktop-file sort-file document-file" data-guide-target="true">국어숙제.doc</div>
                  <div class="desktop-file sort-file photo-file">사진.png</div>
                  <div class="desktop-file sort-file tmp-sort-file">임시.tmp</div>
                  <div class="folder-drop homework-folder">숙제</div>
                  <div class="folder-drop photo-folder">사진</div>
                  <div class="folder-drop explorer-trash-folder">휴지통</div>
                  <div class="sort-status">0 / 3 정리</div>
                `
              : options.moveOpen
                ? `<div class="desktop-file move-file" data-guide-target="true">연습메모.txt</div><div class="folder-drop homework-folder">숙제</div>`
                : `<div class="desktop-file explorer-file">메모.txt</div><div class="folder-drop">숙제</div>`
          }
        </section>
      </div>
    </div>

    <div class="os-window paint-window ${paintOpen}">
      <header>
        <span class="window-dots"><i></i><i></i><i></i></span>
        <strong>그림판</strong>
        <span>연필</span>
      </header>
      <div class="paint-app-body">
        <div class="paint-tool-row"><button type="button">연필</button><button type="button">지우개</button><button type="button">색</button></div>
        <div class="paint-empty-canvas">그림판에서 선을 그리는 활동은 다음 라운드에서 진행됩니다.</div>
      </div>
    </div>

    <div class="start-menu ${startOpen}">
      <strong>시작</strong>
      <button data-app="paint" type="button"><span class="app-icon paint-icon"></span>그림판</button>
      <button data-app="notepad" type="button"><span class="app-icon note-icon"></span>메모장</button>
      <button type="button"><span class="app-icon mine-icon"></span>지뢰찾기</button>
      <button type="button"><span class="app-icon sheet-icon"></span>스프레드시트</button>
      <button type="button"><span class="app-icon folder-icon"></span>파일 탐색기</button>
    </div>

    <div class="taskbar win-taskbar">
      <button class="start-button win-start" type="button">시작</button>
      <button class="taskbar-app taskbar-paint" type="button"><span class="app-icon paint-icon"></span></button>
      <button class="taskbar-app taskbar-folder" type="button"><span class="app-icon folder-icon"></span></button>
      <button class="taskbar-app" type="button"><span class="app-icon note-icon"></span></button>
      <span class="task-chip">디지터시 컴퓨터</span>
      <span class="clock">10:24</span>
    </div>
  `;
  return desktop;
}

function wireWindowDrag(container, windowNode) {
  const header = windowNode.querySelector("header");
  let drag = null;

  header.addEventListener("pointerdown", (event) => {
    const rect = windowNode.getBoundingClientRect();
    drag = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    header.setPointerCapture(event.pointerId);
  });

  header.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const box = container.getBoundingClientRect();
    const width = windowNode.offsetWidth;
    const height = windowNode.offsetHeight;
    windowNode.style.left = `${Math.max(8, Math.min(box.width - width - 8, event.clientX - box.left - drag.x))}px`;
    windowNode.style.top = `${Math.max(8, Math.min(box.height - height - 72, event.clientY - box.top - drag.y))}px`;
  });

  header.addEventListener("pointerup", () => {
    drag = null;
  });
}

export function renderTypingPractice(canvas, ctx) {
  const targets = [
    { text: "ㄱ ㄴ ㄷ", focus: "왼손과 오른손을 키보드 기본 자리에 올려봅니다.", fingers: "왼손 검지: F, 오른손 검지: J" },
    { text: "asdf jkl;", focus: "기본 자리 키를 천천히 눌러봅니다.", fingers: "왼손: A S D F / 오른손: J K L ;" },
    { text: "가 나 다", focus: "한글 글자를 천천히 입력합니다.", fingers: "글자를 찾고 누른 뒤 바로 손을 기본 자리로 돌립니다." },
    { text: "마우스 클릭", focus: "스페이스바로 낱말 사이를 띄웁니다.", fingers: "엄지손가락: Space" },
    { text: "파일을 저장해요", focus: "긴 문장을 보고 그대로 입력합니다.", fingers: "오타가 나면 Backspace로 한 글자씩 지웁니다." },
    { text: "폴더를 열어요", focus: "받침 있는 글자를 천천히 입력합니다.", fingers: "속도보다 정확한 손 위치가 먼저입니다." },
    { text: "천천히 정확하게 입력해요", focus: "긴 문장을 한 글자씩 확인합니다.", fingers: "눈은 제시문, 손은 기본 자리로 돌아옵니다." },
    { text: "오타를 고쳐요", focus: "틀리면 지우고 다시 쓰는 연습입니다.", fingers: "Backspace는 오른손 새끼손가락 쪽에 있습니다." },
    { text: "오늘 배운 것을 기록해요", focus: "띄어쓰기와 문장 흐름을 함께 봅니다.", fingers: "Space를 누른 뒤 손을 다시 기본 자리로 둡니다." },
    { text: "컴퓨터를 안전하게 사용해요", focus: "마지막 문장을 정확하게 완성합니다.", fingers: "Ctrl, Alt 조합은 실제 브라우저 단축키가 될 수 있어 누르지 않습니다." },
  ];
  const target = targets[ctx.state.taskIndex] || targets[0];
  const targetText = target.text;
  ctx.setGuide("타자연습", `${target.focus} Chrome 단축키가 실행되지 않도록 Ctrl, Alt 조합은 누르지 않습니다.`);
  const board = createEl("div", "type-board");
  board.innerHTML = `
    <div class="mission-prompt"><span>타자연습 ${ctx.state.taskIndex + 1}</span><strong>${target.focus}</strong><small>${target.fingers}</small></div>
    <div class="typing-layout">
      <section class="typing-target-panel">
        <span>보고 쓰기</span>
        <strong class="copy-target">${targetText}</strong>
        <label class="type-input-wrap"><span>입력칸</span><input class="type-input" data-guide-target="true" autocomplete="off" /></label>
        <div class="typing-status">기본 자리를 확인하고 시작하세요.</div>
      </section>
      <section class="finger-guide">
        <strong>손가락 자리</strong>
        <div class="finger-row"><span>왼손</span><b>A</b><b>S</b><b>D</b><b>F</b></div>
        <div class="finger-row"><span>오른손</span><b>J</b><b>K</b><b>L</b><b>;</b></div>
        <div class="keyboard-visual">
          ${["QWERTYUIOP", "ASDFGHJKL;", "ZXCVBNM"].map((row) => `<div>${row.split("").map((key) => `<i>${key}</i>`).join("")}</div>`).join("")}
          <div><i class="space-key">Space</i><i>Backspace</i></div>
        </div>
        <p>Ctrl, Alt, Windows 키는 이 연습에서 누르지 않습니다.</p>
      </section>
    </div>
  `;
  const input = board.querySelector("input");
  const status = board.querySelector(".typing-status");
  input.addEventListener("input", () => {
    ctx.markAction();
    const match = countMatchingPrefix(input.value, targetText);
    ctx.updateProgress(match / targetText.length);
    input.classList.toggle("wrong", Boolean(input.value && !targetText.startsWith(input.value)));
    status.textContent = input.value && !targetText.startsWith(input.value)
      ? "다른 글자가 들어갔어요. Backspace로 지우고 다시 써보세요."
      : `${match} / ${targetText.length} 글자를 맞게 입력했습니다.`;
    if (input.value === targetText) ctx.completeTask("제시문과 같은 글자를 순서대로 입력했습니다.", {
      reason: "입력한 글자와 제시문이 처음부터 끝까지 같은 순서로 맞았기 때문입니다.",
    });
  });
  canvas.append(board);
  input.focus();
}
