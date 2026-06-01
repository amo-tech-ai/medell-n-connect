---
title: Mastra agent examples — index (mdeai)
project: mdeapp
copilotkit: 1.55.2
model: gemini-3.5-flash
updated: 2026-05-21
---

# Mastra agent examples — index

Official Mastra **v0 examples** mapped to **mdeai personas**, **CopilotKit Pattern 1**, and **journeys** in [`../04-user-stories.md`](../04-user-stories.md). **Priority / seq / grades:** [`../index-mastra.md`](../index-mastra.md). Implementation rules: [`../03-best-practices.md`](../03-best-practices.md).

**Production path:** Next.js → `POST /api/copilotkit` → `getLocalAgentsWithLogging({ mastra })` — not raw `curl :4111/api/agents/...` for Camila/Roberto traffic.

| Doc | Mastra example | mdeai journey | Persona | Phase |
|-----|----------------|---------------|---------|-------|
| [01-calling-agents](01-calling-agents.md) | [Calling Agents](https://mastra.ai/examples/v0/agents/calling-agents) | J2, J6 | Sofía, Camila | 1 ✅ |
| [02-system-prompt](02-system-prompt.md) | [System Prompt](https://mastra.ai/examples/v0/agents/system-prompt) | J4, J5 | Tourist, Roberto | 1 / W3+ |
| [03-supervisor-agent](03-supervisor-agent.md) | [Supervisor Agent](https://mastra.ai/examples/v0/agents/supervisor-agent) | J6, Phase 2 | Roberto, Sofía | 1 partial |
| [04-image-analysis](04-image-analysis.md) | [Image Analysis](https://mastra.ai/examples/v0/agents/image-analysis) | J5 | Roberto | W4+ |
| [05-runtime-context](05-runtime-context.md) | [Runtime Context](https://mastra.ai/examples/v0/agents/runtime-context) | J10, J5 | Camila, Patricia | F13 |
| [06-ai-sdk-v5-integration](06-ai-sdk-v5-integration.md) | [AI SDK v5](https://mastra.ai/examples/v0/agents/ai-sdk-v5-integration) | J1 | Sofía | 2 (CK v2) |
| [07-whatsapp-chat-bot](07-whatsapp-chat-bot.md) | [WhatsApp Bot](https://mastra.ai/examples/v0/agents/whatsapp-chat-bot) | — | Camila (future) | 2+ |
| [08-working-memory-template](08-working-memory-template.md) | [Memory template](https://mastra.ai/examples/v0/memory/working-memory-template) | — | Patricia | 2 optional |
| [09-working-memory-schema](09-working-memory-schema.md) | [Memory schema](https://mastra.ai/examples/v0/memory/working-memory-schema) | J2–J5, J10 | Camila, Roberto | 1 ✅ |

### Platform features (docs → mdeai)

| Index | Topics |
|-------|--------|
| [features/00-index](features/00-index.md) | Agents: background tasks, A2A, ACP, signals, workspace, memory |
| [workflows/00-index](workflows/00-index.md) | Control flow, agents+tools, snapshots, suspend, HITL, time-travel, errors, schedules |
| [streaming/00-index](streaming/00-index.md) | Overview, events, workflow stream, background-task stream |
| [editor/00-index](editor/00-index.md) | Studio tools + prompt blocks (Phase 2+) |
| [mcp/00-index](mcp/00-index.md) | MCPClient/Server, MCP Apps |
| [workspace/00-index](workspace/00-index.md) | Filesystem, sandbox, LSP, skills, search (VPS) |
| [rag/00-index](rag/00-index.md) | Host policy RAG — not rental SQL |
| [evals/00-index](evals/00-index.md) | Scorers, CI `runEvals`, datasets, experiments — J12 |

### Browser (Phase 2+)

| Doc | Source | Persona | Phase |
|-----|--------|---------|-------|
| [browser/00-index](browser/00-index.md) | Index | Sofía | 2+ |
| [browser/01-overview](browser/01-overview.md) | [overview](https://mastra.ai/docs/browser/overview) | Lucía | 2+ |
| [browser/02-agent-browser](browser/02-agent-browser.md) | [agent-browser](https://mastra.ai/docs/browser/agent-browser) | Lucía | 2+ |
| [browser/03-browser-viewer](browser/03-browser-viewer.md) | [browser-viewer](https://mastra.ai/docs/browser/browser-viewer) | Sofía | workspace |

### Domain playbooks (verticals)

| Doc | Domain | Persona |
|-----|--------|---------|
| [domains/00-index](domains/00-index.md) | Index + suggested additions | All |
| [domains/01-real-estate-rentals](domains/01-real-estate-rentals.md) | Rentals | Camila |
| [domains/02-events-hosting](domains/02-events-hosting.md) | Events | Roberto |
| [domains/03-restaurants-tourist](domains/03-restaurants-tourist.md) | Restaurants | Tourist |
| [domains/04-contests-deferred](domains/04-contests-deferred.md) | Contests | Deferred |
| [domains/05-google-maps](domains/05-google-maps.md) | Maps + MCP | Camila, Tourist |

## How these relate to CopilotKit

| Mastra example pattern | mdeai equivalent |
|------------------------|------------------|
| `agent.generate()` in workflow/tool | `rental-search-workflow` steps, tools calling helpers |
| `agent.stream({ format: "aisdk" })` | **Defer** — use CopilotKit runtime + [AG-UI](https://docs.copilotkit.ai/mastra/ag-ui) |
| `registerApiRoute` on Mastra server | **Not prod** — webhooks live on Next/Supabase edge |
| `mastraClient.getAgent()` | External client only; product uses in-process `mastra` in API route |

## Repo references

| Need | Path |
|------|------|
| CopilotKit + Mastra (Pattern 1) | `CopilotKit/examples/integrations/mastra/` |
| mdeapp agents | `mdeapp/src/mastra/agents/` |
| Runtime | `mdeapp/src/app/api/copilotkit/route.ts` |
| Legacy Pattern 2 (do not copy to prod) | `/home/sk/mde/my-mastra-app/` |
