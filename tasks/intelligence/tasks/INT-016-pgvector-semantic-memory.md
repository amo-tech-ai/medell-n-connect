---
id: INT-016
title: pgvector semantic memory
phase: ADVANCED
priority: P2
status: Not Started
owner_system: [pgvector, Supabase]
personas: [Camila]
depends_on: [VEC-001, VEC-002, INT-011]
unblocks: [INT-017, INT-018, INT-019]
linear_title: "INT-016 — pgvector semantic memory"
linear_labels: [intelligence, advanced, p2, pgvector, supabase]
implements: [RE-020]
related_re: [RE-020]
related_vec: [VEC-001, VEC-002]
---

# INT-016 — pgvector semantic memory

## Problem

“Quiet remote work” cannot match “peaceful WiFi rental” without embeddings.

## User story

As **Camila**, semantic recall finds related prefs I never stored as exact keys.

## Example

Query embedding ≈ memory: “prefers calm streets and reliable WiFi”.

## Implementation steps

1. Complete **VEC-001** inventory + duplicate index cleanup
2. **VEC-002** `user_memory_embeddings` + `match_user_memory` RPC (filter in SQL)
3. RLS per [RAG with permissions](https://supabase.com/docs/guides/ai/rag-with-permissions)
4. Mastra tool `retrieve-semantic-memories` OR Mastra semanticRecall (pick one in spike)

## Files likely touched

- `mdeapp/supabase/migrations/*_user_memory_embeddings.sql`
- `mdeapp/src/mastra/tools/retrieve-semantic-memories.ts`

## Data requirements

`vector(768)` per VEC-003.

## RLS / security

**Critical** — vector RPC must filter `user_id` inside function.

## Tests

- RPC returns only own rows
- Wrong dimension rejected at migration

## Acceptance criteria

- [ ] VEC-001/002 Done evidence linked
- [ ] Implements partial [RE-020](../../real-estate/tasks/RE-020-rental-preference-memory.md)

## Failure points

- Duplicate HNSW indexes (VEC-001)
- PostgREST outer filter on RPC (filter inside fn)

## Dependencies

VEC-001, VEC-002, INT-011

## Verify

```bash
# pgvector skill scripts + Supabase MCP
```
