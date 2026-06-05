---
id: ECOM-M-013
title: Featured listings pilot
status: Not Started
priority: P2
phase: mvp
depends_on: [ECOM-M-012]
blocks: []
skills: [storefront-best-practices, building-admin-dashboard-customizations]
official_refs:
  - https://supabase.com/docs
  - https://docs.medusajs.com
---

# ECOM-M-013 - Featured listings pilot

## Objective

Pilot manual featured placements after Core and basic analytics are live.

## Scope

- Add featured placement metadata table or admin-managed config.
- Store product/vendor id, placement, label, start/end, and status.
- Clearly label featured results.
- No ad auction, no autonomous bidding.

## Acceptance Criteria

- [ ] Admin can mark a product/vendor as featured.
- [ ] Featured placement can boost ranking with explicit label.
- [ ] User can distinguish featured from organic results.
- [ ] Analytics tracks featured impressions/clicks.

## Proof Commands

```bash
cd mdeapp && npm test -- src/lib/commerce/featured-listings.test.ts
cd mdeapp && npm run test:e2e -- e2e/commerce-featured-listings.spec.ts --project=chromium --workers=1
```

## Tests

- Ranking/label unit test.
- Playwright label proof.

## Rollback

Disable ranking boost and hide featured labels; leave table inert.

