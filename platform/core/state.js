import { loadProgress } from "./storage.js";

export const DEFAULT_MODULE_ID = "ict-controls";

export function createPlatformState() {
  return {
    selectedModuleId: DEFAULT_MODULE_ID,
    activeModule: null,
    progress: loadProgress(),
    taskIndex: 0,
    taskTotal: 1,
    taskLocked: false,
    hintLevel: 0,
    hintTimer: null,
    lastActionAt: 0,
    wrongAttempts: 0,
    commandQueue: [],
    flowNodes: [],
  };
}

export function resetMissionState(state, module, taskTotal) {
  state.activeModule = module;
  state.taskIndex = 0;
  state.taskTotal = taskTotal;
  state.taskLocked = false;
  state.hintLevel = 0;
  state.wrongAttempts = 0;
  state.commandQueue = [];
  state.flowNodes = [];
  state.lastActionAt = Date.now();
}
