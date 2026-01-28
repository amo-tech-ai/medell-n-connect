# Auth Audit: OAuth Troubleshooting

> Common issues and fixes for Supabase OAuth, particularly Google sign-in.

**Date:** 2026-01-28  
**Scope:** OAuth callbacks, redirect handling, SPA routing

---

## Problem: "Cannot GET /" or 404 After OAuth

### Symptoms

After Google sign-in, user sees:
- **"Cannot GET /"** (or 404)
- **Failed to load resource: 404** for URL with `#access_token=...`
- Session not persisting after redirect

### Root Causes

1. **OAuth callback not processed before render**
   - Supabase uses hash fragment (`#access_token=...`)
   - Session recovery runs in `_getSessionFromURL()`
   - If something runs before `getSession()`, hash may not be processed

2. **No explicit `detectSessionInUrl`**
   - Default is `true` in browser, but explicit is safer

3. **Token left in URL after callback**
   - Supabase clears hash after consuming session
   - Short window where URL may be used by other code

4. **SPA fallback not configured**
   - Dev server doesn't treat app as SPA
   - Request to `/` doesn't serve `index.html`

---

## Fixes Applied

### 1. Supabase Client Configuration

```typescript
// src/integrations/supabase/client.ts
export const supabase = createClient(url, key, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Explicit
  },
});
```

### 2. AuthProvider Init Order

```typescript
useEffect(() => {
  let mounted = true;

  const initAuth = async () => {
    // Get session first (processes URL hash)
    const { data: { session } } = await supabase.auth.getSession();
    
    if (mounted) {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }

    // Clean up URL hash if present
    if (window.location.hash) {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search
      );
    }
  };

  // Set up listener BEFORE calling initAuth
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    }
  );

  initAuth();

  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);
```

### 3. Vite Config for SPA

```typescript
// vite.config.ts
export default defineConfig({
  // ... other config
  appType: "spa", // Ensures SPA routing
  server: {
    historyApiFallback: true,
  },
});
```

---

## Verification Checklist

### Google Cloud Console

- [ ] **Authorized JavaScript origins** includes app URL
- [ ] **Authorized redirect URIs** includes `https://<project-id>.supabase.co/auth/v1/callback`
- [ ] Required scopes configured: `openid`, `userinfo.email`, `userinfo.profile`

### Supabase Dashboard

- [ ] Google provider enabled
- [ ] Client ID and Secret entered correctly
- [ ] **Site URL** matches app URL
- [ ] **Redirect URLs** includes app URL

### Frontend Code

- [ ] `detectSessionInUrl: true` in Supabase client
- [ ] Auth listener set up before `getSession()`
- [ ] URL hash cleaned up after OAuth callback
- [ ] Mounted guard prevents state updates after unmount

### Vite/Build Config

- [ ] `appType: \"spa\"` set in vite.config.ts
- [ ] History API fallback enabled for dev server

---

## Testing OAuth Flow

### Manual Test Steps

1. Open app in incognito window
2. Click "Sign in with Google"
3. Complete Google consent
4. Verify redirect back to app
5. Check: URL should be clean (no hash)
6. Check: User should be logged in
7. Refresh page: Session should persist

### Console Checks

```typescript
// Add temporary logging
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth event:", event);
  console.log("Session:", session);
});
```

---

## Common Error Messages

| Error | Likely Cause | Fix |
|-------|--------------|-----|
| `redirect_uri_mismatch` | Google Console mismatch | Add exact callback URL |
| `Cannot GET /` | SPA routing broken | Set `appType: \"spa\"` |
| `requested path is invalid` | Supabase URL config wrong | Check Site URL in dashboard |
| Session null after redirect | `detectSessionInUrl` issue | Add to client config |
| CORS error | Wrong origin | Add origin to Google Console |

---

## Related Files

| File | Purpose |
|------|---------|
| `src/integrations/supabase/client.ts` | Supabase client with auth config |
| `src/hooks/useAuth.tsx` | Auth provider and hooks |
| `vite.config.ts` | SPA mode configuration |

---

## Related

- [React Auth Guide](./01-react-auth.md)
- [Google OAuth Setup](./02-google-oauth.md)
