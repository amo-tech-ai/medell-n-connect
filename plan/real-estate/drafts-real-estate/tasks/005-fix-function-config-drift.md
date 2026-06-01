---
task_id: 005-RE
title: Fix Real Estate Edge Function Config Drift
phase: HIGH
priority: P1
status: Not Started
estimated_effort: 1 day
area: infrastructure
wizard_step: null
skill: [mde-real-estate, mde-task-lifecycle]
subagents: [supabase-auditor, code-reviewer]
edge_function: p1-crm, whatsapp-webhook
schema_tables: []
depends_on: []
figma_prompt: null
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** Fix Real Estate Edge Function Config Drift
> **Why:** The audit found `supabase/config.toml` config entries for `p1-crm` and `whatsapp-webhook`, but no matching function directories under `supabase/functions`. This makes function inventory, deploy verification, and roadmap…
> **Delivers:** `p1-crm, whatsapp-webhook` edge fn
> **Tools/Skills:** `mde-real-estate` · `mde-task-lifecycle`
> **HIGH · P1 · Not Started · Effort: 1 day**

# Fix Real Estate Edge Function Config Drift

| Aspect | Details |
|--------|---------|
| **Screens** | None |
| **Features** | Deployable function inventory, public/private auth inventory, stale config cleanup |
| **Edge Functions** | `p1-crm`, `whatsapp-webhook`, plus real-estate public functions |
| **Tables** | None directly |
| **Agents** | None |
| **Real-World** | "A deploy check cannot claim `p1-crm` and `whatsapp-webhook` exist unless directories and handlers actually exist." |

## Description

**The situation:** The audit found `supabase/config.toml` config entries for `p1-crm` and `whatsapp-webhook`, but no matching function directories under `supabase/functions`. This makes function inventory, deploy verification, and roadmap status untrustworthy.

**Why it matters:** Config drift creates false confidence. A production deploy can fail, or worse, docs can claim a CRM/WhatsApp capability is live when it is not.

**What already exists:** `supabase/config.toml` includes many function auth modes. Real functions such as `rentals`, `lead-from-form`, and `lead-reminder-tick` exist. `p1-crm` and `whatsapp-webhook` do not have directories in the current function tree.

**The build:** Decide per function whether to remove stale config or create a minimal real handler. For V1, prefer removal/defer notes unless the function is required by the next launch loop. Document public `verify_jwt=false` functions and their replacement auth/rate-limit controls. Add a real repo command for edge/config verification so task prompts do not reference a nonexistent `npm run verify:edge` gate.

**Example:** A release engineer runs a function inventory check and sees only functions that have code, deploy config, auth rationale, and verification status.

## Rationale

**Problem:** Supabase config claims capabilities that the repo cannot deploy.

**Solution:** Reconcile config with actual function directories and document intentional public functions.

**Impact:** Edge deployments become safer and roadmap status stops overstating P1 CRM/WhatsApp readiness.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | trust Supabase function inventory | I can deploy without surprise missing directories |
| Operator | know which public functions are intentionally anonymous | I can reason about abuse and rate limits |
| Founder | avoid fake roadmap progress | I can focus on the real beta blockers |

## Goals

1. **Primary:** `supabase/config.toml` matches actual real-estate edge function code.
2. **Quality:** Every `verify_jwt=false` real-estate function has an explicit auth/rate-limit rationale.

## Acceptance Criteria

- [ ] Inventory all `[functions.*]` entries in `supabase/config.toml`.
- [ ] Inventory all directories under `supabase/functions`.
- [ ] Resolve `p1-crm` by either adding a real handler with tests or removing/defer-labeling the config entry.
- [ ] Resolve `whatsapp-webhook` by either adding a real signed webhook handler or removing/defer-labeling the config entry.
- [ ] Verify `rentals`, `lead-from-form`, and `lead-reminder-tick` auth modes match their actual V1 security story.
- [ ] Document all public `verify_jwt=false` real-estate functions with rate-limit/signature/idempotency expectations.
- [ ] Add a real edge/config verification command, preferably `npm run verify:edge`, that at minimum detects `[functions.*]` entries with no matching `supabase/functions/<name>` directory.
- [ ] Run the new edge/config verification command after changes and record the output in completion notes.
- [ ] If a full npm script is intentionally deferred, remove or replace every prompt reference to `npm run verify:edge` with the exact manual command sequence used.
- [ ] Update roadmap/todo notes so missing functions are not marked live.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Config | `supabase/config.toml` | Modify: remove stale entries or keep only with real code |
| Edge Function | `supabase/functions/p1-crm/index.ts` | Create only if required; otherwise defer |
| Edge Function | `supabase/functions/whatsapp-webhook/index.ts` | Create only if required; otherwise defer |
| Edge Function | `supabase/functions/rentals/index.ts` | Review public auth/rate-limit rationale |
| Edge Function | `supabase/functions/lead-from-form/index.ts` | Review public auth/rate-limit rationale |
| Docs | `tasks/todo.md` | Correct status language |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Config entry is future-only | Remove from deploy config and document in future roadmap |
| Function exists but is not enabled | Document intentional disabled state |
| Public function lacks rate limit | Treat as launch blocker or add rate limit before launch |
| WhatsApp webhook is deferred | V1 keeps `wa.me`/sandbox only and docs say so plainly |

## Real-World Examples

**Scenario 1 - Deploy audit:** A deploy check looks for each configured function directory. Today `p1-crm` and `whatsapp-webhook` fail that check. **With this implementation,** config and code agree.

**Scenario 2 - Security review:** A reviewer asks why `lead-from-form` is public. **With this implementation,** the rationale points to anonymous renter lead capture plus handler-level validation/rate limits.

**Scenario 3 - Roadmap cleanup:** A planning doc says `p1-crm` is live. **With this implementation,** the doc is corrected unless a real deployable function exists.

## Outcomes

| Before | After |
|--------|-------|
| Function config contains missing directories | Config matches deployable functions |
| `verify_jwt=false` is hard to audit | Public auth modes have explicit rationale |
| Roadmap can claim nonexistent functions are live | Function status is evidence-backed |
| Deploy risk is hidden | Config drift becomes a visible release gate |
