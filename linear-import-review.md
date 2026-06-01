# linear-import-review.md

Generated: 2026-05-27  
Source: scan of `/home/sk/mdeai/tasks/**`  
Output CSV: [`linear-import.csv`](./linear-import.csv) (Linear CLI / CSV import format)  
Target project: [MDEAPP](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/overview) · Team **Sanjiovani**

---

## Summary

| Metric | Count |
|--------|------:|
| Task specs scanned (with `status:`) | **220** |
| **Open** (CSV rows) | **136** |
| Done / shipped (excluded from CSV) | 81 |
| Superseded / cancelled (excluded) | 3 |
| Already in Linear MDEAPP | **136** |
| Open but not in Linear | **0** |

Linear API: verified (read-only project query)

---

## CSV format

Columns match [Linear CSV import](https://linear.app/docs/import-issues) (`@linear/import` CLI → **Linear** option):

| Column | Source |
|--------|--------|
| Title | `{id} — {title}` from frontmatter |
| Description | Spec path, status, depends_on |
| Priority | P0→Urgent, P1→High, P2→Medium, P3/P4→Low |
| Status | Repo Not Started/Open→**Todo**; In Progress/Partial→**In Progress** |
| Labels | `track:{screens|maps|core|events|vector|agent|…}`, `phase-1` or `phase-2` |
| Assignee / Created / Completed / Estimate | empty (Linear fills on import) |

**Import command (optional CLI path):**

```bash
cd /home/sk/mdeai
export LINEAR_API_KEY=...   # from .env.local
pnpm dlx @linear/import     # choose Linear CSV → linear-import.csv
```

Preferred path remains `node scripts/linear-import-tasks.mjs` (GraphQL, preserves relations).

---

## Scanned directories

| Directory | Included |
|-----------|----------|
| `tasks/core` | F* platform |
| `tasks/maps` | MAP-* |
| `tasks/screens` | SCREEN-*, CAFE-* |
| `tasks/events` | EVP-* |
| `tasks/vector` | VEC-* |
| `tasks/agent/tasks` | CTI-* |
| `tasks/mastra` | MASTRA-* |
| `tasks/contest/tasks` | CTEST-* (Phase 2+) |
| `tasks/openclaw/tasks` | OCL-* |
| `tasks/grounding-search/tasks` | GS-* |

**Excluded:** `tasks/commit/`, `tasks/audit/`, `tasks/notes/`, `tasks/testing/`, `tasks/wireframes/`, INDEX/README-only files.

---

## By track

| Track | Open | Done | Other |
|-------|-----:|-----:|------:|
| agent | 20 | 0 | 1 |
| contest | 8 | 0 | 0 |
| core | 6 | 20 | 1 |
| events | 36 | 11 | 0 |
| grounding | 5 | 4 | 0 |
| maps | 8 | 22 | 1 |
| mastra | 0 | 4 | 1 |
| openclaw | 40 | 0 | 2 |
| ops | 1 | 0 | 0 |
| screens | 5 | 16 | 1 |
| vector | 7 | 0 | 0 |

---

## By repo status

| Status | Count |
|--------|------:|
| Done | 77 |
| Open | 75 |
| Not Started | 50 |
| Draft | 8 |
| Partial | 2 |
| Superseded | 2 |
| Deferred | 2 |
| Cancelled | 1 |
| Active — execution plan for mdeapp/ | 1 |
| Not started | 1 |
| Phase A Done | 1 |

---

## P0 queue (implementation order)

| Task ID | CSV title | Linear |
|---------|-----------|--------|
| EVP-001-core | EVP-001-core — Event production proof gates… | [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) |
| EVP-003-core | EVP-003-core — P0 Stripe webhook secret audit (ticket vs sponsor)… | [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) |
| OPS-ANDRES-G1 | OPS-ANDRES-G1 — Andrés G1 — manual Stripe test payment → paid row … | [SAN-178](https://linear.app/sanjiovani/issue/SAN-178) |
| SCREEN-010 | SCREEN-010 — Map Exploration Right Panel… | [SAN-111](https://linear.app/sanjiovani/issue/SAN-111) |

---

## Open tasks — Linear cross-reference

| Task ID | Track | Priority | Spec | Linear |
|---------|-------|----------|------|--------|
| CTI-001A | agent | P0 | `tasks/agent/tasks/CTI-001A-coffee-tour-core-schema.md` | SAN-158 |
| CTI-001B | agent | P1 | `tasks/agent/tasks/CTI-001B-coffee-tour-logs-cache.md` | SAN-159 |
| CTI-002 | agent | P0 | `tasks/agent/tasks/CTI-002-coffee-tour-types.md` | SAN-160 |
| CTI-003 | agent | P0 | `tasks/agent/tasks/CTI-003-seed-coffee-tours.md` | SAN-161 |
| CTI-004 | agent | P0 | `tasks/agent/tasks/CTI-004-search-coffee-tours-tool.md` | SAN-162 |
| CTI-005 | agent | P1 | `tasks/agent/tasks/CTI-005-mvp-places-enrich-tours.md` | SAN-163 |
| CTI-006 | agent | P1 | `tasks/agent/tasks/CTI-006-rank-coffee-tours.md` | SAN-164 |
| CTI-007 | agent | P0 | `tasks/agent/tasks/CTI-007-coffee-tour-card-ui.md` | SAN-165 |
| CTI-008 | agent | P1 | `tasks/agent/tasks/CTI-008-map-pins-tours.md` | SAN-166 |
| CTI-009 | agent | P1 | `tasks/agent/tasks/CTI-009-smoke-coffee-tours.md` | SAN-167 |
| CTI-010 | agent | P1 | `tasks/agent/tasks/CTI-010-phase-a-evidence.md` | SAN-168 |
| CTI-011 | agent | P2 | `tasks/agent/tasks/CTI-011-postMVP-embeddings-pipeline.md` | SAN-169 |
| CTI-012 | agent | P2 | `tasks/agent/tasks/CTI-012-verify-tour-sources.md` | SAN-170 |
| CTI-013 | agent | P2 | `tasks/agent/tasks/CTI-013-adk-discovery-merge.md` | SAN-171 |
| CTI-014 | agent | P2 | `tasks/agent/tasks/CTI-014-save-coffee-tour.md` | SAN-172 |
| CTI-015 | agent | P2 | `tasks/agent/tasks/CTI-015-compare-drawer.md` | SAN-173 |
| CTI-016 | agent | P2 | `tasks/agent/tasks/CTI-016-query-bar-chips.md` | SAN-174 |
| CTI-017 | agent | P3 | `tasks/agent/tasks/CTI-017-tour-detail-page.md` | SAN-175 |
| CTI-018 | agent | P3 | `tasks/agent/tasks/CTI-018-coffee-tour-workflow.md` | SAN-176 |
| CTI-020 | agent | P3 | `tasks/agent/tasks/CTI-020-whatsapp-handoff.md` | SAN-177 |
| CTEST-000 | contest | P0 | `tasks/contest/tasks/CTEST-000-diagrams-repo-decisions.md` | SAN-179 |
| CTEST-001 | contest | P0 | `tasks/contest/tasks/CTEST-001-supabase-contest-core-schema.md` | SAN-180 |
| CTEST-002 | contest | P0 | `tasks/contest/tasks/CTEST-002-voting-scoring-ledgers.md` | SAN-181 |
| CTEST-003 | contest | P0 | `tasks/contest/tasks/CTEST-003-ticket-paid-vote-schema.md` | SAN-182 |
| CTEST-004 | contest | P0 | `tasks/contest/tasks/CTEST-004-copilotkit-contest-workspace.md` | SAN-183 |
| CTEST-005 | contest | P0 | `tasks/contest/tasks/CTEST-005-mastra-gemini-workflows.md` | SAN-184 |
| CTEST-006 | contest | P0 | `tasks/contest/tasks/CTEST-006-screens-wireframes.md` | SAN-185 |
| CTEST-007 | contest | P0 | `tasks/contest/tasks/CTEST-007-playwright-proof-gates.md` | SAN-186 |
| F20 | core | P1 | `tasks/core/F20-evaluation-and-deploy-prep.md` | SAN-95 |
| F21A | core | P2 | `tasks/core/F21A-auto-review-calibration.md` | SAN-96 |
| F22 | core | P2 | `tasks/core/F22-hero-photo-library.md` | SAN-97 |
| F26 | core | P1 | `tasks/core/F26-restaurant-card-component.md` | SAN-98 |
| F30 | core | P2 | `tasks/core/F30-onboarding-layout.md` | SAN-99 |
| F32 | core | P1 | `tasks/core/F32-production-smoke.md` | SAN-100 |
| EVP-001-core | events | P0 | `tasks/events/EVP-001-core-production-proof-gates.md` | SAN-115 |
| EVP-003-core | events | P0 | `tasks/events/EVP-003-core-stripe-webhook-secret-audit.md` | SAN-116 |
| EVP-013-core | events | P1 | `tasks/events/EVP-013-core-event-card-component.md` | SAN-117 |
| EVP-014-core | events | P0 | `tasks/events/EVP-014-core-host-events-list-page.md` | SAN-118 |
| EVP-015-mvp | events | P1 | `tasks/events/EVP-015-mvp-grounded-event-discovery.md` | SAN-119 |
| EVP-016-mvp | events | P1 | `tasks/events/EVP-016-mvp-event-maps-venue-integration.md` | SAN-120 |
| EVP-018-mvp | events | P3 | `tasks/events/EVP-018-mvp-event-web-discovery-task-pack.md` | SAN-121 |
| EVP-019-mvp | events | P2 | `tasks/events/EVP-019-mvp-research-official-docs.md` | SAN-122 |
| EVP-020-mvp | events | P2 | `tasks/events/EVP-020-mvp-discovered-events-data-model.md` | SAN-123 |
| EVP-021-mvp | events | P2 | `tasks/events/EVP-021-mvp-google-search-grounding.md` | SAN-124 |
| EVP-022-mvp | events | P2 | `tasks/events/EVP-022-mvp-event-discovery-workflow.md` | SAN-125 |
| EVP-023-mvp | events | P2 | `tasks/events/EVP-023-mvp-adk-search-maps-agents.md` | SAN-126 |
| EVP-024-mvp | events | P2 | `tasks/events/EVP-024-mvp-places-enrichment.md` | SAN-127 |
| EVP-025-mvp | events | P2 | `tasks/events/EVP-025-mvp-copilotkit-discovery-ui.md` | SAN-128 |
| EVP-026-mvp | events | P2 | `tasks/events/EVP-026-mvp-human-approval-save-flow.md` | SAN-129 |
| EVP-027-mvp | events | P2 | `tasks/events/EVP-027-mvp-discovery-test-plan.md` | SAN-130 |
| EVP-028-mvp | events | P2 | `tasks/events/EVP-028-mvp-production-readiness.md` | SAN-131 |
| EVP-029-advanced | events | P2 | `tasks/events/EVP-029-advanced-sponsor-crm-lite.md` | SAN-132 |
| EVP-030-advanced | events | P3 | `tasks/events/EVP-030-advanced-openclaw-postiz-approval-sandbox.md` | SAN-133 |
| EVP-031-advanced | events | P3 | `tasks/events/EVP-031-advanced-openclaw-automation-plan.md` | SAN-134 |
| EVP-032-mvp | events | P1 | `tasks/events/EVP-032-mvp-luma-event-detail-layout.md` | SAN-135 |
| EVP-033-mvp | events | P1 | `tasks/events/EVP-033-mvp-event-vibe-ai-summary.md` | SAN-136 |
| EVP-034-mvp | events | P1 | `tasks/events/EVP-034-mvp-ask-host-ai-qa.md` | SAN-137 |
| EVP-035-mvp | events | P2 | `tasks/events/EVP-035-mvp-attendee-profiles-audience-breakdown.md` | SAN-138 |
| EVP-036-mvp | events | P2 | `tasks/events/EVP-036-mvp-community-map-nearby.md` | SAN-139 |
| EVP-037-mvp | events | P1 | `tasks/events/EVP-037-mvp-concierge-event-decision-chat.md` | SAN-140 |
| EVP-038-postmvp | events | P2 | `tasks/events/EVP-038-postmvp-ai-networking-matchmaking.md` | SAN-141 |
| EVP-039-postmvp | events | P3 | `tasks/events/EVP-039-postmvp-live-event-chat-rooms.md` | SAN-142 |
| EVP-040-postmvp | events | P2 | `tasks/events/EVP-040-postmvp-post-event-follow-up.md` | SAN-143 |
| EVP-041-advanced | events | P3 | `tasks/events/EVP-041-advanced-community-relationship-graph.md` | SAN-144 |
| EVP-042-mvp | events | P1 | `tasks/events/EVP-042-mvp-smart-recommendations-compatibility.md` | SAN-145 |
| EVP-043-mvp | events | P1 | `tasks/events/EVP-043-mvp-neighborhood-safety-transit-intelligence.md` | SAN-146 |
| EVP-044-mvp | events | P1 | `tasks/events/EVP-044-mvp-whatsapp-community-links.md` | SAN-147 |
| EVP-045-mvp | events | P2 | `tasks/events/EVP-045-mvp-host-pricing-moderation-basics.md` | SAN-148 |
| EVP-046-mvp | events | P2 | `tasks/events/EVP-046-mvp-live-event-updates.md` | SAN-149 |
| EVP-047-postmvp | events | P2 | `tasks/events/EVP-047-postmvp-ai-night-itinerary-builder.md` | SAN-150 |
| GS-005 | grounding | P2 | `tasks/grounding-search/tasks/GS-005-verify-ticket-venue-tools.md` | SAN-227 |
| GS-006 | grounding | P2 | `tasks/grounding-search/tasks/GS-006-tool-combination-spike.md` | SAN-228 |
| GS-007 | grounding | P3 | `tasks/grounding-search/tasks/GS-007-restaurant-closure-verify.md` | SAN-229 |
| GS-008 | grounding | P3 | `tasks/grounding-search/tasks/GS-008-neighborhood-news-search.md` | SAN-230 |
| GS-009 | grounding | P3 | `tasks/grounding-search/tasks/GS-009-sponsor-research-search.md` | SAN-231 |
| MAP-002A-ADK | maps | P2 | `tasks/maps/MAP-002A-ADK-agent-package.md` | SAN-101 |
| MAP-005 | maps | P1 | `tasks/maps/MAP-005-places-proxy-cache.md` | SAN-102 |
| MAP-006 | maps | P1 | `tasks/maps/MAP-006-nearby-search.md` | SAN-103 |
| MAP-010 | maps | P1 | `tasks/maps/MAP-010-place-autocomplete-venue.md` | SAN-104 |
| MAP-011 | maps | P2 | `tasks/maps/MAP-011-route-previews.md` | SAN-105 |
| MAP-012 | maps | P2 | `tasks/maps/MAP-012-neighborhood-intelligence.md` | SAN-106 |
| MAP-012A | maps | P2 | `tasks/maps/MAP-012A-colombia-aggregate-insights-spike.md` | SAN-107 |
| MAP-023 | maps | P3 | `tasks/maps/MAP-023-static-maps-event-previews.md` | SAN-108 |
| OCL-001-core | openclaw | P0 | `tasks/openclaw/tasks/OCL-001-core-gateway-health.md` | SAN-187 |
| OCL-002-core | openclaw | P0 | `tasks/openclaw/tasks/OCL-002-core-jobs-schema.md` | SAN-188 |
| OCL-003-core | openclaw | P0 | `tasks/openclaw/tasks/OCL-003-core-approval-workflow.md` | SAN-189 |
| OCL-004-core | openclaw | P0 | `tasks/openclaw/tasks/OCL-004-core-clawhub-safety.md` | SAN-190 |
| OCL-005-core | openclaw | P0 | `tasks/openclaw/tasks/OCL-005-core-kill-switch.md` | SAN-191 |
| OCL-006-core | openclaw | P0 | `tasks/openclaw/tasks/OCL-006-core-gemini-vps-config.md` | SAN-192 |
| OCL-007-core | openclaw | P0 | `tasks/openclaw/tasks/OCL-007-core-gateway-token-rotate.md` | SAN-193 |
| OCL-008-mvp | openclaw | P1 | `tasks/openclaw/tasks/OCL-008-mvp-admin-approvals-ui.md` | SAN-194 |
| OCL-009-mvp | openclaw | P1 | `tasks/openclaw/tasks/OCL-009-mvp-gemini-web-search.md` | SAN-195 |
| OCL-010-mvp | openclaw | P1 | `tasks/openclaw/tasks/OCL-010-mvp-tour-enrich-skill.md` | SAN-196 |
| OCL-011-mvp | openclaw | P1 | `tasks/openclaw/tasks/OCL-011-mvp-enqueue-openclaw-job.md` | SAN-197 |
| OCL-012-mvp | openclaw | P0 | `tasks/openclaw/tasks/OCL-012-mvp-e2e-approval-safety.md` | SAN-198 |
| OCL-013-mvp | openclaw | P0 | `tasks/openclaw/tasks/OCL-013-mvp-coffee-tour-crawler.md` | SAN-199 |
| OCL-014-postmvp | openclaw | P2 | `tasks/openclaw/tasks/OCL-014-postmvp-menu-extraction.md` | SAN-200 |
| OCL-015-postmvp | openclaw | P2 | `tasks/openclaw/tasks/OCL-015-postmvp-instagram-cafe-discovery.md` | SAN-201 |
| OCL-016-postmvp | openclaw | P2 | `tasks/openclaw/tasks/OCL-016-postmvp-venue-intelligence.md` | SAN-202 |
| OCL-017-postmvp | openclaw | P2 | `tasks/openclaw/tasks/OCL-017-postmvp-event-directory-import.md` | SAN-203 |
| OCL-018-postmvp | openclaw | P2 | `tasks/openclaw/tasks/OCL-018-postmvp-listing-enrichment.md` | SAN-204 |
| OCL-019-postmvp | openclaw | P2 | `tasks/openclaw/tasks/OCL-019-postmvp-sponsor-prospect-research.md` | SAN-205 |
| OCL-020-postmvp | openclaw | P2 | `tasks/openclaw/tasks/OCL-020-postmvp-seo-competitor-monitor.md` | SAN-206 |
| OCL-021-postmvp | openclaw | P2 | `tasks/openclaw/tasks/OCL-021-postmvp-correlation-observability.md` | SAN-207 |
| OCL-022-advanced | openclaw | P2 | `tasks/openclaw/tasks/OCL-022-advanced-wa-templates-allowlist.md` | SAN-208 |
| OCL-023-advanced | openclaw | P3 | `tasks/openclaw/tasks/OCL-023-advanced-event-reminders.md` | SAN-209 |
| OCL-024-advanced | openclaw | P3 | `tasks/openclaw/tasks/OCL-024-advanced-sponsor-roi-screenshots.md` | SAN-210 |
| OCL-025-advanced | openclaw | P3 | `tasks/openclaw/tasks/OCL-025-advanced-external-publish-draft.md` | SAN-211 |
| OCL-026-advanced | openclaw | P3 | `tasks/openclaw/tasks/OCL-026-advanced-contest-wa-ops.md` | SAN-212 |
| OCL-027-advanced | openclaw | P3 | `tasks/openclaw/tasks/OCL-027-advanced-postiz-handoff.md` | SAN-213 |
| OCL-030-postmvp | openclaw | P1 | `tasks/openclaw/tasks/OCL-030-postmvp-apify-plugin-sandbox.md` | SAN-214 |
| OCL-031-postmvp | openclaw | P1 | `tasks/openclaw/tasks/OCL-031-postmvp-event-sponsor-decision-maker-map.md` | SAN-215 |
| OCL-032-postmvp | openclaw | P1 | `tasks/openclaw/tasks/OCL-032-postmvp-sponsor-proposal-draft-pack.md` | SAN-216 |
| OCL-033-postmvp | openclaw | P2 | `tasks/openclaw/tasks/OCL-033-postmvp-event-vendor-recruitment-research.md` | SAN-217 |
| OCL-034-postmvp | openclaw | P2 | `tasks/openclaw/tasks/OCL-034-postmvp-event-social-intelligence.md` | SAN-218 |
| OCL-035-advanced | openclaw | P3 | `tasks/openclaw/tasks/OCL-035-advanced-approved-channel-campaigns.md` | SAN-219 |
| OCL-036-postmvp | openclaw | P1 | `tasks/openclaw/tasks/OCL-036-postmvp-repo-skill-intake-audit.md` | SAN-220 |
| OCL-037-postmvp | openclaw | P1 | `tasks/openclaw/tasks/OCL-037-postmvp-event-planner-checklist-adapter.md` | SAN-221 |
| OCL-038-postmvp | openclaw | P2 | `tasks/openclaw/tasks/OCL-038-postmvp-event-source-connector-adapters.md` | SAN-222 |
| OCL-039-postmvp | openclaw | P2 | `tasks/openclaw/tasks/OCL-039-postmvp-event-source-health-monitor.md` | SAN-223 |
| OCL-040-postmvp | openclaw | P1 | `tasks/openclaw/tasks/OCL-040-postmvp-event-page-qa-crawler.md` | SAN-224 |
| OCL-041-advanced | openclaw | P3 | `tasks/openclaw/tasks/OCL-041-advanced-live-ops-ticker.md` | SAN-225 |
| OCL-042-mvp | openclaw | P2 | `tasks/openclaw/tasks/OCL-042-mvp-clawevents-medellin-automation.md` | SAN-226 |
| OPS-ANDRES-G1 | ops | P0 | `todo.md` | SAN-178 |
| CAFE-001 | screens | P1 | `tasks/screens/CAFE-001-booking-requests-schema.md` | SAN-109 |
| SCREEN-002 | screens | P0 | `tasks/screens/SCREEN-002-chat-nav-rail.md` | SAN-110 |
| SCREEN-010 | screens | P1 | `tasks/screens/SCREEN-010-map-exploration-panel.md` | SAN-111 |
| SCREEN-017 | screens | P1 | `tasks/screens/SCREEN-017-login-signup-polish.md` | SAN-112 |
| SCREEN-018 | screens | P0 | `tasks/screens/SCREEN-018-mobile-responsive-shell.md` | SAN-113 |
| VEC-001 | vector | P0 | `tasks/vector/VEC-001-pgvector-inventory-and-duplicate-index-plan.md` | SAN-151 |
| VEC-002 | vector | P0 | `tasks/vector/VEC-002-semantic-v1-schema-and-rls-plan.md` | SAN-152 |
| VEC-003 | vector | P0 | `tasks/vector/VEC-003-model-registry-and-embedding-contract.md` | SAN-153 |
| VEC-004 | vector | P0 | `tasks/vector/VEC-004-embedding-text-builders.md` | SAN-154 |
| VEC-005 | vector | P0 | `tasks/vector/VEC-005-semantic-eval-harness.md` | SAN-155 |
| VEC-006 | vector | P1 | `tasks/vector/VEC-006-semantic-search-logs-and-observability.md` | SAN-156 |
| VEC-007 | vector | P1 | `tasks/vector/VEC-007-coffee-tour-vector-compatibility.md` | SAN-157 |

---

## Notes

- **Done** tasks intentionally omitted from CSV (Linear best practice: import open work only).
- Prior GraphQL import: `tasks/linear/import-log.json` (SAN-95…SAN-178, 84 issues, 107 block relations).
- Re-run CSV generator: `node scripts/linear-generate-import-csv.mjs` with `LINEAR_API_KEY` from `.env.local`.
- Spec files remain source of truth under `tasks/`; flip `status: Done` + evidence when shipping.

