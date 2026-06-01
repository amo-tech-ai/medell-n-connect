# mdeai — progress & status (2026-05-30)

One-screen status. Forensic detail → [`progress/may30.md`](progress/may30.md) · mistakes to avoid → [`LESSONS.md`](LESSONS.md).

> **Dots:** 🟢 done+verified · 🟡 partly done · 🟥 blocked/failing · ⚪ not started.

---

## TL;DR

- **MVP = No-Go · 72/100.** The platform is green; **commerce + chat-UX proof on prod** is not.
- **313 Vitest pass**, lint/build/floor all exit 0. Prod up (`www.mdeai.co` → 200). Code @ `8c99ded`.
- **Working on now → IMP-081:** event queries must render `[data-testid="event-card"]` (Playwright SCREEN-006 is red).

## The goal

Close the MVP: **three persona proofs on prod** — Andrés pays a real ticket, Roberto publishes a real event, Camila saves a lead (done) — plus **6 UX-P0 fixes**. Then Phase 2 (Spanish, vector, ADK as a product, `/admin`).

**Order:** `079 paid → 080 webhooks → 081 event cards → 082 publish → 083 MVP ledger`, then in parallel F32 ‖ AUTH-011 ‖ MAP-002B ‖ MAP-008B and UX-003 → UX-002+005.

## Tech stack (what we build on)

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 16 (App Router, React 19, Turbopack, Tailwind v4) |
| AI chat shell | **CopilotKit 1.55.2 (v1)** over **AG-UI** — never mix v1/v2 |
| Agent runtime | **Mastra**, in-process via `MastraAgent.getLocalAgents` (not an HTTP agent) |
| Model | **Gemini `gemini-3.5-flash`** (pro = `gemini-3.1-pro-preview`) — Gemini only, no OpenAI/Anthropic |
| Data | **Supabase** (project `zkwcbyxiwklihegjhuql`, 122 tables, RLS-tight) |
| Maps | **Google Maps via vis.gl** + Places API (New) |
| Grounding | ADK sidecar (Cloud Run, Phase 2) + Gemini web grounding |
| Commerce | Stripe (events checkout) |

## Component status

| Component | Status | % | Who feels it (real-world) | What's left |
|-----------|:------:|--:|---------------------------|-------------|
| **CopilotKit runtime** | 🟢 | 95% | Camila's chat connects on `/`; the POST-storm that killed search is fixed | full AG-UI POST smoke on prod |
| **Mastra agents (7)** | 🟢 | 88% | routing works — `concierge`, `router`, `rental`, `event`, `hostEvent`, `evaluation`, `ping` | prod `RUN_ERROR` is invisible to the user (UX-002) |
| **Tools (7)** | 🟢 | 88% | search-events / -rentals / -restaurants / -attractions / -grounded-places / -web-grounded-events / classify-intent | perf budget on the hot path |
| **Gemini 3.5-flash** | 🟢 | 88% | every agent answer; flash for chat, pro for heavy reasoning | — (re-verify model names via MCP) |
| **Google Maps + vis.gl** | 🟢 | 85% | Camila's map pins ↔ cards stay 1:1; field masks cap cost | **Map ID on prod** (MAP-008B) |
| **Supabase + edge** | 🟡 | 76% | Camila's saved lead lands in a row (G2, proven on prod); RLS on every table | webhook secret isolation (EVP-003) |
| **ADK grounding** | 🟡 | 75% | Tourist's café/web answers in dev | **`ADK_GROUNDING_URL` not set on prod** (MAP-002B); web is 5–60s — skip when SQL rows exist |
| **Events commerce** | 🟡 | 70% | Andrés' checkout exists in code | one **live paid** ticket + QR proof (G1 / IMP-079) |
| **Event cards in chat** | 🟥 | 45% | Roberto/Camila ask for events → cards should render | **Playwright SCREEN-006 timeout** — best next task (IMP-081) |
| **pgvector** | 🟡 | 40% | semantic rental/place search (later) | RPCs + cleanup (VEC-001) — **post-MVP** |
| **Patricia admin (`/admin`)** | ⚪ | 0% | ops dashboards, leads CRM | not started — **W8+** |

## Major issues (the 3 that block MVP)

1. **Commerce exit** — no **live** Stripe paid proof, webhook secrets not isolated, **EventCard e2e red**, no EVP-001 ledger. (IMP-079→083)
2. **Prod platform sign-off** — ADK URL + Map ID + auth/env not verified on Vercel; no F32 smoke evidence file. (IMP-084–092)
3. **Chat UX on prod** (was **48/100** in QA) — "$500 a night" price parser, no visible error when the agent times out, no loading indicator, stale map markers, chat-reset. (UX-003 → 002+005 → …)

## Personas — what works today

| Persona | Can do today | Gate |
|---------|--------------|:----:|
| **Camila** (rentals/chat) | chat → rental/café cards + map pins → save a lead | 🟢 G2 |
| **Andrés** (ticket buyer) | checkout exists; needs one real paid ticket | 🟡 G1 |
| **Roberto** (host) | host wizard at `/host/event/new`; needs one published row | 🟡 G3 |
| **Sofía** (dev) | `npm run floor` green before merge (313 tests) | 🟢 |
| **Patricia** (admin) | nothing yet — `/admin` not built | ⚪ |

## Where to look next

- **Status detail:** [`progress/may30.md`](progress/may30.md) · queue: [`todo.md`](todo.md) · full table: [`tasks/progres.md`](tasks/progres.md) · done criteria: [`checklist.md`](checklist.md)
- **Plan/strategy:** [`plan.md`](plan.md) · [`prd.md`](prd.md) · [`roadmap.md`](roadmap.md)
- **Skills to load:** `copilotkit` → `copilotkit-integrations` (not v2 `copilotkit-develop`) · `mastra` + `gemini` · `mde-maps` · `mde-supabase` · ship via `mde-task-lifecycle` → `task-verifier`
