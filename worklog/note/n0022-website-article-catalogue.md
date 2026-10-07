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
- Teach component responsibilities and consequential behavior, not package inventories.
- Include caching, variability, and provider constraints where they affect design.
- Groups support browsing; articles need not be read strictly in sequence.
- Preserve retained route IDs; merged chapter URLs resolve to their receiving chapter.
- Only chapters 01 and 02 are human-reviewed. Agent revision does not clear badges.
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
| 04 | **에이전트 루프** (`agent-loop`) | 한 호출이 다음 요청으로 이어지기; 같은 편집 호출의 세 가지 결과; 한 응답 안의 동시 실행과 순차 실행; 계속 실행하거나 멈추는 조건. |
| 05 | **세션 런타임** (`session-runtime`) | createAgentSession으로 세션 만들기; 이벤트로 진행 상황 받기; 작업 중단과 세션 종료. |
| 06 | **프로젝트 지침과 프롬프트 구성** (`project-instructions-and-prompt-assembly`) | 지침 파일 고르기; AGENTS.md의 문장이 요청에 들어가기; 규칙을 읽거나 자동으로 넣는 시점; 재사용할 접두부를 안정적으로 유지하기. |
| 07 | **실행 복구와 개입** (`turn-recovery-and-steering`) | 실패를 분류하고 다시 시도하기; 하네스가 추가하는 메시지. |
| 08 | **도구 정의와 레지스트리** (`tool-definitions-and-registry`) | 한 도구의 설명과 실행 함수; 등록·활성화·노출되는 도구; 같은 상대 경로가 다른 파일을 읽는 이유. |
| 09 | **도구 권한** (`tool-permissions`) | 기본 승인 모드와 명시적 정책; 명령 규칙과 추가 차단; 빠진 정보를 사용자에게 묻기; 정책이 검사하는 범위. |

## III · 도구와 실행

| # | Article | Scope |
| --- | --- | --- |
| 10 | **파일 읽기와 검색** (`file-reading-and-search`) | 아는 단서에서 조사 시작하기; 요약과 원문 범위 읽기; 검색 구현으로 이어지는 호출. |
| 11 | **파일 편집** (`file-editing`) | 전체 쓰기와 부분 편집; 읽은 스냅샷에 맞춰 수정하기; 생성 중 미리 보기와 적용 결과. |
| 12 | **셸 실행** (`shell-execution`) | 명령과 실행 조건; 잘린 출력과 종료 이유. |
| 13 | **백그라운드 작업과 서비스** (`background-jobs`) | 끝이 있는 작업 맡기기; 이름으로 관리하는 개발 서버. |
| 14 | **Python과 JavaScript 실행** (`python-and-javascript-execution`) | 두 번째 셀에서 변수 이어 쓰기; 셀에서 도구와 에이전트 부르기. |
| 15 | **AST 검색과 편집** (`ast-search-and-editing`) | 문자열과 구문을 구별하기; 제안 뒤 현재 파일에 적용하기. |
| 16 | **언어 서버** (`language-servers`) | 파일에 맞는 서버 연결하기; 미리 보기와 파일 변경; 이번 문서의 진단 받기. |
| 17 | **디버거** (`debuggers`) | 디버그 어댑터 연결하기; 멈춘 위치와 변수 참조. |
| 18 | **웹 검색과 문서 가져오기** (`web-search-and-document-retrieval`) | 검색 결과에서 원문으로; 검색 조건과 실패 처리. |
| 19 | **GUI 자동화** (`browser-automation`) | 브라우저 탭 열기; 요소를 찾고 조작한 뒤 확인하기; 데스크톱 앱과 사용자 입력 공유하기. |

## IV · 모델 연동

| # | Article | Scope |
| --- | --- | --- |
| 20 | **모델 카탈로그** (`model-catalog`) | 이름을 실행 가능한 모델로 바꾸기; 역할과 추론 수준. |
| 21 | **모델 제공자와 스트리밍** (`model-providers`) | 요청과 대화 기록 변환하기; 엔드포인트가 지원하는 도구 형식; 부분 응답에서 완성된 메시지로; 텍스트 속 도구 호출 읽기. |
| 22 | **인증과 자격 증명** (`authentication-and-credentials`) | 요청에 사용할 계정 고르기; 갱신 토큰 보관과 대화 속 비밀 처리. |

## V · 컨텍스트와 저장

| # | Article | Scope |
| --- | --- | --- |
| 23 | **세션 저장과 재개** (`session-storage-and-resume`) | 저장된 트리와 다음 요청; 완료된 메시지 저장과 재개; 탐색 분기를 보고서로 접기. |
| 24 | **컨텍스트 압축** (`context-compaction`) | 압축이 시작되는 때; 사용할 수 있는 압축 방식 고르기; 요약 없이 줄이는 결과; 기록을 이미지로 바꾸는 SnapCompact. |
| 25 | **아티팩트와 내부 URL** (`artifacts-and-internal-urls`) | 처음에는 일부만, 필요하면 더 읽기; 주소를 담당 구현으로 보내기. |
| 26 | **세션 간 메모리** (`cross-session-memory`) | 무엇을 언제 저장하는가; 새 요청에 관련 지식 넣기. |

## VI · 설정과 확장

| # | Article | Scope |
| --- | --- | --- |
| 27 | **설정과 리소스 탐색** (`settings-and-resource-discovery`) | 최종 설정값의 출처; 기능별로 찾고 활성화하기. |
| 28 | **스킬과 프롬프트 템플릿** (`skills-and-prompt-templates`) | 목록에서 필요한 본문 읽기; 명령 인자를 요청 문장으로 펼치기. |
| 29 | **확장 기능과 플러그인** (`extensions-and-plugins`) | 도구와 이벤트 처리기 등록하기; 묶어서 설치하고 다시 로드하기. |
| 30 | **MCP 연동** (`mcp-integration`) | 서버를 연결하고 도구 발견하기; 원격 호출과 재연결. |

## VII · 작업 흐름과 에이전트 조정

| # | Article | Scope |
| --- | --- | --- |
| 31 | **계획 모드** (`plan-mode`) | 계획 파일을 검토한 뒤 실행하기; 승인한 계획을 이어받기. |
| 32 | **목표와 작업 추적** (`goals`) | 답변이 끝나도 목표가 남으면; 목표를 작업 목록으로 나누기; 반복 실행과 모델 인계. |
| 33 | **하위 에이전트와 통신** (`subagents`) | 조사를 나누고 결과 받기; 수명과 작업 공간 다루기. |
| 34 | **검토 에이전트** (`advisor`) | 누가 무엇을 검토하나; 조언이 실행에 들어가는 조건. |

## VIII · 인터페이스

| # | Article | Scope |
| --- | --- | --- |
| 35 | **터미널 인터페이스** (`terminal-interface`) | 같은 도구 카드 갱신하기; 입력을 세션 동작으로 바꾸기. |
| 36 | **SDK와 외부 인터페이스** (`sdk-rpc-and-acp-interfaces`) | 호스트에 맞는 연결 고르기; 수락·턴 종료·세션 정지 구분하기; 원격 게스트와 같은 세션 보기. |

## IX · 측정과 사례

| # | Article | Scope |
| --- | --- | --- |
| 37 | **사용량 측정과 벤치마크** (`usage-statistics`) | 요청 비용과 지연 읽기; 하네스 변경을 같은 과제로 비교하기. |
| 38 | **GitHub 자동화 사례** (`github-automation-service`) | 이슈를 재개 가능한 작업으로 만들기; 인증과 완료 조건을 호스트에 두기. |

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
