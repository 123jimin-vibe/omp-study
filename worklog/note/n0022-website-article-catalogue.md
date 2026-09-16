+++
id = "n0022"
title = "Website article catalogue"
+++

# Website article catalogue

## Purpose and scope

A component-based article catalogue for the website, based on t0009 and the independently reviewed revision in t0010.

- Begin with a short, skimmable introduction to LLMs, limited to concepts relevant to end-users.
- Use direct subject titles, substantive scopes, and explicit ties to components.
- Treat the sections as component groups, not a requirement to read every article in sequence.
- Component organization does not exclude cross-cutting model/provider behavior. Include caching, variability, and other constraints wherever they materially affect the harness design being taught, even without a dedicated OMP module.
- The titles below are English working titles; website publication remains Korean-first under s0004.
- For authoring guidance derived from chapter 01's revisions, see n0023.
- This is a planning note, not completed articles or a change to the website specifications.

At the user's request, this note combines the reviewed catalogue's former articles 1 and 2 into one introductory article. The remaining articles retain their scopes and are renumbered, producing 47 articles.

## LLM fundamentals

These articles introduce the model and its interface before discussing OMP. They require background sources beyond t0009.

| # | Article | Scope |
| --- | --- | --- |
| 1 | **Large language models** | A brief introduction: input and generated output; tokenization; context, reasoning, and output budgets; prompt/token caching and its effect on request layout, cost, and latency. Organize response variability and factual reliability separately from these mechanics, and connect them to harness validation and evaluation using meaningful examples. Keep it skimmable. Omit model architecture, training procedures, and generation mathematics. |
| 2 | **Messages and prompts** | Conversation roles, text and image content, chat formatting, and the messages included in a request. Identify provider-specific formats rather than treating them as universal. |
| 3 | **Function calling** | Function definitions, parameter schemas, generated arguments, application-side execution, and returning results. Follow a file-reading function through a complete call. Introduce “tool calling” as the corresponding API terminology. |

Background sources include Hugging Face's [text generation](https://huggingface.co/docs/transformers/llm_tutorial), [tokenization](https://huggingface.co/learn/llm-course/en/chapter2/4), and [chat formatting](https://huggingface.co/docs/transformers/chat_templating) documentation, and OpenAI's [function-calling guide](https://developers.openai.com/api/docs/guides/function-calling). These are source material to select from, not a requirement to teach their full technical depth.

## Core runtime

Introduce the overall application, then the components responsible for running it.

| # | Article | Component | Scope |
| --- | --- | --- | --- |
| 4 | **Coding agents and OMP** | Overall architecture | Follow a read–edit–run task through the model, loop, tools, session, and UI. Introduce the Pi and OMP package maps. |
| 5 | **Session runtime** | `AgentSession`, `createAgentSession` | Component construction, active model and tools, prompt/context preparation, event subscriptions, and session lifecycle. |
| 6 | **Project instructions and prompt assembly** | Context-file loader, rulebook, system-prompt assembly | Loading project instructions, matching rules, and constructing the system prompt. Trace one project instruction into an outgoing request. |
| 7 | **Agent loop** | `packages/agent` | Model calls, tool validation and execution, sequential/concurrent scheduling, result messages, continuation, termination, cancellation, and queued input. |
| 8 | **Tool definitions and registry** | Coding-agent tool registry and tool-session contract | Tool names, descriptions, schemas, registered implementations, availability, and access to working-directory and session services. |
| 9 | **Tool permissions** | Approval and interception policies | Allow/prompt/deny decisions, matching rules, enforcement locations, and coverage limits. Trace a denied invocation; explain separately what process isolation would require. |

**Research:** n0002–n0008, n0014, n0018, n0020.

## Tools and execution

The basic coding tools come first. More specialized execution and analysis components follow.

| # | Article | Component | Scope |
| --- | --- | --- | --- |
| 10 | **File reading and search** | `read`, `grep`, `glob` | File discovery, text search, scoped reads, ignore rules, and result formatting. Follow the lookup of a relevant source file. |
| 11 | **File editing** | `write`, `edit`, native edit/diff implementation | File creation, exact-text and anchored edits, validation, previews, application, and mutation tracking. |
| 12 | **Shell execution** | `bash`, shell and PTY backends | Working directory, environment, output capture, exit status, timeouts, cancellation, interactive terminals, and background-job integration. |
| 13 | **Background jobs** | Job manager | Submission of finite work, ownership, completion delivery, result retrieval, and cancellation. Follow a background command through to its result. |
| 14 | **Managed processes** | Process broker | Service startup, readiness, logs, input, restart, and shutdown. Use a development server as the running example. |
| 15 | **Python and JavaScript execution** | `eval` and notebook runtimes | Persistent kernels, retained variables, result capture, resets, and calling harness tools from executed code. |
| 16 | **AST search and editing** | `ast_grep`, `ast_edit`, `pi-ast` | Syntax trees, structural patterns, captures, and transformations. Cover the supported syntax and limits of structural matching. |
| 17 | **Language servers** | LSP integration | Server lifecycle, symbols, references, rename, code actions, diagnostics, and association of diagnostics with document versions. |
| 18 | **Debuggers** | DAP integration | Adapter setup, launch and attach, breakpoints, stepping, stack frames, and variable inspection. Follow a failing program into a debugger. |
| 19 | **Web search and document retrieval** | `web_search`, URL readers | Search requests and results, fetching pages, content extraction, and source references returned to the model. |
| 20 | **Browser automation** | Browser integration, `browser-relay` | Browser sessions, DOM inspection, screenshots, interactions, authenticated tabs, and attachment to an existing browser. |

**Research:** n0010, n0015–n0017, n0019, n0021.

## Model access

These articles examine the implementation behind the model interface introduced in the fundamentals.

| # | Article | Component | Scope |
| --- | --- | --- | --- |
| 21 | **Model providers** | `packages/ai` provider adapters and conversion utilities | Internal message representations, provider request/response conversion, schema and function-call compatibility, endpoints, and provider errors. |
| 22 | **Model catalog** | `packages/catalog`, model registry | Model identifiers, aliases, capabilities, context limits, metadata lookup, and model-role selection. |
| 23 | **Response streaming** | Provider streams and `EventStream` | Incremental text delivery, streaming transports, buffering, function-argument deltas, completion/error events, and delivery to the agent and session. |
| 24 | **Authentication and credentials** | Provider authentication and secrets subsystem | API keys, OAuth login and refresh, credential resolution and storage, and treatment of secrets in diagnostics and display. |

**Research:** n0006, n0013–n0014, n0020.

## Context and persistence

Give each stored or reconstructed form of information a separate home.

| # | Article | Component | Scope |
| --- | --- | --- | --- |
| 25 | **Session storage and resume** | `SessionManager`, session storage | JSONL entries, parent links, persisted messages, branch selection, resume, and fork. Compare the saved tree with reconstructed model input. |
| 26 | **Context compaction** | Agent/session compaction machinery | Context budgets, trigger conditions, selected history, retained messages, summaries, and recorded compaction results. |
| 27 | **Cross-session memory** | Memory subsystem and its backends | Retention, recall, backend selection, and inclusion of retrieved information in later requests. Use Mnemopi as one backend example. |
| 28 | **Artifacts and internal URLs** | Artifact storage and URL registries | Stored tool output, previews, references, URL handlers, and later retrieval. Show exactly which output is initially included in model context. |
| 29 | **Checkpoints and rewind** | `checkpoint`, `rewind` | Captured, restored, and excluded filesystem/session state. Compare the working tree and conversation before and after restoration. |

**Research:** n0011, n0014, n0016–n0018, n0021.

## Configuration and extensions

Cover how the runtime finds, configures, and loads additional capabilities.

| # | Article | Component | Scope |
| --- | --- | --- | --- |
| 30 | **Settings and resource discovery** | `config`, `discovery`, capability registries | Configuration sources, precedence, profiles, resource discovery, and capability activation. Trace the origin of an effective setting. |
| 31 | **Skills and prompt templates** | Skill and prompt-template loaders | Resource formats, discovery, loading, invocation, and use in constructing instructions. |
| 32 | **Extensions and plugins** | Extension runtime and plugin loader | Registering tools, commands, providers, and event hooks; loading extensions; packaging and installing resources. |
| 33 | **MCP integration** | MCP manager and tool bridge | Clients and servers, discovery, schema conversion, transports, invocation, reconnection, and shutdown. |

**Research:** n0012, n0017, n0020.

## Workflow and agent coordination

Single-agent workflow controls and multi-agent facilities are distinct subjects within this group.

| # | Article | Component | Scope |
| --- | --- | --- | --- |
| 34 | **Plan mode** | Plan-mode subsystem | Plan documents, mode-specific policy, and integration with the running session. |
| 35 | **Goals** | Goal subsystem and control tool | Goal representation, activation, progress checks, and interaction with session control. |
| 36 | **Task tracking** | `todo` and task-list storage | Task entries, status changes, blocking, and how the agent reads and updates its task list. |
| 37 | **Subagents** | `task` runtime and agent discovery | Agent definitions, model/tool selection, child sessions, supplied context, execution limits, results, and isolation options. |
| 38 | **Agent communication** | `hub` mailboxes and agent lifecycle services | Peer addressing, messages, steering, wakeups, and completion delivery. Use the Agent Hub interface to inspect these interactions. |

**Research:** n0019. Plan-mode and goal implementation details need further source tracing; t0009 primarily identifies these subsystems.

## Interfaces and supporting infrastructure

Separate the components that present or embed the agent from those that analyze its runs.

| # | Article | Component | Scope |
| --- | --- | --- | --- |
| 39 | **Terminal interface** | `packages/tui`, interactive mode | Transcript and editor components, input, focus, layout, differential rendering, and tool-result renderers. |
| 40 | **SDK, RPC and ACP interfaces** | SDK and host adapters, `omp-rpc` | In-process embedding, process-backed control, and editor integration: entry points, commands, events, and lifecycle. |
| 41 | **Usage statistics** | `packages/stats` | Session-log ingestion, usage and cost records, latency/error metrics, storage, and queries over completed runs. |
| 42 | **Benchmarks** | `packages/metaharness`, edit benchmark fixtures | Experiment configuration, fixtures, correctness checks, traces, and result storage. Inspect the artifacts of an individual benchmark case. |

**Research:** n0009, n0014–n0015, n0021.

## Specialized components

These can be separate advanced articles without becoming prerequisites for the introductory material.

| # | Article | Component | Scope |
| --- | --- | --- | --- |
| 43 | **Native modules** | `packages/natives`, `crates/pi-*` | TypeScript/Rust bindings, platform integration, and native shell, editing, search, AST, and VCS implementations. Trace one operation across the binding. |
| 44 | **Bitmap context compression** | `packages/snapcompact` | Conversation serialization, bitmap rendering, model requirements, and evaluation of the resulting representation. |
| 45 | **Live collaboration** | `collab-web`, `packages/wire` | Host/guest interfaces, shared events, control and interruption, and relay communication. |
| 46 | **Desktop automation** | `computer` and platform integration | Screenshots, pointer/keyboard actions, coordinates, and permissions for controlling a desktop. |
| 47 | **GitHub automation service** | `python/robomp` | Webhook intake, queued issue/PR tasks, workspaces, RPC sessions, and credentialed GitHub operations. |

**Research:** n0015, n0017–n0019, n0021.

## Introductory reading route

A reader should not need to finish the entire catalogue to understand a working coding agent:

**LLM fundamentals → Coding agents and OMP → Session runtime → Project instructions and prompt assembly → Agent loop → Tool definitions and registry → Tool permissions → File reading and search → File editing → Shell execution → Session storage and resume.**

Readers already familiar with LLMs may skim article 1. The specialized articles branch from this route. AST editing, LSP, subagents, and native modules are not presented as prerequisites for basic coding-agent operation.

## Research and review boundaries

- t0009 and n0002–n0021 provide the component research. The notes use the OMP snapshot at [`3b3a6dc9`](https://github.com/can1357/oh-my-pi/tree/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec) and the Pi snapshot at [`d12cd92e`](https://github.com/earendil-works/pi/tree/d12cd92e45e308d4af000554292165ef1984253b). Their comparison is architectural, not a literal fork diff.
- t0010 records the independent component audit, reader simulations, and model-tier reviews of the prior catalogue. The reader perspectives were simulations, not a user study. This note applies the subsequent user-requested merge and end-user focus to the introductory article.
- Detailed behavior, especially compaction, restoration, permission coverage, and configuration precedence, needs source-level verification when writing the articles. Proposed examples are not claims of demonstrations already implemented or tested.
- Published implementation claims need public source citations at the point of explanation under s0003. The research-note IDs above identify the starting evidence for drafting.
- This note does not alter s0001–s0005 or replace the site's current placeholder content.
