+++
id = "n0014"
title = "OMP agent and coding session runtime"
parent = "n0004"
+++

# OMP agent and coding session runtime

## Two runtime layers

`@oh-my-pi/pi-agent-core` owns the provider-neutral model/tool loop and state machinery. `@oh-my-pi/pi-coding-agent` turns that loop into the `omp` product: CLI and SDK composition, project-aware context, tool selection, persistent sessions, modes, integrations, and orchestration ([monorepo package map](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/README.md#monorepo-packages)).

## Boot and composition

```text
process argv
   ↓
cli.ts              worker dispatch + command selection
   ↓
commands / cli      subcommand adapters
   ↓
main.ts             settings, theme, registry, session options
   ↓
createAgentSession  constructs AgentSession and tool/runtime collaborators
   ↓
interactive | print | RPC     (ACP and SDK are additional hosts)
```

This flow is the package's documented boot path ([developer map](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/coding-agent/DEVELOPMENT.md#boot-flow)).

## Coding-session responsibilities

`AgentSession` coordinates the agent loop with the active model, system prompt, tools, session manager, compaction/maintenance, extension hooks, user-input queues, checkpoint state, background results, subagent state, and UI-neutral events. The `session/` subtree owns JSONL tree persistence, storage, history reconstruction, switching, resume/fork/export/share operations, and maintenance ([session architecture](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/session.md)).

The product runtime is also the dependency-injection center for tool sessions. Tool implementations receive cwd, settings, active model/tool state, internal URL registries, artifacts, job management, client bridges, LSP state, extension registries, and lifecycle callbacks through a shared session contract ([tool registry](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/coding-agent/src/tools/index.ts)).

## Boundary

The generic loop should remain ignorant of OMP's LSP, MCP, browser, memory, and collaboration products. The coding session owns their coordination because they depend on project identity, settings, persistence, UI availability, or session lifecycle—not merely on the next model response.

## Harness lesson

Once a harness gains many capabilities, the session becomes its composition root. A typed tool-session contract limits direct coupling: tools depend on declared capabilities, while `AgentSession` remains responsible for adopting or rebuilding collaborators when session identity or working directory changes.
