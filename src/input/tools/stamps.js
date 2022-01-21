import { drawScene } from "../../view.js";

const flipPatternY = (pattern, flipY) => {
  if (!flipY) return pattern;
  pattern.sort((cellA, cellB) => cellA[0] - cellB[0]);
  const maxX = pattern[pattern.length - 1][0];
  return pattern.map((cell) => [-1 * cell[0] + maxX, cell[1]]);
};

const flipPatternX = (pattern, flipX) => {
  if (!flipX) return pattern;
  pattern.sort((cellA, cellB) => cellA[1] - cellB[1]);
  const maxY = pattern[pattern.length - 1][1];
  return pattern.map((cell) => [cell[0], -1 * cell[1] + maxY]);
};

const stampPattern = (elements, state, { x: mouseX, y: mouseY }, pattern) => {
  const transformedPattern = flipPatternX(
    flipPatternY(pattern, state.flipVert),
    state.flipHorz
  );
  const x = Math.floor(mouseX / state.cellSize);
  const y = Math.floor(mouseY / state.cellSize);
  for (let [dX, dY] of transformedPattern) {
    const cell = `${x + dX}-${y + dY}`;
    state.cells.add(cell);
    state.cellColors.set(cell, state.color);
  }
  drawScene(elements, state);
};

export const stampBlock = (...args) =>
  stampPattern(...args, [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ]);

export const stampBlinker = (...args) => {
  stampPattern(...args, [
    [0, 0],
    [0, 1],
    [0, 2],
  ]);
};

export const stampGlider = (...args) =>
  stampPattern(...args, [
    [0, 0],
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 1],
  ]);

export const stampLWSS = (...args) => {
  stampPattern(...args, [
    [4, 1],
    [4, 2],
    [4, 3],
    [3, 0],
    [3, 3],
    [2, 3],
    [1, 3],
    [0, 0],
    [0, 2],
  ]);
};

export const stampMWSS = (...args) => {
  stampPattern(...args, [
    [5, 2],
    [5, 3],
    [5, 4],
    [4, 1],
    [4, 4],
    [3, 4],
    [2, 0],
    [2, 4],
    [1, 4],
    [0, 1],
    [0, 3],
  ]);
};

export const stampHWSS = (...args) => {
  stampPattern(...args, [
    [6, 2],
    [6, 3],
    [6, 4],
    [5, 1],
    [5, 4],
    [4, 4],
    [3, 0],
    [3, 4],
    [2, 0],
    [2, 4],
    [1, 4],
    [0, 1],
    [0, 3],
  ]);
};
