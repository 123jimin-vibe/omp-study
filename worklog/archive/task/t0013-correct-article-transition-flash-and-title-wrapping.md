+++
id = "t0013"
title = "Correct article transition flash and title wrapping"
modifies = ["s0005"]
status = "done"
+++

# Correct article transition flash and title wrapping

## Scope

- Correct the cover site-title flash reported during contents-to-article transitions.
- Keep article headings on one line, fitted to their available width without clipping or horizontal overflow.
- Preserve native shared-title transitions in both directions, expanded groups, restored focus, browser history, and reading modes.

## Completion conditions

- Intermediate rendered transition frames do not show the offscreen cover title.
- Python/JavaScript and other long article titles fit on desktop and mobile; short titles retain their intended larger size.
- Verify forward/reverse transitions, resize and font loading, history, reduced motion, and the production build.

## Delivered and verified

- Removed the document-height main-content snapshot and applied the page fades to viewport-relative root snapshots. Shared article-title and site-header snapshots remain separate.
- Removed the article header width cap. Screen headings stay on one line and shrink only when their measured width exceeds the available header width. Fitting updates for resize, loaded fonts, and reading-mode changes, with lifecycle cleanup.
- Inspected five forward and four reverse rendered transition frames. An offscreen cover marker did not appear in any captured frame; the chapter title remained single-line through the desktop transition.
- All 47 article headings passed single-line and no-overflow checks at 1440px, 390px, and 320px viewport widths. Short headings retained their preferred size.
- Exercised a real font-loading event with a temporary local FontFace: the fitted heading adapted to the changed font metrics and returned correctly after restoration. Narrow-to-wide resize restored the preferred 84px title size.
- Direct article return, browser back/forward, interrupted navigation, and navigation during an opening disclosure retained native shared-title animations without page errors. Returning restored the matching row's focus and expanded group.
- Mobile presentation retained a fitted single-line title. PDF output contained the article heading; returning from print restored the screen fit without overflow.
- `npm run build` passed, including TypeScript. s0005 and n0001 record the corrected requirements and the insufficient earlier verification.
