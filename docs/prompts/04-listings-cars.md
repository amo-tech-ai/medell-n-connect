# 04 - Car Rentals Module

## I Love Medellín - Cars

---

## 1. CONTEXT & ROLE

Building the car rentals module for I Love Medellín, enabling users to find and book vehicle rentals for any duration with intelligent price comparison and insurance guidance.

Act as an expert **vehicle rental platform developer** specializing in **car booking systems with comparison features**.

---

## 2. PURPOSE

Enable all user types to find, compare, and book car rentals in Medellín with transparent pricing, insurance options, and pickup/dropoff optimization.

---

## 3. GOALS

- Build car rentals list page with filters
- Create car detail page with full specifications
- Enable price comparison features
- Integrate pickup location mapping
- Prepare for AI agents (Phase 2+)

---

## 4. SCREENS

### Cars List (`/cars`)

**3-Panel Layout:**

**Left Panel - Context:**
- Navigation with Cars highlighted
- Quick filters sidebar
- Saved searches

**Main Panel - Work:**
- Search bar (dates, location)
- Filter chips (type, transmission, price)
- Grid of car cards
- Sort options

**Right Panel - Intelligence:**
- Map with pickup locations
- Price comparison summary
- Best value picks
- Recent searches

**Car Card Content:**
- Hero image
- Make and model
- Year and type (sedan, SUV, compact)
- Transmission indicator
- Daily price
- Key features icons
- Availability badge
- Save button

**Filters:**
- Pickup date range
- Vehicle type (sedan, SUV, compact, etc.)
- Transmission (automatic, manual)
- Price range (daily)
- Features (GPS, AC, Bluetooth)
- Pickup location area

---

### Car Detail (`/cars/:id`)

**3-Panel Layout:**

**Left Panel - Context:**
- Navigation
- Back to listings
- Similar vehicles list

**Main Panel - Work:**
- Image gallery
- Make, model, year headline
- Vehicle specifications
- Features list
- Pricing breakdown (daily, weekly, monthly)
- Insurance options overview
- Pickup/dropoff locations
- Availability calendar
- Book button

**Right Panel - Intelligence:**
- Total cost calculator
- Price Comparison (Phase 2 AI)
- Insurance Analysis (Phase 2 AI)
- Pickup Optimization (Phase 2 AI)
- Similar vehicles at better prices
- Save to favorites

---

## 5. DATA MODEL

**car_rentals Table:**

**Required Fields:**
- id (uuid, PK, default: gen_random_uuid())
- make (text, required)
- model (text, required)
- price_daily (numeric, required)
- created_at (timestamptz, default: now())
- updated_at (timestamptz, default: now())

**Optional Basic Info:**
- description (text, nullable) - Vehicle description
- slug (text, nullable, unique) - URL-friendly identifier
- year (integer, nullable) - Manufacturing year

**Vehicle Specifications:**
- vehicle_type (text, nullable, default: 'sedan', check: sedan|suv|compact|van|luxury|pickup|convertible|minivan)
- transmission (text, nullable, default: 'automatic', check: automatic|manual)
- fuel_type (text, nullable, default: 'gasoline', check: gasoline|diesel|electric|hybrid)
- seats (integer, nullable, default: 5)
- doors (integer, nullable, default: 4)
- color (text, nullable)

**Features:**
- features (text[], nullable, default: '{}') - Vehicle features array
- has_ac (boolean, nullable, default: true)
- has_gps (boolean, nullable, default: false)
- has_bluetooth (boolean, nullable, default: true)

**Pricing:**
- price_daily (numeric, required)
- price_weekly (numeric, nullable)
- price_monthly (numeric, nullable)
- currency (text, nullable, default: 'USD')
- deposit_amount (numeric, nullable)

**Insurance & Mileage:**
- insurance_included (boolean, nullable, default: false)
- mileage_limit_daily (integer, nullable) - Daily mileage limit if not unlimited
- unlimited_mileage (boolean, nullable, default: false)

**Availability:**
- available_from (date, nullable)
- available_to (date, nullable)
- minimum_rental_days (integer, nullable, default: 1)
- pickup_locations (jsonb, nullable, default: '[]') - Array of pickup location objects
- delivery_available (boolean, nullable, default: false)

**Media:**
- images (text[], nullable, default: '{}') - Array of image URLs

**Ratings & Reviews:**
- rating (numeric, nullable) - Average rating (0-5)
- review_count (integer, nullable, default: 0)

**Company & Status:**
- rental_company (text, nullable)
- status (text, nullable, default: 'active', check: active|inactive|rented|maintenance)
- featured (boolean, nullable, default: false)
- created_by (uuid, nullable, FK auth.users)

**Timestamps:**
- created_at (timestamptz, required, default: now())
- updated_at (timestamptz, required, default: now())

---

## 6. AI AGENTS (Phase 2+)

**Car Search Agent**
- Model: gemini-3-pro + Search
- Screen: Cars List
- Purpose: Discovery with smart filters

**Price Comparison Agent**
- Model: gemini-3-flash-preview
- Screen: Cars List, Car Detail
- Purpose: Compare rental options and highlight deals

**Insurance Advisor Agent**
- Model: gemini-3-pro-preview
- Screen: Car Detail
- Purpose: Explain coverage options simply

**Vehicle Analyzer Agent**
- Model: gemini-3-pro-preview
- Screen: Car Detail
- Purpose: Extract and explain all vehicle details

**Insurance Explainer Agent**
- Model: gemini-3-pro-preview
- Screen: Car Detail, Booking Wizard
- Purpose: Break down coverage options

**Pickup Optimizer Agent**
- Model: gemini-3-pro + Maps
- Screen: Car Detail
- Purpose: Suggest best pickup location

**Car Booking Agent**
- Model: claude-opus-4-5
- Screen: Booking Wizard
- Purpose: Handle rental workflow autonomously

---

## 7. RIGHT PANEL AI ACTIONS (Phase 2+)

**Cars List:**
- Price comparison highlights
- "Best value" badges
- Fuel efficiency indicators
- Pickup location convenience scores

**Car Detail:**
- Total cost breakdown with all fees
- Insurance comparison table
- Pickup location map with suggestions
- Mileage calculator
- Similar vehicles at lower prices

---

## 8. USER JOURNEY

1. User navigates to Cars from left panel
2. User enters pickup dates and location
3. User applies filters (type, transmission)
4. User browses available cars
5. User clicks on car card
6. User reviews full specifications
7. User checks insurance options
8. User calculates total cost
9. User saves or proceeds to book

---

## 9. FEATURES

**Search & Discovery:**
- Date range picker
- Location-based search
- Filter by vehicle type
- Sort by price, newest

**Price Transparency:**
- Daily, weekly, monthly rates
- Total cost calculator
- Insurance costs displayed
- No hidden fees messaging

**Comparison:**
- Save multiple cars
- Side-by-side compare (future)
- Price per day breakdown

**Booking Preparation:**
- Availability calendar
- Pickup/dropoff selectors
- Insurance add-ons
- Driver requirements info

---

## 10. 3-PANEL LOGIC

**Left Panel Updates:**
- Highlights "Cars" in navigation
- Shows quick date/location filters
- Recent searches

**Main Panel Focus:**
- All browsing and selection
- Date and filter inputs
- Car grid and details

**Right Panel Intelligence:**
- Price comparison context
- Insurance summaries
- Map with pickup points
- Cost calculator widget

---

## 11. WORKFLOWS

**Car Discovery Workflow:**
1. Load cars from database
2. Filter by date availability
3. Apply user filters
4. Rank by price or relevance
5. Display with availability

**Car Detail Workflow:**
1. Load car by ID
2. Calculate available dates
3. Show full specifications
4. Display pricing tiers
5. Prepare insurance options

**Price Calculation Workflow:**
1. User selects dates
2. Calculate rental duration
3. Apply correct rate tier
4. Add insurance if selected
5. Display total cost

---

## 12. SUPABASE QUERIES

**List Cars:**
- Select from car_rentals
- Filter by date availability
- Filter by attributes
- Order by price or relevance

**Get Car Detail:**
- Select single car by ID
- Include all specifications
- Calculate availability

**Check Availability:**
- Verify dates not booked
- Return available dates

---

## 13. RESPONSIVE BEHAVIOR

**Desktop:**
- Full 3-panel layout
- Side-by-side price comparison
- Large image gallery

**Tablet:**
- 2-panel layout
- Stacked price comparison
- Medium gallery

**Mobile:**
- Full-screen cards
- Swipeable gallery
- Bottom sheet for booking

---

## 14. SUCCESS CRITERIA

- Cars list loads with filters
- Date filtering works correctly
- Detail page shows all specs
- Price breakdown is clear
- Pickup locations on map
- Save to favorites works
- Responsive design complete

---

## 15. TESTING & VERIFICATION

### Unit Tests:
- [ ] Car cards render correctly
- [ ] Date filters update results
- [ ] Type/transmission filters work
- [ ] Price calculation correct
- [ ] Save/unsave button toggles
- [ ] Detail page loads all data

### Integration Tests:
- [ ] Supabase query returns cars
- [ ] Date availability filtering works
- [ ] Save to favorites persists
- [ ] RLS policies enforce access
- [ ] Map pins display correctly

### Manual Verification:
1. Load cars page - data displays
2. Select dates - available cars show
3. Filter by type - results update
4. Click car card - detail page loads
5. Verify price breakdown - correct calculation
6. Save car - appears in saved
7. Test on mobile - responsive works

### Production Readiness:
- [ ] Loading states during data fetch
- [ ] Empty state when no cars available
- [ ] Error handling for failed queries
- [ ] Performance acceptable (< 2s load)
- [ ] Images load correctly
- [ ] Price calculations accurate

---

## 16. REAL-WORLD EXAMPLE

**User Journey: Rent Car for Weekend**

1. User opens Cars page
2. Selects dates (Friday-Sunday)
3. Filters: Automatic, SUV, Under $50/day
4. Sees 3 available cars
5. Clicks car card
6. Views specs, insurance options, pickup location
7. Books car (Phase 2)
8. Receives confirmation with pickup instructions

**Time:** 5 minutes (vs 30 minutes calling rental companies)

---

## 17. OPTIMIZATION NOTES

**Avoid Over-Engineering:**
- Basic list and detail pages first
- Simple date/type filters
- Price calculation is straightforward
- Don't need complex availability system yet

**Production Focus:**
- Fast page loads
- Clear car information
- Easy filtering
- Accurate pricing

---

**Previous Prompt:** 03-listings-apartments.md  
**Next Prompt:** 05-listings-restaurants.md
