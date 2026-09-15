+++
id = "n0016"
title = "OMP code intelligence and editing"
parent = "n0004"
+++

# OMP code intelligence and editing

## Capability cluster

OMP treats repository inspection, mutation, and IDE feedback as cooperating components rather than unrelated shell commands.

| Component | Responsibility |
| --- | --- |
| `read`, `grep`, `glob` | Text/file discovery with ignore rules, structured output, truncation artifacts, and native search/walk support |
| `ast_grep`, `ast_edit` | Structural matching and transformations across supported parsers |
| `write`, `edit` | File creation/replacement and targeted patching with previews, atomic application, and mutation tracking |
| `lsp` runtime/tool | Language-server lifecycle and operations such as definitions, references, symbols, diagnostics, rename, code actions, and formatting |
| `checkpoint`, `rewind` | Snapshot a mutation boundary and restore selected working changes/session state |
| `security_scan` | Scan repository/dependency security signals through a dedicated tool contract |

The active registry and conditional gates are visible in [`packages/coding-agent/src/tools/index.ts`](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/coding-agent/src/tools/index.ts).

## Edit pipeline

The edit tool supports multiple strategies, validates file identity/content anchors, constructs a preview, and applies the accepted mutation through the native edit/diff substrate. It can coordinate with LSP rename/file-operation hooks and surface diagnostics after mutation ([edit tool reference](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/tools/edit.md)).

Session-global mutation versions and a diagnostics ledger prevent late language-server results from being mistaken for the state of a newer file. This is why LSP is wired into the session/tool layer rather than exposed only as an unrelated subprocess ([LSP reference](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/tools/lsp.md)).

## Native collaborators

`pi-edit`, `pi-diff`, `pi-ast`, `pi-walker`, and the `grep`, `glob`, `text`, `highlight`, `workspace`, and VCS bindings provide the lower mechanisms. The TypeScript tools own schemas, policy, session metadata, previews, errors, and model-facing output; Rust owns performance-sensitive parsing, walking, diffing, and application.

## Harness lesson

An edit is a transaction across more than the filesystem. Correctness depends on the version observed by the model, atomic mutation, editor protocol notifications, diagnostics that correspond to that mutation, and a recovery path. Central mutation/version state makes these components composable instead of racing one another.
