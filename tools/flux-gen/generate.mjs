// Geração de imagens de herói com FLUX 1.1 Pro Ultra (Black Forest Labs).
// Uso:
//   BFL_API_KEY=xxxxx node tools/flux-gen/generate.mjs
// (ou define BFL_API_KEY em site/.env.local e corre via o site — ver README)
//
// A key NUNCA é guardada no repo/notas (regra do utilizador). Lê-se de env.
// Endpoint async: POST cria o pedido → devolve polling_url → poll até "Ready" → download.

import fs from 'node:fs';
import path from 'node:path';

// Lê a key do ambiente OU de site/.env.local (gitignored). Nunca do repo/notas.
function loadKey() {
  if (process.env.BFL_API_KEY) return process.env.BFL_API_KEY;
  const envPath = path.resolve(process.cwd(), 'site/.env.local');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^\s*BFL_API_KEY\s*=\s*(.+?)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, '');
    }
  }
  return '';
}

const KEY = loadKey();
if (!KEY) {
  console.error('Falta BFL_API_KEY. Põe-a em site/.env.local (BFL_API_KEY=...) ou no ambiente.');
  process.exit(1);
}

const OUT = path.resolve(process.cwd(), 'site/public/generated');
fs.mkdirSync(OUT, { recursive: true });

const ENDPOINT = 'https://api.bfl.ai/v1/flux-pro-1.1-ultra';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Prompts de herói — estética premium, paleta dourado/creme/nude da marca.
const JOBS = [
  {
    name: 'hero-manicura',
    prompt:
      'Ultra-detailed editorial beauty photograph, extreme close-up of elegant manicured female hands with flawless nude-pink glossy nails, delicate gold jewelry, resting gracefully, soft warm cream and champagne-gold tones, luxurious spa atmosphere, gentle diffused window light, shallow depth of field, fine skin texture, high-end magazine aesthetic, photorealistic, no text.',
  },
  {
    name: 'hero-pestanas',
    prompt:
      'Ultra-detailed macro beauty photograph of a serene woman’s eye with perfect long voluminous lash extensions and softly groomed eyebrows, luminous glowing skin, warm cream and golden tones, elegant and calm, professional studio softbox lighting, shallow depth of field, photorealistic editorial style, no text.',
  },
  {
    name: 'hero-salon',
    prompt:
      'Refined luxury beauty salon interior, warm cream walls with subtle gold accents, marble counter, soft ambient golden lighting, elegant minimalist decor, fresh white orchids, inviting and sophisticated, wide cinematic composition, photorealistic architectural interior photography, no people, no text.',
  },
];

async function generateOne(job) {
  console.log(`→ a pedir: ${job.name}`);
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'x-key': KEY, 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      prompt: job.prompt,
      aspect_ratio: '16:9',
      output_format: 'jpeg',
      safety_tolerance: 2,
      raw: false,
    }),
  });
  if (!res.ok) throw new Error(`POST ${res.status}: ${await res.text()}`);
  const { polling_url } = await res.json();
  if (!polling_url) throw new Error('sem polling_url na resposta');

  // poll
  for (let i = 0; i < 60; i++) {
    await sleep(2000);
    const p = await fetch(polling_url, { headers: { 'x-key': KEY, accept: 'application/json' } });
    const data = await p.json();
    const status = data.status;
    if (status === 'Ready') {
      const url = data.result?.sample;
      if (!url) throw new Error('Ready mas sem result.sample');
      const img = await fetch(url);
      const buf = Buffer.from(await img.arrayBuffer());
      const dest = path.join(OUT, `${job.name}.jpg`);
      fs.writeFileSync(dest, buf);
      console.log(`✓ ${job.name} → ${dest} (${(buf.length / 1e6).toFixed(2)} MB)`);
      return dest;
    }
    if (status === 'Error' || status === 'Content Moderated' || status === 'Request Moderated') {
      throw new Error(`status=${status}: ${JSON.stringify(data)}`);
    }
    // Pending → continua
  }
  throw new Error('timeout à espera do resultado');
}

for (const job of JOBS) {
  try {
    await generateOne(job);
  } catch (e) {
    console.error(`✗ ${job.name}: ${e.message}`);
  }
}
console.log('Concluído. Imagens em site/public/generated/');
