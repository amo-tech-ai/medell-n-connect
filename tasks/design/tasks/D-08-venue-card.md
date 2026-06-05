---
id: D-08
linear: SAN-574
phase: 3
status: Todo
blocked_by: [D-02, D-03, D-05]
outputs:
  - mdeapp/src/components/browse/VenueCard.tsx
  - mdeapp/src/components/browse/BrowseLayout.tsx
---

# D-08 — Shared browse system (VenueCard + BrowseLayout)

## Purpose

One card + one layout for restaurants, nightlife, cafés, rentals browse — image · name · rating · 2-line clamp · actions.

## Acceptance criteria

- [ ] `<VenueCard>` consolidates existing RestaurantCard / cafe / rental patterns (do **not** rebuild from zero)
- [ ] `<BrowseLayout>`: FilterBar · ResultsColumn · MapColumn (desktop split; mobile toggle)
- [ ] Image slot per D-03; tokens per D-02
- [ ] Card click → detail sheet (not Google-only Directions)
- [ ] `mapId` on parent `<Map>`; FieldMask on Places calls
- [ ] Vitest for card shape + layout modes

## Wireframe / spec references

- [`../README.md`](../README.md) §2A Browse system
- [`../mockups/cafes.html`](../mockups/cafes.html)
- [`../wireframes/real-estate/009-scr-rental-card-polish.md`](../wireframes/real-estate/009-scr-rental-card-polish.md)

## Legacy / dedup

- **Reuse:** SAN-360, SAN-437, shipped restaurant/rental/café cards
- **Absorb:** duplicate card shell tickets → SAN-574

## Blockers

SAN-462 soak **Done** (2026-06-05). D-02/D-03/D-05 complete — assignable.

## Proof

`npm run build` · Browser: one vertical shows unified card · map pins optional in D-11
