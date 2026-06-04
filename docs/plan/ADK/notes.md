# ADK — development assist only (mdeai)

**Canonical guide:** [ADK — Coding with AI](https://adk.dev/tutorials/coding-with-ai/) — use this stack to **help Sofía build** the Phase 2 Python service (`services/adk-grounding/`). It is **not** Camila’s product runtime (that stays **Mastra + CopilotKit** in `mdeapp/`).

**Verified:** 2026-05-22 on this machine.

## What “Coding with AI” provides (all dev-assist)

| Pillar | Purpose | mdeai |
|--------|---------|-------|
| **[agents-cli](https://github.com/google/agents-cli)** + **7 development skills** | Scaffold, eval, deploy ADK projects | ✅ Installed — see below |
| **ADK Docs MCP** | Search/read [adk.dev](https://adk.dev) from Cursor | Optional — config below |
| **ADK Docs Index** | [llms.txt](https://adk.dev/llms.txt) / [llms-full.txt](https://adk.dev/llms-full.txt) | Fallback if MCP down |

Install/repair (official):

```bash
uvx google-agents-cli setup   # CLI + google-agents-cli-* skills
```

**Do not confuse with:** ADK **runtime** `SkillToolset` skills under `services/adk-grounding/skills/` (product agent behavior) — see [Skills blog](https://developers.googleblog.com/developers-guide-to-building-adk-agents-with-skills/).

---

## Where the dev skills are

| Location | What |
|----------|------|
| **`~/.agents/skills/google-agents-cli-*`** | ✅ **Installed** (global user skills from `uvx google-agents-cli setup` / `npx skills add`) |
| **`/home/sk/mdeai/.agents/skills/google-agents-cli-*`** | ✅ **Also present** (project copy via `npx skills add google/agents-cli`) |
| **`/home/sk/mdeai/.claude/skills/`** | Symlink if you mirror other packs — optional |

### Seven skills on disk

```bash
ls -d ~/.agents/skills/google-agents-cli-*
```

| Skill folder | Use when |
|--------------|----------|
| `google-agents-cli-workflow` | Start any ADK work — lifecycle, scaffold-first, model rules |
| `google-agents-cli-adk-code` | Writing `agent.py`, tools, callbacks, state |
| `google-agents-cli-scaffold` | `agents-cli scaffold create`, `enhance`, `upgrade` |
| `google-agents-cli-eval` | `agents-cli eval run`, evalsets, LLM-as-judge |
| `google-agents-cli-deploy` | Cloud Run, Agent Runtime, GKE, CI/CD |
| `google-agents-cli-publish` | Gemini Enterprise registration |
| `google-agents-cli-observability` | Cloud Trace, logging, BigQuery analytics |

Each has `SKILL.md` + `references/` (e.g. `google-agents-cli-adk-code/references/adk-python.md`).

## CLI verification

```bash
which agents-cli          # → ~/.local/bin/agents-cli
agents-cli info           # CLI 0.2.0 (from mdeai root: "No agent project" — expected)
uvx google-agents-cli setup   # re-install CLI + skills if needed
```

**Note:** `agents-cli info` reporting **"Installed skills: none"** means **no skills inside an ADK project directory**, not that `~/.agents/skills` is empty. Global skills are separate.

## Make Cursor see them inside mdeai (recommended)

Global install works for some agents; for **parity with other mdeai skills** (listed under Project Skills), add to the repo once:

```bash
cd /home/sk/mdeai
npx skills add google/agents-cli -y
```

Then confirm:

```bash
npx skills list | rg google-agents
```

Optional: symlink only the ADK pack into `.claude/skills/` if you want Claude Code discovery — same pattern as other `.agents/skills` entries.

## ADK Docs MCP (Cursor — dev assist)

Per [Coding with AI → ADK Docs MCP](https://adk.dev/tutorials/coding-with-ai/#adk-docs-mcp-server). **Configured** in:

- `/home/sk/mdeai/.mcp.json` (project)
- `~/.cursor/mcp.json` (Cursor user)

```jsonc
"adk-docs-mcp": {
  "type": "stdio",
  "command": "uvx",
  "args": [
    "--from", "mcpdoc", "mcpdoc",
    "--urls", "AgentDevelopmentKit:https://adk.dev/llms.txt",
    "--transport", "stdio"
  ]
}
```

**Verified 2026-05-22:**

| Check | Result |
|-------|--------|
| `https://adk.dev/llms.txt` | HTTP 200 |
| MCP `initialize` | `serverInfo.name`: `llms-txt` v1.27.1 |
| MCP `tools/list` | `list_doc_sources`, `fetch_docs` |

Re-test locally:

```bash
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' \
  '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
| timeout 30 uvx --from mcpdoc mcpdoc --urls "AgentDevelopmentKit:https://adk.dev/llms.txt" --transport stdio
```

**Cursor:** restart MCP or reload window so `adk-docs-mcp` shows green in **Tools & MCP**. Use only for ADK Python work — not a substitute for `mastra` / `copilotkit` on `mdeapp`.

---

## How to best use (mdeai rules)

**Use Coding with AI (skills + MCP + agents-cli) only to develop ADK:** `services/adk-grounding/` — scaffold, `agent.py`, eval, deploy.

**Do not use for:** replacing Mastra in `mdeapp/` or wiring production `/api/copilotkit` to ADK `HttpAgent`.

### Workflow (dev assist — [Coding with AI](https://adk.dev/tutorials/coding-with-ai/) + [Agent Platform quickstart](https://docs.cloud.google.com/gemini-enterprise-agent-platform/agents/quickstart-adk))

| Step | You say in Cursor | Skill activated | Command |
|------|-------------------|-----------------|---------|
| 1 | “Scaffold mdeai ADK grounding service with Maps + Search tools” | workflow + scaffold | `cd services && agents-cli scaffold create adk-grounding --prototype --yes && cd adk-grounding && agents-cli install` |
| 2 | “Port Maps/Search from ag-ui-adk-grounding-app” | adk-code | edit `app/agent.py` |
| 3 | “Add evals for Laureles café queries, no hallucinated place_id” | eval | `agents-cli eval run` |
| 4 | “Deploy grounding service to Cloud Run” (Phase 2) | deploy | `agents-cli deploy` |

### Reference repos (do not merge into mdeapp)

| Repo | Role |
|------|------|
| `CopilotKit/examples/integrations/adk` | FastAPI + `ag_ui_adk` + `HttpAgent` plumbing |
| `github/copilotkit/ag-ui-adk-grounding-app` | `GoogleMapsGroundingTool`, `GoogleSearchTool` |
| `CopilotKit/examples/integrations/mastra` | **Production** mdeapp runtime |

### Phase gate

| Phase | agents-cli | mdeapp |
|-------|------------|--------|
| **Now** | Optional spike under `services/adk-grounding/` | MAP-001 → F49 → MAP-002 (Mastra + Lite MCP) |
| **Phase 2** | eval + deploy ADK service | Mastra HTTP client → ADK JSON |

## Security reminder

Installer warned: skills run with **full agent permissions**. Use only on ADK service paths; review `SKILL.md` before auto-scaffold/deploy. Never commit API keys; use `.env.local` / Infisical patterns from mdeai.

## Two different “skills” (do not confuse)

| Kind | Source doc | Who loads it | mdeai example |
|------|------------|--------------|---------------|
| **A — Development skills** | [Coding with AI](https://adk.dev/tutorials/coding-with-ai/) → `google-agents-cli-*` | **Cursor** while building ADK | scaffold, eval, deploy |
| **B — Runtime agent skills** | [Skills for Agents](https://adk.dev/skills/) + Skills blog | **ADK `SkillToolset`** at request time | `maps-grounding-lite`, `grounded-output-contracts` |

Google’s [Developer’s Guide to ADK Agents with Skills](https://developers.googleblog.com/developers-guide-to-building-adk-agents-with-skills/) describes **B** — progressive disclosure inside the product agent:

- **L1** — name + description in every turn (`list_skills`)
- **L2** — full instructions on demand (`load_skill`)
- **L3** — reference files (`load_skill_resource`)

```python
# Phase 2 — inside services/adk-grounding/ (not in mdeapp)
skill_toolset = SkillToolset(skills=[
    load_skill_from_dir("skills/maps-grounding-lite"),
    load_skill_from_dir("skills/grounded-output-contracts"),
])
root_agent = Agent(..., tools=[skill_toolset, GoogleMapsGroundingTool(), ...])
```

**You already installed A** (`google-agents-cli-*`). **B is not installed yet** — create under the ADK service per [`prd-adk.md`](./prd-adk.md) §12 when you scaffold.

Optional extra **coding** pack from the same blog (ADK API docs for Cursor):

```bash
npx skills add google/adk-docs -y -g   # global; or from mdeai without -g for project
```

That is still **A**, not the runtime `SkillToolset`.

### Pattern map (blog → mdeai)

| Blog pattern | mdeai use |
|--------------|-----------|
| 1 Inline | Tiny rules in `agent.py` (avoid for maps — use files) |
| 2 File-based | **`skills/maps-grounding-lite/SKILL.md`** + `references/quotas.md` |
| 3 External import | Community skill dirs — vet before prod |
| 4 Skill factory | **Do not** auto-generate prod skills without Patricia review |

## Links

- **[Coding with AI](https://adk.dev/tutorials/coding-with-ai/)** — primary doc for dev assist (agents-cli, MCP, llms.txt)
- [ADK agents with Skills (blog)](https://developers.googleblog.com/developers-guide-to-building-adk-agents-with-skills/) — runtime SkillToolset only
- [adk.dev/skills](https://adk.dev/skills/)
- [agents-cli on GitHub](https://github.com/google/agents-cli)
- [Agent Platform ADK quickstart](https://docs.cloud.google.com/gemini-enterprise-agent-platform/agents/quickstart-adk)
- Skills index: [`../../index-skills.md`](../../index-skills.md) — **ADK / agents-cli dev pack** section
- Canonical plan: [`prd-adk.md`](./prd-adk.md) · [`../openclaw/01-openclaw-adk.md`](../openclaw/01-openclaw-adk.md)
## How to use ADK `llms.txt` for the Gemini page

ADK publishes docs in the [llms.txt](https://llms.txt.org/) shape: an index file points at every page; each page has a `.md` URL you can fetch as plain markdown.

| File | Role | URL |
|------|------|-----|
| **llms.txt** | Index — one line per doc with title + URL | https://adk.dev/llms.txt |
| **llms-full.txt** | Entire site in one file (grep / one-shot context) | https://adk.dev/llms-full.txt |
| **Page .md** | Single page (what the HTML page is built from) | e.g. https://adk.dev/agents/models/google-gemini/index.md |

Human HTML: [Gemini models for ADK](https://adk.dev/agents/models/google-gemini/). Agents should prefer the `.md` URL.

---

### Path 1 — `adk-docs-mcp` in Cursor (recommended)

After MCP reload (`adk-docs-mcp` in `.mcp.json`):

1. **`list_doc_sources`** — confirms `AgentDevelopmentKit` → `https://adk.dev/llms.txt`.
2. **`fetch_docs`** with that `llms.txt` URL (or ask “find Gemini model auth in ADK”) — MCP loads the index and resolves links.
3. **`fetch_docs`** with the exact page URL when you already know it:
   - `https://adk.dev/agents/models/google-gemini/index.md`

Prompt examples:

- “Use adk-docs-mcp: list sources, then fetch the ADK Gemini models page and summarize auth env vars.”
- “From adk.dev llms.txt, find Interactions API + Gemini and cite limitations.”

---

### Path 2 — CLI (no MCP)

```bash
# 1) Find the page in the index
curl -s https://adk.dev/llms.txt | rg -i gemini

# → - [Gemini](https://adk.dev/agents/models/google-gemini/index.md)

# 2) Pull the page
curl -s https://adk.dev/agents/models/google-gemini/index.md | less

# Or search the monolith
curl -s https://adk.dev/llms-full.txt | rg -n "GOOGLE_API_KEY|use_interactions_api" | head
```

---

### Path 3 — `agents-cli` (project-scoped)

From an ADK project root (`services/adk-grounding/` once scaffolded):

```bash
agents-cli info    # shows project + linked docs
```

Same underlying index; differs mainly in **where** the agent runs (global Cursor vs ADK service tree). Details: `plan/ADK/notes.md` § ADK Docs MCP.

---

## What the Gemini page says (mdeai-relevant)

From [the Gemini ADK doc](https://adk.dev/agents/models/google-gemini/):

| ADK default | mdeapp (Mastra / `@ai-sdk/google`) |
|-------------|-------------------------------------|
| `model="gemini-flash-latest"` on `LlmAgent` | Pin `gemini-3.5-flash` per `CLAUDE.md` |
| `GOOGLE_API_KEY` + `GOOGLE_GENAI_USE_VERTEXAI=FALSE` (AI Studio) | `GOOGLE_GENERATIVE_AI_API_KEY` in `mdeapp/.env.local` |
| Vertex: `GOOGLE_CLOUD_PROJECT`, `GOOGLE_GENAI_USE_VERTEXAI=TRUE`, ADC | Phase 2 `services/adk-grounding/` only — not `mdeapp` W1–W6 |
| Interactions API: `Gemini(..., use_interactions_api=True)` (Python ≥1.21) | Mastra path today — ADK sidecar is Phase 2 |
| Built-in + custom tools: `GoogleSearchTool(bypass_multi_tools_limit=True)` | Same pattern if you port `ag-ui-adk-grounding-app` tools |

**Rule when porting:** ADK examples use rolling IDs (`gemini-flash-latest`); mdeai production agents use explicit IDs from the Gemini registry in `CLAUDE.md`. Do not copy ADK model strings into `mdeapp/src/mastra/**` without mapping.

**Auth snippet for a future Python ADK service** (from repo root `.env.local`):

```bash
# services/adk-grounding/.env (ADK / google-genai)
GOOGLE_API_KEY=<same key as GEMINI / AI Studio>
GOOGLE_GENAI_USE_VERTEXAI=FALSE
```

Keep Mastra on `GOOGLE_GENERATIVE_AI_API_KEY` — different env name, same key material is fine locally.

---

## Quick workflow diagram

```text
You / Cursor agent
    │
    ├─► adk-docs-mcp: list_doc_sources → fetch_docs(llms.txt) → fetch_docs(gemini/index.md)
    │
    ├─► curl adk.dev/llms.txt → pick URL → curl …/index.md
    │
    └─► curl adk.dev/llms-full.txt → rg "Interactions API"
```

**When to use which:** `llms.txt` + MCP or index grep for **navigation**; `llms-full.txt` for **cross-page search**; direct `…/index.md` when you already have the URL (fastest).

If you want this baked into repo memory, the next small doc edit is one row in `CLAUDE.md` MCP table: `adk-docs-mcp` → `fetch_docs` on `https://adk.dev/agents/models/google-gemini/index.md` for ADK Python work. Say if you want that committed.