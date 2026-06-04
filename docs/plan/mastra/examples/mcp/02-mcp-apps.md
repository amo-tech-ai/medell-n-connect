---
title: MCP — Apps (mdeai)
source: https://mastra.ai/docs/mcp/mcp-apps
personas: [Patricia]
phase: 3+
---

# MCP Apps — mdeai

**Official:** [MCP Apps](https://mastra.ai/docs/mcp/mcp-apps)

Tools can return `ui://` HTML resources — Studio renders sandboxed iframes; apps call `callServerTool()` and `sendMessage()`.

---

## mdeai stance

| Item | Decision |
|------|----------|
| Phase 1 generative UI | **React** `useCopilotAction` render — RentalCard, EventCard |
| MCP Apps iframes | Defer — Lucía/Lucia QA harder; CSP on Vercel |
| `MCPServer` exposing mdeai | Partner integrations Phase 3 |

Roberto's publish preview = **CopilotKit component**, not MCP App calculator pattern from docs.

---

## User stories (future)

**Patricia**  
As Patricia, an internal “lead score” MCP App lets ops drag sliders — results `sendMessage()` into a support agent thread in Studio only.

**Camila**  
As Camila, I never see raw iframes in `/chat` — only first-party cards for trust and mobile performance.

---

## When MCP Apps might fit

- Sponsor ROI calculator (B2B)
- Contest judging rubric (deferred [contests](../domains/04-contests-deferred.md))
- **Not** rental map — use vis.gl + tool output

**CopilotKit:** Prefer native React over MCP App iframe for Phase 1–2.

**Related:** [01-overview](01-overview.md)
