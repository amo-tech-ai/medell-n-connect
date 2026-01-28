# Google OAuth Setup

> Complete guide for implementing Sign in with Google with Supabase.

**Source:** [Supabase Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)

---

## Prerequisites

1. **Google Cloud Project** — Create at [Google Cloud Console](https://console.cloud.google.com)
2. **Supabase Project** — Active project with auth enabled

---

## Step 1: Configure Google Cloud

### Create OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services > Credentials**
3. Click **Create Credentials > OAuth Client ID**
4. Choose **Web application**

### Configure Authorized URIs

**Authorized JavaScript origins:**
- `https://your-app.com`
- `http://localhost:5173` (for development)

**Authorized redirect URIs:**
- `https://<project-id>.supabase.co/auth/v1/callback`
- `http://localhost:3000/auth/v1/callback` (for local dev)

### Required Scopes

In **OAuth Consent Screen > Scopes**:
- `openid` (add manually)
- `.../auth/userinfo.email` (default)
- `.../auth/userinfo.profile` (default)

---

## Step 2: Configure Supabase

### Dashboard Configuration

1. Go to **Authentication > Providers > Google**
2. Enable the provider
3. Enter **Client ID** and **Client Secret** from Google
4. Save

### Local Development

Add to `supabase/config.toml`:

```toml
[auth.external.google]
enabled = true
client_id = "<client-id>"
secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET)"
skip_nonce_check = false
```

Environment variable:
```bash
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET="<client-secret>"
```

---

## Step 3: Implement Sign In

### Basic OAuth Flow

```typescript
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  
  if (error) {
    console.error("OAuth error:", error);
  }
};
```

### With Redirect URL

```typescript
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });
  
  if (error) {
    console.error("OAuth error:", error);
  }
};
```

### With Refresh Token (Access Google APIs)

```typescript
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  // provider_refresh_token will be available in session
};
```

---

## Step 4: Handle Callback

Supabase uses hash fragments for OAuth callbacks:

```
https://your-app.com/#access_token=...&refresh_token=...
```

### Automatic Handling

With `detectSessionInUrl: true` in client config:

```typescript
export const supabase = createClient(url, key, {
  auth: {
    detectSessionInUrl: true,
  },
});
```

### Manual URL Cleanup

```typescript
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === "SIGNED_IN" && window.location.hash) {
        // Clean up URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

---

## Google One-Tap (Pre-built Button)

### Add Google Script

```html
<script src="https://accounts.google.com/gsi/client" async></script>
```

### Configure Button

```html
<div
  id="g_id_onload"
  data-client_id="<client ID>"
  data-context="signin"
  data-ux_mode="popup"
  data-callback="handleSignInWithGoogle"
  data-nonce=""
  data-auto_select="true"
  data-itp_support="true"
  data-use_fedcm_for_prompt="true"
></div>
<div
  class="g_id_signin"
  data-type="standard"
  data-shape="pill"
  data-theme="outline"
  data-text="signin_with"
  data-size="large"
  data-logo_alignment="left"
></div>
```

### Handle Callback

```typescript
async function handleSignInWithGoogle(response: CredentialResponse) {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: response.credential,
  });
  
  if (error) {
    console.error("Error:", error);
  }
}
```

### With Nonce (Recommended)

```typescript
const generateNonce = async (): Promise<[string, string]> => {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  const encoder = new TextEncoder();
  const encodedNonce = encoder.encode(nonce);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return [nonce, hashedNonce];
};

// Use hashedNonce for Google, nonce for Supabase
const [nonce, hashedNonce] = await generateNonce();
```

---

## Troubleshooting

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `redirect_uri_mismatch` | Mismatch in Google Console | Add exact callback URL |
| `Cannot GET /` | SPA not configured | Set `appType: "spa"` in Vite |
| Session not saved | `detectSessionInUrl` missing | Add to client config |

### Checklist

- [ ] Google Cloud project has correct redirect URIs
- [ ] Supabase dashboard has Client ID and Secret
- [ ] Client config has `detectSessionInUrl: true`
- [ ] Vite config has `appType: "spa"`
- [ ] Auth listener runs before `getSession()`

---

## Related

- [React Auth Guide](./01-react-auth.md)
- [Auth Troubleshooting](./03-auth-audit.md)
- [Google OAuth Docs](https://developers.google.com/identity)
