---
task_id: 003-RE
title: Verify Landlord Linked Inventory
phase: HIGH
priority: P1
status: Not Started
estimated_effort: 1 day
area: real-estate-data
wizard_step: null
skill: [mde-real-estate, mde-task-lifecycle]
subagents: [supabase-auditor]
edge_function: null
schema_tables: [apartments, landlord_profiles, verification_requests]
depends_on: []
figma_prompt: null
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** Verify Landlord Linked Inventory
> **Why:** The audit verified migrations and code paths, but not live row counts. Real Estate E1 should not be marked done until active apartments are actually linked to landlord profiles with WhatsApp-ready contact data.
> **Delivers:** migrations: `apartments`, `landlord_profiles`, `verification_requests`
> **Tools/Skills:** `mde-real-estate` · `mde-task-lifecycle`
> **HIGH · P1 · Not Started · Effort: 1 day**

# Verify Landlord Linked Inventory

| Aspect | Details |
|--------|---------|
| **Screens** | `/apartments`, `/apartments/:id`, `/host/listings`, `/host/listing/new` |
| **Features** | Live inventory proof, landlord profile proof, photo/status readiness |
| **Edge Functions** | None required unless seeding through existing listing create flow |
| **Tables** | `apartments`, `landlord_profiles`, `verification_requests` |
| **Agents** | None |
| **Real-World** | "The beta starts with 3-5 real landlord-linked listings that can receive WhatsApp leads." |

## Description

**The situation:** The audit verified migrations and code paths, but not live row counts. Real Estate E1 should not be marked done until active apartments are actually linked to landlord profiles with WhatsApp-ready contact data.

**Why it matters:** A wired contact flow is useless without inventory that has a landlord behind it. Launching with legacy unowned listings can create renter interest that no landlord can answer.

**What already exists:** The landlord schema exists in `supabase/migrations/20260429000000_landlord_v1.sql`. Listing creation flows exist in `src/pages/host/ListingNew.tsx`, `src/hooks/host/useListingCreate.ts`, and `src/hooks/host/useListings.ts`.

**The build:** Run live Supabase checks for landlord-linked listings. If fewer than 3-5 launchable rows exist, create QA listings through the normal host flow or a clearly labeled seed migration. Do not fake completion with docs alone.

**Example:** The beta inventory includes five furnished apartments with `landlord_id`, public-safe host profile data, photos, visible moderation status, and `whatsapp_e164` ready for lead routing.

## Rationale

**Problem:** The roadmap confuses schema existence with launchable listing supply.

**Solution:** Treat live landlord-linked inventory as a production gate with query proof.

**Impact:** The team can drive renters to real listings and manually coordinate leads with actual landlords.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Guest renter | browse real available listings | I can contact a real landlord |
| Landlord | see my listing publicly | I can receive leads |
| Founder/operator | know launch inventory count | I can decide whether beta traffic is safe |

## Goals

1. **Primary:** Confirm at least 3-5 active landlord-linked apartment listings exist.
2. **Quality:** Inventory proof includes landlord WhatsApp readiness, public detail rendering, and photos/status checks.

## Acceptance Criteria

- [ ] Query live `apartments` count grouped by `landlord_id IS NOT NULL`.
- [ ] Query live active/visible landlord-linked listings with title, neighborhood, price, status, photo count, and landlord id.
- [ ] Query matching `landlord_profiles` for public display name and `whatsapp_e164` readiness.
- [ ] Confirm at least 3-5 launchable listings exist or create clearly labeled QA listings through approved flow.
- [ ] Confirm `/apartments/:id` renders at least one landlord-linked listing anonymously.
- [ ] Confirm `/host/listings` shows the same listing for the owning landlord.
- [ ] Document query output and any created QA listing IDs in the task completion notes.
- [ ] Do not mark E1 listing seed as done until live proof exists.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/20260429000000_landlord_v1.sql` | Reference existing schema only |
| Page | `src/pages/host/ListingNew.tsx` | Use for manual QA listing creation if needed |
| Hook | `src/hooks/host/useListingCreate.ts` | Verify create path still writes landlord fields |
| Hook | `src/hooks/host/useListings.ts` | Verify landlord dashboard reads created rows |
| Docs | `tasks/todo.md` | Update E1 percentage only after live proof |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Listings exist but no landlord WhatsApp | Count as not launchable for WhatsApp-first beta |
| Listings are pending moderation | Count separately from active public inventory |
| Photos are missing | Listing can be QA-only, not launch-ready |
| Live DB is unavailable | Do not update completion percent; record blocker |

## Real-World Examples

**Scenario 1 - Enough supply:** A query shows five approved apartments linked to two landlords. **With this implementation,** E1 can be updated from speculative progress to evidence-backed progress.

**Scenario 2 - Bad supply:** Ten apartments exist, but none have `landlord_id`. **With this implementation,** they remain legacy inventory and do not count as launch-ready landlord supply.

**Scenario 3 - QA seed:** Only two landlord listings exist. **With this implementation,** the team creates one to three clearly labeled QA listings through the normal host flow.

## Outcomes

| Before | After |
|--------|-------|
| E1 progress is inferred from migrations | E1 progress is backed by live row proof |
| Legacy inventory can be mistaken for landlord supply | Landlord-linked inventory is counted separately |
| Public detail readiness is unknown | At least one listing is browser-smoked anonymously |
| Launch supply gate is vague | 3-5 WhatsApp-ready listings becomes the beta threshold |
