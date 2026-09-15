+++
id = "n0007"
title = "Pi agent loop and state"
parent = "n0003"
+++

# Pi agent loop and state

## Component

`@earendil-works/pi-agent-core` turns a single normalized model API into an agent. Its public surface includes a stateful `Agent` and lower-level `agentLoop()` / `agentLoopContinue()` generators ([package README](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/agent/README.md)).

## Turn loop

```text
new user/steering message
        ↓
stream model response
        ↓
append assistant message
        ↓
tool calls? ── no ──> settle
    |
   yes
    ↓
validate and execute tools -> append tool results -> continue model
```

The layer owns:

- conversation messages and the active model/tool configuration;
- streaming lifecycle events for messages, reasoning, tool calls, results, and run completion;
- tool argument validation and execution, including a global sequential/parallel policy with per-tool overrides;
- pre- and post-tool-call interception;
- abort control plus steering and follow-up queues that alter or extend a running interaction;
- conversion from harness-specific messages to the normalized LLM message set.

The low-level generators expose ordered producer events. The higher-level `Agent` is the synchronization boundary when event handlers must finish before later phases such as tool preflight continue ([agent-core low-level API](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/agent/README.md#low-level-api)).

## Boundary

The agent core knows how to iterate, but not what a coding project is. It does not choose Pi's filesystem tools, discover `AGENTS.md`, persist a JSONL session tree, compact history, or render a terminal transcript. `pi-coding-agent` supplies those policies and adapters.

## Harness lesson

The loop is a state machine, not a `while` loop around a chat request. Tool concurrency, cancellation, queued human input, and lifecycle barriers all affect which state may advance. Keeping that machinery below the coding product makes the loop reusable while leaving repository policy in the higher layer.
