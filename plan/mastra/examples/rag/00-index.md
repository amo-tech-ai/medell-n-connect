---
title: Mastra RAG — index (mdeai)
updated: 2026-05-21
phase: 2 (VDB-02) — Phase 1 = SQL tools
---

# RAG — index

**Retrieval-Augmented Generation** = chunk documents → embed → store in vector DB → retrieve relevant chunks at question time so Gemini answers from **your** text, not memory alone.

**mdeai Phase 1:** Camila’s listings and events come from **`search-rentals` / `search-events`** (Postgres + RLS). RAG is for **Roberto’s host docs** (J11) and Patricia ops — not rental cards.

| Doc | Source | Journey | Persona |
|-----|--------|---------|---------|
| [01-overview](01-overview.md) | [overview](https://mastra.ai/docs/rag/overview) | J11 | Roberto, Sofía |
| [02-chunking-and-embedding](02-chunking-and-embedding.md) | [chunking-and-embedding](https://mastra.ai/docs/rag/chunking-and-embedding) | J11 | Roberto |
| [03-vector-databases](03-vector-databases.md) | [vector-databases](https://mastra.ai/docs/rag/vector-databases) | J11, J10 | Sofía |
| [04-retrieval](04-retrieval.md) | [retrieval](https://mastra.ai/docs/rag/retrieval) | J11 | Roberto |
| [05-graph-rag](05-graph-rag.md) | [graph-rag](https://mastra.ai/docs/rag/graph-rag) | — | Deferred |

**Related:** [../features/09-semantic-recall.md](../features/09-semantic-recall.md) (chat memory, not doc RAG) · [../domains/05-google-maps.md](../domains/05-google-maps.md) (Grounding ≠ RAG)

**Backlog:** `06-evaluation-corpus.md` (`evaluationAgent` golden sets)
