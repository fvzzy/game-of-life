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

export const bindSettingsControls = (elements) => {
  const { cellSizeInput, speedInput, randomiseColorsInput } = elements;

  cellSizeInput.value = state.cellSize;
  cellSizeInput.addEventListener("input", (e) =>
    updateSettingAndRedraw("cellSize", elements, e)
  );

  speedInput.value = state.speed;
  speedInput.addEventListener("input", (e) =>
    updateSpeedAndRestart(elements, e)
  );

  randomiseColorsInput.checked = state.randomiseColors;
  randomiseColorsInput.addEventListener(
    "input",
    (e) => (state.randomiseColors = e.target.checked)
  );
};
