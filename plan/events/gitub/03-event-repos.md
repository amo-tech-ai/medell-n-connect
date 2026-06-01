## Best overall for mdeai

Use **`atef-ataya/ai-event-planner` as an ADK pattern reference**, not your main runtime. It uses **Google ADK + multi-agent orchestration + Streamlit** for weddings, birthdays, and corporate event planning. ([GitHub](https://github.com/atef-ataya/ai-event-planner?utm_source=chatgpt.com "atef-ataya/ai-event-planner: Plan events using Google ADK ..."))

Your mdeai architecture should stay:

```text
CopilotKit = UI
Mastra = main router/workflows
ADK = Google Maps/Search sidecar
Supabase = events, tickets, leads
Stripe = payments
vis.gl = map
```

This matches your own ADK plan: ADK should be a bounded `services/adk-grounding/` sidecar, not a second product brain.

---

## How `ai-event-planner` uses ADK

|Area|How it works|How mdeai should use it|
|---|---|---|
|Multi-agent planning|Breaks event planning into AI agents|Copy the pattern for venue, budget, sponsor, schedule agents|
|Google ADK|Uses ADK as the agent framework|Use ADK only for Maps/Search intelligence|
|Streamlit UI|Demo interface|Do not copy; use CopilotKit instead|
|Event proposals|Generates structured planning output|Use for Roberto event draft cards|
|Visual/speech/export features|Demo-friendly outputs|Later phase, not MVP|

---

## Top 20 repo ranking for mdeai

|Rank|Repo|Score|Best use|Use now?|
|--:|---|--:|---|---|
|1|[https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra)|99|Main runtime foundation|✅ Yes|
|2|[https://github.com/atef-ataya/ai-event-planner](https://github.com/atef-ataya/ai-event-planner)|94|ADK multi-agent event planning|✅ Pattern only|
|3|[https://github.com/fossasia/eventyay](https://github.com/fossasia/eventyay)|91|Full event platform ideas|✅ Reference|
|4|[https://github.com/fossasia/open-event-server](https://github.com/fossasia/open-event-server)|90|Events API, tracks, schedules, speakers|✅ Reference|
|5|[https://github.com/indico/indico](https://github.com/indico/indico)|88|Conference-grade event workflows|🟡 Reference|
|6|[https://github.com/Attendize/Attendize](https://github.com/Attendize/Attendize)|87|Ticketing, attendee management|✅ Reference|
|7|[https://pretix.eu/about/en/](https://pretix.eu/about/en/)|86|Ticketing product logic|✅ Reference|
|8|[https://github.com/warrenshiv/AIEventPlanner](https://github.com/warrenshiv/AIEventPlanner)|84|AI planning UX|🟡 Pattern|
|9|[https://github.com/ArokyaMatthew/Eventflow.ai](https://github.com/ArokyaMatthew/Eventflow.ai)|83|Event dashboard concepts|🟡 Pattern|
|10|[https://github.com/Jennifercheukyin/event_planning_AI](https://github.com/Jennifercheukyin/event_planning_AI)|82|AI event assistant flow|🟡 Pattern|
|11|[https://github.com/noor848/Multi-Agent-Automate-Event-Planning](https://github.com/noor848/Multi-Agent-Automate-Event-Planning)|81|Multi-agent automation ideas|🟡 Pattern|
|12|[https://github.com/Godson90/event-planner-ai-agent](https://github.com/Godson90/event-planner-ai-agent)|79|Simple AI agent planner|🟡 Learn|
|13|[https://github.com/iamsmsr/PlannrAI-Sync-AI-powered-Event-Planning-Management-Platform](https://github.com/iamsmsr/PlannrAI-Sync-AI-powered-Event-Planning-Management-Platform)|78|Planning + management concepts|🟡 Learn|
|14|[https://github.com/aaravriyer193/Event-Ally-ai-event-planner](https://github.com/aaravriyer193/Event-Ally-ai-event-planner)|76|AI assistant inspiration|🟡 Learn|
|15|[https://github.com/benjaminematton/venue-concierge](https://github.com/benjaminematton/venue-concierge)|75|Venue concierge idea|✅ Useful for Maps|
|16|[https://github.com/ghantapavan93/FanFlow-AI](https://github.com/ghantapavan93/FanFlow-AI)|74|Fan engagement / event marketing|🟡 Later|
|17|[https://github.com/yoanbernabeu/OpenStreamPoll](https://github.com/yoanbernabeu/OpenStreamPoll)|73|Polling/voting ideas|🟡 Phase 2/3|
|18|[https://github.com/andersonmcalpine/groupplan](https://github.com/andersonmcalpine/groupplan)|72|Group planning UX|🟡 Later|
|19|[https://github.com/ayuxxxxx/kubecon-eu-mcp](https://github.com/ayuxxxxx/kubecon-eu-mcp)|70|Event MCP ideas|🟡 Advanced|
|20|[https://github.com/thevillanelle/gather](https://github.com/thevillanelle/gather)|69|Social gathering UX|🔴 Low priority|

---

## What to build from this

|mdeai feature|Best repo inspiration|
|---|---|
|Roberto creates event by chat|`ai-event-planner` + CopilotKit Mastra|
|Event wizard|Eventyay / Indico / Attendize|
|Tickets + QR scan|Attendize / Pretix|
|Venue intelligence|`venue-concierge` + ADK Maps sidecar|
|Sponsor planning|`ai-event-planner` agent pattern|
|Voting/contests|OpenStreamPoll, later only|
|Full platform architecture|Keep your own Mastra + Supabase plan|

---

## Final recommendation

**Best strategy:**  
Do **not** switch to ADK-only.

Use:

```text
Mastra = main brain
ADK = Google Maps/Search specialist
CopilotKit = user interface
Supabase = truth
Stripe = money
```

`ai-event-planner` is valuable because it shows **how to break event planning into agents**, but mdeai should implement those agents inside **Mastra workflows**, with ADK only for grounded Google intelligence.