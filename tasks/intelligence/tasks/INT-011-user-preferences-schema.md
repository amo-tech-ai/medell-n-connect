---
id: INT-011
title: user_preferences schema + RLS
phase: POST-MVP
priority: P1
status: Not Started
owner_system: [Supabase]
personas: [Camila, Patricia]
depends_on: [INT-005]
unblocks: [INT-012, INT-013, INT-016]
linear_title: "INT-011 — user_preferences schema + RLS"
linear_labels: [intelligence, post-mvp, p1, supabase, memory]
implements: []
related_re: []
related_vec: [VEC-002]
---

# INT-011 — user_preferences schema + RLS

## Problem

No durable cross-session prefs; only thread working memory.

## User story

As **Camila**, the app remembers I prefer Laureles + furnished + remote work across visits.

## Example

After 3 Laureles clicks → `preferred_neighborhood = Laureles` boosts future searches.

## Implementation steps

1. Migration: `user_preferences` (user_id, domain, pref_key, pref_value jsonb, confidence, source, **expires_at**, updated_at)
2. RLS: `auth.uid() = user_id` SELECT/INSERT/UPDATE/DELETE
3. Unique `(user_id, domain, pref_key)`
4. Document in agent-plan Phase 3

## Files likely touched

- `mdeapp/supabase/migrations/*_user_preferences.sql`
- `mdeapp/src/lib/supabase/types` (generated)

## Data requirements

`auth.users` FK.

## RLS / security

**Required** — owner-only; no anon write. Service role edge-only for batch jobs if any.

## Tests

- RLS policy test: user A cannot read user B prefs
- Migration applies clean on staging

## Acceptance criteria

- [ ] Table + RLS + ≥1 policy per repo rules
- [ ] `expires_at` column for ephemeral prefs (party hostels)

## Failure points

- Skipping RLS (hard rule violation)

## Dependencies

INT-005 (CORE stable); **VEC-002** design alignment (soft)

## Verify

```bash
# Supabase MCP or CLI: verify policies
```
