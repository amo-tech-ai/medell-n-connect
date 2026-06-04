---
doc: 08-repo-code-organization
purpose: mdeapp tree, platform folder, imports, reuse
depends_on: 07-contracts-schemas.md
replaces: _legacy/05-code, _legacy/07-reuse
audience: all engineers
complexity: M
generates_tasks: F01 structure, platform folder PRs
---

# 08 — Repo + code organization

> [← Contracts](./07-contracts-schemas.md) · [Next: Operations →](./09-operations-security.md)

## Document spec

| Field | Value |
|-------|-------|
| **Root** | `/home/sk/mdeai/mdeapp/` only for new code |
| **Legacy** | `/home/sk/mde/` frozen — P0 security |

---

## 1. Target tree

```text
mdeapp/
├── src/
│   ├── app/                    # routes — thin pages
│   │   ├── api/copilotkit/
│   │   ├── chat/
│   │   ├── host/event/new/
│   │   ├── rentals/
│   │   └── me/tickets/[id]/
│   ├── platform/               # PR-1 — cross-vertical
│   │   ├── contracts/
│   │   ├── maps/               # MapContext, normalize
│   │   ├── cards/
│   │   ├── places/             # server client → edge
│   │   └── approvals/
│   ├── mastra/
│   │   ├── index.ts
│   │   ├── agents/             # ≤4 MVP
│   │   ├── workflows/
│   │   └── tools/
│   ├── components/             # presentational
│   └── lib/
│       ├── supabase/
│       └── types.ts            # thin re-export from platform/contracts
├── supabase/functions/         # PR-4+ ports
└── e2e/                        # Playwright
```

---

## 2. Import rules

| From | Import |
|------|--------|
| Pages | `@/platform/*`, `@/components/*` |
| Tools | `@/platform/contracts` only for shared types |
| Components | Never `@/lib/supabase/server` in client components |

---

## 3. What not to build

| Skip | Use instead |
|------|-------------|
| `ChatCanvas.tsx` god file | CK sidebar + `/chat` layout |
| Custom SSE | AG-UI |
| `packages/` monorepo | `platform/contracts` |
| 32 deploy-only edge copies | Port ≤6 MVP edges |

---

## 4. Reuse sources

**Repo-first index (scores + when to use):** [`index.md`](../../index.md)

| Need | Source |
|------|--------|
| CK+Mastra wiring | `CopilotKit/examples/integrations/mastra/` (99) |
| Working memory | `CopilotKit/examples/canvas/mastra`, `mastra-pm` |
| HITL + roles | `CopilotKit/examples/showcases/banking` |
| Form-fill host | `CopilotKit/examples/v1/form-filling` |
| Rental chat | `CopilotKit/examples/v1/chat-with-your-data` |
| Maps UI | `github/maps/react-google-maps` (npm `@vis.gl/react-google-maps`) |
| Grounding | `github/maps/grounding-lite-mcp-sample-app` |
| Events UX | `github/events/Hi.Events`, `event-planner-os` (patterns only) |
| Ticket edges | legacy `/home/sk/mde/supabase/functions/` |

Extended narrative: [`plan/02-repo-plan.md`](../02-repo-plan.md).

---

## 5. Testing layout

```text
src/platform/**/*.test.ts     # Vitest schemas + normalize
src/mastra/**/*.test.ts       # tool output golden files
e2e/maps-pins.spec.ts         # Playwright
e2e/host-publish.spec.ts      # Post PR-3
```

---

## 6. CI

- `npm run floor` — lint, typecheck, audit, smoke  
- Agent name check (script or test)  
- No service role in client bundle grep  

---

## 7. Repo truth

Current `mdeapp/src/` has **no** `platform/` folder — PR-1 creates it.
