---
task_id: 007-RE
title: Create Manual Rentals Beta Runbook
phase: HIGH
priority: P1
status: Not Started
estimated_effort: 1 day
area: operations
wizard_step: null
skill: [mde-real-estate, mde-task-lifecycle]
subagents: [product-strategist, qa]
edge_function: lead-from-form
schema_tables: [apartments, landlord_profiles, landlord_inbox, analytics_events_daily]
depends_on: [001-RE, 002-RE, 003-RE, 004-RE, 005-RE, 006-RE]
figma_prompt: null
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** Create Manual Rentals Beta Runbook
> **Why:** The audit verdict says the product is close to a manual real-estate beta, but not close to full lead-to-lease automation. The next launch needs an operator runbook, not more Phase 4 infrastructure.
> **Delivers:** `lead-from-form` edge fn + migrations: `apartments`, `landlord_profiles`, `landlord_inbox`, `analytics_events_daily`
> **Tools/Skills:** `mde-real-estate` · `mde-task-lifecycle`
> **HIGH · P1 · Not Started · Effort: 1 day**
> **Depends on:** 001-RE, 002-RE, 003-RE, 004-RE, 005-RE, 006-RE

# Create Manual Rentals Beta Runbook

| Aspect | Details |
|--------|---------|
| **Screens** | `/apartments`, `/apartments/:id`, `/host/leads`, `/host/dashboard` |
| **Features** | Launch gates, support workflow, manual follow-up, rollback/disable plan |
| **Edge Functions** | `lead-from-form`, `lead-reminder-tick` |
| **Tables** | `apartments`, `landlord_profiles`, `landlord_inbox`, `analytics_events_daily` |
| **Agents** | None for launch; AI remains assistive only |
| **Real-World** | "The team can run a small Medellin rentals beta with manual WhatsApp coordination." |

## Description

**The situation:** The audit verdict says the product is close to a manual real-estate beta, but not close to full lead-to-lease automation. The next launch needs an operator runbook, not more Phase 4 infrastructure.

**Why it matters:** Small teams ship by controlling scope. Without a runbook, beta support, QA leads, WhatsApp handoff, and rollback decisions become improvised under pressure.

**What already exists:** Public apartment pages, host onboarding/listings, landlord inbox, lead notifications, `lead-reminder-tick`, dashboard KPIs, and audit 29 launch path already exist. The missing artifact is an operational go/no-go plan.

**The build:** Create a manual beta runbook with launch gates, daily operating rhythm, support scripts, QA checklist, metrics, and explicit deferrals. The runbook should make clear that WhatsApp Business/OpenClaw routing, Hermes ranking, lease automation, and payments are not required for first revenue.

**Example:** The founder launches with five landlords and 25 listings. Every day they review new `landlord_inbox` rows, manually nudge landlords on WhatsApp, track response time, and decide whether to expand supply.

## Rationale

**Problem:** The roadmap is too broad for a founder-realistic first revenue launch.

**Solution:** Write the manual operating plan that turns existing code into a controlled beta.

**Impact:** The team can generate leads, learn from landlords, and postpone automation until it is justified by volume.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder/operator | know the launch gates | I can start beta without guessing |
| Support user | follow one lead handling script | I can respond consistently |
| Developer | know what is deferred | I do not build premature automation |

## Goals

1. **Primary:** Produce a runbook that allows a manual WhatsApp-first rentals beta.
2. **Quality:** Runbook includes go/no-go gates, monitoring, support workflow, rollback, and first-revenue metrics.

## Acceptance Criteria

- [ ] Create `tasks/real-estate/manual-rentals-beta-runbook.md` or an equivalent clearly named runbook.
- [ ] Include pre-launch gates for tasks `001-RE` through `006-RE`.
- [ ] Include minimum launch supply threshold: 3-5 landlord-linked listings, ideally 10-20 landlords / 25-50 listings as growth target.
- [ ] Include daily operator workflow for reviewing `landlord_inbox` and nudging landlords via WhatsApp.
- [ ] Include renter and landlord support scripts for common questions.
- [ ] Include metrics: leads/day, landlord response rate, time-to-first-reply, showing requests, qualified leads, closed revenue.
- [ ] Include failure modes and rollback/disable steps for contact form, public listing promotion, and Twilio sandbox notifications.
- [ ] Include the edge/config verification command from `005-RE` as a pre-launch gate.
- [ ] Explicitly defer Hermes ranking, OpenClaw WhatsApp v2, Paperclip approval runtime, Stripe, and lease automation until beta evidence exists.
- [ ] Link the runbook from `tasks/todo.md` or the real-estate status doc.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Runbook | `tasks/real-estate/manual-rentals-beta-runbook.md` | Create |
| Roadmap | `tasks/todo.md` | Link runbook and launch gate |
| Dashboard | `src/pages/host/Dashboard.tsx` | Reference existing metrics only if doc needs screenshots/proof |
| Edge Function | `supabase/functions/lead-reminder-tick/index.ts` | Document current reminder behavior and limitations |
| Audit | `tasks/audit/29-tasks-audit.md` | Link launch rationale |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Landlord ignores leads | Operator uses manual nudge and marks lead status truthfully |
| Contact form abuse appears | Disable/pause promotion and review rate limits |
| Listing is unavailable | Operator archives listing or asks landlord to update status |
| WhatsApp sandbox fails | Fall back to `wa.me` deep links and manual follow-up |
| First leads do not convert | Record objections before building automation |

## Real-World Examples

**Scenario 1 - First beta week:** Five landlords are live and three renters submit leads. **With this implementation,** the operator knows who to contact, what to say, and which metrics to record.

**Scenario 2 - Support issue:** A renter asks why a landlord has not replied. **With this implementation,** the operator follows the support script and updates the lead status.

**Scenario 3 - Automation pressure:** Someone suggests building OpenClaw WhatsApp v2 immediately. **With this implementation,** the runbook shows the evidence threshold required before that work starts.

## Outcomes

| Before | After |
|--------|-------|
| Launch plan is mixed with long-term AI roadmap | Manual beta has a narrow operating plan |
| Support workflow is improvised | Landlord and renter follow-up scripts exist |
| Metrics are vague | First-revenue KPIs are named and tracked |
| Premature automation competes with launch | Deferred systems have explicit evidence thresholds |
