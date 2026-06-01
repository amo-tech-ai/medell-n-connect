---
id: CTEST-005
title: Mastra and Gemini contest workflows
status: Draft
priority: P0
phase: Contest AI workflows
effort: 2-3d
depends_on:
  - CTEST-002
  - CTEST-004
skill:
  - mastra
  - gemini
docs:
  - ../docs/01-mermaid-diagrams.md
  - /home/sk/mdeai/.claude/skills/copilotkit-integrations/references/integrations/mastra.md
---

# CTEST-005 — Mastra And Gemini Contest Workflows

## Goal

Add minimal Mastra workflows and Gemini structured-output prompts for contest setup, sponsor proposal drafts, and vote integrity summaries.

## Agents / Workflows

| Name | Type | Allowed | Forbidden |
|---|---|---|---|
| `contestHostAgent` | Mastra agent | Draft contest setup, ask questions, create approval requests | Publish without approval |
| `votingIntegrityAgent` | Mastra agent | Read anomaly summaries and explain ledger state | Insert/update/delete votes or winners |
| `sponsorAgent` | Mastra workflow/agent | Draft sponsor packages and proposal copy | Send outreach or create contracts |
| `contestantCoachAgent` | Later/minimal | Profile polish and campaign copy drafts | Submit profile approval |

## Tools

| Tool id | Purpose | Commit boundary |
|---|---|---|
| `draft_contest_setup` | Creates structured draft | Draft only |
| `queue_contest_publish_approval` | Inserts approval request | Approval row |
| `summarize_vote_integrity` | Reads safe views | Read-only |
| `draft_sponsor_proposal` | Creates proposal draft | Draft only |
| `queue_sponsor_proposal_approval` | Inserts approval request | Approval row |

## Gemini Rules

- Use the current project-approved Gemini model only after implementation-time verification.
- Structured outputs must validate with Zod.
- AI output is draft-only unless an approved deterministic API/RPC commits it.
- Prompt tests must check refusal boundaries for votes, winners, payments, contracts, outreach, and bans.

## Acceptance Criteria

- [ ] Agents are registered in `src/mastra/**`.
- [ ] Working memory schema matches TypeScript types.
- [ ] Tool ids match CopilotKit render/action names.
- [ ] Every workflow writes `ai_runs`.
- [ ] Unsafe action attempts are blocked and audited.

## Tests / Proof

- [ ] Mastra workflow replay for contest draft.
- [ ] Mastra workflow replay for sponsor proposal draft.
- [ ] Negative eval: "make contestant X winner" is refused/blocked.
- [ ] Negative eval: "send sponsor DM now" is refused/queued for approval.
- [ ] SQL proof: `ai_runs` row for every workflow path.

## Do Not Do

- Do not create a swarm of agents.
- Do not let agent tools write canonical ledgers directly.
- Do not use non-Gemini production models.
