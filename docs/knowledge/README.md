# Knowledge Base

> Reference documentation for AI, authentication, and platform capabilities.

**Last Updated:** 2026-01-28

---

## Quick Reference

| Category | Document | Purpose |
|----------|----------|---------|
| **Gemini AI** | [01-google-search.md](./gemini/01-google-search.md) | Grounding with Google Search |
| **Gemini AI** | [02-maps-grounding.md](./gemini/02-maps-grounding.md) | Grounding with Google Maps |
| **Gemini AI** | [03-url-context.md](./gemini/03-url-context.md) | URL Context Tool |
| **Supabase Auth** | [01-react-auth.md](./supabase/01-react-auth.md) | React + Supabase Auth |
| **Supabase Auth** | [02-google-oauth.md](./supabase/02-google-oauth.md) | Google OAuth Setup |
| **Supabase Auth** | [03-auth-audit.md](./supabase/03-auth-audit.md) | OAuth Troubleshooting |
| **User Journeys** | [user-stories.md](./user-stories.md) | Flows, personas, use cases |
| **Realtime** | [realtime-strategy.md](./realtime-strategy.md) | Supabase Realtime plan |

---

## Gemini AI Tools

### Grounding with Google Search
Connect Gemini to real-time web content for factual accuracy and citations.
- **Use cases:** Current events, verified facts, citation-backed responses
- **Models:** Gemini 3, 2.5 Pro/Flash

### Grounding with Google Maps
Location-aware responses using Google Maps data.
- **Use cases:** Nearby places, restaurant search, trip planning
- **Models:** Gemini 2.5 (NOT available in Gemini 3)
- **Note:** Requires lat/lng context

### URL Context Tool
Analyze content from specific URLs.
- **Use cases:** Compare documents, analyze code, synthesize content
- **Limit:** 20 URLs per request

---

## Supabase Auth Patterns

### Client Setup
```typescript
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
```

### OAuth Flow
1. User clicks "Sign in with Google"
2. Supabase redirects to Google consent
3. Google redirects back with hash fragment
4. Client parses `#access_token` and sets session
5. Clean URL via `history.replaceState`

### Key Fixes Applied
- `detectSessionInUrl: true` in client config
- `appType: "spa"` in Vite config
- URL hash cleanup after OAuth callback

---

## Related

- [Progress Tracker](../progress-tracker/progress.md)
- [Prompts](../prompts/README.md)
- [Rules](../../rules/README.md)
