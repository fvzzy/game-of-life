import Store from "./src/state/Store.js";
import elements from "./src/config/elements.js";
import { resizeCanvas, bindResizeHandler } from "./src/view.js";
import { bindGameplayControls } from "./src/input/gameplay.js";
import { bindSettingsControls } from "./src/input/settings.js";
import { addTools } from "./src/input/tools.js";
import { loadControls } from "./src/input/controls.js";
import {
  paintbrushDown,
  paintbrushMove,
  paintbrushUp,
} from "./src/input/tools/paintbrush.js";
import {
  stampBlock,
  stampBlinker,
  stampGlider,
  stampLWSS,
  stampMWSS,
  stampHWSS,
} from "./src/input/tools/stamps.js";

const toolsConfig = (elements, state) => {
  const withState = (fn, e) => fn(elements, state, e);

  return {
    paintbrush: {
      label: "Paintbrush",
      handlers: {
        pointerdown: (e) => withState(paintbrushDown, e),
        pointermove: (e) => withState(paintbrushMove, e),
        pointerup: (e) => withState(paintbrushUp, e),
      },
    },
    block: {
      label: "Block",
      handlers: { click: (e) => withState(stampBlock, e) },
    },
    blinker: {
      label: "Blinker",
      handlers: { click: (e) => withState(stampBlinker, e) },
    },
    glider: {
      label: "Glider",
      handlers: { click: (e) => withState(stampGlider, e) },
    },
    lwss: {
      label: "Light Spaceship",
      handlers: { click: (e) => withState(stampLWSS, e) },
    },
    mwss: {
      label: "Mid Spaceship",
      handlers: { click: (e) => withState(stampMWSS, e) },
    },
    hwss: {
      label: "Heavy Spaceship",
      handlers: { click: (e) => withState(stampHWSS, e) },
    },
  };
};

const state = new Store({
  interval: null,
  prevCells: null,
  cells: new Set(),
  cellColors: new Map(),
  canvasHandlers: new Map(),
  color: "#000000",
  randomiseColors: true,
  cellSize: 10,
  speed: 10,
});

const initalise = (elements, state) => {
  resizeCanvas(elements.canvas, state.cellSize);
  bindGameplayControls(elements, state);
  bindSettingsControls(elements, state);
  bindResizeHandler(elements, state);
  addTools(elements, state, toolsConfig(elements, state));
  loadControls();
};

initalise(elements, state);
