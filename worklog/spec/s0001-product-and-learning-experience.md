+++
id = "s0001"
title = "Product and Learning Experience"
+++

# Product and Learning Experience

## Purpose

omp-study is an interactive guide to harness engineering: the design and
implementation of the runtime that turns a raw language model into a capable
coding agent.

## Scope

The guide MUST cover harness-engineering techniques in a progression from
foundational mechanisms, such as tool calling, to more complex agent behavior.

The guide MUST also explain cross-cutting model and provider behavior that materially
affects harness engineering, even when it does not correspond to a distinct OMP
module. Examples include prompt/token caching, response variability, resource
budgets, and result verification; connect these behaviors to concrete design choices.

## Learning experience

- Explanations SHOULD be concise and example-driven.
- Examples SHOULD make the behavior being discussed observable rather than merely naming or describing it.
- A runnable or clickable demonstration SHOULD be provided when interaction materially improves understanding of the technique.
- Interactive elements SHOULD serve an instructional purpose; decoration alone is not sufficient justification for an interaction.
- The ordering and presentation of topics SHOULD help readers connect individual mechanisms to the larger coding-agent harness.

## Teach the subject before the implementation

- Each chapter MUST explain what its topic is, the problem it solves, and why the
  capability is useful in a coding-agent harness. Readers SHOULD understand the
  mechanism without first knowing Pi/OMP class names or repository structure.
- Pi/OMP implementation details MUST support that explanation as concrete case
  studies. Identifying the responsible package, function or setting alone does
  not explain the topic.
- Explanations SHOULD connect a concrete starting situation, the mechanism's
  action and an observable result. Use helpful visualizations and comparisons to
  reveal state, information flow or consequential choices, rather than repeating
  the prose in decorative panels.
- Apply this correction throughout unreviewed chapters. Preserve the reviewed
  content of chapters 01–04 and 07 unless the user requests changes to them.
- Developer-facing capabilities SHOULD include a selective map of important
  operations/APIs and a high-level account of how calls reach their execution
  environment. Explain supporting concepts (for example accessibility trees)
  before relying on their names; naming an implementation backend is insufficient.
- Chapters SHOULD link to related explanations where prerequisites or shared
  mechanisms are used. In particular, introduce Eval and internal URLs with links
  from the chapters that use their objects or address schemes. Connections should
  explain relevance rather than form an unrelated list of further reading.
- Define harness-engineering terms at their explanatory introduction and mark
  that definition in bold exactly once per term across the site's articles.
  This typography requirement applies to all chapters, including reviewed ones.
- Audit chapters 19 onward for concepts introduced without their purpose,
  input, actor or practical consequence; a bare name or cross-link is not an
  explanation of a new mechanism.
- The compaction lesson MUST explain and visualize which request content stays
  outside ordinary history summarization, including system/project instructions
  and tool definitions, alongside summarized history and retained recent turns.
  Distinguish this policy boundary from inherent inability to compress content,
  and account for the retained prefix in the context-window budget.
