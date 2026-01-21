# Changelog

## [2026-01-21] - Collections, Itinerary Builder, Events Enhancement

### Added
- **Collections Page** (`/collections`) - Grid view of user collections with preview thumbnails
- **CollectionCard** component with image grid, edit/delete/share actions
- **VisualItineraryBuilder** - Drag-and-drop itinerary planning with @dnd-kit
- **EventsCalendar** - Month view calendar for event discovery
- **EnhancedEventFilters** - Date presets, category/neighborhood/price filters, view mode toggle
- `useCollectionPreviews` hook for fetching collection thumbnail images
- `useReorderTripItem` hook for drag-and-drop item reordering
- Extended `EventFilters` type with category, neighborhood, priceRange, dateRange

### Changed
- Updated Events page with calendar view and enhanced filtering
- Updated TripDetail page with tabbed Builder/Timeline views
- Added Collections route to App.tsx

---


All notable changes to I Love Medellín are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

---

## [Unreleased]

### Added
- **3-Panel System REBUILT** (January 2026 ✅)
  - Complete rewrite from scratch following new architecture
  - `ThreePanelContext` - Global state for selectedItem, rightPanelOpen, URL sync
  - `ThreePanelLayout` - Responsive shell (Desktop/Tablet/Mobile)
  - `RightDetailPanel` - Slide-in detail view with hero, AI pitch, actions
  - Desktop: 280px Left | Flex Center | 500px slide-in Right
  - Tablet: Collapsible Left | Right overlay
  - Mobile: Full-screen Right overlay with bottom nav
  - ESC key closes panel, URL sync with `?detail=id`
  - Card selection highlighting across all types

- **Unified Card Selection** (January 2026 ✅)
  - `RestaurantCard` - isSelected prop, onSelect handler
  - `ApartmentCard` - isSelected prop, onSelect handler
  - `CarCard` - isSelected prop, onSelect handler
  - `EventCard` - isSelected prop, onSelect handler
  - `ExploreCard` - isSelected prop, onSelect handler

- **Right Panel Detail Views** (January 2026 ✅)
  - Dynamic content based on item type
  - Hero image with overlaid title/rating/price
  - "Why you'll love it" AI pitch section
  - Quick info cards (Open Now, Distance)
  - Action bar (Add to Trip, Save, Share)

- **Type-Specific Detail Panels** (January 2026 ✅)
  - `RestaurantDetailPanel` - Cuisine, hours, pricing
  - `ApartmentDetailPanel` - Amenities, pricing, host
  - `CarDetailPanel` - Features, rental info
  - `EventDetailPanel` - Date, venue, tickets

### Changed
- All listing pages now use unified `ThreePanelLayout`
- Removed duplicate Sheet/drawer on desktop
- Fixed panel leaking between breakpoints
- LeftPanel now includes "My Trips" navigation link

### Added (Phase 2)
- **Trips Module** (January 2026 ✅)
  - `/trips` - Trip list page with filters (draft, active, completed)
  - `/trips/:id` - Trip detail with day-by-day timeline
  - `/trips/new` - Trip creation wizard (4 steps)
  - `TripCard` component with status badges
  - `DayTimeline` component for itinerary view
  - `TripWizard` with date picker and budget
  - `AddToTripDialog` - Add any listing to a trip
  - `useTrips`, `useTripItems` hooks for data management
  - Protected routes requiring authentication

### Planned (Next Steps)
- **Phase 2.2: Booking Wizards**
  - Apartments, Cars, Restaurants, Events booking flows
  - `/bookings` dashboard
- **Phase 3: AI Integration**
  - 4-Tab Chatbot system
  - AI agents (Trip Planner, Booking Agent, Explore Agent)
  - Edge functions for AI gateway

---

## [0.2.0] - 2026-01-19

### Added
- Supabase authentication (email/password, Google OAuth)
- Protected routes for `/saved` and `/concierge`
- Login, Signup, Forgot Password, Reset Password pages
- Session persistence across refresh
- User state in Sidebar and MobileNav

### Changed
- Updated Index page header with auth state
- Sidebar shows user email when logged in

### Security
- Passwords validated (min 6 chars)
- Password reset via email link

---

## [0.1.0] - 2026-01-19

### Added
- Initial project setup (Vite + React + TypeScript)
- Supabase connection (project: `medellin`)
- Design system with emerald/cream palette
- Custom typography (DM Sans, Playfair Display)
- 3-panel layout components (Sidebar, MobileNav, AppLayout)
- Home page with hero section
- Explore page with filters and mock data
- Place detail page
- Saved places page (basic)
- Concierge page (placeholder)
- PlaceCard, CategoryFilter, NeighborhoodSelector components
- Mock data for testing

### Database
- Connected to existing Supabase schema
- Tables available: profiles, apartments, restaurants, events, car_rentals, saved_places, collections, trips, bookings

---

## Version Format

- **Major (X.0.0)**: Breaking changes, major features
- **Minor (0.X.0)**: New features, backward compatible
- **Patch (0.0.X)**: Bug fixes, small improvements

---

## Related

- [Next Steps](./NEXT-STEPS.md) — Implementation guide
- [Progress Tracker](./progress-tracker/progress.md) — Task status
