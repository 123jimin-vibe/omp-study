+++
id = "n0003"
title = "Pi component map"
parent = "n0002"
+++

# Pi component map

## Architectural spine

Pi's main path is deliberately short:

```text
@earendil-works/pi-ai
        ↓ normalized model stream
@earendil-works/pi-agent-core
        ↓ agent events and tool results
@earendil-works/pi-coding-agent
        ↓ session state and presentation events
@earendil-works/pi-tui / print / JSON / RPC / SDK hosts
```

The repository itself names `pi-ai`, `pi-agent-core`, `pi-coding-agent`, and `pi-tui` as the core project structure ([development guide](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/development.md)).

## Package components

| Component | Owns | Does not own |
| --- | --- | --- |
| `packages/ai` | Provider/model registry, authentication, normalized streaming, usage and cost records, tool schemas, media and reasoning blocks | Executing tools or deciding when another model turn is required |
| `packages/agent` | The iterative agent loop, conversation state, tool scheduling, steering/follow-up queues, lifecycle events | Project discovery, durable coding sessions, or a terminal UI |
| `packages/coding-agent` | CLI and SDK composition, project/context resources, built-in coding tools, session persistence/tree operations, compaction, model selection | Low-level terminal rendering or provider-specific transport details |
| `packages/tui` | Differential terminal rendering, components, focus/input, overlays, ANSI-aware layout, images | Coding-agent policy and model orchestration |
| `packages/chord` | A general application-composition runtime for services, replicated state, RPC, and plugins | The coding-agent's core tool loop |
| `packages/telemetry` | Vendor-neutral telemetry contracts, schemas, reference adapter, and conformance tests | Product-specific session orchestration |

The package roles above come from the [root package inventory](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/README.md); the ownership boundaries are a synthesis of that inventory and the package documentation.

## Harness interpretation

The most reusable seam is between `pi-ai` and `pi-agent-core`: the former converts many provider protocols into a common stream; the latter consumes that stream and implements the model/tool feedback loop. `pi-coding-agent` then specializes the generic loop into a repository-aware product. This separation lets an application use the provider layer without an agent, the agent loop without Pi's CLI, or the complete session through the SDK.

Pi keeps workflow-specific facilities outside its required core. Its usage guide explicitly says MCP, subagents, permission popups, plan mode, to-dos, and background bash are not built in and can instead be supplied through extensions or external tools ([design principles](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/usage.md#design-principles)).

## Child notes

- n0006 — model/provider boundary
- n0007 — agent loop and state
- n0008 — coding-session composition
- n0009 — TUI and external interfaces
- n0010 — built-in tool surface
- n0011 — session, context, and compaction
- n0012 — extensions, skills, and packages
