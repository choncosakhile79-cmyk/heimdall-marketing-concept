# Heimdall EMS Portal — Blue Landing Page Concept

A new, responsive front-end concept for Heimdall, presented as an EMS portal similar in broad purpose to emergency medical services providers. It is an independent student design concept and is not affiliated with Netcare 911.

## Features

- Blue-gradient landing page and navigation: Home, About, Johannesburg Map, Contact
- Four staff role portals: **EMS / Ambulance Driver**, **Nurse**, **EMS Admin** (dispatch dashboard) and **Hospital Admin**
- **Patients are not a role** and have no login. Their medical records (allergies, conditions, medications, medical aid status, next of kin) are accessible to all four staff roles; Nurse, EMS Admin and Hospital Admin can edit (with autosave), EMS is view-only
- Record autofill when creating a case, plus a simulated access log
- EMS dispatch dashboard: assign ambulances, change case status, simulated ambulance tracking on the map
- Admin-created emergency cases appear on EMS and Nurse dashboards as summary cards
- Case status is synchronised across all roles (and across browser tabs)
- Embedded Johannesburg map (Esri satellite default, OpenStreetMap street option), responsive layout

## Files

- `index.html` — original page (only change: one `<script src="heimdall-portals.js"></script>` line before `</body>`)
- `heimdall-portals.js` — the role/case/tracking extension; it builds on the globals defined in `index.html`

## Simulated vs. needs a real backend

| Feature | In this demo | For production |
|---|---|---|
| Sign-in / roles | Client-side check against fictional demo accounts (visible in the page, **not secure**) | Real authentication, role-based access control, sessions |
| Case sync across roles | Shared `localStorage` in one browser | Database + real-time API (WebSockets/SSE), audit log |
| Patient records + role permissions | Stored in this browser; view/edit rules enforced only in the page code | Server-enforced access control, encrypted POPIA-compliant storage, consent management |
| Access log | Simple list in the browser | Tamper-proof audit logging |
| Medical aid verification | Fake rule: a number like `DEMO-MA-123456` "verifies" | Integration with scheme/clearing-house APIs |
| Ambulance tracking & ETA | Markers move on a timer (accelerated), straight-line ETA | Vehicle GPS/telematics, routing/traffic service, CAD integration |
| Next of kin | Stored locally, shared with cases only if consent ticked | Verified consent, access logging |

## Important limitations

This is a front-end demo. Do not use it for real emergency operations. **Never enter real patient information, medical aid numbers or real passwords** — data lives in the visitor's browser and the demo credentials are public. Contact form submissions are not sent or stored. "Reset demo data" in any portal clears the saved demo data.

## Publish to GitHub Pages

1. Upload `index.html` (with the added script line), `heimdall-portals.js` and `README.md` to `main`.
2. Open Settings → Pages and confirm branch `main`, folder `/(root)`.
3. Wait for deployment; open the published URL.

The maps require an internet connection.
