# 15 - Home Dashboard

## I Love Medellín - Main Dashboard

---

## 1. CONTEXT & ROLE

Building the home dashboard for I Love Medellín, providing personalized overview, recommendations, upcoming bookings, and quick access to all platform features.

Act as an expert **dashboard developer** specializing in **personalized homepages with AI-driven content curation**.

---

## 2. PURPOSE

Create the central hub users see after login, displaying personalized recommendations, upcoming activities, and quick access to all platform sections.

---

## 3. GOALS

- Build personalized home dashboard
- Display user-specific recommendations
- Show upcoming bookings and events
- Provide quick access to all sections
- Integrate AI curation (Phase 2+)

---

## 4. SCREEN LAYOUT

### Home Dashboard (`/dashboard`)

**3-Panel Layout:**

**Left Panel - Context:**
- Navigation with Home highlighted
- User greeting
- Quick stats
- Weather widget

**Main Panel - Work:**
- Welcome message with user name
- Today's highlights section
- Recommended for you carousel
- Upcoming bookings list
- Recent activity
- Quick actions grid

**Right Panel - Intelligence:**
- Today's recommendations summary
- Upcoming booking reminders
- Weather-aware suggestions
- "You might like" carousel
- Quick create buttons

---

## 5. MAIN PANEL SECTIONS

### Welcome Header
- Personalized greeting ("Good morning, {name}")
- Current date
- Weather summary
- User type badge

### Today's Highlights
- Events happening today
- Restaurant reservations
- Trip activities
- Time-sensitive items

### Recommended For You
- Carousel of suggestions
- Based on user preferences
- Mix of all resource types
- AI-curated (Phase 2)

### Upcoming Bookings
- Next 7 days
- Status indicators
- Quick actions (view, cancel)
- Add to calendar

### Recent Activity
- Last saved items
- Recent searches
- Viewed listings
- Quick access to return

### Quick Actions Grid
| Action | Destination |
|--------|-------------|
| Find Apartment | /apartments |
| Rent a Car | /cars |
| Discover Food | /restaurants |
| Find Events | /events |
| Plan a Trip | /trips/new |
| Chat with AI | /chat |

---

## 6. RIGHT PANEL CONTENT

### Today's AI Picks
- Top 3 recommendations for today
- Explanation of why suggested
- Quick save or explore

### Reminders
- Upcoming booking reminders
- Trip starts soon
- Reservation tomorrow

### Weather Widget
- Current weather in Medellín
- Today's forecast
- Affects outdoor recommendations

### You Might Like
- Based on browse history
- Similar to saved items
- New in your areas

### Quick Create
- New Trip button
- New Chat button
- Save note button

---

## 7. AI AGENTS (Phase 2+)

### Dashboard Curator Agent
- **Model:** gemini-3-pro-preview
- **Purpose:** Curates personalized homepage content
- **Input:** User preferences, history, time of day
- **Output:** Ordered content blocks

### Recommendation Engine
- **Model:** gemini-3-pro + RAG
- **Purpose:** Suggests based on user preferences
- **Input:** User profile, saved items
- **Output:** Ranked recommendations

### Upcoming Alerts Agent
- **Model:** gemini-3-flash-preview
- **Purpose:** Surfaces time-sensitive items
- **Input:** User calendar, bookings
- **Output:** Priority alerts

---

## 8. RIGHT PANEL AI ACTIONS

**Dashboard:**
- "Pick for you today" with explanation
- "Don't miss" time-sensitive items
- "Based on your interests" section
- "Weather says..." outdoor/indoor toggle

---

## 9. USER JOURNEY

1. User logs in
2. Lands on personalized dashboard
3. Sees greeting and today's info
4. Reviews recommendations
5. Checks upcoming bookings
6. Uses quick actions for discovery
7. Or starts conversation with AI

---

## 10. FEATURES

**Personalization:**
- Greeting by name
- User type-specific content
- Preference-based suggestions
- Time-aware recommendations

**Organization:**
- Clear section hierarchy
- Scannable content
- Quick access to all areas
- Progressive disclosure

**Interactivity:**
- Save from dashboard
- Navigate to details
- Quick create actions
- Refresh recommendations

---

## 11. 3-PANEL LOGIC

**Left Panel Updates:**
- Always shows navigation
- Highlights "Home"
- Shows user stats

**Main Panel Focus:**
- Primary content area
- Scrollable sections
- All discovery

**Right Panel Intelligence:**
- AI recommendations
- Reminders and alerts
- Quick actions
- Contextual help

---

## 12. WORKFLOWS

**Dashboard Load Workflow:**
1. Fetch user profile
2. Load user preferences
3. Fetch upcoming bookings (next 7 days)
4. Fetch recent activity
5. Get recommendations (AI in Phase 2)
6. Render personalized dashboard

**Recommendation Workflow (Phase 2):**
1. Dashboard Curator Agent triggered
2. Analyzes user preferences
3. Considers time of day
4. Checks weather
5. Generates ranked recommendations
6. Displays with explanations

---

## 13. DATA REQUIREMENTS

**Data Fetched:**
- profiles (current user)
- user_preferences
- bookings (upcoming)
- saved_places (recent)
- events (today/upcoming)
- recommendations (generated)

---

## 14. RESPONSIVE BEHAVIOR

**Desktop:**
- Full 3-panel layout
- All sections visible
- Side-by-side content

**Tablet:**
- 2-panel layout
- Stacked sections
- Right panel as drawer

**Mobile:**
- Full-screen dashboard
- Scrolling sections
- Bottom navigation
- Swipe for right panel

---

## 15. DESIGN NOTES

**Visual Hierarchy:**
- Welcome prominent
- Today first
- Upcoming second
- Discovery third

**Cards:**
- Consistent card design
- Clear CTAs
- Visual images
- Quick info

**Colors:**
- Use user type color accent
- Status indicators
- Weather-appropriate imagery

---

## 16. SUCCESS CRITERIA

- Dashboard loads with personalized content
- Greeting shows user name
- Recommendations display
- Upcoming bookings listed
- Quick actions functional
- Responsive across devices
- AI integration ready (Phase 2)

---

## 17. TESTING & VERIFICATION

### Unit Tests:
- [ ] Dashboard renders correctly
- [ ] Personalized greeting displays
- [ ] Sections load data
- [ ] Quick actions work
- [ ] Navigation works

### Integration Tests:
- [ ] User data loads correctly
- [ ] Bookings fetch correctly
- [ ] Recommendations generate (Phase 2)
- [ ] Real-time updates work (if enabled)
- [ ] RLS policies enforce access

### Manual Verification:
1. Log in - dashboard loads
2. Verify greeting - shows user name
3. Check bookings - upcoming listed
4. Check recommendations - displayed
5. Test quick actions - all work
6. Test on mobile - responsive works
7. Test performance - loads quickly

### Production Readiness:
- [ ] Loading states during fetch
- [ ] Empty states when no data
- [ ] Error handling for failures
- [ ] Performance acceptable (< 2s)
- [ ] Personalization works

---

## 18. REAL-WORLD EXAMPLE

**User Journey: Morning Dashboard Check**

1. User logs in
2. Sees personalized greeting "Good morning, Sarah"
3. Views "Today" section - 2 events, 1 restaurant reservation
4. Views "Upcoming" - 3 bookings this week
5. Sees AI recommendations - 3 personalized picks
6. Clicks recommendation - navigates to detail
7. Uses quick action - creates new trip

**Time:** 30 seconds (vs 5 minutes checking multiple apps)

---

## 19. OPTIMIZATION NOTES

**Avoid Over-Engineering:**
- Simple dashboard first
- Basic personalization
- Don't need complex analytics yet
- Don't need advanced recommendations yet
- AI features come in Phase 2

**Production Focus:**
- Fast load time
- Clear information
- Easy navigation
- Good mobile experience

---

**Previous Prompt:** 14-ai-agents.md  
**Next Prompt:** 16-3-panel-system.md
