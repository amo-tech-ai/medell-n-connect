---
doc_id: REAL-ESTATE-ROADMAP
title: Real estate vertical — roadmap (Core · MVP · Post-MVP · Advanced)
version: 1.0
date: 2026-05-15
status: Active — sequencing companion to PRD v2 (outcomes, not a Gantt)
strategy_prd: ./prd-real-estateV2.md
execution_index: ./000-index.md
task_index: ../V2-tasks/README.md
---

# Real estate roadmap

**Full strategy + audit:** [`prd-real-estateV2.md`](./prd-real-estateV2.md)  
**Task spine:** [`../V2-tasks/README.md`](../V2-tasks/README.md) · [`../V2-tasks/`](../V2-tasks/)  
**Topological build order:** [`000-index.md`](./000-index.md)  
**Milestones:** [`milestones.md`](./milestones.md) · **Progress:** [`progress.md`](./progress.md)

This file is the **short sequencing contract**: what ships first, what is frozen, and what “verified” must mean. PRD v2 holds architecture scorecards, agent topology, and migration detail.

**Lifecycle:** Plan tasks with [`mde-task-lifecycle`](../../../.claude/skills/mde-task-lifecycle/SKILL.md) · Resequence with [`mde-roadmap`](../../../.claude/skills/mde-roadmap/SKILL.md).

---

## 0. Layered stack (how horizons map to systems)

Reading **bottom → top** (each layer may start only when layers below are green for its scope):

```text
(1) Supabase + RLS + listings + lead CRM rows     ← CORE — inventory & contact truth
(2) Mastra router + rental-search workflow        ← MVP — concierge path; still propose-only
(3) Stripe + booking + showings + applications    ← MVP — first commission dollar
(4) Places proxy + cache + map enrichment         ← POST-MVP — lifestyle / neighborhood intelligence
(5) Hermes ranking + lease review (batch)         ← POST-MVP — moat on real data
(6) OpenClaw WhatsApp + Paperclip gates           ← ADVANCED — approved sends only
(7) Production floor + load + multi-city scaffold ← ADVANCED — launch discipline
```

**Cross-walk:** Events vertical uses the same Mastra app (`my-mastra-app`) — rental intents must **not** steal event-discovery context (see `mastra-routing` skill). Money paths stay Supabase edge webhooks, not LLM tools.

---

## 1. North-star outcome (Core + MVP)

One measured path on **staging then production**:

```text
renter intake → ranked listings (≤5 cards) → lead row
→ showing scheduled → application submitted
→ Stripe pay → booking + commission reconciled
→ landlord notified (inbox / dashboard)
```

Until **one paid booking** exists with reconciled **12%** fee and **`ai_runs`** logged, rentals are **not a sellable vertical** — intake UI without inventory and pay loop is insufficient.

---

## 2. Hard freeze (capacity is zero-sum)

No new engineering in these areas until **Core + MVP** (§4–§5) is **green on staging**:

| Area | Why |
|------|-----|
| OpenClaw production outbound | Spam / Ley 1581 / wrong-listing risk without Paperclip + templates |
| Hermes production ranking in hot path | Needs labeled data + eval harness |
| Scraping / MLS / multi-source ingest | Legal + ops; landlord-direct first |
| “Production-ready” marketing | Blocked on first booking + floor + admin auth |
| LLM-triggered checkout or booking writes | Mirror events EVT-049 — user confirm + Stripe only |

**Allowed during freeze:** `places-proxy` / cache **read** infrastructure; Mastra **shadow** router logging; Postiz **manual** posts (no auto-publish from agents).

---

## 3. Now — truth & gates

| # | Outcome | Notes |
|---|---------|--------|
| 1 | Listings exist | ≥25 verified `apartments` rows with photos + pricing |
| 2 | Contact loop | Public listing → `landlord_inbox` or `leads` — **RE-003** |
| 3 | Admin auth | `useAdminAuth` on all `/admin/*` — **RE-002** |
| 4 | **`npm run floor`** green | Lint + build + Vitest; add rental smoke when **RE-038** lands |
| 5 | Dual-router decision | Log edge `ai-router` vs Mastra router before cutover — **RE-023** |
| 6 | Task drift | `V2-tasks/README.md` ↔ repo reality |

### Launch-blocking items pulled forward (live in ADVANCED folder, execute early)

| Gate | Task ID | Pull-forward reason |
|------|---------|---------------------|
| Admin auth | RE-002 | Security before any landlord PII |
| Idempotent pay | RE-017 | Reuse events webhook ledger pattern |
| Floor scope | RE-038 | Rentals paths in ship gate |
| RLS commerce | RE-005 | Before payments go live |

---

## 4. CORE — inventory, CRM spine, platform truth

**Phase folder:** `V2-tasks/core/` · **IDs:** `RE-001`–`RE-012`

Ship in **dependency order** ([`000-index.md`](./000-index.md)):

| Order | ID | Outcome |
|------:|-----|---------|
| 1 | RE-001 | 25+ verified listings seeded |
| 2 | RE-002 | Admin route guards audited |
| 3 | RE-003 | Public contact → landlord inbox / lead |
| 4 | RE-004 | `rentals` edge + frontend contract aligned |
| 5 | RE-005 | RLS review: leads, showings, applications, payments |
| 6 | RE-006 | Unified `lead-capture` edge (all channels) |
| 7 | RE-007 | `places-proxy` + field-mask registry |
| 8 | RE-008 | `places_cache` migration + TTL |
| 9 | RE-009 | Showings / applications schema + indexes verified |
| 10 | RE-010 | Mastra Postgres store + Supabase auth on concierge host |
| 11 | RE-011 | Rental intake `FilterJson` parity with DB query |
| 12 | RE-012 | Baseline Vitest for rental filters + RLS negatives |

**Verification bar:** SQL evidence for seeds; RLS tests fail cross-user; localhost screenshot of listing detail + lead row after contact.

---

## 5. MVP — concierge path + first booking

**Phase folder:** `V2-tasks/mvp/` · **IDs:** `RE-013`–`RE-022`

**Only after** §4 green.

| Order | ID | Outcome |
|------:|-----|---------|
| 13 | RE-013 | `/concierge` + `/rentals` chat → Mastra SSE (feature flag) |
| 14 | RE-014 | `rental-search-workflow` returns ≤5 cards + map pins |
| 15 | RE-015 | Showing scheduler E2E + host notification |
| 16 | RE-016 | Application wizard (4-step) + landlord summary |
| 17 | RE-017 | Stripe rental webhook + idempotency ledger |
| 18 | RE-018 | `booking-create` edge + RLS |
| 19 | RE-019 | Landlord dashboard MVP (leads, showings) |
| 20 | RE-020 | Admin listing moderation queue |
| 21 | RE-021 | Renter→landlord smoke (Playwright or scripted) |
| 22 | RE-022 | **Gate:** one paid booking + commission reconciled |

**Verification bar:** Stripe test mode receipt; `payments` + `bookings` rows; Mastra smoke `stayedInRental=true`; no client secrets in bundle.

---

## 6. Post-MVP — maps intelligence + Mastra depth

**Phase folder:** `V2-tasks/post-mvp/` · **IDs:** `RE-023`–`RE-032`

**Only after** §5 green (first booking).

| Track | Sequence / focus |
|-------|------------------|
| **Router consolidation** | RE-023 deprecate edge `ai-router` for rental intents |
| **Places enrichment** | RE-024 enrich step in `rental-search-workflow`; RE-031 persist lifestyle scores |
| **Neighborhood intel** | RE-025 `neighborhood-intelligence-workflow` + map UX |
| **Trust / compliance** | RE-026 Maps attribution on cards; RE-032 lease disclaimer UX |
| **Quality** | RE-027 golden 50-query eval; RE-028 memory field audit |
| **Hermes (batch)** | RE-029 offline ranking job; RE-030 lease-review workflow (propose-only) |

**Maps docs:** `mde-maps` skill · Places API (New) masks · Grounding Lite for agent tools only.

**Mastra docs:** [`.claude/skills/mastra/links.md`](../../../.claude/skills/mastra/links.md) · full tree [mastra.ai/llms.txt](https://mastra.ai/llms.txt) · PRD audit [§4.6–4.8](./prd-real-estateV2.md#46-mastra-platform-audit-docs--2026-05-15).

### 6.1 Mastra platform tracks (docs audit 2026-05-15)

Web-audited against `links.md` + `llms.txt`. Each track maps to existing `RE-NNN` tasks unless marked **backlog**.

| Track | Mastra primitives | mdeai outcome | Tasks |
|-------|-------------------|---------------|-------|
| **Orchestration** | Supervisor agents, concierge routing workflow | One brain: delegate rental vs event vs chitchat | RE-013, RE-023; supervisor refactor **backlog** |
| **Search path** | Workflow steps, tool streaming, response caching | ≤5 cards, incremental SSE, cheaper repeat queries | RE-014, RE-024 |
| **Trust & memory** | Guardrails, processors, semantic recall, observational memory, SensitiveDataFilter | Follow-ups stay rental; PII redacted in traces | RE-028 |
| **Human gates** | Suspend/resume, snapshots, agent approval, HITL workflows | Showing + application need explicit confirm | RE-015, RE-016, RE-030, RE-033 |
| **Quality** | `@mastra/evals` scorers, datasets, CI | Golden 50-query + toxicity sampling in floor | RE-027, RE-038 |
| **Maps + tools** | Custom tools, MCP (dev), Places via proxy (prod) | Enriched cards + commute scores | RE-007, RE-024, RE-025, RE-026 |
| **Batch / ops** | Scheduled workflows, workspace filesystem, background tasks | Market snapshots, Hermes ranking artifacts | RE-029, RE-036 |
| **Lease intelligence** | Structured output + RAG / GraphRAG | Propose-only lease summary | RE-030 |
| **Channels** | Channels + [WhatsApp guide](https://mastra.ai/guides/guide/whatsapp-chat-bot) | OpenClaw intake; Mastra does not own send | RE-034, RE-035 |
| **Deploy & observe** | Mastra Server, Supabase auth, tracing exporters | Production concierge host + Sentry/Langfuse | RE-010, RE-038 |

**Explicitly deferred (backlog — PRD §8.4):** Voice, A2A, AgentBrowser verification, Editor-stored prompts, full GraphRAG on listings.

---

## 7. Advanced — OpenClaw · Hermes · Paperclip · production

**Phase folder:** `V2-tasks/advanced/` · **IDs:** `RE-033`–`RE-040`

**Only after** (a) MVP booking, (b) Post-MVP maps/Mastra stable, (c) governance deps audited.

| System | Gate | Task IDs |
|--------|------|----------|
| **Paperclip** | Approvals + budgets before landlord-forward | RE-033 |
| **OpenClaw** | Sandbox intake → approved template sends | RE-034, RE-035 |
| **Hermes** | Weekly market snapshot; read-only from Postgres | RE-036 |
| **Growth** | Postiz pilot (manual trigger) | RE-037 |
| **Ship discipline** | Rentals in `npm run floor`; load test | RE-038, RE-039 |
| **Expansion** | Multi-city playbook doc only | RE-040 |

---

## 8. Now / Next / Later (executive)

| Horizon | Theme | Exit signal |
|---------|-------|-------------|
| **Now** | Truth: listings, contact, admin, floor | RE-001–003, RE-012 |
| **Next (Core)** | CRM + Places infra + Mastra wire | RE-004–011 |
| **Next (MVP)** | Pay loop + concierge | RE-013–022 |
| **Later (Post-MVP)** | Maps moat + evals + router cutover | RE-023–032 |
| **Later (Advanced)** | WhatsApp + governance + scale proof | RE-033–040 |

---

## 9. Failure points (severity)

| Failure | Severity |
|---------|----------|
| Zero production listings | **Critical** |
| Dual router context loss | **Critical** |
| Payment without idempotency | **Critical** |
| OpenClaw send without approval | **Critical** |
| Admin routes unguarded | **Critical** |
| Places billing / mask drift | **High** |
| Hermes on raw PII in prompts | **High** |
| Mastra not on production path | **High** |
| Task ↔ repo drift | **Medium** |

---

## 10. Scorecard (two lenses)

| Lens | Composite | Note |
|------|-----------:|------|
| **Strategy / architecture** | 54 | PRD v2 audit — correct SoT split |
| **Implementation + production proof** | 35 | **NO-GO** for rental revenue until RE-022 |

---

## 11. Official references

- **Mastra:** https://mastra.ai/llms.txt · local [`mastra/links.md`](../../../.claude/skills/mastra/links.md)
- **Places (New):** https://developers.google.com/maps/documentation/places/web-service/op-overview
- **Gemini Maps grounding:** https://ai.google.dev/gemini-api/docs/maps-grounding
- **Supabase RLS:** https://supabase.com/docs/guides/database/postgres/row-level-security

Skill used for structure: [`mde-roadmap`](../../../.claude/skills/mde-roadmap/SKILL.md).
