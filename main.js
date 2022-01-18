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

const bindResizeHandler = (elements) => {
  // restart gameplay to handle window resizes
  window.addEventListener("resize", () => {
    if (!state.interval) return resizeCanvas(elements.canvas, state.cellSize);
    stop();
    play(elements);
  });
};

const bindGameplayControls = (elements) => {
  const { playButton, pauseButton, stepButton } = elements;
  playButton.addEventListener("click", () => !state.interval && play(elements));
  stepButton.addEventListener("click", () => step(elements));
  pauseButton.addEventListener("click", () => stop());
};

/* options */

const bindOptionControls = (elements) => {
  const { cellColorInput, cellSizeInput, speedInput } = elements;

  // TODO: DRY up config control binding
  cellColorInput.value = state.cellColor;
  cellColorInput.addEventListener("input", (e) => {
    state.cellColor = e.target.value;
    drawScene(elements, state.cells);
  });

  cellSizeInput.value = state.cellSize;
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

/* tools */

const addTools = (container, tools) => {
  for (const toolId in tools) {
    const { label } = tools[toolId];
    const wrapperEl = document.createElement("span");
    const inputEl = document.createElement("input");
    const labelEl = document.createElement("labelEl");
    wrapperEl.classList.add("tool");
    inputEl.setAttribute("type", "radio");
    inputEl.setAttribute("name", "tool");
    inputEl.setAttribute("id", toolId);
    labelEl.setAttribute("for", toolId);
    labelEl.textContent = label;
    wrapperEl.append(inputEl, label);
    container.appendChild(wrapperEl);
  }

  container.addEventListener("click", (e) => {
    if (e.target.tagName !== "INPUT") return;
    const selected = container.querySelector("input:checked");
    unbindCanvasHandlers(elements.canvas);
    switch (selected.id) {
      case "paintbrush":
        bindPaintbrush(elements.canvas);
        break;
      case "box":
        bindCanvasHandler(elements.canvas, "click", stampBox);
        break;
      case "glider":
        bindCanvasHandler(elements.canvas, "click", stampGlider);
        break;
    }
  });

  // preselect the first tool
  container.querySelector("input").click();
};

const bindCanvasHandler = (canvas, event, handler) => {
  canvas.addEventListener(event, handler);
  state.canvasHandlers.set(event, handler);
};

const unbindCanvasHandlers = (canvas) => {
  for (const [event, handler] of state.canvasHandlers) {
    canvas.removeEventListener(event, handler);
    state.canvasHandlers.delete(event);
  }
};

const paintbrushEvents = new Map(
  Object.entries({
    mousedown: () => {
      stop();
      state.dragging = true;
    },
    mousemove: (e) => {
      if (!state.dragging) return;
      const x = Math.floor(e.x / state.cellSize);
      const y = Math.floor(e.y / state.cellSize);
      state.cells.add(`${x}-${y}`);
      drawScene(elements, state.cells);
    },
    mouseup: () => (state.dragging = false),
  })
);

const stampBox = (e) => stampPattern(e.x, e.y, box);
const stampGlider = (e) => stampPattern(e.x, e.y, glider);

const bindPaintbrush = (canvas) => {
  for (const [event, handler] of paintbrushEvents) {
    bindCanvasHandler(canvas, event, handler);
  }
};

/* patterns */

const box = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];

const glider = [
  [0, 0],
  [1, 1],
  [1, 2],
  [2, 0],
  [2, 1],
];

const stampPattern = (mouseX, mouseY, pattern) => {
  const x = Math.floor(mouseX / state.cellSize);
  const y = Math.floor(mouseY / state.cellSize);
  for (let [dX, dY] of pattern) state.cells.add(`${x + dX}-${y + dY}`);
  drawScene(elements, state.cells);
};

/* initialisation */

const tools = {
  paintbrush: { label: "Paintbrush" },
  box: { label: "Box" },
  glider: { label: "Glider" },
};

const initalise = (elements) => {
  const { canvas, toolsContainer } = elements;
  resizeCanvas(canvas, state.cellSize);
  bindGameplayControls(elements);
  bindOptionControls(elements);
  bindResizeHandler(elements);
  addTools(toolsContainer, tools);
};

/* main */

let state = {
  interval: null,
  prevCells: null,
  cells: new Set(),
  canvasHandlers: new Map(),
  dragging: false,
  cellColor: "#000000",
  cellSize: 10,
  speed: 10,
};

const elements = {
  canvas: document.getElementById("grid"),
  playButton: document.querySelector("[data-btn-play]"),
  pauseButton: document.querySelector("[data-btn-pause]"),
  stepButton: document.querySelector("[data-btn-step]"),
  toolsContainer: document.getElementById("tools"),
  cellColorInput: document.getElementById("cellColor"),
  cellSizeInput: document.getElementById("cellSize"),
  speedInput: document.getElementById("speed"),
};

initalise(elements);
