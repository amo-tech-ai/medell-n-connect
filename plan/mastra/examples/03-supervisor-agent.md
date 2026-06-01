---
title: Example — Supervisor Agent (mdeai)
source: https://mastra.ai/examples/v0/agents/supervisor-agent
journeys: [J6, J5]
personas: [Sofía, Roberto]
phase: 1-partial
---

# Supervisor Agent — mdeai

**Official:** [Supervisor Agent](https://mastra.ai/examples/v0/agents/supervisor-agent)

A **publisher** agent owns tools that wrap **copywriter** and **editor** sub-agents (`getAgent` + `generate` inside `createTool`). One orchestrator, specialized workers, no Mastra `.network()` required.

---

## Feature summary

| Official piece | mdeai analogue |
|----------------|----------------|
| `copywriterAgent` + `copywriterTool` | `rentalAgent` + `search-rentals` (tool wraps data, not another agent) |
| `editorAgent` + `editorTool` | `evaluationAgent` rerank (Phase 2: LLM judge step) |
| `publisherAgent` with both tools | `routerAgent` + workflows OR future `hostPublisherAgent` |
| Tools call `mastra.getAgent()` | Pattern for **host marketing** pipeline (Phase 2) |

**Phase 1:** Orchestration = **workflows** (`rental-search-workflow`) + **concierge tools**, not publisher-with-nested-generates.

---

## User stories

**Sofía — router vs supervisor (J6)**  
As Sofía, `routerAgent` dispatches to workflows deterministically; I only adopt the supervisor **tool-wraps-agent** pattern when Roberto needs “draft copy → edit → preview” as separate LLM passes.

**Roberto — event marketing (Phase 2)**  
As Roberto, a `publisherAgent`-style host helper calls `copywriterTool` (blurb from `EventDraftState`) then `editorTool` (tone check) before `preview_and_publish` HITL.

**Camila**  
As Camila, I do **not** need three nested agents for rentals — one `conciergeAgent` + `search-rentals` is enough (avoid supervisor latency/cost).

---

## Real-world mdeai examples

| Pattern | Today | Supervisor-style future |
|---------|-------|-------------------------|
| Single agent + tools | `conciergeAgent` + 4 search tools | — |
| Workflow pipeline | `rental-search-workflow` (search → format → rerank) | Add agent-as-step for LLM rerank |
| Nested `getAgent` in tool | Not used | `hostCopyTool` → `hostCopyAgent` |

```text
Official:  publisherAgent → copywriterTool → copywriterAgent.generate()
mdeai W1:  routerAgent → rental-search-workflow → searchRentals() (no nested agent)
mdeai W4+: hostPublisherAgent → draftTool → hostCopyAgent (optional)
```

---

## Journey — J6 (router)

1. Power message on `/chat` with `routerAgent`.
2. `classify-intent` → `rental-search-workflow` (deterministic steps).
3. **Not** publisher calling copywriter+editor agents — unless we add marketing prose path.

**Acceptance**

- [ ] Workflow path returns ≤5 cards without nested agent round-trips
- [ ] Document when to introduce supervisor tools (host only)

---

## CopilotKit note

Supervisor pattern runs **inside** Mastra; CopilotKit still exposes **one** `agent` key to the UI (`routerAgent` or `conciergeAgent`). Sub-agents are implementation details — do not register copywriter/editor as separate CopilotKit agents unless product needs separate sidebars.

**Related:** [Agent Networks](https://mastra.ai/docs/v0/agents/networks) (heavier than supervisor) · [`03-supervisor-agent` vs router in `../04-user-stories.md`](../04-user-stories.md)
