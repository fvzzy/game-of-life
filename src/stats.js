export const updateTotalCells = (
  outputElement,
  canvasWidth,
  canvasHeight,
  cellSize
) => {
  const totalCells = (canvasWidth / cellSize) * (canvasHeight / cellSize);
  outputElement.textContent = `${totalCells} Total Cells`;
};

export const updateLiveCells = (outputElement, cellCount) => {
  outputElement.textContent = `${cellCount} Live Cells`;
};

export const updateGenerations = (outputElement, generations) => {
  outputElement.textContent = `${generations} Generations`;
};

export const updateUniqueColors = (outputElement, cellColors) => {
  const uniqueColors = new Set(cellColors.values()).size;
  outputElement.textContent = `${uniqueColors} Unique Colours`;
};
