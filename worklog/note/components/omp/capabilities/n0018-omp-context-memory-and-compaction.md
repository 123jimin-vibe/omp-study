+++
id = "n0018"
title = "OMP context memory and compaction"
parent = "n0004"
+++

# OMP context, memory, and compaction

## Three time scales of context

| Time scale | Components | Purpose |
| --- | --- | --- |
| Startup/current project | Context-file discovery, rulebook, skills, system prompt, tool descriptions | Establish instructions and capabilities for this run |
| Current session | JSONL session tree, branch summaries, compaction, pruning/shake, artifacts | Keep a long, branchable conversation usable |
| Across sessions | Local summaries/lessons, Hindsight, Mnemopi, Sharpshooter | Recall durable project knowledge or decisions |

## Discovery and current-session context

OMP discovers native project/user files plus compatible resources from several external agent ecosystems. The nearest applicable `.omp` directory, precedence rules, and rule matching decide what becomes sticky prompt context; internal `docs://`, `rule://`, `memory://`, `artifact://`, and related URLs expose larger resources on demand ([context-file rules](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/context-files.md), [rulebook pipeline](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/rulebook-matching-pipeline.md)).

Sessions remain append-only trees. Context rebuilding selects the active path, turns compaction and branch-summary entries into model-facing messages, retains the chosen recent suffix, and restores relevant custom entries ([session tree plan](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/session-tree-plan.md)).

## Compaction strategies

OMP supports ordinary summary compaction, branch summaries, provider-native/streaming variants, pruning or mechanical “shake” strategies, and `@oh-my-pi/snapcompact`, which serializes discarded history into dense bitmap frames for vision-capable models. Maintenance may run manually, at a threshold, after overflow/incomplete output, mid-turn, or while idle ([compaction architecture](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/compaction.md), [snapcompact package](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/snapcompact/README.md)).

## Memory backends

`memory.backend` selects one of five modes: `off`, project-local session extraction/consolidation, remote Hindsight, local SQLite Mnemopi, or friction-gated Sharpshooter decision files. Memory is guidance, not authority; the runtime instructs the agent to pair it with current repository evidence ([memory guide](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/memory.md)). Depending on the backend, `recall`, `retain`, `reflect`, `memory_edit`, and `learn` expose structured memory operations.

## Harness lesson

Context management is not one summarizer. Discovery controls what enters, session maintenance controls what remains visible, and memory controls what may return later. Each mechanism needs provenance and a different trust level so compressed or recalled text cannot silently outrank current instructions and code.
