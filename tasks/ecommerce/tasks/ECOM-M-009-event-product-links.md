---
id: ECOM-M-009
title: Event product links
status: Not Started
priority: P2
phase: mvp
depends_on: [ECOM-C-018]
blocks: []
skills: [storefront-best-practices]
official_refs:
  - https://supabase.com/docs
  - https://docs.medusajs.com
---

# ECOM-M-009 - Event product links

## Objective

Link existing events to live Medusa products.

## Scope

- Add `commerce_event_products` link table if not already added.
- Store `event_id`, `product_id`, label, and sort order only.
- Render linked ProductCards on event surfaces by hydrating products from Medusa.

## Acceptance Criteria

- [ ] Event page can show linked products.
- [ ] Link table stores product id only, not price/stock.
- [ ] Product card displays current Medusa price/stock.

## Proof Commands

```bash
rg -n "commerce_event_products" supabase/migrations mdeapp/src
cd mdeapp && npm run test:e2e -- e2e/commerce-event-products.spec.ts --project=chromium --workers=1
```

## Tests

- Link fetcher unit test.
- Playwright event product card proof.

## Rollback

Hide event commerce module and leave table inert.

