# ZenTimer — 禅意番茄钟

> 专注，呼吸，然后继续。

A calm, elegant Pomodoro timer with a tea-ceremony-inspired aesthetic. Built for focus.

## Features

- **Flexible timing** — Fixed duration (5–90 min, 5-min steps) or random range mode
- **Micro breaks** — Optional 15-second buffer break at a random point during focus (drink water, close your eyes)
- **Break cycle** — Automatic rest period after each focus session (default 10 min)
- **Volume control** — Adjustable with test playback; can go very loud
- **Floating window** — Always-on-top mini timer (Document PiP), double-click to return
- **Cross-platform** — Web + PWA (installable on desktop & mobile), Windows & Android planned
- **Keyboard shortcuts** — Space to start/pause, Esc to reset
- **Bilingual** — Chinese / English toggle

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS 3 (custom theme)
- Framer Motion (animations)
- Zustand (state, persisted)
- Web Audio API (procedural sound, zero audio files)
- Document Picture-in-Picture (floating window)
- vite-plugin-pwa

## Getting Started

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
```

## Architecture

```
src/
├── components/   # UI layer (layout / timer / settings / floating / download)
├── hooks/        # useFloatingWindow, useKeyboardShortcuts
├── store/        # timerStore (logic) + settingsStore (persisted)
├── utils/        # audio engine, time formatting, random
├── i18n/         # translations (zh / en)
└── types/        # shared types
```

## License

MIT
