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

## Important limitations

This is a static front-end demo. Sign-in uses public, fictional demo accounts and does not protect data. It does not show live ambulances, patients, hospital capacity, dispatch information or live routes. Cases are held in page memory and disappear on refresh. Contact form submissions are not sent or stored. Do not use for real emergency operations, and do not enter real patient or medical aid information.

## Publish to GitHub Pages

1. Upload `index.html` and `README.md` to your GitHub repository (replace the earlier files).
2. Commit the change to `main`.
3. Open Settings → Pages and confirm branch `main`, folder `/(root)`.
4. Wait for deployment; open the published URL.

The maps require an internet connection.


## Exhibition presentation guide

### 90-second guided demonstration

1. **Start with the problem:** emergency coordination can involve several teams that need a shared, clear view of the incident.
2. **Show the experience:** open the role portal and use the fictional demo credentials displayed on the page. Demonstrate the EMS/Admin/Nurse/Hospital Admin views.
3. **Show the map:** explain that Johannesburg markers are illustrative and do not represent live ambulances or real incidents.
4. **Show the workflow:** open **Features**, update a dispatch stage, change fleet readiness, tick the hospital handover checklist, then run the five-step emergency walkthrough.
5. **Close with the value:** Heimdall's design proposition is a more consistent view across the response journey, with clear status information and a handover checklist.
6. **Be transparent:** explain what is interactive in the prototype and what would require a secure backend and validated integrations before real-world use.

### What the exhibition build demonstrates

- **Problem framing:** a clear emergency-response coordination challenge.
- **User experience:** role-aware screens, visual hierarchy, responsive layouts and clear action/status patterns.
- **Workflow thinking:** incident progression, fleet status, handover readiness and an illustrative audit trail.
- **Local context:** Johannesburg map presentation and a South African healthcare/medical-aid context.
- **Responsible design:** visible demo limitations and explicit separation between sample data and live operational systems.
- **Marketing and brand:** consistent blue/cyan identity, ECG-inspired visual language and a concise value proposition.

### Important distinction

This is an interactive front-end concept, not a production EMS system. Demo sign-in is not secure authentication; demo data is not persistent shared storage; map markers are illustrative; medical-aid status is not checked with an insurer; and the audit trail is not a secure compliance log. Do not enter real patient information or use the page during an actual emergency. A real pilot would require a secure backend, role-based access controls, encryption, audit logging, POPIA and healthcare privacy review, validated GPS and insurer/hospital integrations, accessibility testing, and clinical/operational approval.

### Before presenting

- Open the published site on the actual exhibition laptop and test the internet connection.
- Refresh the page and verify the map tiles load; external map tiles and the Leaflet library require internet access.
- Test each demo role and the guided workflow once before judges arrive.
- Keep the page zoom at 90–100% and use full-screen browser mode.
- Use only fictional demonstration data.
- If the hosted site is unavailable, keep the GitHub repository open as a backup reference.

