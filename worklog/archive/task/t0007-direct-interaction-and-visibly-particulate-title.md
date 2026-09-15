+++
id = "t0007"
title = "Direct interaction and visibly particulate title"
modifies = ["s0005"]
status = "done"
+++

# Direct interaction and visibly particulate title

## User requirements

- "No explicit UI elements (like buttons) for visual effects."
- "The text should appear to consist of particles."
- The particles must have dynamic effects and blend with background particles, not merely form a static grain texture. Preserve all earlier clarifications together and record the constraints.
- The text must appear fully filled when particles occupy their original positions, and particles departing from the text must be more clearly visible.
- When particles depart, the remaining particles in the affected region must flow subtly rather than leave static porous text. The disturbance boundary must be non-trivial, not obviously linear.
- Text and background particles must not remain visually distinguishable as separate effect populations.
- Starting interaction must not reset particle positions.
- Slow the particle motion, especially during interaction.
- Particles must react to mouse-cursor movement.
- Form the initial title one visible character at a time. This supersedes the user's earlier request for individual keyboard inputs and Korean IME composition.
- Preserve the faster cadence without accelerating particle transport or interaction: 150 ms character intervals, with proportionally shorter reveals and pauses.
- Restore perceptible dynamic movement within portions of the letter-forming particles, while preserving the slower surrounding transport and interaction.
- Make particle construction apparent through visible separation and return; slightly wiggling solid-looking text is insufficient.

These are the user's direct requirements after t0006 closed. Preserve the earlier requirements in s0005 for merged text/background transport, softened antialiased boundaries, restrained interaction, readability, color modes, responsive layouts, and reduced-motion/print behavior.

## Implementation

- Remove the pulse button, its wrapper/styles, and its localized label/type field.
- Keep interaction on the title itself: click/tap or Enter/Space while focused sends the bounded pulse; pointer movement gently steers the outer field. No new visible controls or explanatory copy.
- Form the title entirely from soft grains whose overlap reconstructs filled glyphs at their settled positions. Retain filtered fractional coverage along glyph borders; do not introduce a solid text layer underneath.
- Animate a bounded portion of the actual letter-forming particles into the shared field and back, while the remaining particles preserve legibility. Direct activation strengthens that same movement rather than substituting a color-only response.
- Reuse rasterized glyph coverage to protect resting letter interiors without hiding nearby departing grains. Upload only affected glyph rectangles during character reveal or layout changes, not each frame.
- Use a shared domain-warped disturbance field, gently circulating remaining grains with density compensation. Preserve the glyph silhouette with the coverage mask; originate direct pulses at the activation point and warp their boundary too.
- Remove the background-only population, its ribbon trajectories, and the separate stream kernel/palette. All particles originate in the glyph samples and use one continuous transport model and soft-grain treatment.
- Separate character reveal and eased interaction into small renderer-independent modules. Keep particle identities and geometry immutable; reveal only the affected glyph mask regions. Remove the superseded keyboard composer, its tests, and target-morphing machinery.
- Replace resettable impulse time with continuous, damped pressure and a restrained cursor-flow influence; slow the shared transport clock independently of typing cadence.
- Replace coherent outline wobble with irregular, evolving release regions. Their grains take unequal distances along the shared transport path, visibly separating before returning; neighboring grains also flow. Remove the moving glyph-mask offset.
- Record the complete cumulative acceptance checklist in s0005; use it for the final review rather than checking only the newest request.
- Article ambience and placeholder content remain unchanged from t0006.

## Verification

- `npm run build -- --base=/omp-study/` passed TypeScript 7 checking and Vite production bundling after the final shader changes.
- Inspected the actual Chromium-rendered opening, formed title, and localized separation in light/dark modes. Whole characters reveal at 150 ms intervals; the superseded IME compositor and its test-only wiring were removed.
- Exercised the production build at `/omp-study/`: cursor movement produced nonzero flow; click, Enter, Space, and touch produced eased pressure. The animation clock continued through repeated activation. WebGL reported no errors.
- A throwaway transform-feedback probe ran the actual vertex shader at one-second sample times from 4–34 seconds on the mobile geometry. Of the letter-bound grains, 2,828 moved more than 6 CSS pixels from home; 2,652 subsequently returned within 0.8 pixels. This verifies actual departure and return, not only movement of a solid outline.
- Inspected the fully formed mobile title at 390 CSS pixels; document width remained 390 pixels. No explicit effect buttons were present. Title-to-topic navigation and return worked; return did not replay the opening.
- Under reduced motion, the title canvas was hidden, its interaction target left the tab order, and the instrumented renderer made zero draws during the observation interval. The dummy topic printed to PDF with zero visible canvases.
- s0005 covers the delivered cumulative particle behavior, including the latest character-based opening and rejection of slight solid-text wiggling. Preserved its preexisting approval marker; this revision does not approve that separate proposal. Article ambience, presentation styling, and dummy content are unchanged.
