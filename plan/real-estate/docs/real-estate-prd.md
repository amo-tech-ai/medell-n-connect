---
title: mdeai Real Estate Module — PRD + CopilotKit + OpenClaw/Hermes Architecture
version: 1.0.0
date: 2026-05-21
status: Decision-ready
stack_lock: CopilotKit 1.55.2 · Mastra · AG-UI · Next.js 16 · Supabase · Gemini · Google Maps/Places · Stripe (later)
canonical_companions:
  - plan/real-estate/draft/prd-real-estateV2.md
  - plan/real-estate/draft/roadmap.md
  - plan/01-copilotkit-plan.md
  - plan/02-repo-plan.md
  - plan/prd/04-product-surfaces.md §22
  - docs/CHAT-CENTRAL-PLAN.md
  - plan/events/events-copilotkit-mastra.md
sources_reviewed:
  - plan/real-estate/openclaw/14-openclaw-user-stories.md
  - plan/real-estate/openclaw/AI Agents for Real Estate.md
  - CopilotKit/examples/{integrations/mastra,v1/travel,v1/chat-with-your-data,v1/form-filling,showcases/generative-ui,showcases/banking}
  - mdeapp/src/mastra/agents/index.ts (pingAgent only — 2026-05-21)
  - /home/sk/mde/supabase/functions/{rentals,chat-lead-capture,ticket-*}
  - my-mastra-app (referenced in prd-real-estateV2 — port path UNVERIFIED in mdeapp)
verification_note: >
  Rental Mastra workflows exist in legacy my-mastra-app per PRD v2; mdeapp currently ships pingAgent only.
  CopilotKit v2 examples have no Mastra bridge — defer. OpenClaw/Hermes production paths UNVERIFIED on mdeai.co.
---

# mdeai Real Estate Module PRD

## How to read this document

| Part | Sections | Audience |
|------|----------|----------|
| **A — Product + CopilotKit + Mastra** | §1–§9 | Sofía implementing `mdeapp/` |
| **B — OpenClaw + Hermes** | §10–§21 | Ops, growth, WhatsApp (after Core MVP) |
| **Appendices** | Matrices, checklist, 30-day plan | Cursor / task authors |

**Strategy source of truth:** [`draft/prd-real-estateV2.md`](draft/prd-real-estateV2.md) · **Sequencing:** [`draft/roadmap.md`](draft/roadmap.md) · **Chat canvas:** [`docs/CHAT-CENTRAL-PLAN.md`](../docs/CHAT-CENTRAL-PLAN.md)

---

# Part A — Product, CopilotKit, Mastra

## 1. Executive Summary

The **Real Estate Module** is how mdeai wins **medium-term furnished rentals in Medellín** — chat-first discovery, map-backed trust, lead capture, showings, applications, and (later) booking with commission.

It shares the platform with events and restaurants but follows **CHAT-CENTRAL-PLAN**: one concierge canvas (`/` or `/chat`) with **three panels** (nav · conversation · map), not a separate AI stack per vertical.

| Capability | Plain language |
|------------|----------------|
| **Rental search chat** | Camila asks “2BR Laureles under $800, good Wi‑Fi” → ≤5 real listings, no hallucinated apartments |
| **RentalCard in chat** | Inline cards with photo, price, neighborhood, CTA — not walls of text |
| **Map pins** | Same search syncs to Advanced Markers + clustering on the right panel |
| **Lead capture** | “Contact host” → `leads` row + landlord notified |
| **Showing scheduler** | Propose slots → human confirms → `showings` row |
| **Landlord inbox** | Andrés sees qualified leads without monitoring WhatsApp at 2am |
| **Applications** | 4-step wizard → landlord summary (post-MVP core path) |
| **Lease review** | AI summary of lease PDF — **not legal advice** (post-MVP) |
| **Booking/payment** | Stripe + 12% commission — **after** first lead loop proven |

**Stack (non-negotiable):** CopilotKit **1.55.2** + in-process **Mastra** + **Supabase** truth + **Gemini** + **Places API New** with field masks. **No CrewAI, no LangGraph runtime, no CopilotKit v2** in Phase 1.

**OpenClaw + Hermes (Part B):** WhatsApp execution and ranking intelligence **after** web MVP + first booking. OpenClaw **never** writes money or inventory without approval.

---

## 2. Product Scope

### Core (inventory + CRM truth — no LLM required)

| In | Out |
|----|-----|
| ≥25 verified `apartments` rows (photos, COP/USD price, neighborhood) | Scraping / MLS ingest |
| RLS on `leads`, `showings`, `rental_applications`, `payments` | OpenClaw production sends |
| Unified `chat-lead-capture` (web + future WA adapter) | Hermes in hot path |
| `places-proxy` + `places_cache` + mask registry | LLM-triggered checkout |
| Landlord contact loop (listing → inbox) | Multi-city |
| Admin auth on `/admin/*` | |

**Tasks:** RE-001–RE-012 per [`draft/roadmap.md`](draft/roadmap.md).

### MVP (CopilotKit + Mastra + first booking)

| In | Out |
|----|-----|
| `/rentals` + `/chat` → Mastra (`conciergeAgent` + `rental-search`) | Full lease RAG |
| `useCopilotAction({ render })` RentalCard | WhatsApp concierge (OpenClaw) |
| Map pins (`mapId` + AdvancedMarker + clusterer) | Dynamic pricing |
| `routerAgent` / classify-intent in **one chat** | Dual edge `ai-router` as primary |
| Showing scheduler E2E | Sponsor marketplace |
| Application wizard | |
| Stripe rental webhook + `booking-create` | |
| Landlord dashboard MVP | |
| **Gate:** one paid booking + commission reconciled | |

**Tasks:** RE-013–RE-022.

### Post-MVP

| Area | Features |
|------|----------|
| Maps intelligence | Neighborhood scores, commute, coworking/restaurant proximity |
| Hermes ranking | Lead + listing rerank on labeled data |
| Landlord assistant chat | Inbox triage, applicant summaries |
| Content automation | Listing posts (manual approve → Postiz) |
| Eval suite | 50 golden rental queries, NDCG@5 |
| Mastra supervisor | Replace ad-hoc router with supervisor pattern |

### Advanced

| Area | Features |
|------|----------|
| OpenClaw WhatsApp | Approved templates, nurture, no-show recovery |
| Lease review workflow | PDF → structured risks |
| Hermes taste profiles + churn models | |
| OpenClaw growth machine | Broadcasts with Paperclip gates |
| Direct booking at scale | Stripe Connect landlord payouts |
| AI negotiation assistant | **Human-only** for offers |

---

## 3. Personas

| Persona | Role | Surfaces | MVP |
|---------|------|----------|:---:|
| **Camila** | Expat renter / ticket buyer | `/`, `/chat`, `/rentals`, `/me/tickets` | Search + lead |
| **Andrés** | Landlord | `/host/dashboard`, landlord inbox | Inbox + showings |
| **Carlos** | Local price-sensitive renter | WhatsApp (P2), chat | — |
| **Tourist** | Short discovery | `/chat` (rentals intent) | Cards in one chat |
| **Patricia** | mdeai admin | `/admin/*` | Listing moderation |
| **Juan** | Ops manager | Telegram alerts (P2) | — |
| **Sofía** | Engineer | `mdeapp/`, edge fns | Floor + RLS tests |

---

## 4. Best CopilotKit Examples (Top 10 for Real Estate)

**Monorepo:** [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit)  
**Local:** `/home/sk/mdeai/CopilotKit/examples/`  
**Rule:** Only [`integrations/mastra`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra) is the **runtime base**. Everything else is **pattern only**. **Do not use `examples/v2/`** until Mastra + CK v2 integration exists ([`plan/01-copilotkit-plan.md`](../01-copilotkit-plan.md)).

### Scoring rubric (100)

| Dimension | Pts |
|-----------|----:|
| Mastra / CK 1.55.2 alignment | 25 |
| Rental + map + concierge fit | 25 |
| Generative UI + HITL | 20 |
| Maps / search progress | 15 |
| Copy effort into mdeapp | 15 |

### Top 10 ranking (rentals-focused)

| Rank | Example | GitHub path | Score | Fit for mdeai |
|-----:|---------|-------------|------:|---------------|
| 1 | **integrations/mastra** | [examples/integrations/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra) | **99** | **Base runtime** — already in `mdeapp/` (F01, F13 `ai_runs`) |
| 2 | **v1/travel** | [examples/v1/travel](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/travel) | **90** | **Best map UX** — search progress, place cards; ⚠️ LangGraph agent — **UI + map state only** |
| 3 | **showcases/generative-ui** | [examples/showcases/generative-ui](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/generative-ui) | **94** | **RentalCard**, neighborhood cards, lead CTA via `render` |
| 4 | **v1/chat-with-your-data** | [examples/v1/chat-with-your-data](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/chat-with-your-data) | **91** | **Camila’s “under $800”** results layout; ⚠️ OpenAI adapter — **UI only** |
| 5 | **showcases/banking** | [examples/showcases/banking](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/banking) | **91** | HITL for showing confirm, application forward, booking |
| 6 | **v1/form-filling** | [examples/v1/form-filling](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/form-filling) | **88** | Application wizard + intake filters |
| 7 | **canvas/mastra** | [examples/canvas/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra) | **88** | `useCoAgent` + map/list shared state ([`CHAT-CENTRAL-PLAN`](../docs/CHAT-CENTRAL-PLAN.md)) |
| 8 | **showcases/deep-agents-job-search** | [examples/showcases/deep-agents-job-search](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/deep-agents-job-search) | **78** | Results table streaming; ⚠️ LangGraph — steal **JobsResults** for rental list |
| 9 | **canvas/mastra-pm** | [examples/canvas/mastra-pm](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra-pm) | **85** | Landlord pipeline / tasks board (post-MVP) |
| 10 | **integrations/mcp-apps** | [examples/integrations/mcp-apps](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mcp-apps) | **72** | Interactive place picker — Phase 2 |

**Does not fit (avoid for Phase 1):** `crewai-*`, `langgraph-*` showcases, `research-canvas` (Tavily), `v2/react/demo`, `multi-agent-canvas` (extra orchestrator).

### What to copy from each (files)

| Example | Copy / adapt | Reference only |
|---------|--------------|----------------|
| **mastra** | `src/app/api/copilotkit/route.ts`, `layout.tsx`, `CopilotSidebar`, `useCoAgent`, `getLocalAgentsWithLogging` | — |
| **travel** | Map component patterns, `search_progress` UI, pin sync | LangGraph `agent/` folder |
| **generative-ui** | `useCopilotAction({ name, render })` card components | — |
| **chat-with-your-data** | Results panel layout, filter chips | Runtime adapter |
| **banking** | `renderAndWaitForResponse`, role context | — |
| **form-filling** | Action `parameters` + shadcn form binding | — |
| **canvas/mastra** | `src/lib/canvas/state.ts` Zod for map + listing selection | Full canvas app shell |
| **deep-agents-job-search** | Streaming tool → results component | Python agent server |

---

## 5. Mastra + CopilotKit Foundation

### Confirm: `examples/integrations/mastra` is the base

**Yes.** Same decision as events ([`plan/events/events-copilotkit-mastra.md`](../events/events-copilotkit-mastra.md)) and [`plan/01-copilotkit-plan.md`](../01-copilotkit-plan.md).

| Keep from example | Delete / replace |
|-------------------|------------------|
| `api/copilotkit/route.ts` Pattern 1 | `weatherAgent` → `pingAgent` then `conciergeAgent` |
| `@ag-ui/mastra` bridge | `weatherTool`, demo components |
| `CopilotKit` provider + sidebar | OpenAI model refs |
| LibSQL dev memory (W1) | — |
| HITL samples in `page.tsx` | Replace with RentalCard actions |

### Map example features → mdeai real estate

| CK / Mastra pattern | mdeai feature | Phase |
|---------------------|---------------|-------|
| `useCoAgent` state | Selected listing id, filters, map bounds | MVP |
| Tool streaming | “Searching 43 listings…” | MVP |
| `useCopilotAction` render | RentalCard | MVP |
| `renderAndWaitForResponse` | Confirm showing slot | MVP |
| Working memory schema | `RentalSearchState` Zod | MVP |
| Router tool | `classify-intent` | MVP |
| `search-rentals` Mastra tool | SQL + pgvector | MVP (port legacy) |
| Places enrich tool | `places-proxy` | Post-MVP |
| Suspend/resume workflow | Showing picker | Post-MVP |

**Port source:** `my-mastra-app` — `rental-search-workflow`, `search-rentals`, `routerAgent`, `conciergeAgent` per PRD v2 §4.8 — **UNVERIFIED** already wired in `mdeapp/` (only `pingAgent` on disk 2026-05-21).

---

## 6. Real Estate Feature Adaptation Plan

| Feature | CK example | Mastra | Backend |
|---------|------------|--------|---------|
| Rental search chat | chat-with-your-data UI + mastra | `rental-search-workflow` | `apartments` + embeddings |
| Inline RentalCard | generative-ui | `emit-cards` tool | — |
| Google Maps pins | travel | `useCoAgentState` map slice | vis.gl + `mapId` |
| Neighborhood intelligence | travel + Places | `neighborhood-intelligence-workflow` | `places_cache`, Hermes P2 |
| Lead capture | generative-ui CTA | `create-lead` tool | `chat-lead-capture` edge |
| Showing scheduler | banking HITL | suspend/resume workflow | `showings` + edge |
| Landlord inbox | mastra-pm tasks UI | notifications only | `landlord_inbox`, Realtime |
| Application flow | form-filling | structured steps | `rental_applications` |
| Lease review | — | `lease-review-workflow` | Hermes batch + storage |
| Booking/payment | banking confirm | **no agent** | Stripe webhook |

---

## 7. Agent Design (Mastra runtime)

**Rule:** One **sidebar agent** per surface (`conciergeAgent` on `/` and `/chat`). Specialist logic = **tools + workflows**, not 8 sidebars.

| Agent (logical) | Runtime home | Purpose | Writes DB? |
|-----------------|----------------|---------|:----------:|
| **Router** | tool inside `conciergeAgent` | events vs rentals vs restaurants | No |
| **Rentals Search** | `rentalAgent` or workflow | ≤5 cards + explanation | No |
| **Neighborhood Intelligence** | workflow | scores + narrative | No |
| **Lead Qualification** | tool | BANT-style score → propose CRM row | No (edge commits) |
| **Showing Scheduler** | workflow + HITL | propose slots | No until user confirms |
| **Landlord Assistant** | optional admin agent P2 | summarize applicants | No |
| **Lease Review** | workflow P2 | PDF → risk flags | No |
| **Evaluation/Rerank** | `evaluationAgent` or step | order cards | No |

### Per-agent spec (implementation-ready)

#### Router Agent

| Field | Value |
|-------|-------|
| **Purpose** | Keep Camila in “rentals” context when she says “cheaper” after apartment results |
| **Inputs** | message, thread metadata |
| **Outputs** | `{ intent, confidence, activeVertical }` |
| **Tools** | `classify-intent` |
| **Mastra** | Tool call from `conciergeAgent` — **not** edge `ai-router` |
| **CK** | No separate UI |
| **Example** | “Anything in Envigado?” after rental search → stays rentals |
| **Safety** | confidence &lt; 0.6 → clarify |

#### Rentals Search Agent

| Field | Value |
|-------|-------|
| **Purpose** | Ranked listings for Medellín |
| **Inputs** | `FilterJson` (beds, hood, maxCop, wifi, furnished) |
| **Outputs** | `ToolResponse` envelope per [`CHAT-CENTRAL-PLAN`](../docs/CHAT-CENTRAL-PLAN.md) |
| **Tools** | `search-rentals`, `places-enrich` (P2) |
| **Tables** | Read `apartments`, `listing_embeddings` |
| **CK** | `useCopilotAction({ render: RentalCard })` |
| **Example** | Camila 11pm: 3 Poblado 1BR cards with scam-filter rejections table |

#### Neighborhood Intelligence Agent

| Field | Value |
|-------|-------|
| **Purpose** | “Is Laureles good for remote work?” |
| **Outputs** | `NeighborhoodReport` JSON + map layer |
| **Tools** | Places nearby, Routes commute, Grounding Lite |
| **Phase** | Post-MVP |
| **Example** | Walkability + coworking within 1km |

#### Lead Qualification Agent

| Field | Value |
|-------|-------|
| **Purpose** | Score lead before Andrés wakes up |
| **Outputs** | `lead_score`, `structured_profile` |
| **Hermes** | Computes score (read-only features) |
| **Commit** | `chat-lead-capture` edge on “Contact host” |
| **Example** | Score 87 — Camila, remote, 3-week move-in |

#### Showing Scheduler Agent

| Field | Value |
|-------|-------|
| **Purpose** | Propose viewing times |
| **Mastra** | Workflow **suspend** until slot picked |
| **CK** | `renderAndWaitForResponse` slot picker |
| **Tables** | `showings` on resume + edge |
| **Example** | Andrés confirms Thu 3pm → WA confirmation (P2) |

#### Landlord Assistant Agent

| Field | Value |
|-------|-------|
| **Purpose** | Summarize thread + applicant for Andrés |
| **Phase** | Post-MVP |
| **Safety** | No auto-reply to renter without approval |

#### Lease Review Agent

| Field | Value |
|-------|-------|
| **Purpose** | Extract clauses, flag unusual terms |
| **Outputs** | `LeaseReview` + “not legal advice” |
| **Phase** | Post-MVP / Advanced |
| **Hermes** | May pre-parse PDF batch |

#### Evaluation/Rerank Agent

| Field | Value |
|-------|-------|
| **Purpose** | Order ≤5 cards for nomad persona |
| **Signals** | wifi, price z-score, freshness, Hermes |
| **Phase** | Post-MVP |

---

## 8. Google Maps v2 Features

Per [`prd-real-estateV2.md`](draft/prd-real-estateV2.md) §5 and [`plan/prd/04-product-surfaces.md`](../prd/04-product-surfaces.md).

| Feature | Use in mdeai | Phase | Notes |
|---------|--------------|-------|-------|
| **Places API (New)** | Venue enrichment, coworking/restaurant context | MVP proxy | **Every call** uses `X-Goog-FieldMask` |
| **Advanced Markers** | Listing + place pins | MVP | Parent `<Map mapId={...}>` required |
| **Marker clustering** | Dense Poblado pins | MVP | `@googlemaps/markerclusterer` |
| **Place Details** | Building amenities, hours | Post-MVP | Via `places_cache` |
| **Place Photos** | Card thumbnails attribution | MVP | Storage + Places photo ref |
| **Routes API** | “10 min to metro” | Post-MVP | `compute-commute` tool |
| **Distance Matrix** | Compare hoods | Advanced | Batch only |
| **Nearby Search** | Coworking, gyms, cafés | Post-MVP | Neighborhood workflow |
| **Maps Grounding Lite** | Agentic grounded answers | Post-MVP | MCP dev; prod via proxy |
| **Map card UX** | Right panel in chat-central | MVP | Sync with `useCoAgentState` |

**Medellín examples (product copy, not hallucinated):**

- “Best apartments near coworking” → Places type `coworking_space` + listing filters  
- “Quiet digital nomad area” → Laureles vs Poblado scores  
- “10 min from Aguacatala metro” → Routes API  
- “Walkable cafés” → Places + walkability dimension  

---

## 9. Workflow Design

### Renter intake → listings → lead

```text
Camila @ /chat → conciergeAgent
  → classify-intent → rentals
  → rental-search-workflow (SQL/vector ≤5)
  → stream RentalCards (CK render)
  → map pins update (coagent state)
  → "Contact host" → chat-lead-capture edge → leads row
  → notify landlord_inbox (Realtime)
```

### Map search → neighborhood score → cards

```text
User pans map → filter bounds → search-rentals
  → (P2) neighborhood-intelligence-workflow
  → Hermes rerank → cards
```

### Schedule showing

```text
User asks viewing → showing-schedule-workflow suspends
  → CK ApprovalPanel / slot picker
  → resume → edge creates showing
  → (P2) OpenClaw sends WA confirm (approved template)
```

### Application → landlord

```text
form-filling style wizard → rental_applications
  → HITL forward → landlord dashboard summary
```

### Lease review

```text
Upload PDF → lease-review-workflow (propose only)
  → user acknowledges disclaimer
```

### Later: Stripe booking

```text
User explicit checkout click → booking-create edge
  → webhook → payments (no LLM)
```

---

# Part B — OpenClaw + Hermes Architecture

## 10. Executive Summary (OpenClaw + Hermes)

| System | Role | Analogy for mdeai |
|--------|------|-------------------|
| **Supabase** | Source of truth | Ledger + inventory + leads |
| **Mastra + CopilotKit** | Conversational brain (web/app) | Camila’s 11pm chat UI |
| **Hermes** | **Scoring + intelligence only** | “Should Andrés call this lead first?” |
| **OpenClaw** | **Approved execution layer** | Sends the WhatsApp after Juan approves |
| **Paperclip** | Approval + budget gates | Blocks rogue broadcasts |

**Together:** Camila gets instant answers on web/WhatsApp; Hermes ranks the lead; OpenClaw sends **only approved** messages; Andrés sees qualified inquiries at breakfast; Patricia audits via Telegram.

**Medellín moat:** Hyperlocal neighborhood intelligence + bilingual concierge + multi-source scam filter ([`CHAT-CENTRAL-PLAN`](../docs/CHAT-CENTRAL-PLAN.md)) — not generic Zillow chat.

**Persona examples:**

| Persona | OpenClaw | Hermes |
|---------|----------|--------|
| **Camila** (expat renter) | WA concierge intake | Lead score 87 |
| **Andrés** (landlord) | Morning notify | Listing freshness score |
| **Roberto** (event host) | Event promo (advanced) | Sponsor fit |
| **María** (sponsor) | — | Brand alignment score |
| **Juan** (ops) | Telegram alerts | Anomaly detection |

---

## 11. Core OpenClaw Real Estate Features

Design modules — **all outbound requires approval** until gates exist ([`14-openclaw-user-stories.md`](openclaw/14-openclaw-user-stories.md)).

### A. Lead Capture

| Channel | Flow |
|---------|------|
| WhatsApp intake | OpenClaw → normalize message → `create-lead` edge |
| Website | CopilotKit CTA → same edge |
| Instagram / email | Parser agent → draft lead → human confirm |

**Tables:** `leads`, `contacts`, `conversations`

### B. AI Concierge

| Capability | Owner |
|------------|-------|
| Rental discovery | Mastra `rental-search` (web); OpenClaw mirrors for WA |
| Map-aware replies | Places cache + Hermes context |
| Bilingual EN/ES | Gemini prompts (Phase 2 Lingui for UI) |
| Lease Q&A | Mastra tool — disclaimer required |

### C. Lead Qualification

| Signal | Hermes input |
|--------|--------------|
| Budget fit | ✅ |
| Urgency / timeline | ✅ |
| Remote worker | ✅ |
| Message quality | ✅ |
| Booking intent | ✅ |

**Output:** `lead_score` — OpenClaw **never** auto-messages landlord without policy.

### D. Showing Automation

| Step | System |
|------|--------|
| Propose slots | Mastra suspend/resume |
| Confirm | HITL |
| Reminders | OpenClaw cron (approved) |
| No-show recovery | OpenClaw follow-up agent (approved) |

### E. Landlord Automation

| Feature | Surface |
|---------|---------|
| Inbox | `/host/dashboard` |
| Applicant summary | Post-MVP agent |
| Analytics | Hermes + SQL |

### F. Follow-Up System

| Trigger | Action |
|---------|--------|
| Stale lead 72h | Draft follow-up → Paperclip → OpenClaw send |
| No-show | Recovery sequence (approved) |

### G. Content Engine

| Output | Gate |
|--------|------|
| IG post for listing | Human approve → Postiz |
| WA broadcast | **Advanced** — suppression list |

---

## 12. Hermes Engine Design

**Hermes never mutates production rows.** Reads Supabase + artifacts; writes `scoring_logs` / batch tables only.

### A. Lead Scoring (0–100)

| Feature | Weight (indicative) |
|---------|---------------------|
| Budget match | 0.25 |
| Urgency | 0.20 |
| Timeline clarity | 0.15 |
| Engagement | 0.15 |
| Remote worker fit | 0.10 |
| Neighborhood match | 0.15 |

**Example:** Camila → 87 → Telegram alert to Juan.

### B. Apartment Ranking

| Signal |
|--------|
| Wi‑Fi quality |
| Walkability |
| Coworking proximity |
| Safety proxy (curated table) |
| Landlord responsiveness |
| Price vs `market_snapshots` |
| Listing freshness |

### C. Neighborhood Intelligence

Structured profiles: **Laureles, Poblado, Envigado, Sabaneta, Manila** — scores + narrative snippets for concierge.

### D. Behavioral Intelligence

| Metric | Use |
|--------|-----|
| Repeat searches | Taste profile |
| Churn risk | Nurture timing |

### E. Sponsor + Influencer Scoring (Advanced)

Event vertical crossover — Phase 3+.

---

## 13. OpenClaw Agent System

| Agent | Triggers | Approvals | Supabase | CK UI |
|-------|----------|-----------|----------|-------|
| **Concierge** | Inbound WA/web | Template allowlist | leads, threads | Same Mastra prompts |
| **Rentals Search** | Intent=rentals | None | apartments read | Cards via sync |
| **Neighborhood** | “Is X hood safe?” | None | places_cache | Map narrative |
| **Lead Qualification** | New thread | Auto score only | leads update | — |
| **Follow-Up** | Cron stale | **Every send** | outreach_messages | — |
| **WhatsApp** | Channel | Rate limit | suppression_list | — |
| **Content** | Listing published | **Every post** | social_posts | — |
| **Landlord Assistant** | New applicant | Forward to landlord | applications | Dashboard |
| **Showing Scheduler** | Viewing request | Slot confirm | showings | HITL |
| **Operations Monitoring** | Errors, budget | Alert only | ai_runs | — |
| **Suppression & Compliance** | STOP keyword | Immediate halt | suppression_list | — |
| **Human Approval** | Paperclip queue | Human | approval_requests | — |

**References:** [OpenClaw](https://github.com/OpenClaw/OpenClaw), [AI agents for real estate](https://www.remoteopenclaw.com/blog/ai-agents-for-real-estate), user stories in [`openclaw/14-openclaw-user-stories.md`](openclaw/14-openclaw-user-stories.md).

---

## 14. MVP vs Advanced (Architecture)

| Layer | Core MVP | Post-MVP | Advanced |
|-------|----------|----------|----------|
| Web chat + cards | ✅ | | |
| Map pins | ✅ | enrich | |
| Lead capture | ✅ | | |
| Mastra rental workflow | ✅ | evals | |
| WhatsApp concierge | | pilot | scale |
| Hermes hot path | | shadow | production rank |
| OpenClaw outbound | | templates | autonomous sequences |
| Lease AI | | | ✅ |
| Booking | | stripe | optimize |

**Freeze until MVP green:** OpenClaw prod outbound, Hermes-automated sends, scraping ingest ([`draft/roadmap.md`](draft/roadmap.md) §2).

---

## 15. Supabase Architecture

### Core tables (existing or planned — verify remote)

| Table | Purpose |
|-------|---------|
| `apartments` | Listings + geo |
| `listing_embeddings` | Semantic search |
| `leads` | CRM |
| `contacts` | People |
| `conversations` | Thread metadata |
| `showings` | Viewings |
| `rental_applications` | Apps |
| `payments` / `bookings` | Commerce |
| `landlord_inbox` | Host notifications |
| `places_cache` | Maps cost control |
| `ai_runs` | Agent observability (F13 ✅) |
| `outreach_messages` | OpenClaw audit |
| `suppression_list` | WA compliance |
| `scoring_logs` | Hermes outputs |
| `neighborhoods` | Curated profiles |
| `market_snapshots` | Weekly Hermes |

### RLS principles

- Renters read published listings only  
- Landlords read own listings + leads on those listings  
- Service role **edge only** — never in `mdeapp/src`  
- Every new table: RLS + ≥1 policy  

### Realtime

- `landlord_inbox` → Andrés mobile notify  
- Optional: lead insert → Paperclip task (P2)  

---

## 16. WhatsApp + Telegram Operations

| Control | Implementation |
|---------|----------------|
| Operating hours | Gateway schedule (e.g. 7am–11pm COT) |
| STOP | Suppression agent → instant opt-out |
| Rate limits | Max N outbound / day / number |
| Escalation | score &gt; 85 → human queue |
| Telegram | Morning digest for Juan: leads, spend, errors |
| Budget alerts | OpenClaw token/spend caps |

**Daily ops example:** Juan receives “3 high-score leads, 1 failed webhook, 0 suppression hits.”

---

## 17. CopilotKit + Mastra + OpenClaw Integration

```text
┌─────────────────────────────────────────────────────────────┐
│  CopilotKit UI (Next.js)                                      │
│  useCoAgent · useCopilotAction(render) · HITL               │
└───────────────────────────┬─────────────────────────────────┘
                            │ AG-UI
┌───────────────────────────▼─────────────────────────────────┐
│  Mastra (in-process) — conciergeAgent, workflows, tools      │
│  propose-only writes                                          │
└───────────┬─────────────────────────────┬───────────────────┘
            │ read/write via edge         │ scores (read-only)
┌───────────▼──────────────┐   ┌────────▼────────┐
│  Supabase edge fns        │   │  Hermes batch   │
│  leads, checkout, places  │   │  ranking        │
└───────────┬──────────────┘   └─────────────────┘
            │
┌───────────▼──────────────┐
│  OpenClaw (approved only) │ → WhatsApp / Telegram
└──────────────────────────┘
```

| Pattern | Use |
|---------|-----|
| `useCoAgent<RentalSearchState>` | Filters + selected listing + map bounds |
| `useCopilotAction({ render })` | RentalCard |
| `renderAndWaitForResponse` | Showing + application approve |
| Shared state | CHAT-CENTRAL three-panel sync |
| Memory | Thread scope; router stateless |

---

## 18. Risks + Compliance + Best Practices

| Risk | Mitigation |
|------|------------|
| **Dual routers** (edge + Mastra) | Deprecate edge `ai-router`; log parity RE-023 |
| **WhatsApp ban** | Templates, rate limits, suppression |
| **Spam / Ley 1581** | Opt-in, audit log, no cold blast |
| **Fair housing** | No discriminatory filters; human review |
| **AI hallucinated listings** | DB-only cards; empty state honest |
| **LLM money writes** | Stripe edges only |
| **Places cost** | `places_cache` + masks |
| **PII in logs** | SensitiveDataFilter; redact phone |
| **OpenClaw over-automation** | Paperclip + freeze until MVP |
| **Landlord abuse** | Report listing; admin queue |

**Best practices:**

- AI proposes → user confirms → edge commits  
- Cache Places 24–72h  
- Vitest RLS negatives + rental golden queries  
- One worktree per PR ([`mde-worktree-pr-flow`](../.claude/skills/mde-worktree-pr-flow/SKILL.md))  

---

## 19. Real-World User Flows

| # | Flow | Story |
|---|------|-------|
| 1 | Expat renter 2am | Camila WA/chat → 3 cards → lead 87 |
| 2 | Landlord morning | Andrés inbox → confirm showing 30s |
| 3 | WA showing book | HITL slot → confirm |
| 4 | No-show recovery | Approved follow-up |
| 5 | Stale lead nurture | Paperclip approved message |
| 6 | Neighborhood reco | Laureles vs Poblado scores |
| 7 | Telegram ops alert | Juan high-score lead |
| 8 | Sponsor outreach | Advanced — approval gate |
| 9 | Apartment social post | Postiz after approve |
| 10 | Influencer discovery | Advanced |

Full narratives: [`openclaw/14-openclaw-user-stories.md`](openclaw/14-openclaw-user-stories.md).

---

## 20. Roadmap Phases

| Phase | Goal | Key deliverables |
|-------|------|------------------|
| **Core** | Inventory + CRM truth | RE-001–012 |
| **MVP** | Chat + cards + map + first booking | RE-013–022, CK top 5 examples |
| **Post-MVP** | Maps intelligence + Hermes shadow | RE-023–032 |
| **Advanced** | OpenClaw + lease + marketplace | RE-033+ |

Aligns with [`draft/roadmap.md`](draft/roadmap.md) layered stack (1) Supabase → (2) Mastra → (3) Stripe → (4) Maps → (5) Hermes → (6) OpenClaw.

---

## 21. Final Recommendation — “Use These Examples First”

| Example | URL | Feature | Score | Why | Phase | Action |
|---------|-----|---------|------:|-----|-------|--------|
| integrations/mastra | [link](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra) | Runtime | 99 | Only Mastra+CK base | W1 | **Copy** — in mdeapp |
| v1/travel | [link](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/travel) | Map + search UX | 90 | Best rental map pattern | W5–6 | **Adapt** UI only |
| showcases/generative-ui | [link](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/generative-ui) | RentalCard | 94 | Inline cards | W5 | **Copy** render pattern |
| v1/chat-with-your-data | [link](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/chat-with-your-data) | Results layout | 91 | Camila list UX | W6 | **Adapt** UI only |
| showcases/banking | [link](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/banking) | HITL | 91 | Showing/application | W6–7 | **Copy** HITL |
| v1/form-filling | [link](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/form-filling) | Intake/application | 88 | Forms | W7 | **Adapt** |
| canvas/mastra | [link](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra) | Shared state | 88 | 3-panel chat | W6 | **Adapt** state |
| showcases/deep-agents-job-search | [link](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/deep-agents-job-search) | Results table | 78 | Streaming list | W5 | **Reference** |
| canvas/mastra-pm | [link](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra-pm) | Landlord tasks | 85 | Inbox ops | W8+ | **Reference** |
| integrations/mcp-apps | [link](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mcp-apps) | Place picker | 72 | Map click | P2 | **Reference** |

### Build first (engineering order)

1. **Core** listings + RLS + `chat-lead-capture`  
2. **`integrations/mastra`** path — port `conciergeAgent` + `search-rentals` from `my-mastra-app`  
3. **`generative-ui` + `travel`** — RentalCard + map panel  
4. **`banking` HITL** — showing confirm  
5. Port **ticket-style** idempotent Stripe from events/legacy for **rental booking**  
6. **Hermes shadow mode** (log scores, don’t act)  
7. **OpenClaw** pilot one approved template  

### Do NOT build early

- CopilotKit v2 demo runtime  
- LangGraph rental agent server  
- OpenClaw unsupervised broadcasts  
- Hermes-automated outbound  
- Lease RAG before first booking  
- Scraping ingest  

### Biggest opportunities

- Medellín-specific **nomad scoring** (Wi‑Fi, coworking, scam filter)  
- **One chat** for rentals + events + food ([`CHAT-CENTRAL-PLAN`](../docs/CHAT-CENTRAL-PLAN.md))  
- WhatsApp channel for LATAM after web proof  

### Biggest risks

- Dual router drift  
- Zero listings → hollow AI  
- WhatsApp compliance misstep  

---

## Appendix A — Feature matrix (condensed)

| Feature | Core | MVP | Post | Adv | Agent | CK example |
|---------|:---:|:---:|:----:|:---:|:-----:|------------|
| Inventory | ✅ | | | | — | — |
| Rental chat | | ✅ | | | concierge | mastra |
| RentalCard | | ✅ | | | concierge | generative-ui |
| Map pins | | ✅ | | | state | travel |
| Lead capture | ✅ | ✅ | | | tool | generative-ui |
| Showing scheduler | | ✅ | ✅ | | workflow | banking |
| Landlord inbox | | ✅ | ✅ | | — | mastra-pm |
| Application | | | ✅ | | host | form-filling |
| Lease review | | | | ✅ | workflow | — |
| WA OpenClaw | | | | ✅ | channel | — |
| Hermes rank | | | ✅ | ✅ | batch | — |
| Stripe booking | | ✅ | ✅ | | edge | banking |

---

## Appendix B — MVP checklist

- [ ] ≥25 `apartments` seeded (RE-001)  
- [ ] `chat-lead-capture` unified (RE-006)  
- [ ] `places-proxy` + masks (RE-007)  
- [ ] `conciergeAgent` + `rental-search-workflow` in mdeapp (RE-013–014)  
- [ ] RentalCard `useCopilotAction` (RE-014)  
- [ ] Map `mapId` + AdvancedMarker + cluster (RE-014)  
- [ ] `classify-intent` — single router (RE-023)  
- [ ] Showing E2E + HITL (RE-015)  
- [ ] Stripe rental webhook (RE-017)  
- [ ] One paid booking gate (RE-022)  
- [ ] `npm run floor` + localhost gate 9  
- [ ] No service role in client  
- [ ] F13 `ai_runs` on rental turns ✅  

---

## Appendix C — 30-day implementation plan

| Week | Focus | Verify |
|------|-------|--------|
| W1 | RE-001–006 listings + leads | SQL + lead row |
| W2 | RE-007–012 places cache + RLS tests | mask + negative tests |
| W3 | Port Mastra rental agent; CK RentalCard | cards in chat |
| W4 | Map panel + travel patterns | pins sync |
| W5 | Router + one-chat; RE-015 showing | E2E showing |
| W6 | RE-016–017 application + Stripe | test payment |
| W7 | RE-019 landlord dashboard | Andrés smoke |
| W8 | RE-021–022 booking gate | commission row |

---

## Appendix D — Files reviewed

| Path | Status |
|------|--------|
| `plan/real-estate/draft/prd-real-estateV2.md` | Read §0–§5, §4 agents |
| `plan/real-estate/draft/roadmap.md` | Read |
| `plan/real-estate/openclaw/14-openclaw-user-stories.md` | Read |
| `plan/01-copilotkit-plan.md` | Read |
| `plan/02-repo-plan.md` | Grep rentals |
| `docs/CHAT-CENTRAL-PLAN.md` | Read §1–3 |
| `plan/events/events-copilotkit-mastra.md` | Cross-ref |
| `mdeapp/src/mastra/agents/index.ts` | Verified pingAgent only |
| `/home/sk/mde/supabase/functions/rentals` | Exists (legacy) |
| CopilotKit `examples/integrations/mastra` | Local monorepo |

---

*End of Real Estate Module PRD v1.0.0 — 2026-05-21*
