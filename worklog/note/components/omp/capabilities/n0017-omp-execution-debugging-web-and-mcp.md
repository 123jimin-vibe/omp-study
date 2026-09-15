+++
id = "n0017"
title = "OMP execution debugging web and MCP"
parent = "n0004"
+++

# OMP execution, debugging, web, and MCP

## Execution backends

- **Bash:** `BashTool` selects a non-interactive embedded shell, interactive PTY overlay, editor-client terminal, or managed background job. It adds cwd/timeout validation, approvals and interception, environment hardening, streaming, cancellation, output minimization, and artifact spill for truncated output ([bash runtime](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/bash-tool-runtime.md)).
- **Eval/notebook:** persistent Python and Bun/JavaScript kernels support iterative computation. A loopback bridge lets kernel code call selected agent tools, keeping data processing inside the persistent runtime while reusing the harness's read/search/task contracts ([Python REPL](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/python-repl.md), [eval tool](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/tools/eval.md)).
- **Debug:** the DAP subsystem owns adapter discovery, launch/attach, breakpoints, execution control, stack/scopes/variables, memory/disassembly, output, and termination. Adjacent debug UI also handles logs, raw provider streams, profiles, and diagnostic bundles ([debug tool](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/tools/debug.md)).

## External information and control

`web_search` selects search backends and applies site-aware extraction; `browser` automates a browser context; `computer` drives native screen/input primitives; and `github` wraps repository, issue, pull-request, search, and Actions workflows. These are separate tools because their auth, state, safety, and rendering contracts differ ([tool documentation index](https://github.com/can1357/oh-my-pi/tree/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/tools)).

## MCP bridge

The MCP manager discovers configuration, establishes stdio/HTTP/SSE transports, tracks server lifecycle, converts remote schemas to OMP tools, routes calls, handles reconnect/cleanup, and exposes server/tool authoring helpers ([MCP lifecycle](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/mcp-runtime-lifecycle.md), [transport reference](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/mcp-protocol-transports.md)).

## Shared output contract

Large tool outputs can be saved as addressable artifacts while the model receives a bounded preview and an `artifact://` reference. Internal URL handlers let ordinary `read`/`write` operations address artifacts and other virtual resources without multiplying top-level tool schemas ([artifact architecture](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/blob-artifact-architecture.md)).

## Harness lesson

Execution capability is an adapter matrix: local/remote, foreground/background, interactive/headless, small/large output, and approved/denied. OMP keeps one model-facing operation while selecting the concrete backend from session capabilities and settings.
