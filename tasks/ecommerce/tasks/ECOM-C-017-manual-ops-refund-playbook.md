---
id: ECOM-C-017
title: Manual ops and refund playbook
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-016]
blocks: [ECOM-C-018]
skills: [mde-task-lifecycle]
official_refs:
  - https://docs.stripe.com/refunds
  - https://docs.medusajs.com
---

# ECOM-C-017 - Manual ops and refund playbook

## Objective

Document how to support, fulfill, refund, and reconcile Core orders manually.

## Scope

- Add `tasks/ecommerce/docs/commerce-ops-playbook.md`.
- Add `tasks/ecommerce/docs/commerce-refund-playbook.md`.
- Include order lookup, refund, webhook failure, stock correction, support handoff, and test/live mode separation.

## Acceptance Criteria

- [ ] Operator can find a Medusa order.
- [ ] Operator can refund a test order.
- [ ] Operator can identify webhook failure symptoms.
- [ ] Support path is documented for CopilotKit and manual handoff.

## Proof Commands

```bash
rg -n "refund|webhook|order lookup|test mode|live mode|support" tasks/ecommerce/docs/commerce-*playbook.md
```

## Tests

Docs-only; optional test refund evidence in the playbook.

## Rollback

Remove the playbook docs.

