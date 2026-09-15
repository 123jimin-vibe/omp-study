+++
id = "n0004"
title = "OMP component map"
parent = "n0002"
+++

# OMP component map

## Architectural spine

OMP retains Pi's provider → loop → coding-session → TUI layering, but surrounds it with a model catalog, native execution substrate, and many first-class coding subsystems:

```text
catalog + ai -> agent -> coding-agent -> TUI / print / RPC / ACP / SDK
                           |      |
                    tools/services +-- sessions, memory, agents, plugins
                           |
                  natives package -> Rust crates
```

The CLI boot path is `cli.ts` → command adapter → `main.ts` → `createAgentSession()` → interactive, print, or RPC mode ([developer map](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/coding-agent/DEVELOPMENT.md)). ACP and the SDK are additional hosts described by the [repository README](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/README.md).

## Component groups

| Group | Components | Responsibility |
| --- | --- | --- |
| Model access | `packages/ai`, `packages/catalog` | Provider streaming/auth plus a separately owned model catalog and identity layer |
| Agent runtime | `packages/agent` | Generic model/tool loop, message state, compaction primitives |
| Product runtime | `packages/coding-agent` | CLI/SDK, sessions, tools, configuration, discovery, orchestration, memory, web, and integrations |
| Presentation | `packages/tui`, `packages/collab-web` | Differential terminal UI and browser guest UI |
| Native substrate | `packages/natives`, `crates/pi-*`, `crates/vendor/brush-core` | N-API bindings and in-process implementations for shell, search, AST, edit, isolation, media, and system operations |
| Shared contracts | `packages/utils`, `packages/wire`, `packages/omptype` | Cross-package utilities, collaboration protocol types, and schema validation |
| Durable context | `packages/mnemopi`, `packages/snapcompact` | Local structured memory and bitmap context compression |
| Operations/evaluation | `packages/stats`, `packages/metaharness`, `packages/typescript-edit-benchmark`, `packages/browser-relay` | Observability, benchmarks, and controlled browser attachment |
| External services | `python/omp-rpc`, `python/robomp` | Python RPC client and self-hosted GitHub issue/PR automation service |

The package and crate grouping is synthesized from the [monorepo inventory](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/README.md) and the coding-agent [source layout](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/coding-agent/DEVELOPMENT.md). `packages/wire` is specifically the live-collaboration protocol; it is not the LLM provider transport layer.

## Harness interpretation

OMP's architectural center of gravity remains `packages/coding-agent`, but many operations that would normally spawn external programs or live in extensions have dedicated in-tree implementations. The TypeScript layer coordinates behavior and policy; Rust supplies performance-critical or platform-sensitive mechanisms; supporting packages turn session data and browser/collaboration protocols into separately usable products.

## Child notes

- n0013–n0015 — model, runtime, TUI/native foundations
- n0016–n0017 — code-intelligence and external-action capabilities
- n0018 — context, memory, and compaction
- n0019 — multi-agent and collaboration runtime
- n0020 — extensibility, configuration, and security controls
- n0021 — observability, evaluation, and services
