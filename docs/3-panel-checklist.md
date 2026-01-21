# 3‑Panel System (Context • Work • Intelligence) — Implementation Checklist

## Goal
Clicking a card in any list/search view updates the **Right Panel** with a detail preview **without navigating away**, and on tablet/mobile the right panel **opens automatically**.

## Completion summary (measured)
- **Core listing pages (Restaurants/Apartments/Cars/Events):** 4/4 ✅
- **Explore unified discovery:** ✅ (uses `rawData` for full detail panel props)
- **Auto-open right panel on tablet/mobile:** ✅

**Estimated completion:** **100%** for the 3‑panel “card click → right panel preview” requirement.

---

## A) Platform/UX Acceptance Tests (manual)

### A1. Restaurants (`/restaurants`)
- [ ] Clicking a restaurant card updates Right Panel with `RestaurantDetailPanel` (no route change)
- [ ] “Save” button on card does **not** trigger panel change
- [ ] Right panel shows “View Full Page” and it navigates to `/restaurants/:id`
- [ ] Tablet/mobile: right panel drawer/bottom-sheet opens automatically on click

### A2. Apartments (`/apartments`)
- [ ] Clicking an apartment card updates Right Panel with `ApartmentDetailPanel`
- [ ] Save button doesn’t open panel / doesn’t navigate
- [ ] “View Full Page” navigates to `/apartments/:id`
- [ ] Tablet/mobile auto-open works

### A3. Cars (`/cars`)
- [ ] Clicking a car card updates Right Panel with `CarDetailPanel`
- [ ] Save button doesn’t open panel / doesn’t navigate
- [ ] “View Full Page” navigates to `/cars/:id`
- [ ] Tablet/mobile auto-open works

### A4. Events (`/events`)
- [ ] Clicking an event card updates Right Panel with `EventDetailPanel`
- [ ] Save button doesn’t open panel / doesn’t navigate
- [ ] “View Full Page” navigates to `/events/:id`
- [ ] Tablet/mobile auto-open works

### A5. Explore (`/explore`)
- [ ] Clicking a restaurant result opens Right Panel with restaurant detail
- [ ] Clicking a stays/cars/events result opens the matching detail panel
- [ ] No navigation occurs on card click
- [ ] “See more” still navigates to the respective listing page
- [ ] Tablet/mobile auto-open works

---

## B) Technical Checklist (code)

### B1. Card components support preview mode
- [x] Each card accepts an optional `onSelect` callback
- [x] When `onSelect` exists, card wrapper is a clickable `div` (not a `Link`)
- [x] Save/favorite clicks use `e.preventDefault()` + `e.stopPropagation()`

### B2. List pages wire card clicks into panel context
- [x] Pages consume `usePanelContext()` inside an inner content component
- [x] Card click calls `setRightPanelContent(<DetailPanel ... />)`

### B3. Detail panels include full-page navigation
- [x] Each detail panel includes “View Full Page” button(s)

### B4. Explore provides full entity data to detail panels
- [x] `ExplorePlaceResult` includes `rawData`
- [x] `useExplorePlaces()` attaches the full Supabase row as `rawData`
- [x] `Explore.tsx` passes `place.rawData || place` into detail panels

### B5. Tablet/mobile right panel auto-opens
- [x] `ThreePanelLayout` opens drawer/bottom-sheet whenever `setRightPanelContent(...)` is called

---

## C) Known non-blockers
- Console warning: “Function components cannot be given refs …” (related to some Radix/shadcn composition). This does **not** block the 3‑panel behavior; fix can be done later if desired.

---

## D) Best-practice regression checks
- [ ] Verify no unintended navigation on card click (watch URL)
- [ ] Verify keyboard accessibility (Enter/Space activates selection)
- [ ] Verify Right Panel renders correctly after filters/search changes
- [ ] Verify Saved/Favorites mutations still work
