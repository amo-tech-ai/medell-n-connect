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

## Local sign-off (same day)

- `npm run test:e2e:p0-focused` — run after CK commit + dev restart  
- `npm run test:e2e:card-unification` — UX-T-030 slice  
- Evidence: `tasks/testing/evidence/visual-cards/01–04.png`
