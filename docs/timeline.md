	I have the canonical MVP exit definition and the full 150-issue Linear board. Two of the doc paths 404'd (they're likely under `plan/` or were moved) — let me locate them and confirm git state, then I'll synthesize the full assessment.
	
	I now have the complete forensic picture: the canonical MVP exit definition, the live 150-issue Linear board, confirmed PR #14 is **OPEN** (13 commits ahead of main, 0 behind), git HEAD `8c99ded`, and the planning docs located under `docs/`. Here's the full assessment.
	
	# mdeai — Phase 1 Build Timeline & Forensic Assessment
	
	_Auditor's note on dates: today is 2026‑05‑30 (Sat). All future dates below are **estimates** anchored to a Mon 2026‑06‑01 start, business‑days only. Nothing is marked complete without command/evidence proof — I reconciled three "% done" sources and used the lowest verified number._
	
	---
	
	## 1. Executive summary
	
	**Verdict: No‑Go for MVP today. Forensic readiness = 72/100.** The _platform_ is genuinely strong and green; the _proof of commerce + production sign‑off + chat UX_ is not. This is a **finishing problem, not a building problem** — the hard architecture (CopilotKit runtime, Mastra agents, Maps, Supabase RLS, 313 passing tests) is done and deployed at `www.mdeai.co`.
	
	Three things define the gap, and a fourth is a process problem you should fix first:
	
	1. **Commerce is unproven on prod** — no live Stripe paid ticket (G1), webhook secrets were identical (EVP‑003), and the event‑card e2e is **red** (EVP‑013 / SCREEN‑006 Playwright timeout). The one thing that turns "code exists" into "Andrés bought a ticket" hasn't happened.
	2. **Production isn't signed off** — Map ID, `ADK_GROUNDING_URL`, and the Vercel auth/env checklist are unverified; there's no F32 smoke‑evidence file.
	3. **Chat UX scored 48/100** in QA — invisible errors on timeout, no loading indicator, a "$500 a night" parser bug.
	4. **Process drag (fix first): PR #14 is OPEN** (13 commits of café work, not on main), and **your Linear board is inverted** — it meticulously tracks ~58 _post‑MVP_ issues (Trips, Venues, OpenClaw, Grounding) while the **9 actual MVP exit‑blockers are barely tracked at all.**
	
	**Estimated time to MVP launch: ~2.5 focused weeks → ~2026‑06‑17 (estimate).** The riskiest item on the path is EVP‑013 (event cards), because it's failing _today_.
	
	---
	
	## 2. Recommended Linear project structure
	
	Your board today: **1 project (MDEAPP)** with **9 ad‑hoc milestones** that mix priority and area ("P0 — MVP gates", "P1 — Screens & café", "P1.5 — Trips MVP", "Deferred — OpenClaw"…). 150 issues, distributed **73 Todo · 34 Done · 28 Backlog · 12 In Review · 3 In Progress**.
	
	**Two structural problems:**
	
	- The 9 milestones aren't phases — you can't read "are we ready to launch?" off them.
	- The real critical path (G1, EVP‑003, EVP‑013, G3, EVP‑001, F32, AUTH‑011, MAP‑002B, MAP‑008B) **mostly isn't on the board as issues.** Meanwhile Trips/Venues/OpenClaw are fully enumerated. The board optimizes the wrong horizon.
	
	**Recommended (low‑churn) structure:**
	
	```
	Initiative:  mdeai — Launch Medellín (Phase 1)
	  └─ Project: MDEAPP            ← keep the one project
	       ├─ Milestones (4)        ← REPLACE the 9 with the 4 phases (see §3)
	       │     Setup The Core · Make Everything Stable · Launch The App · Grow & Improve
	       └─ Labels (7 area groups)← for filtering across the timeline
	             Core Platform Foundation · MVP Launch · Maps & Discovery ·
	             Event Ticketing · AI Search Experience · Rentals & Trips · OpenClaw & Automations
	```
	
	Why this shape: in Linear, **milestones render as a single project timeline** (Gantt‑able) → map them to the 4 phases so the board _reads as a launch tracker_. **Labels are cross‑cutting** → use them for the 7 area groups so you can still slice "show me all Event Ticketing work." When the team grows past ~2 builders, promote the 7 labels to 7 **Projects** under the same Initiative.
	
	**Three cleanups to do alongside the remap:**
	
	- **Create the 9 missing P0 issues** (G1, EVP‑003, EVP‑013, G3, EVP‑001, F32, AUTH‑011, MAP‑002B, MAP‑008B) under **Launch The App** — today they live only in `MVP-REQUIRED.md`, invisible to the board.
	- **Reconcile the SCREEN‑006 mismatch:** SAN‑236 "SCREEN‑006 — Event Card" is marked **Done**, but the event‑card e2e (EVP‑013) is **red**. "Component done" ≠ "renders in chat, e2e‑green." Split or reopen.
	- **Drain the "In Review" column (12 screens):** checkout, tickets+QR, itinerary, trips, a11y are all stuck in review — that's a lot of MVP surface in limbo. Merge or kick back.
	
	---
	
	## 3. Recommended milestones (the 4 phases)
	
	|Phase|Goal in one line|Exit criterion|Holds (examples)|Target (est.)|
	|---|---|---|---|---|
	|**1 · Setup The Core**|The platform exists and boots clean|Floor green (313 tests), prod 200, RLS on every table|F01–F50, Maps MVP, Auth batch, Mastra gates, café SCREEN‑021 — **mostly 🟢 done**|✅ complete|
	|**2 · Make Everything Stable**|It doesn't lie or break silently|PR #14 merged · errors visible · prod env verified · secrets isolated|Land PR #14 · UX‑002/003/005 · EVP‑003 · F32 · AUTH‑011 · MAP‑002B/008B · clear 12 "In Review"|**~Jun 8**|
	|**3 · Launch The App**|Three personas succeed _with evidence_|G1 paid + G2 lead + G3 publish + EVP‑001 ledger + prod smoke|G1 · EVP‑013 · G3 · EVP‑001 · UX‑006/007/008/009|**~Jun 17**|
	|**4 · Grow & Improve**|Expand surface area safely|Post‑MVP packs behind the launch gate|Trips MVP · Venues MVP · UX‑010 cards · Vector · OpenClaw · Admin|Jun 18 → ongoing|
	
	---
	
	## 4. Critical path
	
	The longest dependency chain to launch — every item here is `crit`:
	
	```
	Prod env/secrets verified (MAP-008B, MAP-002B, AUTH-011)
	        │
	        ▼
	EVP-003  webhook secret isolation  ──►  G1  live paid ticket + QR ──┐
	                                                                    │
	EVP-013  event cards e2e (RED today) ──►  G3  host publish proof ───┤
	                                                                    ▼
	                                              EVP-001  prod proof ledger (G1+G2+G3)
	                                                                    │
	                                                                    ▼
	                                              F32  prod smoke matrix
	                                                                    │
	                                                                    ▼
	                                              🏁 MVP launch review (milestone)
	```
	
	**The pacing item is EVP‑013 (event cards in chat).** It's the only critical‑path task that is _failing right now_ (Playwright times out waiting for `[data-testid="event-card"]`). Everything else on the path is "do the work"; this one is "diagnose first." Start it in parallel on day 1, not after G1.
	
	**Second‑order critical:** G1 can't be faked — it needs a _real_ card charge on prod → `event_orders.status=paid` → wallet QR. Budget a human‑in‑the‑loop session for it; it's evidence, not code.
	
	---
	
	## 5. Blockers & risks
	
	|#|Blocker / risk|Severity|Where|Mitigation|
	|--:|---|:-:|---|---|
	|1|**EVP‑013 event‑card e2e red**|🟥 Critical|`SCREEN-006-event-card.spec.ts` 120s timeout|Diagnose agent/card branch first; don't trust a stale `:3001` (LESSONS §8 — restart before calling it broken)|
	|2|**No live Stripe paid proof (G1)**|🟥 Critical|prod checkout → `/me/tickets`|Manual HITL payment, capture row + QR evidence file|
	|3|**Webhook secrets identical (EVP‑003)**|🟥 Critical|`.env.local` ticket vs sponsor|Rotate sponsor secret, re‑audit env var **names** only|
	|4|**PR #14 OPEN, 13 commits off main**|🟡 High|café branch `feat/c012-cafe-places-detail`|Land it first — 3 known blockers: B1 attribution‑by‑index, B2 broken `test-prod-gate.mjs`, B3 unproven preview smoke (Vercel SSO 401)|
	|5|**Prod env unverified** (Map ID, ADK URL, auth)|🟡 High|Vercel|MAP‑008B + MAP‑002B + AUTH‑011 — one sign‑off pass|
	|6|**Chat UX 48/100**|🟡 High|prod concierge|UX‑002 (error bubble) + UX‑005 (thinking) same PR; UX‑003 parser|
	|7|**Board doesn't track critical path**|🟡 Process|Linear|Create the 9 P0 issues (§2)|
	|8|**12 screens stuck "In Review"**|🟡 Medium|Linear|Drain the column — hidden WIP|
	|9|**"98%" vs "72%" readiness conflict**|🟡 Trust|`MVP-REQUIRED.md` says 98, `may30.md` says 72|Use 72 (forensic, with proof); 98 is planning optimism|
	|10|**ai_runs cold‑start insert drops**|🟢 Low|500ms deadline|Known (task #23); post‑MVP hardening|
	
	---
	
	## 6. Best implementation order
	
	```
	PHASE 2 — Make Everything Stable  (do these ~in parallel, 2 builders)
	  1. Land PR #14   (B1→B2→B3 fixes, then merge to main)          ← unblocks café + clean base
	  2. EVP-003       rotate sponsor webhook secret + re-audit
	  3. UX-003        "$500 a night" price parser (standalone, safe)
	  4. UX-002 + UX-005   error bubble + thinking indicator (one PR)
	  5. MAP-008B + MAP-002B + AUTH-011   prod env sign-off (one pass)
	  6. F32           prod smoke baseline (evidence file)
	  7. Drain 12 "In Review" screens
	
	PHASE 3 — Launch The App  (strict order on the commerce chain)
	  8. EVP-013       event cards e2e green   ← START DAY 1 (it's red)
	  9. G1            live paid ticket + QR
	  10. G3            host publish → Supabase row
	 11. EVP-001       consolidated proof ledger (needs 8+9)
	 12. UX-006/007/008/009   reset + stale markers + tooltip + monitor
	 13. 🏁 Prod smoke matrix → MVP launch review
	
	PHASE 4 — Grow & Improve  (only after the launch gate)
	 14. UX-010 unified cards (M0→M5, SAN-360..365) — after PR #14
	 15. Trips MVP (SAN-273..291)  ‖  Venues MVP (SAN-292..314)
	 16. Vector cleanup (VEC-001..005) → OpenClaw ingest (OCL-042) → Admin
	```
	
	**Sequencing rules that bite (from LESSONS.md):** one concern per PR — never mix the platform fix with a feature; UX‑003 must touch _only_ `rental-query-parser.ts`; restart `:3001` before trusting any red e2e; skip the ADK web tool when ≥3 SQL rows exist (don't add a 2nd Gemini round‑trip to the hot path).
	
	---
	
	## 7. What to do now vs later
	
	|**NOW (this & next sprint — blocks launch)**|**LATER (after the launch gate)**|
	|---|---|
	|Land PR #14 (B1/B2/B3)|UX‑010 unified result cards (M0→M5)|
	|EVP‑013 event cards green|Trips MVP (19 issues)|
	|G1 live paid + G3 publish + EVP‑001 ledger|Venues MVP + WhatsApp (23 issues)|
	|EVP‑003 secret isolation|pgvector cleanup + eval (VEC‑001..005)|
	|Prod sign‑off: Map ID, ADK URL, auth, F32|OpenClaw ingest + automations (11 issues)|
	|UX‑002/003/005/006/007/008/009|Grounding search depth (GS‑005..009)|
	|Create the 9 P0 Linear issues; drain "In Review"|Patricia `/admin` dashboards (W8+)|
	
	**Hard "do not start" list** (correctly deferred in your docs): OpenClaw without OCL‑003 approval gates + OCL‑005 kill switch · WhatsApp auto‑send without human handoff · sponsor marketplace before EVP‑003 · vector rerank before VEC‑001 inventory · `/admin/*` until W8.
	
	---
	
	## 8. Mermaid Gantt chart
	
	```mermaid
	gantt
	    title mdeai Phase 1 MVP Build Timeline (forensic 2026-05-30; future dates = estimates)
	    dateFormat YYYY-MM-DD
	    excludes weekends
	
	    section Core Platform Foundation
	    Repo env secrets F01-06        :done,           cf1, 2026-04-06, 5d
	    Supabase auth RLS F13          :done,           cf2, after cf1, 6d
	    CopilotKit Mastra runtime      :done,           cf3, after cf2, 6d
	    Floor green 313 Vitest         :done,           cf4, after cf3, 3d
	    Land PR 14 to main             :crit, active,   cf5, 2026-06-01, 3d
	    Prod env Map ID ADK auth       :crit,           cf6, after cf5, 3d
	    Prod smoke baseline F32        :crit,           cf7, after cf6, 2d
	
	    section AI Search Experience
	    Concierge restore UX-001       :done,           ai1, 2026-05-26, 2d
	    Mastra agents tools 7          :done,           ai2, after cf3, 4d
	    Price parser UX-003            :active,         ai3, 2026-06-01, 2d
	    Error plus loading UX-002-005  :crit,           ai4, after ai3, 3d
	    Reset markers tooltip UX-006-8 :                ai5, after ai4, 3d
	    Synthetic monitor UX-009       :                ai6, after cf7, 2d
	
	    section Maps and Discovery
	    Maps MVP Places masks          :done,           mp1, after cf3, 6d
	    Cafe discovery SCREEN-021      :done,           mp2, after mp1, 4d
	    Map ID on prod MAP-008B        :crit,           mp3, after cf5, 1d
	    ADK grounding URL MAP-002B     :crit,           mp4, after cf5, 2d
	
	    section Event Ticketing
	    Checkout webhooks code         :done,           ev1, after cf3, 6d
	    Event cards e2e EVP-013        :crit, active,   ev2, 2026-06-01, 4d
	    Webhook secret iso EVP-003     :crit,           ev3, after cf5, 2d
	    Live paid ticket QR G1         :crit,           ev4, after ev3, 3d
	    Host publish proof G3          :crit,           ev5, after ev2, 2d
	    Prod proof ledger EVP-001      :crit,           ev6, after ev4 ev5, 2d
	
	    section Rentals and Trips
	    Rental search lead G2          :done,           rt1, after cf3, 5d
	    Auth checklist AUTH-011        :                rt2, after cf5, 2d
	    Trips MVP TRIP-001-019         :                rt3, after ml2, 15d
	    Venues MVP VEN-009-031         :                rt4, after ml2, 15d
	
	    section MVP Launch
	    Stable checkpoint              :milestone,      ml1, after cf6 ai4 ev3, 0d
	    Prod smoke matrix all gates    :crit,           ml0, after ev6 cf7 mp3 mp4, 2d
	    MVP launch review              :milestone, crit, ml2, after ml0, 0d
	
	    section OpenClaw and Automations
	    Unified result cards UX-010    :                oc1, after ml2, 6d
	    Vector cleanup VEC-001-005     :                oc2, after ml2, 5d
	    OpenClaw ingest OCL-042        :                oc3, after oc2, 8d
	    Admin dashboards Patricia      :                oc4, after oc3, 8d
	```
	
	_Reading it: `done` = verified complete · `active` = in flight now · `crit` = on the critical path · `milestone` = launch checkpoint. The critical chain is `cf5 → ev3 → ev4 → ev6 → ml0 → ml2`, with `ev2` (event cards, red today) the parallel risk feeding `ev5 → ev6`. MVP launch lands ~Jun 17 (estimate)._
	
	---
	
	## 9. Suggested Linear issue groups (the 7 → real SAN issues)
	
	|Group (label)|Phase weight|Representative live issues|State today|
	|---|---|---|---|
	|**Core Platform Foundation**|Setup ✅ / Stable|F01–F50 (archived 🟢), **+ create F32, AUTH‑011, DATA‑010/011 (SAN‑339/340)**|mostly Done; prod sign‑off open|
	|**MVP Launch**|Launch|UX‑001 SAN‑315 🟢 · UX‑003 SAN‑316 · UX‑002 SAN‑320 · UX‑005 SAN‑319 · **+ create G1, EVP‑003, EVP‑013, G3, EVP‑001**|UX = Todo; **5 gates untracked**|
	|**Maps & Discovery**|Setup ✅ / Stable|Maps MVP 🟢 · SCREEN‑021 🟢 · WIRE‑008 SAN‑247 · DATA‑034 SAN‑329 · DATA‑033 SAN‑359 · **+ MAP‑002B/008B**|code done; prod env open|
	|**Event Ticketing**|Launch|SCREEN‑014 SAN‑237 🟢 · checkout SAN‑248 (In Review) · tickets+QR SAN‑259/260 (In Review) · Events polish SAN‑341‑346|**SCREEN‑006 SAN‑236 "Done" but e2e red**|
	|**AI Search Experience**|Setup ✅ / Grow|Mastra agents 🟢 · UX‑009 SAN‑322 · UX‑010 SAN‑318 + M0–M5 SAN‑360‑365|runtime done; cards = Grow|
	|**Rentals & Trips**|Setup ✅ / Grow|G2 🟢 · DATA‑019‑024 (SAN‑327/347‑351) · **Trips MVP SAN‑273‑291 (19, all Todo)**|G2 proven; Trips = post‑MVP|
	|**OpenClaw & Automations**|Grow|OCL SAN‑216‑226 (11) · Venues WhatsApp SAN‑308‑312 · Grounding SAN‑227‑231 · Vector SAN‑352|all Todo/Deferred — correct|
	
	**The headline:** four of seven groups are mostly built; the launch‑blocking work concentrates in **MVP Launch** and **Event Ticketing** — and those two are precisely where the board is thinnest. Fix that first.
	
	---
	
	## 10. Final production readiness score
	
	|#|Key area|Score|Dot|Forensic note|
	|--:|---|--:|:-:|---|
	|1|Core Platform Foundation|95|🟢|313 Vitest, lint/build/floor exit 0, prod 200|
	|2|Supabase DB / auth / security|82|🟢|RLS tight; EVP‑003 secret isolation + DATA‑010/011 hardening open|
	|3|Environment variables & secrets|70|🟡|Identical webhook secrets was a _real_ finding; prod env unverified|
	|4|Vercel deployment|78|🟡|Prod up, but Map ID / ADK URL / auth env unproven; no F32 evidence|
	|5|GitHub / CI / testing|85|🟢|Floor green; **but PR #14 open (13 commits), SCREEN‑006 e2e red, B2 broken gate**|
	|6|Mastra + CopilotKit AI|88|🟢|POST‑storm fixed; RUN_ERROR still invisible to users|
	|7|Gemini integration|88|🟢|`gemini-3.5-flash` pinned; re‑verify names via MCP|
	|8|Google Maps / Places / grounding|74|🟡|Masks + mapId enforced in code; prod Map ID + ADK URL not set|
	|9|Stripe checkout / webhooks / ticketing|68|🟡|Code exists; **no live paid proof, secret isolation, event‑card e2e red**|
	|10|Rentals & trips|70|🟡|G2 done & proven; Trips fully Todo (post‑MVP)|
	|11|Events & host flow|72|🟡|Wizard + SCREEN‑016 done; G3 publish proof + event cards open|
	|12|OpenClaw / automations|8|⚪|Specs only — correctly deferred|
	|13|Production launch readiness|60|🟡|**No‑Go:** 9 P0 open, no smoke evidence file|
	
	### **Overall MVP readiness: 72 / 100 — 🟥 No‑Go**
	
> 	Platform floor is genuinely green and the AI/Maps/Gemini layers are strong (85–95). The score is held down by **unproven commerce, unsigned prod, and chat UX** — all _finishing_ work, ~2.5 weeks. The path is unusually clear because the hard part is already built. _(I'm using 72, not the 98 in `MVP-REQUIRED.md`: 72 is the May‑30 forensic number backed by command proof; 98 was planning optimism. You asked for no fake completion claims.)_
	
	---
	
	### Two things I can do next on your word
	
	17. **Apply the Linear restructure** — create the 4 phase‑milestones, add the 7 area labels, create the 9 missing P0 exit‑blocker issues, and move Trips/Venues/OpenClaw to _Grow & Improve_. _(This is a batch of board mutations — I'll only run it with your explicit go‑ahead, and I'd show you the exact create/update list first.)_
	18. **Start the build** at the top of the order — **UX‑003 / SAN‑316** is the clean first move (standalone, touches only `rental-query-parser.ts`, no PR #14 dependency), or **land PR #14** if you'd rather clear the base first.
	
	Still outstanding from earlier, whenever you want it: the SAN‑318 comment + SAN‑361 description carry a wrong "PR #14 merged" claim — it's **OPEN** — which I can correct in the same Linear pass.
	
	Want me to proceed with the Linear restructure, or start on a build task?
	
	I pulled this fresh this session — canonical exit definition (`tasks/MVP-REQUIRED.md`), the live 150‑issue Linear board, PR #14 confirmed **OPEN** (13 commits ahead of `main`, 0 behind), git HEAD `8c99ded`, 313 Vitest green, prod 200. Nothing has changed since, so here is the clean, complete assessment.
	
	---
	
	# mdeai — Phase 1 Build Timeline & Forensic Assessment
	
	_Dates: today is 2026‑05‑30 (Sat). Future dates are **estimates** anchored to a Mon 2026‑06‑01 start, business days only (`excludes weekends`). No item is marked complete without command/evidence proof._
	
	---
	
	## 1. Executive summary
	
	**Verdict: No‑Go for MVP today. Forensic readiness = 72/100.** The _platform_ is strong and green; the _proof of commerce + production sign‑off + chat UX_ is not. This is a **finishing problem, not a building problem** — the hard architecture (CopilotKit 1.55.2 runtime, 7 Mastra agents, Maps/Places, Supabase RLS, 313 passing tests) is built and live at `www.mdeai.co`.
	
	Four findings define the gap (the fourth is process, fix it first):
	
	19. **Commerce is unproven on prod** — no live Stripe paid ticket (G1), webhook secrets were identical (EVP‑003), and the event‑card e2e is **red** (EVP‑013 / SCREEN‑006 Playwright timeout on `[data-testid="event-card"]`).
	20. **Production isn't signed off** — Map ID, `ADK_GROUNDING_URL`, and the Vercel auth/env checklist are unverified; no F32 smoke‑evidence file exists.
	21. **Chat UX scored 48/100** in QA — invisible errors on timeout, no loading indicator, a "$500 a night" parser bug.
	22. **Process drag:** **PR #14 is OPEN** (13 commits of café work, not on `main`), and the **Linear board is inverted** — it tracks ~58 _post‑MVP_ issues in detail (Trips, Venues, OpenClaw, Grounding) while the **9 actual MVP exit‑blockers are barely on the board.**
	
	**Time to MVP launch: ~2.5 focused weeks → ~2026‑06‑17 (estimate).** Riskiest path item is **EVP‑013 (event cards)** — it's failing _today_, so it's a "diagnose first," not a "do the work."
	
	---
	
	## 2. Recommended Linear project structure
	
	**Today:** 1 project (MDEAPP), **9 ad‑hoc milestones** mixing priority + area ("P0 — MVP gates", "P1 — Screens & café", "P1.5 — Trips MVP", "Deferred — OpenClaw"…), 150 issues split **73 Todo · 34 Done · 28 Backlog · 12 In Review · 3 In Progress**.
	
	**Two problems:** the milestones aren't phases (you can't read "ready to launch?" off them), and the real critical path mostly isn't on the board as issues.
	
	**Recommended (low‑churn) shape:**
	
	```
	Initiative:  mdeai — Launch Medellín (Phase 1)
	  └─ Project: MDEAPP                ← keep the single project
	       ├─ Milestones (4 = phases)   ← REPLACE the 9 ad-hoc ones
	       │     Setup The Core · Make Everything Stable · Launch The App · Grow & Improve
	       └─ Labels (7 = area groups)  ← cross-cutting filters
	             Core Platform Foundation · MVP Launch · Maps & Discovery ·
	             Event Ticketing · AI Search Experience · Rentals & Trips · OpenClaw & Automations
	```
	
	Milestones render as a single project timeline (Gantt‑able) → map them to the 4 phases so the board reads as a launch tracker. Labels are cross‑cutting → use them for the 7 area groups. Promote labels → Projects under the Initiative when the team grows past ~2 builders.
	
	**Three cleanups to run with the remap:**
	
	- **Create the 9 missing P0 issues** (G1, EVP‑003, EVP‑013, G3, EVP‑001, F32, AUTH‑011, MAP‑002B, MAP‑008B) under **Launch The App** — today they live only in `MVP-REQUIRED.md`, invisible to the board.
	- **Reconcile SCREEN‑006:** SAN‑236 is marked **Done**, but the event‑card e2e (EVP‑013) is **red**. "Component done" ≠ "renders in chat, e2e‑green." Split or reopen.
	- **Drain the 12 "In Review" screens** (checkout, tickets+QR, itinerary, trips, a11y) — hidden MVP WIP.
	
	---
	
	## 3. Recommended milestones (the 4 phases)
	
	|Phase|Goal|Exit criterion|Holds (examples)|Target (est.)|
	|---|---|---|---|---|
	|**1 · Setup The Core**|Platform exists & boots clean|Floor green (313), prod 200, RLS on every table|F01–F50, Maps MVP, Auth batch, Mastra gates, café SCREEN‑021 — **mostly 🟢**|✅ complete|
	|**2 · Make Everything Stable**|It doesn't lie or break silently|PR #14 merged · errors visible · prod env verified · secrets isolated|Land PR #14 · UX‑002/003/005 · EVP‑003 · F32 · AUTH‑011 · MAP‑002B/008B · clear "In Review"|**~Jun 8**|
	|**3 · Launch The App**|3 personas succeed _with evidence_|G1 paid + G2 lead + G3 publish + EVP‑001 ledger + prod smoke|G1 · EVP‑013 · G3 · EVP‑001 · UX‑006/007/008/009|**~Jun 17**|
	|**4 · Grow & Improve**|Expand surface safely|Post‑MVP packs behind the launch gate|Trips · Venues · UX‑010 cards · Vector · OpenClaw · Admin|Jun 18 → ongoing|
	
	---
	
	## 4. Critical path
	
	Longest dependency chain to launch — every item is `crit`:
	
	```
	Prod env/secrets verified (MAP-008B · MAP-002B · AUTH-011)
	        │
	        ▼
	EVP-003  webhook secret isolation ──► G1 live paid ticket + QR ──┐
	                                                                 │
	EVP-013  event cards e2e (RED today) ──► G3 host publish proof ──┤
	                                                                 ▼
	                                           EVP-001 prod proof ledger (G1+G2+G3)
	                                                                 │
	                                                                 ▼
	                                           F32 prod smoke matrix
	                                                                 │
	                                                                 ▼
	                                           🏁 MVP launch review
	```
	
	- **Pacing item = EVP‑013 (event cards in chat).** The only critical‑path task failing _right now_. Start it day 1, in parallel — don't queue it behind G1.
	- **G1 can't be faked** — needs a _real_ card charge on prod → `event_orders.status=paid` → wallet QR. Budget a human‑in‑the‑loop session; it's evidence, not code.
	
	---
	
	## 5. Blockers & risks
	
	|#|Blocker / risk|Severity|Where|Mitigation|
	|--:|---|:-:|---|---|
	|1|**EVP‑013 event‑card e2e red**|🟥 Critical|`SCREEN-006-event-card.spec.ts` 120s timeout|Diagnose agent/card branch first; restart `:3001` before trusting red (LESSONS §8)|
	|2|**No live Stripe paid proof (G1)**|🟥 Critical|prod checkout → `/me/tickets`|Manual HITL payment; capture row + QR evidence file|
	|3|**Webhook secrets identical (EVP‑003)**|🟥 Critical|ticket vs sponsor secret|Rotate sponsor secret; re‑audit env var **names** only|
	|4|**PR #14 OPEN, 13 commits off main**|🟡 High|`feat/c012-cafe-places-detail`|Land first — known blockers B1 attribution‑by‑index, B2 broken `test-prod-gate.mjs`, B3 unproven preview smoke (Vercel SSO 401)|
	|5|**Prod env unverified** (Map ID, ADK URL, auth)|🟡 High|Vercel|MAP‑008B + MAP‑002B + AUTH‑011 in one pass|
	|6|**Chat UX 48/100**|🟡 High|prod concierge|UX‑002 + UX‑005 same PR; UX‑003 parser|
	|7|**Board doesn't track critical path**|🟡 Process|Linear|Create the 9 P0 issues (§2)|
	|8|**12 screens stuck "In Review"**|🟡 Medium|Linear|Drain the column|
	|9|**"98%" vs "72%" conflict**|🟡 Trust|`MVP-REQUIRED.md` 98 vs `may30.md` 72|Use 72 (forensic, proof‑backed)|
	|10|**ai_runs cold‑start insert drops**|🟢 Low|500ms deadline|Known; post‑MVP hardening|
	
	---
	
	## 6. Best implementation order
	
	```
	PHASE 2 — Make Everything Stable  (~parallel, 2 builders)
	  1. Land PR #14   (B1→B2→B3 fixes, then merge)            ← clean base + café on main
	  2. EVP-003       rotate sponsor webhook secret + re-audit
	  3. UX-003        "$500 a night" price parser (standalone)
	  4. UX-002 + UX-005   error bubble + thinking indicator (one PR)
	  5. MAP-008B + MAP-002B + AUTH-011   prod env sign-off (one pass)
	  6. F32           prod smoke baseline (evidence file)
	  7. Drain 12 "In Review" screens
	
	PHASE 3 — Launch The App  (strict commerce chain)
	  8. EVP-013       event cards e2e green   ← START DAY 1 (red today)
	  9. G1            live paid ticket + QR
	  10. G3            host publish → Supabase row
	 11. EVP-001       consolidated proof ledger (needs 8+9)
	 12. UX-006/007/008/009   reset · stale markers · tooltip · monitor
	 13. 🏁 Prod smoke matrix → MVP launch review
	
	PHASE 4 — Grow & Improve  (after the launch gate)
	 14. UX-010 unified cards (M0→M5, SAN-360..365) — after PR #14
	 15. Trips MVP (SAN-273..291)  ‖  Venues MVP (SAN-292..314)
	 16. Vector cleanup (VEC-001..005) → OpenClaw ingest (OCL-042) → Admin
	```
	
	**Rules that bite (LESSONS.md):** one concern per PR (never mix platform fix + feature); UX‑003 touches _only_ `rental-query-parser.ts`; restart `:3001` before trusting any red e2e; skip the ADK web tool when ≥3 SQL rows exist (no 2nd Gemini round‑trip on the hot path).
	
	---
	
	## 7. What to do now vs later
	
	|**NOW — blocks launch**|**LATER — after the launch gate**|
	|---|---|
	|Land PR #14 (B1/B2/B3)|UX‑010 unified result cards (M0→M5)|
	|EVP‑013 event cards green|Trips MVP (19 issues)|
	|G1 paid + G3 publish + EVP‑001 ledger|Venues MVP + WhatsApp (23 issues)|
	|EVP‑003 secret isolation|pgvector cleanup + eval (VEC‑001..005)|
	|Prod sign‑off: Map ID, ADK URL, auth, F32|OpenClaw ingest + automations (11 issues)|
	|UX‑002/003/005/006/007/008/009|Grounding depth (GS‑005..009)|
	|Create 9 P0 Linear issues; drain "In Review"|Patricia `/admin` dashboards (W8+)|
	
	**Hard "do not start":** OpenClaw without OCL‑003 approval gates + OCL‑005 kill switch · WhatsApp auto‑send without human handoff · sponsor marketplace before EVP‑003 · vector rerank before VEC‑001 inventory · `/admin/*` until W8.
	
	---
	
	## 8. Mermaid Gantt chart
	
	```mermaid
	gantt
	    title mdeai Phase 1 MVP Build Timeline (forensic 2026-05-30; future dates = estimates)
	    dateFormat YYYY-MM-DD
	    excludes weekends
	
	    section Core Platform Foundation
	    Repo env secrets F01-06        :done,            cf1, 2026-04-06, 5d
	    Supabase auth RLS F13          :done,            cf2, after cf1, 6d
	    CopilotKit Mastra runtime      :done,            cf3, after cf2, 6d
	    Floor green 313 Vitest         :done,            cf4, after cf3, 3d
	    Land PR 14 to main             :crit, active,    cf5, 2026-06-01, 3d
	    Prod env Map ID ADK auth       :crit,            cf6, after cf5, 3d
	    Prod smoke baseline F32        :crit,            cf7, after cf6, 2d
	
	    section AI Search Experience
	    Concierge restore UX-001       :done,            ai1, 2026-05-26, 2d
	    Mastra agents tools 7          :done,            ai2, after cf3, 4d
	    Price parser UX-003            :active,          ai3, 2026-06-01, 2d
	    Error plus loading UX-002-005  :crit,            ai4, after ai3, 3d
	    Reset markers tooltip UX-006-8 :                 ai5, after ai4, 3d
	    Synthetic monitor UX-009       :                 ai6, after cf7, 2d
	
	    section Maps and Discovery
	    Maps MVP Places masks          :done,            mp1, after cf3, 6d
	    Cafe discovery SCREEN-021      :done,            mp2, after mp1, 4d
	    Map ID on prod MAP-008B        :crit,            mp3, after cf5, 1d
	    ADK grounding URL MAP-002B     :crit,            mp4, after cf5, 2d
	
	    section Event Ticketing
	    Checkout webhooks code         :done,            ev1, after cf3, 6d
	    Event cards e2e EVP-013        :crit, active,    ev2, 2026-06-01, 4d
	    Webhook secret iso EVP-003     :crit,            ev3, after cf5, 2d
	    Live paid ticket QR G1         :crit,            ev4, after ev3, 3d
	    Host publish proof G3          :crit,            ev5, after ev2, 2d
	    Prod proof ledger EVP-001      :crit,            ev6, after ev4 ev5, 2d
	
	    section Rentals and Trips
	    Rental search lead G2          :done,            rt1, after cf3, 5d
	    Auth checklist AUTH-011        :                 rt2, after cf5, 2d
	    Trips MVP TRIP-001-019         :                 rt3, after ml2, 15d
	    Venues MVP VEN-009-031         :                 rt4, after ml2, 15d
	
	    section MVP Launch
	    Stable checkpoint              :milestone,       ml1, after cf6 ai4 ev3, 0d
	    Prod smoke matrix all gates    :crit,            ml0, after ev6 cf7 mp3 mp4, 2d
	    MVP launch review              :milestone, crit, ml2, after ml0, 0d
	
	    section OpenClaw and Automations
	    Unified result cards UX-010    :                 oc1, after ml2, 6d
	    Vector cleanup VEC-001-005     :                 oc2, after ml2, 5d
	    OpenClaw ingest OCL-042        :                 oc3, after oc2, 8d
	    Admin dashboards Patricia      :                 oc4, after oc3, 8d
	```
	
	_Reading it: `done` = verified · `active` = in flight · `crit` = critical path · `milestone` = launch checkpoint. Critical chain: `cf5 → ev3 → ev4 → ev6 → ml0 → ml2`, with `ev2` (event cards, red today) the parallel risk feeding `ev5 → ev6`. MVP launch ~Jun 17 (estimate)._
	
	---
	
	## 9. Suggested Linear issue groups (7 → real SAN issues)
	
	|Group (label)|Phase weight|Representative live issues|State today|
	|---|---|---|---|
	|**Core Platform Foundation**|Setup ✅ / Stable|F01–F50 (archived 🟢) · **+ create F32, AUTH‑011** · DATA‑010/011 (SAN‑339/340)|mostly Done; prod sign‑off open|
	|**MVP Launch**|Launch|UX‑001 SAN‑315 🟢 · UX‑003 SAN‑316 · UX‑002 SAN‑320 · UX‑005 SAN‑319 · **+ create G1, EVP‑003, EVP‑013, G3, EVP‑001**|UX = Todo; **5 gates untracked**|
	|**Maps & Discovery**|Setup ✅ / Stable|Maps MVP 🟢 · SCREEN‑021 🟢 · WIRE‑008 SAN‑247 · DATA‑034 SAN‑329 · DATA‑033 SAN‑359 · **+ MAP‑002B/008B**|code done; prod env open|
	|**Event Ticketing**|Launch|SCREEN‑014 SAN‑237 🟢 · checkout SAN‑248 (In Review) · tickets+QR SAN‑259/260 (In Review) · polish SAN‑341‑346|**SCREEN‑006 SAN‑236 "Done" but e2e red**|
	|**AI Search Experience**|Setup ✅ / Grow|Mastra agents 🟢 · UX‑009 SAN‑322 · UX‑010 SAN‑318 + M0–M5 SAN‑360‑365|runtime done; cards = Grow|
	|**Rentals & Trips**|Setup ✅ / Grow|G2 🟢 · DATA‑019‑024 (SAN‑327/347‑351) · **Trips MVP SAN‑273‑291 (19, all Todo)**|G2 proven; Trips = post‑MVP|
	|**OpenClaw & Automations**|Grow|OCL SAN‑216‑226 (11) · Venues WhatsApp SAN‑308‑312 · Grounding SAN‑227‑231 · Vector SAN‑352|all Todo/Deferred — correct|
	
	**Headline:** four of seven groups are mostly built; launch‑blocking work concentrates in **MVP Launch** and **Event Ticketing** — exactly where the board is thinnest. Fix that first.
	
	---
	
	## 10. Final production readiness score
	
	|#|Key area|Score|Dot|Forensic note|
	|--:|---|--:|:-:|---|
	|1|Core Platform Foundation|95|🟢|313 Vitest, lint/build/floor exit 0, prod 200|
	|2|Supabase DB / auth / security|82|🟢|RLS tight; EVP‑003 secret isolation + DATA‑010/011 hardening open|
	|3|Environment variables & secrets|70|🟡|Identical webhook secrets was a real finding; prod env unverified|
	|4|Vercel deployment|78|🟡|Prod up; Map ID / ADK URL / auth env unproven; no F32 evidence|
	|5|GitHub / CI / testing|85|🟢|Floor green; **PR #14 open (13 commits), SCREEN‑006 e2e red, B2 broken gate**|
	|6|Mastra + CopilotKit AI|88|🟢|POST‑storm fixed; RUN_ERROR still invisible to users|
	|7|Gemini integration|88|🟢|`gemini-3.5-flash` pinned; re‑verify names via MCP|
	|8|Google Maps / Places / grounding|74|🟡|Masks + mapId enforced in code; prod Map ID + ADK URL not set|
	|9|Stripe checkout / webhooks / ticketing|68|🟡|Code exists; **no live paid proof, secret isolation, event‑card e2e red**|
	|10|Rentals & trips|70|🟡|G2 done & proven; Trips fully Todo (post‑MVP)|
	|11|Events & host flow|72|🟡|Wizard + SCREEN‑016 done; G3 publish proof + event cards open|
	|12|OpenClaw / automations|8|⚪|Specs only — correctly deferred|
	|13|Production launch readiness|60|🟡|**No‑Go:** 9 P0 open, no smoke evidence file|
	
	### **Overall MVP readiness: 72 / 100 — 🟥 No‑Go**
	
> 	The AI/Maps/Gemini/platform layers are strong (85–95). The score is held down by **unproven commerce, unsigned prod, and chat UX** — all _finishing_ work, ~2.5 weeks. The path is unusually clear because the hard part is already built. _(72, not the 98 in `MVP-REQUIRED.md`: 72 is the May‑30 forensic number backed by command proof; 98 was planning optimism — you asked for no fake completion claims.)_
	
	---
	
	**Two actions I can take on your word** (both are board mutations, so I'll only run them with an explicit go‑ahead and show you the exact change list first):
	
	17. **Apply the Linear restructure** — create the 4 phase‑milestones, add the 7 area labels, create the 9 missing P0 exit‑blocker issues, move Trips/Venues/OpenClaw to _Grow & Improve_, and fix the wrong "PR #14 merged" claim on SAN‑318/SAN‑361.
	18. **Start the build** — **UX‑003 / SAN‑316** is the clean first move (standalone, only `rental-query-parser.ts`), or **land PR #14** to clear the base.
	
	Which do you want — restructure Linear, or start a build task?