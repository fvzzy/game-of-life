import { state } from "../../../main.js";
import { play, stop } from "../gameplay.js";
import { drawScene } from "../../view.js";

export const paintbrushDown = () => {
  if (state.interval) {
    stop();
    state.paused = true;
  }
  state.dragging = true;
};

export const paintbrushMove = (elements, e) => {
  if (!state.dragging) return;
  const x = Math.floor(e.x / state.cellSize);
  const y = Math.floor(e.y / state.cellSize);
  const cell = `${x}-${y}`;
  state.cells.add(cell);
  state.cellColors.set(cell, state.color);
  drawScene(elements, state.cells, state.cellColors);
};

export const paintbrushUp = (elements) => {
  if (state.paused) {
    play(elements);
    state.paused = false;
  }
  state.dragging = false;
};
