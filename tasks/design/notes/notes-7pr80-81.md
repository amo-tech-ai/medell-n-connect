# Audit — PR #80 (SAN-575) & PR #81 (SAN-574)

**Date:** 2026-06-05  
**Repos:** [mdeapp PR #80](https://github.com/amo-tech-ai/mdeapp/pull/80) · [mdeapp PR #81](https://github.com/amo-tech-ai/mdeapp/pull/81)  
**Refs:** D-08 / SAN-574 · D-09 / SAN-575 · shadcn skill · SCREEN-023

---

## Executive summary

| PR | Verdict | Action |
|----|---------|--------|
| **#81** (SAN-574) | **Close — duplicate** | Already on `main` as `b639226`. Branch diff vs `main` is **0 lines**. Do not merge. |
| **#80** (SAN-575) | **Request changes** | Vercel ✅ · Floor ❌ (typecheck). Fix TS test + a11y/scope items below, then merge. |

---

## PR #81 — SAN-574 (shared browse system)

### Status

- **State:** Open, mergeable — but **content already shipped** via PR #79 → `main` @ `b639226`.
- **Branch:** `ai/san-574-d-08-shared-browse-system` @ `6aeece6`
- **Diff vs `main`:** empty (0 lines). Same work, different commit SHA.
- **CI:** Floor passed on earlier run; Vercel preview green. Irrelevant for merge.

### Red flags

| Severity | Issue |
|----------|--------|
| **Blocker** | **Stale PR** — merging would add no value; risks confusion and double-close Linear. |
| **Process** | Body says `Refs SAN-574` not `Closes`; Linear may stay open if someone merges by mistake. |
| **Process** | CodeRabbit rate-limited — no automated review on reopen. |

### Critical fixes

1. **Close PR #81** with comment: superseded by #79 / `b639226`.
2. Mark **SAN-574 Done** in Linear if not already.

### Missing

- Nothing — work is on `main`.

---

## PR #80 — SAN-575 (restaurants re-skin)

### Status

- **State:** Open, mergeable
- **Branch:** `ai/san-575-d-09-restaurants-reskin` @ `7a68062`
- **Base:** `main` @ `b639226` (includes SAN-574)
- **Files:** 9 (+575 / −199)
- **CI:** Vercel ✅ · **Floor ❌** · CodeRabbit skipped (rate limit)

### CI failure (blocker)

```
src/components/copilot/__tests__/restaurant-card.test.tsx(49,8):
  TS2741: Property 'pinId' is missing ... required in type 'CardInteractionProps'
```

**Fix:** Add `pinId="restaurant-cover-test"` to the “full-width cover media” test case.

Local `npm run build` passed before push; **CI typecheck is stricter** — floor fails until test is fixed.

### Red flags

| Severity | Issue | Location |
|----------|--------|----------|
| **Blocker** | Floor typecheck fail (above) | `restaurant-card.test.tsx:49` |
| **High** | Chat cards default to `composition="nova"` — browse-only claim vs persona-visible `/` change | `restaurant-card.tsx:143`, `domain-results.tsx:149` (no override) |
| **High** | Interactive body: `bodyRole="button"` without `bodyAriaLabel` when `onOpenDetails` set (chat only) | `restaurant-card.tsx:207-209` |
| **Medium** | Hero `<img alt="">` — decorative, no `aria-labelledby` to title | `restaurant-card.tsx:108-112` |
| **Medium** | Evidence PNGs live in **planning repo** (`tasks/testing/evidence/…`) — not in mdeapp PR; prod column absent | RESULTS.md |
| **Low** | `buildFilterUrl` duplicated | `restaurant-browse-view.tsx`, `restaurant-browse-filters.tsx` |
| **Low** | Untracked locally: `toggle-group.tsx`, `github/` — not in PR (good) |

### shadcn audit (skill rules)

**Passing**

- `nativeButton={false}` on `Button` + `Link`/`a` render props
- `data-icon` on icons inside buttons
- Semantic tokens (`text-muted-foreground`, `border-primary`, etc.)
- No `space-y-*` in new filter rows (uses `gap-2`)
- `Badge` for cuisine/price chips

**Debt / violations**

| Rule | Finding |
|------|---------|
| **ToggleGroup for filter chips** | Uses `Link` + `toggleVariants` + manual `aria-pressed` instead of `ToggleGroup`/`ToggleGroupItem`. Intentional tradeoff: Base UI `ToggleGroupItem` + `Link` exposed **button** role and broke SCREEN-023. |
| **FieldSet + FieldLegend** | Filter groups use `<div role="group">` + `<p>` labels |
| **Full Card composition** | Nova path uses raw `<h3>`/`<p>` in `CardContent`, not `CardHeader`/`CardTitle`/`CardDescription` |
| **Separator** | `CardFooter` + manual `border-t` on legacy path |
| **Empty** | Still uses project `EmptyState`, not shadcn `Empty` |
| **Icon sizing** | `UtensilsCrossed className="size-8"` in empty state |
| **Partial CLI install** | PR adds `toggle.tsx` only; `toggle-group.tsx` installed locally but **not committed** (filters don’t use it) |

**Score (re-skin scope):** ~72/100 — acceptable for SAN-575 slice; full D-09 debt tracked for nightlife/cafés.

### Scope gate

`scripts/san-575-scope-gate.sh` — **PASS** (restaurants-only paths).

Does **not** catch chat reskin via default `composition="nova"`.

### Tests & evidence

| Check | Result |
|-------|--------|
| Vitest full suite (local) | ✅ 530 |
| Scope gate | ✅ |
| SCREEN-023 Playwright | ✅ (grid + Laureles `link` + `aria-pressed`) |
| SAN-575 visual e2e | ✅ 375/768/1280 (in `mdeapp` branch) |
| Filter unit tests | ❌ none |
| Chat nova regression | ❌ not covered |
| Floor CI | ❌ typecheck |
| Prod smoke | ❌ not in RESULTS.md |
| PNG artifacts | ✅ on disk at `tasks/testing/evidence/2026-06-05/san-575/` (parent repo, not mdeapp git) |

Preview: [Vercel SAN-575 preview](https://mdeapp-git-ai-san-575-d-09-restaurants-reskin-amo100.vercel.app)

---

## Critical fixes before merge (#80)

1. **Fix typecheck** — add required `pinId` to cover-layout Vitest case.
2. **Chat scope decision** (pick one):
   - **A (minimal):** `composition="legacy"` in `domain-results.tsx` for chat cards; browse keeps `composition="nova"` + `mediaLayout="cover"`.
   - **B (full nova):** Keep default nova + add `bodyAriaLabel` + chat screenshot evidence on `/`.
3. **a11y:** When `bodyRole="button"`, pass `bodyAriaLabel={\`Open details for ${title}\`}`.

---

## Suggested improvements (non-blocking)

- Deduplicate `buildFilterUrl` → shared `restaurants/filter-url.ts`
- Add Vitest for filter URL toggle logic (`Laureles` on/off, cuisine + neighborhood combo)
- Migrate nova body to `CardHeader`/`CardTitle`/`CardDescription` in a follow-up
- After merge: prod Tier-1 curl + one Browser prompt on `/restaurants` (rules require prod for persona-visible UI)
- Close #81; delete stale branch `ai/san-574-d-08-shared-browse-system`

---

## Merge order

```
1. Close PR #81 (duplicate)
2. Fix #80 typecheck (+ chat scope if choosing A)
3. Re-run floor on #80
4. Merge #80 → mark SAN-575 Done
5. Next: SAN-586 (events API) ∥ SAN-575 slice 2 (/nightlife)
```

---

## ToggleGroup note (SCREEN-023 vs shadcn)

Attempted `ToggleGroupItem` + `render={<Link />}` + `nativeButton={false}`:

- Base UI a11y tree exposed **`button`**, not **`link`**
- SCREEN-023 requires `getByRole("link", { name: "Laureles" })`
- Reverted to **`Link` + `toggleVariants`** + `"use client"` — correct for e2e; shadcn forms rule partially waived with documented reason.

Future: investigate Base UI pattern for link-styled toggles without breaking role, or update SCREEN-023 to `button` + `aria-pressed` (explicit spec change).
