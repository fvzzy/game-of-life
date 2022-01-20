import { isEqualSet } from "../lib/utils.js";
import { nextCells, nextCellColors } from "../rules.js";
import { resizeCanvas, drawScene } from "../view.js";

export const play = (elements, state) => {
  const { canvas } = elements;
  const delay = 500 / state.speed;

  resizeCanvas(canvas, state.cellSize);
  drawScene(elements, state);

  state.interval = setInterval(() => step(elements, state), delay);
};

export const step = (elements, state) => {
  const { canvas } = elements;
  const gridCols = canvas.width / state.cellSize;
  const gridRows = canvas.height / state.cellSize;

  state.prevCells = state.cells;
  state.cells = nextCells(state.prevCells, gridCols, gridRows);
  state.cellColors = nextCellColors(state.cells, state.cellColors);
  drawScene(elements, state);

  // kill the program if the game state has reached a standstill
  if (isEqualSet(state.prevCells, state.cells)) stop();
};

export const stop = (state) => {
  clearInterval(state.interval);
  state.interval = null;
};

export const bindGameplayControls = (elements, state) => {
  const { playButton, pauseButton, stepButton } = elements;
  playButton.addEventListener(
    "click",
    () => !state.interval && play(elements, state)
  );
  stepButton.addEventListener("click", () => step(elements, state));
  pauseButton.addEventListener("click", () => stop(state));
};
