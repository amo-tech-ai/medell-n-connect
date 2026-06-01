---
title: RAG — Chunking & embedding (mdeai)
source: https://mastra.ai/docs/rag/chunking-and-embedding
journeys: [J11]
personas: [Roberto, Sofía]
phase: 2
---

# Chunking and embedding — mdeai

## At a glance

| | |
|---|---|
| **What it is** | Split documents into **chunks**, then turn each chunk into a **vector** (embedding) for similarity search. |
| **Purpose** | Fit large PDFs/HTML into small pieces the model can retrieve precisely. |
| **Goals** | Host contracts keep section meaning; control cost with chunk size/overlap; use Gemini-compatible embedder. |
| **What it does** | `MDocument.fromText/HTML/Markdown` → `doc.chunk({ strategy })` → `embedMany({ model })`. |
| **Benefits** | Strategies tuned per format (`semantic-markdown` for policies, `recursive` for plain text). |
| **mdeai** | Roberto venue PDFs + Medellín AI host guidelines; **not** rental listing rows (those stay SQL). |

**Official:** [Chunking and embedding](https://mastra.ai/docs/rag/chunking-and-embedding)

---

## mdeai chunk strategy picks

| Corpus | Strategy | Why |
|--------|----------|-----|
| Host policy PDF (markdown export) | `semantic-markdown` | Keeps header families together |
| Sponsor T&C plain text | `recursive`, size 512, overlap 50 | Simple legal prose |
| Scraped HTML listing (ops only) | `html` | Enrichment QA — not prod RAG for Camila |

**Embedder:** `ModelRouterEmbeddingModel` or `@mastra/fastembed` — align with F13 pgvector dimension (e.g. 768/1536).

---

## User stories

**Roberto (J11)**  
As Roberto, my 40-page venue contract chunks by section so “noise curfew” and “alcohol” land in different retrievable pieces — answers do not blend unrelated clauses.

**Sofía**  
As Sofía, I re-embed only changed docs after policy update — delete vectors by `docId` filter then upsert new chunks.

**Patricia**  
As Patricia, chunk metadata includes `{ hostId, docType, version }` for audit when Roberto disputes an answer.

---

## Journey — ingest Roberto venue PDF

1. PDF → text/markdown (parse skill or edge fn).
2. `MDocument.fromMarkdown(text)`.
3. `chunk({ strategy: 'semantic-markdown', joinThreshold: 500 })`.
4. `embedMany` with project embedder (Gemini policy per CLAUDE.md).
5. `pgVector.upsert({ indexName: 'host-docs', metadata: { hostId, text } })`.

**CopilotKit:** Ingest is **offline** — chat only queries existing index.

**Related:** [03-vector-databases](03-vector-databases.md) · [../workspace/02-filesystem.md](../workspace/02-filesystem.md)
