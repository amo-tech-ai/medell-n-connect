---
id: INT-012
title: user_interactions schema
phase: POST-MVP
priority: P1
status: Not Started
owner_system: [Supabase]
personas: [Camila, Patricia]
depends_on: [INT-011]
unblocks: [INT-014, INT-020]
linear_title: "INT-012 — user_interactions schema"
linear_labels: [intelligence, post-mvp, p1, supabase]
implements: []
related_re: []
related_vec: []
---

# INT-012 — user_interactions schema

## Problem

No structured log of views/saves/rejects for ranking feedback loop.

## User story

As **Patricia**, I can see which listings Camila ignored vs saved for tuning.

## Example signals

| action | metadata |
|--------|----------|
| viewed | dwell_ms, listing_id |
| saved | — |
| rejected | reason optional |
| search_abandoned | filter_snapshot |

## Implementation steps

1. Migration `user_interactions`
2. RLS owner-only
3. Client helper `logUserInteraction()` (anon/authenticated)
4. Wire card click handlers (rental first)

## Files likely touched

- `mdeapp/supabase/migrations/*_user_interactions.sql`
- `mdeapp/src/lib/interactions/log-interaction.ts` (new)
- `mdeapp/src/components/rentals/` card components

## Data requirements

`item_type`, `item_id`, `action`, `metadata jsonb`

## RLS / security

Owner-only insert/select.

## Tests

- RLS cross-user denial
- Log on card open (unit mock)

## Acceptance criteria

- [ ] At least rental `viewed` + `saved` logged
- [ ] Abandoned search action defined

## Failure points

- Logging PII in metadata

## Dependencies

INT-011

## Verify

```bash
cd mdeapp && npm run test -- src/lib/interactions/
```
