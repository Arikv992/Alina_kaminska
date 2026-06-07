// Instagram pull (best-effort) — correr no BUILD com sessão autenticada.
// Uso:  IG_STORAGE_STATE=./storageState.json IG_PROFILE=alinakaminskabeautyacademy node pull.mjs
// Requer: npm i playwright   (e um storageState.json com o login do Instagram)
// Verificado conceptualmente em jun/2026; validar ao correr (o DOM do IG muda com frequência).

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const PROFILE = process.env.IG_PROFILE || 'alinakaminskabeautyacademy';
const STATE = process.env.IG_STORAGE_STATE || './storageState.json';
const OUT_IMG = path.resolve('../../assets/instagram');
const OUT_VID = path.resolve('../../assets/instagram/videos');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const REF = 'https://www.instagram.com/';

fs.mkdirSync(OUT_IMG, { recursive: true });
fs.mkdirSync(OUT_VID, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: REF } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${dest}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

const run = async () => {
  const ctx = await chromium.launchPersistentContext('', { headless: false, userAgent: UA }).catch(async () => {
    const b = await chromium.launch({ headless: false });
    return b.newContext({ userAgent: UA, storageState: fs.existsSync(STATE) ? STATE : undefined });
  });
  const page = await ctx.newPage();
  await page.goto(`https://www.instagram.com/${PROFILE}/`, { waitUntil: 'networkidle' });
  await sleep(2500);

  // 1) Scroll robusto até estabilizar o nº de posts
  const seen = new Map();
  const collect = async () => {
    const items = await page.$$eval('a[href*="/p/"], a[href*="/reel/"]', (as) =>
      as.map((a) => {
        const img = a.querySelector('img');
        return {
          href: a.href.split('?')[0],
          thumb: img?.src || '',
          alt: (img?.alt || '').slice(0, 220),
          video: a.href.includes('/reel/'),
        };
      })
    );
    for (const it of items) if (!seen.has(it.href)) seen.set(it.href, it);
  };
  let stable = 0, prev = 0;
  for (let i = 0; i < 60 && stable < 5; i++) {
    await collect();
    await page.evaluate(() => window.scrollBy(0, document.documentElement.clientHeight * 0.9));
    await page.keyboard.press('End').catch(() => {});
    await sleep(1100);
    if (seen.size === prev) stable++; else { stable = 0; prev = seen.size; }
  }
  await collect();
  const all = [...seen.values()];
  console.log(`Posts encontrados: ${all.length} (videos: ${all.filter((a) => a.video).length})`);
  fs.writeFileSync(path.join(OUT_IMG, 'posts.json'), JSON.stringify(all, null, 2));

  // 2) Imagens (thumbnails da grelha; para full-res abrir o /p/)
  let imgN = 0;
  for (const it of all.filter((a) => !a.video && a.thumb)) {
    try { await download(it.thumb, path.join(OUT_IMG, `grid-${++imgN}.jpg`)); } catch (e) { console.warn(e.message); }
  }

  // 3) Vídeos (reels) — extrair mp4 progressivo do HTML de cada reel
  const decode = (s) => s.replaceAll('\\u0026', '&').replaceAll('\\u00253D', '%3D').split('\\/').join('/');
  let vidN = 0;
  for (const it of all.filter((a) => a.video)) {
    try {
      await page.goto(it.href, { waitUntil: 'networkidle' });
      await sleep(2500);
      const url = await page.evaluate(() => {
        const html = document.documentElement.innerHTML;
        const toks = new Set();
        html.split('"').forEach((t) => { if (t.indexOf('.mp4') !== -1 && t.indexOf('http') === 0) toks.add(t); });
        html.split('\\"').forEach((t) => { if (t.indexOf('.mp4') !== -1 && t.indexOf('http') === 0) toks.add(t); });
        const arr = [...toks];
        return arr.find((u) => u.indexOf('progressive') !== -1) || arr[0] || '';
      });
      if (url) {
        const id = it.href.split('/reel/')[1]?.replace(/\//g, '') || `reel-${vidN}`;
        const bytes = await download(decode(url), path.join(OUT_VID, `${id}.mp4`));
        console.log(`vídeo ${++vidN}: ${id}.mp4 (${(bytes / 1e6).toFixed(1)} MB)`);
      }
    } catch (e) { console.warn(`reel falhou ${it.href}: ${e.message}`); }
  }

  console.log('Concluído.');
  await ctx.close();
};

run().catch((e) => { console.error(e); process.exit(1); });
