# 08 - Explore & Discovery Module

## I Love Medellín - Unified Explore

---

## 1. CONTEXT & ROLE

Building the unified explore module for I Love Medellín, providing a single search and discovery interface across all listing types with map integration and AI-powered recommendations.

Act as an expert **discovery platform developer** specializing in **multi-domain search with map-based exploration**.

---

## 2. PURPOSE

Provide a single "Explore" page where users can discover restaurants, events, activities, and stays all in one place with intelligent categorization and map visualization.

---

## 3. GOALS

- Build unified explore page
- Implement multi-type search
- Create category tabs for filtering
- Integrate Google Maps with pins
- Prepare for AI discovery agents (Phase 2+)

---

## 4. SCREENS

### Explore Dashboard (`/explore`)

**3-Panel Layout:**

**Left Panel - Context:**
- Navigation with Explore highlighted
- Quick filters sidebar
- Recent searches
- Saved searches

**Main Panel - Work:**
- Search bar at top
- Category tabs: All, Restaurants, Things to Do, Stays, Coffee, Nightlife
- Content grid below tabs
- Map toggle view
- Sort and filter options

**Right Panel - Intelligence:**
- Interactive map with pins
- "For you in [Location]" suggestions
- Time-based recommendations
- Weather-aware suggestions
- Budget quick filters

**Category Tabs:**
| Tab | Content Types |
|-----|---------------|
| All | Everything combined |
| Restaurants | Dining, cafes, bars |
| Things to Do | Activities, tours, experiences, events |
| Stays | Apartments, hotels |
| Coffee | Cafes, coworking spots |
| Nightlife | Bars, clubs, events |

---

## 5. DATA MODEL

**Queries across multiple tables:**
- apartments (for Stays)
- restaurants (for Restaurants, Coffee)
- events (for Things to Do, Nightlife)

**Unified result format:**
- id
- type (apartment, restaurant, event)
- title
- description
- image
- location (lat/lng)
- neighborhood
- rating
- price indicator
- category tags

---

## 6. AI AGENTS (Phase 2+)

**Multi-Domain Search Agent**
- Model: gemini-3-pro + Search + Maps
- Screen: Explore
- Purpose: Search across all categories

**Location Context Agent**
- Model: gemini-3-pro + Maps
- Screen: Explore
- Purpose: Distance, walkability, area info

**Preference Matcher Agent**
- Model: gemini-3-pro + RAG
- Screen: Explore
- Purpose: Rank by user preferences

**Category Filter Agent**
- Model: gemini-3-flash-preview
- Screen: Explore
- Purpose: Quick filtering and categorization

---

## 7. RIGHT PANEL AI ACTIONS (Phase 2+)

**Explore Page:**
- Map with color-coded pins by type
- "Near you" suggestions
- "Open now" quick filter
- "Good for tonight" recommendations
- Budget presets ($, $$, $$$)
- Distance rings from current location

---

## 8. USER JOURNEY

1. User navigates to Explore
2. User sees unified content grid
3. User searches or browses
4. User switches category tabs
5. User toggles to map view
6. User clicks pin on map
7. User views quick preview
8. User navigates to full detail page
9. User saves or books

---

## 9. FEATURES

**Unified Search:**
- Single search across all types
- Autocomplete suggestions
- Recent searches saved
- Voice search (future)

**Category Tabs:**
- Quick switch between categories
- Result counts per tab
- Active tab indicator
- Scroll position preserved

**Map Integration:**
- Google Maps embed
- Clustered pins
- Color-coded by type
- Click for preview popup
- Zoom to location

**Filters:**
- Price range
- Distance from me
- Rating minimum
- Open now toggle
- Specific amenities

**Time-Based:**
- "Good for breakfast"
- "Tonight's events"
- "Weekend activities"
- Weather-appropriate

---

## 10. 3-PANEL LOGIC

**Left Panel Updates:**
- Highlights "Explore" in navigation
- Shows active filters
- Recent searches

**Main Panel Focus:**
- Search input
- Category tabs
- Content grid or map
- All discovery happens here

**Right Panel Intelligence:**
- Always shows map (if main is grid)
- Location-based suggestions
- Quick action buttons
- AI recommendations

---

## 11. WORKFLOWS

**Multi-Domain Search Workflow:**
1. User enters search query
2. Query sent to all tables
3. Results combined and ranked
4. Displayed with type badges
5. Click goes to respective detail

**Category Filter Workflow:**
1. User clicks category tab
2. Results filtered by type
3. Map pins updated
4. Counts recalculated

**Map Exploration Workflow:**
1. User toggles map view
2. Pins displayed on map
3. User clicks pin
4. Preview popup shown
5. User navigates to detail

---

## 12. SUPABASE QUERIES

**Unified Search:**
- UNION query across tables
- Or separate queries merged in frontend
- Apply common filters
- Return unified structure

**By Category:**
- Filter by resource type
- Apply category-specific logic
- Sort by relevance

**Location-Based:**
- Filter by lat/lng bounds
- Order by distance
- Cluster for map display

---

## 13. RESPONSIVE BEHAVIOR

**Desktop:**
- Full 3-panel layout
- Grid and map side-by-side
- Category tabs horizontal

**Tablet:**
- 2-panel layout
- Toggle between grid and map
- Category tabs scrollable

**Mobile:**
- Full-screen content
- Swipe between grid and map
- Bottom category tabs
- Search at top

---

## 14. SUCCESS CRITERIA

- Unified search works across types
- Category tabs filter correctly
- Map displays all locations
- Pins clickable with previews
- Filters apply globally
- Responsive across devices
- Fast performance

---

## 15. TESTING & VERIFICATION

### Unit Tests:
- [ ] Search input works
- [ ] Category tabs filter correctly
- [ ] Map displays pins
- [ ] Pins are clickable
- [ ] Filters apply to all types
- [ ] Results display correctly

### Integration Tests:
- [ ] Search queries all resource types
- [ ] Results ranked correctly
- [ ] Map pins load from database
- [ ] Filters apply to queries
- [ ] RLS policies enforce access

### Manual Verification:
1. Enter search query - results show
2. Click category tab - filtered results
3. Click map pin - preview shows
4. Apply filters - results update
5. Switch between grid/map - both work
6. Test on mobile - responsive works
7. Test performance - loads quickly

### Production Readiness:
- [ ] Loading states during search
- [ ] Empty state when no results
- [ ] Error handling for failed searches
- [ ] Performance acceptable (< 2s)
- [ ] Map loads quickly
- [ ] Pins don't lag

---

## 16. REAL-WORLD EXAMPLE

**User Journey: Discover Weekend Plans**

1. User opens Explore page
2. Searches "things to do this weekend"
3. Sees results: Events, Restaurants, Activities
4. Clicks "Events" tab - filters to events
5. Views map - sees event locations
6. Clicks pin - preview shows event
7. Saves interesting events
8. Plans weekend from saved items

**Time:** 5 minutes (vs 2 hours researching)

---

## 17. OPTIMIZATION NOTES

**Avoid Over-Engineering:**
- Basic unified search first
- Simple category filtering
- Basic map (don't need clustering yet)
- Simple ranking (don't need complex AI ranking yet)

**Production Focus:**
- Fast search
- Clear results
- Easy filtering
- Good map performance

---

**Previous Prompt:** 07-saved-favorites.md  
**Next Prompt:** 09-trips-planning.md
