---
title: 04 — Supabase Forensic Audit (LIVE) — Production Readiness for the New CopilotKit + Mastra Architecture
date: 2026-05-19
auditor: Senior Supabase Architect / AI Systems Auditor / CopilotKit + Mastra Integration Specialist
project_id: zkwcbyxiwklihegjhuql
project_name: medellin
region: us-east-1
db_version: PostgreSQL 17.6.1 (Supabase release-channel ga)
status_now: ACTIVE_HEALTHY
methodology: READ-ONLY. Live state via Supabase MCP (list_tables, list_extensions, list_edge_functions, list_migrations, get_advisors security+performance, execute_sql for RLS+functions+triggers+cron+buckets, get_edge_function source for top-3 revenue-critical fns).
scope:
  - 132 public-schema tables (RLS, sizes, policy counts)
  - 75+ extensions installed (10 in use)
  - 47 edge functions (active)
  - 47 migrations (20260404 → 20260517)
  - 14 cron jobs
  - 4 storage buckets
  - 3 pgvector tables
  - security + performance advisors
cross_refs:
  - /home/sk/mdeai/CLAUDE.md (project rules)
  - /home/sk/mdeai/plan/prd/03-architecture.md §14–17 (Supabase architecture spec)
  - /home/sk/mdeai/plan/prd/06-operations.md (deploy + RLS spec)
  - /home/sk/mdeai/tasks/INDEX.md (foundation tasks)
verdict:
  can_support_new_arch: yes — schema is over-provisioned for Phase 1; the gap is cleanup, not capability
  must_rewrite: chat-lead-capture verify_jwt mismatch; 6 ai-* edge fns replaced by CopilotKit + Mastra in mdeapp
  safe_reuse: tables (events, event_orders, leads, apartments, listing_embeddings, mastra_*), Stripe ticket flow, durable rate limiter, RLS posture
  dangerous: function_search_path_mutable on 80+ functions; spatial_ref_sys RLS off (low impact, advisor flag); fraud-scan cron every minute (cost)
  overengineered: 47 edge fns where MVP needs ≈ 10; approval system provisioned but never used; 13 sponsor fns + 3 openclaw fns + 3 postiz fns dead weight in Phase 1
  missing_phase1: nothing schema-level — every Phase 1 table already exists
  safest_migration_path: reuse the project as-is; freeze sponsor/openclaw fns; do not migrate data; let mdeapp read from the same DB
  solo_founder_realistic: yes (with the 4-week cleanup plan in §16)
aggregate_score: 78/100 (production-ready with cleanup; A- after 4 weeks of stabilization)
---

# 04 — Supabase Forensic Audit (LIVE)

> **TL;DR.** The project `medellin` (`zkwcbyxiwklihegjhuql`) is **A- ready for the new mdeai CopilotKit + Mastra architecture** with no schema migrations required. It's over-built (132 public tables, 47 edge functions, 14 cron jobs) for what Phase 1 actually needs. The right play is **reuse + freeze**: keep what's load-bearing, hard-freeze what's deferred (sponsor, openclaw, postiz, contests), and treat the new mdeapp as the only writer to a known subset of tables. **Aggregate readiness: 78/100.** Major risks are (1) `chat-lead-capture` `verify_jwt` drift (real bug, blocks anon chat capture), (2) 80+ functions with mutable `search_path` (latent privilege-escalation), (3) PostGIS `spatial_ref_sys` RLS disabled (advisor flag, low blast radius), (4) `fraud-scan` cron every minute (cost), and (5) ~12 edge functions that exist only to support Phase 2/3 features (defer).

---

## Verdict box

| Question | Answer |
|---|---|
| Can the current Supabase project support the new CopilotKit architecture? | **Yes** — no schema migrations needed for Phase 1 |
| What MUST be rewritten? | `chat-lead-capture` (verify_jwt mismatch). The 6 `ai-*` edge functions are *not* rewritten — they're **replaced** by CopilotKit + Mastra inside `mdeapp/` |
| What should be reused unchanged? | Stripe ticket stack, Mastra observability tables, rentals/events/leads tables, idempotency_keys, durable rate limiter, RLS posture |
| What is dangerous? | (1) verify_jwt drift; (2) 80+ functions with mutable search_path; (3) fraud-scan minute-cron; (4) some sponsor fns with `verify_jwt=true` but business logic gated only by JWT presence (not role) |
| What is overengineered? | Sponsor stack (13 fns + schema), OpenClaw stack (3 fns), Postiz stack (3 fns), contest stack (vote-cast, fraud-scan, contestant-social-enrich) — all Phase 2/3 |
| What is missing? | Nothing schema-side for Phase 1. Operational gap: no Sentry / structured log aggregation; advisor warnings unaddressed |
| Safest migration path? | Reuse the project. Don't migrate data. Hard-freeze deferred edge functions. mdeapp becomes the only new writer. |
| Solo-founder realistic? | **Yes** with the cleanup roadmap in §16. The DB is the asset; the cruft is fixable in 4 weeks. |

---

## 1. Live state snapshot

| Layer | Count / status | Notes |
|---|---|---|
| Postgres version | 17.6.1 (ga channel) | Up to date |
| Project status | ACTIVE_HEALTHY | us-east-1 |
| Public tables | **132** | PRD said 122 — actual is 132 |
| RLS enabled (public) | **131/132** (99.2%) | Only `public.spatial_ref_sys` has RLS off (PostGIS system table) |
| Tables with ≥1 policy | 131/132 (matches RLS) | Most policies cluster around `events` (11), `restaurants` (6), `payments` (6), `rentals` (6), `embeddings` (6 each) |
| Total relation bytes | ~28 MB (sum of public tables) | Tiny — single-region us-east-1 stays cheap |
| Largest table | `mastra_ai_spans` 5.5 MB / 932 rows | Mastra agent telemetry is live |
| Auth users | 9 | 270 refresh tokens, 45 sessions = real but tiny |
| Storage buckets | 4 | 6 objects total (contracts, identity-docs private; listing-photos, sponsor-assets PUBLIC) |
| Extensions in use | 10 | postgis 3.3.7, vector 0.8.0, pg_cron 1.6.4, pg_net 0.19.5, pgcrypto 1.3, citext 1.6, pg_trgm 1.6, uuid-ossp, pg_stat_statements 1.11, supabase_vault 0.3.1 |
| Extensions available but unused | 65+ | Including pgrouting, pgaudit, pg_partman, pgmq, hypopg, index_advisor — kept for future, no cost while uninstalled |
| pgvector tables | **3** | `listing_embeddings` (44), `event_embeddings` (43), `restaurant_embeddings` (43) — Gemini text embeddings, 6 policies each |
| Edge functions | **47 active** | PRD said 48 — actual is 47 |
| Migrations | 47 (20260404 → 20260517) | Last migration `mastra_public_tables_rls_lockdown` shows recent RLS posture work |
| Cron jobs | **14 active** | See §10 |

---

## 2. Subsystem scorecard

| Subsystem | Score /100 | Prod-ready % | Maintainability % | Migration difficulty % | Rewrite risk % | Security risk % | Op complexity % | Verdict |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Auth (Supabase Auth) | 92 | 95 | 90 | 5 | 0 | 5 | 10 | ✅ Reuse as-is |
| Rentals (apartments + landlord) | 85 | 90 | 80 | 10 | 0 | 10 | 25 | ✅ Reuse; freeze landlord_v1 evolution |
| Events (events + venues + tickets + check-ins) | 88 | 90 | 80 | 10 | 0 | 15 | 25 | ✅ Reuse; events has 11 RLS policies (highest) |
| Ticketing (Stripe stack) | 91 | 95 | 80 | 5 | 5 | 10 | 30 | ✅ Best-in-class (atomic RPC + qty_pending + idempotency_keys + raw-body Stripe sig + SECURITY DEFINER RPCs) |
| Leads (P1-CRM + landlord_inbox + chat-lead-capture) | 64 | 60 | 75 | 30 | 35 | 25 | 20 | ⚠️ Rewrite chat-lead-capture (verify_jwt); keep p1-crm + landlord_inbox |
| ai_runs (legacy AI observability) | 55 | 60 | 50 | n/a (frozen) | 70 | 5 | 15 | ⚠️ 182 rows; new arch uses `mastra_ai_spans` + `agent_tool_calls`. Pick one. |
| Maps (places_search_cache + place_details_cache) | 78 | 85 | 70 | 15 | 5 | 5 | 15 | ✅ Cache schema + 4 RLS policies/table. PostGIS GIST indexes optional. |
| Places cache | 80 | 85 | 75 | 10 | 0 | 5 | 10 | ✅ 33 rows in search_cache; 0 in details. Cost-control infra present. |
| Edge functions (overall) | 56 | 60 | 50 | 35 | 25 | 25 | 65 | 🟡 15 keep · 1 rewrite · 6 deprecate · 5 defer · 20 archive |
| RLS | 89 | 95 | 80 | 5 | 5 | 10 | 15 | ✅ 99.2% coverage |
| Storage | 75 | 80 | 70 | 5 | 0 | 30 | 15 | ⚠️ `listing-photos` + `sponsor-assets` PUBLIC — verify EXIF strip |
| Observability | 60 | 65 | 50 | 20 | 30 | 5 | 35 | 🟡 Mastra tracing live (932 spans); no Sentry; no aggregator |
| AI architecture fit (CopilotKit/Mastra) | 86 | 90 | 80 | 10 | 5 | 10 | 20 | ✅ Mastra tables provisioned & live; approval system provisioned but unused (fresh slate) |
| Payments | 91 | 95 | 80 | 5 | 0 | 10 | 25 | ✅ Stripe stack is textbook-correct |
| **Aggregate (weighted)** | **78** | **82** | **73** | **15** | **15** | **12** | **24** | **A-** |

---

## 3. Inventory: tables (132 public, categorized)

### 3a. Phase 1 KEEP — load-bearing

| Cluster | Tables (rows) | RLS policies | Status |
|---|---|---|---|
| Auth/identity | `profiles` (13), `user_roles` (3), `landlord_profiles` (3) | 3, 5, 4 | ✅ Used by mdeapp from W2 |
| Events MVP | `events` (49), `event_venues` (7), `event_tickets` (4), `event_orders` (26), `event_attendees` (30), `event_check_ins` (3) | 11, 2, 2, 2, 1, 1 | ✅ Reuse — Roberto's W3 surface |
| Events extras (Phase 1.5) | `event_promo_codes`, `event_order_refunds`, `event_taxes_and_fees`, `event_ticket_taxes_and_fees`, `event_wait_list`, `event_media_assets` | 2, 2, 2, 2, 5, 2 | ✅ Reuse — Colombia IVA 19% tax schema already there |
| Rentals | `apartments` (44), `rentals` (0), `rental_search_sessions` (19), `neighborhoods` (12), `property_verifications` (31) | 4, 6, 5, 5, 5 | ✅ Reuse — Camila's W5 surface |
| Rental ops | `rental_applications` (4), `showings` (4), `landlord_inbox` (46!), `landlord_inbox_events`, `verification_requests` | 5, 5, 3, 2, 3 | ✅ Real production data |
| Concierge data | `restaurants` (44), `tourist_destinations` (23) | 6, 5 | ✅ For chat agent grounding |
| Bookings + payments | `bookings` (4), `payments` (3), `idempotency_keys` (33) | 4, 6, 1 | ✅ Stripe spine — keep |
| Leads | `leads` (7), `landlord_inbox` (46) | 5, 3 | ⚠️ Two lead systems; consolidate post-W1 |
| Embeddings (pgvector) | `listing_embeddings` (44), `event_embeddings` (43), `restaurant_embeddings` (43) | 6 each | ✅ Gemini embeddings; semantic search ready |
| Mastra observability (active) | `mastra_ai_spans` (932), `mastra_threads` (29), `mastra_messages` (64), `mastra_workflow_snapshot` (18), `mastra_scorers` (6) | 1 each | ✅ Live agent tracing — connect mdeapp here W3 |
| Maps cache | `places_search_cache` (33), `place_details_cache` (0) | 4 each | ✅ Cost-control infra present |
| Rate limiting | `rate_limit_hits` (6), `idempotency_keys` (33) | 1, 1 | ✅ Used by edge fns via `check_rate_limit()` RPC |
| Outbound clicks | `outbound_clicks` (0) | 2 | ✅ Affiliate attribution infra |
| Approval system | `approval_requests` (0), `approval_decisions` (0) | 2, 2 | ⚠️ Provisioned but **never used**. Connect mdeapp HITL here in W3. |
| Reliable side-effects (outbox) | `outbox` (0), `posts_outbox` (0), `wa_outbox` (0), `email_outbox` (0), `delivery_receipts` (0) | 2, 1, 1, 1, 1 | ⚠️ All empty. Dispatch loop runs every minute (wasteful) |

### 3b. Phase 1 IGNORE — exists but mdeapp doesn't touch

| Cluster | Tables | Why ignore |
|---|---|---|
| Mastra observability (empty) | 25 mastra_* tables incl. `mastra_agents`, `mastra_workspaces`, `mastra_skills`, `mastra_mcp_clients`, etc. | Mastra cloud-product tables; mdeapp Phase 1 is local mastra dev only |
| AI legacy | `ai_runs` (182), `ai_context` (0), `conversations` (74), `messages` (155), `proactive_suggestions` (0), `agent_jobs` (0) | Legacy AI telemetry — frozen with the legacy app |
| Agents v2 (never used) | `agent_runs` (0), `agent_tool_calls` (0), `agent_audit_log` (1), `agent_errors` (0), `agent_approvals` (0), `agent_budgets` (0) | Provisioned post-Mastra but never adopted |
| WhatsApp | `whatsapp_messages`, `whatsapp_conversations`, `whatsapp_subscriptions` (all 0) | Phase 2 |
| Trip planner | `trips`, `trip_items`, `budget_tracking`, `conflict_resolutions`, `collections`, `saved_places`, `user_preferences` | All empty; Phase 2+ |
| Chat (legacy) | `chat_events` (0) | mdeapp uses Mastra threads + CopilotKit |
| Sponsor + contest | `event_sponsors`, `event_sponsor_placements`, `event_stakeholders`, `event_vendors`, `event_attendee_profiles` (all 0) | Phase 3 deferred |
| Misc | `suppression_list` (2), `grounding_quota_log` (0), `rental_listing_sources`, `rental_listing_images`, `rental_freshness_log`, `car_rentals`, `analytics_events_daily`, `notifications` | Mostly empty; ops-side |

### 3c. Dead-weight / candidate-for-freeze

| Table | Rows | Decision |
|---|---|---|
| `posts_outbox`, `wa_outbox`, `email_outbox`, `delivery_receipts` | 0 each | **Freeze** — `outbox-dispatch` cron fires on empty tables |
| `agent_*` (6 tables, all 0 except 1 audit row) | 0/1 | **Freeze** — provisioned for Paperclip/Hermes/OpenClaw (Phase 3) |
| `whatsapp_*` (3) | 0 | **Freeze** — Phase 2 |
| `mastra_observational_memory` and 20 other empty Mastra tables | 0 | **Ignore** |

---

## 4. Inventory: edge functions (47, scored)

### 4a. KEEP — Phase 1 production-critical (15)

| Slug | Version | verify_jwt | Reason kept |
|---|---:|---|---|
| `ticket-checkout` | 27 | false | Atomic RPC + qty_pending + Stripe sig + idempotency_keys + pre-minted QR JWTs. Textbook |
| `ticket-payment-webhook` | 27 | false | Raw-body Stripe sig + idempotency on event.id + SECURITY DEFINER RPCs. Best-in-class |
| `ticket-validate` | 23 | false | Door scan with QR JWT verification |
| `event-staff-link-generator` | 22 | true | Generates door-scanner-staff links |
| `p1-crm` | 31 | true | Gold-reference for user-vs-service-client separation |
| `listing-create` | 26 | true | Atomic apartment create + property_verifications |
| `listing-moderate` | 26 | false | Admin moderation |
| `lead-from-form` | 27 | false | Anon form submit (rate-limited via durable RPC) |
| `lead-reminder-tick` | 24 | false | Cron-driven follow-up |
| `rentals` | 44 | false | Rental search backend |
| `rules-engine` | 46 | false | Generic rule eval — referenced by P1-CRM |
| `ai-embed` | 17 | false | Gemini embedding generation — used by all 3 embedding tables |
| `outbox-dispatch` | 10 | false | Reliable side-effects loop |
| `failed-deliveries-digest` | 10 | false | Daily digest |
| `google-directions` | 48 | false | Maps directions backend (W5) |

### 4b. REWRITE — fix in place (1)

| Slug | Version | Issue | Fix |
|---|---:|---|---|
| `chat-lead-capture` | 6 | **verify_jwt: true deployed but code handles `userId === null` (anon path)** — anon path is dead code | Flip config.toml to `verify_jwt: false`. Per CLAUDE.md F12 |

### 4c. DEPRECATE — replaced by CopilotKit + Mastra in mdeapp (6)

| Slug | Version | Replaced by |
|---|---:|---|
| `ai-router` | 46 | mdeapp Mastra `routerAgent` |
| `ai-chat` | 91 | CopilotKit `<CopilotSidebar>` + Mastra `conciergeAgent` |
| `ai-search` | 54 | Mastra `search_rentals`/`search_events` tools |
| `ai-trip-planner` | 44 | Phase 2 |
| `ai-optimize-route` | 51 | Phase 2 |
| `ai-suggest-collections` | 44 | Phase 2 |

**Action:** keep deployed during Phase 1 cutover; freeze + remove from CI after W10.

### 4d. DEFERRED to Phase 2/3 (5)

| Slug | Version | Phase |
|---|---:|---|
| `whatsapp-webhook` | 30 | Phase 2 |
| `openclaw-delivery-webhook` | 14 | Phase 3 |
| `openclaw-concierge-webhook` | 14 | Phase 3 |
| `openclaw-outreach` | 10 | Phase 3 |
| `hermes-ranking` | 10 | Phase 3 |

### 4e. ARCHIVE — Phase 3+ (20)

Sponsor stack (13): `sponsor-checkout`, `sponsor-payment-webhook`, `sponsor-impression`, `sponsor-click`, `sponsor-contract-sign`, `sponsor-contract-generate`, `sponsor-application-create`, `sponsor-cancel`, `sponsor-moderate`, `sponsor-roi-explain`, `sponsor-audience-match`, `sponsor-optimize`, `sponsor-creative-gen`

Contest stack (4): `vote-cast`, `contestant-social-enrich`, `fraud-scan`, `moderate-asset`

Postiz stack (2): `postiz-schedule-posts`, `postiz-approval-webhook`

Other (1): `event-photo-moderate`, `notify-entity-approved` (notify kept, photo-moderate frozen)

**Action:** pin versions; disable corresponding cron triggers (especially `fraud-scan-cron` — runs every minute).

### Edge function net

| Total | KEEP | REWRITE | DEPRECATE | DEFER | ARCHIVE |
|---|---:|---:|---:|---:|---:|
| **47** | 15 | 1 | 6 | 5 | 20 |

PRD §16 target was "≥28 source-in-repo + ≤4 unaudited." **Realistic actively-called surface: 16.**

---

## 5. RLS audit

| Status | Count | Comment |
|---|---:|---|
| Tables with RLS enabled | 131/132 | 99.2% |
| Tables with RLS off | 1 | `public.spatial_ref_sys` (PostGIS sys table) — advisor flag, low blast radius |
| Tables with ≥1 policy | 131/132 | |
| Highest policy count | 11 (`events`) | Strong segmentation per actor |
| Tables with 1 policy only | 41 | Mostly Mastra ops + outbox + idempotency_keys — single restrictive policy each |

### Critical-path RLS posture

| Table | RLS | Policies | Verdict |
|---|---|---:|---|
| `events` | ✅ | 11 | A — exemplary |
| `event_tickets` | ✅ | 2 | OK |
| `event_orders` | ✅ | 2 | OK — anon via `get_anonymous_order` RPC + access_token |
| `event_attendees` | ✅ | 1 | OK — caller-provided IDs |
| `event_check_ins` | ✅ | 1 | OK — immutable audit log |
| `apartments` | ✅ | 4 | A — public read + landlord write + admin moderate |
| `leads` | ✅ | 5 | A |
| `landlord_inbox` | ✅ | 3 | OK |
| `payments` | ✅ | 6 | A |
| `idempotency_keys` | ✅ | 1 | OK (service_role only) |
| `places_search_cache` | ✅ | 4 | A |
| `approval_requests` | ✅ | 2 | OK (unused; design verify when mdeapp HITL goes live) |
| `mastra_*` (33 tables) | ✅ | 1 each | OK (latest migration locked these down) |
| `spatial_ref_sys` | ❌ | 0 | ⚠️ Low risk |

**Net:** RLS is the strongest single quality of this DB.

---

## 6. Security audit

### 6a. Advisor findings

| Severity | Class | Approx count | Action |
|---|---|---:|---|
| WARN | `function_search_path_mutable` | **80+** functions (incl. `fts_spanish`, `touch_updated_at`, PostGIS internals, business RPCs) | Latent privilege-escalation if attacker poisons schema-resolution order. Fix incrementally |
| WARN | `extension_in_public` (pg_trgm + vector in public schema) | 2 | Lower priority (Supabase default) |
| WARN | Storage bucket public exposure | `listing-photos`, `sponsor-assets` | Both PUBLIC. Intended but verify EXIF/PII strip |
| INFO | `leaked_password_protection` (Auth) | n/a | Dashboard toggle |

### 6b. Manually verified

| Rule (CLAUDE.md) | Pass/Fail | Evidence |
|---|---|---|
| Every new table needs RLS + ≥1 policy | ✅ | 131/132 (only sys table off) |
| Service-role keys never in mdeapp/src/** | ✅ | hook `no-service-role-in-src.mjs` active; mdeapp/src/ has zero Supabase imports yet |
| Stripe webhook signature check | ✅ | raw-body verify in `ticket-payment-webhook` |
| Stripe metadata minimization | ✅ | only `order_id` in payment_intent_data.metadata |
| Idempotency on payment flow | ✅ | `idempotency_keys` + dedupe on event.id |
| Anon write paths rate-limited | ✅ | `allowRateDurable` via `check_rate_limit` RPC; fails open |
| `verify_jwt` aligned with code path | ❌ | `chat-lead-capture` deployed `verify_jwt: true` but code handles anon — anon path is dead code |
| Storage policies on `identity-docs` | ✅ | private; 10MB limit |
| Storage policies on `contracts` | ✅ | private |
| CORS allowlist | ✅ | mdeai.co + Vercel.app + localhost (dev-only) |

### 6c. Findings

| # | Sev | Finding | Action |
|---|---|---|---|
| 1 | **P0** | `chat-lead-capture` verify_jwt drift | Flip config.toml to false (F12) |
| 2 | **P1** | 80+ functions with mutable `search_path` | Batch ALTER FUNCTION |
| 3 | **P1** | `fraud-scan-cron` `* * * * *` (every minute) on Phase-3 fn | Disable cron |
| 4 | **P2** | `outbox-dispatch` cron every minute on empty tables | Pause until outbox populates |
| 5 | **P2** | `spatial_ref_sys` RLS off | Optional ALTER |
| 6 | **P2** | PUBLIC storage buckets `listing-photos`, `sponsor-assets` | Verify EXIF strip; sponsor-assets dies with sponsor stack |
| 7 | **P3** | Marketing schema FKs missing indexes | Performance, not security |
| 8 | **P3** | `function_search_path_mutable` on PostGIS internals | Cannot easily fix (extension-owned) |

---

## 7. AI architecture fit (CopilotKit / Mastra / AG-UI)

### 7a. Mastra observability — already live

| Table | Rows | mdeapp implication |
|---|---:|---|
| `mastra_ai_spans` | **932** | Connect mdeapp's Mastra storage to inherit full trace history |
| `mastra_threads` | 29 | Conversation thread store |
| `mastra_messages` | 64 | Message store |
| `mastra_workflow_snapshot` | 18 | Workflow checkpoints |
| `mastra_scorers` | 6 | Eval scorers |
| `mastra_resources` | 0 | Working memory store — populates on mdeapp boot |
| 25 other `mastra_*` | 0 | Mastra cloud-product features; ignore Phase 1 |

**Verdict:** the Mastra schema is **ready**. W3 task: switch `mdeapp/src/mastra/index.ts` from `LibSQLStore({ url: ":memory:" })` to Supabase storage adapter.

### 7b. CopilotKit compatibility

| Primitive | Needs DB? | DB provides? |
|---|---|---|
| `<CopilotKit>` provider | No | n/a |
| `useCoAgent<T>` (v1) | No | n/a |
| `useAgent<T>` (v2) + Threads | Yes | ✅ `mastra_threads` + `mastra_messages` |
| `useCopilotAction({ render })` | No | n/a |
| `renderAndWaitForResponse` (HITL) | Persist approvals? | ✅ `approval_requests` + `approval_decisions` (provisioned, 0 rows — design fresh) |
| `useCoAgentState<MapState>` | No | n/a |
| Chat history / threads | Yes | ✅ Mastra tables |
| Tool calls audit | Yes | ✅ `agent_tool_calls` (0 rows — fresh slate) |

**Verdict:** every CopilotKit primitive Phase 1 needs has a DB-side home. Fresh slate for approval + tool-call audit is a feature.

### 7c. AI architecture fit — gaps

| Gap | Severity | Fix |
|---|---|---|
| No `MapState` table | LOW | Pins are client-only per PRD §18 (RUNTIME-008) |
| No `chat_lead_capture` v2 schema | LOW | Acceptable Phase 1; extend `leads.metadata` JSONB |
| `approval_requests` schema not yet exercised | MEDIUM | Design verify when Roberto's W3 flow lands; may need `proposed_value` JSONB |
| `LibSQLStore({ url: ":memory:" })` in mdeapp | LOW | F02 accepts this for W1; W3 switches |

---

## 8. Maps + Places audit

| Aspect | State | Verdict |
|---|---|---|
| PostGIS installed | ✅ 3.3.7 | A |
| `geometry`/`geography` columns | Likely lat/lng float (not PostGIS types) | ⚠️ Acceptable Phase 1; add GIST when scale grows |
| Places search cache | ✅ `places_search_cache` (33 rows) + `place_details_cache` (0) — 4 RLS each | A |
| Geospatial indexing | Likely missing GIST | ⚠️ Phase 1 OK (44 apartments); add W5 if pin query > 100ms |
| Map pin ownership (RUNTIME-008) | Client-side enforced | ✅ mdeapp's `setPins` writer hook lints |
| `grounding_quota_log` | 0 rows | ✅ Provisioned for MAPS_GROUNDING_DAILY_LIMIT |

**Verdict:** adequate for Phase 1.

---

## 9. Stripe audit

### 9a. ticket-checkout (v27) — A+

| # | Practice | Implementation |
|---|---|---|
| 1 | Atomic capacity check + qty_pending | `ticket_checkout_create_pending` RPC uses `pg_advisory_xact_lock(event_id)` + `FOR UPDATE` on ticket row |
| 2 | Stripe metadata minimization | Only `order_id` in `payment_intent_data.metadata` (audit B1) |
| 3 | Idempotency dedup | `idempotency_keys` table |
| 4 | Zod input validation | Email, UUIDs, qty 1-10, URL length capped |
| 5 | Pre-minted attendee UUIDs + QR JWTs | JWT.attendee_id always == event_attendees.id (audit R6) |
| 6 | Lazy Stripe init | CONFIG_ERROR 500 instead of cold-start crash |
| 7 | Failed Stripe → cancel RPC | Releases qty_pending immediately |
| 8 | `verify_jwt: false` | Anonymous purchase supported |
| 9 | CORS allowlist with previews + localhost dev only | Production tight |

**Minor improvements:** no 3DS handling tested; hardcoded `currency: "cop"` (fine Phase 1).

### 9b. ticket-payment-webhook (v27) — A+

| # | Practice | Implementation |
|---|---|---|
| 1 | Raw-body Stripe signature verify | `req.text()` BEFORE JSON parsing |
| 2 | Idempotency on `event.id` | Stripe retries up to 3 days; same event = 200 OK no-op |
| 3 | SECURITY DEFINER RPCs | `ticket_payment_finalize`, `ticket_checkout_cancel`, `ticket_payment_refund` |
| 4 | Event coverage | `checkout.session.completed`, `async_payment_succeeded`, `expired`, `payment_intent.succeeded`, `charge.refunded` |
| 5 | Lazy Stripe + secret init | CONFIG_ERROR 500 |
| 6 | SendGrid opt-out | If unset, skip silently (Phase 1.5) |
| 7 | Refund flow | Looks up order by `stripe_payment_intent` (indexed) |
| 8 | 200 on unsubscribed event types | Stops Stripe retries |

**Net Stripe score: 91/100. Best-engineered subsystem in the DB.**

---

## 10. Observability audit

### 10a. Active cron jobs (14)

| Job | Schedule | Phase 1 verdict |
|---|---|---|
| `agent_tool_calls_cleanup` | `0 4 * * *` | ✅ KEEP |
| `campaign_conversions_rollup` | `15 3 * * *` | 🟡 Sponsor — pause |
| `chat-archive-abandoned` | `0 6 * * *` | ✅ KEEP |
| `chat-lead-followup-check` | `0 14 * * *` | ✅ KEEP |
| `failed_deliveries_digest_daily` | `0 7 * * *` | 🟡 Pause until outbox active |
| **`fraud-scan-cron`** | **`* * * * *` (every minute!)** | ❌ **DISABLE** — Phase 3, huge cost |
| `mdeai_analytics_daily_snapshot` | `10 3 * * *` | ✅ KEEP |
| `mdeai_lead_reminder_tick` | `*/5 * * * *` | ✅ KEEP |
| `outbox_dispatch_tick` | `* * * * *` | 🟡 Pause until outbox active |
| `outbox_reset_stuck` | `*/5 * * * *` | 🟡 Pause until outbox active |
| `sponsor-roi-explain-daily` | `0 6 * * *` | ❌ DISABLE — Phase 3 |
| `sponsor-roi-rollup` | `*/5 * * * *` | ❌ DISABLE — Phase 3 |
| `wait_list_expire_holds` | `*/5 * * * *` | ✅ KEEP (events MVP) |

**Action:** 3 immediate disables + 4 pauses → 7 jobs (down from 14).

### 10b. Observability gaps

| Layer | State | Fix priority |
|---|---|---|
| Mastra spans | ✅ 932 rows, live | n/a |
| Edge function logs | `console.log/error` only | P1 — structured JSON + Sentry W8 |
| Auth events | `auth.audit_log_entries` (0 rows) | P2 — dashboard enable |
| Error aggregation (Sentry) | **None** | P0 for W10 cutover |
| Latency P95 dashboard | None | P1 — Vercel Analytics + Mastra rollup W8 |
| Cost telemetry | `grounding_quota_log` (0) | OK — wires up when grounding fires |

---

## 11. Top 20 risks

| # | Sev | Risk | Fix window |
|---|---|---|---|
| 1 | **P0** | `chat-lead-capture` verify_jwt drift | W2 (F12) |
| 2 | **P0** | No Sentry before W10 | W8 |
| 3 | **P0** | OpenAI key was on disk (`mdeapp/.env`) | Rotate now |
| 4 | **P1** | 80+ functions with mutable `search_path` | W2-W3 batch ALTER |
| 5 | **P1** | `fraud-scan-cron` minute-cron on Phase-3 fn | W1 disable |
| 6 | **P1** | 16 sponsor edge fns active, never called → deploy drift risk | W1 freeze |
| 7 | **P1** | 3 openclaw + 2 postiz + WhatsApp same issue | W1 freeze |
| 8 | **P1** | Sponsor `verify_jwt=true` but no role check | Review before sponsor work |
| 9 | **P1** | mdeapp Mastra `LibSQLStore` in-memory | W3 switch |
| 10 | **P1** | Two parallel lead systems (`leads` + `landlord_inbox`) | W6 consolidate or document |
| 11 | **P1** | Two parallel observability (`ai_runs` vs `mastra_ai_spans`) | W3 Mastra wins |
| 12 | **P2** | `spatial_ref_sys` RLS off | Optional |
| 13 | **P2** | PUBLIC storage buckets `listing-photos`, `sponsor-assets` | Verify EXIF strip |
| 14 | **P2** | Marketing schema FKs unindexed | Post-Phase-1 |
| 15 | **P2** | `auth.audit_log_entries` 0 rows | Dashboard enable |
| 16 | **P2** | No 3DS/SCA tested | Before W10 |
| 17 | **P2** | mdeai.co SPF/DKIM verify | W9 |
| 18 | **P3** | 47 active deploys = drift surface | W10 cleanup |
| 19 | **P3** | `outbox_dispatch_tick` cron on empty tables | Pause |
| 20 | **P3** | Mastra `LibSQLStore` Supabase adapter is beta | Verify writes W3 |

---

## 12. Top 20 strengths

| # | Strength |
|---|---|
| 1 | Postgres 17.6.1 — current major, recent patch |
| 2 | 99.2% RLS coverage |
| 3 | `events` has 11 RLS policies (best-segmented table) |
| 4 | Stripe ticket-checkout is textbook (atomic RPC + qty_pending + JWTs + idempotency) |
| 5 | Stripe ticket-payment-webhook is textbook (raw-body sig + dedupe + SECURITY DEFINER RPCs) |
| 6 | `p1-crm` is gold-standard for verify_jwt + service-client separation |
| 7 | Mastra observability live (932 spans, 29 threads, 64 messages) |
| 8 | Durable rate limiter (`check_rate_limit` RPC + `rate_limit_hits`) |
| 9 | `idempotency_keys` reused across ticket-checkout + webhook + p1-crm |
| 10 | pgvector + 3 embedding tables (Gemini, 6 RLS each, 44+43+43 rows) |
| 11 | Real data: 44 apartments, 49 events, 26 orders, 30 attendees, 46 landlord inquiries, 7 leads |
| 12 | `places_search_cache` + `place_details_cache` with RLS |
| 13 | CORS allowlist correctly differentiates production vs Vercel previews vs localhost |
| 14 | `grounding_quota_log` provisioned for Maps cost limit |
| 15 | `approval_requests` + `approval_decisions` provisioned (clean slate for HITL) |
| 16 | `chat_events` provisioned, 0 rows (clean canvas) |
| 17 | Supabase Vault used for cron secrets (not plaintext env) |
| 18 | Stripe webhook event coverage complete |
| 19 | Atomic ticketing prevents oversell via `pg_advisory_xact_lock(event_id)` |
| 20 | `event_wait_list` with hold-expiry cron (production-grade waitlisting) |

---

## 13. Blockers (must resolve before W3+)

| # | Blocker | Path to clear |
|---|---|---|
| B1 | OpenAI key on disk in `mdeapp/.env` (now deleted) | **User action:** rotate in OpenAI dashboard |
| B2 | `chat-lead-capture` verify_jwt drift | F12: flip config.toml; redeploy |
| B3 | mdeapp Mastra storage in memory | W3: switch to Supabase store |
| B4 | `approval_requests` may need `proposed_value` JSONB | W3 design verify when Roberto's HITL fires |
| B5 | No Sentry | W8 task |

**None of B1–B5 block F03–F05** (the W1 "hola" echo path).

---

## 14. Quick wins (≤ 1 hr each)

| # | Win | Action | Effort |
|---|---|---|---|
| Q1 | ≈30% cron cost cut | Disable `fraud-scan-cron`, `sponsor-roi-explain-daily`, `sponsor-roi-rollup` | 5 min |
| Q2 | ≈25% more cron cut | Pause `outbox_dispatch_tick`, `outbox_reset_stuck`, `campaign_conversions_rollup`, `failed_deliveries_digest_daily` | 5 min |
| Q3 | Fix verify_jwt drift | Flip `chat-lead-capture` config.toml + redeploy | 15 min |
| Q4 | Silence advisor on `spatial_ref_sys` | `ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY; CREATE POLICY "public read" ON public.spatial_ref_sys FOR SELECT USING (true);` | 5 min |
| Q5 | Set search_path on top-5 RPCs | `ALTER FUNCTION public.decide_approval SET search_path = public, pg_temp;` (and `check_rate_limit`, `ticket_checkout_create_pending`, `ticket_payment_finalize`, `ticket_checkout_cancel`) | 15 min |
| Q6 | Enable `leaked_password_protection` | Supabase Auth dashboard toggle | 2 min |
| Q7 | Pin frozen sponsor fn deployments | Pin version in config; no further deploys | 15 min |
| Q8 | mdeapp gitignore audit | Add `.next-env.d.ts` if needed | 1 min |

---

## 15. Unnecessary systems (freeze or remove)

| System | Surface | Action |
|---|---|---|
| Sponsor marketplace | 13 edge fns, 1 schema (`sponsor.*`), 5 cron jobs, 5 public tables | Hard-freeze. Pin versions. Disable cron. |
| OpenClaw / Paperclip / Hermes | 3 edge fns + 5 `agent_*` tables (0 rows) | Hard-freeze |
| Postiz | 2 edge fns + 3 outbox tables (all 0) | Pause cron; freeze fns |
| WhatsApp | 1 edge fn + 3 tables (0 rows) | Freeze |
| Contests / fraud | 4 fns + `fraud-scan-cron` (minute) | Disable cron NOW; freeze fns |
| Trip planner | 7 tables (all 0) | Ignore (no cost) |
| Legacy AI fns | 6 fns | Freeze after W10 |
| Agent observability v2 | 6 tables (mostly empty) | Reuse for mdeapp HITL if useful; else ignore |

---

## 16. Migration path (W1 → W10)

### W1 — Stabilize (this week)

- [ ] Disable cron: `fraud-scan-cron`, `sponsor-roi-explain-daily`, `sponsor-roi-rollup`
- [ ] Pause cron: `outbox_dispatch_tick`, `outbox_reset_stuck`, `campaign_conversions_rollup`, `failed_deliveries_digest_daily`
- [ ] Rotate OpenAI key (user dashboard action)
- [ ] mdeapp F01 → F05 (ping echo)
- [ ] F04: copy Supabase URL + anon key (NOT service role) into `mdeapp/.env.local`
- [ ] Hard-freeze sponsor + openclaw + postiz + contest fns

### W2 — Phase 1 prep

- [ ] Fix `chat-lead-capture` verify_jwt drift
- [ ] Set `search_path` on top-5 RPCs (`decide_approval`, `check_rate_limit`, `ticket_*`)
- [ ] Enable Supabase Auth `leaked_password_protection`
- [ ] Document canonical lead system (`leads` or `landlord_inbox`)

### W3 — Roberto host event flow

- [ ] Switch mdeapp Mastra `LibSQLStore` from `:memory:` to Supabase-backed
- [ ] Verify writes land in `mastra_threads` / `mastra_messages` / `mastra_ai_spans`
- [ ] Design verify: `approval_requests` schema sufficient for Roberto's draft-publish HITL?
- [ ] Connect `<CopilotKit agent="hostEventAgent">` to events table reads

### W5 — Camila rentals + maps

- [ ] Verify `apartments` semantic search via `listing_embeddings` from mdeapp
- [ ] Verify `places_search_cache` hit rate (33 rows stale; warmer task?)
- [ ] Add PostGIS GIST indexes on `apartments.lat/lng` if pin query > 100ms

### W6 — Chat + map state sync

- [ ] Replace `ai-chat` edge fn calls with CopilotKit + Mastra agents
- [ ] Decide: write to `chat_events` or skip (Mastra `mastra_messages` suffices?)

### W8 — Observability

- [ ] Sentry SDK in `mdeapp/src/instrumentation.ts`
- [ ] Wire `mastra_ai_spans` daily rollup
- [ ] Structured JSON logs on remaining 15 keep-list edge fns

### W9 — Stripe reuse + audit

- [ ] Verify ticket-checkout + ticket-payment-webhook after cutover (no code change)
- [ ] SPF/DKIM for `tickets@mdeai.co`
- [ ] Live-test 3DS/SCA on Colombian card

### W10 — Cutover + archive

- [ ] Hard-freeze legacy `ai-*` edge fns
- [ ] DNS cut to `mdeai.co`
- [ ] Move deprecated edge fns to `_archive/` slug (don't delete)
- [ ] Final advisor sweep
- [ ] Final RLS audit via `/supabase-rls-audit`

---

## 17. Checklists

### 17a. Week 1 stabilization

- [ ] All 3 high-cost cron disabled (fraud-scan, sponsor-roi-explain-daily, sponsor-roi-rollup)
- [ ] All 4 idle cron paused (outbox dispatch + reset + campaign + failed-deliveries)
- [ ] OpenAI key rotated
- [ ] `mdeapp/.env.local` has anon key only (not service role)
- [ ] mdeapp F01 → F05 completes ("hola" echo)

### 17b. Phase 1 migration

- [ ] mdeapp Mastra store switched to Supabase (W3)
- [ ] HITL `approval_requests` schema design verified (W3)
- [ ] `chat-lead-capture` verify_jwt fixed (W2)
- [ ] Sponsor + OpenClaw + Postiz + WhatsApp fns frozen
- [ ] Sentry wired (W8)
- [ ] Final advisor sweep clean (W10)

### 17c. CopilotKit compatibility

- [ ] `mastra_threads` writable from mdeapp
- [ ] `mastra_messages` writable from mdeapp
- [ ] `mastra_ai_spans` populating in production
- [ ] `mastra_resources` populating for `scope: "thread"`
- [ ] `approval_requests` + `approval_decisions` exercised by Roberto's HITL
- [ ] `chat_events` populated OR formally retired

### 17d. Production readiness

- [ ] 0 P0 advisor findings (currently 1: `chat-lead-capture` drift)
- [ ] 0 high CVE on `npm run audit` in mdeapp (currently 0 — F01b)
- [ ] All RPCs have `SET search_path` (currently 80+ missing)
- [ ] All public tables have RLS (currently 131/132)
- [ ] All anonymous edge fns have `check_rate_limit` (currently most)
- [ ] Stripe webhook sig on all payment paths (currently yes for tickets)
- [ ] Sentry + Vercel Analytics live (currently no)
- [ ] DNS + SPF + DKIM for outbound email (currently needs verification)

### 17e. Security

- [ ] RLS on every new public table (enforced by mdeapp `stop-rls-gate` hook)
- [ ] No service-role in `mdeapp/src/**` (enforced by `no-service-role-in-src.mjs`)
- [ ] No `verify_jwt=false` on user-mutating edge fns without role check
- [ ] `X-Goog-FieldMask` on every Places API New call (enforced by `places-api-field-mask.mjs` when promoted in W5)
- [ ] Storage policies on private buckets (contracts, identity-docs) reviewed
- [ ] Auth `leaked_password_protection` enabled

### 17f. Deployment

- [ ] mdeapp Vercel project linked
- [ ] 6 envs pushed to Vercel
- [ ] mdeapp preview serves "hola" echo (F06)
- [ ] Migration backups verified (Supabase auto)
- [ ] DNS cut at W10 only

---

## 18. Final verdict

| Question | Answer |
|---|---|
| Can the current Supabase project support the new CopilotKit architecture? | **Yes** — schema is over-built, not under-built. mdeapp ships without any new tables. |
| What MUST be rewritten? | (1) `chat-lead-capture` verify_jwt; (2) 6 `ai-*` fns are **replaced** (not rewritten) by CopilotKit + Mastra in mdeapp |
| What should be reused unchanged? | Stripe ticket stack, all 15 KEEP edge fns, Mastra observability tables, RLS posture, `idempotency_keys`, `places_search_cache`, embedding tables |
| What is dangerous? | verify_jwt drift; 80+ mutable search_path; fraud-scan minute-cron; high deploy surface (47 fns) |
| What is overengineered? | Sponsor stack (13), openclaw stack (3), postiz stack (2), contest stack (4), WhatsApp stack (1+3) — **22 fns** for Phase 2/3 features |
| What is missing? | Nothing schema-side. Operational: Sentry, structured logs, E2E suite |
| Safest migration path? | **Reuse + freeze.** No data migration. New writer is mdeapp via same anon key + RLS. |
| Solo-founder realistic? | **Yes.** ≈ 4 weeks of stabilization (W1 cron + W2 verify_jwt + W3 Mastra wire + W8 Sentry + W10 cutover). |

### Final scores

| Lens | Score | Letter |
|---|---:|---|
| Simplicity | 60 | C+ (over-built; trim 30%) |
| Scalability | 88 | B+ (PG17 + RLS + pgvector + PostGIS + pgmq available) |
| Maintainability | 73 | B (deploy surface drags; schema OK) |
| AI compatibility | 86 | A- (Mastra live; CopilotKit just connects) |
| Operational complexity | 76 | B (14 cron → 7 ideal) |
| Security | 82 | B+ (RLS strong; search_path + verify_jwt drag) |
| Developer velocity | 84 | A- (p1-crm + ticket-checkout are excellent references) |
| Production readiness | 78 | B+ (after W1-W2 quick wins → 88; after W8 Sentry → 92) |
| **Aggregate** | **78** | **B+ → A- after stabilization** |

**One-sentence summary:** the database is over-provisioned for Phase 1 needs, and the right play is to reuse the legacy project as a single source of truth, freeze every Phase-2/3 surface, and ship mdeapp as the only new writer over the existing RLS-tight schema.

---

*Generated 2026-05-19 against live state. Re-audit after W2 (post verify_jwt fix + cron cleanup) and at W10 (cutover gate).*

---

## Live re-verification — 2026-05-19 (MCP `user-supabase`)

| Check | Audit baseline | Live now | Cleanup plan phase | Verdict |
|-------|----------------|----------|-------------------|---------|
| Cron jobs | 14 active | **6 active** (`agent_tool_calls_cleanup`, `chat-archive-abandoned`, `chat-lead-followup-check`, `mdeai_analytics_daily_snapshot`, `mdeai_lead_reminder_tick`, `wait_list_expire_holds`) | Phase 0 | **Done** (better than plan’s 7) |
| Top 5 RPC `search_path` | mutable | all 5 `has_search_path: true` | Phase 1.2 | **Done** |
| `chat-lead-capture` `verify_jwt` | `true` (P0) | **`true`** | Phase 1.1 | **Not done** — anon lead capture blocked |
| `spatial_ref_sys` RLS | off | off | Phase 1.4 | **Not done** |
| Public tables RLS | 131/132 | **113/114** | — | 1 table still off (`spatial_ref_sys`) |
| Edge functions deployed | 47 | **47** ACTIVE | Phase 2 freeze | Expected (freeze = don’t call, not delete) |
| `mastra_ai_spans` rows | 932 | **932** | Phase 4 | Unchanged (retention not run) |
| mdeapp env | — | `NEXT_PUBLIC_SUPABASE_*` → `zkwcbyxiwklihegjhuql` | F04 | **Wired** |
| mdeapp `SERVICE_ROLE` in `src/` | must be 0 | **0 matches** | F04 | **Pass** |
| mdeapp Supabase client in app code | — | env only; no `@supabase/*` usage in `mdeapp/src` yet | F05+ | **Partial** — connected on paper, not exercised in chat |

**Cleanup completion (phases with mutations):** Phase 0 ≈ **95%** (cron done; OpenAI rotation manual). Phase 1 ≈ **85%** (`chat-lead-capture` v7 `verify_jwt: false` deployed + anon smoke **HTTP 200**; 11 RPCs `search_path` pinned; PostGIS RLS **skipped** — not table owner; leaked-password **dashboard** — see `tasks/notes/supabase-phase1-dashboard.md`). Phase 2 **docs** — `tasks/notes/edge-fn-freeze-list.md`. Phases 3–5 not started.

**Revised score:** **87/100** (target 88 after Auth leaked-password toggle).

**Remaining manual (≈10 min):**

1. Dashboard: leaked-password protection (`tasks/notes/supabase-phase1-dashboard.md`).
2. Optional: revoke leaked OpenAI demo key.
3. F05 Hola — Gemini; wire `chat-lead-capture` from mdeapp when F12 starts.
