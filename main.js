const stretchCanvas = (canvas, cellSize) => {
  const { clientWidth, clientHeight } = document.documentElement;
  canvas.width = Math.floor(clientWidth / cellSize) * cellSize;
  canvas.height = Math.floor(clientHeight / cellSize) * cellSize;
};

const resetCanvas = (canvas, backgroundColor, cellMargin) => {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  canvas.style.border = `${cellMargin}px solid ${backgroundColor}`;
};

const paintCells = (canvas, activeCells, size, color, margin) => {
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = color;
  for (let cell of activeCells) {
    const [col, row] = cell.split("-");
    ctx.fillRect(
      size * col + margin,
      size * row + margin,
      size - 2 * margin,
      size - 2 * margin
    );
  }
};

const drawScene = (options, activeCells) => {
  const { canvas, backgroundColor, cellSize, cellColor, cellMargin } = options;
  resetCanvas(canvas, backgroundColor, cellMargin);
  paintCells(canvas, activeCells, cellSize, cellColor, cellMargin);
};

const countNeighbours = (activeCells, gridCols, gridRows, x, y) => {
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
    if (nX < 0 || nX >= gridCols || nY < 0 || nY >= gridRows) continue;
    if (activeCells.has(`${nX}-${nY}`)) count += 1;
  }
  return count;
};

const nextActiveCells = (activeCells, gridCols, gridRows) => {
  let result = new Set();

  for (let y = 0; y < gridRows; y++) {
    for (let x = 0; x < gridCols; x++) {
      const liveCell = activeCells.has(`${x}-${y}`);
      const neighbours = countNeighbours(activeCells, gridCols, gridRows, x, y);
      if ((liveCell && [2, 3].includes(neighbours)) || neighbours === 3) {
        result.add(`${x}-${y}`);
      }
    }
  }
  return result;
};

const play = (options) => {
  const { canvas, cellSize, speed } = options;
  let { activeCells } = options;
  const delay = Math.max(1000 / speed, 100);

  stretchCanvas(canvas, cellSize);
  drawScene(options, cells);

  const [gridCols, gridRows] = [
    canvas.width / cellSize,
    canvas.height / cellSize,
  ];

  setInterval(() => {
    activeCells = nextActiveCells(activeCells, gridCols, gridRows);
    drawScene(options, activeCells);
  }, delay);
};

const canvas = document.querySelector("canvas#grid");

const options = {
  canvas,
  cellSize: 10, // block size in pixels
  cellMargin: 1, // margin in pixels around each cell
  cellColor: "black",
  backgroundColor: "white",
  speed: 10, // setting from 1-10
  activeCells: new Set(["2-1", "3-2", "1-3", "2-3", "3-3"]),
};

window.addEventListener("resize", () => stretchCanvas(canvas));
play(options);
