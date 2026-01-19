# 11 - AI Chatbot System

## I Love Medellín - 4-Tab Chat

---

## 1. CONTEXT & ROLE

Building the AI chatbot system for I Love Medellín, featuring a 4-tab architecture that provides specialized AI assistance across Concierge, Trips, Explore, and Bookings contexts.

Act as an expert **conversational AI system developer** specializing in **multi-context chat interfaces with autonomous agents**.

---

## 2. PURPOSE

Provide an intelligent conversational interface where users can get help, plan trips, discover places, and make bookings through natural language, with context-aware AI agents operating across 4 specialized tabs.

---

## 3. GOALS

- Build 4-tab chat interface
- Implement AI agent routing
- Create conversation management
- Enable contextual right panel
- Build floating AI widget
- Integrate with all platform features

---

## 4. 4-TAB ARCHITECTURE

| Tab | Icon | Purpose | AI Agents |
|-----|------|---------|-----------|
| **Concierge** | 🏠 | General lifestyle Q&A | Router, Concierge Agent |
| **Trips** | ✈️ | Trip planning chat | Trip Planner Agent |
| **Explore** | 🔍 | Discovery with map | Explore Agent |
| **Bookings** | 📅 | Reservation management | Booking Agent |

---

## 5. SCREENS

### Chat Page (`/chat`)

**3-Panel Layout:**

**Left Panel - Context:**
- Conversation list
- New chat button
- Recent conversations
- Archived chats
- App download promo
- User profile

**Main Panel - Work:**
- 4-Tab navigation at top
- Chat message area
- Message input at bottom
- Quick action chips
- "Where to today?" welcome

**Right Panel - Intelligence:**
- Tab-specific context
- Map for Explore tab
- Trip summary for Trips tab
- Booking list for Bookings tab
- Suggestions for Concierge

---

### Tab 1: Concierge (Default)

**Purpose:** General AI assistant for any lifestyle question

**Example Queries:**
- "What's a good neighborhood for digital nomads?"
- "How much should I budget for a month in Medellín?"
- "Is it safe to walk around at night?"
- "Help me understand Colombian tipping culture"

**AI Agents:**
| Agent | Model | Purpose |
|-------|-------|---------|
| Router Agent | claude-sonnet-4-5 | Intent classification |
| Concierge Agent | claude-sonnet-4-5 + gemini-3-pro | General Q&A |

**Right Panel:**
- AI suggestions based on conversation
- Quick action buttons
- Related recommendations
- Save/Share options

---

### Tab 2: Trips

**Purpose:** AI assistance for trip planning and itinerary management

**Example Queries:**
- "Plan a 5-day itinerary for Medellín"
- "Add Comuna 13 tour to Day 2"
- "Optimize my route for tomorrow"
- "What's missing from my trip?"

**AI Agents:**
| Agent | Model | Purpose |
|-------|-------|---------|
| Trip Planner Agent | claude-opus-4-5 | Autonomous itinerary creation |
| Route Optimizer Agent | gemini-3-pro + Maps | Route optimization |
| Gap Detector Agent | gemini-3-flash | Find empty slots |

**Right Panel:**
- Active trip summary
- Day-by-day timeline
- Gap detection alerts
- Conflict warnings
- Quick add buttons

---

### Tab 3: Explore

**Purpose:** Discover restaurants, events, activities, and stays

**Example Queries:**
- "Find me a rooftop bar with good views"
- "What events are happening this weekend?"
- "Best coworking cafes in Laureles"
- "Romantic dinner spots near El Poblado"

**AI Agents:**
| Agent | Model | Purpose |
|-------|-------|---------|
| Explore Agent | gemini-3-pro + Search + Maps | Discovery |
| Location Context Agent | gemini-3-pro + Maps | Distance info |

**Right Panel:**
- Interactive map with pins
- Category filters
- Distance sorting
- "For you in [Neighborhood]" suggestions

**Quick Filters:**
| Filter | Options |
|--------|---------|
| Budget | $, $$, $$$, $$$$ |
| Distance | Walking, 5min, 15min, 30min |
| Type | Food, Drinks, Activities, Stays |
| Vibe | Romantic, Lively, Quiet, Family |

---

### Tab 4: Bookings

**Purpose:** Manage and create bookings via conversation

**Example Queries:**
- "Book a table at Carmen for tomorrow at 8pm"
- "Show me my upcoming reservations"
- "Cancel my car rental for next week"
- "Extend my apartment booking by 2 weeks"

**AI Agents:**
| Agent | Model | Purpose |
|-------|-------|---------|
| Booking Agent | claude-opus-4-5 | Reservation management |
| Availability Checker | gemini-3-flash | Real-time availability |

**Right Panel:**
- Active bookings summary
- Upcoming reservations calendar
- Quick modification options
- Confirmation history

---

## 6. AI CONCIERGE WIDGET

Floating widget on all dashboard pages providing quick chat access.

**Widget Structure:**
- Header with title and close button
- 4-tab icons for quick switching
- Current context suggestions
- Quick filter chips
- Message input field

**Widget Behavior:**
- Appears on all dashboard screens
- Context-aware based on current page
- Collapsible to icon
- Expands to full chat

---

## 7. DATA MODEL

**conversations Table:**
- id (uuid, primary key)
- user_id (uuid, references profiles)
- title (text, auto-generated)
- tab (enum: concierge, trips, explore, bookings)
- status (enum: active, archived)
- context_data (jsonb, tab-specific context)
- last_message_at (timestamp)
- created_at, updated_at

**messages Table:**
- id (uuid, primary key)
- conversation_id (uuid, references conversations)
- role (enum: user, assistant, system)
- content (text)
- agent_name (text, which agent responded)
- model_used (text)
- tokens_used (integer)
- metadata (jsonb, tool calls, etc.)
- created_at

---

## 8. AI MODEL ROUTING

| Tab | Query Type | Model | Fallback |
|-----|------------|-------|----------|
| All | Intent Classification | claude-sonnet-4-5 | gemini-3-flash |
| Concierge | General Questions | claude-sonnet-4-5 | — |
| Concierge | Local Knowledge | gemini-3-pro + RAG | — |
| Trips | Itinerary Generation | claude-opus-4-5 | — |
| Trips | Route Optimization | gemini-3-pro + Maps | — |
| Explore | Discovery Search | gemini-3-pro + Search | — |
| Explore | Map Queries | gemini-3-pro + Maps | — |
| Bookings | Reservations | claude-opus-4-5 | — |

---

## 9. USER JOURNEY

1. User opens Chat from navigation
2. User sees "Where to today?" welcome
3. User types question or selects tab
4. Router Agent classifies intent
5. Appropriate agent responds
6. Right panel updates with context
7. User takes action or continues conversation
8. Conversation saved for history

---

## 10. FEATURES

**Conversation Management:**
- Start new conversations
- View conversation history
- Archive old conversations
- Search conversations

**Tab-Specific Context:**
- Each tab maintains its state
- Context passed to AI
- Right panel adapts per tab

**Natural Language:**
- Understand complex queries
- Handle follow-up questions
- Remember conversation context
- Multi-turn reasoning

**Actions from Chat:**
- Book directly from conversation
- Add to trip from chat
- Save places mentioned
- Navigate to listings

**Quick Actions:**
- Suggested queries
- Quick filter chips
- One-tap common actions
- Recent searches

---

## 11. 3-PANEL LOGIC

**Left Panel Updates:**
- Highlights "Chat" in navigation
- Shows conversation history
- New chat button prominent

**Main Panel Focus:**
- 4-tab navigation
- Chat messages
- User input
- Human-first conversation

**Right Panel Intelligence:**
- Tab-specific context
- Map for Explore
- Trip tools for Trips
- Bookings for Bookings
- Suggestions for Concierge

---

## 12. WORKFLOWS

**Chat Message Workflow:**
1. User types message
2. Message sent to edge function
3. Router Agent classifies intent
4. Routed to appropriate agent
5. Agent processes and responds
6. Response streamed to UI
7. Message saved to database
8. Right panel updated

**Tab Switch Workflow:**
1. User clicks tab icon
2. Tab UI updates
3. Context loaded for tab
4. Right panel updates
5. Conversation continues in new context

**Booking from Chat Workflow:**
1. User requests booking in Bookings tab
2. Booking Agent receives request
3. Agent checks availability
4. Agent presents options
5. User confirms
6. Agent creates booking
7. Confirmation displayed
8. Booking added to list

---

## 13. EDGE FUNCTIONS

**ai-chat**
- Receives user message
- Routes to appropriate agent
- Manages conversation state
- Returns AI response

**ai-router**
- Classifies user intent
- Determines which agent
- Passes context

**ai-trip-planner**
- Handles Trips tab queries
- Generates itineraries
- Optimizes routes

**ai-booking-chat**
- Handles Bookings tab
- Checks availability
- Processes reservations

---

## 14. CLAUDE SDK INTEGRATION

**Router Agent:**
- Model: claude-sonnet-4-5
- Fast intent classification
- Routes to specialized agents

**Booking Agent:**
- Model: claude-opus-4-5
- Autonomous booking workflow
- Multi-step reservation handling
- Error recovery built-in

**Trip Planner Agent:**
- Model: claude-opus-4-5
- Complex itinerary generation
- Multi-turn planning
- Tool usage for optimization

---

## 15. GEMINI INTEGRATION

**Explore Agent:**
- Model: gemini-3-pro-preview
- Google Search grounding for discovery
- Google Maps grounding for location
- Structured output for listings

**Concierge Knowledge:**
- Model: gemini-3-pro + RAG
- Local knowledge retrieval
- Real-time information
- Cultural context

---

## 16. RESPONSIVE BEHAVIOR

**Desktop:**
- Full 3-panel layout
- Always-visible tabs
- Side-by-side chat and context

**Tablet:**
- 2-panel layout
- Swipe for right panel
- Tabs in main header

**Mobile:**
- Full-screen chat
- Bottom tab bar
- Swipe-up context panel
- Floating widget minimized

---

## 17. SUCCESS CRITERIA

- 4 tabs functional and distinct
- Router correctly classifies intents
- Each tab has working agent
- Right panel updates per tab
- Conversation history saved
- Widget accessible globally
- Responsive across devices
- AI responses contextual and helpful

---

## 18. TESTING & VERIFICATION

### Unit Tests:
- [ ] 4 tabs render and switch correctly
- [ ] Chat input works
- [ ] Messages display correctly
- [ ] Right panel updates per tab
- [ ] Conversation list works
- [ ] Widget opens/closes

### Integration Tests:
- [ ] Router classifies intents correctly
- [ ] Agents respond appropriately
- [ ] Conversations save to database
- [ ] Messages persist
- [ ] RLS policies enforce access
- [ ] Real-time updates work (if enabled)

### Manual Verification:
1. Open chat - 4 tabs visible
2. Switch tabs - context changes
3. Send message in Concierge - response received
4. Send message in Trips - trip context used
5. Send message in Explore - search results show
6. Send message in Bookings - booking context used
7. Check conversation history - messages saved
8. Test widget - opens/closes correctly
9. Test on mobile - responsive works

### Production Readiness:
- [ ] Loading states during AI responses
- [ ] Error handling for failed requests
- [ ] Conversation persistence works
- [ ] Performance acceptable (< 3s response)
- [ ] No memory leaks
- [ ] Widget doesn't interfere with pages

---

## 19. REAL-WORLD EXAMPLE

**User Journey: AI Chat Assistance**

1. User opens chat widget
2. Selects "Trips" tab
3. Asks "Plan a 5-day Medellín trip"
4. Trip Planner Agent generates itinerary
5. User asks "Add Comuna 13 tour to Day 2"
6. Agent adds activity
7. User asks "Optimize route"
8. Route Optimizer Agent reorders activities
9. User approves changes
10. Trip updated

**Time:** 2 minutes (vs 2 hours manual planning)

---

## 20. OPTIMIZATION NOTES

**Avoid Over-Engineering:**
- Basic 4-tab chat first
- Simple message display
- Basic agent routing
- Don't need complex conversation management yet
- Don't need advanced context tracking yet

**Production Focus:**
- Fast responses
- Clear tab separation
- Reliable message delivery
- Good mobile experience

---

**Previous Prompt:** 10-bookings-module.md  
**Next Prompt:** 12-supabase-schema.md
