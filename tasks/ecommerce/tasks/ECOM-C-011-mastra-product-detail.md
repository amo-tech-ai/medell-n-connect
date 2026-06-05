---
id: ECOM-C-011
title: Mastra product_detail tool
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-007]
blocks: [ECOM-C-014]
skills: [storefront-best-practices]
official_refs:
  - https://mastra.ai/docs
  - https://docs.medusajs.com
---

# ECOM-C-011 - Mastra product_detail tool

## Objective

Fetch one live Medusa product for detail cards and cart actions.

## Scope

- Add `mdeapp/src/mastra/tools/commerce/product-detail.ts`.
- Validate product id.
- Fetch live Medusa detail.
- Normalize detail DTO.

## Acceptance Criteria

- [ ] Product detail includes title, image, description, variant choices, price, and availability.
- [ ] Price is displayed as Medusa display amount.
- [ ] Invalid or missing product id fails safely.

## Proof Commands

```bash
cd mdeapp && npm test -- src/mastra/tools/__tests__/commerce-product-detail.test.ts
```

## Tests

- Vitest mocked Medusa detail.

## Rollback

Remove tool registration and file.

