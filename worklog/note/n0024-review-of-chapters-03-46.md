+++
id = "n0024"
title = "Review of chapters 03-46"
+++

# Review of chapters 03-46

Findings from t0028. The review covers every chapter marked `검토 전` (03–46) at
commit `35faa73`. omp was compared at two commits: the snapshot the chapters
cite (`3b3a6dc9`, 2026-09-10) and upstream HEAD `3f000c52` (2026-10-06), which
is about 5,800 commits later. Line-level findings and rewrites for each chapter
are in n0025.

This is a planning note. It changes neither n0022 nor any spec. The catalogue
changes proposed here need user approval before anyone acts on them.

## Verdict

The chapters are mostly accurate against the snapshot. Their weakness is
instructional, and they repeat the patterns n0023 already records. The worst
problems:

1. **Upstream has moved on.** Removing the `hub` tool leaves ch12, ch13 and ch37
   describing a tool the model no longer has. ch06, ch11, ch27, ch38 and ch39
   make claims that are no longer true at HEAD.
2. **The diagrams contradict the core lesson.** In ch09–19, 26 tool-sequence
   arrows send a tool result straight to the model, and the next `call` follows
   with no new model request. ch02, ch03 and ch06 teach that a result reaches
   the model only inside the next request.
3. **Formulaic prose.** 49 sentences end in “…해야 합니다”, 20 of them with
   “하네스” as the subject; ch01–02 have 6 in total.
   Subtitles list the section contents. Section titles switch between
   declarative and contrast forms.
4. **Some chapters do not stand alone.** Ten chapters are thin, duplicate a
   neighbour, or describe a package rather than a harness mechanism.
5. **Real harness mechanisms are missing.** Turn recovery, harness-injected
   reminders, the advisor, and cache-aware request layout are all absent.

## Catalogue structure

### Chapters that should not stand alone

| Chapter | Proposal | Reason |
| --- | --- | --- |
| 22 응답 스트리밍 | Merge into 20 | The same provider functions emit the stream. Sections 1–4 repeat ch04, ch06 and ch24. What remains (terminal-reason mapping, partial-JSON parsing, watchdogs) fits in one or two sections. |
| 28 체크포인트와 되돌리기 | Section of 24 | The code is 131 + 83 lines, built on `branchWithSummary()`. ch24 lists `branch_summary` but never shows what creates one. Half of ch28 explains what it does not restore. |
| 35 작업 추적 | Merge with 34 | It is only one tool's state machine. Todo stop-time reminders and goal continuation answer the same question: when may the agent stop? |
| 37 에이전트 간 통신 | Section of 36; Agent Hub UI → 38 | The chapter is built on the removed `hub`. Its revival and follow-up material already appears in ch36, and its `wait` material in ch12. |
| 40 사용량 통계 | Merge with 41 as “측정과 평가” | Both answer one question: did a harness change help, and at what cost? Each has two short sections. Both currently sit under “interfaces”. |
| 42 네이티브 모듈 | Short subsection of 09, plus one line in the ch03 package map | Loader, CPU variants and the version sentinel are addon packaging, not harness design. Its `grep` trace repeats ch09. |
| 43 비트맵 컨텍스트 압축 | Advanced section of 25 | SnapCompact is one of five compaction methods. The chapter never says it is second in `compaction.methodOrder` or that it needs a model that accepts images. |
| 44 실시간 협업 | Section of 39 | It is another host boundary controlling the same `AgentSession`. Link grammar and crypto parameters pad it. |
| 45 데스크톱 자동화 | Merge with 19 as GUI automation | Same structure: an Eval-hosted worker, a semantic tree versus screenshots, and untrusted screen text. ch45 uses an undefined “프리루드”. |
| 12 + 13 | Merge as “백그라운드 작업과 서비스” | At HEAD both run through one surface: `bash async` / `bash name+ready`, `proc://`, and `wait`. ch12 §3 already repeats ch13's opening. The job manager and the broker stay as separate sections. |

The reviewers disagreed on 12/13: one kept both chapters because the
mechanisms differ. The merge is preferred because the model-facing surface has
been unified. Plan mode (33) has enough distinct mechanism of its own: the
write/edit guard, `xd://propose`, plan re-injection, and subagent restrictions.
It should also explain once the mode infrastructure it shares with goals.

ch46 (RoboOMP) should stay. It is the best case study of a harness built around
omp, so make it the closing chapter rather than an entry under “specialized
components”.

### Missing from the catalogue

High priority. These existed at the snapshot unless marked otherwise.

- **Turn recovery and runtime steering.** This should be a new Core-runtime
  chapter.
  - `TurnRecovery` handles backoff, credential rotation and
    `retry.fallbackChains`, and has continuation prompts for empty, `length`,
    malformed-call, stall and unexpected stops.
  - Harness-injected messages include `<system-reminder>`/notice/interrupt
    blocks, the tool-call loop guard, and todo nudges.
  - Hard and soft tool-choice forcing (`ToolChoiceQueue`, escalation after 3
    misses) also belongs here.
  - Today ch20 covers recovery in one paragraph, and its link points to the
    wrong file.
  - Sources: `packages/coding-agent/src/session/turn-recovery.ts`,
    `docs/non-compaction-retry-policy.md`, `packages/coding-agent/src/prompts/system/`.
- **Prompt-cache-aware request layout.** Expand the existing ch05 paragraph
  into a section.
  - Covers append-only context, the date/cwd line moved out of the system
    prompt, re-declaring withdrawn tools, soft tool choice, and the volatile
    block boundary.
  - Cache warming is HEAD-only.
  - s0001 requires caching wherever it shapes design.
- **Advisor/watchdog.** This is README feature #06: a second model reviews the
  run in its own tool session and sends advice at three levels. Give it a new
  chapter in part VII. No current chapter covers it.
- **In-band tool-call dialects.** Add a section to ch20. There are 11 text
  protocols (`packages/ai/src/dialect/`). This is the most concrete
  demonstration of ch02's claim that a tool call is generated text.

Medium priority, each section-sized:

- The `ask` tool → ch08.
- Thinking-level control, auxiliary judge/smol calls, and the new roles → ch21.
- Code Mode and eval orchestration preludes → ch14/07.
- Pruning without summaries (superseded reads, image budget, `shake`) → ch25.
- `/dump`, OpenTelemetry spans and `/trace` → merged ch40/41.
- `/loop` → merged ch34/35; prewalk → ch33; vibe → ch36.

Low priority:

- Structured subagent results (`yield` + schema) → ch36.
- How slash commands are discovered and dispatched → ch38.
- The general internal-URL router → ch27.
- Export/share → ch24.

### Upstream changes since the snapshot

Claims that must change:

| Chapters | Change at HEAD |
| --- | --- |
| 12, 13, 36, 37 | `hub` was removed (f89a6db15e). The replacements are an argument-less `wait`, `read proc://`, `write proc://<id>/kill`, `write agent://<id>`, and `read history://`. |
| 13 | Services start with `bash` `{command, name, ready}`. The command is a shell string, not `application`/`args`. A live name restarts with the new spec, and restart policy is no longer offered to the model. |
| 11 | `bash` has no `env` parameter. Artifacts are capped at 16 MiB (head + tail). |
| 06 | `toolResult` messages are emitted in call order, so L76 is stale. `task.speculativeLaunch` starts work while arguments are still streaming. Live steering can deliver input mid-response. |
| 38 | The TUI components moved into `packages/tui`. TSP native rendering bypasses the differential renderer the chapter is built around. |
| 39 | Completion is `prompt_result` plus `session_settled`, not `agent_end`. The SDKs are generated (`sdk/python`, `sdk/go`, `sdk/rust`). |
| 27, 09, 42 | Internal URLs resolve through `InternalUrlFilesystem` / `pi-vfs` and are no longer materialized. New schemes: `proc://`, `cfg://`, `conflict://`, `attachment://`. |
| 05 | The cache breakpoint now sits before `<project-context>`/`<memories>`. New: `SYSTEM_TEMPLATE.md`, judged `question` rules, and rule refresh on `/new`. |
| 29, 08 | `settings-schema.ts` was deleted and replaced by per-domain `register()` and `cfg://`. Skill name collisions are now namespaced. |
| 21, 18 | New roles: `memory`, `image`, `web`, `speech`, `dictation`, `judge`. Web search follows the `web` role chain. |

New features with a home in an existing chapter:

- the `find` tool and the judgment subsystem (09, 21)
- Anthropic server-side compaction (25)
- extension `additionalContext` and ephemeral turns (31)
- `/btw` (24)
- browser Tern backend and `allowed_domains` (19)
- hashline `CUT`/`PASTE` (10)

Every cited permalink still resolves because links pin `3b3a6dc9`. Six cited
paths no longer exist at HEAD.

### Reading order

- **Part II:** 03 → 06 → 04 → 05 → [new: turn recovery and steering] → 07 → 08.
  - This removes ch04's forward references to `steer`/`followUp`, the
    transform chain, and `xd://`.
  - ch03's trace leads straight into the loop that runs it.
  - The system prompt is built during session construction, so 05 follows 04.
- **Part IV:** put the catalog (21) before providers (20). ch20 L18/L99 already
  depend on the model record, `api` and `compat`.
- **Part V:** put artifacts and internal URLs (27) before memory (26), because
  ch26 uses `memory://`. Earlier chapters (05 `rule://`, 07 `xd://`, 33
  `local://`) need a one-line forward pointer.
- **Model access after tools:** keep. No chapter in 09–19 depends on 20–23.

### Ownership of duplicated material

| Topic | Owner | Remove from |
| --- | --- | --- |
| Partial text not persisted / `message_end` boundary | 24 | 03 L128, 04 L63, 22 L419 |
| Event fan-out to UI | 04 | 03 (keep one sentence), 38 L469 |
| transformContext → convertToLlm chain | 06 | 04 L127 |
| Registered / enabled / active tool sets | 07 | 04 L77 |
| validate → hook → revalidate order | 06 | 07 L205, 08 (keep policy only) |
| Discovery, priority, dedup | 29 | 05 L16, 30 L1402/L1437, 32 L1680 |
| Snapshot tags / edit anchors | 10 | 09 §3 (introduce `[PATH#TAG]` once) |
| LSP writethrough and diagnostics | 16 | 10 L255/L261 |
| Model availability, initial model | 21 | 23 L459, 04 L73 |
| `blob:` | 24 | 27 L1047 |
| Untrusted-content rule | 02 | 19, 45 (cross-reference); add to 18 |
| Approval gap `bash.patterns` vs eval | 08 | 14 L757 (one line) |

Concepts that are used but never defined:

- context promotion (used in 21 and 25; define it in 21)
- hooks (used in 25, 29, 30, 31; define them in 31)
- TTSR (ch05 uses it before defining it)
- ACP (08, 11)
- 스냅샷 태그 (09)
- `aside` (04)

## Korean prose: recurring patterns

Counts are reviewer tallies across 03–46. Each pattern repeats a lesson already
recorded in n0001/n0023.

- **Directive sentences “…해야 합니다”: 49 in 03–46 (20 with “하네스는/가” as subject), against 6 in ch01–02.** Most
  either restate something omp already does (skip offsets, artifact notices,
  readiness states) or give advice with no basis in the source. Replace each
  with omp's actual behaviour and its consequence, or delete it.
- **Subtitles that list the contents:** almost every description, e.g. ch13
  “…준비 상태와 로그, 입력, 재시작, 종료를 이름으로 관리하는 구성 요소.”. The
  pattern is a noun stack ending in an abstract head (도구/통합/계층/장치/경계/
  런타임). This is the t0014 correction. Follow ch01's “주어진 문맥을 바탕으로
  텍스트를 생성하는 모델.”.
- **Section-title register.** Titles in 09–32 are declarative “~한다”, and 33+
  use “~하기”. About 8 titles in 03–08 are contrasts or negations (“실행 능력과
  실행 허가는 별개다”, “같은 API 이름만으로는 충분하지 않다”). ch01/02 use noun
  phrases or “-기”. 03–46 never use the section `group` markers.
- **Negative qualifications:** 38 in 03–08, against 9 in ch01–02. There are
  further clusters elsewhere, and about 6 contrasts with alternatives no one
  proposed (“대화 화면을 다시 긁는 대신”).
- **Abstract nouns used non-literally:** 경계 (≈50), 경로 (33 in 03–08), 상태,
  표면, 정체성, 내구성, 계약.
- **Hedged “~수 있습니다” where the source gives a definite rule:** 18 in 26–32
  alone, e.g. ch26 L964, whose idle and age limits are fixed numbers.
- **Literal translations:** 사전 로드 (prelude), 은행 (bank), 내구성 있는
  (durable), 결합자 (combinator), 백잉, 물질화, 파사드, 쓰기 연동 (writethrough),
  정본, 열린 범위 (open-ended), 실행 표면, 조립 지점.
- **Filler “실제”:** 27× in 03–08, 12 of them in reference labels.
- **Terminology drift:** 공급자/제공자, 컨텍스트 정리/압축, `parked`/보관 상태,
  and the name of `local://`. ch18 also uses 제공자 for search backends.
- **Wrong actor:** approval credited to `BashTool` (11); the adapter credited
  with classifying errors, which the session does (20); the goal runtime
  credited with deciding to continue “because failures remain” (34); the
  harness credited with choosing the next search (09).
- **Inconsistent prompts:** prompt boxes switch between “~해 줘”, “~한다”,
  “찾아라” and preconditions. ch02 uses “~해 줘”.

## Interactive content: recurring patterns

The reviewer rendered all 46 chapters at 1280 px and 390 px. Print, dark theme
and reduced motion were not checked.

- **Monotony.** 03–46 use 109 blocks of only three generic types: 36
  tool-sequences, 26 execution-paths and 47 exchanges. None of them is a
  purpose-built demo like those in ch01/02. Candidates for custom demos:
  - ch24 session tree, in ch02 conversation-history style
  - ch25 context occupancy, reusing ch01's context-window bar
  - ch35 task states
  - ch38 a terminal mock
  - ch43 an actual PNG frame
- **Misused exchanges.** About 32 of 47 are taxonomies, menus or pipelines
  drawn as one input fanned out. Keep an exchange only when every output comes
  from the shown input at the same time. Use a table or a numbered flow
  otherwise. At 390 px every 3-output exchange leaves an orphan third card. That
  needs a renderer fix.
- **Tool-sequence semantics.**
  - Results bypass the model request: the 26 arrows above.
  - `read` is used for edits, process runs and validation, and renders the same
    as `answer`.
  - `request` is used for SDK calls and wakeups.
  - Relay-hop padding: ch17 has 24 steps (3,628 px), and ch03, ch09, ch10 and
    ch19 each have 10–14. Keep sequences to 8 steps or fewer; ch02 uses 6.
  - Correlation chips with invented slugs appear on every step.
  - The renderer is static, with no step-through.
- **Execution-paths without alternatives.**
  - In about 11 blocks the tabs are simultaneous views or tool taxonomies
    (ch09–11, 16, 17, 19, 23–25, 28).
  - ch20 invents a path omp never takes.
  - `skipped` is misused to mean “not needed”.
  - Tab labels written as full clauses wrap at 390 px.
- **Happy path only.** Each chapter's central safeguard never changes an
  outcome on screen: edit snapshot validation, readiness timeout, job
  cancellation versus failure, the stale AST preview. Each chapter needs one
  failure case that changes the outcome.
- **Duplicated examples.** The `average.ts` loop appears in ch03, 04 and 06,
  with the request worded 7 ways. The `package.json` read appears in ch02, 07
  and 22. The event fan-out appears in ch03, 04 and 38.
- **Korean in code spans** renders in monospace with wide spacing (ch20 L21,
  ch35 L250).

## Factual errors found in passing

These were verified against the source during this review:

- ch33 L42 implies that the prompt and the guard enforce the same rule. In
  fact `enforcePlanModeWrite` is called only from write/edit, and `bash` is not
  guarded (`packages/coding-agent/src/tools/write.ts`, `plan-mode-guard.ts`).
- ch09's sequence returns tool results to the model without a model request.
  The source is not involved; this is a teaching error.

Reported by reviewers but not re-verified here. Check these in n0025 before
editing:

- ch20 attributes `disableStrictTools` to `openai-completions`.
- ch41's edit-benchmark agent has no check tool, so the traced
  verify-and-retry loop is wrong.
- ch16: `rename` applies by default.
- ch26: Mnemopi stores transcripts.
- ch32: the connection and `tools/list` are not parallel.
- ch14: the model does not send a session ID.
- ch17: merging the debugger and HTTP actors reverses causality.
- ch24 L604 says nothing is ever deleted.

## Suggested revision order

1. Get user approval for the catalogue changes: merges, new chapters, and
   reordering. Then update n0022.
2. Re-pin to a newer omp commit and rewrite the chapters with stale surfaces
   (12/13/36/37 first, then 06, 11, 27, 38, 39).
3. Fix the tool-sequence semantics and kind usage across 09–19, and convert
   misused exchanges and execution-paths.
4. Do the prose pass per chapter using n0025, starting with subtitles and
   section titles.
5. Write the new chapters.
