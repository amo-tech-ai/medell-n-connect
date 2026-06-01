# SCREEN-009 evidence — 2026-05-24

## Commands

```text
npm run floor                                              → exit 0 (110 tests)
npx playwright test e2e/screens/SCREEN-009-checkout.spec.ts → 3/3
npm run smoke:ticket-checkout                              → ✅ stripeSessionUrl + orderId
curl :3001/events/reina-de-antioquia-2026-finals?checkout=success → success notice
```

## UI

- `mdeapp/src/components/modals/booking-checkout-modal.tsx` — buyer name/email, POST `/api/tickets/checkout`, `window.location.assign(stripeSessionUrl)`
- `mdeapp/src/components/events/event-checkout-notice.tsx` — post-return banner (`checkout=success|cancelled`)
- `data-testid`: `booking-checkout-modal`, tier buy buttons on event detail

## Playwright

- Spec: `mdeapp/e2e/screens/SCREEN-009-checkout.spec.ts`
- Desktop: buy flow mocks API → redirect; success notice on query param
- Mobile: sticky buy bar → checkout modal

## Vitest

- `commerce-schemas.test.ts` — ticket checkout Zod

## Acceptance

| Criterion | Status |
|-----------|--------|
| Modal never calls Stripe from browser | ✅ server proxy only |
| POST returns session URL | ✅ smoke + live edge |
| Return URL confirmation UX | ✅ EventCheckoutNotice |
| Webhook → paid | ⚠️ pending order only; complete test checkout for paid proof |

## Persona impact

Andrés on `/events/reina-de-antioquia-2026-finals` picks GA tier → Stripe Checkout; returns to success banner (QR wallet = SCREEN-015).
