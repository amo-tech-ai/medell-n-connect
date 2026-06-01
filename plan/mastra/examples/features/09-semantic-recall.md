---
title: Feature — Semantic recall (mdeai)
source: https://mastra.ai/docs/memory/semantic-recall
journeys: [J4, J11]
personas: [Tourist, Camila, Roberto]
phase: 2
task: VDB-02
---

# Semantic recall — mdeai

**Official:** [Semantic recall](https://mastra.ai/docs/memory/semantic-recall)

Vector search over past messages — “what did we say about X?” — plus `topK`, `messageRange`, `scope: 'resource'`.

**Catalog:** [`../../04-user-stories.md`](../../04-user-stories.md) § Semantic recall (Phase 2).

**Phase 1 search:** Supabase SQL tools (`search-rentals`, `search-events`) — not embedding recall.

---

## mdeai target architecture

```text
Memory({
  storage: PostgresStore,
  vector: PgVector,
  embedder: fastembed | ModelRouterEmbeddingModel,
  options: { semanticRecall: { topK: 3, messageRange: 2, scope: 'resource' } },
})
```

| Agent | Semantic use |
|-------|----------------|
| `conciergeAgent` | “That restaurant from Tuesday” across `/chat` threads |
| `hostEventAgent` | “Refund policy paragraph we discussed” (with RAG J11) |
| `rentalAgent` | Optional — WM + SQL often enough |

**Do not confuse** with MAP-002 **Grounding** MCP (live Places) — semantic recall is **past conversation**, not live web.

---

## Features & use cases

| Config | mdeai use case |
|--------|----------------|
| `semanticRecall: true` | Default topK for tourist follow-ups |
| `scope: 'resource'` | Camila’s rental prefs across new chat tabs |
| `filter: { projectId }` | Patricia scopes recall to one event ops thread |
| `memory.recall({ vectorSearchString })` | Support UI search box |
| HNSW `indexConfig` on PgVector | Scale at 25K MAU |

---

## User stories

**Tourist (J4)**  
As a Tourist, I ask “the vegan place you mentioned earlier this week” and semantic recall pulls the right turn even after 25 newer messages pushed it out of `lastMessages: 20`.

**Roberto (J11)**  
As Roberto, host policy RAG + semantic recall together find both the uploaded PDF chunk and the chat where I asked about alcohol rules.

**Patricia**  
As Patricia, I disable semantic recall on `pingAgent` smoke tests to avoid embedding cost on every CI run.

---

## Journey — cross-thread tourist recall

1. Monday: Tourist gets `search-restaurants` results → messages embedded.
2. Friday: new thread, same `resourceId` (Camila account or guest cookie).
3. “Was it the one on Provenza?” → `SemanticRecall` retrieves Friday-relevant snippet + `messageRange: 2`.
4. Agent may re-call `search-restaurants` for fresh hours — cards from **tool**, not memory prose.

**CopilotKit:** Still send only new message; recall is server-side.

**Acceptance (VDB-02)**

- [ ] PgVector + embedder on same DB as F13
- [ ] `scope: 'resource'` tested for Camila two-tab scenario

**Related:** [11-observational-memory](11-observational-memory.md) · [../domains/03-restaurants-tourist.md](../domains/03-restaurants-tourist.md) · RAG J11 in [`../../04-user-stories.md`](../../04-user-stories.md)
