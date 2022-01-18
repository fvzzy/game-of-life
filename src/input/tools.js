import { state } from "../../main.js";

const bindTool = (canvas, event, handler) => {
  canvas.addEventListener(event, handler);
  state.canvasHandlers.set(event, handler);
};

const unbindTools = (canvas) => {
  for (const [event, handler] of state.canvasHandlers) {
    canvas.removeEventListener(event, handler);
    state.canvasHandlers.delete(event);
  }
};

export const addTools = (elements, tools) => {
  const { canvas, toolsContainer } = elements;
  for (const toolId in tools) {
    const { label } = tools[toolId];
    const wrapperEl = document.createElement("span");
    const inputEl = document.createElement("input");
    const labelEl = document.createElement("label");
    wrapperEl.classList.add("tool");
    inputEl.setAttribute("type", "radio");
    inputEl.setAttribute("name", "tool");
    inputEl.setAttribute("id", toolId);
    labelEl.setAttribute("for", toolId);
    labelEl.textContent = label;
    wrapperEl.append(inputEl, labelEl);
    toolsContainer.appendChild(wrapperEl);
  }

  toolsContainer.addEventListener("click", (e) => {
    if (e.target.tagName !== "INPUT") return;
    const selected = toolsContainer.querySelector("input:checked");
    const { handlers } = tools[selected.id];
    unbindTools(canvas);
    for (const [event, handler] of Object.entries(handlers)) {
      bindTool(canvas, event, handler);
    }
  });

  // preselect the first tool
  toolsContainer.querySelector("input").click();
};
