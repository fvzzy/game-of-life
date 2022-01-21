export const bindToolOptions = (elements, state) => {
  const { colorInput, flipHorzInput, flipVertInput } = elements;

  colorInput.value = state.color;
  colorInput.addEventListener("input", (e) => {
    state.color = e.target.value;
  });

  flipHorzInput.checked = state.flipHorz;
  flipHorzInput.addEventListener("input", (e) => {
    state.flipHorz = e.target.checked;
  });

  flipVertInput.checked = state.flipVert;
  flipVertInput.addEventListener("input", (e) => {
    state.flipVert = e.target.checked;
  });
};
