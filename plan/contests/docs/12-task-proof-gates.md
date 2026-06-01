---
title: Task Proof Gates
status: Strategic appendix
date: 2026-05-24
related:
  - ./04-continuous-testing-strategy.md
  - ./06-task-implementation-order.md
  - ./11-mvp-scope.md
---

# Task Proof Gates

No contest implementation task should be marked Done from markdown alone. Each task needs route proof, SQL proof, API proof, browser proof, or an explicit N/A with evidence.

## Universal Done Rule

```text
Done = implementation on disk + tests/probes green + evidence recorded.
```

## Required Evidence By Task Type

| Task type | Route proof | SQL proof | API proof | Browser proof | Extra proof |
|---|---|---|---|---|---|
| Docs-only | N/A recorded | N/A recorded | N/A recorded | N/A recorded | Links/static checks |
| Public UI | Required | If data-backed | Optional | Required | Console sweep |
| Admin UI | Required | Required | Optional | Required | Role/access proof |
| API route | Optional | If DB write/read | Required | Optional | Negative case |
| Supabase migration | N/A | Required | Optional | Optional | RLS/policy proof |
| Edge/webhook | Optional | Required | Required | Optional | Signature/idempotency proof |
| Mastra workflow | Runtime route if exposed | `ai_runs`/output rows if applicable | `/api/copilotkit` proof | CopilotKit card proof if UI | Workflow replay |
| CopilotKit card | Required | If commit-backed | `/api/copilotkit` proof | Required | HITL approve/reject |
| Gemini/tool task | Optional | If tool-backed | Tool-call proof | Optional | AI eval/refusal proof |
| Maps/ADK task | Map route if UI | Cache/evidence row if persisted | ADK/Maps adapter proof | Map screenshot/proof | Field-mask proof |
| Stripe task | Checkout/success route | Order/payment row | Webhook proof | Optional | Stripe CLI event |
| WhatsApp task | Optional | Message batch/events | Provider webhook/sandbox proof | Optional | Opt-out/deep-link proof |
| OpenClaw/Postiz task | Optional | Job/draft/audit rows | Adapter proof | Approval UI if present | No-send-without-approval proof |

## Evidence Template

Each task should add an evidence section or evidence file with:

```markdown
## Evidence

| Probe | Command / action | Expected | Actual |
|---|---|---|---|
| Local boot | `cd mdeapp && npm run dev` | UI/runtime starts | ... |
| Route proof | `curl -I http://localhost:3001/<route>` | HTTP 200/3xx | ... |
| API proof | `<request>` | expected status/body | ... |
| SQL proof | `<query>` | expected rows | ... |
| Browser proof | Playwright/Chrome DevTools | no console errors | ... |
| Negative proof | invalid/duplicate/unauthorized case | blocked | ... |
```

## Minimum Command Set

| Stage | Command/probe |
|---|---|
| Static | `cd mdeapp && npm run lint` if available |
| Unit/integration | `cd mdeapp && npm test` |
| Build | `cd mdeapp && npm run build` |
| Floor | `cd mdeapp && npm run floor` if available |
| Dev boot | `cd mdeapp && npm run dev` |
| CopilotKit runtime | `POST http://localhost:<port>/api/copilotkit` expected 200/400 |
| UI | Browser/Playwright route proof |
| SQL | Supabase MCP or local query proof |

If a script is missing, record it as a task gap, not a pass.

## Negative Tests Required

| Feature | Negative test |
|---|---|
| Vote ledger | Duplicate token and closed window cannot add vote. |
| Paid vote | Checkout redirect alone does not mint votes; webhook required. |
| Ticket QR | Duplicate scan returns duplicate state. |
| Winner publish | No announcement without approved snapshot id. |
| Sponsor outreach | No send without approval id. |
| Campaign publish | No Postiz/WhatsApp send without approval. |
| OpenClaw | Policy-blocked source does not run. |
| Maps/ADK | Agent does not invent place id or coordinates. |
| Gemini | Agent refuses vote/money/winner mutation. |

## Task Status Rules

| Status | Meaning |
|---|---|
| Not Started | No implementation. |
| In Progress | Files or docs started; proof incomplete. |
| Blocked | Explicit unresolved dependency. |
| Review | Implementation done; verification pending. |
| Done | All required proofs captured and no blockers remain. |

