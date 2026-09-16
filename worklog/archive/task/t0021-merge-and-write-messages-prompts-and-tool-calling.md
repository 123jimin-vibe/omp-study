+++
id = "t0021"
title = "Merge and write messages prompts and tool calling"
modifies = ["s0005"]
status = "done"
+++

# Merge and write messages prompts and tool calling

## Request and authority

The user requested merging current chapters 02 and 03 and writing the combined
chapter. This approves that publication and the directly entailed catalogue,
numbering, and navigation changes in s0005. Existing s0001–s0004 remain unchanged.
Use n0023's authoring guidance and preserve chapter 01 and unrelated empty chapters.

## Scope

- Combine messages/prompts and function calling as chapter 02, “메시지와 도구 호출”.
- Retain the existing `messages-and-prompts` route; remove the separate
  `function-calling` entry. Renumber later chapters continuously, producing 46.
- Teach roles, multipart text/image content, chat formatting, request history,
  tool definitions and parameter schemas, generated arguments, application-side
  execution, and correlated result return through one file-reading example.
- Distinguish provider formats and explain the concrete harness implications.
- Provide a local, explicitly authored interactive trace; do not claim a live
  model call or access to the reader's filesystem.

## Completion conditions

- Reconcile n0022 and s0005 with the merged catalogue and requested publication.
- Publish concise Korean, source-grounded content using shared article rendering.
- Demonstrate request → generated call → execution → result → next response.
- Verify the browser surface, keyboard use, stable interactions, mobile, themes,
  reduced motion, presentation, print, and neighboring chapter links.
- Run the production build after integration; record evidence and limits.

## Unresolved questions

None. Provider examples are explicitly scoped; deeper OMP runtime implementation
remains in later chapters.

## Delivered

- Published `src/locales/ko/messages-and-tools.ts`: seven Korean sections covering
  the combined scope, with section-level primary-source links and an authored
  five-stage file-reading trace. Explicitly distinguishes OpenAI Responses and
  Anthropic Messages formats.
- Added the locale-driven `MessageTraceBlock` contract, reusable trace renderer,
  keyboard step selection, stable panels, and complete print representation.
- Integrated the merged entry into the existing chapter shell; all 46 chapters
  retain continuous numbering across nine categories. Chapter 01 content and
  unrelated empty chapter bodies are unchanged.
- Added JSON syntax registration and extended the existing inline-code renderer
  to code captions and exchange examples. Browser inspection caught literal
  backticks in these two previously plain-text surfaces; the final build renders
  their API identifiers and chat delimiters as semantic code.
- Reconciled n0022 and s0005 with the user-requested merger and publication.
  s0001–s0004 required no changes. No additional approval is pending.

## Verification

- `npm run build` passed after final integration: TypeScript checking and Vite
  production output, 49 modules transformed.
- Exercised all five stages with native browser pointer input, previous/next
  controls, and Home/End/Right Arrow keyboard selection. Initial request content
  was populated; inactive panels were inert and hidden from accessibility.
- At 1440×1000, every selected stage retained the same 779.8125 px figure height.
  At 390×844 with reduced motion, every stage retained 1280.6875 px; document width
  remained 390 px without horizontal overflow.
- Parsed the displayed JSON. Generated arguments select `package.json`; the
  returned file has `scripts.test` equal to `vitest run`; both provider examples
  correlate their call/result identifiers. These are authored wire excerpts,
  not live model responses. No API request or test-command execution was needed.
- Followed chapter 02 → 03 → 02 → 01 → 02 and returned through the contents.
  Confirmed 46 consecutively numbered links, nine categories, no separate
  `function-calling` entry, and an empty renumbered chapter 03.
- Visually inspected dark desktop, light mobile, and 1920×1200 presentation
  layouts. Presentation hid the site header and Escape restored browsing.
  Native browser fullscreen was unavailable in the headless environment; this
  verifies the site's presentation fallback, not actual OS fullscreen.
- Generated `local/messages-and-tools.pdf`: seven A4 pages, every trace stage in
  order, no chapter/step controls, and no text spans outside page bounds.
  Visually inspected trace pages 3–5. Printing from stage 3 restored that same
  selected stage and inactive-panel accessibility afterward.

## Cleanup

No temporary scripts or permanent tests were added. Verification used in-memory
browser checks; the browser tab was released. PDF/raster evidence remains only
under ignored `local/`. Existing development services were left running.
This task records implementation and verification, not separate human editorial
acceptance of the newly written article.
