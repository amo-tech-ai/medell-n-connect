---
title: RAG — GraphRAG (mdeai)
source: https://mastra.ai/docs/rag/graph-rag
journeys: []
personas: [Patricia]
phase: deferred
---

# GraphRAG — mdeai

## At a glance

| | |
|---|---|
| **What it is** | Retrieval that follows **relationships** between chunks (knowledge graph), not only vector similarity. |
| **Purpose** | Answer questions that span multiple linked sections (sponsor doc ↔ event policy ↔ city permit). |
| **Goals** | Useful when mdeai has **many cross-referenced** legal docs — not needed for Phase 2 MVP. |
| **What it does** | `createGraphRAGTool` — vector seed → build graph → traverse by `threshold`. |
| **Benefits** | Finds context vector search misses; tunable `threshold` / `dimension`. |
| **mdeai** | **Deferred** — start with [04-retrieval](04-retrieval.md) + metadata filters. |

**Official:** [GraphRAG](https://mastra.ai/docs/rag/graph-rag)

---

## When mdeai might adopt

| Signal | Action |
|--------|--------|
| Roberto asks questions spanning 3+ uploaded docs with cross-refs | Pilot GraphRAG on `host-docs` |
| Sponsor marketplace (frozen) returns | Graph between sponsor T&C and event contracts |
| Evaluation shows vector-only misses linked clauses | Add `graphQueryTool` beside vector tool |

---

## User stories (future)

**Patricia**  
As Patricia, I ask “Which sponsor tier affects rain refund language?” — GraphRAG traverses sponsor + host policy chunks linked by `eventId`.

**Roberto**  
As Roberto, Phase 2 vector-only is enough for single PDF venue rules — GraphRAG is overkill until we ingest bundles.

---

## CopilotKit

Same tool pattern as vector RAG — defer until product legal corpus justifies complexity.

**Related:** [04-retrieval](04-retrieval.md) · [01-overview](01-overview.md)
