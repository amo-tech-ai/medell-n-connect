---
doc: 09-operations-security
purpose: RLS, observability, approvals, MCP verification, security
depends_on: 02-core-architecture.md
replaces: _legacy/06-operations, _legacy/00-skills-reference
audience: ops, security, Patricia, Sofía
complexity: M
generates_tasks: F11–F13, F12, observability tables
---

# 09 — Operations + observability + security

> [← Repo](./08-repo-code-organization.md) · [Next: Delivery →](./10-delivery-roadmap.md)

## Document spec

| Field | Value |
|-------|-------|
| **Skills** | See `plan/prd/_legacy/00-skills-reference.md` + `CLAUDE.md` MCP table |

---

## 1. Security non-negotiables

| Rule | Enforcement |
|------|-------------|
| RLS on every new table | Migration review |
| No service role in `mdeapp/src/**` | Grep CI |
| Stripe webhook signatures | Separate secrets per flow (F11) |
| Places field masks | Edge proxy only |
| HITL before publish/charge | UI + RPC |

---

## 2. Approval architecture

```text
Agent proposes → approval_requests row
  → CK renderAndWaitForResponse
  → Patricia/Roberto decides
  → edge approval-commit (deterministic write)
```

**Tables:** `approval_requests`, `approval_decisions`, `decide_approval()`.

Money and publish never bypass this chain.

---

## 3. Observability

| Signal | Table / tool |
|--------|----------------|
| Agent runs | `ai_runs` (F13 ✅) |
| Tool calls | `agent_tool_calls` / Mastra spans |
| Places cost | `places_request_log` (add) |
| Grounding cost | `grounding_quota_log` (PR-2) |
| Errors | Sentry (existing) |
| Floor | `npm run floor` |

**Patricia dashboard:** quota + failed approvals — Post-MVP admin depth.

---

## 4. MCP verification cadence

Before code touching external APIs:

| Surface | MCP / fallback |
|---------|----------------|
| Gemini models | `gemini-api-docs-mcp` |
| CopilotKit | `mcp.copilotkit.ai` or local example |
| Mastra | `@mastra/mcp-docs-server` |
| Supabase | `user-supabase` MCP |
| Maps | `google-maps-code-assist` |

If MCP contradicts doc → fix doc then code.

---

## 5. Operational governance

| Role | Authority |
|------|-----------|
| Roberto | Approve own event publish |
| Patricia | Approvals queue, freeze calls |
| Sofía | Ship gates, floor |
| OpenClaw | **Batch only** — no hot path ([advanced.md](../../advanced.md)) |

```text
Automate coordination, not trust.
```

---

## 6. Deployment

- **Vercel:** `mdeapp` project — preview per PR  
- **Env:** root `.env.local` → `mdeapp/.env.local`  
- **Supabase:** shared project; edge deploy from `mdeapp/supabase/` when tree exists  

---

## 7. Incident response

1. `get_logs` (Supabase MCP)  
2. `ai_runs` + trace id from UI  
3. Rollback Vercel deployment  
4. Legacy freeze — P0 only fixes in `/home/sk/mde/`

---

## 8. Repo truth

| Built | Missing |
|-------|---------|
| `ai_runs`, auth | places/grounding logs, maps e2e in CI |
