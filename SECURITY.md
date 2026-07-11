# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| < 1.1   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in ZenTimer, please **do not open a public issue**.

Instead, email the maintainer privately at:
- GitHub: `@YiyiChan11` (via [GitHub Security Advisories](https://github.com/YiyiChan11/zentimer/security/advisories/new))

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Known Security Considerations

### Tauri Signing Keys
- The updater signing private key (`src-tauri/tauri.key`) is **gitignored** and never committed.
- The key is encrypted with a user-chosen password and stored locally only.
- The password is entered interactively during release builds via secure prompt.

### Gitee Update Endpoint
- Auto-update downloads are served from `gitee.com/yiyichan/zentimer-update`.
- Releases are signed with minisign to prevent tampering.
- The public key is embedded in `tauri.conf.json`.

## Dependency Security

We use `npm audit` to monitor dependency vulnerabilities. Critical/high severity issues are addressed promptly.
