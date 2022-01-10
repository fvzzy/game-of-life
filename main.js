const initPage = (cellColor) => {
  const body = document.querySelector("body");
  body.style.background = cellColor;
};

const resetCanvas = (canvas, bgColor, cellSpacing) => {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  canvas.style.border = `${cellSpacing}px solid ${bgColor}`;
};

const paintCells = (canvas, activeCells, gridSize, color, spacing) => {
  const ctx = canvas.getContext("2d");
  const cellW = canvas.width / gridSize;
  const cellH = canvas.height / gridSize;

  ctx.fillStyle = color;
  for (let cell of activeCells) {
    const [col, row] = cell.split("-");
    ctx.fillRect(
      cellW * col + spacing,
      cellH * row + spacing,
      cellW - 2 * spacing,
      cellH - 2 * spacing
    );
  }
};

const drawScene = (options, activeCells) => {
  const { canvas, gridSize, backgroundColor, cellColor, cellSpacing } = options;
  resetCanvas(canvas, backgroundColor, cellSpacing);
  paintCells(canvas, activeCells, gridSize, cellColor, cellSpacing);
};

const countNeighbours = (activeCells, gridSize, x, y) => {
  const neighbours = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
  ];
  let count = 0;
  for (const n of neighbours) {
    const [nX, nY] = [x + n[0], y + n[1]];
    if (nX < 0 || nX >= gridSize || nY < 0 || nY >= gridSize) continue;
    if (activeCells.has(`${nX}-${nY}`)) count += 1;
  }
  return count;
};

const nextActiveCells = (activeCells, gridSize) => {
  let result = new Set();

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const liveCell = activeCells.has(`${x}-${y}`);
      const neighbours = countNeighbours(activeCells, gridSize, x, y);
      if ((liveCell && [2, 3].includes(neighbours)) || neighbours === 3) {
        result.add(`${x}-${y}`);
      }
    }
  }
  return result;
};

const play = (options) => {
  const { gridSize, cellColor, speed } = options;
  let { activeCells } = options;
  const delay = Math.max(1000 / speed, 100);

  initPage(cellColor);
  drawScene(options, activeCells);

  setInterval(() => {
    activeCells = nextActiveCells(activeCells, gridSize);
    drawScene(options, activeCells);
  }, delay);
};

const options = {
  canvas: document.querySelector("canvas#grid"),
  gridSize: 5, // the number of cells across and down (assumes a square grid)
  cellSpacing: 3, // spacing in pixels around each cell
  cellColor: "black",
  backgroundColor: "white",
  speed: 1, // setting from 1-10
  activeCells: new Set(["1-2", "2-2", "3-2"]),
};

play(options);
