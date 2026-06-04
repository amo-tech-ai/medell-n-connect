---
status: reference-draft
canonical: ../prd/07-contracts-schemas.md
audit: ./AUDIT-vs-prd-v7-2026-05-21.md
---

> **⚠️ Not canonical.** Phase 1 schemas live in **`mdeapp/src/platform/contracts/`** (not `packages/types/`). Telemetry: **`ai_runs`**. PR order: [`10-delivery-roadmap`](../prd/10-delivery-roadmap.md).

# Document 07 — Shared Contracts & Schema System

`07-shared-contracts-schemas.md`

# 1. Mission

The schema system exists to eliminate:

* frontend/backend drift
* agent/tool mismatches
* map-state inconsistencies
* AI hallucinated structures
* runtime serialization failures

---

# 2. Core Principle

```text id="t3nkr9"
Every important shape exists once.
```

---

# 3. Single Source of Truth

## Canonical Location

> **Phase 1 (v7):** `mdeapp/src/platform/contracts/` — see [`plan/prd/07-contracts-schemas.md`](../prd/07-contracts-schemas.md).  
> **Phase 2+:** `packages/types/` only when edge + app + Mastra share one import.

```text id="4v7x1m"
mdeapp/src/platform/contracts/   ← ship PR-1 here
```

This layer owns:

* Zod schemas
* TypeScript types
* shared contracts
* validation logic

---

# 4. Shared Schema Categories

| Category          | Purpose            |
| ----------------- | ------------------ |
| EventDraftState   | event creation     |
| RentalSearchState | rental results     |
| ApprovalRequest   | approval workflows |
| GroundedPlace     | maps grounding     |
| RentalCardData    | generative UI      |
| EventCardData     | generative UI      |
| LeadPayload       | lead capture       |
| MapPin            | map rendering      |

---

# 5. Schema Rules

## Required

Every schema must:

* use Zod
* export inferred TS type
* validate server-side
* validate tool outputs
* validate frontend actions

---

## Forbidden

Never:

* duplicate schemas
* inline large schemas
* trust AI-generated JSON
* use `any`
* allow silent coercion

---

# 6. Shared State Contracts

## Bidirectional State

Used with:

```ts id="m3d6nq"
useCoAgent<T>()
```

Examples:

* EventDraftState
* ApprovalState

---

## Read-only Shared State

Used with:

```ts id="3u5bq8"
useCoAgentState<T>()
```

Examples:

* MapState
* SearchState

---

# 7. Tool Contracts

## Every tool must define

| Requirement    | Why              |
| -------------- | ---------------- |
| input schema   | validation       |
| output schema  | rendering safety |
| error schema   | recoverability   |
| correlation_id | observability    |

---

# 8. Tool Rules

## Required

All tools:

* deterministic
* typed
* observable
* replayable
* validated

---

## Forbidden

Tools must never:

* mutate UI directly
* bypass approvals
* write DB directly without workflow
* return unvalidated payloads

---

# 9. Frontend Action Contracts

## useCopilotAction rules

Actions must:

* use typed parameters
* use stable names
* remain deterministic
* validate all user input

---

# 10. Shared Map Contracts

## MapPin

```ts id="24x8jq"
type MapPin = {
  id: string
  type: PinType
  lat: number
  lng: number
  title: string
}
```

---

## Rules

Map pins:

* generated only from trusted data
* never AI-invented
* normalized before render

---

# 11. Approval Contracts

## ApprovalRequest

```ts id="dlyjlwm"
type ApprovalRequest = {
  traceId: string
  type: ApprovalType
  reasoning: string
  proposedAction: unknown
}
```

---

# 12. Database Contracts

## DB rules

All Supabase reads:

* use generated types
* use typed RPCs
* use typed filters

All writes:

* approval-gated
* audited
* correlated

---

# 13. API Contracts

## Every API route must define

* request schema
* response schema
* error schema
* auth requirements

---

# 14. Validation Layers

| Layer    | Validation               |
| -------- | ------------------------ |
| frontend | UX validation            |
| API      | transport validation     |
| workflow | orchestration validation |
| DB       | constraints              |
| tools    | output validation        |

---

# 15. Serialization Rules

Never:

* pass Dates raw
* pass BigInt raw
* pass unnormalized Maps payloads
* pass circular state

---

# 16. Error Contracts

## Standard shape

```ts id="v9vh6d"
type AppError = {
  code: string
  message: string
  correlationId?: string
}
```

---

# 17. Testing Strategy

## Every shared schema requires

* schema tests
* serialization tests
* invalid input tests
* backward compatibility checks

---

# 18. Versioning Strategy

## Rules

* additive changes preferred
* breaking changes documented
* deprecated fields tagged
* schema migrations tracked

---

# 19. Biggest Risks

| Risk                  | Severity |
| --------------------- | -------- |
| duplicated schemas    | High     |
| tool/frontend drift   | High     |
| AI malformed payloads | High     |
| untyped map state     | High     |

---

# 20. Final Principle

The schema system must feel:

```text id="k99vmi"
predictable
stable
typed
shared
safe
```

not:

* magical
* implicit
* duplicated
* loosely typed

---

---

# Document 08 — Repo & Code Organization

`08-repo-code-organization.md`

# 1. Mission

The repo structure must:

* maximize developer velocity
* reduce confusion
* reduce coupling
* improve onboarding
* improve testing
* improve scaling

---

# 2. Core Philosophy

```text id="g6p57q"
repo-first architecture
```

The repo should communicate:

* ownership
* workflow boundaries
* runtime boundaries
* shared contracts

---

# 3. Recommended Structure

```text id="w7s9u6"
src/
  app/
  components/
  mastra/
  workflows/
  lib/
  hooks/
  context/
  platform/

packages/
  types/
  schemas/
```

---

# 4. App Router Structure

## Route ownership

| Route             | Owner      |
| ----------------- | ---------- |
| `/chat`           | concierge  |
| `/rentals`        | rentals    |
| `/host/event/new` | events     |
| `/admin/*`        | operations |

---

# 5. Shared Platform Layer

## Required folder

```text id="4tqjlwm"
src/platform/
```

---

## Responsibilities

| Folder        | Purpose          |
| ------------- | ---------------- |
| contracts     | shared contracts |
| maps          | map primitives   |
| approvals     | approval system  |
| observability | tracing/logging  |
| places        | places clients   |
| security      | auth/rate limits |

---

# 6. Component Organization

## Rules

Components organized by:

* business purpose
* not visual size

---

## Examples

```text id="q5me9g"
components/cards/
components/maps/
components/approvals/
components/layout/
```

---

# 7. Mastra Organization

## Structure

```text id="n8xycc"
mastra/
  agents/
  workflows/
  tools/
```

---

## Rules

Agents:

* conversational logic

Workflows:

* orchestration

Tools:

* retrieval/enrichment

---

# 8. Forbidden Architecture

Never create:

* nested orchestration
* agent chains everywhere
* duplicated workflows
* hidden runtime state

---

# 9. Shared Packages

## Allowed packages

| Package        | Purpose        |
| -------------- | -------------- |
| packages/types | shared schemas |
| packages/maps  | future         |
| packages/ui    | future         |

---

## Forbidden now

Avoid:

* premature monorepo
* excessive internal packages
* isolated microservices

---

# 10. API Organization

## API routes grouped by domain

```text id="xq19mw"
api/
  approvals/
  leads/
  places/
  copilotkit/
```

---

# 11. Edge Function Rules

## Required

Every edge function:

* source-controlled
* tested
* typed
* observable

---

## Forbidden

Never:

* deploy-only functions
* hidden cron jobs
* undocumented env vars

---

# 12. Naming Rules

## Required

* kebab-case files
* explicit names
* stable tool names

---

## Forbidden

* vague abstractions
* generic “utils”
* “helpers.ts” dumping grounds

---

# 13. Testing Organization

```text id="zhd1jp"
tests/
  unit/
  integration/
  e2e/
```

---

# 14. Documentation Rules

Every major system must include:

* README
* ownership
* architecture notes
* test commands
* failure modes

---

# 15. CI/CD Rules

## Every PR requires

* tests green
* floor green
* no schema drift
* no lint violations

---

# 16. Environment Rules

## Secrets

Never:

* expose service role keys
* commit env files
* access secrets client-side

---

# 17. Technical Debt Prevention

## Required

* shared schemas
* typed contracts
* repo inventory checks
* drift detection
* dead-code cleanup

---

# 18. Scaling Strategy

Scale by:

* clearer contracts
* simpler workflows
* stronger observability

NOT:

* more abstraction
* more packages
* more AI layers

---

# 19. Biggest Risks

| Risk              | Severity |
| ----------------- | -------- |
| hidden coupling   | High     |
| duplicated logic  | High     |
| deploy-only infra | High     |
| unclear ownership | Medium   |

---

# 20. Final Principle

The repo should feel:

```text id="ndbxwr"
organized
obvious
predictable
scalable
maintainable
```

not:

* fragmented
* overabstracted
* enterprise-heavy

---

---

# Document 09 — Operations, Security & Observability

`09-operations-security-observability.md`

# 1. Mission

Operations architecture exists to ensure:

* safe deployments
* traceability
* rollback safety
* AI accountability
* production stability

---

# 2. Core Principle

```text id="0s8hcl"
If it cannot be observed,
it cannot be trusted.
```

---

# 3. Observability Stack

| Layer           | Tool               |
| --------------- | ------------------ |
| frontend errors | Sentry             |
| backend logs    | Supabase logs      |
| AI telemetry    | ai_runs (mdeapp F13; not legacy agent_runs name) |
| tool telemetry  | agent_tool_calls   |
| traces          | correlation_id     |
| maps costs      | grounding_call_log |

---

# 4. Correlation ID Strategy

Every request receives:

```text id="a9m1zj"
correlation_id
```

Propagated across:

* frontend
* CopilotKit
* Mastra
* tools
* edge functions
* RPCs
* logs

---

# 5. AI Telemetry

## Required metrics

| Metric      | Purpose     |
| ----------- | ----------- |
| token usage | cost        |
| latency     | UX          |
| tool calls  | debugging   |
| failures    | reliability |
| retries     | stability   |

---

# 6. Approval Governance

## Golden Rule

```text id="pl08n5"
All high-risk writes require approval.
```

---

## High-risk examples

* event publish
* outbound messaging
* refunds
* payouts
* bulk updates

---

# 7. Security Architecture

## Required protections

| Protection      | Purpose             |
| --------------- | ------------------- |
| RLS             | data isolation      |
| signed webhooks | Stripe integrity    |
| BotID           | abuse prevention    |
| rate limiting   | AI abuse prevention |
| approval gates  | operational safety  |
| typed schemas   | runtime safety      |

---

# 8. Secrets Strategy

## Rules

Secrets:

* server-only
* environment-scoped
* never logged
* never client-exposed

---

# 9. AI Safety Rules

AI must NEVER:

* spend money
* bypass approvals
* publish autonomously
* send campaigns autonomously
* mutate inventory directly

---

# 10. Maps Cost Governance

## Required

* field masks
* cache-first lookups
* quota monitoring
* cost alerts
* grounding logs

---

# 11. Deployment Architecture

## Stack

| Layer    | Platform    |
| -------- | ----------- |
| app      | Vercel      |
| DB       | Supabase    |
| payments | Stripe      |
| maps     | Google Maps |
| AI       | Gemini      |

---

# 12. Deployment Rules

## Required

* rolling releases
* preview deploys
* production soak
* rollback capability

---

# 13. CI/CD Rules

Every deployment requires:

* tests passing
* schema validation
* type safety
* floor green
* RLS verification

---

# 14. Runtime Monitoring

## Monitor

* function failures
* API latency
* map rendering drift
* AI cost spikes
* webhook failures
* approval queue backlog

---

# 15. Incident Management

## Required systems

* emergency stop
* rollback playbooks
* retry queues
* failure notifications

---

# 16. Operational Dashboards

## Required dashboards

| Dashboard    | Purpose      |
| ------------ | ------------ |
| approvals    | governance   |
| AI telemetry | monitoring   |
| leads        | operations   |
| event health | ticketing    |
| map costs    | Google spend |

---

# 17. Testing Strategy

## Required layers

| Test        | Purpose   |
| ----------- | --------- |
| unit        | logic     |
| integration | workflows |
| e2e         | UX        |
| schema      | contracts |
| RLS         | security  |
| maps        | rendering |

---

# 18. Technical Debt Controls

## Required

* drift detection
* inventory audits
* dead-function cleanup
* unused env detection

---

# 19. Biggest Risks

| Risk                       | Severity |
| -------------------------- | -------- |
| hidden deploy-only systems | High     |
| approval bypass            | High     |
| AI cost spikes             | High     |
| silent failures            | High     |

---

# 20. Final Principle

Operations should feel:

```text id="27xh5i"
observable
safe
controlled
traceable
rollback-ready
```

not:

* opaque
* magical
* autonomous
* uncontrolled

---

---

# Document 10 — Delivery Roadmap & Execution System

`10-delivery-roadmap.md`

# 1. Mission

This roadmap exists to:

* prevent scope creep
* enforce sequencing
* maximize shipping velocity
* reduce architectural chaos

---

# 2. Core Principle

```text id="h7cww4"
Ship foundations before intelligence.
```

---

# 3. Delivery Philosophy

## Build in this order

```text id="u1sv3i"
contracts
→ runtime
→ maps
→ approvals
→ transactions
→ intelligence
→ automation
```

---

# 4. Core MVP Definition

MVP succeeds when:

1. AI event publish works
2. Stripe ticket purchase works
3. Rental chat works
4. Maps V2 stable
5. Lead capture works
6. Approval system battle-tested
7. Production soak passes

---

# 5. Phase 1 — Foundations

## Build First

| Priority | System                |
| -------- | --------------------- |
| P0       | shared schemas        |
| P0       | CopilotKit runtime    |
| P0       | Mastra runtime        |
| P0       | MapContext            |
| P0       | approval architecture |
| P0       | Supabase auth         |
| P0       | CI/floor              |

---

# 6. Phase 2 — Event MVP

## Build

* hostEventAgent
* event draft flow
* approval panel
* Stripe checkout
* QR tickets

---

# 7. Phase 3 — Rentals MVP

## Build

* rental-search **workflow** on routerAgent (not rentalAgent army)
* keyword + filters on 25 listings (**pgvector Post-MVP**)
* map pins (requires PR-1 MAP-001)
* nearby intelligence
* lead capture

---

# 8. Phase 4 — Unified Chat

## Build

* conciergeAgent
* grounded search
* conversational comparisons
* shared map/chat state

---

# 9. Phase 5 — Operations

## Build

* admin dashboards
* telemetry
* approval queues
* observability

---

# 10. Phase 6 — Intelligence

## Build

* neighborhood intelligence
* lifestyle scoring
* ranking systems
* recommendation quality

---

# 11. Phase 7 — OpenClaw

## Build Later

* async workflows
* background jobs
* WhatsApp automation
* enrichment pipelines

---

# 12. Scope Control Rules

## Forbidden before MVP

* sponsor marketplace
* contests
* autonomous agents
* browser agents
* multi-agent swarms
* native rental booking

---

# 13. Repo-First Rules

Every feature requires:

* merged code
* tests
* screenshots/proof
* deployment proof
* rollback strategy

---

# 14. Definition of Done

A task is NOT done until:

* tests pass
* floor passes
* UI verified
* maps verified
* approval verified
* telemetry visible

---

# 15. Testing Requirements

## Required before release

| Test          | Required |
| ------------- | -------- |
| unit          | yes      |
| integration   | yes      |
| Playwright    | yes      |
| RLS           | yes      |
| map rendering | yes      |
| approval flow | yes      |

---

# 16. Production Readiness Gates

## Required

* no deploy-only functions
* no schema drift
* no approval bypass
* no missing env docs
* no hidden AI costs

---

# 17. Simplification Rules

Always prefer:

* workflows over agents
* tools over orchestration
* schemas over magic state
* stable APIs over abstraction

---

# 18. Scaling Strategy

Scale through:

* caching
* observability
* typed contracts
* workflow simplicity

NOT:

* more agents
* more abstractions
* more runtimes

---

# 19. Biggest Risks

| Risk                | Severity |
| ------------------- | -------- |
| scope creep         | High     |
| overengineering     | High     |
| runtime duplication | High     |
| unstable workflows  | Medium   |

---

# 20. Final Execution Principle

The platform should evolve like:

```text id="qgfz1u"
simple foundation
→ stable workflows
→ proven UX
→ operational intelligence
→ controlled automation
```

NOT:

```text id="w2nxjw"
AI hype
→ complexity explosion
→ fragile systems
→ operational chaos
```
