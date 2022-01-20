import { randomHexColor } from "../lib/utils.js";

const bindTool = (canvas, state, event, handler) => {
  canvas.addEventListener(event, handler);
  state.canvasHandlers.set(event, handler);
};

const unbindTools = (canvas, state) => {
  for (const [event, handler] of state.canvasHandlers) {
    canvas.removeEventListener(event, handler);
    state.canvasHandlers.delete(event);
  }
};

const createToolGroupEl = (toolId, label) => {
  const wrapperEl = document.createElement("span");
  const inputEl = document.createElement("input");
  const labelEl = document.createElement("label");
  wrapperEl.classList.add("groupOption");
  inputEl.setAttribute("type", "radio");
  inputEl.setAttribute("name", "tool");
  inputEl.setAttribute("id", toolId);
  labelEl.setAttribute("for", toolId);
  labelEl.textContent = label;
  wrapperEl.append(inputEl, labelEl);
  return wrapperEl;
};

const randomiseColor = (elements, state) => {
  if (!state.randomiseColors) return;
  state.color = randomHexColor();
  elements.colorInput.value = state.color;
};

export const addTools = (elements, state, toolsConfig) => {
  const { canvas, colorInput, toolsContainer } = elements;
  for (const toolId in toolsConfig) {
    const { label } = toolsConfig[toolId];
    const toolGroupEl = createToolGroupEl(toolId, label);
    toolsContainer.appendChild(toolGroupEl);
  }

  toolsContainer.addEventListener("click", (e) => {
    if (e.target.tagName !== "INPUT") return;
    const selected = toolsContainer.querySelector("input:checked");
    const { handlers } = toolsConfig[selected.id];
    unbindTools(canvas, state);
    randomiseColor(elements, state);
    for (const [event, handler] of Object.entries(handlers)) {
      bindTool(canvas, state, event, handler);
    }
  });

  colorInput.value = state.color;
  colorInput.addEventListener("input", (e) => (state.color = e.target.value));

  // preselect the first tool
  toolsContainer.querySelector("input[type='radio']").click();
};
