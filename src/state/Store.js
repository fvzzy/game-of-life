export default function ({
  // gameplay
  interval,
  prevCells,
  cells,
  cellColors,
  canvasHandlers,
  paused,
  // tool settings
  dragging,
  color,
  flipShapeX,
  flipShapeY,
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
  this.dragging = dragging;
  this.color = color;
  this.flipShapeX = flipShapeX;
  this.flipShapeY = flipShapeY;
  this.randomiseColors = randomiseColors;
  this.cellSize = cellSize;
  this.speed = speed;
}
