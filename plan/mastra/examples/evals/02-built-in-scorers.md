---
title: Evals — Built-in scorers (mdeai)
source: https://mastra.ai/docs/evals/built-in-scorers
journeys: [J8, J12]
personas: [Lucía, Sofía]
phase: W2+
---

# Built-in scorers — mdeai

## At a glance

| | |
|---|---|
| **What it is** | Pre-built scorers from `@mastra/evals/scorers/prebuilt` — relevancy, hallucination, `tool-call-accuracy`, toxicity, etc. |
| **Purpose** | Use proven judges instead of writing every scorer from scratch. |
| **Goals** | Fast CI adoption; consistent 0–1 metrics comparable across Mastra projects. |
| **What it does** | `createAnswerRelevancyScorer`, `createToxicityScorer`, … attached with `sampling.rate`. |
| **Benefits** | `tool-call-accuracy` directly guards Camila’s tool-card pipeline; `trajectory-accuracy` for router+workflow paths. |
| **mdeai picks** | See table below — Gemini judge model must match project policy when enabled. |

**Official:** [Built-in scorers](https://mastra.ai/docs/evals/built-in-scorers)

---

## mdeai scorer matrix

| Scorer | Agent / step | Why |
|--------|--------------|-----|
| **`tool-call-accuracy`** | `conciergeAgent`, `routerAgent` | Wrong tool = wrong cards (J12) |
| **`answer-relevancy`** | `conciergeAgent` | Reply matches user intent |
| **`faithfulness`** | `hostEventAgent` (with RAG context) | Policy answers cite chunks (J11) |
| **`hallucination`** | `conciergeAgent` | No fake listing URLs |
| **`toxicity`** | `conciergeAgent` | Safety on `/chat` (sampled) |
| **`completeness`** | `hostEventAgent` | Wizard answers cover required fields |
| **`trajectory-accuracy`** | `concierge-routing-workflow` | classify → correct workflow |
| **`prompt-alignment`** | `evaluationAgent` | Labels match user preference text |

**Not used on:** `pingAgent` smoke (too noisy for CI cost).

---

## User stories

**Lucía**  
As Lucía, `tool-call-accuracy` with `expectedTool: 'search-rentals'` catches when the model answers Laureles in prose without calling the tool.

**Sofía**  
As Sofía, `sampling: { rate: 0.1 }` on toxicity in staging catches bad prompt experiments without scoring every dev ping.

**Roberto**  
As Roberto, `faithfulness` on `hostEventAgent` only runs when RAG tool returned chunks — score ties to real policy text.

---

## Example attach (Phase 2 sketch)

```typescript
import { createToolCallAccuracyScorer, createToxicityScorer } from '@mastra/evals/scorers/prebuilt'

export const conciergeAgent = new Agent({
  scorers: {
    toolAccuracy: {
      scorer: createToolCallAccuracyScorer({ model: 'google/gemini-3.5-flash' }),
      sampling: { type: 'ratio', rate: 1 }, // CI dataset uses 100%
    },
    safety: {
      scorer: createToxicityScorer({ model: 'google/gemini-3.5-flash' }),
      sampling: { type: 'ratio', rate: 0.05 }, // 5% prod sample
    },
  },
})
```

**CopilotKit:** Scorers do not change AG-UI event types — failed score → log/alert, user still sees stream unless you add app-level guard.

**Related:** [03-custom-scorers](03-custom-scorers.md) · [01-overview](01-overview.md)
