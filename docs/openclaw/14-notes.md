Reading existing trio docs and launching deep research in parallel.

Excellent research. Now reading the most relevant existing trio docs before writing the plan.

Now writing both documents. This will be comprehensive.

Now writing the user stories document.

Now update the trio index and verify both files were written correctly.

Both documents created. Here's the full summary:

---

## What was created

### [`tasks/trio/14-openclaw-production-plan.md`](https://claude.ai/epitaxy/tasks/trio/14-openclaw-production-plan.md) — 1,762 lines

**Research basis:** 61 live URL fetches from official docs, GitHub repos, ClawHub, and community sources (2026-05-07). Every feature is marked verified vs unverified.

Key findings that correct prior assumptions:

- Instagram is **NOT an official OpenClaw channel** — `channels/instagram` returns 404. Use Postiz for Instagram posting.
- Supabase is **NOT a first-class provider** — community skill only via stopmoclay/clawhub.
- **Postiz and OpenClaw are separate companies** — postiz-agent is a standalone CLI by gitroomhq/Nevo that OpenClaw calls via `exec`.
- **Bun runtime is explicitly incompatible** for WhatsApp/Telegram — Node 24 only.
- WhatsApp uses **Baileys** (unofficial, ToS risk) — not the official Business API.
- crawlkit has no relation to OpenClaw — it's a Go library by someone else.

**Covers all 19 sections:**

- Features table (20 features scored /100)
- Top 20 skills/plugins with install commands
- 9 complete workflows with step-by-step code
- 5 agents with full SKILL.md excerpts
- 13 Supabase table schemas (SQL)
- Docker Compose spec for VPS
- 6-tier testing plan
- Production readiness checklist
- KPI success criteria
- Risk register with mitigations
- Final recommendation with decision tree

---

### [`tasks/trio/14-openclaw-user-stories.md`](https://claude.ai/epitaxy/tasks/trio/14-openclaw-user-stories.md) — 609 lines

**12 real-world stories** with named Medellín characters:

|#|Story|Revenue impact|
|---|---|---|
|1|Camila finds apartment at 11pm (expat, WhatsApp)|Direct booking|
|2|Andrés gets lead while sleeping (landlord)|Platform fee|
|3|Carlos gets personalized follow-up, not spam|Re-engaged lead|
|4|María gets sponsor outreach that doesn't feel like spam|Sponsorship deal|
|5|Diego's event live on 4 platforms in 2 hours|Ticket sales|
|6|Sofia discovered as influencer partner|Content partnership|
|7|Juan monitors everything from Telegram (12 min/day)|Time savings|
|8|No-show recovery → repeat ticket buyer|Ticket revenue|
|9|Content machine posts while team sleeps|Brand awareness|
|10|Carlos says STOP → suppressed in < 5 seconds|Compliance|
|11|WA warning → Juan pauses outreach in 5 minutes|Ban prevention|
|12|Full Growth Machine day (Month 3 future state)|Full vision|

---

## Critical actions before using OpenClaw for outbound

```
1. Complete 15A (fix dangerouslyBypassApprovalsAndSandbox) ← BLOCKER
2. Pair WhatsApp +14168003103 (QR scan, 30 min)
3. Install: supabase skill + actionbook + postiz-agent CLI
4. Install concierge first (inbound only, zero outbound risk)
5. Add outreach only after 2 weeks of inbound testing with zero issues
```