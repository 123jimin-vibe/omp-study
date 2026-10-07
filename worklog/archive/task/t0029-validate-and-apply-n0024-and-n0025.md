+++
id = "t0029"
title = "Validate and apply n0024 and n0025"
modifies = ["s0001", "s0002", "s0003", "s0004", "s0005"]
status = "done"
+++

# Validate and apply n0024 and n0025

## Scope and authority

The user requested validation and application of n0024 and n0025, including the
catalogue changes they propose. Verify claims against the pinned OMP revision
`3f000c524cf82279f804ffd7526280cc9a5f25fe`. Reconcile s0005's old catalogue
counts/order with the accepted revision; retain s0001–s0004's existing contracts.

## Completion conditions

- Read and assess all chapter findings, recording rejected or qualified claims.
- Update n0022, the catalogue, affected prose, examples, citations and shared renderers.
- Cover turn recovery, advisor, cache layout and the other verified omissions.
- Check types/build, source paths, navigation and rendered desktop/mobile,
  light/dark, reduced-motion, presentation and print behavior.
- Keep human-review badges; this source/editorial pass is not human acceptance.

## Progress

- Initial inspection: clean worktree; local OMP reference is already at the
  newer revision cited by the notes. Several recommendations conflict (notably
  event fan-out ownership and whether process management should merge).
- Applying the catalogue synthesis in n0024 while preserving the distinct job
  manager and service broker mechanisms inside the combined chapter.

## Outcome and verification

- n0026 records the validity assessment, qualified/rejected proposals and complete
  old-to-new chapter map. n0022 now describes the 38-chapter catalogue.
- Rewrote all affected unreviewed content, pinned 135 distinct OMP source paths,
  added recovery/advisor coverage, merged duplicated subjects and retained ten
  legacy chapter routes. Reviewed 01/02 content is unchanged.
- Added semantic tables, optional sequence step controls, a branch/input tree and
  fixed-scale compaction view with static print representations.
- Passed npm run check/build, source-path/content/link invariants and git diff
  whitespace checks. Headless Edge passed 76 desktop/mobile route checks, ten
  aliases, control interactions, keyboard navigation/isolation and print visibility.
  Visually inspected mobile, dark and presentation captures.
- s0001: concrete harness examples, meaningful interaction and cache implications
  retained. s0002: static TypeScript/Vite architecture retained. s0003: public
  pinned citations and labeled illustrative examples. s0004: Korean/localizable
  data and shared rendering retained. s0005: reconciled count/order/coverage;
  navigation, reading modes and human-review badges retained.
- OMP behavior was checked against source, not exercised against live model
  providers or external services. No remaining requested implementation work.
