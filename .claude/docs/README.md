---
title: "`.claude/docs/` — mirrored Anthropic documentation"
description: "Read-only reference material. Mirrors of official docs from docs.claude.com, fetched on demand. **Source of truth** when a topic comes up — quote these, not your training data."
category: "root"
---
# `.claude/docs/` — mirrored Anthropic documentation

Read-only reference material. Mirrors of official docs from docs.claude.com, fetched on demand. **Source of truth** when a topic comes up — quote these, not your training data.

Refresh via `node scripts/update-mirrors.mjs` (auto-matches files to the `code.claude.com/docs/llms.txt` + `platform.claude.com/llms.txt` indexes; fetch those two indexes to `/tmp/cc-llms.txt` and `/tmp/pc-llms.txt` first), then `node scripts/update-mirrors-explicit-map.mjs` for the renamed/ambiguous pages. Last full refresh: **2026-06-09**. Note: docs.claude.com now redirects to platform.claude.com; the `agents/` subtree mirrors the **Managed Agents** docs (`platform.claude.com/docs/en/managed-agents/`).

---

## Subtree map

| Subtree | What it covers | Files | Primary skill home |
|---------|---------------|-------|---------------------|
| [`claude-code/`](claude-code/) | Claude Code (the CLI) — architecture, workflows, settings, plugins, MCP | 21 | [`working-with-claude-code`](../skills/working-with-claude-code/) |
| [`reference/`](reference/) | Claude Code reference material — tools, hooks, commands, env vars, glossary | 10 | distributed (see distribution table) |
| [`skills/`](skills/) | Anthropic Skills — quickstart, best-practices, enterprise, overview | 5 | [`skill-development`](../skills/skill-development/) + [`mde-prompting`](../skills/mde-prompting/) |
| [`tools/`](tools/) | Anthropic API **tool use** — server tools, custom tools, advanced patterns | 21 | [`mde-tool-use`](../skills/mde-tool-use/) |
| [`agents/`](agents/) | Anthropic Managed Agents API — sessions, environments, multi-agent | 17 | [`mde-agents`](../skills/mde-agents/) |
| [`agents/cookbooks/`](agents/cookbooks/) | **Anthropic-authored end-to-end cookbooks** — managed agents tutorial, multi-agent coordinator, context engineering, memory, SRE, observability, chief-of-staff, agents-with-user-memory | 8 | [`mde-agents`](../skills/mde-agents/) |
| [`prompts/`](prompts/) | Prompt engineering — best practices, consistency, latency, jailbreaks | 9 | [`mde-prompting`](../skills/mde-prompting/) |
| [`best-practices/`](best-practices/) | **mdeai-authored** synthesis docs (NOT mirrors) — Outcomes plan, `.claude/` audit + best-practices guide, Claude Code best-practices mirror | 5 | maintained in-repo |

**Total: 91 mirrored documents + 5 mdeai-authored synthesis docs.**

---

## `best-practices/` — mdeai-authored synthesis (read first when planning .claude/ changes)

These are **not** doc mirrors; they are the canonical mdeai play-by-play for how to use Claude Code in this repo. Read these before changing hooks, skills, agents, or outcome rubrics.

| File | One-line |
|------|----------|
| [01-outcomes-plan.md](best-practices/01-outcomes-plan.md) | Phase-1 Outcomes-based verification plan — 4 starter rubrics (PR review, Supabase migration, Maps/Grounding, Events ticketing), implementation roadmap, guardrails |
| [02-best-practices-guide.md](best-practices/02-best-practices-guide.md) | Full `.claude/` audit — hooks/skills/agents/rules/MCP scoring, multi-agent topology, context optimization, revised phased rollout (Week 1/2/3+), cookbook adoption map |
| [best-practices.md](best-practices/best-practices.md) | Mirror of `https://anthropic.com/engineering/claude-code-best-practices` |
| [common-workflows.md](best-practices/common-workflows.md) | Mirror of `docs.claude.com` common workflows |
| [how-claude-code-works.md](best-practices/how-claude-code-works.md) | Mirror of architecture doc (also in `claude-code/`) |

---

## `claude-code/` — Claude Code CLI

| File | One-line |
|------|----------|
| [features-overview.md](claude-code/features-overview.md) | What Claude Code is, top-level capabilities |
| [how-claude-code-works.md](claude-code/how-claude-code-works.md) | Internal architecture — agentic loop, context, tools |
| [best-practices.md](claude-code/best-practices.md) | **The 9 patterns**: verification-first, Explore→Plan→Code, specific context, CLAUDE.md authoring, permissions/auto mode, hooks, sessions, Writer/Reviewer, automation |
| [common-workflows.md](claude-code/common-workflows.md) | Worked-example workflows (init, refactor, debug, ship) |
| [claude-directory.md](claude-code/claude-directory.md) | The `.claude/` directory layout |
| [settings.md](claude-code/settings.md) | `.claude/settings.json` schema and options |
| [permissions.md](claude-code/permissions.md) | Permission rule syntax + tool-specific rules |
| [permission-modes.md](claude-code/permission-modes.md) | Permission modes (default, acceptEdits, bypassPermissions, plan) |
| [sandboxing.md](claude-code/sandboxing.md) | Sandbox model + escape conditions |
| [memory.md](claude-code/memory.md) | Persistent memory across sessions (CLAUDE.md hierarchy + `/memory`) |
| [context-window.md](claude-code/context-window.md) | Context budget, what fills it, how to keep it lean |
| [sub-agents.md](claude-code/sub-agents.md) | Subagent definition (`.claude/agents/*.md`), description triggering, `tools:` constraint |
| [agent-teams.md](claude-code/agent-teams.md) | Experimental multi-subagent orchestration (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) |
| [mcp.md](claude-code/mcp.md) | MCP servers — connect, list, scale via tool search |
| [discover-plugins.md](claude-code/discover-plugins.md) | Browsing/installing plugins from marketplaces |
| [output-styles.md](claude-code/output-styles.md) | Configuring response style |
| [model-config.md](claude-code/model-config.md) | Selecting Opus/Sonnet/Haiku per task |
| [terminal-config.md](claude-code/terminal-config.md) | Terminal integration |
| [costs.md](claude-code/costs.md) | Pricing model, monitoring spend |
| [effort.md](claude-code/effort.md) | Effort/thinking-budget controls |
| [changelog.md](claude-code/changelog.md) | Version history |

---

## `reference/` — distributed reference material

These docs are mirrored once into `docs/reference/`, then `cp -L`'d into the relevant skill's `references/` folder. Keep both in sync; canonical copy is here.

| File | Distributed to |
|------|----------------|
| [tools-reference.md](reference/tools-reference.md) | `working-with-claude-code/references/` (canonical for built-in tool catalog) |
| [hooks.md](reference/hooks.md) | `working-with-claude-code/references/` and `hook-development/references/` |
| [commands.md](reference/commands.md) | `command-development/references/` |
| [plugins-reference.md](reference/plugins-reference.md) | `working-with-claude-code/references/` |
| [cli-reference.md](reference/cli-reference.md) | `working-with-claude-code/references/` |
| [interactive-mode.md](reference/interactive-mode.md) | `working-with-claude-code/references/` |
| [channels-reference.md](reference/channels-reference.md) | `working-with-claude-code/references/` |
| [checkpointing.md](reference/checkpointing.md) | `working-with-claude-code/references/` |
| [env-vars.md](reference/env-vars.md) | `working-with-claude-code/references/` |
| [glossary.md](reference/glossary.md) | `working-with-claude-code/references/` |

---

## `skills/` — Anthropic Skills system

| File | One-line |
|------|----------|
| [overview.md](skills/overview.md) | What Skills are, when to write one |
| [quickstart.md](skills/quickstart.md) | Authoring a SKILL.md, frontmatter, trigger description |
| [best-practices.md](skills/best-practices.md) | 3-level progressive disclosure, ≤1024-char description, references/, scripts/ |
| [skills-guide.md](skills/skills-guide.md) | Full authoring guide |
| [enterprise.md](skills/enterprise.md) | Org-level skill distribution |

---

## `tools/` — Anthropic API tool use

For applications calling Claude with `tools: [...]`. Distilled summaries live in [`mde-tool-use/`](../skills/mde-tool-use/) topic files (`overview.md`, `server-tools.md`, `custom-tools.md`, `advanced.md`, `combinations.md`).

| File | Server/client | One-line |
|------|---------------|----------|
| [tools-overview.md](tools/tools-overview.md) | — | End-to-end tool-use flow |
| [how-tool-use-works.md](tools/how-tool-use-works.md) | — | Mental model of the agentic loop |
| [tool-reference.md](tools/tool-reference.md) | — | Catalog of Anthropic-provided tools + version strings |
| [tool-combinations.md](tools/tool-combinations.md) | — | Canonical agent shapes (research, coding, cite-fetch, long-running, all-in-one) |
| [web-search-tool.md](tools/web-search-tool.md) | server | `web_search_20260209` |
| [web-fetch-tool.md](tools/web-fetch-tool.md) | server | `web_fetch_20260209` |
| [code-execution-tool.md](tools/code-execution-tool.md) | server | Python sandbox (`code_execution_20250825`) |
| [computer-use-tool.md](tools/computer-use-tool.md) | server | Full desktop control (`computer_20250124`) |
| [bash-tool.md](tools/bash-tool.md) | client | `bash_20250124` (you control the sandbox) |
| [text-editor-tool.md](tools/text-editor-tool.md) | client | `text_editor_20250728` (paired with `bash`) |
| [memory-tool.md](tools/memory-tool.md) | server | Persistent agent memory (`memory_20250818`) |
| [advisor-tool.md](tools/advisor-tool.md) | server | Reasoning advisor / multi-step planning |
| [files.md](tools/files.md) | — | Files API — cloud-managed file system |
| [define-tools.md](tools/define-tools.md) | — | Custom tool: name + description + input_schema (JSON Schema) |
| [handle-tool-calls.md](tools/handle-tool-calls.md) | — | tool_use → tool_result loop in production |
| [parallel-tool-use.md](tools/parallel-tool-use.md) | — | Multiple tool calls per assistant turn |
| [programmatic-tool-calling.md](tools/programmatic-tool-calling.md) | — | Force tool selection from code (`tool_choice`) |
| [strict-tool-use.md](tools/strict-tool-use.md) | — | Guaranteed JSON-Schema-valid args |
| [fine-grained-tool-streaming.md](tools/fine-grained-tool-streaming.md) | — | Stream partial tool input deltas |
| [manage-tool-context.md](tools/manage-tool-context.md) | — | Truncating tool_result blocks, dropping old turns |
| [build-a-tool-using-agent.md](tools/build-a-tool-using-agent.md) | — | Have Claude draft your tool definitions |

---

## `agents/` — Anthropic Managed Agents API

For applications building agentic features in the cloud (different product from Claude Code subagents). Distilled summary lives in [`mde-agents/managed-agents.md`](../skills/mde-agents/managed-agents.md). Beta header: `managed-agents-2026-04-01`.

| File | One-line |
|------|----------|
| [Agents-overview.md](agents/Agents-overview.md) | What Managed Agents are, when to use them |
| [agent-setup.md](agents/agent-setup.md) | Creating an Agent, environment, first session |
| [agent-define-outcomes.md](agents/agent-define-outcomes.md) | System prompt + outcome shaping |
| [agent-environments.md](agents/agent-environments.md) | Cloud container templates |
| [agent-cloud-containers.md](agents/agent-cloud-containers.md) | Container internals, persistence |
| [agent-sessions.md](agents/agent-sessions.md) | Session lifecycle, resumption |
| [agent-events-and-streaming.md](agents/agent-events-and-streaming.md) | Streaming events from a session |
| [agent-files.md](agents/agent-files.md) | File handling inside an agent |
| [agent-tools.md](agents/agent-tools.md) | Tool config (overlaps with `tools/` — same JSON Schema model) |
| [agent-mcp-connector.md](agents/agent-mcp-connector.md) | Connecting MCP servers to a managed agent |
| [agent-skills.md](agents/agent-skills.md) | Loading skills into a managed agent |
| [agent-memory.md](agents/agent-memory.md) | Memory primitive (≠ session) |
| [agent-vaults.md](agents/agent-vaults.md) | Secret management |
| [agent-webhooks.md](agents/agent-webhooks.md) | Webhooks > polling for event delivery |
| [agent-multi-agent.md](agents/agent-multi-agent.md) | Coordinator + specialist patterns |
| [agent-dreams.md](agents/agent-dreams.md) | "Dreams" pattern — async exploration |
| [agent-github.md](agents/agent-github.md) | GitHub-flavored agent setup |

---

## `agents/cookbooks/` — Anthropic-authored end-to-end walkthroughs

These are full notebook-style cookbooks from `github.com/anthropics/claude-cookbooks`. They are the most authoritative how-to material for Managed Agents. See [`best-practices/02-best-practices-guide.md` §15](best-practices/02-best-practices-guide.md) for the mdeai adoption map (which to read first, which to defer).

| File | One-line | mdeai phase |
|------|----------|---|
| [managed-agents.md](agents/cookbooks/managed-agents.md) | Entry tutorial — iterate on a failing test suite. Agent / environment / session / streaming. | Week 2 |
| [multi-agent-cookbook.md](agents/cookbooks/multi-agent-cookbook.md) | Coordinator + specialists pattern (Northstar sales-proposal example). | Week 3+ |
| [Context-engineering.md](agents/cookbooks/Context-engineering.md) | Memory vs. compaction vs. tool-clearing. The reference for context budget decisions. | Week 1 |
| [memory-context.md](agents/cookbooks/memory-context.md) | Persistent memory tool + context editing with Sonnet 4.6. | Week 2 |
| [agents-users.md](agents/cookbooks/agents-users.md) | Agents that remember individual users across conversations. | deferred (Rentals AI Chat) |
| [incident-responder.md](agents/cookbooks/incident-responder.md) | SRE incident-response agent. | deferred (after `production-deploy` outcome) |
| [chief-of-staff.md](agents/cookbooks/chief-of-staff.md) | Long-horizon planning orchestrator. | deferred |
| [observity-agent.md](agents/cookbooks/observity-agent.md) | Observability agent — telemetry analysis + anomaly flagging. | deferred (after `ai_runs` telemetry matures) |

---

## `prompts/` — prompt engineering

Direct distill home: [`mde-prompting/`](../skills/mde-prompting/).

| File | One-line |
|------|----------|
| [claude-prompting-best-practices.md](prompts/claude-prompting-best-practices.md) | Headline best practices for prompting Claude |
| [increase-consistency.md](prompts/increase-consistency.md) | Reproducibility, structured outputs |
| [reduce-hallucinations.md](prompts/reduce-hallucinations.md) | Grounding, citations, refusals |
| [reduce-latency.md](prompts/reduce-latency.md) | Streaming, prompt caching, model choice |
| [reduce-prompt-leak.md](prompts/reduce-prompt-leak.md) | Defending system prompts |
| [mitigate-jailbreaks.md](prompts/mitigate-jailbreaks.md) | Adversarial input handling |
| [develop-tests.md](prompts/develop-tests.md) | Building eval sets |
| [eval-tool.md](prompts/eval-tool.md) | Anthropic eval tool overview |
| [glossary.md](prompts/glossary.md) | Prompt-engineering vocabulary |

---

## When to read what

| Question | Path |
|----------|------|
| **"How should mdeai use Claude Code?"** (start here) | [`best-practices/02-best-practices-guide.md`](best-practices/02-best-practices-guide.md) |
| **"How do I verify a PR / migration / map / ticket flow with an Outcome?"** | [`best-practices/01-outcomes-plan.md`](best-practices/01-outcomes-plan.md) |
| **"What's the entry tutorial for Managed Agents?"** | [`agents/cookbooks/managed-agents.md`](agents/cookbooks/managed-agents.md) |
| **"How do I coordinate multiple agents?"** | [`agents/cookbooks/multi-agent-cookbook.md`](agents/cookbooks/multi-agent-cookbook.md) |
| **"Should this go in CLAUDE.md or a skill?"** | [`agents/cookbooks/Context-engineering.md`](agents/cookbooks/Context-engineering.md) |
| "How do I use Claude Code well?" | [`claude-code/best-practices.md`](claude-code/best-practices.md) |
| "How do I write a skill?" | [`skills/best-practices.md`](skills/best-practices.md) |
| "How do I define a tool for the API?" | [`tools/define-tools.md`](tools/define-tools.md) |
| "What's the hook event spec?" | [`reference/hooks.md`](reference/hooks.md) |
| "What's a Managed Agent session?" | [`agents/agent-sessions.md`](agents/agent-sessions.md) |
| "How do I reduce hallucinations?" | [`prompts/reduce-hallucinations.md`](prompts/reduce-hallucinations.md) |

If you're not sure which skill consumes a doc, the **skill home** column above tells you. If a skill doesn't exist for a topic you read often, that's a signal to create one — see [`skill-development/`](../skills/skill-development/SKILL.md).
