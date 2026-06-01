---
id: EVP-013-core
legacy_id: F25
title: Port EventCard + EventFilters component
status: Partial
priority: P0
phase: mvp
persona: andres
project: andres-commerce
milestone: P0
imp: "081"
linear: SAN-117
percent: 45
blocked_by: [SCREEN-006-e2e-event-card]
blocks: [EVP-001-core, EVP-014-core]
effort: 1.5h (EventCard + EventFilters + tests + smoke)
owner: sanjiovani
depends_on: [F07]
skill: [shadcn, react-best-practices]
parent_plan: /home/sk/mdeai/plan/07-legacy-design-port-plan.md
verified_against:
  - legacy: /home/sk/mde/src/components/events/{EventCard,EventFilters,EnhancedEventFilters,EventsCalendar}.tsx
  - mdeapp F07 components: card, badge, button, separator
  - PRD §20 (generative UI) + §51 (W3 host event flow)
---

# EVP-013-core — EventCard + EventFilters

## 1. Purpose

Roberto's W3 hero flow ships `/host/event/new` (creation) and `/host/events` (list). Both — plus Tourist's W6 concierge event suggestions — need a single shared `<EventCard>` shape. Legacy proved it across `EventCard.tsx`, `EventFilters.tsx`, `EnhancedEventFilters.tsx`. EVP-013-core ports the card + the filter primitives into Paisa-tokenised shadcn compositions, used standalone on `/host/events` AND inline in CopilotKit generative UI.

## 2. Goals

- `mdeapp/src/components/events/EventCard.tsx` — `<EventCard>` from shadcn primitives
- `mdeapp/src/components/events/EventFilters.tsx` — neighborhood + date-range + price filter (uses shadcn `<Input>`, `<DropdownMenu>`)
- `mdeapp/src/app/events/preview/page.tsx` — test fixture route (≥ 3 sample events)
- ≥ 3 Vitest tests (card renders · filter changes state · empty-state shows message)
- No inline hex; no `react-hook-form` (filters use plain `useState`)
- Date display in Roberto's locale (Spanish month names deferred to Phase 2 per CLAUDE.md Language scope)
- Hero crop from F22 (`/hero/colonial-street.jpg` or similar)

## 3. Features (persona value)

| Persona | What they get |
|---|---|
| **Roberto** | A consistent event tile across his draft list, published list, and Tourist chat suggestions |
| **Tourist** | Sees the same card shape when chat surfaces an upcoming event ("salsa tonight") |
| **Sofía** | One component to update; new field = one file change |

## 4. Workflows

1. **Pre-flight:**
   ```bash
   ls /home/sk/mde/src/components/events/   # source files
   ls mdeapp/src/components/ui/   # shadcn primitives from F07
   ls mdeapp/public/hero/   # F22 photos
   ```
2. Create `mdeapp/src/components/events/EventCard.tsx`:
   - Props: `{ event: EventListing }` where `EventListing = { id, title, neighborhood, dateIso, venue, priceMinCop, photoPath, capacity }`
   - Composition: `<Card>` with header (image + title + neighborhood badge), content (date + venue + capacity), footer (price + "View tickets" button)
3. Create `mdeapp/src/components/events/EventFilters.tsx`:
   - State: `{ neighborhood, dateRange, priceMax }` via `useState`
   - Primitives: shadcn `<Input>` (search), `<DropdownMenu>` (neighborhood + date), `<Button>` ("Clear filters")
   - Emit changes via `onChange` callback prop — parent owns filter state
4. Create `mdeapp/src/app/events/preview/page.tsx`:
   - Renders 3 hardcoded `EventListing` fixtures wrapped in `<EventFilters>` + 3 `<EventCard>`
5. Add `mdeapp/src/components/events/__tests__/EventCard.test.tsx`:
   - T-A: renders title + neighborhood
   - T-B: shows "Sold out" badge when capacity = 0
   - T-C: filter onChange fires when user types in search input
6. `npm run floor` — exit 0.
7. Gate 9 — boot dev, `curl :3001/events/preview` → HTTP 200, body contains "Salsa Night" (sample fixture).
8. Write `tasks/notes/EVP-013-core-evidence.md`.

## 5. User journeys

- **Roberto** in W3 production `/host/events` → sees draft + published events as a list of `<EventCard>`, can filter by neighborhood.
- **Roberto** in `/host/event/new` after publishing → preview step renders the just-created event as an `<EventCard>` for sanity check.
- **Tourist** in W6 chat ("salsa tonight") → CopilotKit generative-UI renders the same `<EventCard>` inline.

## 6. Agents

None directly. Used by EVP-004-core eventAgent's tool output renderer (downstream).

## 7. Integrations

| Integration | Purpose |
|---|---|
| F07 shadcn primitives | Card / Badge / Button / Input / DropdownMenu / Separator |
| F22 photo library | Hero crops |
| Next 16 `<Image>` | Optimisation |
| Vitest + `@testing-library/react` | Unit tests |
| `Intl.DateTimeFormat` (built-in) | Date formatting; locale stays `en-US` Phase 1 |

## 8. Summary

Build `<EventCard>` + `<EventFilters>` from F07 primitives + F22 photos, render from a test-only preview route, ship 3 tests. ~1.5h. Same component used 3 places (Roberto draft list, Roberto published list, Tourist chat).

## 9. Definition of Done

- [ ] `mdeapp/src/components/events/EventCard.tsx` exists
- [ ] `mdeapp/src/components/events/EventFilters.tsx` exists
- [ ] `mdeapp/src/app/events/preview/page.tsx` exists
- [ ] `mdeapp/src/components/events/__tests__/EventCard.test.tsx` with ≥ 3 passing tests
- [ ] No inline hex; no `style={{`
- [ ] No `react-hook-form` import in this directory
- [ ] `npm run floor` exits 0
- [ ] Localhost `curl :3001/events/preview` returns HTTP 200 + sample event title
- [ ] Evidence at `tasks/notes/EVP-013-core-evidence.md`

## 10. Tests

| # | Test | Expected |
|---|---|---|
| T1 | Card file exists | `test -f mdeapp/src/components/events/EventCard.tsx` |
| T2 | Filters file exists | `test -f mdeapp/src/components/events/EventFilters.tsx` |
| T3 | Preview route exists | `test -f mdeapp/src/app/events/preview/page.tsx` |
| T4 | Vitest passes | `npm test` shows ≥ 3 new tests in events suite |
| T5 | No inline hex | `! grep -rE '#[0-9a-f]{3,6}' mdeapp/src/components/events/` |
| T6 | No react-hook-form | `! grep -r 'react-hook-form' mdeapp/src/components/events/` |
| T7 | Floor green | `npm run floor` exit 0 |
| T8 | Localhost smoke | `curl -s :3001/events/preview` → HTTP 200 + fixture title in body |

### Negative test

| Tn1 | Inject `react-hook-form` import | T6 fails — confirms no form-state coupling at card level |

## 11. Rollback

```bash
rm -rf mdeapp/src/components/events/ mdeapp/src/app/events/preview/
```

## Notes

- **No CopilotKit interference:** the component is pure JSX; works inside `useCopilotAction({ render })` without state coupling.
- **`react-day-picker` deferred** — EVP-013-core filters use shadcn `<DropdownMenu>` for date presets (this week / next week / this month). A full calendar widget is F26+ territory.
- **Spanish dates deferred** to Phase 2 — locale is `en-US` per CLAUDE.md Language scope.
