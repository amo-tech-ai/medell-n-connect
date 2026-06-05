---
id: ECOM-M-006
title: Multi-vendor cart and order split
status: Not Started
priority: P1
phase: mvp
depends_on: [ECOM-M-001, ECOM-M-005]
blocks: [ECOM-M-007]
skills: [building-with-medusa]
official_refs:
  - https://docs.medusajs.com/resources/recipes/marketplace
  - https://docs.medusajs.com/resources/recipes/marketplace/examples/vendors
---

# ECOM-M-006 - Multi-vendor cart and order split

## Objective

Allow a paid cart to create vendor-scoped order records.

## Scope

- Follow the official marketplace recipe order-split approach.
- Resolve vendor per line item using module links.
- Use workflows for split mutations and compensation.
- Preserve platform order traceability.

## Acceptance Criteria

- [ ] One cart can contain products from two vendors.
- [ ] Paid checkout creates vendor-scoped order records or equivalent vendor fulfillment records.
- [ ] Platform fee/payout path is compatible with Stripe Connect.
- [ ] If split fails, workflow compensation leaves no partial visible vendor order.

## Proof Commands

```bash
cd commerce/medusa && npm run build
cd commerce/medusa && npm test -- multi-vendor-order-split
```

## Tests

- Integration test with two vendors, two products, one cart, one paid test order.
- Workflow retry/idempotency test.

## Rollback

Enforce one vendor per cart until split workflow is fixed.

