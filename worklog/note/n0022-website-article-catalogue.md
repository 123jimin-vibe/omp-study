+++
id = "n0022"
title = "Website article catalogue"
+++

# Website article catalogue

## Purpose and scope

The current 38-chapter catalogue applies the user-requested n0024/n0025 review
through t0029. n0026 records validation, qualifications, and the old-to-new map.
Nine groups remain; chapter numbering is continuous across them.

- Begin with the two reviewed LLM/interface introductions.
- Use Korean subject titles and concrete examples, with public pinned OMP sources.
- Explain the subject, purpose and mechanism before using Pi/OMP implementation
  details as case studies. Include important APIs where useful and connect shared
  concepts with contextual chapter links. t0032 expands all unreviewed 05–38.
  t0033 audits those chapters for missing actors, triggers, lifetime/scope and
  prerequisites, adds the session composition figure and instruction-source map,
  and records concrete corrections for each chapter.
- Include caching, variability, and provider constraints where they affect design.
- Groups support browsing; articles need not be read strictly in sequence.
- Preserve retained route IDs; merged chapter URLs resolve to their receiving chapter.
- Chapters 01–04 and 07 are human-reviewed. The user confirmed 03 and 04 in t0031;
  the new chapter 03 walkthrough was added afterward. Agent revision alone does not clear badges.
  In t0033 the user accepted 07 apart from the retry-case label, which was corrected.
- s0001–s0005 govern the product. This catalogue describes the approved chapter scope;
  n0023 remains authoring guidance.

## Source scope

OMP examples in chapters 03–38 refer to revision
`3f000c524cf82279f804ffd7526280cc9a5f25fe`, not an unpinned latest release.
Illustrative data and simplified protocols are labeled in the articles.

## I · LLM 기초

| # | Article | Scope |
| --- | --- | --- |
| 01 | **대규모 언어 모델** (`large-language-models`) | 입력에서 출력으로; 길이를 세는 단위, 토큰; 읽는 한도와 쓰는 한도; 반복해서 읽는 입력, 프롬프트 캐싱; 같은 질문, 다른 답변; 유창한 답변도 확인하기. |
| 02 | **메시지와 도구 호출** (`messages-and-prompts`) | 질문을 요청으로 구성하기; 한 메시지 안의 텍스트와 이미지; 메시지가 모델의 입력이 되는 형식; 이전 대화도 이번 입력에 포함하기; 파일 읽기에서 최종 답변까지; 하네스가 보존하고 통제할 것. |

## II · 핵심 런타임

| # | Article | Scope |
| --- | --- | --- |
| 03 | **코딩 에이전트와 OMP** (`coding-agents-and-omp`) | 읽고 고치고 확인하는 작업; Pi와 OMP의 패키지 구성. |
| 04 | **에이전트 루프** (`agent-loop`) | 도구를 실행한 뒤 다시 요청하기; 같은 편집 호출의 세 가지 결과; 한 응답 안의 동시 실행과 순차 실행; 계속 실행하거나 멈추는 조건. |
| 05 | **세션 런타임** (`session-runtime`) | 한 작업을 이어 가는 세션; OMP에서 세션 준비하기; 이벤트로 진행 상황 받기; 작업 중단과 세션 종료. |
| 06 | **프로젝트 지침과 프롬프트 구성** (`project-instructions-and-prompt-assembly`) | 요청에 작업의 배경을 함께 담기; 지침 파일 고르기; AGENTS.md의 문장이 요청에 들어가기; 규칙을 읽거나 자동으로 넣는 시점; 반복되는 입력을 캐시로 재사용하기. |
| 07 | **실행 복구와 개입** (`turn-recovery-and-steering`) | 실패한 작업을 어디서 이어 갈까; 실패를 분류하고 다시 시도하기; 하네스가 추가하는 메시지. |
| 08 | **도구 정의와 레지스트리** (`tool-definitions-and-registry`) | 모델에게 실행 가능한 행동 알려 주기; 도구 설명과 실행 함수 묶기; 등록된 도구 중 쓸 도구 고르기; 같은 상대 경로가 다른 파일을 읽는 이유. |
| 09 | **도구 권한** (`tool-permissions`) | 할 수 있는 일과 해도 되는 일; 기본 승인 모드와 명시적 정책; 명령 규칙과 추가 차단; 빠진 정보를 사용자에게 묻기; 정책이 검사하는 범위. |

## III · 도구와 실행

| # | Article | Scope |
| --- | --- | --- |
| 10 | **파일 읽기와 검색** (`file-reading-and-search`) | 저장소에서 필요한 근거 찾기; 아는 단서에서 조사 시작하기; 요약을 보고 필요한 원문 읽기; 많이 검색하고 적게 전달하기. |
| 11 | **파일 편집** (`file-editing`) | 기존 내용을 지키며 필요한 부분 고치기; 전체 쓰기와 부분 편집; 읽은 줄을 편집 요청으로 바꾸기; 읽은 스냅샷에 맞춰 수정하기; 생성 중 미리 보기와 적용 결과. |
| 12 | **셸 실행** (`shell-execution`) | 프로젝트의 도구로 결과 확인하기; 명령과 실행 조건; 잘린 출력과 종료 이유. |
| 13 | **백그라운드 작업과 서비스** (`background-jobs`) | 기다리는 동안 다른 일 진행하기; 끝이 있는 작업 맡기기; 이름으로 관리하는 개발 서버. |
| 14 | **Python과 JavaScript 실행** (`python-and-javascript-execution`) | 데이터를 코드로 계산하기; eval 호출과 셀 안의 함수; 두 번째 셀에서 변수 이어 쓰기; 셀에서 도구와 에이전트 부르기. |
| 15 | **AST 검색과 편집** (`ast-search-and-editing`) | 코드를 구조로 읽기; 문자열과 구문을 구별하기; 패턴으로 찾은 인자를 새 코드에 사용하기; 변경안을 확인하고 적용하기. |
| 16 | **언어 서버** (`language-servers`) | 이 이름이 가리키는 코드 찾기; 파일에 맞는 서버 연결하기; 미리 보기와 파일 변경; 현재 파일의 오류 확인하기. |
| 17 | **디버거** (`debuggers`) | 실행 중인 값으로 원인 확인하기; 디버그 어댑터 연결하기; 멈춘 위치와 변수 참조. |
| 18 | **웹 검색과 문서 가져오기** (`web-search-and-document-retrieval`) | 저장소 밖의 근거 찾아 읽기; 검색 결과에서 원문으로; 검색 조건과 읽을 범위 지정하기; 검색 조건과 실패 처리. |
| 19 | **GUI 자동화** (`browser-automation`) | 화면에서 보고 조작하며 확인하기; 브라우저 탭 열기; browser로 페이지 읽고 조작하기; 요소를 찾고 조작한 뒤 확인하기; 접근성 트리는 화면의 의미를 담습니다; computer로 창과 요소 조작하기; 사용자가 작업 중인 데스크톱 조작하기; Eval의 호출이 실제 화면에 도달하기까지. |

## IV · 모델 연동

| # | Article | Scope |
| --- | --- | --- |
| 20 | **모델 카탈로그** (`model-catalog`) | 작업에 맞는 모델 고르기; 모델 정보를 찾고 사용할 모델 고르기; 역할과 추론 수준. |
| 21 | **모델 제공자와 스트리밍** (`model-providers`) | 다른 API를 같은 루프로 사용하기; 요청과 대화 기록 변환하기; API가 지원하는 도구 형식에 맞추기; 부분 응답에서 완성된 메시지로; 텍스트 속 도구 호출 읽기. |
| 22 | **인증과 자격 증명** (`authentication-and-credentials`) | 누구의 권한으로 요청하는가; 요청에 사용할 계정 고르기; 갱신 토큰 보관하기와 대화 속 비밀값 가리기. |

## V · 컨텍스트와 저장

| # | Article | Scope |
| --- | --- | --- |
| 23 | **세션 저장과 재개** (`session-storage-and-resume`) | 대화를 저장하고 다른 선택 이어 보기; 대화 분기에 따라 달라지는 다음 요청; 완료된 메시지 저장과 재개; 조사한 내용을 보고서로 남기고 돌아가기. |
| 24 | **컨텍스트 압축** (`context-compaction`) | 작업을 이어 가기 위해 무엇을 남길까; 압축이 시작되는 때; 사용할 수 있는 압축 방식 고르기; 요약하지 않고 불필요한 결과 줄이기; 기록을 이미지로 바꾸는 SnapCompact. |
| 25 | **아티팩트와 내부 URL** (`artifacts-and-internal-urls`) | 큰 결과는 저장하고 필요한 부분만 읽기; 처음에는 일부만, 필요하면 더 읽기; 주소에 맞는 처리 코드 찾기. |
| 26 | **세션 간 메모리** (`cross-session-memory`) | 다음 대화에도 필요한 지식 남기기; 무엇을 언제 저장하는가; 새 요청에 관련 지식 넣기. |

## VI · 설정과 확장

| # | Article | Scope |
| --- | --- | --- |
| 27 | **설정과 리소스 탐색** (`settings-and-resource-discovery`) | 이번 작업에 적용된 환경 알아내기; 최종 설정값의 출처; 적용된 값과 저장 위치 확인하기; 필요한 기능 찾기. |
| 28 | **스킬과 프롬프트 템플릿** (`skills-and-prompt-templates`) | 반복하는 작업 방법을 다시 쓰기; 목록을 보고 필요한 스킬 읽기; 명령 인자를 요청 문장으로 펼치기. |
| 29 | **확장 기능과 플러그인** (`extensions-and-plugins`) | 하네스에 새로운 동작 붙이기; 도구와 이벤트 처리기 등록하기; 확장 코드의 진입점; 플러그인 설치하고 다시 불러오기. |
| 30 | **MCP 연동** (`mcp-integration`) | 외부 기능을 공통 규약으로 연결하기; 서버에 연결하고 도구 목록 받기; 원격 호출과 재연결. |

## VII · 작업 흐름과 에이전트 조정

| # | Article | Scope |
| --- | --- | --- |
| 31 | **계획 모드** (`plan-mode`) | 고치기 전에 범위와 방법 정하기; 계획 파일을 검토한 뒤 실행하기; 승인한 계획을 이어받기. |
| 32 | **목표와 작업 추적** (`goals`) | 어디까지 해야 끝난 것인가; 답변이 끝나도 목표가 남으면; 목표 만들기와 상태 확인하기; 목표를 작업 목록으로 나누기; 반복 실행하거나 다른 모델에 넘기기. |
| 33 | **하위 에이전트와 통신** (`subagents`) | 작업을 나누고 결과 합치기; 조사를 나누고 결과 받기; 끝난 에이전트를 다시 부르고 변경 가져오기. |
| 34 | **검토 에이전트** (`advisor`) | 작업을 지켜보며 놓친 문제 찾기; 누가 무엇을 검토하나; 조언을 보여 주거나 작업을 다시 시작하는 조건. |

## VIII · 인터페이스

| # | Article | Scope |
| --- | --- | --- |
| 35 | **터미널 인터페이스** (`terminal-interface`) | 실행 상태를 사람이 읽을 수 있게 보여 주기; 같은 도구 카드 갱신하기; 질문과 명령 처리하기. |
| 36 | **SDK와 외부 인터페이스** (`sdk-rpc-and-acp-interfaces`) | 다른 프로그램 안에서 에이전트 사용하기; 호스트에 맞는 연결 고르기; 요청 접수와 작업 완료 구분하기; 원격 게스트와 같은 세션 보기. |

## IX · 측정과 사례

| # | Article | Scope |
| --- | --- | --- |
| 37 | **사용량 측정과 벤치마크** (`usage-statistics`) | 하네스를 바꾼 효과를 어떻게 알까; 요청에 든 비용과 시간 확인하기; 하네스 변경을 같은 과제로 비교하기. |
| 38 | **GitHub 자동화 사례** (`github-automation-service`) | 대화형 에이전트를 자동화 서비스로 만들기; 이슈별로 작업을 저장하고 이어가기; 호스트에서 인증 정보를 보관하고 완료 여부 확인하기. |

## Consolidation decisions

- Jobs and managed services share one chapter, with separate manager/broker sections.
- Provider streaming belongs to the provider adapter; persistence belongs to sessions.
- Checkpoint/rewind belongs to session branching; SnapCompact belongs to compaction.
- Goals and todos share continuation/stop semantics; their state remains distinct.
- Peer messaging belongs to subagents; Agent Hub controls belong to the TUI.
- Browser and desktop automation share observation/action mechanics and retain
  their different lifetimes, coordinate rules, and user-control constraints.
- Collaboration is another host interface. Measurement and benchmarks form one
  comparison workflow. Native implementation belongs to search and the package map.
- Turn recovery and advisor review are standalone additions. RoboOMP closes the guide.
