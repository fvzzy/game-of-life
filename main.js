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

const paintCells = (canvas, input, gridSize, color, spacing) => {
  const ctx = canvas.getContext("2d");
  const cellW = canvas.width / gridSize;
  const cellH = canvas.height / gridSize;

  ctx.fillStyle = color;
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[0].length; col++) {
      // update this so we only process the "on" cells,
      // no need to iterate through the others
      if (input[row][col]) {
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

const drawScene = (options, input) => {
  const { canvas, gridSize, backgroundColor, cellColor, cellSpacing } = options;
  resetCanvas(canvas, backgroundColor, cellSpacing);
  paintCells(canvas, input, gridSize, cellColor, cellSpacing);
};

const countNeighbours = (grid, cellX, cellY) => {
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
    const [nX, nY] = [cellX + n[0], cellY + n[1]];
    if (nX < 0 || nX >= grid[0].length || nY < 0 || nY >= grid.length) continue;
    if (grid[nY][nX]) count += 1;
  }
  return count;
};

const nextInput = (input) => {
  let result = Array(input.length)
    .fill()
    .map(() => Array(input[0].length).fill(0));

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      const neighbours = countNeighbours(input, x, y);
      if (input[y][x] === 1) {
        result[y][x] = [2, 3].includes(neighbours) ? 1 : 0;
      } else if (neighbours === 3) {
        result[y][x] = 1;
      }
    }
  }
  return result;
};

const play = (options) => {
  const { cellColor, speed } = options;
  let { input } = options;
  const delay = Math.max(1000 / speed, 100);

  initPage(cellColor);
  drawScene(options, input);

  setInterval(() => {
    input = nextInput(input);
    drawScene(options, input);
  }, delay);
};

const options = {
  canvas: document.querySelector("canvas#grid"),
  gridSize: 5, // the number of cells across and down
  cellSpacing: 3, // spacing in pixels around each cell
  cellColor: "black",
  backgroundColor: "white",
  speed: 1, // setting from 1-10
  input: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
};

play(options);
