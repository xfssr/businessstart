# Bilingual Studio Commerce v2.0

Next.js App Router project for a bilingual business website (Blob-based admin/content storage):

- Hebrew-first (`/he`, RTL)
- English (`/en`, LTR)
- Admin-managed services, solutions, packages, portfolio, FAQ, navigation, and global settings
- WhatsApp-first conversion + quote CTA
- SEO-ready routes and metadata

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS
- Vercel Blob (`@vercel/blob`) for StartStudio content, media, and lead storage (private + proxy)
- Vitest + Testing Library

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment template:

```bash
cp .env.example .env.local
```

3. Fill Blob/admin variables in `.env.local`:

- `BLOB_READ_WRITE_TOKEN` (required for StartStudio media upload + media index)
- `STARTSTUDIO_BLOB_ACCESS=private` (required; this project enforces private access)
- `STARTSTUDIO_ADMIN_KEY` (recommended to protect admin API/page)

## Run

Frontend:

```bash
npm run dev
```

## Build / Test

```bash
npm run lint
npm run test
npm run build
```

## Routes

Main localized pages:

- `/he`, `/en`
- `/[locale]/services`
- `/[locale]/solutions`
- `/[locale]/portfolio`
- `/[locale]/pricing`
- `/[locale]/about`
- `/[locale]/contact`

Dynamic SEO landing pages (content-driven):

- `/[locale]/services/[slug]`
- `/[locale]/solutions/[slug]`

Admin:

- `/startstudio` (edit bilingual content/prices/SEO snippets and upload media)

## SEO Foundation

- `sitemap.xml` includes `/he` and `/en` plus dynamic service/solution slugs
- `robots.txt`
- canonical + hreflang metadata per locale
- OpenGraph / Twitter metadata
- JSON-LD on key landing pages (`Service`, `Product/Offer`, `BreadcrumbList`, `FAQPage`, `LocalBusiness`)

## Leads

Contact forms post to:

- `POST /api/leads`

When `BLOB_READ_WRITE_TOKEN` is configured, each lead is stored as private JSON in:

- `startstudio/leads/YYYY-MM-DD/<uuid>.json`

## StartStudio Admin + Blob

- Admin UI route: `/startstudio`
- API routes:
  - `GET /api/startstudio/state?locale=he|en`
  - `PUT /api/startstudio/content` (writes locale patch to Blob `startstudio/content.json`)
  - `GET /api/startstudio/media-library?locale=he|en`
  - `POST /api/startstudio/media-library` (create media asset + upload to Blob)
  - `PATCH /api/startstudio/media-library` (update media metadata/placements)
  - `POST /api/startstudio/upload`
  - `GET /api/startstudio/media?pathname=...` (proxy for private Blob media)
- Auth header: `x-startstudio-key` (checked against `STARTSTUDIO_ADMIN_KEY` if set)
- Uploaded image/video files are stored in Vercel Blob under `startstudio/media/...`
- StartStudio content source of truth is Blob (`startstudio/content.json`).

## Vercel

- Framework preset: `Next.js`
- Build command: `npm run build`
- Output Directory: leave empty (do not set `dist`)
