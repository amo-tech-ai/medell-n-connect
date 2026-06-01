---
task_id: 002-RE
title: Fix Rentals UI And Edge Function Contract
phase: CRITICAL
priority: P0
status: Not Started
estimated_effort: 2 days
area: real-estate-rentals
wizard_step: null
skill: [mde-real-estate, mde-task-lifecycle]
subagents: [frontend, supabase-auditor]
edge_function: rentals
schema_tables: [apartments]
depends_on: []
figma_prompt: null
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** Fix Rentals UI And Edge Function Contract
> **Why:** The audit found a contract mismatch between `supabase/functions/rentals/index.ts` and the rentals UI. The edge function returns nested search data under `results.listings` and `results.total_count`, plus `map_data.pins`…
> **Delivers:** `rentals` edge fn + migrations: `apartments`
> **Tools/Skills:** `mde-real-estate` · `mde-task-lifecycle`
> **CRITICAL · P0 · Not Started · Effort: 2 days**

# Fix Rentals UI And Edge Function Contract

| Aspect | Details |
|--------|---------|
| **Screens** | `/rentals`, rentals results, listing detail panel |
| **Features** | Response normalization, correct result counts, correct map pins, listing detail request fix |
| **Edge Functions** | `rentals` |
| **Tables** | `apartments` |
| **Agents** | Rentals intake only; no new AI orchestration |
| **Real-World** | "A renter searches Laureles and sees the same count, facets, pins, and detail data the edge function returns." |

## Description

**The situation:** The audit found a contract mismatch between `supabase/functions/rentals/index.ts` and the rentals UI. The edge function returns nested search data under `results.listings` and `results.total_count`, plus `map_data.pins` and `filters_available`. The UI currently treats the whole response as the search result, expects top-level `listings`, reads `results.total`, `results.facets`, and top-level `map_pins`. The listing detail UI sends `listing_id`, while the edge function `action: "listing"` expects `body.id`.

**Why it matters:** Search can look broken even when the backend is returning data. Bad counts, empty pins, missing facets, or failed detail requests will destroy trust before the contact loop has a chance to convert.

**What already exists:** `src/components/rentals/RentalsSearchResults.tsx`, `src/components/rentals/RentalsListingDetail.tsx`, `src/components/rentals/RentalsIntakeWizard.tsx`, `src/components/rentals/RentalsWizardForm.tsx`, and `supabase/functions/rentals/index.ts` already exist.

**The build:** Define one canonical response shape or a narrow normalizer shared by the UI components. Normalize `results.listings`, `results.total_count`, `map_data.pins`, and `filters_available` into the component-facing shape, or change the edge response deliberately and update tests. Fix the detail request payload. Prefer `supabase.functions.invoke` or the existing Supabase client pattern over duplicated hard-coded function URLs where possible.

**Example:** Daniel searches for "2 bedroom in Laureles under 4M COP." The results count, filter facets, map pins, and selected listing detail all render from the same backend response without shape drift.

## Rationale

**Problem:** The frontend and edge function disagree on the API contract.

**Solution:** Normalize the response once, update UI reads, and correct the detail request payload.

**Impact:** Search becomes reliable enough to send traffic into the public contact flow.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Guest renter | see accurate search results | I can trust the listings shown |
| Guest renter | open listing details from results | I can decide whether to contact the host |
| Developer | maintain one rentals contract | I do not re-break UI every time the edge response changes |

## Goals

1. **Primary:** Rentals UI renders the actual `rentals` edge function response correctly.
2. **Quality:** Search and detail behavior is covered by targeted tests and no duplicated response parsing remains.

## Acceptance Criteria

- [ ] `RentalsSearchResults` reads listings from `results.listings` or a tested normalizer, not from a nonexistent top-level `listings`.
- [ ] `RentalsSearchResults` reads the correct total from `results.total_count` or a tested normalizer.
- [ ] Filter/facet UI reads from `filters_available` or a tested normalizer.
- [ ] Map pins read from `map_data.pins` or a tested normalizer.
- [ ] `RentalsListingDetail` sends `id` when requesting listing detail from `rentals`.
- [ ] All remaining hard-coded function URL usage is removed or documented if intentionally retained.
- [ ] Response types are centralized in a local type/normalizer instead of repeated ad hoc object access.
- [ ] Empty, loading, and malformed-response states render explicit fallback UI.
- [ ] Add tests for at least one successful search response and one successful detail request.
- [ ] `npm run test` passes for the touched rentals components or hooks.
- [ ] If edge function code changes, run the edge/config verification command created by `005-RE`; if that command does not exist yet, complete `005-RE` first or document the exact manual Supabase verification commands used.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Component | `src/components/rentals/RentalsSearchResults.tsx` | Modify: consume canonical response shape |
| Component | `src/components/rentals/RentalsListingDetail.tsx` | Modify: send `id`, consume canonical detail shape |
| Component | `src/components/rentals/RentalsWizardForm.tsx` | Review: ensure response handoff matches normalized contract |
| Component | `src/components/rentals/RentalsIntakeWizard.tsx` | Review: ensure search completion uses normalized contract |
| Edge Function | `supabase/functions/rentals/index.ts` | Modify only if backend shape should become canonical instead |
| Types | `src/components/rentals/` or `src/lib/` | Add small response normalizer/types if no existing home fits |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Edge returns `results.total_count` but no pins | Results still render; map panel shows empty pin state |
| Detail request gets 404 | UI shows not-found state without clearing search results |
| AI intake returns partial filters | Search falls back to deterministic filter defaults |
| Function URL/env is unavailable | UI reports configuration error in dev; no silent blank page |

## Real-World Examples

**Scenario 1 - Accurate search:** Daniel searches Laureles rentals. Today the backend can return results while UI reads the wrong count fields. **With this implementation,** result count, filters, and pins match the backend payload.

**Scenario 2 - Listing detail:** A renter clicks a result. Today the UI can send `listing_id` while the edge expects `id`. **With this implementation,** detail fetch succeeds and the renter can continue to contact.

**Scenario 3 - Partial response:** The AI intake returns search metadata but no map pins. **With this implementation,** the results list still works and the map shows a clear empty state.

## Outcomes

| Before | After |
|--------|-------|
| UI expects top-level listings but edge nests them under `results.listings` | One tested rentals contract drives results and detail |
| Detail request can fail from payload mismatch | Listing detail request uses the expected `id` |
| Map pins and facets can silently disappear | Missing fields have explicit fallback states |
| Search reliability is unknown | Targeted tests prove core response behavior |
