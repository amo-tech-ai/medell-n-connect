---
id: ECOM-C-012
title: Mastra cart tools
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-007]
blocks: [ECOM-C-013, ECOM-C-015]
skills: [storefront-best-practices]
official_refs:
  - https://mastra.ai/docs
  - https://docs.medusajs.com
---

# ECOM-C-012 - Mastra cart tools

## Objective

Add `create_cart` and `add_to_cart` tools backed by Medusa carts.

## Scope

- Create cart with region/currency context after SDK method verification.
- Add variant to cart.
- Return cart id, line items, variants, totals, and availability.
- Persist/reuse cart id through existing session state pattern.

## Skill Notes

- Cart UI must display variant details.
- Cart count updates need accessible live announcement in UI follow-up task.

## Acceptance Criteria

- [ ] Cart can be created.
- [ ] Variant can be added.
- [ ] Totals come from Medusa.
- [ ] Quantity and out-of-stock errors are handled.

## Proof Commands

```bash
cd mdeapp && npm test -- src/mastra/tools/__tests__/commerce-cart.test.ts
node --env-file=.env.local scripts/smoke-commerce-cart.mjs
```

## Tests

- Vitest mocked Medusa cart API.
- Optional live smoke with Medusa running.

## Rollback

Remove cart tools and session state additions.

