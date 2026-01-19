# Backend Rules

## Source of Truth

- **Database is the source of truth** — not cache, not frontend state
- Schema changes require migrations
- Types are generated from database schema

## Edge Functions as Boundary

- All external API calls go through edge functions
- Frontend never calls third-party APIs directly
- Edge functions handle auth, validation, and error handling

## Idempotency

For bookings and critical writes:

- Use idempotency keys for payment-related operations
- Check for existing records before creating
- Handle duplicate requests gracefully

```typescript
// Check for existing booking with same idempotency key
const existing = await supabase
  .from('bookings')
  .select()
  .eq('idempotency_key', key)
  .single();

if (existing.data) {
  return existing.data; // Return existing, don't duplicate
}
```

## Error Response Shape

All errors follow consistent format:

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;      // Machine-readable: 'VALIDATION_ERROR', 'NOT_FOUND'
    message: string;   // Human-readable
    details?: any;     // Optional additional context
  };
}
```

## Success Response Shape

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
```

## Related

- [Supabase Rules](./supabase.md)
- [Edge Functions Rules](./edge-functions.md)
