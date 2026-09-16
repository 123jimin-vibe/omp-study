+++
id = "t0024"
title = "Write core runtime chapters"
modifies = ["s0001", "s0002", "s0003", "s0004", "s0005"]
status = "done"
+++

# Write core runtime chapters

## Request and authority

The user requested all articles in part II, “핵심 런타임”: chapters 03–08
in n0022. This authorizes writing those articles, not later parts or marking
new articles editorially reviewed. s0001–s0004 already govern their learning,
architecture, attribution, and localization; s0005's requested-content boundary
will record this scope without changing unrelated behavior.

## Deliverables

- 03 코딩 에이전트와 OMP: a read–edit–run task and Pi/OMP package maps.
- 04 세션 런타임: construction, model/tools, prepared context, events, lifecycle.
- 05 프로젝트 지침과 프롬프트 구성: discovery, matching, instruction-to-request trace.
- 06 에이전트 루프: calls, validation, scheduling, results, continuation, cancellation, queued input.
- 07 도구 정의와 레지스트리: schemas, implementations, availability, session services.
- 08 도구 권한: policy matching and enforcement, a denied call, coverage and isolation boundaries.
- Concrete visual relationships and useful interactive comparisons, Korean locale
  data, pinned public source citations, shared article navigation, unreviewed badges.

## Verification

Read the actual OMP implementation at the n0022 revision. Review authored claims
against source and distinguish explanatory traces from recorded executions.
Build once after integration. Exercise all six routes and new interactions in
the browser, including narrow/light/dark, keyboard, reduced motion, presentation,
and printed output. Keep later article bodies empty.

## Ownership

Main owns shared types/renderers/styles, catalogue integration, s0005, and final
verification. Parallel authors own non-overlapping pairs of new locale files:
03–04, 05–06, and 07–08. Authors skip formatters, lint, builds, and tests.

## Delivered

- Six separate Korean locale modules now populate chapters 03–08. Shared catalogue
  registration preserves all 46 routes and previous/next order. Chapters 01–02
  remain reviewed; 03–08 show “검토 전”; 09 onward remain unwritten.
- Added the reusable `execution-path` content block for session cancellation,
  argument/execution errors, and approval decisions. Connected stages expose the
  skipped execution boundary and returned outcome. Tab controls support arrow
  keys, Home, and End. Overlaid panels preserve geometry without animations;
  print shows every alternative in ordinary document order.
- Reused exchange and three-actor sequence diagrams for package responsibilities,
  session events, instruction assembly, and registered tool dispatch. The full
  read–edit–run task belongs to 03; 06 isolates the repeated tool round-trip.
- OMP citations use the verified `3b3a6dc9` snapshot; the Pi comparison uses
  `d12cd92e`. Source tracing distinguishes advisory rulebook hints from runtime
  matching, active tool exposure from availability, shared/exclusive scheduling,
  approval precedence and trust boundaries from OS isolation.

## Verification results

- Final `npm run build` passed, including TypeScript checking.
- Executed the authored average function before/after the illustrated change:
  `[0, 100]` changed from `100` to `50`; `[80, 100]` remained `90`.
- Executed the actual OMP pure approval resolver without executing any tool:
  default yolo allowed exec; write/always-ask prompted for exec and allowed read;
  explicit deny/prompt survived yolo; tool allow preceded user prompt.
- All cited OMP file targets exist in the pinned checkout. Authors traced the
  cited implementations; integration spot-checked context deduplication,
  rule classification, scheduling, availability, approval precedence and disposal.
- Exercised all six production-built routes at 1440×1100 light and 390×844 dark,
  with reduced motion. No horizontal document overflow or browser page errors.
  All nine selectable cases produced one visible result panel. Scenario switching
  changed figure height by 0 px at both widths. Keyboard Home/End and arrow
  navigation exercised.
- Fullscreen presentation at 1920×1200: chapter 06's comparison worked; the site
  header was hidden, section navigator visible, and Escape exited fullscreen.
- Actual navigation passed 03→04 and 08→09; 09 still has no sections. Rendered
  catalogue badges matched the reviewed/unreviewed/unwritten boundaries above.
- Generated all six A4 PDFs (7/8/5/7/7/9 pages), inspected representative
  rasterized assembly/permission pages, and checked every page for text outside
  page bounds or empty pages: none. All permission alternatives appeared in print;
  interactive controls were omitted. Screenshots and PDFs remain ignored local
  verification artifacts, not published content.
- Corrected a small final connector gap during visual inspection. Narrow-title
  measurements were taken after the existing resize observer settled.
- SDK excerpts are source-backed examples requiring configured model/authentication;
  no live model request, package publication, or full OMP session was executed.

## Specification reconciliation and cleanup

s0005 now records the requested part-II content boundary and unreviewed status.
s0001's concrete harness learning requirements, s0002's static typed architecture,
s0003's public source attribution, and s0004's locale separation remain unchanged
and are covered by this delivery. No new behavior approval remains outstanding;
editorial review of the new articles is intentionally still pending.

No throwaway scripts or test scaffolds were added. Browser verification tabs
were released; existing project preview services were left unchanged.
