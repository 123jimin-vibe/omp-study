+++
id = "s0003"
title = "Content Sources and Public Quality"
+++

# Content Sources and Public Quality

## Primary source

[omp (oh-my-pi)](https://github.com/can1357/oh-my-pi) is the primary source
material and case study for the guide. Its public site is available at
[omp.sh](https://omp.sh).

The guide MAY explain, quote, and dissect omp in order to teach coding-agent
design. Claims about omp behavior or implementation MUST be grounded in the
public source and attributed where they are presented.

## Citation form

- Citations to omp SHOULD use a public URL or an omp-repository-relative path,
  such as `packages/coding-agent/src/...`.
- Citations and published content MUST NOT expose the local reference-checkout prefix `local/oh-my-pi/`.
- Explanations that simplify, generalize, or infer beyond the cited source SHOULD
  be distinguishable from direct descriptions of the source implementation.

## Public repository quality

- All committed content MUST be suitable for a public repository: professional,
  relevant to the guide, and grounded with citations where factual source claims
  are made.
- Committed files MUST NOT contain absolute filesystem paths, user-specific
  paths, or other machine-local checkout details.
- Local reference checkouts and their contents MUST NOT be committed.
