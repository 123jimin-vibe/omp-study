+++
id = "n0015"
title = "OMP terminal UI native and shared foundations"
parent = "n0004"
+++

# OMP terminal UI, native, and shared foundations

## Terminal UI

`@oh-my-pi/pi-tui` provides the differential renderer, component interface, input dispatch, focus, overlays, cursor placement, width-safe ANSI helpers, and terminal image support. `packages/coding-agent` is the integration layer that mounts transcript/editor/tool components, applies themes and keybindings, and exposes extension UI only when a UI-capable mode exists ([TUI contract](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/tui.md)).

The renderer exploits stable component output and row prefixes to reduce terminal writes; rendering and product state remain separate concerns ([renderer internals](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/tui-core-renderer.md)).

## Native substrate

`@oh-my-pi/pi-natives` is the TypeScript/N-API boundary to platform-specific Rust binaries. The aggregate `pi-natives` crate exposes modules supplied by specialized crates:

| Crate/component | Main responsibility |
| --- | --- |
| `pi-shell`, `pi-builtins` | Persistent embedded shell, PTY/process control, in-process command utilities |
| `pi-edit`, `pi-diff` | Patch/edit application and structured diffs |
| `pi-ast` | Tree-sitter/ast-grep structure and transformations |
| `pi-walker` | Parallel ignore-aware filesystem walking and shared scan cache |
| `pi-iso` | Copy-on-write/reflink/overlay project isolation strategies |
| `pi-voice` | Capture, playback, codecs, and live audio primitives |
| `pi-vcs` | Central version-control operations |
| `pi-natives` modules | Search, text layout, images, desktop input/capture, clipboard, tokens, profiling, locks, and system utilities |

The crate ownership and loader boundary are documented in the [native architecture](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/natives-architecture.md) and [crate inventory](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/native-crates.md).

## Shared TypeScript foundations

- `@oh-my-pi/pi-utils` centralizes logging, streams, directories/environment, process helpers, and other cross-package utilities.
- `@oh-my-pi/omptype` supplies callable, ArkType-compatible schemas with interpreted startup, lazy hot-path compilation, validation, defaults/morphs, and JSON Schema output ([omptype guide](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/omptype-guide.md)).
- `@oh-my-pi/pi-wire` supplies collaboration protocol contracts; see n0013.

## Harness lesson

OMP places cross-platform performance and OS integration below a narrow TypeScript binding layer. Higher components still express policy in TypeScript, but avoid process-spawn overhead and inconsistent external utilities on hot paths. The TUI follows the same separation: a generic renderer below, product-specific components above.
