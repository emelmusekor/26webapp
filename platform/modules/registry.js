import { renderAiHistory } from "./ait.js";
import { renderCodingPuzzle, renderFlowchartCode, renderUnpluggedViz } from "./ct.js";
import { renderExternalModule, renderPlaceholder } from "./external.js";
import { renderIctControls, renderTypingPractice, renderVirtualOS } from "./ict.js";
import { renderDrugLab, renderFintech } from "./stem.js";
import { renderValueDilemma } from "./value.js";

export const MODULE_RENDERERS = {
  ictControls: renderIctControls,
  virtualOS: renderVirtualOS,
  typingPractice: renderTypingPractice,
  codingPuzzle: renderCodingPuzzle,
  flowchartCode: renderFlowchartCode,
  unpluggedViz: renderUnpluggedViz,
  external: renderExternalModule,
  aiHistory: renderAiHistory,
  fintech: renderFintech,
  drugLab: renderDrugLab,
  valueDilemma: renderValueDilemma,
  placeholder: renderPlaceholder,
};

export const TASK_TOTALS = {
  ictControls: 15,
  virtualOS: 12,
  typingPractice: 10,
  codingPuzzle: 6,
  flowchartCode: 6,
  unpluggedViz: 6,
  external: 1,
  aiHistory: 6,
  fintech: 5,
  drugLab: 5,
  valueDilemma: 5,
  placeholder: 1,
};
