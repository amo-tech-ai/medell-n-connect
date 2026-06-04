---
title: Evals — Overview (mdeai)
source: https://mastra.ai/docs/evals/overview
journeys: [J8, J12]
personas: [Lucía, Sofía, Patricia]
phase: W2+
---

# Scorers overview — mdeai

## At a glance

| | |
|---|---|
| **What it is** | **Scorers** attach to agents or workflow steps and return **numeric scores** (usually 0–1) measuring output quality — relevancy, tool choice, toxicity, faithfulness, etc. |
| **Purpose** | Catch regressions when prompts, models, or tools change — especially “did the agent call the right tool?” and “are cards grounded?” |
| **Goals** | Lucía blocks bad merges; Patricia reviews trends in `mastra_scorers`; Sofía compares prompt/model experiments. |
| **What it does** | Live sampling on runs, trace scoring in Studio, `runEvals` in CI, dataset experiments. |
| **Benefits** | Quantifiable gates beyond “it feels fine”; `tool-call-accuracy` for concierge; datasets version test cases. |
| **mdeai** | Phase 1 quality = **SQL + tool JSON**; scorers formalize that in W2+ (`@mastra/evals`). |

**Official:** [Scorers overview](https://mastra.ai/docs/evals/overview) · package `@mastra/evals`

---

## mdeai scoring surfaces

| Surface | Mechanism | Persona |
|---------|-----------|---------|
| Rental cards | `rental-search-workflow` rerank step + `evaluationAgent` | Camila (indirect) |
| Concierge chat | Live scorers on `conciergeAgent` (Phase 2) | Lucía / Patricia |
| CI | `runEvals` + Vitest F09 | Lucía, Sofía |
| Studio | Trace + experiment UI | Sofía debug |

**CopilotKit:** Scorers run **server-side** on agent/workflow output before or after AG-UI streams — they do not replace Playwright UI tests (J8).

---

## User stories

**Lucía (J8)**  
As Lucía, I want `tool-call-accuracy` ≥ 0.9 on a golden set so a PR that breaks `search-rentals` naming fails CI before merge.

**Sofía (J12)**  
As Sofía, I register scorers on `Mastra({ scorers: { ... } })` and run dataset experiments when we change `gemini-3.5-flash` or concierge instructions.

**Patricia**  
As Patricia, I review `mastra_scorers` weekly for toxicity spikes on `/chat` — sampled live evals, not every message (cost control).

**Camila**  
As Camila, I never see “scores” — I see correct cards; scorers are Sofía/Lucía’s safety net behind the same tool pipeline.

---

## Journey — J12 regression gate (sketch)

1. Dataset `rental-search-golden` — 20 queries + expected tool + min card count.
2. `runEvals({ target: routerAgent or workflow, scorers: [toolCallAccuracy, answerRelevancy] })`.
3. CI fails if `tool-call-accuracy` < 0.95 or `faithfulness` drops vs tool output.
4. Lucía still runs Playwright J8 for UI.

**Related:** [02-built-in-scorers](02-built-in-scorers.md) · [04-running-in-ci](04-running-in-ci.md)
