+++
id = "n0008"
title = "Pi coding session runtime"
parent = "n0003"
+++

# Pi coding session runtime

## Component

`@earendil-works/pi-coding-agent` is Pi's product composition layer. It assembles the generic agent, model runtime, discovered resources, built-in coding tools, durable session manager, and whichever user/programmatic surface is hosting the run ([SDK guide](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/sdk.md)).

## Main objects

- `createAgentSession()` constructs one `AgentSession`. A `ResourceLoader` supplies extensions, skills, prompt templates, themes, context files, and system-prompt customizations.
- `AgentSession` owns the active lifecycle: prompting, steering/follow-up, event subscription, model and thinking-level changes, message/history access, tree navigation, compaction, abort, and disposal.
- `SessionManager` supplies persistent or in-memory session storage.
- `AgentSessionRuntime` sits one level above a session when the host must replace it—for example new, resume, fork, or import—and rebuild working-directory-bound resources.

These responsibilities and API boundaries are defined in the [SDK core concepts](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/sdk.md#core-concepts).

## Composition flow

```text
cwd + settings + credentials + discovered resources
                         ↓
                  createAgentSession
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   Agent core       SessionManager    coding tools
        └────────────────┼────────────────┘
                         ↓
              typed AgentSession events
```

The system prompt is built from the active tools and loaded context rather than being a fixed string. Session replacement is deliberately separated from in-session tree navigation: the former may change persistence and cwd-scoped dependencies; the latter moves the leaf within one session file.

## Boundary

This layer decides product behavior but delegates model protocol handling to `pi-ai`, iteration to `pi-agent-core`, and terminal layout/input to `pi-tui`. It is the natural embedding layer because it exposes the complete coding session without requiring a caller to use Pi's terminal application.
