+++
id = "t0001"
title = "Title page and placeholder body page"
status = "done"
modifies = ["s0002", "s0004"]
+++

# Title page and placeholder body page

## Requested scope

The user requested implementation of s0002 while accounting for s0004:

- Create a clean, highly legible, technically impressive title page with a browsable, clearly-placeholder contents list; avoid expensive or distracting presentation and verbose site explanations.
- Create exactly one separate Korean dummy-topic body page, without selecting the guide's eventual curriculum.
- Make content easily editable and auditable, demonstrations modular, and common components reusable.
- Keep design and page transitions modular and replaceable for subsequent feedback and revisions.
- Provide working navigation between the title and body pages.

## Completion conditions

- The requested title and single placeholder body page work as a static, build-free HTML/CSS/native-JavaScript site under s0002.
- JavaScript uses JSDoc and passes `tsc --noEmit` with `checkJs` enabled.
- Korean is the current delivery language; localized text and content can change without duplicating document structure or interaction logic, as required by s0004.
- Browser verification exercises navigation, the placeholder demonstration, keyboard access, reduced motion, and responsive readability.
- Implementation-state write-back and verification evidence are recorded before closure.

## Verification

- `npm run check` passed (`tsc --noEmit`, with `checkJs` and strict checking enabled).
- Chromium rendered the actual static site under a project-subdirectory URL, including direct article and section links. All runtime resource requests stayed on the same origin; browser-reported resource bodies totalled 52,467 bytes.
- Title and body layouts were checked at 320, 390, 760, 1024, and 1440 CSS pixels, without horizontal page overflow. Mobile section navigation precedes the article; demo controls remain at least 44 pixels high.
- Keyboard navigation focused the article heading, section headings, and contents heading. The skip link became visible on focus and moved focus to the main landmark.
- Primary, secondary, and accent text color pairs measured 14.2:1, 4.7:1, and 5.5:1 respectively.
- The single sample demo advanced, stopped at three steps, reset, and accepted keyboard activation. Section navigation preserved its state. Unmounting left its old controls inert and stopped its animation.
- The real Clipboard API accepted the displayed sample code and the UI reported success. When automatic copying was unavailable, the component selected the displayed code and provided localized manual-copy guidance.
- Browser back/forward navigation restored the observed article scroll position. Rapid article/return navigation was reproduced with a URL/view mismatch, fixed, and confirmed to keep both consistent.
- Native shared-title transition readiness and an intermediate rendered frame were verified. Normal demo motion lasted 180 milliseconds; changing reduced-motion preference cancelled it. Reduced motion and an explicitly disabled View Transitions API both preserved functional navigation and heading focus. No animations remained on the settled title page.
- Unknown-route recovery and Korean fallback for unregistered English/Japanese locales preserved working direct section links. Responsive and rapid-navigation smoke runs reported no page errors.

## Implementation map

- `index.html` and `.nojekyll`: directly served static entry point, with no generation or runtime dependency installation.
- `assets/js/app.js`: fragment routing, focus, scroll restoration, and progressive page transitions.
- `assets/js/content.js` and `assets/locales/`: JSDoc content contracts, Korean interface text, and a collection containing exactly one placeholder topic. Locale loading is separate from navigation and interaction logic.
- `assets/js/components/article.js`: reusable text, note, code-copy, and registered-demo rendering. Content is inserted as text rather than executable markup.
- `assets/js/demos/sample-flow.js`: the self-contained sample interaction and its disposal lifecycle.
- `assets/css/`, `assets/js/views/`, and `assets/js/components/blueprint.js`: replaceable presentation, page composition, and procedural SVG artwork, separate from content data.

## Specification coverage

- s0002 is delivered: raw HTML/CSS/native JavaScript, JSDoc types, no-emit development checking, relative assets and fragment routes, and `.nojekyll` for build-free GitHub Pages delivery. Its implementation marker was removed after verification; its behavioral requirements were not changed.
- s0004 is accounted for without changing the spec: Korean is the shipped locale; the locale boundary anticipates `ko`, `en`, and `ja`, with unregistered translations falling back to Korean. English and Japanese translations remain intentionally deferred.
- No actual curriculum was selected. The contents list and sole body page remain clearly marked placeholders, as requested.

## Verification limits

Verification used local static hosting and Chromium with emulated viewport sizes. No live GitHub Pages deployment, physical-device run, or Safari/Firefox run was performed.
