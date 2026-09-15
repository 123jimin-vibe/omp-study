+++
id = "n0002"
title = "Pi and OMP component landscape"
+++

# Pi and OMP component landscape

## Research question

What are the major components of Pi and OMP, where do their responsibilities begin and end, and how does OMP extend the smaller Pi harness?

Here, **component** means a package, runtime subsystem, or separately operated service with a distinct responsibility. Tiny utilities and every individual command are indexed under their owning subsystem rather than treated as independent architectural components.

## Evidence base

- Pi: repository and documentation snapshot at commit [`d12cd92e`](https://github.com/earendil-works/pi/tree/d12cd92e45e308d4af000554292165ef1984253b), retrieved 2026-09-11. The repository describes the toolkit as a unified LLM API, agent loop, coding-agent CLI, and terminal UI, with Chord and telemetry beside that main path ([repository README](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/README.md)).
- OMP: repository and documentation snapshot at commit [`3b3a6dc9`](https://github.com/can1357/oh-my-pi/tree/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec), retrieved 2026-09-11. Its developer map identifies the coding-agent package as the primary application and enumerates the runtime subsystems beneath it ([developer map](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/coding-agent/DEVELOPMENT.md)).
- Public `main` pages were checked on 2026-09-15 for topology drift. Commit-pinned links remain the evidence in these notes so future readers see the same source that was analyzed.

OMP calls itself a fork of Mario Zechner's `pi-mono`; the Pi material studied here is the current `earendil-works/pi` repository. The comparison is therefore an architectural comparison of two living descendants, not a claim that one snapshot is a direct patch over the other ([OMP lineage statement](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/README.md)).

## Result at a glance

```text
Pi:   provider API -> agent loop -> coding session -> terminal/programmatic surfaces

OMP:  provider API + catalog -> agent loop -> coding session -> rich tool/orchestration surface
                                  |                |
                                  + native core   + memory, MCP, LSP, DAP, web, collaboration
```

Pi optimizes for a compact, composable core. OMP preserves that layered spine, then makes many workflow capabilities first-class and adds native and operational components around it. This is an interpretation of the source maps, not wording used by either project.

## Note hierarchy

- n0003 — Pi overview
  - n0006–n0009 — foundation and interface layers
  - n0010–n0012 — tools, session/context, and extensibility
- n0004 — OMP overview
  - n0013–n0015 — foundation layers
  - n0016–n0020 — coding, execution, context, coordination, and extension capabilities
  - n0021 — supporting products and services
- n0005 — cross-project component delta
