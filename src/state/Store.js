export default function ({
  interval,
  prevCells,
  cells,
  cellColors,
  canvasHandlers,
  paused,
  dragging,
  color,
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
  this.randomiseColors = randomiseColors;
  this.cellSize = cellSize;
  this.speed = speed;
}
