# Taskbar Island placement

Taskbar Island is an optional floating placement for Nova Island. On the usual bottom-taskbar
layout, the collapsed island is centered immediately above the taskbar, with a configurable
6-DIP gap. Left and right alignments use the corresponding quarter of the selected display.
When the taskbar is on another edge, Nova stays near the bottom of the usable work area so the
expanded UI remains visible.

Electron reports display bounds and work areas in device-independent pixels. Nova compares the
two to identify the reserved taskbar edge, then places its transparent window wholly in the
usable area whenever that area is large enough. If Windows exposes no reliable inset (commonly
with an auto-hidden taskbar), Nova assumes a bottom taskbar and leaves a conservative reveal
reserve. The gap setting can add more clearance.

Dragging Taskbar Island onto another monitor selects that monitor; alignment is then reapplied.
Display resolution, scale, work-area, addition, and removal events all trigger a fresh layout.
Only the island itself accepts mouse input after the existing hover-intent delay. The rest of its
transparent Electron window remains click-through, including the taskbar.

## Floating placement versus native taskbar integration

This implementation is a top-level, always-on-top Electron window. It does not inject into
Explorer, modify the Windows taskbar, create an AppBar, or reparent a window into `Shell_TrayWnd`.
That keeps Explorer stability, update compatibility, and Nova's existing rendering and feature
model intact. The tradeoff is that Nova does not participate in the taskbar's native layout,
overflow, accessibility tree, or icon reservation.

A true native experiment should be a separate, disposable Windows prototype. It could evaluate
a signed WinUI 3 or C++ companion using documented shell/AppBar APIs, accessibility, Explorer
restart recovery, multi-monitor taskbars, DPI transitions, and Windows 10/11 version differences.
It should not be shipped or connected to Nova until those lifecycle and safety questions are
resolved; Explorer injection and undocumented reparenting are explicitly out of scope.

## Development and packaging

```powershell
npm install
npm test
npm start
npm run dist
```

`npm start` runs the unpackaged app. `npm run dist` creates the Windows NSIS installer in
`dist/`; `npm run dist:portable` creates a portable executable. Placement should be exercised on
real Windows 10 and 11 systems with bottom, top, left, right, and auto-hidden taskbars, multiple
monitors, mixed scale factors, fullscreen apps, and Explorer restarts before release.
