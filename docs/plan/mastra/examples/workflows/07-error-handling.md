---
title: Workflow — Error handling (mdeai)
source: https://mastra.ai/docs/workflows/error-handling
journeys: [J6, J7]
personas: [Sofía, Patricia]
phase: 1 partial
---

# Error handling — mdeai

**Official:** [Error handling](https://mastra.ai/docs/workflows/error-handling)

Check `result.status` (`success` | `failed` | `suspended` | `tripwire`), use retries, `.branch()` fallbacks, `onFinish` / `onError`, and step-level `bail()`.

---

## mdeai today

| Mechanism | Usage |
|-----------|--------|
| `try/catch` in tools | `search-rentals` returns empty list + log, not throw |
| Workflow retries | Default — add `retries: 3` on Places step (Phase 2) |
| `onError` on workflow | Backlog — alert Patricia on publish pipeline fail |
| Agent `tripwire` | Concierge guardrails (processors) |

`log-agent-run.ts` + `ai_runs` table = Patricia's view when workflow/agent fails (J7).

---

## User stories

**Camila**  
As Camila, if Supabase times out, I still get “Try again in a moment” and zero fake listings — tool returns `{ listings: [] }`, workflow `branch` to friendly message step (Phase 2).

**Sofía**  
As Sofía, `rental-search-workflow` uses `retryConfig: { attempts: 3, delay: 2000 }` on the search step only — not on rerank (deterministic).

**Patricia (J7)**  
As Patricia, `onError` posts to Slack when `host-publish-workflow` fails after Roberto already charged a test card — links `runId` to `ai_runs`.

---

## Journey — branch on search failure

```typescript
// Phase 2 sketch
.branch([
  [({ inputData }) => inputData.listings.length > 0, formatStep],
  [async () => true, emptyResultsStep],
])
```

**CopilotKit:** Failed workflow should still return an AG-UI tool result the UI can render as an error card — not a hung stream.

**Related:** [01-control-flow](01-control-flow.md) · [../streaming/02-events.md](../streaming/02-events.md)
