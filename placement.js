// Pure placement helpers. Electron's Display bounds and workArea are already expressed in
// device-independent pixels, so calculations must not multiply by scaleFactor.
const DEFAULT_TASKBAR_GAP = 6;
const DEFAULT_TASKBAR_MARGIN = 6;
const DEFAULT_TASKBAR_PILL_WIDTH = 236;
const DEFAULT_TASKBAR_PILL_HEIGHT = 32;
const DEFAULT_TRAY_AREA_WIDTH = 300;
const DEFAULT_TRAY_MARGIN = 24;
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
  const margin = clamp(Number.isFinite(options.margin) ? options.margin : DEFAULT_TASKBAR_MARGIN, 0, 96);
  const alignment = ['left', 'center', 'right'].includes(options.alignment) ? options.alignment : 'center';
  const pillWidth = options.pillWidth || DEFAULT_TASKBAR_PILL_WIDTH;
  const pillHeight = options.pillHeight || DEFAULT_TASKBAR_PILL_HEIGHT;
  const taskbar = inferTaskbarEdge(bounds, workArea);

  let targetX;
  if (alignment === 'left') {
    targetX = workArea.x + margin + pillWidth / 2;
  } else if (alignment === 'right') {
    targetX = workArea.x + workArea.width - margin - pillWidth / 2;
  } else {
    targetX = workArea.x + workArea.width / 2;
  }

  const minX = workArea.x + pillWidth / 2;
  const maxX = workArea.x + workArea.width - pillWidth / 2;
  const x = minX <= maxX ? clamp(targetX, minX, maxX) : workArea.x + workArea.width / 2;

  // A visible bottom taskbar is represented by the work-area bottom. With an auto-hidden
  // taskbar there is often no inset at all, so reserve enough room for its reveal strip.
  const reserve = taskbar.reliable ? 0 : (options.autoHideReserve ?? AUTO_HIDE_RESERVE);
  const rawY = workArea.y + workArea.height - pillHeight - gap - reserve;
  const minY = workArea.y;
  const maxY = workArea.y + workArea.height - pillHeight;
  const y = clamp(rawY, minY, maxY);

  return { x, y, gap, alignment, taskbar };
}

function taskbarVisibleBounds(display, options = {}) {
  const anchor = taskbarAnchor(display, options);
  const pillWidth = options.pillWidth || DEFAULT_TASKBAR_PILL_WIDTH;
  const pillHeight = options.pillHeight || DEFAULT_TASKBAR_PILL_HEIGHT;
  const left = anchor.x - pillWidth / 2;
  const top = anchor.y;
  return {
    x: left,
    y: top,
    width: pillWidth,
    height: pillHeight,
    left,
    top,
    right: left + pillWidth,
    bottom: top + pillHeight,
  };
}

// Tray placement: embeds the island directly inside the taskbar height, placed neatly beside the tray area.
function trayAnchor(display, options = {}) {
  const bounds = display.bounds;
  const workArea = display.workArea;
  const margin = clamp(Number.isFinite(options.margin) ? options.margin : DEFAULT_TRAY_MARGIN, 0, 96);
  const pillWidth = options.pillWidth || DEFAULT_TASKBAR_PILL_WIDTH;
  const pillHeight = options.pillHeight || DEFAULT_TASKBAR_PILL_HEIGHT;
  const taskbar = inferTaskbarEdge(bounds, workArea);

  // Vertical: centered directly inside the taskbar height
  let y;
  if (taskbar.edge === 'top') {
    const taskbarHeight = taskbar.reliable ? (workArea.y - bounds.y) : 40;
    y = bounds.y + Math.max(0, Math.round((taskbarHeight - pillHeight) / 2));
  } else {
    const taskbarTop = workArea.y + workArea.height;
    const taskbarHeight = taskbar.reliable ? (bounds.y + bounds.height - taskbarTop) : 40;
    y = taskbarTop + Math.max(0, Math.round((taskbarHeight - pillHeight) / 2));
  }

  // Horizontal: placed directly beside the tray icon / notification area
  let targetRight;
  const tnr = options.trayNotifyRect;
  if (tnr && Number.isFinite(tnr.x) && (tnr.width > 0 || !Number.isFinite(tnr.width)) && tnr.x > bounds.x && tnr.x <= bounds.x + bounds.width) {
    targetRight = tnr.x - margin;
  } else if (options.trayBounds && Number.isFinite(options.trayBounds.x) && options.trayBounds.x > bounds.x) {
    targetRight = options.trayBounds.x - margin;
  } else {
    const trayAreaWidth = clamp(Number.isFinite(options.trayAreaWidth) ? options.trayAreaWidth : DEFAULT_TRAY_AREA_WIDTH, 60, 480);
    targetRight = workArea.x + workArea.width - trayAreaWidth - margin;
  }

  const targetX = targetRight - pillWidth / 2;
  const minX = bounds.x + margin + pillWidth / 2;
  const maxX = bounds.x + bounds.width - margin - pillWidth / 2;
  const x = minX <= maxX ? clamp(targetX, minX, maxX) : bounds.x + bounds.width / 2;

  return { x, y, alignment: 'right', taskbar, targetRight };
}

function trayVisibleBounds(display, options = {}) {
  const anchor = trayAnchor(display, options);
  const pillWidth = options.pillWidth || DEFAULT_TASKBAR_PILL_WIDTH;
  const pillHeight = options.pillHeight || DEFAULT_TASKBAR_PILL_HEIGHT;
  const left = anchor.x - pillWidth / 2;
  const top = anchor.y;
  return {
    x: left,
    y: top,
    width: pillWidth,
    height: pillHeight,
    left,
    top,
    right: left + pillWidth,
    bottom: top + pillHeight,
  };
}

module.exports = {
  DEFAULT_TASKBAR_GAP,
  DEFAULT_TASKBAR_MARGIN,
  DEFAULT_TASKBAR_PILL_WIDTH,
  DEFAULT_TASKBAR_PILL_HEIGHT,
  DEFAULT_TRAY_AREA_WIDTH,
  DEFAULT_TRAY_MARGIN,
  AUTO_HIDE_RESERVE,
  inferTaskbarEdge,
  taskbarAnchor,
  taskbarVisibleBounds,
  trayAnchor,
  trayVisibleBounds,
};
