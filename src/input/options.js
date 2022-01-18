import { state } from "../../main.js";
import { drawScene } from "../view.js";
import { play, stop } from "./gameplay.js";

export const bindOptionControls = (elements) => {
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
