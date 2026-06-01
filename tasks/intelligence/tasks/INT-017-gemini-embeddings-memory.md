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

## Workflow

```mermaid
sequenceDiagram
    participant EV as Pref change event
    participant GE as gemini-embed.ts
    participant G as Gemini embedContent
    participant DB as user_memory_embeddings

    EV->>GE: summarize pref text
    Note over EV,GE: "Camila: furnished Laureles monthly under $1.2k"
    GE->>G: embedContent(text, gemini-embedding-001)
    G-->>GE: vector 768 dimensions
    GE->>DB: upsert user_id + content + vector
    Note over GE,DB: dimension 768 locked to gemini-embedding-001
    Note over GE,DB: model upgrade needs new column + full re-embed
```

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
# Verify gemini embedding model name BEFORE implementation:
# mcp__gemini-api-docs-mcp__search_docs('embedding models')
cd mdeapp && npx vitest run src/lib/embeddings/ && npx tsc --noEmit
```
