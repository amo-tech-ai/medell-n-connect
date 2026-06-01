---
id: INT-020
title: Observational memory learning
phase: ADVANCED
priority: P2
status: Not Started
owner_system: [Mastra, Gemini]
personas: [Camila]
depends_on: [INT-012, INT-016]
unblocks: []
linear_title: "INT-020 — Observational memory learning"
linear_labels: [intelligence, advanced, p2, mastra, observational-memory]
implements: []
related_re: []
related_vec: []
---

# INT-020 — Observational memory learning

## Problem

Long threads overflow context; implicit preferences from behavior not summarized.

## User story

As **Camila**, after many clicks the agent learns I avoid Poblado without me stating it.

## Example

Interactions: 5× ignored Poblado, 3× saved Laureles → observation: “prefers Laureles over Poblado nightlife.”

## Implementation steps

1. Evaluate Mastra [observational memory](https://mastra.ai/docs/memory/observational-memory) vs custom summarizer
2. Background job: interactions → structured pref OR embedding
3. `expires_at` on inferred prefs (low confidence)
4. Do not auto-write high-confidence prefs without threshold

## Files likely touched

- `mdeapp/src/mastra/lib/agent-memory.ts`
- `mdeapp/src/mastra/jobs/summarize-observations.ts` (new)

## Data requirements

INT-012 interaction volume.

## RLS / security

Summaries stored with same RLS as prefs.

## Tests

- Synthetic interaction stream → one pref candidate
- Ephemeral observations expire

## Acceptance criteria

- [ ] Design doc: Mastra OM vs custom chosen
- [ ] No observational write without confidence threshold

## Failure points

- Wrong inferences persisted forever (mitigate: expires_at + user delete INT-019)

## Dependencies

INT-012, INT-016

## Verify

```bash
cd mdeapp && npm run test -- src/mastra/jobs/
```
