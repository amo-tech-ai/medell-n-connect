---
title: MCP — Overview (mdeai)
source: https://mastra.ai/docs/mcp/overview
journeys: [J9]
personas: [Tourist, Sofía, Camila]
phase: 1 dev / 2 product
---

# MCP overview — mdeai

**Official:** [MCP overview](https://mastra.ai/docs/mcp/overview)

`MCPClient` connects agents to external tool servers; `MCPServer` exposes mdeai agents/tools to other clients.

---

## Two MCP layers in mdeai

| Layer | What | Camila sees? |
|-------|------|--------------|
| **Dev** | `.mcp.json` — Mastra docs, CopilotKit docs, Supabase schema | No — Sofía in IDE |
| **Product** | Grounding Lite MCP tool on `conciergeAgent` | Yes — live restaurant/attraction grounding (MAP-002) |

**Not** the same as `createTool` Supabase search — rentals/events stay SQL tools Phase 1.

---

## Static vs dynamic tools

| Pattern | mdeai |
|---------|-------|
| `await mcp.listTools()` at agent init | MAP-002 when wired |
| `listToolsets()` per request | Phase 2 multi-tenant host API keys |

---

## User stories

**Tourist (J9)**  
As a Tourist, “romantic dinner Provenza” uses Grounding MCP for **current** hours/ratings — cards still render from tool JSON, not model memory.

**Sofía**  
As Sofía, I use Supabase MCP in Cursor to verify RLS before adding a tool — never ship service role to `mdeapp/src`.

**Patricia**  
As Patricia, `requireToolApproval: true` on a future GitHub MCP blocks accidental repo writes from staging concierge.

---

## Journey — J9 grounded restaurant

1. Tourist on `/chat` → `conciergeAgent`.
2. Model calls `search-restaurants` (Places/Grounding MCP).
3. Tool returns normalized places + `FieldMask` cost control.
4. CopilotKit map/card UI from tool result.
5. Follow-up: working memory `lastRestaurantResults` ([09-working-memory-schema](../09-working-memory-schema.md)).

**CopilotKit:** MCP tools appear as normal agent tools over AG-UI — no separate MCP URL in browser.

**Related:** [02-mcp-apps](02-mcp-apps.md) · [../domains/03-restaurants-tourist.md](../domains/03-restaurants-tourist.md) · [../domains/05-google-maps.md](../domains/05-google-maps.md)
