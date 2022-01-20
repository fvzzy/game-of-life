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

const tools = {
  // TODO: add a util to forward elements and DRY this up
  paintbrush: {
    label: "Paintbrush",
    handlers: {
      pointerdown: (e) => paintbrushDown(elements, e),
      pointermove: (e) => paintbrushMove(elements, e),
      pointerup: (e) => paintbrushUp(elements, e),
    },
  },
  block: {
    label: "Block",
    handlers: {
      click: (e) => stampBlock(elements, e),
    },
  },
  blinker: {
    label: "Blinker",
    handlers: {
      click: (e) => stampBlinker(elements, e),
    },
  },
  glider: {
    label: "Glider",
    handlers: {
      click: (e) => stampGlider(elements, e),
    },
  },
  lwss: {
    label: "Light Spaceship",
    handlers: { click: (e) => stampLWSS(elements, e) },
  },
  mwss: {
    label: "Mid Spaceship",
    handlers: { click: (e) => stampMWSS(elements, e) },
  },
  hwss: {
    label: "Heavy Spaceship",
    handlers: { click: (e) => stampHWSS(elements, e) },
  },
};

export const state = new Store({
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

const initalise = (elements) => {
  resizeCanvas(elements.canvas, state.cellSize);
  bindGameplayControls(elements);
  bindSettingsControls(elements);
  bindResizeHandler(elements);
  addTools(elements, tools);
  loadControls();
};

initalise(elements);
