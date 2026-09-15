+++
id = "t0010"
title = "Revise component-based article catalogue"
status = "done"
modifies = []
+++

# Revise component-based article catalogue

## Scope

- Replace the rejected article proposal with an LLM-first, component-based catalogue grounded in t0009.
- Use direct subject titles and concrete, non-tautological descriptions.
- Map articles to discrete OMP components and distinguish general prerequisites from researched implementation.
- Obtain independent technical and reader-perspective feedback, including multiple model tiers, and revise before delivery.
- Record the user-reported mistakes in n0001.
- Deliver the proposal in chat; do not change website content or product specifications.

## Completion conditions

- The proposed order introduces LLMs before harness implementation.
- Every implementation article identifies its component and research basis.
- Titles and descriptions address each user correction without retaining the rejected framing.
- Independent review findings and resulting revisions are reported accurately.
- The mistakes record is updated and no website/specification changes are made.

## Review and outcome

- Prepared a revised catalogue beginning with LLMs, tokenization/generation, messages/prompts, and function calling, followed by named harness components.
- Obtained independent component auditing and an LLM-API developer reader simulation from two subagents, plus separate `smol` newcomer and `slow` technical/editorial model-tier reviews.
- Applied the reviews: separated session runtime from storage; assigned prompt assembly explicitly; separated the tool registry from loop-owned execution; kept file reading, editing, and shell execution adjacent; split finite jobs from managed processes; moved permissions before execution tools; identified memory backends accurately; and corrected research mappings.
- Separated plan mode, goals, and task tracking into distinct article subjects rather than retaining an umbrella workflow article. Included native VCS responsibilities without inferring a checkpoint implementation.
- A fresh `default` model-tier acceptance review of the revised 48-article candidate reported no remaining material failures against the user's correction criteria and supplied a simulated introductory reading route.
- Reader perspectives are simulations, not observations from a user study. The model interface exposes tier selections; no particular underlying model identities are claimed.
- General prerequisites need sources beyond t0009. Consulted Hugging Face's [text generation](https://huggingface.co/docs/transformers/llm_tutorial), [tokenizers](https://huggingface.co/learn/llm-course/en/chapter2/4), and [chat templates](https://huggingface.co/docs/transformers/chat_templating) documentation, plus OpenAI's [function calling](https://developers.openai.com/api/docs/guides/function-calling) guide.
- The catalogue is a proposal, not completed articles or demonstrated implementation behavior. Detailed source tracing remains part of writing each article, especially restoration, compaction, configuration precedence, and workflow-control semantics.
- Appended the rejected proposal's mistakes to n0001. No website code, content, or product specifications were changed; s0001–s0005 remain unchanged.
