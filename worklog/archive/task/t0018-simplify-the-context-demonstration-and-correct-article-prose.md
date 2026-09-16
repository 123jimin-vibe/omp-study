+++
id = "t0018"
title = "Simplify the context demonstration and correct article prose"
modifies = ["s0005", "s0003"]
status = "done"
+++

# Simplify the context demonstration and correct article prose

## Scope and acceptance

- Replace the nine-second context demonstration with brief, distinguishable input/reasoning/answer phases.
- Remove the progress-position slider and the separate output-budget diagram. Indicate maximum generation length and context-constrained space within one fixed-scale window.
- Retain pause/replay, reduced-motion phase stepping, print completion, stable responsive geometry, and lifecycle disposal.
- Render field paths, identifiers, and expressions as inline code in article prose and example text.
- Remove the incorrect response-comparison sentence, including code-length and answer-matching claims, and remove the awkward tool-use qualification paragraph.
- Verify actual browser playback, one-window accounting, responsive layout, inline-code semantics, safe text rendering, reduced motion, and print; run the production build.

## Authority

The user's explicit corrections authorize these revisions to s0005. s0003 remains unchanged; the revised prose retains existing primary-source citations and makes only concrete claims about the example.

## Delivered and verified

- Playback now uses 450 ms for input, 1,100 ms for reasoning, and 1,100 ms for the answer. A Chromium run completed in 2,688 ms, with distinct reasoning and answer phases; pause and replay were exercised.
- The renderer contains one fixed 8,000-token context bar and no slider. Its generation bracket spans tokens 4,000–7,000 for the ordinary scenario and 6,000–8,000 for the long-input scenarios. The ordinary scenario marks the final 1,000 context tokens as outside the maximum output length.
- Removed the separate output-budget panel, progress-position UI, and obsolete contract fields/styles. Completed scenario counts remain 4,000/1,000/1,500, 6,000/1,000/1,000, and 6,000/1,500/500 for input/reasoning/answer.
- At 1440, 768, 390, and 320 pixels, scenario and reduced-motion phase changes retained the same figure height at each width. Response comparison tabs also retained their height; there was no horizontal page overflow.
- API fields and example expressions render as semantic inline code. Browser smoke checks covered multiple spans, literal HTML, unmatched backticks, empty delimiters, and wrapping of the full cache-usage field path. Existing code blocks remain literal source.
- Replaced the rejected response comparison with its concrete input/result distinction and removed the entire tool-use qualification paragraph. Existing citations and harness implications remain.
- Verified light/dark and mobile surfaces, fullscreen presentation with section tracking, offscreen playback pause, and reduced-motion stepping. Inspected the generated five-page A4 PDF: the selected context scenario prints complete with a visible generation bracket; leaving print restored the earlier 6,000-token input state.
- `npm run build` passed. No permanent tests or additional documentation files were added; browser probes and generated print artifacts were disposable.

## Spec reconciliation

- s0005 now reflects the user's single-window, no-slider, brief-playback, inline-code, and prose corrections; all were implemented and exercised.
- s0003 required no revision: no new external factual claims were introduced, existing primary-source citations were retained, and examples remain distinguishable from recorded model outputs.
- No unresolved approval or implementation markers remain for this task.
