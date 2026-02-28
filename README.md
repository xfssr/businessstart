# Creative Growth Laboratory

Premium bilingual (Hebrew + English) business website for a modern creative growth studio that helps businesses build visibility and get first leads.

## Website Concept

This is not a simple portfolio for photo/video services.
It is positioned as a **business growth laboratory** combining:

- content production,
- digital packaging,
- landing page / website build,
- ad creatives,
- launch support for first inquiries.

Core value statement: **Content. Packaging. Promotion. First Leads.**

## What the Site Provides

- Native Hebrew (`rtl`) experience for Israeli business clients.
- Professional English (`ltr`) layer for international presentation.
- Language toggle in header with persisted selection in `localStorage`.
- WhatsApp-first conversion flow:
  - hero primary CTA,
  - contact primary CTA,
  - sticky mobile CTA after scroll.
- Premium dark visual direction (midnight/navy/graphite palette, restrained accent, cinematic gradients, subtle grid overlay).
- Full business funnel sections:
  - Hero,
  - What We Do,
  - How It Works,
  - Who It Is For,
  - Why This Is Different,
  - Services & Solutions,
  - Results-Oriented Outcomes,
  - Portfolio,
  - FAQ,
  - CTA,
  - Contact.
- Contact channels + inquiry form UI.

## Content Scope

Target audiences include:

- restaurants,
- bars,
- cafes,
- catering,
- hotels,
- events,
- beauty / lifestyle,
- local services.

Localized copy is stored in:

- `src/messages/he.json`
- `src/messages/en.json`

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, click `Add New Project` and import `businessstart`.
3. Framework preset: `Next.js` (auto-detected).
4. Build command: `npm run build` (default).
5. Output: `.next` (handled automatically by Vercel for Next.js).
6. Deploy.

Optional Vercel CLI deploy:

```bash
npm i -g vercel
vercel
vercel --prod
```

## Tests

```bash
npm run test
```

## Notes

- The UI is mobile-first and optimized for both `rtl` and `ltr` layouts.
- `next-intl` is installed; locale switching uses lightweight local JSON state for instant direction/language switch.
