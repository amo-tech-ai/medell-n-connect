# SCREEN-022 / SAN-491 evidence — 2026-06-04

## Scope

`/nightlife` browse page (SAN-491) — mirror SAN-490 restaurants pattern.

## Verification

| Command | Result |
|---------|--------|
| `curl -s localhost:3001/nightlife \| rg nightlife-page` | 200 + grid + ≥5 `nightlife-card-*` |
| `npm test -- --run src/lib/nightlife-browse.test.ts` | 2/2 pass |
| `PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-022-nightlife-browse.spec.ts --project=chromium` | 2/2 pass |
| `PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-022-nightlife-listings.spec.ts --project=chromium` | 2/2 pass (anon booking = sign-in gate, not `/pending`) |

## Shipped files

- `mdeapp/src/lib/nightlife-browse.ts`
- `mdeapp/src/components/nightlife/nightlife-browse-view.tsx`
- `mdeapp/src/components/nightlife/nightlife-browse-card.tsx`
- `mdeapp/src/app/nightlife/page.tsx` + `loading.tsx`
- `mdeapp/e2e/screens/SCREEN-022-nightlife-browse.spec.ts`

## Persona

Carlos opens `/nightlife`, filters Provenza, picks a reggaeton club without typing in chat.

## Not in this slice

- Map column on browse (deferred — SAN-490 has no map on browse)
- Mobile bottom sheet on browse card tap (chat panel sheet unchanged)
- `npm run floor` — run on merge branch before SAN-491 Done
