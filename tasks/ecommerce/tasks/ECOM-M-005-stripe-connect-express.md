---
id: ECOM-M-005
title: Stripe Connect Express onboarding
status: Not Started
priority: P1
phase: mvp
depends_on: [ECOM-M-001, ECOM-M-003]
blocks: [ECOM-M-006, ECOM-M-007]
skills: [building-with-medusa]
official_refs:
  - https://docs.stripe.com/connect
  - https://docs.stripe.com/connect/express-accounts
---

# ECOM-M-005 - Stripe Connect Express onboarding

## Objective

Add Stripe Connect Express onboarding after Core single-vendor checkout is proven.

## Scope

- Create connected account for approved vendor.
- Store Stripe account id against Medusa vendor.
- Do not store KYC data.
- Show onboarding status.

## Acceptance Criteria

- [ ] Vendor can start Express onboarding in test mode.
- [ ] Connected account id is linked to vendor.
- [ ] Onboarding status can be refreshed.
- [ ] Core checkout still works without Connect enabled.

## Proof Commands

```bash
cd commerce/medusa && npm run build
cd mdeapp && npm test -- src/lib/commerce/connect
```

## Tests

- Stripe mocked API tests.
- Test-mode onboarding smoke if available.

## Rollback

Disable Connect feature flag and stop creating connected accounts.

