---
id: ECOM-C-008
title: Supabase commerce extension tables
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-001]
blocks: [ECOM-C-009, ECOM-M-009, ECOM-M-010, ECOM-M-011, ECOM-M-012]
skills: [db-generate, db-migrate]
official_refs:
  - https://supabase.com/docs
  - https://supabase.com/docs/guides/database/extensions/pgvector
---

# ECOM-C-008 - Supabase commerce extension tables

## Objective

Add Supabase tables for embeddings and links only, with RLS.

## Scope

- Add `commerce_product_embeddings`.
- Add optional sync log table.
- Add later-ready link tables only if needed by follow-on tasks.
- Do not add Supabase product, order, cart, inventory, or price truth.
- Enable RLS and policies.

## Acceptance Criteria

- [ ] RLS is enabled on new tables.
- [ ] No mutable commerce truth table is added to Supabase.
- [ ] Embeddings table stores product id, embedding text, vector, sync checksum, and sync metadata only.
- [ ] Migration has rollback/down notes.

## Proof Commands

```bash
rg -n "create table .*commerce_.*(products|orders|carts|inventory)" supabase/migrations && exit 1 || echo OK
```

## Tests

- RLS checks: anon cannot write embeddings; service role can upsert.
- Supabase migration dry run in local/test project.

## Rollback

Drop only commerce extension/link/vector tables added by this migration.

