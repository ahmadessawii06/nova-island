// Pure hover geometry shared by the main process and regression tests.
function screenRect(windowBounds, localRect) {
  return {
    x: windowBounds.x + localRect.x,
    y: windowBounds.y + localRect.y,
    width: localRect.width,
    height: localRect.height,
  };
}

function containsPoint(rect, point, pad = 0) {
  return point.x >= rect.x - pad &&
    point.x <= rect.x + rect.width + pad &&
    point.y >= rect.y - pad &&
    point.y <= rect.y + rect.height + pad;
}

function overlaps(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
    a.y < b.y + b.height && a.y + a.height > b.y;
}

// Browser ghosting lets clicks reach tabs underneath the original top island. Taskbar and
// side placements are desktop placements: a maximized browser must not disable their hover.
function shouldGhost({ placement, addressBarIsland, browserRect, islandScreenRect }) {
  return placement === 'original' && !addressBarIsland && !!browserRect &&
    !!islandScreenRect.width && overlaps(islandScreenRect, browserRect);
}

module.exports = { screenRect, containsPoint, overlaps, shouldGhost };
