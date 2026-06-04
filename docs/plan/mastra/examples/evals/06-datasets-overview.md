---
title: Evals — Datasets overview (mdeai)
source: https://mastra.ai/docs/evals/datasets/overview
journeys: [J12]
personas: [Lucía, Sofía]
phase: W2+
---

# Datasets overview — mdeai

## At a glance

| | |
|---|---|
| **What it is** | Versioned **collections of test cases** (`input`, `groundTruth`, metadata) stored via `mastra.datasets` API or Studio. |
| **Purpose** | Golden sets for concierge/rentals/host flows — reproducible experiments across prompt/model changes. |
| **Goals** | Lucía owns datasets; Sofía runs experiments; Patricia compares version diffs in Studio. |
| **What it does** | `create`, `addItems`, `listVersions`, `startExperiment` pins a dataset version. |
| **Benefits** | CSV/JSON import; Zod `inputSchema` / `groundTruthSchema`; audit trail per version bump. |
| **mdeai storage** | Same LibSQL/Postgres as F13 when datasets land in CI DB. |

**Official:** [Datasets overview](https://mastra.ai/docs/evals/datasets/overview) · `@mastra/core@1.4.0+`

---

## mdeai dataset ideas

| Dataset name | Items | groundTruth |
|--------------|-------|-------------|
| `rental-search-golden` | Neighborhood + budget queries | `minCards`, `expectedTools` |
| `concierge-intent-golden` | “restaurants in Poblado”, “events this week” | `intent`, `tool` |
| `host-policy-qa` | Policy questions | `expectedCitation` (J11 + RAG) |
| `evaluation-rerank-labels` | userQuery + candidates | ordered `id[]` + labels |

---

## User stories

**Lucía**  
As Lucía, I import 50 rental queries from a CSV after each support week — version bump tracks what changed.

**Sofía**  
As Sofía, I pin experiment to **dataset version 3** when comparing `gemini-3.5-flash` vs a candidate model — apples-to-apples.

**Patricia**  
As Patricia, Studio **Compare Versions** shows who added toxic-query cases to the safety dataset.

---

## Journey — create rental golden set

1. `mastra.datasets.create({ name: 'rental-search-golden', inputSchema, groundTruthSchema })`.
2. `addItems` from JSON file in `mdeapp/src/__tests__/fixtures/`.
3. PR that changes workflow → new experiment → compare scores to main branch.

**CopilotKit:** Dataset inputs are **user messages** or structured workflow inputs — not browser DOM.

**Related:** [07-running-experiments](07-running-experiments.md) · [04-running-in-ci](04-running-in-ci.md)
