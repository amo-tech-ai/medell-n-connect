# 18 - Wizards Complete Guide

## I Love Medellín - All Platform Wizards

---

## 1. CONTEXT & ROLE

Documenting all wizard flows in I Love Medellín, providing step-by-step guidance for each multi-step process including onboarding, booking, and trip creation.

Act as an expert **wizard/form flow designer** specializing in **multi-step conversion optimization**.

---

## 2. PURPOSE

Define consistent wizard experiences that guide users through complex tasks with clear steps, progress indication, and AI assistance.

---

## 3. WIZARD DESIGN PRINCIPLES

**Clear Progress:**
- Step indicator at top
- Current step highlighted
- Ability to go back
- Step count visible

**One Task Per Screen:**
- Single focused question
- Clear primary action
- Minimal distractions

**Smart Defaults:**
- Pre-fill from preferences
- Intelligent suggestions
- Reduce typing

**Error Prevention:**
- Inline validation
- Clear requirements
- Helpful error messages

**AI Assistance:**
- Suggestions where helpful
- Don't overwhelm
- Optional, not required

---

## 4. WIZARD 1: USER ONBOARDING

**Route:** `/onboarding`

**Purpose:** Capture user preferences for personalization

### Step 1: User Type Selection

**Question:** "How would you describe yourself?"

**Options:**
| Type | Icon | Description |
|------|------|-------------|
| Digital Nomad | 💻 | Working remotely, staying 1-6 months |
| Expat | 🌍 | Relocating long-term, 6+ months |
| Local | 🏠 | Living here permanently |
| Traveler | ✈️ | Visiting for vacation, 1-4 weeks |

**UI:** 4 large cards, single select
**Validation:** One selection required
**AI Agent:** None

---

### Step 2: Stay Duration

**Question:** "How long will you be in Medellín?"

**Options (varies by user type):**

| User Type | Options |
|-----------|---------|
| Nomad | 1-3 months, 3-6 months, 6+ months |
| Expat | 6-12 months, 1-2 years, 2+ years |
| Local | N/A (skip step) |
| Traveler | Days, 1 week, 2 weeks, 1 month |

**UI:** Radio buttons or cards
**Validation:** Required for non-locals

---

### Step 3: Neighborhood Preferences

**Question:** "Where would you like to explore?"

**Options:**
- El Poblado (Upscale, expat-friendly)
- Laureles (Local vibe, cafes)
- Envigado (Quiet, residential)
- El Centro (Historic, bustling)
- Belén (Affordable, authentic)
- La Candelaria (Nightlife)

**UI:** Multi-select checkboxes with map
**Validation:** At least one required
**AI Agent:** Neighborhood context from Maps

---

### Step 4: Budget Range

**Question:** "What's your monthly budget for living expenses?"

**Input:** Range slider or preset options

**Presets:**
| Level | Range | Description |
|-------|-------|-------------|
| Budget | $500-1000/mo | Basic, shared |
| Moderate | $1000-2000/mo | Comfortable |
| Comfortable | $2000-3500/mo | Nice places |
| Luxury | $3500+/mo | Premium |

**UI:** Slider with labels
**Validation:** Required

---

### Step 5: Interests

**Question:** "What are you interested in?"

**Options (multi-select):**
- 🍽️ Food & Dining
- 🍸 Nightlife & Bars
- 🎨 Culture & Arts
- 🏃 Outdoor Activities
- 💼 Networking & Tech
- 🧘 Wellness & Fitness
- 🎵 Music & Concerts
- ☕ Coffee & Cafes

**UI:** Chip selection
**Validation:** Minimum 3 required

---

### Step 6: Dietary Preferences

**Question:** "Any dietary preferences?"

**Options:**
- No restrictions
- Vegetarian
- Vegan
- Gluten-free
- Kosher/Halal
- Allergies (specify)

**UI:** Multi-select with text field
**Validation:** Optional

---

### Step 7: Complete

**Content:**
- Summary of selections
- Personalization preview
- "Your Medellín experience starts now!"
- CTA: "Go to Dashboard"

**AI Agent:** Preference Learning Agent stores all

---

## 5. WIZARD 2: APARTMENT BOOKING

**Route:** `/apartments/:id/book`

**Purpose:** Complete apartment rental booking

### Step 1: Dates

**Question:** "When would you like to move in?"

**Inputs:**
- Move-in date (date picker)
- Duration (1 month, 3 months, 6 months, custom)
- Calculated end date shown

**UI:** Calendar with duration selector
**Validation:** Date must be available
**AI Agent:** None

---

### Step 2: Guest Information

**Question:** "Who will be staying?"

**Inputs:**
- Number of guests (adult)
- Names of guests (optional)
- Special requirements

**UI:** Stepper and text fields
**Validation:** At least 1 guest

---

### Step 3: Review Listing

**Content:**
- Apartment summary card
- All amenities listed
- Pricing breakdown:
  - Monthly rate × months
  - Cleaning fee
  - Service fee
  - Total

**UI:** Summary cards
**Validation:** Confirm correct listing

---

### Step 4: Contract Review

**Content:**
- Key contract terms
- AI highlights (Phase 2):
  - Deposit amount
  - Cancellation policy
  - Key clauses
  - Concerns flagged

**UI:** Scrollable terms with highlights
**Validation:** Checkbox acceptance
**AI Agent:** Contract Review Agent (claude-opus)

---

### Step 5: Payment

**Content:**
- Payment method selection
- Credit card form (placeholder Phase 1)
- Billing address
- Total charged

**UI:** Payment form
**Validation:** Valid payment method

---

### Step 6: Confirmation

**Content:**
- "Booking Confirmed!"
- Confirmation code
- Move-in details
- Host contact info
- Add to calendar button
- Add to trip option
- Email sent confirmation

---

## 6. WIZARD 3: CAR RENTAL

**Route:** `/cars/:id/book`

**Purpose:** Complete car rental booking

### Step 1: Dates & Times

**Inputs:**
- Pickup date and time
- Return date and time
- Calculated duration shown

**UI:** Date and time pickers
**Validation:** Return after pickup

---

### Step 2: Pickup Location

**Question:** "Where to pick up?"

**Options:** Map with available locations
**UI:** Map with pins, list selection
**Validation:** One location required

---

### Step 3: Insurance Options

**Options:**
| Coverage | Price | Includes |
|----------|-------|----------|
| Basic | Included | Liability only |
| Standard | +$10/day | Collision, theft |
| Premium | +$20/day | Zero deductible, roadside |

**UI:** Radio cards with details
**Validation:** One selection required
**AI Agent:** Insurance Explainer Agent (gemini-pro)

---

### Step 4: Driver Information

**Inputs:**
- Full name (as on license)
- License number
- License country
- Age confirmation

**UI:** Form fields
**Validation:** All required

---

### Step 5: Review & Pay

**Content:**
- Vehicle summary
- Date/location summary
- Cost breakdown:
  - Daily rate × days
  - Insurance add-on
  - Taxes
  - Total

**UI:** Summary with payment form
**Validation:** Payment processed

---

### Step 6: Confirmation

**Content:**
- "Rental Confirmed!"
- Confirmation code
- Pickup instructions
- Emergency contacts
- Add to calendar
- Add to trip

---

## 7. WIZARD 4: RESTAURANT RESERVATION

**Route:** `/restaurants/:id/book`

**Purpose:** Make table reservation

### Step 1: Date & Time

**Inputs:**
- Date (calendar)
- Time slot (available slots shown)

**UI:** Calendar + time slot grid
**Validation:** Available slot required

---

### Step 2: Party Size

**Question:** "How many guests?"

**Input:** Number stepper (1-20)
**UI:** Stepper with note about large parties
**Validation:** Minimum 1

---

### Step 3: Special Requests

**Question:** "Any special requests?"

**Inputs:**
- Occasion (birthday, anniversary, business)
- Seating preference (indoor, outdoor, bar)
- Dietary alerts
- Custom notes

**UI:** Optional fields
**Validation:** None required
**AI Agent:** Message Draft Agent (claude-sonnet)

---

### Step 4: Contact Info

**Inputs:**
- Name for reservation
- Phone number
- Email for confirmation

**UI:** Form fields
**Validation:** Phone required

---

### Step 5: Confirmation

**Content:**
- "Reservation Confirmed!"
- Date, time, party size
- Restaurant address
- Reminder options
- Add to calendar
- Add to trip

---

## 8. WIZARD 5: EVENT TICKETS

**Route:** `/events/:id/tickets`

**Purpose:** Purchase event tickets

### Step 1: Ticket Selection

**Options:** Available ticket tiers
| Tier | Price | Includes |
|------|-------|----------|
| General | $X | Entry |
| VIP | $XX | Entry + perks |
| Premium | $XXX | All access |

**UI:** Radio cards with quantities
**Validation:** At least 1 ticket

---

### Step 2: Attendee Info (if required)

**Inputs:** Names per ticket
**UI:** Dynamic fields based on quantity
**Validation:** Names if event requires

---

### Step 3: Review & Pay

**Content:**
- Event summary
- Tickets × quantity
- Fees
- Total

**UI:** Summary + payment
**Validation:** Payment processed

---

### Step 4: Confirmation

**Content:**
- "Tickets Confirmed!"
- Ticket details / QR codes
- Event date reminder
- Venue directions
- Add to calendar
- Add to trip

---

## 9. WIZARD 6: TRIP PLANNING

**Route:** `/trips/new`

**Purpose:** Create new trip itinerary

### Step 1: Destination

**Question:** "Where are you going?"

**Default:** Medellín (pre-selected)
**UI:** City selector or confirm
**Validation:** Required

---

### Step 2: Dates

**Question:** "When is your trip?"

**Inputs:**
- Start date
- End date
- Trip length calculated

**UI:** Date range picker
**Validation:** End after start

---

### Step 3: Interests

**Question:** "What do you want to do?"

**Options:**
- Sightseeing & Tours
- Food & Dining
- Nightlife
- Outdoor Adventures
- Cultural Experiences
- Relaxation
- Shopping
- Photography

**UI:** Multi-select chips
**Validation:** At least 1

---

### Step 4: Budget

**Question:** "What's your trip budget?"

**Options:**
- Budget-friendly ($)
- Moderate ($$)
- Comfortable ($$$)
- Luxury ($$$$)
- Custom amount

**UI:** Radio or slider
**Validation:** Required

---

### Step 5: AI Generation (Phase 2)

**Question:** "Want AI to plan your trip?"

**Options:**
- Yes, generate full itinerary
- No, I'll build it myself

**If Yes:**
- Loading: "Creating your perfect trip..."
- Trip Planner Agent generates itinerary
- Weather Check Agent adds considerations

**AI Agent:** Trip Planner Agent (claude-opus)

---

### Step 6: Review & Create

**Content:**
- Trip summary card
- Day overview (if AI generated)
- Edit before saving option

**UI:** Summary with preview
**CTA:** "Create Trip"

---

## 10. AI AGENTS IN WIZARDS

| Wizard | Step | Agent | Model |
|--------|------|-------|-------|
| Onboarding | All | Preference Learning | gemini-pro + RAG |
| Apartment | Contract | Contract Review | claude-opus |
| Car | Insurance | Insurance Explainer | gemini-pro |
| Restaurant | Requests | Message Draft | claude-sonnet |
| Trip | Generate | Trip Planner | claude-opus |
| Trip | Generate | Weather Check | gemini-pro + Search |

---

## 11. SUCCESS CRITERIA

- All wizards complete end-to-end
- Progress clearly visible
- Back navigation works
- Validation prevents errors
- AI agents provide value
- Mobile-optimized flows
- Fast completion times

---

## 12. TESTING & VERIFICATION

### Unit Tests:
- [ ] Each wizard step renders
- [ ] Progress indicator updates
- [ ] Back button works
- [ ] Validation works
- [ ] Form submission works
- [ ] AI agents respond (Phase 2)

### Integration Tests:
- [ ] Wizard completes end-to-end
- [ ] Data persists between steps
- [ ] Final submission works
- [ ] Confirmation displays
- [ ] Data saves to database

### Manual Verification:
1. Complete onboarding wizard - all steps work
2. Complete booking wizard - booking created
3. Test back navigation - returns to previous step
4. Test validation - errors show correctly
5. Test on mobile - wizard works on mobile
6. Measure completion time - meets targets
7. Test AI agents - provide value (Phase 2)

### Production Readiness:
- [ ] All wizards functional
- [ ] Validation comprehensive
- [ ] Mobile optimized
- [ ] Performance acceptable
- [ ] Error handling works

---

## 13. REAL-WORLD EXAMPLE

**Wizard: Apartment Booking**

1. Step 1: Select dates (30 sec)
2. Step 2: Enter guest info (1 min)
3. Step 3: Review listing (1 min)
4. Step 4: AI reviews contract (30 sec)
5. Step 5: Payment (2 min)
6. Step 6: Confirmation (instant)

**Total Time:** 5 minutes  
**Traditional Method:** 2 hours  
**Time Saved:** 96%

---

## 14. OPTIMIZATION NOTES

**Avoid Over-Engineering:**
- Simple step-by-step flow first
- Basic validation
- Don't need complex conditional logic yet
- Don't need advanced AI features yet

**Production Focus:**
- Clear progress
- Easy navigation
- Fast completion
- Good validation

---

**Previous Prompt:** 17-user-journey.md  
**Next Prompt:** 19-notifications.md
