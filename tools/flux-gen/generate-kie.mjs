// Geração de imagens de herói com FLUX 2 (Pro Text-to-Image) via kie.ai.
// Uso:  node tools/flux-gen/generate-kie.mjs   (lê KIE_API_KEY de env ou site/.env.local)
// A key NUNCA fica no repo/notas (regra do utilizador). Só em site/.env.local (gitignored) ou env.
//
// API kie.ai:
//   POST https://api.kie.ai/api/v1/jobs/createTask  (Bearer) → data.taskId
//   GET  https://api.kie.ai/api/v1/jobs/recordInfo?taskId=...  (Bearer) → data.state + data.resultJson

import fs from 'node:fs';
import path from 'node:path';

function loadKey() {
  if (process.env.KIE_API_KEY) return process.env.KIE_API_KEY;
  const envPath = path.resolve(process.cwd(), 'site/.env.local');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^\s*KIE_API_KEY\s*=\s*(.+?)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, '');
    }
  }
  return '';
}

const KEY = loadKey();
if (!KEY) {
  console.error('Falta KIE_API_KEY. Põe-a em site/.env.local (KIE_API_KEY=...) ou no ambiente.');
  process.exit(1);
}

const OUT = path.resolve(process.cwd(), 'site/public/generated');
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const auth = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', accept: 'application/json' };

const JOBS = [
  {
    name: 'hero-manicura',
    prompt:
      'Editorial beauty photograph for a premium spa brand. Extreme close-up of the hands of a woman in her early thirties with fair-to-olive Mediterranean skin, resting one relaxed hand over the other on a matte ivory linen surface. Freshly done glossy nude manicure, almond-shaped nails with a warm champagne sheen, a single slim brushed-gold ring and a fine gold chain bracelet catching one soft highlight. Late-morning side window light raking across the skin at a low angle, warm 3200K, soft shadow fill bouncing off cream walls. Medium format camera, 80mm lens at f/2.8, focus plane on the knuckles and ring, background falling to creamy bokeh. Shot on Kodak Portra 400, gentle warm tonality, fine organic film grain, faint subsurface skin translucency, a few realistic skin pores and one tiny natural cuticle imperfection, subtle micro chromatic aberration on the brightest highlight. Locked palette: warm ivory #fff3e3, champagne gold #ca9737, soft blush nude, charcoal shadow #2b2622. Wide horizontal frame, hands composed in the lower-left third with generous calm negative space on the right for a headline overlay. No text, no logos, no watermark, no signage, no extra fingers, no plastic over-smoothed skin, no HDR glow, no stock-photo gloss.',
  },
  {
    name: 'hero-pestanas',
    prompt:
      'Editorial macro beauty photograph for a luxury lash and brow studio. Serene close-up of a single eye of a woman in her late twenties with luminous warm-toned skin, gaze cast gently downward and to the side, never to camera. Flawless natural lash extensions, individually separated, slight wispy taper at the outer corner; softly laminated brow with single hairs visible and groomed. Real skin texture with faint freckles across the lid, soft sheen on the eyelid, the inner corner catching a warm specular highlight. Soft directional light from a large window at 4pm, golden 3400K, single catchlight in the iris. Medium format, 120mm macro lens at f/4, ultra-shallow focus on the lash line, the brow falling slightly soft. Shot on Fuji Pro 400H, warm honeyed tonality, fine film grain, micro pore detail, subtle chromatic aberration at the lash tips. Locked palette: warm ivory #fff3e3, champagne gold #ca9737, soft blush nude, deep charcoal #2b2622. Tight horizontal frame, eye placed off-center left on the rule-of-thirds with breathing room to the right. No text, no logos, no watermark, no harsh studio catchlights, no symmetrical eye-to-camera pose, no airbrushed plastic skin, no HDR, no lens flare.',
  },
  {
    name: 'hero-salon',
    prompt:
      'Architectural interior photograph for a premium beauty academy in Torrevieja, Spain, no people. A refined treatment room with warm cream lime-plaster walls, a honed cream-and-gold veined marble vanity counter, slim brushed-brass fixtures and a single arched mirror with a thin gold frame. Soft late-afternoon Mediterranean amber light entering from a tall window on the left, raking warmly across the plaster and pooling on the marble, gentle long shadows, cool fill from the opposite wall. A low ceramic vessel of pale orchids and a folded ivory linen towel as quiet styling. Shot on a large-format field camera, 35mm tilt-shift lens at f/5.6, perfectly vertical lines, deep but soft focus, foreground counter sharp, far wall gently soft. Cinestill 50D tonality, warm cinematic grade, fine film grain, faint dust mote in the light beam, subtle reflection falloff on the marble. Locked palette: warm ivory #fff3e3, champagne gold #ca9737, soft blush #dead4a, charcoal #2b2622. Wide cinematic horizontal composition with the window light and counter weighted left, calm negative space on the right third for a headline overlay. No text, no logos, no watermark, no signage, no people, no oversaturated colour, no HDR glow, no fisheye distortion.',
  },
];

async function createTask(job) {
  const res = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      model: 'flux-2/pro-text-to-image',
      input: { prompt: job.prompt, aspect_ratio: '16:9', resolution: '2K', nsfw_checker: false },
    }),
  });
  const json = await res.json();
  if (!res.ok || (json.code && json.code !== 200)) throw new Error(`createTask: ${res.status} ${JSON.stringify(json)}`);
  const taskId = json.data?.taskId || json.taskId || json.data?.task_id;
  if (!taskId) throw new Error(`sem taskId: ${JSON.stringify(json)}`);
  return taskId;
}

async function pollTask(taskId) {
  for (let i = 0; i < 90; i++) {
    await sleep(2500);
    const res = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`, { headers: auth });
    const json = await res.json();
    const state = json.data?.state;
    if (state === 'success') {
      const result = JSON.parse(json.data.resultJson || '{}');
      const url = result.resultUrls?.[0];
      if (!url) throw new Error(`success sem resultUrls: ${json.data.resultJson}`);
      return url;
    }
    if (state === 'fail') throw new Error(`fail: ${json.data?.failMsg || JSON.stringify(json.data)}`);
    // waiting/queuing/generating → continua
  }
  throw new Error('timeout à espera do resultado');
}

for (const job of JOBS) {
  try {
    console.log(`→ ${job.name}: a criar tarefa...`);
    const taskId = await createTask(job);
    console.log(`  taskId=${taskId} — a aguardar...`);
    const url = await pollTask(taskId);
    const img = await fetch(url);
    const buf = Buffer.from(await img.arrayBuffer());
    const dest = path.join(OUT, `${job.name}.jpg`);
    fs.writeFileSync(dest, buf);
    console.log(`✓ ${job.name} → ${dest} (${(buf.length / 1e6).toFixed(2)} MB)`);
  } catch (e) {
    console.error(`✗ ${job.name}: ${e.message}`);
  }
}
console.log('Concluído. Imagens em site/public/generated/');
