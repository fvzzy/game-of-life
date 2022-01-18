import Store from "./src/state/Store.js";
import elements from "./src/config/elements.js";
import { resizeCanvas, bindResizeHandler } from "./src/view.js";
import { bindGameplayControls } from "./src/input/gameplay.js";
import { bindOptionControls } from "./src/input/options.js";
import { addTools } from "./src/input/tools.js";
import {
  paintbrushDown,
  paintbrushMove,
  paintbrushUp,
} from "./src/input/tools/paintbrush.js";
import { stampBox, stampGlider } from "./src/input/tools/stamps.js";

const tools = {
  // TODO: add a util to forward elements
  paintbrush: {
    label: "Paintbrush",
    handlers: {
      pointerdown: (e) => paintbrushDown(elements, e),
      pointermove: (e) => paintbrushMove(elements, e),
      pointerup: (e) => paintbrushUp(elements, e),
    },
  },
  box: {
    label: "Box",
    handlers: {
      click: (e) => stampBox(elements, e),
    },
  },
  glider: {
    label: "Glider",
    handlers: {
      click: (e) => stampGlider(elements, e),
    },
  },
};

export const state = new Store({
  interval: null,
  prevCells: null,
  cells: new Set(),
  canvasHandlers: new Map(),
  dragging: false,
  cellColor: "#000000",
  cellSize: 10,
  speed: 10,
});

const initalise = (elements) => {
  resizeCanvas(elements.canvas, state.cellSize);
  bindGameplayControls(elements);
  bindOptionControls(elements);
  bindResizeHandler(elements);
  addTools(elements, tools);
};

initalise(elements);
