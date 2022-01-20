export const bindToolOptions = (elements, state) => {
  const { colorInput, flipShapeXInput, flipShapeYInput } = elements;

  colorInput.value = state.color;
  colorInput.addEventListener("input", (e) => {
    state.color = e.target.value;
  });

  flipShapeXInput.checked = state.flipShapeX;
  flipShapeXInput.addEventListener("input", (e) => {
    state.flipShapeX = e.target.checked;
  });

  flipShapeYInput.checked = state.flipShapeY;
  flipShapeYInput.addEventListener("input", (e) => {
    state.flipShapeY = e.target.checked;
  });
};
