+++
id = "t0037"
title = "Visualize chapter 22 credential flows and explain secret detection"
modifies = ["s0001", "s0003", "s0004", "s0005"]
status = "done"
+++

# Visualize chapter 22 credential flows and explain secret detection

## Scope

Visualize C22 OAuth renewal and direct-broker/gateway credential paths, with
actors and token ownership visible. Explain which secrets OMP collects and
matches, using fictional examples and pinned source. Follow-up: improve C23's
branch selection diagram, especially the conversation sent in the next request.
Further follow-up: explain C24 handoff generation and application and reorganize
method sections to match the documented default attempt order.
Preserve definitions, existing content and source attribution. Verify desktop,
mobile, dark, keyboard and print behavior and related shared-component cases.

## Delivery

- C22 has OAuth renewal, direct-broker and gateway sequence diagrams showing
  token ownership and credential versus model-request destinations. Expanded
  secret masking with collection sources, matching conditions, fictional
  before/after logs and limits grounded in OMP's implementation.
- C23 shows a connected saved tree and a role-labelled next-request transcript.
  Branch selection updates both, distinguishes shared versus selected messages,
  preserves tool-call/result correlation and names excluded saved records.
  Printing includes both branches and keeps the source tree together.
- C24 explains remote, snapcompact, handoff, shake and soft in the stated default
  attempt order. Handoff covers the snapshot and appended instruction, separate
  model request, text generation, session application and user controls, with
  a generation/application diagram. Separate pruning follows the five methods.
- Generalized sequence diagrams to three or four actors while preserving
  readable event widths and aligned lifelines. All labels stay in locale data.
  Updated the catalogue and user-reported mistake log.

## Verification

- TypeScript/Vite build and git diff whitespace checks pass.
- Browser checks pass at 1440px and 390px for C22-C24 and two earlier sequence
  consumers (C02 and C15); no overflow, narrow event cards or browser errors.
- Verified keyboard branch selection, selected message paths, excluded records,
  tool-call correlation and actor/lifeline alignment. Inspected mobile/desktop,
  dark and presentation screenshots and rendered print pages for the new flows.
- Generated C22-C24 PDFs; both branch transcripts print, the saved tree stays
  together, and OAuth/gateway/handoff diagrams remain readable.
- All 329 pinned OMP source paths resolve; 122 authored definition terms remain
  unique site-wide. Checked new claims against pinned source and OAuth renewal
  against RFC 6749. This verifies documentation, not live provider execution.
- Local screenshots, PDFs and QA scripts remain ignored.

## Spec reconciliation

- s0001: recorded the user's C22 diagram/detection, C23 selected-message and C24
  handoff/default-order requirements.
- s0003: new OMP claims carry public pinned citations; no machine-local paths
  or real secrets were added to public content.
- s0004: new instructional and interaction labels are locale data.
- s0005: verified responsive, keyboard, dark, presentation and print rendering;
  shared sequence diagrams preserve readable event cards with four actors.
- No outstanding implementation or approval work remains. Human proofreading
  status is unchanged.
