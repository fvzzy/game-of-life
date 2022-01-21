import { blendHexColors } from "./lib/utils.js";

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

const countNeighbours = (cells, gridCols, gridRows, x, y) => {
  let count = 0;

  for (const n of neighbours) {
    const [nX, nY] = [x + n[0], y + n[1]];
    if (nX < 0 || nX >= gridCols || nY < 0 || nY >= gridRows) continue;
    if (cells.has(`${nX}-${nY}`)) count += 1;
  }
  return count;
};

export const nextCells = (cells, gridCols, gridRows) => {
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

const getClusterColors = (cell, cellColors) => {
  const result = [];
  const [x, y] = cell.split("-").map(Number);

  // include the current cell's colour in the calculation
  for (const n of [[0, 0], ...neighbours]) {
    const [nX, nY] = [x + n[0], y + n[1]];
    const color = cellColors.get(`${nX}-${nY}`);
    color && result.push(color);
  }
  return result;
};

export const nextCellColors = (nextCells, prevColors) => {
  let result = new Map();

  for (const cell of nextCells) {
    const clusterColors = getClusterColors(cell, prevColors);
    const blendedColor = blendHexColors(...clusterColors);
    result.set(cell, blendedColor);
  }
  return result;
};
