# User Stories, Flows & Journeys

> Complete reference for personas, user stories, flows, and AI agent integration.

**Last Updated:** 2026-01-28  
**Platform:** I Love Medellín (ILM) — AI-powered lifestyle for nomads, expats, locals, travelers

---

## Personas

| Persona | Duration | Primary Needs | Key Goals |
|---------|----------|---------------|-----------|
| **Maya — Digital Nomad** | 3 months | Furnished apartment, WiFi, coworking, networking | El Poblado apartment, meet nomads, weekend explore |
| **Carlos & Maria — Expat Couple** | 2+ years | Long-term housing, car, local services | Envigado home, family car, restaurants for hosting |
| **Alejandro — Local Professional** | Permanent | Restaurants, events, weekend trips | New spots monthly, concerts, weekend getaways |
| **Sarah & Tom — Travelers** | 2 weeks | Activities, dining, day trips | Best of Medellín, authentic food, Guatapé trip |

---

## User Stories by Epic

### Onboarding & Identity

| ID | As a… | I want to… | So that… | Screen(s) |
|----|-------|------------|----------|-----------|
| OB-1 | New user | Sign up with email or Google | I can have a personalized experience | `/login`, `/signup` |
| OB-2 | New user | Choose my type (nomad/expat/local/traveler) | The app tailors content to my stay length | `/onboarding` |
| OB-3 | New user | Set neighborhood and budget preferences | Recommendations match my lifestyle | `/onboarding` |
| OB-4 | New user | Set interests (food, nightlife, culture, outdoors) | I see relevant events and places | `/onboarding` |
| OB-5 | Returning user | Log in and see my dashboard | I continue where I left off | `/`, `/trips` |

### Trips & Itinerary

| ID | As a… | I want to… | So that… | Screen(s) |
|----|-------|------------|----------|-----------|
| TR-1 | Traveler | Create a new trip with destination and dates | I can build an itinerary | `/trips/new`, TripWizard |
| TR-2 | Traveler | See all my trips in one place | I can switch between planning and past trips | `/trips` |
| TR-3 | Traveler | View day-by-day itinerary for a trip | I know what I'm doing each day | `/trips/:id`, DayTimeline |
| TR-4 | User | Add events, restaurants, or activities to a trip day | My trip has real bookings and plans | TripDetail, AddToTripDialog |
| TR-5 | User | Optimize the order of activities (route) | I spend less time moving around | TripDetail, ai-optimize-route |
| TR-6 | User | Get AI suggestions to fill empty days | I don't have gaps in my plan | Concierge / Right panel |
| TR-7 | User | Check for schedule conflicts | I avoid double-bookings | TripDetail (future) |

### Discovery

| ID | As a… | I want to… | So that… | Screen(s) |
|----|-------|------------|----------|-----------|
| EX-1 | User | Browse events, restaurants, and places in one view | I discover without jumping between apps | `/explore` |
| EX-2 | User | Filter by date, neighborhood, price, cuisine | Results match my criteria | All listing pages |
| EX-3 | User | See a place on the map | I understand location and distance | ExploreMapView |
| EX-4 | User | Open a detail page for any listing | I can read details and book | `/:type/:id` |
| EX-5 | User | Ask the AI "find me a restaurant in El Poblado tonight" | I get tailored suggestions quickly | `/concierge` |

### Saved Places & Collections

| ID | As a… | I want to… | So that… | Screen(s) |
|----|-------|------------|----------|-----------|
| SV-1 | User | Save an event, restaurant, apartment, or car | I can find it later | Detail pages |
| SV-2 | User | Organize saved items into collections | I group by theme | `/saved`, `/collections` |
| SV-3 | User | Get AI-suggested collections for my trip | I reuse my taste | TripDetail |
| SV-4 | User | Add a saved place to a trip day | My itinerary uses places I already like | AddToTripDialog |

### Bookings

| ID | As a… | I want to… | So that… | Screen(s) |
|----|-------|------------|----------|-----------|
| BK-1 | User | Book an apartment | I have a confirmed stay | ApartmentBookingWizard |
| BK-2 | User | Reserve a restaurant table | I have a confirmed reservation | RestaurantBookingWizard |
| BK-3 | User | Rent a car | I have a confirmed rental | CarBookingWizard |
| BK-4 | User | Book event tickets | I'm confirmed for the event | EventBookingWizard |
| BK-5 | User | See all my bookings in one place | I can manage and cancel if needed | `/bookings` |

### AI Concierge & Chat

| ID | As a… | I want to… | So that… | Screen(s) |
|----|-------|------------|----------|-----------|
| AI-1 | User | Ask questions in natural language | I get answers without learning the UI | `/concierge` |
| AI-2 | User | Get recommendations from chat | I discover via conversation | ai-chat |
| AI-3 | User | See results in tabs (trips, events, restaurants, map) | I can switch context without new queries | ChatTabs |
| AI-4 | User | Resume past conversations | I don't lose context | ConversationList |
| AI-5 | User | Have the AI consider my active trip | Suggestions fit my current itinerary | useChat + tripId |

---

## Key Flows

### Flow 1: New User → Onboarding → First Trip

| Step | Action | Screen | Outcome |
|------|--------|--------|---------|
| 1 | Land on home | `/` | See hero, value prop |
| 2 | Click "Get started" | `/signup` | Account created |
| 3 | Complete onboarding | `/onboarding` | Preferences saved |
| 4 | Go to Trips | `/trips` | Empty state |
| 5 | Click "New Trip" | `/trips/new` | TripWizard opens |
| 6 | Set destination, dates, budget | TripWizard | Trip created |
| 7 | View itinerary | `/trips/:id` | Add items |

### Flow 2: Find Restaurant → Save → Add to Trip → Book

| Step | Action | Screen | Outcome |
|------|--------|--------|---------|
| 1 | Open Explore | `/explore` | List + filters |
| 2 | Filter (cuisine, area) | Filter UI | Filtered list |
| 3 | Open restaurant detail | `/restaurants/:id` | Full details |
| 4 | Save to favorites | Save button | In `/saved` |
| 5 | Open trip | `/trips/:id` | DayTimeline |
| 6 | Click "Add to trip" | AddToTripDialog | Choose trip + day |
| 7 | Click "Reserve table" | BookingWizard | Confirm |
| 8 | See confirmation | `/bookings` | Done |

### Flow 3: Ask AI → Get Suggestions → Add to Trip

| Step | Action | Screen | Outcome |
|------|--------|--------|---------|
| 1 | Open Concierge | `/concierge` | Chat input |
| 2 | Type query | ChatInput | Message sent |
| 3 | AI responds | ChatMessageList | Text + cards |
| 4 | Switch to domain tab | ChatTabs | Domain view |
| 5 | Click suggestion | Detail | Can save/add |
| 6 | Add to trip | AddToTripDialog | On itinerary |

---

## Screen × AI Agent Mapping

| Screen | AI Functions |
|--------|--------------|
| `/trips/:id` | ai-optimize-route, ai-suggest-collections |
| `/concierge` | ai-chat, ai-router |
| `/explore` | (future: ai-search) |
| FloatingChatWidget | ai-chat |

---

## Real-World Examples

### Example 1: Digital Nomad — First Month

Maya lands in Medellín for 3 months. She:
1. Signs up with Google, completes onboarding (nomad, El Poblado, coworking + nightlife)
2. Browses **Apartments**, filters furnished + fast WiFi, saves 4
3. Books one via **ApartmentBookingWizard**
4. Creates a **Trip** "Medellín weekends"
5. Asks **Concierge** "best cafes to work in Poblado"
6. Adds suggestions to Saved and her trip
7. Uses **Optimize route** for Saturday activities

### Example 2: Travelers — 2-Week Vacation

Sarah & Tom have 14 days:
1. Create trip "Medellín + Guatapé"
2. Add 3 events from **Explore**
3. Ask Concierge "romantic dinner Poblado"
4. Add restaurant to Day 5, **book** it
5. Use **Route optimize** for Day 3
6. Add **car rental** for Guatapé day
7. All confirmations in **Bookings**

### Example 3: Local — Dinner and Events

Alejandro uses ILM for dinner:
1. Opens **Restaurants**, filters "open tonight," Laureles
2. Picks one, **reserves** for 2 at 8pm
3. Goes to **Events**, filters "this weekend," music
4. **Saves** two events
5. Opens **Concierge**, asks "any new openings in Provenza?"

---

## Related

- [Progress Tracker](../progress-tracker/progress.md)
- [Prompts Index](../prompts/00-index.md)
- [Onboarding Wizard](../prompts/18-wizards.md)
