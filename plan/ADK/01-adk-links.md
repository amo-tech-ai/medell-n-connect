|#|Resource|Type|Score /100|Best features|Best mdeai use case|
|---|---|--:|--:|---|---|
|1|[google/adk-samples](https://github.com/google/adk-samples)|Official repo|**98**|Official ADK sample agents, patterns, examples|Build ADK grounding service for Maps/Search|
|2|[google/adk-python](https://github.com/google/adk-python)|Official SDK|**97**|Core Python ADK framework|Build production Google agents|
|3|[google/adk-docs](https://github.com/google/adk-docs)|Official docs|**96**|Official ADK documentation|Give Cursor accurate ADK guidance|
|4|[ADK Tutorials](https://google.github.io/adk-docs/tutorials/)|Official tutorials|**95**|Multi-agent, streaming, deployment guides|Learn correct ADK patterns|
|5|[GoogleCloudPlatform/agent-starter-pack](https://github.com/GoogleCloudPlatform/agent-starter-pack)|Starter templates|**94**|Production-ready Google Cloud agent templates|Cloud Run / Vertex-ready ADK services|
|6|[Google ADK launch blog](https://developers.googleblog.com/en/agent-development-kit-easy-to-build-multi-agent-applications)|Official article|**93**|Multi-agent ADK overview|Understand ADK architecture|
|7|[sokart/adk-walkthrough](https://github.com/sokart/adk-walkthrough)|Walkthrough repo|**91**|Step-by-step multi-agent examples|Learn before building complex agents|
|8|[meteatamel/adk-demos](https://github.com/meteatamel/adk-demos/)|Demo repo|**90**|Practical ADK demos/tutorials|Quick experiments for mdeai agents|
|9|[phamvuhoang/google-adk-nextjs-starter](https://github.com/phamvuhoang/google-adk-nextjs-starter)|Next.js starter|**88**|ADK + Next.js starter|Useful reference for mdeapp integration|
|10|[RubensZimbres/A2A_ADK_MCP](https://github.com/RubensZimbres/A2A_ADK_MCP)|Multi-agent repo|**86**|ADK + A2A + MCP|Advanced agent/tool interoperability|
|11|[mcp-agent-tool-adapter](https://github.com/serkanyasr/mcp-agent-tool-adapter)|Integration tool|**85**|Converts MCP tools into ADK/LangGraph agents|Wrap Maps MCP tools for ADK|
|12|[google-adk-nocode](https://github.com/abhishekkumar35/google-adk-nocode)|No-code UI|**80**|Visual ADK agent builder|Prototype agent flows visually|
|13|[adk-made-simple](https://github.com/chongdashu/adk-made-simple)|Learning repo|**79**|Beginner lessons|Fast ADK onboarding|
|14|[AashiDutt/Google-Agent-Development-Kit-Demo](https://github.com/AashiDutt/Google-Agent-Development-Kit-Demo)|Travel planner|**78**|Travel planner example|Adapt to Medellín concierge|
|15|[linebot-adk](https://github.com/kkdai/linebot-adk)|Messaging template|**74**|LINE bot + ADK|Future WhatsApp-style chat pattern|

The awesome list says it exists because ADK resources are fragmented across repos, blogs, and examples, and it groups official resources, community projects, templates, walkthroughs, MCP integrations, articles, and videos. ([GitHub](https://raw.githubusercontent.com/tsubasakong/awesome-google-adk/main/README.md "raw.githubusercontent.com"))

Best for **mdeai**:

```text
Use official ADK samples + ADK docs + agent-starter-pack first.
Use MCP adapter + Maps grounding examples second.
Use travel planners only as inspiration.
```

Top priority:

```text
1. ADK Search/Maps grounding service
2. Wrap it as Mastra tools
3. Cache results in Supabase
4. Render cards + map pins in CopilotKit
```