# Supabase Rules

## RLS Principles

1. **No public writes** — All INSERT/UPDATE/DELETE require authentication
2. **User-owned rows** — Users can only access their own data
3. **Admin-only listing writes** — Only admins can create/edit listings (apartments, cars, restaurants, events)
4. **Read access varies** — Public listings are readable; user data is private

## Schema Rules

- Schema is the **source of truth** — code follows schema, not the other way around
- Never modify `auth.users` directly — use `profiles` table
- Use proper foreign keys with `ON DELETE CASCADE` where appropriate
- Add indexes for frequently queried columns

## Security

- **Never expose service role key** in frontend code
- Use `anon` key for client-side operations
- Service role is for edge functions only
- Validate all inputs server-side

## Performance

- Use pagination for list queries (default limit: 50)
- Add indexes for foreign keys and filter columns
- Use `(select auth.uid())` pattern in RLS for performance:

```sql
-- ✅ Good: Subquery pattern
create policy "Users read own data"
on profiles for select
using (id = (select auth.uid()));

-- ❌ Bad: Direct function call
create policy "Users read own data"
on profiles for select
using (id = auth.uid());
```

## Related

- [Edge Functions Rules](./edge-functions.md)
- [Backend Rules](./backend.md)
