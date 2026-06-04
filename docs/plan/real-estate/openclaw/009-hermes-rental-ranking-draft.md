---
task_id: 009-RE
title: Build Hermes Rental Ranking Draft Workflow
phase: HIGH
priority: P1
status: Not Started
estimated_effort: 4 days
area: hermes-intelligence
wizard_step: null
skill: [mde-real-estate, mde-task-lifecycle]
subagents: [ai-systems, backend, qa]
edge_function: ai-real-estate-actions
schema_tables: [apartments, landlord_inbox, ai_recommendation_drafts, ai_control_events]
depends_on: [002-RE, 003-RE, 004-RE, 008-RE]
figma_prompt: null
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** Build Hermes Rental Ranking Draft Workflow
> **Why:** The Hermes reports recommend using Hermes before broad OpenClaw automation, but only as a read-only intelligence layer. Existing prompts cover search contract and manual beta, but no prompt converts Hermes into a safe…
> **Delivers:** `ai-real-estate-actions` edge fn + migrations: `apartments`, `landlord_inbox`, `ai_recommendation_drafts`, `ai_control_events`
> **Tools/Skills:** `mde-real-estate` · `mde-task-lifecycle`
> **HIGH · P1 · Not Started · Effort: 4 days**
> **Depends on:** 002-RE, 003-RE, 004-RE, 008-RE

# Build Hermes Rental Ranking Draft Workflow

| Aspect | Details |
|--------|---------|
| **Screens** | Internal/operator view first; optional rental detail debug panel |
| **Features** | Read-only ranking, top 5 matches, reasons, missing info, risk flags, confidence |
| **Edge Functions** | `ai-real-estate-actions`; optional Hermes bridge |
| **Tables** | `apartments`, `landlord_inbox`, `ai_recommendation_drafts`, `ai_control_events` |
| **Agents** | Hermes only; no OpenClaw sends |
| **Real-World** | "A renter lead gets a ranked shortlist from verified listings, but the result remains a draft until an operator reviews it." |

## Description

**The situation:** The Hermes reports recommend using Hermes before broad OpenClaw automation, but only as a read-only intelligence layer. Existing prompts cover search contract and manual beta, but no prompt converts Hermes into a safe rental ranking draft.

**Why it matters:** Ranking and next-question intelligence can improve conversion without taking risky external actions. It is the safest first Hermes use case.

**What already exists:** Rentals search, apartments, landlord inbox, and the planned `008-RE` AI control API. The Hermes reports define the desired output: top matches, reasons, missing data, risk flags, confidence, and next question.

**The build:** Create a Hermes-backed or Hermes-compatible ranking draft workflow that accepts a lead profile plus verified listing payload, returns structured JSON, validates listing IDs against Supabase, stores the output as a draft, and includes a small evaluation dataset.

**Example:** Camila wants a furnished 1BR in Laureles under $1,500. Hermes ranks five verified listings, explains tradeoffs, flags one missing availability date, and suggests asking whether she needs pet-friendly housing.

## Rationale

**Problem:** Search can return results, but it does not yet reason over preference fit or next best question.

**Solution:** Add a read-only ranking draft workflow with strict schema validation and no outbound side effects.

**Impact:** Operators get better recommendations while the system avoids autonomous messaging, screening, or legal decisions.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Operator | see ranked matches for a lead | I can respond faster and better |
| Renter | get options that match my actual needs | I do not waste time on irrelevant listings |
| Developer | evaluate ranking quality | I can improve prompts without breaking production |

## Goals

1. **Primary:** Store a validated Hermes ranking draft for a real renter lead and verified listings.
2. **Quality:** No hallucinated listing IDs, no direct CRM state changes, and repeatable eval cases.

## Acceptance Criteria

- [ ] Define a structured ranking schema: lead summary, top listings, reasons, concerns, missing info, confidence, next question.
- [ ] Ranking input uses only verified Supabase listing data and a sanitized lead profile.
- [ ] Ranking output is validated before storage; hallucinated listing IDs are rejected.
- [ ] Ranking draft is written through `008-RE` safe action API, not direct table writes from Hermes.
- [ ] Add at least 20 fixture/eval cases covering budget, neighborhood, furnished, pet, remote-work, and availability constraints.
- [ ] Add deterministic fallback behavior when Hermes is unavailable.
- [ ] Add cost/latency logging to `ai_control_events` metadata or equivalent.
- [ ] Do not send WhatsApp, email, Postiz, or payment actions from this task.
- [ ] Add docs explaining that Hermes output is advisory and operator-reviewed.
- [ ] Targeted tests pass for schema validation, hallucinated IDs, fallback, and draft persistence.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Backend | `supabase/functions/ai-real-estate-actions/index.ts` | Extend/reuse for `create_recommendation_draft` |
| AI | `supabase/functions/` or `src/lib/ai/` | Add Hermes ranking adapter/prompt wrapper |
| Fixtures | `tests/fixtures/real-estate/hermes-ranking/` | Add eval cases |
| Types | `src/lib/real-estate/ai-ranking.ts` | Add schema/types |
| Docs | `tasks/real-estate/104-hermes-real-estate.md` | Link implemented first workflow when done |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Hermes returns listing not in input | Reject output and store failed control event |
| Lead has incomplete preferences | Return next question instead of pretending certainty |
| No listings match budget | Return honest no-match explanation and closest alternatives only if labeled |
| Model timeout | Store failed draft status and fall back to deterministic sorted results |
| Sensitive screening criteria appears | Refuse protected-class reasoning and escalate for human review |

## Real-World Examples

**Scenario 1 - Good match:** Camila asks for Laureles, furnished, under $1,500. **With this implementation,** Hermes ranks verified listings and explains why the top option fits.

**Scenario 2 - Missing data:** A renter says "near nightlife, maybe pets." **With this implementation,** Hermes asks the next qualifying question instead of guessing.

**Scenario 3 - Hallucination guard:** Hermes outputs a nonexistent listing ID. **With this implementation,** the backend rejects the draft and logs the failure.

## Outcomes

| Before | After |
|--------|-------|
| Search is mostly deterministic | Operators receive reasoned ranking drafts |
| Hermes plan exists only in docs | First Hermes workflow is testable |
| AI could hallucinate inventory | Backend validates listing IDs |
| No eval set exists | Ranking quality has fixtures and regression checks |
