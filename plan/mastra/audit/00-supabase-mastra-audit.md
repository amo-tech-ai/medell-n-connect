---
title: Supabase + Mastra storage audit (mdeai)
date: 2026-05-21
project: zkwcbyxiwklihegjhuql
auditor: Cursor agent (MCP execute_sql + list_edge_functions)
readiness_score: 62
verdict: CONDITIONAL GO — MVP blocked on PostgresStore + MAP-001; data plane healthy
---

# Supabase + Mastra audit — mdeai.co

## Executive verdict

| Lens | Score | Meaning |
|------|------:|---------|
| **Supabase data plane (Mastra tables + RLS)** | **78/100** | Tables exist, populated, `service_role` locked down |
| **mdeapp ↔ Postgres integration** | **28/100** | `LibSQLStore(:memory:)` — **no** durable threads/messages from new app |
| **Edge functions (project-wide)** | **55/100** | Many legacy fns; **20+** with `verify_jwt: false` on AI/payment paths |
| **mdeai-owned edges** | **72/100** | `chat-lead-capture` — auth/rate-limit/validation present |
| **Overall readiness** | **62/100** | **Conditional GO** for continuing build; **NO-GO** for production cutover |

**Go/no-go:** **GO** to ship **PR-1 → PR-5** on current Supabase project. **NO-GO** to declare Camila/Roberto production-ready until: (1) `PostgresStore` on pooler URL, (2) MAP-001, (3) ticket edges ported with F11 audit, (4) JWT hardened on public AI edges.

---

## 1. Mastra PostgreSQL storage

### 1.1 Expected tables (live query 2026-05-21)

| Table | Expected | Present | Row count | Notes |
|-------|----------|---------|----------:|-------|
| `mastra_agents` | ✅ | ✅ | — | Registry |
| `mastra_threads` | ✅ | ✅ | 29 | Conversation threads |
| `mastra_messages` | ✅ | ✅ | 64 | Turn storage |
| `mastra_workflow_snapshot` | ✅ | ✅ (singular name) | 18 | Not `mastra_workflow_snapshots` |
| `mastra_ai_spans` | ✅ | ✅ | 932 | Traces (legacy Mastra HTTP/obs) |
| `mastra_scorers` | ✅ | ✅ | — | Eval results |
| `mastra_datasets` | ✅ | ✅ | — | Eval datasets |
| `mastra_mcp_clients` | ✅ | ✅ | — | MCP config |
| `mastra_mcp_servers` | ✅ | ✅ | — | MCP config |
| `mastra_schedules` | ✅ | ✅ | — | Cron-style |
| `mastra_observational_memory` | ✅ | ✅ | — | OM feature |
| `mastra_resources` | ✅ | ✅ | — | Resource-scoped WM |
| `mastra_*_versions` | ✅ | ✅ | — | Versioning side tables |
| `mastra_channel_*` | Optional | ✅ | 0 typical | WhatsApp — **not** Phase 1 |
| `mastra_workspaces` / skills | Optional | ✅ | — | F13b deferred |

**Health:** Schema is **healthy and in use** (messages/spans/snapshots non-zero). Data likely from **legacy `/home/sk/mde` Mastra dev** and Studio — **not** from `mdeapp` CopilotKit path today.

### 1.2 RLS on Mastra tables

All checked `mastra_*` tables:

- `relrowsecurity = true`
- Single policy: **`service_role_manage`** — `ALL` for `{service_role}` only

**Assessment:** ✅ Correct for system tables. Anon/authenticated **cannot** read/write Mastra rows. Next.js must use **server-only** `DATABASE_URL` / pooler with service role **only** in server routes — never `NEXT_PUBLIC_*`.

**Gap:** No per-user thread policy on `mastra_threads` — acceptable if **all** Mastra access is server-mediated (Pattern 1). If client ever calls Mastra HTTP directly, add user-scoped policies.

### 1.3 Indexes / migrations

| Check | Status |
|-------|--------|
| Tables created via Mastra migrator | ✅ (legacy) |
| mdeai repo migrations for Mastra | ❌ None under `mdeapp/supabase/migrations/` |
| Duplicate app tables | ⚠️ Verify before new migrations |

**Recommended:** Document connection string in F20 task; run Mastra storage migrator against pooler once; add smoke test asserting insert to `mastra_messages` from `mdeapp` after one CopilotKit turn.

### 1.4 Unused / overbuilt tables (Phase 1)

| Table group | Phase 1 use | Action |
|-------------|-------------|--------|
| `mastra_channel_*` | None | Ignore |
| `mastra_workspaces`, `mastra_skills` | F13b deferred | Ignore |
| `mastra_experiments`, datasets | F20+ | Ignore until evals CI |
| `mastra_prompt_blocks` | Editor Phase 2 | Ignore |

---

## 2. App-owned schema safety

| Table | RLS | Policies | MVP role |
|-------|-----|----------|----------|
| `ai_runs` | ✅ | 4 | Patricia product audit (F13 ✅) |
| `events` | ✅ | 11 | Roberto publish |
| `leads` | ✅ | 5 | Camila lead capture |
| `listings` | — | (verify in advisors) | Rental inventory |

**`ai_runs`:** 193 rows — F13 CopilotKit hook writing from `mdeapp` ✅.

**Public read/write risks:** Run Supabase **security advisors** regularly (`get_advisors`). Many legacy tables may lack policies — treat **122-table** project as hostile until probed per new feature.

---

## 3. Edge functions audit

### 3.1 Inventory (remote project)

**Total active:** 40+ functions.

| Category | Examples | `verify_jwt` | Risk |
|----------|----------|--------------|------|
| Legacy AI hot path | `ai-chat`, `ai-router`, `ai-search`, `ai-embed` | **false** | 🔴 High — must not be default for mdeapp |
| Ticketing | `ticket-checkout`, `ticket-payment-webhook`, `ticket-validate` | mixed | 🟡 Port + F11 secret split |
| Rentals | `rentals` | false | 🟡 Legacy |
| Leads | `lead-from-form`, `chat-lead-capture` | mixed | 🟢 mdeai fn OK |
| Sponsors / contests | many | mixed | ⏸ Post-MVP |
| OpenClaw / Hermes | `openclaw-*`, `hermes-ranking` | false | ⏸ Advanced |

### 3.2 mdeai repo edge (`supabase/functions/chat-lead-capture`)

| Control | Status |
|---------|--------|
| CORS | ✅ `_shared/http.ts` |
| Auth | ✅ `getUserId` optional + IP rate limit when anonymous |
| Validation | ✅ intent enum, source enum |
| Service client | ✅ `getServiceClient()` |
| Zod | ⚠️ Manual validation — consider Zod parity with other new edges |
| `ai_runs` logging | ❌ Not required for lead insert — OK |

**Files:** `supabase/functions/chat-lead-capture/index.ts`, `_shared/*`

### 3.3 Critical edge blockers for MVP

| Blocker | Fix | Task |
|---------|-----|------|
| Ticket webhook secret shared with sponsor | Separate Stripe signing secrets | **F11** |
| Ticketing not in `mdeapp/supabase/functions/` | Port checkout + webhook | **EVT-01** |
| `approval-commit` missing in mdeai | Port from legacy | **F38** |
| AI edges callable without JWT | Disable for mdeapp traffic; CK Pattern 1 only | Architecture |

---

## 4. Mastra integration (mdeapp)

| Check | Expected | Actual |
|-------|----------|--------|
| Storage | `PostgresStore(DATABASE_URL)` | **`LibSQLStore({ url: ":memory:" })`** 🔴 |
| Thread memory store | Same as Mastra storage | `agent-memory.ts` — verify parity |
| `/api/copilotkit` | Pattern 1 in-process | ✅ `getLocalAgentsWithLogging` |
| Gemini key | Server-only `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ per CLAUDE.md |
| Service role in `mdeapp/src/**` | Forbidden | ✅ `lib/supabase/service.ts` server-only |
| UI agent | `routerAgent` for `/chat` | **`pingAgent` on `/` only** 🔴 |
| Agents in code | router, rental, event, concierge | ✅ registered in `mastra/index.ts` |
| Workflows | rental, event, concierge | ✅ registered — not UI-wired |

**PostgresStore connection (when F20 lands):**

```text
DATABASE_URL = Supabase pooler (transaction mode) or direct (migrations)
Same URL on Vercel env — never expose to client
createThreadMemory({ storage }) must share store id with Mastra({ storage })
```

**Env parity checklist:**

```bash
# Local (repo root → mdeapp/.env.local)
grep -E 'DATABASE_URL|GOOGLE_GENERATIVE|SUPABASE_SERVICE' mdeapp/.env.local

# Prove CopilotKit
cd mdeapp && npm run dev
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3001/api/copilotkit

# Prove ai_runs write
# SQL: SELECT * FROM ai_runs ORDER BY created_at DESC LIMIT 3;
```

---

## 5. Testing recommendations

| Test | Command / path | Priority |
|------|----------------|----------|
| Mastra storage smoke | After PostgresStore: one CK turn → `mastra_messages` +1 | P0 |
| `ai_runs` writer | `mdeapp/src/mastra/lib/log-agent-run.test.ts` | ✅ exists |
| Tool logic | `mdeapp/src/mastra/tools/__tests__/*` | ✅ partial |
| RLS anon denied | SQL: `SET ROLE anon; SELECT * FROM mastra_messages;` → deny | P1 |
| Edge lead capture | `curl` POST `chat-lead-capture` | P1 |
| Workflow snapshot | Run workflow in Studio → `mastra_workflow_snapshot` | P2 |
| F11 webhook | Stripe CLI replay | P0 for O1 |

**Missing tests:**

- PostgresStore integration test
- RLS policy regression (pgTAP or scripted SQL)
- Edge function auth matrix (jwt true/false)
- MAP pin e2e (Playwright — post MAP-001)

---

## 6. Quick wins

1. **Wire `useCoAgent({ name: "routerAgent" })` on `/chat`** once shell exists — code already in repo.
2. **F11 Stripe audit** — parallel to MAP-001; unblocks EVT-01.
3. **Document `mastra_workflow_snapshot`** singular name in F20 — avoid wrong migration grep.
4. **Run `mastra-system-check`** on PRs touching `mdeapp/src/mastra/**`.
5. **SQL dashboard for Patricia:** join `ai_runs` + `mastra_threads.title` (when titles enabled).

---

## 7. Recommended migrations (mdeai repo)

| Migration | Purpose | When |
|-----------|---------|------|
| `grounding_quota_log` | MAP-002 cost control | PR-2 |
| `places_request_log` | Places mask audit | MAP-004 |
| None for Mastra tables | Mastra owns DDL | F20 PostgresStore switch |

---

## 8. Files to inspect

| Path | Why |
|------|-----|
| `mdeapp/src/mastra/index.ts` | Storage adapter |
| `mdeapp/src/mastra/lib/agent-memory.ts` | Thread memory |
| `mdeapp/src/app/api/copilotkit/route.ts` | Runtime |
| `mdeapp/src/mastra/copilotkit/logging-mastra-agent.ts` | `ai_runs` |
| `mdeapp/src/lib/supabase/service.ts` | Service role guard |
| `supabase/functions/chat-lead-capture/` | MVP lead edge |
| `tasks/core/F13-ai-runs-observability.md` | Done evidence |
| `tasks/core/F20-evaluation-and-deploy-prep.md` | PostgresStore |
| `/home/sk/mde/supabase/functions/ticket-*` | Port source |

---

## 9. Commands

```bash
# App health
cd /home/sk/mdeai/mdeapp && npm run floor
cd /home/sk/mdeai/mdeapp && npm run dev

# Unit tests (mastra)
cd /home/sk/mdeai/mdeapp && npx vitest run src/mastra

# Supabase (if CLI linked)
supabase functions list
supabase db lint

# SQL (MCP or psql)
SELECT count(*) FROM mastra_messages;
SELECT count(*) FROM ai_runs WHERE agent_name = 'ping-agent';
SELECT tablename, policyname FROM pg_policies WHERE tablename LIKE 'mastra%' LIMIT 5;
```

---

## 10. Final go/no-go

| Gate | Verdict |
|------|---------|
| Continue MVP development on shared Supabase | **GO** |
| Use Mastra Postgres tables as-is | **GO** |
| Ship mdeapp with `:memory:` storage | **NO-GO** |
| Production traffic cutover | **NO-GO** |
| Rely on legacy `ai-chat` edge for mdeapp | **NO-GO** |

**Critical blockers (ordered):**

1. MAP-001 platform map pipeline  
2. `PostgresStore` + shared thread memory (F20 / storage task)  
3. Roberto HITL + `approval-commit` edge  
4. EVT-01 ticket port + F11 webhook secrets  
5. Edge JWT hardening on any remaining public AI endpoints used in prod  

See also: [`../prd-mastra.md`](../prd-mastra.md) · [`../mastra-roadmap.md`](../mastra-roadmap.md)
