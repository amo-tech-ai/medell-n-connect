---
id: UX-022
title: DomainResults wrapper — fix restaurant/attraction registrar and pin sync
status: Not Started
priority: P0
phase: Card unification M1
effort: 4-6h
owner: claude
depends_on: [UX-014]
blocks: [UX-025, UX-030]
risk: 🟢 Low
complexity: M
skill: [mde-task-lifecycle, copilotkit-integrations, mde-maps, testing]
related:
  - ../UX-010-unified-result-card-architecture.md
  - UX-010-CARD-UNIFICATION-STRATEGY.md
  - ../tests/22-card-audit.md
description: GenericResults mounts ToolPinsSync but NOT RichCardResultsRegistrar and does NOT pass pinId/onSelect/selected to PlaceResultCard — side-panel dup + broken map hover. Bundle pins+registrar+cards in DomainResults.
---

# UX-022 — DomainResults wrapper (P0 ship blocker)

## Purpose

Close the structural bug: restaurant/attraction searches show **duplicate side-panel rows** and cards **cannot highlight map pins**.

## Root cause (verified on disk)

`GenericResults` (`search-tool-renders.tsx` ~418):

- ✅ `ToolPinsSync`
- ❌ No `RichCardResultsRegistrar`
- ❌ `PlaceResultCard` rendered without `pinId`, `selected`, `onSelect`

Compare `RentalResults` / `GroundedCafeResults` / `EventResults` — all three pass `selectedPinId`, `panToPin`, registrar.

## Affected files

| Action | Path |
|--------|------|
| Create | `mdeapp/src/components/copilot/domain-results.tsx` |
| Modify | `search-tool-renders.tsx` — route restaurant/attraction through wrapper; **pass `pinId`/`selected`/`onSelect` at the `GenericResults` call site (~L448)** |
| No change | `place-result-card.tsx` — **already accepts `pinId`/`selected`/`onSelect` (L7-9, `interactive = Boolean(onSelect && pinId)`).** The gap is the caller omitting them, not a missing prop. |
| Test | `domain-results.test.tsx`, update `rich-card-results` tests |

## DomainResults API

```tsx
<DomainResults
  category="restaurant"
  result={result}
  rows={rows}
  renderCard={(row, ctx) => (
    <PlaceResultCard
      pinId={ctx.pinId}
      selected={ctx.selected}
      onSelect={ctx.onSelect}
      ...
    />
  )}
  emptyState={<GenericEmptyState category="restaurant" ... />}
/>
```

Internally: `ToolPinsSync` + `RichCardResultsRegistrar` + scroll-into-view on `selectedPinId` + list ref.

**Verified gap:** `GenericResults` @ `search-tool-renders.tsx:418` — pins only, no registrar, no `pinId`/`onSelect` on cards.

## Flow diagram

```mermaid
flowchart TD
  GR[GenericResults restaurant] --> TPS[ToolPinsSync ✅]
  GR --> REG[RichCardResultsRegistrar ❌]
  GR --> PRC[PlaceResultCard no pinId ❌]
  DR[DomainResults target] --> TPS2[ToolPinsSync]
  DR --> REG2[RichCardResultsRegistrar]
  DR --> PRC2[PlaceResultCard pinId + onSelect]

  style REG fill:#fde2e2,stroke:#c0392b
  style REG2 fill:#e7f6e7,stroke:#27ae60
```

## Verification (2026-05-31)

| Claim | Result |
|-------|--------|
| Event has registrar | ✅ L343 (not broken) |
| Restaurant/attraction registrar | 🔴 Missing — `GenericResults` L418 has `ToolPinsSync` only, no registrar |
| `PlaceResultCard` pin props exist | ✅ Component accepts `pinId`/`selected`/`onSelect` (L7-9) — caller at ~L448 omits them |
| Cafe/rental pattern | ✅ Reference implementation (grounded:129, rental:211, event:343) |

## Tests

- Vitest: mounting DomainResults registers count → `shouldSuppressGenericMapResults(true)`.
- Vitest: unmount clears count.
- Vitest: each row gets unique `data-pin-id`.

## Acceptance

- [ ] Restaurant search: 0 duplicate side-panel pin rows when cards visible.
- [ ] Click/hover card highlights matching map pin.
- [ ] Pin click scrolls card into view.
- [ ] Attraction path identical.
- [ ] Event/rental/café behavior unchanged.
- [ ] `npm run floor` green.
- [ ] Browser evidence: restaurant query on `/`.

## Dependencies

**UX-014** — agent path must emit tool results to UI; wrapper fixes fast-path/render-path sync only.
