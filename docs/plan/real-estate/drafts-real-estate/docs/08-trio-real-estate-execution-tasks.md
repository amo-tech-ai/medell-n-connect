# Real Estate Trio Execution Tasks

**Status:** post-manual-beta backlog  
**Owner:** real-estate platform / automation  
**Source docs:** `tasks/audit/29-tasks-audit.md`, `tasks/prompts/real-estate/001-007`, `tasks/trio/07-trio-plan.md`, `tasks/prompts/advanced/12A-trio-integration-contract.md`

This document exists because the real-estate folder had architecture/research notes for Paperclip, OpenClaw, Hermes, and Postiz, but no execution-grade task list. These tasks are intentionally **not** prerequisites for the first manual rentals beta. They start only after the public lead loop works and there is real lead volume.

## Phase Gate

Do not start Paperclip/OpenClaw/Hermes/Postiz real-estate automation until these launch tasks are complete:

| Required first | Why |
|---|---|
| `tasks/prompts/real-estate/001-wire-public-contact-loop.md` | Public listing contact must work before automating follow-up. |
| `tasks/prompts/real-estate/002-fix-rentals-api-contract.md` | Search/detail data must be trustworthy before agents use it. |
| `tasks/prompts/real-estate/003-verify-landlord-linked-inventory.md` | Automation needs real landlord-linked inventory. |
| `tasks/prompts/real-estate/004-smoke-renter-to-landlord-loop.md` | Browser + DB proof must exist before outbound automation. |
| `tasks/prompts/real-estate/005-fix-function-config-drift.md` | Edge deploy/config state must be honest. |
| `tasks/prompts/real-estate/007-manual-rentals-beta-runbook.md` | Operators need a manual baseline before agents take any work. |

Minimum trigger to start this backlog: **at least 25 real renter inquiries or 5 landlord follow-up failures**. Below that, manual WhatsApp is cheaper and clearer.

## Role Split

| System | Owns | Must not own |
|---|---|---|
| Supabase | Canonical listings, landlord profiles, leads/inbox, audit rows, RLS | Agent reasoning or unbounded execution |
| Paperclip | Approvals, budgets, task lifecycle, stale lead routines, human gates | Raw WhatsApp sending, social posting, DB truth |
| OpenClaw | WhatsApp/channel execution after approval, inbound message handling, skill execution | Source-of-truth state, autonomous pricing/leases |
| Hermes | Lead summaries, scoring, ranking explanations, memory/research | Final outbound messages, writes without edge/API guardrails |
| Postiz | Approved social scheduling and post analytics | CRM, WhatsApp outreach, landlord lead state |

## Task Overview

| ID | System | Priority | Depends on | Outcome |
|---|---|---:|---|---|
| RE-TRIO-01 | Cross-system | P1 | manual beta gates | One integration contract for rentals flows. |
| RE-PAPER-01 | Paperclip | P1 | RE-TRIO-01 | Stale landlord lead approval queue. |
| RE-OPEN-01 | OpenClaw | P1 | RE-TRIO-01, RE-PAPER-01 | Approved WhatsApp follow-up execution. |
| RE-HERMES-01 | Hermes | P2 | 25+ real leads | Read-only lead summary and qualification score. |
| RE-HERMES-02 | Hermes | P2 | RE-HERMES-01 | Listing match/ranking explanation for operators. |
| RE-POSTIZ-01 | Postiz | P2 | approved listing/content workflow | Approved rental supply/social post scheduling. |
| RE-TRIO-02 | Cross-system | P2 | RE-PAPER-01, RE-OPEN-01, RE-HERMES-01 | Correlation IDs, audit trail, and rollback proof. |

---

## RE-TRIO-01 — Rentals Integration Contract

**Goal:** Define the exact boundaries and payloads before any agent runtime touches rentals.

**Build:**

- Create or update `tasks/architecture/integration-contract.md`.
- Add rentals-specific flows:
  - public contact form -> `lead-from-form` -> `landlord_inbox`
  - stale lead -> Paperclip approval -> OpenClaw WhatsApp nudge
  - lead row -> Hermes summary/score -> host dashboard
  - approved listing promo -> Postiz scheduled post
- Define owner system, trigger, idempotency key, correlation ID, retry behavior, rollback, and secrets path for each flow.

**Acceptance criteria:**

- [ ] Each flow has a single source of truth.
- [ ] No system receives Supabase service-role credentials except edge/server runtime.
- [ ] All outbound actions require Paperclip approval or an explicit manual operator action.
- [ ] Contract references `tasks/prompts/advanced/12A-trio-integration-contract.md`.

## RE-PAPER-01 — Paperclip Stale Lead Approval Queue

**Goal:** Use Paperclip only where it removes operator risk: surfacing stale leads for human approval.

**Build:**

- Define a routine that checks `landlord_inbox` for `status='new'` and age greater than 24 hours.
- Create approval cards with renter summary, landlord, apartment, last action, and proposed next step.
- Approval action can create an outbound job for OpenClaw, not send directly.
- Rejection action records why the operator skipped the nudge.

**Acceptance criteria:**

- [ ] Routine is read-only until approval.
- [ ] Every approved action writes an audit row with approver, timestamp, lead id, and proposed copy.
- [ ] Budget/rate limit is enforced: max 20 landlord nudges/day in beta.
- [ ] Failed approval callback does not duplicate outbound jobs.

## RE-OPEN-01 — OpenClaw Approved WhatsApp Follow-Up

**Goal:** Let OpenClaw execute approved WhatsApp follow-ups, not decide who to message.

**Build:**

- Implement a minimal approved-job adapter for landlord/renter WhatsApp follow-up.
- Input must come from Paperclip approval or a signed edge function.
- OpenClaw sends a templated message with variables from Supabase.
- Delivery result is written back to Supabase as an event/log row.

**Acceptance criteria:**

- [ ] OpenClaw cannot query arbitrary Supabase tables.
- [ ] OpenClaw cannot send without approval id or signed job id.
- [ ] Message body is deterministic/template-based for V1.
- [ ] Delivery success/failure is visible to the operator.
- [ ] Manual fallback remains documented.

## RE-HERMES-01 — Hermes Read-Only Lead Summary And Qualification

**Goal:** Use Hermes to make operators faster, not to automate lead decisions.

**Build:**

- Hermes reads a sanitized lead payload: move timing, budget, message, apartment metadata, landlord response state.
- Hermes returns a short summary, qualification score, missing questions, and recommended next operator action.
- Store output in a dedicated summary/audit table or existing event/log pattern.

**Acceptance criteria:**

- [ ] No raw unnecessary PII is sent to Hermes.
- [ ] Score is advisory only and cannot hide or auto-reject leads.
- [ ] Output includes model/version/prompt id/cost/latency.
- [ ] Operator can see original lead data beside the summary.
- [ ] Fallback is deterministic rules if Hermes fails.

## RE-HERMES-02 — Hermes Listing Match Explanation

**Goal:** Explain why a renter matches specific listings after enough real searches/leads exist.

**Build:**

- Use existing rentals filters and apartment data as source input.
- Generate operator-facing match explanations for top listings.
- Do not replace deterministic search sorting until an evaluation dataset exists.

**Acceptance criteria:**

- [ ] Requires at least 25 real inquiries or a curated eval dataset.
- [ ] Explanations cite exact listing fields, not invented amenities.
- [ ] Cost cap exists per run/day.
- [ ] Search still works if Hermes is disabled.

## RE-POSTIZ-01 — Postiz Approved Rental Content Scheduling

**Goal:** Use Postiz for approved social posts that promote verified listings or landlord supply, not for CRM.

**Build:**

- Create an operator workflow for drafting listing/supply posts.
- Paperclip or manual approval is required before Postiz scheduling.
- Store scheduled post id, platform, listing ids, caption, approval id, status, and metrics link.

**Acceptance criteria:**

- [ ] Only landlord-approved or public-safe listing details appear in posts.
- [ ] Postiz API key stays server-side.
- [ ] Failed schedules are visible and retryable.
- [ ] Metrics are imported or linked without treating Postiz as source-of-truth CRM.

## RE-TRIO-02 — Correlation, Audit, And Rollback

**Goal:** Make the whole trio flow debuggable before increasing automation.

**Build:**

- Add one correlation id across Paperclip approval, OpenClaw send, Hermes summary, Postiz schedule, and Supabase logs.
- Define rollback/manual recovery for each outbound action.
- Add a short operator checklist for "what happened to this lead/post?"

**Acceptance criteria:**

- [ ] Operator can trace a lead from `landlord_inbox` to approval/send/summary events.
- [ ] Duplicate sends are prevented with idempotency keys.
- [ ] Failed jobs have retry policy and max attempts.
- [ ] Rollback is documented for messages, posts, and stale lead approvals.

## What To Defer

| Deferred | Reason |
|---|---|
| Autonomous lease generation/signing | Too high-risk before first revenue and legal review. |
| Hermes auto-pricing | Needs market data, evals, and landlord consent. |
| OpenClaw inbound WhatsApp full concierge | Build after approved outbound jobs work. |
| Paperclip managing all tasks/routines | Use after manual operating rhythm is proven. |
| Postiz auto-posting without approval | Brand/reputation risk; approval must stay first. |
