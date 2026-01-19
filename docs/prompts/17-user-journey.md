# 17 - User Journeys

## I Love Medellín - Complete User Flows

---

## 1. CONTEXT & ROLE

Documenting all user journeys for I Love Medellín, mapping the complete paths users take to accomplish their goals across all platform features.

Act as an expert **user experience designer** specializing in **user journey mapping for AI-powered platforms**.

---

## 2. PURPOSE

Define clear user journeys that guide development priorities, ensure smooth user experience, and identify AI integration points.

---

## 3. USER PERSONAS

### Digital Nomad (Sarah)
- Duration: 3 months
- Goals: Furnished apartment, coworking, networking events
- Tech: Very comfortable
- Budget: Moderate

### Expat (Marcus)
- Duration: 1+ years
- Goals: Long-term housing, car, local integration
- Tech: Comfortable
- Budget: Flexible

### Local (Ana)
- Duration: Permanent
- Goals: Restaurants, events, weekend activities
- Tech: Native Spanish
- Budget: Varies

### Traveler (James)
- Duration: 2 weeks
- Goals: Best experiences, no hassle booking
- Tech: Mobile-first
- Budget: Higher for vacation

---

## 4. JOURNEY 1: NEW USER ONBOARDING

**Goal:** New user creates account and sets preferences

**Actors:** All user types

**Journey:**

1. **Discovery**
   - User finds ILM through search or referral
   - Lands on marketing page
   - Sees value proposition

2. **Sign Up**
   - Clicks "Get Started"
   - Enters email and password
   - Receives verification (if enabled)
   - Account created

3. **User Type Selection**
   - Sees 4 user type cards
   - Digital Nomad / Expat / Local / Traveler
   - Selects one
   - Description explains personalization

4. **Stay Duration**
   - Based on user type
   - Options relevant to selection
   - Sets expectations

5. **Neighborhood Preferences**
   - Multi-select neighborhoods
   - Shows map for context
   - Recommends based on type

6. **Budget Setup**
   - Range slider or presets
   - Currency selection
   - By month or day (type-specific)

7. **Interests**
   - Multi-select interest tags
   - Food, nightlife, culture, outdoors, etc.
   - Minimum 3 required

8. **Complete**
   - Summary of selections
   - "Ready to explore!" message
   - Redirect to dashboard

**AI Integration Points:**
- Preference Learning Agent captures all selections
- Dashboard Curator Agent uses for personalization

**Success Metric:** 80%+ complete onboarding

---

## 5. JOURNEY 2: FIND & BOOK APARTMENT

**Goal:** Find and book a furnished apartment for 3 months

**Actors:** Digital Nomad (primarily)

**Journey:**

1. **Navigate to Apartments**
   - From dashboard or sidebar
   - Left panel: Apartments highlighted
   - Main panel: List view

2. **Apply Filters**
   - Select neighborhood (El Poblado)
   - Set budget range
   - Filter: Furnished, WiFi > 50mbps
   - Results update

3. **Browse Listings**
   - Scan apartment cards
   - See prices, images, key features
   - Save favorites with heart icon

4. **View Detail Page**
   - Click on interesting listing
   - See full gallery
   - Read description
   - Check amenities

5. **Review AI Insights (Phase 2)**
   - Right panel: Neighborhood Score
   - Right panel: Value Analysis
   - Right panel: Contract Review hints
   - Commute to coworking times

6. **Save or Book**
   - Add to Saved for comparison
   - Or proceed to booking

7. **Booking Wizard**
   - Select move-in date
   - Choose duration (3 months)
   - Review pricing
   - Accept contract terms (AI highlights key points)
   - Enter payment (placeholder Phase 1)

8. **Confirmation**
   - Booking confirmed
   - Confirmation code received
   - Add to trip option
   - Email confirmation sent

**AI Integration Points:**
- Apartment Search Agent powers search
- Neighborhood Score Agent provides insights
- Contract Review Agent highlights terms
- Apartment Booking Agent handles booking

**Success Metric:** Booking completion rate

---

## 6. JOURNEY 3: PLAN A TRIP

**Goal:** Create a 5-day itinerary for Medellín

**Actors:** Traveler (primarily)

**Journey:**

1. **Start Trip Creation**
   - Click "Plan a Trip" from dashboard
   - Or navigate to Trips > New

2. **Trip Wizard - Destination**
   - Default: Medellín
   - Confirm or change

3. **Trip Wizard - Dates**
   - Select start date
   - Select end date (5 days)
   - Calendar picker

4. **Trip Wizard - Interests**
   - Select activity preferences
   - Culture, food, adventure, nightlife
   - Multi-select

5. **Trip Wizard - Budget**
   - Total trip budget
   - Or per-day estimate

6. **AI Generation (Phase 2)**
   - "Let AI plan your trip?"
   - If yes: Itinerary Curator Agent generates
   - If no: Blank itinerary created
   - Preview shown

7. **Review Day-by-Day**
   - Day 1, Day 2, etc. tabs
   - Activities with times
   - Drag to reorder (future)
   - Edit or remove items

8. **Use Trip Tools**
   - Right panel: Trip Tools
   - AI Actions: Optimize Route, Check Conflicts
   - Add from Ideas suggestions

9. **Add Items from Browse**
   - Navigate to Restaurants or Events
   - Click "Add to Trip"
   - Select trip and day
   - Item added

10. **Book Activities**
    - Click "Book" on bookable items
    - Use booking wizard
    - Status updates to "Booked"

11. **Finalize Trip**
    - Review complete itinerary
    - Check all bookings confirmed
    - Share or export (future)

**AI Integration Points:**
- Trip Planner Agent creates itinerary
- Route Optimizer Agent optimizes routes
- Gap Detector Agent finds empty slots
- Weather Check Agent adds weather awareness

**Success Metric:** Trips with 3+ items booked

---

## 7. JOURNEY 4: BOOK A RESTAURANT

**Goal:** Make a dinner reservation for tonight

**Actors:** All user types

**Journey:**

1. **Navigate to Restaurants**
   - From dashboard or sidebar
   - Or from Explore tab

2. **Filter by Tonight**
   - Set date to today
   - Set time to evening
   - Filter: Accepts reservations

3. **Apply Preferences**
   - Cuisine type filter
   - Price level filter
   - Neighborhood filter
   - Dietary filters if needed

4. **Browse Results**
   - See matching restaurants
   - Fit Score badges (Phase 2)
   - "Open tonight" indicators

5. **View Restaurant Detail**
   - Click on selection
   - See full details
   - View menu link
   - Check Fit Score breakdown (Phase 2)

6. **Reserve Table**
   - Click "Reserve Table"
   - Select time slot
   - Enter party size
   - Add special requests

7. **Confirmation**
   - Reservation confirmed
   - Add to calendar
   - Reminder set
   - Add to active trip (if applicable)

**AI Integration Points:**
- Restaurant Search Agent powers discovery
- Fit Score Agent matches preferences
- Table Booking Agent handles reservation
- Message Draft Agent creates special requests

**Success Metric:** Reservation completion rate

---

## 8. JOURNEY 5: AI CHAT INTERACTION

**Goal:** Ask AI for recommendations and act on them

**Actors:** All user types

**Journey:**

1. **Open Chat**
   - Click Chat in sidebar
   - Or click floating widget

2. **See Welcome**
   - "Where to today?" greeting
   - 4 tabs visible
   - Quick suggestions

3. **Type Query**
   - "Find me a rooftop bar with good views"
   - Or select from suggestions

4. **AI Responds**
   - Explore Agent processes query
   - Returns bar recommendations
   - Shows in chat with cards

5. **View on Map (Explore Tab)**
   - Right panel shows map
   - Bars pinned
   - Click for quick details

6. **Get More Info**
   - "Tell me more about the first one"
   - AI provides details
   - Includes hours, reviews, vibe

7. **Take Action**
   - "Save it" → Added to favorites
   - "Add to trip" → Added to Day 3
   - "Navigate" → Opens in maps

8. **Continue Conversation**
   - "What about dinner near there?"
   - AI remembers context
   - Suggests restaurants nearby

**AI Integration Points:**
- Router Agent classifies intent
- Explore Agent (Gemini + Search + Maps) finds results
- Smart Recall Agent remembers context
- Add-to-Trip Agent previews additions

**Success Metric:** Actions taken from chat

---

## 9. JOURNEY 6: MANAGE BOOKINGS

**Goal:** View, modify, or cancel existing bookings

**Actors:** All user types

**Journey:**

1. **Navigate to Bookings**
   - From dashboard or sidebar
   - Left panel: Bookings highlighted

2. **View All Bookings**
   - List of booking cards
   - Tabs: Upcoming, Past, Cancelled
   - Status badges

3. **Select Booking**
   - Click on booking card
   - See full details
   - Confirmation code visible

4. **Modify Booking (if allowed)**
   - Click "Modify"
   - Change dates or party size
   - Review changes
   - Confirm update

5. **Cancel Booking**
   - Click "Cancel"
   - See cancellation policy
   - Confirm cancellation
   - Status updates

6. **Add to Calendar**
   - Click calendar icon
   - Export to Google/Apple Calendar
   - Reminder set

**AI Integration Points:**
- Booking Agent can handle modifications via chat
- Conflict Checker Agent warns of overlaps

**Success Metric:** Low cancellation rate

---

## 10. JOURNEY 7: DISCOVER EVENTS

**Goal:** Find events happening this weekend

**Actors:** Local, Traveler

**Journey:**

1. **Navigate to Events**
   - From dashboard or Explore
   - Left panel: Events highlighted

2. **Set Date Range**
   - Select "This Weekend"
   - Or pick specific dates

3. **Filter by Category**
   - Music, Tech, Social, Culture, etc.
   - Multi-select allowed

4. **Browse Events**
   - See event cards
   - Date/time, venue, price
   - Conflict indicators (if have overlaps)

5. **View Event Detail**
   - Click event card
   - Full description
   - Venue with map
   - Ticket info

6. **Check Conflicts (Phase 2)**
   - Right panel shows calendar
   - Conflict warning if overlap
   - Suggestion to adjust

7. **Get Tickets**
   - Click "Get Tickets"
   - External link or internal purchase
   - Confirmation

8. **Add to Trip**
   - Option to add to existing trip
   - Preview where it fits
   - Nearby suggestions

**AI Integration Points:**
- Event Curator Agent discovers events
- Event Fit Agent matches interests
- Schedule Conflict Agent checks calendar
- Nearby Suggestions Agent adds dinner/drinks

**Success Metric:** Events added to trips

---

## 11. JOURNEY MAP SUMMARY

| Journey | Phase | Key AI Agents |
|---------|-------|---------------|
| Onboarding | 1 | Preference Learning |
| Apartment Booking | 1-2 | Apartment Search, Neighborhood Score, Contract Review, Booking |
| Trip Planning | 2-3 | Trip Planner, Route Optimizer, Gap Detector |
| Restaurant Reservation | 2-3 | Restaurant Search, Fit Score, Table Booking |
| AI Chat | 3 | Router, Concierge, Explore, Booking |
| Manage Bookings | 2 | Booking Agent via chat |
| Event Discovery | 2-3 | Event Curator, Conflict Agent, Nearby Suggestions |

---

## 12. SUCCESS CRITERIA

- All journeys documented and validated
- Happy path works smoothly
- AI integration points identified
- Metrics defined for each journey
- Error states handled
- Mobile journeys equivalent

---

## 13. TESTING & VERIFICATION

### Unit Tests:
- [ ] Each journey can be completed
- [ ] Steps flow correctly
- [ ] Navigation works
- [ ] Forms validate
- [ ] Error states display

### Integration Tests:
- [ ] End-to-end journey works
- [ ] Data persists between steps
- [ ] AI integration points work (Phase 2)
- [ ] Metrics are tracked
- [ ] Error recovery works

### Manual Verification:
1. Complete onboarding journey - all steps work
2. Complete apartment booking - booking created
3. Complete trip planning - trip created
4. Complete restaurant booking - reservation made
5. Test error cases - errors handled gracefully
6. Test on mobile - journeys work on mobile
7. Measure completion time - meets targets

### Production Readiness:
- [ ] All journeys functional
- [ ] Error handling comprehensive
- [ ] Mobile equivalent
- [ ] Performance acceptable
- [ ] Metrics tracked

---

## 14. REAL-WORLD EXAMPLE

**Journey: New User to First Booking**

1. User signs up (2 min)
2. Completes onboarding (3 min)
3. Browses apartments (10 min)
4. Saves favorites (2 min)
5. Books apartment (5 min)
6. Receives confirmation (instant)

**Total Time:** 22 minutes  
**Traditional Method:** 4-6 hours  
**Time Saved:** 95%

---

## 15. OPTIMIZATION NOTES

**Avoid Over-Engineering:**
- Focus on happy paths first
- Basic error handling
- Don't need complex journey analytics yet
- Don't need advanced personalization yet

**Production Focus:**
- Smooth user experience
- Clear steps
- Fast completion
- Good error handling

---

**Previous Prompt:** 16-3-panel-system.md  
**Next Prompt:** 18-wizards.md
