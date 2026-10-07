+++
id = "t0033"
title = "Clarify actors lifetimes prerequisites and examples in unreviewed chapters"
modifies = ["s0001", "s0003", "s0004", "s0005"]
status = "done"
+++

# Clarify actors lifetimes prerequisites and examples in unreviewed chapters

## Scope and completion conditions

Address the user's chapter 05–09 findings: session composition and prompt entry,
instruction discovery locations, the retry-case label, tool-call intent and
ToolSession lifetime, command-policy context, ask ownership and sandboxing.
Audit every currently unreviewed chapter (05–38) for the same classes of gaps:
missing actors/triggers, object lifetime/scope, prerequisites, concrete structures
and misleading labels. Amend findings in context rather than append boilerplate.

Preserve prior uncommitted work and reviewed 01–04. The user accepts chapter 07
apart from the named correction; after correcting it mark 07 reviewed, retaining
all other review flags. Record findings per chapter, source-check exact behavior,
update authoring guidance/catalogue and verify build, links and affected visuals
in browser and print. Existing s0001/s0003/s0004 govern explanatory quality;
s0005 needs only the user-authorized chapter-07 review status update.

## Initial state

t0031/t0032 changes are already present and uncommitted. A local topic snapshot
records that baseline. OMP source remains pinned to
3f000c524cf82279f804ffd7526280cc9a5f25fe.

## Delivered corrections and chapter audit

All 34 chapters that were unreviewed at task start were read for the stated
classes of gaps and amended in context. Existing section IDs and routes remain
intact. The following records concrete findings rather than treating paragraph
counts or a successful build as evidence of editorial completeness.

| Chapter | Finding and correction |
| --- | --- |
| 05 | Added a session composition figure showing the caller, request/event directions, conversation, execution choices, working environment, running state and record manager. Explained who calls `prompt`, first/follow-up input, streaming behavior, local commands and continuation after tool results. |
| 06 | Added a six-row map of instruction locations, search boundaries and opt-in foreign providers, plus a repository directory example. Distinguished the nearest nonempty native `.omp` directory from ancestor discovery and per-depth candidate selection. |
| 07 | Renamed “출력 전 실패” to “보존할 결과 없음”. Explained the retriable failure case with thinking/whitespace but no committed text, image or tool call. Cleared only this chapter's badge under the user's conditional acceptance. |
| 08 | Explained intent metadata, harness-added `i`, model authorship, trace use, stripping before execution and the 200-character limit. Added a concrete read call. Explained ToolSession construction per agent session, shared project files and separately shareable dependencies. |
| 09 | Introduced why command matching is needed before the policy example, then explained additional target/editor/plan checks and `policyKey`. Distinguished model-called `ask` from harness-triggered approval. Defined sandboxing, compared its enforcement time with approval, and cited Claude Code's shell sandbox as another harness example. |
| 10 | Distinguished path globbing, content matching and semantic search; introduced the judge role and linked model roles. |
| 11 | Explained the CUT register as temporary holding for moved lines before using the name. |
| 12 | Named the model as command author and harness as executor; clarified working directory, timeout units, exit codes, PTY and the example's POSIX syntax. |
| 13 | Distinguished session-owned jobs from project-managed named services and defined the broker. Clarified the server-start example's caller and removed overlapping explanation. |
| 14 | Explained kernel variables' session/language lifetime, separate language runtimes, reusable files and per-call execution. |
| 15 | Explained model-created AST proposals and model-requested resolve/reject separately from permission approval. |
| 16 | Defined LSP before transport details; separated model actions, language-server execution, document versions, explicit diagnostics and automatic write hooks. |
| 17 | Defined stack frames, scopes and variables references, including which party requests and which party reads runtime values. |
| 18 | Existing search/read examples already exposed inputs, results and fallback conditions. Clarified the `web` role at first use and linked role selection to the model catalogue. |
| 19 | Existing API maps, accessibility tree and runtime flow were retained. Introduced headless/CDP/relay before the connection table and defined ARIA with an icon-button example; removed the later duplicate CDP definition. |
| 20 | Explained how provider, model ID, API and base URL identify a usable model connection. |
| 21 | Defined strict schemas and gateways before use, and introduced deltas, SSE/WebSocket delivery and the TTSR connection. |
| 22 | Explained who initiates OAuth login and how the harness chooses credentials without asking the model to select secrets. |
| 23 | Distinguished model-called checkpoint/rewind operations from user-driven session/tree navigation. |
| 24 | Explained harness selection of compaction and the difference between model-written soft summaries and mechanical shake/snap operations. |
| 25 | Broke down an internal artifact URL, its selected line range and session scope; distinguished internal routing from HTTP requests. |
| 26 | Explained memory opt-in and backend selection, project bank scope, harness automatic recall, model recall/retain calls and user `/memory` commands. |
| 27 | Added concrete configuration locations and defined CLI overlays versus runtime overrides; separated merge order from discovery traversal and corrected `config path` to a directory. |
| 28 | Explained harness expansion of prompt templates before the model receives them. |
| 29 | Distinguished extension registration API from session runtime context; clarified fresh child bindings versus potentially shared module variables. |
| 30 | Introduced stdio/local and HTTP/remote MCP connections and JSON-RPC before initialization and method names. |
| 31 | Separated model proposals, user approval and harness mode switching. |
| 32 | Distinguished model tool requests from goal state and harness continuation; clarified that todo completion is a model update rather than independent proof. |
| 33 | Explained parent task calls, harness child creation and child yield; distinguished agent definition names from task names and idle/parked from forced termination. |
| 34 | Explained harness scheduling, review cadence, turn and agent-end triggers. Moved severity definitions ahead of examples that use them. |
| 35 | Defined TUI and explained event/call-ID relationships, including a start event preceding possible approval denial. Linked intent metadata. |
| 36 | Defined the host and contrasted SDK method calls with newline-delimited RPC request messages. |
| 37 | Distinguished automatic collection from user stats/trace requests, defined OpenTelemetry/spans, and linked the Eval tool to avoid confusing it with evaluation. |
| 38 | Defined webhook receipt, request signature/ID and HTTP 202 versus task completion; identified the tool executor and PAT proxy role. |

## Evidence and verification

- Source-checked API ownership and lifetime against pinned SDK/AgentSession,
  agent-loop intent handling, tool docs, memory/extension/MCP docs, background
  services, advisor scheduling and task communication. The chapter-06 discovery
  map follows `docs/context-files.md`; chapter-07 retry wording follows
  `docs/non-compaction-retry-policy.md`. Public pinned citations remain in the
  articles. Claude Code's contrasting sandbox example was checked against its
  official sandboxing documentation and linked next to the claim.
- Snapshot comparison confirms reviewed chapters 01–04 are unchanged from the
  task-start state, including the prior chapter-03 walkthrough. All route IDs,
  numbering, titles and section IDs are retained. Reviewed chapters are exactly
  01–04 and 07; all other badges remain. Checked the actual contents DOM as well
  as content data.
- The shared session-composition component uses localized content, semantic
  figure/caption and definition-list elements. Its five parts and both request
  directions are present; inline API names render as code. Inspected mobile
  light, desktop dark, normal desktop and presentation captures, plus the
  instruction-source table and sandbox comparison on mobile.
- Headless Edge checked all 38 routes at 1440px and 390px (76 route checks), ten
  aliases, and existing tree/budget/sequence interactions without runtime errors
  or page overflow. Exercised chapter-07 retry selection and keyboard navigation;
  print exposes all alternatives.
- Exported chapters 05, 06 and 09 to PDF. Extracted text contains every section
  title; the complete session figure fits on one page. Inspected rendered pages
  with the session figure, instruction-source table/directory example and sandbox
  comparison. Long paths wrap and source URLs remain printable.
- All 82 contextual chapter links resolve and all 295 pinned OMP source
  references point to existing local source paths. Newly added JSON requests
  parse. Production build/TypeScript checks and `git diff --check` pass.
- OMP behavior was checked against source, not live provider/model/browser
  integrations. Layout and agent editorial review do not imply human acceptance
  of the other chapters. Existing t0031/t0032 edits are preserved and no commit
  was made.

## Spec reconciliation

- s0001's subject-first, API/mechanism and contextual-reference requirements
  cover the revisions. Its reviewed-content clause now also preserves 07 under
  the user's acceptance.
- s0003 remains satisfied by pinned public OMP citations, explanatory examples
  and a directly linked official external source. Machine-specific QA paths stay
  in ignored local material.
- s0004 remains satisfied: Korean article data and labels are separate from the
  shared renderer. No new locale publication is claimed.
- s0005's chapter scope, reading modes and review-status rules are preserved,
  with the user-authorized 07 status update. The new figure works in mobile,
  presentation, dark and print modes.
- n0022 records the audit and status; n0023 records the authoring lesson about
  actors, triggers, scope, prerequisites and discovery locations; n0001 records
  the user's correction. No unresolved spec approval is required.
