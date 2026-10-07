+++
id = "n0026"
title = "Validation and application of n0024 and n0025"
+++

# Validation and application of n0024 and n0025

## Verdict and authority

Both notes identify valid structural, instructional, and source-drift problems.
They are not a mechanically applicable patch: n0025 contains conflicting reviewer
preferences, stale proposed wording, and historical line/layout measurements.
The user explicitly requested checking and applying both notes. t0029 implements
the accepted synthesis and reconciles n0022 and s0005 within that scope.

Validation used OMP revision `3f000c524cf82279f804ffd7526280cc9a5f25fe`.
The source checkout matches that commit. Public citations use its full SHA;
this is not a claim about an unpinned latest OMP. The raw review notes remain
historical evidence. Their counts, pixel heights, line numbers and 35faa73-specific
prose examples are not current measurements or independent product requirements.

## Accepted changes

- Apply all ten catalogue consolidations, preserving manager/broker distinctions
  and retained topics as sections. Add recovery/steering and advisor chapters.
- Reorder the core loop before session orchestration, catalogue before adapters,
  and internal URLs before memory. End with measurement and the RoboOMP case study.
- Rewrite the unreviewed content around concrete inputs, actors, conditions and
  outcomes. Remove repeated definitions, generic advice, and redundant diagrams.
- Tool results return to the runtime; model-bound arrows explicitly carry the next
  request. Taxonomies use semantic tables. New sequences have at most eight steps,
  optional step controls and complete static print output. Reviewed chapter 02
  keeps its existing presentation.
- Add a selectable session tree and fixed-scale compaction comparison. Execution
  paths now compare meaningful conditions and failure cases. Mobile fan-outs stack.
- Cover ask, model roles/thinking/judge, Code Mode/preludes, pruning, dialects,
  cache layout/warming, telemetry/trace, loop/prewalk/vibe, structured child results,
  command discovery/dispatch, the URL router and export/share boundaries.
- Keep human-review markers. Add ten old-route aliases and continuous 01–38 numbers.

## Corrections and qualifications to the reviews

| Review issue | Verified disposition |
| --- | --- |
| Old hub tool and service schema | Replace with wait, proc://, agent:// and history://; named services use bash command/name/ready. Agent Hub remains a UI. |
| Separate jobs/services versus merge | Follow n0024's merge; retain AsyncJobManager and service broker as distinct mechanisms. |
| Session event fan-out: keep three versus add four | Use a narrowly named completed-message fan-out (next-request state, persistence, UI), not a catch-all list of every subscriber. Recovery events are described separately. |
| Hard/soft forcing “after 3 misses” | A missed soft requirement causes forced choice on the next attempt; the loop caps repeated forced escalations at three. It does not wait for three misses before the first escalation. |
| Hashline CUT/PASTE wording | Current syntax uses CUT and register-based PUT. Do not invent a PASTE command. |
| Strict-tool workaround | supportsStrictMode is relevant to the OpenAI-compatible example. disableStrictTools is an Anthropic compatibility option, not a universal replacement. |
| Session originals always survive compression | Branching retains old entries, but pruning can rewrite stored tool-result contents. Remove the unconditional preservation claim. |
| Remote compaction only through Responses | Supported Anthropic endpoints also have a remote path at this revision. |
| Unlimited “full output” artifacts | Retention is capped. A saved artifact may contain more than the preview without retaining every original byte. |
| Advisor is permanently read-only | Default tools are read-oriented, but WATCHDOG.yml may grant mutating built-ins under normal approval policy. A ToolSession is not an OS sandbox. |
| Advisor always wakes an idle session | Terminal-answer concerns can remain cards; blockers and agent-end reviews differ. Deliberate user interruption suppresses automatic resumption. |
| Plan mode means an OS read-only boundary | write/edit guards, active tools, child restrictions and approval policy are separate controls. |
| Eval restart transparently retries | Reset can lose kernel state; interrupted code is not promised automatic replay. |
| AST preview mismatch prevents every write | Apply may write before a stale-preview comparison reports its mismatch. Avoid a transactional guarantee. |
| LSP rename is preview-only | Rename applies by default; preview and diagnostics timing are stated explicitly. |
| Mnemopi retains only extracted facts | It retains transcript material before extraction and removes recalled memory blocks to reduce self-reinforcement. |
| MCP initialization and listing in parallel | Each server completes initialize and initialized before tools/list. Different server connections can progress independently. |
| Desktop calls queue; cancellation resets the session | Overlapping active calls fail busy; ordinary cancellation retires the run while the desktop session survives. |
| Completed-session stats and GET sync | Stats watches live transcripts; manual sync is POST /api/sync. API-equivalent costs are not necessarily bills. |
| RoboOMP “no bash” or absolute credential isolation | It has bash; selected secrets are scrubbed and the intended GitHub write path uses host tools plus gh-proxy. |
| RoboOMP “no PR without repro” as hard gate | The README attributes repro_record to persona instructions. The article distinguishes that requirement from host-enforced body, branch and test gates. |
| Optional pixel/layout prescriptions | Apply the underlying readability/interaction problem, not every competing replacement. Shorter sections no longer require the proposed large chapter groups. |

Primary evidence for these qualifications includes
[approval policy](https://github.com/can1357/oh-my-pi/blob/3f000c524cf82279f804ffd7526280cc9a5f25fe/docs/approval-mode.md),
[agent loop](https://github.com/can1357/oh-my-pi/blob/3f000c524cf82279f804ffd7526280cc9a5f25fe/packages/agent/src/agent-loop.ts),
[edit](https://github.com/can1357/oh-my-pi/blob/3f000c524cf82279f804ffd7526280cc9a5f25fe/docs/tools/edit.md),
[AST edit](https://github.com/can1357/oh-my-pi/blob/3f000c524cf82279f804ffd7526280cc9a5f25fe/docs/tools/ast-edit.md),
[compaction](https://github.com/can1357/oh-my-pi/blob/3f000c524cf82279f804ffd7526280cc9a5f25fe/docs/compaction.md),
[advisor](https://github.com/can1357/oh-my-pi/blob/3f000c524cf82279f804ffd7526280cc9a5f25fe/docs/advisor-watchdog.md),
[task lifecycle](https://github.com/can1357/oh-my-pi/blob/3f000c524cf82279f804ffd7526280cc9a5f25fe/docs/tools/task.md),
[RPC](https://github.com/can1357/oh-my-pi/blob/3f000c524cf82279f804ffd7526280cc9a5f25fe/docs/rpc.md),
[stats](https://github.com/can1357/oh-my-pi/blob/3f000c524cf82279f804ffd7526280cc9a5f25fe/packages/stats/README.md), and
[RoboOMP](https://github.com/can1357/oh-my-pi/blob/3f000c524cf82279f804ffd7526280cc9a5f25fe/python/robomp/README.md).
Each revised article provides its own additional source citations.

## Chapter disposition map

Old numbers refer to n0024/n0025, before this revision. Retained chapter routes
remain stable; removed entries resolve to the receiving chapter.

| Old | Subject / route | New | Application |
| --- | --- | --- | --- |
| 03 | 코딩 에이전트와 OMP (`coding-agents-and-omp`) | 03 | Revised prose, examples and source evidence |
| 04 | 세션 런타임 (`session-runtime`) | 05 | Revised prose, examples and source evidence |
| 05 | 프로젝트 지침과 프롬프트 구성 (`project-instructions-and-prompt-assembly`) | 06 | Revised prose, examples and source evidence |
| 06 | 에이전트 루프 (`agent-loop`) | 04 | Revised prose, examples and source evidence |
| 07 | 도구 정의와 레지스트리 (`tool-definitions-and-registry`) | 08 | Revised prose, examples and source evidence |
| 08 | 도구 권한 (`tool-permissions`) | 09 | Revised prose, examples and source evidence |
| 09 | 파일 읽기와 검색 (`file-reading-and-search`) | 10 | Revised prose, examples and source evidence |
| 10 | 파일 편집 (`file-editing`) | 11 | Revised prose, examples and source evidence |
| 11 | 셸 실행 (`shell-execution`) | 12 | Revised prose, examples and source evidence |
| 12 | 백그라운드 작업 (`background-jobs`) | 13 | Revised prose, examples and source evidence |
| 13 | 프로세스 관리 (`managed-processes`) | 13 | Merged section; legacy route alias |
| 14 | Python과 JavaScript 실행 (`python-and-javascript-execution`) | 14 | Revised prose, examples and source evidence |
| 15 | AST 검색과 편집 (`ast-search-and-editing`) | 15 | Revised prose, examples and source evidence |
| 16 | 언어 서버 (`language-servers`) | 16 | Revised prose, examples and source evidence |
| 17 | 디버거 (`debuggers`) | 17 | Revised prose, examples and source evidence |
| 18 | 웹 검색과 문서 가져오기 (`web-search-and-document-retrieval`) | 18 | Revised prose, examples and source evidence |
| 19 | 브라우저 자동화 (`browser-automation`) | 19 | Revised prose, examples and source evidence |
| 20 | 모델 제공자 (`model-providers`) | 21 | Revised prose, examples and source evidence |
| 21 | 모델 카탈로그 (`model-catalog`) | 20 | Revised prose, examples and source evidence |
| 22 | 응답 스트리밍 (`response-streaming`) | 21 | Merged section; legacy route alias |
| 23 | 인증과 자격 증명 (`authentication-and-credentials`) | 22 | Revised prose, examples and source evidence |
| 24 | 세션 저장과 재개 (`session-storage-and-resume`) | 23 | Revised prose, examples and source evidence |
| 25 | 컨텍스트 압축 (`context-compaction`) | 24 | Revised prose, examples and source evidence |
| 26 | 세션 간 메모리 (`cross-session-memory`) | 26 | Revised prose, examples and source evidence |
| 27 | 아티팩트와 내부 URL (`artifacts-and-internal-urls`) | 25 | Revised prose, examples and source evidence |
| 28 | 체크포인트와 되돌리기 (`checkpoints-and-rewind`) | 23 | Merged section; legacy route alias |
| 29 | 설정과 리소스 탐색 (`settings-and-resource-discovery`) | 27 | Revised prose, examples and source evidence |
| 30 | 스킬과 프롬프트 템플릿 (`skills-and-prompt-templates`) | 28 | Revised prose, examples and source evidence |
| 31 | 확장 기능과 플러그인 (`extensions-and-plugins`) | 29 | Revised prose, examples and source evidence |
| 32 | MCP 연동 (`mcp-integration`) | 30 | Revised prose, examples and source evidence |
| 33 | 계획 모드 (`plan-mode`) | 31 | Revised prose, examples and source evidence |
| 34 | 목표 (`goals`) | 32 | Revised prose, examples and source evidence |
| 35 | 작업 추적 (`task-tracking`) | 32 | Merged section; legacy route alias |
| 36 | 하위 에이전트 (`subagents`) | 33 | Revised prose, examples and source evidence |
| 37 | 에이전트 간 통신 (`agent-communication`) | 33 | Merged section; legacy route alias |
| 38 | 터미널 인터페이스 (`terminal-interface`) | 35 | Revised prose, examples and source evidence |
| 39 | SDK, RPC, ACP 인터페이스 (`sdk-rpc-and-acp-interfaces`) | 36 | Revised prose, examples and source evidence |
| 40 | 사용량 통계 (`usage-statistics`) | 37 | Revised prose, examples and source evidence |
| 41 | 벤치마크 (`benchmarks`) | 37 | Merged section; legacy route alias |
| 42 | 네이티브 모듈 (`native-modules`) | 10 | Merged section; legacy route alias |
| 43 | 비트맵 컨텍스트 압축 (`bitmap-context-compression`) | 24 | Merged section; legacy route alias |
| 44 | 실시간 협업 (`live-collaboration`) | 36 | Merged section; legacy route alias |
| 45 | 데스크톱 자동화 (`desktop-automation`) | 19 | Merged section; legacy route alias |
| 46 | GitHub 자동화 서비스 (`github-automation-service`) | 38 | Revised prose, examples and source evidence |

New 07 covers recovery/steering; new 34 covers advisor review. The merged GitHub
case retains the host-tool prerequisite introduced in new 36.

## Verification and limits

- TypeScript checking and production build pass.
- Content audit: 38 topics, nine groups, continuous numbers, unique section IDs,
  consistent table columns, sequences of at most eight steps, valid related links,
  only 01/02 marked reviewed. All 135 distinct new pinned OMP citation paths exist
  in the matching checkout. This is a source-path check, not remote HTTP availability.
- Headless Edge: all 38 routes at 1440px and 390px (76 page checks) without page
  errors or document overflow; ten legacy aliases reach their receiving article.
- Session branch selection, compaction selection, sequence step/all controls and
  static print visibility pass. Keyboard chapter navigation, interactive-control
  shortcut isolation and all 38 catalogue links also pass. Desktop dark/mobile light examples and 1920px
  presentation compaction were captured and visually inspected. Sequence PDF was
  generated to exercise browser printing.
- Reviewed 01/02 content is unchanged; the generic mobile exchange correction also
  applies to their existing examples. No deployment or upstream OMP execution is
  implied by these checks. OMP examples are source-verified teaching material,
  not an integration test against live model providers or connected services.
- s0001–s0004 retain their requirements; s0005 updates only the approved catalogue
  counts, order and added coverage. Raw reviewer wording is superseded by this
  disposition record and the implemented articles, not silently rewritten.
