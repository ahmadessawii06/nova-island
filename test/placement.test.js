const test = require('node:test');
const assert = require('node:assert/strict');
const {
  inferTaskbarEdge,
  taskbarAnchor,
  taskbarVisibleBounds,
  AUTO_HIDE_RESERVE,
  DEFAULT_TASKBAR_MARGIN,
  DEFAULT_TASKBAR_PILL_WIDTH,
} = require('../placement');

const bounds = { x: 0, y: 0, width: 1920, height: 1080 };

test('detects taskbars on every display edge', () => {
  assert.equal(inferTaskbarEdge(bounds, { x: 0, y: 40, width: 1920, height: 1040 }).edge, 'top');
  assert.equal(inferTaskbarEdge(bounds, { x: 0, y: 0, width: 1920, height: 1040 }).edge, 'bottom');
  assert.equal(inferTaskbarEdge(bounds, { x: 48, y: 0, width: 1872, height: 1080 }).edge, 'left');
  assert.equal(inferTaskbarEdge(bounds, { x: 0, y: 0, width: 1872, height: 1080 }).edge, 'right');
});

test('uses the usable bottom edge for top, left, and right taskbar layouts', () => {
  const cases = [
    { workArea: { x: 0, y: 40, width: 1920, height: 1040 }, edge: 'top', y: 1042 },
    { workArea: { x: 48, y: 0, width: 1872, height: 1080 }, edge: 'left', y: 1042 },
    { workArea: { x: 0, y: 0, width: 1872, height: 1080 }, edge: 'right', y: 1042 },
  ];
  for (const item of cases) {
    const p = taskbarAnchor({ bounds, workArea: item.workArea });
    assert.equal(p.taskbar.edge, item.edge);
    assert.equal(p.y, item.y);
  }
});

test('places the island above a bottom taskbar with the configured DIP gap', () => {
  const p = taskbarAnchor({ bounds, workArea: { x: 0, y: 0, width: 1920, height: 1040 } }, { gap: 6 });
  assert.deepEqual({ x: p.x, y: p.y }, { x: 960, y: 1002 });
  assert.equal(p.taskbar.reliable, true);
});

test('supports horizontal alignment without leaving the usable display', () => {
  const display = { bounds, workArea: { x: 0, y: 0, width: 1920, height: 1040 } };
  assert.equal(taskbarAnchor(display, { alignment: 'left' }).x, 124);
  assert.equal(taskbarAnchor(display, { alignment: 'center' }).x, 960);
  assert.equal(taskbarAnchor(display, { alignment: 'right' }).x, 1796);
});

test('verifies actual visible island edge positions for Left, Center, and Right', () => {
  const display = { bounds, workArea: { x: 0, y: 0, width: 1920, height: 1040 } };

  // Left alignment: visible collapsed island is positioned at the far-left edge with a 6px margin
  const leftBounds = taskbarVisibleBounds(display, { alignment: 'left' });
  assert.equal(leftBounds.left, display.workArea.x + 6, 'left edge has 6px margin from display left');
  assert.equal(leftBounds.width, DEFAULT_TASKBAR_PILL_WIDTH);
  assert.equal(leftBounds.right, display.workArea.x + 6 + DEFAULT_TASKBAR_PILL_WIDTH);
  assert.ok(leftBounds.left >= display.workArea.x, 'left boundary inside workArea');
  assert.ok(leftBounds.right <= display.workArea.x + display.workArea.width, 'right boundary inside workArea');

  // Center alignment: visible island is exactly centered horizontally
  const centerBounds = taskbarVisibleBounds(display, { alignment: 'center' });
  const centerPos = centerBounds.left + centerBounds.width / 2;
  const expectedCenter = display.workArea.x + display.workArea.width / 2;
  assert.equal(centerPos, expectedCenter, 'island center matches workArea center');
  assert.equal(centerBounds.left - display.workArea.x,
    (display.workArea.x + display.workArea.width) - centerBounds.right,
    'margins on left and right of centered island are identical');

  // Right alignment: visible collapsed island is positioned at the far-right edge with a 6px margin
  const rightBounds = taskbarVisibleBounds(display, { alignment: 'right' });
  assert.equal(rightBounds.right, display.workArea.x + display.workArea.width - 6, 'right edge has 6px margin from display right');
  assert.equal(rightBounds.width, DEFAULT_TASKBAR_PILL_WIDTH);
  assert.equal(rightBounds.left, display.workArea.x + display.workArea.width - 6 - DEFAULT_TASKBAR_PILL_WIDTH);
  assert.ok(rightBounds.left >= display.workArea.x, 'left boundary inside workArea');
  assert.ok(rightBounds.right <= display.workArea.x + display.workArea.width, 'right boundary inside workArea');

  // Vertical position and gap above taskbar are identical across all alignments
  assert.equal(leftBounds.y, centerBounds.y);
  assert.equal(rightBounds.y, centerBounds.y);
  assert.equal(display.workArea.y + display.workArea.height - centerBounds.bottom, 6, 'vertical gap above taskbar is 6px');
});

test('uses the selected monitor coordinates', () => {
  const display = {
    bounds: { x: -2560, y: -200, width: 2560, height: 1440 },
    workArea: { x: -2560, y: -200, width: 2520, height: 1440 },
  };
  const p = taskbarAnchor(display, { alignment: 'center' });
  assert.equal(p.x, -1300);
  assert.equal(p.y, 1202);
  assert.equal(p.taskbar.edge, 'right');

  // Multi-monitor with negative coordinates: Left alignment
  const left = taskbarVisibleBounds(display, { alignment: 'left' });
  assert.equal(left.left, -2560 + 6, 'secondary monitor left edge has 6px margin');
  assert.equal(left.right, -2560 + 6 + 236);

  // Multi-monitor with negative coordinates: Right alignment
  const right = taskbarVisibleBounds(display, { alignment: 'right' });
  assert.equal(right.right, -2560 + 2520 - 6, 'secondary monitor right edge has 6px margin from usable workArea');
  assert.equal(right.left, -2560 + 2520 - 6 - 236);
});

test('supports secondary monitor with positive offset', () => {
  const display = {
    bounds: { x: 1920, y: 0, width: 1920, height: 1080 },
    workArea: { x: 1920, y: 0, width: 1920, height: 1040 },
  };
  const left = taskbarVisibleBounds(display, { alignment: 'left' });
  assert.equal(left.left, 1920 + 6);

  const center = taskbarVisibleBounds(display, { alignment: 'center' });
  assert.equal(center.left + center.width / 2, 1920 + 960);

  const right = taskbarVisibleBounds(display, { alignment: 'right' });
  assert.equal(right.right, 1920 + 1920 - 6);
});

test('respects side taskbars during horizontal alignment', () => {
  // Left taskbar inset 48px
  const leftTaskbarDisplay = {
    bounds: { x: 0, y: 0, width: 1920, height: 1080 },
    workArea: { x: 48, y: 0, width: 1872, height: 1080 },
  };
  const leftWithLeftTaskbar = taskbarVisibleBounds(leftTaskbarDisplay, { alignment: 'left' });
  assert.equal(leftWithLeftTaskbar.left, 48 + 6, 'island is 6px right of left taskbar');

  // Right taskbar inset 48px
  const rightTaskbarDisplay = {
    bounds: { x: 0, y: 0, width: 1920, height: 1080 },
    workArea: { x: 0, y: 0, width: 1872, height: 1080 },
  };
  const rightWithRightTaskbar = taskbarVisibleBounds(rightTaskbarDisplay, { alignment: 'right' });
  assert.equal(rightWithRightTaskbar.right, 1872 - 6, 'island is 6px left of right taskbar');
});

test('keeps calculations in DIPs on mixed-DPI monitors', () => {
  const display = {
    scaleFactor: 1.5,
    bounds: { x: 1920, y: 0, width: 1280, height: 720 },
    workArea: { x: 1920, y: 0, width: 1280, height: 680 },
  };
  assert.deepEqual(taskbarAnchor(display, { gap: 6 }), {
    x: 2560, y: 642, gap: 6, alignment: 'center',
    taskbar: { edge: 'bottom', inset: 40, reliable: true },
  });

  const left = taskbarVisibleBounds(display, { alignment: 'left', gap: 6 });
  assert.equal(left.left, 1920 + 6);

  const right = taskbarVisibleBounds(display, { alignment: 'right', gap: 6 });
  assert.equal(right.right, 1920 + 1280 - 6);
});

test('reserves reveal space when an auto-hidden taskbar is ambiguous', () => {
  const p = taskbarAnchor({ bounds, workArea: bounds }, { gap: 6 });
  assert.equal(p.y, 1080 - 32 - 6 - AUTO_HIDE_RESERVE);
  assert.equal(p.taskbar.reliable, false);
});
