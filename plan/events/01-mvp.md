> **Review (2026-05-17):** See [`../mvp-events.md`](../mvp-events.md) for repo-verified corrections. Canonical spec: [`EVENTS-MVP-PLAN.md`](./EVENTS-MVP-PLAN.md). This draft **overstates** host/scanner UI as built; **defer** Places autocomplete to advanced.

---

Here is the **MVP-only** plan, kept narrow and production-ready.

## Events MVP Plan

### What ships now
Ship only the core ticketing loop: event creation, event browsing, checkout, payment webhook, attendee wallet, QR ticket generation, staff scan, and a live host dashboard. The MVP should also include a basic venue field, optional sponsor logo display if it is already trivial, and minimal Mastra-powered event discovery that only **proposes** drafts and explanations, never mutates money or tickets. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

### What stays out
Defer complex venue management, sponsor marketplace depth, OpenClaw automation, contest integrations, advanced marketing automation, advanced Maps intelligence, and Hermes-style ranking. The reason is simple: the smallest useful version is the first real ticket sale with no oversell, QR validation, and a host view that updates fast enough to run the door and reconcile sales. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)

## MVP feature list

### Required routes
- `/host/event/new`.
- `/events`.
- `/events/:id`.
- `ticket-checkout`.
- `ticket-payment-webhook`.
- `/me/tickets`.
- `ticket-validate`.
- `/staff/check-in/:event`.
- `/host/event/:id`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

### Required product behavior
- Organizer can create and publish an event with a name, date, venue, capacity, and at least one ticket tier.
- Buyer can open an event page and initiate checkout.
- Checkout must return a Stripe Checkout URL quickly and without extra steps.
- Payment webhook must create the attendee once and only once.
- Buyer receives a QR ticket in the wallet and by email if email delivery already exists.
- Staff can scan QR codes and get instant valid / invalid / already-used feedback.
- Host sees live counts for tickets sold, revenue, check-ins, and no-shows. [supabase](https://supabase.com/docs/guides/functions)

### Nice-to-have only if already easy
- Basic sponsor logo field on the event page.
- Minimal Mastra event discovery that helps users find or explain events but never performs payment or ticket writes.

**Not MVP:** Places autocomplete / `place_id` pipeline — defer to EVT-039+ ([`EVENTS-ADVANCED-PLAN.md`](./EVENTS-ADVANCED-PLAN.md)).

## Current state audit

### What already exists
**Repo truth (2026-05-17):** Event tables + ticket **edge functions** exist; buyer path proved **locally** (EVT-032–034). **`/host/event/*` and `/staff/check-in/*` are not in `App.tsx`** — EVT-027–037 still open. Interim host surface: `/admin/events`. See [`events-progress.md`](../events-progress.md).

### What is still missing
The gate items that are explicitly not green include the end-to-end buyer flow, valid scan and rescan behavior, staff-link revocation, 50-buyer load test, and Lighthouse accessibility targets. In other words, the product is not yet proven under real ticketing load, even if much of the scaffolding is present. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

### Supabase posture
Supabase should own money, tickets, attendees, QR validation, and fraud enforcement. Supabase Edge Functions are the right place for short-lived webhook and checkout endpoints, and Supabase RLS must stay enabled on exposed tables with auth checks enforced at the database layer. [supabase](https://supabase.com/docs/guides/auth)

### Maps posture
Google Places is enough for MVP venue selection because it supports text search, autocomplete, place details, and place IDs. For MVP, use it only to help organizers pick a venue, capture place_id, show a map pin, and provide a directions link. [developers.google](https://developers.google.com/maps/documentation/places/web-service)

## MVP user journeys

### Organizer creates event
The organizer opens `/host/event/new`, enters core event details, adds at least one ticket tier, and publishes. The create flow should support draft save, validation, and a clear publish step so the system never exposes half-finished events as live inventory. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)

### Buyer buys ticket
The buyer opens `/events` or `/events/:id`, selects a ticket tier, and clicks buy. The system creates a checkout session, returns the Stripe URL, and redirects the buyer without extra branching. [supabase](https://supabase.com/docs/guides/functions)

### Buyer receives QR
After payment success, the webhook mints the attendee record and QR payload, then the wallet page `/me/tickets` shows the ticket. The wallet should be the canonical buyer surface for ticket retrieval and should work on mobile first. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

### Staff scans ticket
At `/staff/check-in/:event`, staff scans the QR and gets a fast pass/fail result. A used QR must show already-used status, and an invalid or forged QR must fail without exposing attendee details. [supabase](https://supabase.com/docs/guides/functions)

### Host sees dashboard
At `/host/event/:id`, the host sees live ticket sales, check-ins, and no-shows. The dashboard should update in realtime so the host does not refresh while the event is in progress. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

### Admin verifies issue
An admin view should exist only for issue resolution, webhook debugging, and manual recovery. It should not become a parallel operations console for normal event execution. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

## MVP Supabase plan

### Tables needed
Keep the schema narrow: `events`, `event_tickets`, `event_orders`, `event_attendees`, `event_venues`, and a small audit log for critical mutations. If staff links are implemented, keep that as a separate table with expiry and revocation fields. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)

### RLS
Enable RLS on every exposed table and keep policies simple: organizers see their events, buyers see their own orders and tickets, staff sees only assigned event check-in data, and service-role writes are reserved for webhooks and server-side mutation paths. Supabase explicitly recommends RLS on exposed schemas and using `(select auth.uid())` in policies for performance and correctness. [supabase](https://supabase.com/docs/guides/auth)

### Indexes
Index `organizer_id`, `event_id`, `order_id`, `attendee_id`, `ticket_code` or `qr_jti`, and any foreign keys used in policies or realtime lookups. This matters because RLS performance depends on indexed policy columns, and Supabase recommends indexing columns referenced by policies. [supabase](https://supabase.com/docs/guides/auth)

### RPCs
Use minimal RPCs only where atomicity matters: ticket capacity reservation, attendee lookup for scan validation, and dashboard aggregates if plain queries are not enough. Do not create a sprawling RPC layer for convenience. [supabase](https://supabase.com/docs/guides/auth)

### Realtime channels
Use realtime for the host dashboard and staff scan state, not for everything. Supabase Realtime supports broadcast, presence, and database-change subscriptions, which makes it appropriate for live dashboard tiles and scan results .

### Storage buckets
Use one private bucket for ticket PDFs or pass assets if needed, and one public bucket only for event images or logos. Do not expand storage into a media platform at MVP stage. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

### Audit logs
Log webhook receipts, scan attempts, staff-link revocations, and manual admin overrides. This gives you the minimum accountability needed to debug ticketing issues without building a full compliance system. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

## MVP edge functions

### `ticket-checkout`
Purpose: create the Stripe Checkout session for a selected ticket tier.  
Input: `event_id`, `ticket_tier_id`, buyer identity, quantity, and return URL.  
Output: checkout URL plus session metadata.  
Auth: authenticated buyer, with public read only if the event is public.  
Idempotency: required on repeated clicks and retries.  
Tests: unit test for price calculation, capacity check, and duplicate-session handling. [supabase](https://supabase.com/docs/guides/functions)

### `ticket-payment-webhook`
Purpose: consume Stripe checkout success and create the attendee record.  
Input: Stripe signature and event payload.  
Output: stored order, attendee record, QR generation payload, and delivery job result.  
Auth: Stripe signature verification only.  
Idempotency: must use Stripe event ID or payment intent ID to prevent duplicate attendees.  
Tests: signed webhook test, replay test, sold-out test, and failure recovery test. [supabase](https://supabase.com/docs/guides/functions)

### `ticket-validate`
Purpose: verify QR at the door and mark check-in state.  
Input: QR token or code plus staff context.  
Output: valid, invalid, expired, or already-used result with attendee name if allowed.  
Auth: staff or event-scoped scanner link.  
Idempotency: scan must not double-check-in.  
Tests: valid scan, rescan, forged token, expired token, offline retry behavior if you support queued scans. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

### `staff-link` if needed
Purpose: issue or revoke event-scoped staff access.  
Input: event ID and staff identity or invite token.  
Output: temporary access token or magic-link activation.  
Auth: organizer only.  
Idempotency: repeated invites should reuse or rotate cleanly.  
Tests: invite, revoke, expiry, and cross-event access denial. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

### `event-create-update` if needed
Purpose: keep host event creation logic out of the client.  
Input: event draft fields, venue fields, ticket tiers.  
Output: draft ID or updated event row.  
Auth: organizer only.  
Idempotency: draft save should be safe on autosave.  
Tests: draft autosave, publish validation, and missing-tier rejection. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

## MVP frontend pages

### `/host/event/new`
User: organizer.  
Features: draft autosave, event metadata, ticket tiers, venue field, sponsor logo field if trivial, publish button.  
States: loading skeleton, inline validation, publish error, empty draft help.  
Mobile: large touch targets, sticky save/publish actions, minimal multi-column behavior. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

### `/events`
User: public visitor or logged-in buyer.  
Features: browse upcoming events, filter basics, click through to detail, clear sold-out state.  
States: loading, empty, and no-results fallback.  
Mobile: card list first, no heavy map dependence. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

### `/events/:id`
User: buyer and organizer preview.  
Features: event detail, venue, ticket tiers, buy button, FAQ or description, sponsor logo if present.  
States: loading, sold-out, unpublished, and invalid-link handling.  
Mobile: buy CTA stays visible without requiring scroll hunting. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

### `/me/tickets`
User: buyer.  
Features: list purchased tickets, open QR, view event details, and show ticket status.  
States: loading, empty, refunded or canceled if supported later.  
Mobile: QR must be readable at a glance and easy to open full-screen. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

### `/staff/check-in/:event`
User: door staff.  
Features: scan camera, manual code entry fallback, check-in feedback, offline-friendly UI if already simple.  
States: camera permission denied, offline, pending scan, success, invalid, already-used.  
Mobile: PWA-first with giant success/failure states. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

### `/host/event/:id`
User: host organizer.  
Features: live dashboard, sales, check-ins, no-shows, attendee list, export if already easy.  
States: realtime loading, disconnected, no sales yet.  
Mobile: tiles first, table later. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

## MVP Mastra role
Mastra should stay in proposal-only mode for events. It can help discover events, explain event details, and draft event content, but it must not write payments, tickets, or attendee records. That keeps orchestration useful without risking side effects in the money path. [supabase](https://supabase.com/docs/guides/functions)

## MVP Google Maps role
Use Maps only for venue picker, address autocomplete, map pin, directions link, and place_id storage. Google Places is explicitly designed for place search, autocomplete, details, and place IDs, so it fits this narrow role well. [developers.google](https://developers.google.com/maps/documentation/places/web-service)

## MVP Gemini role
Gemini should only generate proposal content such as event descriptions, summaries, and email copy, and it should return structured output that a human must accept before save. That aligns with the repo’s “propose, don’t apply” pattern for AI. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)

## MVP testing plan
- Unit tests for checkout math, capacity enforcement, QR parsing, and policy helpers.
- Edge function tests for checkout, webhook, validation, and revoke paths.
- Stripe webhook tests for signed events and replay defense.
- Playwright tests for organizer publish, buyer purchase, wallet QR, and staff scan.
- Load test with 50 concurrent buyers to prove zero oversell.
- QR scan test for valid, already-used, and forged tokens.
- Lighthouse accessibility on the four key screens.
- `npm run floor` must pass before launch. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

## MVP acceptance criteria
- Checkout URL returns in under 2 seconds.
- Webhook creates the attendee once only.
- No oversell occurs under 50 concurrent buyers.
- QR validates once only.
- Dashboard updates in under 2 seconds.
- Lighthouse score is at least 90 on the target screens.
- Floor check stays green. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

## MVP implementation order
1. Verify schema.
2. Implement missing ticket edges.
3. Implement buyer wallet.
4. Implement scanner.
5. Implement host dashboard.
6. Run Stripe E2E.
7. Deploy preview.
8. Smoke production. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

## MVP risks
The main risks are Stripe webhook failure, oversell under concurrency, duplicate QR issuance, scanner offline behavior, RLS gaps, missing env vars, and production parity issues. Supabase Edge Functions are appropriate for the webhook and checkout side because they are designed for low-latency HTTP endpoints and webhook receivers. [supabase](https://supabase.com/docs/guides/functions)

## MVP checklist
- Event create and publish works.
- Ticket checkout returns a valid Stripe URL.
- Webhook creates exactly one attendee.
- QR is visible in wallet.
- Staff scan works on mobile.
- Rescan is blocked.
- Host dashboard updates live.
- RLS is enabled everywhere.
- Basic venue picker works.
- `npm run floor` passes.

If you want, I can turn this into the exact `EVENTS-MVP-PLAN.md` file next.