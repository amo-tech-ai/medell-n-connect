---
id: ECOM-TASK-INDEX
title: Commerce task index
status: Not Started
priority: P0
phase: core-to-mvp
source_docs:
  - ../docs/ecommerce-implementation-task-plan.md
  - ../docs/ecommerce-prd.md
  - ../docs/ecom-roadmap.md
  - ../docs/commerce-marketplace-master-plan.md
skills_reviewed:
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle
  - /home/sk/mdeai/.agents/skills/storefront-best-practices
  - /home/sk/mdeai/.agents/skills/medusa-commerce
  - /home/sk/mdeai/.agents/skills/db-generate
  - /home/sk/mdeai/.agents/skills/db-migrate
  - /home/sk/mdeai/.agents/skills/building-admin-dashboard-customizations
  - /home/sk/mdeai/.agents/skills/building-with-medusa
---

# Commerce Task Index

This folder converts the commerce docs into executable repo tasks.

First milestone:

```text
AI product search -> CopilotKit product card -> Medusa cart -> Stripe test checkout -> Medusa order
```

## Hard Rules

- Do not build a separate ecommerce frontend.
- Do not fork Medusa core.
- Do not duplicate mutable product, cart, order, price, or inventory truth in Supabase.
- Do not add Stripe Connect before single-vendor checkout works.
- Do not add AI stylist, reviews, creator storefronts, fashion graph, or autonomous WhatsApp automation to Core.
- Medusa mutations must use workflows.
- Medusa module migrations require `npx medusa db:generate <moduleName>` followed by `npx medusa db:migrate`.
- Storefront/admin SDK calls must be verified against official docs before implementation.
- Medusa prices are display amounts, not cents.

## Core Implementation Order

| Order | Task | Title | Depends |
|---:|---|---|---|
| 1 | [ECOM-C-001](./ECOM-C-001-commerce-adr.md) | Commerce architecture decision record | none |
| 2 | [ECOM-C-002](./ECOM-C-002-medusa-service-setup.md) | Medusa service setup | ECOM-C-001 |
| 3 | [ECOM-C-003](./ECOM-C-003-commerce-env-contract.md) | Commerce env contract | ECOM-C-002 |
| 4 | [ECOM-C-004](./ECOM-C-004-stripe-test-checkout.md) | Stripe test checkout in Medusa | ECOM-C-002, ECOM-C-003 |
| 5 | [ECOM-C-005](./ECOM-C-005-cloudinary-media.md) | Cloudinary media provider | ECOM-C-002, ECOM-C-003 |
| 6 | [ECOM-C-006](./ECOM-C-006-demo-catalog.md) | Demo catalog seed | ECOM-C-004, ECOM-C-005 |
| 7 | [ECOM-C-007](./ECOM-C-007-medusa-client-wrapper.md) | Medusa client wrapper in mdeapp | ECOM-C-006 |
| 8 | [ECOM-C-008](./ECOM-C-008-supabase-commerce-extensions.md) | Supabase commerce extension tables | ECOM-C-001 |
| 9 | [ECOM-C-009](./ECOM-C-009-product-embedding-sync.md) | Product embedding sync | ECOM-C-006, ECOM-C-008 |
| 10 | [ECOM-C-010](./ECOM-C-010-mastra-product-search.md) | Mastra product_search tool | ECOM-C-007, ECOM-C-009 |
| 11 | [ECOM-C-011](./ECOM-C-011-mastra-product-detail.md) | Mastra product_detail tool | ECOM-C-007 |
| 12 | [ECOM-C-012](./ECOM-C-012-mastra-cart-tools.md) | Mastra cart tools | ECOM-C-007 |
| 13 | [ECOM-C-013](./ECOM-C-013-mastra-checkout-link.md) | Mastra checkout_link tool | ECOM-C-004, ECOM-C-012 |
| 14 | [ECOM-C-014](./ECOM-C-014-copilotkit-product-card.md) | CopilotKit ProductCard render | ECOM-C-010, ECOM-C-011 |
| 15 | [ECOM-C-015](./ECOM-C-015-cart-state-ui.md) | Minimal cart state UI | ECOM-C-012, ECOM-C-014 |
| 16 | [ECOM-C-016](./ECOM-C-016-e2e-checkout-proof.md) | End-to-end checkout proof | ECOM-C-013, ECOM-C-015 |
| 17 | [ECOM-C-017](./ECOM-C-017-manual-ops-refund-playbook.md) | Manual ops and refund playbook | ECOM-C-016 |
| 18 | [ECOM-C-018](./ECOM-C-018-production-readiness.md) | Production readiness checklist | ECOM-C-016, ECOM-C-017 |

## MVP Implementation Order

Start only after ECOM-C-018 is green.

| Order | Task | Title | Depends |
|---:|---|---|---|
| 19 | [ECOM-M-001](./ECOM-M-001-marketplace-module.md) | Marketplace module from official recipe | ECOM-C-018 |
| 20 | [ECOM-M-002](./ECOM-M-002-vendor-application.md) | Vendor application flow | ECOM-C-018 |
| 21 | [ECOM-M-003](./ECOM-M-003-vendor-admin-invite.md) | Vendor admin invite | ECOM-M-001, ECOM-M-002 |
| 22 | [ECOM-M-004](./ECOM-M-004-vendor-dashboard-v1.md) | Vendor dashboard v1 | ECOM-M-001, ECOM-M-003 |
| 23 | [ECOM-M-005](./ECOM-M-005-stripe-connect-express.md) | Stripe Connect Express onboarding | ECOM-M-001, ECOM-M-003 |
| 24 | [ECOM-M-006](./ECOM-M-006-multi-vendor-order-split.md) | Multi-vendor cart and order split | ECOM-M-001, ECOM-M-005 |
| 25 | [ECOM-M-007](./ECOM-M-007-vendor-payout-visibility.md) | Vendor payout visibility | ECOM-M-005, ECOM-M-006 |
| 26 | [ECOM-M-008](./ECOM-M-008-whatsapp-payment-link.md) | WhatsApp payment link | ECOM-C-016 |
| 27 | [ECOM-M-009](./ECOM-M-009-event-product-links.md) | Event product links | ECOM-C-018 |
| 28 | [ECOM-M-010](./ECOM-M-010-trip-product-links.md) | Trip product links | ECOM-C-018 |
| 29 | [ECOM-M-011](./ECOM-M-011-venue-product-links.md) | Venue product links | ECOM-C-018 |
| 30 | [ECOM-M-012](./ECOM-M-012-basic-commerce-analytics.md) | Basic commerce analytics | ECOM-C-018 |
| 31 | [ECOM-M-013](./ECOM-M-013-featured-listings-pilot.md) | Featured listings pilot | ECOM-M-012 |

## Gate

Stop after Core until this proof exists:

- 1 demo/internal seller.
- 20 products in Medusa.
- Product search hydrates from Medusa before display.
- ProductCard add-to-cart works.
- Stripe test payment succeeds.
- Medusa order exists.
- Supabase stores embeddings/links only.
- Manual support/refund playbook exists.

