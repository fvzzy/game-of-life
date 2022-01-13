/* presentation */

const resizeCanvas = (canvas) => {
  const { clientWidth, clientHeight } = document.documentElement;
  canvas.width = Math.floor(clientWidth / state.cellSize) * state.cellSize;
  canvas.height = Math.floor(clientHeight / state.cellSize) * state.cellSize;
};

const resetCanvas = (canvas) => {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const fillCells = (canvas, cells, size, color) => {
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = color;
  for (let cell of cells) {
    const [col, row] = cell.split("-");
    ctx.fillRect(size * col + 1, size * row + 1, size - 2 * 1, size - 2 * 1);
  }
};

const drawScene = (options, cells) => {
  const { canvas } = options;
  resetCanvas(canvas);
  fillCells(canvas, cells, state.cellSize, state.cellColor);
};

/* game logic */

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

/* ui */

const play = (options) => {
  const { canvas } = options;
  const delay = 500 / state.speed;

  resizeCanvas(canvas, state.cellSize);
  drawScene(options, state.cells);

  state.interval = setInterval(() => step(options), delay);
};

const step = (options) => {
  const { canvas } = options;
  const [gridCols, gridRows] = [
    canvas.width / state.cellSize,
    canvas.height / state.cellSize,
  ];

  state.cells = nextCells(state.cells, gridCols, gridRows);
  drawScene(options, state.cells);
};

const stop = () => {
  clearInterval(state.interval);
  state.interval = null;
};

const bindControls = (options) => {
  const {
    playBtn,
    pauseBtn,
    stepBtn,
    cellColorInput,
    cellSizeInput,
    speedInput,
  } = options;

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

  // TODO: DRY up config control binding
  cellColorInput.value = state.cellColor;
  cellColorInput.addEventListener("input", (e) => {
    state.cellColor = e.target.value;
    drawScene(options, state.cells);
  });

  cellSizeInput.value = state.cellSizeInput;
  cellSizeInput.addEventListener("input", (e) => {
    state.cellSize = e.target.value;
    drawScene(options, state.cells);
  });

  speedInput.value = state.speed;
  speedInput.addEventListener("input", (e) => {
    stop();
    state.speed = e.target.value;
    play(options);
  });
};

const bindPaintbrush = (canvas) => {
  let dragging = false;

  canvas.addEventListener("mousedown", () => {
    stop();
    dragging = true;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const { x, y } = e;
    state.cells.add(
      `${Math.floor(x / state.cellSize)}-${Math.floor(y / state.cellSize)}`
    );
    drawScene(options, state.cells);
  });

  canvas.addEventListener("mouseup", () => {
    dragging = false;
  });
};

/* initialisation */

const setup = (options) => {
  const { canvas } = options;
  resizeCanvas(canvas, state.cellSize);
  step(options);
  bindPaintbrush(canvas);
  bindControls(options);
};

/* main */

let state = {
  interval: null,
  cells: new Set(),
  cellColor: "#000000",
  cellSize: 10,
  speed: 10,
};

const options = {
  canvas: document.getElementById("grid"),
  playBtn: document.querySelector("[data-btn-play]"),
  pauseBtn: document.querySelector("[data-btn-pause]"),
  stepBtn: document.querySelector("[data-btn-step]"),
  cellColorInput: document.getElementById("cellColor"),
  cellSizeInput: document.getElementById("cellSize"),
  speedInput: document.getElementById("speed"),
};

setup(options);
