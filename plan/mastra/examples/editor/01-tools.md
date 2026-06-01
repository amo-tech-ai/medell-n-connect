---
title: Editor — Tools (mdeai)
source: https://mastra.ai/docs/editor/tools
personas: [Patricia]
phase: 2+
---

# Editor tools — mdeai

**Official:** [Editor tools](https://mastra.ai/docs/editor/tools)

Studio merges **code tools** (`search-rentals`), **integration providers** (Composio/Arcade), and **MCP clients** onto agents with description overrides and display conditions.

---

## mdeai mapping

| Source | Phase 1 | Editor Phase 2 |
|--------|---------|----------------|
| Code tools | `mdeapp/src/mastra/tools/*` | Same — synced from repo |
| MCP | Dev `.mcp.json` only | MAP-002 Grounding on `conciergeAgent` |
| Composio/Arcade | **Off** prod | Patricia experiments in staging |

**Display conditions:** e.g. enable `search-rentals` only when `requestContext.userTier !== 'guest'`.

---

## User stories

**Patricia**  
As Patricia, I override `search-restaurants` description to “Use only for Tourist food questions — never for rentals” without a deploy — after Editor is enabled on staging.

**Sofía**  
As Sofía, code tools remain source of truth in git; Editor overrides are documented in PR when we promote to prod.

**Camila**  
As Camila, I never see Composio GitHub tools — display condition excludes them on `/chat`.

---

## Real-world example

| Tool | Override purpose |
|------|------------------|
| `search-rentals` | “Always return structured listings for map cards.” |
| `classify-intent` | “Prefer event intent when user mentions tickets or fecha.” |

**CopilotKit:** Tool **names** in `useCopilotAction` must still match agent tool ids — Editor renames need runtime sync.

**Related:** [../mcp/01-overview.md](../mcp/01-overview.md)
