+++
id = "t0017"
title = "Animate token budgets and connect LLM behavior to harness design"
modifies = ["s0001", "s0003", "s0004", "s0005"]
status = "done"
+++

# Animate token budgets and connect LLM behavior to harness design

## Scope

- Animate input, internal reasoning, and visible answer usage with deliberate playback and scrubbing.
- Keep the output-budget scale fixed and display usable empty space separately from context-blocked capacity.
- Stabilize demonstration layout across scenario changes and playback.
- Replace naming-only response comparisons with code whose behavior differs on a meaningful boundary.
- Explain prompt/token caching, including shared prefixes, context occupancy, and concrete harness implications.
- Visibly group mechanics/resource use separately from response variability/reliability, without changing chapter categories.
- Connect response variation to execution-based validation and harness evaluation.

## Completion conditions

- Exercise playback, pause, scrubbing, scenarios, and response comparison on the rendered page.
- Check stable layout, mobile and dark-mode readability, reduced motion, and static print output.
- Preserve existing token visualization, Roman category numbering, continuous chapter numbering, and previous/next chapter links.
- Run the production build; reconcile s0001 and s0005, confirm source and locale coverage under s0003 and s0004.

## Authority

The user's requested refinements are captured in s0001 and s0005. s0003 and s0004 require no content changes; new content remains source-cited and localized.

## Delivered and verified

- Context playback fills input, reasoning, and answer in order; pause preserves position, replay restarts, and the keyboard scrubber moves by individual tokens. Reduced motion advances through phase boundaries. Offscreen playback pauses.
- Context and output tracks retain 8,000- and 3,000-token scales. Ordinary completion leaves 500 output tokens unused; long-input and long-reasoning scenarios visibly block 1,000 output tokens because of the context limit.
- Browser measurements at 1440, 768, 390, and 320 pixels found invariant figure heights across sampled progress positions, scenario changes, and response tabs, with no horizontal page overflow. A narrow-screen equation wrap discovered during verification was removed.
- The response comparison shows a zero-score averaging error. Executing the displayed code produced A: `[90, 100, 60, null]` and B: `[90, 50, 60, null]` for the four displayed inputs. Arrow keys and Home/End switch candidates without moving the code or result rows.
- Added sourced caching guidance and harness implications; mechanics/resources and variability/reliability have distinct article and contents labels. The comparison is presented as possible responses, not a recorded model run.
- Verified the production article in light and dark modes, mobile widths, and fullscreen presentation with section tracking. Print shows completed selected usage, hides controls, and includes both comparison candidates; leaving print restores the original progress. Inspected the five-page A4 PDF and corrected printed segment boundaries.
- Preserved Roman category numbering, continuous chapter numbering, first-chapter boundary behavior, and previous/next navigation across the chapter 03/04 category boundary.
- `npm run build` passed after the screen and print corrections. No permanent tests were added for this visual/content change; the existing tests directory is empty.

## Spec reconciliation

- s0001: cross-cutting provider behavior is explained through caching, resource budgets, variability, and execution-based verification.
- s0005: user-controlled fixed-scale token animation, stable interactions, meaningful response comparison, content grouping, and supported reading surfaces are implemented.
- s0003: provider-specific factual claims cite public primary sources; illustrative responses and budgets are not represented as captured model outputs or actual model specifications.
- s0004: new instructional text and control labels remain in Korean locale data; renderers share the content contracts.
- No unresolved specification approval or implementation markers were introduced. Browser smoke work used disposable local artifacts and a dedicated verification browser.
