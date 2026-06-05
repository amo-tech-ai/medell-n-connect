# June 4 — queue (updated 2026-06-04 PM)

## Done ✅

| Item | SHA / evidence |
|------|----------------|
| **SAN-549** (#70) | `704c0ce` — [10-549.md](./10-549.md), [SAN-549-prod-live-RESULTS](../testing/evidence/SAN-549-prod-live-RESULTS-2026-06-04.md) — **100/100** task scope |
| SAN-521, SAN-294, UX-020, SAN-456 | On `main` |

## VEN-025 routing — implemented, tests green (pre-PR)

**Branch:** `ai/ven025-generic-venues-nightlife-routing` in `/home/sk/mde-wt-search-clean`

Generic `popular venues tonight in Provenza` → **grounded fast-path** with `intent: "nightlife"` (no event hijack).

| Check | Status |
|-------|--------|
| Unit tests (lib + grounded route) | **158/158** |
| Event regression (`nightlife this weekend in Poblado`) | ✅ still events |
| Prod browser | ⏳ after merge |

Evidence: [`tasks/testing/evidence/VEN-025-generic-venues-routing-2026-06-04.md`](../testing/evidence/VEN-025-generic-venues-routing-2026-06-04.md)

**Score: 100/100** (code + tests; deploy proof pending)

### Ship commands

```bash
cd /home/sk/mde-wt-search-clean
git add src/lib/restaurant-query-classifier.ts \
  src/lib/event-query-classifier.ts \
  src/lib/cafe-search-fast-path.ts \
  src/app/api/grounded/search/route.ts \
  src/lib/__tests__/event-query-classifier.test.ts \
  src/lib/__tests__/cafe-search-fast-path.test.ts \
  src/lib/__tests__/restaurant-search-fast-path.test.ts \
  src/app/api/grounded/search/__tests__/route.test.ts
git commit -m "fix(chat): route generic venues tonight to grounded nightlife (VEN-025)"
git push -u origin ai/ven025-generic-venues-nightlife-routing
gh pr create --title "fix(chat): VEN-025 generic venues → grounded nightlife" \
  --body "Closes routing gap after SAN-549. popular venues tonight uses grounded fast-path with intent nightlife; nightlife this weekend stays on events."
```

---

## Next (after VEN-025 PR)

| Priority | Item |
|----------|------|
| 1 | Prod smoke: `popular venues tonight in Provenza` on www.mdeai.co |
| 2 | Rental parser cherry-pick (`.wt-ux-003-night-parser`) |
| 3 | Planning docs PR (`docs/venues-index-canonical-order`) |
| 4 | Next `phase:launch` Linear item |

## Hygiene

- App work: `/home/sk/mde-wt-search-clean` only
- Before push: `rm -rf /home/sk/mdeai/mdeapp/.next`
- `github/` untracked — never commit

## Prod state

| | |
|--|--|
| **Prod HEAD** | `12f11ea` (#71 nav) |
| **SAN-549** | In prod via `704c0ce` |
| **VEN-025 routing** | Local branch only until PR merges |
