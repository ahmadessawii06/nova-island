const test = require('node:test');
const assert = require('node:assert/strict');
const { screenRect, containsPoint, shouldGhost } = require('../hover');

const browser = { x: 0, y: 0, width: 1920, height: 1040 };
const cases = {
  original: {
    window: { x: 640, y: 0, width: 640, height: 320 },
    collapsed: { x: 202, y: 8, width: 236, height: 32 },
    expanded: { x: 46, y: 8, width: 548, height: 232 },
  },
  taskbar: {
    window: { x: 640, y: 720, width: 640, height: 320 },
    collapsed: { x: 202, y: 284, width: 236, height: 32 },
    expanded: { x: 46, y: 84, width: 548, height: 232 },
  },
  taskbar_left: {
    window: { x: 0, y: 720, width: 640, height: 320 },
    collapsed: { x: 6, y: 284, width: 236, height: 32 },
    expanded: { x: 6, y: 84, width: 548, height: 232 },
  },
  taskbar_right: {
    window: { x: 1280, y: 720, width: 640, height: 320 },
    collapsed: { x: 398, y: 284, width: 236, height: 32 },
    expanded: { x: 86, y: 84, width: 548, height: 232 },
  },
  left: {
    window: { x: 0, y: 360, width: 640, height: 320 },
    collapsed: { x: 0, y: 38, width: 44, height: 244 },
    expanded: { x: 0, y: 44, width: 548, height: 232 },
  },
  right: {
    window: { x: 1280, y: 360, width: 640, height: 320 },
    collapsed: { x: 596, y: 38, width: 44, height: 244 },
    expanded: { x: 92, y: 44, width: 548, height: 232 },
  },
};

test('collapsed pills are hit-tested in screen coordinates in every placement', () => {
  for (const [mode, geometry] of Object.entries(cases)) {
    const rect = screenRect(geometry.window, geometry.collapsed);
    const cursor = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    assert.equal(containsPoint(rect, cursor), true, mode);
  }
});

test('the expansion keeps the original collapsed hover point interactive', () => {
  for (const [mode, geometry] of Object.entries(cases)) {
    const collapsed = screenRect(geometry.window, geometry.collapsed);
    const expanded = screenRect(geometry.window, geometry.expanded);
    const cursor = { x: collapsed.x + collapsed.width / 2, y: collapsed.y + collapsed.height / 2 };
    assert.equal(containsPoint(expanded, cursor, 8), true, mode);
  }
});

test('placements expand in the intended direction', () => {
  assert.equal(cases.original.expanded.y, cases.original.collapsed.y, 'original opens down');
  assert.equal(cases.taskbar.expanded.y + cases.taskbar.expanded.height,
    cases.taskbar.collapsed.y + cases.taskbar.collapsed.height, 'taskbar opens up');
  assert.equal(cases.taskbar_left.expanded.x, cases.taskbar_left.collapsed.x, 'taskbar left opens right');
  assert.equal(cases.taskbar_left.expanded.y + cases.taskbar_left.expanded.height,
    cases.taskbar_left.collapsed.y + cases.taskbar_left.collapsed.height, 'taskbar left opens up');
  assert.equal(cases.taskbar_right.expanded.x + cases.taskbar_right.expanded.width,
    cases.taskbar_right.collapsed.x + cases.taskbar_right.collapsed.width, 'taskbar right opens left');
  assert.equal(cases.taskbar_right.expanded.y + cases.taskbar_right.expanded.height,
    cases.taskbar_right.collapsed.y + cases.taskbar_right.collapsed.height, 'taskbar right opens up');
  assert.equal(cases.left.expanded.x, cases.left.collapsed.x, 'left opens right');
  assert.equal(cases.right.expanded.x + cases.right.expanded.width,
    cases.right.collapsed.x + cases.right.collapsed.width, 'right opens left');
});

test('taskbar center expands symmetrically', () => {
  const collapsedCenter = cases.taskbar.collapsed.x + cases.taskbar.collapsed.width / 2;
  const expandedCenter = cases.taskbar.expanded.x + cases.taskbar.expanded.width / 2;
  assert.equal(expandedCenter, collapsedCenter, 'taskbar center expands symmetrically');
});

test('browser ghost click-through is limited to the original placement', () => {
  for (const [placement, geometry] of Object.entries(cases)) {
    const ghost = shouldGhost({
      placement,
      addressBarIsland: false,
      browserRect: browser,
      islandScreenRect: screenRect(geometry.window, geometry.collapsed),
    });
    assert.equal(ghost, placement === 'original', placement);
  }
});
