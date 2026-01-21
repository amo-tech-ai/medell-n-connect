# Update 3-Panel System: Right Panel Detail View

## Current Issue
Clicking a restaurant, apartment, car, or event card in the main panel navigates to a full-page detail view, breaking the 3-panel browsing experience.

## What to Change

### Card Click Behavior
When users click a listing card (restaurant, apartment, car, event) in the main panel:
- **Do NOT navigate** to a new route
- **Update the right panel** with detail information for that item
- Keep the main panel showing the list view
- Use `usePanelContext` hook and `setRightPanelContent` to update the right panel

### Right Panel Content
The right panel should show:
- **Header:** "View Full Page" button (prominent, top of panel)
- Item name, rating, price, location
- Reservation/booking actions (primary button)
- Hours and contact information
- Map or location details
- Save/favorite functionality
- All detail information from the current detail pages
- **Footer:** "View Full Page" button (if not in header)

### Add "View Full Page" Button
Add a button in the right panel detail view that says "View Full Page" or "Open Full Screen":
- Place it prominently at the top of the right panel content
- Secondary placement at bottom (optional)
- When clicked, navigate to the full-page detail route (e.g., `/restaurants/123`)
- Style it as a primary or secondary button

---

## Frontend-Backend Wiring

### Data Flow
**List Data:**
- List pages already fetch data using React Query hooks (`useRestaurants()`, `useApartments()`, `useCars()`, `useEvents()`)
- Cards display data from these queries
- **No additional API call needed** - use item data already available from list

**Right Panel Data:**
- When card is clicked, pass the item object directly to right panel component
- Right panel components receive props: `{ restaurant }`, `{ apartment }`, `{ car }`, `{ event }`
- If additional detail needed, use existing hooks like `useRestaurant(id)`

**Component Wiring:**
```
Card Click Event
  ↓
usePanelContext().setRightPanelContent(<DetailPanel item={item} />)
  ↓
Right Panel Component renders with item data
  ↓
Displays reservation, hours, contact, map info
```

**State Management:**
- Panel state: `ThreePanelLayout` context manages right panel content
- Data state: React Query caches list data (no refetch needed)
- Card click: Updates right panel (local state only)
- Save click: Separate handler (doesn't trigger detail view)
- View Full Page: Navigates to route (React Router)

---

## Wireframe Layout

### Desktop (3-Panel)
```
┌───────────┬───────────────────────────────┬───────────────┐
│ LEFT      │ MAIN PANEL                     │ RIGHT PANEL   │
│ CONTEXT   │ WORK                           │ INTELLIGENCE  │
│           │                                │               │
│ Navigation│ Restaurants                    │ [View Full    │
│           │ [Search] [Filters]             │  Page →]      │
│           │                                │ ────────────  │
│           │ ┌─────┐ ┌─────┐ ┌─────┐        │ El Cielo      │
│           │ │Card │ │Card │ │Card │        │ $$$$ 4.9      │
│           │ └─────┘ └─────┘ └─────┘        │ [Reserve]     │
│           │                                │ Hours: 19-23  │
│           │ ┌─────┐ ┌─────┐ ┌─────┐        │ Contact info  │
│           │ │Card │ │Card │ │Card │        │               │
│           │ └─────┘ └─────┘ └─────┘        │ [View Full    │
│           │                                │  Page →]      │
└───────────┴───────────────────────────────┴───────────────┘
```

### Key Points
- Main panel: List/grid stays visible, no navigation
- Right panel: Updates with detail when card clicked
- Default state: Right panel shows stats/suggestions when no selection
- Selected state: Right panel shows item details

---

## Implementation Steps

### 1. Update Card Components
- Remove `Link` wrapper or `navigate()` from card click
- Add `onClick` handler that calls `setRightPanelContent()`
- Pass item data to right panel component
- Keep save/favorite button separate (use `e.stopPropagation()`)

### 2. Update Right Panel Detail Components
- Add "View Full Page" button at top of component
- Button should navigate to detail route: `/restaurants/${id}`, `/apartments/${id}`, etc.
- Reuse existing detail panel components (they already exist)
- Components: `RestaurantDetailRightPanel`, `ApartmentDetailRightPanel`, `CarDetailRightPanel`, `EventDetailRightPanel`

### 3. List Pages Stay Same
- Pages like `Restaurants.tsx` remain on same route
- Right panel content updates dynamically
- Default content shows when no item selected

---

## User Flow

**Before:**
1. User clicks card → Navigates to `/restaurants/123` → Full page

**After:**
1. User clicks card → Right panel updates → Main panel shows list
2. User clicks "View Full Page" → Navigates to `/restaurants/123` → Full page

---

## Files to Update

**Card Components:**
- `src/components/restaurants/RestaurantCard.tsx`
- `src/components/apartments/ApartmentCard.tsx`
- `src/components/cars/CarCard.tsx`
- `src/components/events/EventCard.tsx`
- `src/components/explore/ExploreCard.tsx`

**Right Panel Components:**
- `src/pages/RestaurantDetail.tsx` (RestaurantDetailRightPanel)
- `src/pages/ApartmentDetail.tsx` (ApartmentDetailRightPanel)
- `src/pages/CarDetail.tsx` (CarDetailRightPanel)
- `src/pages/EventDetail.tsx` (EventDetailRightPanel)

---

## Keep It Simple

- Use existing `usePanelContext` hook (already available)
- Reuse existing right panel detail components (already exist)
- Just change click behavior: navigation → panel update
- Add one "View Full Page" button
- Use item data from list (no extra API calls needed)
- Smooth transition when right panel updates

---

## Benefits

- Faster browsing: See details without losing place in list
- Better UX: Maintains 3-panel Context-Work-Intelligence separation
- Flexible: Users can still access full-page view when needed
- Consistent: Works same way for all listing types
- Efficient: No extra API calls, uses cached list data
