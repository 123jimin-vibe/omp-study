+++
id = "t0038"
title = "Clarify agent communication, advisor gates, metrics and RoboOMP operations"
modifies = ["s0001", "s0003", "s0004", "s0005"]
status = "done"
+++

# Clarify agent communication, advisor gates, metrics and RoboOMP operations

## Scope

Commit completed t0037 first (done: 2c178cd). Reorganize C33 around delegation,
workspace isolation, lifecycle and communication, with context-level message
flow and meaningful interaction. Explain C34 advisor delivery gates concretely.
Add C37 metric overview and a reproducible comparison design. Expand C38's
problem, service/process boundaries, LLM caller, operations and prompt/model
configuration. Verify pinned source, unique definitions, desktop/mobile,
keyboard and print. Do not run RoboOMP or send external messages.

## Delivery

- Committed completed C22-C24 work as 2c178cd before starting these changes.
- C33 separates delegation/results, workspace isolation, lifecycle and peer
  messaging. Explains the in-process IRC bus, mailbox versus successful delivery,
  receipt versus response, model-input injection, wait, parent steering and
  idle/parked revival. Added an interactive sequence and three selectable
  recipient-state paths, with source-grounded exceptions.
- C34 replaces opaque mode/host/stop wording with explicit cancellation, plan,
  ACP client, print-host, final-answer and concern-cooldown conditions. Preserves
  the difference between turn and agent-end review. Moved the host/ACP definition
  emphasis to this earlier explanatory introduction.
- C37 adds an eleven-row metric overview with units, calculations, interpretation
  and collection boundaries; expands comparison into a concrete controlled A/B
  design and fictional results with failure counts and cost-per-success.
- C38 explains purpose, separate OMP process and LLM caller, model versus GitHub
  proxies, persisted sessions, operational settings, prompt templates, trusted
  comment overrides, service lifecycle and inspection controls. Added an actor
  sequence. Setup examples are instructional; no service was deployed.
- Print keeps each conditional path together where it fits on a page, avoiding
  detached case headings/results. Updated catalogue and mistake record.

## Verification

- TypeScript/Vite build and git diff whitespace checks pass.
- Five routes (C33, C34, C37, C38 and shared-component regression C31) checked at
  1440px and 390px: no page overflow, raw semantic annotations, narrow sequence
  cards or browser errors. Exercised scenario tabs and keyboard arrow selection.
- Inspected desktop/mobile screenshots, dark/presentation views, and rendered
  PDFs for communication, advisor gates, metric tables and RoboOMP actor flow.
  Print exposes all alternatives; long comparison tables repeat their headers.
- All 355 public pinned OMP source references resolve in the reference checkout;
  131 authored definition terms remain unique across the site. New behavioral
  claims were checked against pinned docs and implementation (not live agents
  or provider/service execution). All experiment figures are marked fictional.
- Local QA scripts, screenshots and PDFs remain ignored.

## Spec reconciliation

- s0001 records the requested C33/C34 context, C37 metric/comparison and C38
  runtime/configuration/operation requirements; delivered them in locale data.
- s0003: public pinned references accompany implementation claims; no real
  credentials or machine-local checkout paths were added to published content.
- s0004: instructional text and interactive labels remain localizable content;
  existing renderers handle the new interactions.
- s0005: responsive, keyboard, dark, presentation and print checks completed;
  print refinement preserves the same shared content and components.
- No outstanding implementation or approval work remains. Human proofreading
  status is unchanged.
