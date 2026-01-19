# 05 - Restaurants Module

## I Love Medellín - Restaurants

---

## 1. CONTEXT & ROLE

Building the restaurants module for I Love Medellín, enabling users to discover restaurants, view menus, and book tables with AI-powered recommendations and dietary matching.

Act as an expert **restaurant discovery platform developer** specializing in **dining search and reservation systems**.

---

## 2. PURPOSE

Enable all user types to discover restaurants in Medellín, find places that match their dietary preferences, and book tables seamlessly through AI-assisted workflows.

---

## 3. GOALS

- Build restaurants list page with filters
- Create restaurant detail page with menu info
- Enable dietary preference matching
- Integrate map-based discovery
- Prepare for AI table booking (Phase 2+)

---

## 4. SCREENS

### Restaurants List (`/restaurants`)

**3-Panel Layout:**

**Left Panel - Context:**
- Navigation with Restaurants highlighted
- Cuisine type filters
- Saved restaurants

**Main Panel - Work:**
- Search bar
- Filter chips (cuisine, price, neighborhood)
- Grid of restaurant cards
- Sort by rating, price, distance
- Map view toggle

**Right Panel - Intelligence:**
- Map with restaurant pins
- "Tonight's picks" suggestions
- Dietary match indicators
- Trending restaurants

**Restaurant Card Content:**
- Hero image
- Restaurant name
- Cuisine types (tags)
- Price level ($ to $$$$)
- Rating stars
- Neighborhood
- Distance from user
- Dietary badges (vegan, GF options)
- Save button

**Filters:**
- Cuisine type (multi-select)
- Price level (1-4)
- Neighborhood
- Dietary options (vegan, vegetarian, gluten-free)
- Accepts reservations
- Open now
- Ambiance (romantic, casual, family)

---

### Restaurant Detail (`/restaurants/:id`)

**3-Panel Layout:**

**Left Panel - Context:**
- Navigation
- Back to listings
- Similar restaurants

**Main Panel - Work:**
- Image gallery
- Name and cuisine
- Rating and review count
- Price level
- Address with map link
- Hours of operation
- Menu link or inline menu
- Dietary accommodations
- Ambiance description
- Reserve button

**Right Panel - Intelligence:**
- Fit Score (Phase 2 AI)
- Availability calendar
- "Perfect for" suggestions
- Similar restaurants
- Message draft for requests
- Save to favorites

---

## 5. DATA MODEL

**restaurants Table:**
- id (uuid, primary key)
- name (text)
- description (text)
- cuisine_types (text array)
- price_level (integer, 1-4)
- neighborhood (text)
- address (text)
- latitude, longitude (numeric)
- phone (text)
- website (text)
- hours (jsonb, by day)
- menu_url (text)
- accepts_reservations (boolean)
- dietary_options (text array)
- ambiance (text array)
- images (text array)
- rating (numeric)
- review_count (integer)
- created_at, updated_at

---

## 6. AI AGENTS (Phase 2+)

**Restaurant Search Agent**
- Model: gemini-3-pro + Search + Maps
- Screen: Restaurants List
- Purpose: Discovery with location context

**Cuisine Recommender Agent**
- Model: gemini-3-pro + RAG
- Screen: Restaurants List
- Purpose: Based on user preferences

**Availability Checker Agent**
- Model: gemini-3-flash-preview
- Screen: Restaurants List, Detail
- Purpose: Real-time table status

**Dietary Filter Agent**
- Model: gemini-3-flash-preview
- Screen: Restaurants List
- Purpose: Match dietary restrictions

**Menu Analyzer Agent**
- Model: gemini-3-pro-preview
- Screen: Restaurant Detail
- Purpose: Extract menu items and prices

**Fit Score Agent**
- Model: gemini-3-flash-preview
- Screen: Restaurant Detail
- Purpose: Match to user preferences

**Table Booking Agent**
- Model: claude-opus-4-5
- Screen: Booking Flow
- Purpose: Handle reservation workflow

**Message Draft Agent**
- Model: claude-sonnet-4-5
- Screen: Restaurant Detail
- Purpose: Draft special request messages

---

## 7. RIGHT PANEL AI ACTIONS (Phase 2+)

**Restaurants List:**
- "Tonight's picks" based on time and preferences
- Dietary match percentages
- Distance and travel time
- Trending badges

**Restaurant Detail:**
- Fit Score breakdown (dietary, vibe, price)
- Availability quick check
- "Perfect for" tags (date night, group, family)
- Similar alternatives
- Draft reservation message

---

## 8. USER JOURNEY

1. User navigates to Restaurants
2. User sees grid of restaurants
3. User filters by cuisine and dietary needs
4. User clicks on restaurant card
5. User views full details and menu
6. User checks availability (Phase 2)
7. User sees Fit Score (Phase 2)
8. User saves or books table
9. Confirmation received

---

## 9. FEATURES

**Search & Discovery:**
- Full-text search
- Multi-filter combinations
- Map view with pins
- Sort by rating, distance, price

**Dietary Matching:**
- Vegan options indicator
- Vegetarian options indicator
- Gluten-free options indicator
- Allergen information

**Menu Integration:**
- Link to external menu
- Inline menu display (if available)
- Price range indicators

**Saving:**
- Heart icon on cards
- Add to collections ("Date Night", "Work Lunches")
- Notes on saved items

---

## 10. 3-PANEL LOGIC

**Left Panel Updates:**
- Highlights "Restaurants" in navigation
- Quick cuisine filters
- Recent searches

**Main Panel Focus:**
- Browsing and discovery
- Filtering and sorting
- Detail viewing

**Right Panel Intelligence:**
- Map with pins
- AI recommendations
- Fit scores and matches
- Booking status

---

## 11. WORKFLOWS

**Restaurant Discovery Workflow:**
1. Load restaurants from database
2. Apply user preference filters
3. Calculate distance from user
4. Rank by relevance and rating
5. Display with dietary badges

**Restaurant Detail Workflow:**
1. Load restaurant by ID
2. Fetch menu if available
3. Calculate Fit Score (Phase 2)
4. Check availability (Phase 2)
5. Display all information

**Table Booking Workflow (Phase 2+):**
1. User selects date and time
2. User enters party size
3. Agent checks availability
4. Agent processes reservation
5. Confirmation displayed
6. Reminder scheduled

---

## 12. SUPABASE QUERIES

**List Restaurants:**
- Select from restaurants
- Filter by cuisine, price, neighborhood
- Filter by dietary options
- Order by rating or distance

**Get Restaurant Detail:**
- Select single restaurant by ID
- Include all fields
- Related data if any

**Save Restaurant:**
- Insert into saved_places
- User ID + restaurant ID

---

## 13. RESPONSIVE BEHAVIOR

**Desktop:**
- Full 3-panel layout
- 3-4 cards per row
- Inline map

**Tablet:**
- 2-panel layout
- 2-3 cards per row
- Map as overlay

**Mobile:**
- Full-screen list
- Single card width
- Bottom sheet details
- Swipe for map

---

## 14. SUCCESS CRITERIA

- Restaurants list loads with filters
- Cuisine and dietary filters work
- Detail page shows all info
- Menu link functional
- Map view works
- Save to favorites works
- Responsive design complete

---

## 15. TESTING & VERIFICATION

### Unit Tests:
- [ ] Restaurant cards render correctly
- [ ] Filters update results
- [ ] Search functionality works
- [ ] Dietary filters apply correctly
- [ ] Save/unsave button toggles
- [ ] Detail page loads all data

### Integration Tests:
- [ ] Supabase query returns restaurants
- [ ] Filters apply correctly to query
- [ ] Save to favorites persists
- [ ] RLS policies enforce access
- [ ] Map pins display correctly

### Manual Verification:
1. Load restaurants page - data displays
2. Apply cuisine filter - results update
3. Apply dietary filter - vegan/GF options show
4. Click restaurant card - detail page loads
5. Test menu link - opens menu
6. Save restaurant - appears in saved
7. Test on mobile - responsive works

### Production Readiness:
- [ ] Loading states during data fetch
- [ ] Empty state when no results
- [ ] Error handling for failed queries
- [ ] Performance acceptable (< 2s load)
- [ ] Images load correctly
- [ ] Menu links work (if external)

---

## 16. REAL-WORLD EXAMPLE

**User Journey: Find Vegan Restaurant**

1. User opens Restaurants page
2. Filters: Vegan, El Poblado, $$-$$$
3. Sees 5 matching restaurants
4. Clicks restaurant card
5. Views menu with vegan options highlighted
6. Checks dietary accommodations
7. Books table for tonight (Phase 2)
8. Receives confirmation

**Time:** 5 minutes (vs 30 minutes calling restaurants)

---

## 17. OPTIMIZATION NOTES

**Avoid Over-Engineering:**
- Basic list and detail pages first
- Simple filters (don't need complex search yet)
- Menu can be external link (don't need full menu parser yet)
- Basic map integration

**Production Focus:**
- Fast page loads
- Clear restaurant information
- Easy filtering
- Good mobile experience

---

**Previous Prompt:** 04-listings-cars.md  
**Next Prompt:** 06-listings-events.md
