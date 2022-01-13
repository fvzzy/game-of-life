const resizeCanvas = (canvas, cellSize) => {
  const { clientWidth, clientHeight } = document.documentElement;
  const controlsEl = document.getElementById("controls");
  canvas.width = Math.floor(clientWidth / cellSize) * cellSize;
  canvas.height =
    Math.floor((clientHeight - controlsEl.clientHeight) / cellSize) * cellSize;
};

const resetCanvas = (canvas, backgroundColor) => {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const paintCells = (canvas, cells, size, color, margin) => {
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = color;
  for (let cell of cells) {
    const [col, row] = cell.split("-");
    ctx.fillRect(
      size * col + margin,
      size * row + margin,
      size - 2 * margin,
      size - 2 * margin
    );
  }
};

const drawScene = (options, cells) => {
  const { canvas, backgroundColor, cellSize, cellColor, cellMargin } = options;
  resetCanvas(canvas, backgroundColor, cellMargin);
  paintCells(canvas, cells, cellSize, cellColor, cellMargin);
};

const countNeighbours = (cells, gridCols, gridRows, x, y) => {
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
    if (cells.has(`${nX}-${nY}`)) count += 1;
  }
  return count;
};

const nextCells = (cells, gridCols, gridRows) => {
  let result = new Set();

  for (let y = 0; y < gridRows; y++) {
    for (let x = 0; x < gridCols; x++) {
      const liveCell = cells.has(`${x}-${y}`);
      const neighbours = countNeighbours(cells, gridCols, gridRows, x, y);
      if ((liveCell && [2, 3].includes(neighbours)) || neighbours === 3) {
        result.add(`${x}-${y}`);
      }
    }
  }
  return result;
};

const play = (options) => {
  const { canvas, cellSize, speed } = options;
  const delay = Math.max(1000 / speed, 100);

  resizeCanvas(canvas, cellSize);
  drawScene(options, state.cells);

  state.interval = setInterval(() => step(options), delay);
};

const step = (options) => {
  const { canvas, cellSize } = options;
  const [gridCols, gridRows] = [
    canvas.width / cellSize,
    canvas.height / cellSize,
  ];

  state.cells = nextCells(state.cells, gridCols, gridRows);
  drawScene(options, state.cells);
};

const stop = () => {
  clearInterval(state.interval);
  state.interval = null;
};

const bindControls = (options) => {
  const { playBtn, pauseBtn, stepBtn } = options;

  playBtn.addEventListener("click", () => {
    if (state.interval) return;
    play(options);
  });

  pauseBtn.addEventListener("click", () => stop());
  stepBtn.addEventListener("click", () => step(options));

  window.addEventListener("resize", () => {
    if (!state.interval) return stop();
    stop();
    play(options);
  });
};

let state = {
  interval: null,
  cells: new Set(["2-1", "3-2", "1-3", "2-3", "3-3"]),
};

const options = {
  canvas: document.getElementById("grid"),
  playBtn: document.querySelector("[data-btn-play]"),
  pauseBtn: document.querySelector("[data-btn-pause]"),
  stepBtn: document.querySelector("[data-btn-step]"),
  cellSize: 20, // block size in pixels
  cellMargin: 3, // margin in pixels around each cell
  cellColor: "black",
  backgroundColor: "white",
  speed: 10, // setting from 1-10
};

bindControls(options);
