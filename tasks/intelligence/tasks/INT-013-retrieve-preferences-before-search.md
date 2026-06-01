---
id: INT-013
title: Retrieve preferences before search
phase: POST-MVP
priority: P1
status: Not Started
owner_system: [Mastra, Supabase]
personas: [Camila]
depends_on: [INT-011, INT-012, INT-006]
unblocks: [INT-014, INT-015]
linear_title: "INT-013 — Retrieve preferences before search"
linear_labels: [intelligence, post-mvp, p1, mastra, memory]
implements: []
related_re: []
related_vec: []
---

# INT-013 — Retrieve preferences before search

## Problem

Search tools do not read durable prefs before SQL.

## User story

As **Camila**, repeat visit boosts Laureles without me saying Laureles again.

## Example

Prefs: `preferred_neighborhood=Laureles` → `search-rentals` default neighborhood or boost.

## Implementation steps

1. Mastra tool `retrieve-user-preferences` (domain=rental)
2. Call from concierge pre-search hook or inside `search-rentals`
3. Merge with working memory (working wins for explicit turn override)
4. Respect `expires_at`

## Files likely touched

- `mdeapp/src/mastra/tools/retrieve-user-preferences.ts` (new)
- `mdeapp/src/mastra/tools/search-rentals.ts`
- `mdeapp/src/mastra/agents/concierge.ts`

## Data requirements

INT-011 table populated.

## RLS / security

User JWT only; no service role in src.

## Tests

- Tool returns only own prefs
- Search uses pref when query omits neighborhood

## Acceptance criteria

- [ ] E2E: set pref → search without neighborhood → Laureles bias
- [ ] Expired prefs ignored

## Failure points

- Service role leak in tool

## Dependencies

INT-011, INT-012, INT-006

## Verify

```bash
cd mdeapp && npm run test -- src/mastra/tools/__tests__/retrieve-user-preferences.test.ts
```
