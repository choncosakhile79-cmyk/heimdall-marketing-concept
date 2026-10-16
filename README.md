# Heimdall marketing website concept

This is a standalone, responsive landing-page concept intended to sit beside the existing Heimdall demo. It does not replace or modify the demo application.

## Files
- `index.html` — the complete page, styles, and small demo contact-form interaction.
- `README.md` — setup, publishing, and Figma notes.

## Before presenting it
1. Verify the real product purpose, audience, benefits, and terminology with the existing demo or your assignment brief.
2. Replace the placeholder claims and explanatory copy with verified product information.
3. The dashboard-style hero visual is illustrative only. Do not present it as real product data.
4. Replace `replace-with-approved-email@example.com` in `index.html` with an organisation-approved contact email, or remove the contact form if you cannot use one.
5. Confirm with the project owner that you are allowed to publish a public-facing version. Do not include private data, credentials, or screenshots with sensitive information.

## Preview locally
1. Extract the ZIP.
2. Open `index.html` in Chrome or another browser.
3. Click the navigation links, demo buttons, and contact form to test the page.
4. Resize the browser to check mobile responsiveness.

## Publish with GitHub Pages
1. Sign in to GitHub and create a **new repository**. A name such as `heimdall-marketing-concept` is suitable. Choose **Public** only if your school/project rules allow public work.
2. Open the new repository and select **Add file → Upload files**.
3. Upload `index.html` and `README.md` (you can upload the files extracted from this ZIP).
4. Commit the files to the `main` branch.
5. Open **Settings → Pages**.
6. Under the build/deployment section, choose **Deploy from a branch**.
7. Choose branch `main` and folder `/ (root)`, then Save.
8. Wait for deployment and open the published URL shown in the Pages settings.
9. Test all links and the mobile layout.

GitHub Pages is suitable for a static marketing page. It does not provide a backend for storing contact submissions. This example prepares an email in the visitor's mail application instead.

## Figma workflow
Figma is used to design and document the intended visual experience; it does not automatically turn HTML into an editable Figma design.

1. Open Figma and create a **Design** file.
2. Create a desktop frame, e.g. 1440 × 1000 px, and a mobile frame, e.g. 390 × 844 px.
3. Use a 12-column layout grid for desktop and a 4-column grid for mobile. Keep side margins and spacing consistent.
4. Create reusable colour styles based on the CSS variables:
   - Navy `#101B2D`
   - Secondary navy `#172942`
   - Blue `#3478F6`
   - Cyan `#61D5D2`
   - Light background `#F5F8FC`
   - Body text `#152238`
   - Muted text `#607087`
5. Use a consistent type scale: hero heading around 64–72 px desktop / 42 px mobile; section headings 36–48 px desktop / 30–34 px mobile; body copy 16–18 px.
6. Design the page in sections: sticky header, hero, value/feature cards, About section, demo CTA, Contact section, footer.
7. Use Auto Layout for navigation, buttons, cards, and vertical section stacks. Components are useful for repeated buttons and cards.
8. Make a second frame for mobile and reflow columns into a single vertical stack. Check that nav links and buttons remain usable.
9. Create a prototype: connect Home/About/Overview/Contact nav items to their sections or corresponding frames; connect demo buttons to the demo URL if external-link prototyping is permitted.
10. Add a page called **Design rationale** and explain the marketing reasons for the redesign: stronger visual hierarchy, clearer value proposition, clearer calls to action, easier navigation, trust, and mobile usability.
11. For before-and-after evidence, capture screenshots of the existing demo only if permitted, and label the redesign as a proposal/concept.

## Academic note
Explain the decisions rather than only showing a prettier interface. Tie each improvement to audience needs and a measurable objective. For example, you could test whether visitors can identify the product's purpose and find the demo link more quickly. Do not claim conversion or engagement gains unless you actually measured them.
