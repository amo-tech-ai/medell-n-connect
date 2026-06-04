---
task_id: 16B-postiz-campaign-cancel-edge-fn
title: cancel-postiz-post edge fn — cancel/delete scheduled Postiz posts
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
edge_function: cancel-postiz-post
schema_tables:
  - marketing.posts
  - marketing.campaign_approvals
  - posts_outbox
depends_on:
  - '063-postiz-schedule-posts-edge-fn'
  - '16A-postiz-approval-gate-webhook'
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** cancel-postiz-post edge fn — cancel/delete scheduled Postiz posts
> **Why:** 063 schedules posts to Postiz; 16A enforces the approval gate at create time. Approval can be **revoked** (org changes mind, content flagged, channel suspended) or a campaign can be **cancelled**…
> **Tools:** `mde-paperclip` · `postiz` · `mde-supabase`
> **Delivers:** `cancel-postiz-post` edge fn + migrations: `marketing.posts`, `marketing.campaign_approvals`, `posts_outbox`
> **Success Criteria:**
> - Calling fn with `postiz_post_id IS NULL` returns 400 `NOT_SCHEDULED`.
> - Calling fn with `status='posted'` and `scheduled_at < now()` returns 409 `ALREADY_POSTED`.
> - Successful path: Postiz returns 200, `marketing.posts.status='cancelled'`, outbox row written.
> - Re-calling cancel on already-cancelled post returns 200 + `{ already_cancelled: true }` (no …
> **PHASE-2-MARKETING · P1 · Not Started · Effort: 0.5 day**
> **Depends on:** 063-postiz-schedule-posts-edge-fn, 16A-postiz-approval-gate-webhook

## Summary

| Aspect | Details |
|---|---|
| **Phase** | PHASE-2-MARKETING |
| **Route** | `POST /functions/v1/cancel-postiz-post` |
| **Auth** | Bearer JWT (organizer who owns campaign) OR service_role (revoke flow) |
| **Postiz call** | `DELETE ${POSTIZ_BASE_URL}/public/v1/posts/:id` with `Authorization: ${POSTIZ_API_KEY}` (raw, NOT Bearer) |
| **Real-world** | Sofía changes her mind 4 hours before scheduled IG post — operator clicks "Cancel" — this fn deletes the scheduled post in Postiz, flips `marketing.posts.status='cancelled'`, writes audit row in `posts_outbox` |

## Description

**Why this exists.** 063 schedules posts to Postiz; 16A enforces the approval gate at create time. Approval can be **revoked** (org changes mind, content flagged, channel suspended) or a campaign can be **cancelled** before its scheduled time. We need the inverse of 063: a guarded delete path that calls Postiz's `DELETE /public/v1/posts/:id`, updates our DB, and leaves a complete audit trail.

**What this edge fn does.**

1. Validate input: `{ post_id: uuid }` from `marketing.posts`.
2. Authorisation: caller must be either organizer who owns the campaign OR service role (used by `revoke-approval` flow).
3. Look up `marketing.posts.postiz_post_id` — if `null`, return `400 NOT_SCHEDULED`.
4. Look up `marketing.posts.scheduled_at` — if already past + `status='posted'`, return `409 ALREADY_POSTED` (cannot delete a published post via this fn — that requires platform-specific takedown).
5. Call `DELETE ${POSTIZ_BASE_URL}/public/v1/posts/${postiz_post_id}` with `Authorization: ${POSTIZ_API_KEY}`.
6. On Postiz 200/204: update `marketing.posts.status='cancelled'`, `cancelled_at=now()`.
7. Write audit row to `posts_outbox` with `provider='postiz'`, `action='delete'`, `provider_response`, `idempotency_key=(post_id, 'postiz', 'delete')`.
8. Log to `agent_runs` (agent_name='cancel-postiz-post').

**Idempotency.** Re-calling cancel on an already-cancelled post returns 200 with `already_cancelled: true`, NOT a re-DELETE to Postiz.

## Postiz API contract

```http
DELETE ${POSTIZ_BASE_URL}/public/v1/posts/{id}
Authorization: ${POSTIZ_API_KEY}        # raw key, NOT "Bearer"
```

Response: `200 OK` (idempotent on Postiz side per their public API docs) or `404 Not Found` if Postiz already removed it.

## Secrets required (Supabase dashboard)

- `POSTIZ_BASE_URL` — already set for 063
- `POSTIZ_API_KEY` — already set for 063

No new secrets.

## Acceptance Criteria

- [ ] Calling fn with `postiz_post_id IS NULL` returns 400 `NOT_SCHEDULED`.
- [ ] Calling fn with `status='posted'` and `scheduled_at < now()` returns 409 `ALREADY_POSTED`.
- [ ] Successful path: Postiz returns 200, `marketing.posts.status='cancelled'`, outbox row written.
- [ ] Re-calling cancel on already-cancelled post returns 200 + `{ already_cancelled: true }` (no second Postiz DELETE).
- [ ] Postiz 404 (post not found upstream) treated as success — flip status to cancelled, write outbox with `provider_status=404`.
- [ ] HMAC verification matches 16A pattern when called from bridge.
- [ ] `npm run lint` zero new errors; `npm run build` clean; integration test exists.

## See also

- [`063-postiz-schedule-posts-edge-fn.md`](./063-postiz-schedule-posts-edge-fn.md) — paired schedule fn
- [`16A-postiz-approval-gate-webhook.md`](../../prompts/advanced/16A-postiz-approval-gate-webhook.md) — approval gate; revoke triggers cancel
- [`062-campaign-approve-flow.md`](./062-campaign-approve-flow.md) — approval lifecycle
