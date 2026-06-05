---
id: ECOM-C-015
title: Minimal cart state UI
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-012, ECOM-C-014]
blocks: [ECOM-C-016]
skills: [storefront-best-practices]
official_refs:
  - https://docs.copilotkit.ai
  - https://docs.medusajs.com
---

# ECOM-C-015 - Minimal cart state UI

## Objective

Show enough cart state to complete Core checkout without building a full storefront cart page.

## Scope

- Add minimal cart summary component/hook.
- Show item count, selected variants, subtotal, and checkout CTA.
- Add accessible cart count update announcement.
- Keep checkout button tied to `checkout_link`.

## Acceptance Criteria

- [ ] Cart updates after add-to-cart.
- [ ] Variant details are visible for each item.
- [ ] Checkout button calls the checkout tool.
- [ ] Cart count updates include `aria-live="polite"`.
- [ ] Mobile sticky elements account for safe-area inset if used.

## Proof Commands

```bash
cd mdeapp && npm test -- src/components/commerce
npm run test:e2e -- e2e/commerce-cart-state.spec.ts --project=chromium --workers=1
```

## Tests

- Vitest cart summary state.
- Playwright add-to-cart and checkout CTA smoke.

## Rollback

Remove cart summary and hook.

