"""Generate Tauri app icons from scratch — ZenTimer logo (circle + enso ring)"""
from PIL import Image, ImageDraw, ImageFilter
import os

ICON_DIR = os.path.join(os.path.dirname(__file__), "..", "src-tauri", "icons")
os.makedirs(ICON_DIR, exist_ok=True)

def create_icon(size: int) -> Image.Image:
    """Create a ZenTimer icon at the given size."""
    # Dark background with rounded corners
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background circle (dark warm)
    margin = size // 10
    radius = (size - 2 * margin) // 2
    cx, cy = size // 2, size // 2

    # Dark base
    draw.ellipse(
        [margin, margin, size - margin, size - margin],
        fill=(26, 24, 22, 255),
    )

    # Outer ring (amber)
    ring_width = max(2, size // 40)
    draw.ellipse(
        [margin, margin, size - margin, size - margin],
        outline=(245, 158, 11, 255),
        width=ring_width,
    )

    # Inner ring (enso-style gap)
    gap_start = 200  # degrees
    gap_end = 250
    # Draw arc for most of the circle, leaving a gap
    arc_width = max(3, size // 25)
    draw.arc(
        [margin + ring_width, margin + ring_width, size - margin - ring_width, size - margin - ring_width],
        start=gap_end,
        end=gap_start + 360,
        fill=(245, 158, 11, 200),
        width=arc_width,
    )

    # Center dot
    dot_radius = max(2, size // 30)
    draw.ellipse(
        [cx - dot_radius, cy - dot_radius, cx + dot_radius, cy + dot_radius],
        fill=(245, 158, 11, 255),
    )

    # Subtle glow
    glow = img.filter(ImageFilter.GaussianBlur(radius=max(1, size // 50)))
    result = Image.alpha_composite(glow, img)

    return result


def create_ico(sizes: list[int], path: str):
    """Create a multi-resolution .ico file."""
    images = [create_icon(s) for s in sizes]
    images[0].save(path, format="ICO", sizes=[(s, s) for s in sizes], append_images=images[1:])


# Generate all required Tauri icons
sizes_png = [32, 128, 256, 512]
for s in sizes_png:
    icon = create_icon(s)
    if s == 32:
        icon.save(os.path.join(ICON_DIR, "32x32.png"))
    elif s == 128:
        icon.save(os.path.join(ICON_DIR, "128x128.png"))
    elif s == 256:
        icon.save(os.path.join(ICON_DIR, "128x128@2x.png"))
    elif s == 512:
        icon.save(os.path.join(ICON_DIR, "icon.png"))

# Generate .ico
create_ico([16, 32, 48, 64, 128, 256], os.path.join(ICON_DIR, "icon.ico"))

# Generate .icns (Tauri needs it for cross-platform, but it's mainly for macOS)
# We'll just copy the PNG as placeholder since we're building for Windows
icon_512 = create_icon(512)
icon_512.save(os.path.join(ICON_DIR, "icon.icns"), format="PNG")  # Placeholder

print("Icons generated successfully:")
for f in os.listdir(ICON_DIR):
    fpath = os.path.join(ICON_DIR, f)
    print(f"  {f} ({os.path.getsize(fpath)} bytes)")
