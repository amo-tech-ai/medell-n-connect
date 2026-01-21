# Right Panel Detail View - Implementation Prompt for Lovable

## Task: Update 3-Panel System Click Behavior

### Current Problem
When users click restaurant, apartment, car, or event cards in the main panel, it navigates to a full-page detail view. This breaks the 3-panel browsing experience.

### Desired Solution

**When a user clicks a listing card in the main panel:**
- Update the right panel (Intelligence panel) with detail information for that item
- Do not navigate away from the list page
- Keep the main panel showing the list/grid of items
- The right panel should display all detail information (reservation options, hours, contact, map, etc.)

**Add a "View Full Page" button in the right panel:**
- Place this button prominently in the right panel detail view
- When clicked, navigate to the full-page detail route
- This gives users the option for a focused, full-screen experience when they want it

### Implementation Approach

1. **Update Card Components:**
   - Change card click handlers from navigation (`Link` or `navigate()`) to updating the right panel
   - Use `usePanelContext` hook to access `setRightPanelContent`
   - Pass the item data to the right panel component
   - Keep save/favorite button clicks separate (they should not trigger detail view)

2. **Right Panel Detail Component:**
   - Reuse existing detail panel components (e.g., `RestaurantDetailRightPanel`, `ApartmentDetailRightPanel`)
   - These components already exist and show reservation info, hours, contact details
   - Add a "View Full Page" button at the top or bottom of the right panel content
   - The button should navigate to the full detail route when clicked

3. **List Pages:**
   - Pages like `Restaurants.tsx`, `Apartments.tsx`, `Cars.tsx`, `Events.tsx` should remain on the same route
   - The right panel content updates dynamically based on card clicks
   - Default right panel content (stats, suggestions) shows when no item is selected

---

## Frontend-Backend Wiring Setup

### Data Flow Overview

**List Page Data:**
- List pages fetch data using React Query hooks (e.g., `useRestaurants()`, `useApartments()`)
- Data comes from Supabase via the hooks
- Cards display data from the list query results
- No additional API call needed for basic card display

**Right Panel Detail Data:**
- When a card is clicked, use the item data already available from the list query
- Pass the selected item object directly to the right panel component
- Right panel components receive props with item data (restaurant, apartment, car, event)
- If additional detail data is needed, use the existing detail hooks (e.g., `useRestaurant(id)`)
- These hooks fetch from Supabase Edge Functions or direct database queries

### Component Wiring

**Card Component → Right Panel:**
```
Card Click Event
  ↓
usePanelContext().setRightPanelContent()
  ↓
Pass item data as props
  ↓
Right Panel Detail Component renders
  ↓
Displays reservation, hours, contact info
```

**Data Sources:**
- **List Data:** `useRestaurants()`, `useApartments()`, `useCars()`, `useEvents()` hooks
- **Detail Data:** Item object from list (already available) or `useRestaurant(id)` if needed
- **Save/Favorite:** `useToggleSave()` hook for save functionality
- **Stats:** Calculated from list data or fetched separately

### Backend Integration Points

**Supabase Queries:**
- List queries: Filtered queries to Supabase tables (restaurants, apartments, cars, events)
- Detail queries: Single item queries by ID (if additional data needed)
- Save operations: Mutations to `saved_places` table via `useToggleSave()`

**Edge Functions (Future):**
- Reservation/booking actions will call Edge Functions
- AI suggestions will come from Edge Functions
- Currently using direct Supabase queries

### State Management

**Panel State:**
- Managed by `ThreePanelLayout` context (`usePanelContext`)
- Right panel content stored in React state
- Updates trigger re-render of right panel only

**Data State:**
- Managed by React Query (`@tanstack/react-query`)
- Cached list data available for card clicks
- No need to refetch when showing detail in right panel

**User Actions:**
- Card click: Updates right panel (local state)
- Save click: Mutates database (React Query mutation)
- View Full Page: Navigates to detail route (React Router)

### User Flow Example

**Before:**
1. User clicks restaurant card → Navigates to `/restaurants/123` → Full page detail view

**After:**
1. User clicks restaurant card → Right panel updates with restaurant details → Main panel still shows list
2. User clicks "View Full Page" in right panel → Navigates to `/restaurants/123` → Full page detail view

### Benefits
- Faster browsing: Users can see details without losing their place in the list
- Better 3-panel experience: Maintains the Context-Work-Intelligence separation
- Flexible: Users can still access full-page view when needed
- Consistent: Works the same way for restaurants, apartments, cars, and events

### Files to Update
- `src/components/restaurants/RestaurantCard.tsx`
- `src/components/apartments/ApartmentCard.tsx`
- `src/components/cars/CarCard.tsx`
- `src/components/events/EventCard.tsx`
- `src/components/explore/ExploreCard.tsx`
- Right panel detail components (add "View Full Page" button)

### Keep Simple
- Use existing `usePanelContext` hook
- Reuse existing right panel detail components
- Just change click behavior from navigation to panel update
- Add one button for full-page navigation

---

## Wireframe: Right Panel Detail View

### Desktop Layout - List View with Detail Panel

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                               APPLICATION HEADER                               │
│  💚 i love Medellín                    [Search]              [User] [Sign In]  │
└───────────────────────────────────────────────────────────────────────────────┘

┌───────────────┬───────────────────────────────────────────────┬───────────────┐
│               │                                               │               │
│   LEFT PANEL  │               MAIN PANEL                       │  RIGHT PANEL  │
│   CONTEXT     │               WORK                             │  INTELLIGENCE │
│               │                                               │               │
│ ────────────  │  Restaurants                                   │  ───────────  │
│  🏠 Home      │  Discover the best dining...                   │  Quick Stats  │
│  🧭 Explore   │  ──────────────────────────                   │  ───────────  │
│               │                                               │  4.5 Avg      │
│  📋 Listings  │  [Search restaurants...]                       │  $$ Avg Price │
│   🏠 Apartments│                                               │               │
│   🚗 Cars     │  [Cuisine ▼] [Price ▼] [Dietary ▼] [Open Now] │  Tonight's    │
│   🍽 Restaurants│                                               │  Picks 🌙      │
│   🎟 Events    │                                               │  AI coming... │
│               │  ┌─────────┐ ┌─────────┐ ┌─────────┐          │               │
│  ❤️ Saved     │  │ [Image] │ │ [Image] │ │ [Image] │          │  Popular      │
│  ✨ Concierge │  │ El Cielo │ │ Carmen  │ │ Test Lab│          │  Cuisines     │
│               │  │ $$$$ 4.9│ │ $$$ 4.8│ │ $$$$ 4.7│          │  Colombian    │
│ ────────────  │  └─────────┘ └─────────┘ └─────────┘          │  Italian      │
│  👤 User      │                                               │  Japanese     │
│               │  ┌─────────┐ ┌─────────┐ ┌─────────┐          │               │
│               │  │ [Image] │ │ [Image] │ │ [Image] │          │               │
│               │  │ OCI.mde │ │ Mondongo│ │ Alambique│         │               │
│               │  │ $$$ 4.6│ │ $$ 4.5 │ │ $$$ 4.4│          │               │
│               │  └─────────┘ └─────────┘ └─────────┘          │               │
└───────────────┴───────────────────────────────────────────────┴───────────────┘
```

### Desktop Layout - After Clicking a Card (Detail in Right Panel)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                               APPLICATION HEADER                               │
│  💚 i love Medellín                    [Search]              [User] [Sign In]  │
└───────────────────────────────────────────────────────────────────────────────┘

┌───────────────┬───────────────────────────────────────────────┬───────────────┐
│               │                                               │               │
│   LEFT PANEL  │               MAIN PANEL                       │  RIGHT PANEL  │
│   CONTEXT     │               WORK                             │  INTELLIGENCE │
│               │                                               │               │
│ ────────────  │  Restaurants                                   │  ───────────  │
│  🏠 Home      │  Discover the best dining...                   │  [View Full   │
│  🧭 Explore   │  ──────────────────────────                   │   Page →]     │
│               │                                               │  ───────────  │
│  📋 Listings  │  [Search restaurants...]                       │               │
│   🏠 Apartments│                                               │  El Cielo      │
│   🚗 Cars     │  [Cuisine ▼] [Price ▼] [Dietary ▼] [Open Now] │  ───────────  │
│   🍽 Restaurants│                                               │  $$$$          │
│   🎟 Events    │  ┌─────────┐ ┌─────────┐ ┌─────────┐        │  Fine Dining  │
│               │  │ [Image] │ │ [Image] │ │ [Image] │        │               │
│  ❤️ Saved     │  │ El Cielo │ │ Carmen  │ │ Test Lab│        │  ⭐ 4.9 (312) │
│  ✨ Concierge │  │ $$$$ 4.9│ │ $$$ 4.8│ │ $$$$ 4.7│        │  📍 Medellín  │
│               │  └─────────┘ └─────────┘ └─────────┘        │               │
│ ────────────  │                                               │  Make a        │
│  👤 User      │  ┌─────────┐ ┌─────────┐ ┌─────────┐        │  Reservation  │
│               │  │ [Image] │ │ [Image] │ │ [Image] │        │  ───────────  │
│               │  │ OCI.mde │ │ Mondongo│ │ Alambique│       │  [Reserve a   │
│               │  │ $$$ 4.6│ │ $$ 4.5 │ │ $$$ 4.4│        │   Table]      │
│               │  └─────────┘ └─────────┘ └─────────┘        │  AI-powered   │
│               │                                               │  coming soon  │
│               │                                               │               │
│               │                                               │  Hours Today   │
│               │                                               │  ───────────  │
│               │                                               │  🕐 19:00 -    │
│               │                                               │     23:00      │
│               │                                               │  [Open]        │
│               │                                               │               │
│               │                                               │  Contact       │
│               │                                               │  ───────────  │
│               │                                               │  📞 +57 4...   │
│               │                                               │  🌐 Visit Site │
│               │                                               │               │
│               │                                               │  [View Full    │
│               │                                               │   Page →]      │
└───────────────┴───────────────────────────────────────────────┴───────────────┘
```

### Key Wireframe Elements

**Main Panel (Left Side):**
- List/grid of cards remains visible
- User can scroll through all items
- Selected card can be highlighted (optional)
- No navigation occurs

**Right Panel (Right Side):**
- **Header Section:**
  - "View Full Page" button (top right or top of content)
  - Item name and category badge
  
- **Detail Content:**
  - Rating and price information
  - Location details
  - Reservation/booking card with primary action button
  - Hours of operation
  - Contact information (phone, website)
  - Map preview (if applicable)
  - Save/favorite button
  
- **Footer Section:**
  - "View Full Page" button (if not in header)
  - Additional actions or related items

### Mobile/Tablet Behavior

**Tablet (768px - 1023px):**
```
┌───────────────┬───────────────────────────────────────────────┐
│ LEFT CONTEXT  │                MAIN WORK                       │
│               │                                               │
│               │  [Card Grid]                                  │
│               │                                               │
└───────────────┴───────────────────────────────────────────────┘
                         ▲
                         │
                [💡 Intelligence Button]
                         │
                ┌─────────────────────────┐
                │ RIGHT PANEL (Drawer)    │
                │ ─────────────────────── │
                │ [View Full Page →]      │
                │                         │
                │ El Cielo Details        │
                │ Reservation, Hours, etc │
                └─────────────────────────┘
```

**Mobile (< 768px):**
```
┌───────────────────────────────────────────────┐
│ MAIN WORK (Full Screen)                       │
│                                               │
│  [Card Grid - Scrollable]                     │
│                                               │
└───────────────────────────────────────────────┘

┌───────────────────────────────────────────────┐
│ [💡] Button (Bottom Right)                    │
└───────────────────────────────────────────────┘

        When tapped:
┌───────────────────────────────────────────────┐
│ RIGHT PANEL (Bottom Sheet - 70vh)             │
│ ────────────────────────────────────────────  │
│ [View Full Page →]                            │
│                                               │
│ El Cielo Details                              │
│ Reservation, Hours, Contact                   │
│                                               │
└───────────────────────────────────────────────┘

┌───────────────────────────────────────────────┐
│ CONTEXT NAV (Bottom Bar)                       │
└───────────────────────────────────────────────┘
```

### Interaction States

**State 1: No Selection (Default)**
- Right panel shows: Quick Stats, Tonight's Picks, Popular Cuisines
- Main panel shows: Full list/grid of items

**State 2: Card Selected**
- Right panel updates: Shows detail information for selected item
- Main panel: Remains on list, selected card can be highlighted
- Smooth transition animation when right panel updates

**State 3: Full Page View (Optional)**
- User clicks "View Full Page" button
- Navigates to full-page detail route
- Full-screen detail view with all information

### Visual Hierarchy

```
Right Panel Detail View Structure:

┌─────────────────────────────────┐
│ [View Full Page →]  (Primary)   │
├─────────────────────────────────┤
│ Item Name                       │
│ Category Badge                  │
│ Rating | Price | Location       │
├─────────────────────────────────┤
│ [Reserve/Book Button] (Primary) │
│ Action description              │
├─────────────────────────────────┤
│ Hours Today                     │
│ Open/Closed status              │
├─────────────────────────────────┤
│ Contact                         │
│ Phone | Website                 │
├─────────────────────────────────┤
│ Map Preview (if applicable)      │
├─────────────────────────────────┤
│ [View Full Page →]  (Secondary) │
└─────────────────────────────────┘
```

### Responsive Breakpoints

- **Desktop (≥1024px):** Full 3-panel layout, right panel always visible
- **Tablet (768px-1023px):** 2-panel layout, right panel as drawer triggered by button
- **Mobile (<768px):** Single panel, right panel as bottom sheet triggered by button
