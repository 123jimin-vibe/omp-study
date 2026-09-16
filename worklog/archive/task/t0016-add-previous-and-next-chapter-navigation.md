+++
id = "t0016"
title = "Add previous and next chapter navigation"
modifies = ["s0005", "s0004"]
status = "done"
+++

# Add previous and next chapter navigation

## Scope and authority

The user requested links to previous and next chapters. The scoped requirement is recorded in s0005; s0004 continues to govern localized interface labels.

## Completion conditions

- Add ordinary previous/next links at the bottom of every chapter, including empty chapters.
- Derive neighbors from the full ordered catalogue, preserving cross-category progression and current hash routing.
- Display direction, chapter number, and title; omit nonexistent directions at the endpoints without wrapping.
- Preserve contents navigation and separate section navigation. Keep links keyboard-accessible, readable in mobile/light/dark/presentation, and absent from print.
- Verify first, middle, last, and category-boundary navigation in the built application.

## Delivered

- Every chapter now has a bottom navigation region with ordinary `rel="prev"` / `rel="next"` links, direction labels, destination numbers, and titles.
- Neighbor lookup uses the full locale catalogue supplied to the topic renderer. Empty chapters receive the same footer; section navigation is still omitted when there are no sections.
- First/last chapters omit the unavailable direction. Existing contents links remain. Responsive styles stack links on narrow screens, and the existing print footer exclusion hides them in print.
- Added localized chapter-navigation labels without changing s0004.

## Verification

- `npm run build` passed TypeScript checking and the production build after the final label adjustment.
- In Chromium on the production preview, followed next links through all 47 chapters and checked both neighbor URLs against the contents order on every page. This covered all category boundaries and both endpoints.
- Activated the last chapter's previous link with keyboard Enter; arrived at chapter 46 with focus on its heading.
- Visually inspected the first article's footer at 1440×1000 and empty-chapter navigation at 390×844 in light/dark. At 320×844 the long chapter-06 title wrapped without horizontal document overflow.
- Presentation at 1920×1200 retained chapter links with the site header hidden. Print mode hid the entire footer and both chapter links.

## Reconciliation and cleanup

- s0005 records the scoped navigation requirement; s0004 remains intentionally unchanged and its localization boundary is preserved.
- No dependencies, permanent tests, or temporary script files were added. Browser verification is the feature proof; no repository-wide test suite exists.
- No pending approval or implementation marker remains for this task.
