---
title: Example — Calling Agents (mdeai)
source: https://mastra.ai/examples/v0/agents/calling-agents
journeys: [J2, J6, J1]
personas: [Sofía, Camila]
phase: 1
---

# Calling Agents — mdeai

**Official:** [Calling Agents](https://mastra.ai/examples/v0/agents/calling-agents)

Mastra registers agents on `Mastra({ agents: { ... } })`. Other code retrieves them with `mastra.getAgent("key")` and calls `.generate()` or `.stream()`.

---

## Feature summary

| Call site | Mastra API | mdeai usage |
|-----------|------------|-------------|
| Workflow step | `execute({ mastra })` → `getAgent().generate()` | **Defer** — steps call tools directly today |
| Tool | `execute({ mastra })` → `getAgent()` | Pattern for Phase 2 sub-agents |
| Mastra Client / HTTP | `POST :4111/api/agents/{id}/generate` | Studio smoke only |
| **CopilotKit UI** | `POST /api/copilotkit` | **Production** — Camila/Roberto |

---

## User stories

**Sofía — Studio smoke**  
As Sofía, I call `conciergeAgent` from Studio chat or `curl :411x/api/agents/conciergeAgent/generate` to verify Gemini before merging — same agent map as CopilotKit.

**Sofía — workflow step (J6)**  
As Sofía, I run `concierge-routing-workflow` where a step uses `mastra.getAgent("routerAgent")` only when we need LLM classification inside a step; today `classify-intent` tool is lighter.

**Camila — indirect call (J2)**  
As Camila, I never call `rentalAgent.generate()` from the browser; CopilotKit runtime invokes the agent when I send “2BR in Laureles.”

---

## Real-world mdeai examples

| Pattern | File / surface |
|---------|----------------|
| Agent registry | `mdeapp/src/mastra/index.ts` — keys: `conciergeAgent`, `rentalAgent`, … |
| `getAgent` in workflow | `workflows/rental-search-workflow.ts` — uses tools, not nested `generate()` yet |
| Product invocation | `api/copilotkit/route.ts` → `MastraAgent.getLocalAgents({ mastra })` |
| Name invariant | `useCoAgent({ name: "conciergeAgent" })` === `mastra.agents` key (not `id: "concierge-agent"`) |

```text
Camila browser → CopilotKit → getLocalAgentsWithLogging → conciergeAgent.generate/stream (in-process)
Sofía Studio   → HTTP :411x        → same agents on disk
```

---

## Journey — J2 (rental search)

1. Camila sends message on `/rentals`.
2. CopilotKit POST `/api/copilotkit` with `agent: "rentalAgent"` or `conciergeAgent`.
3. Agent may call `search-rentals` tool (not `mastra.getAgent` chain).
4. Optional: `routerAgent` workflow path classifies then runs `rental-search-workflow` (headless `generate` on workflow, not nested agents).

**Acceptance**

- [ ] `mastra.getAgent("rentalAgent")` works in Studio
- [ ] Same agent responds via CopilotKit POST 200
- [ ] No production traffic to `:4111` only

---

## CopilotKit note

The [calling-agents](https://mastra.ai/examples/v0/agents/calling-agents) `curl` example is **dev parity**, not Pattern 2 for mdeapp. See [`../03-best-practices.md`](../03-best-practices.md) §Pattern 1.

**Related:** [Calling Agents doc](https://mastra.ai/docs/v0/workflows/agents-and-tools) · Journey map [`../04-user-stories.md`](../04-user-stories.md)
