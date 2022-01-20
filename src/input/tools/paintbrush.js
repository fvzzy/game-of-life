import { play, stop } from "../gameplay.js";
import { drawScene } from "../../view.js";

export const paintbrushDown = (elements, state, e) => {
  if (state.interval) {
    stop(state);
    state.paused = true;
  }
  state.dragging = true;
};

export const paintbrushMove = (elements, state, e) => {
  if (!state.dragging) return;
  const x = Math.floor(e.x / state.cellSize);
  const y = Math.floor(e.y / state.cellSize);
  const cell = `${x}-${y}`;
  state.cells.add(cell);
  state.cellColors.set(cell, state.color);
  drawScene(elements, state);
};

export const paintbrushUp = (elements, state, e) => {
  if (state.paused) {
    play(elements, state);
    state.paused = false;
  }
  state.dragging = false;
};
