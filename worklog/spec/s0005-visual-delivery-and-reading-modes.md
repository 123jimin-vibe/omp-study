+++
id = "s0005"
title = "Visual Delivery and Reading Modes"
+++

# Visual Delivery and Reading Modes

## Cover and site chrome

- The title page MUST combine a browsable contents list with a visually compelling, technically non-trivial design.
- Visual design and page transitions MUST remain clean, highly legible, lightweight, and replaceable. Decorative complexity MUST NOT distract from browsing.
- Site chrome MUST NOT link to the GitHub repository.

### Ambient visuals and motion

- The title artwork MUST be generative typography of the site title itself, set in an aesthetically regarded sans-serif Korean typeface, with dynamic, visually impressive animation. When visual and technical ambitions conflict, visual quality takes priority. Rotating a three-dimensional model, a featureless luminous blob within a frame, or a deforming abstract surface are insufficient.
- The hero title MUST NOT be text-selectable. NEEDS APPROVAL: the title remains real, accessible heading text, and the artwork degrades to the plain heading without WebGL, under reduced motion, and in print.
- The title and topic pages MUST have a subtle, technically non-trivial ambient background rather than a conventional floating-node network.
- During ordinary browsing, the background MUST be discernible and gently animated without distracting from reading. Contour-line fields and other fine, moving patterns behind text MUST NOT be used.
- Ambient visuals MUST remain subordinate to text and controls, adapt to both color modes and mobile layouts, and remain independently replaceable.
- The body-page background MUST be computationally inexpensive as well as non-distracting; title-level rendering complexity MUST NOT be required to sustain it.
- Title effects MUST use a richer color palette and extend across the hero rather than remain local to the letters. The opening composition before gathering MUST be visually polished, not an awkward swirl.
- The title MUST remain clearly legible throughout; actively moving particles MUST NOT obscure it. The artwork MUST NOT have a visible bounding box or distracting cursor-hover response.
- The title's text and background particle effects MUST form one continuous effect, rather than separate visual systems. Glyph edges MUST remain smoothly antialiased. Departing text particles MUST be clearly visible as they blend into the background; careful fading, softness, and border fizzle MUST NOT make their motion imperceptible.
- That continuity MUST be visible in the motion and particle treatment, not merely shared implementation. Text and background particles MUST NOT read as distinguishable effect populations.
- The letterforms MUST consist of particles with clearly perceptible dynamic effects coordinated with the surrounding particles. When those particles occupy their original positions, the letters MUST appear fully filled, not hollow or sparsely stippled. A static grain texture or a solid gradient-text layer substituting for particle construction is insufficient.
- When some particles depart, the remaining particles in the perturbed region MUST also flow subtly rather than leave static, porous text behind. Disturbance boundaries MUST be spatially non-trivial rather than obvious straight sweeps.
- Portions of the letter-forming particles MUST visibly separate, move, and rejoin during ordinary viewing. Slightly wiggling otherwise solid text does not demonstrate particle construction. Slowing ambient transport MUST NOT make the lettering effectively static; preserve legibility and filled resting letterforms rather than stationary porous patches.
- The title effects MUST retain restrained direct interaction rather than be autoplay-only. Explicit visual-effect controls, including buttons, MUST NOT be added. Interaction MUST preserve legibility and avoid the rejected distracting hover response.
- Starting or repeating interaction MUST preserve existing particle positions and motion; it MUST NOT reset or reseed the effect.
- Particle transport MUST be slow and restrained, especially during interaction. Influence MUST ease in and out rather than produce abrupt or fast flights.
- Mouse-cursor movement MUST produce a perceptible but non-distracting particle response; click-only interaction is insufficient.
- The opening MUST form the title one visible character (grapheme) at a time, at 150 milliseconds per character. This supersedes the earlier keyboard-input/IME-composition requirement; it MUST NOT accelerate ambient transport or interaction.
- Graphics MUST abstractly and subtly align with harness engineering. They MUST NOT invent guide content or rely on literal agent diagrams, decorative code, or explanatory site copy to establish that relationship.
- Decorative motion MUST honor reduced-motion preferences and stop while not visible. Presentation MUST keep the ambient background still; print MUST omit it.

## Supported uses

- The site MUST support ordinary web browsing, presentation, and printing to PDF.
- These uses SHOULD share content and reusable components rather than maintain separate copies of each topic solely for a different medium.
- Presentation and print styling SHOULD remain replaceable without rewriting topic content or interaction logic.

## Presentation

- The expected presentation form is a topic page shown fullscreen and scrolled vertically while a speaker explains it.
- Presentation design SHOULD prioritize legible content and demonstrations over navigation chrome. A separate slide-deck structure is not required.
- A declared reference viewport, such as 1920 by 1200 in fullscreen, MAY guide presentation design; perfect optimization for every display is not required.

### Presentation refinements

- Presentation MUST NOT retain a sticky site header or its toolbar. Native fullscreen remains escapable with Escape.
- Presentation typography SHOULD use comfortable reading density rather than oversized text.
- The current section MUST be identifiable while scrolling.
- A compact, persistent section navigator MUST support unobtrusive navigation without displaying a full table of contents.

## Responsive browsing

- Layouts MUST adapt to their viewport and preserve readable content and usable navigation.
- The site MUST remain browsable on mobile devices.
- Presentation-specific sizing assumptions MUST NOT prevent ordinary mobile browsing.

## Print and PDF

- Printed output MUST preserve readable topic content in document order without requiring interactive controls.
- Interactive demonstrations SHOULD provide a meaningful static representation appropriate to the printed topic.
- Screen-only navigation and controls SHOULD be omitted from printed output.
- Long content SHOULD paginate without clipping text or hiding content inside scrollable containers.

## Code rendering

- Code blocks MUST support syntax highlighting while preserving their source text for reading, copying, and printing.

## Color modes

- The site MUST support dark mode as well as light mode.
- Text, code, navigation, and demonstrations MUST remain legible and usable in both modes.

## Cumulative acceptance checklist

Later corrections refine this contract; they do not silently discard earlier constraints. The following is the cumulative record of the user's requirements, including the delivery and content boundaries governed by s0002, s0003, and s0004.

### Content and delivery boundaries

- Show the title as two lines: "OMP로 알아보는" / "하네스 엔지니어링". Use a sans-serif Korean typeface and disable title selection.
- Provide a browsable contents list with unmistakably placeholder entries and exactly one separate dummy topic page. Do not invent the eventual curriculum or replace placeholders with actual guide material.
- The dummy page exists to establish content infrastructure, support later body-design iteration, and exercise cover/body navigation. Avoid corny promotional copy and detailed explanations of what the site is about.
- Keep Korean as the current main language and preserve the localization boundaries in s0004.
- Content must remain easy to edit and audit. Interactive animations and demos must be modular, and common components reusable. Design, motion, and reading modes must be replaceable without rewriting content.
- Preserve GitHub CI and static GitHub Pages delivery. The repository is private but intended to become public; assume Pages has already been configured. Do not add a repository link to the site chrome.
- Per s0002, a build step is allowed; prefer a light build, TypeScript, and consideration of TypeScript 7. TSX is permitted, not required. Architecture must withstand frequent content, feature, and design revisions without avoidable technical debt.

### Visual quality and motion

- Keep the design and page transitions clean, highly legible, responsive, and lightweight. "Technically impressive" requires a visibly pleasing, non-trivial result; implementation complexity alone does not satisfy it. Consider creative improvements beyond mechanically applying isolated suggestions.
- The title is generative particle typography, not a separate decorative sculpture. The letters must consist of particles **and visibly move**, with direct interaction and a clear, readable silhouette. Settled particles reconstruct fully filled letters; their departures remain clearly visible.
- Text particles and surrounding particles must form one coherent dynamic effect, including their motion, particle shapes, softness, colors, arrival, and departure. Shared code alone is insufficient if the populations remain visually distinguishable.
- Use a richer, coherent multicolor palette. Compose the opening before gathering deliberately; no awkward initial swirl. Spread motion across the hero rather than confining it to a small part of the text.
- Active particles must not obscure words. Preserve sufficient stable structure for reading; use carefully controlled fading, softness, and border fizzle to avoid aliased or harsh particle edges without hiding departing particles.
- Disturbed letter interiors must remain gently flowing, not frozen and pitted after emission. Both automatic and interactive disturbance boundaries must be irregular and evolving rather than visibly linear.
- No artwork bounding box, explicit effect buttons or other separate effect controls, or distracting cursor-hover response. Do not solve distracting interaction by deleting interaction altogether.
- Activation must preserve continuity, not restart particle positions or animation time. Keep both ordinary transport and interaction slow, and retain a restrained local response to mouse movement.
- Opening typography reveals whole visible characters at the faster 150 ms cadence. The earlier keyboard-by-keyboard Korean composition requirement has been superseded.
- Both cover/contents and article backgrounds need discernible, subtle motion during browsing. The article effect must be especially non-distracting and computationally inexpensive, independent of title-level rendering work.
- Rejected directions remain rejected: conventional floating-node networks; contour-line fields; merely rotating a 3D model; a white blob in a frame; and woven surfaces. Renaming or increasing their computational complexity is not a new visual solution.
- Preserve the existing reduced-motion, visibility-suspension, still-presentation, and decoration-free print policies above.

### Reading surfaces

- Support browsing, fullscreen topic presentation with vertical scrolling, and printing to PDF from shared content. A 1920×1200 presentation reference is acceptable; mobile browsing must still work.
- Presentation has no sticky header/toolbar or redundant print/exit controls. Escape exits fullscreen. Keep text comfortably sized rather than oversized, identify the current section, and provide a persistent, unobtrusive navigator rather than a full sticky table of contents.
- Keep syntax highlighting and both light/dark modes usable. Printing must retain readable document order and meaningful static demo content without decorative canvases or interactive controls.
