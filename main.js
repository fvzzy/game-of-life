const GRID_SIZE = 5; // the number of cells across and down
const CELL_SPACING = 3; // spacing in pixels around each cell
const CELL_COLOR = "black";
const BACKGROUND_COLOR = "white";

const input = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];

const initCanvas = (canvas, bgColor, cellColor, cellSpacing) => {
  const body = document.querySelector("body");
  body.style.background = cellColor;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  canvas.style.border = `${cellSpacing}px solid ${bgColor}`;
};

const printCells = (canvas, grid, gridSize, color, spacing) => {
  const ctx = canvas.getContext("2d");
  const cellW = canvas.width / gridSize;
  const cellH = canvas.height / gridSize;

  ctx.fillStyle = color;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === 1) {
        ctx.fillRect(
          cellW * col + spacing,
          cellH * row + spacing,
          cellW - 2 * spacing,
          cellH - 2 * spacing
        );
      }
    }
  }
};

const canvas = document.querySelector("canvas#grid");
initCanvas(canvas, BACKGROUND_COLOR, CELL_COLOR, CELL_SPACING);
// for (let time = 0; time < 10; time++) {
printCells(canvas, input, GRID_SIZE, CELL_COLOR, CELL_SPACING);
// }
