---
title: Example — AI SDK v5 Integration (mdeai)
source: https://mastra.ai/examples/v0/agents/ai-sdk-v5-integration
journeys: [J1]
personas: [Sofía]
phase: 2
---

# AI SDK v5 Integration — mdeai

**Official:** [AI SDK v5 Integration](https://mastra.ai/examples/v0/agents/ai-sdk-v5-integration)

Next.js `app/api/chat/route.ts` uses `agent.stream(messages, { format: "aisdk" })` + `useChat` from `@ai-sdk/react`. Mastra memory loads history via `getMemory()?.query`.

---

## Feature summary

| Official piece | mdeai today | Target |
|----------------|-------------|--------|
| `format: "aisdk"` stream | **No** — CopilotKit 1.55.2 | CopilotKit v2 + AG-UI migration |
| `useChat` UI | `CopilotSidebar` | May coexist on some surfaces |
| `/api/initial-chat` history | CopilotKit + Mastra memory via runtime | J10 Postgres |
| Weather tool + agent | Same as `integrations/mastra` demo | `pingAgent` / specialists |

**Phase 1 rule:** Pin CopilotKit **1.55.2** — do not mix v1 and v2 imports ([`CLAUDE.md`](../../../CLAUDE.md)).

---

## User stories

**Sofía — reference only (J1)**  
As Sofía, I read the [AI SDK v5 example](https://mastra.ai/examples/v0/agents/ai-sdk-v5-integration) to understand what CopilotKit replaces — production uses Pattern 1 from `CopilotKit/examples/integrations/mastra/`, not a parallel `/api/chat` aisdk route.

**Sofía — migration spike**  
As Sofía, a throwaway branch proves `stream({ format: "aisdk" })` with `conciergeAgent` before CopilotKit v2 cutover — not merged until floor + E2E pass.

**Camila**  
As Camila, nothing changes in Phase 1 — she still uses the sidebar wired to `/api/copilotkit`.

---

## Real-world mdeai examples

| Approach | Path | Status |
|----------|------|--------|
| **Canonical** | `api/copilotkit/route.ts` + `layout.tsx` `<CopilotKit>` | ✅ Phase 1 |
| Official v5 example | `app/api/chat` + `useChat` | ❌ not in mdeapp |
| Vendored reference | `CopilotKit/examples/integrations/mastra/` | ✅ clone for hooks |
| Legacy | `my-mastra-app` aisdk experiments | frozen |

```text
Official:  page.tsx useChat → /api/chat → agent.stream({ format: "aisdk" })
mdeapp:    CopilotSidebar → /api/copilotkit → MastraAgent bridge (AG-UI)
```

---

## Journey — Phase 2 migration

1. CopilotKit v2 ships Mastra path on mdeapp stack.
2. Map `useCoAgent` → v2 equivalents per skill `copilotkit-upgrade`.
3. Optional: keep aisdk route for one internal admin page only.
4. Lucía re-runs J1, J2 E2E on new hooks.

**Acceptance**

- [ ] Single runtime URL in prod (`/api/copilotkit`)
- [ ] Memory `thread`/`resource` still passed after migration
- [ ] No duplicate chat pipelines

---

## CopilotKit note

The official example is the **compatibility layer** story; mdeapp already has the **product** layer via [Copilot Runtime](https://docs.copilotkit.ai/mastra/copilot-runtime) + [AG-UI](https://docs.copilotkit.ai/mastra/ag-ui). Treat v5 `useChat` as migration reference, not a second user-facing chat.

**Related:** [`../03-best-practices.md`](../03-best-practices.md) v1 vs v2 table · [00-index](00-index.md)
