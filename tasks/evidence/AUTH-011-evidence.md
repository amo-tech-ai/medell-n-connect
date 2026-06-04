# AUTH-011 evidence — 2026-05-25

Operator + agent pass. **No secrets below.**

## Supabase (`zkwcbyxiwklihegjhuql`)

| Check | Status | Method |
|-------|--------|--------|
| Site URL `https://www.mdeai.co` | ✅ | Management API GET after `scripts/configure-supabase-auth-urls.mjs` |
| Redirect allowlist (www, apex, preview, localhost) | ✅ | GET — all host patterns present in `uri_allow_list` |
| Google provider | ⏳ | Dashboard — not API-verified this pass |
| Magic link | ⏳ | Dashboard — not API-verified this pass |

**Script:** `cd mdeapp && npm run auth:configure-supabase`

## Vercel (`amo100/mdeapp`)

| Variable | Production | Preview | Notes |
|----------|------------|---------|-------|
| `NEXT_PUBLIC_SITE_URL` | ✅ `https://www.mdeai.co` | ✅ `https://mdeapp-git-main-amo100.vercel.app` | Fixed via Vercel API (CLI was saving empty string) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | Pre-existing |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | ✅ | Pre-existing |
| `ADK_GROUNDING_URL` | ❌ | ❌ | **Still required** — no HTTPS ADK host in repo yet |
| `COPILOTKIT_API_KEY` | ❌ | ❌ | Optional for Pattern 1 same-origin |

**Production redeploy:** `mdeapp-rmlhbi1a7-amo100.vercel.app` → `www.mdeai.co` (2026-05-25, after SITE_URL fix)

## HTTP smoke (production, anonymous)

```text
GET /login          → 200
GET /trips          → 307 → /login?next=%2Ftrips
GET /?code=TEST     → 307 → /auth/callback?code=TEST
POST /api/copilotkit (empty {}) → 400 (endpoint up)
```

## Local gates (2026-05-25)

| Command | Result |
|---------|--------|
| `npm run floor` | PASS |
| `npm run check:mastra` | PASS |
| `npm run verify:supabase` | PASS |
| `npm test` | 156/156 |
| Playwright 011/012/016 (chromium) | 8/8 PASS |

## Manual still required

1. Google sign-in on `https://www.mdeai.co/login` — confirm no `?code=` stuck on `/`
2. Signed-in concierge message → `ai_runs.user_id` row
3. Set `ADK_GROUNDING_URL` on Vercel when ADK sidecar has a public HTTPS base (not localhost)
4. Preview URL QA if Deployment Protection enabled (401 without Vercel SSO login)

## AUTH-005 Playwright auth-guard e2e — 2026-06-03 (PR #56)

Branch `ai/san-367-auth-011-wallet-guard` (worktree `.worktrees/wt-auth-011`). Suite: `e2e/auth-guard.spec.ts` (10 tests, chromium). Floor CI does **not** run Playwright, so this is the non-redundant local proof.

**Result: 10/10 PASS (31.5s)** against a fresh server booted from the worktree on `:3007`.

Coverage vs the verify list:

| Behavior | Covered | How |
|----------|---------|-----|
| Login UI | ✅ | `/login` renders magic-link + Google + email field |
| Signup UI | ✅ | `/signup` renders magic-link + Google |
| Logout | ✅ | `POST /auth/signout` → 303 → `/` |
| Protected-route redirect | ✅ | `/trips` `/saved` `/host/event/new` `/me/tickets` → `/login?next=` |
| Guest ticket-view exemption | ✅ | `/me/tickets/[id]` stays public (exact-match guard) |
| Invalid-credential analogues | ✅ | callback w/o `code` → `error=auth_callback_missing_code`; `?error=access_denied` relays to `/login` |
| Session persistence / real OAuth | ⏳ | Inherent to passwordless — needs real inbox/Google consent → **manual prod smoke** (not automatable here) |

**Stale-server note (false-negative caught):** first run reused an existing `next dev` on `:3001` (the **main**-branch server, pre-fix) via `reuseExistingServer: true` → 2 failures (`/me/tickets` guard + `?error=` loop), which are exactly the two behaviors PR #56 introduces. Re-running against a fresh worktree server on `:3007` (`SMOKE_BASE_URL=http://localhost:3007 PW_SKIP_WEBSERVER=1`) → **10/10**. No flaky selectors; no spec change needed.

**PR #56 CI (SHA 91fc0f9):** floor ✅ · CodeRabbit ✅ · Vercel ✅ · `mergeable: MERGEABLE`, `mergeStateStatus: BLOCKED` (branch protection awaits 1 review). Diff = 3 files (middleware.ts, package.json, auth-guard.spec.ts), +87/−1.

## Verdict

| Gate | Status |
|------|--------|
| Supabase + Vercel auth wiring | **Mostly done** |
| AUTH-005 guard e2e (local) | **Green 10/10** (fresh server) |
| Production public marketing | **Hold** until ADK + live OAuth smoke |
