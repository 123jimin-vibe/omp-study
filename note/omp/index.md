# omp — Feature Overview

[omp](https://github.com/can1357/oh-my-pi) (oh-my-pi) is an open-source coding-agent
harness: the runtime that turns an LLM into a capable coding agent. Headline numbers
it advertises — ~32 built-in tools, 40+ model providers, 14 LSP ops, 28 DAP ops, and
a ~55k-line Rust core — all behind a single tool namespace.

This file indexes omp's components at a glance. Each entry below is a candidate for
its own `note/omp/<component>.md` and a page in the interactive guide. Groups are
ordered roughly **simple → complex**; this is a survey of what omp *has* and a
starting map for the site, **not** a fixed syllabus.

> Source surface: omp's `README.md`, the `docs/` tree, and `packages/coding-agent/`.
> Per-group `omp docs:` pointers below seed the future detailed notes.

## 1. The agent loop & tool-calling

The foundation: a model in a loop, calling tools, until it yields.

- **Agent loop / turn** — request → tool calls → tool results → repeat; the `yield` that ends a turn.
- **Tool namespace & schemas** — every tool shares one namespace; how schemas are surfaced to the model; pinning the active set (`--tools`) with the rest discoverable mid-session (`search_tool_bm25`).
- **Filesystem tools** — `read` (summarized snippets + line/range selectors), `write`, `search` (regex), `find` (glob).
- **Editing** — `edit` via *hashline* (anchor by content hash, not line retype), `ast_grep`/`ast_edit` (structural), and preview-then-`resolve` for staged changes.
- **Shell** — `bash` over an in-process shell whose sessions persist across calls.

> omp docs: `docs/tools/*.md`, `docs/bash-tool-runtime.md`, `docs/resolve-tool-runtime.md`

## 2. Talking to models: prompting & wire formats

How the harness composes what the model sees, and adapts to each model's format.

- **System prompt** — composition and customization.
- **Context files** — project/agent instructions, inherited from `.claude`, `.cursor`, `.codex`, `.github/copilot`, and others in their native shape.
- **Tool-call format conversion** — per-model wire formats: Anthropic, Gemini, Harmony, Qwen3, DeepSeek, GLM-4.5, Kimi-K2, Gemma, and omp's own `pi-native`.
- **Rulebook matching** — selecting which rules/context apply to the current turn.

> omp docs: `docs/system-prompt-customization.md`, `docs/context-files.md`, `docs/toolconv/*.md`, `docs/rulebook-matching-pipeline.md`

## 3. Providers, models & streaming

- **Providers & roles** — 40+ providers; roles route by intent (`default`, `smol`, `slow`, `plan`, `commit`).
- **Streaming internals** — parsing/handling token streams per provider.
- **Resilience** — fallback chains, retry/cooldown, endpoint constraints, auth brokering.
- **Schema normalization** — reconciling differing provider/tool schemas.

> omp docs: `docs/providers.md`, `docs/models.md`, `docs/provider-streaming-internals.md`, `docs/adding-a-provider.md`, `docs/ai-schema-normalize.md`

## 4. Code intelligence & execution  ("the IDE wired in")

- **LSP** — definitions, references, rename (via `workspace/willRenameFiles`), code actions.
- **Debugger (DAP)** — drive lldb / dlv / debugpy: breakpoints, stepping, frame inspection.
- **Code execution** — `eval`: persistent Python + Bun kernels that can call back into the agent's own tools over a loopback bridge; notebook runtime.
- **Web** — `web_search` (18 ranked backends) feeding `read`, with site-aware extraction to markdown.
- **Resources as files** — internal URI schemes (`pr://`, `issue://`, `agent://`, `skill://`, `conflict://`, …) resolve inside FS-shaped tools; GitHub and merge conflicts become paths.

> omp docs: `docs/tools/lsp.md`, `docs/tools/debug.md`, `docs/tools/eval.md`, `docs/python-repl.md`, `docs/tools/web_search.md`, `docs/tools/github.md`

## 5. Sessions & persistence

- **Sessions** — save, resume, fork, export, share; recent-session listing.
- **Session tree & plan mode** — branching session state; plan mode.
- **Rewind / checkpoint** — step the session back to an earlier state.

> omp docs: `docs/session.md`, `docs/session-operations-export-share-fork-resume.md`, `docs/session-tree-plan.md`, `docs/tools/rewind.md`

## 6. Context & memory management

- **Compaction** — keeping the conversation within the context window.
- **Memory** — `retain`/`recall`; "Hindsight" curates per-project facts and compresses a session into a mental model that loads on the next run's first turn.
- **Artifacts & caching** — blob/artifact storage for large tool output; filesystem scan cache.

> omp docs: `docs/compaction.md`, `docs/memory.md`, `docs/mnemosyne-memory-backend.md`, `docs/blob-artifact-architecture.md`, `docs/fs-scan-cache-architecture.md`

## 7. Multi-agent orchestration

- **Subagents** — `task` fans work into isolated workers; schema-validated `yield` returns typed results to the parent.
- **Agent discovery** — how agent definitions are found, merged, and resolved (precedence + frontmatter contract).
- **Advisor / watchdog** — a second model reviewing every turn and injecting inline notes.
- **Inter-agent messaging** — `irc` between live agents.
- **Time-traveling stream rules (TTSR)** — a regex match aborts a stream mid-token, injects a corrective system reminder, and retries from that point; survives compaction.
- **Collaboration** — `/collab` shares a live session over a relay (read-write or view-only).

> omp docs: `docs/task-agent-discovery.md`, `docs/handoff-generation-pipeline.md`, `docs/advisor-watchdog.md`, `docs/ttsr-injection-lifecycle.md`, `docs/collab.md`

## 8. Extensibility

- **Skills** — packaged, on-demand knowledge/instructions.
- **Slash commands** — workflow commands (`/review`, `/collab`, …).
- **Custom tools & extensions** — add tools, commands, and hotkeys as TypeScript modules; `/reload-plugins`.
- **Marketplace** — share and install extensions.
- **Hooks** — lifecycle hooks.
- **MCP** — Model Context Protocol: config, transports, runtime lifecycle, authoring servers.

> omp docs: `docs/skills.md`, `docs/slash-command-internals.md`, `docs/custom-tools.md`, `docs/extensions.md`, `docs/marketplace.md`, `docs/hooks.md`, `docs/mcp-*.md`

## 9. Surfaces & runtime

- **TUI** — tool-call cards, edit previews, the `ask` option-picker, differential rendering, themes, keybindings.
- **Entry points** — interactive TUI, one-shot (`-p`), RPC (`--mode rpc`), ACP (editor-drivable, e.g. Zed), and the Node SDK.
- **Safety** — approval mode for destructive tools; secrets handling.

> omp docs: `docs/tui.md`, `docs/theme.md`, `docs/rpc.md`, `docs/sdk.md`, `docs/approval-mode.md`, `docs/secrets.md`

## 10. The native core (Rust)

- **In-process natives** — ripgrep, glob, find, the `brush` bash shell + PTY, AST parsing, syntax highlighting, image decode, and BPE token counting linked into the process — no fork/exec on the hot path.
- **Cross-platform** — one binary on macOS, Linux, and Windows (no WSL bridge).

> omp docs: `docs/natives-architecture.md`, `docs/natives-*.md`

---

*Out of scope for the guide:* omp-internal dev-ops — build/release, code signing/notarization, install IDs, pi-mono porting, provider errata — are deliberately omitted; they're not harness-engineering techniques worth teaching.
