+++
id = "t0027"
title = "Fix chapter diagram layout and add keyboard navigation"
modifies = ["s0002", "s0004", "s0005"]
status = "done"
+++

# Fix chapter diagram layout and add keyboard navigation

## Scope

Correct the responsive layout defect in chapter 15's “구조 변환의 제안과 적용을
연결하기” sequence, especially the eighth step, through the reusable visual
component rather than a chapter-specific override. Audit other dense instances
of the same component for the same failure mode.

Add topic-page keyboard navigation. Left and right arrow keys move to the
previous and next chapter, while up and down arrow keys move to the previous and
next top-level section within the current chapter. Reuse the existing routing,
section scrolling, and active-section behavior; do not wrap at either boundary.
Do not intercept modified shortcuts or keystrokes originating in editable or
interactive controls. Keep labels and shortcut affordances localizable.

## Completion conditions

- Chapter 15's affected sequence gives every step a readable width at desktop,
  presentation, and narrow browsing sizes without horizontal page overflow.
- Other dense sequence examples do not exhibit the same collapsed-card defect.
- Arrow-left/right navigation reaches the adjacent chapter and stops at chapters
  01 and 46; arrow-up/down navigation reaches adjacent top-level sections and
  stops at the first and last section.
- Keyboard navigation does not hijack modified keys, text entry, or focused
  interactive controls, and exposes appropriate accessibility metadata.
- Type checking and the production build pass; the corrected sequence and all
  four shortcuts are verified in a browser at desktop and narrow widths.

## Unresolved questions

None. “Part within page” is interpreted as a top-level article section, matching
the existing section navigator.

## Delivered

- Reworked the shared tool-sequence renderer so events that begin and end at the
  same actor receive a bounded 40% message card and a self-loop marker instead of
  the previous zero-width card. The fix applies to all three supported actor
  lanes and all 21 self-events across 15 chapter figures.
- Added topic-page keyboard navigation: Left/Right activate the existing
  previous/next chapter routes, and Up/Down activate the existing top-level
  section routes. Navigation stops at all chapter and section boundaries.
- Kept modified keystrokes, IME composition, editable fields, links, buttons,
  code scrollers, media controls, and interactive widgets out of the global
  handler. Existing tab-style examples therefore retain their own arrow-key
  behavior.
- Exposed chapter shortcuts on chapter links and dynamically exposed section
  shortcuts on the visible previous/next section-index links as well as the
  presentation navigator. Rapid repeated section keys temporarily retain the
  requested section so smooth scrolling cannot repeat the same destination;
  pointer, wheel, and touch input return the base to the visible section.

## Verification

- `npm run check`, `npm run build`, and `git diff --check` pass.
- In a desktop browser, chapter 15 step 8 measures 263px in a 658px event row;
  all nine steps have equal readable card widths and the page has zero
  horizontal overflow.
- At a 390×844 viewport, the same step measures 261px inside a 327px figure,
  with no text or page overflow. In presentation mode it measures 396px inside
  a 1040px figure, with the self-loop and fixed section navigator unobstructed.
- Audited representative self-events at the left, center, and right actor lanes
  and the densest 24-event sequence. The shared fix covers chapters 10, 11, 12,
  15, 16, 22, 26, 28, 30, 31, 32, 42, 43, 44, and 46.
- Browser-tested 14↔15↔16 chapter movement, the 19→20 part boundary, rapid
  first→third and third→first section movement, chapter 01/46 and first/last
  section boundaries, presentation mode, modifier chords, and an execution-path
  tab's component-specific arrow keys. Browser warning/error logs were empty.

## Specification reconciliation

- `s0005` now records readable self-event sequence cards and the keyboard
  navigation, boundary, interaction, mode, and accessibility requirements.
- `s0002` requires no text change: the implementation reuses the existing hash
  router and keeps behavior in the topic and section-navigation modules.
- `s0004` requires no text change: no user-facing copy was added, existing labels
  remain localized, and `aria-keyshortcuts` uses locale-neutral key tokens.
