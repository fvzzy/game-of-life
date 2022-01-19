import { state } from "../../main.js";
import { drawScene } from "../view.js";
import { play, stop } from "./gameplay.js";

const updateSettingAndRedraw = (option, elements, e) => {
  state[option] = e.target.value;
  drawScene(elements, state.cells);
};

const updateSpeedAndRestart = (elements, e) => {
  stop();
  state.speed = e.target.value;
  play(elements);
};

export const bindOptionControls = (elements) => {
  const { cellColorInput, cellSizeInput, speedInput } = elements;

  cellColorInput.value = state.cellColor;
  cellColorInput.addEventListener("input", (e) =>
    updateSettingAndRedraw("cellColor", elements, e)
  );

  cellSizeInput.value = state.cellSize;
  cellSizeInput.addEventListener("input", (e) =>
    updateSettingAndRedraw("cellSize", elements, e)
  );

  speedInput.value = state.speed;
  speedInput.addEventListener("input", (e) =>
    updateSpeedAndRestart(elements, e)
  );
};
