---
task_id: 004-RE
title: Smoke Anonymous Renter To Landlord Inbox Loop
phase: CRITICAL
priority: P0
status: Not Started
estimated_effort: 2 days
area: real-estate-qa
wizard_step: null
skill: [mde-real-estate, mde-task-lifecycle]
subagents: [qa, supabase-auditor]
edge_function: lead-from-form
schema_tables: [apartments, landlord_profiles, landlord_inbox, landlord_inbox_events]
depends_on: [001-RE, 002-RE, 003-RE, 005-RE]
figma_prompt: null
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** Smoke Anonymous Renter To Landlord Inbox Loop
> **Why:** Pieces of the lead loop exist, but the audit did not run a true end-to-end smoke from anonymous public page to host inbox. This task proves the launch path after the contact CTA, rentals contract, inventory proof, and…
> **Delivers:** `lead-from-form` edge fn + migrations: `apartments`, `landlord_profiles`, `landlord_inbox`, `landlord_inbox_events`
> **Tools/Skills:** `mde-real-estate` · `mde-task-lifecycle`
> **CRITICAL · P0 · Not Started · Effort: 2 days**
> **Depends on:** 001-RE, 002-RE, 003-RE, 005-RE

# Smoke Anonymous Renter To Landlord Inbox Loop

| Aspect | Details |
|--------|---------|
| **Screens** | `/apartments/:id`, `/host/leads`, `/host/leads/:id` |
| **Features** | Anonymous lead creation, host inbox visibility, WhatsApp reply proof |
| **Edge Functions** | `lead-from-form` |
| **Tables** | `landlord_inbox`, `landlord_inbox_events`, `apartments`, `landlord_profiles` |
| **Agents** | None |
| **Real-World** | "A renter submits an inquiry and a landlord can reply from the host dashboard." |

## Description

**The situation:** Pieces of the lead loop exist, but the audit did not run a true end-to-end smoke from anonymous public page to host inbox. This task proves the launch path after the contact CTA, rentals contract, inventory proof, and edge function config drift are fixed.

**Why it matters:** Production readiness requires evidence that the user journey works, not only component tests. The smallest revenue loop is public listing -> contact form -> `landlord_inbox` -> host reply.

**What already exists:** `lead-from-form`, `landlord_inbox`, `/host/leads`, `/host/leads/:id`, `src/hooks/host/useLeads.ts`, `src/hooks/host/useLeadActions.ts`, and `src/components/host/leads/WhatsAppReplyButton.tsx` exist.

**The build:** Add a repeatable smoke test or runbook-backed test for the anonymous renter flow and host dashboard flow. Keep it deterministic and use a labeled QA listing and test phone number.

**Example:** A QA renter submits "I can move next month" from a public apartment page. The landlord opens `/host/leads`, sees the new lead, opens detail, and uses the WhatsApp reply button.

## Rationale

**Problem:** The current product can look complete while the real conversion loop remains unproven.

**Solution:** Add one high-signal smoke that checks browser behavior, edge function write, DB row, and host UI visibility.

**Impact:** The team can safely run a manual beta and know where failures occur.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Guest renter | send an inquiry from a listing | I can talk to a landlord |
| Landlord | see and reply to the inquiry | I can convert the lead |
| Operator | run one launch smoke | I can verify the revenue loop before traffic |

## Goals

1. **Primary:** Prove anonymous renter -> `lead-from-form` -> `landlord_inbox` -> host dashboard.
2. **Quality:** The smoke produces browser proof and database proof with a cleanup path for QA data.

## Acceptance Criteria

- [ ] Use a known landlord-linked QA listing from task `003-RE`.
- [ ] Confirm task `005-RE` is complete before calling this a release/go-live smoke; preview-only functional checks may run earlier but must be labeled as preview-only.
- [ ] Anonymous browser opens `/apartments/:id` and submits a contact inquiry.
- [ ] `lead-from-form` returns success and a valid WhatsApp destination or safe fallback.
- [ ] A new `landlord_inbox` row exists with correct `apartment_id`, `landlord_id`, renter contact, and channel.
- [ ] Host account sees the new row in `/host/leads`.
- [ ] Host lead detail opens and status actions work for viewed/replied/archive or the documented V1 subset.
- [ ] `WhatsAppReplyButton` produces a valid WhatsApp link using the renter/landlord data.
- [ ] Test data is labeled and cleanup/reset instructions are documented.
- [ ] Smoke can be rerun without creating ambiguous duplicate production leads.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Page | `src/pages/ApartmentDetail.tsx` | Verify public inquiry path |
| Edge Function | `supabase/functions/lead-from-form/index.ts` | Verify write path and response |
| Page | `src/pages/host/Leads.tsx` | Verify new lead appears |
| Page | `src/pages/host/LeadDetail.tsx` | Verify detail and actions |
| Hook | `src/hooks/host/useLeads.ts` | Verify lead query filters |
| Hook | `src/hooks/host/useLeadActions.ts` | Verify status transitions |
| Component | `src/components/host/leads/WhatsAppReplyButton.tsx` | Verify reply link |
| Test/Runbook | `tasks/real-estate/` or `tests/` | Create repeatable smoke documentation or automated test |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Duplicate QA inquiry | Smoke identifies the newest row by timestamp/test marker |
| Host session expires | Test fails clearly at auth gate, not as missing data |
| WhatsApp phone missing | Lead still visible; reply action disabled with explanation |
| RLS blocks host read | Smoke captures policy failure as launch blocker |

## Real-World Examples

**Scenario 1 - Launch smoke:** The operator runs one test before sending traffic. **With this implementation,** they can prove the exact lead row and host UI path.

**Scenario 2 - RLS regression:** The lead row is inserted but the landlord cannot see it. **With this implementation,** the smoke fails at host inbox visibility and points to the policy/query layer.

**Scenario 3 - Reply link failure:** The lead appears but WhatsApp cannot open because phone data is malformed. **With this implementation,** the smoke catches the formatting issue before a real renter is affected.

## Outcomes

| Before | After |
|--------|-------|
| Contact flow success is assumed | Contact flow success is proven end to end |
| Backend write and host UI are tested separately | One smoke connects both |
| QA data can pollute metrics | Test data is labeled and cleanup is documented |
| Launch readiness is subjective | Manual beta has a concrete go/no-go gate |
