# Google Maps key — restriction checklist (manual)

**Status:** key rotation **deferred by owner decision** (2026-06-01). Because we are not
rotating, the leaked browser key's safety rests entirely on **Google Cloud restrictions**
being tight. This is the manual checklist to confirm them.

> Do this in the **Google Cloud Console** by hand. We deliberately do **not** script it
> with `gcloud services api-keys list/get-key-string`, because that command prints the
> raw key material to the terminal — which would re-leak the value we are trying to
> contain. Eyes-on-Console only.

Console path: **APIs & Services → Credentials → API Keys →** open the Maps **browser** key
(the one used in `maps/api/js?...key=…`).

## Must-verify (the containment controls)

- [ ] **Application restriction = HTTP referrers (web sites).**
      NOT "None". A keystring with no referrer restriction is usable from anywhere.

- [ ] **Referrer allowlist contains ONLY our domains.** Expected entries:
  - `https://www.mdeai.co/*`
  - `https://mdeai.co/*` and/or `https://*.mdeai.co/*`
  - dev only: `http://localhost:3001/*` (remove before/at production hardening)
  - ❌ No `*`, no bare `*.com`, no unrelated domains. A wildcard here defeats the whole control.

- [ ] **API restriction = "Restrict key" to ONLY the Maps APIs we call.** NOT "Don't
      restrict key". Enable only what the app uses, e.g.:
  - Maps JavaScript API
  - Places API (New)   ← we send `X-Goog-FieldMask` on every call (cost lever)
  - Geocoding API (if used)
  - Maps Static API (only if used)
      Everything else should be **disabled** for this key.

- [ ] **Billing budget + alert is set** on the billing account, so abuse shows up fast.
      Console: **Billing → Budgets & alerts.** Set a monthly budget with email alerts at
      50% / 90% / 100%.

- [ ] **Per-API quota caps are set** to bound worst-case cost if the key is abused.
      Console: **APIs & Services → (each Maps API) → Quotas & System Limits.** Cap
      requests/day (and requests/min) to realistic ceilings for our traffic.

- [ ] **Review recent usage for anomalies** since the leak window.
      Console: **APIs & Services → Metrics** (filter to the Maps APIs / this key). Look for
      unexpected spikes, unfamiliar referrers, or traffic from regions we don't serve.

## If anything above is wrong

Tighten the restriction in Console first (referrers, API list, quotas) — that immediately
shrinks the blast radius without rotating. Then decide with the owner whether the residual
exposure still warrants rotation. **Rotation remains the owner's call**, not an automatic
step.

## Why we can defer rotation

A Maps **browser** key is designed to be shipped to clients (it appears in page HTML), so
its security model is *restriction-based*, not *secrecy-based*. With (a) referrer allowlist
locked to our domains, (b) API restriction to just the Maps APIs, and (c) billing + quota
caps, a copy of the keystring is low-value to an attacker: it only works from our origins
and can't run up unbounded cost. The compensating controls in
[`pre-push-secret-checklist.md`](pre-push-secret-checklist.md) keep it out of git/remotes;
the controls here keep it useless if it leaked elsewhere.
