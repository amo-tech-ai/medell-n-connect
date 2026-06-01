---
title: Unified mdeai PRD (consolidated narrative)
date: 2026-05-20
status: Reference — scores below are planning-only; see audit for code truth
canonical_index: ../../prd.md
audit: ./prd-audit-report.md
production_ready: false
---

# Unified mdeai PRD (archived narrative)

> **⚠️ Superseded (2026-05-21):** Use the **v7 canonical system** — [`plan/prd/README.md`](../prd/README.md) (10 docs + forensic audit). This file remains as historical synthesis only; **do not update for execution.**

> **Scores in §20 were planning-only.** Implementation ~48/100 — [`plan/prd/00-forensic-audit.md`](../prd/00-forensic-audit.md).

# Unified mdeai PRD (reference copy)

## Maps V2 + Real Estate + Events + CopilotKit + Mastra Unified Architecture

Based on:

* Real Estate PRD 
* Core Platform PRD 
* Users + Flows 
* Architecture Layers 
* Final Summary 
* Maps V2 Plan 

---

# 1. Executive Summary

mdeai is a:

* chat-first
* map-first
* AI-assisted
* transaction-enabled

platform for Medellín.

The platform combines:

| Vertical     | Purpose                      |
| ------------ | ---------------------------- |
| Real estate  | Rentals + leads + showings   |
| Events       | Discovery + ticketing        |
| Restaurants  | Concierge recommendations    |
| Attractions  | Tourism discovery            |
| Maps         | Spatial truth + visual proof |
| AI Concierge | Unified conversational layer |

Core principle:

```text
One chat
One map
One workflow system
One approval system
One shared AI architecture
```

---

# 2. Core Architecture Philosophy

## System responsibilities

| Layer       | Responsibility         |
| ----------- | ---------------------- |
| Supabase    | Source of truth        |
| Google Maps | Spatial truth          |
| Mastra      | Orchestration          |
| CopilotKit  | Conversational UI      |
| Gemini      | Reasoning + ranking    |
| OpenClaw    | Operational automation |
| Hermes      | Scoring + intelligence |

---

# 3. Non-Negotiable Technical Decisions

## AI Stack

| Decision               | Status |
| ---------------------- | ------ |
| CopilotKit 1.55.2 only | Locked |
| Mastra only            | Locked |
| AG-UI bridge           | Locked |
| No LangGraph runtime   | Locked |
| No CrewAI runtime      | Locked |
| No second orchestrator | Locked |

---

## Maps Stack

| Decision                 | Status |
| ------------------------ | ------ |
| vis.gl/react-google-maps | Locked |
| Places API New           | Locked |
| Grounding Lite MCP       | Locked |
| Advanced Markers         | Locked |
| Marker clustering        | Locked |
| Routes API               | MVP+   |
| Field masks mandatory    | Locked |
| Map ID mandatory         | Locked |

---

# 4. Unified Product Vision

## Camila Flow

```text
Chat → Cards → Map → Lead → Showing → Booking
```

Example:

```text
“2BR Laureles under $1200 near coworking”
```

Result:

* Rental cards
* Coworking pins
* Metro distance
* WhatsApp lead capture
* Showing scheduling

---

## Roberto Flow

```text
AI-assisted event creation
→ Venue discovery
→ Ticket setup
→ Approval
→ Publish
→ Stripe checkout
```

---

# 5. Unified Chat Architecture

## One Chat System

NOT:

```text
Events chat
Rentals chat
Restaurant chat
```

YES:

```text
One concierge chat
with routing workflows
```

---

## Chat Layout

```text
┌────────────────────┬──────────────────┬──────────────────┐
│ Navigation         │ Conversation     │ Live Map         │
├────────────────────┼──────────────────┼──────────────────┤
│ Rentals            │ CopilotSidebar   │ AdvancedMarkers  │
│ Events             │ AI cards         │ Clusters         │
│ Restaurants        │ HITL approvals   │ Place previews   │
│ Attractions        │ Streaming tools  │ Nearby search    │
└────────────────────┴──────────────────┴──────────────────┘
```

---

# 6. Unified Maps V2 Architecture

## Maps Role

Maps is NOT the AI brain.

Maps is:

* evidence
* visualization
* validation
* discovery

---

## Maps Rules

| Rule                             | Why                    |
| -------------------------------- | ---------------------- |
| AI never invents coordinates     | Prevent hallucinations |
| place_id only from tools         | Data integrity         |
| All Places calls use field masks | Cost control           |
| One map loader only              | Stability              |
| One pin writer only              | State consistency      |

---

## Map Features

### MVP

| Feature           | Status |
| ----------------- | ------ |
| Advanced markers  | MVP    |
| Marker clustering | MVP    |
| Rental pins       | MVP    |
| Event pins        | MVP    |
| Nearby search     | MVP    |
| Place cards       | MVP    |
| Grounded places   | MVP    |
| Map/chat sync     | MVP    |

---

## Post-MVP

| Feature                   | Status   |
| ------------------------- | -------- |
| Neighborhood intelligence | Post-MVP |
| Nomad scoring             | Post-MVP |
| Commute scoring           | Post-MVP |
| Lifestyle scoring         | Post-MVP |
| Route previews            | Post-MVP |

---

# 7. Unified CopilotKit Architecture

## Core primitives

| Primitive                | Use           |
| ------------------------ | ------------- |
| useCoAgent               | Shared state  |
| useCopilotAction         | Generative UI |
| render                   | Cards         |
| renderAndWaitForResponse | HITL          |
| CopilotSidebar           | Main chat     |
| CopilotRuntime           | Agent bridge  |

---

## Shared Generative UI System

| Card             | Purpose           |
| ---------------- | ----------------- |
| RentalCard       | Rentals           |
| EventCard        | Events            |
| PlaceCard        | Grounded places   |
| NeighborhoodCard | Area intelligence |
| ApprovalCard     | HITL              |

---

# 8. Unified Mastra Architecture

## Core agents

| Agent             | Role              |
| ----------------- | ----------------- |
| conciergeAgent    | Main orchestrator |
| routerAgent       | Intent routing    |
| rentalAgent       | Rentals           |
| eventAgent        | Events            |
| evaluationAgent   | Ranking           |
| neighborhoodAgent | Intelligence      |
| showingAgent      | Scheduling        |

---

## Critical simplification

DO NOT create:

```text
20 micro-agents
```

Instead:

```text
1 concierge
+ workflows
+ tools
```

---

# 9. Unified Workflow Architecture

## Workflow Philosophy

```text
Tools do retrieval
Workflows do orchestration
UI does rendering
Supabase does persistence
```

---

## Core workflows

### Rental Search

```text
Query
→ Supabase
→ Places enrich
→ Ranking
→ Cards + pins
```

---

### Event Creation

```text
Natural language
→ Structured form fill
→ HITL approval
→ Commit
```

---

### Nearby Intelligence

```text
Listing
→ Nearby Search
→ Coworking
→ Cafés
→ Metro
→ Lifestyle scores
```

---

# 10. Shared State Architecture

## Shared State Types

```text
MapState
RentalSearchState
EventDraftState
ChatUiState
ApprovalState
```

---

## Shared packages

```text
packages/
  types/
  schemas/
  maps/
  ui/
  workflows/
```

---

# 11. Unified Approval Architecture

## Golden Rule

```text
AI NEVER writes directly
```

Always:

```text
AI proposes
Human approves
Edge commits
```

---

## Approval Flow

```text
Agent
→ ApprovalCard
→ User confirms
→ approval-commit
→ RPC
→ Database write
```

---

# 12. Unified Search Architecture

## Search hierarchy

### Tier 1 — Supabase

Source of truth.

Used for:

* rentals
* events
* restaurants
* attractions

---

### Tier 2 — Places API

Used for:

* nearby POIs
* venue details
* place enrichment

---

### Tier 3 — Grounding Lite

Used only when:

* DB lacks information
* open-ended discovery needed

---

# 13. Hermes Architecture

## Hermes does NOT orchestrate

Hermes only:

* scores
* ranks
* evaluates
* predicts

---

## Hermes Features

| Feature                 | Phase    |
| ----------------------- | -------- |
| Lead scoring            | Post-MVP |
| Nomad scoring           | Post-MVP |
| Ranking                 | Post-MVP |
| Behavioral intelligence | Advanced |

---

# 14. OpenClaw Architecture

## OpenClaw role

Operational execution only.

Examples:

* WhatsApp
* notifications
* reminders
* follow-ups
* broadcasts

---

## Important

OpenClaw is:

```text
NOT Phase 1
```

---

# 15. Recommended Repo Structure

```text
mdeapp/
  src/
    app/
    components/
    context/
    mastra/
    lib/
    workflows/
    agents/
    tools/

  packages/
    types/
    schemas/
    ui/
    maps/
    workflows/

  supabase/
    functions/
    migrations/

  tests/
    unit/
    e2e/
```

---

# 16. Recommended Implementation Order

# Phase 1 — Core Foundation

## Build first

1. CopilotKit + Mastra runtime
2. MapContext
3. Shared schemas
4. Shared cards
5. Supabase RLS
6. Places proxy
7. Grounding tool
8. Approval architecture

---

# Phase 2 — MVP

## Rentals

* Rental cards
* Rental pins
* Nearby search
* Lead capture
* Showings

## Events

* AI event creation
* Venue autocomplete
* Ticketing
* Stripe

---

# Phase 3 — Post-MVP

* Neighborhood intelligence
* Nomad scoring
* Route previews
* Recommendation ranking

---

# Phase 4 — Advanced

* OpenClaw
* WhatsApp
* Hermes automation
* Sponsor marketplace
* Lease review

---

# 17. Biggest Risks

| Risk                  | Severity |
| --------------------- | -------- |
| Too many agents       | High     |
| Duplicate workflows   | High     |
| Custom AI glue        | High     |
| Places cost explosion | High     |
| Hallucinated geo      | High     |
| Overengineering       | High     |

---

# 18. What Should NEVER Be Custom Built

| Do NOT build          | Use instead              |
| --------------------- | ------------------------ |
| Custom SSE            | AG-UI                    |
| Custom orchestrator   | Mastra                   |
| Custom AI runtime     | CopilotKit               |
| Custom map loader     | vis.gl                   |
| Custom approval queue | renderAndWaitForResponse |
| Custom routing system | routerAgent              |

---

# 19. Final Recommended Stack

| Area          | Final Choice             |
| ------------- | ------------------------ |
| Frontend      | Next.js 16               |
| AI UI         | CopilotKit 1.55.2        |
| Orchestration | Mastra                   |
| Maps          | vis.gl/react-google-maps |
| Backend       | Supabase                 |
| LLM           | Gemini                   |
| Payments      | Stripe                   |
| Deployment    | Vercel                   |
| Automation    | OpenClaw                 |
| Scoring       | Hermes                   |

---

# 20. Final Architecture Score

> **Planning vs code (2026-05-20):** Rows below score **design quality**, not shipped `mdeapp/` code. See [`prd-audit-report.md`](./prd-audit-report.md).

| Area                   |  Planning | `mdeapp` today |
| ---------------------- | --------: | -------------: |
| Overall architecture   | 86/100 | ~48/100 |
| AI architecture        | 85/100 | ~25/100 (pingAgent only) |
| Maps architecture      | 88/100 | 0/100 (not in mdeapp) |
| MVP clarity            | 88/100 | — |
| **Production readiness** | **N/A** | **No** — until MVP exit |

---

# 21. Final Recommendation

The strongest path is:

```text
CopilotKit
+ Mastra
+ Supabase
+ Google Maps
```

with:

```text
ONE concierge
ONE map system
ONE approval system
ONE workflow architecture
```

The biggest success factor is NOT more AI.

It is:

```text
simplifying architecture
reducing custom glue
keeping spatial truth reliable
keeping workflows deterministic
```

The platform moat becomes:

```text
Medellín-specific intelligence
+ conversational UX
+ map-backed trust
+ operational simplicity
```
