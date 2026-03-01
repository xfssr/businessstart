# Bilingual Studio Commerce v2.0

Next.js App Router + Sanity CMS project for a bilingual business website:

- Hebrew-first (`/he`, RTL)
- English (`/en`, LTR)
- CMS-managed services, solutions, packages, portfolio, FAQ, navigation, and global settings
- WhatsApp-first conversion + quote CTA
- SEO-ready routes and metadata

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS
- Sanity Studio + `next-sanity`
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

3. Fill Sanity variables in `.env.local`:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_WRITE_TOKEN` (optional but required for lead writes)

## Run

Frontend:

```bash
npm run dev
```

Sanity Studio (optional local dev):

```bash
npm run dev:studio
```

Studio in Next app is available at:

- `http://localhost:3000/studio`

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

Dynamic SEO landing pages (CMS-driven):

- `/[locale]/services/[slug]`
- `/[locale]/solutions/[slug]`

## SEO Foundation

- `sitemap.xml` includes `/he` and `/en` plus dynamic service/solution slugs
- `robots.txt`
- canonical + hreflang metadata per locale
- OpenGraph / Twitter metadata
- JSON-LD on key landing pages (`Service`, `Product/Offer`, `BreadcrumbList`, `FAQPage`, `LocalBusiness`)

## Leads

Contact forms post to:

- `POST /api/leads`

When `SANITY_API_WRITE_TOKEN` is configured, leads are stored as `lead` documents in Sanity.

## Vercel

- Framework preset: `Next.js`
- Build command: `npm run build`
- Output Directory: leave empty (do not set `dist`)
