# Montra Animada (Fase A) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o site-montra animado (scroll-driven, multilíngue ES/EN/PL/IT) da Alina Kaminska Beauty Academy em Next.js + anime.js v4, com captação de lead e CTA de marcação provisório, pronto para preview Vercel.

**Architecture:** App Next.js 15 (App Router) no diretório `site/`, i18n por rota (`/[locale]`) com next-intl, animações anime.js v4 encapsuladas num hook React (`createScope` + `onScroll`), conteúdo em secções one-page, captação de lead via route handler → Brevo. Marca e assets reais já recolhidos em `assets/`.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, anime.js v4, next-intl, sharp (otimização de imagem), Brevo API. Deploy Vercel.

---

## Convenções
- Trabalhar dentro de `site/` (novo projeto, git próprio).
- Commits frequentes, mensagens `feat:/chore:/test:`.
- ES é o idioma original; EN/PL/IT traduzidos (rascunho gerado, marcar `// review native`).
- Assets de origem em `../assets/` (copiar otimizados para `site/public/`).
- Skill de referência do anime.js: `.agents/skills/animejs/` (SKILL.md + references).

## File Structure (mapa)
```
site/
  package.json, next.config.ts, tailwind.config.ts, tsconfig.json
  src/
    i18n/routing.ts            # locales + routing next-intl
    i18n/request.ts            # carregamento de mensagens
    middleware.ts              # i18n middleware
    app/[locale]/layout.tsx    # html, fontes, metadata base
    app/[locale]/page.tsx      # one-page: monta as secções
    app/api/lead/route.ts      # POST lead → Brevo
    components/anim/useReveal.ts        # hook anime.js (scope + onScroll)
    components/anim/Reveal.tsx          # wrapper declarativo
    components/sections/Hero.tsx
    components/sections/Servicios.tsx
    components/sections/Academia.tsx
    components/sections/Galeria.tsx
    components/sections/Historia.tsx
    components/sections/Testimonios.tsx
    components/sections/Contacto.tsx
    components/ui/LanguageSwitcher.tsx
    components/ui/Footer.tsx
    lib/brevo.ts               # cliente Brevo
    lib/services.ts            # dados dos serviços (catálogo)
    lib/seo.ts                 # LocalBusiness JSON-LD
  messages/{es,en,pl,it}.json
  public/brand/logo.svg
  public/ig/*                  # imagens/vídeos otimizados
  .env.local.example
```

---

### Task 1: Scaffold do projeto Next.js

**Files:** Create `site/` (via CLI)

- [ ] **Step 1: Criar o app**

Run:
```bash
cd /Users/ariclenismanuel/Documents/Alinakademis
npx create-next-app@latest site --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack --use-npm
```
Expected: projeto criado em `site/`.

- [ ] **Step 2: Instalar dependências**

Run:
```bash
cd site && npm i animejs next-intl && npm i -D sharp @types/node
```
Expected: sem erros.

- [ ] **Step 3: Verificar build base**

Run: `cd site && npm run build`
Expected: build PASS.

- [ ] **Step 4: Init git + commit**

```bash
cd site && git init && git add -A && git commit -m "chore: scaffold next.js app"
```

---

### Task 2: i18n com next-intl (ES/EN/PL/IT)

**Files:**
- Create: `site/src/i18n/routing.ts`, `site/src/i18n/request.ts`, `site/src/middleware.ts`
- Create: `site/messages/{es,en,pl,it}.json`
- Modify: `site/next.config.ts`

- [ ] **Step 1: Routing**

`site/src/i18n/routing.ts`:
```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en', 'pl', 'it'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
});
```

- [ ] **Step 2: Request config**

`site/src/i18n/request.ts`:
```ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) locale = routing.defaultLocale;
  return { locale, messages: (await import(`../../messages/${locale}.json`)).default };
});
```

- [ ] **Step 3: Middleware**

`site/src/middleware.ts`:
```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);
export const config = { matcher: ['/', '/(es|en|pl|it)/:path*', '/((?!_next|api|.*\\..*).*)'] };
```

- [ ] **Step 4: next.config plugin**

`site/next.config.ts`:
```ts
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl({ images: { remotePatterns: [] } });
```

- [ ] **Step 5: Mensagens (ES original)**

`site/messages/es.json` (chaves base; EN/PL/IT copiam a estrutura e traduzem, a partir de `assets/instagram/CONTENIDO-Y-COPY.md` e `00-PESQUISA-E-ARQUITETURA.md`):
```json
{
  "nav": { "servicios": "Servicios", "academia": "Academia", "galeria": "Resultados", "historia": "Historia", "contacto": "Contacto", "reservar": "Reservar" },
  "hero": { "title": "Redefina su experiencia en belleza", "subtitle": "Estética y formación de alto nivel", "cta": "Reservar cita" },
  "servicios": { "title": "Servicios", "lead": "Belleza con criterio. Armonía en cada detalle." },
  "academia": { "title": "Academia", "lead": "Formación que eleva tu talento", "cta": "Quiero formarme" },
  "galeria": { "title": "Resultados" },
  "historia": { "title": "Nuestra historia", "body": "Nuestra historia comienza con la pasión de Alina Kaminska por el estilismo profesional y la enseñanza." },
  "contacto": { "title": "Reserva tu cita", "address": "Av. Dr. Gregorio Marañón 7/8, Torrevieja", "hours": "Lun–Vie 9:30–17:00", "whatsapp": "Escríbenos por WhatsApp", "form_name": "Nombre", "form_contact": "Email o teléfono", "form_service": "Servicio de interés", "form_submit": "Solicitar cita", "form_ok": "¡Gracias! Te contactaremos muy pronto." }
}
```
Criar `en.json`, `pl.json`, `it.json` com a mesma estrutura traduzida (marcar `// review native`).

- [ ] **Step 6: Build + commit**

Run: `cd site && npm run build`
Expected: PASS.
```bash
git add -A && git commit -m "feat: next-intl i18n (es/en/pl/it)"
```

---

### Task 3: Tokens de marca (paleta + fontes)

**Files:**
- Modify: `site/tailwind.config.ts`, `site/src/app/[locale]/layout.tsx`
- Create: `site/public/brand/logo.svg` (copiar de `assets/brand/logo.svg`)

- [ ] **Step 1: Extrair hex do logo**

Run: `grep -oiE '#[0-9a-f]{6}' /Users/ariclenismanuel/Documents/Alinakademis/assets/brand/logo.svg | sort -u`
Anotar os dourados reais. Fallback se vazio: dourado `#C8A24B`, creme `#F7F1E7`, nude `#E7D3C4`, carvão `#2B2622`.

- [ ] **Step 2: Tailwind tokens**

`site/tailwind.config.ts` → estender `theme.colors`:
```ts
extend: {
  colors: {
    oro: '#C8A24B', crema: '#F7F1E7', nude: '#E7D3C4', carbon: '#2B2622',
  },
  fontFamily: { display: ['var(--font-display)'], sans: ['var(--font-sans)'] },
}
```

- [ ] **Step 3: Fontes (next/font)**

Em `layout.tsx`: importar `Cormorant_Garamond` (display) e `Manrope` (sans) de `next/font/google`, expor como CSS vars `--font-display`/`--font-sans`. Fundo `crema`, texto `carbon`.

- [ ] **Step 4: Copiar logo**

Run: `mkdir -p site/public/brand && cp ../assets/brand/logo.svg site/public/brand/logo.svg`

- [ ] **Step 5: Build + commit**

`npm run build` → PASS. `git commit -m "feat: brand tokens (palette + fonts + logo)"`

---

### Task 4: Otimização de assets (imagens + vídeos)

**Files:** Create `site/scripts/optimize-assets.mjs`, output em `site/public/ig/`

- [ ] **Step 1: Script de otimização**

`site/scripts/optimize-assets.mjs`:
```js
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
// vídeos: copiar mp4 tal como estão
const VSRC = path.join(SRC, 'videos'); const VOUT = path.join(OUT, 'videos');
fs.mkdirSync(VOUT, { recursive: true });
if (fs.existsSync(VSRC)) for (const v of fs.readdirSync(VSRC)) if (v.endsWith('.mp4')) fs.copyFileSync(path.join(VSRC, v), path.join(VOUT, v));
console.log('assets otimizados');
```

- [ ] **Step 2: Correr**

Run: `cd site && node scripts/optimize-assets.mjs`
Expected: `public/ig/*.webp` + `public/ig/videos/*.mp4` criados.

- [ ] **Step 3: Commit**

`git add -A && git commit -m "chore: optimize ig assets to webp"`

---

### Task 5: Hook de animação anime.js (núcleo reutilizável)

**Files:** Create `site/src/components/anim/useReveal.ts`, `site/src/components/anim/Reveal.tsx`

- [ ] **Step 1: Hook scope + reveal ao scroll**

`site/src/components/anim/useReveal.ts` (usa `createScope`, `animate`, `stagger`, `onScroll` — ver `.agents/skills/animejs/SKILL.md`):
```ts
'use client';
import { useEffect, useRef } from 'react';
import { animate, stagger, onScroll, createScope } from 'animejs';

export function useReveal() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scope = createScope({ root: root.current! }).add(() => {
      if (reduce) return; // respeita acessibilidade
      animate('[data-reveal]', {
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 800,
        ease: 'outQuad',
        delay: stagger(90),
        autoplay: onScroll({ target: root.current!, enter: 'bottom-=10% top', sync: false }),
      });
    });
    return () => scope.revert();
  }, []);
  return root;
}
```

- [ ] **Step 2: Wrapper declarativo**

`site/src/components/anim/Reveal.tsx`:
```tsx
'use client';
import { useReveal } from './useReveal';
export default function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const root = useReveal();
  return <div ref={root} className={className}>{children}</div>;
}
```

- [ ] **Step 3: Build + commit**

`npm run build` → PASS. `git commit -m "feat: anime.js reveal hook (scroll + reduced-motion)"`

---

### Task 6: Secção Hero (logo a desenhar-se + headline por palavra + CTA)

**Files:** Create `site/src/components/sections/Hero.tsx`; Modify `app/[locale]/page.tsx`

- [ ] **Step 1: Componente Hero**

`Hero.tsx` (cliente): fundo com vídeo `public/ig/videos/*.mp4` (muted/loop/playsinline) + overlay crema translúcido; logo SVG inline animado com `createDrawable` na entrada; headline com `splitText` (reveal por palavra via timeline); subtítulo; botão CTA "Reservar" (scroll para #contacto). Respeitar `prefers-reduced-motion` (mostrar estático). Usar `useTranslations('hero')`.

- [ ] **Step 2: Montar na página**

`app/[locale]/page.tsx`: importar e renderizar `<Hero/>` no topo, dentro de `NextIntlClientProvider` se necessário (layout já fornece).

- [ ] **Step 3: Verificação visual**

Run: `cd site && npm run dev` → abrir `http://localhost:3000/es` → confirmar logo anima, headline revela, vídeo de fundo corre, CTA faz scroll.

- [ ] **Step 4: Commit**

`git commit -m "feat: hero section (logo draw + split headline + cta)"`

---

### Task 7: Secção Servicios (catálogo completo, stagger ao scroll)

**Files:** Create `site/src/lib/services.ts`, `site/src/components/sections/Servicios.tsx`

- [ ] **Step 1: Dados do catálogo**

`lib/services.ts` — catálogo confirmado pelo IG (⚠️ preços a confirmar; deixar `price: null`):
```ts
export const services = [
  { key: 'manicura', img: '/ig/11-lujo-detalles-manicura.webp' },
  { key: 'pestanas', img: '/ig/01-kurs-uv-light-lashes.webp' },
  { key: 'cejas', img: '/ig/09-belleza-criterio.webp' },
  { key: 'pedicura', img: '/ig/10-pedicura-elegancia.webp' },
  { key: 'cabello', img: '/ig/06-extensiones-cabello.webp' },
  { key: 'coloracion', img: '/ig/12-blondie-coloracion.webp' },
  { key: 'piel', img: '/ig/07-exfoliacion-azucar.webp' },
] as const;
```
Adicionar nomes de cada `key` aos 4 messages.json (secção `servicios.items`).

- [ ] **Step 2: Componente**

`Servicios.tsx`: grelha responsiva de cards (imagem next/image + nome + preço se houver), envolvida em `<Reveal>` para stagger ao scroll; cada card com `data-reveal`. Parallax suave opcional na imagem.

- [ ] **Step 3: Verificação + commit**

`npm run dev` → confirmar 7 serviços com reveal escalonado. `git commit -m "feat: servicios section (full catalog, scroll stagger)"`

---

### Task 8: Secção Academia

**Files:** Create `site/src/components/sections/Academia.tsx`

- [ ] **Step 1: Componente**

`Academia.tsx`: bloco editorial "Formación que eleva tu talento" + 3 cursos certificados (manicura, pestañas, cejas) + gancho "curso online (próximamente)" + CTA "Quiero formarme" (→ #contacto). Imagens `04-formacion-manicure.webp`, `05-certificacion-cursos.webp`. `<Reveal>` + `useTranslations('academia')`.

- [ ] **Step 2: Verificação + commit**

`npm run dev` → ok. `git commit -m "feat: academia section"`

---

### Task 9: Secção Galería (prova social IG + vídeo)

**Files:** Create `site/src/components/sections/Galeria.tsx`

- [ ] **Step 1: Componente**

`Galeria.tsx`: grelha tipo masonry com as imagens de `public/ig/*.webp` + um card de vídeo (mp4 de `public/ig/videos`) com play. Lightbox simples opcional. `<Reveal>` com stagger por item (`from: 'center'`).

- [ ] **Step 2: Verificação + commit**

`npm run dev` → grelha anima. `git commit -m "feat: galeria (social proof + video)"`

---

### Task 10: Secção Historia (timeline animada)

**Files:** Create `site/src/components/sections/Historia.tsx`

- [ ] **Step 1: Componente**

`Historia.tsx`: narrativa da Alina (14+ anos), timeline vertical com marcos; cada marco `data-reveal`; linha SVG desenhada com `createDrawable` ligada a `onScroll(sync:true)`. Texto de `historia` nos messages.

- [ ] **Step 2: Verificação + commit**

`npm run dev` → linha desenha ao scroll. `git commit -m "feat: historia timeline"`

---

### Task 11: Lead capture API + Brevo (TDD)

**Files:** Create `site/src/lib/brevo.ts`, `site/src/app/api/lead/route.ts`, `site/src/lib/__tests__/brevo.test.ts`; Modify `package.json` (vitest)

- [ ] **Step 1: Instalar vitest**

Run: `cd site && npm i -D vitest` e adicionar script `"test": "vitest run"`.

- [ ] **Step 2: Escrever teste que falha**

`site/src/lib/__tests__/brevo.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest';
import { buildContactPayload } from '../brevo';

describe('buildContactPayload', () => {
  it('mapeia lead para formato Brevo com lista e atributos', () => {
    const p = buildContactPayload({ name: 'Ana', contact: 'ana@x.com', service: 'manicura', locale: 'es' }, 7);
    expect(p.email).toBe('ana@x.com');
    expect(p.listIds).toContain(7);
    expect(p.attributes.NOMBRE).toBe('Ana');
    expect(p.attributes.IDIOMA).toBe('es');
    expect(p.attributes.SERVICIO).toBe('manicura');
  });
  it('usa telefone como SMS quando o contacto não é email', () => {
    const p = buildContactPayload({ name: 'Ana', contact: '+34600111222', service: 'cejas', locale: 'pl' }, 7);
    expect(p.email).toBeUndefined();
    expect(p.attributes.SMS).toBe('+34600111222');
  });
});
```

- [ ] **Step 3: Correr → falha**

Run: `cd site && npm test`
Expected: FAIL (`buildContactPayload` não existe).

- [ ] **Step 4: Implementar**

`site/src/lib/brevo.ts`:
```ts
export type Lead = { name: string; contact: string; service: string; locale: string };

export function buildContactPayload(lead: Lead, listId: number) {
  const isEmail = lead.contact.includes('@');
  const attributes: Record<string, string> = { NOMBRE: lead.name, IDIOMA: lead.locale, SERVICIO: lead.service };
  if (!isEmail) attributes.SMS = lead.contact;
  return { email: isEmail ? lead.contact : undefined, listIds: [listId], attributes, updateEnabled: true };
}

export async function createBrevoContact(lead: Lead) {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID || 0);
  if (!apiKey) throw new Error('BREVO_API_KEY missing');
  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(buildContactPayload(lead, listId)),
  });
  if (!res.ok && res.status !== 204) {
    const t = await res.text();
    if (!t.includes('duplicate_parameter')) throw new Error(`Brevo ${res.status}: ${t}`);
  }
  return true;
}
```

- [ ] **Step 5: Correr → passa**

Run: `cd site && npm test`
Expected: PASS.

- [ ] **Step 6: Route handler**

`site/src/app/api/lead/route.ts`:
```ts
import { NextResponse } from 'next/server';
import { createBrevoContact, type Lead } from '@/lib/brevo';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Lead>;
    if (!body.name || !body.contact) return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 });
    await createBrevoContact({ name: body.name, contact: body.contact, service: body.service || '', locale: body.locale || 'es' });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
```

- [ ] **Step 7: .env example + commit**

`site/.env.local.example`:
```
BREVO_API_KEY=
BREVO_LIST_ID=
NEXT_PUBLIC_WHATSAPP=34603243621
BFL_API_KEY=
```
`git add -A && git commit -m "feat: lead capture api + brevo (tdd)"`

---

### Task 12: Secção Contacto (form + WhatsApp + JSON-LD)

**Files:** Create `site/src/components/sections/Contacto.tsx`, `site/src/lib/seo.ts`

- [ ] **Step 1: Form**

`Contacto.tsx`: formulário (nome, contacto, serviço) que faz `POST /api/lead` e mostra `form_ok`; botão WhatsApp `https://wa.me/${NEXT_PUBLIC_WHATSAPP}`; morada + horário + mapa (iframe estático). `useTranslations('contacto')`.

- [ ] **Step 2: JSON-LD LocalBusiness**

`lib/seo.ts`: função `localBusinessJsonLd()` (nome, morada Torrevieja, geo, horário Lun-Vie 9:30-17:00, telefone, sameAs IG/FB). Injetar `<script type="application/ld+json">` no `layout.tsx`.

- [ ] **Step 3: Teste manual do form**

`npm run dev` → submeter form com `BREVO_API_KEY` de teste → confirmar contacto no Brevo. Sem chave: confirmar erro 500 tratado e UI não quebra.

- [ ] **Step 4: Commit**

`git commit -m "feat: contacto form + localbusiness jsonld"`

---

### Task 13: Footer + seletor de idioma + nav

**Files:** Create `site/src/components/ui/Footer.tsx`, `site/src/components/ui/LanguageSwitcher.tsx`; Modify `layout.tsx`

- [ ] **Step 1: LanguageSwitcher**

`LanguageSwitcher.tsx`: usa `useRouter`/`usePathname` de `next-intl/navigation` para trocar locale mantendo a rota.

- [ ] **Step 2: Footer + nav**

`Footer.tsx`: selo Kit Digital (`assets/instagram` ou recriar), links IG/FB, seletor de idioma, morada. Header fixo com nav âncora (Servicios/Academia/Resultados/Historia/Contacto) + botão Reservar.

- [ ] **Step 3: Commit**

`npm run build` → PASS. `git commit -m "feat: footer, nav, language switcher"`

---

### Task 14: SEO, metadata, sitemap, hreflang

**Files:** Modify `layout.tsx`; Create `site/src/app/sitemap.ts`, `site/src/app/robots.ts`

- [ ] **Step 1: Metadata por locale**

`layout.tsx` `generateMetadata`: title/description por idioma (dos messages), OpenGraph (imagem hero), `alternates.languages` (hreflang es/en/pl/it).

- [ ] **Step 2: sitemap + robots**

`sitemap.ts` lista as 4 rotas localizadas; `robots.ts` permite tudo + aponta sitemap.

- [ ] **Step 3: Commit**

`npm run build` → PASS. `git commit -m "feat: seo metadata, sitemap, hreflang"`

---

### Task 15: Passe de acessibilidade + performance

**Files:** vários (ajustes)

- [ ] **Step 1: Reduced-motion global**

Confirmar que TODAS as animações verificam `prefers-reduced-motion` (o hook já o faz; o Hero também). Navegação por teclado nos botões/form; `alt` em todas as imagens (das legendas IG); contraste oro/carbon AA.

- [ ] **Step 2: Lighthouse**

Run: `cd site && npm run build && npx serve@latest -s .next` (ou `npm start` após build) e correr Lighthouse.
Expected: Performance/Accessibility/SEO ≥ 90 (anotar e corrigir o que falhar).

- [ ] **Step 3: Commit**

`git commit -m "chore: a11y + perf pass"`

---

### Task 16: Deploy preview (Vercel)

**Files:** Create `site/vercel.json` (se necessário)

- [ ] **Step 1: Deploy**

Run: `cd site && npx vercel --yes` (login interativo se preciso — o utilizador corre com `! npx vercel login`). Definir env `BREVO_API_KEY`, `BREVO_LIST_ID`, `NEXT_PUBLIC_WHATSAPP` no projeto Vercel.
Expected: URL de preview gerado.

- [ ] **Step 2: Smoke test**

Abrir o preview nos 4 idiomas; testar reveal/scroll, vídeo, form de lead. Anotar problemas.

- [ ] **Step 3: Entregar preview**

Partilhar o URL com o utilizador para mostrar à cliente. Commit final `chore: vercel preview config`.

---

## Self-Review (cobertura do spec)
- Hero animado ✅ T6 · Servicios catálogo completo ✅ T7 · Academia ✅ T8 · Galería/prova social ✅ T9 · Historia ✅ T10 · Contacto/CTA ✅ T12 · Footer/idiomas ✅ T13.
- anime.js scroll + reduced-motion ✅ T5/T15 · i18n ES/EN/PL/IT ✅ T2 · captação lead→Brevo ✅ T11 · SEO/LocalBusiness ✅ T12/T14 · assets reais ✅ T4 · preview Vercel ✅ T16.
- ⚠️ Pendentes (não bloqueiam o build, ficam como dados a injetar): preços reais, `BFL_API_KEY`, traduções revistas por nativo, pull IG completo (`tools/ig-pull`).
- Booking à medida = Fase B (spec próprio, fora deste plano).
