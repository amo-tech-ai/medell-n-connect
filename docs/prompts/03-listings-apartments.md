# 03 - Apartments Listings Module

## I Love Medellín - Apartments

---

## 1. CONTEXT & ROLE

Building the apartments and real estate rental module for I Love Medellín, enabling users to discover, compare, and book short-term and long-term housing in Medellín.

Act as an expert **real estate platform developer** specializing in **rental search and booking systems with AI-powered recommendations**.

---

## 2. PURPOSE

Enable digital nomads, expats, and travelers to find and book apartments in Medellín with intelligent search, neighborhood insights, and AI-assisted contract review.

---

## 3. GOALS

- Build apartments list page with filters
- Create apartment detail page with all information
- Enable save to favorites functionality
- Integrate neighborhood context
- Prepare for AI agents (Phase 2+)

---

## 4. SCREENS

### Apartments List (`/apartments`)

**3-Panel Layout:**

**Left Panel - Context:**
- Navigation with Apartments highlighted
- Filter categories
- Saved filters

**Main Panel - Work:**
- Search bar at top
- Filter chips (neighborhood, price, bedrooms)
- Grid of apartment cards
- Pagination or infinite scroll
- Map toggle view

**Right Panel - Intelligence:**
- Mini map with listings pinned
- "Top picks for you" suggestions
- Saved apartments shortlist
- Quick stats (avg price, availability)

**Apartment Card Content:**
- Hero image with gallery indicator
- Title and neighborhood
- Price (monthly/weekly)
- Bedrooms, bathrooms, WiFi speed
- Key amenities icons
- Heart button to save
- Furnished badge

**Filters:**
- Neighborhood (multi-select)
- Price range (slider)
- Bedrooms (1, 2, 3+)
- Furnished/Unfurnished
- Pet-friendly
- WiFi speed minimum
- Available from date

---

### Apartment Detail (`/apartments/:id`)

**3-Panel Layout:**

**Left Panel - Context:**
- Navigation
- Back to listings link
- Similar apartments quick list

**Main Panel - Work:**
- Image gallery/carousel
- Title and location
- Price display (monthly and weekly)
- Availability calendar
- Property description
- Amenities grid
- House rules
- Location map
- Host/Property manager info
- Book button or inquiry form

**Right Panel - Intelligence:**
- Key Details summary
- Neighborhood Score (Phase 2 AI)
- Value Analysis (Phase 2 AI)
- Contract highlights (Phase 2 AI)
- Commute times to key areas
- Similar properties
- Save to collection button

---

## 5. DATA MODEL

**apartments Table:**

**Required Fields:**
- id (uuid, PK, default: gen_random_uuid())
- title (text, required)
- neighborhood (text, required)
- created_at (timestamptz, default: now())
- updated_at (timestamptz, default: now())

**Optional Basic Info:**
- description (text, nullable)
- slug (text, nullable, unique) - URL-friendly identifier
- address (text, nullable)
- city (text, nullable, default: 'Medellín')
- latitude (numeric, nullable)
- longitude (numeric, nullable)
- location (geography, nullable) - PostGIS geography type for spatial queries

**Property Details:**
- bedrooms (integer, nullable, default: 1)
- bathrooms (integer, nullable, default: 1)
- size_sqm (integer, nullable) - Property size in square meters
- furnished (boolean, nullable, default: true)
- floor_number (integer, nullable)
- total_floors (integer, nullable)
- wifi_speed (integer, nullable) - WiFi speed in mbps

**Amenities:**
- amenities (text[], nullable, default: '{}') - Unit amenities array
- building_amenities (text[], nullable, default: '{}') - Building amenities array

**Pricing:**
- price_monthly (numeric, nullable)
- price_weekly (numeric, nullable)
- price_daily (numeric, nullable)
- currency (text, nullable, default: 'USD')
- deposit_amount (numeric, nullable)

**Availability:**
- available_from (date, nullable)
- available_to (date, nullable)
- minimum_stay_days (integer, nullable, default: 30)
- maximum_stay_days (integer, nullable)

**Property Rules:**
- utilities_included (boolean, nullable, default: false)
- pet_friendly (boolean, nullable, default: false)
- smoking_allowed (boolean, nullable, default: false)
- parking_included (boolean, nullable, default: false)

**Media:**
- images (text[], nullable, default: '{}') - Array of image URLs
- video_url (text, nullable)
- virtual_tour_url (text, nullable)

**Ratings & Reviews:**
- rating (numeric, nullable) - Average rating (0-5)
- review_count (integer, nullable, default: 0)

**Host Information:**
- host_id (uuid, nullable, FK auth.users)
- host_name (text, nullable)
- host_response_time (text, nullable)

**Status & Metadata:**
- status (text, nullable, default: 'active', check: active|inactive|booked|pending)
- featured (boolean, nullable, default: false)
- verified (boolean, nullable, default: false)
- metadata (jsonb, nullable, default: '{}') - Additional flexible data
- created_by (uuid, nullable, FK auth.users)

**Timestamps:**
- created_at (timestamptz, required, default: now())
- updated_at (timestamptz, required, default: now())

---

## 6. AI AGENTS (Phase 2+)

**Apartment Search Agent**
- Model: gemini-3-pro + Search
- Screen: Apartments List
- Purpose: Discovery with smart filters

**Neighborhood Advisor Agent**
- Model: gemini-3-pro + Maps
- Screen: Apartments List
- Purpose: Safety, walkability, amenities info

**Value Analyzer Agent**
- Model: gemini-3-pro-preview
- Screen: Apartment Detail
- Purpose: Compare to market prices

**WiFi Speed Agent**
- Model: gemini-3-flash-preview
- Screen: Apartment Detail
- Purpose: Verify internet quality claims

**Listing Analyzer Agent**
- Model: gemini-3-pro-preview
- Screen: Apartment Detail
- Purpose: Extract and summarize listing details

**Neighborhood Score Agent**
- Model: gemini-3-pro + Maps
- Screen: Apartment Detail
- Purpose: Safety, walkability, transit scores

**Contract Review Agent**
- Model: claude-opus-4-5
- Screen: Apartment Detail
- Purpose: Analyze rental contract terms

**Commute Simulator Agent**
- Model: gemini-3-pro + Maps
- Screen: Apartment Detail
- Purpose: Calculate time to saved locations

**Apartment Booking Agent**
- Model: claude-opus-4-5
- Screen: Booking Wizard
- Purpose: Handle booking workflow autonomously

---

## 7. RIGHT PANEL AI ACTIONS (Phase 2+)

**Apartments List:**
- Neighborhood scores on hover
- Price comparison indicators
- "Perfect match" badges based on preferences

**Apartment Detail:**
- Neighborhood Score breakdown
- Value vs. Market comparison
- Contract Review highlights and concerns
- Commute times to:
  - Coworking spaces (for nomads)
  - Key neighborhoods
  - User's saved places
- Similar properties carousel

---

## 8. USER JOURNEY

1. User navigates to Apartments from left panel
2. User sees grid of available apartments
3. User applies filters (neighborhood, price, bedrooms)
4. User clicks on apartment card
5. User views full detail page
6. User reads description and amenities
7. User checks neighborhood score (Phase 2)
8. User saves to favorites or proceeds to book
9. Booking wizard initiated (Phase 2)

---

## 9. FEATURES

**Search & Discovery:**
- Full-text search in title and description
- Filter by all major attributes
- Sort by price, newest, relevance
- Map view with cluster pins

**Comparison:**
- Save multiple apartments
- Compare side-by-side (future)
- Price history (future)

**Saving:**
- Heart icon on cards
- Add to collections
- Notes on saved items

**Detail View:**
- Image gallery with fullscreen
- Availability calendar
- Share listing link
- Contact host (future)

---

## 10. 3-PANEL LOGIC

**Left Panel Updates:**
- Highlights "Apartments" in navigation
- Shows quick filter access
- Displays active filters count

**Main Panel Focus:**
- All user actions happen here
- Browsing, filtering, viewing details
- Human-first experience

**Right Panel Intelligence:**
- AI suggestions contextual to current view
- On list: map, suggestions, quick stats
- On detail: scores, analysis, similar

---

## 11. WORKFLOWS

**Apartment Discovery Workflow:**
1. Load apartments from database
2. Apply user preference filters
3. Rank by relevance (Phase 2 AI)
4. Display in grid or map view
5. Update on filter changes

**Apartment Detail Workflow:**
1. Load apartment by ID
2. Fetch related data (host, reviews)
3. Calculate neighborhood score (Phase 2)
4. Display all information
5. Show AI insights in right panel

**Save Apartment Workflow:**
1. User clicks heart icon
2. If not logged in, prompt login
3. Add to saved_places table
4. Update UI to show saved state
5. Sync across views

---

## 12. SUPABASE QUERIES

**List Apartments:**
- Select from apartments table
- Apply RLS for published listings
- Filter by user criteria
- Order by relevance or price

**Get Apartment Detail:**
- Select single apartment by ID
- Join with host profile if exists
- Include all fields

**Save Apartment:**
- Insert into saved_places
- User ID + resource type + resource ID

---

## 13. RESPONSIVE BEHAVIOR

**Desktop:**
- Full 3-panel layout
- Grid of 3-4 cards per row
- Right panel always visible

**Tablet:**
- 2-panel (left + main)
- Grid of 2-3 cards per row
- Right panel as drawer

**Mobile:**
- Full-screen main panel
- Single card width
- Bottom filters sheet
- Swipe for map view

---

## 14. SUCCESS CRITERIA

- Apartments list loads with filters
- Filters update results correctly
- Detail page shows all information
- Save to favorites works
- Map view shows locations
- Responsive across devices
- Ready for AI agent integration

---

## 15. TESTING & VERIFICATION

### Unit Tests:
- [ ] Apartment cards render correctly
- [ ] Filters update results
- [ ] Search functionality works
- [ ] Save/unsave button toggles
- [ ] Detail page loads all data

### Integration Tests:
- [ ] Supabase query returns apartments
- [ ] Filters apply correctly to query
- [ ] Save to favorites persists
- [ ] RLS policies enforce access
- [ ] Map pins display correctly

### Manual Verification:
1. Load apartments page - data displays
2. Apply filters - results update
3. Click apartment card - detail page loads
4. Save apartment - appears in saved
5. Test on mobile - responsive works
6. Test map view - pins show correctly

### Production Readiness:
- [ ] Loading states during data fetch
- [ ] Empty state when no results
- [ ] Error handling for failed queries
- [ ] Performance acceptable (< 2s load)
- [ ] Images load correctly

---

## 16. REAL-WORLD EXAMPLE

**User Journey: Find Apartment**

1. Digital nomad opens Apartments page
2. Filters: El Poblado, Furnished, 1-2 BR, $800-1200/month
3. Sees 8 matching apartments
4. Clicks apartment card
5. Views details, photos, amenities
6. Checks neighborhood score (Phase 2)
7. Saves to favorites
8. Compares with other saved apartments
9. Books favorite (Phase 2)

**Time:** 15 minutes (vs 2 hours manual search)

---

## 17. OPTIMIZATION NOTES

**Avoid Over-Engineering:**
- Basic list and detail pages first
- Simple filters (don't need advanced search yet)
- Basic map integration (don't need complex clustering)
- Save functionality is simple (one table)

**Production Focus:**
- Fast page loads
- Clear apartment information
- Easy filtering
- Good mobile experience

---

## 18. UX RESILIENCE

### Empty States

| Scenario | Message | Action |
|----------|---------|--------|
| No apartments found | "No apartments match your filters. Try adjusting." | Show "Clear filters" button |
| No saved apartments | "You haven't saved any apartments yet." | Show "Browse Apartments" link |
| Location not available | "Location data unavailable." | Show list view fallback |

### Loading States

- **List loading:** Skeleton cards (3-4 placeholders)
- **Detail loading:** Skeleton with image placeholder
- **Map loading:** Map placeholder with spinner
- **Save action:** Immediate optimistic update

### AI Fallback (Phase 2+)

| AI Feature | Fallback When Unavailable |
|------------|--------------------------|
| AI recommendations | Show database sort (newest first) |
| Neighborhood score | Show "Score unavailable" with disclaimer |
| Value analysis | Hide section, show static description |
| AI search | Fall back to text search |

### Error Handling

- Failed to load: "Unable to load apartments. Tap to retry."
- Filter error: Reset filters and show all results
- Save failed: "Couldn't save. Try again." with retry button

---

**Previous Prompt:** 02-auth-setup.md  
**Next Prompt:** 04-listings-cars.md
