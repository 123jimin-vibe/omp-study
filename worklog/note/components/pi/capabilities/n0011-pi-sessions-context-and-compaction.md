+++
id = "n0011"
title = "Pi sessions context and compaction"
parent = "n0003"
+++

# Pi sessions context and compaction

## Session store

Pi persists sessions as append-only JSONL. Entries use `id` / `parentId` links, so one file stores a tree rather than only a linear transcript. Message, model/thinking changes, labels, custom data, compaction, and branch-summary entries remain part of the durable event history ([session format](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/session-format.md)).

Tree navigation changes the active leaf inside a session. Fork/resume/new-session operations change the session-file context. This distinction lets a user rewind and grow another branch without destroying the abandoned path.

## Context construction

`pi-coding-agent` converts the active path into model messages and combines it with:

- the current system prompt and active tool descriptions;
- discovered project/user context files;
- extension-provided or SDK-provided resources;
- the active model and thinking settings;
- any prior compaction or branch summary that lies on the selected path.

`DefaultResourceLoader` is the composition point for context files, extensions, skills, prompt templates, themes, and prompt overrides ([SDK resource loading](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/sdk.md#core-concepts)).

## Context maintenance

Pi has two summary mechanisms:

| Mechanism | Trigger | Result |
| --- | --- | --- |
| Compaction | Manual request, context threshold, or overflow recovery | Summarizes old messages, retains a recent suffix, and appends a `compaction` entry |
| Branch summary | Leaving work during tree navigation | Appends a summary of the abandoned branch at the new continuation point |

Both summaries preserve cumulative file-operation context. Tool results stay paired with their calls, and an overlarge single turn can be split with its earlier prefix summarized separately ([compaction guide](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/compaction.md)). Extensions may cancel or replace the summarization through lifecycle hooks.

## Harness lesson

Durable history and model context are different representations. JSONL retains the full branch structure; context building selects and compresses only what the next model call needs. Treating summaries as typed entries preserves auditability and allows later context rebuilds to apply deterministic rules.
