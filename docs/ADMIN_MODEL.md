# Admin Layer Model

This project is structured for a headless CMS integration (Sanity / Payload / Strapi).

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

## Recommended First CMS Integration

1. Start with `global_settings`, `services`, `faq_items`, and `seo_entries`.
2. Keep page layout in code, move content fields to CMS.
3. Add preview mode and draft/publish workflow.
4. Add role-based access for editor vs admin.
