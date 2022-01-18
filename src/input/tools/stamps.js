import { state } from "../../../main.js";
import { drawScene } from "../../view.js";

const stampPattern = (elements, { x: mouseX, y: mouseY }, pattern) => {
  const x = Math.floor(mouseX / state.cellSize);
  const y = Math.floor(mouseY / state.cellSize);
  for (let [dX, dY] of pattern) state.cells.add(`${x + dX}-${y + dY}`);
  drawScene(elements, state.cells);
};

export const stampBox = (...args) =>
  stampPattern(...args, [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ]);

export const stampGlider = (...args) =>
  stampPattern(...args, [
    [0, 0],
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 1],
  ]);
