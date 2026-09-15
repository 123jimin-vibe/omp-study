+++
id = "t0012"
title = "Add gradual vertical blur to title effects"
modifies = ["s0005"]
status = "done"
+++

# Add gradual vertical blur to title effects

## Scope

- Gradually blur the upper and lower regions of the cover's title particle effect.
- Keep the entire title text sharp, using its measured bounds rather than a fixed viewport band.
- Preserve particle motion, interaction, color modes, and existing reduced-motion and print fallbacks.

## Completion conditions

- Blur increases smoothly above and below the title without a visible boundary.
- Desktop and mobile title text remain clear, including after resizing.
- Verify the live WebGL output in the browser and run the production build.

## Delivered and verified

- Added gradual, position-dependent softening to the existing particle kernels, with a sharp band derived from the heading bounds and 12px of clearance. Bounds update with the existing glyph/resize lifecycle; no extra canvas or postprocessing pass was introduced.
- Preserved particle coverage while broadening the kernels. Motion, interaction, and the accessible DOM heading remain unchanged.
- Visually inspected live production WebGL output in light and dark modes, including desktop and 390×844 mobile at device-pixel ratio 2.
- Compared the same GPU frame with blur enabled and disabled: the full title region had zero changed pixels at each checked size. Both outer regions changed and had lower high-frequency alpha energy; WebGL reported no errors.
- Confirmed resize recalculates the clear band and reduced motion displays opaque plain heading text without a particle canvas.
- `npm run build` passed, including TypeScript. s0005 records the delivered blur requirement.
