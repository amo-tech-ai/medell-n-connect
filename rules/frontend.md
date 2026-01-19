# Frontend Rules

## 3-Panel Layout Invariant

All main pages follow the 3-panel layout:

| Panel | Purpose | Content |
|-------|---------|---------|
| **Left** | Context | Navigation, filters, user info |
| **Main** | Work | Primary content, listings, details |
| **Right** | Intelligence | Map, AI suggestions, quick actions |

Mobile: Panels collapse to single column with bottom navigation.

## AI Interaction Pattern

AI **proposes only** — never auto-applies changes:

1. **Preview** — Show what AI suggests
2. **Apply** — User confirms action
3. **Undo** — User can revert

## Required States

Every data-fetching component must handle:

- **Loading** — Skeleton or spinner
- **Empty** — Helpful message with action
- **Error** — Clear message with retry option
- **Success** — Actual content

```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState onRetry={refetch} />;
if (!data?.length) return <EmptyState />;
return <Content data={data} />;
```

## No Secrets in Client

- **Never** store API keys in frontend code
- Use environment variables only for public keys (e.g., Supabase anon key)
- All private operations go through edge functions

## Design System

- Use semantic tokens from `index.css` and `tailwind.config.ts`
- No hardcoded colors — everything themed
- All colors in HSL format

## Related

- [Backend Rules](./backend.md)
- [Prompts](../docs/prompts/README.md)
