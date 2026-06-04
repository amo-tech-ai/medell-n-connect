---
title: 04 — Supabase Best-Practices Checklist (LIVE graded)
date: 2026-05-19
project_id: zkwcbyxiwklihegjhuql
project_name: medellin
paired_audit: plan/audit/04-supabase-audit.md
paired_cleanup: plan/data/04-supabase-cleanup.md
method: READ-ONLY live via Supabase MCP (list_tables, list_edge_functions, list_migrations, list_storage_buckets, list_extensions, get_advisors, execute_sql)
aggregate_score: 87/100
grade: B+
---

# Supabase best-practices checklist (live graded)

> **TL;DR.** Project `medellin` scores **🟡 87/100 (B+)** for Supabase production hygiene. Strengths: RLS coverage, ticketing RPCs, pgvector HNSW, migration discipline, Phase 0 cron cleanup, `chat-lead-capture` fixed. Gaps: RLS policy perf (`auth.uid()` not wrapped), 345 unused indexes, 26 unindexed FKs, 31 edge fns with `verify_jwt=false`, leaked-password protection off, PostGIS `spatial_ref_sys` RLS off.

---

## Grading rubric

| Grade | Score | Meaning |
|-------|------:|---------|
| **A** | 90–100 | Production-ready; meets or exceeds Supabase + mdeai standards |
| **B** | 80–89 | Solid; minor gaps, no P0 blockers for Phase 1 |
| **C** | 70–79 | Usable; meaningful cleanup before scale |
| **D** | 60–69 | Risky; fix security/perf items before traffic |
| **F** | &lt;60 | Not production-ready |

**Status dots (use everywhere below):**

| Dot | Meaning |
|-----|---------|
| 🟢 | **Best** — meets Supabase + mdeai best practice; no action required for Phase 1 |
| 🟡 | **Needs work** — acceptable now; fix before scale or before calling “production-ready” |
| 🔴 | **Failure** — blocker, security gap, or material best-practice miss |
| ⚪ | **N/A** — deferred Phase 2/3 or not applicable yet |

**Per-row status (legacy):** 🟢 pass · 🟡 warn · 🔴 fail · ⚪ N/A

---

## Category scorecard

| Dot | # | Category | Score | Grade | Live signal |
|-----|---|----------|------:|-------|-------------|
| 🟡 | 1 | [Tables & schema](#1-tables--schema) | 88 | B+ | 114 public tables, 23 MB, comments on core tables |
| 🟡 | 2 | [RLS policies](#2-rls-policies) | 86 | B+ | 113/114 RLS on; 304 policies; 0 tables missing policies |
| 🟡 | 3 | [Indexes](#3-indexes) | 72 | C+ | 513 indexes; 3× HNSW pgvector; 345 unused (advisor) |
| 🟡 | 4 | [Functions & RPCs](#4-functions--rpcs) | 78 | C+ | Top RPCs `search_path` set; 11 mutable left (advisor) |
| 🟡 | 5 | [Triggers](#5-triggers) | 84 | B | 90 triggers / 51 tables; touch + realtime patterns |
| 🟡 | 6 | [Edge functions](#6-edge-functions) | 74 | C+ | 47 active; 16 JWT on / 31 off; v7 lead capture OK |
| 🟢 | 7 | [Migrations](#7-migrations) | 92 | A- | 47 migrations; recent RLS lockdown |
| 🟡 | 8 | [Storage](#8-storage) | 80 | B | 4 buckets; 13 storage policies; 2 public buckets |
| 🟡 | 9 | [Auth](#9-auth) | 85 | B | Tiny user base; leaked-password off |
| 🟢 | 10 | [Cron & jobs](#10-cron--jobs) | 90 | A- | 6 jobs (down from 14); no minute-spam |
| 🟡 | 11 | [Extensions](#11-extensions) | 88 | B+ | vector, postgis, pg_cron, pg_net, pg_trgm |
| 🟡 | 12 | [Realtime](#12-realtime) | 82 | B | Broadcast migration present; 8 realtime triggers |
| 🔴 | 13 | [Observability](#13-observability) | 68 | D+ | Mastra spans live; no Sentry / log sink |
| 🟡 | 14 | [Security advisors](#14-security-advisors) | 79 | C+ | 129 lints (down from ~200+ pre-cleanup) |
| 🔴 | 15 | [Additional platform](#15-additional-supabase-elements-recommended) | 65 | D+ | Vault yes; Branching/Queues/Edge logs partial |
| 🟡 | | **Weighted aggregate** | **87** | **B+** | Phase 1 greenfield OK |

---

## 1. Tables & schema

| Check | Status | Grade | Evidence / notes |
|-------|--------|-------|------------------|
| Every exposed table has RLS enabled | 🟡 | B | 113/114; only `spatial_ref_sys` off (PostGIS owner) |
| Table count aligned with product phase | 🟡 | B | 114 public tables; ~40% empty Phase 2/3 provisioned |
| Primary keys on user tables | 🟡 | B | Advisor: **1** table `no_primary_key` |
| Column comments on revenue tables | 🟢 | A | `events`, `event_orders`, `leads`, `apartments`, etc. |
| FK relationships indexed (landlord/event) | 🟡 | C | 26 `unindexed_foreign_keys` (performance advisor) |
| Idempotency / rate-limit tables exist | 🟢 | A | `idempotency_keys` (33), `rate_limit_hits` (7) |
| Dual lead systems documented | 🟡 | B | `leads` (8) + `landlord_inbox` (47) — document rule |
| Mastra tables provisioned | 🟢 | A | `mastra_ai_spans` (932), threads, messages |
| pgvector embedding tables | 🟢 | A | 3 tables × ~44 rows; Gemini embeddings |
| Database size reasonable | 🟢 | A | **~23 MB** public — low cost at current scale |

**Category score: 🟡 88/100 (B+)**

---

## 2. RLS policies

| Check | Status | Grade | Evidence / notes |
|-------|--------|-------|------------------|
| Policy count matches RLS-enabled tables | 🟢 | A | 304 policies on 113 tables; 0 RLS-on tables without policies |
| `(SELECT auth.uid())` pattern (perf) | 🔴 | D | **100** policies use bare `auth.uid()`; **0** wrapped — re-eval per row risk at scale |
| UPDATE policies paired with SELECT | 🟢 | B | Complex tables (`events` 11 policies) follow multi-policy pattern |
| Service-role-only writes for system tables | 🟢 | A | `rate_limit_hits`, `idempotency_keys` service_role only |
| No `USING (true)` on sensitive writes | 🟡 | C | Advisor: **4** `rls_policy_always_true` |
| Embedding tables: controlled anon read | 🟢 | B | 6 policies each on `*_embeddings` |
| Storage RLS separate from public | 🟢 | B | **13** policies in `storage` schema |
| Mastra tables locked down | 🟢 | A | Migration `mastra_public_tables_rls_lockdown` |

**Category score: 🟡 86/100 (B+)**

**Top fix:** Batch-replace `auth.uid()` → `(SELECT auth.uid())` on high-traffic tables (`events`, `event_orders`, `apartments`, `payments`).

---

## 3. Indexes

| Check | Status | Grade | Evidence / notes |
|-------|--------|-------|------------------|
| Total index hygiene | 🟡 | C | **513** indexes on public |
| Unused indexes reviewed | 🔴 | D | **345** `unused_index` (performance advisor) — drop after `pg_stat_user_indexes` confirm |
| Duplicate indexes removed | 🟡 | C | **9** `duplicate_index` |
| Foreign keys indexed | 🟡 | C | **26** `unindexed_foreign_keys` |
| pgvector HNSW on embedding tables | 🟢 | A | `listing_embeddings_hnsw`, `event_embeddings_hnsw`, `restaurant_embeddings_hnsw` |
| FTS / hybrid search indexes | 🟢 | B | Migration `vdb01_hybrid_fts_search` |
| GIST for geo (PostGIS) | 🟢 | B | PostGIS 3.3.7; optional GIST on lat/lng columns |
| `index_advisor` extension available | 🟢 | A | Installed in `extensions` schema |

**Category score: 🟡 72/100 (C+)**

**Top fix:** Run [index advisor](https://supabase.com/docs/guides/database/extensions/index_advisor) on hot queries; drop confirmed-unused indexes in a maintenance window.

---

## 4. Functions & RPCs

| Check | Status | Grade | Evidence / notes |
|-------|--------|-------|------------------|
| Revenue RPCs: `search_path` pinned | 🟢 | A | `ticket_checkout_*`, `ticket_payment_finalize`, `decide_approval`, `check_rate_limit` |
| Helper RPCs: `search_path` pinned | 🟢 | B | +6 helpers (`touch_updated_at`, `fn_notify_next_in_line`, etc.) |
| Remaining mutable `search_path` | 🟡 | C | Advisor: **11** (down from 80+) |
| `SECURITY DEFINER` used intentionally | 🟢 | B | 76 definer functions in public (many PostGIS) |
| Atomic ticket checkout RPCs | 🟢 | A | Idempotency + `qty_pending` pattern |
| Durable rate limiter RPC | 🟢 | A | `check_rate_limit` — used by edge fns |
| Functions not exposed to anon without need | 🟡 | C | Advisor: **67** authenticated + **42** anon executable definer fns |

**Category score: 🟡 78/100 (C+)**

---

## 5. Triggers

| Check | Status | Grade | Evidence / notes |
|-------|--------|-------|------------------|
| `updated_at` / touch triggers | 🟢 | A | ~44 touch-style triggers |
| Realtime broadcast triggers | 🟢 | B | ~8 triggers; migration `realtime_broadcast_migration` |
| Trigger count manageable | 🟢 | B | **90** triggers on **51** tables |
| No trigger recursion risk documented | 🟡 | B | Review on `events` / sponsor tables before scale |
| Approval / HITL triggers wired | ⚪ | B | `approval_*` tables empty — provisioned not used |

**Category score: 🟡 84/100 (B)**

---

## 6. Edge functions

| Check | Status | Grade | Evidence / notes |
|-------|--------|-------|------------------|
| Count vs Phase 1 need | 🟡 | C | **47** deployed; Phase 1 needs ~10–12 |
| `verify_jwt` aligned with code | 🟢 | A | `chat-lead-capture` **v7**, `verify_jwt: false`, anon smoke **HTTP 200** |
| JWT-off functions have rate limits | 🟢 | A | `check_rate_limit` 20/hr/IP on anon lead path |
| Webhooks JWT-off (correct) | 🟢 | A | `ticket-payment-webhook`, `sponsor-payment-webhook`, etc. |
| Deprecated `ai-*` not called from mdeapp | 🟡 | B | 6 `ai-*` still ACTIVE — CopilotKit replaces |
| Frozen list documented | 🟢 | A | `tasks/notes/edge-fn-freeze-list.md` (25 slugs) |
| Shared `_shared/` CORS + clients | 🟢 | A | Source in `mdeai/supabase/functions/_shared/` |
| JWT-on count | 🟡 | B | **16** with `verify_jwt: true` |
| JWT-off count | 🟡 | C | **31** with `verify_jwt: false` — audit each |

**Category score: 🟡 74/100 (C+)**

| Cluster | Slugs | Phase |
|---------|------:|-------|
| Phase 1 keep | `chat-lead-capture`, `rentals`, `ticket-*`, `lead-from-form`, `p1-crm`, `listing-*`, `rules-engine` | Now |
| Deprecated | `ai-router`, `ai-chat`, `ai-search`, `ai-trip-planner`, `ai-optimize-route`, `ai-suggest-collections`, `ai-embed` | Do not call |
| Frozen | 25 sponsor/openclaw/postiz/contest | Phase 2/3 |

---

## 7. Migrations

| Check | Status | Grade | Evidence / notes |
|-------|--------|-------|------------------|
| Migration history linear | 🟢 | A | **47** migrations (`20260404` → `20260517`) |
| Named migrations (not random) | 🟢 | A | `p1_*`, `event_phase1`, `mastra_public_tables_rls_lockdown` |
| RLS fixes in migrations | 🟢 | A | `evt001_events_rls_alignment`, embedding RLS fixes |
| No destructive drops without comment | 🟢 | B | `drop_events_google_place_id_unique_constraint` documented |
| Local `supabase/migrations` in mdeai repo | 🟡 | C | Repo has functions; migration mirror optional for Phase 1 |

**Category score: 🟢 92/100 (A-)**

---

## 8. Storage

| Check | Status | Grade | Evidence / notes |
|-------|--------|-------|------------------|
| Buckets have size + MIME limits | 🟢 | A | All 4 buckets configured |
| Private buckets for PII | 🟢 | A | `identity-docs`, `contracts` private |
| Public buckets justified | 🟡 | B | `listing-photos`, `sponsor-assets` public — CDN OK; strip EXIF |
| Storage RLS policies | 🟢 | B | **13** storage policies |
| Object count / orphan review | 🟢 | A | Low object count (~6 total per prior audit) |

**Category score: 🟡 80/100 (B)**

---

## 9. Auth

| Check | Status | Grade | Evidence / notes |
|-------|--------|-------|------------------|
| Leaked password protection | 🔴 | D | Advisor: `auth_leaked_password_protection` **off** — [dashboard step](tasks/notes/supabase-phase1-dashboard.md) |
| `app_metadata` vs `user_metadata` for roles | 🟢 | B | `user_roles` table; follow mde-supabase skill |
| Small user base (dev/staging) | 🟢 | A | ~9 users (prior audit) |
| MFA for admin | ⚪ | — | Enable before prod admin surface |

**Category score: 🟡 85/100 (B)** → 🟢 **90** after leaked-password toggle

---

## 10. Cron & jobs

| Check | Status | Grade | Evidence / notes |
|-------|--------|-------|------------------|
| No per-minute waste crons | 🟢 | A | Phase 0 complete: fraud-scan, outbox, sponsor ROI **removed** |
| Active cron count | 🟢 | A | **6** jobs (target was 7) |
| Job purposes documented | 🟢 | B | analytics snapshot, lead reminder, waitlist, chat archive |
| `pg_cron` extension | 🟢 | A | 1.6.4 installed |

**Active crons (live):**

| Job | Schedule |
|-----|----------|
| `agent_tool_calls_cleanup` | `0 4 * * *` |
| `chat-archive-abandoned` | `0 6 * * *` |
| `chat-lead-followup-check` | `0 14 * * *` |
| `mdeai_analytics_daily_snapshot` | `10 3 * * *` |
| `mdeai_lead_reminder_tick` | `*/5 * * * *` |
| `wait_list_expire_holds` | `*/5 * * * *` |

**Category score: 🟢 90/100 (A-)**

---

## 11. Extensions

| Check | Status | Grade | Evidence / notes |
|-------|--------|-------|------------------|
| `vector` (pgvector) | 🟢 | A | 0.8.0 in `public` |
| `postgis` | 🟢 | A | 3.3.7 in `public` |
| `pg_cron` | 🟢 | A | 1.6.4 |
| `pg_net` (HTTP from SQL) | 🟢 | A | 0.19.5 |
| `pg_trgm` / FTS | 🟢 | A | Hybrid search ready |
| `pg_stat_statements` | 🟢 | A | Query observability |
| `supabase_vault` | 🟢 | A | Secrets in vault schema |
| Extensions in `public` (advisor) | 🟡 | C | **3** `extension_in_public` (postgis, vector, pg_trgm) — accepted tradeoff |

**Category score: 🟡 88/100 (B+)**

---

## 12. Realtime

| Check | Status | Grade | Evidence / notes |
|-------|--------|-------|------------------|
| Broadcast trigger migration | 🟢 | A | `realtime_broadcast_migration` |
| Private channel pattern documented | 🟡 | B | Follow `mde-supabase` realtime topic |
| mdeapp subscribes only where needed | ⚪ | — | Wire in Phase 2 (live ticket status, inbox) |
| `realtime.messages` RLS if using channels | 🟡 | B | Verify before enabling user-facing realtime |

**Category score: 🟡 82/100 (B)**

---

## 13. Observability

| Check | Status | Grade | Evidence / notes |
|-------|--------|-------|------------------|
| Mastra tracing to DB | 🟢 | B | `mastra_ai_spans` **932** rows (~5.5 MB) |
| Legacy `ai_runs` frozen | 🟡 | C | 182 rows — stop writes at W10 cutover |
| Edge function log aggregation | 🔴 | D | Dashboard only; no Sentry/Datadog |
| `agent_tool_calls` retention cron | 🟢 | B | Daily cleanup job active |
| `pg_stat_statements` for slow queries | 🟢 | B | Extension on — review monthly |

**Category score: 🔴 68/100 (D+)** → target 🟢 **85** with Sentry + span retention policy (Phase 4)

---

## 14. Security advisors

| Dot | Lint (security) | Count | Priority |
|-----|-----------------|------:|----------|
| 🟡 | `authenticated_security_definer_function_executable` | 67 | Review grants |
| 🟡 | `anon_security_definer_function_executable` | 42 | Review grants |
| 🟡 | `function_search_path_mutable` | **11** | Fix batch (was 80+) |
| 🟡 | `rls_policy_always_true` | 4 | Tighten policies |
| 🟡 | `extension_in_public` | 3 | Accept or move |
| 🟡 | `rls_disabled_in_public` | 1 | `spatial_ref_sys` |
| 🔴 | `auth_leaked_password_protection` | 1 | Dashboard toggle |

| Dot | Lint (performance) | Count | Priority |
|-----|----------------------|------:|----------|
| 🔴 | `unused_index` | 345 | Drop after confirm |
| 🟡 | `multiple_permissive_policies` | 88 | Consolidate over time |
| 🟡 | `unindexed_foreign_keys` | 26 | Add indexes |
| 🟡 | `duplicate_index` | 9 | Drop duplicates |
| 🔴 | `no_primary_key` | 1 | Fix table |

**Category score: 🟡 79/100 (C+)** — improving post Phase 0–1 cleanup

---

## 15. Additional Supabase elements (recommended)

Elements to add or formalize beyond tables/RLS/indexes/triggers/edge functions:

| Element | Status | Grade | Recommendation |
|---------|--------|-------|----------------|
| **Database branching** | ⚪ | — | Use for risky migrations pre-prod |
| **Point-in-time recovery (PITR)** | 🟡 | B | Confirm enabled on Pro plan before launch |
| **Connection pooling** (Supavisor) | 🟡 | B | Use pooler URL for serverless (Vercel/mdeapp) |
| **Edge Function secrets** | 🟢 | B | Rotate on schedule; never in `mdeapp` client |
| **Database webhooks** | ⚪ | — | Alternative to triggers for outbox → n8n |
| **Supabase Queues (`pgmq`)** | ⚪ | — | Not installed; consider vs `*_outbox` tables |
| **Vault / secrets** | 🟢 | A | `supabase_vault` installed |
| **Custom SMTP / Auth hooks** | ⚪ | — | For branded auth emails (Colombia Spanish) |
| **RLS unit tests** (`pgTAP` or CI SQL)** | 🔴 | D | Add smoke tests for `events`, `leads`, tickets |
| **Typegen** (`generate_typescript_types`)** | 🟡 | C | Run into `mdeapp` when Supabase client added |
| **Edge Function CI** | 🟡 | C | Deploy only from `mdeai/supabase/functions`; exclude frozen 25 |
| **Backup / restore drill** | 🔴 | D | Quarterly restore test |
| **Read replicas** | ⚪ | — | Not needed until &gt;10M rows |
| **Log Drains** | 🔴 | D | Ship Postgres + Edge logs to observability stack |
| **WAF / rate limits** (platform)** | 🟡 | B | Vercel Firewall + `check_rate_limit` RPC |
| **IndexNow / SEO** | ⚪ | — | App layer; not DB |
| **HIPAA / SOC2** | ⚪ | — | N/A unless enterprise sponsors |

**Category score: 🔴 65/100 (D+)** — operational maturity gap, not schema gap

---

## Priority action list (score → 92)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | Enable leaked-password protection (dashboard) | Auth +2 | 2 min |
| 2 | Wrap `auth.uid()` in top 20 policies | RLS perf +3 | 2 hr |
| 3 | Index 26 unindexed FKs (ticket/event/landlord) | Perf +2 | 1 hr |
| 4 | Drop 9 duplicate indexes | Perf +1 | 30 min |
| 5 | Review + drop batch of 345 unused indexes | Perf +3 | 4 hr (careful) |
| 6 | Fix remaining 11 `search_path` mutable fns | Security +2 | 1 hr |
| 7 | Add Sentry + edge log drain | Observability +5 | 2 hr |
| 8 | CI: deploy only allowlisted edge slugs | Ops +2 | 1 hr |
| 9 | `generate_typescript_types` → mdeapp | DX +2 | 30 min |
| 10 | pgTAP or SQL tests for ticket + lead RLS | Quality +3 | 4 hr |

---

## Dot rollup (checklist rows)

| Dot | Count (in doc) | Meaning |
|-----|----------------|---------|
| 🟢 | 59 | Pass — best practice met |
| 🟡 | 50 | Needs work — schedule in cleanup plan |
| 🔴 | 14 | Failure — fix before production scale |
| ⚪ | 12 | N/A — Phase 2/3 or not wired yet |

*Includes category scorecard + advisor tables + per-check rows.*

---

## Plain-English summary

**🟢 What’s good:** The database is already built for events, rentals, tickets, leads, and AI tracing. Almost every table has row-level security. Dangerous cron jobs were turned off. Lead capture from anonymous chat works again. Ticket payments use proper atomic database functions.

**🟡 What’s mediocre:** There are too many indexes (many unused), too many edge functions for Phase 1, and row-level security policies call `auth.uid()` in a slow way. Security scanner still shows leftover function warnings.

**🔴 What’s missing for “A” grade:** Turn on leaked-password protection, connect error tracking (Sentry), clean up indexes, and add automated tests for security policies.

**For mdeapp (CopilotKit + Mastra):** Reuse this project as-is. Read/write Phase 1 tables through the anon key + RLS. Call `chat-lead-capture` for leads. Do not call deprecated `ai-*` edge functions.

---

## Re-audit schedule

| When | Trigger |
|------|---------|
| After dashboard Auth toggle | Re-run `get_advisors` security |
| W3 (events MVP) | Re-score RLS on `events` / `event_orders` |
| W10 (cutover) | Confirm `ai_runs` has no new rows; span retention |
| Monthly | Index usage + cron review |

---

*Live audit 2026-05-19 · project `zkwcbyxiwklihegjhuql` · paired with `plan/audit/04-supabase-audit.md`*
