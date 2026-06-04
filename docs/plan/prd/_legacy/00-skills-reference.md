---
title: PRD Part 0 — Skills + MCP Reference (verification cadence)
parent: ../prd.md
sections: 0 (pre-foundation)
---

# PART 0 — Skills + MCP Reference

> [Index](../prd.md) · [Next: Part I — Foundation →](./01-foundation.md)

**Rule:** Before writing any code that touches an external API (CopilotKit, Mastra, Supabase, Gemini, Google Maps), verify the API via the matching skill + MCP listed below. Training data is stale. Skills + MCPs are the ground truth.

## Skill → MCP → Phase ownership matrix

| Skill | MCP server | Use when | Phase verified |
|---|---|---|---|
| [`copilotkit`](../../.claude/skills/copilotkit/) | `copilotkit-docs` (`search-docs`, `search-code`) | Any CopilotKit primitive (provider, action, render, HITL, state) | W1, W3, W4, W6 |
| [`copilotkit-setup`](../../.claude/skills/copilotkit-setup/) | same | Initial bootstrap, framework detection, runtime config | W1 |
| [`copilotkit-integrations`](../../.claude/skills/copilotkit-integrations/) — esp. `references/integrations/mastra.md` | same | Mastra-specific wiring: `MastraAgent.getLocalAgents`, `@ag-ui/mastra` | W1, W3 |
| [`copilotkit-develop`](../../.claude/skills/copilotkit-develop/) | same | Adding chat, tools, shared context, interrupts (note: this skill is v2 — adapt to v1 patterns since we pin 1.55.2) | W2–W10 |
| [`copilotkit-agui`](../../.claude/skills/copilotkit-agui/) | `ag-ui-docs` (`search-ag-ui-docs`) | AG-UI protocol debugging, SSE events, state sync | W4 (HITL), W6 (shared state) |
| [`copilotkit-debug`](../../.claude/skills/copilotkit-debug/) | same | Any "agent not responding" / "CORS" / "events malformed" problem | always — incident response |
| [`mastra`](../../.claude/skills/mastra/) | `mastra-docs` (`searchMastraDocs`, `mastraDocs`, `readMastraDocs`) | Mastra `Agent`, `Memory`, `Tool`, `Workflow` | W1, W3, W5, W6 |
| [`mde-supabase`](../../.claude/skills/mde-supabase/) | `supabase` MCP (`execute_sql`, `apply_migration`, `list_*`) | RLS, schema, RPCs, edge fn deploy | W4, W5, W8, W9 |
| [`supabase-edge-functions`](../../.claude/skills/supabase-edge-functions/) | same | Writing/porting edge fns (`ticket-checkout` W9; `approval-commit` is Phase-1 Next.js API route, not edge fn) | W4, W5, W9 |
| [`mde-vercel`](../../.claude/skills/mde-vercel/) | (uses `vercel` CLI) | Vercel Fluid Compute, Rolling Releases, `vercel.ts`, env push, W10 cutover | W1, W6, W10 |
| [`testing`](../../.claude/skills/testing/) | (Vitest + Playwright tooling) | Vitest unit + Playwright e2e — 0 → 90 test target in `mdeapp/` | W3+, W8 |
| [`mde-stripe`](../../.claude/skills/mde-stripe/) | Stripe API + dashboard | Ticket checkout, webhook signing, separate ticket vs sponsor signing secrets | W9 |
| `gemini-api-docs-mcp` | `gemini-api-docs-mcp` (`search_docs`) | Naming Gemini models (avoid deprecated ones), structured output, tool calling | W1, W3, every model rename |
| `google-maps-code-assist` MCP | `google-maps-code-assist` (`retrieve-google-maps-platform-docs`, `retrieve-instructions`) | Maps API + Places + Grounding Lite | W5, W6 |
| [`mde-task-lifecycle`](../../.claude/skills/mde-task-lifecycle/) | n/a | The 5-phase workflow (plan → research → implement → test → ship) | every task |
| [`mermaid-diagrams`](../../.claude/skills/mermaid-diagrams/) | n/a | Sequence + flowchart diagrams in PRD/tasks | every doc with a diagram |

## Verification cadence (per task)

For each Phase-1 task (see Part VIII §51):

1. **Read** the matching skill above before opening any code
2. **Query MCP** for the specific API you are about to call (one `search-docs` query)
3. **Cross-check** against the actual local file at `/home/sk/mdeai/CopilotKit/examples/integrations/mastra/` (verbatim source)
4. **Implement** only after steps 1–3 agree
5. **Test** with Vitest unit + Playwright e2e (where applicable)
6. **Document** any drift from skill/MCP in the task's `## Notes` section

## Worked example — Task 2 (rewrite `weatherAgent` → `pingAgent`)

1. Open `copilotkit-integrations/references/integrations/mastra.md` — confirms `Agent` shape with `model`, `tools`, `instructions`, `memory: new Memory({ ... workingMemory: { enabled, schema, scope: "thread" } })`
2. Open `mastra` skill — confirms "do not trust internal knowledge" + read installed docs
3. `mcp__mastra__searchMastraDocs` — query `"agent memory working memory zod"` — verify `scope: "thread"` is current API
4. `mcp__gemini-api-docs-mcp__search_docs` — query `"gemini 2.5 flash model id"` — confirm `gemini-3.5-flash` is the current Flash model (not `2.0-flash-exp`)
5. Open `/home/sk/mdeai/CopilotKit/examples/integrations/mastra/src/mastra/agents/index.ts` — confirm the exact Agent constructor signature
6. Write `pingAgent` using `@ai-sdk/google` `google("gemini-3.5-flash")` (env: `GOOGLE_GENERATIVE_AI_API_KEY`)
7. Vitest: `import { mastra } from "@/mastra"; expect(mastra.agents.pingAgent).toBeDefined()`
8. Commit; note "verified via mastra-docs MCP + gemini-api-docs-mcp" in task §Notes

## What to do if MCP is unavailable

If a MCP server is down (it has happened during this session — `copilotkit-docs` timed out twice):

| Fallback | When |
|---|---|
| Read the local skill file | Always — skills are checked into the repo |
| Read the actual example source under `/home/sk/mdeai/CopilotKit/examples/` | When the skill doesn't cover the specific API |
| `npm view @copilotkit/react-core@1.55.2` (and other pinned packages) | When you need exact version metadata |
| Check `node_modules/.../package.json` after install | When verifying which API is actually installed |
| **Do not** rely on training-data knowledge of the API | Mastra `beta` + CopilotKit `v2` move fast |

> [Index](../prd.md) · [Next: Part I — Foundation →](./01-foundation.md)
