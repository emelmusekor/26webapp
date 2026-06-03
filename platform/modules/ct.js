import { createEl } from "../core/dom.js";

const CODING_PUZZLES = [
  { goal: "가운데 보석까지 가기", bot: 0, jewel: 12, walls: [], hint: "여러 길이 있습니다." },
  { goal: "막힌 길을 피해 오른쪽 위 보석까지 가기", bot: 0, jewel: 14, walls: [6, 7, 11], hint: "가운데 벽을 피해 위쪽 길로 돌아가세요." },
  { goal: "아래쪽 출발점에서 위쪽 보석까지 가기", bot: 20, jewel: 4, walls: [5, 6, 11, 16, 17], hint: "왼쪽 벽을 피해 오른쪽으로 크게 돌아가세요." },
  { goal: "두 벽 사이를 통과해 보석 찾기", bot: 2, jewel: 22, walls: [7, 12, 17, 9, 14, 19], hint: "가로로 빠져나간 뒤 아래로 이동해야 합니다." },
  { goal: "ㄷ자 장애물을 우회하기", bot: 10, jewel: 24, walls: [11, 12, 13, 18, 23], hint: "막힌 곳을 만나면 다른 줄로 이동하세요." },
  { goal: "복잡한 길에서 가장 짧은 코드 찾기", bot: 0, jewel: 24, walls: [1, 6, 8, 13, 16, 18], hint: "처음부터 아래로 내려가는 길이 더 짧을 수 있습니다." },
];

const FLOW_SCENARIOS = [
  { title: "순서 만들기", nodes: ["시작", "앞으로 이동", "목표 확인"], required: ["시작", "앞으로 이동", "목표 확인"] },
  { title: "반복으로 줄이기", nodes: ["시작", "반복 3번", "앞으로 이동", "목표 확인"], required: ["시작", "반복 3번", "목표 확인"] },
  { title: "조건 확인", nodes: ["시작", "앞으로 이동", "장애물 확인", "목표 확인"], required: ["시작", "장애물 확인", "목표 확인"] },
  { title: "오른쪽으로 돌기", nodes: ["시작", "앞으로 이동", "오른쪽 회전", "목표 확인"], required: ["시작", "앞으로 이동", "오른쪽 회전", "목표 확인"] },
  { title: "자료 읽고 출력", nodes: ["시작", "데이터 읽기", "조건: 크다", "출력하기"], required: ["시작", "데이터 읽기", "조건: 크다", "출력하기"] },
  { title: "처음과 끝", nodes: ["시작", "반복 2번", "앞으로 이동", "끝"], required: ["시작", "반복 2번", "앞으로 이동", "끝"] },
];

const BINARY_TARGETS = [1, 3, 5, 9, 10, 15];

export function renderCodingPuzzle(canvas, ctx) {
  const puzzle = CODING_PUZZLES[ctx.state.taskIndex] || CODING_PUZZLES[0];
  const shortestPath = findShortestPath(puzzle);
  const shortestLength = shortestPath.length;
  ctx.setGuide("코딩 퍼즐", `${ctx.state.taskIndex + 1}번째 길이에요. 벽을 피해 보석까지 가 봅시다. 짧은 길은 ${shortestLength}칸이에요.`);
  ctx.state.commandQueue = [];
  const board = createEl("div", "coding-board");
  board.innerHTML = `
    <div class="maze-grid"></div>
    <div class="command-panel">
      <div class="mission-prompt"><span>목표</span><strong>${puzzle.goal}</strong><small>${puzzle.hint}</small></div>
      <div class="command-buttons">
        <button type="button" data-cmd="R">오른쪽</button><button type="button" data-cmd="D">아래</button>
        <button type="button" data-cmd="L">왼쪽</button><button type="button" data-cmd="U">위</button>
      </div>
      <div class="command-queue"></div>
      <div class="code-score">
        <span>짧은 길 ${shortestLength}칸</span>
        <strong>연습 중</strong>
      </div>
      <div class="code-result">화살표를 넣고 움직여 보세요.</div>
      <div class="code-actions">
        <button class="primary-button run-code" type="button">움직여 보기</button>
        <button class="secondary-button clear-code" type="button">다시 만들기</button>
      </div>
    </div>
  `;
  const grid = board.querySelector(".maze-grid");
  for (let i = 0; i < 25; i += 1) {
    const cell = createEl("div", "maze-cell");
    cell.dataset.cell = String(i);
    if (puzzle.walls.includes(i)) {
      cell.classList.add("wall");
      cell.innerHTML = `<span class="maze-art wall-art"></span>`;
    }
    if (i === puzzle.bot) {
      cell.classList.add("bot");
      cell.innerHTML = `<span class="maze-art bot-art"></span>`;
    }
    if (i === puzzle.jewel) {
      cell.classList.add("jewel");
      cell.innerHTML = `<span class="maze-art jewel-art"></span>`;
    }
    grid.append(cell);
  }
  const queue = board.querySelector(".command-queue");
  const result = board.querySelector(".code-result");
  const score = board.querySelector(".code-score strong");
  const renderQueue = () => {
    queue.innerHTML = ctx.state.commandQueue.length
      ? ctx.state.commandQueue.map((cmd, index) => `<span>${index + 1}. ${commandLabel(cmd)}</span>`).join("")
      : "<em>아직 명령이 없습니다.</em>";
  };
  renderQueue();
  board.querySelectorAll("[data-cmd]").forEach((button) => {
    button.addEventListener("click", () => {
      ctx.state.commandQueue.push(button.dataset.cmd);
      renderQueue();
      ctx.markAction();
      ctx.updateProgress(Math.min(0.8, ctx.state.commandQueue.length / Math.max(shortestLength, 1)));
    });
  });
  board.querySelector(".clear-code").addEventListener("click", () => {
    ctx.state.commandQueue = [];
    renderQueue();
    clearPath(grid);
    result.textContent = "화살표를 다시 넣어보세요.";
    score.textContent = "연습 중";
    ctx.updateProgress(0);
  });
  board.querySelector(".run-code").addEventListener("click", () => {
    clearPath(grid);
    const run = simulateCommands(puzzle, ctx.state.commandQueue);
    drawPath(grid, run.path);
    const currentScore = scoreRun(puzzle, run, shortestLength);
    score.textContent = scoreLabel(currentScore);
    result.innerHTML = renderRunResult(run, currentScore, shortestLength);
    ctx.markAction();
    ctx.updateProgress(currentScore.progress);

    if (run.reached && currentScore.perfect) {
      ctx.completeTask(`보석까지 가장 짧은 길로 갔어요. 다음 길도 해 볼까요?`, {
        title: "멋지게 도착!",
        guideText: "봇이 보석까지 잘 갔어요. 준비되면 다음 활동으로 가요.",
      });
      return;
    }

    if (run.reached) {
      const submit = board.querySelector(".submit-partial-code");
      submit?.addEventListener("click", () => {
        ctx.completeTask(`지금 길로도 보석까지 갔어요. 더 짧은 길은 ${shortestLength}칸이에요.`, {
          title: "도착했어요!",
          buttonText: "다음 활동",
          mark: "좋아",
          toast: "도착!",
          guideTitle: "도착했어요",
          guideText: "조금 더 짧은 길도 있지만, 지금 길로도 목표에 도착했어요.",
        });
      });
      ctx.setGuide("도착했어요", "더 짧은 길도 있어요. 다시 해보거나 지금 길로 넘어가요.");
      return;
    }

    ctx.showWrong(run.reason || "보석까지 가는 순서를 다시 생각해보세요.");
  });
  canvas.append(board);
}

function commandLabel(cmd) {
  return { R: "오른쪽", D: "아래", L: "왼쪽", U: "위" }[cmd] || cmd;
}

function moveIndex(index, cmd) {
  const row = Math.floor(index / 5);
  const col = index % 5;
  const next = {
    R: [row, col + 1],
    L: [row, col - 1],
    D: [row + 1, col],
    U: [row - 1, col],
  }[cmd];
  if (!next || next[0] < 0 || next[0] > 4 || next[1] < 0 || next[1] > 4) return null;
  return next[0] * 5 + next[1];
}

function simulateCommands(puzzle, commands) {
  let position = puzzle.bot;
  const path = [position];
  for (const cmd of commands) {
    const next = moveIndex(position, cmd);
    if (next === null) return { reached: false, blocked: true, path, position, reason: "보드 밖으로 나갔어요. 방향을 한 번만 바꿔볼까요?" };
    if (puzzle.walls.includes(next)) return { reached: false, blocked: true, path: [...path, next], position, reason: "벽에 닿았어요. 다른 길로 천천히 가볼까요?" };
    position = next;
    path.push(position);
  }
  return {
    reached: position === puzzle.jewel,
    blocked: false,
    path,
    position,
    reason: position === puzzle.jewel ? "" : "아직 보석까지 가지 못했어요.",
  };
}

function findShortestPath(puzzle) {
  const queue = [{ position: puzzle.bot, path: [] }];
  const visited = new Set([puzzle.bot]);
  const commands = ["R", "D", "L", "U"];
  while (queue.length) {
    const current = queue.shift();
    if (current.position === puzzle.jewel) return current.path;
    for (const cmd of commands) {
      const next = moveIndex(current.position, cmd);
      if (next === null || puzzle.walls.includes(next) || visited.has(next)) continue;
      visited.add(next);
      queue.push({ position: next, path: [...current.path, cmd] });
    }
  }
  return [];
}

function scoreRun(puzzle, run, shortestLength) {
  if (run.reached) {
    const length = run.path.length - 1;
    const extra = Math.max(0, length - shortestLength);
    return {
      perfect: extra === 0,
      score: extra === 0 ? 100 : Math.max(60, 100 - extra * 10),
      progress: 1,
      length,
    };
  }
  const currentDistance = manhattan(run.position, puzzle.jewel);
  const startDistance = Math.max(1, manhattan(puzzle.bot, puzzle.jewel));
  const progress = Math.max(0.1, Math.min(0.75, 1 - currentDistance / (startDistance + 1)));
  return {
    perfect: false,
    score: run.blocked ? 10 : Math.round(progress * 50),
    progress,
    length: run.path.length - 1,
  };
}

function manhattan(a, b) {
  return Math.abs(Math.floor(a / 5) - Math.floor(b / 5)) + Math.abs((a % 5) - (b % 5));
}

function clearPath(grid) {
  grid.querySelectorAll(".maze-cell").forEach((cell) => cell.classList.remove("visited", "crash", "end"));
}

function drawPath(grid, path) {
  path.forEach((cellIndex, index) => {
    const cell = grid.querySelector(`[data-cell="${cellIndex}"]`);
    if (!cell) return;
    cell.classList.add(index === path.length - 1 ? "end" : "visited");
    if (cell.classList.contains("wall")) cell.classList.add("crash");
  });
}

function scoreLabel(score) {
  if (score.perfect) return "별 3개";
  if (score.score >= 60) return "별 2개";
  return "연습 중";
}

function renderRunResult(run, score, shortestLength) {
  if (run.reached && score.perfect) {
    return `<strong>가장 짧은 길로 도착했어요!</strong><span>${score.length}칸으로 보석까지 갔어요.</span>`;
  }
  if (run.reached) {
    return `
      <strong>보석까지 갔어요!</strong>
      <span>지금 길은 ${score.length}칸이에요. 더 짧은 길은 ${shortestLength}칸이에요.</span>
      <button class="primary-button submit-partial-code" type="button">이 길로 갈래요</button>
    `;
  }
  return `<strong>다시 해볼 수 있어요</strong><span>${run.reason}</span>`;
}

export function renderFlowchartCode(canvas, ctx) {
  const scenario = FLOW_SCENARIOS[ctx.state.taskIndex] || FLOW_SCENARIOS[0];
  ctx.state.flowNodes = [];
  ctx.setGuide("순서도", `${scenario.title}: 필요한 블록을 순서대로 눌러 오른쪽 코드를 완성하세요.`);
  const board = createEl("div", "flow-board");
  board.innerHTML = `
    <div class="flow-palette">${scenario.nodes.map((node) => `<button type="button" data-node="${node}">${node}</button>`).join("")}</div>
    <div class="flow-canvas"></div>
    <pre class="code-output">// 순서도를 만들면 코드가 생깁니다.</pre>
    <div class="flow-actions">
      <button class="primary-button flow-run" type="button">순서 확인</button>
      <button class="secondary-button flow-clear" type="button">다시 만들기</button>
    </div>
  `;
  const flow = board.querySelector(".flow-canvas");
  const code = board.querySelector(".code-output");
  const renderFlow = () => {
    flow.innerHTML = ctx.state.flowNodes.map((node, index) => `<span>${index + 1}. ${node}</span>`).join("");
    code.textContent = makeCode(ctx.state.flowNodes);
    ctx.updateProgress(Math.min(0.9, ctx.state.flowNodes.length / scenario.required.length));
  };
  board.querySelectorAll("[data-node]").forEach((button) => {
    button.addEventListener("click", () => {
      ctx.state.flowNodes.push(button.dataset.node);
      ctx.markAction();
      renderFlow();
    });
  });
  board.querySelector(".flow-clear").addEventListener("click", () => {
    ctx.state.flowNodes = [];
    ctx.markAction();
    renderFlow();
  });
  board.querySelector(".flow-run").addEventListener("click", () => {
    const ok = scenario.required.length === ctx.state.flowNodes.length && scenario.required.every((node, index) => node === ctx.state.flowNodes[index]);
    if (ok) ctx.completeTask();
    else ctx.showWrong("필요한 블록과 순서를 같이 살펴보세요.");
  });
  canvas.append(board);
}

function makeCode(nodes) {
  return nodes.map((node) => {
    if (node === "시작") return "start();";
    if (node === "앞으로 이동") return "moveForward();";
    if (node === "오른쪽 회전") return "turnRight();";
    if (node === "반복 3번") return "repeat(3) { moveForward(); }";
    if (node === "반복 2번") return "repeat(2) { moveForward(); }";
    if (node === "장애물 확인") return "if (blocked()) turnRight();";
    if (node === "목표 확인") return "if (atGoal()) complete();";
    if (node === "데이터 읽기") return "const value = readData();";
    if (node === "조건: 크다") return "if (value > target) {";
    if (node === "출력하기") return "  showResult();\n}";
    if (node === "끝") return "end();";
    return `// ${node}`;
  }).join("\n");
}

export function renderUnpluggedViz(canvas, ctx) {
  const target = BINARY_TARGETS[ctx.state.taskIndex] || BINARY_TARGETS[0];
  ctx.setGuide("점 전구", `${ctx.state.taskIndex + 1}단계: 전구를 켜고 꺼서 목표 점 개수와 같게 만들어보세요.`);
  const values = [8, 4, 2, 1];
  const board = createEl("div", "binary-board");
  board.innerHTML = `
    <div class="mission-prompt"><span>목표</span><strong>점 개수가 같아지게 전구를 켜보세요.</strong><div class="dot-target">${dotPattern(target)}</div></div>
    <div class="bulbs">${values.map((value) => `<button type="button" data-value="${value}"><span class="bulb-light"></span><strong>${dotPattern(value)}</strong></button>`).join("")}</div>
    <div class="binary-sum">켜진 점 ${dotPattern(0)}</div>
  `;
  const sum = board.querySelector(".binary-sum");
  board.querySelectorAll("[data-value]").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("on");
      const total = Array.from(board.querySelectorAll(".on")).reduce((acc, node) => acc + Number(node.dataset.value), 0);
      sum.innerHTML = `켜진 점 ${dotPattern(total)}`;
      ctx.markAction();
      ctx.updateProgress(Math.min(0.95, total / target));
      if (total === target) ctx.completeTask("켜진 점의 개수가 목표 점 개수와 같아졌습니다.", {
        reason: "각 전구가 가진 점 묶음을 더했을 때 목표 점 묶음과 같은 개수가 되었기 때문입니다.",
      });
    });
  });
  canvas.append(board);
}

function dotPattern(value) {
  if (!value) return `<span class="dot-group empty" aria-label="점 없음"></span>`;
  return `<span class="dot-group">${Array.from({ length: value }).map(() => "<i></i>").join("")}</span>`;
}
