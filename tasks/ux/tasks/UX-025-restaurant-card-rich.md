---
id: UX-025
title: RestaurantCard rich — photo, rating, badges, detail panel
status: Not Started
priority: P1
phase: Card unification M2
effort: 6-8h
owner: claude
depends_on: [UX-022, UX-023]
blocks: [UX-030]
risk: 🟡 Medium
complexity: M
skill: [mde-task-lifecycle, shadcn, mde-maps, copilotkit-integrations, testing]
related:
  - UX-010-CARD-UNIFICATION-STRATEGY.md
  - ../tests/22-card-audit.md
description: Replace PlaceResultCard as primary restaurant renderer with RestaurantCard on ResultCardShell — photo, rating, cuisine/price/open badges, Directions/Details, VenueDetailSheet or place detail.
---

# UX-025 — RestaurantCard rich (M2)

## Purpose

Tourist asking "best ramen Poblado" gets café-quality cards, not title + plain link.

## Affected files

| Create | Modify |
|--------|--------|
| `restaurant-card.tsx` | `search-tool-renders.tsx` restaurant branch |
| | `domain-results.tsx` renderCard |
| | Reuse `places-display` formatters, `placesPhotoProxyUrl` |

## Data source

Consume existing restaurant tool payload fields (place_id, rating, photo, price_level, open_now) — **no tool schema change**.

## Detail panel

Minimum: `VenueDetailSheet` with place summary + Maps links. Full Places enrichment optional follow-up.

## Tests

- Vitest: maps sparse payload → glyph placeholder, no crash.
- Vitest: full payload → photo + Badge price + rating line.
- Playwright: restaurant query → N rich cards, 0 side-panel dup.

## Acceptance

- [ ] Restaurant branch renders `RestaurantCard`, not bare `PlaceResultCard`.
- [ ] Details CTA opens panel/sheet.
- [ ] Map pin sync via UX-022 contract.
- [ ] `npm run floor` green + browser evidence.

## Flow diagram

```mermaid
flowchart LR
  Tool[searchRestaurantsTool] --> Shell[ResultCardShell]
  Shell --> RC[RestaurantCard]
  RC --> Panel[VenueDetailSheet]
  RC --> Map[ToolPinsSync via UX-022]
```

## Verification (2026-05-31)

| Claim | Result |
|-------|--------|
| Depends UX-022 | ✅ pin sync prerequisite |
| Depends UX-023 | ✅ shell prerequisite |
| PlaceResultCard today | 🔴 minimal — 3/10 audit score |
