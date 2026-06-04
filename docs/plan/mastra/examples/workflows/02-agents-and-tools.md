---
title: Workflow — Agents and tools (mdeai)
source: https://mastra.ai/docs/workflows/agents-and-tools
journeys: [J2, J6]
personas: [Sofía, Camila]
phase: 1
---

# Agents and tools in workflows — mdeai

**Official:** [Agents and tools](https://mastra.ai/docs/workflows/agents-and-tools)

Steps can call **tools** inside `execute()`, compose **agents** as steps, or use `structuredOutput` for typed handoff.

---

## mdeai today

| Pattern | Where |
|---------|--------|
| Tool logic in `execute` | `searchStep` imports `searchRentals` from `tools/search-rentals.ts` |
| Agent-as-step | **Not yet** — `evaluationAgent` rerank could replace rule-based rerank step |
| `structuredOutput` on agent step | Future host copy pipeline (title/summary/tags) |

**Rule:** One implementation of `search-rentals` — shared by `rentalAgent`, `conciergeAgent` tool, and workflow step ([DRY for Sofía](https://mastra.ai/docs/workflows/agents-and-tools)).

---

## User stories

**Sofía**  
As Sofía, when I fix a bug in `search-rentals.ts`, Studio workflow runs and `/chat` tool calls both pick up the fix — no second SQL copy in the workflow file.

**Camila**  
As Camila, I don’t care whether the router called the tool or the workflow — the rental **cards look identical** because format/rerank steps are deterministic.

**Roberto (Phase 2)**  
As Roberto, a workflow step runs `hostEventAgent.generate()` with `structuredOutput: EventDraftSchema` to draft marketing copy, then a human step approves — separate from wizard WM.

---

## Journey — call tool in step vs agent-as-step

**Today (tool in step):**

```typescript
// rental-search-workflow — searchStep
const listings = await searchRentals({ neighborhood, maxPricePerNight, ... });
```

**Future (agent as step):**

```typescript
// sketch — evaluation rerank
const rerankStep = createStep(evaluationAgent, {
  structuredOutput: { schema: rankedCardsSchema },
});
```

**CopilotKit:** Only the **final** structured payload becomes generative UI; intermediate agent prose stays in Studio traces.

**Related:** [01-control-flow](01-control-flow.md) · [../03-supervisor-agent.md](../03-supervisor-agent.md)
