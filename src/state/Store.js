export default function ({
  // gameplay
  interval = null,
  prevCells = null,
  cells = new Set(),
  cellColors = new Map(),
  canvasHandlers = new Map(),
  paused = false,
  generations = 0,

  // tool settings
  dragging = false,
  color,
  flipHorz = false,
  flipVert = false,

  // game settings
  randomiseColors,
  cellSize,
  speed,
}) {
  this.interval = interval;
  this.prevCells = prevCells;
  this.cells = cells;
  this.cellColors = cellColors;
  this.canvasHandlers = canvasHandlers;
  this.paused = paused;
  this.generations = generations;
  this.dragging = dragging;
  this.color = color;
  this.flipHorz = flipHorz;
  this.flipVert = flipVert;
  this.randomiseColors = randomiseColors;
  this.cellSize = cellSize;
  this.speed = speed;
}
