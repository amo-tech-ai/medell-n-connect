# 06 - Events Module

## I Love Medellín - Events

---

## 1. CONTEXT & ROLE

Building the events module for I Love Medellín, enabling users to discover and book events, concerts, meetups, and activities in Medellín with AI-powered curation and conflict detection.

Act as an expert **event platform developer** specializing in **event discovery and ticketing systems**.

---

## 2. PURPOSE

Enable all user types to discover events happening in Medellín, from concerts and festivals to tech meetups and social gatherings, with integrated ticket booking and calendar management.

---

## 3. GOALS

- Build events list page with date and category filters
- Create event detail page with ticket options
- Enable calendar integration
- Implement event categories for different user types
- Prepare for AI agents (Phase 2+)

---

## 4. SCREENS

### Events List (`/events`)

**3-Panel Layout:**

**Left Panel - Context:**
- Navigation with Events highlighted
- Category filters
- Calendar picker
- Saved events

**Main Panel - Work:**
- Date range selector
- Category chips
- Event cards grid
- Sort by date, popularity
- Map view toggle

**Right Panel - Intelligence:**
- Calendar with event dots
- "Events for you" suggestions
- Upcoming reminders
- Friends attending (future)

**Event Card Content:**
- Hero image
- Event title
- Date and time
- Venue name
- Category badge
- Price range
- Distance indicator
- Save button

**Filters:**
- Date range
- Category (music, tech, social, sports, culture, food)
- Price (free, paid, range)
- Time of day (morning, afternoon, evening, night)
- Language (English-friendly, Spanish)
- Neighborhood

---

### Event Detail (`/events/:id`)

**3-Panel Layout:**

**Left Panel - Context:**
- Navigation
- Back to listings
- Similar events list

**Main Panel - Work:**
- Hero image/gallery
- Event title
- Date, time, duration
- Venue with address
- Event description
- Ticket options and prices
- Organizer information
- Share button
- Get tickets button

**Right Panel - Intelligence:**
- Venue map and directions
- Conflict Check (Phase 2 AI)
- Nearby Suggestions (Phase 2 AI)
- Add to Trip preview
- Similar events
- Save to favorites

---

## 5. DATA MODEL

**events Table:**
- id (uuid, primary key)
- title (text)
- description (text)
- category (enum: music, tech, social, sports, culture, food, nightlife)
- venue_name (text)
- venue_address (text)
- latitude, longitude (numeric)
- event_date (date)
- start_time (time)
- end_time (time)
- ticket_price_min (integer)
- ticket_price_max (integer)
- ticket_url (text)
- is_free (boolean)
- language (text)
- images (text array)
- tags (text array)
- organizer_name (text)
- organizer_url (text)
- created_at, updated_at

---

## 6. AI AGENTS (Phase 2+)

**Event Curator Agent**
- Model: gemini-3-pro + Search
- Screen: Events List
- Purpose: Event discovery and curation

**Event Fit Agent**
- Model: gemini-3-flash-preview
- Screen: Events List
- Purpose: Match events to user interests

**Schedule Conflict Agent**
- Model: gemini-3-flash-preview
- Screen: Events List, Detail
- Purpose: Check against existing bookings

**Group Coordinator Agent**
- Model: claude-opus-4-5
- Screen: Event Detail
- Purpose: Coordinate group attendance

**Event Analyzer Agent**
- Model: gemini-3-pro-preview
- Screen: Event Detail
- Purpose: Extract details, venue info

**Nearby Suggestions Agent**
- Model: gemini-3-pro + Maps
- Screen: Event Detail
- Purpose: Dinner before, drinks after

**Ticket Booking Agent**
- Model: claude-opus-4-5
- Screen: Ticket Purchase
- Purpose: Handle ticket purchase workflow

**Add-to-Trip Agent**
- Model: claude-opus-4-5
- Screen: Event Detail
- Purpose: Preview adding to trip

---

## 7. RIGHT PANEL AI ACTIONS (Phase 2+)

**Events List:**
- "Events for you" personalized picks
- Calendar overlay with booked events
- Conflict warnings on hover
- Category recommendations

**Event Detail:**
- Venue map with transport options
- "Before the event" dinner suggestions
- "After the event" bar suggestions
- Schedule conflict alert
- Add to trip preview
- Similar events this week

---

## 8. USER JOURNEY

1. User navigates to Events
2. User selects date range
3. User filters by category (tech, music, etc.)
4. User browses event cards
5. User clicks on event
6. User reads full details
7. User checks for conflicts (Phase 2)
8. User gets tickets or saves
9. Event added to calendar

---

## 9. FEATURES

**Discovery:**
- Calendar-based browsing
- Category filtering
- Map view for venue locations
- Search by keyword

**Event Categories:**
- Music & Concerts
- Tech & Networking
- Social & Meetups
- Sports & Fitness
- Culture & Arts
- Food & Drink
- Nightlife

**Ticketing:**
- Direct ticket links
- Price display
- Free event badges
- Sold out indicators

**Calendar:**
- Add to calendar button
- View on personal calendar
- Conflict detection (Phase 2)

---

## 10. 3-PANEL LOGIC

**Left Panel Updates:**
- Highlights "Events" in navigation
- Calendar picker widget
- Category filter list

**Main Panel Focus:**
- Browsing by date
- Filtering by category
- Event details

**Right Panel Intelligence:**
- Calendar summary
- Conflict warnings
- Nearby suggestions
- Trip integration

---

## 11. WORKFLOWS

**Event Discovery Workflow:**
1. Load events from database
2. Filter by date range
3. Apply category filters
4. Sort by date or popularity
5. Display with venue info

**Event Detail Workflow:**
1. Load event by ID
2. Check for schedule conflicts (Phase 2)
3. Get nearby suggestions (Phase 2)
4. Display full information
5. Show ticket options

**Ticket Purchase Workflow:**
1. User clicks get tickets
2. Redirect to external ticket URL
3. Or internal booking (future)
4. Confirmation tracking
5. Add to calendar

---

## 12. SUPABASE QUERIES

**List Events:**
- Select from events
- Filter by date range
- Filter by category
- Order by date

**Get Event Detail:**
- Select single event by ID
- Include all fields

**Upcoming Events:**
- Filter where date >= today
- Order by date ascending
- Limit for performance

---

## 13. RESPONSIVE BEHAVIOR

**Desktop:**
- Full 3-panel layout
- Calendar sidebar visible
- 3 event cards per row

**Tablet:**
- 2-panel layout
- Calendar as modal
- 2 cards per row

**Mobile:**
- Full-screen list
- Swipe calendar
- Single card width
- Bottom sheet details

---

## 14. SUCCESS CRITERIA

- Events list loads with date filter
- Category filtering works
- Detail page shows all info
- Ticket links functional
- Calendar view works
- Map shows venues
- Save to favorites works

---

## 15. TESTING & VERIFICATION

### Unit Tests:
- [ ] Event cards render correctly
- [ ] Date filters update results
- [ ] Category filters work
- [ ] Calendar view displays events
- [ ] Save/unsave button toggles
- [ ] Detail page loads all data

### Integration Tests:
- [ ] Supabase query returns events
- [ ] Date filters apply correctly
- [ ] Category filters work
- [ ] Save to favorites persists
- [ ] RLS policies enforce access
- [ ] Map pins display correctly

### Manual Verification:
1. Load events page - data displays
2. Select date range - results update
3. Filter by category - correct events show
4. Click event card - detail page loads
5. Test ticket link - opens correctly
6. Save event - appears in saved
7. Test calendar view - events show on dates
8. Test on mobile - responsive works

### Production Readiness:
- [ ] Loading states during data fetch
- [ ] Empty state when no events
- [ ] Error handling for failed queries
- [ ] Performance acceptable (< 2s load)
- [ ] Images load correctly
- [ ] Calendar navigation works

---

## 16. REAL-WORLD EXAMPLE

**User Journey: Find Weekend Events**

1. User opens Events page
2. Selects "This Weekend" date filter
3. Filters: Music, Nightlife
4. Sees 8 events
5. Clicks concert event
6. Views details, venue, ticket prices
7. Buys tickets (Phase 2)
8. Event added to calendar
9. Receives confirmation

**Time:** 3 minutes (vs 1 hour searching Facebook/websites)

---

## 17. OPTIMIZATION NOTES

**Avoid Over-Engineering:**
- Basic list and detail pages first
- Simple date/category filters
- Calendar can be basic (don't need full calendar system yet)
- Ticket links can be external (don't need full ticketing yet)

**Production Focus:**
- Fast page loads
- Clear event information
- Easy filtering
- Good mobile experience

---

**Previous Prompt:** 05-listings-restaurants.md  
**Next Prompt:** 07-saved-favorites.md
