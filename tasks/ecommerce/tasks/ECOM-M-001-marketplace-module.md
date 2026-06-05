---
id: ECOM-M-001
title: Marketplace module from official recipe
status: Not Started
priority: P1
phase: mvp
depends_on: [ECOM-C-018]
blocks: [ECOM-M-003, ECOM-M-004, ECOM-M-005, ECOM-M-006]
skills: [building-with-medusa, db-generate, db-migrate]
official_refs:
  - https://docs.medusajs.com/resources/recipes/marketplace
  - https://docs.medusajs.com/resources/recipes/marketplace/examples/vendors
  - https://github.com/medusajs/examples/tree/main/marketplace
---

# ECOM-M-001 - Marketplace module from official recipe

## Objective

Add a custom Medusa marketplace module after Core checkout is proven.

## Scope

- Add `Vendor` and `VendorAdmin` models.
- Add module links between vendor and products.
- Register module in Medusa config.
- Generate and run migrations.
- Keep module name camelCase.

## Skill Notes

- `building-with-medusa`: custom module, links, workflows, and API route layering is mandatory.
- `db-generate`: run `npx medusa db:generate marketplace`.
- `db-migrate`: run `npx medusa db:migrate`.

## Acceptance Criteria

- [ ] Marketplace module compiles.
- [ ] Migration generated and applied.
- [ ] Vendor can link to products.
- [ ] No product truth is copied to Supabase.

## Proof Commands

```bash
cd commerce/medusa && npx medusa db:generate marketplace
cd commerce/medusa && npx medusa db:migrate
cd commerce/medusa && npm run build
```

## Tests

- Module service unit/integration tests.
- Link query test.

## Rollback

Disable module in Medusa config and rollback/drop marketplace module tables in dev/test.

