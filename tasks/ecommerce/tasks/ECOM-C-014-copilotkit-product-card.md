---
id: ECOM-C-014
title: CopilotKit ProductCard render
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-010, ECOM-C-011, ECOM-C-005]
blocks: [ECOM-C-015, ECOM-C-016]
skills: [storefront-best-practices]
official_refs:
  - https://docs.copilotkit.ai
  - https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra
  - https://docs.medusajs.com
---

# ECOM-C-014 - CopilotKit ProductCard render

## Objective

Render AI product results as ProductCards in the existing mdeai/CopilotKit UI.

## Scope

- Add `mdeapp/src/components/commerce/ProductCard.tsx`.
- Register product search render path in existing CopilotKit/Mastra render system.
- Card supports image, title, price, availability, variant strategy, view detail, and add to cart.
- Keep UI compact and mobile safe.

## Skill Notes

- Product card uses semantic HTML and accessible buttons.
- Product image has alt text and lazy loading where appropriate.
- Fashion products with sizes must not silently add the wrong variant; choose a deliberate variant strategy.

## Acceptance Criteria

- [ ] ProductCard renders from `product_search` DTO.
- [ ] Price/stock are Medusa-hydrated.
- [ ] Add-to-cart action is visible and has loading/error states.
- [ ] Mobile touch targets are at least 44px.
- [ ] No new storefront route is created.

## Proof Commands

```bash
cd mdeapp && npm test -- src/components/commerce
npm run test:e2e -- e2e/commerce-product-card.spec.ts --project=chromium --workers=1
```

## Tests

- Vitest component test.
- Playwright render test.

## Rollback

Remove ProductCard component and render registration.

