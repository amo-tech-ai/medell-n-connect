---
id: ECOM-C-005
title: Cloudinary media provider
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-002, ECOM-C-003]
blocks: [ECOM-C-006, ECOM-C-014]
skills: [building-with-medusa, medusa-commerce]
official_refs:
  - https://cloudinary.com/documentation
  - https://docs.medusajs.com
---

# ECOM-C-005 - Cloudinary media provider

## Objective

Enable product media for Medusa products using Cloudinary.

## Scope

- Configure a Medusa-compatible Cloudinary file/media provider or a narrow adapter after verifying current Medusa support.
- Document required env vars.
- Ensure seeded product images render through Store API data.

## Acceptance Criteria

- [ ] Product image upload or referenced asset is available through Medusa.
- [ ] Product cards can render image URLs from Medusa-hydrated DTOs.
- [ ] No product binary images are committed to the repo.
- [ ] Cloudinary failures produce actionable logs.

## Proof Commands

```bash
cd commerce/medusa && npm run smoke:media
curl -fsS "$MEDUSA_BACKEND_URL/store/products" | jq
```

## Tests

- Unit test for media URL normalization if an adapter is added.
- ProductCard image render is tested in ECOM-C-014.

## Rollback

Revert media provider config and seed media references.

