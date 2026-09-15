+++
id = "n0006"
title = "Pi model and provider layer"
parent = "n0003"
+++

# Pi model and provider layer

## Component

`@earendil-works/pi-ai` is the lowest agent-specific layer. It presents many model vendors through one typed request/stream contract and only catalogs models that support tool calling, because tool use is required by the layers above ([package README](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/ai/README.md)).

## Responsibilities

- **Provider ownership:** a provider owns its model list, authentication strategy, login/refresh behavior, and stream implementation. A `Models` collection registers providers and routes a request to the provider that owns its selected model.
- **Protocol normalization:** providers can share wire implementations such as Anthropic Messages, OpenAI Responses, or OpenAI-compatible Completions while exposing a common `Model`, `Context`, message, tool, and stream-event vocabulary.
- **Authentication:** provider auth resolves stored credentials, environment variables, OAuth refresh, or ambient platform credentials. Explicit request credentials take precedence.
- **Streaming and accounting:** text, reasoning, partial tool calls, completion/error states, token usage, and cost arrive through normalized events.
- **Portable context:** the context is a serializable system prompt, message sequence, and tool set, so a host can hand the same logical conversation to a different supported model.
- **Media and model features:** the layer represents image input/generation, reasoning controls, stop reasons, aborts, and provider-specific options without putting those details in the agent loop.

These behaviors and their public APIs are documented in the pinned [`pi-ai` README](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/ai/README.md).

## Boundary

`pi-ai` describes a model call; it does not execute requested tools or decide to call the model again. A host can use `complete()` or consume the stream directly. `pi-agent-core` adds the feedback loop that appends tool results and continues until the turn settles.

## Harness lesson

Provider normalization is an anti-corruption layer: downstream code handles one message/event model, while provider modules absorb differences in auth, payload format, reasoning fields, and streaming deltas. The provider remains a runtime object—not merely a string in a catalog—because catalog, auth, refresh, and dispatch have to stay consistent.
