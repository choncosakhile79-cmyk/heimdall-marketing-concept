# Heimdall EMS Portal — Enhanced Concept

A responsive front-end redesign concept based on the screenshots supplied for the school marketing project.

## Included
- Login-style screen and show/hide password control
- EMS dashboard with case status, severity and ETA
- Illustrative map panel and Google Maps shortcut
- Create Case, Team, Reports/Records navigation
- About and Contact sections
- Responsive desktop/mobile layouts

## Safety and functionality
This is a visual front-end prototype, not the real Heimdall system. The demo login accepts form submission but does not validate a password. Do not put real credentials in HTML, JavaScript or a public GitHub repository. Case data is illustrative; map art is not live tracking. Case creation and Mark Arrived/Mark Failed do not update any real system. Do not use this prototype for real emergency operations.

## Publish with GitHub Pages
1. Unzip the download.
2. In your existing GitHub repository, choose Add file → Upload files.
3. Upload `index.html` and `README.md`, replacing the earlier concept if prompted.
4. Commit the changes to `main`.
5. Go to Settings → Pages. Select Deploy from a branch, branch `main`, folder `/(root)`, then Save.
6. Wait for deployment; GitHub Pages shows the published URL under Settings → Pages.

## Figma guide
Use a 1440×1000 desktop frame and 390×844 mobile frame. Palette: navy `#10264B`, deep navy `#09182E`, panel `#132B4B`, cyan `#39BDF3`, red `#F20D23`, green `#08B889`, text `#F4F8FF`. Make reusable components for navigation, statistic cards, case panel, severity/ETA badges, map panel and actions. Use Auto Layout and stack the dashboard panels on mobile. Add a Design Rationale page explaining hierarchy, contrast, spacing and responsiveness.
