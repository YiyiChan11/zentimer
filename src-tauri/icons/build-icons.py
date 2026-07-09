#!/usr/bin/env python3
"""build-icons.py — Build multi-size .ico and .icns from rendered PNGs.

Usage:
    python build-icons.py

Requires: Pillow (pip install pillow)
"""

import os
from PIL import Image

ICONS_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Build Windows .ico (multi-resolution) ──────────────────────────
sizes_ico = [(16,16), (24,24), (32,32), (48,48), (64,64), (128,128), (256,256)]
images = []
for w, h in sizes_ico:
    src_name = "icon.png" if h >= 128 else ("128x128.png" if h >= 64 else "32x32.png")
    src_path = os.path.join(ICONS_DIR, src_name)
    img = Image.open(src_path).convert("RGBA").resize((w, h), Image.LANCZOS)
    images.append(img)

ico_path = os.path.join(ICONS_DIR, "icon.ico")
images[0].save(
    ico_path,
    format="ICO",
    sizes=[(w, h) for w, h in sizes_ico],
    append_images=images[1:],
)
print(f"OK {ico_path} ({len(sizes_ico)} sizes)")

# ── Build macOS .icns ─────────────────────────────────────────────
try:
    # icns needs specific sizes; Pillow writes basic icns
    icns_sizes = [(16,16),(32,32),(128,128),(256,256),(512,512),(1024,1024)]
    icns_images = []
    for w, h in icns_sizes:
        src = "icon.png"
        img = Image.open(os.path.join(ICONS_DIR, src)).convert("RGBA").resize((w, h), Image.LANCZOS)
        icns_images.append(img)

    icns_path = os.path.join(ICONS_DIR, "icon.icns")
    icns_images[0].save(icns_path, format="ICNS", append_images=icns_images[1:])
    print(f"OK {icns_path}")
except Exception as e:
    print(f"WARN icns generation skipped ({e}) — not needed for Windows builds")

print("Done.")
