+++
id = "t0005"
title = "Title motion and ambient background"
modifies = ["s0005"]
status = "done"
+++

# Title motion and ambient background

## Approved user requests

- Add animations to the title.
- Add a subtle, technically impressive, ambient, non-distracting background to the title and content pages; avoid the familiar floating-node treatment.
- Preserve the existing requirements for legibility, lightweight rendering, replaceable design, Korean content, mobile browsing, presentation, and print. Keep exactly one placeholder topic; do not develop real guide content.

## Implementation boundaries

- Keep title motion and the procedural background separate from content, navigation, and demonstrations.
- Use restrained composited movement over cached geometry rather than a continuously redrawn simulation. Honor reduced-motion preferences, pause invisible decoration, and leave print undecorated.
- Main owns application integration, shared stacking, specification updates, and verification. Independent implementation slices own title motion and the ambient field respectively.

## Completion conditions

- Title motion and ambient backgrounds work in light and dark modes without covering text or intercepting controls.
- Browsing between the title and the single dummy topic retains working navigation and a coherent background.
- Verify actual desktop/mobile rendering, reduced motion, presentation, print, and the production build. Record observed results before completion.

## Implementation

- Title motion stays in `title.ts` and `title.css`: staggered whole-line entrance on initial loading, a 26-second composited sculpture drift, and separate visibility tracking for the copy and sculpture. Returning through the existing route transition does not replay the entrance.
- `ambient.ts` traces two warped scalar fields with marching squares and an asymptotic saddle decider. Geometry is cached; each of the two canvases is capped at one million pixels. Only mounting, resizing, and palette invalidation require painting.
- `ambient.css` owns palette, masks, reading/mobile attenuation, and slow composited movement. The application mounts the background once; page fades apply to the content rather than the whole backdrop.
- s0005 now covers the requested title animation and ambient treatment. s0002 and s0004 remain satisfied without changes: no dependencies, guide topics, content strings, or locale structures were added.

## Verification

- `npm run build` passed with TypeScript 7.0.2 and Vite 8.3.0. Exercised the production artifact under `/omp-study/`.
- Inspected light/dark cover and reading surfaces, 320- and 390-pixel mobile layouts, a 768-pixel tablet layout, 1440-pixel desktop browsing, and 1920 by 1200 fullscreen presentation. Checked for horizontal overflow at those exercised sizes.
- Observed the initial title entrance and continuing CSS motion. A final two-second desktop idle sample recorded zero JavaScript and layout time, with approximately 0.39 milliseconds of style recalculation. These are main-thread measurements, not GPU measurements.
- Reduced motion produced static, fully visible headings and artwork with no running animations. Native Chromium forced-colors emulation hid the background.
- Chromium focus/visibility emulation confirmed that hidden-page background animations pause with unchanged timestamps and resume when visible. Scrolling the sculpture wholly offscreen paused it while the visible ambient background continued.
- Native fullscreen froze both background animation timestamps in place across a 350-millisecond sample. The header remained absent, section tracking reached the final section, and Escape exited fullscreen and resumed the background. No uncaught JavaScript exceptions were reported by the DevTools runtime during that final scenario.
- Title/topic navigation remained usable, and returning to the title did not reactivate its entrance. The dummy demonstration advanced to 1 / 3.
- Generated and inspected title and topic PDFs. The title retained both Korean heading lines and its placeholder contents; the topic retained code and a static 1 / 3 demonstration snapshot. Print hid the ambient field and removed heading animation transforms.

## Cleanup

- Removed temporary PDFs and closed the verification tab and temporary development server. Left the pre-existing production preview running.
- No permanent tests, fixtures, dependencies, or additional content were introduced. The browser probes were temporary verification code.
