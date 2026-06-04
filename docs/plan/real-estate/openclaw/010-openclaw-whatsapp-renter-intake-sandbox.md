---
task_id: 010-RE
title: Pilot OpenClaw WhatsApp Renter Intake Sandbox
phase: HIGH
priority: P1
status: Not Started
estimated_effort: 4 days
area: openclaw-whatsapp
wizard_step: null
skill: [mde-real-estate, mde-task-lifecycle]
subagents: [backend, qa, security]
edge_function: ai-real-estate-actions
schema_tables: [landlord_inbox, ai_control_events, ai_recommendation_drafts]
depends_on: [001-RE, 004-RE, 008-RE, 009-RE]
figma_prompt: null
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** Pilot OpenClaw WhatsApp Renter Intake Sandbox
> **Why:** The OpenClaw reports recommend a single narrow first workflow: WhatsApp renter intake. Existing prompts prove the public contact loop, but no task scopes the OpenClaw sandbox, allowlists, safe channel policy, and…
> **Delivers:** `ai-real-estate-actions` edge fn + migrations: `landlord_inbox`, `ai_control_events`, `ai_recommendation_drafts`
> **Tools/Skills:** `mde-real-estate` · `mde-task-lifecycle`
> **HIGH · P1 · Not Started · Effort: 4 days**
> **Depends on:** 001-RE, 004-RE, 008-RE, 009-RE

# Pilot OpenClaw WhatsApp Renter Intake Sandbox

| Aspect | Details |
|--------|---------|
| **Screens** | Operator dashboard/inbox; OpenClaw dashboard for sandbox only |
| **Features** | Dedicated sandbox channel, renter qualification, safe lead draft, draft-only outbound |
| **Edge Functions** | `ai-real-estate-actions`, `lead-from-form` if reused intentionally |
| **Tables** | `landlord_inbox`, `ai_control_events`, `ai_recommendation_drafts` |
| **Agents** | OpenClaw execution layer; Hermes ranking draft optional |
| **Real-World** | "A renter messages the sandbox WhatsApp number, OpenClaw collects basics, Supabase stores the lead, and any follow-up remains a draft." |

## Description

**The situation:** The OpenClaw reports recommend a single narrow first workflow: WhatsApp renter intake. Existing prompts prove the public contact loop, but no task scopes the OpenClaw sandbox, allowlists, safe channel policy, and draft-only outbound behavior.

**Why it matters:** OpenClaw can message real people and execute tools. It is useful only if the first workflow is constrained, observable, and reversible.

**What already exists:** Manual WhatsApp-first landlord flow, `landlord_inbox`, lead creation, and the planned `008-RE` safe action API. The OpenClaw reports define guardrails: dedicated number, allowlist, no broad browser/scraping, no service-role key, no non-template auto-send.

**The build:** Configure a sandbox OpenClaw gateway/channel for renter intake, create a minimal `mde-renter-intake` skill, collect up to five qualifying fields, call the safe action/lead API, store message logs/control events, and keep outbound replies in draft mode unless explicitly approved.

**Example:** Mariana texts the sandbox number asking for a 2BR in Envigado. OpenClaw asks budget, move-in date, furnished preference, and pets, then creates a lead draft and suggests a next message for operator review.

## Rationale

**Problem:** WhatsApp is the main Colombia channel, but full AI routing is too risky before a sandbox proves it.

**Solution:** Build one sandbox workflow with allowlisted senders and draft-only outbound.

**Impact:** mdeai can validate OpenClaw's execution value without risking spam, account bans, or CRM corruption.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Renter | send a WhatsApp inquiry | I can start the search naturally |
| Operator | see a structured intake draft | I can follow up without re-reading the whole chat |
| Developer | prove OpenClaw can call mdeai safely | I can expand only after evidence |

## Goals

1. **Primary:** Prove OpenClaw can collect renter intake and create a safe Supabase draft/lead.
2. **Quality:** Unknown senders, outbound messages, and unsafe actions fail closed.

## Acceptance Criteria

- [ ] Create an OpenClaw sandbox runbook with channel setup, pairing, recovery, and disable steps.
- [ ] Configure allowlist or equivalent guardrail for sandbox testing.
- [ ] Create `mde-renter-intake` skill with fields: name, WhatsApp, budget, neighborhoods, move-in date, furnished, pets, bedrooms.
- [ ] OpenClaw calls only the safe action/lead API; it does not hold Supabase service-role credentials.
- [ ] Outbound non-template messages are stored as drafts and are not auto-sent.
- [ ] Unknown sender or group chat behavior is blocked or documented as disabled.
- [ ] Every intake has an idempotency key and `ai_control_events` record.
- [ ] Add a local/sandbox smoke script or checklist with at least one successful intake and one blocked unsafe case.
- [ ] No scraping, browser-login, payments, contract actions, or Postiz publishing in this task.
- [ ] Document account-ban and WhatsApp provider risks in the runbook.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Skill | `tasks/real-estate/openclaw-skills/mde-renter-intake/SKILL.md` or equivalent | Create sandbox skill |
| Docs | `tasks/real-estate/openclaw-renter-intake-runbook.md` | Create setup/test/rollback runbook |
| Backend | `supabase/functions/ai-real-estate-actions/index.ts` | Reuse safe intake/draft action |
| Tests | `tests/` or manual smoke doc | Add sandbox proof checklist |
| Config | OpenClaw local/VPS config | Document exact channel policy without committing secrets |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Unknown sender messages the number | Block, ignore, or route to manual review per policy |
| Renter asks for refund/legal advice | Create escalation draft; do not answer as authority |
| Renter sends ID/document photo | Refuse/redirect to secure upload process; do not store in OpenClaw memory |
| Duplicate WhatsApp messages | Idempotency prevents duplicate lead rows |
| OpenClaw gateway is down | Manual contact loop from `001-RE` still works |

## Real-World Examples

**Scenario 1 - Sandbox intake:** Mariana messages the sandbox number. **With this implementation,** OpenClaw collects basics and creates a structured lead draft.

**Scenario 2 - Unsafe ask:** A renter asks if they should sign a lease. **With this implementation,** OpenClaw escalates for human review instead of giving legal advice.

**Scenario 3 - Duplicate retry:** WhatsApp resends a message. **With this implementation,** the same idempotency key prevents duplicate leads.

## Outcomes

| Before | After |
|--------|-------|
| OpenClaw plan is only conceptual | One sandbox intake workflow is testable |
| WhatsApp automation could send blindly | Outbound is draft-only |
| Agent credentials could be too broad | OpenClaw calls constrained backend APIs |
| Expansion criteria are vague | Sandbox proof and rollback runbook exist |
