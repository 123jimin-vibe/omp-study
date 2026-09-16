+++
id = "s0001"
title = "Product and Learning Experience"
+++

# Product and Learning Experience

## Purpose

omp-study is an interactive guide to harness engineering: the design and
implementation of the runtime that turns a raw language model into a capable
coding agent.

## Scope

The guide MUST cover harness-engineering techniques in a progression from
foundational mechanisms, such as tool calling, to more complex agent behavior.

The guide MUST also explain cross-cutting model and provider behavior that materially
affects harness engineering, even when it does not correspond to a distinct OMP
module. Examples include prompt/token caching, response variability, resource
budgets, and result verification; connect these behaviors to concrete design choices.

## Learning experience

- Explanations SHOULD be concise and example-driven.
- Examples SHOULD make the behavior being discussed observable rather than merely naming or describing it.
- A runnable or clickable demonstration SHOULD be provided when interaction materially improves understanding of the technique.
- Interactive elements SHOULD serve an instructional purpose; decoration alone is not sufficient justification for an interaction.
- The ordering and presentation of topics SHOULD help readers connect individual mechanisms to the larger coding-agent harness.
