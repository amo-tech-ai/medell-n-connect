---
id: INT-009
title: CopilotKit readable UI state
phase: MVP
priority: P1
status: Not Started
owner_system: [CopilotKit]
personas: [Camila, Tourist]
depends_on: [INT-003]
unblocks: [INT-010, INT-013]
linear_title: "INT-009 — CopilotKit readable UI state"
linear_labels: [intelligence, mvp, p1, copilotkit]
implements: []
related_re: []
related_vec: []
---

# INT-009 — CopilotKit readable UI state

## Problem

Agent does not see map viewport, selected pin, or active filters unless user types them.

## User story

As **Camila**, when I pan the map to Envigado, the agent should know my map context without re-typing.

## Example prompt

User selects rental pin → asks “how walkable is this?” — agent reads `selectedPinId` from readable state.

## Implementation steps

1. Add `useCopilotReadable` for `mapUi` (viewport, selectedPinId, pin counts)
2. Mirror `useCoAgent` state where duplicated
3. Document in `copilotkit-develop` skill usage
4. Concierge instructions: prefer readable state for location bias

## Files likely touched

- `mdeapp/src/components/chat/chat-filter-copilot-instructions.tsx`
- `mdeapp/src/components/maps/` (readable providers)
- `mdeapp/src/mastra/lib/grounding-location-bias.ts`

## Data requirements

`ConciergeWorkingMemory.mapUi` already partial — align shapes.

## RLS / security

No PII in readable payloads.

## Tests

- Component test: readable registers on map move
- Agent test: location bias uses viewport

## Acceptance criteria

- [ ] At least map viewport + selectedPinId readable
- [ ] CopilotKit 1.55.2 only (no v2 mix)

## Failure points

- Readable payload too large (trim fields)

## Dependencies

INT-003

## Verify

```bash
cd mdeapp && npm run dev
# Browser: select pin, ask walkability
```
