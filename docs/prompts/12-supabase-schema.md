# 12 - Supabase Schema & Backend

## I Love Medellín - Database Architecture

---

## 1. CONTEXT & ROLE

Building the complete Supabase backend for I Love Medellín, including database schema, Row Level Security policies, edge functions, and real-time subscriptions.

**✅ Status:** Schema implemented and deployed to production.

Act as an expert **Supabase backend developer** specializing in **PostgreSQL database design with RLS and edge functions**.

---

## 2. PURPOSE

Establish the complete backend infrastructure that supports all platform features, ensures data security, and enables AI agent operations.

---

## 3. GOALS

- Design complete database schema
- Implement Row Level Security
- Create edge functions architecture
- Enable real-time subscriptions
- Support AI agent data needs

---

## 4. DATABASE SCHEMA OVERVIEW

### Core Tables (Phase 1) — ✅ IMPLEMENTED

| Table | Purpose | Status |
|-------|---------|--------|
| profiles | User profiles extending auth.users | ✅ |
| user_preferences | User settings and preferences | ✅ |
| events | Event listings | ✅ |
| restaurants | Restaurant listings | ✅ |
| rentals | All rental listings (apartments, cars, etc.) | ✅ |
| tourist_destinations | POIs, attractions, landmarks | ✅ |
| saved_places | User favorites | ✅ |
| collections | Organized favorites | ✅ |

### Booking & Trip Tables (Phase 2) — ✅ IMPLEMENTED

| Table | Purpose | Status |
|-------|---------|--------|
| bookings | All reservations (apartments, cars, restaurants, events) | ✅ |
| trips | Trip itineraries | ✅ |
| trip_items | Items within trips | ✅ |
| ai_runs | AI execution logs | ✅ |
| budget_tracking | Budget management | ✅ |
| conflict_resolutions | Schedule conflicts | ✅ |
| proactive_suggestions | AI suggestions | ✅ |

### Chat Tables (Phase 3) — ✅ IMPLEMENTED

| Table | Purpose | Status |
|-------|---------|--------|
| conversations | Chat sessions | ✅ |
| messages | Individual messages | ✅ |
| ai_context | Context storage for agents | ✅ |

---

## 5. TABLE DETAILS

### profiles
- Extends Supabase auth.users
- Stores user type and preferences
- One-to-one with auth.users

**Fields:**
- id (uuid, PK, references auth.users)
- email (text)
- full_name (text)
- avatar_url (text)
- user_type (enum: nomad, expat, local, traveler)
- timezone (text)
- currency (text, default USD)
- language (text, default en)
- onboarding_complete (boolean)
- created_at, updated_at

### user_preferences
- Stores detailed preferences
- Used for AI personalization

**Fields:**
- id (uuid, PK)
- user_id (uuid, FK profiles)
- preferred_neighborhoods (text[])
- budget_min (integer)
- budget_max (integer)
- dietary_restrictions (text[])
- interests (text[])
- created_at, updated_at

### apartments
- Housing rental listings
- Separate table for apartments

**Required Fields:**
- id (uuid, PK, default: gen_random_uuid())
- title (text, required)
- neighborhood (text, required)
- created_at (timestamptz, default: now())
- updated_at (timestamptz, default: now())

**Optional Basic Info:**
- description (text, nullable)
- slug (text, nullable, unique) - URL-friendly identifier
- address (text, nullable)
- city (text, nullable, default: 'Medellín')
- latitude (numeric, nullable)
- longitude (numeric, nullable)
- location (geography, nullable) - PostGIS geography type

**Property Details:**
- bedrooms (integer, nullable, default: 1)
- bathrooms (integer, nullable, default: 1)
- size_sqm (integer, nullable) - Property size in square meters
- furnished (boolean, nullable, default: true)
- floor_number (integer, nullable)
- total_floors (integer, nullable)
- wifi_speed (integer, nullable) - WiFi speed in mbps

**Amenities:**
- amenities (text[], nullable, default: '{}') - Unit amenities
- building_amenities (text[], nullable, default: '{}') - Building amenities

**Pricing:**
- price_monthly (numeric, nullable)
- price_weekly (numeric, nullable)
- price_daily (numeric, nullable)
- currency (text, nullable, default: 'USD')
- deposit_amount (numeric, nullable)

**Availability:**
- available_from (date, nullable)
- available_to (date, nullable)
- minimum_stay_days (integer, nullable, default: 30)
- maximum_stay_days (integer, nullable)

**Property Rules:**
- utilities_included (boolean, nullable, default: false)
- pet_friendly (boolean, nullable, default: false)
- smoking_allowed (boolean, nullable, default: false)
- parking_included (boolean, nullable, default: false)

**Media:**
- images (text[], nullable, default: '{}') - Image URLs
- video_url (text, nullable)
- virtual_tour_url (text, nullable)

**Ratings & Reviews:**
- rating (numeric, nullable) - Average rating (0-5)
- review_count (integer, nullable, default: 0)

**Host Information:**
- host_id (uuid, nullable, FK auth.users)
- host_name (text, nullable)
- host_response_time (text, nullable)

**Status & Metadata:**
- status (text, nullable, default: 'active', check: active|inactive|booked|pending)
- featured (boolean, nullable, default: false)
- verified (boolean, nullable, default: false)
- metadata (jsonb, nullable, default: '{}')
- created_by (uuid, nullable, FK auth.users)

### car_rentals
- Vehicle rental listings
- Separate table for cars

**Required Fields:**
- id (uuid, PK, default: gen_random_uuid())
- make (text, required)
- model (text, required)
- price_daily (numeric, required)
- created_at (timestamptz, default: now())
- updated_at (timestamptz, default: now())

**Optional Basic Info:**
- description (text, nullable)
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
- mileage_limit_daily (integer, nullable) - Daily mileage limit
- unlimited_mileage (boolean, nullable, default: false)

**Availability:**
- available_from (date, nullable)
- available_to (date, nullable)
- minimum_rental_days (integer, nullable, default: 1)
- pickup_locations (jsonb, nullable, default: '[]') - Pickup location objects
- delivery_available (boolean, nullable, default: false)

**Media:**
- images (text[], nullable, default: '{}') - Image URLs

**Ratings & Reviews:**
- rating (numeric, nullable) - Average rating (0-5)
- review_count (integer, nullable, default: 0)

**Company & Status:**
- rental_company (text, nullable)
- status (text, nullable, default: 'active', check: active|inactive|rented|maintenance)
- featured (boolean, nullable, default: false)
- created_by (uuid, nullable, FK auth.users)

### restaurants
- Restaurant listings

**Fields:**
- id (uuid, PK)
- name (text)
- description (text)
- cuisine_types (text[])
- price_level (integer, 1-4)
- neighborhood, address (text)
- latitude, longitude (numeric)
- phone, website (text)
- hours (jsonb)
- menu_url (text)
- accepts_reservations (boolean)
- dietary_options (text[])
- ambiance (text[])
- images (text[])
- rating (numeric)
- review_count (integer)
- status (enum: active, inactive)
- created_at, updated_at

### events
- Event listings

**Fields:**
- id (uuid, PK)
- title, description (text)
- category (enum: music, tech, social, sports, culture, food, nightlife)
- venue_name, venue_address (text)
- latitude, longitude (numeric)
- event_date (date)
- start_time, end_time (time)
- ticket_price_min, ticket_price_max (integer)
- ticket_url (text)
- is_free (boolean)
- language (text)
- images (text[])
- tags (text[])
- organizer_name, organizer_url (text)
- status (enum: active, cancelled, completed)
- created_at, updated_at

### saved_places
- User favorites across all types

**Fields:**
- id (uuid, PK, default: gen_random_uuid())
- user_id (uuid, FK profiles, required)
- location_type (text, required, check: event|restaurant|rental|poi)
  - Note: Uses 'rental' for both apartments and cars, 'poi' for tourist destinations
- location_id (uuid, required) - References the actual item (event, restaurant, rental, or tourist_destination)
- collection_id (uuid, FK collections, nullable)
- tags (text[], nullable, default: '{}')
- notes (text, nullable)
- is_favorite (boolean, nullable, default: false)
- priority (integer, nullable, default: 0)
- saved_at (timestamptz, default: now())
- last_viewed_at (timestamptz, nullable)
- view_count (integer, nullable, default: 0, check: >= 0)

### collections
- Organized groups of saved items

**Fields:**
- id (uuid, PK)
- user_id (uuid, FK profiles)
- name (text)
- description (text)
- cover_image (text)
- is_public (boolean)
- created_at, updated_at

### bookings
- All reservations

**Fields:**
- id (uuid, PK, default: gen_random_uuid())
- user_id (uuid, FK profiles, required)
- booking_type (enum: apartment|car|restaurant|event|tour, required)
- resource_id (uuid, required) - References the booked item
- resource_title (text, required) - Display name for the booking
- status (enum: pending|confirmed|completed|cancelled|no_show, default: 'pending')
- start_date (date, required)
- end_date (date, nullable)
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
- created_at (timestamptz, default: now())
- updated_at (timestamptz, default: now())
- confirmed_at (timestamptz, nullable)
- cancelled_at (timestamptz, nullable)

### trips
- Trip itineraries

**Fields:**
- id (uuid, PK, default: gen_random_uuid())
- user_id (uuid, FK profiles, required)
- title (text, required)
- description (text, nullable)
- destination (text, nullable)
- start_date (date, required)
- end_date (date, required)
- status (text, default: 'planning', check: planning|active|completed|cancelled)
- budget (numeric, nullable)
- currency (text, nullable, default: 'USD')
- created_at (timestamptz, default: now())
- updated_at (timestamptz, default: now())
- deleted_at (timestamptz, nullable)

### trip_items
- Items within trips

**Fields:**
- id (uuid, PK, default: gen_random_uuid())
- trip_id (uuid, FK trips, required)
- item_type (text, required, check: event|restaurant|rental|poi|other)
  - Note: Uses 'rental' for apartments and cars, 'poi' for tourist destinations
- source_id (uuid, required) - References the actual item
- title (text, required)
- description (text, nullable)
- start_at (timestamptz, nullable)
- end_at (timestamptz, nullable)
- location_name (text, nullable)
- address (text, nullable)
- latitude (numeric, nullable)
- longitude (numeric, nullable)
- metadata (jsonb, nullable, default: '{}')
- created_by (uuid, FK auth.users, nullable)
- created_at (timestamptz, default: now())
- updated_at (timestamptz, default: now())

### conversations
- Chat sessions

**Fields:**
- id (uuid, PK)
- user_id (uuid, FK profiles)
- title (text)
- tab (enum: concierge, trips, explore, bookings)
- status (enum: active, archived)
- context_data (jsonb)
- last_message_at (timestamp)
- created_at, updated_at

### messages
- Chat messages

**Fields:**
- id (uuid, PK)
- conversation_id (uuid, FK conversations)
- role (enum: user, assistant, system)
- content (text)
- agent_name (text)
- model_used (text)
- tokens_used (integer)
- metadata (jsonb)
- created_at

### ai_runs
- AI execution logs

**Fields:**
- id (uuid, PK)
- user_id (uuid, FK profiles)
- agent_name (text)
- model_name (text)
- status (enum: running, completed, failed)
- input_data (jsonb)
- output_data (jsonb)
- duration_ms (integer)
- tokens_used (integer)
- cost_usd (numeric)
- error_message (text)
- created_at

---

## 6. ROW LEVEL SECURITY

### Principles
- Users can only access their own data
- Public listings readable by all authenticated users
- Write operations restricted to owners
- Admin bypass for maintenance

### profiles
- SELECT: Own profile only
- UPDATE: Own profile only
- INSERT: Via trigger on auth.user create
- DELETE: Not allowed

### Listings (apartments, cars, restaurants, events)
- SELECT: All authenticated users (public listings)
- INSERT: Admins only
- UPDATE: Admins only
- DELETE: Admins only

### saved_places
- SELECT: Own saves only
- INSERT: Own saves only
- UPDATE: Own saves only
- DELETE: Own saves only

### bookings
- SELECT: Own bookings only
- INSERT: Own bookings only
- UPDATE: Own bookings (limited fields)
- DELETE: Not allowed (use status)

### conversations, messages
- SELECT: Own conversations only
- INSERT: Own conversations only
- UPDATE: Own conversations only
- DELETE: Own conversations only

---

## 7. EDGE FUNCTIONS

### Phase 2 Functions

**ai-router**
- Receives user query
- Classifies intent
- Returns routing decision

**ai-suggestions**
- Gets context (page, user)
- Returns personalized suggestions
- Uses gemini-3-flash

### Phase 3 Functions

**ai-chat**
- Main chat handler
- Routes to agents
- Manages conversation state

**ai-search**
- Natural language search
- Multi-domain queries
- Returns unified results

**ai-trip-planner**
- Generates itineraries
- Optimizes routes
- Checks conflicts

**ai-booking-chat**
- Handles booking requests
- Checks availability
- Processes reservations

**send-confirmation**
- Sends booking confirmations
- Email delivery
- Calendar invites

**booking-reminders**
- Scheduled function
- Sends upcoming reminders
- Daily job

---

## 8. REAL-TIME SUBSCRIPTIONS

**Use Cases:**
- New messages in chat
- Booking status updates
- Trip item changes
- Real-time collaboration (future)

**Channels:**
- conversation:{id} - Chat messages
- booking:{id} - Booking updates
- trip:{id} - Trip changes

---

## 9. TRIGGERS

**on_auth_user_created**
- Creates profile row
- Sets default preferences

**on_booking_created**
- Generates confirmation code
- Triggers confirmation email

**on_message_created**
- Updates conversation last_message_at

---

## 10. INDEXES

**Performance Indexes:**
- apartments: neighborhood, price_monthly, available_from
- car_rentals: available_from, price_daily
- restaurants: neighborhood, cuisine_types
- events: event_date, category
- saved_places: user_id, resource_type
- bookings: user_id, status, start_date
- conversations: user_id, last_message_at

---

## 11. BEST PRACTICES

**Security:**
- Always enable RLS
- Use service role key only in edge functions
- Never expose secrets to frontend
- Validate all inputs

**Performance:**
- Index frequently queried columns
- Use pagination for lists
- Optimize joins
- Cache where appropriate

**AI Integration:**
- Log all AI runs
- Track token usage
- Monitor costs
- Handle errors gracefully

---

## 12. SUCCESS CRITERIA

- All tables created with correct types
- RLS policies enforced
- Edge functions deployable
- Triggers working
- Indexes optimized
- Real-time functional
- AI logging operational

---

## 13. TESTING & VERIFICATION

### Unit Tests:
- [ ] All tables can be queried
- [ ] Foreign keys enforce correctly
- [ ] Triggers fire on events
- [ ] Indexes improve query performance
- [ ] Functions execute correctly

### Integration Tests:
- [ ] RLS policies prevent unauthorized access
- [ ] Real-time subscriptions work
- [ ] Migrations apply cleanly
- [ ] No data loss on migrations
- [ ] All relationships work

### Manual Verification:
1. Run migrations - all succeed
2. Test RLS - unauthorized access blocked
3. Test triggers - auto-updates work
4. Test indexes - queries are fast
5. Test real-time - updates propagate
6. Test functions - execute correctly
7. Verify data integrity - relationships work

### Production Readiness:
- [ ] All migrations tested
- [ ] RLS policies complete
- [ ] Indexes optimized
- [ ] Performance acceptable
- [ ] Backup strategy in place
- [ ] Monitoring set up

---

## 14. REAL-WORLD EXAMPLE

**Scenario: User Saves Apartment**

1. User clicks save on apartment
2. Insert into `saved_places` table
3. RLS policy checks user_id matches
4. Insert succeeds
5. Real-time subscription notifies UI
6. UI updates immediately
7. User sees saved state

**Result:** Instant feedback, secure, reliable

---

## 15. OPTIMIZATION NOTES

**Avoid Over-Engineering:**
- Standard table structure is enough
- Basic RLS policies first
- Simple indexes (don't need complex composite indexes yet)
- Basic triggers (don't need complex logic yet)

**Production Focus:**
- Secure (RLS complete)
- Fast (indexes on key columns)
- Reliable (proper constraints)
- Maintainable (clear structure)

---

**Previous Prompt:** 11-chatbot-system.md  
**Next Prompt:** 13-edge-functions.md
