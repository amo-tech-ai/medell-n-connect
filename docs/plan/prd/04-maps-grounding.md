---
doc: 04-maps-grounding
purpose: Map pipeline, MAP-001–012, geo truth, /chat map UX
depends_on: 03-runtime-orchestration.md, 07-contracts-schemas.md
replaces: plan/maps/maps-prd.md (canonical summary; deep spec linked)
audience: maps + concierge engineers
complexity: L
generates_tasks: MAP-001–012, F16, F43
---

# 04 — Maps + grounding

> [← Runtime](./03-runtime-orchestration.md) · [Deep spec: maps-prd.md](../maps/maps-prd.md)

## Document spec

| Field | Value |
|-------|-------|
| **Deep appendix** | [`plan/maps/maps-prd.md`](../maps/maps-prd.md) |
| **Implementation impact** | Blocks all persona-visible geo proof |
| **Tasks** | MAP-001–012, F16, CHAT-CENTRAL map column |

---

## 1. North star

When Camila asks for a neighborhood, the **map proves** the answer — pins from tools, not model prose.

**Forbidden in LLM output:** `lat`, `lng`, `place_id`, Maps URLs, hours, distances.

---

## 2. MAP-001 (critical path)

```text
User message → router/workflow → Mastra tool (Zod out)
  → useCopilotAction(render) → normalize → MapContext.mergePinsByCategory
  → vis.gl AdvancedMarker[]
```

**Done proof:** Playwright asserts pin count ≥ 3 after grounded query.

---

## 3. MAP phases (summary)

| ID | MVP? | Deliverable |
|----|------|-------------|
| MAP-001 | **Yes** | Tool → pins pipeline |
| MAP-002–003 | **Yes** | Grounding + attribution UI |
| MAP-004–006 | Next | Places proxy, cache, nearby |
| MAP-007 | **Yes** | `/chat` 3-panel + MapContext |
| MAP-008–012 | Post-MVP | Routes, ECL, moderation, quotas dashboard |

Full table: [maps-prd.md §7](../maps/maps-prd.md).

---

## 4. MapContext rules

1. **Single writer:** `mergePinsByCategory` only  
2. **`mapId` on `<Map>`** — AdvancedMarker requirement  
3. **Categories:** `rental`, `event`, `restaurant`, `attraction`, `grounded`, `venue`  
4. **Read-only agent map state:** `useCoAgentState` — agent never calls `setPins`  

---

## 5. APIs

| Need | Path |
|------|------|
| Places autocomplete | edge `places-proxy` + masks |
| Grounding discovery | Mastra `searchGroundedPlaces` |
| Cost control | `places_search_cache`, `grounding_quota_log` |

---

## 6. `/chat` layout (CHAT-CENTRAL)

```text
| chat (40%) | cards (35%) | map (25%) |
```

Mobile: map sheet over cards. Canonical: [`docs/CHAT-CENTRAL-PLAN.md`](../../docs/CHAT-CENTRAL-PLAN.md).

---

## 7. Repo truth

| Built | Missing |
|-------|---------|
| — | Entire map stack in `mdeapp/` |

Legacy map in `/home/sk/mde/` — port patterns only.

---

## 8. PR alignment

- **PR-1:** contracts + MAP-001 + `/chat` shell  
- **PR-2:** MAP-002–003  

See [10-delivery-roadmap.md](./10-delivery-roadmap.md).
