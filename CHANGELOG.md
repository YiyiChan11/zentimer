# Changelog

All notable changes to ZenTimer are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.1.10] — Unreleased (in development)

### Added
- **Floating window lock/unlock** — New lock button on floating window bottom-right corner; lock toggle in Settings between Close Floating and opacity slider. When locked, the floating window ignores all clicks/drags/taps.
- **Lock button sizing** — Close and Lock buttons enlarged to 24px (1.5x) for better touch/click targets.
- **Pause glow dimming** — Circular timer inner glow dims to ~20% when paused, with smooth 700ms transition.
- **Floating window text prominence** — Two-layer opacity system: text stays 8-12% brighter than frame at all opacities.
- **SessionStats i18n fix** — "Today N sessions" now properly translates in English mode.

### Changed
- **Download page link** — Removed download icon from header; entry point moved to Settings panel bottom section.
- **Update UI** — Top floating notification hidden during downloads; inline progress shown only in Settings panel.
- **Version bump** — 1.1.9 → 1.1.10 for auto-update trigger.

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

[1.1.10]: https://github.com/YiyiChan11/zentimer/compare/v1.1.9...main
[1.1.9]: https://github.com/YiyiChan11/zentimer/releases/tag/v1.1.9
