---
title: Editor — Prompts (mdeai)
source: https://mastra.ai/docs/editor/prompts
personas: [Patricia, Roberto]
phase: 2+
---

# Editor prompts — mdeai

**Official:** [Editor prompts](https://mastra.ai/docs/editor/prompts)

Reusable **prompt blocks** with `{{variables}}` and display conditions — composed into agent instructions.

---

## mdeai today vs Editor

| Content | Today | Editor |
|---------|-------|--------|
| Concierge tone | `conciergeAgent` `instructions` in TS | Block `brand-voice` |
| “Cards from tools only” | Hard-coded rule | Block `tool-output-policy` |
| Host wizard | `hostEventAgent` W3+ | Block `roberto-wizard` |
| Spanish | **Out of scope** Phase 1 | Block deferred W7+ |

Variables: `{{userName}}`, `{{surface}}` from [runtime context](../05-runtime-context.md) on `/api/copilotkit`.

---

## User stories

**Patricia**  
As Patricia, I edit the “Medellín AI tone” prompt block in Studio and publish v2 — agents referencing the block pick it up without touching TypeScript.

**Roberto (marketing)**  
As Roberto, I propose host-facing wording in a prompt block — Sofía reviews git-less draft before publish.

**Tourist**  
As a Tourist, I always get English concierge copy in Phase 1 — Spanish blocks stay disabled via `displayConditions`.

---

## Example blocks (sketch)

```text
# tool-output-policy
Never invent listing URLs or prices. Render only data from search-rentals, search-events, search-restaurants tool results.

# brand-voice
You help people find homes and experiences in Medellín. Be concise, warm, professional. English only.
```

**CopilotKit:** Prompt blocks affect **server** agent only — UI labels stay in React/i18n Phase 2.

**Related:** [01-tools](01-tools.md) · [Editor overview](https://mastra.ai/docs/editor/overview)
