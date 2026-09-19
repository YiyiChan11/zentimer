# Changelog

All notable changes to ZenTimer are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.10.6] — 2026-09-20

### Fixed
- **Floating Reset button restarted the timer** — Pressing Reset reset the timer to idle, but a stray "single tap" from the drag/tap gesture fired ~280 ms later and immediately restarted the countdown. The press guard compared `e.target` against the button element by identity, which fails when the click lands on the button's inner `<svg>`/`<path>` — so the container's tap logic ran anyway. The guard now uses `closest('.action-btn')`, plus a second safety net on `pointerup`. Reset now stays stopped, matching the main app.
- **Floating Skip button was immediately paused** — Same root cause: after Skip advanced the phase, the stray tap toggled the timer back to paused. Skip now behaves identically to the main app's Skip (`focus → break`, `break/buffer → next focus or idle`).
- **Long-press on an action button started window dragging** — Same guard fix; pressing and holding a corner button no longer begins a window drag.

### Changed
- **Floating icon consistency** — Reset and Skip icons redrawn to match the main app's lucide equivalents (`RotateCcw` ↺ and `SkipForward` ▷|) instead of the previous ad-hoc shapes.

## [1.10.5] — 2026-09-08

### Added
- **Floating window Reset button** — Top-left corner; resets timer to idle state (counter-clockwise arrow icon, cool gray hover).
- **Floating window Skip button** — Bottom-left corner; skips current focus/break session (double-chevron-right icon, teal hover).

### Changed
- **Four-corner action layout** — Floating window now has a symmetric 2×2 button grid: Reset (top-left) / Close (top-right) / Skip (bottom-left) / Lock (bottom-right). All buttons share the same premium glass style with unique accent colors on hover.

## [1.10.4] — 2026-08-24

### Changed
- **Focus time slider — per-minute precision** — Fixed mode slider now steps by 1 minute (previously snapped to 5-min multiples); range 1–150 min.
- **Max focus duration raised to 150 min** — Both Fixed and Random modes now allow up to 150 min (previously capped at 90 min).

## [1.10.3] — 2026-08-12

### Fixed
- **Micro Break layout stability** — Fixed/Random interval toggle no longer causes UI jump; both modes now show a consistent two-column grid (Fixed mode links both inputs, Random mode keeps them independent).
- **Floating window font size** — Restored original time (28px) and phase (10px) fonts after previous over-shrink.
- **Floating window lock sync** — Clicking the floating window's own lock button now properly syncs with the main app's "Lock Floating" button via `floating-lock-changed` Tauri event.

### Changed
- **Action button refinement** — Close/Lock icons use subtler backgrounds, 0.5px border, softer hover colors, scale(1.1) animation, balanced stroke-width for a more premium feel. Hit area remains 24×24px.
- **NumberRow component** — Gains `disabled` prop for read-only state (used by Fixed mode's second column).

## [1.10.2] — 2026-08-12

### Fixed
- **Duplicate update window** — Removed the redundant top floating "Downloading update…" overlay; download progress now shows only in the Settings panel card.
- **Micro-break interval semantics** — The Fixed/Random control now sets the reminder *interval* (when a micro-break is triggered) instead of the break length; defaults to Random and remembers the last choice.
- **SessionStats label** — "Today N sessions" changed to "This session N sessions" (「今日」→「本次」) in both zh/en.

### Changed
- **Floating window polish** — Smaller, more refined time/phase text and action icons (hit area unchanged) for a premium feel.
- **Click-through when locked** — When the floating window is locked, mouse clicks pass through to content behind it (`WS_EX_TRANSPARENT`); unlock only from the main app.

## [1.10.1] — 2026-08-12

### Added
- **Micro-break counts as focus time** — New `bufferCountsAsFocus` setting. When enabled, the focus countdown keeps running during a micro-break (micro-break time is absorbed into focus). When disabled (default), focus pauses and resumes after the micro-break ends.
- **Micro-break duration: fixed or random** — New `bufferMode` setting. Choose a fixed micro-break length, or a random range (seconds) recomputed for every micro-break.
- **Floating window lock/unlock** — New lock button on floating window bottom-right corner; lock toggle in Settings between Close Floating and opacity slider. When locked, the floating window ignores all clicks/drags/taps.
- **Lock button sizing** — Close and Lock buttons enlarged to 24px (1.5x) for better touch/click targets.
- **Pause glow dimming** — Circular timer inner glow dims to ~20% when paused, with smooth 700ms transition.
- **Floating window text prominence** — Two-layer opacity system: text stays 8-12% brighter than frame at all opacities.
- **SessionStats i18n fix** — "Today N sessions" now properly translates in English mode.

### Changed
- **Download page link** — Removed download icon from header; entry point moved to Settings panel bottom section.
- **Update UI** — Top floating notification hidden during downloads; inline progress shown only in Settings panel.
- **Versioning scheme** — Switched to three-part `X.Y.Z` (patch = small bug fixes / UI tweaks). The previously-shipped `1.1.10` is now the `1.10.0` baseline; this release is `1.10.1`.

### Documentation
- Full README with architecture, design decisions, tech stack table
- CONTRIBUTING.md guide
- LICENSE (MIT)
- CHANGELOG.md (this file)

## [1.1.9] — 2026-07-09

### Added
- Default window size: 540×832 px
- Floating window opacity remapped: 0% → ~5% visible, 100% → fully opaque
- Single instance prevention (`tauri-plugin-single-instance`)
- Download entry in Settings panel

### Fixed
- Update notification overlapping bottom controls → moved to top
- BufferToast intercepting pointer events → `pointer-events-none`
- CircularTimer ring blocking clicks below it → `pointer-events-none`

## [1.1.8] — 2026-07-08

### Added
- Idle layout position shift up (avoid overlap of Longest and Start Focus)
- Enhanced glow UI style (radial gradient backgrounds per phase)

## [1.1.7] — 2026-07-07

### Fixed
- Animation "snap" bug: Framer Motion cannot interpolate `min()/calc()` strings → switched to numeric pixel values via single unified spring
- Layout animation competing with size spring → removed `layout` prop, used absolute positioning
- Floating window transparency not applying → forced `WS_EX_LAYERED` via Win32 API before calling `SetLayeredWindowAttributes`

## [1.1.5–1.1.6] — 2026-07-07

### Added
- Floating window opacity slider (0–100) with enlarged hit area
- Update notification card positioned below Check button
- Smooth focus-entry animation (size + position + font synchronized)

## [1.1.2–1.1.4] — 2026-07-06

### Initial Tauri 2.0 Desktop Release
- Native Windows desktop build (Tauri 2.11)
- System tray with show/hide/quit menu
- Always-on-top native floating window (replacing Document PiP fallback)
- Auto-updater with Gitee-hosted releases
- Minimize-to-tray behavior
- Signed installer (minisign)

---

[1.10.6]: https://github.com/YiyiChan11/zentimer/compare/v1.10.5...main
[1.10.5]: https://github.com/YiyiChan11/zentimer/compare/v1.10.4...main
[1.10.4]: https://github.com/YiyiChan11/zentimer/compare/v1.10.3...main
[1.10.3]: https://github.com/YiyiChan11/zentimer/compare/v1.10.2...main
[1.10.2]: https://github.com/YiyiChan11/zentimer/compare/v1.10.1...main
[1.10.1]: https://github.com/YiyiChan11/zentimer/compare/v1.1.9...main
[1.1.9]: https://github.com/YiyiChan11/zentimer/releases/tag/v1.1.9
