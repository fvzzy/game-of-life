import { state } from "../../main.js";
import { drawScene } from "../view.js";
import { play, stop } from "./gameplay.js";

const updateSettingAndRedraw = (option, elements, e) => {
  state[option] = e.target.value;
  drawScene(elements, state.cells, state.cellColors);
};

const updateSpeedAndRestart = (elements, e) => {
  stop();
  state.speed = e.target.value;
  play(elements);
};

export const bindOptionControls = (elements) => {
  const { colorInput, cellSizeInput, speedInput } = elements;

  // TODO: move this into tools
  colorInput.value = state.color;
  colorInput.addEventListener("input", (e) =>
    updateSettingAndRedraw("color", elements, e)
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
