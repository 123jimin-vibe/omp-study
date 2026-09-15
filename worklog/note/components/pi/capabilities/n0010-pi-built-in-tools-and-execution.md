+++
id = "n0010"
title = "Pi built-in tools and execution"
parent = "n0003"
+++

# Pi built-in tools and execution

## Built-in surface

Pi registers eight coding tools: `read`, `bash`, `powershell`, `edit`, `write`, `grep`, `find`, and `ls`. The standard default is the smaller `read`, `bash`, `edit`, `write` set; settings or SDK options can select, exclude, or disable tools ([settings reference](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/settings.md#tools), [SDK tool options](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/sdk.md#tools)).

They divide into four operations:

- filesystem inspection (`read`, `ls`, `find`, `grep`);
- exact file mutation (`write`, `edit`);
- process execution (`bash`, `powershell`);
- result presentation metadata, such as edit diffs, that lets a TUI and an SDK consumer render the same operation differently.

Tool instances are cwd-scoped. Their operation interfaces are pluggable, so an extension or SDK host can route filesystem/process work to SSH, a container, or another execution backend. An extension can also register a tool with a built-in name; execution and renderer overrides are resolved independently ([extension tool overrides](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/extensions.md#overriding-built-in-tools)).

## Intentional omissions

Pi's small tool set is part of its product philosophy. MCP, subagents, permission popups, plan mode, to-dos, and background bash are not built-in requirements; users add them with packages/extensions or use external facilities such as containers and tmux ([design principles](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/usage.md#design-principles)).

Pi also does not impose a process-level filesystem/network/credential sandbox. It runs with the launcher's permissions; isolation is delegated to the Gondolin extension, Docker, OpenShell, or another external boundary ([permissions and containerization](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/README.md#permissions--containerization)).

## Harness lesson

The minimal set covers the fundamental coding loop—observe, search, mutate, execute—while keeping workflow policy outside the loop. Pluggable operations are the important seam: changing *where* a tool runs need not change its schema, model-facing name, or transcript representation.
