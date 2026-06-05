# SAN-575 — restaurants re-skin evidence (2026-06-05)

| Check | Result |
|-------|--------|
| Vitest (venue-card-shell, restaurant-card + full suite) | PASS (530 tests) |
| SCREEN-023 Playwright | PASS (2 tests) |
| SAN-575 visual @ 375/768/1280 | PASS |
| Scope gate | PASS |
| `npm run build` | PASS |

Screenshots: `375-restaurants.png`, `768-restaurants.png`, `1280-restaurants.png`

Slice: `/restaurants` only — 16:10 cover media, nova Card composition, toggleVariants filter chips (Link + aria-pressed).

Image fix: `RestaurantCardMedia` uses `aspect-[16/10]`, `overflow-hidden`, `rounded-xl`, `absolute inset-0 object-cover` img; browse passes `mediaLayout="cover"`.
