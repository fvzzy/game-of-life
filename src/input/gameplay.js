import { isEqualSet } from "../lib/utils.js";
import { nextCells, nextCellColors } from "../rules.js";
import { resizeCanvas, drawScene } from "../view.js";
import { updateGenerations } from "../stats.js";

export const step = (elements, state) => {
  const { canvas, generationsOutput } = elements;
  const gridCols = canvas.width / state.cellSize;
  const gridRows = canvas.height / state.cellSize;

  state.prevCells = state.cells;
  state.cells = nextCells(state.prevCells, gridCols, gridRows);
  state.cellColors = nextCellColors(state.cells, state.cellColors);
  updateGenerations(generationsOutput, state.generations++);
  drawScene(elements, state);

  // kill the program if the game state has reached a standstill
  if (isEqualSet(state.prevCells, state.cells)) stop(state);
};

export const play = (elements, state) => {
  const delay = 500 / state.speed;

  resizeCanvas(elements, state.cellSize);
  drawScene(elements, state);

  state.interval = setInterval(() => step(elements, state), delay);
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
