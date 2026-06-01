---
title: Evals — Running experiments (mdeai)
source: https://mastra.ai/docs/evals/datasets/running-experiments
journeys: [J12]
personas: [Sofía, Lucía]
phase: W2+
---

# Running experiments — mdeai

## At a glance

| | |
|---|---|
| **What it is** | **`dataset.startExperiment`** runs every dataset item through an **agent**, **workflow**, or **scorer** target, then runs **scorers** on outputs. |
| **Purpose** | Batch-compare prompt v2 vs v3, or workflow rerank change vs baseline. |
| **Goals** | Studio UI for non-dev review; async runs for large sets; pin `version` for reproducibility. |
| **What it does** | Persists per-item outputs + scores; `listExperiments` / `compare` in Studio. |
| **Benefits** | `maxConcurrency`, retries, `itemTimeout`; inline `task` for memory-enabled agents. |
| **mdeai** | Experiment `rental-search-workflow` when `evaluationAgent` moves from rules → LLM rerank. |

**Official:** [Running experiments](https://mastra.ai/docs/evals/datasets/running-experiments)

---

## mdeai experiment targets

| targetType | targetId | Scorers |
|------------|----------|---------|
| `workflow` | `rental-search-workflow` | custom card schema + relevancy |
| `agent` | `conciergeAgent` | tool-call-accuracy, toxicity (sampled) |
| `agent` | `evaluationAgent` | prompt-alignment vs groundTruth labels |
| `scorer` | `answer-relevancy` | meta-eval of judge drift |

---

## User stories

**Sofía (J12)**  
As Sofía, I run `startExperiment({ name: 'concierge-prompt-2026-05-21', targetType: 'agent', targetId: 'conciergeAgent' })` after instruction edits — Patricia sees scores without reading git diff.

**Lucía**  
As Lucía, I compare experiment A vs B in Studio before approving a prompt change that affects Camila’s tool choice.

**Roberto**  
As Roberto, host wizard evals stay separate — `hostEventAgent` experiment only after W3 agent exists.

---

## Journey — workflow experiment after rerank change

1. Dataset `rental-search-golden` at version 5.
2. `startExperiment({ targetType: 'workflow', targetId: 'rental-search-workflow', scorers: ['mde-rerank-label-valid'] })`.
3. `summary.results` — per-item scores.
4. Threshold: average ≥ 0.9 to merge PR.

**Memory-enabled agents:** use inline `task` + `metadata.threadId` per [05-evals-with-memory](05-evals-with-memory.md).

**CopilotKit:** Experiments do not replace localhost manual chat — they batch offline checks.

**Related:** [06-datasets-overview](06-datasets-overview.md) · [../workflows/02-agents-and-tools.md](../workflows/02-agents-and-tools.md)
