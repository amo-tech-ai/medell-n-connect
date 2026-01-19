# 14 - AI Agents Complete Reference

## I Love Medellín - AI Agent Inventory

---

## 1. CONTEXT & ROLE

Comprehensive reference for all AI agents in I Love Medellín, documenting their models, screens, purposes, interactions, and best practices.

Act as an expert **AI agent systems architect** specializing in **multi-agent orchestration with hybrid Claude and Gemini**.

---

## 2. PURPOSE

Provide a complete inventory of all AI agents, their responsibilities, and how they interact to create intelligent experiences across the platform.

---

## 3. AGENT ARCHITECTURE OVERVIEW

### Hybrid Model Strategy

| Provider | Models | Best For |
|----------|--------|----------|
| **Anthropic (Claude)** | sonnet-4-5, opus-4-5 | Routing, autonomous workflows, complex reasoning |
| **Google (Gemini)** | flash, pro, pro-image | Speed, search, maps, structured output, images |

### Agent Categories

| Category | Agent Count | Primary Models |
|----------|-------------|----------------|
| **Routing** | 1 | claude-sonnet |
| **Chat** | 5 | claude-sonnet, claude-opus, gemini-pro |
| **Trip** | 7 | claude-opus, gemini-pro, gemini-flash |
| **Discovery** | 4 | gemini-pro + Search + Maps |
| **Event** | 5 | gemini-pro, claude-opus |
| **Restaurant** | 6 | gemini-pro, claude-opus |
| **Housing** | 6 | gemini-pro, claude-opus |
| **Car** | 4 | gemini-pro, claude-opus |
| **Utility** | 5 | gemini-pro, gemini-flash |
| **Total** | **43+ Agents** | |

---

## 4. ROUTING AGENTS

### Router Agent
- **Model:** claude-sonnet-4-5
- **Screen:** All
- **Purpose:** Intent classification and routing
- **Input:** User message, context
- **Output:** Intent, target agent, confidence
- **Logic:** Classifies intent into categories, determines which agent should handle

**Intent Categories:**
- housing_search, car_rental, restaurant_discovery
- restaurant_booking, event_discovery, event_tickets
- trip_planning, trip_modification, booking_management
- general_question, local_knowledge

---

## 5. CHAT AGENTS

### Concierge Agent
- **Model:** claude-sonnet-4-5 + gemini-3-pro
- **Screen:** Chat - Concierge Tab
- **Purpose:** General lifestyle Q&A
- **Input:** User question, user profile
- **Output:** Helpful response, suggestions
- **Logic:** Answers general Medellín questions, lifestyle advice

### Trip Planner Agent
- **Model:** claude-opus-4-5
- **Screen:** Chat - Trips Tab
- **Purpose:** Autonomous itinerary creation
- **Input:** Trip requirements, preferences
- **Output:** Complete itinerary
- **Logic:** Generates multi-day plans, coordinates activities

### Explore Agent
- **Model:** gemini-3-pro + Google Search + Maps
- **Screen:** Chat - Explore Tab
- **Purpose:** Discovery and search
- **Input:** Search query, location
- **Output:** Ranked results with map pins
- **Logic:** Searches across all domains with location context

### Booking Agent
- **Model:** claude-opus-4-5
- **Screen:** Chat - Bookings Tab
- **Purpose:** Reservation management
- **Input:** Booking request
- **Output:** Confirmation or options
- **Logic:** Checks availability, processes reservations

### Availability Checker Agent
- **Model:** gemini-3-flash-preview
- **Screen:** Chat - Bookings Tab
- **Purpose:** Real-time availability
- **Input:** Resource ID, dates
- **Output:** Availability status
- **Logic:** Quick database check for availability

---

## 6. TRIP AGENTS

### Itinerary Curator Agent
- **Model:** claude-opus-4-5
- **Screen:** Trip Detail
- **Purpose:** Full itinerary generation
- **Input:** Trip parameters, interests
- **Output:** Day-by-day plan
- **Logic:** Creates complete itinerary from scratch

### Route Optimizer Agent
- **Model:** gemini-3-pro + Maps
- **Screen:** Trip Detail
- **Purpose:** Minimize travel between activities
- **Input:** List of activities with locations
- **Output:** Optimized order
- **Logic:** Uses Maps API to find best routes

### Gap Detector Agent
- **Model:** gemini-3-flash-preview
- **Screen:** Trip Detail
- **Purpose:** Find empty time slots
- **Input:** Current itinerary
- **Output:** List of gaps with suggestions
- **Logic:** Scans for unfilled time periods

### Conflict Checker Agent
- **Model:** gemini-3-flash-preview
- **Screen:** Trip Detail
- **Purpose:** Detect schedule overlaps
- **Input:** All scheduled items
- **Output:** Conflicts identified
- **Logic:** Compares times for overlaps

### Budget Optimizer Agent
- **Model:** gemini-3-pro-preview
- **Screen:** Trip Detail
- **Purpose:** Cost-saving suggestions
- **Input:** Current itinerary with costs
- **Output:** Cheaper alternatives
- **Logic:** Finds similar activities at lower cost

### Auto-Schedule Agent
- **Model:** claude-opus-4-5
- **Screen:** Trip Detail
- **Purpose:** Add optimal times to activities
- **Input:** Unscheduled activities
- **Output:** Suggested times
- **Logic:** Considers travel time, opening hours, preferences

### Weather Check Agent
- **Model:** gemini-3-pro + Search
- **Screen:** Trip Detail
- **Purpose:** Weather-aware suggestions
- **Input:** Trip dates, activities
- **Output:** Weather forecast, indoor alternatives
- **Logic:** Fetches weather, suggests changes

### Trip Overview Agent
- **Model:** gemini-3-flash-preview
- **Screen:** Trips List
- **Purpose:** Quick trip status and alerts
- **Input:** All trips
- **Output:** Status summary, urgencies
- **Logic:** Scans for issues, upcoming items

---

## 7. DISCOVERY AGENTS

### Multi-Domain Search Agent
- **Model:** gemini-3-pro + Search + Maps
- **Screen:** Explore
- **Purpose:** Search across all categories
- **Input:** Search query
- **Output:** Unified results
- **Logic:** Queries all resource types

### Location Context Agent
- **Model:** gemini-3-pro + Maps
- **Screen:** Explore
- **Purpose:** Distance, walkability, area info
- **Input:** Location
- **Output:** Context about area
- **Logic:** Uses Maps for location intelligence

### Preference Matcher Agent
- **Model:** gemini-3-pro + RAG
- **Screen:** All List Views
- **Purpose:** Rank by user preferences
- **Input:** Results, user preferences
- **Output:** Ranked results
- **Logic:** Applies preference scoring

### Category Filter Agent
- **Model:** gemini-3-flash-preview
- **Screen:** Explore
- **Purpose:** Quick filtering and categorization
- **Input:** Filter selections
- **Output:** Filtered results
- **Logic:** Fast filtering logic

---

## 8. EVENT AGENTS

### Event Curator Agent
- **Model:** gemini-3-pro + Search
- **Screen:** Events List
- **Purpose:** Event discovery and curation
- **Input:** Date range, interests
- **Output:** Curated event list
- **Logic:** Finds relevant events

### Event Fit Agent
- **Model:** gemini-3-flash-preview
- **Screen:** Events List
- **Purpose:** Match events to user interests
- **Input:** Event, user preferences
- **Output:** Fit score
- **Logic:** Calculates match percentage

### Schedule Conflict Agent
- **Model:** gemini-3-flash-preview
- **Screen:** Events
- **Purpose:** Check against existing bookings
- **Input:** Event time, user calendar
- **Output:** Conflict status
- **Logic:** Compares with existing commitments

### Event Analyzer Agent
- **Model:** gemini-3-pro-preview
- **Screen:** Event Detail
- **Purpose:** Extract event details
- **Input:** Event data
- **Output:** Structured details
- **Logic:** Parses and summarizes

### Nearby Suggestions Agent
- **Model:** gemini-3-pro + Maps
- **Screen:** Event Detail
- **Purpose:** Dinner before, drinks after
- **Input:** Event location, time
- **Output:** Related suggestions
- **Logic:** Finds nearby restaurants/bars

### Ticket Booking Agent
- **Model:** claude-opus-4-5
- **Screen:** Event Tickets
- **Purpose:** Handle ticket purchase
- **Input:** Ticket request
- **Output:** Purchase confirmation
- **Logic:** Processes ticket acquisition

### Add-to-Trip Agent
- **Model:** claude-opus-4-5
- **Screen:** Event Detail
- **Purpose:** Preview adding to trip
- **Input:** Event, trip
- **Output:** Preview of addition
- **Logic:** Shows how event fits in trip

### Group Coordinator Agent
- **Model:** claude-opus-4-5
- **Screen:** Event Detail
- **Purpose:** Coordinate group attendance
- **Input:** Event, group members
- **Output:** Coordination plan
- **Logic:** Manages group bookings

---

## 9. RESTAURANT AGENTS

### Restaurant Search Agent
- **Model:** gemini-3-pro + Search + Maps
- **Screen:** Restaurants List
- **Purpose:** Discovery with filters
- **Input:** Search criteria
- **Output:** Matching restaurants
- **Logic:** Searches with location context

### Cuisine Recommender Agent
- **Model:** gemini-3-pro + RAG
- **Screen:** Restaurants List
- **Purpose:** Based on preferences
- **Input:** User preferences
- **Output:** Recommendations
- **Logic:** Matches cuisine preferences

### Availability Checker Agent
- **Model:** gemini-3-flash-preview
- **Screen:** Restaurants
- **Purpose:** Real-time table status
- **Input:** Restaurant, date/time
- **Output:** Availability
- **Logic:** Checks reservation system

### Dietary Filter Agent
- **Model:** gemini-3-flash-preview
- **Screen:** Restaurants List
- **Purpose:** Vegan, GF, etc. filtering
- **Input:** Dietary restrictions
- **Output:** Filtered list
- **Logic:** Matches restaurant options

### Menu Analyzer Agent
- **Model:** gemini-3-pro-preview
- **Screen:** Restaurant Detail
- **Purpose:** Extract menu items, prices
- **Input:** Menu URL or data
- **Output:** Structured menu
- **Logic:** Parses menu information

### Fit Score Agent
- **Model:** gemini-3-flash-preview
- **Screen:** Restaurant Detail
- **Purpose:** Match to user preferences
- **Input:** Restaurant, preferences
- **Output:** Fit score breakdown
- **Logic:** Scores dietary, vibe, price

### Table Booking Agent
- **Model:** claude-opus-4-5
- **Screen:** Restaurant Booking
- **Purpose:** Handle reservation workflow
- **Input:** Reservation request
- **Output:** Confirmation
- **Logic:** Books table autonomously

### Message Draft Agent
- **Model:** claude-sonnet-4-5
- **Screen:** Restaurant Detail
- **Purpose:** Draft special request messages
- **Input:** User needs
- **Output:** Drafted message
- **Logic:** Creates polite requests

---

## 10. HOUSING AGENTS

### Apartment Search Agent
- **Model:** gemini-3-pro + Search
- **Screen:** Apartments List
- **Purpose:** Discovery with filters
- **Input:** Search criteria
- **Output:** Matching apartments
- **Logic:** Searches listings

### Neighborhood Advisor Agent
- **Model:** gemini-3-pro + Maps
- **Screen:** Apartments List
- **Purpose:** Safety, walkability, amenities
- **Input:** Neighborhood name
- **Output:** Area analysis
- **Logic:** Provides neighborhood context

### Value Analyzer Agent
- **Model:** gemini-3-pro-preview
- **Screen:** Apartment Detail
- **Purpose:** Compare to market prices
- **Input:** Apartment price
- **Output:** Market comparison
- **Logic:** Analyzes fair pricing

### Listing Analyzer Agent
- **Model:** gemini-3-pro-preview
- **Screen:** Apartment Detail
- **Purpose:** Extract all listing details
- **Input:** Listing data
- **Output:** Structured summary
- **Logic:** Parses and highlights

### Neighborhood Score Agent
- **Model:** gemini-3-pro + Maps
- **Screen:** Apartment Detail
- **Purpose:** Safety, walkability, transit
- **Input:** Address
- **Output:** Score breakdown
- **Logic:** Calculates area scores

### Contract Review Agent
- **Model:** claude-opus-4-5
- **Screen:** Apartment Detail
- **Purpose:** Analyze rental contract terms
- **Input:** Contract text
- **Output:** Key terms, concerns
- **Logic:** Legal analysis

### Commute Simulator Agent
- **Model:** gemini-3-pro + Maps
- **Screen:** Apartment Detail
- **Purpose:** Time to key locations
- **Input:** Apartment, destinations
- **Output:** Commute times
- **Logic:** Calculates travel times

### WiFi Speed Agent
- **Model:** gemini-3-flash-preview
- **Screen:** Apartment Detail
- **Purpose:** Verify internet quality
- **Input:** WiFi claims
- **Output:** Verification status
- **Logic:** Checks speed claims

### Apartment Booking Agent
- **Model:** claude-opus-4-5
- **Screen:** Apartment Booking
- **Purpose:** Handle booking workflow
- **Input:** Booking request
- **Output:** Confirmation
- **Logic:** Processes rental booking

---

## 11. CAR AGENTS

### Car Search Agent
- **Model:** gemini-3-pro + Search
- **Screen:** Cars List
- **Purpose:** Discovery with filters
- **Input:** Search criteria
- **Output:** Matching vehicles
- **Logic:** Searches rentals

### Price Comparison Agent
- **Model:** gemini-3-flash-preview
- **Screen:** Cars List, Detail
- **Purpose:** Compare rental options
- **Input:** Multiple cars
- **Output:** Comparison table
- **Logic:** Compares prices and value

### Insurance Advisor Agent
- **Model:** gemini-3-pro-preview
- **Screen:** Car Detail
- **Purpose:** Explain coverage options
- **Input:** Insurance options
- **Output:** Plain-language explanation
- **Logic:** Simplifies insurance

### Vehicle Analyzer Agent
- **Model:** gemini-3-pro-preview
- **Screen:** Car Detail
- **Purpose:** Extract all vehicle details
- **Input:** Vehicle data
- **Output:** Structured summary
- **Logic:** Highlights key specs

### Insurance Explainer Agent
- **Model:** gemini-3-pro-preview
- **Screen:** Car Booking
- **Purpose:** Break down coverage
- **Input:** Insurance tiers
- **Output:** Comparison with recommendations
- **Logic:** Helps user decide

### Pickup Optimizer Agent
- **Model:** gemini-3-pro + Maps
- **Screen:** Car Detail
- **Purpose:** Best pickup location
- **Input:** User location, pickup options
- **Output:** Recommended location
- **Logic:** Optimizes convenience

### Car Booking Agent
- **Model:** claude-opus-4-5
- **Screen:** Car Booking
- **Purpose:** Handle rental workflow
- **Input:** Rental request
- **Output:** Confirmation
- **Logic:** Processes car rental

---

## 12. UTILITY AGENTS

### Dashboard Curator Agent
- **Model:** gemini-3-pro-preview
- **Screen:** Home Dashboard
- **Purpose:** Curates personalized homepage
- **Input:** User preferences, history
- **Output:** Homepage content
- **Logic:** Personalizes experience

### Recommendation Engine
- **Model:** gemini-3-pro + RAG
- **Screen:** Right Panel
- **Purpose:** Quick suggestions
- **Input:** Context, preferences
- **Output:** Recommendations
- **Logic:** Context-aware suggestions

### Upcoming Alerts Agent
- **Model:** gemini-3-flash-preview
- **Screen:** Home, Notifications
- **Purpose:** Surfaces time-sensitive items
- **Input:** User calendar, bookings
- **Output:** Alerts
- **Logic:** Finds urgent items

### Smart Recall Agent
- **Model:** gemini-3-pro + RAG
- **Screen:** Saved
- **Purpose:** Context-aware recall
- **Input:** User query, saves
- **Output:** Relevant saved items
- **Logic:** Retrieves based on context

### Collection Organizer Agent
- **Model:** gemini-3-flash-preview
- **Screen:** Saved
- **Purpose:** Suggest organization
- **Input:** Saved items
- **Output:** Organization suggestions
- **Logic:** Groups related saves

### Preference Learning Agent
- **Model:** gemini-3-pro + RAG
- **Screen:** Profile, All
- **Purpose:** Learn from behavior
- **Input:** User actions
- **Output:** Updated preferences
- **Logic:** Improves over time

### Profile Optimizer Agent
- **Model:** gemini-3-flash-preview
- **Screen:** Profile
- **Purpose:** Suggest profile improvements
- **Input:** Profile completeness
- **Output:** Suggestions
- **Logic:** Encourages complete profile

---

## 13. AGENT INTERACTION PATTERNS

### Sequential Pattern
- Router → Primary Agent → Response

### Delegation Pattern
- Primary Agent → Sub-agent → Primary Agent → Response

### Parallel Pattern
- Multiple agents queried → Results combined → Response

### Multi-Step Pattern
- Agent A → User confirms → Agent B → User confirms → Complete

---

## 14. BEST PRACTICES

**Model Selection:**
- Fast, cheap: gemini-3-flash
- Quality: gemini-3-pro
- Autonomous: claude-opus
- Routing: claude-sonnet

**Error Handling:**
- Always have fallback
- Return helpful error messages
- Log failures for debugging

**Context Management:**
- Pass relevant context only
- Don't exceed token limits
- Summarize long histories

**User Experience:**
- Show loading states
- Stream responses when possible
- Explain AI reasoning

---

## 15. SUCCESS CRITERIA

- All agents defined and configured
- Routing correctly dispatches
- Each agent performs its purpose
- Agents interact seamlessly
- Performance meets requirements
- Errors handled gracefully
- Costs monitored and controlled

---

## 16. TESTING & VERIFICATION

### Unit Tests:
- [ ] Each agent can be instantiated
- [ ] Agents process requests correctly
- [ ] Routing selects correct agent
- [ ] Agent responses are structured
- [ ] Error handling works

### Integration Tests:
- [ ] Agents call AI APIs correctly
- [ ] Agents use correct models
- [ ] Agent coordination works
- [ ] Results are logged
- [ ] Costs are tracked

### Manual Verification:
1. Test Router Agent - classifies intents correctly
2. Test each agent - returns appropriate responses
3. Test agent coordination - multiple agents work together
4. Test error cases - agents handle failures
5. Check logs - all calls logged
6. Check costs - usage tracked
7. Test performance - responses are fast

### Production Readiness:
- [ ] All agents functional
- [ ] Routing accurate (> 95%)
- [ ] Error handling comprehensive
- [ ] Performance acceptable
- [ ] Costs monitored
- [ ] Logging complete

---

## 17. REAL-WORLD EXAMPLE

**Scenario: Multi-Agent Coordination**

1. User: "Plan a trip and book a restaurant"
2. Router Agent classifies: trip_planning + restaurant_booking
3. Trip Planner Agent creates itinerary
4. Restaurant Search Agent finds restaurants
5. Results combined and presented
6. User approves
7. Booking Agent processes restaurant booking
8. Trip updated with restaurant

**Result:** Complex multi-step task completed autonomously

---

## 18. OPTIMIZATION NOTES

**Avoid Over-Engineering:**
- Simple agent structure first
- Basic routing logic
- Standard error handling
- Don't need complex agent framework yet
- Don't need advanced coordination yet

**Production Focus:**
- Reliable agent execution
- Accurate routing
- Good error handling
- Fast responses

---

## 19. AGENT CAPABILITY LIMITS (CRITICAL)

### Permission Registry

| Agent Category | Can Read | Can Suggest | Can Mutate | Max Cost |
|----------------|----------|-------------|------------|----------|
| **Router** | user context | intent only | none | $0.01 |
| **Chat Agents** | user data, listings | responses | messages only | $0.05 |
| **Booking Agents** | user + listings | booking options | bookings (with approval) | $0.10 |
| **Trip Agents** | user + trips | itinerary | trip_items (with approval) | $0.10 |
| **Discovery** | listings, maps | results | none | $0.03 |
| **Utility** | user preferences | suggestions | preferences (with approval) | $0.02 |

### Agents Can NEVER:
- ❌ Delete user data
- ❌ Access other users' data
- ❌ Make payments without explicit user approval
- ❌ Chain more than 3 sub-agents
- ❌ Override RLS policies
- ❌ Execute actions without preview

### Execution Limits

| Limit | Value |
|-------|-------|
| Max sub-agent depth | 3 |
| Max tokens per request | 4,000 |
| Max cost per request | $0.10 |
| Timeout per agent | 15 seconds |
| Max retries | 2 |

---

## 20. AI FAILURE HANDLING

### Failure Categories

| Failure Type | Detection | Recovery |
|--------------|-----------|----------|
| **Timeout** | >15 seconds | Cancel, show retry option |
| **Model Error** | API error response | Retry once, then fallback |
| **Invalid Output** | Schema validation fail | Retry with stricter prompt |
| **Hallucination** | Confidence < 0.7 | Flag for human review |
| **Rate Limit** | 429 response | Queue and retry with backoff |

### Fallback Strategy

```
1. Primary model fails → Retry once
2. Retry fails → Try fallback model
3. Fallback fails → Return static content
4. All fails → Show manual options
```

**Fallback Model Mapping:**
| Primary | Fallback |
|---------|----------|
| claude-opus | claude-sonnet |
| claude-sonnet | gemini-pro |
| gemini-pro | gemini-flash |
| gemini-flash | static/cached |

### User-Facing Error Messages

| Error Type | User Message |
|------------|--------------|
| Timeout | "Taking longer than expected. Try again?" |
| Model Error | "I'm having trouble. Let me try another way." |
| All Failed | "AI is unavailable. Here are manual options." |

### Never Do:
- ❌ Leave user with blank screen
- ❌ Show technical error messages
- ❌ Fail silently
- ❌ Auto-retry more than 2 times

---

## 21. GEMINI 3 FEATURES USAGE

| Feature | Used By | Implementation |
|---------|---------|----------------|
| **Structured Output** | All Gemini agents | JSON Schema mode |
| **Function Calling** | Search, Maps agents | Tool registration |
| **Google Search Grounding** | Discovery, Events | Enable grounding |
| **Google Maps Grounding** | Location agents | Maps API integration |
| **Gemini Thinking** | Trip Planner, Analyzer | Extended reasoning |

### Implementation Pattern

**Search Grounding:**
- Enable for: Explore, Events, Restaurants discovery
- Context: User location, query intent

**Maps Grounding:**
- Enable for: Neighborhood analysis, Route optimization
- Context: Coordinates, POI queries

---

## 22. CLAUDE SDK PATTERNS

### Agent Definition Pattern
- Define agent with clear purpose
- Register tools for database access
- Add pre/post hooks for logging
- Set approval requirements

### Tool Registration
- Database read tools: profiles, listings, bookings
- Database write tools: messages, trip_items, bookings (with approval)
- External tools: Maps API, email

### Hooks Usage
- **Pre-hook:** Log request, check permissions
- **Post-hook:** Log response, track costs

### Subagent Delegation
- Max depth: 3 levels
- Parent must summarize child results
- Cost aggregated to parent

---

**Previous Prompt:** 13-edge-functions.md  
**Next Prompt:** 15-home-dashboard.md
