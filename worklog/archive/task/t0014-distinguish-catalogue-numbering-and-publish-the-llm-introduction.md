+++
id = "t0014"
title = "Distinguish catalogue numbering and publish the LLM introduction"
modifies = ["s0001", "s0003", "s0004", "s0005"]
status = "done"
+++

# Distinguish catalogue numbering and publish the LLM introduction

## Scope and authority

The user requested distinct category/chapter numbering and publication of the first article, "대규모 언어 모델". This permits the scoped s0005 requirements; s0001, s0003, and s0004 continue to govern instructional quality, citations, and localization.

## Completion conditions

- Display category numerals I–IX separately from continuous chapter numbers 01–47 without changing routes or disclosure behavior.
- Publish only the first article, following the end-user scope in n0022, with short examples and public primary-source links.
- Keep content separate from rendering; add reusable linked references rather than embedding HTML in prose.
- Verify the built site in desktop/mobile, light/dark, presentation, and print views; check section links and an unchanged empty article.

## Initial decisions

- Use static explanatory examples, not a simulated model or tokenizer. No live API or new dependency is needed.
- Leave the other 46 article descriptions and bodies empty.
- No unresolved product questions.

## Delivered

- Category numerals are localized content data (`TopicGroup.number`), displayed as I–IX. Chapters retain 01–47 and their existing routes.
- The first article has five sections, short explanatory examples, and eight source links. Examples are explicitly authored illustrations, not fabricated execution results.
- A reusable references block renders ordinary links without HTML-bearing prose; printed references also show their URLs.
- Existing note spacing now accommodates following paragraphs. The other 46 article entries retain empty descriptions and sections.

## Verification

- `npm run build` passed with TypeScript checking and the production Vite build.
- Chromium on the production preview displayed I–IX and all 47 continuous chapter numbers.
- Visually checked the first article at desktop 1440×1000 and mobile 390×844, across light and dark modes. Mobile heading remained one line; measured no horizontal document overflow.
- Section navigation reached the context-limit section, focused its heading, and showed its current-section state. Returning to the contents revealed and focused the first chapter in its expanded category.
- Presentation layout at 1920×1200 hid the header and showed the compact section navigator. Escape returned to browsing. Native fullscreen was unavailable in the headless browser; this check establishes presentation layout, not operating-system fullscreen behavior.
- Generated a two-page A4 PDF and inspected both rasterized pages: all five sections, examples, and eight linked references remained readable, with URLs printed and navigation omitted.
- Chapter 02 retained its title and number, with no description, article sections, or section navigator.

## Spec reconciliation and cleanup

- s0005 records the user-requested numbering distinction and first-article scope. No pending approval or unimplemented marker remains for this delivery.
- s0001, s0003, and s0004 remain intentionally unchanged: example-driven content, public citations, and Korean content/localization boundaries are preserved.
- Recorded the numbering correction in n0001. No dependencies, permanent tests, or throwaway scripts were introduced. PDF proof files remain only under the ignored local directory.
