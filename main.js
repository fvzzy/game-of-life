/* utilities */

const isEqualSet = (setA, setB) => {
  if (setA.size !== setB.size) return false;
  for (let el of setA) if (!setB.has(el)) return false;
  return true;
};

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
    const border = 1; // border in px around each cell
    ctx.fillRect(
      size * col + border,
      size * row + border,
      size - 2 * border,
      size - 2 * border
    );
  }
};

const drawScene = (elements, cells) => {
  const { canvas } = elements;
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

const play = (elements) => {
  const { canvas } = elements;
  const delay = 500 / state.speed;

  resizeCanvas(canvas, state.cellSize);
  drawScene(elements, state.cells);

  state.interval = setInterval(() => step(elements), delay);
};

const step = (elements) => {
  const { canvas } = elements;
  const gridCols = canvas.width / state.cellSize;
  const gridRows = canvas.height / state.cellSize;

  state.prevCells = state.cells;
  state.cells = nextCells(state.prevCells, gridCols, gridRows);
  drawScene(elements, state.cells);

  // kill the program if the game state has reached a standstill
  if (isEqualSet(state.prevCells, state.cells)) stop();
};

const stop = () => {
  clearInterval(state.interval);
  state.interval = null;
};

const bindControls = (elements) => {
  const {
    playBtn,
    pauseBtn,
    stepBtn,
    cellColorInput,
    cellSizeInput,
    speedInput,
  } = elements;

  playBtn.addEventListener("click", () => !state.interval && play(elements));
  stepBtn.addEventListener("click", () => step(elements));
  pauseBtn.addEventListener("click", () => stop());

  // restart gameplay to handle window resizes
  window.addEventListener("resize", () => {
    if (!state.interval) return stop();
    stop();
    play(elements);
  });

  // TODO: DRY up config control binding
  cellColorInput.value = state.cellColor;
  cellColorInput.addEventListener("input", (e) => {
    state.cellColor = e.target.value;
    drawScene(elements, state.cells);
  });

  cellSizeInput.value = state.cellSizeInput;
  cellSizeInput.addEventListener("input", (e) => {
    state.cellSize = e.target.value;
    drawScene(elements, state.cells);
  });

  speedInput.value = state.speed;
  speedInput.addEventListener("input", (e) => {
    stop();
    state.speed = e.target.value;
    play(elements);
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
    drawScene(elements, state.cells);
  });

  canvas.addEventListener("mouseup", () => (dragging = false));
};

/* initialisation */

const initalise = (elements) => {
  const { canvas } = elements;
  resizeCanvas(canvas, state.cellSize);
  step(elements);
  bindPaintbrush(canvas);
  bindControls(elements);
};

/* main */

let state = {
  interval: null,
  prevCells: null,
  cells: new Set(),
  cellColor: "#000000",
  cellSize: 10,
  speed: 10,
};

const elements = {
  canvas: document.getElementById("grid"),
  playBtn: document.querySelector("[data-btn-play]"),
  pauseBtn: document.querySelector("[data-btn-pause]"),
  stepBtn: document.querySelector("[data-btn-step]"),
  cellColorInput: document.getElementById("cellColor"),
  cellSizeInput: document.getElementById("cellSize"),
  speedInput: document.getElementById("speed"),
};

initalise(elements);
