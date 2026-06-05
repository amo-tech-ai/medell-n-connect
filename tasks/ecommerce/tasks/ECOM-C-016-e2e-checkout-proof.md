---
id: ECOM-C-016
title: End-to-end checkout proof
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-013, ECOM-C-015]
blocks: [ECOM-C-017, ECOM-C-018, ECOM-M-001]
skills: [storefront-best-practices, mde-task-lifecycle]
official_refs:
  - https://docs.stripe.com/payments/checkout
  - https://docs.medusajs.com
  - https://playwright.dev
---

# ECOM-C-016 - End-to-end checkout proof

## Objective

Prove the Core milestone with one paid test order.

## Scope

- Add Playwright checkout spec.
- Add `scripts/smoke-commerce-paid-proof.mjs`.
- Record evidence file with test order id.
- Keep proof independent from event ticket smoke scripts.

## Acceptance Criteria

- [ ] User can ask/search for a product.
- [ ] ProductCard renders.
- [ ] Add-to-cart works.
- [ ] Stripe test payment completes.
- [ ] Medusa order exists.
- [ ] Evidence doc records order id, date, env, and commands.

## Proof Commands

```bash
cd mdeapp && npm run test:e2e -- e2e/commerce-checkout.spec.ts --project=chromium --workers=1
cd mdeapp && node --env-file=.env.local scripts/smoke-commerce-paid-proof.mjs
```

## Tests

- Required Playwright proof unless Stripe test env is missing; document exact blocker if skipped.

## Rollback

Revert proof test/evidence. If product code fails, rollback the specific preceding task.

