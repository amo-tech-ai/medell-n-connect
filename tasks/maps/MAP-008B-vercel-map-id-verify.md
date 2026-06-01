---
id: MAP-008B
title: Vercel Map ID + API key restriction verify
status: Not Started
priority: P0
phase: MVP-hardening — blocks Advanced Markers on preview/prod
effort: 1-2h
owner: claude
depends_on: [MAP-008]
blocks: []
skill: [mde-maps, mde-vercel, testing]
prd_ref: ./docs/maps-audit-2.md
related:
  - ../archive/maps-A/MAP-008-advanced-markers-map-id.md
  - ../../mdeapp/scripts/verify-maps-env.mjs
description: Prove NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID is set on Vercel preview/prod and Advanced Markers render (not DEMO_MAP_ID).
linear: SAN-369
---

# MAP-008B — Vercel Map ID verify

## At a glance

**Problem:** MAP-008 code gates markers on `mapId`, but **Vercel env** may be missing `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` — Advanced Markers silently absent on preview/prod.

**Fix:** Env audit + visual proof on deployed URL.

## Checks

| # | Check | Pass |
|---|-------|------|
| 1 | Vercel preview has `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` (not empty, not `DEMO_MAP_ID`) | |
| 2 | Vercel preview has `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` with **HTTP referrer** restriction for `*.vercel.app` + prod domain | |
| 3 | Deployed `/` shows `[data-testid="map-pin"]` after rental or café query | |
| 4 | `verify-maps-env.mjs` run in CI or pre-deploy with production-like env | |
| 5 | No `RefererNotAllowedMapError` in browser console on preview | |

## Commands

```bash
cd /home/sk/mdeai/mdeapp
node scripts/verify-maps-env.mjs   # local baseline
# On preview: open / → DevTools → confirm map tiles + pins
```

## Acceptance criteria

- [ ] Screenshot or Playwright capture from Vercel preview with visible pins
- [ ] Env list documented (redacted) in `tasks/notes/MAP-008B-evidence.md`
- [ ] GCP Console: Maps JS key restricted to app origins only
- [ ] Places/server keys **not** in any `NEXT_PUBLIC_*` var

## Out of scope

- MAP-034 marker UX polish
- Creating new Map ID in Console (only verify existing)
