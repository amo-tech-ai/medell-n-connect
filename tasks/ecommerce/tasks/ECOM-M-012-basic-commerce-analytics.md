---
id: ECOM-M-012
title: Basic commerce analytics
status: Not Started
priority: P2
phase: mvp
depends_on: [ECOM-C-018]
blocks: [ECOM-M-013]
skills: [mde-task-lifecycle]
official_refs:
  - https://supabase.com/docs
---

# ECOM-M-012 - Basic commerce analytics

## Objective

Track commerce funnel events without duplicating commerce truth.

## Scope

- Track search, product card click, add-to-cart, checkout-start, checkout-complete.
- Store product id and event metadata only.
- Respect existing analytics/privacy patterns.

## Acceptance Criteria

- [ ] Funnel events are recorded.
- [ ] Analytics table has RLS.
- [ ] No order/cart/product truth is stored.
- [ ] Events can be used for conversion reporting.

## Proof Commands

```bash
cd mdeapp && npm test -- src/lib/commerce/analytics.test.ts
rg -n "commerce_analytics" supabase/migrations mdeapp/src
```

## Tests

- Unit tests for event writer.
- RLS policy checks.

## Rollback

Disable analytics writes.

