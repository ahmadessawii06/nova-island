const test = require('node:test');
const assert = require('node:assert/strict');
const {
  inferTaskbarEdge,
  taskbarAnchor,
  taskbarVisibleBounds,
  trayAnchor,
  trayVisibleBounds,
  AUTO_HIDE_RESERVE,
  DEFAULT_TASKBAR_MARGIN,
  DEFAULT_TASKBAR_PILL_WIDTH,
  DEFAULT_TRAY_AREA_WIDTH,
  DEFAULT_TRAY_MARGIN,
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

test('places the island inside the taskbar vertically beside the tray area', () => {
  const display = { bounds, workArea: { x: 0, y: 0, width: 1920, height: 1040 } };
  const b = trayVisibleBounds(display);

  // Vertically centered inside the 40px taskbar (1040 to 1080)
  assert.equal(b.top, 1044, 'centered inside 40px taskbar height');
  assert.equal(b.bottom, 1076, 'leaves 4px padding above bottom screen edge');
  assert.equal(b.top - display.workArea.height, 4, 'leaves 4px padding below taskbar top');

  // Horizontally beside the tray area with clean margin
  const expectedRight = 1920 - DEFAULT_TRAY_AREA_WIDTH - DEFAULT_TRAY_MARGIN;
  assert.equal(b.right, expectedRight);
  assert.equal(b.width, DEFAULT_TASKBAR_PILL_WIDTH);
  assert.equal(b.left, expectedRight - DEFAULT_TASKBAR_PILL_WIDTH);
});

test('supports custom trayBounds from Electron tray icon', () => {
  const display = { bounds, workArea: { x: 0, y: 0, width: 1920, height: 1040 } };
  const b = trayVisibleBounds(display, {
    trayBounds: { x: 1750, y: 1044, width: 20, height: 20 },
  });

  assert.equal(b.right, 1750 - DEFAULT_TRAY_MARGIN, 'island right edge has margin left of tray icon');
  assert.equal(b.left, 1750 - DEFAULT_TRAY_MARGIN - 236);
  assert.equal(b.top, 1044);
});

test('supports 48px Windows 11 taskbars with vertical centering', () => {
  const win11Display = { bounds, workArea: { x: 0, y: 0, width: 1920, height: 1032 } };
  const b = trayVisibleBounds(win11Display);

  assert.equal(b.top, 1040, 'centered inside 48px taskbar: 1032 + (48-32)/2');
  assert.equal(b.bottom, 1072, 'leaves 8px padding from bottom');
  assert.equal(b.top - 1032, 8, 'leaves 8px padding from top');
});

test('supports secondary monitor for tray placement', () => {
  const secondaryDisplay = {
    bounds: { x: 1920, y: 0, width: 1920, height: 1080 },
    workArea: { x: 1920, y: 0, width: 1920, height: 1040 },
  };
  const b = trayVisibleBounds(secondaryDisplay);

  assert.equal(b.top, 1044);
  assert.equal(b.right, 1920 + 1920 - DEFAULT_TRAY_AREA_WIDTH - DEFAULT_TRAY_MARGIN);
  assert.equal(b.left, 1920 + 1920 - DEFAULT_TRAY_AREA_WIDTH - DEFAULT_TRAY_MARGIN - 236);
});

test('supports dynamic trayNotifyRect from TrayNotifyWnd detection', () => {
  const display = { bounds, workArea: { x: 0, y: 0, width: 1920, height: 1032 } };
  const b = trayVisibleBounds(display, {
    trayNotifyRect: { x: 1621, y: 1032, width: 299, height: 48 },
  });

  assert.equal(b.right, 1621 - DEFAULT_TRAY_MARGIN, 'island right edge is placed dynamically before TrayNotifyWnd');
  assert.equal(b.left, 1621 - DEFAULT_TRAY_MARGIN - 236);
  assert.equal(b.top, 1040);
});

test('dynamically adjusts position when tray notification area widens or narrows', () => {
  const display = { bounds, workArea: { x: 0, y: 0, width: 1920, height: 1032 } };
  const wide = trayVisibleBounds(display, {
    trayNotifyRect: { x: 1550, y: 1032, width: 370, height: 48 },
  });
  assert.equal(wide.right, 1550 - DEFAULT_TRAY_MARGIN);
  assert.equal(wide.left, 1550 - DEFAULT_TRAY_MARGIN - 236);

  const narrow = trayVisibleBounds(display, {
    trayNotifyRect: { x: 1700, y: 1032, width: 220, height: 48 },
  });
  assert.equal(narrow.right, 1700 - DEFAULT_TRAY_MARGIN);
  assert.equal(narrow.left, 1700 - DEFAULT_TRAY_MARGIN - 236);
});

test('supports custom margin override for tray placement', () => {
  const display = { bounds, workArea: { x: 0, y: 0, width: 1920, height: 1032 } };
  const b = trayVisibleBounds(display, {
    trayNotifyRect: { x: 1621, y: 1032, width: 299, height: 48 },
    margin: 32,
  });

  assert.equal(b.right, 1621 - 32);
  assert.equal(b.left, 1621 - 32 - 236);
});
