---
title: RAG — Retrieval (mdeai)
source: https://mastra.ai/docs/rag/retrieval
journeys: [J11]
personas: [Roberto, Patricia]
phase: 2
---

# RAG retrieval — mdeai

## At a glance

| | |
|---|---|
| **What it is** | At question time: embed the query → **find top-K similar chunks** → optional filter/re-rank → pass text to the LLM. |
| **Purpose** | Give `hostEventAgent` the right policy paragraphs when Roberto asks refund/capacity/alcohol questions. |
| **Goals** | Cite sources; filter by `hostId`; optional re-rank for quality; never use RAG for listing cards. |
| **What it does** | `pgVector.query`, `createVectorQueryTool`, `rerankWithScorer`, metadata filters (`$eq`, `$and`). |
| **Benefits** | Agent decides when to retrieve; hybrid metadata + vector; `PGVECTOR_PROMPT` in instructions. |
| **mdeai** | `hostEventAgent` tool `search_host_policy` (name TBD) — **not** `conciergeAgent` rental path. |

**Official:** [Retrieval](https://mastra.ai/docs/rag/retrieval)

---

## mdeai retrieval patterns

| Pattern | Use |
|---------|-----|
| `createVectorQueryTool` + `hostEventAgent` | Wizard policy Q&A J11 |
| `filter: { hostId: { $eq: sessionHostId } }` | Security — no cross-host leaks |
| `topK: 5`, `minScore: 0.7` | Reduce noise |
| Re-rank with `MastraAgentRelevanceScorer` | Long policy corpus |
| Graph RAG | **Defer** ([05-graph-rag](05-graph-rag.md)) |

---

## User stories

**Roberto (J11)**  
As Roberto, I ask “Can I serve alcohol outdoors?” — agent calls vector tool with `filter: { category: 'alcohol' }` and answers from chunk text + `source` metadata.

**Patricia**  
As Patricia, admin console runs raw `pgVector.query` for support — no CopilotKit, internal only.

**Tourist**  
As a Tourist, restaurant hours come from **Grounding MCP** ([../domains/03-restaurants-tourist.md](../domains/03-restaurants-tourist.md)) — not host-doc RAG.

**Camila**  
As Camila, “cheaper apartment” never hits vector index — `search-rentals` only.

---

## Journey — J11 policy question in wizard

1. Roberto types in CopilotKit sidebar on `/host/event/new`.
2. `hostEventAgent` chooses `search_host_policy` tool.
3. Tool: embed question → query `host-docs` with `hostId` filter.
4. Top chunks in tool result → short answer + optional “Sources” in UI.
5. Working memory `EventDraftState` unchanged unless user edits form fields.

**CopilotKit:** Same as other tools — **tool-result drives UI**, model summarizes briefly.

**Related:** [01-overview](01-overview.md) · [../domains/02-events-hosting.md](../domains/02-events-hosting.md)
