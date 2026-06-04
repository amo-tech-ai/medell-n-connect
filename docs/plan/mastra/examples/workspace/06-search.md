---
title: Workspace — Search & indexing (mdeai)
source: https://mastra.ai/docs/workspace/search
personas: [Patricia, Roberto]
phase: 2+
---

# Workspace search — mdeai

## At a glance

| | |
|---|---|
| **What it is** | **Index + query** over workspace files — BM25 keywords, vector semantic, or hybrid. |
| **Purpose** | Find the right paragraph in host policies / runbooks without sending every file to the LLM. |
| **Goals** | Cheaper than full RAG pipeline for **internal** doc sets; complements [Mastra RAG](../rag/00-index.md) for product KB. |
| **What it does** | `workspace.index()`, `autoIndexPaths`, `workspace.search()`; agent search tools when configured. |
| **Benefits** | BM25 for exact policy IDs; vector for “how do refunds work?”; hybrid default. |
| **mdeai** | Internal ops + host doc **staging**; Camila rentals still **SQL** `search-rentals`. |

**Official:** [Search and indexing](https://mastra.ai/docs/workspace/search)

---

## Workspace search vs product RAG

| | Workspace search | Mastra RAG + PgVector |
|--|------------------|---------------------|
| **Corpus** | Files in workspace mount | Chunks in `host-docs` index |
| **Consumer** | Ops agent on VPS | `hostEventAgent` tool |
| **Camila** | No | No (J11 Roberto only) |

---

## User stories

**Patricia**  
As Patricia, I `autoIndexPaths: ['support/faq']` and ask the ops agent “refund policy rain” — BM25 hits the exact FAQ slug.

**Roberto (J11)**  
As Roberto, host PDFs are **RAG**-embedded into pgvector after workspace search finds duplicate sections to dedupe before ingest.

**Sofía**  
As Sofía, hybrid search on `plan/prd/` helps draft task specs — dev machine only.

---

## Journey — FAQ before external RAG

1. Drop `support/*.md` into workspace.
2. `await workspace.init()` indexes paths.
3. `workspace.search('ticket transfer', { topK: 5, mode: 'hybrid' })`.
4. Top chunks feed human review → then formal RAG upsert.

**CopilotKit:** N/A.

**Related:** [../rag/04-retrieval.md](../rag/04-retrieval.md) · [../domains/02-events-hosting.md](../domains/02-events-hosting.md)
