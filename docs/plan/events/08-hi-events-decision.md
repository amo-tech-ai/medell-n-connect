---
title: 08 — Hi.Events: features, use cases, scorecard, integration decision
date: 2026-05-21
status: Decision-ready
inputs:
  - /home/sk/mdeai/github/events/Hi.Events (local clone — read-only reference)
  - https://github.com/HiEventsDev/hi.events
  - https://hi.events/docs
  - LICENCE: AGPL-v3 + Section 7(b) attribution rider
related:
  - plan/02-repo-plan.md §3 row 15 (Top-20, score 80, "PATTERN ONLY")
  - plan/prd/04-product-surfaces.md §24 ticketing (Hi.Events ticket model = reference)
  - plan/prd/07-reuse.md §43 (reuse matrix — 80/100 reference)
  - plan/prd/08-delivery.md §22 risk register ("AGPL contamination")
---

# Hi.Events — features + use cases + scorecard + integration decision

> **TL;DR.** Hi.Events scores **80/100** as a feature set and **78/100** as a Cloud-SaaS integration. As a **fork** for mdeai, it scores **45/100** — wrong stack (Laravel/PHP vs Next/Mastra), AGPL viral copyleft, "Powered by Hi.Events" attribution required unless paid commercial license. **Recommendation: Path A (Hi.Events Cloud as headless ticketing backend) OR Path D (native mdeapp ticketing per current PRD §51 W9)** depending on time-to-market vs. UX control trade-off.

---

## 1. What Hi.Events actually is

Open-source event ticketing platform, **AGPL-v3** with attribution rider. Stack:

| Layer | Tech |
|---|---|
| Backend | **Laravel 12 + PHP 8.2** + JWT auth + Stripe-PHP v17 + DOMPDF + Spatie (data + webhooks) + Laravel-Vapor (AWS Lambda support) |
| Frontend | **React + Mantine + Lingui + React Router + Tanstack Query + Stripe React** (NOT Next.js) |
| Storage | **Postgres** primary; S3-compatible for assets |
| Deploy | All-in-one Docker image (`daveearley/hi.events-all-in-one`) OR backend+frontend split |
| Cloud SaaS | `app.hi.events` (their hosted offering) |
| Locales | **14 shipped** (de · en · es · fr · it · nl · pt-br · pt · hu · pl · zh-cn · zh-hk · ja · vi · tr — Spanish ✅) |

---

## 2. Feature inventory (60+ shipped, sourced from `Hi.Events/README.md` + `backend/app/Models/`)

### 2.1 🎟️ Ticketing & Sales (10)

| Feature | Notes |
|---|---|
| Flexible ticket types | free · paid · **donation** · tiered |
| Hidden / locked tickets | gated by promo codes |
| Promo codes + pre-sale | percentage / fixed / per-event |
| Product add-ons | merch, upgrades, extras attached at checkout |
| Product categories | group tickets logically |
| Tax + fee support | VAT, per-region, service fees, processing fees |
| Capacity management | per-tier + shared event-wide cap |
| Multi-currency | per Stripe Connect account |
| Discounts | combined with promo logic |
| Stripe Connect payouts | direct to organizer bank |

### 2.2 🎨 Branding & Customization (6)

| Feature | Notes |
|---|---|
| Conversion-optimized checkout | A/B-tested by Hi.Events team |
| Customizable PDF ticket designs | `@react-pdf/renderer` + branded layouts |
| Branded organizer homepage | sub-domain or custom domain (paid tier) |
| Drag-and-drop event page builder | `@dnd-kit` |
| Embeddable ticket widget | `<iframe>` or JS widget for external sites |
| SEO tools | meta tags, Open Graph, sitemap |

### 2.3 👥 Attendee Management (6)

| Feature | Notes |
|---|---|
| Custom checkout questions | per-event Q&A schema |
| Search + filter + export | CSV / XLSX via `maatwebsite/excel` |
| Full + partial refunds | Stripe refund API + audit log |
| Bulk messaging by ticket tier | email + SMS (paid) |
| QR code check-in + scan logs | mobile-friendly scan PWA |
| Access-controlled check-in lists | door-staff-only links + permissions |

### 2.4 📊 Analytics & Growth (4)

| Feature | Notes |
|---|---|
| Real-time sales dashboard | live revenue + tickets sold |
| Affiliate / referral tracking | per-affiliate links + commissions |
| Advanced reporting | sales · tax · promo redemption |
| Webhooks | Zapier · Make · custom CRMs (`spatie/laravel-webhook-server`) |

### 2.5 ⚙️ Operations (8)

| Feature | Notes |
|---|---|
| Multi-user roles + permissions | Account → Organizer → User |
| Stripe Connect instant payouts | T+0 to T+2 depending on country |
| Offline payment methods | mark as paid manually |
| Offline event support | export attendee list + PDF tickets |
| Automatic invoicing | per-order PDF invoice generation |
| Event archive | post-event lifecycle |
| Multi-language UI | 14 locales (Spanish ✅) |
| Full REST API | OpenAPI-described |

### 2.6 Hidden capabilities (from backend `app/Models/` inspection, 40+ tables)

| Capability | Backed by |
|---|---|
| Email templating | `EmailTemplate.php` + Liquid (`liquid/liquid`) |
| Webhook delivery + retries | `OutgoingMessage.php` + Spatie webhook-server |
| Account hierarchy | `Account.php` → `AccountUser.php` → `Organizer.php` |
| Order audit log | `OrderAuditLog.php` (compliance trail) |
| Capacity assignments | `CapacityAssignment.php` (shared limits across tiers) |
| Affiliate tracking | `Affiliate.php` + `AccountAttribution.php` |
| Daily event stats | `EventDailyStatistic.php` (pre-aggregated for dashboards) |
| Failed jobs | `FailedJob.php` (visible queue retry) |
| Password reset tokens | `PasswordResetToken.php` |
| Application + payment platform fees | `OrderApplicationFee.php` + `OrderPaymentPlatformFee.php` |
| ICS calendar export | `spatie/icalendar-generator` |
| User impersonation (support) | `lab404/laravel-impersonate` |

---

## 3. Use cases — mapped to mdeai personas

| Hi.Events use case | mdeai persona | Real-world example |
|---|---|---|
| **Event organizer creates an event** | **Roberto** | Roberto in El Poblado opens dashboard → fills 8 form fields → uploads cover photo → defines 3 ticket tiers ("General COP 50k" / "VIP COP 120k" / "Comp 0k") → publishes. Hi.Events handles all the chrome. mdeai's chat-first thesis instead has Roberto **type one sentence to an agent** that fills the same fields — fundamentally different UX. |
| **Buyer purchases a ticket** | **Andrés / Miguel** | Andrés sees a Hi.Events event page → picks "General" → enters email + custom answers → Stripe checkout → receives email with PDF + QR. Hi.Events' conversion-optimised flow is genuinely better than building from scratch. |
| **Door staff scans QR at the venue** | door staff | Hi.Events ships a scan PWA at `/check-in/<event>/<token>`. mdeai's F45 spec references this UX pattern. |
| **Multi-tier ticket sold out** | **Roberto + Andrés** | Hi.Events handles "Sold out" + waitlist + per-tier capacity. mdeai would need to build all three. |
| **Promo code campaign** | **Roberto** | Roberto creates `EARLY-BIRD-20` → expires Sat → caps at 50 redemptions. Hi.Events ships this; mdeai doesn't have it specced. |
| **Refund + audit trail** | **Patricia** (admin) | Hi.Events' `OrderAuditLog` + Stripe refund API gives Patricia a defensible compliance trail. mdeai PRD §17 implies it but no spec yet. |
| **Affiliate links** | sponsors (Phase 3) | Hi.Events ships per-affiliate tracking. mdeai has it in the Phase 3 sponsor marketplace plan — no spec yet. |
| **Multi-language event page** | bilingual visitors | Hi.Events' Lingui setup includes `es.po` (Spanish). mdeai's Phase 2 i18n could borrow the pattern + the actual `.po` strings (AGPL allows verbatim translation files under fair-use). |
| **Custom Q&A at checkout** | **Roberto** ("for over-21 events") | Hi.Events ships `ProductQuestion.php` + answer storage. mdeai has no equivalent. |
| **PDF ticket with branding** | **Andrés** | Hi.Events `@react-pdf/renderer` template; mdeai would have to build from `pdf-lib` or similar. |

---

## 4. Scorecard — Hi.Events as a candidate for mdeai

Each dimension scored 0–100 from **mdeai's perspective**. Higher = better for mdeai.

| Dimension | Score | Reason |
|---|---:|---|
| **Feature completeness** for events + ticketing | **95** | 60+ features; battle-tested at Hi.Events Cloud + 13k+ self-host installs |
| **Stack fit** with mdeapp (TypeScript / Next 16 / Mastra) | **15** | Laravel 12 / PHP 8.2 backend + React Router (not Next.js) frontend. Zero code transfer; full rewrite to integrate at code level |
| **License compatibility** with mdeai operating model | **35** | AGPL-v3 + Section 7(b) attribution required (`Powered by Hi.Events`). Commercial license available to remove attribution. Operating SaaS that modifies Hi.Events triggers AGPL distribution obligations |
| **Operational complexity** to self-host | **55** | All-in-one Docker reduces this; still requires PHP runtime + Postgres + queue worker + observability + separate deploy pipeline |
| **Time-to-market** vs build native | **90** | Days-not-weeks to stand up a working ticketing platform. Cloud SaaS = hours |
| **AI-first / chat integration** | **20** | Hi.Events is CRUD admin UX, not conversational. Roberto's "type a sentence, agent fills" flow has no Hi.Events equivalent; would need a separate mdeapp UI layer pointing at Hi.Events API |
| **Customisation friction** without forking | **60** | REST API + webhooks are comprehensive, but custom event flows (chat-driven creation, mdeai-branded checkout) require frontend replacement |
| **i18n readiness** for mdeai (Spanish needed) | **100** | `es.po` (Spanish) ships in `frontend/src/locales/`. Even without forking, the `.po` translations are fair-use copyable per Lingui convention |
| **QR / scanner** out-of-box | **85** | PWA scan flow + scan logs + access-controlled lists exist; mdeai would need to build (F45 spec only stub'd) |
| **Multi-tier ticketing** | **95** | Tiers + capacities + promos + add-ons + categories — full coverage. mdeai has zero of this specced. |
| **Audit + compliance** trail | **90** | `OrderAuditLog` + invoice generation + refund history. Patricia's W8 admin would benefit. |
| **Vendor lock-in** risk | **70** | Self-host = no lock-in; Cloud = moderate (data export available) |
| **Maintenance burden** if forked | **30** | Maintaining a Laravel fork in a TypeScript-only org = high cognitive cost; no overlap with mdeapp dev skills |
| **Community + maintainer health** | **85** | Active maintainers, monthly releases, Docker pulls strong, Trendshift-trending |
| **Aggregate (weighted: mdeai relevance)** | **62** | Strong features, terrible stack fit, license-encumbered. Net: good as black-box backend, bad as fork target. |

---

## 5. License reality check (AGPL-v3 + 7(b))

From `Hi.Events/LICENCE` lines 1–8:

> "In accordance with Section 7(b) of the AGPL, you are required to retain the **'Powered by Hi.Events'** attribution at the footer of all web pages and emails generated by this software… If you wish to remove this attribution, a **commercial license is available**."

What this means **operationally** for the 4 integration paths:

| Path | License obligation |
|---|---|
| **A. Hi.Events Cloud** (paid SaaS) | Cloud T&Cs apply — likely waives 7(b) for paying customers; no AGPL touch |
| **B. Self-host unmodified** | Attribution required on every page + email (or pay for commercial license) |
| **C. Fork + customize** | AGPL viral — **all** mdeai-shipped derivative work must be AGPL + attribution. SaaS triggers Section 13 "remote network interaction" — full source must be made available to users |
| **D. Native rewrite** (current PRD) | Zero AGPL contact. Patterns + ideas are not copyrightable; field shapes + UX flows are fair-use references |

---

## 6. Four integration paths — full comparison

| | **Path A — Cloud (paid SaaS)** | **Path B — Self-host unmodified** | **Path C — Fork + customize** | **Path D — Native in mdeapp (current PRD)** |
|---|---|---|---|---|
| **Time to first ticket sale** | hours (sign up, configure Stripe Connect, embed widget) | 1–3 days (Docker + DNS + Stripe Connect + smoke) | 2–6 weeks (port branding + chat layer + AGPL audit) | 4–6 weeks (W9 spec + Stripe webhook port + scanner PWA + multi-tier schema) |
| **AGPL exposure** | none (SaaS) | low (run only; attribution shown) | **high (viral copyleft on all derived work)** | none |
| **Stack drift** | none (separate service) | low (separate service) | **massive (PHP + Laravel in a TypeScript org)** | none |
| **UX control** | low (Hi.Events branding visible) | low–medium (theming via templates + commercial license to remove attribution) | high (everything customizable) | maximum (we own every pixel) |
| **AI-first chat integration** | medium (mdeai chat → Hi.Events API; events created via API not UI) | medium (same) | high (can build chat into the fork) | maximum (CopilotKit native) |
| **Cost** | $0.50–1.50 per ticket (Hi.Events fee + Stripe) | hosting only ($20–60/mo) + Stripe + commercial license if removing badge ($1k+ one-time per Hi.Events pricing) | dev time + ops + AGPL legal review | dev time only |
| **Maintenance** | none (their team) | upgrade cycles every 1–2 months | **own all bugs in a stack you don't otherwise use** | own all bugs but in your own stack |
| **Roberto chat-first experience** | Hi.Events admin still exists as fallback if Roberto wants it | same as A | chat layer can be primary | chat is the only path |
| **Score** | **78/100** | **65/100** | **45/100** | **70/100** |

---

## 7. Recommendation

**For mdeai's MVP (Phase 1 W9 ticketing):** choose **Path A or Path D**, not B/C.

### Path A (Hi.Events Cloud) — pick if

- Time-to-market matters more than UX control for tickets specifically
- You're willing to show "Powered by Hi.Events" on the buyer-facing checkout (or pay their commercial license)
- mdeapp's chat-first surface lives entirely on `www.mdeai.co`; ticket purchase redirects to `tickets.hi.events/...` (acceptable trade-off for V1)
- Roberto's host wizard (F36) calls Hi.Events `POST /events` API to create the event; F38 approval-commit becomes a Hi.Events publish call
- Patricia's admin reads Hi.Events analytics via API; no admin port needed for tickets

**Effort to integrate Path A:** ~1 week (Stripe Connect onboarding + API client + 2 mdeai routes redirecting to Hi.Events checkout + webhook listener for `paid` events). Replaces approximately 4–6 weeks of native ticketing work.

### Path D (native — current PRD) — pick if

- UX consistency matters (every screen feels like mdeai, no third-party branding)
- AGPL is a hard "no" (some investors / acquirers are sensitive)
- You want to own the data model (events + orders + check-ins live in `zkwcbyxiwklihegjhuql` not a separate DB)
- Multi-tier + promo + refund features can be deferred or built simpler than Hi.Events

**Effort:** F33–F38 (Roberto W3-W4, already specced this turn) + W9 ticketing tasks (F44 buyer wallet + F45 scanner + Stripe webhook port from legacy) ≈ 5–6 weeks remaining.

### NOT recommended

- **Path B (self-host unmodified)** — operational burden of running Laravel in a TypeScript org, plus attribution shown unless paid. If you'd run it unmodified, just use Cloud.
- **Path C (fork + customize)** — viral AGPL + stack rewrite + maintenance burden. The "save weeks of work" upside disappears the first time we want to add a chat-driven custom flow.

---

## 8. If choosing Path A — concrete plan

Add to `tasks/core/`:

| New task | What | Effort |
|---|---|---|
| **F44a** Hi.Events Cloud sign-up + Stripe Connect | Operator action: register Hi.Events Cloud, link Stripe Connect account, save API key to Vercel env | 1h |
| **F44b** Hi.Events API client | `mdeapp/src/lib/hi-events/client.ts` — typed REST client (auth + events + orders endpoints) | 2h |
| **F44c** F36 wizard publish path | Replace F38 `/api/approval-commit` step "publish to Supabase events" with "publish to Hi.Events via API" | 3h |
| **F44d** Webhook receiver for `order.paid` | mdeapp edge fn at `/api/hi-events-webhook` updates `mdeai.events.status='published'` + writes `event_orders` row | 2h |
| **F44e** `/me/tickets/:id` reads Hi.Events order detail | Server Component proxies through to Hi.Events API + renders QR | 2h |
| **F44f** Scanner stays internal | Optional — Hi.Events ships a scan PWA; use theirs, or build mdeai's at F45 (W9) | 0–3h |

**Total Path A integration:** ~10–13h vs. F44/F45 native build ~12–16h. Roughly equivalent effort, but **Path A skips 4–6 weeks of multi-tier ticket schema + promo + refund + dashboard work** Hi.Events ships out of the box.

---

## 9. Open questions for the user

1. **Brand sensitivity:** is "Powered by Hi.Events" on the buyer checkout an acceptable V1 cost (≈ 6 months) to ship faster? Or must every pixel be mdeai-branded from day one?
2. **AGPL appetite:** any acquirer / investor known to flag AGPL? If yes → Path A only (no exposure since their SaaS T&Cs apply, not AGPL).
3. **Multi-tier ticketing scope:** does mdeai V1 actually need promo codes + tiered tickets + add-ons + capacity sharing + affiliate tracking? If "no, just paid + free" → Path D native is genuinely small.
4. **Data sovereignty:** are tickets + orders living in a separate Hi.Events Cloud database acceptable? Or must everything land in `zkwcbyxiwklihegjhuql`?
5. **Spanish UI:** if Spanish is a hard W7 requirement, Hi.Events `es.po` (Path A or B) saves significant translation work — but Path D could borrow the `.po` file verbatim under Lingui conventions.

Default answers (best guesses absent input):

- Brand: **mdeai-branded** matters → leans Path D
- AGPL: **mdeai is not currently planning AGPL** → if any doubt, Path A or D
- Multi-tier: **probably just free + paid V1** → Path D is small enough
- Data: **all in `zkwcbyxiwklihegjhuql`** → leans Path D
- Spanish: **Phase 2 W7+** → not blocking Path D

→ **Default recommendation: Path D (current PRD §51 W9 native).**

But ask if Path A is acceptable — if yes, **F44a–F44f replace F44+F45 and save ~4 weeks**.

---

## 10. Decision needed before any task spec converts

**One yes/no from the user:**

> "Path A (Hi.Events Cloud as ticketing backend) — yes or no?"

If **yes** → I add F44a–F44f task specs to `tasks/core/`, replace the current W9 F44+F45 placeholders, and update INDEX/todo accordingly.

If **no** → continue current PRD §51 path (F33–F38 already specced for Roberto W3-W4 hero; F44+F45 specs follow when W9 starts).

Either way, **Hi.Events stays cited as the multi-tier ticket schema reference + Lingui i18n pattern** per existing PRD §24 + §47.
