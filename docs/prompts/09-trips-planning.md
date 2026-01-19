# 09 - Trips & Itinerary Planning Module

## I Love Medellín - Trip Planning

---

## 1. CONTEXT & ROLE

Building the trips and itinerary planning module for I Love Medellín, enabling users to create multi-day trip plans with day-by-day itineraries, AI-powered optimization, and integrated bookings.

Act as an expert **travel planning platform developer** specializing in **itinerary management systems with AI optimization**.

---

## 2. PURPOSE

Enable users to plan and manage trips to Medellín with intelligent itinerary generation, route optimization, and seamless integration with all platform bookings.

---

## 3. GOALS

- Build trips list page
- Create trip detail with day-by-day view
- Implement trip creation wizard
- Enable adding items from listings
- Integrate Trip Tools panel in right panel
- Prepare for AI agents (Phase 2+)

---

## 4. SCREENS

### Trips List (`/trips`)

**3-Panel Layout:**

**Left Panel - Context:**
- Navigation with Trips highlighted
- Quick filters (upcoming, past, draft)
- Create trip button

**Main Panel - Work:**
- Trip cards grid
- Status badges (draft, active, completed)
- Trip summary info
- "Plan a new trip" card

**Right Panel - Intelligence:**
- Upcoming trip alerts
- Weather for upcoming trips
- Quick booking status
- AI suggestions for next trip

**Trip Card Content:**
- Cover image (generated or user)
- Trip title
- Dates
- Destination
- Status badge
- Days count
- Booking count
- Progress indicator

---

### Trip Detail (`/trips/:id`)

**3-Panel Layout:**

**Left Panel - Context:**
- Navigation
- Trip quick info
- Day picker list
- Back to trips

**Main Panel - Work:**
- Trip header (title, dates, destination)
- Day-by-day timeline
- Activities per day with times
- Add activity buttons per day
- Drag to reorder (future)
- Book Trip button

**Right Panel - Trip Tools:**
| Tool | Description |
|------|-------------|
| AI Actions | Auto-generate, Optimize Route, Check Conflicts |
| Itinerary | Day overview |
| Bookings | Flights, stays, activities status |
| Ideas | Saved suggestions for trip |
| Media | Photos and screenshots |
| Key Details | Preferences and logistics |
| Calendar | Timeline view |

---

### Trip Creation Wizard (`/trips/new`)

**Steps:**
1. **Destination** - Where are you going (default: Medellín)
2. **Dates** - Start and end dates
3. **Interests** - What kind of activities
4. **Budget** - Total trip budget
5. **Generate** - AI creates initial itinerary (Phase 2)
6. **Review** - Edit and customize

---

## 5. DATA MODEL

**trips Table:**
- id (uuid, primary key)
- user_id (uuid, references profiles)
- title (text)
- destination (text)
- start_date (date)
- end_date (date)
- status (enum: draft, active, completed, cancelled)
- budget (integer)
- currency (text)
- cover_image (text)
- notes (text)
- created_at, updated_at

**trip_items Table:**
- id (uuid, primary key)
- trip_id (uuid, references trips)
- day_number (integer)
- item_type (enum: activity, restaurant, event, transport, accommodation, note)
- resource_id (uuid, optional, references actual listing)
- title (text)
- description (text)
- start_time (time)
- end_time (time)
- location (text)
- latitude, longitude (numeric)
- is_booked (boolean)
- booking_id (uuid, optional)
- order_index (integer for sorting)
- created_at, updated_at

---

## 6. AI AGENTS (Phase 2+)

**Trip Overview Agent**
- Model: gemini-3-flash-preview
- Screen: Trips List
- Purpose: Quick trip status and alerts

**Weather Forecaster Agent**
- Model: gemini-3-pro + Search
- Screen: Trips List, Trip Detail
- Purpose: Weather predictions

**Conflict Detector Agent**
- Model: gemini-3-flash-preview
- Screen: Trips List, Trip Detail
- Purpose: Schedule overlap detection

**Itinerary Curator Agent**
- Model: claude-opus-4-5
- Screen: Trip Detail, Wizard
- Purpose: Full itinerary generation

**Route Optimizer Agent**
- Model: gemini-3-pro + Maps
- Screen: Trip Detail
- Purpose: Minimize travel time between activities

**Gap Detector Agent**
- Model: gemini-3-flash-preview
- Screen: Trip Detail
- Purpose: Find empty time slots

**Conflict Checker Agent**
- Model: gemini-3-flash-preview
- Screen: Trip Detail
- Purpose: Detect schedule overlaps

**Budget Optimizer Agent**
- Model: gemini-3-pro-preview
- Screen: Trip Detail
- Purpose: Cost-saving suggestions

**Auto-Schedule Agent**
- Model: claude-opus-4-5
- Screen: Trip Detail
- Purpose: Add optimal times to activities

**Weather Check Agent**
- Model: gemini-3-pro + Search
- Screen: Trip Detail
- Purpose: Weather-aware suggestions

---

## 7. RIGHT PANEL TRIP TOOLS (Phase 2+)

**AI Actions Section:**
- Auto-Generate: Create full itinerary from scratch
- Optimize Route: Reorder for minimum travel
- Check Conflicts: Find schedule problems
- Budget Optimizer: Suggest cost savings
- Auto-Schedule: Add times to all items
- Weather Check: Get weather-aware suggestions

**Itinerary Section:**
- Day-by-day summary
- Time blocks visualization
- Quick navigation

**Bookings Section:**
- All bookings for this trip
- Status indicators
- Quick link to details

**Ideas Section:**
- Saved items not yet added
- AI suggestions
- Quick add buttons

**Media Section:**
- Photos for trip
- Screenshots saved
- Inspiration images

**Key Details Section:**
- Trip preferences
- Important notes
- Contact info

**Calendar Section:**
- Visual timeline
- Conflict highlights
- Gap indicators

---

## 8. USER JOURNEY

1. User navigates to Trips
2. User clicks "Create New Trip"
3. User completes wizard steps
4. User lands on trip detail page
5. User sees day-by-day view (empty or AI-generated)
6. User adds activities from Explore or listings
7. User uses AI to optimize route
8. User checks for conflicts
9. User books activities
10. User enjoys trip

---

## 9. FEATURES

**Trip Management:**
- Create, edit, delete trips
- Associate with dates
- Track status
- Set budget

**Itinerary Building:**
- Day-by-day organization
- Add any listing type
- Custom activities
- Time assignments
- Reordering

**Add from Anywhere:**
- "Add to Trip" on any listing detail
- Select trip and day
- Auto-add to itinerary

**AI Assistance:**
- Generate full itinerary
- Optimize routes
- Detect conflicts
- Suggest activities
- Weather awareness

---

## 10. 3-PANEL LOGIC

**Left Panel Updates:**
- Highlights "Trips" in navigation
- Shows trip list or day picker
- Quick trip switcher

**Main Panel Focus:**
- Trip cards on list
- Day timeline on detail
- Activity editing
- Human-first building

**Right Panel Intelligence:**
- Trip Tools panel
- AI Actions
- Context helpers
- Booking status

---

## 11. WORKFLOWS

**Create Trip Workflow:**
1. User starts wizard
2. User enters destination and dates
3. User selects interests
4. User sets budget
5. AI generates itinerary (Phase 2)
6. User reviews and saves

**Add to Trip Workflow:**
1. User views listing detail
2. User clicks "Add to Trip"
3. User selects trip
4. User selects day
5. Item added to trip_items
6. Confirmation shown

**AI Optimize Workflow (Phase 2):**
1. User clicks Optimize Route
2. AI analyzes locations
3. AI calculates optimal order
4. Preview shown to user
5. User approves or dismisses
6. Itinerary updated

**Conflict Check Workflow (Phase 2):**
1. User clicks Check Conflicts
2. AI scans all times
3. Conflicts identified
4. Shown with suggestions
5. User resolves

---

## 12. SUPABASE QUERIES

**List Trips:**
- Select from trips
- Filter by user_id
- Filter by status
- Order by start_date

**Get Trip Detail:**
- Select trip by ID
- Include all trip_items
- Order items by day and time

**Add Trip Item:**
- Insert into trip_items
- Set trip_id, day, details

**Update Trip Item:**
- Update by item ID
- Change time, order, etc.

---

## 13. RESPONSIVE BEHAVIOR

**Desktop:**
- Full 3-panel layout
- Day timeline visible
- Trip Tools always visible

**Tablet:**
- 2-panel layout
- Day picker in left
- Trip Tools as drawer

**Mobile:**
- Full-screen trip view
- Swipe between days
- Bottom sheet for Trip Tools

---

## 14. SUCCESS CRITERIA

- Create trips with wizard
- View day-by-day itinerary
- Add items from listings
- Reorder items within days
- Trip Tools panel functional
- AI actions ready (Phase 2)
- Responsive design complete

---

## 15. TESTING & VERIFICATION

### Unit Tests:
- [ ] Trip creation wizard works
- [ ] Trip list displays correctly
- [ ] Trip detail loads all data
- [ ] Items can be added to days
- [ ] Items can be reordered
- [ ] Trip Tools panel renders

### Integration Tests:
- [ ] Trip saves to database
- [ ] Items save to database
- [ ] Items load with trip
- [ ] RLS policies enforce access
- [ ] Realtime updates work (if enabled)

### Manual Verification:
1. Create new trip - trip appears in list
2. Add items to days - items appear
3. Reorder items - order persists
4. View trip detail - all data displays
5. Test Trip Tools - panel works
6. Test on mobile - responsive works
7. Test drag-and-drop - works smoothly

### Production Readiness:
- [ ] Loading states during operations
- [ ] Empty state for new trips
- [ ] Error handling for failed saves
- [ ] Performance acceptable
- [ ] Data persists after refresh

---

## 16. REAL-WORLD EXAMPLE

**User Journey: Plan 5-Day Trip**

1. User creates trip "Medellín Jan 14-19"
2. Wizard collects dates, destination, budget
3. Trip created, empty itinerary shown
4. User adds saved events to Day 1
5. User adds restaurants to Day 2
6. User adds activities to Day 3
7. AI optimizes route (Phase 2)
8. User reviews and books items (Phase 2)

**Time:** 20 minutes (vs 4 hours manual planning)

---

## 17. OPTIMIZATION NOTES

**Avoid Over-Engineering:**
- Basic trip creation first
- Simple day-by-day view
- Basic item management
- Don't need complex drag-drop yet
- AI features come in Phase 2

**Production Focus:**
- Fast trip creation
- Easy item management
- Clear day organization
- Good mobile experience

---

**Previous Prompt:** 08-explore-discover.md  
**Next Prompt:** 10-bookings-module.md
