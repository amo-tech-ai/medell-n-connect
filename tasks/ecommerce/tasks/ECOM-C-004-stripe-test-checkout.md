---
id: ECOM-C-004
title: Stripe test checkout in Medusa
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-002, ECOM-C-003]
blocks: [ECOM-C-006, ECOM-C-013, ECOM-C-016]
skills: [building-with-medusa, medusa-commerce]
official_refs:
  - https://docs.medusajs.com
  - https://docs.stripe.com/payments/checkout
---

# ECOM-C-004 - Stripe test checkout in Medusa

## Objective

Configure Stripe test checkout through Medusa's commerce lifecycle.

## Scope

- Configure Medusa Stripe payment provider.
- Add commerce-specific webhook config and local proof path.
- Keep existing event ticket and sponsor Stripe code untouched.
- Add a smoke script that verifies a test payment creates a Medusa order.

## Skill Notes

- `building-with-medusa`: mutations must use Medusa workflows/lifecycle, not ad hoc routes.
- Stripe amounts and Medusa prices differ; Medusa prices are display amounts.

## Acceptance Criteria

- [ ] Stripe test checkout can complete.
- [ ] Successful payment creates a Medusa order.
- [ ] Webhook signature uses `COMMERCE_STRIPE_WEBHOOK_SECRET`.
- [ ] Existing ticket/sponsor webhook tests are not modified.

## Proof Commands

```bash
cd commerce/medusa && npm run test:stripe-smoke
stripe listen --forward-to localhost:9000/hooks/stripe
rg -n "STRIPE_WEBHOOK_SECRET|STRIPE_SPONSOR_WEBHOOK_SECRET" commerce/medusa mdeapp/src mdeapp/scripts
```

## Tests

- Medusa integration/smoke test for paid checkout.
- Idempotent webhook replay test if webhook handler is customized.

## Rollback

Disable Stripe provider config and remove commerce webhook additions.

