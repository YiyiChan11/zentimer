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

## 版本号规范 / Versioning Policy

ZenTimer 采用语义化三段式版本号 **`X.Y.Z`**（主版本.次版本.修订号）。版本号同时是自动更新的判断依据（Tauri 比对 Gitee 上的 `latest.json`），请务必谨慎递增。

### 何时递增第三位 Z（修订号 / patch）
适用于**较小的更新**，不改变版本主线：
- 调整 UI 细节（间距、字号、配色、动画手感等）
- 修复小功能 bug
- 新增小的功能点（不改变主流程的小特性）

每次这类更新只递增 Z，X / Y 保持不变。
例如：连续的 UI 微调 `1.10.1 → 1.10.2 → 1.10.3 …`

### 何时递增第二位 Y（次版本号 / minor）
当 **Z 位累积了较多更新、功能集合已足够形成一个新版本线** 时，由维护者判断后将 Y +1、Z 归零：
- 多个小功能 / 修复累计到一个"有感的版本"
- 一次中等规模的功能新增或较大重构

例如：`1.10.9` 经过一批累积后 → `1.11.0`。

### 何时递增第一位 X（主版本号 / major）
**仅在大翻新（架构级、体验级的根本性改变）且经用户明确许可** 时才递增 X。此时 X +1，Y 与 Z 由维护者按需要重置或保留：
- ⚠️ 默认情况下**绝不**主动递增 X。
- 即便递增 X，第二、第三位仍可按上述规则调整。

### 决策原则（维护者）
- 普通小调整一律走 **Z**。
- 累积到"值得作为一个新版本发布"时走 **Y**。
- **X 必须用户点头**，不可自行决定。

### 改版本时必须同步的文件
> 详见项目 `.workbuddy/memory/MEMORY.md`「版本号约定」小节。

- `src-tauri/tauri.conf.json` (`version`)
- `src-tauri/Cargo.toml` (`version`)
- `src-tauri/Cargo.lock` 中 `name = "zentimer"` 那条的 `version`（勿误改第三方 crate）
- `src/i18n/{zh,en}.ts` (`version` 串)
- `src/components/download/DownloadPage.tsx`（下载按钮 exe URL）
- `gitee-release/publish.ps1` (`$version` / `$installerUrl`)
- `gitee-release/latest.json` (`version` / `url`)
- `CHANGELOG.md`（顶部条目 + 底部 compare 链接）
- `USAGE.md`（文档版本号声明）

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
