---
title: Events tasks index (EVP)
updated: 2026-05-27
canonical_prd: ./docs/events-prd.md
canonical_roadmap: ./docs/events-roadmap.md
parent_index: ../INDEX.md
audit: ../audit/32-events-audit.md
legacy_map: ./LEGACY-ID-MAP.md
persona: Roberto (host) · Andres (tickets) · Camila (discovery) · Patricia (ops)
canonical_task_location: /home/sk/mdeai/tasks/events
plans:
  - ../../plan/events/event-discovery/10-event-discover-plan.md
  - ../../plan/events/event-discovery/11-openclaw-event-discovery.md
execution_map: ./docs/event-discovery-skill-routing.md
---

# Events tasks — EVP index

> **Done core (pack A)** → [`../archive/events-A/`](../archive/events-A/README.md) (EVP-002, 004–012, 017 + 4 Done SCR wireframes).  
> **Active backlog:** 36 EVP specs in this folder.

> **Wireframes (scr + wire):** [`wireframes/INDEX.md`](./wireframes/INDEX.md)

> **ID scheme:** `EVP-{NNN}-{tier}-{slug}.md` — **one global build order** (001 → 047).  
> **Tiers:** `core` (revenue + host) · `mvp` (discovery/maps) · `advanced` (sponsor/automation).  
> **Legacy map:** [`LEGACY-ID-MAP.md`](./LEGACY-ID-MAP.md) (EVT-*, F33, …).

```text
/home/sk/mdeai/tasks/events/EVP-*.md
```

---

## Progress Task Tracker

**Verification snapshot:** 2026-05-26.  
**Static task audit:** one canonical task set under `/home/sk/mdeai/tasks/events`; local Markdown links passed before this tracker update.  
**Runtime proof run now:** `npm test -- event` passed **8 files / 33 tests**. `npm test -- ticket` failed because no ticket-specific Vitest files match the `ticket` filter. Selected Playwright event screens returned **11 passed / 1 failed / 1 did not run**; failure is `SCREEN-006 event query renders cards, buy CTA, and map pins` timing out waiting for `[data-testid="event-card"]`. Event detail, wallet QR, and logged-out host wizard checks passed.

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|-----------------|
| [EVP-001-core](./EVP-001-core-production-proof-gates.md) | Production proof gate across event, ticket, host, AI, API, and DB surfaces | ⚪ Not Started | 0% | Task exists and is correctly first | No current consolidated evidence ledger | Run full proof pass and write dated evidence |
| [EVP-002-core](./EVP-002-core-ticket-checkout-webhook-port.md) | Ticket checkout, webhook, wallet, QR commerce loop for Andres | 🟡 In Progress | 85% | Evidence shows checkout session/order proof; Playwright event detail and wallet QR passed | Ticket-specific Vitest filter found no tests; live Stripe webhook proof still missing | Add ticket tests; run `smoke:ticket-paid-proof`; verify production webhook |
| [EVP-003-core](./EVP-003-core-stripe-webhook-secret-audit.md) | Stripe ticket vs sponsor webhook secret isolation | 🟥 Blocked | 60% | Audit confirms code paths use separate env var names | `.env.local` had identical ticket/sponsor webhook secrets; live secret distinctness unverified | Rotate sponsor webhook secret and re-run audit |
| [EVP-004-core](./EVP-004-core-event-agent-port.md) | Mastra `eventAgent` for event questions | 🟢 Completed | 100% | Agent files exist; `npm test -- event` passed | Production proof still rolls into EVP-001 | None until proof refresh |
| [EVP-005-core](./EVP-005-core-event-tool-and-workflow.md) | Mastra `search-events` tool and `eventDiscoveryWorkflow` | 🟢 Completed | 100% | Tool/workflow files exist; event tests passed | Browser card rendering failed under SCREEN-006, tracked in EVP-013 | Keep DB-first; fix UI surface in EVP-013 |
| [EVP-006-core](./EVP-006-core-event-clarify-gate-and-chips.md) | Clarify gate and event category chips in chat | 🟢 Completed | 100% | Current Playwright generic event query clarify check passed | Full event-card branch failed separately | None |
| [EVP-007-core](./EVP-007-core-event-agent-prompt-and-sources.md) | Trusted event source registry and agent prompt rules | 🟢 Completed | 100% | Evidence notes registry/tests; event tests passed | Source freshness implementation is post-MVP | None |
| [EVP-008-core](./EVP-008-core-event-draft-state-types.md) | `EventDraftState` Zod contract for Roberto wizard | 🟢 Completed | 100% | Event draft tests included in event test pass | Production proof rolls into EVP-001 | None |
| [EVP-009-core](./EVP-009-core-host-event-agent.md) | Gemini/Mastra `hostEventAgent` for Roberto event creation | 🟢 Completed | 100% | Host agent tests included in event test pass | Live Gemini NL-to-action smoke is older/manual | Re-verify live agent in EVP-001 |
| [EVP-010-core](./EVP-010-core-host-event-new-wizard.md) | `/host/event/new` CopilotKit wizard, shared state, frontend actions | 🟡 In Progress | 90% | Current Playwright logged-out redirect checks passed; older evidence shows wizard flow | Current run did not prove authenticated wizard fill/publish preview | Run bypass-auth/authenticated wizard E2E |
| [EVP-011-core](./EVP-011-core-approval-panel-hitl.md) | CopilotKit HITL approval panel with `renderAndWaitForResponse` | 🟢 Completed | 95% | Approval panel tests/evidence exist | Full signed-in approve path still belongs to EVP-012/001 | Reconfirm in integrated publish proof |
| [EVP-012-core](./EVP-012-core-approval-commit-edge-fn.md) | Approval commit API/edge path that writes event/tickets only after approval | 🟡 In Progress | 90% | Route/schema evidence exists; edge deploy evidence exists | Signed-in approve to SQL proof and idempotency follow-up missing | Run Roberto approve -> Supabase row proof |
| [EVP-013-core](./EVP-013-core-event-card-component.md) | EventCard, filters, buy CTA, and event card rendering | 🟥 Blocked | 45% | Component/test files exist | Current Playwright failed waiting for `[data-testid="event-card"]`; mobile case did not run | Debug SCREEN-006 event-card branch first |
| [EVP-014-core](./EVP-014-core-host-events-list-page.md) | `/host/events` dashboard/list for Roberto's drafts and published events | ⚪ Not Started | 0% | Task spec exists | Route implementation not verified as present | Build server route, tests, auth proof |
| [EVP-015-mvp](./EVP-015-mvp-grounded-event-discovery.md) | DB-first + cited web freshness for event discovery | ⚪ Not Started | 15% | Supporting grounding route/libs exist in app | Task acceptance criteria not implemented/proven; citations/quota UX not complete | Start after EVP-013 is green |
| [EVP-016-mvp](./EVP-016-mvp-event-maps-venue-integration.md) | Event map pins, venue binding, Places context | 🟡 In Progress | 35% | Core map components and map tests exist | Event-specific venue binding and MAP-010 path not proven | Wire event cards to pins after EVP-013 |
| [EVP-017-mvp](./EVP-017-mvp-event-grounding-architecture.md) | Grounding architecture and phase placement doc | 🟢 Completed | 100% | Evidence notes doc-only task completed | Implementation is separate EVP-019..028 | None |
| [EVP-018-mvp](./EVP-018-mvp-event-web-discovery-task-pack.md) | Parent task pack for grounded web event discovery | ⚪ Not Started | 0% | Task exists | Child tasks not executed | Keep queued until core proof is green |
| [EVP-019-mvp](./EVP-019-mvp-research-official-docs.md) | Official docs research for CopilotKit, Mastra, ADK, Grounding, Places | ⚪ Not Started | 0% | Task exists | Current official docs not re-verified | Run MCP/doc verification before implementation |
| [EVP-020-mvp](./EVP-020-mvp-discovered-events-data-model.md) | Discovered-events schema, RLS, approval queue | ⚪ Not Started | 0% | Task exists | No schema/RLS proof | Design SQL, RLS, and review states |
| [EVP-021-mvp](./EVP-021-mvp-google-search-grounding.md) | Gemini Search grounding query templates | ⚪ Not Started | 0% | Task exists | No template/citation proof | Implement after GS-001/GS-003 |
| [EVP-022-mvp](./EVP-022-mvp-event-discovery-workflow.md) | Mastra workflow for Supabase + grounded candidates | ⚪ Not Started | 0% | Task exists | No workflow proof for discovered candidates | Implement after schema |
| [EVP-023-mvp](./EVP-023-mvp-adk-search-maps-agents.md) | Google ADK sidecar SearchAgent/MapsAgent | ⚪ Not Started | 0% | Task exists | No sidecar implementation proof | Verify ADK docs and keep Mastra as orchestrator |
| [EVP-024-mvp](./EVP-024-mvp-places-enrichment.md) | Places API enrichment for event/venue candidates | ⚪ Not Started | 0% | Task exists | No field-mask/cache proof for events | Build after data model/workflow |
| [EVP-025-mvp](./EVP-025-mvp-copilotkit-discovery-ui.md) | CopilotKit cards, citations, and approval UI for discovered events | ⚪ Not Started | 0% | Task exists | No approved discovery UI proof | Build after workflow and citation parser |
| [EVP-026-mvp](./EVP-026-mvp-human-approval-save-flow.md) | Human approval before saving discovered events | ⚪ Not Started | 0% | Task exists | No approval save path | Use same HITL pattern as EVP-011/012 |
| [EVP-027-mvp](./EVP-027-mvp-discovery-test-plan.md) | Discovery E2E/workflow test plan | ⚪ Not Started | 0% | Task exists | No replay/stress tests | Write tests before production readiness |
| [EVP-028-mvp](./EVP-028-mvp-production-readiness.md) | Production readiness for grounded discovery | ⚪ Not Started | 0% | Task exists | Depends on EVP-019..027 | Run after all discovery tasks pass |
| [EVP-029-advanced](./EVP-029-advanced-sponsor-crm-lite.md) | Sponsor CRM-lite, proposal drafts, SQL-backed ROI | ⚪ Not Started | 0% | Task exists | No schema, UI, approval, or ROI proof | Start only after event commerce is stable |
| [EVP-030-advanced](./EVP-030-advanced-openclaw-postiz-approval-sandbox.md) | OpenClaw/Postiz sandbox with approvals and audit logs | ⚪ Not Started | 0% | Task exists | No sandbox, allowlist, rate limits, or audit proof | Build after sponsor CRM-lite |
| [EVP-031-advanced](./EVP-031-advanced-openclaw-automation-plan.md) | OpenClaw automation plan only | ⚪ Not Started | 0% | Task exists | Plan not executed; no automation allowed yet | Keep plan-only until EVP-030 exists |
| [EVP-032-mvp](./EVP-032-mvp-luma-event-detail-layout.md) | Luma-style event detail page: hero, host, vibe, attendees, timeline, location, tickets | ⚪ Not Started | 0% | Task exists from Luma screenshot review | Current `/events/[slug]` is commerce-first only | Build after EVP-013 event-card blocker is green |
| [EVP-033-mvp](./EVP-033-mvp-event-vibe-ai-summary.md) | Event vibe tags and approved AI summary | ⚪ Not Started | 0% | Task exists | No approved `vibe_tags` / `ai_summary` model or UI | Add draft/approval flow in host wizard |
| [EVP-034-mvp](./EVP-034-mvp-ask-host-ai-qa.md) | Ask Host plus AI-drafted Q&A | ⚪ Not Started | 0% | Task exists | No event Q&A schema, host moderation, or AI draft flow | Add Q&A tables and host review UI |
| [EVP-035-mvp](./EVP-035-mvp-attendee-profiles-audience-breakdown.md) | Attendee profiles, going count, audience breakdown | ⚪ Not Started | 0% | Task exists | No opt-in attendee visibility or aggregate role breakdown | Add privacy-first attendee profile model |
| [EVP-036-mvp](./EVP-036-mvp-community-map-nearby.md) | Community, map, nearby cafes/bars/coworking and location context | ⚪ Not Started | 0% | Task exists | Event page lacks map/nearby intelligence | Build after event venue enrichment |
| [EVP-037-mvp](./EVP-037-mvp-concierge-event-decision-chat.md) | AI event decision concierge: should I go, who will I meet, what should I wear | ⚪ Not Started | 0% | Task exists | Current chat searches events but does not provide decision coaching | Add prompts/tool renders after vibe and attendee data |
| [EVP-038-postmvp](./EVP-038-postmvp-ai-networking-matchmaking.md) | AI networking matches and icebreakers | ⚪ Not Started | 0% | Task exists | Needs opt-in profiles and privacy rules | Defer until attendee model is proven |
| [EVP-039-postmvp](./EVP-039-postmvp-live-event-chat-rooms.md) | Live event chat and themed networking rooms | ⚪ Not Started | 0% | Task exists | No gated realtime event chat or moderation | Defer until ticket/attendee auth is stable |
| [EVP-040-postmvp](./EVP-040-postmvp-post-event-follow-up.md) | Post-event follow-up assistant | ⚪ Not Started | 0% | Task exists | No relationship notes or follow-up draft flow | Add after opt-in matchmaking |
| [EVP-041-advanced](./EVP-041-advanced-community-relationship-graph.md) | Long-term community relationship graph | ⚪ Not Started | 0% | Task exists | No opt-in memory graph or deletion controls | Keep advanced until privacy design is complete |
| [EVP-042-mvp](./EVP-042-mvp-smart-recommendations-compatibility.md) | Smart event recommendations and compatibility score | ⚪ Not Started | 0% | Task exists from feature matrix | No deterministic recommendation score or AI explanation UI | Build after vibe and attendee data exist |
| [EVP-043-mvp](./EVP-043-mvp-neighborhood-safety-transit-intelligence.md) | Neighborhood, safety, transit, and weather intelligence | ⚪ Not Started | 0% | Task exists from feature matrix | No Medellin-specific transit/safety/weather context on event pages | Build after map/venue context |
| [EVP-044-mvp](./EVP-044-mvp-whatsapp-community-links.md) | WhatsApp and community links without outbound automation | ⚪ Not Started | 0% | Task exists from feature matrix | No registered-only community link handling | Add host/admin-controlled community links |
| [EVP-045-mvp](./EVP-045-mvp-host-pricing-moderation-basics.md) | Host pricing suggestions and moderation basics | ⚪ Not Started | 0% | Task exists from feature matrix | No AI pricing suggestions or moderation queue | Keep pricing suggestion-only and bans human-approved |
| [EVP-046-mvp](./EVP-046-mvp-live-event-updates.md) | Host-controlled live event updates feed | ⚪ Not Started | 0% | Task exists from feature matrix | No public/registered/staff update feed | Add visibility-gated updates |
| [EVP-047-postmvp](./EVP-047-postmvp-ai-night-itinerary-builder.md) | AI full-night itinerary builder around events | ⚪ Not Started | 0% | Task exists from feature matrix | No before/during/after event planning flow | Build after nearby and transit intelligence |

## Progress Summary

| Tier | Tasks | Avg % | Production readiness |
|---|---:|---:|---|
| Core MVP | 14 | 76% | 🟡 In Progress — strong local event/host foundation, blocked by event-card E2E and Stripe secret/webhook proof |
| Post-MVP discovery/maps | 14 | 11% | ⚪ Mostly Not Started — architecture exists, implementation intentionally queued |
| Advanced sponsor/automation | 3 | 0% | ⚪ Not Started — should remain deferred |
| Luma/community UX additions | 10 | 0% | ⚪ Not Started — product layer from screenshot review |
| Feature matrix additions | 6 | 0% | ⚪ Not Started — recommendations, WhatsApp links, safety/transit, pricing/moderation, live updates, night planner |
| Overall events pack | 47 | 26% | 🟡 Planning is strong; production launch is not green |

---

## Implementation order (all 47)

### core (001–014) — Core MVP

| Step | ID | Task | Status | Spec |
|-----:|----|------|--------|-----:|
| 1 | [EVP-001-core](./EVP-001-core-production-proof-gates.md) | Production proof gates | Not Started | 93 |
| 2 | [EVP-002-core](../archive/events-A/EVP-002-core-ticket-checkout-webhook-port.md) | Ticket checkout + webhook | **Done** (archived) | 88 |
| 3 | [EVP-003-core](./EVP-003-core-stripe-webhook-secret-audit.md) | Stripe webhook audit | Partial | 86 |
| 4 | [EVP-004-core](../archive/events-A/EVP-004-core-event-agent-port.md) | eventAgent port | **Done** (archived) | 90 |
| 5 | [EVP-005-core](../archive/events-A/EVP-005-core-event-tool-and-workflow.md) | search-events workflow | **Done** (archived) | 90 |
| 6 | [EVP-006-core](../archive/events-A/EVP-006-core-event-clarify-gate-and-chips.md) | Clarify gate + chips | **Done** (archived) | 89 |
| 7 | [EVP-007-core](../archive/events-A/EVP-007-core-event-agent-prompt-and-sources.md) | Prompt + source registry | **Done** (archived) | 91 |
| 8 | [EVP-008-core](../archive/events-A/EVP-008-core-event-draft-state-types.md) | EventDraft Zod | **Done** (archived) | 92 |
| 9 | [EVP-009-core](../archive/events-A/EVP-009-core-host-event-agent.md) | hostEventAgent | **Done** (archived) | 91 |
| 10 | [EVP-010-core](../archive/events-A/EVP-010-core-host-event-new-wizard.md) | Host wizard `/host/event/new` | **Done** (archived) | 92 |
| 11 | [EVP-011-core](../archive/events-A/EVP-011-core-approval-panel-hitl.md) | HITL ApprovalPanel | **Done** (archived) | 91 |
| 12 | [EVP-012-core](../archive/events-A/EVP-012-core-approval-commit-edge-fn.md) | approval-commit edge | **Done** (archived) | 90 |
| 13 | [EVP-013-core](./EVP-013-core-event-card-component.md) | EventCard polish | Partial | 76 |
| 14 | [EVP-014-core](./EVP-014-core-host-events-list-page.md) | `/host/events` list | Not Started | 80 |

**North star:** Andrés buys a ticket · Roberto publishes with HITL · Camila sees event cards on `/chat`.

```text
EVP-001-core → EVP-002..012 proof → EVP-013 → EVP-014
```

---

### mvp (015–028) — Post-MVP discovery & maps

| Step | ID | Task | Status | Spec |
|-----:|----|------|--------|-----:|
| 15 | [EVP-015-mvp](./EVP-015-mvp-grounded-event-discovery.md) | Grounded event discovery | Not Started | 84 |
| 16 | [EVP-016-mvp](./EVP-016-mvp-event-maps-venue-integration.md) | Event maps + venue | Not Started | 83 |
| 17 | [EVP-017-mvp](../archive/events-A/EVP-017-mvp-event-grounding-architecture.md) | Grounding architecture doc | **Done** (archived) | 88 |
| 18 | [EVP-018-mvp](./EVP-018-mvp-event-web-discovery-task-pack.md) | Web discovery pack (parent) | Not Started | 80 |
| 19 | [EVP-019-mvp](./EVP-019-mvp-research-official-docs.md) | Research official docs | Not Started | 78 |
| 20 | [EVP-020-mvp](./EVP-020-mvp-discovered-events-data-model.md) | Discovered events schema | Not Started | 82 |
| 21 | [EVP-021-mvp](./EVP-021-mvp-google-search-grounding.md) | Search Grounding templates | Not Started | 81 |
| 22 | [EVP-022-mvp](./EVP-022-mvp-event-discovery-workflow.md) | eventDiscoveryWorkflow | Not Started | 83 |
| 23 | [EVP-023-mvp](./EVP-023-mvp-adk-search-maps-agents.md) | ADK Search + Maps agents | Not Started | 80 |
| 24 | [EVP-024-mvp](./EVP-024-mvp-places-enrichment.md) | Places enrichment | Not Started | 82 |
| 25 | [EVP-025-mvp](./EVP-025-mvp-copilotkit-discovery-ui.md) | Discovery UI + citations | Not Started | 80 |
| 26 | [EVP-026-mvp](./EVP-026-mvp-human-approval-save-flow.md) | Human approval save | Not Started | 85 |
| 27 | [EVP-027-mvp](./EVP-027-mvp-discovery-test-plan.md) | Discovery test plan | Not Started | 79 |
| 28 | [EVP-028-mvp](./EVP-028-mvp-production-readiness.md) | Discovery prod readiness | Not Started | 82 |

```text
EVP-015-mvp → EVP-016-mvp
EVP-018-mvp pack: EVP-019 → EVP-020 → EVP-021 → EVP-022 → EVP-023 → EVP-024 → EVP-025 → EVP-026 → EVP-027 → EVP-028
```

---

### advanced (029–031)

| Step | ID | Task | Status | Spec |
|-----:|----|------|--------|-----:|
| 29 | [EVP-029-advanced](./EVP-029-advanced-sponsor-crm-lite.md) | Sponsor CRM-lite | Not Started | 81 |
| 30 | [EVP-030-advanced](./EVP-030-advanced-openclaw-postiz-approval-sandbox.md) | OpenClaw/Postiz sandbox | Not Started | 79 |
| 31 | [EVP-031-advanced](./EVP-031-advanced-openclaw-automation-plan.md) | OpenClaw plan only | Not Started | 74 |
| — | [OCL-042-mvp](../openclaw/tasks/OCL-042-mvp-clawevents-medellin-automation.md) | ClawEvents ingest worker | Not Started | 82 |

**Plans:** [10-event-discover-plan](../../plan/events/event-discovery/10-event-discover-plan.md) · [11-openclaw](../../plan/events/event-discovery/11-openclaw-event-discovery.md) · [execution map](./docs/event-discovery-skill-routing.md)

---

### luma/community UX additions (032–041)

> These were appended after the original 001–031 backlog to avoid renumbering. Execute **032–037 before 029–031 advanced automation** if the goal is Luma-style event quality.

| Step | ID | Task | Status | Spec |
|-----:|----|------|--------|-----:|
| 32 | [EVP-032-mvp](./EVP-032-mvp-luma-event-detail-layout.md) | Luma-style event detail layout | Not Started | 86 |
| 33 | [EVP-033-mvp](./EVP-033-mvp-event-vibe-ai-summary.md) | Event vibe tags + AI summary | Not Started | 84 |
| 34 | [EVP-034-mvp](./EVP-034-mvp-ask-host-ai-qa.md) | Ask Host + AI Q&A assistant | Not Started | 88 |
| 35 | [EVP-035-mvp](./EVP-035-mvp-attendee-profiles-audience-breakdown.md) | Attendee profiles + audience breakdown | Not Started | 85 |
| 36 | [EVP-036-mvp](./EVP-036-mvp-community-map-nearby.md) | Community map + nearby intelligence | Not Started | 84 |
| 37 | [EVP-037-mvp](./EVP-037-mvp-concierge-event-decision-chat.md) | AI event decision concierge | Not Started | 90 |
| 38 | [EVP-038-postmvp](./EVP-038-postmvp-ai-networking-matchmaking.md) | AI networking matchmaking + icebreakers | Not Started | 82 |
| 39 | [EVP-039-postmvp](./EVP-039-postmvp-live-event-chat-rooms.md) | Live event chat + networking rooms | Not Started | 78 |
| 40 | [EVP-040-postmvp](./EVP-040-postmvp-post-event-follow-up.md) | Post-event follow-up assistant | Not Started | 82 |
| 41 | [EVP-041-advanced](./EVP-041-advanced-community-relationship-graph.md) | Community relationship graph | Not Started | 75 |
| 42 | [EVP-042-mvp](./EVP-042-mvp-smart-recommendations-compatibility.md) | Smart recommendations + compatibility | Not Started | 86 |
| 43 | [EVP-043-mvp](./EVP-043-mvp-neighborhood-safety-transit-intelligence.md) | Neighborhood, safety, transit + weather | Not Started | 85 |
| 44 | [EVP-044-mvp](./EVP-044-mvp-whatsapp-community-links.md) | WhatsApp + community links | Not Started | 84 |
| 45 | [EVP-045-mvp](./EVP-045-mvp-host-pricing-moderation-basics.md) | Host pricing + moderation basics | Not Started | 82 |
| 46 | [EVP-046-mvp](./EVP-046-mvp-live-event-updates.md) | Live event updates feed | Not Started | 82 |
| 47 | [EVP-047-postmvp](./EVP-047-postmvp-ai-night-itinerary-builder.md) | AI night itinerary builder | Not Started | 84 |

```text
EVP-013-core → EVP-032 → EVP-033 → EVP-034 → EVP-035 → EVP-036 → EVP-037
EVP-042 → EVP-043 → EVP-044 → EVP-045 → EVP-046
EVP-038 → EVP-039 / EVP-040 → EVP-041
EVP-047 after EVP-036 + EVP-043
```

---

## Notes (not EVP tasks)

| File | Role |
|------|------|
| [docs/F-39-prompt-search.md](./docs/F-39-prompt-search.md) | Prompt research |
| [docs/F-39-prompt-event-search.md](./docs/F-39-prompt-event-search.md) | Discovery prompt source |
| [docs/luma-inspired-event-ux-review.md](./docs/luma-inspired-event-ux-review.md) | Luma screenshot review and event UX gap analysis |
| [docs/event-features-improvements-matrix.md](./docs/event-features-improvements-matrix.md) | Feature matrix, moats, user info, nearby system, and task coverage |

---

## Rules

- Supabase owns event/ticket truth; Stripe owns money; Mastra orchestrates; CopilotKit renders UI.
- Search grounding discovers candidates — **no auto-publish** (EVP-026-mvp).
- OpenClaw/Postiz only after EVP-029/030 (advanced).
- No **Done** without dated evidence (`tasks/notes/`); refresh via **EVP-001-core**.
