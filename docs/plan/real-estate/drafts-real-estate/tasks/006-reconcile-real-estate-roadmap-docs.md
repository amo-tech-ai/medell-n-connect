---
task_id: 006-RE
title: Reconcile Real Estate Roadmap And Stale Docs
phase: HIGH
priority: P1
status: Not Started
estimated_effort: 1 day
area: documentation
wizard_step: null
skill: [mde-real-estate, mde-task-lifecycle]
subagents: [product-strategist, technical-writer]
edge_function: null
schema_tables: [landlord_inbox, leads, showings, rental_applications]
depends_on: [001-RE, 002-RE, 003-RE, 004-RE, 005-RE]
figma_prompt: null
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** Reconcile Real Estate Roadmap And Stale Docs
> **Why:** The audit found roadmap undercounting and stale real-estate docs. Real Estate CORE is closer to 52% than 22%, Landlord V1 is real, and `tasks/real-estate/01.10-real-estate-tasks.md` still contains claims that landlord…
> **Delivers:** migrations: `landlord_inbox`, `leads`, `showings`, `rental_applications`
> **Tools/Skills:** `mde-real-estate` · `mde-task-lifecycle`
> **HIGH · P1 · Not Started · Effort: 1 day**
> **Depends on:** 001-RE, 002-RE, 003-RE, 004-RE, 005-RE

# Reconcile Real Estate Roadmap And Stale Docs

| Aspect | Details |
|--------|---------|
| **Screens** | None |
| **Features** | Accurate percentages, duplicate CRM language cleanup, stale doc labels |
| **Edge Functions** | None |
| **Tables** | `landlord_inbox`, `leads`, `showings`, `rental_applications` |
| **Agents** | None |
| **Real-World** | "The roadmap shows what is actually built, not what old planning docs guessed." |

## Description

**The situation:** The audit found roadmap undercounting and stale real-estate docs. Real Estate CORE is closer to 52% than 22%, Landlord V1 is real, and `tasks/real-estate/01.10-real-estate-tasks.md` still contains claims that landlord features do not exist.

**Why it matters:** Bad status data creates bad sequencing. It pushes the team toward new AI systems while the true launch blockers are a contact CTA, API contract, data proof, and config drift.

**What already exists:** `tasks/audit/29-tasks-audit.md` provides corrected status and launch order. `tasks/real-estate/06-landlord-v1-30day.md` is closer to the V1 truth. `tasks/todo.md`, `prd.md`, and old real-estate planning docs need reconciliation.

**The build:** Update the real-estate roadmap/todo language to reflect reality. Split old P1 CRM from Landlord V1 `landlord_inbox`, label stale docs, and keep Hermes/OpenClaw/contracts as future work until first real leads. Do not mark E4/E9 or launch readiness complete until the `004-RE` renter-to-landlord smoke has browser and database proof.

**Example:** A contributor reads `tasks/todo.md` and immediately sees that the next work is public contact wiring and API contract cleanup, not contract automation or OpenClaw WhatsApp v2.

## Rationale

**Problem:** Planning docs are misleading enough to cause wasted engineering.

**Solution:** Make the audit-backed launch path the roadmap source for the next real-estate milestone.

**Impact:** The team ships the beta faster and stops treating already-built landlord infrastructure as missing.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | see accurate completion percentages | I can prioritize revenue work |
| Developer | know which docs are stale | I do not implement obsolete tasks |
| Auditor | trace roadmap claims to evidence | I can validate status quickly |

## Goals

1. **Primary:** Real-estate roadmap status matches code evidence from audit 29.
2. **Quality:** Stale docs are labeled, merged, or archived without deleting useful historical context.

## Acceptance Criteria

- [ ] Update `tasks/todo.md` real-estate percentages using audit 29 recommended values or newer verified evidence.
- [ ] Add a top warning/status note to `tasks/real-estate/01.10-real-estate-tasks.md` if it remains stale.
- [ ] Update `tasks/real-estate/06-landlord-v1-30day.md` with current implementation status and remaining launch gates.
- [ ] Document the distinction between old P1 CRM tables (`leads`, `showings`, `rental_applications`) and V1 `landlord_inbox`.
- [ ] Mark Hermes, OpenClaw WhatsApp v2, Paperclip approvals, and contract automation as post-beta.
- [ ] Merge or cross-link duplicate contact path language: `ContactHostDialog` legacy fallback, `WhatsAppContactModal` default landlord path.
- [ ] Add proof columns or evidence links for any changed percentage.
- [ ] Do not mark any launch blocker complete without code, browser, DB, or config proof.
- [ ] Do not mark E4/E9 launch readiness complete until `004-RE` passes with browser proof and database proof.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Roadmap | `tasks/todo.md` | Modify: corrected percentages and next tasks |
| Audit | `tasks/audit/29-tasks-audit.md` | Reference as source, do not rewrite unless new evidence exists |
| Legacy doc | `tasks/real-estate/01.10-real-estate-tasks.md` | Label stale or archive with pointer |
| V1 doc | `tasks/real-estate/06-landlord-v1-30day.md` | Add implementation status and gates |
| PRD | `prd.md` | Correct any "live" claims contradicted by function inventory |
| Prompt index | `tasks/prompts/INDEX.md` | Keep prompt index current |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Old doc has useful architecture | Preserve it as vision/reference, not execution truth |
| Percentage is disputed | Use proof-backed ranges and mark confidence |
| Function status changes during implementation | Re-run config inventory before updating docs |
| Live DB proof is missing | Keep E1 partial and call out missing evidence |

## Real-World Examples

**Scenario 1 - New contributor:** A developer opens the roadmap. Today they may pick a stale showing scheduler task. **With this implementation,** they see the P0 launch sequence first.

**Scenario 2 - Founder planning:** The founder wants to know whether CORE is 22% or 52%. **With this implementation,** the number has evidence and caveats.

**Scenario 3 - AI distraction:** A doc pushes Hermes ranking before lead capture. **With this implementation,** Hermes is explicitly post-beta until lead volume justifies it.

## Outcomes

| Before | After |
|--------|-------|
| Real Estate CORE appears much less complete than code shows | Completion is audit-backed and more accurate |
| Landlord V1 is contradicted by stale docs | Landlord V1 status is explicit |
| Old CRM and landlord inbox are conflated | Lead concepts are named separately |
| AI/trio work can jump ahead of revenue blockers | Beta launch tasks are prioritized first |
