---
task_id: 008-RE
title: Add Real Estate AI Control Events And Safe Action APIs
phase: CRITICAL
priority: P0
status: Not Started
estimated_effort: 3 days
area: real-estate-ai-foundation
wizard_step: null
skill: [mde-real-estate, mde-task-lifecycle]
subagents: [supabase-auditor, backend]
edge_function: ai-real-estate-actions
schema_tables: [ai_control_events, ai_recommendation_drafts, apartments, landlord_inbox]
depends_on: [001-RE, 002-RE, 004-RE, 005-RE, 007-RE]
figma_prompt: null
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** Add Real Estate AI Control Events And Safe Action APIs
> **Why:** The Paperclip, OpenClaw, and Hermes reports all agree on the same boundary: Supabase must remain the source of truth. Today the real-estate beta tasks prove the manual lead loop, but there is no dedicated AI control…
> **Delivers:** `ai-real-estate-actions` edge fn + migrations: `ai_control_events`, `ai_recommendation_drafts`, `apartments`, `landlord_inbox`
> **Tools/Skills:** `mde-real-estate` · `mde-task-lifecycle`
> **CRITICAL · P0 · Not Started · Effort: 3 days**
> **Depends on:** 001-RE, 002-RE, 004-RE, 005-RE, 007-RE

# Add Real Estate AI Control Events And Safe Action APIs

| Aspect | Details |
|--------|---------|
| **Screens** | Operator/admin dashboard later; no required public UI |
| **Features** | AI action audit table, idempotent safe-action API, no service-role keys in agents |
| **Edge Functions** | `ai-real-estate-actions` or equivalent backend API |
| **Tables** | `ai_control_events`, `ai_recommendation_drafts`, `apartments`, `landlord_inbox` |
| **Agents** | Hermes/OpenClaw/Paperclip consume only constrained APIs |
| **Real-World** | "Hermes or OpenClaw can propose a next action, but Supabase stores the canonical audit and validates every write." |

## Description

**The situation:** The Paperclip, OpenClaw, and Hermes reports all agree on the same boundary: Supabase must remain the source of truth. Today the real-estate beta tasks prove the manual lead loop, but there is no dedicated AI control table or constrained API for future agents to write drafts, action requests, or audit events safely.

**Why it matters:** If agents receive broad Supabase credentials or write directly to CRM/listing state, the system can corrupt leads, duplicate messages, leak private data, or trigger irreversible side effects.

**What already exists:** `lead-from-form`, landlord inbox tables, apartments/search surfaces, and the manual beta runbook provide the first real lead loop. The AI reports identify the missing foundation: idempotency, correlation IDs, audit logs, and safe action endpoints.

**The build:** Add a small AI control layer: schema for AI control events and recommendation drafts, an edge/backend function with strict action types, idempotency keys, request validation, RLS/service boundaries, and audit writes. The API must support read-only recommendation drafts before any OpenClaw/Paperclip side effects are enabled.

**Example:** Hermes ranks five listings for a renter. Instead of editing the lead directly, it posts a `recommendation_draft` with listing IDs, reasons, confidence, and next question. The backend validates listing IDs exist and stores the draft plus `ai_control_events` correlation rows.

## Rationale

**Problem:** Agent plans currently imply future writes without a safe write boundary.

**Solution:** Build the narrow audit/action API before adding Hermes, OpenClaw, or Paperclip runtime tasks.

**Impact:** AI workflows can be tested safely, rolled back, and traced without giving agents direct database authority.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Operator | see AI recommendations as drafts | I can approve or reject before users see them |
| Developer | expose one constrained agent API | I do not leak service-role database access |
| Auditor | trace every AI action to a lead/listing | I can debug or roll back unsafe automation |

## Goals

1. **Primary:** Create a safe Supabase-backed control layer for future real-estate AI workflows.
2. **Quality:** All writes are idempotent, schema-validated, correlated, and non-destructive by default.

## Acceptance Criteria

- [ ] Add `ai_control_events` table with entity type/id, source system, action type, status, risk level, idempotency key, correlation IDs, and JSON metadata.
- [ ] Add `ai_recommendation_drafts` table or equivalent storage for Hermes/OpenClaw/Paperclip draft outputs.
- [ ] Add RLS policies so public users cannot read/write AI control tables.
- [ ] Add one constrained edge/backend function for allowed actions: `create_recommendation_draft`, `log_message_draft`, `create_review_request`, `log_tool_result`.
- [ ] Function rejects unknown action types, missing idempotency keys, invalid listing/lead IDs, and oversized metadata.
- [ ] Function never accepts raw SQL or arbitrary table/column names.
- [ ] Function does not require agents to hold `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] Add tests for valid draft creation, duplicate idempotency key, invalid entity ID, and rejected unknown action.
- [ ] Add a short runbook section documenting how Hermes/OpenClaw/Paperclip should call this API.
- [ ] Edge/config verification from `005-RE` includes the new function before enabling later tasks.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/*_ai_control_events.sql` | Create control/audit tables and RLS |
| Edge Function | `supabase/functions/ai-real-estate-actions/index.ts` | Create constrained action endpoint |
| Types | `src/integrations/supabase/database.types.ts` | Regenerate after migration |
| Tests | `supabase/functions/ai-real-estate-actions/` or repo test home | Add validation/idempotency tests |
| Docs | `tasks/real-estate/manual-rentals-beta-runbook.md` | Add AI-control precondition for post-beta automation |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Agent retries the same draft | API returns existing record or no-op success by idempotency key |
| Listing ID is hallucinated | API rejects and logs a failed control event |
| Metadata includes PII or huge payload | API rejects or redacts according to documented limits |
| Agent asks to send WhatsApp | API stores a draft/review request, not an outbound send |
| Service role accidentally missing | Function fails closed with clear configuration error |

## Real-World Examples

**Scenario 1 - Hermes draft:** A renter asks for Laureles options. **With this implementation,** Hermes can store a ranked recommendation draft without changing lead state or sending a message.

**Scenario 2 - OpenClaw draft:** OpenClaw prepares a WhatsApp follow-up. **With this implementation,** the draft is logged for approval instead of sent blindly.

**Scenario 3 - Paperclip approval:** Paperclip approves a campaign later. **With this implementation,** the approval can be linked back to a Supabase control event.

## Outcomes

| Before | After |
|--------|-------|
| AI reports recommend safe boundaries but no implementation task exists | A concrete Supabase control layer is planned |
| Agents might need broad database access | Agents call one constrained API |
| AI outputs are hard to trace | Drafts and actions have correlation IDs and idempotency |
| Later automation has no rollback story | Risky side effects are blocked until approved |
