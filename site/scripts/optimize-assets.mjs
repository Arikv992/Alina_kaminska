import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
const SRC = path.resolve('../assets/instagram');
const OUT = path.resolve('public/ig');
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(SRC)) {
  if (!/\.(jpg|jpeg|png|webp)$/i.test(f)) continue;
  const base = f.replace(/\.[^.]+$/, '');
  await sharp(path.join(SRC, f)).resize(1200, null, { withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(OUT, `${base}.webp`));
}
const VSRC = path.join(SRC, 'videos'); const VOUT = path.join(OUT, 'videos');
fs.mkdirSync(VOUT, { recursive: true });
if (fs.existsSync(VSRC)) for (const v of fs.readdirSync(VSRC)) if (v.endsWith('.mp4')) fs.copyFileSync(path.join(VSRC, v), path.join(VOUT, v));
console.log('assets otimizados');
