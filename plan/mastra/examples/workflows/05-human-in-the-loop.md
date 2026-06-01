---
title: Workflow — Human-in-the-loop (mdeai)
source: https://mastra.ai/docs/workflows/human-in-the-loop
journeys: [J5]
personas: [Roberto]
phase: 1
---

# Human-in-the-loop (HITL) — mdeai

**Official:** [Human-in-the-loop](https://mastra.ai/docs/workflows/human-in-the-loop)

HITL = `suspend()` with a **reason** the UI shows, then `resume({ resumeData })` or `bail()` if Roberto rejects.

---

## mdeai implementation (Phase 1)

**Roberto's publish gate** uses **CopilotKit**, not Mastra workflow suspend:

| Piece | Path |
|-------|------|
| Agent tool | `preview_and_publish` (W3+ `hostEventAgent`) |
| UI | `useCopilotAction` + `renderAndWaitForResponse` |
| User | Roberto on `/host/event/new` |

Same **persona story** as Mastra HITL docs — different transport until F13 + workflow publish lands.

---

## User stories

**Roberto (J5)**  
As Roberto, I see “Publish Medellín AI listing?” with ticket summary; until I tap **Confirm**, no `events` row is created — same as official `suspend({ reason: 'Human approval required.' })`.

**Roberto (reject)**  
As Roberto, I tap **Cancel** — `bail({ reason: 'User rejected' })` or CK `respond({ approved: false })` ends the flow without error spam.

**Patricia**  
As Patricia, multi-step sponsor approval (Phase 2) chains two suspends — finance then host — like Mastra multi-turn HITL example.

---

## Journey — J5 publish (CopilotKit)

1. Roberto: “Publish now.”
2. Agent calls `preview_and_publish` → sidebar shows **EventPreviewCard** (generative UI).
3. Roberto edits tier price in card → `respond({ approved: true, tiers })`.
4. Tool writes Supabase (service role in edge fn, not client).
5. Assistant: “Live at /events/…”

**Do not** stream full event JSON in model prose — card + WM ([09-working-memory-schema](../09-working-memory-schema.md)).

**Phase 2:** Replace step 2–3 with workflow `suspend` + same React sheet posting to `/api/host/resume`.

**Related:** [04-suspend-and-resume](04-suspend-and-resume.md) · [CopilotKit interrupt flow](https://docs.copilotkit.ai/mastra/human-in-the-loop/interrupt-flow)
