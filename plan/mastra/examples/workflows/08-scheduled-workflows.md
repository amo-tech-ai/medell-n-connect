---
title: Workflow — Scheduled workflows (mdeai)
source: https://mastra.ai/docs/workflows/scheduled-workflows
journeys: []
personas: [Patricia, Sofía]
phase: 2+ (not Vercel)
---

# Scheduled workflows — mdeai

**Official:** [Scheduled workflows](https://mastra.ai/docs/workflows/scheduled-workflows)

Declare `schedule: { cron, timezone, inputData }` on `createWorkflow` — Mastra fires on cron when a **long-lived** host runs the app.

---

## mdeai stance

| Platform | Scheduled Mastra workflows |
|----------|---------------------------|
| **Vercel** (`mdeapp`) | **Do not** — serverless kills tick loop; use Supabase cron → edge fn |
| **Hostinger VPS** | OK — OpenClaw enrichment, lead nurture |
| **Inngest** | Alternative per official doc — not Phase 1 |

---

## User stories

**Patricia**  
As Patricia, a 9am America/Bogota cron runs `concierge-routing-workflow` over stale leads in CRM — on VPS, not production Vercel.

**Sofía**  
As Sofía, I `pauseSchedule('wf_daily-report')` in Studio when Gemini quota is exhausted — no redeploy.

**Camila**  
As Camila, I never wait on cron — my `/chat` is always on-demand via CopilotKit.

---

## Real-world examples (deferred)

| Cron workflow | Input | Outcome |
|---------------|-------|---------|
| `daily-rental-freshness` | `{ window: 'morning' }` | Flag stale listings |
| `event-reminder-24h` | `{ eventId }` | WhatsApp Phase 2 |
| `evaluation-nightly` | `{}` | Run `evaluationAgent` on sample queries |

---

## Journey — VPS-only schedule

1. `mastra` boots on Hostinger with `LibSQL`/`PG` + `schedule` on workflow.
2. 09:00 fires → `createRun` → steps execute.
3. Patricia views `/workflows/schedules` in Studio.
4. **mdeapp** on Vercel unchanged.

**CopilotKit:** No relation — batch jobs don't use `/api/copilotkit`.

**Related:** [../features/05-workspace.md](../features/05-workspace.md)
