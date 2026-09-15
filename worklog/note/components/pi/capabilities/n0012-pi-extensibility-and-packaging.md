+++
id = "n0012"
title = "Pi extensibility and packaging"
parent = "n0003"
+++

# Pi extensibility and packaging

## Resource types

Pi's customization model has four primary resource types:

| Resource | Role |
| --- | --- |
| Extension | Executable TypeScript module that registers tools, commands, flags, shortcuts, providers, renderers, or lifecycle handlers |
| Skill | On-demand procedural guidance loaded for a task |
| Prompt template | Reusable prompt expanded from a slash command |
| Theme | Terminal color/style definition |

The documentation indexes these as the mechanisms that keep the core small ([documentation index](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/index.md#customization)).

## Extension runtime

Extensions can intercept session, agent, model, input, and tool events; add or override tools; modify the system prompt; create custom terminal UI; persist custom entries; and dynamically activate registered tools. Project and user extension directories are discovered at startup and can be hot-reloaded ([extension guide](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/extensions.md)).

An extension is therefore both a plugin and a policy hook. For example, the same API can implement a plan workflow, a sandboxed tool backend, a custom provider, a subagent tool, or a TUI overlay without changing agent-core.

## Distribution

A **Pi package** bundles any combination of extensions, skills, prompt templates, and themes. It can use conventional directories or declare resources under the `pi` key in `package.json`; sources may be npm, Git, or local paths. Global and project settings record installed packages, while filters can enable or disable individual resources ([package guide](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/packages.md)).

Packages are not a security boundary. Extensions execute code and skills can instruct the model to run commands, so package source must be reviewed before installation.

## Harness lesson

Pi separates mechanism from workflow twice: the extension API exposes runtime mechanisms, while packages assemble and distribute opinionated workflows. Skills and prompt templates add context only when needed; executable extensions are reserved for behavior that requires state, interception, I/O, or UI.
