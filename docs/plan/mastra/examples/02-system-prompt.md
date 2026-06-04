---
title: Example — Changing the System Prompt (mdeai)
source: https://mastra.ai/examples/v0/agents/system-prompt
journeys: [J4, J5]
personas: [Tourist, Roberto, Camila]
phase: 1
---

# Changing the System Prompt — mdeai

**Official:** [Changing the System Prompt](https://mastra.ai/examples/v0/agents/system-prompt)

Agent `instructions` = default personality and rules. A per-request `system` message in `.generate([{ role: "system", content }], ...)` overrides tone **for one turn** without changing the registered agent.

---

## Feature summary

| Layer | mdeai |
|-------|-------|
| `instructions` | Per-agent file: concierge = multi-intent; `rentalAgent` = rentals-only; `eventAgent` = events |
| Runtime `system` | Phase 2: “You are in rental mode” on `/rentals` vs tourist mode on `/chat` |
| CopilotKit | Sidebar labels + `useCopilotAdditionalInstructions` (if used) — keep aligned with Mastra instructions |

**Phase 1:** English only in `instructions` — no Spanish placeholders ([`CLAUDE.md`](../../../CLAUDE.md)).

---

## User stories

**Tourist (J4)**  
As a Tourist, when I open `/chat` for restaurants, a one-shot system hint (“prioritize grounded Places data, max 5 cards”) keeps `conciergeAgent` from drifting into rental SQL on the same agent.

**Roberto (J5)**  
As Roberto, the host wizard passes a system line “You are filling EventDraftState; never publish without HITL” on publish turns — same agent as sidebar, stricter turn policy.

**Camila**  
As Camila, default `rentalAgent` instructions already enforce “only use search-rentals output for listing URLs” — no per-turn system prompt required in Phase 1.

---

## Real-world mdeai examples

| Agent | Default instructions focus | Optional runtime system |
|-------|---------------------------|-------------------------|
| `conciergeAgent` | Route across rentals, events, restaurants | Tourist vs local focus |
| `rentalAgent` | Laureles/Envigado, ≤5 cards, tool-only IDs | — |
| `hostEventAgent` (W3+) | Wizard + `EventDraftState` | Publish gate reminder |
| `pingAgent` | W1 smoke | — |

**Anti-pattern:** Different system prompt in CopilotKit than Mastra `instructions` — agent behaves differently in Studio vs production sidebar.

---

## Journey — J5 (host event)

1. Roberto opens `/host/event/new` with `agent="hostEventAgent"`.
2. Baseline `instructions` describe wizard tools and HITL.
3. On publish turn, runtime adds `system`: “Wait for user approval via preview tool.”
4. User approves in `renderAndWaitForResponse` UI → tool completes.

**Acceptance**

- [ ] `instructions` stable in `hostEventAgent.ts`
- [ ] Publish turn cannot skip HITL via softer system message alone

---

## CopilotKit note

Prefer **one agent per surface** (`rentalAgent` on `/rentals`, `conciergeAgent` on `/chat`) over heavy per-request system prompts — matches mdeai specialist agents vs Harry Potter voice swapping in the [official example](https://mastra.ai/examples/v0/agents/system-prompt).

**Related:** [`../04-user-stories.md`](../04-user-stories.md) J4, J5
