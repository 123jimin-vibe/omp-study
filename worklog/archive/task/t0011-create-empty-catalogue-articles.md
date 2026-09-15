+++
id = "t0011"
title = "Create empty catalogue articles"
modifies = ["s0005"]
status = "done"
+++

# Create empty catalogue articles

## Scope

- Replace the sample document with an independently addressable empty article for each of the 47 entries in n0022, in catalogue order.
- Use Korean subject titles, stable article IDs, and empty descriptions and section lists.
- Populate the existing cover contents list with these articles.
- Remove sample copy, code, and demonstration content; empty pages show their title and navigation without a section index or filler.
- Preserve the existing routing, reading modes, localization structure, and reusable article renderer.
- Update s0005's superseded single-dummy-page requirement to match the user's explicit request.
- Organize the contents into n0022's nine sections with animated, accessible expand/collapse navigation.
- Preserve group expansion and reveal the returning article so its title transition has a visible counterpart.
- Verify shared article-title transitions in both directions, including deep groups and browser history.

## Completion conditions

- The cover lists 47 distinct articles corresponding to n0022.
- Every article link and direct hash route opens the correct empty page.
- The sample document and its old route are no longer part of the catalogue.
- Empty articles contain no invented prose, sections, code, or demonstrations.
- Desktop and mobile browser checks cover the contents and empty article views, including reading modes.
- The production build passes and s0005 reflects the delivered content boundary.
- The contents have nine groups with restrained disclosure animations, keyboard operation, and reduced-motion support.
- Grouped contents remain complete in print, and expansion state is restored after printing.
- Title transitions have matching visible endpoints for contents-to-article and article-to-contents navigation, including direct article loads and back/forward.

## Delivered

- Replaced the sample document with all 47 empty articles from n0022 and removed its demonstration content and retired assets.
- Added nine collapsible contents groups, animated disclosure, preserved expansion, and a visible, focused return target.
- Matched native title-transition endpoints in both directions, including long mobile titles and entries in initially closed groups.
- Reconciled s0005's catalogue, empty-content, grouped-navigation, and title-transition requirements with the user's instructions.

## Verification

- `npm run build` passed, including the TypeScript check.
- Production Chromium checks opened all 47 catalogue links and returned to their matching rows. All 47 fresh direct article loads displayed only the back link, article number, and correct title, without section navigation or filler.
- Native title transitions resolved successfully with matching visible endpoints and a running title animation in both directions. Browser back/forward, direct article loads, navigation interrupted by history, and navigation during an active disclosure animation passed without page errors.
- Keyboard disclosure and preserved expansion passed. Reduced motion produced no disclosure or native title animations; navigation also worked with the native transition API unavailable.
- Desktop and 390×844 mobile views were visually checked, including dark mode and a multiline title. Mobile pages had no horizontal overflow. Presentation mode and Escape return were exercised.
- Printing from nine collapsed groups exposed all 47 articles across all nine groups and restored the exact collapsed state afterward. The generated PDF contained the full catalogue; the temporary PDF was removed.
