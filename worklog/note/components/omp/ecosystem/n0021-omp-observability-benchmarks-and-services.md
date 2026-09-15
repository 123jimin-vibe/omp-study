+++
id = "n0021"
title = "OMP observability benchmarks and services"
parent = "n0004"
+++

# OMP observability, benchmarks, and services

## Components outside the main interactive loop

| Component | Form | Responsibility |
| --- | --- | --- |
| `@oh-my-pi/omp-stats` | TypeScript package and `omp stats` command | Incrementally ingest session JSONL into SQLite; expose usage, cost-equivalent, latency, cache, error, model, project, and time-series views through console/JSON and a local dashboard |
| `@oh-my-pi/pi-metaharness` | TypeScript package, CLI, REST/SSE service, dashboard | Normalize experiments, runs, and traces across Harbor/Terminal-Bench, TypeScript edit, and SnapCompact benchmarks; retain benchmark-native artifacts while indexing results in SQLite |
| `@oh-my-pi/typescript-edit-benchmark` | Private fixture engine | Generate, load, format, and verify source-mutation fixtures used by the metaharness edit adapter |
| `@oh-my-pi/browser-relay` | Chrome extension plus CLI relay | Let Eval's browser API attach to existing logged-in Chrome tabs through `chrome.debugger` and a CDP-compatible multiplexing relay |
| `omp-rpc` | Python package | Typed process-backed client for `omp --mode rpc`, including events, startup options, host tools/URI schemes, and extension-UI requests |
| `robomp` | Python/FastAPI service plus dashboard | Receive allowlisted GitHub webhooks, queue issue/PR work, run persistent OMP RPC sessions in per-issue worktrees, and perform audited GitHub writes through a credential-holding sidecar |

Sources: [user-facing package index](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/user-facing-packages.md), [`omp-stats` README](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/stats/README.md), [metaharness README](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/metaharness/README.md), [browser relay README](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/browser-relay/README.md), [Python RPC README](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/python/omp-rpc/README.md), and [RoboOMP README](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/python/robomp/README.md).

## Context products also usable independently

Two runtime components double as public tools:

- `@oh-my-pi/pi-mnemopi` provides a standalone CLI and MCP server for local SQLite memory banks in addition to serving OMP's `mnemopi` backend ([Mnemopi README](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/mnemopi/README.md)).
- `@oh-my-pi/snapcompact` exposes deterministic conversation serialization and bitmap rendering independently of the coding agent; rasterization uses `pi-natives` ([SnapCompact README](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/snapcompact/README.md)).

`collab-web` is similarly deployable as a standalone static browser client but remains part of the collaboration capability described in n0019.

## Boundary and harness lesson

These components consume the harness through durable or protocol boundaries—session JSONL, RPC, benchmark artifacts, browser relay, collaboration wire—rather than importing the entire interactive UI. That makes the harness observable, testable, and automatable as a system. A mature coding agent needs these secondary surfaces because runtime quality cannot be inferred only from whether one interactive answer looked correct.
