---
title: Example — Image Analysis (mdeai)
source: https://mastra.ai/examples/v0/agents/image-analysis
journeys: [J5]
personas: [Roberto]
phase: W4+
---

# Image Analysis — mdeai

**Official:** [Image Analysis](https://mastra.ai/examples/v0/agents/image-analysis)

Multimodal `.generate()` with `content: [{ type: "image", image, mimeType }, { type: "text", text }]`. Gemini supports images via `@ai-sdk/google` on `gemini-3.5-flash` or `gemini-3.1-pro-preview` for hard forms.

---

## Feature summary

| Capability | mdeai surface | Phase |
|------------|---------------|-------|
| Venue photo → description | `/host/event/new` upload | W4+ |
| Banner / poster critique | Host sidebar | W4+ |
| Map screenshot → “is this the right barrio?” | Defer | Phase 2 |
| Rental listing photos | Supabase URLs in cards, not vision in W1 | — |

**Env:** `GOOGLE_GENERATIVE_AI_API_KEY` (already mdeapp). No Unsplash — use host uploads or Places photos.

---

## User stories

**Roberto — venue image (J5)**  
As Roberto, I upload a rooftop photo; `hostEventAgent` returns a one-line venue description and suggested alt text for the event page — I confirm before publish.

**Roberto — flyer draft**  
As Roberto, I paste an event flyer image; the agent extracts date, title, and neighborhood hints into `EventDraftState` (human verifies — no auto-publish).

**Camila**  
As Camila, listing images stay **URLs from `search-rentals`**; vision-based “what’s in this apartment?” is Phase 2+ (cost guardrails).

---

## Real-world mdeai examples

| Input | Agent | Output use |
|-------|-------|------------|
| `hostEventAgent` + image part | W3+ agent | Fill `EventDraftState.venueImageDescription` |
| Places `photoUri` in tool JSON | Card UI only | No extra vision call in Phase 1 |
| CopilotKit | Same runtime as text | Stream vision tokens via AG-UI |

**Model rule:** Default `FLASH_MODEL`; switch to `gemini-3.1-pro-preview` only if form-fill from dense posters fails ([`../03-best-practices.md`](../03-best-practices.md)).

---

## Journey — J5 extension (image)

1. Roberto uploads image in wizard.
2. Frontend sends multimodal message through CopilotKit (or pre-process server-side).
3. Agent updates working memory / `EventDraftState`.
4. HITL publish unchanged.

**Acceptance**

- [ ] Image never sent to client-side-only model — server route only
- [ ] Extracted fields editable before DB write
- [ ] No Anthropic models in path

---

## CopilotKit note

Confirm CopilotKit 1.55.2 multimodal path for sidebar attachments before shipping; if unsupported, use server action to analyze image then pass text summary into chat ([tool-rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering) for results).

**Related:** [`../04-user-stories.md`](../04-user-stories.md) J5 · MAP-001 map pins separate from vision
