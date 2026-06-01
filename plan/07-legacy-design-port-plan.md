---
title: Legacy /home/sk/mde/ design — port plan to mdeapp
date: 2026-05-20
status: plan (ready to slice into F22+ task specs)
scope: design assets (components, brand, hero images, page layouts) — NOT business logic
constraints:
  - legacy is FROZEN (per FREEZE.md from F10) — read-only reference
  - mdeapp pins Paisa palette (F07, OKLCH) — legacy emerald palette does NOT replace it
  - mdeapp pins CopilotKit 1.55.2 + Mastra beta + Next 16 App Router — legacy is Vite + React Router 18
  - F06+F07+F08 just shipped — auth + shadcn baseline + Vercel preview done
---

# Legacy design port — analysis + plan

## TL;DR

Legacy `/home/sk/mde/` is a Vite/React-18 SPA with ~30 routes, ~15 component domains, a "luxury emerald + cream" palette, and a deep brand-asset library (15+ Medellín hero photos, Material-style red-heart wordmark). It contains a **lot** of work worth harvesting for mdeapp — most valuable in roughly this order: **hero images > component shapes > brand wordmark > page layouts > Sentry pattern**. Most code does NOT directly port (different framework, different palette, different chat layer); the **patterns and assets** do.

## What's there — full inventory

### Top-level pages (~30 routes — legacy Vite under `src/pages/`)

| Page | Persona | mdeapp status |
|---|---|---|
| `Home`, `Index`, `HowItWorks`, `Pricing`, `Privacy` | All | mdeapp has only `/` (chat shell) — landing copy not yet ported |
| `Login`, `ForgotPassword`, `ResetPassword` | Roberto/Camila | ✅ **F08 shipped** — fresh impl, do NOT re-port |
| `Onboarding` | First-time user | ⚪ not yet |
| `Concierge` (chat) | Tourist | CopilotKit sidebar already lives at `/` — partial coverage |
| `Apartments`, `ApartmentDetail`, `Rentals` | Camila | ⚪ W5 — biggest port target |
| `Cars`, `CarDetail` | Tourist | ⚪ deferred (not in Phase 1 PRD) |
| `Coffee`, `CoffeeDetail` | Tourist | ⚪ deferred (Phase 2) |
| `Restaurants`, `RestaurantDetail`, `Places`, `PlaceDetail` | Tourist | ⚪ W6 (concierge surface) |
| `Events`, `EventDetail` | Roberto + Tourist | ⚪ W3+ (Roberto hero flow) |
| `MyTickets`, `Bookings` | Andrés/Miguel | ⚪ W9 (Stripe ticketing) |
| `Collections`, `Saved`, `Notifications` | Camila | ⚪ post-MVP |
| `Explore` | All | ⚪ discovery surface — could merge into `/chat` |
| `Dashboard`, `admin/*` | Patricia | ⚪ W8 |

### Component domains (15+)

Legacy ships these (all real, all populated):

`admin/` (10 files — AdminLayout, AdminSidebar, AdminHeader, AdminStatsCard, AdminPagination, AdminProtectedRoute, ListingDataTable, ListingFormDialog, UserRoleDialog) · `ai/` · `apartments/` · `auth/` · `bookings/` · `brand/` (MdeWordmarkOnDark) · `cars/` · `chat/` · `coffee/` · `collections/` · `events/` (5 files — EventCard, EventFilters, EnhancedEventFilters, EventsCalendar, EventTicketCheckout) · `explore/` · `home/` · `itinerary/` · `layout/` · `listings/` · `map/` + `maps/` · `notifications/` · `onboarding/` · `places/` · `rentals/` (4 files — RentalsIntakeWizard, RentalsListingDetail, RentalsSearchResults, RentalsWizardForm) · `restaurants/` (RestaurantCard, RestaurantFilters) · `saved/` · `trips/` (9 files — TripWizard, TripCard, TripFilters, TripSelector, DayTimeline, ActiveTripBanner, AITripPlannerButton, AddToTripDialog) · `ui/` (full shadcn — F07 already brought 9 of these)

### Brand + assets (gold)

- **`src/components/brand/MdeWordmarkOnDark.tsx`** — Material-style red heart (`#E31B23`) + Montserrat Bold wordmark with precise cap-height baseline math (full SVG spec in file).
- **`src/assets/hero/`** — 8 photos: `beach-palms`, `beach-waves`, `coffee-farm`, `colonial-street`, `guatape-colors`, `medellin-skyline`, `street-food`, `waterfall`.
- **`src/assets/inspired/`** — 7 photos: `caribbean-coast`, `coffee-region`, `guatape`, `medellin-skyline`, `mountain-adventures`, `nightlife`, `urban-exploration`.
- **`public/`** — `ilovemde.png`, `favicon.ico`, `placeholder.svg`, `events/` dir.

### Palette + typography (legacy)

- Fonts: **DM Sans** (body) + **Montserrat Bold** (display) + **Playfair Display** (editorial).
- HSL palette: warm off-white background (`40 25% 97%`), charcoal text (`220 20% 20%`), **deep emerald primary** (`160 60% 22%`), cream secondary, **red heart accent** in brand mark only.
- Radius: `0.75rem`.

### Libraries in legacy not yet in mdeapp

- `embla-carousel-react` — hero galleries
- `react-day-picker` — dates for trips / bookings
- `react-hook-form` — multi-step wizards (RentalsIntakeWizard, TripWizard, ListingFormDialog)
- `@sentry/react` — observability (mdeapp PRD W8)
- `react-markdown` — render AI responses (mdeapp uses CopilotKit's built-in renderer; may not need)
- `@tanstack/react-query` — server-state fetching (mdeapp uses Next 16 + Server Components; may not need)
- `next-themes` — dark mode (mdeapp Phase 1 = light default per F07)

---

## Triage — what should port

| Surface | Triage | Reason |
|---|---|---|
| **Hero photo library (15+ Medellín photos)** | 🟢 KEEP | Real photography of Medellín neighborhoods. Camila/Roberto landing surfaces will need exactly this. Free, fast, no code change. |
| **MdeWordmarkOnDark + brand math** | 🟡 ADAPT | The cap-height-aligned heart pattern is reusable, BUT the red `#E31B23` clashes with our Paisa palette (teal + yellow). Decide: keep red as cultural / "I love Medellín" accent, OR re-derive the heart in Paisa teal. |
| **RentalsIntakeWizard / RentalsWizardForm** | 🟡 ADAPT | Camila's multi-step rental search is the W5 hero flow. Adapt to App Router + CopilotKit `useCoAgent` state — don't port verbatim, but copy the field structure + UX layout. |
| **EventCard + EventFilters + EnhancedEventFilters + EventsCalendar** | 🟡 ADAPT | Roberto's W3+ events list. The card shape + filter UX are real domain knowledge. Tailwind classes need re-mapping to Paisa tokens. |
| **RestaurantCard + RestaurantFilters** | 🟡 ADAPT | Tourist concierge W6. Same triage as events. |
| **AdminLayout + AdminSidebar + AdminStatsCard + AdminPagination** | 🟡 ADAPT | Patricia W8. Layout pattern + sidebar structure carries; data fetching layer (react-query) doesn't — replace with Server Components. |
| **OnboardingLayout** | 🟡 ADAPT | Optional W7+ first-run UX. The layout shell is small and reusable. |
| **Sentry integration pattern** | 🟢 KEEP | PRD W8. Port the `Sentry.init` + ErrorBoundary patterns straight; just update SDK to `@sentry/nextjs` (App Router compatible). |
| **TripWizard + DayTimeline + AITripPlannerButton + ActiveTripBanner** | ⚪ DEFER | Multi-day itinerary is a big feature. Not in Phase 1 PRD (Roberto events + Camila rentals + Tourist concierge cover MVP). Phase 2+. |
| **Cars + Coffee surfaces** | ⚪ DEFER | Not in Phase 1 PRD. |
| **Tailwind config / palette / globals.css** | 🔴 DROP | F07 already shipped Paisa OKLCH. Legacy emerald HSL palette is intentionally NOT what we want. Do not import. |
| **shadcn `ui/` components** | 🔴 DROP | F07 already installed 9 shadcn primitives fresh (button, card, input, label, dialog, sheet, dropdown-menu, badge, + one more). Re-installing from legacy would clobber Paisa token bindings. |
| **`auth/` components + `pages/Login.tsx` etc** | 🔴 DROP | F08 just shipped fresh Supabase Auth (8 files — client, server, middleware, login, signup, callback, signout, root middleware). Re-porting would regress. |
| **`ai/` + `chat/` components** | 🔴 DROP | CopilotKit replaces these in mdeapp. Their UI patterns may inspire generative-UI cards in W3+, but the component code itself doesn't transfer. |
| **`pages/` directory structure (React Router)** | 🔴 DROP | mdeapp uses Next 16 App Router under `src/app/`. Route shapes transfer (e.g. `/rentals`); page module code does not. |
| **`next-themes` (dark mode)** | ⚪ DEFER | F07 spec ships light-default. Dark mode is Phase 2+ unless a persona specifically asks. |
| **`react-day-picker`** | 🟡 ADAPT | Only needed when Roberto's event date pickers land (F14+ territory). Defer until that task. |
| **`@tanstack/react-query`** | 🔴 DROP | Server Components + `fetch` in App Router cover most needs. Re-introducing react-query is scope creep. |

---

## Proposed task slices

Each is sized to fit the F-task template + has a clear acceptance + persona impact.

| ID | Title | Effort | Depends on | Persona impact |
|---|---|---:|---|---|
| **F22** | Port Medellín hero photo library to `mdeapp/public/hero/` + `mdeapp/public/inspired/` | 30 min | (none — pure asset copy) | Camila + Tourist see real Medellín photos on landing surfaces from W3 onwards instead of placeholders |
| **F23** | Brand assets — port `MdeWordmarkOnDark` + decide red-heart vs Paisa-teal-heart + add favicon + `ilovemde.png` | 1h | F22, F07 | Roberto's host wizard + Camila's chat both show consistent mdeai brand at top |
| **F24** | Port `RentalCard` component pattern (Paisa-tokenised) | 1.5h | F07 | Camila's W5 `/rentals` surface gets the card shape that legacy proved out — saves 2-3h of design iteration |
| **F25** | Port `EventCard` + `EventFilters` pattern (Paisa-tokenised) | 1.5h | F07, F24 (share patterns) | Roberto's W3 `/host/events` list page; Tourist's W6 `/chat` event suggestions reuse the card |
| **F26** | Port `RestaurantCard` + `RestaurantFilters` pattern | 1h | F07, F25 | Tourist's W6 concierge — restaurant suggestions render with proven UX |
| **F27** | Port `AdminLayout` + `AdminSidebar` + `AdminStatsCard` shells | 2h | F07, F08 (auth) | Patricia's W8 admin gets the proven sidebar/stats shape instead of bespoke |
| **F28** | Sentry integration — port `Sentry.init` + ErrorBoundary patterns using `@sentry/nextjs` | 1.5h | F06 (Vercel preview) | Lucía + Patricia catch production errors with PRD W8 observability |
| **F29** | Port `RentalsIntakeWizard` multi-step form pattern (adapt to `useCoAgent` instead of react-hook-form) | 3h | F24, F14 (eventAgent), F17 (rentalAgent) | Camila's W5 "tell me what you want" flow — biggest UX port |
| **F30** | Port `OnboardingLayout` for first-run shell | 1h | F07 | Roberto/Camila/Tourist first-run see a guided shell, not a blank chat |
| **F31** | Port `TripWizard` + `DayTimeline` + `AITripPlannerButton` | 5h | F25, F26, F19 (conciergeAgent) | **DEFERRED to Phase 2.** Multi-day itinerary is a feature on top of MVP. Spec it now; ship after Phase 1 closes. |

**Net new tasks proposed: 10 (F22 → F31).** Quick wins (F22, F23) ship in <2h combined. Heavy lifts (F29, F31) wait for agent backend deps.

---

## Suggested sequence

Anchored to the existing W3 → W10 PRD calendar:

```
THIS WEEK (W2 remaining): F22 (hero photos) + F28 (Sentry pattern stub)
W3 (Roberto hero):        F23 (brand) + F25 (EventCard) + F30 (Onboarding)
W4 (Roberto polish):      F29 (wizard pattern — feed back into F14 design)
W5 (Camila rentals):      F24 (RentalCard)
W6 (Camila chat):         F26 (RestaurantCard)
W8 (Patricia admin):      F27 (AdminLayout) + F28 (Sentry full integration)
Phase 2:                  F31 (TripWizard / multi-day)
```

Critical path observation: **F22 + F23 should ship NOW** (W2). They're zero-risk asset copies + a brand decision, unblock every subsequent UI task, and dramatically improve the perception of the app even before W3 work starts.

---

## Improvements over legacy (because we get a clean slate)

| What legacy did | What mdeapp should do better |
|---|---|
| HSL tokens via Tailwind config | ✅ Already done — **OKLCH via Tailwind v4 CSS-first `@theme`** (F07). Better gamut, future-proof. |
| Vite + React Router 18 (CSR) | ✅ **Next 16 App Router + Server Components**. Streaming, better perf, SEO out of the box. |
| Bespoke `ai/` + `chat/` components | ✅ **CopilotKit 1.55.2 + AG-UI + Mastra in-process**. No custom chat layer to maintain. |
| `react-query` for server state | ✅ **App Router `fetch` + Server Components** for most reads; client-side React Query only where it earns its keep. Don't add unless a real need lands. |
| Bespoke Context + custom hooks for state | ✅ **`useCoAgent<MdeState>` from CopilotKit** — agent state IS app state. Persona schemas evolve in one place (PRD §17 RUNTIME-008). |
| Spanish-first content | ✅ **Phase 1 = English** (CLAUDE.md Language scope). Spanish/Lingui in Phase 2 (W7+). Lower W1-W6 complexity. |
| Bespoke admin sidebar + custom theme tokens | ✅ **shadcn sidebar primitive + Paisa tokens** — F27 inherits the design system instead of re-inventing. |
| `auth-helpers-nextjs` (legacy)¹ | ✅ **F08 ships `@supabase/ssr`** — current, non-deprecated. |
| Trips / multi-day baked into MVP | ✅ **Deferred to Phase 2**. Roberto events + Camila rentals + Tourist concierge cover MVP. Less surface, faster ship. |
| Sentry React-only via `@sentry/react` | ✅ **`@sentry/nextjs`** with App Router auto-instrumentation (F28). Catches Server Action + RSC errors that legacy can't. |
| Red `#E31B23` heart accent | 🟡 **Decision: keep red as cultural heart accent OR re-derive in Paisa teal.** Default recommend keep red as the brand mark (cultural meaning > design system purity); use Paisa tokens for everything else. |
| 30 routes from day 1 | ✅ **Ship 6 routes for MVP:** `/`, `/login`, `/signup`, `/host/event/new`, `/rentals`, `/chat`. Routes 7-30 land in their own task slices. |
| `react-day-picker` for dates | 🟡 Adopt **only if** Roberto's event-date picker needs a calendar widget shadcn-Calendar can't cover. shadcn ships `<Calendar>` based on react-day-picker — may already be on disk via F07. |

¹ — best guess based on package versions; legacy's auth dir wasn't inspected this turn

---

## Risks to flag

1. **Brand decision is blocking F23.** Keep red heart vs re-derive in Paisa teal? Default: keep red. If the user disagrees, F23 is a 30-min re-derive of the SVG with new fill — small but blocking.
2. **F29 (RentalsIntakeWizard) is 3h and depends on F17 (rentalAgent backend).** Don't start it until F17's `useCoAgent` state shape is locked, or you'll port to a moving target.
3. **F31 (TripWizard) is genuinely heavy — 5h spread across 8 source files.** Phase 2 calls are correct; don't slip it into Phase 1.
4. **Asset license check.** The 15 hero photos may have been licensed under the legacy app's contract. Confirm reuse rights before publishing to a public Vercel preview. Default assumption: same project, same license — no issue. Verify if commercial use changes anything.
5. **Don't re-port `pages/Login.tsx` etc.** F08 just shipped — re-porting would regress. Triage table marks this 🔴 DROP for a reason.
6. **Don't re-introduce `react-query` reflexively.** Server Components cover most server-state reads now. Adding it back is scope creep.
7. **No `next-themes` until Phase 2.** Light-only default is intentional.

---

## What this plan does NOT cover

- Business logic ports — those are F13–F20 (Mastra agent backends), not UI design.
- Database schema — schema is `zkwcbyxiwklihegjhuql` reuse + zero new migrations Phase 1.
- E2E test strategy — that's the `testing` skill's territory + W3+ Playwright work.
- Pricing/marketing copy — separate content task, not design port.
- Stripe checkout UI — W9 task F-W9 (existing PRD §51), uses Stripe's hosted elements; not a legacy port.

---

## Decision needed before slicing F22+

Three small calls before this plan converts to task specs:

1. **Brand: red heart vs Paisa-teal heart in `MdeWordmarkOnDark`?**  Recommend: **keep red** (cultural meaning). Confirm or override.
2. **F22 quick win this week, yes/no?**  Recommend yes — zero risk, 30 min, unblocks every subsequent UI task with real photos.
3. **F31 (TripWizard) Phase 1 or Phase 2?**  Recommend Phase 2 — multi-day itinerary is feature scope beyond MVP. Confirm.

Once these three are decided I can convert this plan into `tasks/core/F22-…md` through `tasks/core/F30-…md` (skipping F31 to advanced/ until Phase 2), following the 10-section `mde-task-lifecycle` template each.
