---
id: UX-020
title: CardInteractionProps and shared card types
status: Not Started
priority: P2
phase: Card unification M0 foundation
effort: 2-3h
owner: claude
depends_on: []
blocks: [UX-023, UX-024, UX-025]
risk: 🟢 Low
complexity: S
skill: [mde-task-lifecycle, shadcn, testing]
related:
  - UX-010-CARD-UNIFICATION-STRATEGY.md
  - ../tests/22-card-audit.md
description: Introduce shared CardInteractionProps, ResultKind, BaseResultCardProps — eliminate per-card interaction prop drift before ResultCardShell extraction.
---

# UX-020 — CardInteractionProps + shared types

## Purpose

Single source of truth for map-sync props (`pinId`, `onSelect`, `onOpenDetails`, `selected`, `testId`, `resultKind`) used by all search result cards.

## Affected files

| Action | Path |
|--------|------|
| Create | `mdeapp/src/components/cards/card-interaction-props.ts` |
| Modify | `cafe-result-card.tsx`, `rental-card.tsx`, `event-card.tsx`, `place-result-card.tsx` — extend type (no behavior change yet) |

## Implementation

1. Add types per strategy §3.
2. Export `DEFAULT_TEST_IDS` map per `ResultKind`.
3. Re-export from `components/cards/index.ts` if barrel exists; else direct imports.

## Tests

- Vitest: type-only compile + optional runtime helper `defaultTestId(kind)`.

## Acceptance

- [ ] All five cards import `CardInteractionProps` (or extend it).
- [ ] No runtime behavior change in this task alone.
- [ ] `npm run floor` green.

## Flow diagram

```mermaid
flowchart TD
  CIP[CardInteractionProps] --> Cafe[CafeResultCard]
  CIP --> Rental[RentalCard]
  CIP --> Event[EventCard]
  CIP --> Place[PlaceResultCard]
```

## Verification (2026-05-31)

| Claim | Result |
|-------|--------|
| Shared type exists | ❌ Not yet — create in this task |
| Blocks UX-023 | ✅ Correct dependency |
