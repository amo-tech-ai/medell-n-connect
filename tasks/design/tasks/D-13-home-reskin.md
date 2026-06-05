---
id: D-13
linear: SAN-579
phase: 3
status: Blocked
blocked_by: [D-08]
outputs:
  - Re-skinned /
---

# D-13 — Re-skin Home `/`

## Purpose

Build `/` from 14-band `home-wireframe.html` using D-08 cards where browse entry appears.

## Acceptance criteria

- [ ] 14 scroll bands implemented per wireframe annotations
- [ ] Reuse shipped chat chrome (SAN-232) — extend, don't rewrite nav
- [ ] ⌘K `CommandDialog` optional slice using D-07 `command` primitive
- [ ] Browse entry row (5 verticals) per README §2D

## Wireframe / spec references

- [`../wireframe/home-wireframe.html`](../wireframe/home-wireframe.html) **primary**
- [`../wireframes/screens/001-scr-home-chat-chrome.md`](../wireframes/screens/001-scr-home-chat-chrome.md)
- [`../wireframes/screens/001-wire-home-chat.md`](../wireframes/screens/001-wire-home-chat.md)

## Legacy / dedup

- **Reuse:** SAN-232 Done

## Proof

localhost `/` · prod Tier-2 matrix · screenshot evidence
