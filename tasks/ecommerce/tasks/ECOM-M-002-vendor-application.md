---
id: ECOM-M-002
title: Vendor application flow
status: Not Started
priority: P1
phase: mvp
depends_on: [ECOM-C-018]
blocks: [ECOM-M-003]
skills: [mde-task-lifecycle]
official_refs:
  - https://supabase.com/docs
  - https://docs.medusajs.com/resources/recipes/marketplace
---

# ECOM-M-002 - Vendor application flow

## Objective

Let prospective vendors apply before receiving Medusa vendor access.

## Scope

- Store vendor applications in Supabase as pre-commerce leads.
- Add application form and review state.
- Do not create Medusa vendor until manual approval.

## Acceptance Criteria

- [ ] Vendor can submit application.
- [ ] Application has pending/approved/rejected states.
- [ ] RLS protects application records.
- [ ] Approval does not automatically enable Connect.

## Proof Commands

```bash
cd mdeapp && npm test -- src/lib/commerce/vendor-applications.test.ts
cd mdeapp && npm run test:e2e -- e2e/commerce-vendor-application.spec.ts --project=chromium --workers=1
```

## Tests

- Vitest application create/list policy.
- Playwright application form.

## Rollback

Feature-flag off vendor applications and drop pre-commerce application table if unused.

