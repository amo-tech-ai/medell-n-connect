---
id: ECOM-M-008
title: WhatsApp payment link
status: Not Started
priority: P2
phase: mvp
depends_on: [ECOM-C-016]
blocks: []
skills: [storefront-best-practices]
official_refs:
  - https://mastra.ai/docs
  - https://docs.stripe.com/payments/checkout
---

# ECOM-M-008 - WhatsApp payment link

## Objective

Send an existing web checkout link through WhatsApp/Chatwoot after checkout is stable.

## Scope

- Reuse `checkout_link`.
- Add human/user-requested WhatsApp send path.
- No autonomous campaigns.
- No new checkout surface.

## Acceptance Criteria

- [ ] User can receive payment link in WhatsApp/Chatwoot.
- [ ] Payment still happens through web/Stripe checkout.
- [ ] Message is sent only after user request or human action.
- [ ] Failure falls back to showing link in web chat.

## Proof Commands

```bash
cd mdeapp && npm test -- src/mastra/tools/__tests__/commerce-whatsapp-payment-link.test.ts
```

## Tests

- Mocked Chatwoot/WhatsApp API test.
- Manual sandbox smoke if available.

## Rollback

Disable WhatsApp payment tool; web checkout remains.

