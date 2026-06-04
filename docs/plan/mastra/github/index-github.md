---
title: Mastra GitHub references — index (mdeai)
updated: 2026-05-21
copilotkit: 1.55.2
model: gemini-3.5-flash
---

# Mastra GitHub repos — index

## At a glance

| | |
|---|---|
| **What this folder is** | External **GitHub examples** scored for what mdeai should **learn, adapt, or skip** — not code we ship. |
| **Purpose** | Pick reference repos before building features; avoid copying wrong stack (OpenAI-only, separate Mastra server, Assistant UI vs CopilotKit 1.55.2). |
| **Prod law** | [`../03-best-practices.md`](../03-best-practices.md) · Pattern 1 · [`CopilotKit/examples/integrations/mastra/`](../../../CopilotKit/examples/integrations/mastra/) |
| **Journeys catalog** | [`../04-user-stories.md`](../04-user-stories.md) — link only, no duplicate tables |
| **Feature scores** | [`../index-mastra.md`](../index-mastra.md) — Mastra docs/features /100 |

---

## Traffic light legend

| Dot | Score | Meaning for mdeai |
|-----|------:|-------------------|
| 🟢 | **75–100** | Adopt pattern in Phase 1–2 on **Next.js + CopilotKit + Gemini** |
| 🟡 | **40–74** | Steal one slice (HITL UI, MCP, workflow); wrong UI stack or model |
| 🔴 | **0–39** | Defer, VPS-only, or conflicts with Places/Supabase/RLS path |

**Score rubric:** Revenue fit (Camila/Roberto/Tourist) 35 · CopilotKit Pattern 1 fit 25 · Gemini/Supabase alignment 20 · Copy cost inverse 10 · Legal/ops risk inverse 10.

---

## Master scorecard (sorted by score)

| Dot | Score | Repo | Doc | mdeai steal | Domain |
|-----|------:|------|-----|-------------|--------|
| 🟢 | **98** | CopilotKit × Mastra (vendored) | [01-copilotkit-mastra](01-copilotkit-mastra-integration.md) | **Prod reference** | All |
| 🟢 | **85** | [template-text-to-sql](https://github.com/mastra-ai/template-text-to-sql) | [06-text-to-sql](06-template-text-to-sql.md) | Tool + schema discipline | Rentals, events |
| 🟡 | **78** | [ui-dojo](https://github.com/mastra-ai/ui-dojo) | [02-ui-dojo](02-ui-dojo.md) | CopilotKit page compare | All UI |
| 🟡 | **72** | [assistant-ui/mastra-hitl](https://github.com/assistant-ui/mastra-hitl) | [04-mastra-hitl](04-assistant-ui-mastra-hitl.md) | HITL plan/approve UX → Roberto CK | Events |
| 🟡 | **68** | [template-docs-chatbot](https://github.com/mastra-ai/template-docs-chatbot) | [09-docs-chatbot](09-template-docs-chatbot.md) | MCP docs server | Events (J11) |
| 🟡 | **58** | [apify/actor-mastra-mcp-agent](https://github.com/apify/actor-mastra-mcp-agent) | [05-apify-mcp](05-apify-mcp-agent.md) | External scrape **VPS** only | Rentals enrich |
| 🟡 | **55** | [BunsDev/mastra-starter](https://github.com/BunsDev/mastra-starter) | [13-mastra-starter](13-bunsdev-mastra-starter.md) | Folder layout | Sofía onboarding |
| 🟡 | **52** | [personal-assistant-example](https://github.com/mastra-ai/personal-assistant-example) | [03-personal-assistant](03-personal-assistant-mcp.md) | Multi-MCP orchestration | Phase 2 ops |
| 🟡 | **48** | [tanstack-start-mastra-example](https://github.com/ataschz/tanstack-start-mastra-example) | [07-tanstack-travel](07-tanstack-travel-assistant.md) | Agent network streaming | Tourist (ideas) |
| 🟡 | **45** | [mastra-meeting-assistant](https://github.com/dgalarza/mastra-meeting-assistant) | [10-meeting-assistant](10-mastra-meeting-assistant.md) | Calendar + memory | Deferred |
| 🟡 | **38** | [Retrip](https://retrip.ai/) (product) | [08-retrip](08-retrip-product-reference.md) | Quote workspace UX | Events (inspiration) |
| 🔴 | **32** | [mastra-claw-workshop](https://github.com/smthomas/mastra-claw-workshop) | [12-claw-workshop](12-mastra-claw-workshop.md) | OpenClaw VPS skills | VPS only |
| 🔴 | **28** | [template-browsing-agent](https://github.com/mastra-ai/template-browsing-agent) | [11-browsing-agent](11-template-browsing-agent.md) | Browserbase scrape | Skip — use Places |
| 🟢 | **82** | [goldk3y/mastra-system-check](https://github.com/goldk3y/mastra-system-check) | [14-mastra-system-check](14-mastra-system-check.md) | 66-rule Mastra audit skill | Sofía, Lucía |
| 🔴 | **38** | [ssdeanx/AgentStack](https://github.com/ssdeanx/AgentStack) | [15-agentstack](15-agentstack.md) | Architecture only — **not** components | VPS / Phase 3 |
| 🔴 | **15** | — | [99-backlog](99-github-backlog.md) | Future clones | Contests, sponsors |

**Live demos:** [ui-dojo.mastra.ai](https://ui-dojo.mastra.ai/) · [aui-mastra-hitl.vercel.app](https://aui-mastra-hitl.vercel.app/)

---

## By mdeai domain (where to look)

| Domain | Persona | Best GitHub refs | Local playbook |
|--------|---------|------------------|----------------|
| **Rentals** | Camila | text-to-sql (query discipline), apify (enrichment only) | [`../examples/domains/01-real-estate-rentals.md`](../examples/domains/01-real-estate-rentals.md) |
| **Events** | Roberto | mastra-hitl, retrip UX, CopilotKit canvas | [`../examples/domains/02-events-hosting.md`](../examples/domains/02-events-hosting.md) |
| **Restaurants** | Tourist | ui-dojo CopilotKit, personal-assistant MCP | [`../examples/domains/03-restaurants-tourist.md`](../examples/domains/03-restaurants-tourist.md) |
| **Contests** | — | — | [`../examples/domains/04-contests-deferred.md`](../examples/domains/04-contests-deferred.md) |
| **Google Maps** | Camila, Tourist | **Not** browsing-agent — MAP-002 Grounding | [`../examples/domains/05-google-maps.md`](../examples/domains/05-google-maps.md) |

---

## Suggested additional repos / integrations

| Idea | Why | Phase | Doc |
|------|-----|-------|-----|
| **Apify Airbnb + Facebook Groups actors** | Off-platform listing/social signals for Camila enrichment — **not** prod hot path | 2 VPS | [05-apify-mcp](05-apify-mcp-agent.md) |
| **Firecrawl / mde-firecrawl** | Host policy PDFs, competitor pages | 2 | [`../../.claude/skills/mde-firecrawl/SKILL.md`](../../.claude/skills/mde-firecrawl/SKILL.md) |
| **mastra-system-check** | PR audit on `mdeapp/src/mastra/**` | W2+ | [14-mastra-system-check](14-mastra-system-check.md) |
| **AgentStack** | Read-only orchestration ideas — **no import** | 3+ / VPS | [15-agentstack](15-agentstack.md) |
| **github/events/** vendored | EventFlow patterns — legacy ideas only | 3+ | [`../../../github/events/README.md`](../../../github/events/README.md) |
| **Canvas mastra-pm** | Patricia kanban | 3+ | `04-user-stories` real-world table |

Full backlog: [99-github-backlog.md](99-github-backlog.md)

---

## Implementation order (GitHub learnings)

| Seq | Repo doc | When |
|-----|----------|------|
| 1 | [01-copilotkit-mastra](01-copilotkit-mastra-integration.md) | W1 — before any agent UI |
| 2 | [06-text-to-sql](06-template-text-to-sql.md) | W5 — while hardening `search-rentals` |
| 3 | [04-mastra-hitl](04-assistant-ui-mastra-hitl.md) | W3–W4 — Roberto publish UX |
| 4 | [02-ui-dojo](02-ui-dojo.md) | W5 — compare generative UI |
| 5 | [05-apify-mcp](05-apify-mcp-agent.md) | Phase 2 — VPS enrichment only |
| 6 | [14-mastra-system-check](14-mastra-system-check.md) | Any PR touching Mastra — Sofía |

---

## Do not copy into `mdeapp`

- Separate Mastra API on `:4111` / `:4750` as **prod** user path (Studio only).
- OpenAI / Anthropic as default model — **Gemini** only per CLAUDE.md.
- Assistant UI runtime — Phase 1 stays **CopilotKit 1.55.2**.
- Browserbase browsing for listings — use **Supabase + Places + Grounding**.
- Apify scrape on Vercel request path — rate limits, ToS, RLS bypass risk.

---

## Related

- [`../index-mastra.md`](../index-mastra.md)
- [`../04-user-stories.md`](../04-user-stories.md)
- Vendored monorepo: [`../../../CopilotKit/`](../../../CopilotKit/)
