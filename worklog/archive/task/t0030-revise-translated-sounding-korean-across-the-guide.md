+++
id = "t0030"
title = "Revise translated-sounding Korean across the guide"
modifies = ["s0001", "s0003", "s0004", "s0005"]
status = "done"
+++

# Revise translated-sounding Korean across the guide

## Scope

The user found extensive translationese after t0029. Read the recently revised
Korean chapters in order and rewrite awkward prose, descriptions and diagram
labels around concrete actors and actions. Preserve technical meaning, examples,
citations, routes, catalogue order and human-review status. No spec changes needed.

## Completion conditions

- Record the user-reported mistake in n0001.
- Edit sentences in context, including noun-heavy summaries, literal calques,
  unnecessary English and explanations whose subjects are unclear.
- Re-read edited chapters; verify that structural data and code examples remain
  unchanged, and run the production build and targeted rendered checks.

## Outcome

Re-read chapters 03–38 and revised 179 paragraphs, 28 section headings, topic
summaries, table cells and diagram captions. Replaced literal English metaphors,
stacked abstract nouns and missing subjects with concrete Korean descriptions of
what the model, session and tool do. Examples include replacing “요청 머리” with
the beginning of the request, explaining log-file rotation, and describing
completed file changes instead of “실행한 부작용”. Updated n0022's section names.
Recorded the user-reported editorial mistake in n0001.

Checked wording against the pinned local OMP sources where needed, including LSP
format-on-write and advisor delivery timing. Code examples, reference URLs,
route/section IDs, diagram states and quantities, and human-review flags are
unchanged against the pre-edit content snapshot. Reviewed chapters 01–02 are
unchanged in full. Agent editing does not constitute human review.

## Verification and spec coverage

- `npm run build`: TypeScript check and production build passed.
- `git diff --check`: passed.
- Local content snapshot comparison: all structural fields, example code and
  links unchanged; 36 chapters revised.
- Edge/Playwright: 38 routes at both 1440px and 390px (76 checks), ten legacy
  aliases, existing diagram controls and print states passed without browser
  errors or horizontal overflow.
- Visually inspected the recovery chapter at 390px in light mode and the prompt
  chapter at 1440px in dark mode; text and inline identifiers remained readable.
- s0001: Korean editorial revision within the existing guide scope.
- s0003: pinned source citations and technical examples preserved.
- s0004: chapter order, groups, routes and review status preserved.
- s0005: text fits existing responsive renderers; no component behavior changed.

No authoritative specification changes or further approval are required for this
editorial correction. Automated checks establish structural and rendering
integrity, not a guarantee of natural Korean prose.
