/**
 * rasterize-icons.cjs — Rasterize ZenTimer logo-source.svg into all required sizes
 *
 * Usage:
 *   NODE_PATH=<workspace>/node_modules node rasterize-icons.cjs
 *
 * Requires: sharp
 */

const sharp = require('sharp')
const { readFileSync } = require('fs')
const { join } = require('path')
const { dirname } = require('path')

const ICONS_DIR = __dirname
const SRC_SVG = join(ICONS_DIR, 'logo-source.svg')
const svgBuffer = readFileSync(SRC_SVG)

async function render(size, outputName) {
  const outPath = join(ICONS_DIR, outputName)
  await sharp(svgBuffer)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100, compressionLevel: 9 })
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
  console.log('All PNGs generated.')
}

main().catch(e => { console.error(e); process.exit(1) })
