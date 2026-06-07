# Instagram pull — runbook (método verificado)

> Verificado em jun/2026 com o login da cliente na sessão Playwright. Puxa **imagens e vídeos**
> reais de @alinakaminskabeautyacademy para `assets/instagram/`. Correr **no build** (os URLs do
> CDN caducam em poucos dias → não vale a pena puxar antes).

## Pré-requisito
- Sessão Instagram **autenticada** (a cliente faz login na janela do browser controlado pelo
  Playwright/Chrome). A grelha pública só mostra ~12 posts e os reels precisam de login para o mp4.

## Técnica provada (passo a passo)
1. **Navegar** para `https://www.instagram.com/<perfil>/`.
2. **Scroll da grelha** até carregar os 69 posts. ⚠️ O container de scroll do IG **não é sempre o
   `window`** — fazer scroll em passos e parar quando o nº de links estabiliza (ver `pull.mjs`).
3. **Recolher** todos os `a[href*="/p/"]` e `a[href*="/reel/"]` → `{href, thumb, alt(caption), video}`.
4. **Imagens (posts):** o `img.src` da grelha é 640px; para full-res abrir o post. Descarregar com
   `curl`/fetch usando **User-Agent de browser + Referer `https://www.instagram.com/`** (senão 403).
5. **Vídeos (reels):** o `<video>.src` é `blob:` (MSE) — **não** serve. O mp4 real está no HTML da
   página do reel: token que contém `.mp4` e `progressive` no parâmetro `efg` (versão progressiva
   720p, ficheiro único). Decodificar `&`→`&`, `%3D`→`%3D`, `\/`→`/`. Descarregar com curl
   (UA + Referer). Há também variantes DASH 360/540/720p (precisam de concatenar segmentos — evitar;
   usar a progressiva).

## Headers obrigatórios (curl)
```
-A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
-e "https://www.instagram.com/"
```

## Já descarregado (amostra de prova)
- `assets/instagram/` — 12 imagens reais (com legendas em `CONTENIDO-Y-COPY.md`).
- `assets/instagram/videos/` — 2 reels mp4 720p (formación, KURS UV lashes).

## Estado da grelha (jun/2026)
- 69 posts no total. Topo: **9 reels (vídeo) + 3 fotos** com as legendas de marketing.
- Restantes ~57 são posts mais antigos (sobretudo fotos de resultados) — puxar todos no build.

## Ficheiros
- `pull.mjs` — script Playwright (best-effort) que automatiza o acima. Validar/correr no build com a
  sessão autenticada (`IG_STORAGE_STATE` = storageState.json do login).
