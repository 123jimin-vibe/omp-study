+++
id = "n0020"
title = "OMP extensibility configuration and security"
parent = "n0004"
+++

# OMP extensibility, configuration, and security

## Extensibility components

- **Extensions and hooks:** TypeScript/JavaScript modules register tools, commands, event handlers, providers, renderers, UI, and policy interception.
- **Skills and context resources:** procedural instructions are discovered from OMP and compatible external-agent layouts.
- **Slash commands:** built-in and extension commands share a registry and dispatch layer.
- **MCP:** configured servers contribute external tools through a managed protocol bridge.
- **Marketplace/plugins:** manifests group extensions, hooks, skills, MCP servers, and related resources for installation and reload.

`extensibility/`, `slash-commands/`, `capability/`, and `discovery/` divide runtime registration from source discovery. The [extension-loading guide](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/extension-loading.md) and [marketplace guide](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/marketplace.md) describe those paths.

## Configuration and identity

`config/` resolves YAML/settings schemas and precedence; `registry/` owns model/provider and agent/capability registries; `secrets/` handles stored credentials and display obfuscation. Environment variables, user configuration, profiles, project configuration, command flags, and discovered compatibility sources meet at this layer ([settings reference](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/settings.md), [secrets guide](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/secrets.md)).

## Safety controls

OMP can apply per-tool approval policies, with decisions such as allow, prompt, or deny and optional remembered patterns. Bash also has command-pattern approval and an independent best-effort interceptor that routes common file/search/edit operations toward dedicated tools. ACP can delegate mutation permission to the editor host ([approval mode](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/approval-mode.md), [bash runtime](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/bash-tool-runtime.md)).

Approval is not containment: an allowed process keeps ambient filesystem, network, credential, and subprocess access. Bash interception also does not constrain shells spawned through another tool such as `eval`. Strong isolation therefore remains a separate execution/environment concern.

## Harness lesson

Discovery answers “what capabilities exist,” configuration answers “which are active and with what policy,” and approvals answer “may this invocation proceed.” Collapsing those questions into one plugin loader makes precedence and security behavior impossible to reason about.
