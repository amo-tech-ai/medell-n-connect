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

## Verdict

| Gate | Status |
|------|--------|
| Supabase + Vercel auth wiring | **Mostly done** |
| Production public marketing | **Hold** until ADK + live OAuth smoke |
