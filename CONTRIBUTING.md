# Contributing to ZenTimer

Thank you for your interest in contributing! Here's how to get started.

## Development Setup

1. **Clone and install**:
   ```bash
   git clone https://github.com/YiyiChan11/zentimer.git
   cd zentimer
   npm install
   ```

2. **Start dev server**:
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173` with HMR.

3. **Type check before committing**:
   ```bash
   npm run build    # runs tsc + vite build
   ```

## Code Style

- **TypeScript strict mode** — no `any`, prefer explicit types.
- **Components**: Functional components with hooks only (no class components).
- **Styling**: Tailwind utility classes; custom theme variables in `tailwind.config.js`.
- **State**: Zustand stores (`store/`). No Redux/Context for global state.
- **i18n**: All user-facing strings must use `t()` from `useT()`. No hardcoded UI text.
- **Naming**:
  - Components: PascalCase (`CircularTimer.tsx`)
  - Files: kebab-case for non-components, PascalCase for components
  - Stores: camelCase (`timerStore.ts`)

## Commit Messages

Follow conventional commits format:

```
feat: add floating window lock/unlock feature
fix: resolve SessionStats i18n hardcoded Chinese text
docs: update README with architecture section
refactor: simplify opacity mapping logic
```

## Pull Request Process

1. Fork the repository and create a branch from `main`.
2. Make your changes with clear commit messages.
3. Ensure `npm run build` passes without errors.
4. Open a PR with a description of what changed and why.

## Reporting Bugs

When reporting bugs, please include:
- ZenTimer version (shown in Settings → bottom)
- OS and version (e.g., Windows 11)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if relevant

## Feature Requests

We track planned features in the [project memory](.workbuddy/memory/MEMORY.md). Feel free to suggest new ones via Issues!

---

Thank you for making ZenTimer better 🧘
