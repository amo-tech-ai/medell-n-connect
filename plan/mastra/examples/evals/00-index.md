---
title: Mastra evals — index (mdeai)
updated: 2026-05-21
phase: W2+ (F09 Vitest) — partial today
---

# Evals & scorers — index

**Scorers** = automated tests that grade agent outputs (0–1 scores). **Datasets** = saved test cases. **Experiments** = run every case through an agent/workflow and aggregate scores.

**mdeai today:** `evaluationAgent` reranks rental cards in `rental-search-workflow` (rule-based step today; scorer-backed rerank is Phase 2). **Lucía** owns CI + Playwright (J8); **Sofía** wires `runEvals` when F09 lands.

| Doc | Source | Journey | Persona |
|-----|--------|---------|---------|
| [01-overview](01-overview.md) | [overview](https://mastra.ai/docs/evals/overview) | J8, J12 | Lucía, Sofía |
| [02-built-in-scorers](02-built-in-scorers.md) | [built-in-scorers](https://mastra.ai/docs/evals/built-in-scorers) | J12 | Lucía |
| [03-custom-scorers](03-custom-scorers.md) | [custom-scorers](https://mastra.ai/docs/evals/custom-scorers) | J12 | Sofía |
| [04-running-in-ci](04-running-in-ci.md) | [running-in-ci](https://mastra.ai/docs/evals/running-in-ci) | J8, J12 | Lucía, Sofía |
| [05-evals-with-memory](05-evals-with-memory.md) | [evals-with-memory](https://mastra.ai/docs/evals/evals-with-memory) | J10, J12 | Sofía |
| [06-datasets-overview](06-datasets-overview.md) | [datasets/overview](https://mastra.ai/docs/evals/datasets/overview) | J12 | Lucía |
| [07-running-experiments](07-running-experiments.md) | [running-experiments](https://mastra.ai/docs/evals/datasets/running-experiments) | J12 | Sofía |

**Related:** [`../../04-user-stories.md`](../../04-user-stories.md) · [`../workflows/02-agents-and-tools.md`](../workflows/02-agents-and-tools.md) · [`../rag/00-index.md`](../rag/00-index.md) (`06-evaluation-corpus` backlog)

**Backlog:** `08-observability-traces.md` (trace scoring in Studio) · `09-live-scorers-production.md` (sampled toxicity on concierge)
