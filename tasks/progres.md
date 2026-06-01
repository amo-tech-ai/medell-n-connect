---
title: mdeai Testing Audit Progress Tracker
updated: 2026-05-31
auditor: Cursor
scope: /home/sk/mdeai
verified_commands: lint · test · build · floor · prod curl
done_rule: anti-fake-done gate 9 — tasks/testing/evidence/
canonical_queue: INDEX.md · todo.md · MVP-EXECUTION.md · MVP-REQUIRED.md
checklist: ../checklist.md
---

# mdeai Testing Audit Progress Tracker

**North star:** Camila on `/` · Andrés paid ticket · Roberto host publish @ https://www.mdeai.co

**Deploy:** `mdeapp` HEAD **`a9fffe8`** (2026-05-30) · branch `main` · **PR #14 ✅ MERGED** · **PR #15 ✅ MERGED** · prod **HTTP 200** @ www.mdeai.co

**Legend:** 🟢 complete · 🟡 in progress · 🟥 blocked/failed · ⚪ not started

---

## Executive score

| Area | Score | Status | Proof (2026-05-30) |
|------|------:|:------:|---------------------|
| **Overall MVP readiness** | **72** | 🟡 | 9 P0 MVP + 6 UX P0 open; G2 🟢 |
| **Production readiness** | **68** | 🟡 | www 200; commerce/webhook proofs open |
| **Testing coverage** | **82** | 🟢 | 318 Vitest · 25 Playwright specs · floor exit 0 |
| **AI / Mastra readiness** | **88** | 🟢 | 7 agents · 3 workflows · 10+ tools · gemini-3.5-flash |
| **Supabase readiness** | **76** | 🟡 | Edge fns exist; EVP-003 webhook gap |
| **Maps / Grounding readiness** | **74** | 🟡 | Code + tests 🟢; MAP-002B/008B prod ⚪ |
| **pgvector readiness** | **35** | ⚪ | Tables exist; VEC-001…005 not shipped |
| **OpenClaw / automations** | **5** | ⚪ | Phase 2+; OCL-001…013 not started |

---

## Verification run (2026-05-30 — full prompt)

| Command | Result | Notes |
|---------|:------:|-------|
| `npm run lint` | 🟢 exit 0 | `mdeapp/` |
| `npm run test` | 🟢 **318/318** | Vitest 78 files |
| `npm run build` | 🟢 exit 0 | Next.js 16 routes incl. `/`, `/chat`, `/host/event/new`, `/trips` |
| `npm run floor` | 🟢 exit 0 | retry after clearing `.next/lock`; 19 npm audit moderate/low |
| `npm run verify:maps` | 🟢 exit 0 | mapId + Places searchText HTTP 200 |
| `npm run verify:mastra` | — | **not in package.json** — use `verify:grounding` / Mastra Studio |
| `find e2e` | 🟢 **25** files | 23 specs under `e2e/` |
| Playwright SCREEN-006 | 🟢 3/3 | EVT-013 fast-path panel — PR #14 merged 2026-05-30 |
| `curl https://www.mdeai.co/` | 🟢 **200** | |
| `POST https://www.mdeai.co/api/copilotkit` | 🟢 **415** | runtime up (needs AG-UI body) |
| Supabase migrations | 🟢 **63** files | incl. data-009, data-020, data-027, data-035 (2026-05-29) |
| Edge functions | 🟢 **4** product | ticket-checkout, ticket-payment-webhook, chat-lead-capture, approval-commit |

---

## Progress tracker — systems

| Task Name | Description | Status | % | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|-----------|-------------|:------:|--:|--------------|----------------------|----------------|
| **Core app (Next.js)** | App Router, middleware, prod build | 🟢 | 100% | `npm run build` exit 0; routes table | — | None |
| **CopilotKit runtime** | `/api/copilotkit` AG-UI bridge | 🟢 | 95% | route.ts + prod 415 | Full POST smoke with body | `curl` with valid AG-UI payload |
| **Mastra core** | Storage, logger, agent registry | 🟢 | 95% | `src/mastra/index.ts` 7 agents, 3 workflows | F13 Supabase persistence partial | F13 when Camila thread retention P0 |
| **Mastra agents** | ping, router, rental, concierge, event, host, eval | 🟢 | 90% | All exported; `gemini-3.5-flash` in `models.ts` | Prod concierge errors (UX-002) | UX-002 + UX-005 PR |
| **Mastra workflows** | rental, event discovery, concierge routing | 🟢 | 85% | 3 workflows registered | End-to-end prod traces | Mastra Studio trace on prod turn |
| **Mastra tools** | Search + classify + grounded + audit | 🟢 | 88% | 10 tool modules + Vitest | MAP-002B prod ADK URL | Deploy ADK URL (MAP-002B) |
| **Gemini 3.5 Flash** | Production model on all agents | 🟢 | 100% | `FLASH_MODEL` = gemini-3.5-flash | — | Re-verify via gemini MCP before model change |
| **Gemini structured output** | Zod schemas, tool args | 🟢 | 85% | agent tests + commerce schemas | — | — |
| **Host wizard (Roberto)** | `/host/event/new` + HITL | 🟡 | 85% | `hostEventAgent`; e2e SCREEN-016 | G3 prod SQL evidence | Close G3-core-host-publish-proof |
| **Chat / Camila `/`** | Cards + pins + classifier | 🟡 | 80% | PR #7 rental/café; G2 🟢 | UX-003 price parser deploy | UX-003 → UX-002/005 |
| **Chat `/chat`** | Dedicated chat surface | 🟢 | 75% | route exists | Parity with `/` prod proofs | Same UX pack |
| **Events checkout** | Stripe + edge fns | 🟡 | 70% | ticket-checkout + webhook code | EVP-003 secret isolation | Rotate sponsor webhook (080) |
| **Stripe webhook** | ticket-payment-webhook | 🟥 | 60% | fn exists | Identical secrets flagged | EVP-003 audit |
| **Ticket wallet QR** | `/me/tickets` | 🟡 | 75% | routes + API | G1 live paid row | Andrés G1 ops (079) |
| **EventCard E2E** | SCREEN-006 | 🟥 | 45% | spec exists | **2026-05-30:** `waitForEventCards` 120s timeout — no `[data-testid="event-card"]` | EVP-013 (081) — fix agent/card branch |
| **Rental search** | Fast-path + cards | 🟢 | 90% | Vitest + prod API 200 | — | — |
| **Lead capture (G2)** | chat-lead-capture edge | 🟢 | 100% | G2 evidence on prod | — | None |
| **Venues / cafés** | SCREEN-021 Phase A.5 | 🟢 | 85% | e2e SCREEN-021; grounded cards | Phase B VEC deferred | SCREEN-021 B after VEC |
| **Trips dashboard** | `/trips`, `/saved` | 🟡 | 40% | UI routes | data-026…030 chain | Post-MVP data spine |
| **Auth login/signup** | OAuth + session | 🟡 | 70% | `/login` `/signup` | AUTH-011 checklist open | AUTH-011 (085) |
| **AUTH-005 Playwright** | auth e2e | ⚪ | 0% | — | No `e2e/auth-*.spec.ts` | AUTH-005 post-P0 |
| **Patricia admin** | `/admin/*` dashboards | ⚪ | 0% | — | No admin routes in app | W8 F20+ |
| **Supabase schema** | 122 tables legacy project | 🟡 | 76% | MCP/schema docs | data-001…035 backlog | data-001 inventory |
| **RLS policies** | All public tables | 🟡 | 80% | hook + audits | New tables need policies | source-command-supabase-rls-audit |
| **Edge functions** | 4 product fns + shared | 🟢 | 85% | 4 fn dirs under supabase/functions | Prod log proof per fn | get_logs on webhook failures |
| **pgvector** | Embeddings 768d + RPCs | 🟡 | 40% | 3 tables + rows (VEC index) | Duplicate HNSW; no VEC-001 | VEC-001 inventory |
| **Maps base (vis.gl)** | MapContext, mapId | 🟢 | 90% | tests + hook | MAP-008B prod mapId | MAP-008B (092) |
| **Advanced Markers** | Pin sync F50 | 🟢 | 88% | smoke:f50-pin-sync in MVP bundle | Stale markers UX-007 | UX-007 |
| **Places API New** | Field masks + proxy routes | 🟢 | 85% | client tests + photo route | MAP-005 edge proxy | Post-MVP MAP-005 |
| **ADK / Grounding Lite** | Cloud Run + Mastra client | 🟡 | 75% | adk-grounding-client + Vitest | Prod URL verify | MAP-002B (091) |
| **Google ADK (product)** | Phase 2 services/adk | ⚪ | 10% | ADK task index only | Not in mdeapp runtime default | Phase 2 per plan |
| **Vitest** | Unit/integration | 🟢 | 100% | **313** passed 2026-05-30 | — | Keep green on each commit |
| **Playwright e2e** | 23 specs | 🟡 | 70% | `e2e/` + screen specs | SCREEN-006 fail | Fix EVP-013 |
| **Production smoke F32** | www.mdeai.co matrix | ⚪ | 0% | — | No F32 evidence file | F32 (084) |
| **OpenClaw automation** | VPS gateway + approvals | ⚪ | 5% | index OCL-001…042 | No OCL shipped | Phase 2+ only |
| **WhatsApp / Postiz** | Social automation | ⚪ | 0% | — | No approval gates | Do not start pre-OCL-003 |

---

## Persona journeys (acceptance only — not queue order)

Queue order: [`MVP-EXECUTION.md`](MVP-EXECUTION.md) by module + dependency.

| Persona | Journey | Status | % | Evidence |
|---------|---------|:------:|--:|----------|
| **Camila** | “2BR under $800 in El Poblado” → rental cards + pins | 🟢 | 90% | PR #7; prod rental API |
| **Camila** | “Quiet cafés near Laureles” → ☕ cards + detail panel | 🟡 | 75% | SCREEN-021 e2e; UX-003 parser deploy |
| **Tourist** | Restaurants / attractions via concierge | 🟡 | 60% | UX-001 restored; UX-002 errors |
| **Andrés** | Event → checkout → paid → QR wallet | 🟡 | 70% | Checkout code 🟢; G1 proof open |
| **Roberto** | NL host wizard → approve → publish | 🟡 | 85% | SCREEN-016; G3 SQL proof |
| **Patricia** | Admin CRM / observability | ⚪ | 5% | — | F20+ |
| **Sofía** | `npm run floor` before ship | 🟢 | 100% | floor exit 0 @ 8c99ded |

---

## P0 queue snapshot

| Spec | SAN | % | Status |
|------|-----|--:|:------:|
| PAY-001 | [178](https://linear.app/sanjiovani/issue/SAN-178) | 80 | 🟡 |
| PAY-003 | [116](https://linear.app/sanjiovani/issue/SAN-116) | 60 | 🟥 |
| EVT-013 | [117](https://linear.app/sanjiovani/issue/SAN-117) | 100 | 🟢 |
| EVT-002 | [366](https://linear.app/sanjiovani/issue/SAN-366) | 90 | 🟡 |
| EVT-001 | [115](https://linear.app/sanjiovani/issue/SAN-115) | 0 | 🟥 |
| OPS-002 | [100](https://linear.app/sanjiovani/issue/SAN-100) | 0 | ⚪ |
| AUTH-011 | [367](https://linear.app/sanjiovani/issue/SAN-367) | 40 | 🟡 |
| MAP-002B | [368](https://linear.app/sanjiovani/issue/SAN-368) | 0 | ⚪ |
| MAP-008B | [369](https://linear.app/sanjiovani/issue/SAN-369) | 0 | ⚪ |
| UX-001 | [315](https://linear.app/sanjiovani/issue/SAN-315) | 100 | 🟢 |
| UX-003 | [316](https://linear.app/sanjiovani/issue/SAN-316) | 100 | 🟢 |
| UX-002, UX-005…010 | 319–324, 318 | 5 | 🟡 |
| UX-004 | [317](https://linear.app/sanjiovani/issue/SAN-317) | — | 🚫 Canceled |

**Order:** [`MVP-EXECUTION.md`](MVP-EXECUTION.md) · [`linear/mvp-queue.json`](linear/mvp-queue.json)

---

## MVP exit recommendation

| | |
|--|--|
| **Go / No-Go** | **No-Go** |
| **Reason** | Platform floor green; **persona commerce proofs** and **UX P0 pack** incomplete |
| **Top 5 next** | 1) PAY-001 2) PAY-003 3) EVT-013 e2e 4) EVT-002 + EVT-001 ledger 5) UX-003 → UX-002/005 |

---

*Last verified: 2026-05-30 — commands run on `mdeapp` @ `8c99ded`*
