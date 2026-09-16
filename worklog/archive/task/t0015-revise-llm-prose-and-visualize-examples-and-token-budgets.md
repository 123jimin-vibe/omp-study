+++
id = "t0015"
title = "Revise LLM prose and visualize examples and token budgets"
modifies = ["s0001", "s0003", "s0004", "s0005"]
status = "done"
+++

# Revise LLM prose and visualize examples and token budgets

## Scope and authority

The user requested six corrections to the first LLM article:

- Remove the fixed-sentence retrieval clarification.
- Replace the examples' title-plus-prose presentation with meaningful visuals.
- Show a sentence divided into tokens.
- Show input, reasoning, and visible output within a context window.
- Remove the changed-input clarification from response variability.
- Remove the tautological function-naming advice.

These scoped refinements are recorded in s0005. Existing s0001, s0003, and s0004 continue to govern concise examples, source accuracy, and Korean localization.

## Completion conditions

- All three rejected passages are removed, without relocating or paraphrasing them elsewhere.
- Request/result examples have distinct visual roles and connections, not prose notes.
- Token segmentation uses computed boundaries and IDs from a named real tokenizer.
- The context diagram shows input, internal reasoning, visible answer, and remaining capacity without double-counting reasoning; scenarios demonstrate input and reasoning competing for answer space.
- Model-dependent accounting is attributed and simplified scenario values identified.
- Desktop/mobile, light/dark, keyboard interaction, presentation, and print retain readable and accurate figures.

## Implementation ownership

- Main: content contracts, prose, exchange figure, renderer/style integration, worklog, final verification.
- TokenSentence: tokenization figure, its styles, and Korean fixture data.
- ContextWindow: context-budget figure, its styles, and Korean scenario data.
- No concurrent validation; Main runs the final build and browser scenarios.

## Delivered

- Deleted all three rejected passages; removed the related conversational digressions rather than moving them elsewhere.
- Replaced summary and response-variability notes with reusable input → output figures, including two visibly distinct possible responses to one request. Verification guidance is ordinary prose, not a note pretending to be an example.
- Added a Korean sentence-to-token diagram with boundaries, whitespace marks, eight token IDs, and pinned tokenizer provenance.
- Added a proportional context-window diagram with input, internal reasoning, visible answer, and unused capacity. Three keyboard-operable scenario buttons demonstrate separate context/output limits and competition between reasoning and answer tokens.
- All diagram data and Korean strings are localized separately from rendering. Print retains the same figures and selected budget scenario, without controls. No production dependencies were added.

## Source evidence

- Ran tiktoken 0.13.0 with `o200k_base` on `오늘은 날씨가 좋아요.`. IDs: `[149830, 4740, 61781, 68282, 4081, 90032, 7952, 13]`; pieces: `["오늘", "은", " 날", "씨", "가", " 좋아", "요", "."]`. Every token's bytes decode as valid UTF-8 and the pieces reconstruct the sentence, including spaces.
- Tokenizer attribution links to the [official 0.13.0 encoding definition](https://github.com/openai/tiktoken/blob/0.13.0/tiktoken_ext/openai_public.py).
- The [OpenAI reasoning guide](https://developers.openai.com/api/docs/guides/reasoning#how-reasoning-works) and [token usage guide](https://help.openai.com/en/articles/4936856-understanding-and-counting-tokens) ground reasoning-token accounting. Article prose identifies this as OpenAI behavior; budget values are explicitly simplified examples, not a model specification.

## Verification

- Final `npm run build` passed TypeScript checking and the production Vite build.
- Real production-preview DOM contained four visual figures, no old note examples, and none of the three rejected passages. Displayed token pieces reconstructed the original sentence exactly.
- Exercised every scenario: input/reasoning/answer/free counts were `[4000,1000,2000,1000]`, `[6000,1000,1000,0]`, `[6000,1500,500,0]`. Segment shares summed to 100%; context usage was 7000/8000, 8000/8000, 8000/8000. Generated usage was 3000/3000, 2000/2000, 2000/2000 against the effective allowance.
- Tab/Space and Tab/Enter selected the next scenarios and updated counts and `aria-pressed`. Zero free capacity remained explicitly labeled.
- Visually inspected desktop 1440×1000 and mobile 390×844, including light/dark token strips, exchanges, and context/output diagrams. No horizontal document overflow; the 500-token answer retained its proportional visible segment.
- Native fullscreen presentation succeeded at 1920×1200, with hidden header and persistent section navigator. Escape exited fullscreen and presentation.
- Printed from dark mode with background printing disabled. Found and corrected a print-palette specificity defect, then confirmed white figure fills and dark text. Inspected all four A4 PDF pages: diagrams and all nine source links retained, no clipped figures, selected scenario and zero counts preserved, controls omitted.
- Same-page section navigation preserved the selected scenario. Leaving and reentering the article reset it to the default. Chapter 02 remained empty; nine Roman category numbers and all 47 chapter links remained intact.

## Spec reconciliation and cleanup

- s0005 records the requested visual examples and editorial exclusions. s0001, s0003, and s0004 remain intentionally unchanged and covered.
- Recorded the user-reported errors in n0001. No approval or implementation marker remains for this work.
- No permanent tests or throwaway script files were added. Browser verification tabs were released; PDF/raster evidence remains under ignored `local/`.

## User follow-up: redundant captions

- The user requested removal of useless example descriptions, specifically “요약 요청과 가능한 답변 · 설명용 예시”.
- Removed both exchange captions and the redundant token-chip explanation. Removed their unused content fields and rendering branches instead of leaving empty captions.
- Kept the pinned tokenizer source, whitespace legend, and simplified-budget assumption because they explain provenance or interpretation rather than restate the visual.
- Added this editorial requirement to s0005 and recorded the correction in n0001.
- Follow-up verification: `npm run build` passed. Inspected the revised figures at 390×844 dark and 1440×1000 light; no exchange captions or generic “설명용 예시” text remained, and mobile had no horizontal overflow. Print-mode DOM also omitted the captions while retaining tokenizer provenance and the budget assumption.
