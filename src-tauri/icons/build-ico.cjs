/**
 * build-ico.cjs — Build Windows .ico from rendered PNGs using png-to-ico
 *
 * Usage:
 *   NODE_PATH=<workspace>/node_modules node build-ico.cjs
 */

const { default: pngToIco, imagesToIco } = require('png-to-ico')
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ICONS_DIR = __dirname
const MASTER = path.join(ICONS_DIR, 'icon.png') // 512×512 master

// All sizes we want in the .ico (Windows standard)
const SIZES = [16, 24, 32, 48, 64, 128, 256]

async function ensureSize(size) {
  const out = path.join(ICONS_DIR, `${size}x${size}.png`)
  if (fs.existsSync(out)) return out
  await sharp(MASTER).resize(size, size, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } }).png().toFile(out)
  console.log(`  Generated ${size}x${size}`)
  return out
}

async function main() {
  console.log('Preparing icon sizes for .ico…')
  const inputs = await Promise.all(SIZES.map(ensureSize))

  const buf = await pngToIco(inputs)
  const outPath = path.join(ICONS_DIR, 'icon.ico')
  fs.writeFileSync(outPath, buf)
  console.log(`OK icon.ico (${inputs.length} sizes)`)
}

main().catch(e => { console.error(e); process.exit(1) })
