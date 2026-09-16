+++
id = "t0023"
title = "Add incomplete chapter badges"
modifies = ["s0005"]
status = "done"
+++

# Add incomplete chapter badges

## Scope

- Show a concise badge beside chapters that are unwritten or written but not
  reviewed.
- Treat chapters 01 and 02 as reviewed and omit an incomplete badge from them.
- Keep status text localized and preserve responsive, dark-mode, and print
  readability.

## Completion conditions

- The catalogue derives the correct visible state for reviewed, unreviewed, and
  unwritten chapters.
- A newly written chapter defaults to unreviewed until explicitly marked as
  reviewed.
- Type checking and the production build pass.

## Outcome

- Added localized `미작성` and `검토 전` badges to the catalogue. Empty chapter
  content resolves to `미작성`; non-empty content without `reviewed: true`
  resolves to `검토 전`.
- Marked chapters 01 and 02 reviewed, so neither displays an incomplete badge.
- Kept the badge compact beside the chapter title with responsive wrapping and
  theme-token colors.

## Verification

- `npm run build` passed, including `tsc --noEmit` and the Vite production build.
- `git diff --check` passed.
- Chromium inspection confirmed no badges on chapters 01–02 and `미작성` on
  empty chapters at the default desktop viewport and at 390×844.
- Chromium inspection confirmed readable badge contrast in light and dark modes.
