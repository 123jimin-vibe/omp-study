+++
id = "n0009"
title = "Pi terminal UI and interfaces"
parent = "n0003"
+++

# Pi terminal UI and interfaces

## Terminal component

`@earendil-works/pi-tui` is a general terminal component and differential-rendering library. Components render width-bounded ANSI strings and can receive keyboard or normalized pointer input; focusable components mark cursor position for IME-aware terminal cursor placement. Containers, text, Markdown, images, selectors, scroll views, and overlays form the reusable widget layer ([TUI guide](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/tui.md)).

The TUI owns rendering efficiency, ANSI-aware measurement/wrapping, focus, overlay stacking, mouse routing, terminal image protocols, and theme invalidation. `pi-coding-agent` supplies the transcript, editor, tool-result renderers, keybindings, and application state.

## Host interfaces

Pi exposes the same coding-session engine through several adapters:

| Surface | Contract | Typical host |
| --- | --- | --- |
| Interactive | Full terminal transcript/editor and extension UI | Human at a terminal |
| Print | One prompt, streamed or final text | Shell scripts |
| JSON event stream | Structured print-mode events | Log/event consumers |
| RPC | JSONL commands in and responses/events out over stdio | Non-Node controller process |
| SDK | Typed `AgentSession` API and event subscription | Node/TypeScript application |

The RPC command/event protocol is documented separately from the in-process SDK ([RPC guide](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/rpc.md), [SDK guide](https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b/packages/coding-agent/docs/sdk.md)).

## Harness lesson

Presentation is an adapter over session events. The model/tool loop should not know whether a tool call becomes ANSI rows, JSON, or an SDK callback. Pi still makes UI an extension surface: custom tools can provide renderers, and extensions can mount focused or overlay components through the same primitives used by the application.
