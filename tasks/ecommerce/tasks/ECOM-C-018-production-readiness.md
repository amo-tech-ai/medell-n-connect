---
id: ECOM-C-018
title: Commerce production readiness checklist
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-016, ECOM-C-017]
blocks: [ECOM-M-001, ECOM-M-002, ECOM-M-009, ECOM-M-010, ECOM-M-011, ECOM-M-012]
skills: [mde-task-lifecycle, building-with-medusa]
official_refs:
  - https://docs.medusajs.com
  - https://docs.stripe.com
  - https://supabase.com/docs/guides/database/postgres/row-level-security
  - https://cloudinary.com/documentation
---

# ECOM-C-018 - Commerce production readiness checklist

## Objective

Gate Core before marketplace work begins.

## Scope

- Add `tasks/ecommerce/docs/commerce-production-readiness.md`.
- Add `mdeapp/scripts/verify-commerce-readiness.mjs`.
- Include env, health, Store API, Stripe webhook, product hydration, Supabase RLS, logs, rollback, and feature flag.

## Acceptance Criteria

- [ ] Readiness checklist exists.
- [ ] Verify script checks required env and smoke endpoints.
- [ ] Commerce UI can be disabled by feature flag.
- [ ] Existing mdeai MVP passes with commerce disabled.
- [ ] Gate says marketplace tasks are blocked until Core proof exists.

## Proof Commands

```bash
cd mdeapp && node --env-file=.env.local scripts/verify-commerce-readiness.mjs
cd mdeapp && npm run lint && npm run typecheck && npm test
```

## Tests

- Unit tests for verifier logic if non-trivial.
- Existing app floor or scoped floor with commerce flag off.

## Rollback

Disable commerce feature flag and remove readiness script/docs.

