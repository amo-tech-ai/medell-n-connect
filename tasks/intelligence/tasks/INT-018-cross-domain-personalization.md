---
id: INT-018
title: Cross-domain personalization
phase: ADVANCED
priority: P2
status: Not Started
owner_system: [Mastra, Supabase]
personas: [Camila, Roberto, Tourist]
depends_on: [INT-016, INT-007, INT-008]
unblocks: []
linear_title: "INT-018 — Cross-domain personalization"
linear_labels: [intelligence, advanced, p2, personalization]
implements: []
related_re: []
related_vec: []
---

# INT-018 — Cross-domain personalization

## Problem

Rental prefs don’t inform café/restaurant suggestions (shared “quiet / walkable” taste).

## User story

As **Camila**, remote-work rental prefs boost quiet cafés in Laureles on `/chat`.

## Example prompts

| Domain | Prompt |
|--------|--------|
| Rental | (prefs: Laureles, remote_work) |
| Café | `quiet café in Laureles for remote work tomorrow` |
| Restaurant | `romantic dinner in El Poblado under $80` |
| Venue | `birthday venue for 20 people with music` |

## Implementation steps

1. `domain` column on prefs/embeddings (rental | event | cafe | restaurant | venue)
2. Cross-domain boost rules (deterministic): shared `needs` tags
3. Specialist modules read cross-domain prefs (no mega-prompt)
4. Restaurant/venue slot extension (defer venue booking to future task)

## Files likely touched

- `mdeapp/src/lib/personalization/cross-domain-boost.ts`
- `mdeapp/src/mastra/agents/concierge.ts`
- INT-007, INT-008 wrappers

## Data requirements

INT-011/016 populated.

## RLS / security

Domain-scoped prefs still user-owned.

## Tests

- Rental pref affects café ranking boost (unit)
- Event prefs isolated when domain filter on

## Acceptance criteria

- [ ] At least rental→café boost demonstrated
- [ ] No single agent prompt > maintainability threshold

## Failure points

- One giant super-agent (forbidden)

## Dependencies

INT-016, INT-007, INT-008

## Verify

```bash
cd mdeapp && npm run test -- src/lib/personalization/
```
