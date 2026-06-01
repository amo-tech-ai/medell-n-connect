# Prod smoke — mdeai.co (2026-06-01)

**URL:** https://www.mdeai.co/  
**Method:** HTTP + public HTML (no authenticated preview)

## Checks

| Check | Result | Notes |
|-------|--------|-------|
| GET `/` | 200 | Title: "mdeai — concierge for Medellín" |
| Shell loads | ✅ | Chat canvas, filter chips (Laureles, Poblado, Events, Food & cafés) |
| Map empty state | Expected | "No pins yet" before first query |
| Restaurant cards on prod | ⚠️ | Requires deploy of `main` @ `293f55d`+ (UX-036/022/025) — pre-merge was prose-only |
| CopilotKit POST storm | 🔴 | Known prod issue — fix in uncommitted CK stable-props slice |

## Persona queries (manual after deploy)

1. `1BR in Laureles under $80/night` → rental cards + pins  
2. `salsa events this weekend` → event cards  
3. `suggest restaurants medellin` → restaurant-fast-path-panel  
4. `good specialty coffee in Laureles` → café grounded cards  

## Local sign-off (2026-06-01 verified)

| Suite | Result |
|-------|--------|
| `npm run test:e2e:p0-focused` | ✅ 3/3 (~50s) |
| `npm run test:e2e:card-unification` | ✅ 4/4 (~6.5m) |
| `npm run test:e2e:live-audit` | ✅ 4/4 (~5.5m) |

Evidence:
- `tasks/testing/evidence/visual-cards/01–04.png`
- `tasks/testing/evidence/live-audit-verticals/01–04.png`
- `tasks/testing/evidence/2026-06-01/*-RESULTS.md`
