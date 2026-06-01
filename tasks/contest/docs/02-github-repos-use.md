---
title: Contest GitHub Repos Use Plan
status: Draft
date: 2026-05-25
local_root: /home/sk/mdeai/github/contest
---

# Contest GitHub Repos Use Plan

Use these repos as references. Do not copy/paste full apps into `mdeapp`.

## Local Repos Reviewed

| Repo | Local path | Use level | How to use |
|---|---|---|---|
| Helios Server | `/home/sk/mdeai/github/contest/helios-server` | Strong reference | Vote receipts, vote hashes, tally freeze, audit concepts. |
| OpenStreamPoll | `/home/sk/mdeai/github/contest/OpenStreamPoll` | Post-MVP reference | OBS overlay routes, QR live engagement, active poll UX. |
| Photography Contest ReactJS | `/home/sk/mdeai/github/contest/Photography_Contest_ReactJS` | UI inspiration | Contestant gallery/profile ideas only. |
| OpenClaw Web Scraper Plugin | `/home/sk/mdeai/github/contest/openclaw-plugin-web-scraper` | Post-MVP | Search/fetch/crawl adapter boundary for sponsor lead drafts. |
| Decodo OpenClaw Skill | `/home/sk/mdeai/github/contest/decodo-openclaw-skill` | Post-MVP | Optional paid enrichment provider after legal/TOS review. |
| OpenClaw Ultra Scraping | `/home/sk/mdeai/github/contest/openclaw-ultra-scraping` | Advanced/post-MVP | Enterprise scraping lab only; high compliance risk. |

## Other Repos To Use

| Repo | Location/source | Use level | How to use |
|---|---|---|---|
| CopilotKit Mastra Integration | `/home/sk/mdeai/CopilotKit/examples/integrations/mastra` | Foundation | Pattern 1 in-process `/api/copilotkit`, `useCoAgent`, `useCopilotAction`, approval cards. |
| Hi.Events | `/home/sk/mdeai/github/events/Hi.Events` | Strong reference | Ticket tiers, orders, attendees, QR check-in, capacity, webhooks. AGPL: no source copy. |
| Google ADK Samples | `/home/sk/mdeai/github/adk/adk-samples` | Post-core reference | Geo/sponsor/venue intelligence after MVP truth works. |
| TanStack Table | package/reference | Foundation | Admin tables for contestants, votes, sponsors, check-ins. |
| React Email | package/reference | Strong reference | Sponsor proposal and ticket email templates. |
| Playwright | package/reference | Foundation | E2E proof for routes, votes, Stripe, QR, admin. |
| Postiz | API/SaaS/self-host reference | Post-MVP | Approved campaign scheduling only. AGPL: no source copy. |
| Trigger.dev | future platform reference | Post-MVP | Durable jobs only if Supabase queues/Edge Functions are insufficient. |
| React Scan | dev tooling | Post-MVP | Performance checks for live dashboards/leaderboards. |

## What To Copy vs Not Copy

| Repo | Copy code? | Copy pattern? | Reason |
|---|---|---|---|
| CopilotKit Mastra Integration | Limited local adaptation | Yes | Already matches mdeapp's intended architecture, but replace demo domain/OpenAI with Gemini. |
| Helios | No | Yes | Voting integrity concepts are valuable; full crypto election stack is overkill. |
| OpenStreamPoll | No | Yes later | Live overlay pattern useful; official vote truth must be stronger. |
| Hi.Events | No | Yes | AGPL risk; model event/ticket concepts only. |
| Photography Contest ReactJS | No | UI only | Old stack and weak production proof. |
| OpenClaw variants | No | Adapter concepts later | Compliance and approval gates required. |
| Postiz | No | API integration later | Approved scheduling only. |
| TanStack Table / React Email / Playwright | Install packages | Yes | Production-ready libraries. |

## mdeai Beauty Contest Example

For Miss Medellin Beauty Contest:

| Need | Repo reference |
|---|---|
| Trusted public votes | Helios concepts + Supabase SQL ledger |
| VIP tickets and QR entry | Hi.Events concepts + Stripe webhook truth |
| Audience QR during finals | OpenStreamPoll post-MVP |
| Organizer AI workspace | CopilotKit + Mastra |
| Sponsor CRM/admin tables | TanStack Table |
| Sponsor proposal email | React Email |
| Social campaign scheduling | Postiz post-MVP |
| Sponsor lead discovery | OpenClaw post-MVP |
| Proof | Playwright |
