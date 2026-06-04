---
task_id: ven-011
mvp_step: 011
title: Nightlife intent in search-grounded-places
layer: TOOL
priority: P0
status: In Progress
estimated_effort: 1 day
depends_on: [data-005]
unblocks: [ven-012, ven-013]
skills: [mastra, mde-maps, gemini, mde-task-lifecycle]
mcp: [user-mastra, user-google-maps-code-assist]
aliases: [NGT-001, VEN-GEM-001]
description: Add intent:nightlife to grounded places tool — mirror café filter pattern for clubs/bars.
---

# VEN-11 — Nightlife grounding intent


## At a glance

| | |
|---|---|
| **For** | Tourist |
| **Surface** | `/chat` nightlife queries |
| **Layer** | TOOL |

## What we're building

Add `intent:nightlife` to grounded places tool so clubs/bars return separately from cafés and restaurants.

## Features

- Zod intent enum extension
- Query normalize + row filters
- Vitest quality tests

## Agents & tools

`conciergeAgent` → `search-grounded-places`

## Workflows

None

## User journey

1. Tourist: 'reggaeton Provenza tonight'.
2. Concierge picks nightlife intent.
3. Tool returns bar/club rows → NGT-002 cards.

## Summary

| Kind | **Nightclub / bar** |
| Persona | Tourist — "reggaeton Provenza tonight" |
| File | `mdeapp/src/mastra/tools/search-grounded-places.ts` |

## Description

Extend `intent` enum: `"cafe" | "general"` → add **`"nightlife"`**. Add query normalization + row filters (exclude cafés, exclude pure restaurants). Do **not** route ticketed events here — agent uses `search-events`.

## Goals

1. Zod `intent: z.enum(["cafe", "general", "nightlife"])`.
2. `normalizeNightlifeGroundingQuery` + `filterNightlifeGroundingRows` (mirror café tests).
3. Register tool on `conciergeAgent` — full routing rules in **ven-025** (post-MVP).
4. Vitest in `search-grounded-places-quality.test.ts`.
5. Verify grounding via existing `invokeAdkGrounding` + quota.

## Partial shipped (2026-06-02)

- [x] `isNightlifeGroundingQuery` / `normalizeVenueGroundingQuery` in `search-grounded-places.ts`
- [ ] Zod `intent: "nightlife"` on tool input
- [ ] Concierge prompt routes nightlife queries to correct render (blocked **VEN-012**)

## Acceptance criteria

- [ ] `intent:nightlife` excludes café-bar hybrids wrongly tagged
- [ ] Provenza/reggaeton test queries return bar/club primary types
- [ ] `conciergeAgent.listTools()` unchanged count + grounding tool id stable
- [ ] `npm run dev` + manual query on `/` returns nightlife cards (after NGT-002 UI) OR tool-only curl trace
- [ ] Mastra MCP consulted for `createTool` if signature changes

## Wiring plan

| File | Action |
|------|--------|
| `src/mastra/tools/search-grounded-places.ts` | Modify |
| `src/mastra/tools/__tests__/search-grounded-places-quality.test.ts` | Modify |
| `src/mastra/agents/concierge.ts` | Modify (minimal — full rules in ven-025) |

## Out of scope

- New agent
- Event ticket search
- UI cards (**NGT-002**)
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-011](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-011-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Nightlife query routes to grounded search with correct intent |
| **MCP** | mastra + gemini-api-docs MCP |
| **Chrome DevTools** | Grounded nightlife cards; no restaurant mis-route |
| **Playwright** | SCREEN-022 spec (create in VEN-031) |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Implement intent enum + concierge prompt
- Add SCREEN-022 Playwright

