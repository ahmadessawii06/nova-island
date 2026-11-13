// Pure placement helpers. Electron's Display bounds and workArea are already expressed in
// device-independent pixels, so calculations must not multiply by scaleFactor.
const DEFAULT_TASKBAR_GAP = 6;
const AUTO_HIDE_RESERVE = 48;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function inferTaskbarEdge(bounds, workArea, tolerance = 1) {
  const insets = {
    top: workArea.y - bounds.y,
    left: workArea.x - bounds.x,
    right: bounds.x + bounds.width - (workArea.x + workArea.width),
    bottom: bounds.y + bounds.height - (workArea.y + workArea.height),
  };
  const edge = Object.entries(insets).sort((a, b) => b[1] - a[1])[0];
  return edge[1] > tolerance ? { edge: edge[0], inset: edge[1], reliable: true }
    : { edge: 'bottom', inset: 0, reliable: false };
}

function taskbarAnchor(display, options = {}) {
  const bounds = display.bounds;
  const workArea = display.workArea;
  const gap = clamp(Number.isFinite(options.gap) ? options.gap : DEFAULT_TASKBAR_GAP, 0, 96);
  const alignment = ['left', 'center', 'right'].includes(options.alignment) ? options.alignment : 'center';
  const pillWidth = options.pillWidth || 240;
  const pillHeight = options.pillHeight || 34;
  const taskbar = inferTaskbarEdge(bounds, workArea);
  const ratios = { left: 0.25, center: 0.5, right: 0.75 };
  const x = clamp(
    workArea.x + workArea.width * ratios[alignment],
    workArea.x + pillWidth / 2,
    workArea.x + workArea.width - pillWidth / 2
  );
  // A visible bottom taskbar is represented by the work-area bottom. With an auto-hidden
  // taskbar there is often no inset at all, so reserve enough room for its reveal strip.
  const reserve = taskbar.reliable ? 0 : (options.autoHideReserve ?? AUTO_HIDE_RESERVE);
  const y = workArea.y + workArea.height - pillHeight - gap - reserve;
  return { x, y, gap, alignment, taskbar };
}

module.exports = {
  DEFAULT_TASKBAR_GAP,
  AUTO_HIDE_RESERVE,
  inferTaskbarEdge,
  taskbarAnchor,
};
