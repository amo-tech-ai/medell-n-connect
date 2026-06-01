---
id: INT-014
title: Ranking boost from memory
phase: POST-MVP
priority: P2
status: Not Started
owner_system: [App]
personas: [Camila]
depends_on: [INT-013]
unblocks: [INT-015]
linear_title: "INT-014 — Ranking boost from memory"
linear_labels: [intelligence, post-mvp, p2, ranking]
implements: []
related_re: []
related_vec: []
---

# INT-014 — Ranking boost from memory

## Problem

Results sorted only by SQL/price; prefs and interactions ignored.

## User story

As **Camila**, listings matching my saved style rank higher; Gemini explains why #1 fits.

## Example

Laureles + furnished + WiFi pref → +boost; Gemini: “Strong match for remote work in Laureles.”

## Implementation steps

1. Deterministic `rankListingsWithMemory(baseResults, prefs, interactions)` 
2. **Do not** let LLM set sort order
3. Gemini `explainRanking` optional separate call
4. Apply in API route + tool response

## Files likely touched

- `mdeapp/src/lib/ranking/rank-with-memory.ts` (new)
- `mdeapp/src/app/api/rentals/search/route.ts`
- `mdeapp/src/mastra/tools/search-rentals.ts`

## Data requirements

Prefs + recent interactions weights; decay 90d.

## RLS / security

N/A (ranking server-side).

## Tests

- Unit: boost math fixtures
- Ignored listings down-rank

## Acceptance criteria

- [ ] Sort order reproducible (same input → same order)
- [ ] Explanation text optional, not required for sort

## Failure points

- Using LLM for numeric scores (forbidden)

## Dependencies

INT-013

## Verify

```bash
cd mdeapp && npm run test -- src/lib/ranking/
```
