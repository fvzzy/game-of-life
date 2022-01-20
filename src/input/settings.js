import { drawScene } from "../view.js";
import { play, stop } from "./gameplay.js";

const updateSettingAndRedraw = (option, elements, state, e) => {
  state[option] = e.target.value;
  drawScene(elements, state);
};

const updateSpeedAndRestart = (elements, state, e) => {
  stop(state);
  state.speed = e.target.value;
  play(elements, state);
};

export const bindSettingsControls = (elements, state) => {
  const { cellSizeInput, speedInput, randomiseColorsInput } = elements;

  cellSizeInput.value = state.cellSize;
  cellSizeInput.addEventListener("input", (e) => {
    updateSettingAndRedraw("cellSize", elements, state, e);
  });

  speedInput.value = state.speed;
  speedInput.addEventListener("input", (e) => {
    updateSpeedAndRestart(elements, state, e);
  });

  randomiseColorsInput.checked = state.randomiseColors;
  randomiseColorsInput.addEventListener("input", (e) => {
    state.randomiseColors = e.target.checked;
  });
};
