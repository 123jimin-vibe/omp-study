+++
id = "t0006"
title = "Perceptible ambient motion and generative title typography"
modifies = ["s0005"]
status = "done"
+++

# Perceptible ambient motion and generative title typography

## Approved user corrections

- The background is barely visible and does not look technically impressive. Make it clearly discernible and visually intricate without obscuring reading.
- The background appears static. It must visibly animate without distracting from the content.
- The title sculpture is not moving. Give it perceptible movement.
- During implementation, the user rejected the now-distracting contour field and stated that rotating a three-dimensional model is not technically impressive. Replace both treatments, rather than tuning their contrast or rotation.
- Graphics must abstractly and subtly align with harness engineering, without adding instructional content.
- The user rejected the refractive artwork as a white blob in a frame: the result must be visually impressive as well as technically impressive. Discard that composition rather than presenting its numerical complexity as visual quality.
- The body-page background has additional constraints: remain non-distracting and computationally inexpensive.
- The user rejected the woven ribbon surface as neither visually nor technically impressive. Asked for direction, the user chose generative typography set in an aesthetic Korean typeface, with visual quality taking priority over technical ambition when they conflict.
- The title reads "OMP로 알아보는" / "하네스 엔지니어링" (two lines).
- Second review: the typeface must be sans-serif, the hero title must not be text-selectable, and the title must be more dynamic and visually impressive.
- Third review: no visible bounding rectangle around the title artwork; the cursor-hover effect was too distracting; the background should be a subtle, low-power yet impressive dynamic effect.
- Fourth review: add visible but restrained article-background effects; use more title colors; replace the awkward pre-gathering swirl; extend the composition across the hero without moving particles obscuring the text. Improve the overall composition, not merely numerical complexity.
- During this revision the user rejected replacing the text effects with plain gradient text. Preserve generative letterforms; protect readability with a stable glyph core rather than removing the typography effect.
- Further correction: merge text particles with the title-background particles. Fix aliased text; use carefully faded/soft particles and restrained border fizzle without removing the text effects.
- Further correction: restore an interactive element; toning down the distracting hover effect must not make the title autoplay-only.

Preserve the existing Korean placeholder content, navigation, responsive layouts, theme support, reduced-motion behavior, presentation, print, and replaceable visual boundaries.

## Implementation boundaries

- Keep `typography.ts` and `ambient.ts` independently replaceable and reuse `canvas-animation.ts`. One GPU particle buffer, shader, and flow connect glyphs to the full-width title field. Registered samples preserve native fractional glyph coverage; mobile samples travel from those glyphs into the field and back, with Gaussian softness and restrained opacity. Pointer movement gently steers only the outer flow. A localized native button sends a bounded, non-stacking pulse through the same field; keyboard and touch activation share its behavior. Article ambience stays separate and inexpensive.
- Typeface: Gothic A1 weight 800 (Hanyang I&C, SIL OFL, served from Google Fonts) — a widely used geometric Hangul sans, chosen by the agent after the user asked for sans-serif without naming one. Replaced Hahmlet.
- Without WebGL2, on context loss, under reduced motion, and in print, the plain heading is shown instead. No Canvas 2D particle port.
- Article ambience renders broad chromatic light envelopes at at most 24,000 pixels and 12 fps, protecting the reading column and freezing in presentation. Title particles share one draw call at 30 fps; rasterization is capped at 1.4 million pixels and device-pixel ratio 2. Mobile traveller density scales with CSS area.
- Share bounded canvas animation lifecycle handling (`canvas-animation.ts`) rather than duplicating visibility, timing, resize, and accessibility policy.

## Current revision

- Delivered the requested merged glyph-to-field effect, native antialiased glyph coverage, softened border particles, restrained interactive steering, and the localized pulse button. Existing Korean placeholder content is unchanged.
- Reconciled this scoped revision with s0005. Its pre-existing inline proposal about accessible-heading/fallback behavior remains marked for approval and was not newly approved by this work. The worklog advisor confirmed that the unrelated preserved clause does not block scoped closure.

## Verification — current revision

- `npm run build -- --base=/omp-study/` passed TypeScript 7 checking and the production Vite build. Exercised the production Pages-base URL in local Chrome through CDP.
- Reviewed actual opening, gathering, and pulse frames in both color modes at 1440×1000. The title remains readable; the mobile 390×844 @2 DPR surface has no horizontal overflow. Density was reduced by CSS surface area after mobile review.
- Activated the visible "파동 보내기" button with Enter, Space, and touch. The pulse advances through the same shader; pointer movement changes only the softly eased outer-flow steering. Context loss removes the canvas and hides the control while retaining the readable heading.
- Final desktop sample: 66 hero draws in 2.2 seconds (30 fps), 104,531 registered/mobile samples, 829,440 raster pixels, and 4.5 ms script CPU over that interval. This measures script cost on the local machine, not GPU power consumption or a cross-device guarantee.
- The independent article canvas rendered 26 times in that 2.2-second interval at 23,865 pixels. Both light and dark article screenshots preserve a quiet reading column.
- Reduced motion: no draws during a 1.7-second observation; canvas and pulse control hidden, plain title visible. A genuinely hidden browser tab produced zero draws over 1.6 seconds.
- Exercised fullscreen presentation at 1920×1200: no site header, current-section navigation present, no ambient draws during a 2.2-second observation; Escape returns to browsing.
- Generated actual title and article PDFs. Extracted PDF text includes the Korean title/contents and placeholder topic/code/static demo; decorative canvases and the pulse control are excluded.
- Navigated cover → topic → contents and remounted the title successfully. Waited for the real page transition to settle before subsequent interaction.

## Completion conditions

- Judge visible motion from short frame sequences, not merely animation flags or running timers.
- The title must read as a visually compelling, alive rendering of the heading in the chosen typeface, legible in both themes, with quiet text areas around it.
- Exercise the production build, desktop/mobile surfaces, resource bounds, reduced motion, presentation, and print before closure.
