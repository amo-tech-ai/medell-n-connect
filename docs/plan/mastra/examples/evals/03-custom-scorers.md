---
title: Evals — Custom scorers (mdeai)
source: https://mastra.ai/docs/evals/custom-scorers
journeys: [J12]
personas: [Sofía, Lucía]
phase: W2+
---

# Custom scorers — mdeai

## At a glance

| | |
|---|---|
| **What it is** | `createScorer({ id, description, judge })` with pipeline steps: **preprocess → analyze → generateScore → generateReason**. |
| **Purpose** | Encode **mdeai-specific** rules that built-ins do not cover (e.g. rental card schema validity, `bestForLabel` allowed set). |
| **Goals** | One scorer for “listing JSON matches `cardSchema`”; one for “rerank order respects budget filter”. |
| **What it does** | Steps use JavaScript functions and/or LLM prompt objects; results stored in `mastra_scorers`. |
| **Benefits** | Deterministic checks + LLM judgment mixed; `filterRun()` trims tool noise from traces. |
| **mdeai** | Complements `evaluationAgent` instructions with **testable** CI gates. |

**Official:** [Custom scorers](https://mastra.ai/docs/evals/custom-scorers)

---

## mdeai custom scorer candidates

| Scorer id | Checks |
|-----------|--------|
| `mde-rental-card-schema` | Output cards have `id`, `priceLabel`, `sourceUrl`, `scheduleViewingUrl` |
| `mde-tool-output-not-prose` | No markdown listing URLs in text when tools ran |
| `mde-rerank-label-valid` | `bestForLabel` ∈ allowed enum from `evaluationAgent` |
| `mde-ground-truth-location` | `answer-similarity` vs dataset for classify intent |

Use `type: 'agent'` for agent evals; `filterRun({ partTypes: ['tool-invocation', 'text'] })` for tool-heavy runs.

---

## User stories

**Sofía**  
As Sofía, a function-based `mde-rental-card-schema` scorer parses tool JSON and returns 1 only if every card passes Zod — no LLM cost.

**Lucía**  
As Lucía, a custom scorer compares Playwright-captured `toolCallId` to expected tool list for J2 golden paths.

**Patricia**  
As Patricia, LLM `analyze` step flags PII in concierge replies for manual review queue.

---

## Journey — validate rental tool output

1. `runEvals` with `data: [{ input: '2BR Laureles', groundTruth: { tool: 'search-rentals', minCards: 1 } }]`.
2. Custom scorer preprocess: extract last `tool-result` for `search-rentals`.
3. `generateScore`: Zod parse `cards[]` → 0 or 1.
4. CI fails on schema drift in `rental-search-workflow` format step.

**CopilotKit:** Scorer validates the same JSON CopilotKit renders — single source of truth.

**Related:** [04-running-in-ci](04-running-in-ci.md) · [../domains/01-real-estate-rentals.md](../domains/01-real-estate-rentals.md)
