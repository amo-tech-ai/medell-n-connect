# Progress Tracker

## Completed Features

### Phase 2.3 - Map Visualization (January 2026)
- ✅ **Itinerary Map View** - Route visualization with pins and dashed route lines
- ✅ **Travel Time Estimates** - Haversine distance calculation, 25 km/h average speed
- ✅ **TravelTimeIndicator** - Between-activity travel info with mode suggestions
- ✅ **Split View Builder** - List + Map side-by-side with toggle

### Phase 2.2 - Collections & Itinerary (January 2026)
- ✅ **Custom Collections System** - Full CRUD with card grid, preview images, color-coding
- ✅ **Visual Itinerary Builder** - Drag-and-drop with @dnd-kit, day-by-day planning
- ✅ **Events Discovery Enhancement** - Calendar view, enhanced filters, date presets

### Phase 2.1 - Multi-Trip Management (January 2026)
- ✅ **TripContext** - Global active trip state with localStorage persistence
- ✅ **TripSelector** - Sidebar component to switch between trips
- ✅ **Trip-scoped saved places** - `trip_id` column added to `saved_places`
- ✅ **AI trip awareness** - Concierge knows active trip context


> Single source of truth for all prompts and tasks.

## Prompts

| ID | Area | Item | Phase | Status | Links |
|----|------|------|-------|--------|-------|
| 00 | Reference | Index | — | done | [prompt](../prompts/00-index.md) |
| 03 | Listings | Apartments | 1 | done | [prompt](../prompts/03-listings-apartments.md) |
| 04 | Listings | Cars | 1 | done | [prompt](../prompts/04-listings-cars.md) |
| 05 | Listings | Restaurants | 1 | done | [prompt](../prompts/05-listings-restaurants.md) |
| 06 | Listings | Events | 1 | done | [prompt](../prompts/06-listings-events.md) |
| 07 | Core | Saved/Favorites | 1 | todo | [prompt](../prompts/07-saved-favorites.md) |
| 08 | Core | Explore | 1-2 | doing | [prompt](../prompts/08-explore-discover.md) |
| 19 | System | Right Panel Detail View | 1 | doing | [prompt](../prompts/19-right-panel-detail-view.md) |
| 09 | Core | Trips | 2 | todo | [prompt](../prompts/09-trips-planning.md) |
| 10 | Core | Bookings | 2 | todo | [prompt](../prompts/10-bookings-module.md) |
| 11 | AI | Chatbot System | 3 | todo | [prompt](../prompts/11-chatbot-system.md) |
| 12 | Backend | Supabase Schema | 1 | done | [prompt](../prompts/12-supabase-schema.md) |
| 13 | Backend | Edge Functions | 2-3 | todo | [prompt](../prompts/13-edge-functions.md) |
| 14 | AI | AI Agents | 2-3 | todo | [prompt](../prompts/14-ai-agents.md) |
| 15 | Core | Home Dashboard | 1 | todo | [prompt](../prompts/15-home-dashboard.md) |
| 16 | System | 3-Panel Layout | 1 | done | [prompt](../prompts/16-3-panel-system.md) |
| 17 | Reference | User Journeys | — | done | [prompt](../prompts/17-user-journey.md) |
| 18 | Reference | Wizards Guide | — | done | [prompt](../prompts/18-wizards.md) |

## Implementation Order

> Follow [NEXT-STEPS.md](../NEXT-STEPS.md) for detailed guidance.

| Step | Task | Prompt | Status | Notes |
|------|------|--------|--------|-------|
| ✅ | Project setup | — | done | Vite + React + TS |
| ✅ | Supabase connection | 12 | done | Connected to `medellin` |
| ✅ | Authentication | — | done | Email + Google OAuth |
| ✅ | Home page | 08 | done | Hero, categories, featured |
| ✅ | Documentation structure | — | done | /docs, /rules |
| ✅ | 3-panel layout system | 16 | done | ThreePanelLayout, LeftPanel, RightPanel |
| ✅ | Responsive navigation | 16 | done | Mobile bottom nav + sheet |
| ✅ | Apartments list | 03 | done | List page with filters |
| ✅ | Apartments detail | 03 | done | Detail page with right panel |
| ✅ | Cars list | 04 | done | List page with filters |
| ✅ | Cars detail | 04 | done | Detail page with right panel |
| ✅ | Restaurants list | 05 | done | List page with filters |
| ✅ | Restaurants detail | 05 | done | Detail page with right panel |
| ✅ | Events list | 06 | done | List page with filters |
| ✅ | Events detail | 06 | done | Detail page with right panel |
| ✅ | Saved dashboard upgrade | 07 | done | 3-panel layout, type filters |
| ✅ | Collections CRUD | 07 | done | Create/edit/delete collections |
| ✅ | Explore unified search | 08 | done | Supabase multi-table queries |
| ✅ | Explore category tabs | 08 | done | Counts per category |
| ✅ | ExploreCard component | 08 | done | Unified card with real save |
| 7.1 | Real map integration | 08 | todo | Mapbox or Google Maps |
| 8.1 | Home dashboard | 15 | todo | Post-login experience |
| 9.1 | Trips list | 09 | todo | Phase 2 |
| 9.2 | Trip detail | 09 | todo | Phase 2 |
| 10.1 | Bookings dashboard | 10 | todo | Phase 2 |
| 10.2 | Booking wizards | 10 | todo | Phase 2 |
| 11.1 | Edge functions | 13 | todo | Phase 2-3 |
| 12.1 | AI chatbot | 11 | todo | Phase 3 |
| 13.1 | AI agents | 14 | todo | Phase 3 |
