---
doc_system: mdeai-prd-v7
version: 7.0
date: 2026-05-21
status: Canonical
index: ../../prd.md
forensic: ./00-forensic-audit.md
replaces: plan/prd/_legacy/* (v6.0 chunks)
---

# mdeai PRD v7 — Canonical planning system

> **One platform, ten documents, one execution track.** Module PRDs (`plan/maps/`, `plan/events/`, `plan/real-estate/`) are **implementation appendices** — not parallel architectures.

## Platform rule

```text
Supabase owns data · Mastra owns orchestration · CopilotKit owns UI
· Google Maps owns spatial display · Gemini explains (tool-backed only)
```

## Read order

| Order | Doc | Who |
|------|-----|-----|
| 0 | [00-forensic-audit.md](./00-forensic-audit.md) | CTO, leads — scores, risks, cuts |
| 1 | [01-executive-strategy.md](./01-executive-strategy.md) | Founders, product |
| 2 | [02-core-architecture.md](./02-core-architecture.md) | Architects, staff engineers |
| 3 | [03-runtime-orchestration.md](./03-runtime-orchestration.md) | AI/platform engineers |
| 4 | [04-maps-grounding.md](./04-maps-grounding.md) | Maps + concierge engineers |
| 5 | [05-events-ticketing.md](./05-events-ticketing.md) | Events engineers |
| 6 | [06-rentals-leads.md](./06-rentals-leads.md) | RE engineers |
| 7 | [07-contracts-schemas.md](./07-contracts-schemas.md) | All engineers — **start PR-1 here** |
| 8 | [08-repo-code-organization.md](./08-repo-code-organization.md) | All engineers |
| 9 | [09-operations-security.md](./09-operations-security.md) | Ops, security, Patricia |
| 10 | [10-delivery-roadmap.md](./10-delivery-roadmap.md) | PM, eng leads — tasks + PR track |

**Pointers:** [`mvp.md`](../../mvp.md) · [`roadmap.md`](real-estate/draft/roadmap.md) · [`advanced.md`](../../advanced.md) · [**`index.md`**](../../index.md) · [**diagrams**](../diagrams/README.md) (Mermaid, audited 2026-05-21)

## The 10 documents (spec)

| # | File | Purpose | Replaces (legacy) | Complexity |
|---|------|---------|-------------------|------------|
| 1 | `01-executive-strategy.md` | Vision, MVP, revenue, personas, cuts | `_legacy/01-foundation`, `_legacy/02-users-flows`, `plan/docs/prd-docs` §1–4 | M |
| 2 | `02-core-architecture.md` | Lanes, boundaries, anti-patterns | `_legacy/03-architecture` §10–14 | M |
| 3 | `03-runtime-orchestration.md` | CK + Mastra + AG-UI + agent model | `_legacy/03` §12–13, `_legacy/05` agents | L |
| 4 | `04-maps-grounding.md` | MAP-001–012, geo truth, map UX | `plan/maps/maps-prd.md` (summary + link) | L |
| 5 | `05-events-ticketing.md` | Roberto, Stripe, HITL, edges | `plan/events/events-prd.md` (trimmed) | L |
| 6 | `06-rentals-leads.md` | Camila, listings, leads, showings | `prd-real-estateV2` (trimmed) | M |
| 7 | `07-contracts-schemas.md` | Zod contracts, ToolResponse, sync rules | `_legacy/05` §Zod | M — **blocks all verticals** |
| 8 | `08-repo-code-organization.md` | `mdeapp/` tree, `src/platform/` | `_legacy/05`, `_legacy/07-reuse` | M |
| 9 | `09-operations-security.md` | RLS, observability, approvals, MCP | `_legacy/06`, `_legacy/00-skills` | M |
| 10 | `10-delivery-roadmap.md` | PR-1–5, weeks, Done gates, risks | `_legacy/08-delivery`, `roadmap.md` (detail) | M |

## Repo truth (2026-05-21)

| Built in `mdeapp/` | Not built |
|--------------------|-----------|
| CK + Mastra + `pingAgent` | `routerAgent`, `/chat`, `MapContext` |
| Auth, shadcn, `ai_runs` | `hostEventAgent`, ticketing edges, rentals |

**Production-ready:** **No** until [10-delivery-roadmap.md](./10-delivery-roadmap.md) MVP exit.

## Extended reference drafts

| Path | Role |
|------|------|
| [`plan/docs/README.md`](../docs/README.md) | 01–03 mega-drafts (docs 01–10 narrative) — **not canonical** |
| [`plan/docs/AUDIT-vs-prd-v7-2026-05-21.md`](../docs/AUDIT-vs-prd-v7-2026-05-21.md) | Verification vs these drafts |

Use for brainstorming; **task-lifecycle Phase 1 prompts cite `plan/prd/NN` only.**

## Legacy v6 chunks

Archived at [`_legacy/`](./_legacy/) — do not edit for new work; cite only for historical context.
