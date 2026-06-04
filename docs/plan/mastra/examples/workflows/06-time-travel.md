---
title: Workflow — Time travel (mdeai)
source: https://mastra.ai/docs/workflows/time-travel
journeys: [J6]
personas: [Sofía]
phase: 2
---

# Time travel — mdeai

**Official:** [Time travel](https://mastra.ai/docs/workflows/time-travel)

`run.timeTravel({ step, inputData, context })` re-runs from a specific step using stored snapshots or hand-built context — for debug and recovery.

---

## mdeai use cases

| Use case | Example |
|----------|---------|
| Debug failed rerank | Re-run `rerankStep` with fixed `preference` after bugfix |
| Test step in isolation | New run, time-travel to `formatStep` with mock listings |
| Recover after API blip | Re-run `searchStep` only — Supabase was down |
| **Not** prod Camila path | Support tool for Sofía / Patricia |

Requires durable storage ([08-storage](../features/08-storage.md) F13).

---

## User stories

**Sofía (J6)**  
As Sofía, when `rental-search-workflow` failed at rerank after deploy, I `timeTravel({ step: 'rerank', context: savedContext })` in Studio instead of re-running classify + search.

**Patricia**  
As Patricia, I time-travel a suspended publish workflow to the preview step with corrected `resumeData` after Roberto reports wrong ticket price.

---

## Journey — fix rerank without full chat

1. Production run `run-abc` failed — `result.status === 'failed'`.
2. Sofía loads snapshot, patches `preference` in context.
3. `timeTravel({ step: 'rerank', inputData: { cards, preference: 'family' } })`.
4. Compare output in Studio; ship code fix; Camila's next chat uses live workflow.

**CopilotKit:** No browser exposure — ops only.

**Related:** [07-error-handling](07-error-handling.md) · [03-snapshots](03-snapshots.md)
