# 10 - Bookings Module

## I Love Medellín - Booking System

---

## 1. CONTEXT & ROLE

Building the unified bookings module for I Love Medellín, managing reservations across apartments, cars, restaurants, and events with AI-powered booking agents and confirmation workflows.

Act as an expert **booking and reservation system developer** specializing in **multi-resource booking platforms with autonomous agents**.

---

## 2. PURPOSE

Provide a centralized booking management system where users can create, track, modify, and cancel reservations across all platform services.

---

## 3. GOALS

- Build booking wizards for each resource type
- Create unified bookings dashboard
- Implement booking confirmation flow
- Enable booking modifications
- Integrate with AI booking agents (Phase 2+)

---

## 4. SCREENS

### My Bookings (`/bookings`)

**3-Panel Layout:**

**Left Panel - Context:**
- Navigation with Bookings highlighted
- Filter by type
- Filter by status
- Quick date filters

**Main Panel - Work:**
- Booking cards list
- Status badges (confirmed, pending, completed, cancelled)
- Quick actions per booking
- Tab filters (Upcoming, Past, Cancelled)

**Right Panel - Intelligence:**
- Upcoming booking reminders
- Calendar overview
- Quick modification options
- AI suggestions for bookings

**Booking Card Content:**
- Resource image
- Booking type badge
- Resource name
- Dates/times
- Status indicator
- Confirmation code
- Quick action buttons
- View details link

---

### Apartment Booking Wizard (`/apartments/:id/book`)

**Steps:**
1. **Dates** - Move-in date, duration selection
2. **Guest Info** - Number of guests, special requirements
3. **Review** - Listing summary, pricing breakdown
4. **Contract** - AI contract review, accept terms
5. **Payment** - Payment method selection (placeholder Phase 1)
6. **Confirmation** - Success with details and next steps

---

### Car Booking Wizard (`/cars/:id/book`)

**Steps:**
1. **Dates** - Pickup and return dates/times
2. **Pickup Location** - Select from available locations
3. **Insurance** - Coverage options selection
4. **Driver Info** - Driver details, license info
5. **Review** - Total cost breakdown
6. **Payment** - Payment method
7. **Confirmation** - Pickup instructions

---

### Restaurant Booking (`/restaurants/:id/book`)

**Steps:**
1. **Date & Time** - Reservation date and time slot
2. **Party Size** - Number of guests
3. **Special Requests** - Dietary, occasion, seating preference
4. **Contact Info** - Phone, email for confirmation
5. **Confirmation** - Reservation confirmed

---

### Event Tickets (`/events/:id/tickets`)

**Steps:**
1. **Ticket Type** - Select ticket tier
2. **Quantity** - Number of tickets
3. **Attendee Info** - Names if required
4. **Review** - Total cost
5. **Payment** - Payment method
6. **Confirmation** - Tickets delivered (email/in-app)

---

## 5. DATA MODEL

**bookings Table:**
- id (uuid, primary key, default: gen_random_uuid())
- user_id (uuid, references profiles, required)
- booking_type (enum: apartment|car|restaurant|event|tour, required)
- resource_id (uuid, required) - References the booked item
- resource_title (text, required) - Display name
- status (enum: pending|confirmed|completed|cancelled|no_show, default: 'pending')
- start_date (date, required)
- end_date (date, nullable for single-day bookings)
- start_time (time, nullable)
- end_time (time, nullable)
- party_size (integer, nullable, default: 1)
- quantity (integer, nullable, default: 1)
- unit_price (numeric, nullable)
- total_price (numeric, nullable)
- currency (text, nullable, default: 'USD')
- payment_status (enum: pending|paid|refunded|failed, default: 'pending')
- payment_method (text, nullable)
- payment_reference (text, nullable)
- confirmation_code (text, nullable, unique)
- special_requests (text, nullable)
- notes (text, nullable)
- metadata (jsonb, nullable, default: '{}')
- trip_id (uuid, FK trips, nullable)
- currency (text)
- payment_status (enum: pending, paid, refunded)
- confirmation_code (text, unique)
- trip_id (uuid, nullable, references trips)
- notes (text)
- created_at, updated_at

---

## 6. AI AGENTS (Phase 2+)

**Apartment Booking Agent**
- Model: claude-opus-4-5
- Screen: Apartment Wizard
- Purpose: Handle booking workflow autonomously

**Contract Review Agent**
- Model: claude-opus-4-5
- Screen: Apartment Wizard
- Purpose: Analyze terms, flag concerns

**Car Booking Agent**
- Model: claude-opus-4-5
- Screen: Car Wizard
- Purpose: Handle rental workflow

**Insurance Advisor Agent**
- Model: gemini-3-pro-preview
- Screen: Car Wizard
- Purpose: Explain coverage options

**Table Booking Agent**
- Model: claude-opus-4-5
- Screen: Restaurant Booking
- Purpose: Handle reservation workflow

**Message Draft Agent**
- Model: claude-sonnet-4-5
- Screen: Restaurant Booking
- Purpose: Draft special request messages

**Ticket Booking Agent**
- Model: claude-opus-4-5
- Screen: Event Tickets
- Purpose: Handle ticket purchase

**Add-to-Trip Agent**
- Model: claude-opus-4-5
- Screen: All Wizards
- Purpose: Auto-add to trip itinerary

---

## 7. RIGHT PANEL AI ACTIONS (Phase 2+)

**Booking Wizards:**
- Price comparison with alternatives
- Best time suggestions
- Conflict checking with calendar
- Auto-fill from profile
- Add to trip preview

**My Bookings:**
- Upcoming reminders
- Modification suggestions
- Cancellation policies
- Related bookings

---

## 8. USER JOURNEY

### Apartment Booking Journey
1. User views apartment detail
2. User clicks "Book Now"
3. User selects dates and duration
4. User reviews pricing
5. AI reviews contract (Phase 2)
6. User accepts terms
7. User enters payment (placeholder)
8. Confirmation displayed
9. Added to My Bookings
10. Add to trip option

### Restaurant Booking Journey
1. User views restaurant detail
2. User clicks "Reserve Table"
3. User selects date and time
4. User enters party size
5. User adds special requests
6. Reservation confirmed
7. Reminder scheduled

---

## 9. FEATURES

**Booking Creation:**
- Step-by-step wizards
- Real-time availability (Phase 2)
- Price transparency
- Terms acceptance

**Booking Management:**
- View all bookings
- Filter by type and status
- Quick actions (view, modify, cancel)
- Confirmation codes

**Modifications:**
- Change dates (if allowed)
- Update party size
- Add special requests
- Cancellation flow

**Confirmations:**
- On-screen confirmation
- Email confirmation
- In-app notifications
- Calendar integration (Phase 3)

**Trip Integration:**
- Add booking to trip
- Show in itinerary
- Sync status

---

## 10. 3-PANEL LOGIC

**Left Panel Updates:**
- Highlights "Bookings" in navigation
- Shows filter options
- Quick type selector

**Main Panel Focus:**
- Wizard steps
- Booking forms
- Booking list

**Right Panel Intelligence:**
- Pricing context
- Conflict warnings
- Calendar preview
- AI suggestions

---

## 11. WORKFLOWS

**Booking Creation Workflow:**
1. User initiates from listing
2. Wizard collects required info
3. Validation at each step
4. Review before confirmation
5. Process payment (placeholder)
6. Create booking record
7. Send confirmation
8. Update UI

**Booking Modification Workflow:**
1. User opens booking
2. User clicks modify
3. Edit allowed fields
4. Confirm changes
5. Update record
6. Send update confirmation

**Booking Cancellation Workflow:**
1. User opens booking
2. User clicks cancel
3. Show cancellation policy
4. Confirm cancellation
5. Update status
6. Process refund if applicable
7. Send confirmation

**AI Booking Workflow (Phase 2+):**
1. User requests booking via chat
2. Claude Opus Booking Agent takes over
3. Agent checks availability
4. Agent presents options
5. User confirms
6. Agent processes booking
7. Confirmation delivered

---

## 12. SUPABASE QUERIES

**List Bookings:**
- Select from bookings
- Filter by user_id
- Filter by status
- Order by start_date

**Get Booking Detail:**
- Select booking by ID
- Join with resource table
- Include all details

**Create Booking:**
- Insert into bookings
- Generate confirmation_code
- Set initial status

**Update Booking:**
- Update by booking ID
- Validate changes allowed
- Update timestamps

**Cancel Booking:**
- Update status to cancelled
- Record cancellation reason

---

## 13. EDGE FUNCTIONS (Phase 3+)

**send-confirmation**
- Triggered after booking created
- Sends email with details
- Generates calendar invite

**booking-reminders**
- Scheduled function
- Checks upcoming bookings
- Sends reminder notifications

---

## 14. RESPONSIVE BEHAVIOR

**Desktop:**
- Full 3-panel layout
- Multi-step wizard visible
- Side-by-side review

**Tablet:**
- 2-panel layout
- Wizard in main panel
- Summary in drawer

**Mobile:**
- Full-screen wizard
- Step-by-step flow
- Bottom sheet for help

---

## 15. SUCCESS CRITERIA

- All 4 booking wizards functional
- Bookings list displays correctly
- Confirmation codes generated
- Status tracking works
- Modification flow complete
- Cancellation flow complete
- Ready for AI integration

---

## 16. TESTING & VERIFICATION

### Unit Tests:
- [ ] All wizard steps work
- [ ] Form validation works
- [ ] Confirmation codes generate
- [ ] Status updates correctly
- [ ] Modification form works
- [ ] Cancellation flow works

### Integration Tests:
- [ ] Bookings save to database
- [ ] Confirmation codes unique
- [ ] Status updates persist
- [ ] RLS policies enforce access
- [ ] Email confirmations sent (if implemented)

### Manual Verification:
1. Complete apartment booking - booking created
2. Complete car booking - booking created
3. Complete restaurant booking - booking created
4. Complete event booking - booking created
5. View bookings list - all bookings show
6. Modify booking - changes save
7. Cancel booking - status updates
8. Test on mobile - responsive works

### Production Readiness:
- [ ] Loading states during booking
- [ ] Error handling for failures
- [ ] Confirmation messages clear
- [ ] Performance acceptable
- [ ] Payment integration works (if implemented)

---

## 17. REAL-WORLD EXAMPLE

**User Journey: Book Apartment**

1. User views apartment detail
2. Clicks "Book Now"
3. Wizard Step 1: Selects dates (Jan 20-27)
4. Step 2: Enters guest info (2 guests)
5. Step 3: Reviews pricing breakdown
6. Step 4: AI reviews contract, highlights terms
7. Step 5: Enters payment info
8. Step 6: Receives confirmation
9. Booking appears in Bookings page

**Time:** 5 minutes (vs 2 hours emailing landlord)

---

## 18. OPTIMIZATION NOTES

**Avoid Over-Engineering:**
- Simple wizard steps first
- Basic payment placeholder (don't need full Stripe yet)
- Simple confirmation (don't need complex email system yet)
- Basic modification (don't need complex change system yet)

**Production Focus:**
- Clear booking flow
- Easy to complete
- Reliable confirmations
- Good error handling

---

## 19. TRANSACTION SAFETY & ROLLBACK

**Booking Transaction Steps:**

| Step | Action | Rollback If Failed |
|------|--------|-------------------|
| 1 | Validate availability | None needed |
| 2 | Hold inventory (temporary) | Release hold |
| 3 | Collect payment info | Release hold |
| 4 | Process payment | Refund + release hold |
| 5 | Create booking record | Refund + release hold |
| 6 | Send confirmation | Mark for retry (booking is valid) |

**Compensation Actions:**
- Payment failed → Release inventory hold immediately
- Booking creation failed → Initiate refund, release hold
- Confirmation failed → Log for manual follow-up, booking is still valid

**Idempotency Rules:**
- All operations can be safely retried
- Use confirmation_code as idempotency key
- Check existing booking before creating duplicate

**Error Recovery:**
- Show clear error message to user
- Offer "Try Again" button
- Never leave user in unknown state

---

## 20. WIZARD RESILIENCE

**Checkpoint Persistence:**
- Save wizard state after each step
- Store in localStorage + database draft
- On page refresh: Resume at last step
- On timeout (30 min): Prompt to restart or continue

**Back Button Behavior:**
- Works without data loss
- Previous step data preserved
- User can edit earlier steps

**Empty States:**
- No available dates: "This listing is fully booked. Check similar options."
- Payment failed: "Payment could not be processed. Please try again or use a different method."

---

**Previous Prompt:** 09-trips-planning.md  
**Next Prompt:** 11-chatbot-system.md
