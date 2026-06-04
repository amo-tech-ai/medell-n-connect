---
task_id: 19C
title: ClawHub Skill Safety Review — CVE-2026-25253 Allowlist + Audit
phase: CRITICAL
priority: P0
status: Not Started
estimated_effort: 2 days
area: ai-agents
skill:
  - open-claw
subagents:
  - security-auditor
schema_tables:
  - agent_runs
depends_on:
  - 15A
figma_prompt:
mermaid_diagram:
tools:
---

<!-- task-summary -->
> **What:** ClawHub Skill Safety Review — CVE-2026-25253 Allowlist + Audit
> **Why:** Per 14-openclaw §v1.1 corrections, ClawHub is now a CRITICAL risk: the ClawHavoc campaign published 800+ malicious skills, AMOS stealer was distributed via popular skills, and CVE-2026-25253 is a…
> **Tools:** `open-claw`
> **Delivers:** migrations: `agent_runs`
> **Success Criteria:**
> - `/docker/openclaw-vmjg/skills/allowlist.yml` created with current 20 vetted skills from 14-o…
> - Each allowlist entry has: `slug`, `version_min`, `publisher_github_url`, `last_audit_date`, …
> - `/docker/openclaw-vmjg/skills/denylist.yml` lists categories: `crypto`, `auto-updater`, `fin…
> - Audit checklist (8 questions) lives at `/docker/openclaw-vmjg/skills/AUDIT.md`
> **CRITICAL · P0 · Not Started · Effort: 2 days**
> **Depends on:** 15A

| Aspect | Details |
|--------|---------|
| **System** | OpenClaw gateway skill manager; allowlist + denylist YAML; audit checklist |
| **Features** | Mandatory pre-install review, version pinning, sandbox flag for unverified, audit log |
| **Edge Functions** | None (process + config) |
| **Tables** | `agent_runs` for install audit |
| **Agents** | All OpenClaw agents that load skills |
| **Real-World** | "Junior contractor intenta instalar `clawhub/scrape-tiktok@1.0.2` — el review process lo bloquea pendiente del upgrade a v1.1.4 patched." |

## Description

**The situation:** Per [14-openclaw §v1.1 corrections](14-openclaw-production-plan.md), ClawHub is now a CRITICAL risk: the ClawHavoc campaign published 800+ malicious skills, AMOS stealer was distributed via popular skills, and CVE-2026-25253 is a remote code execution vulnerability in ClawHub skills `< v1.1.4`. The current OpenClaw container has no skill allowlist, no version pinning, no install audit. Any agent that loads `clawhub/<anything>@latest` is one rogue publisher away from RCE.

**Why it matters:** OpenClaw runs with `--cap-add` permissions in some configurations and holds the WhatsApp session, the Postiz API key (via bridge), and Supabase service-role tokens. RCE on this container is RCE on the trio. Per [14-openclaw §18](14-openclaw-production-plan.md): "ClawHub = security nightmare". This prompt installs the operational safeguards.

**What already exists:** [`14-openclaw §7`](14-openclaw-production-plan.md) lists 20 recommended skills with publisher provenance; [`14-openclaw §18 #9-10`](14-openclaw-production-plan.md) names verified-safe skills (`firecrawl`, `crawl4ai`, `apollo-io`) and verify-before-use skills; CVE-2026-25253 mitigation guidance; `paperclip-bridge` from [17A](17A-paperclip-bridge-docker-service.md) for audit logging.

**The build:**
1. `/docker/openclaw-vmjg/skills/allowlist.yml` — pinned versions per skill, with publisher GitHub URL + commit SHA
2. `/docker/openclaw-vmjg/skills/denylist.yml` — explicit category denies (crypto, auto-updater, finance bots, YouTube tools)
3. Audit checklist: 8 questions a human must answer before any new skill is installed
4. Pre-install hook: `scripts/skill-preflight.sh <slug> <version>` — refuses unknown publisher, refuses `< v1.1.4`, refuses unpinned `@latest`
5. Install logging: every install writes to `agent_runs(agent_name='openclaw:skill-install', metadata={slug, version, publisher, sha})`
6. Quarterly review routine — Paperclip card lists installed skills + their last-audit date

**Example:** A junior contractor wants to scrape TikTok comments for the content machine. They run `openclaw skills install clawhub/scrape-tiktok@1.0.2`. Pre-install hook reads allowlist → slug not present → exits 1 with message "Not in allowlist; submit a review request via Paperclip card." Install blocked.

## Rationale
**Problem:** Unrestricted ClawHub installs expose the highest-trust trio container to RCE and credential theft.
**Solution:** Allowlist of pinned safe skills + denylist of risky categories + mandatory audit checklist + install-time hook.
**Impact:** Zero unverified skills load on prod OpenClaw; every install logged; CVE-2026-25253 mitigated by version pin.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| security-auditor | block any unverified skill install at the gate | a malicious skill cannot reach the OpenClaw container |
| sk (solo founder) | review and pin skills quarterly | I'm not silently drifting onto vulnerable versions |
| Sofía (board operator) | see when a new skill needs review as a Paperclip card | I'm in the loop on what tools agents can use |
| Junior contractor | get a clear "submit review request" message instead of `npm install` running | I follow the right path the first time |

## Goals

1. **Primary:** No skill installs on production OpenClaw without allowlist entry + audit log row.
2. **Quality:** Allowlist version checks block skills `< v1.1.4` (CVE patch threshold).

## Acceptance Criteria

- [ ] `/docker/openclaw-vmjg/skills/allowlist.yml` created with current 20 vetted skills from [14-openclaw §7](14-openclaw-production-plan.md)
- [ ] Each allowlist entry has: `slug`, `version_min`, `publisher_github_url`, `last_audit_date`, `audited_by`
- [ ] `/docker/openclaw-vmjg/skills/denylist.yml` lists categories: `crypto`, `auto-updater`, `finance`, `youtube`, plus known-bad slugs
- [ ] Audit checklist (8 questions) lives at `/docker/openclaw-vmjg/skills/AUDIT.md`
- [ ] `scripts/skill-preflight.sh <slug> <version>` rejects: not in allowlist, `< v1.1.4`, `@latest` unpinned, slug in denylist
- [ ] Install hook calls preflight; install fails fast on rejection
- [ ] Each successful install writes `agent_runs(agent_name='openclaw:skill-install', metadata={...})` via bridge
- [ ] Quarterly review: Paperclip routine `skills-quarterly-audit` cron `0 9 1 */3 *` lists installed skills + last-audit ages
- [ ] Test: attempt `clawhub/scrape-tiktok@1.0.2` install → blocked with allowlist message
- [ ] Test: attempt `firecrawl@latest` → blocked, requires pinned version

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Allowlist | `/docker/openclaw-vmjg/skills/allowlist.yml` | Create |
| Denylist | `/docker/openclaw-vmjg/skills/denylist.yml` | Create |
| Audit doc | `/docker/openclaw-vmjg/skills/AUDIT.md` | Create |
| Preflight | `/docker/openclaw-vmjg/skills/scripts/skill-preflight.sh` | Create |
| Install wrapper | `/docker/openclaw-vmjg/skills/scripts/skill-install.sh` | Create — calls preflight then `openclaw skills install` |
| Paperclip routine | Paperclip API | Create `skills-quarterly-audit` cron |
| Audit | `agent_runs` | Use existing |
| Skill ref | `.claude/skills/open-claw/` | Cross-link AUDIT.md |

## allowlist.yml (skeleton)

```yaml
version: "1.0"
last_reviewed: 2026-05-06
reviewed_by: sk
skills:
  - slug: firecrawl
    version_min: "1.1.4"
    publisher_github_url: https://github.com/firecrawl/firecrawl
    last_audit_date: 2026-05-06
    audited_by: sk
    notes: "Verified safe — Firecrawl official org"
  - slug: crawl4ai
    version_min: "1.1.4"
    publisher_github_url: https://github.com/unclewed/crawl4ai
    last_audit_date: 2026-05-06
    audited_by: sk
  - slug: apollo-io
    version_min: "1.1.4"
    publisher_github_url: https://github.com/apolloio/skills
    last_audit_date: 2026-05-06
    audited_by: sk
  - slug: supabase
    version_min: "1.1.4"
    publisher_github_url: https://github.com/supabase/openclaw-skill
    last_audit_date: 2026-05-06
    audited_by: sk
    notes: "Verify SKILL.md before each major upgrade"
```

## denylist.yml (skeleton)

```yaml
version: "1.0"
categories:
  - crypto
  - auto-updater
  - finance
  - youtube
slugs:
  - clawhub/scrape-tiktok       # ClawHavoc campaign sample
  - clawhub/auto-updater-pro    # AMOS stealer vector
  # See https://clawskills.sh/security-advisories
```

## Audit checklist (8 questions)

1. Is the publisher a verifiable GitHub org with >6 months of commits and a real identity?
2. Have you read SKILL.md source on GitHub directly (not via ClawHub UI)?
3. Does SKILL.md instruct any terminal command beyond `openclaw skills install <slug>`?
4. Is the version `>= v1.1.4` (CVE-2026-25253 patch threshold)?
5. Does the skill request network access beyond what its function requires?
6. Does the skill request file-system access outside its scoped data dir?
7. Is the skill in any of the denied categories (crypto, auto-updater, finance, youtube)?
8. Has a similar verified-safe alternative been considered (per [14-openclaw §7](14-openclaw-production-plan.md))?

A "no" to 1, 2, 4 OR a "yes" to 3, 5, 6, 7 blocks the install.

## skill-preflight.sh (skeleton)

```bash
#!/usr/bin/env bash
set -euo pipefail
slug="${1:?usage: skill-preflight.sh <slug> <version>}"
version="${2:?missing version}"
allowlist=/docker/openclaw-vmjg/skills/allowlist.yml
denylist=/docker/openclaw-vmjg/skills/denylist.yml

if grep -q "^- slug: ${slug}$" "$denylist"; then
  echo "BLOCKED: ${slug} is in denylist" >&2; exit 1
fi
if [[ "$version" == "latest" ]]; then
  echo "BLOCKED: pinned version required, not @latest" >&2; exit 1
fi
if ! python3 -c "import sys,yaml; data=yaml.safe_load(open('${allowlist}')); \
    sys.exit(0 if any(s['slug']=='${slug}' for s in data['skills']) else 1)"; then
  echo "BLOCKED: ${slug} not in allowlist; submit review request" >&2; exit 1
fi
# Compare semver against v1.1.4 minimum
python3 - <<EOF
import sys
v=tuple(int(x) for x in "${version}".split("."))
if v < (1,1,4): sys.exit("BLOCKED: version ${version} < CVE-2026-25253 patch (1.1.4)")
EOF
echo "OK: ${slug}@${version} cleared preflight"
```

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Slug in allowlist but version below `version_min` | Reject with version message; do not let agent self-upgrade |
| Allowlist YAML malformed | Preflight fails closed (refuse install) — never default-allow |
| New skill request from Sofía | Open Paperclip approval card; sk completes 8-question checklist; appends to allowlist |
| Skill listed verified-safe in [§18 #9](14-openclaw-production-plan.md) but no GitHub history | Treat as denied until human review confirms |
| Quarterly audit reveals stale `last_audit_date` >120 days | Routine creates Paperclip card to re-audit |

## Real-World Examples

**Scenario 1 — Junior contractor blocked:** A new contractor onboarded for the content machine wants TikTok scraping. They SSH in and run `openclaw skills install clawhub/scrape-tiktok@1.0.2`. **With this implementation,** preflight reads denylist → slug match → exits 1 with "submit review request via Paperclip card". Contractor opens a card; sk reviews; finds the publisher has no GitHub history; rejects. Outcome: AMOS-class stealer never reaches the container.

**Scenario 2 — Legit upgrade:** Firecrawl ships v1.2.0 with a useful new tool. **With this implementation,** sk runs the 8-question audit, confirms publisher provenance and SKILL.md safety, bumps `version_min` to `1.2.0` in allowlist, commits the YAML change, then installs. Install logged in `agent_runs`. Quarterly review picks it up four months later.

## Outcomes

| Before | After |
|--------|-------|
| Any ClawHub skill installable; no version pin | Allowlist gate; only audited slugs at pinned versions |
| `@latest` allowed | Pinned versions required; `@latest` blocked |
| CVE-2026-25253 mitigation absent | `version_min: 1.1.4` enforced at preflight |
| No install audit | `agent_runs(agent_name='openclaw:skill-install')` per install |
| Skills never re-reviewed | Quarterly Paperclip card surfaces stale audits |
