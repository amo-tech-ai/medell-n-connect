---
doc_id: PRD-V7-FORENSIC
title: mdeai — Unified Forensic Audit (CTO)
date: 2026-05-21
status: Active
supersedes: plan/unified-execution-review.md (content merged here + v7 docs)
audience: founders, principal engineers, agents
---

# Unified forensic audit report

> **Verdict:** Planning is **strong**; **`mdeapp/` is foundation-only**. **Not production-ready.** Simplify to **one router, four workflows, one map writer, one approval gate** before module agent armies.

---

## 1. Scorecard (/100)

| Dimension | Score | Notes |
|-----------|------:|-------|
| **Architecture (design)** | **86** | Correct lanes; module PRDs still imply agent sprawl |
| **Repo readiness (`mdeapp`)** | **48** | `pingAgent` only; no map, host, ticket, rental paths |
| **Operational readiness** | **52** | `ai_runs` yes; places/grounding quota logs, maps e2e no |
| **AI architecture (CK+Mastra)** | **85** | Pattern correct; legacy custom SSE isolated |
| **Scalability (design)** | **74** | Supabase + cache path sound; hot-path AI cost unbounded without quotas |
| **Maintainability (design)** | **72** | Improves with `src/platform/`; hurts with 15+ doc entry points |
| **Execution realism** | **78** | 12–14w honest; 10w cutover was optimistic |
| **Complexity (lower = worse)** | **38** | High doc/agent count — target **55** by cuts |
| **Security** | **70** | RLS mature in DB; service-role discipline OK in rules; edge inventory gap in mdeapp |
| **Observability** | **58** | `ai_runs` started; span dashboards, quota alerts incomplete |
| **Planning quality (docs)** | **82** | Coherent vision when read as one system |
| **Production readiness (code)** | **42** | No MVP exit proofs in greenfield app |

**Weighted platform today:** **~58/100** · **Post-MVP slice target:** **~78/100**

---

## 2. Biggest risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **MAP-001 slip** | No product shape (chat without map proof) | PR-1 only until pins green |
| **Fake Done on tasks** | Trust collapse | 5-gate Done in [10-delivery-roadmap.md](./10-delivery-roadmap.md) |
| **Agent sprawl implementation** | 3× debug surface, name mismatches | Max 4 agents MVP — see [03-runtime-orchestration.md](./03-runtime-orchestration.md) |
| **Schema drift** (agent / types / UI) | Silent UI bugs | [07-contracts-schemas.md](./07-contracts-schemas.md) sync rules |
| **Ticketing port gap** | No revenue proof | PR-4 from legacy edges only |
| **Grounding cost** | Bill shock | Cache + `grounding_quota_log` PR-2 |
| **Legacy freeze violation** | Two sources of truth | Port patterns; never extend `/home/sk/mde/` features |

---

## 3. Biggest contradictions (resolved)

| Topic | Was | **Ruling (v7)** |
|-------|-----|-----------------|
| Language | Spanish-first vision | **English Phase 1** |
| Agents | 7–20 per module | **router + 3 specialists + workflows** |
| Chat home | `/` canvas | **`/chat` three-panel**; `/` = W1 stub |
| Production | `prd-docs` §20 said 86 ready | **Planning ≠ code** — 48 implementation |
| OpenClaw/Hermes | In architecture diagrams | **Batch only** — [`advanced.md`](../../advanced.md) |
| Monorepo | `packages/types` early | **Defer** until 3 consumers need same Zod |
| Week 10 cutover | prd §50 | **12–14 weeks** realistic |

---

## 4. Missing systems

| System | Priority | Doc |
|--------|----------|-----|
| `src/platform/contracts/` | P0 | [07](./07-contracts-schemas.md) |
| `MapContext` + MAP-001 | P0 | [04](./04-maps-grounding.md) |
| `routerAgent` + intent schema | P0 | [03](./03-runtime-orchestration.md) |
| `/chat` 3-panel layout | P0 | [04](./04-maps-grounding.md), CHAT-CENTRAL |
| `places-proxy` + field masks | P1 | [04](./04-maps-grounding.md) |
| `grounding_quota_log` | P1 | [04](./04-maps-grounding.md) |
| HITL `renderAndWaitForResponse` + `approval-commit` | P1 | [05](./05-events-ticketing.md), [09](./09-operations-security.md) |
| `mdeapp/supabase/functions/` ticket tree | P1 | [05](./05-events-ticketing.md) |
| Maps Playwright e2e | P1 | [10](./10-delivery-roadmap.md) |
| `places_request_log` | P2 | [09](./09-operations-security.md) |
| Stripe webhook idempotency tests in mdeapp | P1 | [05](./05-events-ticketing.md) |

---

## 5. Biggest overengineering

- 20+ nominal agents across module PRDs  
- Custom SSE / `pendingActions` / `normalize-tool-output` (legacy — **do not port**)  
- `packages/` monorepo before second consumer  
- Gemini + Grounding + Places on same turn without cache  
- ECL + custom `pinContent` before MAP-001  
- pgvector rental search before 25 listings + keyword path works  
- OpenClaw production outbound before MVP exit  

---

## 6. Biggest simplification opportunities

1. **One `ToolResponse` envelope** for all verticals  
2. **One `mergePinsByCategory`** writer  
3. **One `decide_approval()` + one CK HITL panel**  
4. **Four workflows** instead of 12 agents: `rental-search`, `venue-discovery`, `nearby-intel`, `grounded-search`  
5. **One forensic entry** (this doc) + **ten canonical parts** — stop adding parallel PRDs  

---

## 7. Architecture correction report

| Wrong pattern | Correct pattern |
|---------------|-----------------|
| Maps decides inventory | Mastra tools read Supabase; map renders |
| LLM outputs `place_id` | Tool returns Zod-validated geo |
| Frontend calls Places with secret | Edge `places-proxy` + `X-Goog-FieldMask` |
| `useCoAgent` writes pins | `useCoAgentState` read-only for map |
| Second orchestrator (LangGraph, CrewAI) | Mastra only |
| CK v2 mixed with v1 | **1.55.2 only** Phase 1 |
| Module PRD = separate runtime | Module PRD = appendix to [02](./02-core-architecture.md) |

---

## 8. Repo restructuring recommendations

```text
mdeapp/src/
  platform/          ← NEW (PR-1): contracts, maps, cards, places, approvals
  app/               ← routes only; thin pages
  mastra/
    agents/          ← max 4 files MVP
    workflows/       ← rental-search, venue-discovery, …
    tools/           ← zod-out only
  components/        ← UI; no business rules
  lib/               ← supabase clients, auth (no geo logic)
```

- **Do not** add `packages/` until edge functions import same Zod as app  
- **Do** colocate tests: `platform/**/*.test.ts`, `e2e/maps-pins.spec.ts`  
- **Archive** planning sprawl: `plan/docs/prd-docs.md` → pointer to v7  

---

## 9. Execution-order recommendations

**Authoritative:** [10-delivery-roadmap.md](./10-delivery-roadmap.md) PR-1 → PR-5.

```text
PR-1 contracts + MAP-001 + /chat shell
PR-2 grounding + attribution
PR-3 Roberto + HITL
PR-4 ticketing port
PR-5 rentals + lead
```

**Forbidden parallel:** PR-3 before PR-1 green.

---

## 10. Risk mitigation report

| Class | Control |
|-------|---------|
| Hallucinated geo | Zod + tool-only fields + lint |
| Payment fraud | Webhook signatures + idempotency keys |
| RLS bypass | No service role in `src/**` |
| Cost | Cache tables + quota logs + alerts |
| Rollback | Vercel preview + feature flags on routes |
| Agent name 404 | CI check: `useCoAgent.name` === Mastra key |

---

## 11. Production-readiness report

| Gate | MVP required? |
|------|---------------|
| `npm run floor` green | Yes |
| `/chat` + 3 pins | Yes |
| 1 paid ticket | Yes |
| 1 published event | Yes |
| 1 lead | Yes |
| Grounding attribution visible | Yes |
| 7-day soak | Post-MVP |
| 90+ unit tests | Stretch; min maps + host + ticket smoke |

---

## 12. Recommended strategies (summary)

| Topic | Recommendation | Doc |
|-------|----------------|-----|
| Shared contracts | Zod in `platform/contracts`; sync 3 places | [07](./07-contracts-schemas.md) |
| Testing | Vitest schemas + Playwright pins + ticket webhook fixture | [10](./10-delivery-roadmap.md) |
| Operational governance | Patricia approves; OpenClaw batch only | [09](./09-operations-security.md) |
| Approval architecture | `approval_requests` + CK HITL + edge commit | [09](./09-operations-security.md) |
| AI architecture | router + workflows; Gemini 3.5 Flash default | [03](./03-runtime-orchestration.md) |
| Observability | `ai_runs` + tool logs + quota tables | [09](./09-operations-security.md) |
| Scaling | Cache, clusterer post-25 pins, read replicas later | [04](./04-maps-grounding.md) |
| MVP enforcement | 4 outcomes only — [`mvp.md`](../../mvp.md) | [01](./01-executive-strategy.md) |
| Anti-scope-creep | If not in MVP exit → `advanced.md` or reject | [01](./01-executive-strategy.md) |

---

## 13. What v7 replaces

| Old | New |
|-----|-----|
| `plan/prd/_legacy/01–10` | `plan/prd/01–10` |
| `plan/docs/prd-docs.md` (scores) | [01](./01-executive-strategy.md) + this audit |
| `plan/unified-execution-review.md` | This file + v7 parts |
| Scattered agent matrices | [03](./03-runtime-orchestration.md) single roster |

**Keep as deep appendices:** `plan/maps/maps-prd.md`, `plan/events/events-prd.md`, `plan/real-estate/draft/prd-real-estateV2.md` — link from v7 §4–6, do not duplicate.

---

*Next: implement [07-contracts-schemas.md](./07-contracts-schemas.md) → PR-1.*
