+++
id = "t0003"
title = "TypeScript build and multi-surface reading"
status = "done"
modifies = ["s0002", "s0005"]
+++

# TypeScript build and multi-surface reading

## Approved request

The user explicitly approved amending s0002 to permit build steps, strongly encourage TypeScript while considering TypeScript 7, prefer lightweight builds, and preserve an architecture suitable for frequent content and feature modifications without accumulated technical debt.

The user also approved a visual specification covering ordinary web browsing, fullscreen topic presentation by vertical scrolling, and print-to-PDF. Layouts must be responsive and remain usable on mobile. A declared presentation reference size such as 1920 by 1200 is permitted.

## Implementation plan and completion checks

- Update s0002 and create s0005 with the approved requirements.
- Assess TypeScript 7 and migrate application/content source cleanly to typed modules, without retaining obsolete JavaScript copies.
- Add a lightweight static build and migrate CI to validate and deploy its output. Preserve the existing configured-Pages assumption and deployment permission boundaries.
- Keep one Korean placeholder topic; do not select an actual guide curriculum.
- Keep source content, demo behavior, reusable renderers, and replaceable media-specific design separate.
- Support fullscreen scrolling presentation and a printable representation of interactive content.
- Verify the production build, CI workflow, desktop/mobile reading, presentation transitions, and actual generated PDFs, including long-content pagination.

## Implementation decisions

- Selected TypeScript 7.0.2 with strict checking and Vite 8.3.0 for static output. `npm run build` checks types before bundling; no browser framework or server-side runtime was added.
- Moved application, reusable components, demonstrations, and Korean content to typed source under `src/`. Removed the obsolete JavaScript copies and empty migration directories.
- Kept content data, mounted-component lifecycles, demonstration state, and visual styling separate. Demonstrations provide `renderPrint()` snapshots of their current state; the shared article renderer manages print preparation and cleanup.
- Kept browsing, presentation, and print rules in separate stylesheets. Presentation uses native fullscreen when available and otherwise retains a usable presentation layout with a Korean status message. The reference presentation viewport is 1920 by 1200.
- The user subsequently permitted TSX. Retained the small typed DOM renderers for this change rather than introducing a framework or custom JSX runtime; content authors do not need to construct elements.
- CI installs locked dependencies, checks and builds on pull requests, and deploys only `dist/` from `main`. Existing least-privilege deployment boundaries and the configured-Pages assumption remain intact.

## Verification

- `npm run build` passed with strict TypeScript checking; `npm exec -- tsc --version` reported 7.0.2. The production build contains only HTML, CSS, JavaScript, the favicon, and `.nojekyll`.
- `actionlint -no-color .github/workflows/site.yml` passed. Hosted GitHub Actions and a real Pages deployment were not run in this session.
- Exercised the production output under `/omp-study/` in Chromium, including 320/390-pixel mobile layouts and 1440/1920-pixel desktop layouts. Confirmed one Korean placeholder topic, usable controls, and no horizontal page overflow in the checked layouts.
- Verified topic/section navigation, browser history, real clipboard copying with Windows line-ending normalization, and manual-selection fallback when clipboard permission is denied.
- Verified native fullscreen entry, vertical reading and demonstration interaction, Escape exit, and state preservation across presentation changes. An iframe with fullscreen explicitly denied retained the presentation layout, showed the Korean limitation message, and exited with Escape.
- Verified reduced-motion operation without running animations and Korean fallback for a requested Japanese locale.
- Exported six PDFs totaling fourteen pages: title, ordinary topic, fullscreen topic, mobile topic, and long-content topic in both ordinary and native-fullscreen modes. Checked title/body order, omitted screen controls, current-state demonstration snapshots, and snapshot cleanup after printing.
- The two five-page exports retained all 120 numbered code lines, twelve numbered paragraphs, the long unbroken code text, and the final code marker. Text remained within printable margins; rendered PDF pages were visually inspected.
- Long-content fixtures and browser probes were not added to the guide. The site still contains exactly one placeholder body page. Physical mobile devices and non-Chromium browsers were not tested.
