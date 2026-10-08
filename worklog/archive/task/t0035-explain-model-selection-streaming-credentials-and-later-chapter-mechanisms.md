+++
id = "t0035"
title = "Explain model selection streaming credentials and later chapter mechanisms"
modifies = ["s0001", "s0003", "s0004", "s0005"]
status = "done"
+++

# Explain model selection streaming credentials and later chapter mechanisms

## Scope and completion

Address the user's C20–C22 proofreading: explain model eligibility, API and
compatibility metadata, every built-in model role, reasoning mechanisms and
controls, schema conversion context, TTSR (including C06), credential lifecycle,
remote workers, and a separate secret-redaction section. Read C23–C38 and improve
concrete explanatory gaps. Preserve existing edits, reviewed chapters and flags.
Ground OMP details in revision `3f000c524cf82279f804ffd7526280cc9a5f25fe`;
distinguish general mechanisms from OMP-specific controls. Check source links,
examples, types/build and rendered reading surfaces. Existing specs cover this
editorial work; no new product behavior is intended.

## Outcome

- C20 distinguishes registered, selectable and successfully authenticated models;
  explains API/compatibility metadata and all 15 built-in roles; separates role
  assignment, reasoning mechanisms, CLI/config/keyboard controls, and common
  harness design from OMP-specific conventions. Includes effort versus token
  budgets, provider field examples and gpt-oss's explicit reasoning control.
- C21 shows a named tool's input schema and the enclosing Responses `tools`
  fragment, explains the normalization and its semantic limits, and adds a
  six-event TTSR interruption/retry example. C06 now has a complete rule file,
  trigger explanation, interrupt/reminder comparison and judge controls.
- C22 explains API-key provisioning, OAuth access/refresh-token lifecycles,
  remote worker processes and broker versus gateway credential exposure.
  Conversation secret replacement has its own section and explicit scope.
- Read C23–C38 and amended 12 later chapters: C23 conversation versus filesystem
  restoration; C24 compaction mechanisms; C25 internal address portability;
  C26 memory scopes; C27 discovery-provider terminology; C28 a complete skill
  example; C30 an MCP call/result; C32 goal-budget arithmetic; C33 child context
  inheritance; C36 OMP RPC wire messages and yield/settled semantics; C37 equal-
  input cache comparison, timing and benchmark units; C38 duplicate delivery
  versus a new request on the same issue. No further changes were needed in
  C29/C31/C34/C35 for this pass; this is not human review approval.
- Updated n0001, n0023 and the changed headings in n0022. Preserved existing
  working-tree changes and the reviewed chapter flags.

## Verification

- Checked OMP details against the pinned checkout, including model resolution,
  settings, keybindings, schema conversion, TTSR, broker/gateway, secret handling,
  memory, tasks, RPC and Metaharness. Used official provider/model documentation
  for reasoning and RFC 6749 for OAuth; references appear with the explanations.
- All 315 pinned OMP references resolve to local source paths; 99 contextual
  chapter links resolve. New JSON examples parse, and the TTSR regex matches the
  illustrated npm commands while excluding pnpm. These are source/example
  checks, not live provider requests or live OMP execution.
- Headless Edge opened all 16 changed chapters at 1440px and 390px (32 route
  checks), with no page overflow or runtime errors. Exercised TTSR step/all
  controls and keyboard selection of the interrupt/reminder cases. Rechecked
  the final C06/C20/C36 prose at both widths after final edits.
- Inspected desktop/mobile screenshots, the entire TTSR sequence, dark mode and
  presentation. Generated C06/C20/C21/C22 PDFs, verified the new section text is
  present, and inspected rendered print pages. Final TypeScript/build and
  whitespace checks pass.

## Spec reconciliation

- s0001: explanations now identify objects, actors, controls and observable
  results; implementation details support the concepts and contextual links.
- s0003: public source attribution remains pinned for OMP; general provider
  claims have official references. QA artifacts remain in ignored local storage.
- s0004: article changes remain in Korean locale data.
- s0005: existing content blocks preserve navigation, responsive/print modes,
  catalogue order and review flags. No renderer or product behavior changes.
- Existing authoritative requirements cover the corrections; no spec change or
  additional approval is required.
