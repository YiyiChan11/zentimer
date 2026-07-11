<p align="center">
  <img src="public/logo.svg" alt="ZenTimer Logo" width="88" />
</p>

<h1 align="center">ZenTimer — 禅意番茄钟</h1>

<p align="center">
  <em>Focus. Breathe. Continue.</em>
</p>

<p align="center">
  A calm, elegant Pomodoro timer with a tea-ceremony-inspired aesthetic.<br />
  Built with React + Tauri 2.0. Cross-platform: Web · Windows · (Android coming)
</p>

<p align="center">
  <a href="https://github.com/YiyiChan11/zentimer/releases"><strong>Download for Windows</strong></a> &nbsp;·&nbsp;
  <a href="#web-version">Web App (PWA)</a> &nbsp;·&nbsp;
  <a href="#screenshots">Screenshots</a> &nbsp;·&nbsp;
  <a href="#architecture">Architecture</a>
</p>

---

## Features

- **Flexible Timing** — Fixed duration (5–90 min, 5-min steps) or random range mode
- **Micro Breaks** — Optional 15-second buffer break at a random point during focus (drink water, rest your eyes)
- **Break Cycle** — Automatic rest period after each focus session (default 10 min, configurable)
- **Volume Control** — Adjustable with test playback; logarithmic curve for perceptual smoothness
- **Floating Window** — Always-on-top mini timer with lockable interactivity and two-layer opacity system
- **Auto-Update** — Built-in updater with signed releases (Gitee-hosted)
- **Single Instance** — Prevents multiple windows from cluttering the taskbar
- **Keyboard Shortcuts** — Space to start/pause, Esc to reset
- **Bilingual** — Chinese / English toggle, fully i18n
- **PWA Installable** — Add to desktop from Chrome/Edge for a near-native experience

## Screenshots

| Main Timer | Settings Panel | Floating Window |
|:---:|:---:|:---:|
| *Focusing view with glow ring* | *Break settings, volume, floating controls* | *Always-on-top mini timer* |

> Screenshots will be added here. For now, run `npm run dev` to see the app live.

## Quick Start

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- (For Tauri builds) [Rust toolchain](https://rustup.rs/) + [Tauri CLI](https://v2.tauri.app/start/prerequisites/)

### Web / PWA

```bash
# Clone
git clone https://github.com/YiyiChan11/zentimer.git
cd zentimer

# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build
npm run build
```

The built `dist/` folder can be served by any static host. The app includes a Service Worker for PWA installation.

### Windows Desktop (Tauri)

```bash
# Build installer (requires Rust)
npx tauri build

# Output:
#   src-tauri/target/release/bundle/nsis/ZenTimer_x64-setup.exe
```

See [`gitee-release/publish.ps1`](gitee-release/publish.ps1) for the full release script (build → sign → push to Gitee).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript |
| **Build** | Vite + Rollup |
| **Styling** | Tailwind CSS 3 (custom theme) |
| **Animation** | Framer Motion (unified spring physics) |
| **State** | Zustand + persist (localStorage) |
| **Sound** | Web Audio API (procedural generation, zero audio files) |
| **Desktop Shell** | Tauri 2.0 (Rust) |
| **Floating Win** | Document PiP (Web) / Native WebView (Tauri) |
| **Win32 Interop** | `windows` crate (layered window alpha) |
| **Auto-Update** | `tauri-plugin-updater` (minisign-signed) |
| **Single Instance** | `tauri-plugin-single-instance` |
| **PWA** | `vite-plugin-pwa` (Workbox) |
| **i18n** | Custom hook (`useT`) + JSON locale files |

## Architecture

```
src/
├── components/
│   ├── layout/
│   │   └── Header.tsx              # Top nav (logo + settings)
│   ├── timer/
│   │   ├── CircularTimer.tsx        # SVG progress ring + glow effects
│   │   ├── TimerControls.tsx        # Start/Pause/Reset/Skip
│   │   ├── TimeSelector.tsx         # Fixed/Random time picker
│   │   ├── FixedTimeSlider.tsx      # Slider with snap points
│   │   ├── SessionStats.tsx         # "Today N sessions" counter
│   │   └── BufferToast.tsx          # Micro-break overlay toast
│   ├── settings/
│   │   ├── SettingsPanel.tsx        # Slide-in drawer (all settings)
│   │   ├── Toggle.tsx              # iOS-style toggle switch
│   │   ├── VolumeControl.tsx        # Logarithmic volume slider
│   │   └── UpdateNotification.tsx   # Top floating update alert
│   ├── floating/
│   │   └── FloatingWindowButton.tsx # Bottom-right toggle button
│   └── download/
│       └── DownloadPage.tsx         # Multi-platform download page
├── hooks/
│   ├── useFloatingWindow.tsx        # Floating window lifecycle + IPC
│   └── useKeyboardShortcuts.ts      # Space/Esc bindings
├── store/
│   ├── timerStore.ts               # Core timer state machine
│   ├── settingsStore.ts            # Persisted user preferences
│   ├── floatingStore.ts            # Floating window open/locked state
│   └── updaterStore.ts             # Auto-update state
├── utils/
│   ├── audio.ts                    # Web Audio procedural sound engine
│   ├── tauri.ts                    # Tauri API bridge (browser-safe)
│   ├── time.ts                     # Time formatting utilities
│   └── random.ts                   # Random range helpers
├── i18n/
│   ├── zh.ts                       # Chinese (Simplified)
│   ├── en.ts                       # English
│   └── useT.ts                     # Translation hook + interpolation
├── types/
│   └── index.ts                    # Shared TypeScript types
└── App.tsx                         # Root layout + animation orchestrator

src-tauri/src/
├── lib.rs                          # Entry: tray menu + plugins + command handler
├── commands.rs                     # IPC commands (floating, opacity, locked)
└── main.rs                         # Bootstrap

public/
├── floating.html                   # Native floating window content (static HTML)
├── logo.svg                        # App icon
└── favicon.svg                     # Browser tab icon
```

## Key Design Decisions

### Unified Spring Animation (Framer Motion)
All size/position animations during focus entry/exit are driven by a **single `useSpring(progress)`** value. Ring size, font scale, vertical offset, and layout shift are all derived via `useTransform()` from this one source of truth. This eliminates the common "tail flicker" bug where multiple springs fall out of sync.

### Two-Layer Opacity System (Floating Window)
The floating window uses a two-tier transparency model:

1. **Layer 1 (Win32)**: Window-level alpha `[15%, 100%]` — sets the absolute visibility floor
2. **Layer 2 (CSS)**: Per-element fine-tuning in `floating.html`:
   - Container background fades aggressively (ghostly at 0%)
   - Text stays 8–12 percentage points brighter than the frame at all times
   - Glow intensity inversely scales with opacity for legibility

This ensures that even at minimum opacity (~5%), the time digits remain clearly readable while the frame is nearly invisible.

### PWA vs Tauri Conflict Resolution
`vite-plugin-pwa` generates a Service Worker that caches frontend assets in the WebView2 cache. When the exe updates, the old SW serves stale JS/CSS. **Solution**: conditionally load the PWA plugin only in non-Tauri builds (`!isTauri && VitePWA({...})`).

### Win32 Transparent Window Alpha
Tauri 2.11.x does not expose `set_opacity()` on WebviewWindow. The solution uses raw Win32 APIs via the `windows` crate: `SetLayeredWindowAttributes()` with a forced `WS_EX_LAYERED` style via `Get/SetWindowLongPtrW()`. The layered style must be explicitly set — Tauri's `.transparent(true)` does not guarantee it.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

[MIT](LICENSE)

---

<p align="center">
  <sub>Built with <span aria-label="coffee">☕</span> and禅 (zen).</sub>
</p>
