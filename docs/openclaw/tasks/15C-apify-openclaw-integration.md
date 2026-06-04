---
task_id: 15C
title: Apify + OpenClaw Integration — Social Scraping for Lead Discovery
phase: HIGH
priority: P1
status: Not Started
estimated_effort: 1 day
area: ai-agents
skill: [mde-paperclip]
depends_on: [15A, 15B]
---

<!-- task-summary -->
> **What:** Apify + OpenClaw Integration — Social Scraping for Lead Discovery
> **Why:** OpenClaw can execute browser tasks and WhatsApp, but has no structured access to social platform data at scale. The Apify plugin connects OpenClaw to 1,000+ pre-built scraper actors via natural…
> **Success Criteria:**
> - `@apify/apify-openclaw-plugin` installed and visible in OpenClaw plugin list
> - Apify API key set in OpenClaw config (not hardcoded — via `env.vars`)
> - Test scrape: Instagram `#medellinrentals` returns ≥10 posts with caption + username
> - Test scrape: Facebook Groups actor finds at least 1 Medellín expat group post
> **HIGH · P1 · Not Started · Effort: 1 day**
> **Depends on:** 15A, 15B

| Aspect | Details |
|--------|---------|
| **System** | OpenClaw VPS `https://openclaw-vmjg.srv1641664.hstgr.cloud` |
| **Features** | Apify plugin install, Instagram scraper, Facebook Groups scraper, LinkedIn, Eventbrite, Google Maps |
| **Tables** | `marketing.contacts`, `marketing.contact_sources` |
| **Real-World** | "Hermes asks OpenClaw to scrape today's Medellín apartment listings from Facebook Groups — 50 leads returned in 3 minutes" |

## Description

**The situation:** OpenClaw can execute browser tasks and WhatsApp, but has no structured access to social platform data at scale. The Apify plugin connects OpenClaw to 1,000+ pre-built scraper actors via natural language — "scrape Instagram hashtag #medellinrentals" becomes a structured API call returning post data, usernames, follower counts, and captions.

**Why it matters:** Apify is the most practical path to Instagram, Facebook Groups, LinkedIn, Eventbrite, and Google Maps data without building custom scrapers. The OpenClaw plugin means Hermes can ask OpenClaw to run any Apify actor mid-heartbeat, get structured JSON back, and score it as leads.

**What already exists:** OpenClaw running at port 40051, Paperclip skill installed, env vars configured. Apify CLI available. OpenClaw plugin registry at `openclaw plugins install`.

**The build:**
1. Install Apify plugin: `openclaw plugins install @apify/apify-openclaw-plugin` inside the container
2. Configure Apify API key in OpenClaw config (need Apify account API key)
3. Set `maxResults: 100`, `enabledTools: ["instagram-scraper", "facebook-groups-scraper", "linkedin-scraper", "google-maps-scraper", "eventbrite-scraper"]`
4. Test: ask OpenClaw to scrape `#medellinrentals` → verify JSON output with username, follower_count, caption, hashtags
5. Create a Hermes skill or prompt template for structured lead extraction from Apify results
6. Write a Paperclip routine that triggers OpenClaw discovery on a schedule

**Example:** "A Medellín expat posts in Facebook Group 'Medellín Rentals' asking 'Need 2BR in Laureles for 3 months'. Hermes asks OpenClaw to run `facebook-groups-scraper` on that group. The post, commenter, and their contact info are extracted, scored as lead_score=91, and saved to `marketing.contacts`."

## Rationale
**Problem:** Manual lead discovery is slow and doesn't scale. Browser scraping without structure is fragile.
**Solution:** Apify actors provide production-grade, maintained scrapers for every major platform.
**Impact:** 50-500 structured leads per discovery run, with fields ready for Hermes scoring.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Hermes agent | ask OpenClaw to scrape Instagram hashtags | I get structured lead data without writing scraper code |
| Board member | see where each lead came from | I can evaluate which sources produce conversions |

## Goals

1. **Primary:** Apify plugin installed and responding to test scrape commands
2. **Quality:** Instagram scraper returns `username`, `caption`, `hashtags`, `followersCount`, `timestamp` per result

## Acceptance Criteria

- [ ] `@apify/apify-openclaw-plugin` installed and visible in OpenClaw plugin list
- [ ] Apify API key set in OpenClaw config (not hardcoded — via `env.vars`)
- [ ] Test scrape: Instagram `#medellinrentals` returns ≥10 posts with caption + username
- [ ] Test scrape: Facebook Groups actor finds at least 1 Medellín expat group post
- [ ] Google Maps scraper: returns business name, phone, website, rating for Laureles restaurants
- [ ] All results include `source_url` field for traceability
- [ ] `maxResults` capped at 100 per run (cost control)
- [ ] Apify API key stored in Infisical prod + OpenClaw env vars (not hardcoded in skill files)

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| OpenClaw container | `docker exec openclaw-vmjg-openclaw-1` | Install plugin |
| OpenClaw config | `/docker/openclaw-vmjg/data/.openclaw/openclaw.json` | Add APIFY_API_KEY to env.vars |
| OpenClaw skill | `/docker/openclaw-vmjg/data/.openclaw/skills/apify/SKILL.md` | Create lead-extraction prompt |
| Supabase | `marketing.contact_sources` table | Store raw scrape data + source actor |

## Install Commands (run inside container)

```bash
docker exec -it openclaw-vmjg-openclaw-1 sh -c \
  "openclaw plugins install @apify/apify-openclaw-plugin && openclaw apify setup"
```

## Apify Actors Reference

| Platform | Actor | Key Output Fields | Cost |
|----------|-------|-----------------|------|
| Instagram posts | `apify/instagram-scraper` | username, caption, hashtags, likesCount, timestamp, ownerFullName | $1.50/1k posts |
| Instagram profiles | `apify/instagram-profile-scraper` | username, followersCount, biography, externalUrl, isBusinessAccount | $2.60/1k profiles |
| Facebook Groups | `apify/facebook-groups-scraper` | postText, authorName, timestamp, likes, comments | varies |
| LinkedIn | `get-leads/linkedin-scraper` | fullName, title, company, email (if public) | varies |
| Eventbrite | `newpo/eventbrite-scraper` | eventName, organizer, date, venue, price, attendees | varies |
| Google Maps | `apify/google-maps-scraper` | name, phone, website, rating, reviewCount, address | $2.10/1k |

## Lead Extraction Skill Template

```markdown
# Apify Lead Extraction Skill

When asked to discover leads from [platform], use the Apify tool to run the appropriate actor.
Return structured JSON with these fields per lead:
- identifier: phone number OR Instagram handle OR LinkedIn URL
- full_name: best available name
- bio_or_caption: raw text (for Hermes scoring)
- follower_count: if social profile
- location_signals: any Medellín/Colombia/Laureles/Poblado mentions
- source_url: the URL scraped
- source_actor: the Apify actor used
- discovered_at: ISO timestamp
```

## Outcomes

| Before | After |
|--------|-------|
| Lead discovery is fully manual | 50-500 structured leads per automated run |
| No Facebook Groups access | Full post + commenter data from Medellín groups |
| Instagram scraping requires browser | Apify actor returns structured JSON in seconds |
| No cost control on scraping | maxResults:100 cap + Apify monthly budget in Infisical |
