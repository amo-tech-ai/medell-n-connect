---
id: ECOM-M-011
title: Venue product links
status: Not Started
priority: P2
phase: mvp
depends_on: [ECOM-C-018]
blocks: []
skills: [storefront-best-practices]
official_refs:
  - https://supabase.com/docs
  - https://developers.google.com/maps/documentation
  - https://docs.medusajs.com
---

# ECOM-M-011 - Venue product links

## Objective

Link venue context to live Medusa products/packages.

## Scope

- Add `commerce_venue_products` link table if needed.
- Store venue id and Medusa product id only.
- Use Maps/Places as context, not commerce source of truth.

## Acceptance Criteria

- [ ] Venue context can show linked product cards.
- [ ] Product card hydrates from Medusa.
- [ ] Maps data is not required for Core checkout.
- [ ] No price/stock copied to Supabase.

## Proof Commands

```bash
rg -n "commerce_venue_products" supabase/migrations mdeapp/src
cd mdeapp && npm run test:e2e -- e2e/commerce-venue-products.spec.ts --project=chromium --workers=1
```

## Tests

- Unit test link fetcher.
- Playwright venue product proof.

## Rollback

Hide venue commerce module.

