---
id: ECOM-C-002
title: Medusa service setup
status: Not Started
priority: P0
phase: core
depends_on: [ECOM-C-001]
blocks: [ECOM-C-003, ECOM-C-004, ECOM-C-005, ECOM-C-006]
skills: [building-with-medusa, medusa-commerce, db-generate, db-migrate]
official_refs:
  - https://docs.medusajs.com
  - https://github.com/medusajs/medusa
---

# ECOM-C-002 - Medusa service setup

## Objective

Add Medusa as a bounded backend service, not a storefront.

## Scope

- Create Medusa backend under the selected path, preferably `commerce/medusa/`.
- Pin the Medusa version.
- Use port `9000` locally unless blocked.
- Configure CORS for existing `mdeapp` on port `3001`.
- Add a service README with start, health, migration, and rollback commands.
- Do not add a Medusa Next.js storefront.

## Skill Notes

- `building-with-medusa`: validate with build after setup.
- `db-generate` and `db-migrate`: record that custom module migrations require both commands in later tasks.

## Acceptance Criteria

- [ ] Medusa service starts locally.
- [ ] Health endpoint responds.
- [ ] Store API responds.
- [ ] Admin app is reachable.
- [ ] No new ecommerce storefront app is added.
- [ ] `mdeapp` remains untouched except optional workspace wiring.

## Proof Commands

```bash
cd commerce/medusa && npm run dev
curl -fsS http://localhost:9000/health
find /home/sk/mdeai -maxdepth 4 -iname '*storefront*'
```

## Tests

- Medusa build command for the service.
- API smoke for `/health`.

## Rollback

Remove the Medusa service directory and any workspace/package entries added for it.

