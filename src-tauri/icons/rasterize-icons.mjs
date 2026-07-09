/**
 * rasterize-icons.mjs — Rasterize ZenTimer logo-source.svg into all required sizes
 *
 * Usage:
 *   node rasterize-icons.mjs
 *
 * Requires: sharp (npm install sharp in this workspace)
 */

import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
// Script lives in src-tauri/icons/
const ICONS_DIR = __dirname
const SRC_SVG = join(ICONS_DIR, 'logo-source.svg')
const svgBuffer = readFileSync(SRC_SVG)

/** Render one PNG size */
async function render(size, outputName) {
  const outPath = join(ICONS_DIR, outputName)
  await sharp(svgBuffer)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outPath)
  console.log(`  ✓ ${outputName} (${size}×${size})`)
}

console.log('🎨 Rasterizing Zen Enso icon…')

await Promise.all([
  render(32,  '32x32.png'),
  render(128, '128x128.png'),
  render(256, '128x128@2x.png'),   // @2x retina
  render(512, 'icon.png'),          // tray / large icon
])

console.log('✅ All PNGs generated.')
