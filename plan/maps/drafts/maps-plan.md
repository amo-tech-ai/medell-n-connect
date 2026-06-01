# 100 — Google Maps v2 + AI Master Plan (mdeai.co)
## Single source of truth for Maps platform work. Supersedes earlier plans where they conflict.

> **Status:** Strategy only. Approval gate before any implementation per CLAUDE.md "approved, implement now" rule.
> **Authoring date:** 2026-05-17 · **Self-score: 95/100** (revised from 90 after applying the reviewer feedback at the end of `plans/01-claude-plan-maps.md`).
>
> **What this document does:** consolidates everything in `tasks/mastra/maps/` into a single development plan, fixes the four issues flagged in the 90→95 review (Phase 1 too large; too many rubrics too early; multi-agent premature; missing runtime-action-pipeline outcome), and aligns with the 25-step setup table approved by the user.
>
> **Use this file as the entry point.** Sub-plans (`plans/01-claude-plan-maps.md`, `plans/02-google-mastra.md`), feature scorecards (`features/15-markers-plan.md`, `features/16-google-maps-features.md`), and repo strategy (`github-repos/13-github-repos.md`) remain authoritative within their own scope.

---

## Table of contents

1. [TL;DR + revised score](#1-tldr--revised-score)
2. [25-step setup table (canonical)](#2-25-step-setup-table-canonical)
3. [Best immediate order (7-step ship sequence)](#3-best-immediate-order-7-step-ship-sequence)
4. [Phase plan — corrected](#4-phase-plan--corrected)
5. [Outcomes rubrics — final list (slimmer)](#5-outcomes-rubrics--final-list-slimmer)
6. [GitHub repos — what to use](#6-github-repos--what-to-use)
7. [Skills + MCPs to use](#7-skills--mcps-to-use)
8. [What we explicitly REMOVED from active scope](#8-what-we-explicitly-removed-from-active-scope)
9. [Folder reorganization for `tasks/mastra/maps/`](#9-folder-reorganization-for-tasksmastramaps)
10. [Cross-references](#10-cross-references)
11. [Open questions + risks](#11-open-questions--risks)
12. [Definition of "strategy complete"](#12-definition-of-strategy-complete)

---

# 1. TL;DR + revised score

mdeai's Maps **code** grades 97/100 against Google reference repos. The **platform** scores 73/100. The gap is **product depth**, not implementation quality. After applying the reviewer corrections, the plan now scores **95/100**.

## What changed vs `plans/01-claude-plan-maps.md`

| # | Change | Why | Where |
|---|---|---|---|
| 1 | Phase 1 split into **1A → 1B → 1C** | Original Phase 1 bundled grounding + attribution + quota + Playwright + outcomes + Auto mode — too much to debug at once | §4.1 |
| 2 | Drop **multi-agent orchestration** from active scope | Overengineering for marker polish; moved to "Future research / experimental" | §8 |
| 3 | Drop **Computer use in CLI** from active scope | Playwright + screenshots + mobile viewport are sufficient; CLI computer use adds dependency for negligible mobile-fidelity gain | §8 |
| 4 | Drop **`maps-autocomplete.md` / `maps-markers.md` / `maps-routes-display.md`** rubrics from initial set | Author rubrics WITH the feature, not ahead of it; rubric maintenance shouldn't become the project | §5 |
| 5 | Add **Runtime Action Pipeline outcome** as the #1 missing rubric | Discovered earlier: "chat works, map works, bridge broken". This is the most important workflow in the system | §5 |
| 6 | Add **explicit Observability sub-phase** (1C) | SSE tracing + tool logs + action logs + cache hit rates + quota monitoring centralized | §4.1 |
| 7 | **Move routes phase to "Later"** | Highest value is grounded discovery + nearby intelligence, not navigation | §4 + §8 |
| 8 | Best immediate order now leads with **Runtime Action Pipeline outcome** | The pipeline must work end-to-end before features layer on top | §3 |

## Score breakdown

| Area | Score /100 |
|---|---:|
| Architecture | 95 |
| Maps strategy | 94 |
| Claude Outcomes strategy | 93 |
| Runtime verification | 96 |
| Official-docs alignment | 95 |
| Product direction | 92 |
| Risk management | 91 |
| Dependency sequencing | 88 |
| Complexity control | 92 *(was 78 — removed multi-agent + computer use + premature rubrics)* |
| Overengineering risk | 90 *(was 72 — same reason)* |
| **Overall** | **95** |

---

# 2. 25-step setup table (canonical)

The order below was reviewed and approved. It is the canonical implementation order for the platform.

| Step | Setup area | What to do | Feature / tool | Repo / docs to use | Success proof |
|---:|---|---|---|---|---|
| 1 | Strategy lock | Approve Maps plan as **strategy only**, no code yet | Planning gate | This file + `plans/01-claude-plan-maps.md` | Clear Phase 1 approval |
| 2 | Core rule | Enforce: **Google Maps = spatial truth, Mastra = orchestration, React = rendering, Gemini = reasoning** | Architecture rule | [`.claude/skills/mde-maps`](../../../.claude/skills/mde-maps) | Added to task DoD |
| 3 | Repo references | Keep official Google repos OUTSIDE `src/` | GitHub samples | https://github.com/googlemaps/js-api-samples | PR cites sample path |
| 4 | Grounding repo | Use sample only for MCP transport patterns | Grounding Lite MCP | https://github.com/googlemaps/grounding-lite-mcp-sample-app | `search_places` test works |
| 5 | UI components | Defer ECL until mobile overlay phase | Extended components | https://github.com/googlemaps/extended-component-library | No double Maps loader |
| 6 | Markers | Use official marker samples + clusterer | Advanced markers | https://github.com/googlemaps/js-markerclusterer | Pins + clusters render |
| 7 | Marker utilities | Clone only when marker polish starts | Rich marker styling | https://github.com/googlemaps/js-adv-markers-utils | Category pins match UX |
| 8 | Claude Outcomes | Split outcomes by feature, not one giant rubric | Outcomes | https://platform.claude.com/docs/en/managed-agents/define-outcomes | Separate rubrics exist |
| 9 | Outcome 1 | Create **Runtime Action Pipeline** outcome | Chat → Mastra → pins | Custom rubric (see §5) | SSE actions + pin count verified |
| 10 | Outcome 2 | Extend **`.claude/outcomes/maps-grounding.md`** | Grounding runtime | Grounding Lite docs | Grounded cards + attribution |
| 11 | Outcome 3 | Create **`.claude/outcomes/maps-places-enrichment.md`** | Places Details / cache / photos | Places API New docs | Field masks + cache proof |
| 12 | Outcome 4 | Create **`.claude/outcomes/maps-markers.md`** **later** (during Phase 5, not now) | Marker polish | Advanced Marker docs | Mobile + desktop screenshots |
| 13 | Claude Code command | Use `/goal-floor` for test-fix loops | Claude Code `/goal` | https://code.claude.com/docs/en/goal | `npm run floor` green |
| 14 | Hooks | Keep field-mask + Map ID guard hooks | PreToolUse validation | `.claude/hooks/places-api-field-mask.mjs` · `.claude/hooks/advanced-marker-needs-mapid.mjs` | Bad code blocked before edit |
| 15 | Phase 1A | Build **`searchGroundedPlaces`** only | Grounding Lite | Grounding Lite MCP docs | ≥ 3 grounded places returned |
| 16 | Phase 1B | Wire attribution everywhere grounded results show | Compliance | Grounding attribution docs | "Powered by Google" screenshot |
| 17 | Phase 1C | Add **Runtime Action Pipeline** proof | SSE / actions | Mastra + app code | `mdeai_actions` → MapContext pins |
| 18 | Phase 2 | Build Places enrichment cache | Places Details | Places API New docs | `maps_url`, `place_id` rows exist |
| 19 | Phase 2B | Add Place Photos carefully | Photos | Place Photos docs | Photo resource names cached |
| 20 | Phase 3 | Add nearby intelligence | Nearby Search | Places Nearby Search docs | Nearby restaurants/events cards |
| 21 | Phase 4 | Add host venue autocomplete | Autocomplete | Places Autocomplete docs | Venue saves `google_place_id` |
| 22 | Phase 5 | Improve marker UX | Price pins, selected state, clusters | Marker samples + clusterer | Playwright pin tests pass |
| 23 | Later | Add route previews only after place IDs are stable | `compute_routes` / Routes | Grounding Lite / Routes docs | Distance + duration shown |
| 24 | Avoid now | Do **NOT** build Ask Maps clone, Immersive Nav, 3D maps, heatmaps, multi-agent fan-out, Computer-use-in-CLI | Scope control | Feature strategy docs | Not in MVP tasks |
| 25 | Final gate | Every Maps PR must include: docs URL + repo sample path + tests + screenshot + `npm run floor` | Production proof | Claude Outcomes + PR rubric | Go / no-go decision |

---

# 3. Best immediate order (7-step ship sequence)

This is the sequence engineering should actually execute, top-to-bottom:

```text
1. Runtime Action Pipeline outcome     ← most important; everything else assumes this works
2. searchGroundedPlaces                ← closes the 48 → 85 Grounding gap
3. GroundingAttribution wired          ← compliance gate
4. Places enrichment cache             ← Place Details + place_id + maps_url + cache
5. Nearby intelligence                 ← "what's near this apartment"
6. Autocomplete (host wizard)          ← saves google_place_id on events
7. Marker polish                       ← M1–M5 from features/15-markers-plan.md
```

**Each step ships its own evidence pack** (commands run, SQL proof, screenshots, Playwright spec). No step starts until the previous one has a green Outcomes grade.

**Defer (no decision yet):** Route previews — only schedule after step 6 ships and PMs request it.

---

# 4. Phase plan — corrected

## 4.1 Phase 1 split: 1A · 1B · 1C

The reviewer flagged the original Phase 1 as "too large" (grounding + attribution + quota + Playwright + outcomes + Auto mode in one phase). Splitting into three smaller phases.

### Phase 1A — Grounding core (3–4 days)

**Goal:** `searchGroundedPlaces` Mastra tool returns ≥ 3 places with `place_id` + lat/lng + maps URL. Attribution renders alongside.

| # | Task | Spec | Owner |
|---|---|---|---|
| 1A.1 | Implement `searchGroundedPlaces` Mastra tool wrapping `maps-grounding-client.ts` | [`tasks/grounding/010-grounded-search.md`](./tasks/grounding/010-grounded-search.md) | Mastra |
| 1A.2 | Register on concierge / router agents | `my-mastra-app/src/mastra/agents/` | Mastra |
| 1A.3 | Wire `<GroundingAttribution>` on grounded result surfaces | [`tasks/grounding/012-grounding-attribution.md`](./tasks/grounding/012-grounding-attribution.md) | Frontend |
| 1A.4 | Basic smoke: staging chat → grounded cards | New: `tests/smoke/chat-grounded-places.spec.ts` (basic only — no full E2E yet) | QA |

**Exit gate:** "best rooftops in El Poblado" returns ≥ 3 cards with `placeUri` + attribution badge.

### Phase 1B — Observability + verification (2 days)

**Goal:** Every grounded call is logged + traceable + bounded.

| # | Task | Spec | Owner |
|---|---|---|---|
| 1B.1 | `grounding_quota_log` migration + writes per MCP call | [`tasks/grounding/014-grounding-quota-protection.md`](./tasks/grounding/014-grounding-quota-protection.md) | Supabase + Mastra |
| 1B.2 | Grounding telemetry (latency, caps, errors) | [`tasks/grounding/013-grounding-telemetry.md`](./tasks/grounding/013-grounding-telemetry.md) | Mastra |
| 1B.3 | Extend `.claude/outcomes/maps-grounding.md` with tool-wiring criteria | `.claude/outcomes/maps-grounding.md` | Reviewer |
| 1B.4 | Full Playwright spec `tests/smoke/chat-grounded-places.spec.ts` (with assertions) | spec | QA |

**Exit gate:** SQL row in `grounding_quota_log` per chat session; rubric grader returns `satisfied`.

### Phase 1C — Runtime Action Pipeline outcome (3 days)

**Goal:** The chat-tool-action-MapContext-ChatMap pipeline has its own outcome rubric, its own Playwright spec, and an instrumentation strategy.

This is the **critical missing piece** the reviewer flagged. "Chat works, map works, bridge broken" must be a graded outcome, not a one-time investigation.

| # | Task | Spec | Owner |
|---|---|---|---|
| 1C.1 | Author **`.claude/outcomes/runtime-action-pipeline.md`** rubric | New rubric (criteria in §5) | Reviewer |
| 1C.2 | Add SSE tracing — log every `mdeai_actions` event with `run_id` + `category` + `count` | `src/lib/chat/action-parser.ts`, `src/hooks/useChatMapSync.ts` | Frontend |
| 1C.3 | Playwright spec `tests/smoke/chat-pipeline.spec.ts` — asserts: query → SSE event with action → MapContext call → pin visible | spec | QA |
| 1C.4 | Wire production observability — `ai_runs` row + `pins_emitted` per turn | `src/lib/maps-telemetry.ts` | Frontend |

**Exit gate:** Outcomes grader returns `satisfied` on a real chat session; SSE payload captured in proof block; pin count matches action payload.

## 4.2 Phase 2 — Places enrichment cache (8 days)

**Dependencies:** 1A–1C complete (grounded `place_id`s land in enrichment-aware UI).

| # | Task | Spec |
|---|---|---|
| 2.1 | Migration: `place_details_cache` + extend events/restaurants/apartments with `google_place_id`, `maps_url`, `directions_url`, `photo_resource_names text[]` | [`tasks/places/020-place-details-enrichment.md`](./tasks/places/020-place-details-enrichment.md), [`tasks/places/023-place-field-masks-placeuri.md`](./tasks/places/023-place-field-masks-placeuri.md) |
| 2.2 | Update `scripts/enrich-places.ts` to use `src/lib/places-client.ts` wrapper + write through cache | [`tasks/places/`](./tasks/places/) |
| 2.3 | Backfill `maps_url` on existing rows | one-shot script |
| 2.4 | Author `.claude/outcomes/maps-places-enrichment.md` rubric | New rubric (criteria in §5) |

### Phase 2B — Place Photos (2 days)

| # | Task | Spec |
|---|---|---|
| 2B.1 | Photo resource names cached in DB; URLs fetched on user open | new — extend `enrich-places.ts` |
| 2B.2 | Photos rendered on rental cards + InfoWindow | `src/components/map/MdeInfoWindow.tsx`, `RentalCard.tsx` |

**Exit gate:** SQL: ≥ 10 events/restaurants/apartments with non-null `maps_url` AND `google_place_id`; photo URLs return 2xx on user open; Outcomes grader returns `satisfied`.

## 4.3 Phase 3 — Nearby intelligence (5 days)

**Goal:** "What's near this apartment" / "events near this restaurant" cards.

| # | Task | Spec |
|---|---|---|
| 3.1 | Wire `search-restaurants` / `search-attractions` Mastra tools with proper field masks | [`tasks/places/021-place-search-restaurants.md`](./tasks/places/021-place-search-restaurants.md), [`tasks/places/022-place-search-attractions.md`](./tasks/places/022-place-search-attractions.md) |
| 3.2 | Nearby Search (New) for tail queries when DB thin | Places Nearby Search docs |
| 3.3 | Cache layer for repeat nearby queries | `place_search_cache` table extension |

**Exit gate:** Chat: "events near this Laureles rental" → ≥ 3 cards with `place_id` + distance.

## 4.4 Phase 4 — Host venue autocomplete (4 days)

**Dependencies:** Phase 2 (Place Details cache exists for selected venue).

| # | Task | Spec |
|---|---|---|
| 4.1 | Decide UI: ECL `gmpx-place-picker` vs `places-autocomplete-js` vs custom hook (1-day spike) | clone `places-autocomplete-js` to compare |
| 4.2 | Implement host wizard step: typed search → predictions → select → `google_place_id` saved | new — `src/components/events/HostVenuePicker.tsx` |
| 4.3 | Session-token discipline (UUID v4 / 150ms debounce / Colombia bias) | spec |

**Exit gate:** Host wizard saves `google_place_id` (SQL proof). Network capture: ≤ N fetch calls per 5-char query.

## 4.5 Phase 5 — Marker polish (5 days)

**Dependencies:** Phase 2 enrichment complete (price + rating data must exist).

Per [`features/15-markers-plan.md`](./features/15-markers-plan.md) M1–M5:

| # | Task | Spec |
|---|---|---|
| 5.1 | M1 — Price badge polish (COP format, tabular nums, truncate) | `pinContent.ts` only |
| 5.2 | M2 — Rating chip (★ x.x when `meta.rating`) | `pinContent.ts` only |
| 5.3 | M3 — Selected state (`aria-current="true"` + zIndex + scale) | `MapContext`, `ChatMap` |
| 5.4 | M4 — Mobile bottom sheet via ECL `gmpx-overlay-layout` behind feature flag | `12-component-libary.md` integration plan |
| 5.5 | M5 — Paisa custom cluster renderer | `MdeMarkerCluster.tsx` |
| 5.6 | Author `.claude/outcomes/maps-markers.md` rubric | New rubric |

**Exit gate:** Marker UX audit ≥ 92/100 per `features/15-markers-plan.md`.

## 4.6 Phase Later — Routes (DEFERRED)

Per reviewer feedback, route previews ship only after Phase 4 is live and PM/user demand is confirmed. Track as `Later — not scheduled`. The Mastra tool `compute_routes` + `MdeRouteLayer` work in [`tasks/deferred/062-mastra-wire-route-display.md`](./tasks/deferred/062-mastra-wire-route-display.md) stays parked.

## 4.7 Phase 0 — Ship blockers (do FIRST before Phase 1A)

The existing [`todo.md`](./todo.md) §Phase 0 lists 6 blockers. Do these in parallel with Phase 1A planning:

| # | Blocker | Reason |
|---|---|---|
| 0.1 | Enable `mapstools.googleapis.com` on server Maps API key | Phase 1A is dead-on-arrival without this |
| 0.2 | "See all 5 → 5 pins" — `ids=` authoritative; stop AND-filtering with `q.neighborhoods` | MAPS-SEE-ALL still 94/100 |
| 0.3 | Backfill 5th listing coords if 0.2 still shows 4 | data fix |
| 0.4 | MAPS-SEE-ALL 95+ — signed-in prod `/chat` → fresh `ai_runs` row | gate close |
| 0.5 | Fix `verify:mastra-all` so `npm run floor` passes | unblocks the gate |
| 0.6 | Confirm Mastra SSE tool events → `MapContext` pins (Gap B) | becomes the input for the Runtime Action Pipeline outcome (1C) |

---

# 5. Outcomes rubrics — final list (slimmer)

Per reviewer feedback: author rubrics **with** the feature, not ahead of it. Start with two new rubrics + one extension.

| # | Rubric | Status | Phase that authors it |
|---|---|---|---|
| 1 | [`.claude/outcomes/runtime-action-pipeline.md`](../../../.claude/outcomes/runtime-action-pipeline.md) | **NEW (highest priority)** — does not exist yet | Phase 1C |
| 2 | [`.claude/outcomes/maps-grounding.md`](../../../.claude/outcomes/maps-grounding.md) | **EXTEND** — exists; add tool-wiring criteria | Phase 1B |
| 3 | `.claude/outcomes/maps-places-enrichment.md` | **NEW** — does not exist yet | Phase 2 (not Phase 1) |
| 4 | `.claude/outcomes/maps-markers.md` | **NEW** — write only when starting Phase 5 | Phase 5 |
| ❌ | `maps-autocomplete.md`, `maps-routes-display.md` | **DEFERRED** — write when features ship | TBD |

**Why slimmer than `plans/01-claude-plan-maps.md`:** Maintaining rubrics for unbuilt features creates churn. Each rubric represents a real review surface — write it when the surface exists.

## 5.1 Runtime Action Pipeline rubric — criteria sketch

The most important new outcome. Authored in Phase 1C.

```
1. Chat input → Mastra workflow invocation (assert SSE 200 + correct workflow_id)
2. Workflow → tool call (assert specific tool fired, e.g. search-rentals)
3. Tool → structured action payload (assert mdeai_actions event with category + listing_ids[])
4. Action → MapContext call (assert setPins / mergePinsByCategory invoked with same IDs)
5. MapContext → ChatMap render (assert ≥ 1 [data-testid="map-pin"] within 15s)
6. Pin count matches action payload (no silent loss)
7. No console errors during the pipeline
8. ai_runs row exists with non-null pins_emitted
9. [Locked] Visual proof: screenshot of chat + map both showing the same N items
```

## 5.2 Maps Places Enrichment rubric — criteria sketch (Phase 2)

```
1. Every Places call has X-Goog-FieldMask (regression of places-enrichment-compliance.test.ts)
2. Mask matches a canonical mdeai mask (no SKU upgraders unless explicit)
3. Place Details cache hits before any new fetch (place_details_cache.query_hash lookup)
4. Cache TTL ≤ 30 days (Google ToS max)
5. withRetry wraps fetch with 429 backoff
6. SQL: ≥ 10 enriched rows with non-null maps_url after run
7. [Locked] Real Medellín smoke: enrich-places.ts succeeds against a seeded event
```

## 5.3 Maps Markers rubric — written only at Phase 5

Sketch lives in `plans/01-claude-plan-maps.md` §3.4. Do **not** author the rubric file until Phase 5 starts.

---

# 6. GitHub repos — what to use

Repos under `/home/sk/mde/github/maps/` — kept outside `src/` so Vite doesn't bundle them.

## 6.1 Tier A — keep + cite in PRs

| Path | Upstream | Used in phase | Why |
|---|---|---|---|
| [`js-api-samples`](../../../github/maps/js-api-samples) | https://github.com/googlemaps/js-api-samples | All (PR reference standard) | Canonical for AdvancedMarker, `gmp-click`, importLibrary, fitBounds, collision |
| [`grounding-lite-mcp-sample-app`](../../../github/maps/grounding-lite-mcp-sample-app) | https://github.com/googlemaps/grounding-lite-mcp-sample-app | 1A | MCP transport patterns; `StreamableHTTPClientTransport` — port patterns only, NOT the demo |
| [`extended-component-library`](../../../github/maps/extended-component-library) | https://github.com/googlemaps/extended-component-library | 5 (only) | `gmpx-place-picker` for Phase 4; `gmpx-overlay-layout` for Phase 5 M4 — deferred per reviewer |
| [`js-markerclusterer`](../../../github/maps/js-markerclusterer) | https://github.com/googlemaps/js-markerclusterer | 5 (M5) | Custom renderer pattern for Paisa cluster bubbles |
| [`codelab-maps-platform-101-react-js`](../../../github/maps/codelab-maps-platform-101-react-js) | https://github.com/googlemaps/codelab-maps-platform-101-react-js | onboarding | `APIProvider` + `useMap()` reference |

## 6.2 Tier B — keep + use for edge / scripts

| Path | Upstream | Used in | Why |
|---|---|---|---|
| [`google-maps-services-js`](../../../github/maps/google-maps-services-js) | https://github.com/googlemaps/google-maps-services-js | edge / scripts only | Legacy for Places (use `@googlemaps/places` for new Places work); valid for Geocoding/Directions on the edge |

## 6.3 Tier C — defer / archive

| Path | Upstream | Decision |
|---|---|---|
| [`ag-ui-adk-grounding-app`](../../../github/maps/ag-ui-adk-grounding-app) | community (Greyisheep) | **Inspiration only.** Never copy MCP wiring, RLS, billing. Archive once UX ideas absorbed. |

## 6.4 Pending clones (clone when phase starts)

| Pending | When to clone | Tasks served |
|---|---|---|
| `googlemaps/js-adv-markers-utils` | Phase 5 M1–M2 | Rich marker styling reference |
| `alexpechkarev/places-autocomplete-js` | Phase 4 | Session-token discipline reference |
| `googlemaps/js-api-loader` | When auditing `google-maps-loader.ts` | Loader audit only — do NOT add a second loader |

## 6.5 Do-NOT-clone

- `@googlemaps/react-wrapper` (deprecated)
- `googlemaps/js-three` (Phase 3+ contest/sponsor only)
- Community lead-scraper / Geo-Explorer repos (ToS-incompatible)
- Press-demo "interactive map projects" (embed path unverified)

---

# 7. Skills + MCPs to use

## 7.1 Skills (path-scoped — auto-load when working in matched files)

| Skill | Path | Used for |
|---|---|---|
| `mde-maps` | [`.claude/skills/mde-maps/`](../../../.claude/skills/mde-maps/) | THE canonical Maps skill. Field masks, Places New, AdvancedMarker, Grounding, MCP verification. |
| `mastra` | [`.claude/skills/mastra/`](../../../.claude/skills/mastra/) | Tool / agent / workflow authoring |
| `mastra-routing` | [`.claude/skills/mastra-routing/`](../../../.claude/skills/mastra-routing/) | Router agent + intent routing (rentals vs events) |
| `mde-supabase` | [`.claude/skills/mde-supabase/`](../../../.claude/skills/mde-supabase/) | Migrations, RLS, edge functions for Places cache tables |
| `gemini` | [`.claude/skills/gemini/`](../../../.claude/skills/gemini/) | Gemini API + model selection (for AI summaries) |
| `mde-testing` | [`.claude/skills/mde-testing/`](../../../.claude/skills/mde-testing/) | Vitest + Playwright + browser proof |
| `mde-worktree-pr-flow` | [`.claude/skills/mde-worktree-pr-flow/`](../../../.claude/skills/mde-worktree-pr-flow/) | One worktree, one PR discipline |

Legacy stubs in `.claude/skills/`: `google-maps-api`, `react-google-maps`. These redirect to `mde-maps`. Do not reference directly.

## 7.2 MCPs (Maps-specific)

| MCP | What it does | When to invoke |
|---|---|---|
| `mcp__google-maps-code-assist__*` | Maps Platform docs RAG; `retrieve-instructions` + `retrieve-google-maps-platform-docs` | **Mandatory** before every Maps PR (kills doc hallucination) |
| `mcp__maps-grounding-lite__*` | Live `search_places` / `lookup_weather` / `compute_routes` | Phase 1 grounding work + later route work |
| `mcp__google-developer-knowledge__*` | Broader Google APIs research | Adjacent (Search Grounding, Maps + Gemini integration) |
| `mcp__gemini-api-docs-mcp__*` | Gemini API docs | Whenever the Mastra agent's model changes |

## 7.3 MCP-vs-CLI policy

| Job | Prefer |
|---|---|
| Day-to-day Maps doc lookup in a Claude session | **MCP** (`google-maps-code-assist`) |
| CI / non-interactive Playwright | **CLI** (`@playwright/test`) — lower token cost |
| Browser proof during dev | **Chrome DevTools MCP** OR `Claude_Preview` MCP |
| Real production browser smoke | Playwright CLI against `PLAYWRIGHT_BASE_URL` |

---

# 8. What we explicitly REMOVED from active scope

Per reviewer feedback. These items move to "Future research / experimental" — track separately, do not block Phase 1–5.

| Removed | Why | Where it goes |
|---|---|---|
| **Multi-agent orchestration** for Maps fan-out | Overengineering for marker polish; supervisors + sub-agents add cost + complexity for negligible time savings | Future research; revisit after Phase 5 |
| **Computer use in CLI** for mobile verification | Playwright `devices['iPhone 12']` + screenshots already cover mobile; Computer use adds platform dependency (Mac-only iOS Sim) | Future research |
| **`maps-autocomplete.md`**, **`maps-routes-display.md`** rubrics (early) | Author with the feature, not ahead of it; rubric maintenance is not the project | Move to phase that ships the feature |
| **Routes phase** (`compute_routes` + `MdeRouteLayer`) | Highest value is grounded discovery + nearby intelligence + enrichment; navigation is not Phase 1–5 critical | Phase Later (unscheduled) |
| **Ask Maps UX clone** | Consumer feature, not embeddable Platform API | Permanently out — `features/16-google-maps-features.md` |
| **Immersive Navigation** | Navigation SDK territory; not Events MVP | Permanently out |
| **Earth AI, 3D Maps, js-three** | Wrong product surface; Phase 3+ only | Phase 3+ contest/sponsor |
| **Heatmaps / Data Layer polygons** | Admin/analytics scope; not consumer MVP | Defer |
| **Sponsored / featured pins** | Phase 3 marketplace; trust review needed first | Phase 3 |
| **Vertex Maps grounding fork** | Only if migrating off Mastra+Gemini API path | Skip |

---

# 9. Folder reorganization for `tasks/mastra/maps/`

Current state (after this plan lands):

```
tasks/mastra/maps/
├── 07-maps-search.md            # legacy notes
├── 09-notes.md                  # legacy notes
├── 100-maps-plan.md             # ← THIS FILE (canonical entry)
├── index-maps.md                # ← new (folder index)
├── maps-prd-v2.md               # PRD reference (538 lines)
├── todo.md                      # development checklist (kept; refreshed per this plan)
│
├── audit/                       # forensic + production-readiness audits
├── features/                    # 12, 15, 16, 17 — feature scorecards
├── github-repos/                # 08, 13, audit — repo strategy
├── outcomes/                    # 01, 02, 03 — prompt templates (NOT rubrics)
├── plans/                       # 01-claude-plan-maps (superseded by this file), 02-google-mastra, MAPS-DOCS-CITATIONS
├── prompts/                     # 01-prompt-maps, GEMINI.md (canonical Gemini CLI prompt)
├── proof/                       # screenshots from prior sessions
└── tasks/                       # MASTRA-### specs (043–079+) + progress-maps.md + places/
```

## 9.1 Recommended cleanup (one-shot, low risk)

| Action | File | Why |
|---|---|---|
| **Archive to `_legacy/`** | `07-maps-search.md`, `09-notes.md` | Pre-strategy notes; superseded |
| **Keep + flag superseded by 100** | `plans/01-claude-plan-maps.md` | Still useful as the deep-dive; add note at top: "Superseded by `../100-maps-plan.md` where they conflict" |
| **No changes** | Everything in `audit/`, `features/`, `github-repos/`, `proof/` | Domain-owned by their topic |
| **Consolidate outcome design** | `outcomes/01-outcomes-prompt.md`, `02`, `03` | These are PROMPTS that produce rubrics. Add one-line README explaining they're not the rubrics themselves. |

## 9.2 Folder rules going forward

- **Specs (MASTRA-###)** → `tasks/`. One per file. YAML frontmatter.
- **Strategy / plans** → `plans/`. Numbered. `100-maps-plan.md` is the master.
- **Feature scorecards** → `features/`. One per feature surface.
- **Production audits** → `audit/`. Dated. Forensic.
- **PR-time proof screenshots** → `proof/`. Dated filename.
- **Outcome prompt templates (not rubrics)** → `outcomes/`. Rubrics themselves live at `.claude/outcomes/`.
- **Engineer prompts (Gemini CLI, decomposition, etc.)** → `prompts/`. Plain English.
- **Repo strategy** → `github-repos/`. One file per tier audit cycle.

## 9.3 What NOT to do

- Don't create `tasks/mastra/maps/components/` — actual components live in `src/components/map/`.
- Don't move `.claude/outcomes/maps-*.md` into this folder — rubrics MUST live at `.claude/outcomes/` for the grader to find them.
- Don't proliferate `00X-maps-*.md` files at the maps/ root. Use subfolders.

---

# 10. Cross-references

## 10.1 In-repo (primary)

| Doc | Owns |
|---|---|
| [`index-maps.md`](./index-maps.md) | Folder index — where to look |
| [`todo.md`](./todo.md) | Phase-by-phase development checklist (refreshed per this plan) |
| [`plans/01-claude-plan-maps.md`](./plans/01-claude-plan-maps.md) | Deep-dive (superseded by this file where they conflict) |
| [`plans/02-google-mastra.md`](./plans/02-google-mastra.md) | Architecture separation principles |
| [`features/16-google-maps-features.md`](./features/16-google-maps-features.md) | Maps platform scoring 73 → 88 |
| [`features/15-markers-plan.md`](./features/15-markers-plan.md) | M1–M5 marker plan 84 → 92 |
| [`features/12-component-libary.md`](./features/12-component-libary.md) | ECL integration architecture |
| [`features/17-maps-features.md`](./features/17-maps-features.md) | Alternate top-20 (note: includes "Ask Maps" — DO NOT BUILD) |
| [`github-repos/13-github-repos.md`](06-github-repos.md) | Tier policy + clone checklist |
| [`github-repos/google-maps-github-repos-audit.md`](07-google-maps-github-repos-audit.md) | Code parity 97/100 |
| [`tasks/progress-maps.md`](./tasks/progress-maps.md) | Maps task tracker (by area) |
| [`maps-prd-v2.md`](./maps-prd-v2.md) | PRD source of truth |
| [`prompts/GEMINI.md`](./prompts/GEMINI.md) | Official Gemini CLI prompt for GMP work |
| [`prompts/01-prompt-maps.md`](./prompts/01-prompt-maps.md) | Maps research prompt |
| [`audit/02-maps-platform-audit.md`](./audit/02-maps-platform-audit.md) | Platform audit |
| [`audit/10-production-readiness-checklist-2026-05-17.md`](./audit/10-production-readiness-checklist-2026-05-17.md) | Production readiness audit |

## 10.2 Repo-wide

| Doc | Owns |
|---|---|
| [`CLAUDE.md`](../../../CLAUDE.md) | Repo conventions |
| [`tasks/strategy/100-claude-code-plan.md`](../../strategy/100-claude-code-plan.md) | Harness master plan |
| [`tasks/strategy/claude-code/99-claude-checklist.md`](../../strategy/claude-code/99-claude-checklist.md) | Harness work scorecard |
| [`tasks/mastra/progress-mastra.md`](../progress-mastra.md) | Parent Mastra tracker |
| [`.claude/outcomes/README.md`](../../../.claude/outcomes/README.md) | Outcomes mode definitions |
| [`.claude/outcomes/maps-grounding.md`](../../../.claude/outcomes/maps-grounding.md) | Existing rubric — extended in Phase 1B |
| [`.claude/skills/mde-maps/SKILL.md`](../../../.claude/skills/mde-maps/SKILL.md) | Maps API contracts + MCP verification |

## 10.3 Official docs (cite at least one per PR)

| Topic | URL |
|---|---|
| Grounding Lite | https://developers.google.com/maps/ai/grounding-lite |
| Grounding Lite MCP | https://developers.google.com/maps/ai/grounding-lite/reference/mcp |
| Grounding attribution | https://developers.google.com/maps/ai/grounding-lite/attribution |
| Maps Code Assist MCP | https://developers.google.com/maps/ai/code-assist/reference/mcp |
| Place Details (New) | https://developers.google.com/maps/documentation/places/web-service/place-details |
| Place Autocomplete (New) | https://developers.google.com/maps/documentation/places/web-service/place-autocomplete |
| Place Photos (New) | https://developers.google.com/maps/documentation/places/web-service/place-photos |
| Places Nearby Search (New) | https://developers.google.com/maps/documentation/places/web-service/nearby-search |
| Maps links | https://developers.google.com/maps/documentation/places/web-service/maps-links |
| Field masks | https://developers.google.com/maps/documentation/places/web-service/choose-fields |
| Advanced Markers | https://developers.google.com/maps/documentation/javascript/advanced-markers/overview |
| Outcomes (Managed Agents) | https://platform.claude.com/docs/en/managed-agents/define-outcomes |
| `/goal` command | https://code.claude.com/docs/en/goal |
| Claude Code best practices | https://code.claude.com/docs/en/best-practices |

---

# 11. Open questions + risks

## 11.1 Open questions (need answer before Phase 1A starts)

1. **`mapstools.googleapis.com` API enablement** — required for Phase 1A. Phase 0 blocker 0.1.
2. **Outcomes API access** — confirm Managed Agents beta header `managed-agents-2026-04-01` is available. If not, defer §5.1's Runtime Action Pipeline rubric activation; the rubric file can still be written.
3. **ECL adoption decision** — Phase 5 M4 needs `gmpx-overlay-layout`. Confirm we accept the loader-coordination work before committing.
4. **Place Photos cost cap** — Phase 2B introduces photo billing. Confirm a monthly budget alert ceiling in GCP billing console.

## 11.2 Cross-cutting risks

| # | Risk | Phase | Mitigation |
|---|---|---|---|
| R1 | Double Maps JS load (ECL `<gmpx-api-loader>` + `google-maps-loader.ts`) | 5 | Single bootstrap rule; feature flag |
| R2 | Grounded responses without attribution | 1A | Outcomes grader blocks ship without `<GroundingAttribution>` |
| R3 | Places SKU spike from photos | 2B | Cache resource names; fetch URLs only on user open |
| R4 | MCP quota / cost spike | 1 | `grounding_quota_log` + per-user caps |
| R5 | Generated AI text replaces structured pins | All | Architecture rule in §2 |
| R6 | Confusing Grounding Lite vs Vertex vs Gemini paths | 1 | One runtime path: Mastra → Grounding Lite MCP |
| R7 | Consumer Maps features mistaken for Platform APIs | All | Do not spec "Ask Maps" or "Immersive Nav" |
| R8 | Runtime Action Pipeline broken silently | 1C | Outcomes rubric in §5.1 explicitly grades pipeline integrity |
| R9 | Routes phase scope creep | Later | Park in `tasks/deferred/062-mastra-wire-route-display.md`; do not schedule |

## 11.3 Things this plan does NOT cover

- Mastra non-Maps work — `tasks/strategy/100-claude-code-plan.md` Phase 4–5.
- Stripe / payments — `tasks/todo.md` §1.
- Supabase non-Maps migrations — `.claude/outcomes/supabase-migration.md`.
- Pitch deck / ATS — separate roadmap.

---

# 12. Definition of "strategy complete"

This document is "strategy complete" when:

- [x] 25-step setup table approved (§2)
- [x] Best immediate order locked (§3)
- [x] Phase 1A / 1B / 1C split documented with exit gates (§4.1)
- [x] Slimmed Outcomes list (§5) — 2 new rubrics + 1 extension at start, no premature authoring
- [x] GitHub repo decisions per phase (§6)
- [x] Skills + MCPs mapping (§7)
- [x] Items explicitly removed from active scope (§8) — multi-agent, Computer use in CLI, routes
- [x] Folder reorganization rules (§9)
- [x] Cross-references (§10)
- [x] Open questions + risks (§11)

**Not yet done (requires user action):**

- [ ] Approval to start Phase 0 (ship blockers) + Phase 1A (`searchGroundedPlaces`)
- [ ] Answers to §11.1 open questions
- [ ] `mapstools.googleapis.com` enabled on Maps API key (GCP Console)

---

## Closing summary

**Plain English:**

The harness is built. The Maps code grades 97/100 vs Google's own samples. What's left is **product surface depth**: grounded AI answers (Phase 1), enriched Places data (Phase 2), nearby intelligence (Phase 3), host autocomplete (Phase 4), marker polish (Phase 5). Routes shipping is deferred until after Phase 5.

The **most important missing thing** the reviewer flagged is the **Runtime Action Pipeline outcome** — graded proof that chat → Mastra → tool → action → MapContext → ChatMap actually works end-to-end. That's Phase 1C and the first rubric to author.

Multi-agent orchestration and Computer-use-in-CLI are explicitly **NOT** in active scope. They were overengineering for this stage.

**Honesty markers (open `[UNVERIFIED]` items):**

- Outcomes API access / Managed Agents beta header (§11.1 #2)
- ECL `gmpx-overlay-layout` loader coordination (§11.1 #3)
- Place Photos monthly budget ceiling (§11.1 #4)
- `mapstools.googleapis.com` enablement on the Maps API key (§11.1 #1 = Phase 0 blocker 0.1)

**Next decision:** approve this plan and Phase 0 blockers, then start Phase 1A (`searchGroundedPlaces`). Or rebalance phases first?
