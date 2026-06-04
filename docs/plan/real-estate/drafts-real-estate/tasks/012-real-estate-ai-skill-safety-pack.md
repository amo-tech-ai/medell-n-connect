---
task_id: 012-RE
title: Create Real Estate AI Skill Safety Pack
phase: HIGH
priority: P1
status: Not Started
estimated_effort: 3 days
area: ai-skills-safety
wizard_step: null
skill: [mde-real-estate, mde-task-lifecycle]
subagents: [security, ai-systems, qa]
edge_function: null
schema_tables: [ai_control_events]
depends_on: [008-RE, 009-RE, 010-RE, 011-RE]
figma_prompt: null
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** Create Real Estate AI Skill Safety Pack
> **Why:** The Hermes/OpenClaw reports found useful ClawHub and Skills.sh real-estate skills, but repeatedly warn that public skills are inspiration, not trusted production code. Existing prompts do not create mdeai-owned domain…
> **Delivers:** migrations: `ai_control_events`
> **Tools/Skills:** `mde-real-estate` · `mde-task-lifecycle`
> **HIGH · P1 · Not Started · Effort: 3 days**
> **Depends on:** 008-RE, 009-RE, 010-RE, 011-RE

# Create Real Estate AI Skill Safety Pack

| Aspect | Details |
|--------|---------|
| **Screens** | None; skill files, audit docs, and tests |
| **Features** | Allowlisted real-estate skills, banned actions, source review, eval prompts |
| **Edge Functions** | None directly |
| **Tables** | `ai_control_events` for future skill usage logs |
| **Agents** | Hermes and OpenClaw use reviewed skills only |
| **Real-World** | "The team can test renter intake and ranking skills without installing unknown ClawHub/Skills.sh code into production." |

## Description

**The situation:** The Hermes/OpenClaw reports found useful ClawHub and Skills.sh real-estate skills, but repeatedly warn that public skills are inspiration, not trusted production code. Existing prompts do not create mdeai-owned domain skills or a review checklist.

**Why it matters:** Skills can contain unsafe instructions, scripts, credentials, external calls, or jurisdiction assumptions. Real estate also has legal, payment, privacy, and screening risks.

**What already exists:** Reports identify candidate skills: OpenClaw `real-estate-skill`, `real-estate-agent`, `real-estate-investing`, `lease-abstraction-specialist`, rental property/investment skills, and Hermes skill categories. `009-RE` and `010-RE` need safe local skills to work well.

**The build:** Create a reviewed mdeai skill pack and safety checklist. Include minimal local skill docs for renter intake, rental ranking, CRM intelligence, fraud/scam review, and safe WhatsApp reply. Document which public skills were reviewed, which are rejected/deferred, and what actions are forbidden.

**Example:** A developer wants to install a broad "real estate agent" skill from a public registry. **With this implementation,** they compare it against the safety checklist, reject risky instructions, and copy only safe patterns into the mdeai-owned skill.

## Rationale

**Problem:** Public agent skills are supply-chain and compliance risk.

**Solution:** Own a small audited skill pack with explicit forbidden actions and eval prompts.

**Impact:** Hermes/OpenClaw can use domain expertise without inheriting unsafe marketplace assumptions.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | use reviewed real-estate skills | I can avoid unsafe public skill imports |
| Operator | know what agents are forbidden to do | I can trust the pilot guardrails |
| Auditor | see skill provenance and risk notes | I can approve or reject future skill updates |

## Goals

1. **Primary:** Create a reviewed, mdeai-owned skill pack for first AI real-estate workflows.
2. **Quality:** Every skill names allowed actions, forbidden actions, inputs, outputs, and proof tests.

## Acceptance Criteria

- [ ] Create `tasks/real-estate/ai-skills/` or equivalent skill-pack folder.
- [ ] Add `mde-renter-intake` skill for OpenClaw sandbox intake.
- [ ] Add `mde-rental-ranking` skill for Hermes ranking drafts.
- [ ] Add `mde-crm-intelligence` skill for stale lead/next action analysis.
- [ ] Add `mde-fraud-scam-review` skill with advisory-only risk flags.
- [ ] Add `mde-safe-whatsapp-reply` skill with opt-in, no legal/payment authority, and escalation rules.
- [ ] Add a public-skill review matrix for ClawHub/Skills.sh candidates with keep/rewrite/reject/defer decision.
- [ ] Add forbidden actions list: payments, refunds, legal advice, protected-class screening, cold mass outreach, unapproved scraping, final publish.
- [ ] Add at least 10 eval prompts covering safe, unsafe, and escalation cases.
- [ ] Document installation/use path for Hermes/OpenClaw without committing secrets.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Skills | `tasks/real-estate/ai-skills/*/SKILL.md` | Create local reviewed skill docs |
| Audit | `tasks/real-estate/ai-skills/skill-review-matrix.md` | Create public skill review matrix |
| Tests | `tasks/real-estate/ai-skills/eval-prompts.md` | Create eval prompt set |
| Docs | `tasks/real-estate/103-openclaw-real-estate.md` and `104-hermes-real-estate.md` | Link/update when implementation ships |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Skill recommends direct payment action | Eval fails; skill is blocked or revised |
| Skill mentions protected-class screening | Eval fails and escalates to human/legal review |
| Skill wants to scrape Facebook/MLS | Mark as forbidden unless explicit source permission exists |
| Skill has scripts or external calls | Requires manual code review before install |
| Agent receives private document | Skill instructs secure upload/human review, not local memory storage |

## Real-World Examples

**Scenario 1 - Safe intake:** A renter provides budget and move-in date. **With this implementation,** the skill extracts fields and asks one missing question.

**Scenario 2 - Unsafe legal ask:** A renter asks whether to sign a lease. **With this implementation,** the skill explains it cannot provide legal advice and creates a review task.

**Scenario 3 - Public skill review:** A ClawHub skill includes broad investment advice. **With this implementation,** the matrix marks it as rewrite/defer for later investor workflows.

## Outcomes

| Before | After |
|--------|-------|
| Public skills are tempting but risky | mdeai has owned, reviewed skills |
| Agent guardrails are scattered across reports | Forbidden actions are explicit |
| Hermes/OpenClaw prompts can drift | Shared skill docs align both systems |
| No eval prompts exist for unsafe cases | Skill behavior has repeatable checks |
