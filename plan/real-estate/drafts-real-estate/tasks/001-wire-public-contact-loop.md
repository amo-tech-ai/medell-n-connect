---
task_id: 001-RE
title: Wire Public Apartment Contact Loop
phase: CRITICAL
priority: P0
status: Not Started
estimated_effort: 2 days
area: real-estate-rentals
wizard_step: null
skill: [mde-real-estate, mde-task-lifecycle]
subagents: [frontend, supabase-auditor]
edge_function: lead-from-form
schema_tables: [apartments, landlord_profiles, landlord_inbox]
depends_on: []
figma_prompt: null
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** Wire Public Apartment Contact Loop
> **Why:** The audit found the highest-risk launch blocker: `src/pages/ApartmentDetail.tsx` renders `Check Availability` and `Contact Host` actions, but the buttons do not complete the public renter-to-landlord flow.…
> **Delivers:** `lead-from-form` edge fn + migrations: `apartments`, `landlord_profiles`, `landlord_inbox`
> **Tools/Skills:** `mde-real-estate` · `mde-task-lifecycle`
> **CRITICAL · P0 · Not Started · Effort: 2 days**

# Wire Public Apartment Contact Loop

| Aspect | Details |
|--------|---------|
| **Screens** | `/apartments/:id`, public apartment detail, contact modal |
| **Features** | Working Contact Host CTA, WhatsApp-first lead capture, legacy contact fallback |
| **Edge Functions** | `lead-from-form` |
| **Tables** | `apartments`, `landlord_profiles`, `landlord_inbox` |
| **Agents** | None for V1 |
| **Real-World** | "A renter opens a listing, submits contact details, gets a WhatsApp link, and the landlord sees the lead." |

## Description

**The situation:** The audit found the highest-risk launch blocker: `src/pages/ApartmentDetail.tsx` renders `Check Availability` and `Contact Host` actions, but the buttons do not complete the public renter-to-landlord flow. `src/components/apartments/WhatsAppContactModal.tsx` exists and has tests, but it is dormant because it is not mounted from the main listing detail page.

**Why it matters:** This is the revenue artery. If a renter cannot contact a landlord from a public listing, the marketplace is demo-ready but not launch-ready.

**What already exists:** `WhatsAppContactModal`, `ContactHostDialog`, `lead-from-form`, landlord public profile RPCs, `landlord_inbox`, `/host/leads`, and `WhatsAppReplyButton` already exist. The missing work is wiring, state handling, and proof.

**The build:** Update `ApartmentDetail` so landlord-backed listings open `WhatsAppContactModal`. Keep `ContactHostDialog` only for legacy listings without `landlord_id`. Ensure both visible CTAs use the same working contact path and no public renter auth is required.

**Example:** Sofia, a traveler in Laureles, opens an approved landlord listing from her phone. She taps `Contact Host`, enters her name and WhatsApp number, submits, receives a `wa.me` link, and the landlord gets a new `landlord_inbox` row.

## Rationale

**Problem:** The UI advertises a contact action that does not reliably create a lead.

**Solution:** Use the already-built WhatsApp-first contact modal and backend function as the default flow for landlord listings.

**Impact:** Public renters can become real leads, landlords have inbox proof, and the team can manually coordinate showings without building full lead-to-lease automation.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Guest renter | contact the host from a listing | I can ask availability without signing up |
| Landlord | receive inquiries in my host inbox | I can respond quickly on WhatsApp |
| Founder/operator | verify a lead was created | I can prove the marketplace loop works |

## Goals

1. **Primary:** Public apartment detail creates a landlord lead through `lead-from-form`.
2. **Quality:** No dead CTAs, no auth requirement for renters, and clear loading/error states.

## Acceptance Criteria

- [ ] `Contact Host` opens `WhatsAppContactModal` when `apartment.landlord_id` exists.
- [ ] `Check Availability` uses the same working contact flow or is relabeled to match the exact action.
- [ ] Legacy listings without `landlord_id` use `ContactHostDialog` or a clear fallback.
- [ ] Modal submission invokes `lead-from-form` with listing, landlord, renter name, phone/WhatsApp, and message data.
- [ ] Successful submission returns or opens the landlord WhatsApp deep link without requiring renter auth.
- [ ] Loading, disabled, validation, and backend error states are visible and do not lose form input.
- [ ] Existing `WhatsAppContactModal` tests are updated for the new mount path.
- [ ] Add or update a route/component test proving the public CTA opens the correct modal.
- [ ] `npm run test -- src/components/apartments/WhatsAppContactModal.test.tsx` passes.
- [ ] Browser smoke confirms `/apartments/:id` has no dead contact buttons.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Page | `src/pages/ApartmentDetail.tsx` | Modify: mount modal, wire CTA handlers, pass listing/landlord data |
| Component | `src/components/apartments/WhatsAppContactModal.tsx` | Reuse; adjust props only if needed |
| Component | `src/components/apartments/ContactHostDialog.tsx` | Keep as legacy fallback |
| Edge Function | `supabase/functions/lead-from-form/index.ts` | Reuse; verify expected request payload |
| Tests | `src/components/apartments/WhatsAppContactModal.test.tsx` | Update/add coverage for public detail wiring |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Listing has no `landlord_id` | Show legacy contact fallback, not a broken WhatsApp modal |
| Landlord has no WhatsApp number | Create lead if allowed and show "host will reply soon"; do not open invalid `wa.me` |
| Edge function returns validation error | Keep modal open, show field-specific or form-level error |
| Anonymous renter | Submission works without Supabase auth |
| Duplicate fast clicks | Submit button disables while request is pending |

## Real-World Examples

**Scenario 1 - Happy path:** Sofia finds a furnished apartment in El Poblado. Today she can tap a CTA that does not reliably connect her to the landlord. **With this implementation,** she submits once, gets a WhatsApp link, and the landlord receives an inbox row.

**Scenario 2 - Legacy listing:** Mateo opens an older imported apartment that has no landlord profile. **With this implementation,** he sees the legacy contact dialog instead of a broken WhatsApp modal.

**Scenario 3 - Backend failure:** The edge function rate-limits a repeated phone number. **With this implementation,** the modal shows a retry-safe error and preserves the renter's message.

## Outcomes

| Before | After |
|--------|-------|
| Apartment detail CTAs can be dead | Every public contact CTA has a handler |
| WhatsApp modal exists only in tests | WhatsApp modal is used by real renters |
| Landlord lead backend is disconnected from main listing page | `lead-from-form` writes real `landlord_inbox` rows |
| Roadmap says lead capture is mostly missing | The launch-critical lead loop is testable |
