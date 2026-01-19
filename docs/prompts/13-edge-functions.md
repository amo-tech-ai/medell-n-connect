# 13 - Edge Functions & AI Integration

## I Love Medellín - Supabase Edge Functions

---

## 1. CONTEXT & ROLE

Building the Supabase edge functions for I Love Medellín, implementing AI agent integrations with Claude SDK and Gemini API for chat, search, bookings, and automation.

**✅ Status:** 5 core functions created, ready for deployment.

Act as an expert **serverless functions developer** specializing in **AI agent orchestration with Claude and Gemini**.

---

## 2. PURPOSE

Create the edge function layer that connects the frontend to AI capabilities, handling routing, agent execution, and response generation.

---

## 3. GOALS

- Implement AI routing edge function
- Build chat handling function
- Create search functions
- Develop booking agent functions
- Set up notification functions
- Follow best practices for AI integration

---

## 4. EDGE FUNCTIONS OVERVIEW

### Phase 2 Functions — ✅ CREATED

| Function | Purpose | AI Models | Status |
|----------|---------|-----------|--------|
| ai-router | Intent classification | claude-sonnet-4-5 | ✅ Ready |
| ai-suggestions | Quick recommendations | gemini-3-flash | ✅ Ready |

### Phase 3 Functions — ✅ CREATED

| Function | Purpose | AI Models | Status |
|----------|---------|-----------|--------|
| ai-chat | Main chat handler | claude-sonnet, claude-opus | ✅ Ready |
| ai-search | Natural language search | gemini-3-pro + Search | ✅ Ready |
| ai-trip-planner | Itinerary generation | claude-opus-4-5 | ✅ Ready |
| ai-booking-chat | Booking via chat | claude-opus-4-5 | ⚬ Pending |
| send-confirmation | Email confirmations | — | ⚬ Pending |
| booking-reminders | Scheduled reminders | — | ⚬ Pending |

### Shared Utilities — ✅ CREATED

| File | Purpose |
|------|---------|
| shared/types.ts | TypeScript type definitions |
| shared/utils.ts | Common utilities, auth, logging |

---

## 5. AI-ROUTER FUNCTION

**Purpose:** Classify user intent and route to appropriate agent

**Input:**
- User message
- Current context (page, tab)
- User preferences

**Output:**
- Intent classification
- Target agent name
- Confidence score
- Context for next step

**Model:** claude-sonnet-4-5

**Logic:**
1. Receive user message
2. Include context in prompt
3. Classify into intent categories
4. Determine target agent
5. Return routing decision

**Intent Categories:**
- housing_search
- car_rental
- restaurant_discovery
- restaurant_booking
- event_discovery
- event_tickets
- trip_planning
- trip_modification
- booking_management
- general_question
- local_knowledge

---

## 6. AI-SUGGESTIONS FUNCTION

**Purpose:** Provide quick contextual suggestions

**Input:**
- Current page/context
- User preferences
- Recent activity

**Output:**
- List of suggestions
- Explanations for each
- Action type (navigate, add, book)

**Model:** gemini-3-flash-preview

**Logic:**
1. Analyze current context
2. Consider user preferences
3. Generate relevant suggestions
4. Return with explanations

**Suggestion Types:**
- Similar listings
- Next actions
- Time-based recommendations
- Preference-based picks

---

## 7. AI-CHAT FUNCTION

**Purpose:** Main chat conversation handler

**Input:**
- User message
- Conversation ID
- Tab context (concierge, trips, explore, bookings)
- Conversation history

**Output:**
- AI response text
- Any actions taken
- Updated context
- Metadata (tokens, model used)

**Models by Tab:**
| Tab | Primary Model |
|-----|---------------|
| Concierge | claude-sonnet-4-5 |
| Trips | claude-opus-4-5 |
| Explore | gemini-3-pro + Search |
| Bookings | claude-opus-4-5 |

**Logic:**
1. Receive message and context
2. Route based on tab
3. Call appropriate agent
4. Process response
5. Save to messages table
6. Return response

---

## 8. AI-SEARCH FUNCTION

**Purpose:** Natural language search across all domains

**Input:**
- Search query
- Filters (optional)
- Location context
- User preferences

**Output:**
- Unified search results
- Relevance scores
- Explanations
- Source types

**Model:** gemini-3-pro-preview + Google Search + Maps

**Features:**
- Google Search grounding for real-time data
- Google Maps grounding for location
- Structured output for listings
- Multi-domain results

**Logic:**
1. Parse natural language query
2. Apply Google Search grounding
3. Apply Maps grounding if location-relevant
4. Query local database
5. Combine and rank results
6. Return unified format

---

## 9. AI-TRIP-PLANNER FUNCTION

**Purpose:** Generate and optimize trip itineraries

**Input:**
- Trip parameters (destination, dates, interests)
- Existing items (if modifying)
- User preferences
- Budget constraints

**Output:**
- Day-by-day itinerary
- Activity suggestions
- Time allocations
- Distance/route info

**Model:** claude-opus-4-5

**Capabilities:**
- Full itinerary generation
- Route optimization via Gemini + Maps
- Gap detection
- Conflict checking
- Budget optimization

**Logic:**
1. Receive trip requirements
2. Generate initial itinerary
3. Optimize routes using Maps
4. Check for conflicts
5. Estimate costs
6. Return complete plan

---

## 10. AI-BOOKING-CHAT FUNCTION

**Purpose:** Handle booking requests via conversation

**Input:**
- Booking request
- Resource type and ID
- User info
- Dates/times

**Output:**
- Availability status
- Booking confirmation
- Or options if unavailable

**Model:** claude-opus-4-5

**Capabilities:**
- Check availability
- Process booking creation
- Handle modifications
- Cancel bookings

**Logic:**
1. Parse booking request
2. Check availability in database
3. Confirm with user
4. Create booking record
5. Generate confirmation
6. Return success

---

## 11. SEND-CONFIRMATION FUNCTION

**Purpose:** Send booking confirmation emails

**Input:**
- Booking ID
- Recipient email
- Booking details

**Output:**
- Email sent status
- Calendar invite attached

**Logic:**
1. Receive booking ID
2. Fetch booking details
3. Generate email content
4. Send via email service
5. Log result

---

## 12. BOOKING-REMINDERS FUNCTION

**Purpose:** Scheduled function for booking reminders

**Trigger:** Scheduled (cron job)

**Logic:**
1. Find bookings starting in 24 hours
2. Filter those without reminder sent
3. Send reminder notifications
4. Mark as reminded

---

## 13. CLAUDE SDK INTEGRATION

**Best Practices:**

**Model Selection:**
- Use claude-sonnet-4-5 for routing and quick responses
- Use claude-opus-4-5 for complex autonomous tasks
- Never use opus for simple classifications

**Agent Patterns:**
- Define clear tool schemas
- Implement PreToolUse hooks for validation
- Use PostToolUse for logging
- Handle errors gracefully

**Session Management:**
- Maintain conversation context
- Store agent state if multi-step
- Clean up completed sessions

**Error Recovery:**
- Built-in retry logic
- Fallback to simpler model if needed
- Always return user-friendly errors

---

## 14. GEMINI INTEGRATION

**Best Practices:**

**Model Selection:**
- Use gemini-3-flash-preview for speed
- Use gemini-3-pro-preview for quality
- Use gemini-3-pro-image-preview only for image generation

**Google Grounding:**
- Enable Google Search for real-time info
- Enable Google Maps for location queries
- Combine grounding with local data

**Structured Output:**
- Use JSON Schema for consistent responses
- Validate output structure
- Handle parsing errors

**Thinking Mode:**
- Use for complex reasoning tasks
- Disable for simple queries
- Monitor token usage

---

## 15. SECURITY

**API Key Management:**
- Store keys in Supabase secrets
- Never expose in frontend
- Rotate regularly

**Request Validation:**
- Verify authentication
- Validate input data
- Rate limit per user

**Response Handling:**
- Sanitize AI outputs
- Don't execute untrusted content
- Log all AI interactions

---

## 16. MONITORING & LOGGING

**Track:**
- All AI function calls
- Token usage per call
- Response times
- Error rates
- User feedback

**Store in ai_runs table:**
- Agent name
- Model used
- Input/output data
- Duration
- Cost estimate
- Errors if any

---

## 17. COST MANAGEMENT

**Strategies:**
- Use cheaper models when possible
- Cache common responses
- Batch similar requests
- Set token limits
- Monitor daily costs

**Cost Estimates:**
- claude-sonnet: Lower cost per token
- claude-opus: Higher cost, use sparingly
- gemini-flash: Very low cost
- gemini-pro: Moderate cost

---

## 18. WORKFLOWS

**Request Flow:**
1. Frontend sends request to edge function
2. Edge function validates auth
3. Processes with appropriate AI model
4. Saves results to database
5. Returns response to frontend
6. Logs execution details

**Multi-Agent Flow:**
1. Router determines intent
2. Primary agent receives task
3. Agent may call sub-agents
4. Results aggregated
5. Response formatted
6. Returned to user

---

## 19. SUCCESS CRITERIA

- All edge functions deployable
- Claude SDK integration working
- Gemini API integration working
- Routing correctly classifies intents
- Chat maintains context
- Search returns relevant results
- Bookings process correctly
- Logging captures all calls
- Errors handled gracefully

---

## 20. TESTING & VERIFICATION

### Unit Tests:
- [ ] Functions can be deployed
- [ ] Functions handle requests
- [ ] Authentication works
- [ ] Error handling works
- [ ] Logging works

### Integration Tests:
- [ ] Functions call AI APIs correctly
- [ ] Responses are formatted correctly
- [ ] Database operations work
- [ ] Real-time updates work
- [ ] Rate limiting works (if implemented)

### Manual Verification:
1. Deploy function - deployment succeeds
2. Call function from frontend - response received
3. Test authentication - unauthorized blocked
4. Test error cases - errors handled
5. Check logs - calls logged
6. Test performance - response time acceptable
7. Test with real AI - responses are intelligent

### Production Readiness:
- [ ] All functions deployed
- [ ] API keys configured
- [ ] Error handling comprehensive
- [ ] Logging working
- [ ] Performance acceptable (< 3s)
- [ ] Rate limiting implemented

---

## 21. REAL-WORLD EXAMPLE

**Scenario: User Asks "Find events tonight"**

1. Frontend calls `ai-search` edge function
2. Function authenticates user
3. Routes to Explore Agent
4. Agent uses Gemini + Google Search
5. Finds real events happening tonight
6. Returns structured results
7. Logs to `ai_runs` table
8. Frontend displays results

**Result:** Real-time event discovery in 2 seconds

---

## 22. OPTIMIZATION NOTES

**Avoid Over-Engineering:**
- Simple function structure first
- Basic error handling
- Standard logging
- Don't need complex orchestration yet
- Don't need advanced caching yet

**Production Focus:**
- Reliable function execution
- Good error handling
- Comprehensive logging
- Fast responses

---

## 23. OPERATIONAL LIMITS (CRITICAL)

### Timeout Configuration

| Function | Timeout | Fallback Behavior |
|----------|---------|-------------------|
| ai-router | 5 seconds | Return default routing |
| ai-suggestions | 10 seconds | Return cached suggestions |
| ai-chat | 25 seconds | Return partial + "still thinking" |
| ai-search | 15 seconds | Return database results only |
| ai-trip-planner | 30 seconds | Return partial plan |
| ai-booking-chat | 20 seconds | Return manual booking link |

### Rate Limiting

| Scope | Limit | Window |
|-------|-------|--------|
| Per user | 60 requests | per minute |
| Per function | 100 requests | per minute |
| Per API key | 1,000 requests | per hour |
| AI-heavy functions | 20 requests | per minute per user |

### Cost Ceilings

| Function | Max Cost Per Request | Daily Cap Per User |
|----------|---------------------|-------------------|
| ai-router | $0.01 | $1.00 |
| ai-suggestions | $0.02 | $2.00 |
| ai-chat | $0.05 | $5.00 |
| ai-search | $0.05 | $5.00 |
| ai-trip-planner | $0.10 | $10.00 |

### Error Responses

| HTTP Code | Meaning | User Message |
|-----------|---------|--------------|
| 429 | Rate limit | "Too many requests. Try again in a moment." |
| 504 | Timeout | "Request took too long. Try a simpler query." |
| 503 | AI unavailable | "AI is busy. Here are manual options." |
| 500 | Server error | "Something went wrong. Please try again." |

### Enforcement

- ✅ Return graceful error, never 500 for user issues
- ✅ Include retry-after header for rate limits
- ✅ Log all limit violations
- ✅ Alert on repeated violations

---

## 24. SCHEMA VALIDATION

### Input Validation

- All inputs must be validated before AI processing
- Reject invalid JSON immediately
- Sanitize user input for prompt injection
- Enforce max input length (10,000 chars)

### Output Validation

| Model | Output Type | Validation |
|-------|-------------|------------|
| Gemini | Structured JSON | JSON Schema validation |
| Claude | Tool calls | Tool schema validation |
| All | Text responses | Content filtering |

### On Validation Failure

1. Log the failure with full details
2. Retry once with stricter prompt
3. If still fails, return safe fallback
4. Never return unvalidated AI output to user

---

**Previous Prompt:** 12-supabase-schema.md  
**Next Prompt:** 14-ai-agents.md
