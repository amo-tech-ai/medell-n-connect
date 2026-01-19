# I Love Medellín (ILM) - Prompt Index

## Master Prompt Reference

**Last Updated:** January 19, 2026  
**Version:** 2.0  
**Status:** ✅ All Prompts Verified and Corrected

---

## 📋 Prompt Overview

| # | Prompt | Phase | Description | Status |
|---|--------|-------|-------------|--------|
| 00 | [Template](./00-template.md) | All | Prompt template structure | ✅ |
| 01 | [Core Foundation](./01-core-prompt.md) | 1 | Project setup, tech stack, 3-panel layout | ✅ |
| 02 | [Authentication](./02-auth-setup.md) | 1 | Auth, profiles, onboarding wizard | ✅ |
| 03 | [Apartments](./03-listings-apartments.md) | 1 | Apartment listings (apartments table) | ✅ Fixed |
| 04 | [Cars](./04-listings-cars.md) | 1 | Car rental listings (car_rentals table) | ✅ Fixed |
| 05 | [Restaurants](./05-listings-restaurants.md) | 1 | Restaurant discovery and reservations | ✅ |
| 06 | [Events](./06-listings-events.md) | 1 | Event discovery and ticketing | ✅ |
| 07 | [Saved](./07-saved-favorites.md) | 1 | Favorites and collections | ✅ |
| 08 | [Explore](./08-explore-discover.md) | 1-2 | Unified search across all types | ✅ |
| 09 | [Trips](./09-trips-planning.md) | 2-3 | Trip itinerary planning | ✅ |
| 10 | [Bookings](./10-bookings-module.md) | 2 | All booking wizards and management | ✅ |
| 11 | [Chatbot](./11-chatbot-system.md) | 3 | 4-Tab AI chat system | ✅ |
| 12 | [Supabase](./12-supabase-schema.md) | 1-3 | Complete database schema | ✅ Fixed |
| 13 | [Edge Functions](./13-edge-functions.md) | 2-3 | AI integration edge functions | ✅ |
| 14 | [AI Agents](./14-ai-agents.md) | 2-3 | Complete agent inventory | ✅ |
| 15 | [Dashboard](./15-home-dashboard.md) | 1 | Home dashboard design | ✅ |
| 16 | [3-Panel System](./16-3-panel-system.md) | 1 | Layout architecture | ✅ |
| 17 | [User Journeys](./17-user-journey.md) | All | Complete user flows | ✅ |
| 18 | [Wizards](./18-wizards.md) | 1-2 | All wizard step flows | ✅ |

---

## ✅ CORRECTIONS APPLIED

### Database Tables

| Table | Status |
|-------|--------|
| apartments | ✅ Separate table created |
| car_rentals | ✅ Separate table created |
| bookings | ✅ Created |

### File Numbering Fixed

| Old Name | New Name |
|----------|----------|
| 07-listings-cars.md | 04-listings-cars.md |
| (gap at 04) | Now filled correctly |

### Files Removed

- ~~03-supabase-schema copy.md~~ (duplicate)
- ~~04-edge-functions copy.md~~ (duplicate)

---

## 🎯 PROMPT QUALITY CHECKLIST

Each prompt has been verified for:

- ✅ **Context & Role** - Clear scope
- ✅ **Purpose** - Business value stated
- ✅ **Goals** - Measurable outcomes
- ✅ **Features** - Complete list
- ✅ **Screens** - UI defined
- ✅ **Data Model** - Correct table references
- ✅ **AI Agents** - Models specified
- ✅ **3-Panel Logic** - Layout defined
- ✅ **Workflows** - Steps documented
- ✅ **Acceptance Criteria** - Testable

---

## 📊 PROMPT USAGE BY PHASE

### Phase 1: Core MVP (Weeks 1-3)
**Goal:** Users can browse listings, save favorites, set preferences. No AI.

**Execute These Prompts:**
1. 01-core-prompt.md - Project setup
2. 02-auth-setup.md - Authentication
3. 16-3-panel-system.md - Layout
4. 15-home-dashboard.md - Dashboard
5. 03-listings-apartments.md - Apartments
6. 04-listings-cars.md - Cars
7. 05-listings-restaurants.md - Restaurants
8. 06-listings-events.md - Events
9. 07-saved-favorites.md - Saved
10. 12-supabase-schema.md - Database

### Phase 2: Booking & Basic AI (Weeks 4-6)
**Goal:** Full booking flows. Right panel AI suggestions.

**Execute These Prompts:**
1. 10-bookings-module.md - Booking wizards
2. 08-explore-discover.md - Unified explore
3. 09-trips-planning.md - Trip planning
4. 18-wizards.md - All wizards
5. 13-edge-functions.md - AI functions

### Phase 3: Full AI (Weeks 7-9)
**Goal:** Full chatbot. Smart recommendations. Booking confirmations.

**Execute These Prompts:**
1. 11-chatbot-system.md - 4-Tab chat
2. 14-ai-agents.md - All agents
3. 17-user-journey.md - User flows

---

## 🗄️ DATABASE REFERENCE

### Key Tables (Implemented)

| Table | Purpose | Prompt Reference |
|-------|---------|------------------|
| profiles | User profiles | 02-auth-setup |
| user_preferences | User settings | 02-auth-setup |
| **apartments** | Apartment/housing rentals | 03, 12 |
| **car_rentals** | Vehicle rentals | 04, 12 |
| restaurants | Restaurant listings | 05, 12 |
| events | Event listings | 06, 12 |
| saved_places | User favorites | 07, 12 |
| collections | Organized saves | 07, 12 |
| trips | Trip itineraries | 09, 12 |
| trip_items | Trip activities | 09, 12 |
| bookings | All reservations | 10, 12 |
| conversations | Chat sessions | 11, 12 |
| messages | Chat messages | 11, 12 |
| ai_runs | AI execution logs | 12, 13 |

---

## 🤖 AI AGENTS REFERENCE

### Models Used

| Model | Provider | Use Cases |
|-------|----------|-----------|
| claude-sonnet-4-5 | Anthropic | Routing, quick responses |
| claude-opus-4-5 | Anthropic | Booking workflows, complex agents |
| gemini-3-flash-preview | Google | Quick suggestions, filters |
| gemini-3-pro-preview | Google | Search, planning, grounding |
| gemini-3-pro-image-preview | Google | Image generation |

### Gemini 3 Features Used

- ✅ Structured Outputs (JSON Schema)
- ✅ Function Calling
- ✅ Google Search Grounding
- ✅ Google Maps Grounding
- ✅ Gemini Thinking

---

## 📈 QUICK STATS

| Metric | Count |
|--------|-------|
| Total Prompts | 19 (including template) |
| AI Agents Defined | 43+ |
| Database Tables | 17 |
| Edge Functions | 8 |
| Total Screens | 20+ |
| Total Wizards | 6 |

---

## 🔍 HOW TO USE PROMPTS

1. **Read in order** - Start with 01, use template for new ones
2. **Check data model** - Use `apartments` and `car_rentals` tables (separate tables)
3. **Follow 3-panel logic** - Left=context, Main=work, Right=AI
4. **Test acceptance criteria** - Verify each item
5. **No code in prompts** - Describe WHAT, not HOW

---

**Document Version:** 2.0  
**Last Audit:** January 19, 2026  
**Status:** ✅ All Prompts 100% Correct
