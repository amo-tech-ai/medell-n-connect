---
title: Domain — Google Maps + CopilotKit
journeys: [J2, J4, J9]
tasks: [MAP-001, MAP-002]
phase: 1-W5+
---

# Google Maps — mdeai

**Strategy:** [`tasks/maps/notes.md`](../../../maps/notes.md) — server tools → normalized pins → `MapContext` → vis.gl.

```text
/chat | /rentals → CopilotKit → Mastra tools → Places / Grounding (server)
                              ↓
                    mergePinsByCategory → <Map mapId> + <AdvancedMarker>
```

---

## Mastra integration (not browser)

| API | Mastra surface | Persona |
|-----|----------------|---------|
| Places API (New) | Future tool / edge | Camila listings with `lat/lng` |
| Grounding Lite MCP | `MCPClient` on `conciergeAgent` | Tourist J9 |
| `@vis.gl/react-google-maps` | React — **not** Mastra | All map UIs |

**Hard rules:** `X-Goog-FieldMask` on every call; parent `<Map mapId="...">` ([CLAUDE.md](../../../../CLAUDE.md)).

---

## User stories

1. **Camila** — Rental pins on `/rentals` map match `search-rentals` tool coordinates only.
2. **Tourist** — Restaurant suggestions tie to `placeId` for pin + attribution (MAP-002).
3. **Roberto** — Event venue picker uses Places autocomplete (frontend tool W4) — separate from concierge map.
4. **Lucía** — E2E asserts marker count = tool result count; no orphan pins.
5. **Sofía** — No `NEXT_PUBLIC` server keys for Places in agent tools; MCP/edge only.

---

## CopilotKit patterns

| Pattern | Use |
|---------|-----|
| [tool-rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering) | Cards with `lat`, `lng`, `placeId` |
| [state-rendering](https://docs.copilotkit.ai/mastra/generative-ui/state-rendering) | Optional `useCoAgentStateRender` for map state (see `canvas/mastra`) |
| [mcp-apps](https://docs.copilotkit.ai/mastra/generative-ui/mcp-apps) | Grounding widget Phase 2 |
| [frontend-tools](https://docs.copilotkit.ai/mastra/frontend-tools) | Map pan/zoom feedback to agent (careful scope) |

---

## vs Mastra Browser

| Approach | When |
|----------|------|
| Maps APIs + MCP | **Default** — production |
| [AgentBrowser](../browser/02-agent-browser.md) | Staging QA only |
| Scraping Google Maps HTML | **Forbidden** |

---

## Journeys

- **J2** — Camila rental map
- **J4 / J9** — Tourist restaurant/attraction pins
- **MAP-001** — vis.gl foundation
- **MAP-002** — Grounding Lite MCP

**Related:** [`tasks/audit/09-maps-audit.md`](../../../audit/09-maps-audit.md) · [03-restaurants-tourist](03-restaurants-tourist.md)
