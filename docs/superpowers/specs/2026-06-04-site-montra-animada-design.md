# Spec de design — Site novo (montra animada) + base para booking à medida
**Data:** 2026-06-04 · **Cliente:** Alina Kaminska Beauty Academy · **Estado:** para aprovação

## 1. Objetivo
Substituir o site WordPress (brochura, 4 páginas, só ES, sem marcação) por um **site próprio,
cinematográfico e animado** (estilo animejs.com) que converte visitantes em marcações e leads,
em **ES/EN/PL/IT**, e que serve de base para um **sistema de marcação à medida**. O site é também
o front-end que liga ao resto do sistema (CRM Brevo, agente IA, curso) já desenhado no projeto.

## 2. Âmbito e decomposição
- **Fase A — Montra animada (ESTE spec, build primeiro).** Site multilíngue, animado ao scroll,
  com captação de lead + CTA de marcação **provisório** (WhatsApp/formulário → Brevo).
- **Fase B — Booking à medida (spec próprio, depois).** Serviços/disponibilidade, depósito Stripe,
  painel da Alina, notificações via n8n. Substitui o CTA provisório.
- **Fora de âmbito aqui:** agente IA, reativação, curso (já especificados noutras partes do projeto).

## 3. Stack (validada)
- **Next.js 15 (App Router) + TypeScript + Tailwind CSS**.
- **anime.js v4** para animação (scroll-driven). Skill `bowtiedswan/animejs-skills` instalada no arranque.
- **next-intl** para i18n (ES default, EN, PL, IT).
- **Supabase (Postgres + Storage)** — leads e, na Fase B, marcações; storage para imagens.
- **Stripe** — só Fase B (depósito).
- **Deploy:** Vercel (preview URL para mostrar à cliente; domínio próprio apontado só depois).
- Integrações por API/webhook: **Brevo** (lead capture), **n8n** (orquestração), agente IA.

## 4. Marca (extraída do site + Instagram)
- **Logo:** `assets/brand/logo.svg` (emblema dourado AK; SVG → anima-se na entrada).
- **Paleta (a afinar com hex exatos do logo no 1.º passo de build):**
  - Dourado/oro (acento) · Creme/marfim (fundo) · Nude/blush (secundário) · Carbón/grafite (texto).
- **Tipografia:** serif editorial elegante para títulos (ex.: Cormorant/Playfair) + sans limpa para
  corpo (ex.: Inter/Manrope). Confirmar/escolher no build conforme o logo.
- **Tom:** premium, feminino, "lujo en los detalles", aspiracional. Copy real reutilizável em
  `assets/instagram/CONTENIDO-Y-COPY.md`.

## 5. Conteúdo e estrutura (one-page + rotas de idioma `/es /en /pl /it`)
1. **Hero** — logo SVG a desenhar-se + headline "Redefina su experiencia en belleza" (reveal por
   palavras) + subheadline "Estética y formación de alto nivel" + CTA "Reservar". Fundo: imagem/vídeo real.
2. **Servicios** — catálogo COMPLETO confirmado pelo IG (⚠️ validar com Alina): manicura, pestañas
   UV, cejas, **pedicura, extensiones de cabello, coloración, cuidado de piel**. Cada um: imagem +
   reveal/parallax ao scroll. Preços ⚠️ a confirmar (não inventar).
3. **Academia / Cursos** — formação certificada (manicura, pestañas, cejas); gancho para o curso
   online (Fase 2 do projeto). Copy: "Formación que eleva tu talento."
4. **Resultados / Galería** — prova social das imagens do IG (`assets/instagram/`) + reels.
5. **Historia / Alina** — "Nuestra historia comienza con la pasión de Alina…", 14+ anos, timeline animada.
6. **Testimonios** — do IG/Google.
7. **Contacto + CTA** — morada (Av. Dr. Gregorio Marañón 7/8, Torrevieja), horário (Lun-Vie 9:30-17:00),
   mapa, telefone (603 243 621), CTA de marcação.
8. **Footer** — selo Kit Digital, redes (IG/FB), seletor de idioma.

## 6. Sistema de animação (anime.js v4)
- **Scroll-driven** como animejs.com: timelines ligadas ao progresso de scroll, reveals com
  **stagger**, máscaras/`clip-path`, parallax suave, animação do logo SVG e de texto por palavra/linha.
- Componente reutilizável `<Reveal>` / hook `useScrollAnimation` que encapsula anime.js (isolamento:
  a lógica de animação não se espalha pelos componentes de conteúdo).
- **Acessibilidade:** respeitar `prefers-reduced-motion` (desliga/reduz animações).
- **Performance:** animações em `transform`/`opacity` (GPU); `IntersectionObserver` para disparar;
  lazy-load de imagens; evitar layout thrash.

## 7. Pipeline de assets/imagens
- **Reais do IG:** já em `assets/instagram/` (otimizar → WebP/AVIF, vários tamanhos). Re-pull de `06`/`08`
  e dos reels no build (sessão browser).
- **Geradas (FLUX 1.1 Pro Ultra / BFL):** para heróis/secções que precisem de polimento.
  Endpoint `POST https://api.bfl.ai/v1/flux-pro-1.1-ultra`, header `x-key`, async (polling_url).
  Key via `BFL_API_KEY` em `.env.local` (gitignored) — **nunca no repo/notas** (regra do utilizador).
- Imagens servidas otimizadas (next/image) a partir de `/public` ou Supabase Storage.

## 8. Captação de lead + CTA provisório (Fase A)
- Formulário (nome, contacto, serviço de interesse, idioma) → **API route** → **Brevo** (lista +
  etiqueta) e/ou Supabase. Confirmação multilíngue.
- CTA "Reservar" provisório: abre **WhatsApp** (link `wa.me`) e/ou o formulário, até a Fase B.
- Tudo alimenta o CRM/agente IA já desenhados.

## 9. i18n
- next-intl, mensagens por idioma em `/messages/{es,en,pl,it}.json`. ES original; EN/PL/IT traduzidos.
- Seletor de idioma no header/footer; deteção por `Accept-Language` com fallback ES.

## 10. SEO e performance (negócio local)
- SSG/SSR por idioma, metadados/OpenGraph, **LocalBusiness schema.org** (morada, horário, geo).
- Core Web Vitals: imagens otimizadas, fontes `display: swap`, JS de animação só onde é preciso.
- Sitemap multilíngue + hreflang.

## 11. Estrutura de ficheiros (proposta)
```
site/                      ← app Next.js (separado dos docs do projeto)
  app/[locale]/page.tsx    ← one-page por idioma
  app/api/lead/route.ts    ← captação → Brevo/Supabase
  components/sections/*    ← Hero, Servicios, Academia, Galeria, Historia, Contacto
  components/anim/         ← <Reveal>, useScrollAnimation (anime.js encapsulado)
  messages/{es,en,pl,it}.json
  lib/{brevo,supabase,flux}.ts
  public/                  ← assets otimizados
```

## 12. Testes / verificação
- Build sem erros; Lighthouse (perf/acessibilidade/SEO ≥ 90).
- `prefers-reduced-motion` testado; navegação por teclado; contraste.
- Formulário de lead end-to-end (chega ao Brevo).
- Preview Vercel partilhável para a cliente aprovar.

## 13. Itens em aberto / credenciais
- ⚠️ **Preços** de serviços/cursos (confirmar com Alina; não inventar).
- ⚠️ **Catálogo final** de serviços (confirmar os extra do IG: cabelo, coloração, piel, pedicura).
- `BFL_API_KEY` (geração de imagens) — via `.env.local`.
- Conta **Supabase** + **Brevo** (chaves) para o formulário.
- Traduções EN/PL/IT (gero rascunho; idealmente revistas por nativo).
- Domínio: fica em **preview Vercel** até a cliente aprovar e haver acesso ao domínio.

## 14. Riscos
- Animação pesada → vigiar performance mobile (mitigado por `prefers-reduced-motion` + GPU).
- URLs do IG caducam → otimizar/guardar localmente no build.
- Sair do WordPress remove a marcação LatePoint → coberto pela Fase B (booking à medida) + CTA provisório.
- Kit Digital: a categoria "web" pode financiar mesmo um site custom (confirmar com o agente digitalizador).
