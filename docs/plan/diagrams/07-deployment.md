# 07 — Production deployment + cutover

> Vercel pipeline: push → CI (`npm run floor` when wired) → preview → **MVP exit soak** → rolling 10/50/100%. App path: `mdeapp/`. Canon: [`plan/prd/09-operations-security.md`](../prd/09-operations-security.md).

```mermaid
flowchart LR
    DEV[Dev push mdeapp/] --> GH[GitHub repo]
    GH --> CI[GitHub Actions<br/>floor: lint+build+test+e2e]
    CI -->|green| VP[Vercel preview]
    VP -->|MVP exit + soak| ROLL[Rolling Release<br/>10% → 50% → 100%]
    ROLL --> PROD[Vercel production<br/>Fluid Compute · Node 24 LTS]
    PROD --> CFR[Cloudflare]
    CFR --> USER([users])
    PROD --> SB[(Supabase zkwcbyxiwklihegjhuql<br/>122 tables · RLS-tight)]
    PROD --> STR[Stripe]
    PROD --> GMP[Google Maps]
    PROD --> GEM[Gemini 3.5 Flash]
    PROD --> INF[Infisical secrets]
    PROD --> SEN[Sentry]

    classDef ci fill:#e1f5fe,stroke:#0277bd
    classDef prod fill:#c8e6c9,stroke:#2e7d32
    class CI,VP,ROLL ci
    class PROD,CFR,USER prod
```
