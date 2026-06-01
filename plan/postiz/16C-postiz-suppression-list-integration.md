---
task_id: 16C-postiz-suppression-list-integration
title: suppression_list table + check-suppression edge fn — block sends to opted-out / flagged recipients & channels
phase: PHASE-2-MARKETING
priority: P1
status: Not Started
estimated_effort: 1 day
area: backend
skill:
  - mde-paperclip
  - postiz
  - mde-supabase
subagents:
  - mdeai-planner
  - mdeai-executor
edge_function: check-suppression
schema_tables:
  - marketing.suppression_list
  - marketing.posts
  - marketing.campaign_approvals
depends_on:
  - '062-campaign-approve-flow'
  - '063-postiz-schedule-posts-edge-fn'
  - '16A-postiz-approval-gate-webhook'
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** suppression_list table + check-suppression edge fn — block sends to opted-out / flagged recipients & channels
> **Why:** The current pipeline (062 → 16A → 063) has approval gating but no recipient/channel-level suppression. If a Postiz integration is suspended, a hashtag is on a flagged list, or an account opted out,…
> **Tools:** `mde-paperclip` · `postiz` · `mde-supabase`
> **Delivers:** `check-suppression` edge fn + migrations: `marketing.suppression_list`, `marketing.posts`, `marketing.campaign_approvals`
> **Success Criteria:**
> - Migration applied; `marketing.suppression_list` exists with RLS.
> - `check-suppression` edge fn returns deterministic `blocked + matches[]`.
> - 063 schedule path calls `check-suppression` and respects `blocked`.
> - 16A approval webhook calls `check-suppression` post-approval and rejects with `SUPPRESSED` i…
> **PHASE-2-MARKETING · P1 · Not Started · Effort: 1 day**
> **Depends on:** 062-campaign-approve-flow, 063-postiz-schedule-posts-edge-fn, 16A-postiz-approval-gate-webhook

## Summary

| Aspect | Details |
|---|---|
| **Phase** | PHASE-2-MARKETING |
| **New table** | `marketing.suppression_list` |
| **New edge fn** | `check-suppression` (called by 063 + 16A before any Postiz send) |
| **Real-world** | An IG account is locked / a hashtag is flagged / Sofía's previous campaign got reported — we maintain a denylist of (channel, account_handle, reason) so future approvals never accidentally schedule a post into a flagged account. Also covers user-level opt-outs returned via Postiz webhook events |

## Description

**Why this exists.** The current pipeline (062 → 16A → 063) has approval gating but no recipient/channel-level suppression. If a Postiz integration is suspended, a hashtag is on a flagged list, or an account opted out, posts still go out and get rejected upstream — wasting rate limit and creating audit noise. We need a single source of truth for "do not send" that the schedule path consults before every Postiz call.

**What this delivers.**

1. New table `marketing.suppression_list`:
   - `id uuid pk`
   - `scope text check (scope in ('channel','account','hashtag','keyword'))`
   - `value text not null` (e.g. `instagram:@brand_handle`, `hashtag:#flagged`)
   - `reason text not null` (free-text + structured codes: `OPTOUT`, `FLAGGED`, `RATE_LIMITED`, `LEGAL`, `MANUAL`)
   - `expires_at timestamptz null` (null = permanent)
   - `created_by uuid references auth.users`
   - `created_at timestamptz default now()`
   - Unique index on `(scope, value) where expires_at is null or expires_at > now()`
   - RLS: owner can read; only service_role can insert/update.
2. New edge fn `check-suppression`:
   - Input: `{ channel: text, content: text, account_handle?: text, hashtags?: text[] }`
   - Returns: `{ blocked: bool, matches: [{ scope, value, reason }] }`
3. **Wire into 063**: before each `POST /public/v1/posts`, call `check-suppression` — if `blocked=true`, set `marketing.posts.status='suppressed'`, write outbox row `action='suppressed'`, skip Postiz call.
4. **Wire into 16A**: post-approval-but-pre-schedule, run check; if blocked, fail approval transition with `SUPPRESSED` reason.
5. Cron `populate-suppression-from-postiz-webhooks` (later — 16E adjacent) ingests platform-side bounces/complaints into the table.

**Why now.** Postiz public API rate limit is 30 req/hour per workspace — every blocked send wastes a slot. Also avoids legal exposure (CAN-SPAM-equivalent for IG/FB DMs).

## Migration sketch

```sql
-- supabase/migrations/<ts>_marketing_suppression_list.sql
create table if not exists marketing.suppression_list (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('channel','account','hashtag','keyword')),
  value text not null,
  reason text not null,
  expires_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create unique index suppression_list_active_uniq
  on marketing.suppression_list (scope, value)
  where expires_at is null or expires_at > now();
create index suppression_list_scope_idx on marketing.suppression_list (scope, value);
alter table marketing.suppression_list enable row level security;

create policy suppression_list_select_owner on marketing.suppression_list
  for select using ((select auth.uid()) = created_by);
-- writes via service_role only (no policy = blocked for anon/auth)
```

## Acceptance Criteria

- [ ] Migration applied; `marketing.suppression_list` exists with RLS.
- [ ] `check-suppression` edge fn returns deterministic `blocked + matches[]`.
- [ ] 063 schedule path calls `check-suppression` and respects `blocked`.
- [ ] 16A approval webhook calls `check-suppression` post-approval and rejects with `SUPPRESSED` if needed.
- [ ] Posts blocked by suppression have `marketing.posts.status='suppressed'` and an audit row in `posts_outbox` (action=`suppressed`).
- [ ] Inserting a row with `expires_at = now() - interval '1 hour'` does NOT block (expired entries inert).
- [ ] Hashtag scope matches case-insensitively (`#flagged` blocks `#FLAGGED`).
- [ ] `npm run lint` zero new errors; `npm run build` clean; tests cover all 4 scopes.

## See also

- [`063-postiz-schedule-posts-edge-fn.md`](./063-postiz-schedule-posts-edge-fn.md) — caller
- [`16A-postiz-approval-gate-webhook.md`](../../prompts/advanced/16A-postiz-approval-gate-webhook.md) — caller
- [`16E-postiz-integration-discovery-cron.md`](16E-postiz-integration-discovery-cron.md) — sibling cron pattern
