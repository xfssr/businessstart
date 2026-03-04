# Admin Layer Model

This project currently runs with a Blob-first admin model (no external CMS required).

Current implementation:
- `StartStudio` (`/startstudio`) writes locale message patches into private Blob JSON (`startstudio/content.json`).
- Uploaded media is stored in private Vercel Blob and served via `/api/startstudio/media`.
- Media metadata is managed via `/api/startstudio/media-library` and persisted in Blob.

## Editable Collections

1. `global_settings`
- brand name
- contact channels
- WhatsApp number
- social links
- locale settings

2. `pages`
- slug
- locale (`he` or `en`)
- hero title/subtitle
- section blocks
- CTA labels
- publish state

3. `services`
- title
- audience
- included list
- timeline
- price / from price
- category (`standard` / `solution`)
- featured / hidden

4. `solutions`
- title
- target industry
- included list
- price range
- order link

5. `portfolio_items`
- title
- subtitle
- category
- cover image
- gallery images
- optional KPI summary

6. `faq_items`
- locale
- question
- answer
- order index

7. `seo_entries`
- page slug
- locale
- title
- description
- canonical
- open graph fields

## Optional Future CMS Integration

1. Keep Blob as fallback source of truth while introducing CMS.
2. Migrate `global_settings`, `services`, `faq_items`, and `seo_entries` first.
3. Add preview mode and draft/publish workflow.
4. Add role-based access for editor vs admin.
