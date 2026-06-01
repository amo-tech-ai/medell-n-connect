---
title: Workflow — Suspend & resume (mdeai)
source: https://mastra.ai/docs/workflows/suspend-and-resume
journeys: [J5]
personas: [Roberto, Sofía]
phase: 1 CK / 2 Mastra
---

# Suspend & resume — mdeai

**Official:** [Suspend & resume](https://mastra.ai/docs/workflows/suspend-and-resume)

`await suspend({ ... })` pauses a step; `run.resume({ step, resumeData })` continues when external input arrives (human, webhook, timer).

---

## mdeai Phase 1 vs Phase 2

| Layer | Roberto publish | Mechanism |
|-------|-----------------|-----------|
| **Phase 1 ✅** | `/host/event/new` | CopilotKit `renderAndWaitForResponse` — agent tool blocks until Roberto clicks |
| **Phase 2** | Same UX, server-owned | Workflow `suspend()` + [snapshots](03-snapshots.md) + API `resume()` |

Camila's rental search **does not** suspend — workflows complete in one run.

---

## Features & use cases

| API | mdeai use case |
|-----|----------------|
| `suspendSchema` | “Publish to calendar?” + event title in suspend payload |
| `resumeSchema` | `{ approved: boolean, approverId }` from auth session |
| `suspendData` on resume | Show Roberto why we paused (“VIP tier added since draft”) |
| `createWorkflowStateReader` | Patricia ops dashboard finds suspended runs |
| `sleep()` / `sleepUntil()` | Ticket sale opens at 9am — prefer Supabase cron on Vercel |

---

## User stories

**Roberto (J5)**  
As Roberto, when I haven’t approved publish yet, the agent must not call Supabase insert — `suspend()` (or CK HITL) holds the line until I confirm.

**Sofía**  
As Sofía, I resume from a Stripe webhook only in Phase 2 — `run.resume({ resumeData: { paymentConfirmed: true } })` after Andrés checks out (ties to [signals](../features/04-signals.md)).

**Lucía**  
As Lucía, E2E tests mock `resume({ approved: true })` on a test workflow — separate from production CK HITL path.

---

## Journey — two-step host approval (sketch)

1. Wizard fills `EventDraftState` (WM + form).
2. Tool `preview_and_publish` → **CK HITL UI** (Phase 1) or `suspend()` (Phase 2).
3. Roberto reviews tiers on generative preview card.
4. Approve → tool returns `{ published: true }` → assistant confirms URL.

**CopilotKit:** `useCopilotAction` with `renderAndWaitForResponse` mirrors tool `suspend` — names must match agent tool id.

**Related:** [05-human-in-the-loop](05-human-in-the-loop.md) · [../domains/02-events-hosting.md](../domains/02-events-hosting.md)
