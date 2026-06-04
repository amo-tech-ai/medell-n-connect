---
title: OpenClaw — research & planning index
canonical_master: ./tasks/01-openclaw-adk.md
execution_roadmap: ../../tasks/openclaw/docs/100-openclaw-plan.md
task_index: ../../tasks/openclaw/index-ocl.md
updated: 2026-05-27
---

# OpenClaw — planning index

> **Layer rule:** Supabase + edges = truth · **Mastra** = orchestrate + HITL · **CopilotKit** = UI · **ADK/Gemini/Places** = sync geo facts · **OpenClaw** = Patricia-approved execute (VPS).

---

## Start here

| Doc | Audience | Purpose |
|-----|----------|---------|
| [**tasks/01-openclaw-adk.md**](./tasks/01-openclaw-adk.md) | Product + eng | Master PRD — full stack seam |
| [**tasks/openclaw/docs/100-openclaw-plan.md**](../../tasks/openclaw/docs/100-openclaw-plan.md) | Sofía | Execution roadmap + Gemini VPS config |
| [**tasks/openclaw/index-ocl.md**](../../tasks/openclaw/index-ocl.md) | Implementers | **Task index** — core / mvp / post-mvp / advanced |
| [**tasks/openclaw/tasks/INDEX.md**](../../tasks/openclaw/tasks/INDEX.md) | Implementers | Task spec files (this folder) |
| [**../diagrams/06-openclaw-integration.md**](../diagrams/06-openclaw-integration.md) | Architects | Approval → outbox diagram |

---

## Internal research (`tasks/openclaw/docs/`)

| File | Score focus | Use |
|------|-------------|-----|
| [11-openclaw.md](../../tasks/openclaw/docs/11-openclaw.md) | Top 10 use cases, MVP P0 | Prioritization |
| [12-openclaw.md](../../tasks/openclaw/docs/12-openclaw.md) | OSS + café/restaurant features | Feature theft list |
| [13-openclaw.md](../../tasks/openclaw/docs/13-openclaw.md) | Mindtrip/Yelp/Foursquare matrix | Moat + architecture |
| [100-openclaw-plan.md](../../tasks/openclaw/docs/100-openclaw-plan.md) | Phases OCL-*, Gemini | Ship order |

---

## Vertical plans (`plan/openclaw/`)

| Vertical | Path | Personas | OpenClaw role |
|----------|------|----------|---------------|
| **Platform / ADK** | [tasks/01-openclaw-adk.md](./tasks/01-openclaw-adk.md) | All | §7–13 vertical tables |
| **Real estate** | [real-estate/](./real-estate/) · [14-openclaw-user-stories.md](./real-estate/14-openclaw-user-stories.md) | Camila, Andrés | Listing enrich, comp pricing, WA concierge P3 |
| **Restaurants** | [restaurants/](./restaurants/) · [openclaw-restaurant.md](./openclaw-restaurant.md) | Tourist | Menu, IG discovery, review themes |
| **Cafés / tours** | [restaurants/restaurant.md](./restaurants/restaurant.md) + [CTI plan](../../tasks/agent/10-cafeintelligence-plan.md) | Tourist | Tour crawler, café social signals |
| **Events** | [events-openclaw/](./events-openclaw/) | Roberto, Patricia | Venue enrich, directory import, WA ops P3 |
| **Contests** | [openclaw-contests.md](./openclaw-contests.md) | Diego, contestants | Leaderboard WA, reminders — **no votes** |
| **Marketing** | [docs/](./docs/) · [tasks/11-influencers.md](./tasks/11-influencers.md) | Patricia, María | SEO monitor, sponsor research, Postiz P3 |
| **WhatsApp** | [whatsapp/](./whatsapp/) | Camila, ops | Pairing, ingress, adapters |
| **VPS / WA PRD** | [14-openclaw-production-plan.md](./14-openclaw-production-plan.md) · [prd-open-claw.md](./prd-open-claw.md) | Sofía, ops | Advanced — rotate tokens (OCL-007-core) |
| **Strategy** | [OpenClaw Strategy.md](./OpenClaw%20Strategy.md) | Founders | Positioning |

---

## Legacy / draft task specs (`plan/openclaw/tasks/`)

Promoted into [`tasks/openclaw/tasks/`](../../tasks/openclaw/tasks/INDEX.md) as OCL-001-core … OCL-029-advanced:

| Legacy ID | New task |
|-----------|----------|
| 05M | OCL-001-core |
| 05H | OCL-029-advanced |
| 08B | OCL-022-advanced (partial) |
| 08G | OCL-021-postmvp |
| 08I | OCL-010-mvp (skills pack) |
| 08K | OCL-006-core (provider strategy) |
| 19C | OCL-004-core |

---

## External references (verified 2026-05)

| Source | Topic | mdeai use |
|--------|-------|-----------|
| [docs.openclaw.ai/providers/google](https://docs.openclaw.ai/providers/google) | API key, models, TTS, cache | OCL-006-core |
| [docs.openclaw.ai/tools/gemini-search](https://docs.openclaw.ai/tools/gemini-search) | `web_search` grounding | OCL-009-mvp |
| [docs.openclaw.ai/channels/whatsapp](https://docs.openclaw.ai/channels/whatsapp) | WA channel | OCL-029-advanced+ |
| [Fast.io — OpenClaw + Gemini](https://fast.io/resources/openclaw-gemini-integration-guide/) | Onboarding, multimodal | VPS setup checklist |
| [OpenClaw Playbook — Gemini Search](https://www.openclawplaybook.ai/guides/how-to-use-openclaw-gemini-search/) | Synthesized vs SERP | Operator labeling |
| [haimaker — best Gemini models](https://haimaker.ai/blog/best-gemini-models-for-openclaw/) | Flash vs Pro vs heartbeat | Cost routing |
| [Mastra workshop — OpenClaw agent](https://mastra.ai/workshops/mastra-the-next-3-months) | Memory, browser, channels | Long-term convergence |
| [../ADK/prd-adk.md](../ADK/prd-adk.md) | ADK service | Sync path — not OpenClaw |
| [../maps/maps-prd.md](../maps/maps-prd.md) | MAP-* | Phase 1 before OCI Phase 2 |

---

## Skills & MCP ([`index-skills.md`](../../index-skills.md))

| Phase | Skills | MCP |
|-------|--------|-----|
| VPS ops | `mde-hostinger`, `open-claw` | — |
| mdeapp seam | `mastra`, `copilotkit-integrations`, `mde-supabase`, `mde-task-lifecycle` | `user-mastra`, `user-supabase` |
| Geo | `mde-maps`, `gemini` | `google-maps-code-assist`, `gemini-api-docs-mcp` |
| Safety | `task-verifier` | Supabase advisors |

---

## Hard rules

1. OpenClaw **never** replaces Mastra or CopilotKit for `/` chat.
2. No booking commit, Stripe, or vote writes from OpenClaw skills.
3. No unvetted ClawHub skills in production (OCL-004-core).
4. Every job requires `automation_approvals` (OCL-003-core).
5. mdeapp production Gemini = `gemini-3.5-flash`; VPS OpenClaw models verified via `openclaw models list`.
