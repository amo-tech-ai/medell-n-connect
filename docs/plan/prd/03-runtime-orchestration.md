---
doc: 03-runtime-orchestration
purpose: CopilotKit + Mastra + AG-UI; agent roster; workflows
depends_on: 02-core-architecture.md, 07-contracts-schemas.md
replaces: _legacy/03 §12–13, _legacy/05 agents
audience: AI engineers
complexity: L
generates_tasks: F02, F18, F33–F36, router/host/rental agents
---

# 03 — Runtime + orchestration

> [← Core architecture](./02-core-architecture.md) · [Next: Maps →](./04-maps-grounding.md)

## Document spec

| Field | Value |
|-------|-------|
| **Implementation impact** | All agent names, tools, and CK hooks |
| **Tasks** | F02, F18, F33–F36, MAP tool wiring |

---

## 1. Runtime stack (locked)

```text
Browser → CopilotKit 1.55.2 → /api/copilotkit → CopilotRuntime
  → ExperimentalEmptyAdapter → MastraAgent.getLocalAgents({ mastra })
  → Agent (Gemini via @ai-sdk/google)
```

**Env:** `GOOGLE_GENERATIVE_AI_API_KEY` (not `GEMINI_API_KEY` in app code).

**Forbidden:** CopilotKit v2 imports, LangGraph, CrewAI, custom SSE.

---

## 2. CopilotKit primitives

| Primitive | Use |
|-----------|-----|
| `<CopilotKit runtimeUrl="/api/copilotkit">` | Root layout |
| `<CopilotSidebar>` / `/chat` layout | W1 stub → MAP-007 |
| `useCoAgent<T>` | `EventDraftState`, working memory |
| `useCoAgentState<MapState>` | **Read-only** map state |
| `useCopilotAction({ render })` | Cards mirror agent tools |
| `useCopilotAction({ renderAndWaitForResponse })` | HITL publish, showing |
| `useCopilotReadable` | Auth role context |

---

## 3. Agent roster (MVP — max 4)

| Agent | Key | When | Tools/workflows |
|-------|-----|------|-----------------|
| **ping** | `pingAgent` | W1 only / smoke | echo |
| **router** | `routerAgent` | `/chat` | classify → dispatch workflow |
| **host event** | `hostEventAgent` | `/host/event/new` | form-fill tools + publish HITL |
| **concierge** | `conciergeAgent` | `/chat` general | thin; defer heavy tools until MAP ready |

**Not MVP agents (use workflows/tools on router):** Vendor, Marketing, Landlord Assistant, Lease Review, Maps*, EventAnalytics*, **`evaluationAgent`** (offline eval only — do not register in `Mastra({ agents })` for Phase 1), **`eventAgent` / `rentalAgent`** as separate agents (use workflows on router instead).

`*` Maps “agents” in maps-prd §6.6 = **tools**, not separate Agent instances.

---

## 4. Workflows (preferred over new agents)

| Workflow | Input | Output |
|----------|-------|--------|
| `rental-search` | filters + thread | `ToolResponse` + rental pins |
| `venue-discovery` | host venue query | places + draft venue fields |
| `nearby-intel` | lat/lng + category | POI pins + cards |
| `grounded-search` | natural language geo query | grounded cards + pins |

Implement as Mastra workflows calling Zod-validated tools — not LLM-only chains.

---

## 5. Working memory sync (3 places)

1. Zod schema in agent file  
2. `src/lib/types.ts` (or `platform/contracts`)  
3. `useCoAgent<T>` in page  

**CI rule:** names must match `Mastra({ agents: { key } })` ↔ `useCoAgent({ name })`.

---

## 6. Tool design rules

- Every tool returns **`ToolResponse`** ([07](./07-contracts-schemas.md))  
- Geo fields only from Places/Grounding/Supabase reads  
- No `??` default on required tool inputs (silent wrong data)  
- Log to `agent_tool_calls` / `ai_runs`  

---

## 7. Memory & storage

| Env | Storage |
|-----|---------|
| Dev | LibSQL in-memory (`mastra/index.ts`) |
| Prod path | Postgres via F13 (`mastra_*` tables) |

Camila’s multi-turn context must survive redeploy in prod — not required for MAP-001 proof.

---

## 8. Repo truth

| Built | Missing |
|-------|---------|
| `pingAgent`, copilotkit route | `routerAgent`, workflows, host agent |

---

## 9. Reference

- Example: `CopilotKit/examples/integrations/mastra/`  
- Skills: `copilotkit-integrations`, `copilotkit-debug`, `mastra-smoke-test`
