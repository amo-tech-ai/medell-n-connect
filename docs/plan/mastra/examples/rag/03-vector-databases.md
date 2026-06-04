---
title: RAG — Vector databases (mdeai)
source: https://mastra.ai/docs/rag/vector-databases
journeys: [J11, J10]
personas: [Sofía]
phase: 2
task: VDB-02
---

# Vector databases — mdeai

## At a glance

| | |
|---|---|
| **What it is** | Storage for **embedding vectors** + metadata — query by similarity to a question embedding. |
| **Purpose** | Persist host-doc chunks so retrieval survives redeploys and scales past RAM. |
| **Goals** | One **`PgVector` on Supabase Postgres** with app data; strict index naming; metadata filters by `hostId`. |
| **What it does** | `createIndex({ dimension })`, `upsert({ vectors, metadata })`, `query({ topK, filter })`, `deleteVectors`. |
| **Benefits** | Same `DATABASE_URL` as F13 memory; RLS-adjacent ops discipline; no extra Pinecone bill Phase 2. |
| **mdeai choice** | **`@mastra/pg` `PgVector`** — not separate Pinecone for Phase 2 unless scale demands. |

**Official:** [Vector databases](https://mastra.ai/docs/rag/vector-databases)

---

## mdeai indexes (planned)

| Index | Dimension | Metadata | Consumer |
|-------|-----------|----------|----------|
| `host-docs` | match embed model | `hostId`, `category`, `docId` | `hostEventAgent` |
| `eval-corpus` | same | `suite`, `queryId` | `evaluationAgent` (internal) |

**Naming:** pgvector index names = lowercase + underscores ([docs naming rules](https://mastra.ai/docs/rag/vector-databases)).

---

## User stories

**Sofía (J10 + VDB-02)**  
As Sofía, `host-docs` lives on the same Postgres as `mastra_messages` after F13 — one backup story for Patricia.

**Roberto**  
As Roberto, when I delete an event’s policy upload, `deleteVectors({ filter: { docId } })` removes stale chunks — I do not get last year’s refund text.

**Camila**  
As Camila, no vector index powers rental search — `rentals` table + `search-rentals` tool only.

---

## Journey — upsert after policy edit

1. Roberto replaces PDF v2.
2. Job deletes vectors `docId: 'venue-rules-v1'`.
3. Re-chunk + embed v2 → upsert.
4. Next wizard question hits v2 chunks only.

**CopilotKit:** N/A (storage layer).

**Related:** [04-retrieval](04-retrieval.md) · [../features/08-storage.md](../features/08-storage.md)
