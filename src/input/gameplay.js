import { state } from "../../main.js";
import { isEqualSet } from "../lib/utils.js";
import { nextCells } from "../rules.js";
import { resizeCanvas, drawScene } from "../view.js";

export const play = (elements) => {
  const { canvas } = elements;
  const delay = 500 / state.speed;

  resizeCanvas(canvas, state.cellSize);
  drawScene(elements, state.cells);

  state.interval = setInterval(() => step(elements), delay);
};

export const step = (elements) => {
  const { canvas } = elements;
  const gridCols = canvas.width / state.cellSize;
  const gridRows = canvas.height / state.cellSize;

  state.prevCells = state.cells;
  state.cells = nextCells(state.prevCells, gridCols, gridRows);
  drawScene(elements, state.cells);

  // kill the program if the game state has reached a standstill
  if (isEqualSet(state.prevCells, state.cells)) stop();
};

export const stop = () => {
  clearInterval(state.interval);
  state.interval = null;
};

export const bindGameplayControls = (elements) => {
  const { playButton, pauseButton, stepButton } = elements;
  playButton.addEventListener("click", () => !state.interval && play(elements));
  stepButton.addEventListener("click", () => step(elements));
  pauseButton.addEventListener("click", () => stop());
};
