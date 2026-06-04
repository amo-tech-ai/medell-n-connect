---
title: Workflow — Control flow (mdeai)
source: https://mastra.ai/docs/workflows/control-flow
journeys: [J2, J6]
personas: [Camila, Sofía]
phase: 1
---

# Control flow — mdeai

**Official:** [Control flow](https://mastra.ai/docs/workflows/control-flow)

Steps connect with `.then()`, `.parallel()`, `.branch()`, `.foreach()`, and `.map()` so data stays typed end-to-end.

---

## mdeai today

`rental-search-workflow` is a **linear chain**:

```text
searchStep → formatStep → rerankStep
```

| Principle | mdeai |
|-----------|-------|
| Workflow `inputSchema` = first step input | `neighborhood`, `maxPricePerNight`, `preference`, … |
| Each step `outputSchema` = next step `inputSchema` | `listings[]` → `cards[]` → ranked `cards[]` |
| `.map()` before agent-as-step | Not used yet — all plain `createStep` |

`concierge-routing-workflow` uses **branching** after `classify-intent` to pick rental vs event path (J6).

---

## Features & use cases

| Construct | mdeai use case |
|-----------|----------------|
| `.then()` | Rental search → format cards → rerank labels |
| `.branch()` | Router workflow: intent → rental / event / fallback |
| `.parallel()` | Phase 2: Supabase rentals + Places enrich at once |
| `.foreach()` | Batch reindex host venues (Patricia ops) |
| `.map()` | Shape router output into workflow input |
| `.sleep()` | Defer — use Supabase cron, not Vercel workflow sleep |

---

## User stories

**Camila (J2)**  
As Camila, every “Laureles under $80” query that hits `rental-search-workflow` runs the same three steps — I always get ≤5 cards with `bestForLabel`, not a one-off LLM paragraph.

**Sofía (J6)**  
As Sofía, I add a `.branch()` on `concierge-routing-workflow` so `classify-intent` → `rental-search-workflow` without the concierge model re-deciding routing in prose.

**Patricia**  
As Patricia, I run a `.parallel()` enrichment branch only on staging so production Camila never pays double API cost by accident.

---

## Journey — J2 rental pipeline

1. Router (or tool) starts workflow with `{ neighborhood: "Laureles", maxPricePerNight: 80 }`.
2. **searchStep** calls `searchRentals` (same helper as `rentalAgent` tool).
3. **formatStep** builds card DTOs for CopilotKit generative UI.
4. **rerankStep** applies `preference: "remote_work"` → `bestForLabel` on cards.
5. CopilotKit renders cards from **tool/workflow output**, not chat markdown.

**CopilotKit:** Workflow result surfaces as agent tool result → [tool rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering).

**Related:** [02-agents-and-tools](02-agents-and-tools.md) · [../streaming/03-workflow-streaming.md](../streaming/03-workflow-streaming.md)
