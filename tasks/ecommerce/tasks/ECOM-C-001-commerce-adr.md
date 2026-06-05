---
id: ECOM-C-001
title: Commerce architecture decision record
status: Not Started
priority: P0
phase: core
depends_on: []
blocks: [ECOM-C-002, ECOM-C-008]
skills: [mde-task-lifecycle, building-with-medusa]
source_docs:
  - ../docs/ecommerce-implementation-task-plan.md
  - ../docs/ecommerce-prd.md
official_refs:
  - https://docs.medusajs.com
  - https://docs.medusajs.com/resources/recipes/marketplace
  - https://supabase.com/docs
  - https://docs.stripe.com
---

# ECOM-C-001 - Commerce architecture decision record

## Objective

Create the ADR that locks the commerce boundary before any code lands.

## Scope

- Add `tasks/ecommerce/docs/ADR-commerce-bounded-context.md`.
- Declare Medusa as the owner of products, variants, carts, orders, inventory, payments lifecycle references, and later vendor module data.
- Declare Supabase as the owner of identity, vectors, profiles, links, analytics, and pre-approval vendor applications only.
- Declare mdeai Next.js/CopilotKit as the only storefront.
- Declare Mastra as the orchestration/tool layer.
- Explicitly defer Stripe Connect, multi-vendor, WhatsApp automation, reviews, AI stylist, and creator commerce.

## Skill Notes

- `building-with-medusa`: do not fork Medusa; use modules, workflows, API routes, and links.
- `mde-task-lifecycle`: task must remain traceable through proof and ship gates.

## Acceptance Criteria

- [ ] ADR exists and names the first milestone as single-seller AI commerce proof.
- [ ] ADR says no separate ecommerce frontend.
- [ ] ADR says no mutable product/order/cart/inventory data in Supabase.
- [ ] ADR says Stripe Connect starts only after single-vendor checkout proof.
- [ ] ADR includes rollback and feature-flag strategy.

## Proof Commands

```bash
rg -n "Medusa owns|Supabase owns|separate ecommerce frontend|Stripe Connect" tasks/ecommerce/docs/ADR-commerce-bounded-context.md
```

## Tests

Docs-only. No Vitest or Playwright required.

## Rollback

```bash
rm tasks/ecommerce/docs/ADR-commerce-bounded-context.md
```

