+++
id = "t0004"
title = "Title redesign and reading refinements"
modifies = ["s0005"]
status = "done"
+++

# Title redesign and reading refinements

## Approved user requests

1. Remove links to the GitHub repository.
2. Replace the underwhelming title-page design with something visually compelling and technically non-trivial, while retaining the earlier legibility, performance, and replaceability constraints.
3. Remove the sticky presentation header and its controls.
4. Make presentation typography moderately smaller.
5. Show the current section and provide an unobtrusive sticky navigator rather than a full table of contents.
6. Add syntax highlighting to code blocks.
7. Add dark mode.

The user reported that the print button does nothing. Remove that in-page action rather than retain an unverified affordance; browser-native printing and the existing PDF layout remain supported. Preserve Korean as the main language and exactly one placeholder body page.

## Implementation boundaries

- Replace the cover visual as a self-contained mounted component; keep visual styling separate from content.
- Use a compact current-section/previous-next navigator, not an expanded sticky contents list.
- Keep scroll tracking event-driven and clean up navigation/visual observers on unmount.
- Keep theme selection and highlighting reusable; preserve source code when copying and printing.
- Main owns integration, global theme tokens, presentation, navigation, locale/type updates, and specification write-back. Concurrent slices own the cover and syntax highlighting independently.

## Verification

- `npm run build` passed with TypeScript 7.0.2 and Vite 8.3.0. The production artifact was exercised under `/omp-study/`, matching a project-site deployment path.
- Inspected light/dark desktop and mobile surfaces. Overflow checks passed at 320, 390, 768, 1280, and 1440 CSS pixels; presentation was also inspected at 1920 by 1200. The mobile section navigator is 62 pixels high with 44-pixel previous/next targets.
- The final rebuilt bundle was smoke-tested again after removing the obsolete external-link icon. The dummy demo advances in dark mode and preserves its progress through presentation entry and Escape exit; no uncaught browser errors were observed.
- Native fullscreen hides the header and uses 24-pixel presentation body text at the reference viewport. Section links, scroll tracking through the final section, and Escape were exercised. A real fullscreen-denying iframe policy also preserves the presentation layout, Escape exit, and return-to-contents navigation.
- JavaScript and TypeScript highlighting preserves source text, including CRLF and markup-like input. Language aliases and unsupported-language plain text were exercised. Native clipboard copying preserves code with Windows newline conversion; denied clipboard permission leaves the code selected and focused for manual copying.
- System color-scheme changes and the persisted manual override were verified. Rendered syntax-token contrast was at least 6.26:1 in light mode and 8.91:1 in dark mode.
- Native Chromium metrics recorded zero script, layout, and style-recalculation time during separate one-second visible-page idle samples on the cover and body. Reduced-motion mode had no running animations.
- Dark browsing and fullscreen presentation produced identical one-page A4 topic text. A separate four-page PDF preserved 120 numbered code rows and 36 markers on a wrapping long line, in order and within page bounds. Screen controls were absent from print.
- Verification fixtures were temporary browser content, not additional site topics or permanent test infrastructure. The shipped contents list still contains exactly one Korean placeholder topic.

## Implementation notes

- Cover rendering, theme controls, syntax rendering, and section navigation remain separate components; appearance stays separate from Korean content data.
- Vite dependency discovery now starts at `index.html`, and its watcher excludes the optional `local` study checkout. This prevents unrelated checkout dependencies and HTML files from entering the application's development scan.
