/**
 * rasterize-icons.cjs — Rasterize ZenTimer logo-source.svg into all required sizes
 *
 * Usage:
 *   NODE_PATH=<workspace>/node_modules node rasterize-icons.cjs
 *
 * Requires: sharp. Then enforces true RGBA (PNG color type 6) via convert-rgba.py,
 * because Tauri's generate_context! strictly rejects palette (color type 3) PNGs
 * even when they contain an alpha channel (sharp reports channels=4 but the raw
 * decoder still sees color type 3).
 */

const sharp = require('sharp')
const { readFileSync, execFileSync } = require('fs')
const { join } = require('path')

const ICONS_DIR = __dirname
const SRC_SVG = join(ICONS_DIR, 'logo-source.svg')
const svgBuffer = readFileSync(SRC_SVG)

async function render(size, outputName) {
  const outPath = join(ICONS_DIR, outputName)
  await sharp(svgBuffer)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()                                   // force an alpha channel
    .png({ quality: 100, compressionLevel: 9, palette: false })  // never quantize to palette
    .toFile(outPath)
  console.log(`  OK ${outputName} (${size}x${size})`)
}

async function main() {
  console.log('Rasterizing Zen Enso icon...')
  await Promise.all([
    render(32,  '32x32.png'),
    render(128, '128x128.png'),
    render(256, '128x128@2x.png'),
    render(512, 'icon.png'),
  ])
  console.log('All PNGs generated. Enforcing true RGBA (color type 6)...')
  // Authoritative RGBA enforcement — Pillow always writes color type 6 for RGBA mode.
  execFileSync(
    process.env.PYTHON_PATH || 'python3',
    [join(ICONS_DIR, 'convert-rgba.py')],
    { stdio: 'inherit' }
  )
}

main().catch(e => { console.error(e); process.exit(1) })
