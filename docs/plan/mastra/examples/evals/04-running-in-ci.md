---
title: Evals — Running in CI (mdeai)
source: https://mastra.ai/docs/evals/running-in-ci
journeys: [J8, J12]
personas: [Lucía, Sofía]
phase: W2 (F09 Vitest)
---

# Running scorers in CI — mdeai

## At a glance

| | |
|---|---|
| **What it is** | `runEvals({ data, target, scorers })` runs many **input / groundTruth** pairs through an agent or workflow and returns **aggregate scores**. |
| **Purpose** | Block PRs that break routing, tools, or card shape — complement Playwright. |
| **Goals** | F09 Vitest in `mdeapp`; golden files in repo; thresholds in CI config. |
| **What it does** | Each item calls `agent.generate` or workflow; scorers run; `result.scores['scorer-id']` averaged. |
| **Benefits** | Faster than full E2E; reproducible numbers in PR comments. |
| **mdeai** | Pairs with J8 — CI unit evals + Playwright smoke. |

**Official:** [Running scorers in CI](https://mastra.ai/docs/evals/running-in-ci)

---

## mdeai CI layout (target F09)

```text
mdeapp/src/__tests__/
  smoke.test.ts          # agents register (today)
  evals/
    rental-search.eval.ts   # runEvals on rental-search-workflow
    concierge-tools.eval.ts
```

**Targets:**

| Target | What we test |
|--------|----------------|
| `rental-search-workflow` | Card count, schema, rerank labels |
| `conciergeAgent` | Tool choice on fixed prompts |
| `routerAgent` | Intent → workflow dispatch (mock DB) |

---

## User stories

**Lucía (J8 + J12)**  
As Lucía, `npm run test` runs `runEvals` thresholds **and** Playwright — either can fail the PR.

**Sofía**  
As Sofía, I add a row to `rental-search-golden.json` every time we fix a Camila bug — dataset grows over time.

**Camila**  
As Camila, CI failures prevent broken deploys — I never interact with eval files.

---

## Example test (sketch)

```typescript
import { describe, it, expect } from 'vitest'
import { runEvals } from '@mastra/core/evals'
import { rentalSearchWorkflow } from '@/mastra/workflows/rental-search-workflow'
import { toolCallAccuracyScorer } from './scorers/tool-call-accuracy'

describe('rental-search workflow evals', () => {
  it('returns grounded cards for Laureles query', async () => {
    const result = await runEvals({
      data: [
        {
          input: { neighborhood: 'Laureles', maxPricePerNight: 80, minBedrooms: 2 },
          groundTruth: { minCards: 1 },
        },
      ],
      target: rentalSearchWorkflow,
      scorers: [toolCallAccuracyScorer],
    })
    expect(result.summary.totalItems).toBe(1)
  })
})
```

**CopilotKit:** Evals hit Mastra directly — no browser. Playwright still validates `/api/copilotkit` integration.

**Related:** [06-datasets-overview](06-datasets-overview.md) · [05-evals-with-memory](05-evals-with-memory.md)
