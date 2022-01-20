import { play, stop } from "./input/gameplay.js";

export const resizeCanvas = (canvas, cellSize) => {
  const { clientWidth, clientHeight } = document.documentElement;
  canvas.width = Math.floor(clientWidth / cellSize) * cellSize;
  canvas.height = Math.floor(clientHeight / cellSize) * cellSize;
};

const resetCanvas = (canvas) => {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const fillCells = (canvas, cells, colors, size) => {
  const ctx = canvas.getContext("2d");

  for (let cell of cells) {
    const [col, row] = cell.split("-");
    ctx.fillStyle = colors.get(cell);
    const border = 1; // border in px around each cell
    ctx.fillRect(
      size * col + border,
      size * row + border,
      size - 2 * border,
      size - 2 * border
    );
  }
};

export const drawScene = (elements, state) => {
  const { canvas } = elements;
  resetCanvas(canvas);
  fillCells(canvas, state.cells, state.cellColors, state.cellSize);
};

export const bindResizeHandler = (elements, state) => {
  // restart gameplay to handle window resizes
  window.addEventListener("resize", () => {
    if (!state.interval) {
      resizeCanvas(elements.canvas, state.cellSize);
      drawScene(elements, state);
    } else {
      stop(state);
      play(elements, state);
    }
  });
};
