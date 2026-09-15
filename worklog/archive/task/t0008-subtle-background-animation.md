+++
id = "t0008"
title = "Subtle background animation"
modifies = ["s0005"]
status = "done"
+++

# Subtle background animation (NEEDS APPROVAL)

## Scope

- User request: "Add subtle background animation."
- Governed by the existing ambient-motion requirements in s0005; no new product behavior is proposed.
- Keep the title's character reveal, particle construction, and direct interaction intact.

## Completion conditions

- Discernible, restrained background motion on the title/contents and dummy topic surfaces.
- Low-cost rendering with a quiet reading column, light/dark and mobile support.
- Verify the rendered surfaces and still presentation/reduced-motion, hidden-page suspension, and print omission.

## Implementation and evidence

- Replaced the uniform vertical light band in `src/components/ambient.ts` with softly sheared, domain-warped color volumes. Their positions and overlap evolve slowly; a weaker opposite-margin counterlight balances the composition.
- Updated only the masks in `assets/css/ambient.css` to expose margin light while keeping the reading column quiet. Existing theme, mobile, presentation, and print controls remain in place.
- Retained one draw pass, the 24,000-pixel raster budget, and the 12 fps cap. No additional dependency, canvas, or animation scheduler was added. Title particle code and content are unchanged.
- `npm run build -- --base=/omp-study/` passed TypeScript checking and Vite production bundling.
- Inspected actual Chromium screenshots of the cover/contents and article in light/dark modes at desktop and 390-pixel mobile widths, plus fullscreen presentation. Mobile cover document and body widths both remained 390 pixels.
- A temporary browser probe observed 80 ambient draws over 6.67 animation seconds; raw rendered pixel values changed over that interval, with no WebGL errors.
- Presentation, reduced motion, print, and an actually hidden browser tab each produced zero draws during their observation windows. Returning to the tab resumed drawing without advancing through hidden time. Print computed the ambient container as `display: none`; the article PDF was generated successfully.
- Title-to-article navigation and return were exercised. Existing title particles remained visible throughout visual inspection.
- s0005 already requires this subtle ambient motion and its lifecycle constraints; no specification change or new product decision was needed. The generated task approval marker is retained, not treated as new behavior authority.
