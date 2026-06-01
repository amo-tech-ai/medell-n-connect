---
id: UX-028
title: PlaceResultCard minimum fallback upgrade
status: Not Started
priority: P1
phase: Card unification — fallback quality
effort: 2-3h
owner: claude
depends_on: [UX-021]
blocks: []
risk: 🟢 Low
complexity: S
skill: [mde-task-lifecycle, shadcn, testing]
related:
  - ../tests/22-card-audit.md
description: Until RestaurantCard ships, upgrade PlaceResultCard — 64px glyph, Badge price, Button Maps CTA, onOpenDetails hook — audit R-08.
---

# UX-028 — PlaceResultCard fallback upgrade

## Purpose

Bridge quality gap for unknown/sparse categories and interim restaurant path.

## Changes

- 64×64 `bg-muted` + `MapPin` icon placeholder
- `priceLabel` → `<Badge variant="outline">`
- Maps link → `<Button size="sm" variant="outline">View on Maps</Button>`
- `overflow-hidden` on root
- Optional `onOpenDetails` for future panel

## Acceptance

- [ ] Fallback card visually closer to café cards.
- [ ] Used only when no domain-specific card (document in comment).
- [ ] Tests updated.

## Flow diagram

```mermaid
flowchart TD
  Sparse[Sparse tool payload] --> FB[PlaceResultCard fallback]
  FB --> Glyph[64px MapPin glyph]
  FB --> Badge[Price Badge]
  FB --> Maps[View on Maps Button]
```

## Verification (2026-05-31)

| Claim | Result |
|-------|--------|
| Interim until UX-025 | ✅ Correct scope |
| Required testId today | 🔴 no default — fix in UX-021 |
