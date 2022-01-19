import { state } from "../../../main.js";
import { stop } from "../gameplay.js";
import { drawScene } from "../../view.js";

export const paintbrushDown = () => {
  stop();
  state.dragging = true;
};

export const paintbrushMove = (elements, e) => {
  if (!state.dragging) return;
  const x = Math.floor(e.x / state.cellSize);
  const y = Math.floor(e.y / state.cellSize);
  state.cells.add(`${x}-${y}`);
  drawScene(elements, state.cells);
};

export const paintbrushUp = () => (state.dragging = false);
