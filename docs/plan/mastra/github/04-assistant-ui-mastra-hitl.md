---
title: GitHub — assistant-ui mastra-hitl
repo: https://github.com/assistant-ui/mastra-hitl
demo: https://aui-mastra-hitl.vercel.app/
score: 72
traffic: yellow
journeys: [J5]
personas: [Roberto, Sofía]
---

# mastra-hitl (Assistant UI)

## At a glance

| | |
|---|---|
| **What it is** | Mandatory **plan → approve → execute** agent with custom tool UIs (todos, email draft, human input). |
| **Purpose** | UX reference for **Roberto**-grade HITL — adapt to **CopilotKit**, not Assistant UI runtime. |
| **Goals** | `askForPlanApproval`, `updateTodos`, `proposeEmail` → mdeai `renderAndWaitForResponse` equivalents. |
| **What it does** | Next.js + Assistant UI + Mastra tools blocking until human acts. |
| **Benefits** | Shows todo transparency + re-approval when scope creeps — good for event publish wizard. |
| **mdeai** | Phase 1 = CK HITL on `/host/event/new`; not `makeAssistantToolUI`. |

---

## Score: 72/100 🟡

High HITL value; **−25** for wrong UI framework vs CopilotKit 1.55.2.

---

## Learn → adapt

| HITL tool (upstream) | mdeai (CopilotKit) |
|----------------------|---------------------|
| `askForPlanApprovalTool` | `preview_and_publish` + approve button |
| `updateTodosTool` | `EventDraftState` + `useCoAgent` state panel |
| `proposeEmailTool` | Sponsor email preview (Phase 2) |
| `requestInputTool` | Missing venue field prompt in wizard |

Copy **workflow rules** (never act without approval) into `hostEventAgent` instructions.

---

## Domain matrix

| Domain | Score impact |
|--------|----------------|
| Events | 🟢 Primary — Roberto publish |
| Rentals | 🟡 — optional “confirm before contact landlord” |
| Restaurants | — |
| Contests | — |

---

## User stories

**Roberto:** As Roberto, I see a checklist of wizard steps and must approve before tickets go live — like plan approval in the demo.

**Sofía:** As Sofía, I port the “rejected plan → revise” loop to CK interrupt semantics.

---

## Journey — J5 (adapted)

1. Agent fills `EventDraftState` steps.
2. Tool renders publish preview; Roberto edits or rejects.
3. `respond({ approved })` continues agent.
4. Phase 2: Mastra `suspend()` mirrors same UX server-side ([`../examples/workflows/05-human-in-the-loop.md`](../examples/workflows/05-human-in-the-loop.md)).

**Catalog:** [`../04-user-stories.md`](../04-user-stories.md) § J5.
