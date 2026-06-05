---
id: ECOM-C-006
title: Demo catalog seed
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-004, ECOM-C-005]
blocks: [ECOM-C-007, ECOM-C-009]
skills: [building-with-medusa, medusa-commerce]
official_refs:
  - https://docs.medusajs.com
  - https://github.com/medusajs/examples
---

# ECOM-C-006 - Demo catalog seed

## Objective

Seed one internal/demo seller and 20 Medellin lifestyle products in Medusa.

## Scope

- Add a seed script or fixture for 20 products.
- Include variants, prices, images, and inventory/availability.
- Do not add marketplace vendor module yet.
- Products should be realistic enough for AI product search proof.

## Acceptance Criteria

- [ ] 20 active products exist in Medusa.
- [ ] Every product has title, description, image, price, variant, and stock/availability.
- [ ] Prices are stored/displayed as Medusa display amounts, not cents.
- [ ] Store API returns the seeded catalog.

## Proof Commands

```bash
cd commerce/medusa && npm run seed:demo-catalog
curl -fsS http://localhost:9000/store/products | jq '.products | length'
```

## Tests

- Fixture shape test.
- Optional Store API smoke after seed.

## Rollback

Run seed cleanup/reset script or reset the Medusa dev database.

