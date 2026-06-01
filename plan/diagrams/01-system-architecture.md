# 01 — Phase-1 system architecture

> Target topology for `mdeapp/`: Next.js 16 + CopilotKit **1.55.2** + Mastra + vis.gl. **Today:** `pingAgent` only — dashed boxes = planned MVP. Canon: [`plan/prd/02-core-architecture.md`](../prd/02-core-architecture.md), [`03-runtime-orchestration.md`](../prd/03-runtime-orchestration.md).

```mermaid
flowchart TB
    subgraph USERS[Users]
      ROB([Roberto host])
      CAM([Camila / Tourist])
      BUY([Andrés ticket buyer])
      PAT([Patricia admin])
    end

    subgraph FE["Frontend — Next.js 16 on Vercel"]
      LAYOUT["layout.tsx<br/>CopilotKit 1.55.2 provider"]
      CHAT["/chat — 3-panel canvas"]
      HOST["/host/event/new"]
      SIDEBAR["CopilotSidebar — / stub W1"]
      ACTIONS["useCopilotAction × N"]
      COAGENT["useCoAgent / useCoAgentState"]
      HITL["renderAndWaitForResponse"]
      MC["MapContext + platform/contracts"]
      MAPS["vis.gl + markerclusterer"]
    end

    subgraph RUNTIME["Runtime in-process"]
      ROUTE["/api/copilotkit<br/>CopilotRuntime + MastraAgent.getLocalAgents"]
    end

    subgraph AG["Mastra — MVP max 4 agents"]
      PING[pingAgent ✅ W1]
      RT[routerAgent planned]
      HEA[hostEventAgent planned]
      CONC[conciergeAgent planned thin]
    end

    subgraph WF["Mastra workflows — not separate agents"]
      RS[rental-search]
      VD[venue-discovery]
      GS[grounded-search]
    end

    subgraph SB[Supabase zkwcbyxiwklihegjhuql]
      AUTH[Supabase Auth]
      RLS[122 tables RLS-tight]
      RPC[decide_approval RPC]
      OBS[ai_runs + tool logs]
      CACHE[places_*_cache]
    end

    subgraph EXT[External]
      GMAPS[Google Maps Platform]
      GPLA[Places + Grounding Lite via edge/tools]
      GEM[Gemini 3.5 Flash]
      STR[Stripe via edge fns]
      INF[Infisical]
    end

    USERS --> FE
    CHAT --> MC
    CHAT --> ACTIONS
    HOST --> HEA
    LAYOUT --> SIDEBAR
    FE -.AG-UI stream.-> ROUTE
    ROUTE --> AG
    RT --> RS
    RT --> VD
    RT --> GS
    HEA --> VD
    AG --> GEM
    AG --> GPLA
    AG --> SB
    MC --> MAPS
    MAPS --> GMAPS
    HITL --> RPC
    FE --> AUTH
    BUY -.checkout.-> STR
    SB <-.secrets.-> INF

    classDef live fill:#c8e6c9,stroke:#2e7d32
    classDef planned fill:#fff9c4,stroke:#f57f17,stroke-dasharray:5 5
    classDef shared fill:#e1f5fe,stroke:#0277bd
    classDef external fill:#fff3e0,stroke:#ef6c00
    class PING,LAYOUT,SIDEBAR,ROUTE live
    class CHAT,RT,HEA,CONC,RS,VD,GS,MC,HITL,HOST planned
    class SB,ACTIONS,COAGENT,MAPS shared
    class EXT,GMAPS,GPLA,GEM,STR,INF external
```

**Phase 2 (not in diagram):** Lingui ES/EN · `extended-component-library` · pgvector rental search · OpenClaw batch ([`06-openclaw-integration.md`](./06-openclaw-integration.md)).
