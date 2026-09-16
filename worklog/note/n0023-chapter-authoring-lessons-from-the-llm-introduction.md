+++
id = "n0023"
title = "Chapter authoring lessons from the LLM introduction"
+++

# Chapter authoring lessons from the LLM introduction

## Purpose and evidence

Guidance for agents writing later chapters, derived from the revision history of
chapter 01, **대규모 언어 모델**. This note is not a new product specification or
permission to publish additional chapters. Use current s0001, s0003, s0004, and
s0005 for behavior and publication requirements; use n0022 for catalogue scope.

The evidence is the user's corrections recorded in n0001 and the work records
t0014, t0015, t0016, t0017, t0018, and t0019. Archived tasks describe successive
versions, including designs later superseded. A task marked done or a successful
build does not establish editorial acceptance.

## Problems encountered

| Area | What went wrong in chapter 01 | Lesson for later authors | Evidence |
| --- | --- | --- | --- |
| Subtitle | The subtitle enumerated input, output, length limits, and verification as things to know before using a model. It read as a compressed contents list rather than an introduction to the subject. | State what the subject is or the chapter's substantive focus. Do not package the section list as a subtitle. | t0014; n0001 |
| Relevance and tautologies | Clarifications about generated versus retrieved sentences and changed inputs interrupted the explanation. Advice to choose names that fit their purpose and conventions added no useful criterion. | A technically true sentence can still be out of place. Keep an explanation only when it resolves a question raised by the current example or changes a concrete decision. | t0015 |
| Example presentation | Examples were titles followed by prose. Readers could not see sentence-to-token boundaries or how input, reasoning, and answers occupied a context window. | Expose the relationship being taught: segmentation, request/result, state transition, or resource occupancy. Calling a paragraph an example does not make the relationship observable. | t0015 |
| Captions | Labels such as “요약 요청과 가능한 답변 · 설명용 예시” restated the visible figure without adding information. | Retain provenance, units, and necessary assumptions; remove captions that merely announce an example or narrate its layout. | t0015 follow-up |
| Consequential differences | `readFile` versus `loadText` was a weak demonstration of response variability. It did not show why the difference mattered to a coding harness. | Choose alternatives with an observable consequence. The replacement average calculation exposed a zero-score error through actual input/result differences. | t0017 |
| Organization and harness relevance | Model mechanics/resource limits and response variability/reliability lacked distinct content-level organization. Prompt caching was omitted despite its effect on harness operation. | Group sections by the questions they answer. Component-oriented chapters still need relevant cross-cutting provider behavior and an explicit connection to harness decisions. | t0017; s0001 |
| Quantitative diagrams | The context diagram was static; output capacity changed scale between scenarios, and empty capacity was not adequately represented. | Keep comparison scales stable. Distinguish occupancy, unused space, and limits; verify the denominator and the resource being counted, not just whether percentages add up. | t0017 |
| Interaction complexity | The nine-second animation, progress slider, and separate output-budget diagram made a small concept unnecessarily slow and elaborate. | Add a control only if it helps answer a learning question. Prefer one coherent representation to multiple panels explaining overlapping constraints. | t0018 |
| Initial state | Input tokens were animated before reasoning and answers, even after the diagram was simplified. The user wanted an already populated context. | Separate what is given from what changes. Establish the starting state before playback; animate the transition under discussion. | t0019 |
| Precision of prose | Code length was introduced as an irrelevant behavior criterion. The text incorrectly dismissed matching a correct answer, and added the awkward “도구를 썼다는 사실만으로…” qualification. | Do not invent weak comparison criteria or undermine a valid expected-result check. Name the actual inputs, requirements, and observed results. Remove rejected reasoning rather than paraphrasing it elsewhere. | t0018 |
| Technical typography | API paths and expressions appeared as ordinary prose. | Render identifiers, field paths, and code expressions as semantic inline code, including in example prompts and explanations. | t0018 |
| Chapter integration | Category and chapter numbers initially looked alike, and previous/next chapter links needed separate work. | Treat numbering, catalogue position, chapter navigation, and section navigation as separate concerns. Reuse the shared chapter shell rather than rebuilding navigation inside article content. | t0014; t0016 |

## Analysis of the recurring pattern

**[INFERENCE] The recurring gap was instructional judgment, not merely missing
facts or components.** Early versions contained relevant terminology and passed
engineering checks, but some sentences answered questions the reader had not
asked, examples showed differences without consequences, and controls added work
without improving the explanation.

The revision sequence also shows why “make it interactive” is not a complete
design brief. Adding playback and controls addressed one request, but the
representation still needed simplification and a clear starting state. Decide
what the reader should observe before choosing the UI.

Keep two review tracks separate:

- **Technical validity:** Are the claims, calculations, boundaries, transitions,
  and source attributions correct?
- **Instructional value:** Does each sentence, example, label, and interaction
  help explain this chapter's subject and its harness implications?

Passing the first does not answer the second. Review both before handing off a
chapter; do not rely on the user to perform the first relevance pass.

## Guidance for the next chapter author

### Establish scope and the harness connection

- Read the requested catalogue entry and governing specs before drafting. A
  request to write one chapter is not permission to populate neighboring ones.
- Identify the reader's prerequisites, the mechanism being explained, and what a
  harness must do differently because of it. Keep the title direct and the
  subtitle substantive.
- Separate mechanism, resource/cost behavior, and reliability/evaluation when
  they answer different questions. These are content groupings, not necessarily
  new catalogue categories.
- Check for model/provider behavior that materially affects the mechanism even
  without a matching OMP module. Chapter 01 needed caching because shared-prefix
  reuse affects request layout, cost, and latency; variability mattered because
  retries and evaluations can produce different outcomes.
- Do not append a generic “why this matters” paragraph. Name the design choice:
  stable message/tool-definition order, reserving generation space, recording
  actual cache usage, or evaluating repeated runs are chapter-01 examples.

### Make every sentence earn its place

- Check correctness, relevance, and added information separately. Removing a
  false statement and removing an irrelevant true statement are different edits.
- Watch for defensive constructions such as “not necessarily” or “X alone does
  not prove Y.” They are review prompts, not banned phrases: identify the concrete
  condition and consequence they explain. If none is needed here, delete them.
- Avoid advice that only restates the goal, such as choosing a name that describes
  its purpose. Supply a usable criterion or an example that discriminates between
  outcomes.
- Expected-result matching is a valid check for the specified case. If coverage
  is the issue, name the additional case: `[80, 100]` returns `90` in both
  implementations, while `[0, 100]` requires `50` and exposes A's result of `100`.
  Do not turn that coverage distinction into a claim that matching the correct
  answer is insufficient to make the checked answer correct.
- When feedback rejects a passage, remove or correct the underlying thought.
  Moving it to a note box or rewriting the same qualification is not a fix.

### Design the example before elaborating the explanation

For each example, identify **given state → action or variation → observable
result → harness consequence**. If a step is missing, repair the example rather
than adding a caption that claims it is useful.

- Use one clear task and meaningful comparison cases. Show a normal case and the
  boundary that reveals the distinction, rather than many cosmetic alternatives.
- Express relationships visually where that helps: token pieces belonging to a
  sentence, a request producing a result, or occupied regions within a bounded
  resource. Do not substitute a titled paragraph for the requested visual.
- For quantities, state the unit, capacity, current usage, and limiting boundary.
  Keep the same quantity on the same scale across scenarios. Empty or unavailable
  space is information, not decoration to crop away.
- For animations, state which values are already established and which evolve.
  Define initial, running, paused, completed, replayed, and switched-scenario
  behavior before implementing controls.
- Use short, distinguishable transitions. A slider needs a reason beyond
  “interactive demos have sliders.” Reserve the geometry of changing labels and
  panels so interaction does not move the surrounding article.

### Ground claims without drowning the example in disclaimers

- OMP implementation claims need public source evidence under s0003. Use public
  URLs or repository-relative OMP paths, not machine-local checkout paths.
- Keep general LLM behavior, provider-specific accounting, and illustrative
  assumptions distinct. A rule documented for one provider is not automatically
  a universal property of every model or API.
- Verify exact data where the example depends on it. Chapter 01's token pieces
  came from a named tokenizer and reconstruct the original sentence including
  spaces; hand-drawn plausible token boundaries would not establish that claim.
- Execute authored code examples to check the displayed results. Do not present
  authored alternatives as collected model responses or a static table as a live
  model run.
- Preserve concise, useful provenance. Avoid both extremes: fabricated realism
  and a paragraph of disclaimers that overwhelms a simple example.

### Reuse the site structure and verify the actual surface

- Keep Korean prose, examples, and control labels in locale data. Reuse content
  contracts and renderers rather than embedding presentation logic in the prose.
  Useful entry points are `src/content.ts`, `src/locales/ko/topic.ts`, and
  `src/components/article.ts`.
- Use the existing inline-text renderer in `src/components/inline-text.ts` for
  backtick-delimited code spans. Preserve literal text safely; do not introduce
  HTML-bearing prose or break code-block copying to style identifiers.
- Preserve separate category/chapter numbering, catalogue order, shared
  previous/next links across categories, and section navigation. Do not duplicate
  these in a new chapter-specific component.
- Exercise the rendered example, not only its source or a successful build.
  Check initial state, intermediate states, pause/replay, scenario changes,
  keyboard operation, narrow widths, both themes, presentation, reduced motion,
  and print wherever the changed surface uses them.
- Inspect actual print output. Chapter-01 verification caught print palette and
  segment-boundary problems that screen rendering did not reveal. A paused demo
  should still print meaningful content and restore its screen state afterward.
- Keep editorial review explicit: read the prose in order and ask whether the
  example demonstrates the stated concept. Runtime checks cannot determine
  whether a subtitle, caveat, or example is worth including.
- Report only what was exercised. Fix broken existing tests when contracts
  change; keep new regression tests for plausible behavioral failures, not exact
  prose wording or evidence that a field was copied. Follow the governing
  verification instructions rather than adding tests to decorate a content edit.

## Chapter-01 decisions are not universal templates

As of t0019, chapter 01 uses one context window, no progress slider, input visible
before playback, and two generated phases lasting 1,100 ms each. Its 8,000-token
capacity and 3,000-token output limit are illustrative values, not model specs.
These details explain the current example; they are not mandatory timing,
capacity, control, or layout choices for every later demonstration.

Likewise, chapter 01's exclusion of architecture, training, and generation
mathematics is its scope, not a ban on appropriate depth in later chapters.
Caching belongs where it changes the design being taught, not as a compulsory
paragraph in every article.

Keep the durable lessons: establish initial state, show consequential behavior,
use honest comparisons and sources, minimize explanatory overhead, and verify
both correctness and usefulness. Consult current specs rather than restoring a
superseded design from an archived task.
