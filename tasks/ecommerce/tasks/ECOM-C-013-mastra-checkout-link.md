---
id: ECOM-C-013
title: Mastra checkout_link tool
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-004, ECOM-C-012]
blocks: [ECOM-C-016]
skills: [storefront-best-practices, building-with-medusa]
official_refs:
  - https://docs.medusajs.com
  - https://docs.stripe.com/payments/checkout
  - https://mastra.ai/docs
---

# ECOM-C-013 - Mastra checkout_link tool

## Objective

Create a checkout link/session for a Medusa cart.

## Scope

- Add `checkout_link` Mastra tool.
- Keep checkout creation server-side.
- Return URL and cart/order context only.
- Use commerce-specific Stripe/Medusa env.

## Acceptance Criteria

- [ ] Valid cart returns a test checkout URL.
- [ ] Invalid/empty cart fails safely.
- [ ] Existing event ticket checkout code is not modified.
- [ ] Tool output is safe for CopilotKit and WhatsApp later.

## Proof Commands

```bash
cd mdeapp && npm test -- src/mastra/tools/__tests__/commerce-checkout-link.test.ts
node --env-file=.env.local scripts/smoke-commerce-checkout-link.mjs
```

## Tests

- Vitest for valid/invalid cart.
- Smoke script with Medusa and Stripe test env.

## Rollback

Remove checkout tool and any temporary API route.

