# Edge Functions Rules

## Authentication

- **Validate auth on every request** — No exceptions
- Extract user from JWT token
- Return 401 for unauthenticated requests
- Return 403 for unauthorized access

```typescript
const authHeader = req.headers.get('Authorization');
if (!authHeader) {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
}
```

## Input Validation

- **Validate all inputs** with schema (Zod recommended)
- Reject malformed requests early
- Sanitize strings to prevent injection

```typescript
const schema = z.object({
  query: z.string().min(1).max(500),
  limit: z.number().int().min(1).max(100).default(20),
});
```

## Output Validation

- **Return structured responses** — consistent shape
- Include success/error status
- Provide meaningful error messages

```typescript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: { code: 'VALIDATION_ERROR', message: '...' } }
```

## Rate Limiting

- Implement per-user rate limits for expensive operations
- AI calls: max 10/minute per user
- Search: max 30/minute per user

## Logging

- Log all AI runs to `ai_runs` table
- Include: agent_name, input_tokens, output_tokens, duration_ms, status
- Log errors with full context

## Timeouts & Fallbacks

- Set reasonable timeouts (30s for AI, 10s for DB)
- Provide graceful fallbacks on timeout
- Return partial results when possible

## Related

- [Supabase Rules](./supabase.md)
- [Backend Rules](./backend.md)
