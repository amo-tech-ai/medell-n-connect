# Next Steps - Implementation Guide

> Sequential implementation order following best practices.

## Phase 1: Foundation (Current)

### ✅ Completed
- [x] Project setup with Vite + React + TypeScript
- [x] Supabase connection
- [x] Authentication (email, Google OAuth)
- [x] Protected routes
- [x] Basic 3-panel layout
- [x] Home page with hero
- [x] Basic Explore page
- [x] Documentation structure

### 🔄 In Progress
- [ ] **Step 1.1:** Refine 3-panel layout system → [16-3-panel-system.md](./prompts/16-3-panel-system.md)
- [ ] **Step 1.2:** Implement responsive mobile navigation

---

## Phase 1: Listings (Next)

Complete in this order:

### Step 2: Apartments Module
**Prompt:** [03-listings-apartments.md](./prompts/03-listings-apartments.md)

| Task | Description | Priority |
|------|-------------|----------|
| 2.1 | Create `/apartments` list page | High |
| 2.2 | Add filters (neighborhood, price, bedrooms) | High |
| 2.3 | Create `/apartments/:id` detail page | High |
| 2.4 | Connect to Supabase `apartments` table | High |
| 2.5 | Add save to favorites functionality | Medium |

### Step 3: Cars Module
**Prompt:** [04-listings-cars.md](./prompts/04-listings-cars.md)

| Task | Description | Priority |
|------|-------------|----------|
| 3.1 | Create `/cars` list page | High |
| 3.2 | Add filters (type, transmission, price) | High |
| 3.3 | Create `/cars/:id` detail page | High |
| 3.4 | Connect to Supabase `car_rentals` table | High |

### Step 4: Restaurants Module
**Prompt:** [05-listings-restaurants.md](./prompts/05-listings-restaurants.md)

| Task | Description | Priority |
|------|-------------|----------|
| 4.1 | Create `/restaurants` list page | High |
| 4.2 | Add filters (cuisine, price, dietary) | High |
| 4.3 | Create `/restaurants/:id` detail page | High |
| 4.4 | Connect to Supabase `restaurants` table | High |

### Step 5: Events Module
**Prompt:** [06-listings-events.md](./prompts/06-listings-events.md)

| Task | Description | Priority |
|------|-------------|----------|
| 5.1 | Create `/events` list page | High |
| 5.2 | Add filters (date, category, price) | High |
| 5.3 | Create `/events/:id` detail page | High |
| 5.4 | Connect to Supabase `events` table | High |

---

## Phase 1: Core Features

### Step 6: Saved & Favorites
**Prompt:** [07-saved-favorites.md](./prompts/07-saved-favorites.md)

| Task | Description | Priority |
|------|-------------|----------|
| 6.1 | Upgrade `/saved` dashboard | High |
| 6.2 | Implement collections CRUD | Medium |
| 6.3 | Add cross-type filtering | Medium |
| 6.4 | Connect to `saved_places` + `collections` tables | High |

### Step 7: Unified Explore
**Prompt:** [08-explore-discover.md](./prompts/08-explore-discover.md)

| Task | Description | Priority |
|------|-------------|----------|
| 7.1 | Add real map integration (Mapbox/Google) | High |
| 7.2 | Implement category tabs | Medium |
| 7.3 | Add multi-type search | Medium |
| 7.4 | Connect to all listing tables | High |

### Step 8: Home Dashboard
**Prompt:** [15-home-dashboard.md](./prompts/15-home-dashboard.md)

| Task | Description | Priority |
|------|-------------|----------|
| 8.1 | Create `/dashboard` for logged-in users | Medium |
| 8.2 | Add upcoming bookings section | Medium |
| 8.3 | Add personalized recommendations | Low |

---

## Phase 2: Bookings & Trips

### Step 9: Trips Module
**Prompt:** [09-trips-planning.md](./prompts/09-trips-planning.md)

| Task | Description | Priority |
|------|-------------|----------|
| 9.1 | Create `/trips` list page | High |
| 9.2 | Create `/trips/:id` detail with day view | High |
| 9.3 | Implement trip creation wizard | High |
| 9.4 | Connect to `trips` + `trip_items` tables | High |

### Step 10: Bookings Module
**Prompt:** [10-bookings-module.md](./prompts/10-bookings-module.md)

| Task | Description | Priority |
|------|-------------|----------|
| 10.1 | Create `/bookings` dashboard | High |
| 10.2 | Implement apartment booking wizard | High |
| 10.3 | Implement car booking wizard | High |
| 10.4 | Implement restaurant booking wizard | Medium |
| 10.5 | Implement event booking wizard | Medium |
| 10.6 | Connect to `bookings` table | High |

---

## Phase 3: AI Integration

### Step 11: Edge Functions
**Prompt:** [13-edge-functions.md](./prompts/13-edge-functions.md)

| Task | Description | Priority |
|------|-------------|----------|
| 11.1 | Create `ai-router` function | High |
| 11.2 | Create `ai-suggestions` function | High |
| 11.3 | Create `ai-search` function | Medium |
| 11.4 | Set up Lovable AI Gateway | High |

### Step 12: AI Chatbot
**Prompt:** [11-chatbot-system.md](./prompts/11-chatbot-system.md)

| Task | Description | Priority |
|------|-------------|----------|
| 12.1 | Create 4-tab chat interface | High |
| 12.2 | Implement Concierge tab | High |
| 12.3 | Implement Trips tab | Medium |
| 12.4 | Implement Explore tab | Medium |
| 12.5 | Implement Bookings tab | Medium |
| 12.6 | Connect to `conversations` + `messages` tables | High |

### Step 13: AI Agents
**Prompt:** [14-ai-agents.md](./prompts/14-ai-agents.md)

| Task | Description | Priority |
|------|-------------|----------|
| 13.1 | Implement Router Agent | High |
| 13.2 | Implement Concierge Agent | High |
| 13.3 | Implement Trip Planner Agent | Medium |
| 13.4 | Implement Booking Agent | Medium |

---

## Best Practices Checklist

Before starting each step:

- [ ] Read the relevant prompt document
- [ ] Check dependencies are complete
- [ ] Review existing components for reuse
- [ ] Update progress tracker when starting

After completing each step:

- [ ] Test functionality manually
- [ ] Update progress tracker status to `done`
- [ ] Add entry to CHANGELOG.md
- [ ] Commit with descriptive message

---

## Related Docs

- [Progress Tracker](./progress-tracker/progress.md) — Status tracking
- [Prompts](./prompts/README.md) — Feature specifications
- [Rules](../rules/README.md) — Build constraints
- [Changelog](./CHANGELOG.md) — Change history
