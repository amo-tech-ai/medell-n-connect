---
task_id: 011-RE
title: Add Paperclip Approval And Budget Gate For Real Estate AI Actions
phase: HIGH
priority: P1
status: Not Started
estimated_effort: 4 days
area: paperclip-governance
wizard_step: null
skill: [mde-real-estate, mde-task-lifecycle]
subagents: [backend, security, qa]
edge_function: ai-real-estate-actions
schema_tables: [ai_control_events, ai_recommendation_drafts, landlord_inbox]
depends_on: [008-RE, 009-RE, 010-RE]
figma_prompt: null
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** Add Paperclip Approval And Budget Gate For Real Estate AI Actions
> **Why:** Paperclip reports agree that Paperclip should not be first, but should gate risky side effects before broad OpenClaw automation. Existing real-estate prompts do not yet create the first approval/budget gate for AI…
> **Delivers:** `ai-real-estate-actions` edge fn + migrations: `ai_control_events`, `ai_recommendation_drafts`, `landlord_inbox`
> **Tools/Skills:** `mde-real-estate` · `mde-task-lifecycle`
> **HIGH · P1 · Not Started · Effort: 4 days**
> **Depends on:** 008-RE, 009-RE, 010-RE

# Add Paperclip Approval And Budget Gate For Real Estate AI Actions

| Aspect | Details |
|--------|---------|
| **Screens** | Paperclip board/dashboard plus mdeai operator references |
| **Features** | One company/project, approval request, budget cap, correlation IDs, no direct side effects |
| **Edge Functions** | `ai-real-estate-actions`; optional Paperclip bridge/webhook |
| **Tables** | `ai_control_events`, `ai_recommendation_drafts`, `landlord_inbox` |
| **Agents** | Paperclip control plane for Hermes/OpenClaw/Postiz actions |
| **Real-World** | "A risky WhatsApp draft or campaign cannot execute until Paperclip approval is linked back to Supabase." |

## Description

**The situation:** Paperclip reports agree that Paperclip should not be first, but should gate risky side effects before broad OpenClaw automation. Existing real-estate prompts do not yet create the first approval/budget gate for AI actions.

**Why it matters:** Once OpenClaw can send WhatsApp or Hermes can trigger recommendations at volume, mdeai needs a brake: approvals, budget caps, audit trail, and clear ownership.

**What already exists:** `008-RE` creates AI control events and drafts; `009-RE` creates Hermes ranking drafts; `010-RE` proves OpenClaw sandbox intake. Paperclip docs/reports define the narrow MVP: one company, one project, one approval gate, one budget.

**The build:** Configure or document the first Paperclip real-estate company/project and add a bridge path that turns high-risk AI drafts into Paperclip approval requests. Approval decisions must update Supabase control events and unlock only the specific approved action.

**Example:** OpenClaw drafts a WhatsApp message mentioning payment or legal terms. Paperclip receives an approval card. The operator approves or rejects. Supabase stores the Paperclip approval ID and the message remains blocked unless approved.

## Rationale

**Problem:** AI side effects need human governance before production.

**Solution:** Add a minimal Paperclip approval and budget gate linked to Supabase AI control events.

**Impact:** The team can expand AI workflows without losing traceability or budget control.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Operator | approve risky AI actions in one queue | I can prevent bad outbound messages |
| Founder | cap AI spend | I can avoid runaway usage |
| Developer | link approvals to Supabase records | I can debug every automated action |

## Goals

1. **Primary:** Gate risky real-estate AI side effects through Paperclip approval.
2. **Quality:** Approval decisions are idempotent, correlated, and do not bypass Supabase validation.

## Acceptance Criteria

- [ ] Create a Paperclip setup/runbook for one company: `mdeai Real Estate Ops`.
- [ ] Create one project: `Rentals AI Pilot` or equivalent.
- [ ] Define initial budget caps for Hermes ranking and OpenClaw sandbox execution.
- [ ] Define high-risk triggers: non-template WhatsApp, payment/refund language, legal/lease advice, public publish, suspicious listing.
- [ ] Add or document bridge/API path to create Paperclip approval requests from `ai_control_events`.
- [ ] Store Paperclip issue/approval/run IDs back on the Supabase control event or metadata.
- [ ] Rejection keeps action blocked and records the reason.
- [ ] Approval unlocks only the exact idempotency/action key that was reviewed.
- [ ] Add tests or documented smoke proof for approve, reject, duplicate callback, and missing approval ID.
- [ ] Do not configure broad autonomous agent hiring/org charts in this task.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Docs | `tasks/real-estate/paperclip-approval-gate-runbook.md` | Create setup and smoke runbook |
| Backend | `supabase/functions/ai-real-estate-actions/index.ts` | Add approval status/action lock fields if needed |
| Bridge | `supabase/functions/` or service worker | Create or document Paperclip approval request/callback path |
| Tables | `ai_control_events` | Extend metadata/status fields only if needed |
| Tests | Backend/edge tests | Cover approve/reject/idempotency paths |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Paperclip unavailable | Risky action remains blocked and operator can handle manually |
| Approval callback repeats | Idempotency keeps one final decision |
| Approval references wrong action | Backend rejects mismatch |
| Budget cap exceeded | Agent/run is paused or action stays queued |
| Operator rejects message | Draft remains stored, no external send occurs |

## Real-World Examples

**Scenario 1 - Risky WhatsApp:** A draft mentions deposits. **With this implementation,** Paperclip approval is required before OpenClaw can send.

**Scenario 2 - Budget stop:** Hermes ranking burns through the pilot cap. **With this implementation,** the run pauses and the manual workflow still works.

**Scenario 3 - Duplicate callback:** Paperclip sends the approval callback twice. **With this implementation,** Supabase records one approval decision.

## Outcomes

| Before | After |
|--------|-------|
| AI actions have no governance queue | Paperclip approval gate exists |
| Spend controls are only conceptual | Pilot budget caps are documented/tested |
| Approval state may live outside mdeai | Supabase stores linked approval IDs |
| OpenClaw expansion is risky | Broad side effects are blocked until approved |
