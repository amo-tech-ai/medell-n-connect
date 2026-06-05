---
id: ECOM-M-007
title: Vendor payout visibility
status: Not Started
priority: P1
phase: mvp
depends_on: [ECOM-M-005, ECOM-M-006]
blocks: []
skills: [building-admin-dashboard-customizations]
official_refs:
  - https://docs.stripe.com/connect
  - https://docs.medusajs.com
---

# ECOM-M-007 - Vendor payout visibility

## Objective

Show vendors payout and transfer status without making mdeai the payout source of truth.

## Scope

- Show order amount, platform fee, transfer/payout status.
- Read payment/transfer state from Stripe/Medusa, not a custom ledger.
- Use Medusa admin UI patterns and SDK.

## Acceptance Criteria

- [ ] Vendor sees payout status for own orders only.
- [ ] Amount formatting is correct.
- [ ] Stripe/Medusa remains source of payment truth.
- [ ] Loading and error states exist.

## Proof Commands

```bash
cd commerce/medusa && npm test -- vendor-payout
```

## Tests

- Status mapping unit tests.
- Vendor isolation tests.

## Rollback

Hide payout panel.

