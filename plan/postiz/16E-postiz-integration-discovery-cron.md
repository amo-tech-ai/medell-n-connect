---
task_id: 16E-postiz-integration-discovery-cron
title: postiz-discover-integrations cron — sync connected accounts into marketing.channels
phase: PHASE-2-MARKETING
priority: P1
status: Not Started
estimated_effort: 0.5 day
area: backend
skill:
  - mde-paperclip
  - postiz
  - mde-supabase
subagents:
  - mdeai-planner
  - mdeai-executor
edge_function: postiz-discover-integrations
schema_tables:
  - marketing.channels
depends_on:
  - '063-postiz-schedule-posts-edge-fn'
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** postiz-discover-integrations cron — sync connected accounts into marketing.channels
> **Why:** Documented in audit §7 finding F11 — POSTIZ_INTEGRATION_IDS as a static secret is a maintenance bomb. Every reconnect (token refresh, account swap) silently desyncs us from Postiz. The public API…
> **Tools:** `mde-paperclip` · `postiz` · `mde-supabase`
> **Delivers:** `postiz-discover-integrations` edge fn + migrations: `marketing.channels`
> **Success Criteria:**
> - Edge fn `postiz-discover-integrations` deployed; returns `{ synced: N, disconnected: M }`.
> - First run upserts every connected integration into `marketing.channels`.
> - Subsequent runs are no-ops (deterministic; same request → same DB state).
> - Removing an integration in Postiz UI causes the next cron run to flip `status='disconnected'…
> **PHASE-2-MARKETING · P1 · Not Started · Effort: 0.5 day**
> **Depends on:** 063-postiz-schedule-posts-edge-fn

## Summary

| Aspect | Details |
|---|---|
| **Phase** | PHASE-2-MARKETING |
| **Trigger** | Hourly cron (Supabase pg_cron) + on-demand manual call |
| **Postiz call** | `GET ${POSTIZ_BASE_URL}/public/v1/integrations` with `Authorization: ${POSTIZ_API_KEY}` |
| **Real-world** | Today `POSTIZ_INTEGRATION_IDS` is a hand-edited JSON map in Supabase secrets. When organizers connect a new IG/FB/TikTok account in Postiz, our DB doesn't know — operator has to remember to update the secret. This cron auto-discovers connected integrations and writes them to `marketing.channels.postiz_integration_id` so 063 can find the right ID per channel without any manual config |

## Description

**Why this exists.** Documented in audit §7 finding F11 — `POSTIZ_INTEGRATION_IDS` as a static secret is a maintenance bomb. Every reconnect (token refresh, account swap) silently desyncs us from Postiz. The public API exposes the integrations list — we should be the system of record, sourced from Postiz at runtime.

**What this delivers.**

1. New edge fn `postiz-discover-integrations`:
   - `GET ${POSTIZ_BASE_URL}/public/v1/integrations` with `Authorization: ${POSTIZ_API_KEY}` (raw, NOT Bearer).
   - For each integration in response: upsert into `marketing.channels` matched by `(provider, postiz_integration_id)`.
   - Mark integrations no longer present as `status='disconnected'` (don't delete — preserves FK references in `marketing.posts`).
   - Track `last_synced_at`.
2. Schedule via `pg_cron` to run every 15 minutes:
   ```sql
   select cron.schedule(
     'postiz-discover-integrations',
     '*/15 * * * *',
     $$ select net.http_post(
       url:='${SUPABASE_URL}/functions/v1/postiz-discover-integrations',
       headers:=jsonb_build_object('Authorization','Bearer ${SERVICE_ROLE_KEY}','Content-Type','application/json'),
       body:='{}'::jsonb
     ); $$
   );
   ```
3. Update 063 to look up `postiz_integration_id` from `marketing.channels` (join on channel) instead of reading `POSTIZ_INTEGRATION_IDS` secret.
4. Deprecate `POSTIZ_INTEGRATION_IDS` secret with a 30-day removal notice (063 falls back to it if `marketing.channels.postiz_integration_id is null`).

**Rate-limit safety.** Postiz public API allows 30 req/hour. 15-min cron = 4 req/hour. Plus 063's per-post calls. Stay below 25/hour budget.

## Schema change

```sql
alter table marketing.channels
  add column if not exists postiz_integration_id text,
  add column if not exists provider text check (provider in ('instagram','facebook','tiktok','youtube','linkedin','twitter','reddit','threads')),
  add column if not exists status text not null default 'active' check (status in ('active','disconnected','suspended')),
  add column if not exists last_synced_at timestamptz;

create unique index if not exists channels_postiz_integration_uniq
  on marketing.channels (postiz_integration_id)
  where postiz_integration_id is not null;
```

## Postiz API contract

```http
GET ${POSTIZ_BASE_URL}/public/v1/integrations
Authorization: ${POSTIZ_API_KEY}
```

Response (per upstream Postiz public API):
```json
[
  { "id": "int_abc", "name": "Sofía IG", "identifier": "instagram", "picture": "...", "disabled": false },
  { "id": "int_def", "name": "Sofía FB Page", "identifier": "facebook", "picture": "...", "disabled": false }
]
```

## Acceptance Criteria

- [ ] Edge fn `postiz-discover-integrations` deployed; returns `{ synced: N, disconnected: M }`.
- [ ] First run upserts every connected integration into `marketing.channels`.
- [ ] Subsequent runs are no-ops (deterministic; same request → same DB state).
- [ ] Removing an integration in Postiz UI causes the next cron run to flip `status='disconnected'` (does NOT delete).
- [ ] 063 reads `postiz_integration_id` from `marketing.channels` first; falls back to `POSTIZ_INTEGRATION_IDS` secret only if null.
- [ ] pg_cron schedule active and visible in `cron.job` table.
- [ ] Postiz 401 (bad key) is logged loudly to `agent_runs` and Slack/health webhook (no silent failure).
- [ ] `npm run lint` zero new errors; `npm run build` clean.

## See also

- [`063-postiz-schedule-posts-edge-fn.md`](./063-postiz-schedule-posts-edge-fn.md) — consumer of synced integration IDs
- [`16F-postiz-deployment-runbook.md`](16F-postiz-deployment-runbook.md) — initial setup of POSTIZ_BASE_URL / POSTIZ_API_KEY
- Postiz public API docs: `${POSTIZ_BASE_URL}/api-docs` (Swagger on the deployed instance)
