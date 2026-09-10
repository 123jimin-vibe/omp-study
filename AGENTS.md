# AGENTS.md

## Project

**omp-study** is an interactive guide to **harness engineering** — building the
runtime that turns a raw LLM into a capable coding agent. Deliverable: a static,
interactive website on **GitHub Pages**, covering techniques from simple
(e.g. tool-calling) to complex.

Repo: <https://github.com/123jimin-vibe/omp-study>

## Primary reference: omp

**omp** (oh-my-pi), an open-source coding agent, is the main study material.
Source <https://github.com/can1357/oh-my-pi> · Site <https://omp.sh>.
Explaining, quoting, and dissecting coding agents (omp included) is the point and
fully permitted; attribute omp material to the public source above.

Recommended: clone omp to `./local/oh-my-pi` for convenient local reading — `./local`
is gitignored, so the checkout is never committed. It's a read source only; cite omp
by the public URL or an omp-repo-relative path (e.g. `packages/coding-agent/src/...`),
never the `local/oh-my-pi/` prefix.

## Hard constraints

1. **No local paths.** Never commit an absolute or user-specific filesystem path
   (a home directory, an absolute checkout path, etc.); within this repo, use
   repo-relative paths only.
2. **Public-facing.** Repo is public; keep all committed content professional and
   citation-grounded.
3. **Internationalization-ready.** Site content and UI must be localizable without
   structural rewrites. Expected locales are English (`en`), Korean (`ko`), and
   Japanese (`ja`). For now, use Korean as the main delivery language.

## Working conventions

- **Example-driven.** Keep prose tight; "interactive" means runnable/clickable demos
  where they aid understanding, not decoration.
- **Site stack: vanilla, no build.** Plain HTML/CSS/JS (ES modules) served directly
  by GitHub Pages — no SSG, no framework, no build step. Interactive demos are vanilla JS.
- **Typed via JSDoc.** Type JS with JSDoc annotations and check with `tsc --noEmit`
  (checkJs). No `.ts` or transpile — the `.js` ships as-is; tsc only validates, so
  "no build" still holds.
