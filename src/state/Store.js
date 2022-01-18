export default function ({
  interval,
  prevCells,
  cells,
  canvasHandlers,
  dragging,
  cellColor,
  cellSize,
  speed,
}) {
  this.interval = interval;
  this.prevCells = prevCells;
  this.cells = cells;
  this.canvasHandlers = canvasHandlers;
  this.dragging = dragging;
  this.cellColor = cellColor;
  this.cellSize = cellSize;
  this.speed = speed;
}
