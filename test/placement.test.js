const test = require('node:test');
const assert = require('node:assert/strict');
const { inferTaskbarEdge, taskbarAnchor, AUTO_HIDE_RESERVE } = require('../placement');

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
  assert.equal(taskbarAnchor(display, { alignment: 'left' }).x, 480);
  assert.equal(taskbarAnchor(display, { alignment: 'right' }).x, 1440);
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
});

test('reserves reveal space when an auto-hidden taskbar is ambiguous', () => {
  const p = taskbarAnchor({ bounds, workArea: bounds }, { gap: 6 });
  assert.equal(p.y, 1080 - 32 - 6 - AUTO_HIDE_RESERVE);
  assert.equal(p.taskbar.reliable, false);
});
