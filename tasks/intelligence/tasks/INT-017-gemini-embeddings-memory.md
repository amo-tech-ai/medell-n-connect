---
id: INT-017
title: Gemini embeddings for memory
phase: ADVANCED
priority: P2
status: Not Started
owner_system: [Gemini]
personas: [Sofia]
depends_on: [VEC-003, INT-016]
unblocks: [INT-018]
linear_title: "INT-017 — Gemini embeddings for memory"
linear_labels: [intelligence, advanced, p2, gemini, embeddings]
implements: []
related_re: []
related_vec: [VEC-003, VEC-004]
---

# INT-017 — Gemini embeddings for memory

## Problem

No pipeline to embed preference summaries into `user_memory_embeddings`.

## User story

As **Sofia**, query and document embeddings use the same model/dimensions (VEC-003).

## Example

Summarize: “Camila prefers furnished Laureles monthly under $1.2k” → `embedContent` → store 768d vector.

## Implementation steps

1. Lock `gemini-embedding-001` @ 768 (VEC-003)
2. Server-only embed helper (edge fn or Mastra tool)
3. `upsert-memory-embedding` on pref change + batch backfill job
4. gemini-api-docs-mcp verify before model name

## Files likely touched

- `mdeapp/src/lib/embeddings/gemini-embed.ts` (new)
- `mdeapp/supabase/functions/embed-user-memory/` (optional)

## Data requirements

`GOOGLE_GENERATIVE_AI_API_KEY` server-side.

## RLS / security

Embed worker uses service role in edge only.

## Tests

- Dimension 768 assert
- Same model for query + doc embed

## Acceptance criteria

- [ ] VEC-003 contract documented in migration comment
- [ ] No `gemini-embedding-2` in prod without migration plan

## Failure points

- Mixed models in same table (invalid distances)

## Dependencies

VEC-003, INT-016

## Verify

```bash
cd mdeapp && npm run test -- src/lib/embeddings/
```
