---
id: ECOM-C-010
title: Mastra product_search tool
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-007, ECOM-C-009]
blocks: [ECOM-C-014]
skills: [storefront-best-practices]
official_refs:
  - https://mastra.ai/docs
  - https://supabase.com/docs/guides/database/extensions/pgvector
  - https://docs.medusajs.com
---

# ECOM-C-010 - Mastra product_search tool

## Objective

Add a Mastra tool that searches embeddings, then hydrates live products from Medusa.

## Scope

- Add `mdeapp/src/mastra/tools/commerce/product-search.ts`.
- Query Supabase for candidate product ids only.
- Hydrate current price, stock, title, image, and variants from Medusa.
- Return ProductCard DTOs.

## Acceptance Criteria

- [ ] Tool returns live Medusa price and stock.
- [ ] Tool never returns price/stock from Supabase.
- [ ] Unavailable products are excluded or marked unavailable using Medusa data.
- [ ] Tool has deterministic fallback if vector search is unavailable.

## Proof Commands

```bash
cd mdeapp && npm test -- src/mastra/tools/__tests__/commerce-product-search.test.ts
cd mdeapp && npm run dev:agent
```

## Tests

- Vitest with mocked Supabase candidates and Medusa hydration.
- Stale-data test where Supabase text is old but Medusa price wins.

## Rollback

Remove tool registration and tool file.

