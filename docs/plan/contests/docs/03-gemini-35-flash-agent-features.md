---
title: Gemini 3.5 Flash Agent Features
status: Strategic appendix
date: 2026-05-24
source_note: Re-verified through official Gemini API docs MCP on 2026-05-24; re-check model IDs and deprecations before implementation.
related:
  - ./prd-event-contest.md
  - ./architecture.md
---

# Gemini 3.5 Flash Agent Features

Gemini 3.5 Flash should be the default planning target for MVP agent workflows if it remains current at implementation time. The official Gemini docs snippets returned by the MCP describe Gemini 3.5 Flash as optimized for real-world workflows, with 1M token context, high output capacity, thinking, tool-oriented capabilities, and current deprecation guidance.

## Model Selection Rule

| Workflow type | Preferred model/API | Reason |
|---|---|---|
| Low-latency organizer chat | Gemini 3.5 Flash | Fast enough for CopilotKit conversational UI. |
| Sponsor lead scoring | Gemini 3.5 Flash | High-volume classification with evidence. |
| WhatsApp AI | Gemini 3.5 Flash | Short replies and tool-backed answers. |
| AI marketing drafts | Gemini 3.5 Flash | Low-cost content variation. |
| Voting integrity summaries | Gemini 3.5 Flash | Summarizes deterministic signals without changing ledgers. |
| Complex enterprise proposal | Pro-tier Gemini model, verified at implementation time | Escalation only; do not assume a specific Pro id without docs. |
| Live producer copilot | Gemini Live API | Only when voice/video/realtime interaction is truly needed. |
| Geo intelligence | Gemini + ADK + Maps/Grounding | Tool-backed place facts and route context. |
| Multimodal contestant/media review | Multimodal Gemini model, verified at implementation time | Human moderation still decides. |

## Gemini 3.5 Flash Impact By Product Area

| Product area | Improvement |
|---|---|
| Long-running workflows | Large context reduces premature memory complexity by letting Mastra pass contest state, prior approvals, and tool outputs into bounded workflow steps. |
| Multi-agent orchestration | Mastra remains the orchestrator; Gemini performs reasoning within each step. |
| Tool calling | Agents can call Supabase reads, ADK geo tools, Postiz draft tools, approval tools, and OpenClaw job tools. |
| Subagents | Use bounded subagents for venue, sponsorship, voting integrity, and marketing. Avoid autonomous swarms. |
| Realtime event experiences | Fast summaries for check-in, voting windows, and producer dashboards. |
| Sponsor workflows | Evidence-based fit scoring, package ideas, proposal drafts, and ROI narratives. |
| Conversational UI | Structured outputs feed CopilotKit cards rather than uncontrolled long text. |
| WhatsApp AI | Short, grounded replies and template drafts with send approval. |
| OpenClaw orchestration | Converts scraped evidence into ranked drafts while OpenClaw remains sandboxed. |
| Geo intelligence | Uses ADK and Maps/Grounding to avoid invented venues or sponsor locations. |
| AI marketing | Creates campaign variants, share prompts, reels ideas, and Postiz drafts. |
| Live event copilots | Helps Patricia and the producer see what needs attention without controlling outcomes. |

## Capability Table

| Capability | Use in Miss Medellin Finals | Guardrail |
|---|---|---|
| Long context | Include contest rules, sponsor brief, current approvals, and source evidence. | Do not pass raw unnecessary PII. |
| Tool calling | Read Supabase, create approval requests, call ADK, queue Postiz/OpenClaw drafts. | Tools enforce permissions and approval ids. |
| Structured output | Contest drafts, sponsor scores, campaign cards, anomaly summaries. | Validate with Zod before display/write. |
| Thinking controls | Use for complex proposal/fraud triage steps. | Keep normal fan chat low-latency. |
| Grounding | Sponsor/venue/tourism facts. | Store sources in Supabase. |
| Live API | Future voice/video producer copilot. | Not MVP default. |

## Model Planning Table

| Model/API family | Planning stance | Best workflows | Caveat |
|---|---|---|---|
| Gemini 3.5 Flash | MVP default if current | Contest setup, sponsor scoring, WhatsApp, marketing, integrity summaries | Re-verify before coding. |
| Gemini Pro tier | Escalation | Complex proposals, deep analysis, multimodal review | Use sparingly; verify exact current model id. |
| Gemini Live APIs | Future live event layer | Voice producer copilot, live moderation summaries | Not needed for ordinary dashboards. |
| Grounding APIs | Required where facts matter | Venue, sponsor, tourism, routes | Still cache sources and field-mask Maps calls. |
| Tool-use capabilities | Required for all agents | Deterministic reads/drafts/approval flows | Never bypass Supabase/Stripe truth. |

## Latency and Cost Guidance

| Workflow | Latency target | Cost posture |
|---|---:|---|
| Fan voting Q&A | High sensitivity | Flash only, short context. |
| WhatsApp reminder reply | High sensitivity | Flash, template-bounded. |
| Organizer contest setup | Medium | Flash with structured output. |
| Sponsor proposal | Low | Flash first; Pro escalation only. |
| Fraud review summary | Medium | Flash from SQL signals. |
| Live producer assistant | High | Flash or Live API if voice/video. |
| Overnight OpenClaw enrichment | Low | Batch Flash summaries. |

