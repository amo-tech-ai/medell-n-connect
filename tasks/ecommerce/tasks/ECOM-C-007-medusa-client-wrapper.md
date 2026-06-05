---
id: ECOM-C-007
title: Medusa client wrapper in mdeapp
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-006]
blocks: [ECOM-C-010, ECOM-C-011, ECOM-C-012]
skills: [storefront-best-practices, building-with-medusa]
official_refs:
  - https://docs.medusajs.com/resources/js-sdk
  - https://github.com/medusajs/nextjs-starter-medusa
---

# ECOM-C-007 - Medusa client wrapper in mdeapp

## Objective

Add a typed server-side Medusa client wrapper for commerce tools and UI hydration.

## Scope

- Add `mdeapp/src/lib/commerce/medusa-client.ts`.
- Add commerce DTO/types.
- Verify exact JS SDK methods against official docs before implementation.
- Include timeout and error normalization.
- Never expose admin secrets to the browser.

## Skill Notes

- `storefront-best-practices`: verify SDK methods before coding.
- Always set and use publishable key where Store API requires it.
- Display Medusa prices as-is.

## Acceptance Criteria

- [ ] Wrapper lists products.
- [ ] Wrapper fetches product detail.
- [ ] Wrapper creates cart and adds line item.
- [ ] Wrapper can create checkout link/session when downstream checkout task is ready.
- [ ] TypeScript does not use guessed SDK methods.

## Proof Commands

```bash
cd mdeapp && npm test -- src/lib/commerce
node --env-file=.env.local scripts/smoke-commerce-client.mjs
```

## Tests

- Vitest mocked Medusa API.
- Live smoke when env exists.

## Rollback

Remove `src/lib/commerce` wrapper files and tests.

