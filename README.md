# Heimdall EMS Portal — Blue Landing Page Concept

A responsive front-end concept for Heimdall, presented as an EMS portal similar in broad purpose to emergency medical services providers. It is an independent student design concept and is not affiliated with Netcare 911.

## Features

- Blue-gradient landing page and navigation: Home, About, Johannesburg Map, Contact
- Four demo roles with fictional sign-in: EMS, Nurse, EMS Admin and Hospital Admin
- Admins can create sample emergency cases that appear in the EMS and Nurse workspaces
- **Medical aid status on every emergency case: Active, Not active or Unknown**
- Interactive Johannesburg map (Esri satellite by default, OpenStreetMap street view) with demo case pins
- External Google Maps shortcut
- Contact form preview
- Responsive mobile layout

## Medical aid status on emergency cases

When an admin creates an emergency case, they choose the patient's medical aid status:

| Value | Meaning |
|---|---|
| Active | Patient has active medical aid |
| Not active | Patient has no active medical aid |
| Unknown | Not recorded (default for older cases) |

The status appears in a **Medical aid** column in the case tables of the Hospital Admin, EMS Admin, EMS and Nurse workspaces.

The value is chosen by whoever creates the case. It is **not** verified against a medical aid scheme; real verification would need a scheme integration and a secure backend.

## Files

- `index.html` — the full Heimdall page (original design and code, plus the medical aid status on emergency cases)
- `README.md` — this file

## Change log

- Added a **Medical aid** (Active / Not active / Unknown) field to the emergency case form, and a **Medical aid** column in the case tables for all four roles
- Fixed the ID number field's validation pattern, which modern browsers reported as an invalid regular expression

## Important limitations

This is a static front-end demo. Sign-in uses public, fictional demo accounts and does not protect data. It does not show live ambulances, patients, hospital capacity, dispatch information or live routes. Cases are held in page memory and disappear on refresh. Contact form submissions are not sent or stored. Do not use for real emergency operations, and do not enter real patient or medical aid information.

## Publish to GitHub Pages

1. Upload `index.html` and `README.md` to your GitHub repository (replace the earlier files).
2. Commit the change to `main`.
3. Open Settings → Pages and confirm branch `main`, folder `/(root)`.
4. Wait for deployment; open the published URL.

The maps require an internet connection.
