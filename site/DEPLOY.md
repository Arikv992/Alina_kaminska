# Deploy Runbook — Alina Kaminska Beauty Academy

## Prerequisites

- Node.js 20+
- A [Vercel](https://vercel.com) account (free tier is enough)
- Environment variables ready (see section below)

---

## Deploy to Vercel

### 1. Install the Vercel CLI (one-time)

```bash
npm install -g vercel
```

### 2. Login to Vercel (one-time)

```bash
vercel login
```

### 3. First deploy (preview — no production domain yet)

Run this from inside the `site/` directory:

```bash
vercel
```

Vercel will ask a few questions on first run:
- **Set up and deploy?** → Yes
- **Which scope?** → your account
- **Link to existing project?** → No (create new)
- **Project name?** → `alinakaminska-beauty-academy` (or any name)
- **Which directory is your code?** → `./` (current directory)
- **Override settings?** → No

Vercel will build and deploy to a preview URL like:  
`https://alinakaminska-beauty-academy-xxx.vercel.app`

Share this URL with the client to review the site before going live.

### 4. Promote to production

Once the client approves the preview:

```bash
vercel --prod
```

This deploys to the main production URL (e.g. `https://alinakaminska-beauty-academy.vercel.app`).

---

## Environment Variables

Set these in the Vercel project dashboard under **Settings → Environment Variables**,  
or pass them inline with `vercel env add` before deploying.

| Variable | Required | Description |
|---|---|---|
| `BREVO_API_KEY` | Yes | Brevo (Sendinblue) API key — needed for the contact form |
| `BREVO_LIST_ID` | Yes | Brevo list ID where leads are saved |
| `NEXT_PUBLIC_WHATSAPP` | Yes | WhatsApp number without `+` (e.g. `34603243621`) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Full production URL without trailing slash (e.g. `https://www.alinakaminskabeautyacademy.com`) |
| `BFL_API_KEY` | No | Black Forest Labs key — only if AI image features are enabled |

Copy `.env.local.example` to `.env.local` for local development and fill in values:

```bash
cp .env.local.example .env.local
```

---

## Custom Domain

The custom domain (`alinakaminskabeautyacademy.com` or similar) should be pointed to Vercel  
**after** the client approves the preview deployment.

Steps:
1. Go to Vercel project → **Settings → Domains**
2. Add the custom domain
3. Vercel will show the DNS records to add (usually an `A` record and a `CNAME`)
4. Update DNS at the domain registrar
5. Vercel automatically provisions an HTTPS certificate via Let's Encrypt

> Use the preview URL (e.g. `*.vercel.app`) to show the client the site before DNS is switched.

---

## Build verification before deploy

```bash
npm run build   # must pass with no errors
npm test        # must pass
```
