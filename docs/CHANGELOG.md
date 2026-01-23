# Changelog

All notable changes to I Love Medellín are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

---

## [2026-01-23] - Premium Booking Wizards Wired to Detail Pages

### Added
- **CarBookingWizardPremium Integration** - Wired to `/cars/:id` detail page
  - Opens in Dialog modal on "Book Now" click
  - 3-panel layout with dates, pickup location, insurance tiers (Basic/Standard/Premium)
  - Weekly discount logic for 7+ day rentals
  - Delivery fee calculator ($25 for apartment/hotel delivery)
  - Real-time price breakdown in right panel
  
- **EventBookingWizardPremium Integration** - Wired to `/events/:id` detail page
  - Opens in Dialog modal on "Get Tickets" click
  - 3-panel layout with ticket type selection (General/VIP)
  - Quantity selector (1-10 tickets)
  - VIP perks display (priority entry, reserved seating, etc.)
  - Group booking acknowledgment (4+ tickets)

### Changed
- Updated CarDetail right panel with "Book Now" action button
- Updated EventDetail right panel with "Get Tickets" action button
- Added Dialog + DialogContent imports to both detail pages

### Verified
- RLS policies on bookings table: user_id = auth.uid() for SELECT/UPDATE
- All 4 booking wizards (Apartment, Restaurant, Car, Event) now functional
- Progress tracker updated to 85% overall completion

---

## [2026-01-23] - Progress Tracker Audit & Bug Fixes

### Fixed
- **PlaceCard forwardRef warning** - Fixed console warning on Index page
- **Progress Tracker accuracy** - Complete rewrite with verified percentages and proof of completion

### Added
- **Comprehensive Progress Tracker** - New format with:
  - Executive summary with completion percentages
  - Critical issues table (RLS, OAuth status)
  - Phase-by-phase breakdown with verification
  - Database table inventory (24 tables)
  - Edge function inventory (4 functions)
  - Metrics dashboard

### Verified
- 23 routes functional
- 8 protected routes with auth
- All 5 listing types (apartments, cars, restaurants, events, explore)
- AI chat with tool calling
- Booking wizards (apartment, restaurant)
- Trip management (list, detail, create, itinerary builder)

---

## [2026-01-22] - AI Concierge & Bookings Dashboard

### Added
- **AI Concierge Page** (`/concierge`) - Full-page 3-panel chat experience
  - 4-tab architecture (Concierge, Trips, Explore, Bookings)
  - Real-time streaming from ai-chat edge function
  - Active trip context awareness
  - Quick action buttons
- **Bookings Dashboard** (`/bookings`) - 3-panel booking management
  - Status filters (upcoming, past, cancelled)
  - Type filters (all, apartment, car, restaurant, event)
  - Statistics panel (total, upcoming, this month)
  - Detail panel with cancel action

### Changed
- Updated LeftPanel navigation with Concierge link
- Enhanced Index footer with multi-column layout

---

## [2026-01-21] - Google Maps Integration for Itinerary Builder

### Added
- **GoogleMapView** component - Interactive Google Maps with street-level tiles, zoom/pan, and custom markers
- **google-directions** edge function - Secure Google Routes API calls for real routing data
- **useGoogleDirections** hook - Client-side hook for fetching directions
- Polyline decoding and rendering for actual road routes
- Real travel times from Google's traffic-aware routing
- Auto-fetch directions when day selection changes
- "Get Directions" button for manual routing requests
- VITE_GOOGLE_MAPS_API_KEY environment variable support
- Seamless fallback to placeholder view when API key not configured

### Changed
- VisualItineraryBuilder now uses GoogleMapView instead of placeholder ItineraryMapView
- Travel time indicators now display real Google-calculated durations when available
- Haversine calculation remains as fallback when Google API unavailable
- AI route optimization integrates with Google routing for validated travel times

### Technical
- Google Routes API v2 (computeRoutes) with traffic-aware preference
- Advanced Marker Element API for custom styled pins
- Encoded polyline decoding for route visualization
- CORS-enabled edge function with proper error handling

---

## [2026-01-21] - Map Visualization for Itinerary Builder

### Added
- **ItineraryMapView** component - Visual route map with positioned pins and dashed route lines
- **TravelTimeIndicator** component - Shows travel time/distance between activities with mode suggestion (walk/taxi/drive)
- Haversine formula for accurate distance calculation between coordinates
- Travel time estimation based on 25 km/h average city speed
- Split view mode in VisualItineraryBuilder (List + Map side-by-side)
- Map/List toggle in TripDetail page toolbar
- SVG route lines with arrow markers connecting activity pins
- Total travel time badge per selected day
- Activity pins show step number, icon, and title

### Changed
- Updated VisualItineraryBuilder to support `showMapView` prop
- TripDetail now includes map toggle for builder view
- Travel time indicators appear between items when map view is active

---

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

## [2026-01-20] - 3-Panel System Rebuild

### Added
- **ThreePanelContext** - Global state for selectedItem, rightPanelOpen, URL sync
- **ThreePanelLayout** - Responsive shell (Desktop/Tablet/Mobile)
- **RightDetailPanel** - Slide-in detail view with hero, AI pitch, actions
- Desktop: 280px Left | Flex Center | 500px slide-in Right
- Tablet: Collapsible Left | Right overlay
- Mobile: Full-screen Right overlay with bottom nav
- ESC key closes panel, URL sync with `?detail=id`
- Card selection highlighting across all types

### Changed
- All listing pages now use unified `ThreePanelLayout`
- Removed duplicate Sheet/drawer on desktop
- Fixed panel leaking between breakpoints
- LeftPanel now includes "My Trips" navigation link

### Cards Updated (isSelected prop)
- RestaurantCard
- ApartmentCard
- CarCard
- EventCard
- ExploreCard

---

## [2026-01-20] - Trips Module

### Added
- `/trips` - Trip list page with filters (draft, active, completed)
- `/trips/:id` - Trip detail with day-by-day timeline
- `/trips/new` - Trip creation wizard (4 steps)
- `TripCard` component with status badges
- `DayTimeline` component for itinerary view
- `TripWizard` with date picker and budget
- `AddToTripDialog` - Add any listing to a trip
- `useTrips`, `useTripItems` hooks for data management
- Protected routes requiring authentication

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

- [Progress Tracker](./progress-tracker/progress.md) — Task status
- [Next Steps](./NEXT-STEPS.md) — Implementation guide
