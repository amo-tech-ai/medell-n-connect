---
id: ECOM-C-009
title: Product embedding sync
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-006, ECOM-C-008]
blocks: [ECOM-C-010]
skills: [building-with-medusa, db-migrate]
official_refs:
  - https://docs.medusajs.com
  - https://supabase.com/docs/guides/database/extensions/pgvector
---

# ECOM-C-009 - Product embedding sync

## Objective

Sync Medusa product search text into Supabase pgvector without copying commerce truth.

## Scope

- Build embedding text from Medusa product title, description, tags, and non-price attributes.
- Generate Gemini embeddings.
- Upsert into `commerce_product_embeddings`.
- Store checksum and `synced_at`.
- Add stale-data detector.

## Acceptance Criteria

- [ ] Product sync writes product id and vector.
- [ ] Sync does not write authoritative price, stock, cart, or order data.
- [ ] Failed sync is logged and retryable.
- [ ] Stale products are detectable.

## Proof Commands

```bash
cd mdeapp && node --env-file=.env.local scripts/sync-commerce-embeddings.mjs --dry-run
cd mdeapp && npm test -- src/lib/commerce/embedding-text.test.ts
```

## Tests

- Unit tests for embedding text builder.
- Unit tests for checksum/staleness logic.

## Rollback

Disable sync job/subscriber and truncate `commerce_product_embeddings` if needed.

