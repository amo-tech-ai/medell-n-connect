---
title: GitHub — Mastra template docs chatbot
repo: https://github.com/mastra-ai/template-docs-chatbot
score: 68
traffic: yellow
journeys: [J11]
personas: [Roberto, Sofía]
---

# template-docs-chatbot

## At a glance

| | |
|---|---|
| **What it is** | Standalone **MCP server** exposing doc tools + Mastra agent consuming them. |
| **Purpose** | Blueprint for **host policy RAG** (J11) — MCP for retrieval, agent for answers. |
| **Goals** | Split: MCP publishes `search_host_policy` tools; `hostEventAgent` calls them. |
| **What it does** | JSON function catalog or custom fetch in `docs-tool.ts`. |
| **Benefits** | Clean boundary between doc index and chat agent — Sofía can rev docs without agent redeploy. |
| **mdeai** | Phase 2 PgVector; Phase 1 policies in prompts only. |

---

## Score: 68/100 🟡

Strong J11 architecture reference; not Phase 1 blocker.

---

## Learn → adapt

| Component | mdeai |
|-----------|-------|
| `src/mcp-server/` | Edge MCP or embedded tools in Mastra |
| `docs-agent.ts` | `hostEventAgent` + faithfulness scorer |
| `functions.json` | Supabase `host_documents` chunks |

**RAG docs:** [`../examples/rag/00-index.md`](../examples/rag/00-index.md).

---

## Domain matrix

| Domain | Fit |
|--------|-----|
| Events | 🟢 Host policy Q&A |
| Rentals | 🟡 Landlord FAQ (Phase 2) |
| Restaurants | — |
| Contests | 🟡 Rules PDF |

---

## User stories

**Roberto:** As Roberto, I ask “refund policy for rain?” and get an answer citing **my** uploaded policy doc — not generic LLM text.

**Sofía:** As Sofía, I version MCP tool schemas when policy PDFs change.

---

## Journey — J11

1. Roberto uploads policy PDF → chunk → PgVector.
2. Wizard question triggers vector tool.
3. Reply includes chunk id in UI.
4. Publish HITL unchanged.

**Catalog:** [`../04-user-stories.md`](../04-user-stories.md) § J11.
