---
id: MAP-002B
title: Production ADK sidecar — Cloud Run + Vercel env
status: Not Started
priority: P0
phase: MVP-hardening — blocks Vercel grounded search
effort: 3-4h
owner: claude
depends_on: [MAP-002]
blocks: [MAP-005, MAP-006, MAP-011]
skill: [mde-maps, mde-vercel, google-agents-cli-adk-code, mde-task-lifecycle]
prd_ref: ./docs/maps-audit-2.md
related:
  - ../../services/adk-grounding/scripts/deploy-cloud-run.sh
  - ../../tasks/ADK/docs/12-cloud-run-production-plan.md
  - ../archive/maps-A/MAP-002-grounding-attribution.md
description: Deploy ADK grounding sidecar to Cloud Run; wire ADK_GROUNDING_URL + ADK_INTERNAL_TOKEN on Vercel preview/prod.
linear: SAN-368
---

# MAP-002B — Production ADK deploy

## At a glance

**Problem:** Mastra defaults `ADK_GROUNDING_URL` to `http://localhost:8000`. Vercel production **cannot** reach localhost — Camila's café queries fail grounded.

**Fix:** Cloud Run revision + Vercel env + smoke from preview URL.

## Prerequisites (Secret Manager)

| Secret | Used by |
|--------|---------|
| `GOOGLE_MAPS_SERVER_API_KEY` | Grounding Lite MCP |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Optional fallback paths |
| `ADK_INTERNAL_TOKEN` | Sidecar auth |
| `SUPABASE_URL` | `place_details_cache` enrich |
| `SUPABASE_SERVICE_ROLE_KEY` | Cache writes (sidecar only) |

Deploy script: `services/adk-grounding/scripts/deploy-cloud-run.sh`

## Vercel env (preview + production)

```text
ADK_GROUNDING_URL=https://mdeai-adk-grounding-<hash>.run.app
ADK_INTERNAL_TOKEN=<same as Secret Manager>
```

**Do not** expose `ADK_INTERNAL_TOKEN` as `NEXT_PUBLIC_*`.

## Acceptance criteria

- [ ] Cloud Run service healthy (`curl /health` or invoke probe)
- [ ] `npm run verify:grounding` passes against **remote** URL (not localhost)
- [ ] `npm run smoke:grounding-attribution` from mdeapp with prod/preview env
- [ ] Vercel preview: café query returns ≥1 grounded pin + attribution
- [ ] Sidecar rejects requests without valid `ADK_INTERNAL_TOKEN` (401)
- [ ] Evidence: `tasks/notes/MAP-002B-evidence.md` with revision id + redacted URL

## Verification

```bash
cd /home/sk/mdeai/mdeapp
ADK_GROUNDING_URL=https://... ADK_INTERNAL_TOKEN=... npm run verify:grounding
ADK_GROUNDING_URL=https://... npm run verify:cloud-run-grounding  # if script exists
```

## Out of scope

- MAP-002A full ADK LlmAgent package
- Moving MCP into Mastra TS
- `compute_routes` (MAP-011A)

## Definition of Done

AC + evidence + Patricia can triage sidecar logs on Cloud Run.
