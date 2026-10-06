+++
id = "t0028"
title = "Review unreviewed chapters 03 through 46"
status = "done"
modifies = []
+++

# Review unreviewed chapters 03 through 46

## Scope

Editorial and structural review of every chapter marked `검토 전` (03–46) and
their interactive blocks. Findings only; no content edits in this task.

Review axes requested by the user:

- Natural Korean paraphrase rather than literal translation.
- Concision; no filler or bluffing.
- Organization of concepts within each chapter.
- Ordering that introduces concepts naturally.
- omp components or concepts missing from the catalogue, including features
  added after the `3b3a6dc9` snapshot the chapters cite.
- Topics that do not warrant an independent chapter.

## Completion conditions

- Per-chapter findings with locations and concrete rewrites.
- Catalogue-level findings: missing components, merge/split candidates, order.
- Findings delivered to the user.

## Unresolved questions

None.

## Delivered

- n0024: synthesized review covering catalogue structure (merges, missing
  components, upstream staleness, reading order, duplicated material),
  recurring prose and interactive patterns, and a suggested revision order.
- n0025: per-chapter line-level findings with Korean rewrites, generated from
  seven editorial reviewers and one rendered-surface reviewer.
- Fast-forwarded the local omp reference checkout to `3f000c52` for the
  upstream comparison. Locale content was not changed.

## Verification

- Spot-checked against the source: the `hub` removal, which files are
  snapshot-only or HEAD-only (turn recovery, advisor, dialects,
  append-only context, `ask`, speculative execution), and plan-mode guard
  coverage.
- Counted directly in the locale files: 49 sentences ending in “…해야 합니다”
  (6 in ch01–02), 26 harness→model `result` arrows in ch09–19 with no
  `request` arrows, and 109 interactive blocks.
- Not re-verified: the remaining reviewer-reported factual errors (listed as
  unverified in n0024). Print, dark theme and reduced motion were not
  rendered.
