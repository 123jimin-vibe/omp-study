+++
id = "s0002"
title = "Site Runtime and Delivery Architecture"
+++

# Site Runtime and Delivery Architecture (UNIMPLEMENTED)

## Delivery target

The guide MUST be deployable as a static website on GitHub Pages and MUST run
without a server-side application or a site-generation step.

## Runtime architecture

- The shipped SHOULD MUST use plain HTML, CSS, and JavaScript.
- JavaScript SHOULD ship directly as browser-native ES modules.
- Interactive demonstrations SHOULD be implemented with browser APIs and vanilla JavaScript.

## JavaScript validation

- JavaScript types MUST be expressed with JSDoc annotations rather than TypeScript source files.
- JavaScript MUST be checked with TypeScript's `checkJs` support by running
  `tsc --noEmit`.
- Type checking MAY be a development-time validation step, but it MUST NOT emit or transform the JavaScript served by GitHub Pages.
