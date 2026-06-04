---
task_id: 16D-postiz-multichannel-type-settings
title: Per-platform __type settings library — Reddit / YouTube / Instagram Stories / TikTok / LinkedIn
phase: PHASE-2-MARKETING
priority: P2
status: Not Started
estimated_effort: 1.5 days
area: backend
skill:
  - mde-paperclip
  - postiz
  - mde-supabase
subagents:
  - mdeai-planner
  - mdeai-executor
edge_function: postiz-schedule-posts (extension)
schema_tables:
  - marketing.posts
  - marketing.channels
depends_on:
  - '063-postiz-schedule-posts-edge-fn'
  - '16E-postiz-integration-discovery-cron'
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** Per-platform __type settings library — Reddit / YouTube / Instagram Stories / TikTok / LinkedIn
> **Why:** Postiz's CreatePostDto.posts[].settings is a **discriminated union** — each integration provider has its own __type and required fields. Without supplying the correct __type, posts land as no-ops or…
> **Tools:** `mde-paperclip` · `postiz` · `mde-supabase`
> **Delivers:** `postiz-schedule-posts (extension)` edge fn + migrations: `marketing.posts`, `marketing.channels`
> **Success Criteria:**
> - Migration adds `provider_settings jsonb` to `marketing.posts` with default `EmptySettings`.
> - `_shared/postiz-settings.ts` exports the union + builder helpers + Zod schemas.
> - 063 reads `provider_settings` and forwards to Postiz `settings`.
> - Mismatch (e.g. RedditSettings on IG channel) returns 400 `SETTINGS_CHANNEL_MISMATCH` from 063.
> **PHASE-2-MARKETING · P2 · Not Started · Effort: 1.5 days**
> **Depends on:** 063-postiz-schedule-posts-edge-fn, 16E-postiz-integration-discovery-cron

## Summary

| Aspect | Details |
|---|---|
| **Phase** | PHASE-2-MARKETING |
| **Scope** | Postiz `posts[].settings.__type` field per provider — extends 063 |
| **Real-world** | Sofía wants the same content as a **YouTube Short**, **Reddit post in r/medellin**, **Instagram Story**, and **LinkedIn carousel**. Each requires different metadata: Reddit needs a subreddit + flair; YouTube needs title/category/tags; Stories has no caption; LinkedIn carousels need ordered media. Today 063 sends `settings: { __type: 'EmptySettings' }` — works for plain feed posts only |

## Description

**Why this exists.** Postiz's `CreatePostDto.posts[].settings` is a **discriminated union** — each integration provider has its own `__type` and required fields. Without supplying the correct `__type`, posts land as no-ops or get rejected upstream. The current 063 implementation hard-codes `EmptySettings`, which excludes Reddit / YouTube / Stories / LinkedIn carousels / Twitter polls / etc.

**What this delivers.**

1. A typed settings library `supabase/functions/_shared/postiz-settings.ts` exporting:
   - `PostizSettings` discriminated-union type (one variant per supported provider).
   - Builder helpers: `buildRedditSettings()`, `buildYouTubeSettings()`, `buildInstagramStorySettings()`, `buildLinkedInCarouselSettings()`, `buildTikTokSettings()`, `buildXPollSettings()`.
   - `EmptySettings` fallback for feed posts.
2. Extend `marketing.posts` with `provider_settings jsonb` (validated against the discriminated union by edge fn at write time).
3. Update 063 (`postiz-schedule-posts`) to read `provider_settings` per row and place it into Postiz `posts[].settings` instead of always `EmptySettings`.
4. Validation: schedule fn rejects rows where `provider_settings.__type` doesn't match the channel (e.g. Reddit settings on an IG channel).
5. UI affordance (separate task) writes the settings; this task is backend-only.

**Reference.** Postiz upstream defines these in `apps/backend/src/api/routes/posts.dto.ts` — discriminator field is `__type`, registered providers come from `libraries/nestjs-libraries/src/integrations/social/<provider>.provider.ts`. (Source: github.com/gitroomhq/postiz-app — verify at integration time.)

## Schema change

```sql
alter table marketing.posts
  add column if not exists provider_settings jsonb not null default '{"__type":"EmptySettings"}'::jsonb;

create index if not exists posts_provider_settings_type_idx
  on marketing.posts ((provider_settings->>'__type'));
```

## Type sketch (TypeScript)

```ts
// supabase/functions/_shared/postiz-settings.ts
export type PostizSettings =
  | { __type: 'EmptySettings' }
  | { __type: 'RedditSettings'; subreddit: string; title: string; flair?: string; nsfw?: boolean }
  | { __type: 'YouTubeSettings'; title: string; description?: string; tags?: string[]; categoryId?: string; privacy?: 'public'|'unlisted'|'private' }
  | { __type: 'InstagramStorySettings' }
  | { __type: 'LinkedInCarouselSettings'; slides: { mediaId: string; alt?: string }[] }
  | { __type: 'TikTokSettings'; allowComments?: boolean; allowDuet?: boolean; allowStitch?: boolean }
  | { __type: 'XPollSettings'; options: string[]; durationMinutes: number };
```

## Acceptance Criteria

- [ ] Migration adds `provider_settings jsonb` to `marketing.posts` with default `EmptySettings`.
- [ ] `_shared/postiz-settings.ts` exports the union + builder helpers + Zod schemas.
- [ ] 063 reads `provider_settings` and forwards to Postiz `settings`.
- [ ] Mismatch (e.g. RedditSettings on IG channel) returns 400 `SETTINGS_CHANNEL_MISMATCH` from 063.
- [ ] Reddit-flow integration test: post with `subreddit + title` lands as Reddit-typed in upstream Postiz request.
- [ ] YouTube-flow integration test: post with `title + description` lands correctly.
- [ ] Backwards compatible — existing rows (default EmptySettings) continue to work unchanged.
- [ ] `npm run lint` zero new errors; `npm run build` clean.

## See also

- [`063-postiz-schedule-posts-edge-fn.md`](./063-postiz-schedule-posts-edge-fn.md) — extends
- [`16E-postiz-integration-discovery-cron.md`](16E-postiz-integration-discovery-cron.md) — populates which providers are connected
- Postiz repo `apps/backend/src/api/routes/posts.dto.ts` — source of truth for `__type` shapes
