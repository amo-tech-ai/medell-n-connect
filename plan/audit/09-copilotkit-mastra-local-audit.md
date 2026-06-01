# CopilotKit + Mastra local forensic audit

**Date:** 2026-05-20  
**Scope:** `/home/sk/mdeai/mdeapp` — Pattern 1 (Next `/api/copilotkit` → `getLocalAgentsWithLogging({ mastra })`)  
**Verifier:** clean restart + curl + AG-UI probe + browser chat on `localhost:3000`

---

## Executive verdict

| Question | Answer |
|----------|--------|
| **Is local CopilotKit + Mastra working?** | **Yes** — after killing stale Mastra PIDs and restarting `npm run dev`. |
| **What was broken?** | (1) Stale Mastra on 4111/4112 while new instance bound 4113 → `refresh-events` ERR_CONNECTION_REFUSED / INCOMPLETE_CHUNKED_ENCODING. (2) Turbopack `.next` cache corruption after hot reload → transient `agent_run_failed` HTTP 500. (3) ESLint `rentalSchema` unused → `npm run floor` failed. (4) Studio SPA in-app nav to `/swagger-ui` → React Router 404 (server route is fine). (5) Workspace Files tab lists `/` → intentional 403. (6) `DATABASE_URL` missing → `search-attractions` returns SASL error; rentals fall back to mock. |
| **What was fixed?** | Clean dev restart; `rentalSchema` now used at runtime via `.parse()`; F13b workspace wired (skills visible). Processors kept at `PromptInjectionDetector` + `TokenLimiter` (heavy moderation reverted earlier). |
| **What still fails / is cosmetic?** | Studio in-app Swagger link; workspace root listing 403; PostHog telemetry timeout; prod deploy pending Vercel env sync. **Update 2026-05-20:** `DATABASE_URL` + `SUPABASE_ANON_KEY` synced — all four search tools return live Supabase rows. |

---

## Error table

| Error | Root cause | Fix | Status |
| ----- | ---------- | --- | ------ |
| `agent_run_failed` HTTP 500 | Stale Turbopack cache or crashed `[ui]` after `.next` delete while dev running | `pkill -f "next dev"`; `rm -rf .next`; `npm run dev:ui` | ✅ Fixed (verified POST 200 + browser chat) |
| `/swagger-ui` 404 in Studio UI | React Router has no SPA route; direct HTTP to Mastra API works | Open **new tab**: `http://localhost:4111/swagger-ui` or use `/api/openapi.json` | ⚠️ Expected — document only |
| `refresh-events` ERR_CONNECTION_REFUSED | Browser tab pinned to dead Mastra PID (4111/4112) after restart on different port | Kill stale `mastra dev`; restart `npm run dev:agent`; hard refresh Studio | ✅ Fixed after clean restart on 4111 |
| `ERR_INCOMPLETE_CHUNKED_ENCODING` on refresh-events | SSE stream cut when Mastra process died mid-stream | Same as above | ✅ Fixed after clean restart |
| Workspace `fs/list?path=/` 403 | Mastra `LocalFilesystem` denies listing workspace root (`Permission denied: access on /`); `skills/` subtree is allowed | Use Files tab under `skills/` or API `?path=skills`; not a product bug | ⚠️ Expected (read-only sandbox) |
| `search-attractions` SASL error | `DATABASE_URL` not in `mdeapp/.env.local` | Synced from repo root `.env.local`; `verify:supabase` probes `tourist_destinations` | ✅ Fixed 2026-05-20 |
| `npm run floor` fail | ESLint: `rentalSchema` only used as type | Export schema + `.parse()` on DB rows | ✅ Fixed |

---

## Agent / tool status

| Item | Status | Evidence |
| ---- | ------ | -------- |
| pingAgent | ✅ | `POST :4111/api/agents/ping-agent/generate` → "OK! The wiring is alive…" |
| conciergeAgent | ✅ | Browser: Laureles rental query → 3 listings + links; `probe-concierge-agui.mjs` → `RUN_FINISHED` |
| routerAgent | ✅ | `POST :4111/api/agents/router-agent/generate` → "OK" |
| search-rentals | ✅ | tool execute → 2 live rows (`source: supabase`, Laureles) |
| search-events | ✅ | tool execute → 2 live rows (e.g. Audiciones Altavoz 2026) |
| search-restaurants | ✅ | Mondongos Laureles + others from Supabase |
| search-attractions | ✅ | Museo de Antioquia + 1 more (`tourist_destinations`, 23 rows in DB) |

---

## Ports and scripts

| Script | Service | Port (this run) |
|--------|---------|-----------------|
| `npm run dev` | Next + Mastra concurrently | UI **3000**, Studio **4111** |
| `npm run dev:ui` | Next.js only | 3000 (or 3001 if 3000 taken) |
| `npm run dev:agent` | Mastra Studio | 4111 default; bumps to 4112/4113 if occupied |

**Rule:** Only one Mastra dev instance. Stale PIDs on 4111/4112 cause Studio console spam.

---

## Swagger / OpenAPI (verified on :4111)

| URL | HTTP |
|-----|------|
| `/swagger-ui` | 200 (Swagger HTML — **direct tab**) |
| `/swagger-ui/` | 404 |
| `/api/openapi.json` | 200 |
| `/openapi.json` | 404 |
| `/openapi` | 200 |

Studio **in-app** link to `/swagger-ui` → React Router 404. **Not** a missing server route.

---

## Environment variables (names only)

| Variable | Status |
|----------|--------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | present |
| `GOOGLE_API_KEY` | present |
| `NEXT_PUBLIC_SUPABASE_URL` | present |
| `SUPABASE_URL` | present |
| `SUPABASE_SERVICE_ROLE_KEY` | present |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | present (Next-prefixed; Studio auth may want `SUPABASE_ANON_KEY` alias) |
| `DATABASE_URL` | present (synced from repo root) |
| `SUPABASE_ANON_KEY` | present (synced from repo root) |

---

## Commands run

```bash
cd /home/sk/mdeai/mdeapp
pkill -f "next dev" || true; pkill -f "mastra dev" || true
npm run dev                    # UI :3000 + Studio :4111
npm run lint                   # exit 0
npm run test                   # 62/62 pass
npm run build                  # exit 0
npm run floor                  # exit 0 (after rentalSchema fix)
npx tsx --env-file=.env.local scripts/probe-concierge-agui.mjs  # RUN_FINISHED
curl :4111/swagger-ui          # 200
curl :4111/api/openapi.json    # 200
curl :4111/api/agents/*/generate  # ping, concierge, router OK
curl :4111/api/tools/*/execute    # rentals, restaurants OK; attractions SASL error
curl :3000/                    # 200
# Browser: concierge chat → 3 Laureles rentals
lsof -i :3000 -i :4111 -i :4112 -i :4113
```

---

## Files changed (this audit session)

| File | Reason |
|------|--------|
| `src/mastra/tools/search-rentals.ts` | Export `rentalSchema`; validate rows with `.parse()` — fixes ESLint / floor |
| `plan/audit/09-copilotkit-mastra-local-audit.md` | This report |
| `plan/mastra/01-studio.md` | Workspace 403 + F13b status corrections (if updated) |

---

## Remaining next steps

### Critical

1. ~~Add `DATABASE_URL`~~ ✅ Done — synced to `mdeapp/.env.local`; `npm run verify:supabase` PASS.
2. **Vercel production:** Add `DATABASE_URL`, `SUPABASE_ANON_KEY`, `GOOGLE_*`, `SUPABASE_SERVICE_ROLE_KEY` to project env (Preview + Production). Pooler URI required — same as local.

### Important

3. After any Mastra port change, close old Studio tabs or hard-refresh — stops `refresh-events` noise.
4. ~~Alias `SUPABASE_ANON_KEY`~~ ✅ Done in `mdeapp/.env.local`.
5. Deploy `/` concierge cutover to Vercel (preview first) — blocked on env sync + git push approval.

### Optional Studio polish

5. Document for team: Swagger only via new tab; Files tab starts at `skills/` not `/`.
6. MAP-001 map pins on `/` (F26/F32).

---

## Architecture preserved

- ✅ CopilotKit **1.55.2** — no downgrade
- ✅ Pattern 1 — single runtime at `/api/copilotkit`
- ✅ No LangGraph / second orchestrator
- ✅ Mastra Studio dev-only on 4111
- ✅ Gemini `gemini-3.5-flash` via `@ai-sdk/google`
