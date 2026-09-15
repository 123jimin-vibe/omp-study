+++
id = "n0013"
title = "OMP model catalog provider and wire layers"
parent = "n0004"
+++

# OMP model catalog, provider, and wire layers

## Model access is split in two

OMP separates model facts from model transport:

- `@oh-my-pi/pi-catalog` owns the bundled model database, provider descriptors, model identity/classification, aliases, model-role selection helpers, and cached catalog management.
- `@oh-my-pi/pi-ai` owns the provider-facing types and streaming implementations used to make authenticated model requests.

The repository makes this boundary explicit: runtime code imports catalog **values** from `pi-catalog`, while `pi-ai` re-exports only model/effort types required by its own signatures ([package rules](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/AGENTS.md#package-structure)).

## Request path

```text
model role / user selection
          ↓
catalog identity + provider descriptor
          ↓
credential and endpoint resolution
          ↓
pi-ai provider stream
          ↓
provider-family normalization
          ↓
agent-core message/tool events
```

The coding agent adds registry, configuration, and secret-resolution policy around the lower package APIs. Provider adapters normalize streaming state and errors, while `ai-schema-normalize` and `toolconv/` handle schema/tool-call differences across Anthropic, Gemini, Harmony, DeepSeek, Qwen, and other model families ([provider guide](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/providers.md), [streaming internals](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/provider-streaming-internals.md), [tool conversion directory](https://github.com/can1357/oh-my-pi/tree/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/toolconv)).

## `pi-wire` is a different wire

`@oh-my-pi/pi-wire` contains shared protocol types and relay constants for live collaborative sessions. It connects the host and `collab-web`; it does **not** implement LLM vendor protocols ([wire package README](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/wire/README.md)). Keeping this name collision explicit avoids treating every “wire” concern as part of model access.

## Harness lesson

Splitting catalog truth from provider transport lets model metadata change without making the request layer the universal owner of identity and policy. Provider-family normalization is a second boundary: the generic agent loop sees stable tools/messages even when vendors disagree about JSON Schema, reasoning blocks, call IDs, or streaming deltas.
