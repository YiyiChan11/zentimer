#!/bin/bash
# ──────────────────────────────────────────────
# generate-update-manifest.sh
# Reads .sig files from Tauri build output and
# generates latest.json for the updater endpoint
# ──────────────────────────────────────────────

VERSION="1.0.0"
DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
NOTES="ZenTimer v${VERSION} — 禅意番茄钟首个发布版本"

BUNDLE_DIR="src-tauri/target/release/bundle"
NSIS_SIG=$(cat "${BUNDLE_DIR}/nsis/ZenTimer_${VERSION}_x64-setup.exe.sig" 2>/dev/null || echo "")

if [ -z "$NSIS_SIG" ]; then
  echo "ERROR: NSIS signature not found."
  echo "Run 'npx tauri build' with TAURI_SIGNING_PRIVATE_KEY set first."
  exit 1
fi

GITHUB_BASE="https://github.com/YiyiChan11/zentimer/releases/download/v${VERSION}"

cat > "${BUNDLE_DIR}/latest.json" << EOF
{
  "version": "${VERSION}",
  "notes": "${NOTES}",
  "pub_date": "${DATE}",
  "platforms": {
    "windows-x86_64": {
      "signature": "${NSIS_SIG}",
      "url": "${GITHUB_BASE}/ZenTimer_${VERSION}_x64-setup.exe"
    }
  }
}
EOF

echo "Generated: ${BUNDLE_DIR}/latest.json"
echo ""
echo "Contents:"
cat "${BUNDLE_DIR}/latest.json"
echo ""
echo ""
echo "Next steps:"
echo "1. Create a GitHub Release with tag v${VERSION}"
echo "2. Upload these 3 files as release assets:"
echo "   - ${BUNDLE_DIR}/nsis/ZenTimer_${VERSION}_x64-setup.exe"
echo "   - ${BUNDLE_DIR}/nsis/ZenTimer_${VERSION}_x64-setup.exe.sig"
echo "   - ${BUNDLE_DIR}/latest.json"
echo "3. The app will auto-check this release for updates"
