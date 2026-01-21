# Changelog

All notable changes to I Love Medellín are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

---

## [Unreleased]

### Added
- **3-Panel Layout System** (Step 1.1 ✅)
  - `ThreePanelLayout` shell component with context provider
  - `LeftPanel` component with collapsible support
  - `RightPanel` component with contextual content
  - Desktop: 3 fixed panels (240px | flex | 320px)
  - Tablet: Collapsible left + drawer right
  - Mobile: Bottom nav + bottom sheet
- **Responsive Mobile Navigation** (Step 1.2 ✅)
  - Updated `MobileNav` with AI icon
  - Safe area inset support for notched phones
  - Sheet-based right panel as bottom sheet
- **Apartments Module** (Steps 2.1-2.2 ✅)
  - `Apartments` list page with search, filters, and grid
  - `ApartmentDetail` page with image gallery, amenities, and house rules
  - `ApartmentCard` component with save functionality
  - `ApartmentFilters` with neighborhood, price, bedrooms, amenities
  - `useApartments` hook with React Query + Supabase
- **Cars Module** (Steps 3.1-3.2 ✅)
  - `Cars` list page with search, filters, and grid
  - `CarDetail` page with features, rental info, and pricing
  - `CarCard` component with save functionality
  - `CarFilters` with vehicle type, transmission, features
  - `useCars` hook with React Query + Supabase
- **Shared Listings Components**
  - `FilterChips` for active filter display
  - `ListingSkeleton` for loading states
  - `EmptyState` for no results
  - `useSavedPlaces` hook for favorites
- **Types System**
  - `src/types/listings.ts` with Apartment, Car, and filter types
- **Navigation Updates**
  - Listings section in LeftPanel with Apartments/Cars links
- Documentation structure (`/docs`, `/rules`)
- Progress tracker system
- Next steps implementation guide

- **Restaurants Module** (Steps 4.1-4.2 ✅)
  - `Restaurants` list page with cuisine, price level, dietary filters
  - `RestaurantDetail` page with hours, reviews, and location
  - `RestaurantCard` component with save functionality
  - `useRestaurants` hook with React Query + Supabase
- **Events Module** (Steps 5.1-5.2 ✅)
  - `Events` list page with date, category, and price filters
  - `EventDetail` page with ticket info and venue details
  - `EventCard` component with save functionality
  - `useEvents` hook with React Query + Supabase
- **Saved/Favorites Module** (Steps 6.1-6.2 ✅)
  - Upgraded `/saved` page with 3-panel layout
  - Collections CRUD (create, edit, delete)
  - Type filters (All/Stays/Cars/Restaurants/Events)
  - Move to collection and notes dialogs
  - `useCollections` and `useEnrichedSavedPlaces` hooks
- **Explore Module Upgrade** (Step 7.x ✅)
  - `useExplorePlaces` hook - unified Supabase queries across all tables
  - `useExploreCounts` hook - counts per category
  - `ExploreCard` component with real save persistence
  - `ExploreCategoryTabs` with result counts
  - `ExploreMapView` with color-coded pins by type
  - "See more" links to specific listing pages

### Planned
- Real map integration (Google Maps/Mapbox)

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
