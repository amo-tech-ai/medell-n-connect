---
id: ECOM-M-010
title: Trip product links
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

# ECOM-M-010 - Trip product links

## Objective

Link trips and itinerary items to live Medusa products.

## Scope

- Add `commerce_trip_products` link table if needed.
- Store trip/item references and Medusa `product_id` only.
- Render live product cards inside trip context.

## Acceptance Criteria

- [ ] Trip page can show linked product cards.
- [ ] No product price/stock is copied into Supabase.
- [ ] Product card hydrates from Medusa before display.

## Proof Commands

```bash
rg -n "commerce_trip_products" supabase/migrations mdeapp/src
cd mdeapp && npm run test:e2e -- e2e/commerce-trip-products.spec.ts --project=chromium --workers=1
```

## Tests

- Unit test link fetcher.
- Playwright trip product proof.

## Rollback

Hide trip commerce module.

