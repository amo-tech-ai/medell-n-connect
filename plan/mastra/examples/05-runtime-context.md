---
title: Example — Runtime Context (mdeai)
source: https://mastra.ai/examples/v0/agents/runtime-context
journeys: [J10, J5, J2]
personas: [Camila, Roberto, Patricia]
phase: F13
---

# Runtime Context — mdeai

**Official:** [Runtime Context example](https://mastra.ai/examples/v0/agents/runtime-context) · [Docs](https://mastra.ai/docs/v0/server-db/runtime-context)

One agent definition; per-request `RuntimeContext` switches model, tools, memory, instructions, and processors — like tiered SaaS support in the official sample.

---

## Feature summary

| `runtimeContext` key | Set from | mdeai effect |
|----------------------|----------|--------------|
| `user-tier` | Supabase profile | Tool limits, model tier (future) |
| `host-id` | Auth on `/host/*` | RLS in tools |
| `locale` | User pref | English Phase 1 |
| `surface` | Pathname middleware | `rentals` vs `chat` vs `host` |
| `copilotkit-pattern` | Constant | `ai_runs` logging |

**Not memory:** Context is per request; working memory persists across turns ([`../04-user-stories.md`](../04-user-stories.md) J10).

---

## User stories

**Camila (J10)**  
As Camila, my Supabase user id is `resource` in memory and `host-id` is absent on rental paths — runtime context enforces rental-only tools on `/rentals`.

**Roberto (J5)**  
As Roberto, `runtimeContext.set("host-id", orgId)` scopes event tools to his organization; enterprise tier enables extra workflow steps (official example’s dynamic `tools` callback).

**Patricia**  
As Patricia, support replays a thread with the same `runtimeContext` snapshot logged in `ai_runs` metadata (Phase 2).

---

## Real-world mdeai examples

| Official dynamic field | mdeai Phase 1 | Phase 2 |
|------------------------|---------------|---------|
| `instructions({ runtimeContext })` | Static per agent file | Surface-aware concierge |
| `model({ runtimeContext })` | All `gemini-3.5-flash` | Pro for heavy host forms |
| `tools({ runtimeContext })` | Fixed per agent | + Grounding MCP on tourist tier |
| `memory({ runtimeContext })` | `createThreadMemory` | Postgres tiers |

**Wire point:** `mdeapp/src/app/api/copilotkit/route.ts` builds `RuntimeContext` from session + route headers before `getLocalAgentsWithLogging`.

---

## Journey — F13 + runtime

1. User signs in → `resource` = auth user id.
2. Middleware sets `surface: "chat" | "rentals" | "host"`.
3. CopilotKit POST includes context → agent sees correct tools/instructions.
4. Memory thread id = CopilotKit session id.

**Acceptance**

- [ ] No service-role in `runtimeContext` from browser
- [ ] Free vs pro tool sets documented before enabling billing

---

## CopilotKit note

Pass context in the **server** CopilotRuntime handler, not in client-exposed secrets. Mirror official [support agent](https://mastra.ai/examples/v0/agents/runtime-context) pattern without duplicating three physical agents in the CopilotKit provider — unless UX needs separate `agent=` keys per tier.

**Related:** [`../04-user-stories.md`](../04-user-stories.md) server section · Example index [00-index](00-index.md)
