+++
id = "s0002"
title = "Site Runtime and Delivery Architecture"
+++

# Site Runtime and Delivery Architecture

## Delivery target

The guide MUST be deployable as a static website on GitHub Pages without a
server-side application. A build or site-generation step MAY produce the
deployed files.

## Runtime architecture

- The deployed site MUST run using browser-compatible HTML, CSS, and JavaScript.
- Browser-native ES modules and browser APIs SHOULD remain the default runtime
  building blocks.
- Build steps SHOULD be lightweight, with no unnecessary stages or dependencies.

## Source tooling

- TypeScript source SHOULD be used for application and reusable component code.
- TypeScript 7 SHOULD be considered when selecting the compiler.
- Source types MUST be checked with the selected TypeScript tooling.
- Type checking MAY be separate from the build step that transforms or bundles
  source files for delivery.

## Maintainable architecture

- The architecture MUST accommodate frequent content and feature modifications
  without accumulating avoidable technical debt.
- Editable, auditable content SHOULD remain separate from rendering and
  interaction code.
- Common components SHOULD be reusable. Interactive demonstrations and visual
  design SHOULD have modular boundaries so they can be changed or replaced
  without rewriting unrelated content and features.
