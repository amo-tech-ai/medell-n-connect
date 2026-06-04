---
title: Workflow — Snapshots (mdeai)
source: https://mastra.ai/docs/workflows/snapshots
journeys: [J5, J10]
personas: [Roberto, Sofía]
phase: F13
---

# Snapshots — mdeai

**Official:** [Snapshots](https://mastra.ai/docs/workflows/snapshots)

When a step calls `suspend()`, Mastra saves a **snapshot** (run state, step outputs, suspend/resume payloads) to `workflow_snapshots` in configured storage.

---

## mdeai today vs target

| Item | Today | After F13 |
|------|-------|-----------|
| `Mastra({ storage })` | `:memory:` LibSQL | **Postgres** (Supabase) |
| Roberto publish pause | CopilotKit HITL only | + Mastra snapshot for server-side resume |
| Redeploy | Suspended runs **lost** | Snapshots survive cold start |

**Phase 1 truth:** Roberto's gate is [`renderAndWaitForResponse`](https://docs.copilotkit.ai/mastra/human-in-the-loop) on `/host/event/new` — snapshots matter when we move publish approval into a **workflow step**.

---

## User stories

**Roberto (J5)**  
As Roberto, if I close the browser mid-publish, my half-filled approval should still exist — `workflow_snapshots` keyed by `runId`, not just React state.

**Sofía (J10)**  
As Sofía, after deploying a hotfix, I `loadWorkflowSnapshot({ runId })` in Studio and confirm Roberto's suspended publish is still `status: suspended`.

**Patricia**  
As Patricia, I audit `suspendPayload.approvers` in snapshots for enterprise hosts who require finance sign-off.

---

## Real-world mapping

Official approval snapshot JSON (`approval-step`, `resumePayload: { confirm, approver }`) maps to:

| Official field | mdeai |
|----------------|-------|
| `requiredApprovers` | `["host", "finance"]` for sponsor tiers (Phase 2) |
| `resumePayload.confirm` | Roberto clicks **Publish** in CopilotKit sheet |
| `output.approved` | Insert into `events` + Stripe products |

---

## Journey — publish with durable snapshot (Phase 2)

1. `host-publish-workflow` reaches `preview-step` → `suspend({ eventId, draft summary })`.
2. Snapshot written to Postgres `workflow_snapshots`.
3. Roberto approves in UI → API `run.resume({ step: 'preview-step', resumeData: { confirm: true } })`.
4. Final step writes Supabase `events` row.

**CopilotKit Phase 1:** HITL without Mastra snapshot — still valid; add snapshots when publish moves server-side.

**Acceptance (F13)**

- [ ] `workflow_snapshots` on same Postgres as `mastra_messages`
- [ ] Serializable suspend metadata only (no huge flyer base64 in snapshot)

**Related:** [04-suspend-and-resume](04-suspend-and-resume.md) · [../features/08-storage.md](../features/08-storage.md)
