# Supabase Auth with React

> Complete guide for implementing authentication in React + Vite applications.

**Source:** [Supabase Docs](https://supabase.com/docs/guides/auth)

---

## Quick Start

### 1. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 2. Configure Environment Variables

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_... or anon key
```

### 3. Create Supabase Client

```typescript
// src/integrations/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Critical for OAuth callbacks
  },
});
```

---

## Auth Provider Pattern

```tsx
// src/hooks/useAuth.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

---

## Magic Link Authentication

```tsx
const handleLogin = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) {
    console.error("Error:", error.message);
  } else {
    alert("Check your email for the login link!");
  }
};
```

### Email Template Configuration

In Supabase Dashboard > Auth > Email Templates:

Change `{{ .ConfirmationURL }}` to:
```
{{ .SiteURL }}?token_hash={{ .TokenHash }}&type=email
```

---

## Token Verification on Callback

```tsx
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token_hash = params.get("token_hash");
  const type = params.get("type");

  if (token_hash) {
    supabase.auth.verifyOtp({
      token_hash,
      type: type || "email",
    }).then(({ error }) => {
      if (error) {
        setAuthError(error.message);
      } else {
        // Clear URL params
        window.history.replaceState({}, document.title, "/");
      }
    });
  }
}, []);
```

---

## Protected Routes

```tsx
// src/components/auth/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

### Usage in Router

```tsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  
  {/* Protected routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/trips" element={<Trips />} />
    <Route path="/saved" element={<Saved />} />
    <Route path="/bookings" element={<Bookings />} />
  </Route>
</Routes>
```

---

## Session Persistence

Sessions are automatically persisted in localStorage. To customize:

```typescript
export const supabase = createClient(url, key, {
  auth: {
    storage: localStorage,        // or sessionStorage
    persistSession: true,         // enable persistence
    autoRefreshToken: true,       // auto-refresh before expiry
    detectSessionInUrl: true,     // parse OAuth callback hash
  },
});
```

---

## Error Handling

```tsx
const [authError, setAuthError] = useState<string | null>(null);

const handleSignIn = async () => {
  const { error } = await signIn(email, password);
  
  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      setAuthError("Invalid email or password");
    } else if (error.message.includes("Email not confirmed")) {
      setAuthError("Please confirm your email first");
    } else {
      setAuthError(error.message);
    }
  }
};
```

---

## Related

- [Google OAuth Setup](./02-google-oauth.md)
- [Auth Troubleshooting](./03-auth-audit.md)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
