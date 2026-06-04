# Verdict

OpenClaw is **useful for event discovery**, but only as an **automation worker**, not the main event brain.

Best use:

```text
Mastra decides what should happen
→ Supabase stores truth
→ OpenClaw executes approved automation
→ Apify/Playwright scrape sources
→ human approval before publishing
```

Overall fit for mdeai event discovery: **86/100**

# Why Not 100?

OpenClaw can execute powerful workflows across chat channels and tools, and the Apify plugin gives agents access to thousands of scraping/data-extraction Actors through a single tool. ([docs.apify.com](https://docs.apify.com/platform/integrations/openclaw?utm_source=chatgpt.com "OpenClaw integration | Platform"))

But OpenClaw skills have had serious security concerns, so mdeai should only use audited skills, locked permissions, and approval gates. ([The Verge](https://www.theverge.com/news/874011/openclaw-ai-skill-clawhub-extensions-security-nightmare?utm_source=chatgpt.com "OpenClaw's AI 'skill' extensions are a security nightmare"))

# Best OpenClaw Strategy for mdeai

|Layer|Owner|
|---|---|
|Source of truth|Supabase|
|AI routing|Mastra|
|UI|CopilotKit|
|Geo intelligence|Google Maps / Places|
|Scraping execution|OpenClaw + Apify / Playwright|
|Human approval|Admin review queue|
|Messaging|WhatsApp / Telegram via OpenClaw|
|Payments|Stripe|

# Top 10 OpenClaw Event Discovery Use Cases

|#|Use Case|Score|Core / Advanced|Real-World Example|
|---|---|--:|---|---|
|1|Daily event source monitoring|96|Core|Every morning check Eventbrite, RA.co, Luma, Medellín Travel|
|2|Apify scraper execution|95|Core|Run Eventbrite/Meetup/Instagram actors and save clean data|
|3|Failed scrape recovery|92|Core|If RA.co scraper fails, retry with Playwright and alert Patricia|
|4|Human approval notifications|91|Core|Send Patricia a WhatsApp: “18 new events need review”|
|5|Source freshness watchdog|90|Core|“Eventbrite has not updated in 3 days”|
|6|WhatsApp event concierge|89|Advanced|User asks: “What’s happening near Laureles tonight?”|
|7|Organizer outreach|87|Advanced|Message venue owners to verify dates/ticket links|
|8|Sponsor opportunity alerts|84|Advanced|“3 nightlife events this weekend fit aguardiente sponsors”|
|9|Postiz social publishing|82|Advanced|Publish approved “Top 5 events this weekend” post|
|10|Guest/ticket confirmation calls|78|Advanced|Confirm VIP attendees before an event; community examples mention guest confirmation calls. ([GitHub](https://github.com/hesamsheikh/awesome-openclaw-usecases?utm_source=chatgpt.com "hesamsheikh/awesome-openclaw-usecases: A community ..."))|

# Core Features Table

|Feature|What It Does|OpenClaw Role|Real Example|
|---|---|---|---|
|Daily scraper runner|Runs scheduled event scrapers|Executes Apify/Playwright jobs|Pull RA.co events daily|
|Apify delegation|Uses Apify Actors through OpenClaw plugin|Runs discover → start → collect workflow|Find best Eventbrite Actor and return extracted rows; plugin supports sub-agent delegation. ([GitHub](https://github.com/apify/apify-openclaw-plugin?utm_source=chatgpt.com "Apify Plugin for OpenClaw"))|
|Approval alerts|Notifies admin when rows need review|WhatsApp/Telegram message|“12 candidate events need approval”|
|Failure monitoring|Detects broken sources|Sends alert + retry|“Luma scraper returned 0 events”|
|Freshness reports|Daily source health summary|Generates operator brief|“36 new events, 4 duplicates, 2 failures”|
|Manual override commands|Lets operator trigger jobs|Chat command|“Run RA.co scraper now”|
|Raw data capture|Saves outputs to Supabase|Worker writes to backend API|Store raw payload before normalize|
|Dedupe review|Flags likely duplicates|Sends review bundle|Same techno event from RA.co + Eventbrite|
|Ticket link verification|Checks broken source URLs|Browser worker|Detect 404 or sold-out ticket page|
|Image/poster collection|Captures event image URL|Scraper helper|Save event poster for card|

# Advanced Features Table

|Feature|What It Does|Real-World Example|
|---|---|---|
|WhatsApp event bot|Event discovery via WhatsApp|“Top free events near Poblado tonight”|
|Venue verification outreach|Asks venues to confirm info|“Is this salsa night still happening Friday?”|
|Social listening|Watches Instagram/FB pages|Catch pop-up rooftop parties|
|Sponsor matching|Finds sponsor-event fit|Beer sponsor + nightlife events|
|Automated weekend digest|Publishes curated post|“Top 10 events in Medellín this weekend”|
|Calendar automation|Adds saved event to calendar|User says “remind me Saturday”|
|Voice confirmation|Calls guests/vendors|Confirm attendance or vendor setup|
|WhatsApp community alerts|Sends segmented event drops|Tech events to nomads, family events to locals|
|Competitor monitoring|Tracks Eventbrite/Fever/RA inventory|“RA.co added 9 techno events today”|
|Agent training feedback|Learns from accepted/rejected rows|Improve quality score rules|

# Top GitHub / Skill Links

|Resource|URL|Score|Best Use|
|---|---|--:|---|
|OpenClaw core|[https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)|90|Self-hosted assistant/gateway|
|OpenClaw docs|[https://docs.openclaw.ai/](https://docs.openclaw.ai/)|88|Setup, channels, gateway concepts|
|OpenClaw website|[https://openclaw.ai/](https://openclaw.ai/)|84|Product positioning and channel behavior|
|Apify OpenClaw plugin|[https://github.com/apify/apify-openclaw-plugin](https://github.com/apify/apify-openclaw-plugin)|94|Scraping/data extraction worker|
|Apify OpenClaw integration docs|[https://docs.apify.com/platform/integrations/openclaw](https://docs.apify.com/platform/integrations/openclaw)|94|Plugin setup and Actor usage|
|Apify OpenClaw marketplace page|[https://apify.com/integrations/openclaw](https://apify.com/integrations/openclaw)|90|Install + setup flow|
|Awesome OpenClaw|[https://github.com/rohitg00/awesome-openclaw](https://github.com/rohitg00/awesome-openclaw)|82|Use-case discovery|
|Awesome OpenClaw use cases|[https://github.com/hesamsheikh/awesome-openclaw-usecases](https://github.com/hesamsheikh/awesome-openclaw-usecases)|80|Event ops examples|
|Apify OpenClaw skills|[https://github.com/samehjarour/apify-openclaw-skills](https://github.com/samehjarour/apify-openclaw-skills)|76|Skill format ideas|
|OpenClaw skills index|[https://clawskills.sh/openclaw/integrations/github](https://clawskills.sh/openclaw/integrations/github)|70|Skill discovery only; audit before use|

# Best Workflow for Event Discovery

```text
06:00 daily cron
→ Mastra starts eventDiscoveryWorkflow
→ OpenClaw runs approved Apify/Playwright jobs
→ raw_events saved to Supabase
→ normalize + dedupe
→ Google Places venue enrichment
→ Gemini summary/tags
→ quality score
→ Patricia approval alert via WhatsApp
→ approved events appear in chat cards + map pins
```

# Best OpenClaw Commands

|Command|Result|
|---|---|
|“Run Medellín event ingest now”|Starts all enabled scrapers|
|“Check failed event sources”|Returns failed jobs + reason|
|“Show new events needing approval”|Sends review list|
|“Verify this event link”|Opens source URL and checks status|
|“Find missing venue pins”|Runs Places enrichment retry|
|“Create weekend event digest”|Drafts post from approved rows|
|“Send me top tech events Friday”|Personalized WhatsApp brief|

# Recommended MVP Tasks

|Task|Description|Priority|
|---|---|---|
|OC-EVD-01|Install and sandbox OpenClaw gateway|P0|
|OC-EVD-02|Install Apify OpenClaw plugin|P0|
|OC-EVD-03|Create allowlisted scrape skills only|P0|
|OC-EVD-04|Add Supabase write endpoint for raw events|P0|
|OC-EVD-05|Add daily event ingest command|P0|
|OC-EVD-06|Add failure alert to Patricia|P1|
|OC-EVD-07|Add manual “run scraper now” command|P1|
|OC-EVD-08|Add source freshness report|P1|
|OC-EVD-09|Add ticket URL verifier|P1|
|OC-EVD-10|Add audit logs for every action|P0|

# Safety Rules

|Rule|Why|
|---|---|
|Never let OpenClaw publish directly|Prevents fake/stale events|
|No service-role keys in OpenClaw chat context|Avoids data breach|
|Use backend write API with scoped token|Safer than direct DB writes|
|Allowlist only approved Actors/skills|Reduces malware risk|
|Human approval before `is_active=true`|Keeps quality high|
|Log every scrape run|Debugging and trust|
|Rate-limit each source|Avoid bans|
|Raw data first, normalized second|Replayable pipeline|
|OpenClaw cannot touch Stripe|Payments stay deterministic|
|Audit all third-party skills|OpenClaw ecosystem has known security risk|

# Final Recommendation

Use OpenClaw for **operations and automation**, not ranking or truth.

Best first implementation:

```text
OpenClaw + Apify
→ daily event scraping
→ Supabase raw_events
→ Mastra normalize/dedupe/enrich
→ Patricia approval
→ mdeai chat/cards/map
```

Start with **Eventbrite + RA.co + Medellín Travel** only.

Final grade with safety gates: **92/100**.