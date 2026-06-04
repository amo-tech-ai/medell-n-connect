# mdeai.co — Real Estate AI Platform PRD

## CopilotKit + Mastra + OpenClaw + Hermes Architecture

**Version:** 1.0
**Status:** Strategic PRD
**Focus:** Real Estate AI Concierge Platform for Medellín
**Stack:** CopilotKit + Mastra + OpenClaw + Supabase + Google Maps + Gemini

---

# 1. Executive Summary

## What We Are Building

mdeai.co is a **chat-first AI real estate concierge** for Medellín.

Instead of users searching through:

* Airbnb
* Facebook groups
* WhatsApp chats
* scattered listings
* unreliable landlords

…the platform acts like a **24/7 AI real estate team**.

Users can:

* search apartments naturally
* get map-aware recommendations
* schedule showings
* talk through WhatsApp
* receive personalized follow-ups
* discover neighborhoods
* connect with landlords

Landlords can:

* receive qualified leads
* automate scheduling
* manage inquiries
* track analytics
* automate follow-ups

---

# 2. Core Architecture

| Layer       | Responsibility         |
| ----------- | ---------------------- |
| Supabase    | Source of truth        |
| CopilotKit  | AI UI + approvals      |
| Mastra      | Workflow orchestration |
| OpenClaw    | Messaging + execution  |
| Hermes      | Scoring + intelligence |
| Google Maps | Geo intelligence       |
| Gemini      | AI reasoning + content |

---

# 3. System Responsibilities

## Supabase = Truth Layer

Handles:

* apartments
* landlords
* leads
* showings
* conversations
* approvals
* audit logs
* outreach history
* suppression lists

Nothing bypasses Supabase.

---

## CopilotKit = AI User Experience

Handles:

* chat sidebar
* inline rental cards
* approval UI
* generative UI
* shared state
* map-aware conversations

Example:
User says:

> “Need a 1BR in Laureles under $1500 with strong Wi-Fi.”

CopilotKit renders:

* rental cards
* neighborhood cards
* map pins
* nearby coworking spaces

---

## Mastra = Orchestration Engine

Mastra controls:

* workflows
* routing
* tool execution
* state transitions
* agent coordination

Example workflow:

```text
User Message
→ Router Agent
→ Rental Search Agent
→ Hermes Ranking
→ Maps Enrichment
→ CopilotKit Card Render
```

---

## OpenClaw = Automation Layer

OpenClaw executes:

* WhatsApp conversations
* follow-ups
* reminders
* lead nurturing
* Telegram alerts
* content scheduling
* outbound drafts

OpenClaw NEVER autonomously:

* charges money
* approves leases
* publishes outreach
* sends campaigns without approval

---

## Hermes = Intelligence Layer

Hermes scores:

* leads
* apartments
* neighborhoods
* sponsors
* influencers
* engagement quality

Hermes never executes actions.

It only:

* ranks
* scores
* predicts
* recommends

---

# 4. Product Vision

## Real-World Example

### Camila (Digital Nomad)

Camila lands in Medellín in 3 weeks.

She messages:

> “Need a furnished apartment in Poblado with great Wi-Fi near cafés.”

System flow:

```text
WhatsApp
→ OpenClaw receives
→ Mastra routes
→ Rentals Agent searches
→ Hermes ranks
→ Maps enriches
→ CopilotKit renders cards
→ Lead created in Supabase
```

Result:

* 3 apartment cards
* commute score
* coworking nearby
* neighborhood profile
* showing scheduler

---

# 5. Core Features

# 5A. Rental Discovery

## User Features

Natural language search:

Examples:

* “quiet area near coworking”
* “walkable nightlife”
* “good for remote work”
* “safe for solo female traveler”
* “close to metro”

---

## Results Include

### Rental Cards

Each card:

* title
* price
* bedrooms
* Wi-Fi speed
* neighborhood
* furnished status
* landlord rating
* walkability score
* commute score
* nearby cafés
* nearby gyms
* nearby coworking

---

## Maps Features

Using:

* Places API New
* Advanced Markers
* Routes API
* Maps Grounding Lite

Features:

* commute-aware ranking
* nearby scoring
* digital nomad score
* walkability score
* nightlife score
* quietness score

---

# 5B. WhatsApp Concierge

## OpenClaw Workflow

```text
Inbound Message
→ Intent Detection
→ Qualification
→ Apartment Search
→ Hermes Scoring
→ WhatsApp Reply
→ Lead Logging
```

---

## Concierge Capabilities

* bilingual EN/ES
* lease questions
* showing booking
* lead qualification
* reminder handling
* follow-ups
* neighborhood education

---

# 5C. Lead Qualification

## Hermes Lead Scoring

| Signal                   | Weight |
| ------------------------ | ------ |
| Budget clarity           | 15     |
| Timeline urgency         | 20     |
| Remote worker fit        | 10     |
| Engagement quality       | 15     |
| Booking intent           | 20     |
| Neighborhood specificity | 10     |
| Showing request          | 10     |

---

## Lead Tiers

| Tier | Score  |
| ---- | ------ |
| Hot  | 80–100 |
| Warm | 60–79  |
| Cold | 0–59   |

---

# 5D. Showing Scheduler

## Features

* Google Calendar sync
* WhatsApp confirmations
* reminders
* rescheduling
* landlord notifications
* no-show recovery

---

## Real Flow

```text
User requests showing
→ Scheduler checks calendar
→ Suggests times
→ User confirms
→ Landlord notified
→ Reminder cron created
→ Telegram alert generated
```

---

# 5E. Landlord Dashboard

## Features

* lead inbox
* showing management
* applicant summaries
* response analytics
* lead quality scoring
* apartment performance
* WhatsApp transcript history

---

## Metrics

Landlords see:

* response time
* conversion rate
* showing rate
* booking rate
* top-performing listings

---

# 6. Hermes Intelligence Engine

# 6A. Apartment Ranking

## Scoring Factors

| Factor                  | Example                |
| ----------------------- | ---------------------- |
| Wi-Fi quality           | 200 Mbps fiber         |
| Walkability             | cafés within 5 min     |
| Commute                 | 10 min to coworking    |
| Safety                  | neighborhood profile   |
| Remote-work fit         | desk + ergonomic chair |
| Landlord responsiveness | avg response time      |
| Building amenities      | gym/pool/coworking     |

---

# 6B. Neighborhood Intelligence

## Laureles

* quieter
* local feel
* strong cafés
* cheaper than Poblado
* good for long-term stays

## Poblado

* nightlife
* coworking concentration
* premium pricing
* digital nomad hub

## Envigado

* family-oriented
* safer feeling
* calmer
* residential

## Sabaneta

* value pricing
* growing rapidly
* metro access

---

# 6C. Behavioral Intelligence

Hermes tracks:

* repeat searches
* engagement quality
* return visits
* saved listings
* showing likelihood
* churn probability

---

# 7. OpenClaw Agent System

# 7A. Concierge Agent

## Purpose

Primary conversational AI.

## Handles

* intake
* Q&A
* search
* follow-ups

## Tools

* rental search
* maps
* CRM
* scheduling

---

# 7B. Rentals Search Agent

## Purpose

Apartment discovery.

## Responsibilities

* filtering
* ranking
* neighborhood matching
* geo enrichment

---

# 7C. Lead Qualification Agent

## Purpose

Lead scoring.

## Outputs

* hot/warm/cold
* urgency
* booking intent
* landlord fit

---

# 7D. Follow-Up Agent

## Responsibilities

* stale lead recovery
* reminder campaigns
* nurture sequences
* no-show recovery

Human approval required.

---

# 7E. Content Agent

## Generates

* Instagram posts
* apartment reels
* neighborhood content
* event promotion

---

# 7F. Operations Agent

## Monitors

* WhatsApp health
* API usage
* costs
* delivery failures
* spam warnings

---

# 8. Google Maps Intelligence

## APIs Used

| API              | Purpose               |
| ---------------- | --------------------- |
| Places API New   | nearby places         |
| Place Details    | business metadata     |
| Routes API       | commute scoring       |
| Distance Matrix  | travel time           |
| Advanced Markers | premium map UI        |
| Grounding Lite   | grounded AI responses |

---

# 9. CopilotKit UX

# Inline Generative UI

User asks:

> “Show apartments near coworking.”

CopilotKit renders:

* RentalCard
* MapPreviewCard
* NeighborhoodCard
* CommuteCard

---

# HITL Approvals

For outbound outreach:

```text
AI Draft
→ Approval Card
→ Human Review
→ Approve/Edit/Reject
→ OpenClaw Executes
```

---

# Shared State

CopilotKit stores:

* selected listings
* neighborhood preferences
* trip context
* map selections
* showing state

---

# 10. Supabase Architecture

# Core Tables

| Table             | Purpose          |
| ----------------- | ---------------- |
| apartments        | listings         |
| landlords         | owners           |
| leads             | inquiries        |
| conversations     | AI threads       |
| showings          | appointments     |
| outreach_messages | outbound history |
| suppression_list  | compliance       |
| agent_runs        | audit logs       |
| scoring_logs      | Hermes scores    |
| neighborhoods     | geo intelligence |

---

# Realtime Events

Used for:

* showing confirmations
* landlord notifications
* Telegram alerts
* UI sync
* lead routing

---

# 11. MVP Scope

# Core MVP

Must ship first:

* rental chat
* apartment cards
* map pins
* WhatsApp concierge
* lead capture
* landlord dashboard
* showing scheduler
* Hermes scoring v1

---

# Post-MVP

* social automation
* influencer workflows
* neighborhood AI reports
* landlord analytics
* commute optimization

---

# Advanced

* predictive lead scoring
* AI negotiation assistant
* autonomous growth engine
* WhatsApp broadcast engine
* OpenClaw multi-agent campaigns
* lease review AI
* direct booking/payment

---

# 12. Risks

# WhatsApp Ban Risk

Mitigation:

* strict rate limits
* human approvals
* suppression lists
* warm-up strategy

---

# Fair Housing Risk

Mitigation:

* avoid discriminatory language
* human review required
* audit logs
* compliance filters

---

# AI Hallucinations

Mitigation:

* grounded maps data
* structured outputs
* tool-only retrieval
* Supabase truth layer

---

# Spam Risk

Mitigation:

* STOP keywords
* suppression enforcement
* operating-hour rules
* outreach caps

---

# 13. Competitive Moat

## Why This Wins

Most rental platforms:

* only show listings

mdeai:

* understands intent
* understands neighborhoods
* automates workflows
* coordinates showings
* learns preferences
* operates across WhatsApp + Maps + AI

The moat is:

* Medellín-specific intelligence
* conversational UX
* geo intelligence
* landlord automation
* WhatsApp-native workflows
* Hermes scoring data

---

# 14. Final Recommendation

## Build Order

# Phase 1

* CopilotKit UI
* Mastra orchestration
* Supabase schema
* Maps integration
* rental cards
* WhatsApp concierge

# Phase 2

* Hermes scoring
* landlord workflows
* showing scheduler
* Telegram operations

# Phase 3

* OpenClaw automation
* content engine
* social automation
* influencer discovery

# Phase 4

* predictive intelligence
* autonomous growth workflows
* advanced personalization

---

# Most Important Strategic Rule

```text
AI should automate coordination,
not trust.
```

Humans still:

* approve outreach
* close deals
* negotiate
* verify leases
* manage relationships

AI handles:

* speed
* routing
* reminders
* organization
* intelligence
* repetitive communication

This is the winning architecture for AI real estate.
