---
id: ECOM-M-003
title: Vendor admin invite
status: Not Started
priority: P1
phase: mvp
depends_on: [ECOM-M-001, ECOM-M-002]
blocks: [ECOM-M-004, ECOM-M-005]
skills: [building-with-medusa]
official_refs:
  - https://docs.medusajs.com/resources/recipes/marketplace/examples/vendors
  - https://docs.medusajs.com
---

# ECOM-M-003 - Vendor admin invite

## Objective

Invite approved vendor admins into the marketplace module.

## Scope

- Add protected admin route/workflow for vendor admin invite.
- Validate ownership/permissions in workflow, not route.
- Use Zod middleware and typed `MedusaRequest`.
- Record invite status.

## Acceptance Criteria

- [ ] Internal admin can invite vendor admin.
- [ ] Vendor admin is linked to one vendor.
- [ ] Unauthorized users cannot invite admins.
- [ ] Mutations happen through workflow steps with rollback.

## Proof Commands

```bash
cd commerce/medusa && npm run build
cd commerce/medusa && npm test -- vendor-admin
```

## Tests

- Protected route tests.
- Workflow rollback/idempotency tests.

## Rollback

Disable invite route and remove pending invites in dev/test.

