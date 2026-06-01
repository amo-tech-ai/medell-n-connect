---
title: 04 — Supabase Cleanup Plan (paired with audit 04)
date: 2026-05-19
author: Senior Supabase Architect / mdeai
paired_audit: /home/sk/mdeai/plan/audit/04-supabase-audit.md
project_id: zkwcbyxiwklihegjhuql
project_name: medellin
philosophy: reuse + freeze (no schema migrations Phase 1)
scope:
  in: cron cleanup, search_path hardening, edge-fn freeze, verify_jwt fix, security advisor close-outs, observability decisions
  out: data migration, schema redesign, sponsor/openclaw/contest feature work
status: Phase 0–1 executed 2026-05-19 (audit re-verification)
---

# 04 — Supabase Cleanup Plan

> **TL;DR.** 5 phases over 4-5 weeks. Phase 0 (≈30 min today) kills the obvious money-burners. Phase 1 (≈2 hrs W2) closes the named P0/P1 advisor findings. Phase 2-5 are gradual — most touch dormant systems with low blast radius. **Every action below is reversible.** Concrete SQL + commands inline; copy-paste runnable. **No destructive operations.**

## Verdict box

| | |
|---|---|
| Total estimated effort | 16-20 hours over 5 weeks |
| Reversibility | All actions are reversible (re-schedule cron, ALTER FUNCTION, redeploy edge fn) |
| Production blast radius | LOW for Phase 0-1 (idle systems); MEDIUM for Phase 3 (schema decisions touch real data); LOW again Phase 4-5 |
| Required approvals | User explicit approval for each `execute_sql` mutation (per `.claude/settings.json` `ask` rules) |
| Tooling | Supabase MCP (`execute_sql`, `apply_migration`, `deploy_edge_function`), Supabase Dashboard, Vercel CLI |
| Outcomes if done | Supabase aggregate score 78 → **88** (W2 quick wins) → **92** (W8 Sentry) → **95** (W10 cutover) |

---

## Pre-flight (read-only, before any Phase 0 action)

Run these to confirm the live state matches the audit. If any answer surprises, **stop and re-audit** before mutating.

```sql
-- 1. Confirm cron jobs and current schedule
SELECT jobid, jobname, schedule, active FROM cron.job ORDER BY jobname;

-- 2. Confirm function count with mutable search_path (advisor source)
SELECT n.nspname || '.' || p.proname AS function_name,
       p.proconfig AS config
FROM pg_proc p JOIN pg_namespace n ON p.pronamespace=n.oid
WHERE n.nspname IN ('public','sponsor','marketing')
  AND p.prokind='f'
  AND p.proconfig IS NULL
ORDER BY function_name
LIMIT 100;

-- 3. Confirm chat-lead-capture verify_jwt status (read the deployed config via MCP get_edge_function)
-- → use mcp__ed3787fc-..._get_edge_function function_slug=chat-lead-capture

-- 4. Confirm spatial_ref_sys still RLS-off
SELECT relname, relrowsecurity FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
WHERE n.nspname='public' AND c.relname='spatial_ref_sys';
```

---

## Phase 0 — Stop the bleeding (W1, ≈30 min)

Goal: cut cron-cost ≈30% and burn down idle workload. Nothing here touches user-facing functionality.

### 0.1 — Disable wasteful cron jobs (3 jobs)

| Job | Why | Schedule | Action |
|---|---|---|---|
| `fraud-scan-cron` | Phase-3 contest fraud function; runs `* * * * *` (every minute) on logic that has no current data flow | every minute | DISABLE |
| `sponsor-roi-explain-daily` | Phase-3 sponsor; calls `sponsor-roi-explain` edge fn with service_role bearer on every live sponsor app (currently 0) | `0 6 * * *` | DISABLE |
| `sponsor-roi-rollup` | Phase-3 sponsor analytics rollup | `*/5 * * * *` | DISABLE |

**SQL (via Supabase MCP `execute_sql`):**

```sql
SELECT cron.unschedule('fraud-scan-cron');
SELECT cron.unschedule('sponsor-roi-explain-daily');
SELECT cron.unschedule('sponsor-roi-rollup');
```

**Verification:**
```sql
SELECT jobname FROM cron.job WHERE jobname IN ('fraud-scan-cron','sponsor-roi-explain-daily','sponsor-roi-rollup');
-- Expected: 0 rows
```

**Rollback** (if any of these turn out to be needed): the function bodies are still in the edge function registry; re-schedule with the original command (saved in audit doc §10a) using `cron.schedule(jobname, schedule, command)`.

**Risk:** none. These jobs have zero active payload (sponsor + contest features are Phase 3).

### 0.2 — Pause idle cron jobs (4 jobs)

| Job | Why pause | Schedule | Action |
|---|---|---|---|
| `outbox_dispatch_tick` | Fires every minute against empty `posts_outbox` / `wa_outbox` / `email_outbox` | `* * * * *` | DISABLE (re-enable when outbox tables populate) |
| `outbox_reset_stuck` | Same — operates on empty outbox tables | `*/5 * * * *` | DISABLE |
| `campaign_conversions_rollup` | Sponsor marketing rollup; sponsor stack is frozen | `15 3 * * *` | DISABLE |
| `failed_deliveries_digest_daily` | Fires daily POST to `failed-deliveries-digest` edge fn; nothing to digest | `0 7 * * *` | DISABLE |

**SQL:**

```sql
SELECT cron.unschedule('outbox_dispatch_tick');
SELECT cron.unschedule('outbox_reset_stuck');
SELECT cron.unschedule('campaign_conversions_rollup');
SELECT cron.unschedule('failed_deliveries_digest_daily');
```

**Rollback:** re-schedule from audit doc §10a SQL snippets when outbox tables (`posts_outbox`, `wa_outbox`, `email_outbox`) start collecting rows in Phase 2 (W3+).

**Risk:** none currently. **Re-enable trigger:** when any of `posts_outbox`, `wa_outbox`, `email_outbox` has rows.

### 0.3 — Rotate the leaked OpenAI key (user dashboard, ≈5 min)

The cloned-example `mdeapp/.env` contained `OPENAI_API_KEY=sk-proj-Bs21yet8…`. F01 deleted the file, but the key was on disk and read by Claude during this session.

**Action (user):**

1. Open https://platform.openai.com/api-keys
2. Find the key starting with `sk-proj-Bs21…`
3. Click "Revoke"
4. (Optional) Create a new key only if you actually use OpenAI (mdeapp is Gemini-only per CLAUDE.md, so no replacement needed)

**Verification:** keep an eye on OpenAI dashboard usage for the next 24h. If a charge appears for the revoked key, escalate.

### Phase 0 — what should be true after

- [x] 6 cron jobs running (down from 14) — verified live
- [x] No high-cost minute-rate cron jobs
- [ ] OpenAI key rotated (manual — `tasks/notes/supabase-phase1-dashboard.md`)

---

## Phase 1 — Security hygiene (W2, ≈2 hrs)

Goal: close named P0/P1 advisor findings. Touches code paths but nothing user-visible.

### 1.1 — Fix `chat-lead-capture` verify_jwt drift

| Detail | Value |
|---|---|
| Issue | Edge fn deployed `verify_jwt: true` but code handles `userId === null` anon path with `allowRateDurable` rate-limiting. Anon path is dead code today. |
| Source of truth | `/home/sk/mde/supabase/functions/chat-lead-capture/index.ts` (legacy) — already correct in code; only config.toml needs flipping |
| Impact if not fixed | Anon visitors can't capture leads from chat (rejected at gateway with 401) |

**Action:**

```bash
# In legacy /home/sk/mde/ checkout (read-only per CLAUDE.md, but ONE-LINE config edit is allowed as an exception):
# Edit supabase/functions/chat-lead-capture/config.toml
# Change: verify_jwt = true → verify_jwt = false
```

OR via Supabase MCP `deploy_edge_function` with the same source + new config flag.

**Verification (Supabase MCP):**
```
get_edge_function function_slug=chat-lead-capture
→ check files[].verify_jwt === false
```

**Rollback:** re-deploy with `verify_jwt: true`.

**Risk:** LOW. Anon path is already rate-limited via `check_rate_limit` RPC (20/hr/IP).

### 1.2 — Set `search_path` on top-5 production RPCs

| RPC | Why critical | search_path target |
|---|---|---|
| `decide_approval` | HITL approval flow (Roberto W3) | `public, pg_temp` |
| `check_rate_limit` | All anonymous edge fns rate-limit via this | `public, pg_temp` |
| `ticket_checkout_create_pending` | Atomic ticket capacity check (revenue-critical) | `public, pg_temp` |
| `ticket_payment_finalize` | Stripe webhook ticket finalize (revenue-critical) | `public, pg_temp` |
| `ticket_checkout_cancel` | Order cancel on Stripe failure (releases qty_pending) | `public, pg_temp` |

**SQL:**

```sql
ALTER FUNCTION public.decide_approval(uuid, text, jsonb, text)
  SET search_path = public, pg_temp;
ALTER FUNCTION public.check_rate_limit(text, integer, integer)
  SET search_path = public, pg_temp;
ALTER FUNCTION public.ticket_checkout_create_pending(uuid, uuid, integer, text, text, text, jsonb)
  SET search_path = public, pg_temp;
ALTER FUNCTION public.ticket_payment_finalize(uuid, text)
  SET search_path = public, pg_temp;
ALTER FUNCTION public.ticket_checkout_cancel(uuid)
  SET search_path = public, pg_temp;
```

> **Note:** the actual function signatures may differ slightly — run `\df public.decide_approval` (or query `pg_proc`) first to confirm exact argument types. If a signature mismatch returns "function does not exist," the function may have been overloaded; the `ALTER FUNCTION` must match the exact (oid) signature.

**Verification:**
```sql
SELECT p.proname, p.proconfig
FROM pg_proc p JOIN pg_namespace n ON p.pronamespace=n.oid
WHERE n.nspname='public'
  AND p.proname IN ('decide_approval','check_rate_limit',
                    'ticket_checkout_create_pending',
                    'ticket_payment_finalize','ticket_checkout_cancel')
ORDER BY p.proname;
-- Expected: proconfig contains 'search_path=public, pg_temp' for all 5
```

**Rollback:** `ALTER FUNCTION x RESET search_path;` reverts to inherited.

**Risk:** LOW. SECURITY DEFINER functions explicitly setting search_path is the documented best practice (Supabase advisor lint 0011, PostgreSQL docs).

### 1.3 — Enable Supabase Auth `leaked_password_protection`

**Action (user, dashboard):**

1. Open Supabase dashboard → Authentication → Settings
2. Toggle `Leaked password protection` ON
3. Save

**Verification:** advisor lint `auth_leaked_password_protection_off` should clear on next `get_advisors` run.

**Rollback:** toggle OFF.

**Risk:** none. Blocks signups using passwords known to have been leaked (HIBP integration).

### 1.4 — `spatial_ref_sys` RLS (optional, silences one advisor warning)

| Detail | Value |
|---|---|
| Why | PostGIS system table; anon read is fine but advisor flags it |
| Impact | Silences one WARN |
| Safety | Public-read policy preserves PostGIS read access |

**SQL:**
```sql
ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON public.spatial_ref_sys FOR SELECT USING (true);
```

**Verification:**
```sql
SELECT relname, relrowsecurity FROM pg_class
WHERE relname='spatial_ref_sys' AND relnamespace=(SELECT oid FROM pg_namespace WHERE nspname='public');
-- Expected: relrowsecurity = true

SELECT polname FROM pg_policies WHERE tablename='spatial_ref_sys';
-- Expected: 'public read'
```

**Rollback:** `DROP POLICY "public read" ON public.spatial_ref_sys;` then `ALTER TABLE public.spatial_ref_sys DISABLE ROW LEVEL SECURITY;`

**Risk:** none if policy is created BEFORE enabling RLS (otherwise queries break for all reads until policy lands).

### Phase 1 — what should be true after

- [x] `chat-lead-capture` `verify_jwt: false` deployed (v7; anon smoke HTTP 200)
- [x] 5 critical RPCs + 6 helpers have `search_path` set
- [ ] Supabase Auth `leaked_password_protection` enabled (dashboard)
- [ ] `spatial_ref_sys` RLS — skipped (PostGIS owner; accepted warning)
- [ ] Re-run `get_advisors type=security` after dashboard toggle

---

## Phase 2 — Edge function freeze (W3-W5, ≈4 hrs)

Goal: stop drift on 25 edge functions that support deferred Phase 2/3 features. Code stays deployed (no removal); deploy automation is paused so an accidental push can't change them.

### 2.1 — Freeze list (25 functions)

| Cluster | Slugs | Cron triggers to disable |
|---|---|---|
| Sponsor (13) | `sponsor-checkout`, `sponsor-payment-webhook`, `sponsor-impression`, `sponsor-click`, `sponsor-contract-sign`, `sponsor-contract-generate`, `sponsor-application-create`, `sponsor-cancel`, `sponsor-moderate`, `sponsor-roi-explain`, `sponsor-audience-match`, `sponsor-optimize`, `sponsor-creative-gen` | already disabled in Phase 0 (roi-explain-daily, roi-rollup) |
| OpenClaw (3) | `openclaw-delivery-webhook`, `openclaw-concierge-webhook`, `openclaw-outreach` | none |
| Postiz (2) | `postiz-schedule-posts`, `postiz-approval-webhook` | none |
| Contest (4) | `vote-cast`, `contestant-social-enrich`, `fraud-scan`, `moderate-asset` | already disabled in Phase 0 (fraud-scan-cron) |
| Other (3) | `whatsapp-webhook` (Phase 2), `hermes-ranking` (Phase 3), `event-photo-moderate` (Phase 3) | none |

### 2.2 — Freeze procedure

**Per function, do all 3:**

1. **Document the frozen version.** Add to `tasks/notes/edge-fn-freeze-list.md`:
   ```
   sponsor-checkout @ version 18 — frozen 2026-05-XX
   ```
2. **Remove from CI deploy script** (e.g. `.github/workflows/deploy.yml` or wherever deploys run). Replace with a comment: `# sponsor-checkout — FROZEN per plan/04-supabase-cleanup.md §2`
3. **Tag the source dir** in legacy mdeai repo (if applicable) with a Git tag: `git tag freeze/sponsor-checkout-v18 supabase/functions/sponsor-checkout/`

### 2.3 — Unfreeze procedure (when needed in Phase 2 or 3)

- Remove the freeze comment in CI
- Bump version in config.toml if needed
- Run `vercel env pull` + redeploy

**Verification:** `mcp__ed3787fc-..._list_edge_functions` shows version field unchanged for 30 days

**Risk:** LOW. These functions sit deployed but unused. The risk we're managing is *accidental* version-bump on a CI rebuild.

### Phase 2 — what should be true after

- [x] 25 frozen edge fns listed in `tasks/notes/edge-fn-freeze-list.md` with versions
- [ ] CI deploy automation excludes the 25 from `supabase functions deploy --project-ref`
- [ ] (Optional) Git tags exist for the frozen source dirs in legacy repo

---

## Phase 3 — Schema decisions (W6-W8, ≈6 hrs)

Goal: resolve 3 "two parallel systems" decisions identified in audit. Each touches real data — execute carefully.

### 3.1 — Decide canonical lead system: `leads` vs `landlord_inbox`

| Table | Rows | Source | Use |
|---|---:|---|---|
| `public.leads` | 7 | P1-CRM edge fn + chat-lead-capture | Generic intake (any intent) |
| `public.landlord_inbox` | 46 | V1 landlord-direct messaging | Renter → landlord direct messages |

**Decision needed:** pick ONE as the canonical "lead/inquiry" target for mdeapp's chat-driven captures.

**Recommendation:** **keep both, document the rule.**
- `leads` ← anything that came from AI chat (Camila asking about apartments) or generic forms
- `landlord_inbox` ← landlord-direct inquiries (renter clicks "Message landlord" button)

**Action:** add a paragraph to `docs/ARCHITECTURE.md` (W2 task F10) documenting which is which, and add a CHECK constraint or trigger to enforce.

**Risk:** none if we keep both. If we consolidate (migrate `landlord_inbox` → `leads` with `metadata->>intent='landlord_message'`), risk is **HIGH** (real data move) — explicit recommend against this for Phase 1.

### 3.2 — Decide canonical AI observability: `ai_runs` vs `mastra_ai_spans`

| Table | Rows | Source | Use |
|---|---:|---|---|
| `public.ai_runs` | 182 | Legacy edge fns (ai-router, ai-chat, ai-search) | Custom analytics |
| `public.mastra_ai_spans` | 932 | Mastra agents | Per-span tracing |

**Decision:** **`mastra_ai_spans` wins.** Per PRD §13 and audit §7a.

**Action:**

1. **Freeze writes to `ai_runs`** when legacy `ai-chat` is deprecated (W10 cutover).
2. **Migrate analytics dashboards** (if any) to query `mastra_ai_spans` instead.
3. **Document `ai_runs` as archived** in `tasks/notes/observability-decision.md`.
4. **Keep table** (don't drop — 182 rows of historical legacy data are useful for cohort analysis).

**Verification:**
```sql
-- After W10 cutover, ai_runs.created_at should not have new rows:
SELECT max(created_at) FROM public.ai_runs;
-- Expected: timestamp pre-cutover; if newer, a legacy fn is still writing
```

**Risk:** LOW. Keeps historical data, just stops new writes.

### 3.3 — Set `search_path` on remaining ≈75 functions

After Phase 1 covered the top 5, the audit advisors flagged 80+ in total. The other 75 are mostly:

- PostGIS internals (~40 fns — **can't easily fix**, extension-owned; document as accepted)
- Business RPCs (e.g. `apartment_save_counts`, `log_outbound_click`, `fn_apply_approval_decision`, `fn_notify_next_in_line`, `snapshot_analytics_events_daily`, `bump_staff_link_version`, `touch_updated_at`, `fts_spanish`, etc.) — **fix these in batch**

**Batch SQL strategy:**

```sql
-- Step 1: list candidate functions (NOT extension-owned, NOT already configured)
SELECT n.nspname || '.' || p.proname AS fn,
       pg_get_function_identity_arguments(p.oid) AS args
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace=n.oid
LEFT JOIN pg_depend d ON d.objid=p.oid AND d.deptype='e'
WHERE n.nspname='public'
  AND p.prokind='f'
  AND p.proconfig IS NULL
  AND d.objid IS NULL  -- exclude extension-owned
ORDER BY fn;

-- Step 2: generate ALTER FUNCTION statements (run as a script, NOT inline — copy into a migration)
SELECT format(
  'ALTER FUNCTION %I.%I(%s) SET search_path = public, pg_temp;',
  n.nspname, p.proname, pg_get_function_identity_arguments(p.oid)
) AS alter_sql
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace=n.oid
LEFT JOIN pg_depend d ON d.objid=p.oid AND d.deptype='e'
WHERE n.nspname='public'
  AND p.prokind='f'
  AND p.proconfig IS NULL
  AND d.objid IS NULL
ORDER BY n.nspname, p.proname;

-- Step 3: review the output. Skip any function you don't recognize. Then run the generated ALTER statements.
```

**Verification:**
```sql
SELECT count(*) FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace=n.oid
LEFT JOIN pg_depend d ON d.objid=p.oid AND d.deptype='e'
WHERE n.nspname='public' AND p.prokind='f' AND p.proconfig IS NULL AND d.objid IS NULL;
-- Expected: 0 (or close to it — some hand-crafted exceptions OK with a comment)
```

**Risk:** LOW per function. Setting `search_path` is one of the documented PostgreSQL security best practices for SECURITY DEFINER functions. No SQL injection risk; no behavior change unless a function was *intentionally* using session search_path (rare).

**Effort:** ≈30 sec per function × 35 candidates ≈ 20 min total once the script is generated.

### Phase 3 — what should be true after

- [ ] Lead system canonical use documented in `docs/ARCHITECTURE.md`
- [ ] `ai_runs` deprecated; `mastra_ai_spans` confirmed canonical
- [ ] 35+ additional business RPCs have `search_path` set
- [ ] PostGIS internals documented as accepted exceptions

---

## Phase 4 — Production readiness (W8-W10, ≈4 hrs)

### 4.1 — Sentry SDK (W8)

| Detail | Value |
|---|---|
| Goal | P0 errors captured before W10 cutover |
| Source | https://docs.sentry.io/platforms/javascript/guides/nextjs/ |
| Place | `mdeapp/src/instrumentation.ts` + `mdeapp/sentry.{client,server}.config.ts` |
| DSN | new Sentry project for `mdeai-app` (separate from legacy) |

**Action:**
1. Create Sentry project at sentry.io (free tier OK for Phase 1)
2. `npm install @sentry/nextjs` in `mdeapp/`
3. `npx @sentry/wizard@latest -i nextjs --saas` (interactive)
4. Add `SENTRY_DSN` to Vercel env vars (production + preview)
5. Verify by throwing an error in a non-prod page; check Sentry dashboard

**Risk:** LOW. Read-only telemetry.

### 4.2 — `mastra_ai_spans` daily rollup cron (W8)

**SQL:**
```sql
-- Daily rollup of P95 latency per agent
SELECT cron.schedule(
  'mastra_ai_spans_p95_rollup',
  '0 4 * * *',
  $$
    INSERT INTO public.analytics_events_daily (date, event_type, payload)
    SELECT current_date - 1,
           'mastra_p95',
           jsonb_build_object(
             'agent_name', agent_name,
             'p50_ms', percentile_cont(0.50) WITHIN GROUP (ORDER BY duration_ms),
             'p95_ms', percentile_cont(0.95) WITHIN GROUP (ORDER BY duration_ms),
             'count', count(*)
           )
    FROM public.mastra_ai_spans
    WHERE created_at >= current_date - 1 AND created_at < current_date
    GROUP BY agent_name
    ON CONFLICT DO NOTHING;
  $$
);
```

*Tweak column names per actual `mastra_ai_spans` schema. Verify against pgvector schema first.*

**Risk:** LOW. Read-only rollup.

### 4.3 — Enable `auth.audit_log_entries` collection (W8)

**Action (user, dashboard):**

1. Supabase dashboard → Authentication → Audit logs
2. Enable "Capture auth events"

**Verification:**
```sql
SELECT count(*) FROM auth.audit_log_entries WHERE created_at > now() - interval '24 hours';
-- After 24h: should be > 0 if any auth event occurred
```

**Risk:** none. Read-only telemetry. Counts against Supabase storage (negligible for MVP volume).

### 4.4 — Storage bucket EXIF strip pipeline review (W9)

Buckets `listing-photos` (PUBLIC) and `sponsor-assets` (PUBLIC) accept uploads. Verify the upload edge fn (likely `listing-create`) strips EXIF before write.

**Action:** read `listing-create` source via `mcp__ed3787fc-..._get_edge_function function_slug=listing-create`. If no EXIF strip, add `exifr` or `sharp` in the upload path.

**Risk:** MEDIUM if uploads contain GPS-coordinate EXIF (rental-listing photographer's home address could leak).

### Phase 4 — what should be true after

- [ ] Sentry capturing P0 errors from mdeapp Vercel deployment
- [ ] `mastra_ai_spans_p95_rollup` cron running daily
- [ ] `auth.audit_log_entries` collecting (rows > 0 over a 24-hour window)
- [ ] EXIF strip confirmed for listing-photos uploads
- [ ] `sponsor-assets` bucket marked for deprecation alongside sponsor stack

---

## Phase 5 — Archive (W10+, ≈4 hrs)

Goal: prepare for and complete the legacy → mdeai cutover.

### 5.1 — Move deprecated edge fns to `_archive/` slug

For each of the 6 DEPRECATE-class edge fns (`ai-router`, `ai-chat`, `ai-search`, `ai-trip-planner`, `ai-optimize-route`, `ai-suggest-collections`):

```bash
# After mdeapp is the only writer:
# Option A: deploy a no-op version that returns 410 Gone
# Option B: leave the slug, mark as DEPRECATED in slug name (e.g. ai-chat-deprecated-2026-05)
```

**Recommendation:** Option A (deploy a no-op returning 410 Gone). Keeps the slug routable so old clients hitting it get a clean error message rather than 404.

### 5.2 — Final advisor sweep

```
mcp__ed3787fc-..._get_advisors type=security
mcp__ed3787fc-..._get_advisors type=performance
```

**Acceptance:**
- 0 ERROR-level findings
- ≤ 5 WARN-level findings (documented exceptions for PostGIS internals)
- INFO-level findings allowed (unindexed FK on marketing tables — performance, post-cutover)

### 5.3 — Final RLS audit

Run `/supabase-rls-audit` slash command. Acceptance: every table touched by mdeapp queries must show ✅ RLS + ≥1 policy.

### 5.4 — DNS cutover

(Out of Supabase scope but listed for completeness.) Cut DNS from `medell-n-connect.vercel.app` to `mdeai.co`. mdeapp Vercel project must be linked and deployed first.

### Phase 5 — what should be true after

- [ ] All 6 deprecated edge fns return 410 Gone or are deleted
- [ ] 0 ERROR-level advisor findings
- [ ] 100% RLS coverage on mdeapp-touched tables
- [ ] DNS cut to `mdeai.co`

---

## Risk + rollback matrix

| Action | Risk | Reversible? | Rollback time |
|---|---|---|---|
| Phase 0 — cron disables | LOW | ✅ via `cron.schedule(...)` | <1 min |
| Phase 0 — OpenAI key rotation | LOW (you control the key) | ⚠️ via OpenAI dashboard (can issue new key) | <5 min |
| Phase 1.1 — verify_jwt flip | LOW | ✅ redeploy with `verify_jwt: true` | <2 min |
| Phase 1.2 — ALTER FUNCTION search_path | LOW | ✅ `ALTER FUNCTION x RESET search_path;` | <1 min/fn |
| Phase 1.3 — Auth toggle | LOW | ✅ dashboard toggle | <1 min |
| Phase 1.4 — spatial_ref_sys RLS | MEDIUM (if policy created AFTER enable) | ✅ DROP POLICY + DISABLE | <1 min |
| Phase 2 — edge fn freeze | LOW | ✅ unfreeze via CI flag | <5 min |
| Phase 3.1 — lead system doc | none (docs only) | n/a | n/a |
| Phase 3.2 — `ai_runs` deprecation | LOW (data preserved) | n/a | data is read-only after cutover |
| Phase 3.3 — batch search_path | LOW (per function) | ✅ `RESET search_path` | <1 min/fn |
| Phase 4.1 — Sentry | LOW | ✅ uninstall package | <5 min |
| Phase 4.2 — rollup cron | LOW | ✅ `cron.unschedule(...)` | <1 min |
| Phase 5.1 — deprecated edge fns 410 | LOW | ✅ redeploy original | <5 min/fn |

**Net: no Phase has risk higher than MEDIUM, and every action is reversible in <5 min.**

---

## Tooling — which MCP/tool for each action

| Action | Tool |
|---|---|
| Cron disable/schedule | Supabase MCP `execute_sql` (asks user approval per `.claude/settings.json`) |
| ALTER FUNCTION search_path | Supabase MCP `execute_sql` (asks) OR `apply_migration` (asks) |
| RLS / policy DDL | Supabase MCP `apply_migration` (preferred — creates migration record) |
| Edge function source read | Supabase MCP `get_edge_function` (allowed) |
| Edge function deploy/freeze | Supabase MCP `deploy_edge_function` (asks) OR Vercel CLI |
| Advisor checks | Supabase MCP `get_advisors` (allowed) |
| List functions/tables/cron | Supabase MCP `list_tables` / `execute_sql` (asks) |
| Sentry setup | `npx @sentry/wizard` in mdeapp |
| Storage policy review | Supabase dashboard |
| `supabase@claude-plugins-official` plugin (just installed) | Will surface as skills/commands on next session start — use for any Supabase work it covers |

---

## Tracking checklist — copy this block to `todo.md` weekly

```
### Supabase cleanup — Phase 0 (W1)
- [ ] 3 cron disables: fraud-scan-cron, sponsor-roi-explain-daily, sponsor-roi-rollup
- [ ] 4 cron pauses: outbox_dispatch_tick, outbox_reset_stuck, campaign_conversions_rollup, failed_deliveries_digest_daily
- [ ] OpenAI key rotated in dashboard

### Supabase cleanup — Phase 1 (W2)
- [ ] chat-lead-capture verify_jwt flipped to false
- [ ] 5 critical RPCs have search_path set
- [ ] Auth leaked_password_protection enabled
- [ ] spatial_ref_sys RLS enabled (optional)

### Supabase cleanup — Phase 2 (W3-W5)
- [ ] 25 edge fns frozen in tasks/notes/edge-fn-freeze-list.md
- [ ] CI deploy automation excludes frozen list

### Supabase cleanup — Phase 3 (W6-W8)
- [ ] Lead system rule documented
- [ ] ai_runs deprecation documented
- [ ] 35+ business RPCs search_path set

### Supabase cleanup — Phase 4 (W8-W10)
- [ ] Sentry SDK live in mdeapp
- [ ] mastra_ai_spans P95 rollup cron running
- [ ] auth.audit_log_entries collecting
- [ ] EXIF strip verified on uploads

### Supabase cleanup — Phase 5 (W10+)
- [ ] 6 deprecated edge fns → 410 Gone
- [ ] Final security advisor sweep clean
- [ ] /supabase-rls-audit passes
- [ ] DNS cut to mdeai.co
```

---

## Expected score trajectory

| Milestone | Audit aggregate score |
|---|---:|
| Today (after audit, before cleanup) | 78 |
| End of W1 (Phase 0 done) | 80 |
| End of W2 (Phase 1 done) | 85 |
| End of W5 (Phase 2 done) | 87 |
| End of W8 (Phase 3-4 done) | 92 |
| End of W10 (Phase 5 done, cutover live) | 95 |

---

## When NOT to execute this plan

- **Mid-incident.** If a P0 production issue is open, defer cleanup until it's closed.
- **Without a recent advisor snapshot.** Always run `get_advisors` before and after any phase.
- **Without read-only verification first** (the pre-flight queries above).
- **Without telling future-you what changed.** Update `changelog` after each phase.

---

*Paired with [04 — Supabase Forensic Audit](audit/04-supabase-audit.md). When this plan completes, re-run the audit and expect aggregate score ≥ 92.*
