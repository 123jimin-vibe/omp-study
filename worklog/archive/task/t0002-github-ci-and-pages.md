+++
id = "t0002"
title = "GitHub CI and Pages deployment"
status = "done"
modifies = ["s0002"]
+++

# GitHub CI and Pages deployment

## Requested scope

The user requested GitHub CI support for the existing static site. The repository is currently private and is intended to become public. The user explicitly instructed that GitHub Pages must be assumed to be properly configured.

## Implementation checks

- GitHub Actions runs the existing JavaScript validation before Pages deployment, without building or transforming the site's runtime files.
- The workflow works without private/public visibility gates or attempts to enable or reconfigure Pages.
- Pull requests are validated without deployment privileges; deployment uses the configured Pages environment and a site-only artifact.
- Workflow validation and locally executable CI/artifact steps are exercised, with hosted-execution limits stated accurately.
- s0002 coverage and verified implementation evidence are recorded before closure.

## Verification

- `actionlint` 1.7.12 accepted `.github/workflows/site.yml` without diagnostics. The temporary validator binary was checked against the official release checksum before execution.
- `npm ci && npm run check` passed, exercising the same dependency installation and no-emit JavaScript validation commands used by CI.
- The workflow's actual staging script was executed with a POSIX shell. Its 19 output files matched the source site inputs byte-for-byte by SHA-256, with exactly `index.html`, `.nojekyll`, and `assets/` at the artifact root.
- The staged artifact was served in isolation under a subdirectory. Chromium loaded the Korean title and article, followed the article/section fragment route, and advanced the sample demo to step one. Its resource records contained no failed responses or requests outside the staged site.
- HTTP requests for repository-only paths in the served artifact returned 404: worklog configuration, package manifests, the workflow, and the development dependency directory.

## Implementation

- `.github/workflows/site.yml` validates pull requests, pushes to `main`, and manual runs.
- The `check` job runs `npm ci` and `npm run check` with Node.js 24.
- The `artifact` job requires a successful check and runs only for non-pull-request events on `main`. A fresh checkout supplies the allowlisted static files; no runtime source is generated or transformed.
- The `deploy` job requires the artifact and uses the configured `github-pages` environment. Only this job receives `pages: write` and `id-token: write`; checkout jobs have read-only repository access and do not persist credentials.
- Official actions are pinned to verified release commits. Superseded pull-request checks may be cancelled; production runs are serialized without interrupting an active deployment.
- The workflow contains no repository-visibility condition, Pages enablement/reconfiguration action, personal-token requirement, or pull-request deployment path.

## Specification coverage and limits

s0002 remains unchanged. The workflow automates its existing JavaScript-validation and build-free static-delivery contract; the implementation choices above do not establish additional spec requirements.

GitHub Pages configuration is assumed as instructed. No GitHub-hosted Actions run or live deployment was triggered; those execute after the workflow is committed and pushed.
