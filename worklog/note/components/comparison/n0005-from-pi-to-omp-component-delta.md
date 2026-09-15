+++
id = "n0005"
title = "From Pi to OMP component delta"
parent = "n0002"
+++

# From Pi to OMP component delta

## Comparison boundary

OMP states that it is a fork of Mario Zechner's `pi-mono`, while the Pi snapshot in this study is `earendil-works/pi`. The table compares visible responsibilities at the two pinned snapshots; it is **not** a commit-by-commit fork diff ([OMP porting guide](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/porting-from-pi-mono.md), [Pi package map](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/README.md)).

## Preserved spine and expanded surface

| Concern | Pi | OMP delta |
| --- | --- | --- |
| Provider abstraction | `pi-ai` owns providers, auth, models, and normalized streaming | Keeps `pi-ai` but splits catalog values and model identity into `pi-catalog`; adds extensive provider/tool-call compatibility logic |
| Agent loop | `pi-agent-core` is the generic stateful tool loop | Keeps an agent-core package and adds more compaction/context machinery used by the product runtime |
| Coding product | `pi-coding-agent` composes CLI, tools, resources, sessions, and SDK | Makes the coding-agent a much larger integration hub for LSP, DAP, MCP, web, memory, subagents, approvals, and internal URLs |
| Terminal surface | `pi-tui` supplies differential rendering and extension components | Keeps a TUI package, adds richer runtime integration, tool renderers, agent observation, and live collaboration |
| Tool policy | Eight built-ins; workflow systems are intentionally extension territory | A broad built-in registry with code intelligence, debugging, web, memory, task, hub, checkpoints, and hidden control tools |
| System operations | Primarily TypeScript/Node execution and pluggable tool operations | Adds `@oh-my-pi/pi-natives` and Rust crates for shell, edit, search, AST, isolation, media, filesystem walking, and platform APIs |
| Long-term context | JSONL session tree plus text compaction/branch summaries | Adds several context-maintenance strategies, bitmap compaction, multiple memory backends, and memory tools |
| Coordination | Subagents/MCP/plan/to-do are not core requirements | Adds subagent recursion, mailboxes/jobs/process supervision, plan/goal/todo facilities, MCP, and browser collaboration |
| Operations | Chord and telemetry are adjacent general packages | Adds stats, benchmark manager/fixtures, browser relay, Python RPC client, and RoboOMP service |

Sources: Pi [design principles](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/usage.md#design-principles) and [package map](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/README.md); OMP [package map](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/README.md), [source layout](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/coding-agent/DEVELOPMENT.md), and [tool registry](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/coding-agent/src/tools/index.ts).

## Harness-engineering reading

Pi is useful for studying clean seams: provider normalization, the generic agent loop, session composition, and extension points are easy to isolate. OMP is useful for studying what happens when those seams support a full coding environment: capability discovery, durable context, process control, native acceleration, user approval, and multiple cooperating agents become explicit subsystems.

The central tradeoff is breadth versus inspectability. Pi delegates more workflow choice to the host or package author. OMP internalizes more of that choice so its components can coordinate tightly—for example, edits can feed LSP diagnostics, shell output can spill into artifacts, and session state can drive memory or subagent views. This paragraph is an architectural inference from the component maps.
