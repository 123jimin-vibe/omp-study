+++
id = "t0009"
title = "Research Pi and OMP component maps"
status = "done"
modifies = []
+++

# Research Pi and OMP component maps

## Scope

- Identify the major repository and runtime components in Pi and OMP.
- Explain each component's responsibility, important boundaries, and place in the harness.
- Separate direct source findings from comparative interpretation.
- Store the result as concise notes in a physical folder hierarchy, with Worklog parent links and reproducible public citations.

## Completion conditions

- Pi and OMP each have an overview plus topic notes covering their principal layers.
- A comparison note explains what OMP preserves, splits, replaces, and adds relative to Pi.
- Every implementation claim is cited to a public source path or commit-pinned URL; no local checkout paths appear in note content.
- Worklog validation and a link/citation hygiene check pass for all new notes.

## Implementation and evidence

- Added n0002–n0021 as 20 research notes under `worklog/note/components/`.
- Organized the physical tree into Pi and OMP overviews, `foundations/`, `capabilities/`, OMP `ecosystem/`, and cross-project `comparison/` folders. Worklog `parent` relations mirror the root → project overview → topic hierarchy.
- Grounded Pi findings in repository/docs commit `d12cd92e45e308d4af000554292165ef1984253b` and OMP findings in commit `3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec`; checked the public repository pages for topology drift on 2026-09-15.
- Distinguished the architectural comparison from a literal fork diff because OMP names `pi-mono` as its ancestor while this study uses the current `earendil-works/pi` repository.
- Targeted `worklog status` resolved all 20 notes, their parents/children, and active task t0009 without entity diagnostics.
- A read-only content audit passed for all 20 notes: IDs and filenames, TOML fences, one H1 per note, public citations, balanced code fences, trailing whitespace, machine-local path exclusion, and every commit-pinned GitHub file/directory target.
- No product specification changed; this task adds reusable research findings only.
