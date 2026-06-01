---
title: RAG — Overview (mdeai)
source: https://mastra.ai/docs/rag/overview
journeys: [J11]
personas: [Roberto, Sofía, Camila]
phase: 2
task: VDB-02
---

# RAG overview — mdeai

## At a glance

| | |
|---|---|
| **What it is** | A pipeline: **documents → chunks → embeddings → vector store → retrieve at query time** to ground LLM answers. |
| **Purpose** | Answer questions about **long documents** (host contracts, policies) that do not fit in working memory or SQL. |
| **Goals** | Roberto gets cited policy answers; reduce hallucinated refund/ticket rules; keep embeddings in **same Postgres** as app (F13). |
| **What it does** | `MDocument`, `chunk()`, `embedMany()`, `PgVector.upsert()`, `query()` / `createVectorQueryTool`. |
| **Benefits** | Grounded host support; metadata filters per `hostId`; observability on embed/retrieve. |
| **mdeai Phase 1** | **SQL tools** for listings/events; Grounding MCP for live places — **not** doc RAG for Camila cards. |

**Official:** [RAG overview](https://mastra.ai/docs/rag/overview)

---

## Two search systems in mdeai (do not mix)

| Question type | System | Persona |
|---------------|--------|---------|
| “2BR Laureles under $80” | `search-rentals` SQL | Camila |
| “Events this weekend” | `search-events` SQL | Camila |
| “Romantic dinner Provenza tonight” | Grounding / Places MCP | Tourist |
| “What’s our rain refund policy?” | RAG `host-docs` index | Roberto |
| “What did I ask last week?” | [Semantic recall](../features/09-semantic-recall.md) on **chat** | Camila |

---

## User stories

**Roberto (J11)**  
As Roberto, I upload venue rules PDF; RAG retrieves the right chunk when I ask “max capacity for rooftop?” — answer quotes metadata `source: venue-rules.pdf`, not invented policy.

**Camila**  
As Camila, my listing cards always come from `search-rentals` rows — vector similarity never replaces price/URL/RLS.

**Sofía**  
As Sofía, one `PgVector` index on Supabase `DATABASE_URL` serves host RAG and (later) semantic memory — fewer vendors than Pinecone + Postgres.

---

## Journey — J11 host policy Q&A (Phase 2)

1. Roberto uploads PDF → storage bucket.
2. Batch job: chunk + embed → `host-docs` index, metadata `{ hostId, category }`.
3. On `/host/event/new`, `hostEventAgent` has `createVectorQueryTool`.
4. Roberto: “Refund if it rains?” → tool retrieves chunks → Gemini answers with cite.
5. Publish flow still uses CopilotKit HITL — RAG does not auto-publish.

**CopilotKit:** Tool results → generative UI or inline cite card — not free-form policy prose only.

**Related:** [02-chunking-and-embedding](02-chunking-and-embedding.md) · [04-retrieval](04-retrieval.md)
