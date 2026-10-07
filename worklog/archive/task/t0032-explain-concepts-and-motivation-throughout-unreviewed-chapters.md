+++
id = "t0032"
title = "Explain concepts and motivation throughout unreviewed chapters"
modifies = ["s0001", "s0003", "s0004", "s0005"]
status = "done"
+++

# Explain concepts and motivation throughout unreviewed chapters

## Scope

The user identified an implementation-first bias across the guide. Amend every
currently unreviewed chapter (05–38): explain the topic itself, the problem it
solves, how it works and useful design tradeoffs, then connect those ideas to the
pinned Pi/OMP implementation. Add concept-level visual examples where they expose
relationships or consequential choices. Preserve reviewed 01–04, including the
just-added chapter 03 walkthrough, and preserve unreviewed flags for 05–38.

## Completion conditions

- Record the correction in n0001 and durable teaching requirements in s0001.
- Read and amend all 34 chapters, including explanations within existing sections;
  do not substitute a generic introductory paragraph for a conceptual revision.
- Keep source-backed implementation details, examples, routes and localization.
- Re-read prose for natural Korean and coherent progression; catalogue records the
  expanded scope. Verify reviewed chapters unchanged, source/section links valid,
  build, responsive visuals, interaction and print output.

## Initial state

The previous t0031 changes are already present in the worktree and belong to the
user's earlier request. A local content snapshot preserves that state for review.

## User clarifications during work

The chapter 19 example establishes the expected depth: explain important browser
and computer APIs, give a high-level execution overview beyond naming Tern, and
explain accessibility trees. Apply that depth criterion to other developer-facing
chapters. Add contextual inter-chapter references, particularly Eval and internal
URLs. These are part of the same revision, not replacement tasks.

## Outcome

Revised all 34 unreviewed chapters with definitions, concrete reasons for the
capability, conceptual explanations within existing sections and relevant
examples. Retained pinned implementation evidence as a case study. Added 35
tables/flow/comparison visuals, reusing existing interactive examples where they
already show the subject, plus 75 contextual chapter links. The additions include
189 explanatory paragraphs across the chapters; counts describe coverage rather
than editorial acceptance.

Chapter 19 now covers selective browser/computer APIs, a shipping-address example,
DOM/AX/screenshot differences, host/worker execution, Chromium/Puppeteer/CDP,
Tern/cmux and native operating-system backends. Added practical call examples and
mechanism explanations for Eval, editing, AST operations, retrieval, configuration,
extensions and goals. Browser/computer API tables use two columns so method names
remain readable on mobile. The inline renderer supports explicit local chapter
links while preserving literal text and inline code.

### Chapter coverage

Each row identifies the new conceptual starting point. Later sections were also
expanded; n0022 records all section titles, including new API sections.

| Chapter | Subject | Conceptual starting point | Contextual links |
| --- | --- | --- | --- |
| 05 | 세션 런타임 | 한 작업을 이어 가는 세션 | 2 |
| 06 | 프로젝트 지침과 프롬프트 구성 | 요청에 작업의 배경을 함께 담기 | 3 |
| 07 | 실행 복구와 개입 | 실패한 작업을 어디서 이어 갈까 | 2 |
| 08 | 도구 정의와 레지스트리 | 모델에게 실행 가능한 행동 알려 주기 | 2 |
| 09 | 도구 권한 | 할 수 있는 일과 해도 되는 일 | 2 |
| 10 | 파일 읽기와 검색 | 저장소에서 필요한 근거 찾기 | 2 |
| 11 | 파일 편집 | 기존 내용을 지키며 필요한 부분 고치기 | 2 |
| 12 | 셸 실행 | 프로젝트의 도구로 결과 확인하기 | 2 |
| 13 | 백그라운드 작업과 서비스 | 기다리는 동안 다른 일 진행하기 | 2 |
| 14 | Python과 JavaScript 실행 | 데이터를 코드로 계산하기 | 2 |
| 15 | AST 검색과 편집 | 코드를 구조로 읽기 | 2 |
| 16 | 언어 서버 | 이 이름이 가리키는 코드 찾기 | 2 |
| 17 | 디버거 | 실행 중인 값으로 원인 확인하기 | 2 |
| 18 | 웹 검색과 문서 가져오기 | 저장소 밖의 근거 찾아 읽기 | 2 |
| 19 | GUI 자동화 | 화면에서 보고 조작하며 확인하기 | 6 |
| 20 | 모델 카탈로그 | 작업에 맞는 모델 고르기 | 2 |
| 21 | 모델 제공자와 스트리밍 | 다른 API를 같은 루프로 사용하기 | 2 |
| 22 | 인증과 자격 증명 | 누구의 권한으로 요청하는가 | 2 |
| 23 | 세션 저장과 재개 | 대화를 저장하고 다른 선택 이어 보기 | 2 |
| 24 | 컨텍스트 압축 | 작업을 이어 가기 위해 무엇을 남길까 | 2 |
| 25 | 아티팩트와 내부 URL | 큰 결과는 저장하고 필요한 부분만 읽기 | 2 |
| 26 | 세션 간 메모리 | 다음 대화에도 필요한 지식 남기기 | 2 |
| 27 | 설정과 리소스 탐색 | 이번 작업에 적용된 환경 알아내기 | 2 |
| 28 | 스킬과 프롬프트 템플릿 | 반복하는 작업 방법을 다시 쓰기 | 3 |
| 29 | 확장 기능과 플러그인 | 하네스에 새로운 동작 붙이기 | 2 |
| 30 | MCP 연동 | 외부 기능을 공통 규약으로 연결하기 | 2 |
| 31 | 계획 모드 | 고치기 전에 범위와 방법 정하기 | 2 |
| 32 | 목표와 작업 추적 | 어디까지 해야 끝난 것인가 | 2 |
| 33 | 하위 에이전트와 통신 | 작업을 나누고 결과 합치기 | 2 |
| 34 | 검토 에이전트 | 작업을 지켜보며 놓친 문제 찾기 | 2 |
| 35 | 터미널 인터페이스 | 실행 상태를 사람이 읽을 수 있게 보여 주기 | 2 |
| 36 | SDK와 외부 인터페이스 | 다른 프로그램 안에서 에이전트 사용하기 | 2 |
| 37 | 사용량 측정과 벤치마크 | 하네스를 바꾼 효과를 어떻게 알까 | 2 |
| 38 | GitHub 자동화 사례 | 대화형 에이전트를 자동화 서비스로 만들기 | 3 |

## Verification and limits

- Snapshot comparison: reviewed chapters 01–04 are unchanged from the beginning
  of this task, including t0031's chapter-03 walkthrough. Routes, numbering,
  review flags and all existing section IDs are preserved.
- Source references resolve to existing paths at OMP revision
  3f000c524cf82279f804ffd7526280cc9a5f25fe; inline chapter targets exist. Checked
  new API examples against the pinned docs and implementations. Newly added JSON
  requests parse, including code strings and their embedded newlines.
- Production build and TypeScript checks pass; git diff has no whitespace errors.
- Headless Edge: all 38 routes at 1440px and 390px (76 checks), ten legacy aliases,
  no page overflow or runtime errors. All 75 inline links render; keyboard Enter
  navigation and browser Back work. Literal HTML and non-local Markdown remain
  literal, while code in a link label renders correctly.
- Exercised nine sequence examples and nineteen path examples in unreviewed
  chapters, plus existing tree/budget controls. Print hides controls and exposes
  complete alternatives. Inspected light/mobile, dark/desktop and 1920px
  presentation captures. Checked a normal mobile viewport after adjusting the
  API tables, not only full-section screenshots.
- Exported chapter 19 and 25 to PDF. Inspected rendered pages containing API
  tables, code, branching examples and full sequences; every section title is
  present in extracted PDF text. Tall figures continue across pages or move to
  the next page as required by the existing print layout.
- Re-read new Korean prose and corrected a drafting-language mismatch in the AST
  introduction before delivery. Updated n0023 with topic-depth and cross-reference
  guidance, and n0001 with the three user corrections.
- OMP calls were validated against pinned source, not run against live model
  providers, desktop apps or the illustrative checkout form. Agent review does
  not clear the human-review badges for 05–38.

## Spec reconciliation

- s0001 now records the user-requested topic-first, API/mechanism and contextual
  link requirements; the revisions implement them throughout 05–38.
- s0003 remains satisfied by public pinned sources and labeled illustrative
  examples; no machine-specific paths enter published content.
- s0004 retains Korean locale data and shared rendering. No additional language
  publication is claimed.
- s0005 retains the 38-chapter catalogue, reading modes and review state. Existing
  shared visual components and navigation remain in use. No further spec change
  is required for this task.
