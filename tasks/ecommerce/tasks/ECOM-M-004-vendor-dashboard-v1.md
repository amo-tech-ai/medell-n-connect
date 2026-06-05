---
id: ECOM-M-004
title: Vendor dashboard v1
status: Not Started
priority: P1
phase: mvp
depends_on: [ECOM-M-001, ECOM-M-003]
blocks: [ECOM-M-007]
skills: [building-admin-dashboard-customizations, building-with-medusa]
official_refs:
  - https://docs.medusajs.com
  - https://docs.medusajs.com/resources/recipes/marketplace
---

# ECOM-M-004 - Vendor dashboard v1

## Objective

Add a minimal vendor dashboard for products, orders, and payout status.

## Scope

- Build read-heavy dashboard first.
- Use Medusa JS SDK for admin calls.
- Use Medusa UI components.
- Display data loads on mount.
- Separate display queries from modal/form queries.
- Vendor can only see own products/orders.

## Skill Notes

- Use `building-admin-dashboard-customizations` data loading, forms, and display patterns.
- Use `FocusModal` for create flows and `Drawer` for edit flows if forms are added.
- Never divide Medusa prices by 100.

## Acceptance Criteria

- [ ] Vendor sees own products.
- [ ] Vendor sees own orders.
- [ ] Loading states are shown.
- [ ] Vendor isolation is tested.
- [ ] No raw `fetch()` is used for Medusa admin API calls.

## Proof Commands

```bash
cd commerce/medusa && npm run build
cd commerce/medusa && npm test -- vendor-dashboard
```

## Tests

- Admin UI unit tests.
- Auth/isolation route tests.
- Playwright dashboard smoke if route is browser-visible.

## Rollback

Feature-flag dashboard route off.

