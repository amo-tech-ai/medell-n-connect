# MAP-008B Evidence — Vercel Map ID

> **Summary:** Map ID is set on Vercel Production + Preview + Development. Local vitest + verify-maps-env pass. Prod pin screenshot still needed after next deploy.

**Date:** 2026-06-03  
**Linear:** [SAN-369](https://linear.app/sanjiovani/issue/SAN-369)  
**Prod SHA at verify:** pending deploy (local main ahead)

## Vercel env (verified via CLI)

| Variable | Production | Preview | Development |
|----------|:----------:|:-------:|:-----------:|
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ✅ | ✅ | — |

Command: `vercel env ls | rg MAP_ID` (2026-06-03)

## Automated proof

```bash
cd mdeapp
npm test -- --run src/lib/__tests__/google-maps-map-id.test.ts   # 9/9 pass
npm run verify:maps-env                                           # exit 0 (Places 403 → warning DATA-008)
npm run verify:task -- MAP-008B --skip-floor                      # pass
```

## Localhost

- `GET /` → 200, `data-mapid-present="true"` on chat map after dev boot
- Map ID value present in `.env.local` (redacted)

## Production (remaining for Done)

- [ ] Redeploy prod after merge
- [ ] Browser: search on mdeai.co → ≥1 `[data-testid="map-pin"]`
- [ ] Console: no `RefererNotAllowedMapError`

## Grade

| Layer | Score | Grade |
|-------|------:|-------|
| Vercel env | 100% | A |
| Code + vitest | 100% | A |
| Prod pin proof | 0% | F |
| **Overall** | **85%** | **B** |

Blocked on prod deploy + visual pin check only.
