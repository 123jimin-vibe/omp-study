+++
id = "t0034"
title = "Scope modes and options to their configuration and callers"
modifies = ["s0001", "s0003", "s0004", "s0005"]
status = "done"
+++

# Scope modes and options to their configuration and callers

## Scope and completion

The user's follow-up identifies an incomplete t0033 correction: defining what
Python's per-call mode does did not explain who selects it, where its key lives,
or how to enable it. Correct that example and audit unreviewed chapters for the
same omission in modes, options and switches. Identify the exact owning setting,
tool/API argument, command or automatic trigger at the point of use; show useful
configuration examples and link shared configuration rules. Preserve reviewed
01–04/07 and all review flags. Source-check against the pinned OMP checkout,
verify changed examples and links, build and inspect the changed chapter-14 UI.
Record findings and reconcile s0001/s0003/s0004/s0005 before closure.

## Outcome

Chapter 14 now identifies per-call as the OMP `python.kernelMode` setting,
selected by the user and read by the harness for Python execution. It includes
`omp config set/get`, the default global file, a project YAML example, and the
distinction from the model's per-invocation `eval.reset` argument. The existing
two-cell comparison explicitly assumes the default `session` mode.

The mode/option audit covered the 33 unreviewed chapters. Corrections were made
in 22, locating the control rather than only describing its effect:

| Chapters | Controls and ownership clarified |
| --- | --- |
| 06 | Rule Markdown locations/frontmatter versus `config.yml` TTSR settings; full enabled/interrupt keys. |
| 08 | Tool-author `AgentTool` fields versus model arguments; user `tools.intentTracing` and environment override. |
| 09 | Approval file/CLI selection, command patterns, interceptor enable/pattern settings and ask availability. |
| 12–13 | Model `async` argument versus harness auto-background configuration, threshold units and service mode write content. |
| 14 | Python kernel setting, global/project examples, per-call lifetime, reset distinction and Eval background keys. |
| 16 | Fully qualified LSP diagnostics settings and the user/model distinction. |
| 19 | `allowed_domains` belongs to `browser.open`; `silent` belongs to `tab.screenshot`. |
| 20 | `config.yml` model roles versus `models.yml` definitions and context-promotion targets. |
| 21 | API strict markers versus model arguments; provider/model compatibility location and Anthropic provider flag. |
| 22 | Secret feature switch versus each `secrets.yml` entry's obfuscate/replace mode, with both file scopes. |
| 24 | Full compaction keys, asynchronous summary default, and `compaction.methodOrder` ownership. |
| 26 | Memory backend selection and `mnemopi.autoRecall`; clarified automatic recall's first-turn trigger. |
| 27 | Full dotted setting keys mapped to nested YAML syntax. |
| 28–29 | Tool-definition skill capability, skill-command configuration, template file locations and extension CLI loading. |
| 30 | Native MCP configuration files and each server's instructions switch, default and reload command. |
| 31–32 | `/plan` versus feature availability; CLI/config/session ways to arm prewalk; `/vibe` command ownership. |
| 33 | `task.outputSchema`/`schemaMode` call arguments, and user-enabled isolation versus the parent's `isolated` request. |
| 34 | Default advisor config file and full keys versus per-advisor WATCHDOG roster, editor command and targets. |
| 37 | OTLP endpoint environment variables and explicit export-disable controls. |

The audit found no additional selectable-mode/option scoping change necessary
in 05, 10, 11, 15, 17, 18, 23, 25, 35, 36 and 38: their relevant examples already
name session methods, tool/action parameters, address operations, user commands
or automatic event handling. This is a scoped finding, not human review approval
or a claim that no further editorial improvements are possible.

## Verification

- Read the pinned Python docs and `eval/py/index.ts`: the backend reads
  `python.kernelMode` from session settings; the executor creates and shuts down
  a fresh subprocess for per-call mode. Checked CLI/global/project behavior in
  settings docs. Checked other added keys and owners against their domain setting
  registrations, native discovery, tool/API docs and CLI command dispatch.
- All chapter links resolve (93 contextual links) and public pinned OMP source
  references resolve to paths at revision
  `3f000c524cf82279f804ffd7526280cc9a5f25fe`.
- Headless Edge checked all 22 changed chapter routes at desktop/mobile widths
  (44 route checks): no page overflow or runtime errors. Exercised keyboard
  navigation from chapter 14's setting link and browser Back.
- Inspected chapter 14 at 390px and 1440px. PDF text retains the commands, YAML,
  paths and reset distinction; inspected the rendered page containing them.
- Production build, TypeScript and whitespace checks pass. Configuration
  examples were checked against source and visually; no live OMP configuration
  was changed and no external model calls were executed.
- The reviewed chapters 01–04/07 and their flags remain unchanged. A concurrent
  user commit captured part of this work; retained it and completed the remaining
  edits without rewriting Git history.

## Spec reconciliation

- s0001 already requires topic-first explanations, useful API/mechanism detail
  and contextual references; locating controls completes those requirements.
- s0003 is covered by the pinned public source citations and source checks.
- s0004 remains covered by Korean locale-only article changes; no new renderer
  strings or language support were added.
- s0005 retains the catalogue, review status and reading modes. Existing shared
  code blocks, paragraphs and links render the additions.
- No spec change or additional approval is needed. n0001 records the correction;
  n0023 now explicitly requires the controlling surface at first use.
