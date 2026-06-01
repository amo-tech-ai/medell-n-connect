---
status: reference-draft
canonical: ../prd/01-executive-strategy.md
audit: ./AUDIT-vs-prd-v7-2026-05-21.md
---

> **⚠️ Not canonical.** Execute from [`plan/prd/`](../prd/README.md) v7. This file = expanded draft (docs 01–03).

# Document 01 — Foundation Strategy

`01-foundation-strategy.md`

# 1. Executive Summary

mdeai is an AI-first, map-first conversational platform for Medellín.

The platform combines:

* rentals
* events
* nightlife
* restaurants
* attractions
* ticketing
* AI concierge workflows

into one shared conversational system.

Core user experience:

```text
chat + cards + live map + approvals + transactions
```

The system is designed around:

| Layer       | Responsibility               |
| ----------- | ---------------------------- |
| Supabase    | Source of truth              |
| Mastra      | Workflow orchestration       |
| CopilotKit  | Conversational UI            |
| Google Maps | Spatial truth                |
| Gemini      | Reasoning                    |
| Stripe      | Payments                     |
| OpenClaw    | Future operations automation |

---

# 2. Core Philosophy

## 2.1 One Platform

The platform is NOT:

```text
events app
+ rental app
+ restaurant app
```

The platform IS:

```text
one conversational operating system
for Medellín discovery and transactions
```

---

## 2.2 Maps Are Mandatory

The map is not decorative.

The map is:

* proof
* discovery
* trust
* navigation
* context

Every major workflow should connect to:

* map state
* place context
* grounded locations

---

## 2.3 AI Never Commits Directly

Golden rule:

```text
AI proposes
Human approves
System commits
```

AI can:

* draft
* rank
* suggest
* compare
* summarize

AI cannot:

* publish
* charge
* message at scale
* approve payouts
* bypass approvals

---

# 3. Business Goals

## Phase 1 Goals

| Goal                       | Success Metric               |
| -------------------------- | ---------------------------- |
| First ticket sold          | `event_orders.status = paid` |
| First rental lead          | row in `leads`               |
| AI event creation          | ≤ 30 seconds                 |
| Conversational rentals     | visible map pins             |
| Maps V2 stable             | no drift bugs                |
| Approval architecture live | all writes gated             |
| 90+ tests                  | CI verified                  |

---

# 4. Product Surfaces

| Surface           | Purpose                    |
| ----------------- | -------------------------- |
| `/`               | discovery landing          |
| `/chat`           | conversational concierge   |
| `/rentals`        | rental discovery           |
| `/events/:id`     | event purchase             |
| `/host/event/new` | AI-assisted event creation |
| `/admin/*`        | operations                 |
| `/me/tickets/:id` | ticket wallet              |

---

# 5. User Types

| User     | Purpose        |
| -------- | -------------- |
| Miguel   | digital nomad  |
| Camila   | event-goer     |
| Roberto  | host           |
| Patricia | operator/admin |
| Andrés   | door staff     |

---

# 6. Core Technical Decisions

## Locked decisions

| Area             | Decision                 |
| ---------------- | ------------------------ |
| Runtime          | Mastra only              |
| UI orchestration | CopilotKit 1.55.2        |
| Maps             | vis.gl/react-google-maps |
| Places           | Places API New           |
| Grounding        | Grounding Lite MCP       |
| DB               | Supabase                 |
| Payments         | Stripe                   |
| Deployment       | Vercel                   |
| State schemas    | Zod                      |
| Map rendering    | Advanced Markers         |

---

# 7. Architecture Principles

## Simplicity First

Avoid:

* custom runtimes
* custom SSE
* multiple orchestrators
* too many agents
* duplicated state
* duplicated schemas

Prefer:

* workflows
* typed contracts
* shared schemas
* deterministic systems
* approval gates
* observable operations

---

# 8. Operational Principles

## Every workflow must be:

* observable
* replayable
* testable
* typed
* approval-safe
* rollback-safe

---

# 9. AI Principles

## AI is used for:

* ranking
* summarization
* extraction
* comparison
* recommendations
* conversational UX

## AI is NOT used for:

* source-of-truth data
* geo facts
* pricing truth
* payment authority
* approval bypass

---

# 10. MVP Definition

MVP is achieved when:

1. Roberto creates an event via AI
2. Event publishes through approval flow
3. Camila purchases a ticket
4. Miguel finds rentals via chat + map
5. Rental lead captured
6. Maps + approvals stable
7. Production soak passes

---

# 11. Non-Goals

Not MVP:

* autonomous agents
* contests
* sponsor marketplace
* native rental booking
* WhatsApp automation
* OpenClaw orchestration runtime
* multi-agent swarms
* browser automation agents

---

# 12. Success Criteria

The platform succeeds if it becomes:

```text
the trusted conversational layer
for Medellín discovery and transactions
```

not merely:

* an AI demo
* a map demo
* a chatbot
* an event clone

---

---

# Document 02 — User Flows & Product Journeys

`02-user-flows.md`

# 1. Core UX Principle

Every user journey follows:

```text
conversation
→ cards
→ map
→ approval
→ transaction
```

---

# 2. Miguel — Rental Discovery

## Goal

Find a good apartment quickly.

---

## Flow

```text
/chat
→ asks for rentals
→ rental cards render
→ map pins appear
→ compares listings
→ submits lead
```

---

## Example

```text
“2 bedroom Laureles near coworking under $1500”
```

Result:

* cards
* coworking proximity
* map pins
* nearby cafés
* metro distance

---

# 3. Camila — Event Discovery

## Goal

Find events quickly without app installation.

---

## Flow

```text
landing page
→ conversational search
→ event cards
→ map pins
→ event detail
→ Stripe checkout
→ QR ticket
```

---

## Example

```text
“rooftops with salsa Friday under 50 mil”
```

---

# 4. Roberto — AI Event Creation

## Goal

Create events in seconds.

---

## Flow

```text
/host/event/new
→ sidebar opens
→ natural language prompt
→ AI fills form
→ preview card
→ approval
→ event published
```

---

## Example

```text
“Salsa night Friday at Café Le Gris with 3 ticket tiers”
```

AI fills:

* title
* venue
* date
* ticket tiers
* description

---

# 5. Patricia — Admin Operations

## Goal

Review and approve operations safely.

---

## Flow

```text
/admin/approvals
→ reviews AI proposals
→ approve/reject/edit
→ operations commit
```

---

# 6. Andrés — Door Staff

## Goal

Validate tickets quickly.

---

## Flow

```text
/staff/scan/:id
→ scan QR
→ validate
→ admit user
```

---

# 7. Unified Chat Model

The platform uses ONE chat system.

NOT:

* events chat
* rentals chat
* restaurant chat

Instead:

```text
one concierge
+ routing workflows
```

---

# 8. Shared Map UX

The map always stays synchronized with:

* visible cards
* active filters
* grounded places
* selected listings
* venue results

---

# 9. Comparative AI UX

The AI should answer from:

* visible results
* cached state
* visible pins

before re-querying tools.

Example:

```text
“Which one is cheapest?”
```

should answer instantly from visible state.

---

# 10. Human Approval UX

High-risk operations always show:

* preview
* approval
* reasoning
* edit option

---

# 11. Error UX

Failures should:

* degrade gracefully
* preserve user context
* never wipe draft state
* never silently fail

---

# 12. Mobile UX

The system is mobile-first.

Critical layouts:

* 390×844
* one-thumb interactions
* bottom-sheet map interactions
* sticky approval actions

---

# 13. Conversational Search Rules

Search should support:

* natural language
* neighborhoods
* lifestyle
* commute intent
* nightlife intent
* budget intent

---

# 14. AI UX Rules

AI should:

* explain clearly
* remain concise
* avoid hallucinations
* reference grounded places
* use structured cards
* never dump raw JSON

---

# 15. Success Criteria

The UX succeeds if:

* users trust recommendations
* users feel map context immediately
* users can transact without friction
* AI feels helpful, not gimmicky

---

---

# Document 03 — Core Architecture

`03-core-architecture.md`

# 1. System Architecture

```text
Frontend
→ CopilotKit
→ Mastra
→ Supabase
→ External APIs
```

---

# 2. Architecture Responsibilities

| Layer       | Responsibility     |
| ----------- | ------------------ |
| CopilotKit  | UI orchestration   |
| Mastra      | workflows + agents |
| Supabase    | source-of-truth    |
| Google Maps | spatial rendering  |
| Gemini      | reasoning          |
| Stripe      | payments           |
| OpenClaw    | future operations  |

---

# 3. Frontend Architecture

## Stack

* Next.js 16
* App Router
* shadcn/ui
* Tailwind
* CopilotKit
* vis.gl/react-google-maps

---

## Core frontend principles

* server-first
* typed state
* minimal client complexity
* generative UI
* stable shared state

---

# 4. CopilotKit Architecture

## Core primitives

| Primitive                | Use                 |
| ------------------------ | ------------------- |
| CopilotSidebar           | AI UI               |
| useCopilotAction         | frontend actions    |
| render                   | generative cards    |
| renderAndWaitForResponse | approvals           |
| useCoAgent               | bidirectional state |
| useCoAgentState          | read-only state     |

---

# 5. Mastra Architecture

## Core agents

| Agent           | Purpose        |
| --------------- | -------------- |
| routerAgent     | dispatch       |
| conciergeAgent  | main assistant |
| rentalAgent     | rentals        |
| eventAgent      | events         |
| hostEventAgent  | event creation |
| evaluationAgent | ranking        |

> **v7 MVP:** Register max **pingAgent, routerAgent, hostEventAgent, conciergeAgent (thin)**. Treat **rentalAgent / eventAgent / evaluationAgent** as **workflows + tools** on router — see [`plan/prd/03-runtime-orchestration.md`](../prd/03-runtime-orchestration.md).

---

## Agent rules

Avoid:

* many micro-agents
* nested orchestration
* agent fan-out

Prefer:

* workflows
* tools
* deterministic routing

---

# 6. Workflow Architecture

## Workflow responsibilities

Workflows:

* orchestrate
* sequence
* validate
* approve

Tools:

* retrieve
* compute
* enrich

---

# 7. Shared State Architecture

## Shared states

| State             | Purpose         |
| ----------------- | --------------- |
| MapState          | pins + viewport |
| EventDraftState   | event creation  |
| RentalSearchState | rental results  |
| ApprovalState     | HITL            |
| ChatUiState       | conversation    |

---

# 8. Maps V2 Architecture

## Stack

| Area        | Tool                     |
| ----------- | ------------------------ |
| Rendering   | vis.gl/react-google-maps |
| Markers     | Advanced Markers         |
| Clustering  | markerclusterer          |
| Place cards | ECL                      |
| Search      | Places API New           |
| Grounding   | Grounding Lite MCP       |

---

## Map Rules

| Rule                 | Why             |
| -------------------- | --------------- |
| one map loader       | stability       |
| one setPins writer   | consistency     |
| field masks required | cost control    |
| mapId mandatory      | AdvancedMarkers |
| AI never invents geo | trust           |

---

# 9. Search Architecture

## Search hierarchy

### Tier 1

Supabase:

* rentals
* events
* restaurants
* attractions

---

### Tier 2

Places API:

* nearby places
* enrichment
* autocomplete

---

### Tier 3

Grounding Lite:

* conversational geo discovery
* ambiguous searches
* recommendations

---

# 10. Approval Architecture

## Golden Rule

```text
AI never commits directly
```

---

## Flow

```text
AI proposal
→ approval request
→ user decision
→ commit RPC
→ database write
```

---

# 11. Database Architecture

## Supabase responsibilities

* auth
* RLS
* storage
* pgvector
* approvals
* telemetry
* payments
* cache tables

---

# 12. Observability Architecture

## Required systems

| System             | Purpose        |
| ------------------ | -------------- |
| Sentry             | runtime errors |
| correlation_id     | traceability   |
| ai_runs            | AI telemetry (mdeapp F13) |
| agent_tool_calls   | tool ledger    |
| grounding_call_log | cost control   |

---

# 13. Security Architecture

## Required protections

* RLS everywhere
* approval-gated writes
* service role server-only
* signed webhooks
* BotID protection
* typed schemas
* audit logs

---

# 14. Repo Architecture

## Principles

* repo-first
* schema-first
* typed contracts
* observable workflows
* stable APIs

---

## Shared packages

```text
packages/
  types/
  schemas/
  maps/
  workflows/
```

---

# 15. Technical Debt Rules

Never allow:

* duplicate schemas
* duplicate map writers
* hidden runtime state
* deploy-only edge functions
* direct DB writes from AI
* custom orchestration runtimes

---

# 16. Scaling Strategy

Scale through:

* deterministic workflows
* caching
* typed contracts
* stable APIs
* approval systems
* operational observability

NOT through:

* more agents
* more orchestration layers
* more AI glue

---

# 17. Final Architecture Principle

The system should feel:

```text
simple
predictable
observable
grounded
approval-safe
map-native
conversation-native
```

not:

* experimental
* magical
* fragile
* over-automated
