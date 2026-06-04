---
title: GitHub — BunsDev mastra-starter
repo: https://github.com/BunsDev/mastra-starter
score: 55
traffic: yellow
personas: [Sofía]
---

# BunsDev/mastra-starter

## At a glance

| | |
|---|---|
| **What it is** | Community **starter template** — weather agent, tools, workflows, Studio dashboard. |
| **Purpose** | Onboarding layout for new contributors — superseded by `mdeapp` structure. |
| **Goals** | Folder conventions: `agents/`, `tools/`, `workflows/`, `index.ts`. |
| **What it does** | OpenAI weather demo + `yarn dev` Studio. |
| **Benefits** | Fast mental model before touching `mdeapp/src/mastra/`. |
| **mdeai** | Use [`01-copilotkit-mastra-integration.md`](01-copilotkit-mastra-integration.md) for real prod patterns. |

---

## Score: 55/100 🟡

---

## Learn → adapt

Copy **structure**, not weather agent:

```text
mdeapp/src/mastra/
  agents/
  tools/
  workflows/
  index.ts
```

---

## User story

**Sofía:** As Sofía, I point new devs to mastra-starter for 30-minute Mastra basics, then CopilotKit vendored example for mdeai prod.

**Best practices:** [`../03-best-practices.md`](../03-best-practices.md).
