---
doc_id: EVENTS-PRD-V2-MASTRA-MAPS
title: Events PRD v2 — Mastra + Maps + Automation
version: 2.3.1
date: 2026-05-15
status: Active strategy — supersedes narrative-only roadmaps for cross-stack sequencing; **`prd.md` still wins** on product pillars
supersedes_narrative: tasks/events/docs/events-prd.md (v1.2 — keep for journeys/KPI detail)
audit_inputs:
  - tasks/audit/35-tasks-audit.md
  - tasks/mastra/progress-mastra.md
  - tasks/maps/maps-prd-v2.md
  - tasks/maps/07-mapsv2-tasks.md
  - tasks/maps/places-api-new-audit.md
skills_consulted:
  - index-skills.md
  - .claude/skills/mde-task-lifecycle/SKILL.md
  - .claude/skills/mde-supabase/SKILL.md (orchestrator)
  - .claude/skills/supabase-edge-functions/SKILL.md (reference)
  - .claude/skills/mastra/SKILL.md
  - .claude/skills/gemini/SKILL.md
  - .claude/skills/mde-maps/SKILL.md
  - .claude/skills/mde-stripe/SKILL.md
  - .claude/skills/mde-vercel/SKILL.md
  - .claude/skills/testing/SKILL.md
  - .claude/skills/mermaid-diagrams/SKILL.md
mcp_verification_note: >
  Mastra + official-doc ref scripts were run locally (2026-05-15): `npm run verify:mastra` exit 0;
  `VERIFY_OFFICIAL_URLS=1 npm run verify:official-doc-refs` exit 0 with warnings only.
  Live calls to user-mastra / user-supabase / google-maps-code-assist / Stripe / Vercel APIs were not executed in this doc session — mark remote state UNVERIFIED unless cited from audit.
gemini_official_docs_indexed: 2026-05-15 — URLs below are the canonical ai.google.dev guides; behavior must be re-checked on each implementation PR (models and flags change).
---

# Events PRD v2 — Mastra + Maps + Automation

**Canonical task index:** [`index-events.md`](./index-events.md) · **Roadmap:** [`events-roadmap.md`](./events-roadmap.md) · **Mermaid diagrams:** [`events-prd-v2-diagrams.md`](./events-prd-v2-diagrams.md) · **Diagram index (task spine):** [`events-diagram-index.md`](./events-diagram-index.md) · **Diagram roadmap:** [`events-diagram-roadmap.md`](./events-diagram-roadmap.md) · **Milestones:** [`events-milestones.md`](./events-milestones.md) · **Progress:** [`events-progress.md`](./events-progress.md) · **V2 diagram tasks:** [`V2-tasks/README.md`](./V2-tasks/README.md) ([`V2-tasks/`](./V2-tasks/) · `core/` … `production/`) · **Maps PRD v2:** [`../maps/maps-prd-v2.md`](../maps/maps-prd-v2.md) · **Forensic audit:** [`../audit/35-tasks-audit.md`](../audit/35-tasks-audit.md)

---

## 1. Executive Summary

| Topic | Assessment |
|-------|------------|
| **Current state** | **DB spine exists** for events/tickets (`supabase/migrations/20260503011925_event_phase1.sql` and follow-ons — `event_orders`, `event_attendees`, `event_check_ins`, `event_tickets`, `event_venues`, realtime triggers per later migrations). **Frontend** exposes public **`/events`** and **`/events/:id`** (`src/App.tsx`). **Chat** renders event cards with structured fields (`EventCardInline`, `normalizeToolOutput`). **Edge function layer** in this repo has **no** `ticket-checkout`, `ticket-payment-webhook`, or `ticket-validate` folders under `supabase/functions/` (12 functions present — AI, rentals, sponsor-roi-explain, google-directions, etc.). |
| **Biggest blockers** | (1) **Deterministic ticketing path** absent in repo edge tree — blocks live Stripe → QR → scan loop. (2) **`verify_jwt=false` globally** on edge stanzas per audit 35 — must be justified per handler (**P0: per-function auth matrix** — §16). (3) **Root `npm audit --omit=dev --high`** fails (incl. `paperclipai`) — governance stack unsafe until patched. (4) **Mastra events runtime** (`MASTRA-007`) still **Not Started**; maps: **MASTRA-066** + **PLACES-002** are **Completed** per task YAML; **068 / 074 / 067 / 049 / 048** and grounding runtime proof still open per `progress-mastra.md` (synced 2026-05-15). |
| **Document health (this file)** | **Strategy ~88/100** · **Implementation / runtime proof ~62/100** — architecture and sequencing are usable; production claims require EVT-103 spine + staged proof + remote parity (§16 verification debt). |
| **Revised product strategy** | Treat **Supabase + Stripe webhooks + idempotent RPCs** as the **only** path that mutates money, inventory, and door entry. Use **Maps + Places (New)** for discovery, `place_id` / `googleMapsLinks.placeUri`, routes, and nearby context. Use **Mastra** for orchestration, routing, and tool-gated proposals. Use **Gemini** for copy, moderation, summaries — **proposal-only** for anything user-visible unless human accepts. Use **OpenClaw** only **after** explicit approval + audit row. Use **Hermes** for scoring/ranking; **Paperclip** for approval gates — neither may bypass Supabase invariants. |
| **Revenue goal** | Keep **`docs/events-prd.md`** §1.3 targets (e.g. first mid-size event gross, zero oversell) as the Phase 1 bar; **do not** reset KPIs until ticketing is live-proven. |
| **Target launch criteria** | Ticket edge fns deployed **in this repo** (or documented external project with parity tests), Stripe webhooks signed + idempotent, scanner + staff-link revocation smoke, **50-buyer load test**, Lighthouse a11y ≥ 90 on gating surfaces, **`npm run floor`** green, remote Supabase migration parity **verified** (not assumed). |

### 1.1 Evolution: deterministic commerce + layered intelligence

The project intentionally moved from an **“AI-first event ideas”** posture to a **deterministic event commerce platform** with clear layers:

```text
Supabase + Stripe + idempotent edge RPCs     ← business truth (must work with zero LLM)
        ↓
Maps + Places (New) + routes + grounding   ← local intelligence (place_id, placeUri, attribution, quotas)
        ↓
Mastra (router, tools, workflows)          ← orchestration + chat UX (allow-listed tools; propose-only writes)
        ↓
Gemini                                     ← proposals / copy / moderation (Zod + Apply)
        ↓
Sponsors + campaigns + Postiz            ← revenue multiplier (after spine + maps proof)
        ↓
OpenClaw                                   ← approved execution worker (outbound, browser jobs) — last
        ↓
Hermes (read-side scoring) · Paperclip (governance records)
```

**Non‑negotiable:** no layer may **mutate** money, ticket inventory, or check-in authority except the **first** layer (Postgres + signed webhooks + ticket/validate edge contracts). Mastra, OpenClaw, and Hermes **observe or propose**; they do not replace Stripe or `ticket-validate`.

**Mastra / maps task alignment (see [`events-roadmap.md`](./events-roadmap.md)):**

| Layer | Examples (`tasks/mastra/tasks`) | Notes |
|-------|----------------------------------|--------|
| **Core spine (not Mastra)** | **EVT-103** documents missing `ticket-*` / `staff-link` under `supabase/functions/` | P0 — see §16 |
| **Maps production** | **066 ✅ · 073 ✅** (task YAML); remaining train **068 → 074 → 067 → 049 → 048**; **075/078** venue/nearby UX | Map ID, `placeUri`, grounding + **staging** quota/attribution proof |
| **Mastra events intelligence** | **MASTRA-041** (real `search-events` vs mock) **then** **MASTRA-007** (event agent pack) | 041 = discovery realism; 007 = concierge **after** EVT-103 reconciliation per **007** acceptance criteria |
| **Router / platform** | **005**, **011**, **018**, **019**, **012–015** | As in [`000-index.md`](../mastra/tasks/000-index.md) |
| **Sponsor vertical** | **042 → 063 → 064** | Parallel train; does not unblock ticketing |
| **OpenClaw** | **067–070** (and `tasks/openclaw/docs/*` research) | **Advanced** only — approvals + audit + quotas **in code** |

OpenClaw docs under `tasks/openclaw/docs/` are **capability research**; shipping order is **`events-roadmap.md`**, not those docs’ internal “Phase 1” sketches.

---

## 2. Current-State Audit

| Area | Current State | Evidence | Problem | Required Fix |
|------|---------------|----------|---------|--------------|
| **Event schema** | **Implemented (local migrations)** | `event_phase1` migration + taxes/fees + realtime broadcast files in `supabase/migrations/` | Live Supabase parity **UNVERIFIED** | MCP/SQL proof on prod; regenerate types if drift |
| **Checkout** | **Not in repo edge tree** | `Glob supabase/functions` → no `ticket-checkout`; audit 35 | PRD / todo gates imply checkout | Implement `ticket-checkout` + tests or move gates |
| **Webhook** | **Not in repo edge tree** | No `ticket-payment-webhook` folder | Cannot fulfill paid ticket lifecycle | Raw-body Stripe webhook + event id ledger |
| **Ticket validation** | **Not in repo edge tree** | No `ticket-validate`; EVT-103 | QR / staff scan blocked at edge | Implement + staff JWT + QR JWT per archived specs |
| **Scanner PWA** | **UNVERIFIED in `src/` routes** | `App.tsx` has `/events` only in quick scan; no `/staff/check-in` route found | PRD claims PWA | Wire routes + PWA manifest or defer claims |
| **Staff links** | **Spec in archive** | `tasks/archive/034-event-staff-link-generator-edge-fn.md` | No matching edge fn in tree | Implement staff-link edge + version bump contract |
| **Dashboard** | **UNVERIFIED host UI** | No `/host/event` routes in `App.tsx` grep | Organizer dashboard may be partial | Implement or document alternate surface |
| **Chat event creation** | **Partial** | Mastra/chat tools + cards; **MASTRA-007** not started | Chat purchase unsafe without backend | Keep discovery; block purchase intents until checkout |
| **Venues** | **EVT-039–044** (`V2-tasks/advanced/`) | Archive `tasks/archive/035–044` (legacy OS — reference only) | Maps spine not signed off | Execute after Map ID + Places masks + G1–G5 |
| **Sponsors** | **Strong schema + partial UI** | `README.md` sponsor tracker; migrations; `sponsor-roi-explain` exists | Stripe secrets + surface placement gaps per README | Close env + `SponsoredSurface` placement |
| **Restaurants** | **Planned** | `tasks/events/restaurants/071–072` | Mastra restaurant discovery not MVP-complete | Follow MASTRA-008 + schema tasks |
| **Maps** | **Partial — masks + attribution shipped** | `maps-prd-v2.md`; **MASTRA-066** + **PLACES-002** **Completed** (YAML); PLAN-001/046/053/054 etc. per `progress-mastra.md` | Grounding tool + Map ID prod chain (**068/074/067/049**), **048** enrichment | Sequence §1.1 / `events-roadmap.md` §0 |
| **Mastra** | **Geo/chat partial; events runtime open** | `progress-mastra.md` §2 | MASTRA-007 open | Ship event tools/workflows with propose-only |
| **Gemini** | **Edge + shared helpers** | `CLAUDE.md` table; `_shared/gemini` patterns | Must not gate payments | Structured output + evals (`MASTRA-036/011`) |
| **OpenClaw** | **Planned / partial scripts** | Tasks `067–070`, `maps-grounding-client`; archive specs | Execution without approval = risk | Approval + audit + rate limits |
| **Hermes** | **Architecture + audits** | `tasks/prompts/mastra/audits/hermes/`, archive 06A | Not production-bound to events | Define scoring inputs from Supabase only |
| **Paperclip** | **Deps + task specs** | `MASTRA-020`; root `paperclipai` audit issue | Critical advisories | Patch/remove per audit before prod governance |
| **Postiz** | **Planned** | Sponsor/marketing tasks | No prod without approval pipeline | Phase 4+ |
| **Supabase** | **Core platform** | RLS patterns in migrations | `verify_jwt` story | Per-function auth matrix |
| **Frontend** | **Vite SPA** | Events pages; chat map components | Mastra URL env guard | `VITE_MASTRA_SERVER_URL` required when flag on |

---

## 3. Revised Product Strategy

1. **Events are the transaction spine** — all paid attendance flows through `event_orders` → `event_attendees` → `event_check_ins` with Stripe as PSP.
2. **Venues are the operational spine** — capacity, layout, staff, availability link to Places `place_id` and persisted geometry/metadata.
3. **Sponsors are the revenue multiplier** — attach after core ticketing stable; attribution from clicks to orders stays in Postgres triggers.
4. **Maps are the discovery/context layer** — Places API (New) with strict field masks (`PLACES-002`), `placeUri`, Routes for directions, nearby search for post-event dining.
5. **Mastra is the orchestration layer** — route intents, call tools with allow-lists, stream structured actions to UI; **no** direct SQL writes from LLM tools.
6. **Gemini is proposal/copy/moderation** — descriptions, campaign drafts, moderation verdicts; user Accept/Edit/Dismiss per `CLAUDE.md` AI pattern.
7. **OpenClaw is approved execution** — outbound messages/delivery jobs only when `campaign_approvals`/Paperclip state allows.
8. **Hermes is intelligence/scoring** — ranking venues/sponsors/events from **read-only** features; outputs feed cards, not row mutations.
9. **Paperclip is governance/approval** — records human/CEO decisions; does not replace Supabase RLS.
10. **Supabase is source of truth** — all durable state; edge functions are adapters with explicit contracts.

---

## 4. User Personas

| Persona | Needs | Platform surfaces |
|---------|-------|---------------------|
| **Organizer (Sofía)** | Create/publish tiers, staff links, live KPIs, exports | Host wizard, dashboard, campaigns (later) |
| **Buyer (Camila)** | Pay, wallet, QR, calendar artifact | Checkout, `/me/tickets` (when routed) |
| **Staff (Roberto)** | Scan, offline tolerance, clear states | Scanner PWA |
| **Venue owner** | Availability, resources, bookings | Venue track prompts 036–044 |
| **Sponsor** | Apply, pay, ROI, contracts | `/sponsor/*` |
| **Platform admin** | Approvals, disputes, audits | Admin routes |
| **Concierge user** | Discover, compare, navigate | Chat + map cards |

---

## 5. Core User Journeys

| Journey | Deterministic backend | AI / automation |
|---------|----------------------|-----------------|
| **Create event** | Insert `events` + tiers | Mastra proposes copy; organizer accepts |
| **Pick venue w/ map** | Store `place_id`, lat/lng, `maps_url` | Places Autocomplete + Details (field masks) |
| **Publish** | State gates on required fields | — |
| **Buy ticket** | `ticket-checkout` session + tier lock RPC | None at pay click |
| **Receive QR** | Webhook fulfills `event_orders` / attendees | Email template copy may be AI-assisted |
| **Scan door** | `ticket-validate` updates `event_check_ins` | None |
| **Revoke staff link** | Bump `staff_link_version`, invalidate JWT | — |
| **Nearby restaurants** | Read persisted events + `search-restaurants` tool data | Mastra proposes list; pins from tool output |
| **Sponsor discovery** | Read sponsor tables | Hermes scoring + Gemini explanations (proposal) |
| **Campaign approval** | Row in `marketing.campaign_approvals` | Copy agent proposes; human approves |
| **OpenClaw after approval** | Job queue row `openclaw_jobs` (or equivalent) | Worker executes template send |

---

## 6. Feature Map

### Core MVP

- Event schema, host wizard, ticket tiers, **Stripe checkout edge**, **payment webhook**, **QR generation**, buyer wallet page, **staff scanner**, **staff link revoke**, host dashboard, **realtime check-ins**.

### Maps + Venues

- Venue picker (Places Autocomplete), **`place_id` + `googleMapsLinks.placeUri`**, production **Map ID**, route display (Routes API / `google-directions` patterns), nearby restaurants/attractions, **TTL cache**, grounded venue context with **attribution** (`MASTRA-066`, Maps PRD v2 §2.4).

### Mastra + Gemini

- Event concierge, drafting, description generation, image moderation, structured extraction, tool-gated workflows, **`ai_runs` logging**, evals/guardrails (`MASTRA-011`, `040`).

### Sponsors + Campaigns

- Sponsor schema (shipped per sponsor README), ROI explain edge, campaign builder, Postiz publishing, contracts, dashboards.

### OpenClaw / Hermes / Paperclip

- Approved delivery webhooks, WhatsApp/no-show flows, influencer outreach (warm-only), Hermes scoring feeds, Paperclip gates, audit logs.

---

## 7. Agent and Workflow Architecture

| Agent / Workflow | Tooling | Trigger | Writes DB? | Requires approval? | Failure mode |
|------------------|---------|---------|------------|--------------------|----------------|
| **event-concierge-agent** | Mastra + `search-events` + tools | User chat | **No** direct writes; proposes `ChatAction` | For publish/pay — yes | Lost tool output → `normalizeToolOutput` guards |
| **venue-intelligence-agent** | Places (New) MCP / server client | Host asks | Cache tables only via controlled RPC | Optional | Cost spike → field masks + TTL |
| **sponsor-match-agent** | Hermes + Gemini explain | Sponsor browse | **No** | For outbound — yes | Wrong fit → human review |
| **campaign-copy-agent** | Gemini structured | Organizer draft | **No** | **Yes** before send | Off-brand copy → evals |
| **check-in worker** | Edge `ticket-validate` | Staff scan | **Yes** `event_check_ins` | No | Double entry → idempotent scan key |
| **payment webhook worker** | Edge `ticket-payment-webhook` | Stripe | **Yes** orders/attendees | N/A (HMAC) | Duplicate events → ledger |
| **OpenClaw delivery worker** | OpenClaw gateway | Approved job | Delivery logs | **Yes** | Abuse → rate limits + kill switch |
| **Hermes scoring worker** | Edge or batch | Scheduled | **Yes** scores only | Configurable | Stale features → retrain |
| **Paperclip approval workflow** | Paperclip API | CEO/agent | Approvals metadata | Implicit | Until `paperclipai` audit clean — **not prod** |

**Rules:** LLMs **propose**; **deterministic** edge workers execute payments, inventory, check-ins; OpenClaw **post-approval**; Paperclip **records**; Supabase **owns truth**.

---

## 8. Supabase Backend Plan

| Concern | Direction |
|---------|-----------|
| **Tables** | `events`, `event_tickets`, `event_orders`, `event_attendees`, `event_check_ins`, staff link columns on `events` (per archived 034), `event_venues` (+ venue track), `sponsor.*`, `marketing.*` (when shipped), `ai_runs`, `grounding_quota_log`, job/audit tables for OpenClaw |
| **RLS** | Organizer-scoped writes; public selective reads; service role only in edge |
| **RPCs** | Tier capacity lock / checkout RPCs as per archived specs |
| **Edge functions** | See §9 |
| **Storage** | Ticket PDFs / images per tasks |
| **Realtime** | Broadcast triggers already in migrations — verify channels in client |
| **Audit** | `event_check_ins` + immutable webhook event ids |
| **Idempotency** | Stripe `event.id` + `event_orders.stripe_payment_intent` uniqueness |
| **Concurrency** | SQL `SELECT … FOR UPDATE` or equivalent in checkout RPC |

---

## 9. Edge Functions

| Function | Purpose | Auth | Idempotency | Tests required |
|----------|---------|------|-------------|----------------|
| `ticket-checkout` | Create Stripe session + hold tier capacity | User JWT + role | Checkout session idempotency key | Vitest + integration + load |
| `ticket-payment-webhook` | Fulfill order on `payment_intent.succeeded` | Stripe signature | Stripe event id dedupe | Webhook fixture suite |
| `ticket-validate` | Validate QR + write check-in | Staff JWT | Scan idempotency | Concurrency tests |
| `event-staff-link` (name TBD) | Mint/revoke staff JWTs | Organizer JWT | Version counter | Security tests |
| `event-photo-moderate` | Gemini moderation verdict | Service + user | Request hash | Safety + false positive |
| `event-description-generate` | Proposed copy | User JWT | None | Proposal-only contract |
| `campaign-plan` / `campaign-approve` | Marketing | Admin + service | Approval tokens | Policy tests |
| `openclaw-delivery-webhook` | Inbound receipts | HMAC secret | Event dedupe | Signature tests |
| `sponsor-roi-explain` | Exists — keep pattern | JWT + service | Cached responses optional | Extend for events KPIs |

---

## 10. Google Maps / Places Plan

Align with **`tasks/maps/maps-prd-v2.md`** and **`places-api-new-audit.md`**:

- **Maps JavaScript API** + **AdvancedMarkerElement** + **production Map ID** (`MASTRA-068`, `getGoogleMapsMapId()`).
- **Places API (New)** — Text Search / Nearby / Details / Photos / Autocomplete with **explicit field masks** (`PLACES-002`, `074`).
- **`googleMapsLinks.placeUri`** — never hand-build CID URLs (`PLACES-004`).
- **Routes API** — buyer → venue; respect Duration string parsing (v2 errata).
- **Geocoding** — fallback when no `place_id` (`079`).
- **Maps Grounding Lite** — MCP tools with **pageSize caps**, **server-side key only**, **attribution UI** before production visibility (`049`, `066`).

**Event use cases:** venue picker; buyer route; post-event nearby restaurants; sponsor “footfall context”; safe tourist copy (Gemini offline where Places summaries US-only).

---

## 11. Gemini plan (API + skill routing + Supabase boundary)

**Skill:** [`.claude/skills/gemini/SKILL.md`](../../.claude/skills/gemini/SKILL.md) — pick **CLI** vs **API (`generateContent`)** vs **Interactions** vs **Live** track before designing a feature. **Maps-specific grounding UI** still defers to **`mde-maps`** for ChatMap / Places field masks; this section covers **Gemini product capabilities** that touch events.

**Production reality (mdeai.co):** Supabase edge functions call Gemini via the **OpenAI-compatible** stack described in **`CLAUDE.md`**. The **Google GenAI SDK**, **Interactions API**, **Live API**, and **hosted tools** below are valid for **Mastra**, **batch enrichment scripts**, and **future** edge refactors — design so the same **proposal-only / tool-gated** rules apply regardless of wire path.

### 11.1 Official Gemini API docs — index for events strategy

Use these as the **contract** when pairing Gemini with **Supabase** (writes only via RPC/edge, never from model prose).

| Doc | URL | Events vertical use | Stays on Supabase / edge |
|-----|-----|---------------------|---------------------------|
| **Structured output** | [Structured output (recipe example)](https://ai.google.dev/gemini-api/docs/structured-output?example=recipe) | Event description drafts, moderation verdicts, campaign JSON, sponsor fit scores **as proposals** | Persist only after Zod validate + user/org **Apply** |
| **Function calling** | [Function calling (meeting example)](https://ai.google.dev/gemini-api/docs/function-calling?example=meeting) | Mastra/event-concierge tools: `search_events`, `get_venue_context` — **allow-listed** tools only | Tool handlers call Supabase with service role **inside** edge/Mastra, not from client |
| **Thinking** | [Thinking](https://ai.google.dev/gemini-api/docs/thinking) | Complex multi-constraint scheduling copy (e.g. run-of-show) — **optional** latency tradeoff | Do not enable thinking on **latency-critical** checkout paths |
| **Thought signatures** | [Thought signatures](https://ai.google.dev/gemini-api/docs/thought-signatures) | Multi-step agent flows where reasoning must round-trip safely | Store signatures only if required by model; **never** treat as user consent |
| **Long context** | [Long context](https://ai.google.dev/gemini-api/docs/long-context) | Ingest long sponsor contracts / event rider PDFs for **summarization** | Extracted claims → human verify before pricing/legal use |
| **Agents overview** | [Agents](https://ai.google.dev/gemini-api/docs/agents) | Pattern reference for **event concierge** + sub-agents (venue, sponsor) | Agent **never** holds Stripe secrets; orchestration calls edge |
| **Google Search** | [Google Search tool](https://ai.google.dev/gemini-api/docs/google-search) | Competitor event research, sponsor web facts — **proposal** with citations | Cache snippets in Postgres if needed; respect ToS + rate limits |
| **Maps grounding** | [Maps grounding](https://ai.google.dev/gemini-api/docs/maps-grounding) | Gemini + Maps **when** product uses native grounding path; complements **Maps Grounding Lite MCP** in `maps-prd-v2` | **Attribution** + billing; align with **`mde-maps`** + GROUNDING-001/066 |
| **Code execution** | [Code execution](https://ai.google.dev/gemini-api/docs/code-execution) | **Defer** for customer-facing events flows by default | If ever used: sandbox only, no prod DB credentials, no PII |
| **URL context** | [URL context](https://ai.google.dev/gemini-api/docs/url-context) | Fetch public event pages / sponsor sites for draft copy | Do not pass authenticated organizer URLs with session tokens |
| **Tool combination** | [Tool combination](https://ai.google.dev/gemini-api/docs/tool-combination) | `google_search` + `function_calling` + structured output in one turn for concierge | Order tools to minimize duplicate retrieval; log in `ai_runs` |
| **Live API** | [Live API](https://ai.google.dev/gemini-api/docs/live-api) | Future: real-time voice concierge at venue help desk | **Not** Phase 1; requires separate auth, abuse controls, and cost caps |
| **Webhooks** | [Webhooks](https://ai.google.dev/gemini-api/docs/webhooks) | Long-running batch enrichment (e.g. nightly sponsor summaries) | **Verify** signature + idempotency like Stripe; store delivery IDs |
| **Batch API** | [Batch API (file batch)](https://ai.google.dev/gemini-api/docs/batch-api?batch=file) | Bulk moderation / description backfill for `events` rows | Write results via **batch edge job** + idempotent keys |
| **Prompt caching** | [Caching](https://ai.google.dev/gemini-api/docs/caching) | Stable system prompts (organizer policy pack, sponsor tiers) | Cache keys in vault; **no** user PII in cached prefix |
| **Prompting strategies** | [Prompting strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies) | Few-shot for Spanish-first copy, tone, and refusal patterns | Version prompts in repo; test with `MASTRA-011` evals |

### 11.2 Skill track → events work packages

| `gemini` skill track | Open in skill | Events application |
|----------------------|----------------|---------------------|
| **API (`generateContent`)** | `api-development.md`, `structured-outputs.md`, `function-calling.md` | Edge `event-description-generate`, photo moderation, sponsor narrative |
| **Interactions** | `interactions.md` | Stateful multi-turn **host onboarding** (optional Phase 3+) |
| **Live** | `live-api.md` | **Out of scope** until Phase 1 ticketing proven |
| **CLI** | `gemini-cli.md` | Internal ops: audit prompts, large-doc review — **not** user-facing |

### 11.3 Non-negotiables (events + Gemini + Supabase)

- **Structured output** for every machine-consumed payload (moderation, extracted slots, tool args) — parse with Zod in edge/Mastra before DB write ([structured output](https://ai.google.dev/gemini-api/docs/structured-output?example=recipe)).
- **Function calling** only for tools that map to **read** or **proposed write** paths; money / inventory / check-in **only** in deterministic handlers ([function calling](https://ai.google.dev/gemini-api/docs/function-calling?example=meeting)).
- **Maps grounding** only with **`mde-maps`** + billing/attribution gates; Gemini Maps docs align with **Maps PRD v2** §2.x ([maps grounding](https://ai.google.dev/gemini-api/docs/maps-grounding)).
- **Google Search** + **URL context** for research flows — never exfiltrate private URLs or tokens ([Google Search](https://ai.google.dev/gemini-api/docs/google-search), [URL context](https://ai.google.dev/gemini-api/docs/url-context)).
- **Agents** pattern for orchestration — sub-agents remain **proposal-only** at UI boundary ([agents](https://ai.google.dev/gemini-api/docs/agents)).
- **Thinking / thought signatures** — use only where debugging or quality justify cost; document model IDs per env ([thinking](https://ai.google.dev/gemini-api/docs/thinking), [thought signatures](https://ai.google.dev/gemini-api/docs/thought-signatures)).
- **Long context** for rider/contract summarization — human must approve extracted action items ([long context](https://ai.google.dev/gemini-api/docs/long-context)).
- **Code execution** — default **off** for events vertical ([code execution](https://ai.google.dev/gemini-api/docs/code-execution)).
- **Tool combination** — design explicit tool DAG to avoid double billing ([tool combination](https://ai.google.dev/gemini-api/docs/tool-combination)).
- **Live API** — defer ([Live API](https://ai.google.dev/gemini-api/docs/live-api)).
- **Webhooks / Batch / Caching** — use for async enrichment with same RLS + audit rules as edge cron ([webhooks](https://ai.google.dev/gemini-api/docs/webhooks), [batch](https://ai.google.dev/gemini-api/docs/batch-api?batch=file), [caching](https://ai.google.dev/gemini-api/docs/caching)).
- **Prompting strategies** — Spanish-first, refusal, and “no payment language” baselines ([prompting strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)).

### 11.4 Implementation note (Supabase edge today)

Per **`CLAUDE.md`**, production edge calls Gemini through the **OpenAI-compatible** Gemini HTTP surface. When migrating a call site to **`@google/genai`** or **Interactions**, re-use the same **Zod + proposal-only** gates above and update **`verified_docs`** on the owning task file (`MASTRA-036`, sponsor fns, etc.).

---

## 12. OpenClaw / Hermes / Paperclip Plan

- **OpenClaw** — worker consumes **approved** jobs only; logs outbound payload hashes; rate + budget caps; no LLM direct channel access.
- **Hermes** — scoring from materialized features in Postgres; periodic batch or edge read; **no** autonomous purchases.
- **Paperclip** — human/CEO approvals for spend > threshold and for first-time activation templates; block until dependency audit clean.

---

## 13. Roadmap horizons (execution detail: `events-roadmap.md`)

Three horizons only — **no parallel “revenue” work** until the deterministic spine exists in repo + staging proof. Detailed phase labels in **`index-events.md`** still apply inside each horizon.

### Core MVP — truth + deterministic ticketing

- **Truth:** routes vs `App.tsx`, edge tree vs claims, migration parity on remote Supabase (MCP/SQL proof), **`npm run floor`** green, fix task drift (**EVT-103**).
- **Spine:** `ticket-checkout` → `ticket-payment-webhook` (raw body, idempotent) → order finalize → attendee → QR → `ticket-validate` → audit log → realtime; staff links + revocation; concurrency + load test.
- **Outcome:** ticket money path is **real on staging**, not schema + UI alone.

### Post-MVP — maps foundation + Mastra + sponsors (sequenced)

- **Maps:** **066** + **073** done. Remaining: **068 → 074 → 067 → 049** (then **048** enrichment per `maps-prd-v2.md`); Routes + `placeUri`; attribution + quota logging **proven on staging** (not only local).
- **Mastra:** **MASTRA-041** then **MASTRA-007**; structured outputs + tool gates + `ai_runs`; evals (**MASTRA-011** / **036** as listed in tasks).
- **Sponsors / campaigns / Postiz:** only after ticketing spine green **and** maps/attribution stable — no automation ahead of inventory truth.

### Advanced — automation + governance (hard gates)

- **OpenClaw** (`067–070`): only with **implemented** approvals, audit rows, quotas, rate limits — not policy prose alone.
- **Hermes + Paperclip:** only after **`npm audit --omit=dev --high`** clean (or `paperclipai` removed) — do not build governance on vulnerable deps.

**Hard freeze until Core MVP ships:** sponsor automation at scale, outbound OpenClaw sends, Hermes production scoring, monetization narrative — same as §16 top rows and [`events-roadmap.md`](./events-roadmap.md). **Exception:** **MASTRA-042** may land **helper-only** (`_shared/gemini` + tests, **no** new sponsor HTTP surfaces) — see task spec. **Layered stack:** §1.1.

---

## 14. Testing Strategy

Per phase run minimum:

```bash
npm run lint
npm run build
npm run test
npm run verify:edge
npm run verify:mastra
npm run floor

cd my-mastra-app
npm run typecheck
npm run test
```

If Supabase schema changes:

```bash
MDEAI_ALLOW_MIGRATION_EDIT=1 npm run verify:edge
supabase db reset
```

If Maps/Gemini env touched:

```bash
node --env-file=/home/sk/mde/.env.local scripts/verify-env-security.mjs
node --env-file=/home/sk/mde/.env.local scripts/verify-grounding-runtime.mjs || true
```

Include for each phase: unit, integration, edge, RLS, Stripe webhook, concurrency, Maps smoke, Gemini structured output, Playwright E2E (when flows exist), Lighthouse a11y, production smoke checklist.

---

## 15. Production Readiness Score

| Area | Score (/100) | Reason | Required fix |
|------|-------------:|--------|----------------|
| **Product strategy** | 88 | Architecture and separation of duties are right | Keep PRD as contract |
| **Product / journey** | 48 | Specs strong; live buyer→scan journey incomplete | Core MVP spine |
| **Backend** | 52 | Migrations exist; ticket edges missing | §9 functions + auth matrix |
| **Frontend** | 44 | Public events; host/ticket/scanner routes not proved | Wire flows + states |
| **AI governance** | 86 | Proposal-only + Zod + tool gates documented | Prove on staging |
| **AI / Mastra runtime** | 58 | Geo partial; **MASTRA-007** open | Ship after spine |
| **Maps strategy** | 88 | Map ID, masks, grounding plan align with Google guidance | Prove attribution + quota + cache on staging |
| **Maps production proof** | 55 | 066+073 done; 068/074/067/049/048 + live staging telemetry still open | Finish maps train + prove on staging |
| **Security** | 40 | JWT verify story + audit deps | Audit 35 + dep fix |
| **Testing (repo)** | 52 | Lint/build/vitest/verify scripts | Keep green |
| **Testing (real world)** | 38 | Stripe replay, webhook idempotency, Playwright buy path, load — mostly open | Staging + CI fixtures |
| **Revenue** | 35 | Cannot collect ticket revenue at edge | Stripe path |

**Implementation-weighted composite: ~47/100** (same bar: **NO-GO** for ticket monetization until Core MVP complete).

**Architecture / strategy-only lens (~58/100):** strong separation (Supabase truth, Stripe authority, edge determinism, Mastra orchestration, Gemini proposals) — dragged down by **runtime proof** (~40 band) and **ticketing reality** (~30 band). External review aligned 2026-05-14; see scores narrative in [`events-roadmap.md`](./events-roadmap.md).

---

## 16. Revised Task List (next)

| Task | Priority | Depends on | Blocks | Owner skill | Test gate | Definition of Done |
|------|----------|------------|--------|-------------|-----------|----------------------|
| **EVT-103 — implement `ticket-checkout`** | P0 | Schema migration applied | G1–G4 | mde-stripe, mde-supabase | `verify:edge` + Stripe test mode | Session creates PI; tier capacity enforced in SQL |
| **Implement `ticket-payment-webhook`** | P0 | EVT-103 | QR/email | mde-stripe | Webhook fixtures | Raw body verify; idempotent insert |
| **Implement `ticket-validate`** | P0 | webhook + staff link spec | Scanner | mde-supabase, testing | Concurrency vitest | `ALREADY_USED` path |
| **Staff link generator + revoke** | P0 | 034 spec | validate | mde-supabase | JWT tests | Version bump invalidates scanner tokens ≤60s |
| **Wire `/me/tickets` + scanner routes** | P0 | validate | UX | mde-vercel, testing | Playwright | E2E smoke passes |
| **Edge `verify_jwt` + auth matrix** | P0 | audit 35 | all `supabase/functions/*` | mde-supabase | Doc in repo + spot `verify:edge` | Each function: justified `verify_jwt: false` **or** JWT + handler auth; link to [Supabase Edge auth](https://supabase.com/docs/guides/functions/auth) + [function config](https://supabase.com/docs/guides/functions/function-configuration) |
| **Stripe webhook — signature + idempotency tests** | P0 | `ticket-payment-webhook` exists | EVT-103 | mde-stripe, testing | Deno tests in `supabase/functions/tests` | Raw body, **Stripe-Signature** verify, replay/idempotency ledger — [webhooks](https://docs.stripe.com/webhooks) · [signatures](https://docs.stripe.com/webhooks/signature) |
| **Staging smoke + remote DB parity** | P0 | migrations | deploy | mde-supabase | MCP / SQL diff + checklist | Prod/staging catalog matches repo migrations; scripted smoke for buyer→scan (even if manual first) |
| **MASTRA-041 — Supabase `search-events`** | P1 | `semantic_search_events` + RLS/service pattern | MASTRA-038 smoke | mastra-routing, mde-supabase | Vitest stub + live seed | Removes `MOCK_EVENTS`; Bogotá windows |
| **MASTRA-007 — events runtime** | P1 | EVT-103 + **MASTRA-041** (recommended) + 005…019 per task YAML | Chat flows | mastra | `verify:mastra` | Tool list + propose-only; **YAML** lists `EVT-103` |
| **MASTRA-068 / 074 / 067 / 049** | P1 | **066+073** complete (YAML) | Maps prod | mde-maps, gemini | UI + grounding smoke | Map ID + `placeUri` + attribution on staging |
| **Paperclip audit dep** | P0 | security | governance | testing | `npm audit --omit=dev` | 0 high/critical or remove pkg |

---

## 17. Red Flags / Blockers

- Missing ticket edge functions (confirmed).
- Global `verify_jwt=false` (audit 35).
- Oversell if webhook lacks idempotency + tier lock.
- Maps billing without field masks / pageSize caps.
- AI automation without approval (OpenClaw).
- Sponsor Stripe env gaps (per `README.md`).
- Task drift (750+ markdown files).
- CI weaker than local `floor` for Mastra Node version.

---

## 18. Final Recommendation

| Question | Answer |
|----------|--------|
| **Is current Events Phase 1 production-ready?** | **No** — ticket edge functions are absent in-repo; several journeys UNVERIFIED. |
| **Ship first?** | **Deterministic ticketing spine** (§16 top rows) + auth matrix + audit dependency fix. |
| **Defer?** | OpenClaw outbound automation, Hermes production scoring, Postiz publish, deep venue AI until Phase 1 green. |
| **Prove before monetization?** | Stripe webhook + load test + scanner + revocation + migration parity on live project. |

---

## Appendix A — Verification log (this change set)

| Command | Result (2026-05-15) |
|---------|---------------------|
| `npm run verify:mastra` | **exit 0** (after fixing `103` archive link, `places/*` SKILL paths, `progress-mastra` paths) |
| `VERIFY_OFFICIAL_URLS=1 npm run verify:official-doc-refs` | **exit 0**, 25 warnings |
| `npm run floor` | **Not run** in this session (docs-heavy); run before merge |

---

## Appendix B — Files touched for link hygiene (supporting verify:mastra)

- `tasks/mastra/tasks/advanced/103-ticket-payment-edge-functions-repo-gap.md`
- `tasks/mastra/maps/tasks/places/073–081` (relative links)
- `tasks/mastra/progress-mastra.md` (073–081 paths → `maps/places/`)

**New doc:** `tasks/events/events-prd-v2-mastra-maps-automation.md` (this file)

---

## Appendix C — Official validation links (contracts)

Use vendor URLs as the contract when implementing §16 (no `utm` parameters):

| Topic | URL |
|-------|-----|
| Google Maps — Map ID | [Map ID (Advanced Markers requirement)](https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over) |
| Google Maps — Advanced Markers migration | [Migrate to advanced markers](https://developers.google.com/maps/documentation/javascript/advanced-markers/migration) |
| Google Maps — Advanced Markers start | [Get started](https://developers.google.com/maps/documentation/javascript/advanced-markers/start) |
| Gemini — structured output | [Structured output](https://ai.google.dev/gemini-api/docs/structured-output) |
| Gemini — function calling | [Function calling](https://ai.google.dev/gemini-api/docs/function-calling) |
| Gemini — tools | [Tools](https://ai.google.dev/gemini-api/docs/tools) |
| Stripe — webhooks | [Receive Stripe events](https://docs.stripe.com/webhooks) |
| Stripe — signatures | [Verify signatures](https://docs.stripe.com/webhooks/signature) |
| Supabase — Edge Function auth | [Securing Edge Functions](https://supabase.com/docs/guides/functions/auth) |
| Supabase — function configuration | [Function configuration](https://supabase.com/docs/guides/functions/function-configuration) |
