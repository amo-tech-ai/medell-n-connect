---
id: ECOM-C-003
title: Commerce environment contract
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-002]
blocks: [ECOM-C-004, ECOM-C-005, ECOM-C-007]
skills: [mde-task-lifecycle, building-with-medusa]
official_refs:
  - https://docs.medusajs.com
  - https://docs.stripe.com
  - https://cloudinary.com/documentation
  - https://supabase.com/docs
---

# ECOM-C-003 - Commerce environment contract

## Objective

Define commerce-specific environment variables without colliding with existing ticket/sponsor Stripe flows.

## Scope

- Add `tasks/ecommerce/docs/env-commerce.md`.
- Update `.env.example` files only, never real secrets.
- Add `mdeapp/scripts/verify-commerce-env.mjs`.
- Use commerce-specific names such as `MEDUSA_BACKEND_URL`, `MEDUSA_PUBLISHABLE_KEY`, `COMMERCE_STRIPE_SECRET_KEY`, `COMMERCE_STRIPE_WEBHOOK_SECRET`, `COMMERCE_STRIPE_PUBLISHABLE_KEY`, and Cloudinary vars.
- Verify commerce webhook secret is not reusing event ticket or sponsor names.

## Acceptance Criteria

- [ ] Required vars are documented.
- [ ] Verifier fails on missing required commerce vars.
- [ ] Verifier warns if commerce code references ticket/sponsor webhook env names.
- [ ] No secret values are committed.

## Proof Commands

```bash
cd mdeapp && node --env-file=.env.local scripts/verify-commerce-env.mjs
rg -n "COMMERCE_STRIPE|MEDUSA_|CLOUDINARY_" mdeapp/.env.example commerce/medusa/.env.template tasks/ecommerce/docs/env-commerce.md
```

## Tests

```bash
cd mdeapp && npm test -- src/lib/commerce/__tests__/commerce-env.test.ts
```

## Rollback

Remove env example additions, `env-commerce.md`, and the verifier script.

