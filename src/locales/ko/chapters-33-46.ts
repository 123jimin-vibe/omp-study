import type { Topic } from '../../content.ts';

const source = 'https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec';

const planModeTopic: Topic = {
  id: 'plan-mode',
  number: '33',
  title: '계획 모드',
  description: '코드를 바꾸기 전에 조사, 계획 작성, 사람의 승인을 별도 단계로 묶는 실행 정책.',
  sections: [
    {
      id: 'read-only-planning',
      title: '작업 트리를 그대로 둔 채 조사하기',
      blocks: [
        {
          kind: 'paragraph',
          text: '계획 모드는 계획용 프롬프트와 도구 정책을 함께 바꾸는 세션 상태입니다. OMP는 세션에 `enabled`, `planFilePath`, 작업 방식 같은 계획 모드 상태를 두고, 이 상태를 도구 실행에도 적용합니다. 모델은 파일을 읽고 검색하거나 조사용 하위 에이전트를 부를 수 있지만, 작업 트리를 바꾸는 쓰기·편집은 실행 전에 거부됩니다.',
        },
        {
          kind: 'exchange',
          input: {
            label: '주어진 상태',
            text: '사용자: “인증 모듈을 비동기 API로 옮길 계획을 세워 줘.”\n계획 파일: `local://auth-plan.md`',
          },
          outputs: [
            {
              label: '허용되는 조사',
              text: '`read`와 검색으로 호출 지점을 확인하고, 읽기 전용 하위 에이전트에게 영향 범위를 나눠 조사시킵니다.',
            },
            {
              label: '허용되는 기록',
              text: '세션의 `local://` 아티팩트 공간에 초안을 쓰고 고칩니다. 이 공간은 작업 트리와 분리된 계획용 저장소입니다.',
            },
            {
              label: '차단되는 실행',
              text: '`src/auth.ts` 편집이나 파일 삭제를 시도하면 계획 모드 가드가 거부합니다. 코드 변경은 아직 시작되지 않습니다.',
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '세션은 계획 모드에 들어갈 때 전용 지침을 대화에 넣고, 설정되어 있다면 `plan` 역할의 모델로 전환합니다. 계획 제출에 필요한 내장 `write`는 활성화하되, 작업 트리 쓰기는 가드가 막고 `local://` 초안과 `xd://propose` 제출만 통과시킵니다. 프롬프트와 실제 도구 정책이 같은 경계를 가리켜야 모델의 실수도 실행 단계에서 멈출 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 계획 모드 상태', href: `${source}/packages/coding-agent/src/plan-mode/state.ts` },
            { text: 'OMP · 계획 모드의 쓰기 경계', href: `${source}/packages/coding-agent/src/tools/plan-mode-guard.ts` },
            { text: 'OMP · 계획 모드 진입과 도구·모델 전환', href: `${source}/packages/coding-agent/src/modes/interactive-mode.ts#L3112-L3427` },
          ],
        },
      ],
    },
    {
      id: 'approval-and-handoff',
      title: '계획을 승인한 뒤 실행으로 넘기기',
      blocks: [
        {
          kind: 'paragraph',
          text: '조사를 마친 모델은 완성한 마크다운 계획을 `local://<slug>-plan.md`에 저장하고 승인을 요청합니다. 대화형 화면은 계획 본문을 보여 주고 실행, 문맥 압축 후 실행, 수정 요청, 저장 후 종료 같은 다음 행동을 사람이 고르게 합니다. 계획 파일이 없으면 승인 절차는 시작되지 않습니다.',
        },
        {
          kind: 'execution-path',
          title: '같은 초안에서 갈라지는 승인 결과',
          input: {
            label: '검토할 계획',
            text: '`auth-plan.md`: 호출부 조사 → 인터페이스 변경 → 마이그레이션 → 테스트',
          },
          labels: { choose: '검토 결과' },
          paths: [
            {
              label: '수정 요청',
              stages: [
                { label: '피드백 기록', text: '“롤백 절차와 호환성 테스트를 추가해 줘.”', state: 'complete' },
                { label: '계획 모드 유지', text: '작업 트리는 계속 읽기 전용이고 모델이 같은 계획 파일을 고칩니다.', state: 'complete' },
                { label: '코드 실행', text: '아직 승인되지 않았으므로 실행하지 않습니다.', state: 'skipped' },
              ],
              result: { label: '결과', text: '보강된 계획을 다시 검토합니다.' },
            },
            {
              label: '승인하고 실행',
              stages: [
                { label: '계획 확정', text: '승인한 파일 경로와 본문을 실행 참조로 보존합니다.', state: 'complete' },
                { label: '모드 종료', text: '계획 모드의 도구·모델 구성을 원래 실행 구성으로 되돌립니다.', state: 'complete' },
                { label: '실행 시작', text: '승인된 계획을 문맥에 넣고 파일 편집과 검증을 허용합니다.', state: 'complete' },
              ],
              result: { label: '결과', text: '승인 경계 뒤에서만 작업 트리가 바뀝니다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '승인된 계획은 실행 참조로 남습니다. 세션은 계획 경로를 기억하고, 새 세션이나 압축처럼 대화 기록을 다시 만들 때 계획 본문과 복구 경로를 한 번 다시 넣습니다. 실행을 하위 에이전트에게 넘길 때도 같은 승인된 계획을 전달할 수 있습니다. 하네스는 계획의 “승인 여부”, 현재 도구 정책, 실행자가 보는 참조가 서로 어긋나지 않게 유지해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 승인할 계획 파일 해석', href: `${source}/packages/coding-agent/src/plan-mode/approved-plan.ts` },
            { text: 'OMP · 계획 검토와 실행 선택', href: `${source}/packages/coding-agent/src/modes/interactive-mode.ts#L4800-L4915` },
            { text: 'OMP · 승인된 계획의 세션 재주입', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L5857-L5884` },
            { text: 'OMP · 하위 에이전트로 계획 넘기기', href: `${source}/packages/coding-agent/src/plan-mode/plan-handoff.ts` },
          ],
        },
      ],
    },
  ],
};

const goalsTopic: Topic = {
  id: 'goals',
  number: '34',
  title: '목표',
  description: '여러 턴에 걸친 목적과 사용량을 세션에 붙여 자율 실행의 종료 조건을 관리하는 장치.',
  sections: [
    {
      id: 'goal-state',
      title: '목적과 실행 상태를 한 기록으로 묶기',
      blocks: [
        {
          kind: 'paragraph',
          text: '목표는 한 턴의 요청보다 오래 유지되는 세션 제어 기록입니다. OMP의 목표에는 `objective`, 상태, 선택적인 토큰 예산, 누적 토큰과 경과 시간이 들어갑니다. 활성 목표가 있으면 런타임은 목표 문맥을 모델 요청에 넣고 `goal` 제어 도구를 활성화합니다. 모델은 이 도구로 현재 목표를 읽거나 완료할 수 있습니다.',
        },
        {
          kind: 'exchange',
          input: {
            label: '`goal create`',
            text: '목적: “세 테스트가 모두 통과할 때까지 캐시 무효화 오류를 찾아 수정한다.”\n토큰 예산: `20000`',
          },
          outputs: [
            {
              label: '목표 기록',
              text: '`status: active` · `tokensUsed: 0` · 시작 시각을 가진 고유 목표가 생깁니다.',
            },
            {
              label: '세션 제어',
              text: '다음 요청마다 목적과 남은 예산을 모델이 볼 수 있고, 턴이 끝나도 목표가 활성 상태면 후속 실행을 이어 갈 수 있습니다.',
            },
            {
              label: '완료 경계',
              text: '세 테스트의 실행 결과를 확인한 뒤 모델이 `goal complete`를 호출해야 목표가 `complete`로 닫힙니다.',
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '`goal` 도구의 연산은 `create`, `get`, `complete`, `resume`, `drop`입니다. 끝나지 않은 목표가 이미 있으면 새 목표를 만들 수 없고, 일시 중지한 목표는 다시 시작할 수 있습니다. `drop`은 목적을 포기하고 기록을 제거하는 선택이며, `complete`는 목적을 달성했다는 종료 신호와 최종 사용량 보고를 남깁니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 목표 데이터와 상태', href: `${source}/packages/coding-agent/src/goals/state.ts` },
            { text: 'OMP · goal 제어 도구', href: `${source}/packages/coding-agent/src/goals/tools/goal-tool.ts` },
            { text: 'OMP · 목표 모드 진입과 도구 활성화', href: `${source}/packages/coding-agent/src/modes/interactive-mode.ts#L3563-L3608` },
          ],
        },
      ],
    },
    {
      id: 'accounting-and-continuation',
      title: '진행을 확인하고 계속할지 결정하기',
      blocks: [
        {
          kind: 'paragraph',
          text: '목표 런타임은 턴 시작의 사용량을 기준으로 입력·출력·캐시 쓰기 토큰 증가분을 계산하고, 도구 완료와 턴 종료 경계에서 누적합니다. 재사용한 접두부인 캐시 읽기 토큰은 이 예산에서 제외합니다. 동시에 활성 목표에 쓴 벽시계 시간도 더합니다. 선택한 예산에 도달하면 상태를 `budget-limited`로 바꾸고 모델에게 정리할 시점임을 알립니다. 예산을 늘리거나 해제하면 다시 활성 상태로 돌아갈 수 있습니다.',
        },
        {
          kind: 'tool-sequence',
          title: '목표가 다음 턴을 이어 가는 기준',
          prompt: '캐시 무효화 오류를 고치고 세 테스트를 모두 통과시킨다.',
          actors: ['모델', '목표 런타임', '도구와 테스트'],
          events: [
            { from: 1, to: 0, kind: 'request', label: '목표 문맥', detail: '목적 · 현재 상태 · 누적 사용량 · 남은 토큰 예산' },
            { from: 0, to: 2, kind: 'call', label: '조사와 수정', detail: '파일을 읽고 편집한 뒤 대상 테스트 실행' },
            { from: 2, to: 1, kind: 'result', label: '진행 결과', detail: '두 테스트 통과, 한 테스트 실패\n이번 턴의 토큰·시간 사용량' },
            { from: 1, to: 0, kind: 'request', label: '계속 실행', detail: '목표가 아직 `active`이고 실패가 남아 있으므로 다음 턴에 목적을 다시 제공' },
            { from: 0, to: 2, kind: 'call', label: '남은 오류 수정', detail: '실패 원인을 고치고 세 테스트 재실행' },
            { from: 2, to: 0, kind: 'result', label: '완료 근거', detail: '테스트 러너가 세 테스트의 통과를 보고' },
            { from: 0, to: 1, kind: 'answer', label: '`goal complete`', detail: '목표를 완료하고 최종 토큰·시간 보고 생성' },
          ],
        },
        {
          kind: 'paragraph',
          text: '사용자가 실행을 중단하면 활성 목표는 `paused`로 바뀝니다. 이렇게 해야 다음 세션 재개가 사용자 개입을 무시하고 자동 실행을 시작하지 않습니다. 목표는 “무엇을 끝낼 것인가”와 계속 실행할 권한을 관리하고, 다음 장의 할 일 목록은 “어떤 단계를 지나고 있는가”를 기록합니다. 하네스는 두 상태를 섞지 않아야 목표 완료와 개별 작업 완료를 각각 판단할 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 사용량 집계와 예산 전환', href: `${source}/packages/coding-agent/src/goals/runtime.ts` },
            { text: 'OMP · 목표 관리 명령과 재개', href: `${source}/packages/coding-agent/src/modes/interactive-mode.ts#L4470-L4775` },
            { text: 'OMP · 목표 문맥을 모델 요청에 연결', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L5927-L5947` },
          ],
        },
      ],
    },
  ],
};

const taskTrackingTopic: Topic = {
  id: 'task-tracking',
  number: '35',
  title: '작업 추적',
  description: '할 일을 단계와 상태로 기록해 다음 행동과 막힌 이유를 모델과 사용자에게 함께 보여 주는 목록.',
  sections: [
    {
      id: 'phases-and-operations',
      title: '단계, 작업, 한 번의 변경',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP의 `todo`는 세션 안에 단계와 작업을 저장합니다. 작업 상태는 `pending`, `in_progress`, `completed`, `abandoned`, `blocked` 중 하나입니다. 모델은 한 번의 도구 호출에서 `init`, `start`, `done`, `drop`, `block`, `unblock`, `append`, `rm`, `view` 가운데 하나를 적용합니다.',
        },
        {
          kind: 'code',
          language: 'json',
          caption: '조사와 수정 단계를 만드는 `todo init` 호출',
          code: `{
  "op": "init",
  "list": [
    { "phase": "조사", "items": ["실패 재현", "캐시 키 추적"] },
    { "phase": "수정", "items": ["무효화 조건 수정", "회귀 테스트 실행"] }
  ]
}`,
        },
        {
          kind: 'paragraph',
          text: '초기화 뒤에는 목록 순서상 첫 작업인 “실패 재현”만 `in_progress`가 되고 나머지는 `pending`입니다. 다른 작업을 `start`하면 기존 진행 작업은 다시 대기 상태가 됩니다. 런타임이 동시에 진행 중인 작업을 하나로 정규화하므로, 모델과 화면이 서로 다른 “현재 작업”을 가리키지 않습니다.',
        },
        {
          kind: 'paragraph',
          text: '작업과 단계의 이름은 이후 호출에서 식별자로 쓰이므로 정확한 문자열로 참조합니다. 변경 중 대상을 찾지 못하거나 중복 작업을 추가하면 그 호출의 변경 전체를 버리고 이전 목록을 유지합니다. 하네스가 부분 적용을 남기지 않기 때문에 모델은 오류를 본 다음 올바른 대상을 다시 조회해 한 번에 고칠 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · todo 입력, 상태, 원자적 변경', href: `${source}/docs/tools/todo.md#inputs` },
            { text: 'OMP · todo 구현', href: `${source}/packages/coding-agent/src/tools/todo.ts` },
          ],
        },
      ],
    },
    {
      id: 'blocking-and-resume',
      title: '막힌 이유를 남기고 다음 일을 고르기',
      blocks: [
        {
          kind: 'paragraph',
          text: '작업을 진행할 수 없을 때는 `block`으로 대상과 이유를 함께 기록합니다. 예를 들어 “캐시 키 추적”이 외부 서비스의 샘플 응답을 기다린다면, 이유를 한 줄로 남기고 “무효화 조건 수정”을 계속할 수 있습니다. 모든 열린 작업이 막혔을 때만 진행 중인 작업이 없는 목록이 됩니다.',
        },
        {
          kind: 'exchange',
          input: {
            label: '변경 전',
            text: '`캐시 키 추적` · `in_progress`\n`무효화 조건 수정` · `pending`',
          },
          outputs: [
            {
              label: '`block` 적용',
              text: '`캐시 키 추적` → `blocked`\n이유: “스테이징 응답 샘플 대기”',
            },
            {
              label: '정규화된 다음 작업',
              text: '`무효화 조건 수정` → `in_progress`\n막힌 작업을 건너뛰고 실행 가능한 첫 작업을 선택',
            },
            {
              label: '입력 도착 뒤',
              text: '`unblock`은 막힌 작업을 `pending`으로 되돌리고 이유를 지웁니다.',
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '성공한 `todo` 결과에는 전체 단계와 작업 상태가 들어갑니다. 세션은 이 결과를 캐시에 반영하고 터미널은 같은 자료로 목록을 갱신합니다. 완료·포기한 항목을 잠시 뒤 화면에서 숨기는 기능은 표시만 정리하며 세션의 정본 목록을 바꾸지 않습니다. 세션을 다시 열 때는 기록된 도구 결과에서 열린 작업을 복원하므로, 저장할 상태와 화면에 보일 상태를 따로 다뤄야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 차단·해제와 상태 정규화', href: `${source}/docs/tools/todo.md#flow` },
            { text: 'OMP · 세션 기록과 화면 표시의 경계', href: `${source}/docs/tools/todo.md#side-effects` },
          ],
        },
      ],
    },
  ],
};

const subagentsTopic: Topic = {
  id: 'subagents',
  number: '36',
  title: '하위 에이전트',
  description: '독립된 자식 세션에 역할과 문맥을 주고 병렬 작업의 결과를 부모에게 회수하는 실행 장치.',
  sections: [
    {
      id: 'definitions-and-child-sessions',
      title: '역할 정의에서 자식 세션까지',
      blocks: [
        {
          kind: 'paragraph',
          text: '`task` 도구는 에이전트 정의를 찾고, 요청한 역할의 모델·도구·출력 스키마를 골라 새 `AgentSession`을 만듭니다. 프로젝트의 `.omp/agents`, 사용자 에이전트, 플러그인, 번들 에이전트 순으로 같은 이름의 정의를 찾습니다. 부모가 넘긴 `task`는 자식의 구체적인 작업이고, 배치 모드의 `context`는 그 호출에서 만든 모든 자식이 공유할 배경입니다.',
        },
        {
          kind: 'paragraph',
          text: '자식은 부모의 전체 대화 기록을 복사하지 않습니다. 작업 공간과 컨텍스트 파일, 스킬, 공유 `local://` 아티팩트, 명시적으로 넘긴 배경, 승인된 계획처럼 필요한 경계만 이어받습니다. 이 구분은 긴 부모 대화가 모든 자식의 입력을 부풀리는 일을 막고, 각 자식에게 무엇을 알려 줬는지 확인할 수 있게 합니다.',
        },
        {
          kind: 'tool-sequence',
          title: '두 조사를 병렬로 맡기고 결과를 회수하기',
          prompt: '배치·비동기 실행이 켜져 있다.\n공통 배경: 캐시 회귀를 조사한다.\n작업 A: 무효화 코드 추적. 작업 B: 회귀 테스트 범위 검토.',
          actors: ['부모 에이전트', '`task`·`hub` 조정 계층', '자식 세션 A·B'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '배치 요청', detail: '공통 `context`와 서로 독립적인 `tasks[]` 두 개' },
            { from: 1, to: 2, kind: 'request', label: '세션 두 개 생성', detail: '각 역할의 모델·도구를 선택하고 고유 에이전트 ID와 기록 파일 배정' },
            { from: 2, to: 1, kind: 'result', label: '진행과 산출물', detail: 'A는 호출 관계, B는 빠진 테스트를 보고\n전체 출력은 각각 `agent://<id>`에 저장' },
            { from: 1, to: 0, kind: 'result', label: '완료 전달', detail: '요약·사용량·종료 상태를 부모 대화에 비동기로 주입' },
            { from: 0, to: 1, kind: 'call', label: '필요한 후속 질문', detail: '새 자식을 만들지 않고 기존 에이전트 ID를 지정' },
            { from: 1, to: 2, kind: 'request', label: '`hub` 전달', detail: '메시지를 해당 자식의 기존 대화에 주입' },
          ],
        },
        {
          kind: 'paragraph',
          text: '비동기 실행이 켜져 있으면 자식 하나마다 백그라운드 작업이 생기고 `task` 호출은 곧바로 ID를 반환합니다. 자식은 숨겨진 `yield` 도구로 최종 결과를 넘기며, 부모는 짧은 미리보기와 `agent://` 전체 출력, `history://` 대화 기록을 받습니다. 동시 실행 수, 재귀 깊이, 요청 예산, 벽시계 제한은 부모 세션의 런타임이 강제합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · task 입력과 자식 세션 실행', href: `${source}/docs/tools/task.md` },
            { text: 'OMP · 에이전트 정의 탐색과 우선순위', href: `${source}/docs/task-agent-discovery.md` },
            { text: 'OMP · 자식 세션 생성기', href: `${source}/packages/coding-agent/src/task/executor.ts` },
          ],
        },
      ],
    },
    {
      id: 'isolation-and-lifecycle',
      title: '작업 공간 분리와 자식의 수명',
      blocks: [
        {
          kind: 'paragraph',
          text: '격리 실행을 요청하면 OMP는 Git 저장소의 별도 작업 공간에서 자식을 실행합니다. 백엔드가 만든 복제·오버레이·작업 트리에서 변경분을 모은 뒤 패치로 적용하거나 임시 브랜치의 커밋을 부모 쪽에 합칩니다. 이 기능은 같은 파일을 고치는 병렬 작업끼리 충돌을 줄입니다. 보안 격리가 필요하면 네트워크·자격 증명·호스트 접근을 별도로 제한해야 합니다.',
        },
        {
          kind: 'execution-path',
          title: '자식 작업을 원래 작업 공간에 반영하는 두 방식',
          input: { label: '자식의 변경', text: '`src/cache.ts` 수정 + `cache.test.ts` 추가' },
          labels: { choose: '병합 방식' },
          paths: [
            {
              label: '패치 방식',
              stages: [
                { label: '변경 수집', text: '격리 작업 공간과 기준 상태의 차이를 패치로 만듭니다.', state: 'complete' },
                { label: '적용 검사', text: '부모 작업 공간에 패치를 적용할 수 있는지 확인합니다.', state: 'complete' },
                { label: '충돌', text: '적용할 수 없으면 패치 아티팩트를 남기고 자동 반영을 멈춥니다.', state: 'blocked' },
              ],
              result: { label: '결과', text: '성공한 패치만 부모 작업 공간에 들어갑니다.' },
            },
            {
              label: '브랜치 방식',
              stages: [
                { label: '자식 커밋', text: '`omp/task/<id>` 브랜치에 변경을 커밋합니다.', state: 'complete' },
                { label: '부모 상태 보존', text: '부모의 미커밋 변경을 임시 보관한 뒤 자식 커밋을 가져옵니다.', state: 'complete' },
                { label: '복원', text: '부모 변경을 되돌려 놓고 충돌 정보를 별도로 보고합니다.', state: 'complete' },
              ],
              result: { label: '결과', text: '자식 커밋과 부모의 기존 변경을 함께 보존합니다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '일반 자식은 완료 뒤 잠시 `idle`로 남아 후속 메시지를 받을 수 있고, 유휴 제한이 지나면 기록만 남긴 `parked` 상태가 됩니다. 메시지를 보내면 기록에서 세션을 다시 열 수 있습니다. 격리 자식은 작업 공간을 정리한 뒤 되살릴 수 없으므로, 결과와 대화 기록만 조회합니다. 하네스는 “완료 결과가 보존됨”과 “같은 실행 인스턴스를 다시 깨울 수 있음”을 구분해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 격리 작업 공간과 변경 회수', href: `${source}/packages/coding-agent/src/task/isolation-runner.ts` },
            { text: 'OMP · 자식 수명과 제한', href: `${source}/docs/tools/task.md#limits--caps` },
          ],
        },
      ],
    },
  ],
};

const agentCommunicationTopic: Topic = {
  id: 'agent-communication',
  number: '37',
  title: '에이전트 간 통신',
  description: '실행 중이거나 보관된 에이전트를 주소로 삼아 메시지, 깨우기, 완료 신호를 전달하는 조정 계층.',
  sections: [
    {
      id: 'mailboxes-and-wakeups',
      title: 'ID로 메시지를 보내고 필요한 세션을 깨우기',
      blocks: [
        {
          kind: 'paragraph',
          text: '`hub`의 메시지 기능은 프로세스 전체의 에이전트 레지스트리와 우편함 버스를 사용합니다. `list`로 상대의 ID와 `running`, `idle`, `parked`, `aborted` 상태를 확인하고, `send`로 한 에이전트나 모든 활성 동료에게 메시지를 보냅니다. 직접 메시지를 받은 보관 상태의 에이전트는 세션 기록에서 되살아납니다.',
        },
        {
          kind: 'tool-sequence',
          title: '부모의 질문이 보관된 자식의 답으로 돌아오기까지',
          prompt: '`CacheScout`에게 “이 수정이 TTL=0 경계도 다루는지 확인해 줘.”라고 묻는다.',
          actors: ['부모 에이전트', '`hub`와 수명 관리자', '`CacheScout`'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '`send`', detail: '수신자 ID와 질문, 선택적인 `replyTo` 전달' },
            { from: 1, to: 2, kind: 'request', label: '세션 깨우기', detail: 'parked 기록을 다시 열고 메시지를 자식 대화에 주입' },
            { from: 2, to: 1, kind: 'answer', label: '후속 조사', detail: '기존 문맥에서 TTL=0 테스트를 확인하고 답장' },
            { from: 1, to: 0, kind: 'result', label: '우편함 전달', detail: '부모가 실행 중이면 비중단 알림으로 넣고, 기다리는 중이면 `wait`를 해제' },
          ],
        },
        {
          kind: 'paragraph',
          text: '`wait`는 메시지와 부모가 소유한 백그라운드 작업 완료를 함께 기다립니다. 먼저 도착한 메시지가 있으면 작업은 계속 실행되고, 작업 하나가 끝나거나 대기 창이 지나면 최신 작업 상태를 돌려줍니다. 완료 알림과 사람의 새 지시가 경쟁할 때 하나의 대기 지점에서 순서를 정하므로, 폴링 사이에 메시지를 잃지 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · hub 메시지와 통합 대기', href: `${source}/docs/tools/hub.md` },
            { text: 'OMP · 에이전트 우편함 버스', href: `${source}/packages/coding-agent/src/irc/bus.ts` },
            { text: 'OMP · 에이전트 레지스트리와 수명', href: `${source}/packages/coding-agent/src/registry/agent-lifecycle.ts` },
          ],
        },
      ],
    },
    {
      id: 'agent-hub-interface',
      title: 'Agent Hub에서 실행을 읽고 조정하기',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Agent Hub는 사람이 같은 조정 정보를 보는 터미널 화면입니다. 목록은 에이전트의 부모·자식 관계, 현재 상태, 맡은 작업, 모델, 마지막 활동, 토큰·요청·도구 호출 사용량을 보여 줍니다. 값이 없는 사용량은 추정하지 않고 비어 있다고 표시합니다.',
        },
        {
          kind: 'exchange',
          input: { label: '선택한 에이전트', text: '`CacheScout` · `parked` · 읽지 않은 메시지 1개' },
          outputs: [
            { label: '대화 읽기', text: '`history://CacheScout`에 해당하는 저장된 대화를 열어 조사 근거와 마지막 도구 결과를 확인합니다.' },
            { label: '다시 실행', text: '`r` 또는 메시지 전송으로 세션을 되살린 뒤, 편집기에서 후속 요청을 보냅니다.' },
            { label: '종료', text: '실행 중인 턴을 중단한 뒤 에이전트를 제거합니다. 이후에는 같은 인스턴스로 작업을 이어 갈 수 없습니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '에이전트를 열면 메인 터미널의 대화·상태선·편집기가 그 자식 세션을 가리킵니다. 그곳에서 보낸 메시지는 자식 기록에 남고, `Esc`는 자식을 중단하는 대신 메인 세션으로 돌아옵니다. 실행 제어와 화면 초점을 분리해야 관찰하려고 연 작업을 실수로 취소하지 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · Agent Hub의 목록과 제어', href: `${source}/docs/agent-hub.md` },
          ],
        },
      ],
    },
  ],
};

const terminalInterfaceTopic: Topic = {
  id: 'terminal-interface',
  number: '38',
  title: '터미널 인터페이스',
  description: '에이전트 이벤트를 대화 기록, 편집기, 도구 카드로 바꾸고 달라진 화면만 다시 그리는 터미널 계층.',
  sections: [
    {
      id: 'components-input-and-focus',
      title: '실행 상태를 터미널 구성 요소로 보여 주기',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP의 터미널 화면은 두 층으로 나뉩니다. `packages/tui`는 구성 요소 렌더링, 키 입력, 초점, 오버레이, 커서 배치를 맡습니다. `packages/coding-agent`는 모델 응답과 도구 이벤트를 대화 블록으로 만들고 편집기·상태선·도구별 렌더러를 이 엔진에 연결합니다. 에이전트 실행 상태를 터미널 제어 코드와 분리하므로 같은 세션을 SDK나 RPC에서도 실행할 수 있습니다.',
        },
        {
          kind: 'exchange',
          input: {
            label: '세션 이벤트',
            text: '`message_update`로 텍스트 조각 도착\n`tool_execution_start`로 `grep` 시작\n`tool_execution_end`로 검색 결과 완료',
          },
          outputs: [
            {
              label: '대화 구성 요소',
              text: '생성 중인 텍스트를 갱신하고 완료한 문장은 스크롤 기록으로 넘깁니다.',
            },
            {
              label: '도구 구성 요소',
              text: '`renderCall`과 `renderResult`가 같은 호출을 진행·완료 상태의 카드로 표시합니다.',
            },
            {
              label: '입력과 초점',
              text: '편집기나 오버레이 중 초점을 가진 구성 요소에만 키 입력을 보내고, 커서 표식을 실제 터미널 커서 위치로 바꿉니다.',
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '모든 구성 요소는 `render(width)`로 터미널 행을 반환합니다. 입력을 받는 구성 요소는 `handleInput`을 구현하고, 타이머나 감시자를 소유하면 `dispose`에서 정리합니다. 확장 UI는 편집기 영역을 잠시 바꾸거나 오버레이로 올라오며, `done(result)`를 호출해야 원래 편집기와 초점이 복원됩니다. 헤드리스 모드에서는 이런 UI가 없으므로 확장은 `hasUI`를 확인해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · TUI 구성 요소와 통합 계약', href: `${source}/docs/tui.md` },
            { text: 'OMP · 도구 실행 구성 요소', href: `${source}/packages/coding-agent/src/modes/components/tool-execution.ts` },
          ],
        },
      ],
    },
    {
      id: 'differential-rendering',
      title: '확정된 기록과 바뀌는 화면을 따로 그리기',
      blocks: [
        {
          kind: 'paragraph',
          text: '터미널의 위쪽 스크롤 기록과 현재 화면은 갱신 규칙이 다릅니다. 애플리케이션은 확정된 행을 단조 증가하는 ID의 `HistoryBatch`로 보내고, 렌더러는 이를 한 번 기록한 뒤 확인 응답을 돌려줍니다. 아직 생성 중인 답변, 편집기, 상태선, 오버레이는 교체 가능한 `viewport`에 남습니다.',
        },
        {
          kind: 'tool-sequence',
          title: '스트리밍 답변 한 줄을 안전하게 갱신하기',
          prompt: '현재 답변: “원인은 캐시…” 뒤에 텍스트가 계속 도착한다.',
          actors: ['대화 컨테이너', 'TUI 렌더러', '터미널'],
          events: [
            { from: 0, to: 1, kind: 'request', label: '프레임 계획', detail: '완료한 앞 문장 = `history`\n열린 마지막 문장 = `viewport`' },
            { from: 1, to: 2, kind: 'call', label: '기록 추가', detail: '새 `history` ID의 행을 한 번만 출력' },
            { from: 1, to: 0, kind: 'result', label: '기록 확인', detail: 'TUI가 쓰기를 끝낸 배치 ID를 대화 컨테이너에 확인해 중복 출력을 막음' },
            { from: 1, to: 2, kind: 'call', label: '차이 갱신', detail: '이전 `viewport`와 달라진 행만 다시 씀' },
            { from: 0, to: 1, kind: 'request', label: '다음 텍스트 조각', detail: '열린 문장만 새 배열로 렌더링' },
          ],
        },
        {
          kind: 'paragraph',
          text: '행 너비는 문자열 길이가 아니라 ANSI 제어 문자를 뺀 화면 셀 수로 계산합니다. 한글처럼 셀 너비가 달라질 수 있는 문자, 색상 코드, 탭을 같은 도우미로 측정·자르기·줄바꿈해야 커서와 테두리가 맞습니다. 터미널 크기가 바뀌면 현재 화면을 새 너비로 다시 만들고, 코딩 에이전트의 기본 설정은 기존 대화도 새 너비로 한 번 재생합니다.',
        },
        {
          kind: 'paragraph',
          text: '이 구조에서 중요한 판단은 “화면 위로 밀려났는가”가 아니라 “내용이 확정되었는가”입니다. 도구의 중간 출력이나 열린 마크다운을 너무 일찍 기록으로 보내면 이후 수정할 수 없고, 반대로 완료한 블록을 계속 `viewport`에 두면 매 프레임 다시 그려야 합니다. 하네스의 이벤트 수명과 렌더러의 행 수명이 같은 경계를 사용해야 깜박임과 중복 기록을 피할 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 확정 기록과 가변 화면의 차등 렌더링', href: `${source}/docs/tui-core-renderer.md` },
            { text: 'OMP · TUI 렌더러 구현', href: `${source}/packages/tui/src/tui.ts` },
          ],
        },
      ],
    },
  ],
};

const sdkRpcAcpTopic: Topic = {
  id: 'sdk-rpc-and-acp-interfaces',
  number: '39',
  title: 'SDK, RPC, ACP 인터페이스',
  description: '같은 세션 런타임을 프로세스 안, 표준 입출력 너머, 편집기 안에서 제어하는 세 가지 경계.',
  sections: [
    {
      id: 'three-host-boundaries',
      title: '호스트가 런타임과 만나는 위치',
      blocks: [
        {
          kind: 'paragraph',
          text: 'SDK, RPC, ACP는 별도의 에이전트가 아니라 같은 `AgentSession`을 감싸는 호스트 인터페이스입니다. 차이는 누가 프로세스를 소유하고, 명령과 이벤트가 어느 경계를 건너며, 파일·터미널·승인 UI를 누가 제공하는가에 있습니다.',
        },
        {
          kind: 'exchange',
          input: { label: '공통 런타임', text: '`AgentSession` · 모델 · 도구 · 세션 기록 · 이벤트' },
          outputs: [
            {
              label: 'TypeScript SDK',
              text: 'Bun 호스트가 `createAgentSession()`을 같은 프로세스에서 호출하고 객체 메서드와 타입 있는 이벤트를 직접 사용합니다.',
            },
            {
              label: 'RPC',
              text: '언어와 무관한 호스트가 `omp --mode rpc` 자식 프로세스에 JSONL 명령을 쓰고 응답·이벤트 프레임을 읽습니다.',
            },
            {
              label: 'ACP',
              text: '편집기가 `omp acp`를 표준 입출력 서버로 실행하고 Agent Client Protocol의 세션·파일·터미널·권한 요청을 주고받습니다.',
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '직접 함수 호출과 프로토콜 호출은 장애 경계도 다릅니다. SDK 호스트는 세션 객체와 같은 프로세스에서 자원을 정리합니다. RPC와 ACP 호스트는 자식 프로세스의 시작, 표준 입출력 종료, 프레임 파싱, 재시작을 함께 관리해야 합니다. 기능 목록만 맞추는 대신 이 수명 경계를 먼저 선택해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 네 가지 실행 진입점', href: `${source}/README.md#L494-L560` },
            { text: 'OMP · SDK 진입점', href: `${source}/docs/sdk.md#entry-points` },
          ],
        },
      ],
    },
    {
      id: 'sdk-and-rpc-lifecycle',
      title: 'SDK 객체와 RPC 프레임의 수명',
      blocks: [
        {
          kind: 'paragraph',
          text: 'SDK에서 `createAgentSession()`은 빠진 옵션을 프로젝트 설정과 리소스 탐색으로 채우고 `session`, 이벤트 버스, 확장 로딩 결과 등을 돌려줍니다. 호스트는 `session.subscribe()`로 텍스트 조각과 도구 실행 이벤트를 받고, `session.prompt()`로 작업을 시작합니다. 사용을 마치면 `dispose()`를 기다려 작업·브라우저·MCP·메모리·세션 파일을 순서에 맞게 닫아야 합니다.',
        },
        {
          kind: 'code',
          language: 'typescript',
          caption: '프로세스 안에서 세션을 소유하는 최소 SDK 흐름',
          code: `const { session } = await createAgentSession({
  sessionManager: SessionManager.inMemory(),
});

const unsubscribe = session.subscribe(event => {
  if (event.type === "message_update") render(event);
});

await session.prompt("실패한 테스트를 설명해 줘.");
unsubscribe();
await session.dispose();`,
        },
        {
          kind: 'paragraph',
          text: 'RPC에서는 각 명령의 `id`가 비동기 응답을 연결합니다. 모델 턴을 시작한 `prompt`는 `agent_end`의 `isTerminal !== false`까지 기다려야 끝나지만, 로컬 명령은 성공 응답의 `data.agentInvoked: false`나 뒤이은 `prompt_result`에서 끝나며 `agent_end`를 내보내지 않습니다. 수명 주기 이벤트가 `prompt` 응답보다 먼저 또는 나중에 올 수 있고, 긴 `bash`와 다른 명령의 응답 순서도 바뀔 수 있으므로 호스트는 도착 순서가 아니라 요청 ID와 완료 신호로 대응시킵니다. 스트리밍 중 새 프롬프트는 `steer`인지 `followUp`인지도 명시해야 합니다.',
        },
        {
          kind: 'tool-sequence',
          title: '모델 턴을 시작한 RPC 요청의 승인과 완료를 구분하기',
          prompt: '`{"id":"r1","type":"prompt","message":"테스트 실패를 분석해 줘"}`',
          actors: ['RPC 호스트', '`omp --mode rpc`', 'AgentSession'],
          events: [
            { from: 0, to: 1, kind: 'call', label: 'JSONL 명령', detail: '요청 ID `r1`과 프롬프트' },
            { from: 1, to: 0, kind: 'result', label: '즉시 응답', detail: '`command: "prompt"` · `success: true`\n아직 실행 완료가 아님' },
            { from: 1, to: 2, kind: 'request', label: '세션 실행', detail: '모델 스트림과 도구 호출 시작' },
            { from: 2, to: 0, kind: 'result', label: '이벤트 스트림', detail: '`message_update` · `tool_execution_*`' },
            { from: 2, to: 0, kind: 'answer', label: '최종 완료', detail: '`agent_end` · `isTerminal: true`' },
          ],
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · SDK 생성·이벤트·종료 계약', href: `${source}/docs/sdk.md` },
            { text: 'OMP · RPC 프레이밍과 명령·이벤트', href: `${source}/docs/rpc.md` },
            { text: 'OMP · Python RPC 클라이언트', href: `${source}/python/omp-rpc/README.md` },
          ],
        },
      ],
    },
    {
      id: 'acp-editor-host',
      title: 'ACP에서 편집기가 호스트가 되기',
      blocks: [
        {
          kind: 'paragraph',
          text: 'ACP 모드에서는 편집기가 세션을 만들고 프롬프트를 보내며, 자신이 제공하는 파일·터미널 기능을 서버에 알립니다. OMP는 지원되는 경우 `read`와 `write`를 편집기의 파일 API로, `bash`를 편집기 터미널로 연결합니다. 그래서 모델은 디스크에 아직 저장되지 않은 편집기 버퍼를 읽고, 편집기의 저장 경로를 통해 변경할 수 있습니다. 권한 요청은 클라이언트가 광고하는 기능이 아니라 에이전트 정책에 따라 편집기 UI로 보내는 별도 경계입니다.',
        },
        {
          kind: 'execution-path',
          title: '같은 파일 수정이 ACP 기능에 따라 실행되는 방식',
          input: { label: '모델의 행동', text: '`src/cache.ts`를 읽고 한 줄을 수정한다.' },
          labels: { choose: '호스트 기능' },
          paths: [
            {
              label: '편집기 파일 기능 있음',
              stages: [
                { label: '읽기', text: '`fs/read_text_file`로 현재 버퍼 내용을 받습니다.', state: 'complete' },
                { label: '권한', text: '편집기가 `session/request_permission` 요청을 사용자에게 표시합니다.', state: 'complete' },
                { label: '쓰기', text: '`fs/write_text_file`로 편집기 저장 흐름을 사용합니다.', state: 'complete' },
              ],
              result: { label: '결과', text: '편집기와 에이전트가 같은 문서 상태를 봅니다.' },
            },
            {
              label: '필요한 기능 없음',
              stages: [
                { label: '기능 확인', text: '클라이언트가 광고하지 않은 편집기 API는 호출하지 않습니다.', state: 'complete' },
                { label: '대체 실행', text: '`read`와 `write`는 로컬 디스크로, `bash`는 로컬 프로세스로 돌아갑니다.', state: 'complete' },
                { label: '편집기 동기화', text: '지원되지 않는 기능의 동기화를 추측해 실행하지 않습니다.', state: 'skipped' },
              ],
              result: { label: '결과', text: '실제 클라이언트 능력에 맞는 실행 경계가 유지됩니다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: 'ACP는 세션 업데이트, 도구 호출, 권한 요청 같은 의미 이벤트를 주고받고 편집기가 자기 UI로 표현하는 규약입니다. OMP 쪽 어댑터는 ACP 이벤트와 `AgentSession` 이벤트를 변환하고, 클라이언트 브리지가 광고된 파일·터미널 작업과 승인 대상 도구의 권한 요청을 편집기로 보냅니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · ACP의 편집기 도구 경로', href: `${source}/README.md#L546-L560` },
            { text: 'OMP · ACP 세션 어댑터', href: `${source}/packages/coding-agent/src/modes/acp/acp-agent.ts` },
            { text: 'OMP · ACP 클라이언트 브리지', href: `${source}/packages/coding-agent/src/modes/acp/acp-client-bridge.ts` },
          ],
        },
      ],
    },
  ],
};

const usageStatisticsTopic: Topic = {
  id: 'usage-statistics',
  number: '40',
  title: '사용량 통계',
  description: '완료된 세션 기록을 요청·비용·속도·오류 지표로 바꿔 하네스의 실제 운용을 비교하는 관측 계층.',
  sections: [
    {
      id: 'logs-to-metrics',
      title: '세션 JSONL에서 비교 가능한 지표로',
      blocks: [
        {
          kind: 'paragraph',
          text: '`@oh-my-pi/omp-stats`는 저장된 세션 JSONL을 읽어 새로 생기거나 바뀐 항목만 SQLite에 반영합니다. 모델 요청의 입력·출력·캐시 토큰, 응답 시간, 첫 토큰 시간, 종료 이유, 모델과 프로젝트를 같은 레코드로 모읍니다. 대화 화면을 다시 긁는 대신 런타임이 남긴 구조화 기록을 관측 자료로 사용합니다.',
        },
        {
          kind: 'exchange',
          input: {
            label: '완료한 요청 기록',
            text: '입력 `6,000` · 캐시 읽기 `4,000` · 출력 `500` 토큰\n지연 `2,000 ms` · 첫 토큰 `350 ms` · `stopReason: stop`',
          },
          outputs: [
            { label: '캐시율', text: '`4,000 / (6,000 + 4,000) = 40%`' },
            { label: '출력 속도', text: '`500 / 2초 = 250 tokens/s`' },
            { label: '오류·지연', text: '오류 요청 수와 전체 요청 수로 오류율을 계산하고, 요청들의 지연과 TTFT를 따로 집계' },
          ],
        },
        {
          kind: 'paragraph',
          text: '비용 값은 기록된 토큰에 일치하는 공개 API 단가를 적용한 API 환산 추정치입니다. 구독 요금제의 실제 청구액을 뜻하지 않으며, 공개 가격이 없는 모델은 금액 합계에서 제외됩니다. 통계 화면이 계산의 의미와 누락 조건을 함께 보여 줘야 서로 다른 결제 방식을 잘못 비교하지 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 통계 패키지와 지표 정의', href: `${source}/packages/stats/README.md` },
            { text: 'OMP · 세션 기록 파서', href: `${source}/packages/stats/src/parser.ts` },
            { text: 'OMP · 집계 쿼리', href: `${source}/packages/stats/src/aggregator.ts` },
          ],
        },
      ],
    },
    {
      id: 'queries-and-decisions',
      title: '완료된 실행을 모델·프로젝트·시간으로 비교하기',
      blocks: [
        {
          kind: 'paragraph',
          text: '`omp stats`는 콘솔 요약, JSON 출력, 로컬 웹 대시보드를 제공합니다. API는 전체 지표뿐 아니라 모델별, 프로젝트별, 시간대별 집계를 반환합니다. 같은 원시 요청을 여러 화면에서 다시 계산하지 않고 SQLite 쿼리 결과를 공유하므로 자동 보고와 사람이 보는 차트가 같은 기준을 사용합니다.',
        },
        {
          kind: 'execution-path',
          title: '캐시율 하락을 원인까지 좁히기',
          input: { label: '관찰', text: '이번 주 전체 캐시율이 지난주보다 낮아졌다.' },
          labels: { choose: '조회 축' },
          paths: [
            {
              label: '모델별 조회',
              stages: [
                { label: '분할', text: '요청을 모델별로 묶어 캐시 읽기와 입력 토큰을 비교합니다.', state: 'complete' },
                { label: '발견', text: '한 모델에서만 캐시율이 낮다면 제공자·모델 설정 변경을 조사합니다.', state: 'complete' },
                { label: '다른 프로젝트', text: '문제가 없는 모델·프로젝트는 조사 대상에서 뺍니다.', state: 'skipped' },
              ],
              result: { label: '하네스 조치', text: '모델 선택이나 요청 형식의 변경 이력을 확인합니다.' },
            },
            {
              label: '프로젝트별 조회',
              stages: [
                { label: '분할', text: '프로젝트별 입력·캐시 토큰과 요청 수를 비교합니다.', state: 'complete' },
                { label: '발견', text: '한 프로젝트에서만 낮다면 지침·도구 정의 순서가 자주 바뀌는지 확인합니다.', state: 'complete' },
                { label: '실행 추적', text: '해당 기간의 요청과 오류 기록으로 범위를 좁힙니다.', state: 'complete' },
              ],
              result: { label: '하네스 조치', text: '안정적으로 유지할 프롬프트 접두부를 찾습니다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '이 분석은 완료된 실행의 상관관계를 보여 주지만 원인을 자동으로 증명하지는 않습니다. 모델, 프로젝트, 시간 범위로 문제를 좁힌 다음 해당 세션의 실제 요청과 설정 변경을 확인해야 합니다. 통계 계층의 역할은 한 번의 성공적인 대화 대신 반복 실행의 비용·속도·오류 패턴을 드러내는 것입니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 통계 API와 저장소', href: `${source}/packages/stats/README.md#api-endpoints` },
            { text: 'OMP · 통계 서버', href: `${source}/packages/stats/src/server.ts` },
          ],
        },
      ],
    },
  ],
};

const benchmarksTopic: Topic = {
  id: 'benchmarks',
  number: '41',
  title: '벤치마크',
  description: '동일한 과제·검증기·실행 기록으로 모델과 하네스 구성을 반복 비교하는 실험 시스템.',
  sections: [
    {
      id: 'experiment-run-trace',
      title: '실험에서 개별 실행 기록까지',
      blocks: [
        {
          kind: 'paragraph',
          text: '`@oh-my-pi/pi-metaharness`는 Harbor, TypeScript 편집, SnapCompact 벤치마크를 `experiment → run → trace` 구조로 통일합니다. 실험은 비교할 목적을, `run`은 모델·설정·표본·반복 횟수를, `trace`는 한 과제에서 실제로 일어난 모델 요청과 도구 실행을 담습니다. 각 벤치마크의 원래 결과 파일은 디스크에 남기고, 점수·사용량·비용·진행 상황만 공통 SQLite 형식으로 색인합니다.',
        },
        {
          kind: 'exchange',
          input: {
            label: '실험 설정',
            text: '목적: “편집 방식 A와 B 비교”\n같은 과제 20개 · 모델 1개 · 각 과제 2회',
          },
          outputs: [
            { label: '비교군 A', text: '기준 하네스 설정으로 40개 `trial` 실행\n과제별 점수·토큰·비용·`trace` 저장' },
            { label: '비교군 B', text: '편집 방식만 바꿔 같은 표본과 반복 조건으로 실행' },
            { label: '실험 결과', text: '성공률과 비용의 차이를 `run` 단위로 비교하고, 실패한 과제는 개별 `trace`로 내려가 조사' },
          ],
        },
        {
          kind: 'paragraph',
          text: '비교할 때는 과제 표본, 시도 횟수, 동시 실행 수, 모델, 설치 소스와 실행 제한을 함께 저장해야 합니다. 점수만 남기면 하네스 변경 때문인지 다른 표본이나 시간 제한 때문인지 구분할 수 없습니다. Metaharness는 실행 구성을 보존해 중단된 Harbor `run`을 같은 조건으로 재개하고, 완료한 `trial`은 다시 쓰지 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · Metaharness의 실험·실행·추적 구조', href: `${source}/packages/metaharness/README.md` },
            { text: 'OMP · Metaharness 서버와 저장소', href: `${source}/packages/metaharness/src/server.ts` },
          ],
        },
      ],
    },
    {
      id: 'inspect-edit-case',
      title: '편집 과제 하나를 입력부터 판정까지 보기',
      blocks: [
        {
          kind: 'paragraph',
          text: 'TypeScript 편집 벤치마크의 한 fixture에는 작업 지시인 `prompt.md`, 시작 파일인 `input/`, 정답 파일인 `expected/`, 변이 종류와 난이도 같은 `metadata.json`이 들어갑니다. 실행기는 `input/`을 작업 공간으로 복사해 에이전트에게 프롬프트를 주고, 종료 뒤 결과 파일을 검증기에 넘깁니다.',
        },
        {
          kind: 'tool-sequence',
          title: 'fixture 한 건의 실행과 판정',
          prompt: '중첩된 조건문에서 잘못 바뀐 식별자를 원래 참조로 고친다.',
          actors: ['벤치마크 관리자', 'OMP 실행', 'fixture 검증기'],
          events: [
            { from: 0, to: 1, kind: 'request', label: '과제 시작', detail: '`prompt.md` + `input/` 작업 복사본 + 모델·도구 설정' },
            { from: 1, to: 0, kind: 'result', label: '`trace` 실행 기록', detail: '읽기·편집·검사 도구 호출, 토큰과 시간, 최종 작업 파일' },
            { from: 0, to: 2, kind: 'call', label: '정답 비교', detail: '에이전트 출력과 `expected/` 파일 집합을 전달' },
            { from: 2, to: 0, kind: 'result', label: '형식 정규화', detail: '코드 포매터 적용 후 의미 없는 코드 빈 줄 차이는 제거\nMarkdown·YAML의 빈 줄은 유지' },
            { from: 2, to: 0, kind: 'answer', label: '판정', detail: '일치하면 성공, 다르면 파일명·축약 diff·변경 행 수를 저장' },
          ],
        },
        {
          kind: 'paragraph',
          text: '이 판정은 모델의 “수정 완료” 문장을 채점하지 않습니다. 주어진 시작 파일이 기대 파일로 바뀌었는지 검증기가 직접 비교합니다. 실패한 `trace`에서는 모델이 잘못된 파일을 읽었는지, 올바른 위치를 찾고도 편집이 빗나갔는지, 검증 결과 뒤 다시 시도했는지를 차례로 볼 수 있습니다. 같은 최종 실패도 하네스가 개선할 지점은 서로 다릅니다.',
        },
        {
          kind: 'paragraph',
          text: '정확성 점수와 함께 실행 `trace`를 보존하는 이유가 여기에 있습니다. 결과 집계는 어느 설정이 나았는지 알려 주고, 개별 `trace`는 왜 나았는지를 조사할 자료를 줍니다. 하네스 벤치마크는 둘 중 하나만으로는 충분하지 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 편집 fixture 로딩 계약', href: `${source}/packages/typescript-edit-benchmark/src/tasks.ts` },
            { text: 'OMP · 기대 파일 검증기', href: `${source}/packages/typescript-edit-benchmark/src/verify.ts` },
            { text: 'OMP · 실행과 추적 결과물', href: `${source}/packages/metaharness/README.md#outputs` },
          ],
        },
      ],
    },
  ],
};

const nativeModulesTopic: Topic = {
  id: 'native-modules',
  number: '42',
  title: '네이티브 모듈',
  description: 'TypeScript 정책 아래에 Rust의 검색·편집·셸·플랫폼 기능을 연결하는 N-API 경계.',
  sections: [
    {
      id: 'loader-and-bindings',
      title: '플랫폼에 맞는 Rust 애드온을 불러오기',
      blocks: [
        {
          kind: 'paragraph',
          text: '`@oh-my-pi/pi-natives`는 JavaScript ESM 로더와 Rust Node-API 애드온으로 이루어집니다. 패키지의 기본 진입점을 가져오면 로더가 운영체제와 CPU 아키텍처를 확인해 맞는 `.node` 파일을 고릅니다. 생성된 함수·클래스·enum 객체는 이름 있는 ESM export로 연결하고, napi-rs가 생성한 타입 선언은 `index.d.ts`로 제공합니다. 데스크톱과 클립보드 진입점은 실제 호출 때까지 큰 애드온 로딩을 미룹니다.',
        },
        {
          kind: 'exchange',
          input: { label: 'TypeScript 호출', text: '`await grep({ pattern: "TODO", path: "src" })`' },
          outputs: [
            { label: '패키지 로더', text: '예: `win32-x64`과 CPU 변형을 판별하고 설치 패키지·캐시·실행 파일 주변의 후보를 순서대로 확인' },
            { label: 'N-API 경계', text: '`GrepOptions`를 Rust 값으로 변환하고 취소 신호·제한 시간을 네이티브 작업에 전달' },
            { label: 'Rust 구현', text: '파일 트리를 병렬로 순회하며 정규식을 적용하고 `GrepResult`를 JavaScript 객체로 반환' },
          ],
        },
        {
          kind: 'paragraph',
          text: '설치본과 컴파일된 실행 파일에서 로더는 패키지 버전에 대응하는 `sentinel`을 확인해 다른 버전의 애드온을 잘못 불러오는 일을 막습니다. `x64`에서는 `modern` 빌드가 맞지 않으면 `baseline` 후보로 내려가며, 지원되는 후보를 모두 불러오지 못하면 시도한 경로와 복구 방법을 포함한 오류를 냅니다. 하네스는 이 오류에서 시작을 멈추고 플랫폼 문제를 바로 드러냅니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 네이티브 패키지와 로더 구조', href: `${source}/docs/natives-architecture.md` },
            { text: 'OMP · JavaScript/TypeScript 바인딩 계약', href: `${source}/docs/natives-binding-contract.md` },
            { text: 'OMP · 애드온 후보 선택과 검증', href: `${source}/docs/natives-addon-loader-runtime.md` },
          ],
        },
      ],
    },
    {
      id: 'trace-grep-binding',
      title: 'grep 호출을 TypeScript에서 Rust까지 따라가기',
      blocks: [
        {
          kind: 'paragraph',
          text: '모델이 보는 `grep` 도구와 Rust의 `grep` 함수 사이에는 하네스 정책이 있습니다. TypeScript `GrepTool`은 패턴·경로를 검증하고, 아카이브나 내부 URL을 검색 가능한 파일로 준비하고, Git 무시 규칙과 출력 한도를 정합니다. 그다음에만 `@oh-my-pi/pi-natives`의 `grep`을 호출합니다.',
        },
        {
          kind: 'tool-sequence',
          title: '`TODO` 검색 한 번의 실행 경계',
          prompt: '`src` 아래에서 `TODO`를 찾아 줘.',
          actors: ['모델과 에이전트 루프', 'TypeScript `GrepTool`', 'Rust 네이티브 검색'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '도구 호출', detail: '`{"pattern":"TODO","path":"src"}`' },
            { from: 1, to: 1, kind: 'read', label: '정책 적용', detail: '`cwd` 기준 경로 해석 · 승인 등급 · 무시 규칙 · 검색/파일별 한도 결정' },
            { from: 1, to: 2, kind: 'call', label: 'N-API 호출', detail: '`grep(GrepOptions)`에 취소 신호와 시간 제한 전달' },
            { from: 2, to: 1, kind: 'result', label: '구조화 결과', detail: '파일·행·일치 텍스트 · 검색 파일 수 · 제한 도달 여부' },
            { from: 1, to: 0, kind: 'result', label: '모델용 출력', detail: '중복 제거·경로 표시·출력 절단 뒤 도구 결과 메시지 생성' },
          ],
        },
        {
          kind: 'paragraph',
          text: 'Rust 작업은 `pi-walker`의 무시 규칙을 반영한 파일 순회와 네이티브 정규식 검색을 사용하고, N-API `Promise`로 결과를 돌려줍니다. 취소나 시간 제한도 이 작업 경계를 건넙니다. 반면 원격 경로 승인, 모델에게 보여 줄 분량, 오류 문구 같은 제품 정책은 TypeScript 도구가 맡습니다. 빠른 원시 연산과 사용자·모델을 위한 정책을 한 계층에 섞지 않는 것이 핵심입니다.',
        },
        {
          kind: 'paragraph',
          text: '같은 구조로 `pi-ast`는 구조 검색과 편집, `pi-shell`과 `pi-builtins`는 지속 셸과 프로세스, `pi-iso`는 격리 작업 공간, `pi-vcs`는 버전 관리 연산을 제공합니다. 이 크레이트들은 소비자가 직접 호출하는 제품 API가 아니라 `pi-natives` 뒤의 구현 단위입니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · TypeScript grep 도구', href: `${source}/packages/coding-agent/src/tools/grep.ts` },
            { text: 'OMP · Rust N-API grep 함수', href: `${source}/crates/pi-natives/src/grep.rs#L2202-L2248` },
            { text: 'OMP · 네이티브 크레이트 책임 지도', href: `${source}/docs/native-crates.md` },
          ],
        },
      ],
    },
  ],
};

const bitmapContextCompressionTopic: Topic = {
  id: 'bitmap-context-compression',
  number: '43',
  title: '비트맵 컨텍스트 압축',
  description: '오래된 대화를 조밀한 텍스트 이미지로 바꿔 비전 모델이 다시 읽게 하는 결정론적 컨텍스트 보존 방식.',
  sections: [
    {
      id: 'conversation-to-frames',
      title: '대화 기록을 PNG 프레임으로 바꾸기',
      blocks: [
        {
          kind: 'paragraph',
          text: 'SnapCompact는 버릴 대화를 다른 모델에게 요약시키는 대신, 대화를 짧은 텍스트 표현으로 직렬화한 뒤 픽셀 글꼴의 PNG 프레임으로 렌더링합니다. 직렬화와 렌더링은 로컬에서 결정론적으로 수행되므로 압축 자체에 별도 LLM 요청이나 API 키가 필요하지 않습니다. PNG 생성은 `@oh-my-pi/pi-natives`의 Rust 구현이 맡습니다.',
        },
        {
          kind: 'tool-sequence',
          title: '오래된 메시지가 다음 요청의 이미지 문맥이 되기까지',
          prompt: '압축 준비 단계가 오래된 대화를 `messagesToSummarize`로 선택한다.',
          actors: ['압축 파이프라인', 'SnapCompact 렌더러', '비전 모델'],
          events: [
            { from: 0, to: 0, kind: 'read', label: '구간 분리', detail: '오래된 쪽과 최신 쪽의 한 페이지 분량은 텍스트로 남기고 가운데 구간만 렌더링 대상으로 선택' },
            { from: 0, to: 1, kind: 'call', label: '가운데 구간 직렬화', detail: '역할·텍스트·도구 호출과 결과를 길이 제한이 있는 한 흐름으로 변환' },
            { from: 1, to: 1, kind: 'read', label: '글자 정규화', detail: 'ANSI 제거 · 공백 정리 · 지원하지 않는 장식 기호 변환 · 렌더 가능한 비라틴 문자 보존' },
            { from: 1, to: 0, kind: 'result', label: '프레임 렌더링', detail: '고정 폭의 글자 격자에 페이지를 나눠 필요한 경우 PNG 프레임 생성' },
            { from: 0, to: 2, kind: 'request', label: '문맥 재구성', detail: '읽기 안내와 파일 요약 + 오래된 텍스트 가장자리 + 이미지화된 가운데 + 최신 텍스트 가장자리' },
            { from: 2, to: 0, kind: 'answer', label: '이전 정보 활용', detail: '비전 모델이 이미지 속 대화를 읽어 현재 작업을 계속함' },
          ],
        },
        {
          kind: 'paragraph',
          text: '기록이 작거나 이미지화할 가운데 구간이 없으면 PNG 프레임은 0개일 수 있습니다. 이때도 양쪽 텍스트 가장자리와 파일 요약으로 문맥을 구성하므로, 압축 결과를 항상 “대화 전체의 이미지”로 해석하면 안 됩니다.',
        },
        {
          kind: 'paragraph',
          text: '렌더링 결과와 원본 아카이브의 제한된 사본은 압축 항목의 `preserveData`에 저장됩니다. 세션이 대화 문맥을 다시 만들 때 같은 프레임을 요약 메시지에 다시 붙입니다. 화면에 이미지를 한 번 보여 주는 기능이 아니라, 이후 모델 요청의 문맥을 재구성하는 영속 자료입니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · SnapCompact 작동 방식과 API', href: `${source}/packages/snapcompact/README.md` },
            { text: 'OMP · 직렬화·정규화·렌더링 구현', href: `${source}/packages/snapcompact/src/snapcompact.ts` },
            { text: 'OMP · 컨텍스트 압축 파이프라인', href: `${source}/docs/compaction.md` },
          ],
        },
      ],
    },
    {
      id: 'model-aware-shapes-and-evaluation',
      title: '모델이 읽을 수 있는 모양을 실험으로 고르기',
      blocks: [
        {
          kind: 'paragraph',
          text: '같은 글자를 더 작게 그리면 한 이미지에 많은 대화를 담을 수 있지만, 모델이 오독할 가능성도 커집니다. SnapCompact는 글꼴, 셀 크기, 줄 간격, 프레임 크기를 묶은 `shape`를 모델 계열과 실제 전송 제공자에 맞춰 고릅니다. 모델 ID는 읽기 특성을, 실제 전송 API는 이미지 과금과 허용량을 결정하므로 둘을 함께 봅니다.',
        },
        {
          kind: 'exchange',
          input: { label: '`shape` 후보', text: '작은 셀: 프레임 수 감소\n큰 셀: 글자 구분 향상\n두 열 문서: 자연어 줄바꿈 보존' },
          outputs: [
            { label: '읽기 평가', text: 'SQuAD 지문과 질문을 프레임으로 보내 답의 Exact Match와 F1을 측정' },
            { label: '비용 평가', text: '각 제공자가 계산하는 이미지 토큰·고정 이미지 비용과 필요한 프레임 수를 함께 기록' },
            { label: '선택 결과', text: '모델 계열마다 회상 성능과 비용의 균형이 나은 `shape`를 기본값으로 등록' },
          ],
        },
        {
          kind: 'paragraph',
          text: '한글·한자·가나처럼 좁은 ASCII 글꼴에 없는 문자는 포함된 Silver 글꼴로 대체하고, 좁은 격자에서는 두 셀 너비로 그립니다. 텍스트를 렌더하기 전에 글리프 지원 여부도 검사합니다. 압축률만 높이고 실제 프로젝트의 언어를 읽지 못하면 컨텍스트 보존이라는 목적을 달성하지 못하기 때문입니다.',
        },
        {
          kind: 'paragraph',
          text: '평가가 좋은 기본 `shape`도 특정 대화의 정답을 보장하지는 않습니다. 하네스는 프레임 수와 제공자별 이미지 예산을 제한하고, 중요한 최근 문맥과 파일 상태는 텍스트로 남기며, 압축 뒤 과제 성공률을 따로 측정해야 합니다. 비트맵은 의미 요약의 대체물이 아니라 오래된 원문을 다른 매체로 운반하는 선택입니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 제공자별 렌더링 형상 선택', href: `${source}/packages/snapcompact/src/snapcompact.ts#L258-L446` },
            { text: 'OMP · SQuAD EM/F1 평가 러너', href: `${source}/packages/snapcompact/research/final.py` },
            { text: 'OMP · 프로덕션 렌더링 형상 검증', href: `${source}/packages/snapcompact/research/mono_prod.py` },
          ],
        },
      ],
    },
  ],
};

const liveCollaborationTopic: Topic = {
  id: 'live-collaboration',
  number: '44',
  title: '실시간 협업',
  description: '호스트의 한 세션을 암호화된 이벤트로 복제하고 원격 사용자의 관찰·질문·중단을 되돌려 보내는 구조.',
  sections: [
    {
      id: 'host-relay-guest',
      title: '호스트가 실행하고 게스트는 실행 기록을 재구성한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`/collab`에서 호스트 세션은 모델과 모든 도구 실행의 정본으로 남습니다. 게스트는 터미널 화면의 픽셀을 미러링하지 않고, 저장 항목과 에이전트 이벤트·상태를 받아 자기 TUI나 `collab-web`에서 같은 대화와 도구 카드를 렌더링합니다. 따라서 화면 크기와 테마가 달라도 실행 의미는 같습니다.',
        },
        {
          kind: 'tool-sequence',
          title: '원격 질문이 호스트의 새 턴이 되기까지',
          prompt: '게스트: “실패한 테스트의 원인도 함께 확인해 주세요.”',
          actors: ['게스트', '협업 릴레이', '호스트 세션'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '암호화된 `prompt`', detail: '방 키로 봉인한 프레임과 게스트 라우팅 정보' },
            { from: 1, to: 2, kind: 'request', label: '불투명 전달', detail: '릴레이는 방 ID·연결 수·암호문 크기만 보고 내용을 해독하지 않음' },
            { from: 2, to: 2, kind: 'read', label: '호스트 실행', detail: '프롬프트를 정본 세션에 기록하고 모델·도구를 호스트 머신에서 실행' },
            { from: 2, to: 1, kind: 'result', label: '항목과 이벤트', detail: '대화 `entry` · 스트리밍 `event` · 하단 `state` · 하위 에이전트 `bus` 상태' },
            { from: 1, to: 0, kind: 'answer', label: '게스트 재현', detail: '자기 화면에서 텍스트와 도구 카드를 렌더링하고 로컬 복제 기록 갱신' },
          ],
        },
        {
          kind: 'paragraph',
          text: '처음 연결할 때는 현재 상태와 과거 기록을 크기 제한이 있는 `snapshot` 조각으로 받습니다. 이후 `entry`는 영속 대화, `event`는 스트리밍 변화, `state`는 모델·문맥·참가자, `bus`와 `agents`는 하위 에이전트 진행을 전달합니다. 정본 기록과 일시적인 화면 이벤트를 분리해야 재접속 뒤에도 대화는 복원되고, 실시간 카드가 중복 표시되지 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 실시간 협업의 호스트·게스트 구조', href: `${source}/docs/collab.md` },
            { text: 'OMP · 공유 전송 프레임 계약', href: `${source}/packages/wire/src/index.ts#L324-L382` },
            { text: 'OMP · 브라우저 게스트 구현', href: `${source}/packages/collab-web/README.md` },
          ],
        },
      ],
    },
    {
      id: 'control-and-trust',
      title: '읽기 권한과 제어 권한을 링크에서 나누기',
      blocks: [
        {
          kind: 'paragraph',
          text: '브라우저용 협업 링크는 릴레이 링크 전체를 URL 프래그먼트에 넣으므로 방 비밀이 HTTP 요청에 실리지 않습니다. 터미널용 링크는 `.<key>`가 붙은 직접 릴레이 형식과 레거시 `#<key>` 형식도 허용합니다. 32바이트 방 키만 든 링크는 읽기 전용이고, 여기에 16바이트 쓰기 토큰이 붙은 링크는 전체 제어 권한을 줍니다. 세션 페이로드는 AES-256-GCM으로 암호화되며 호스트가 참가자의 쓰기 토큰을 확인합니다.',
        },
        {
          kind: 'execution-path',
          title: '게스트 행동을 권한에 따라 처리하기',
          input: { label: '게스트 행동', text: '현재 모델 응답을 중단하고 새 지시를 보낸다.' },
          labels: { choose: '공유 링크' },
          paths: [
            {
              label: '읽기 전용 링크',
              stages: [
                { label: '세션 보기', text: '기존 기록, 스트리밍 응답, 도구 카드와 하위 에이전트 대화를 받습니다.', state: 'complete' },
                { label: '중단 요청', text: '쓰기 토큰이 없어 호스트가 거부합니다.', state: 'blocked' },
                { label: '호스트 실행', text: '기존 턴이 계속됩니다.', state: 'complete' },
              ],
              result: { label: '결과', text: '관찰만 가능하고 호스트 상태는 바뀌지 않습니다.' },
            },
            {
              label: '전체 제어 링크',
              stages: [
                { label: '토큰 확인', text: '호스트가 쓰기 토큰을 검증합니다.', state: 'complete' },
                { label: '중단', text: '`abort` 프레임으로 현재 에이전트 턴을 멈춥니다.', state: 'complete' },
                { label: '새 프롬프트', text: '게스트 이름은 화면 표시로 붙고, 프롬프트 본문은 호스트 세션에 기록됩니다.', state: 'complete' },
              ],
              result: { label: '결과', text: '호스트가 새 턴과 도구 실행을 수행합니다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '전체 제어 게스트는 프롬프트·중단 외에도 Agent Hub를 통해 호스트의 하위 에이전트에 메시지를 보내거나 종료·재개할 수 있고, 호스트의 선택·편집 요청에도 답할 수 있습니다. 그러나 모델 변경, 세션 분기, 로컬 셸 같은 호스트 전용 명령은 원격에서 실행하지 못합니다. 협업 하네스는 “세션 제어”와 “호스트 머신 관리”를 별도 권한으로 유지합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 링크 형식과 종단간 암호화', href: `${source}/docs/collab.md#link-format` },
            { text: 'OMP · 게스트 권한 모델', href: `${source}/docs/collab.md#guest-permission-model` },
          ],
        },
      ],
    },
  ],
};

const desktopAutomationTopic: Topic = {
  id: 'desktop-automation',
  number: '45',
  title: '데스크톱 자동화',
  description: '화면 캡처, 운영체제 접근성 트리, 포인터·키보드 입력을 실제 데스크톱 세션에 연결하는 도구.',
  sections: [
    {
      id: 'targets-and-actions',
      title: '대상을 찾고 의미 있는 조작을 선택하기',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP의 `computer`는 독립된 모델 도구가 아니라 Python·JavaScript Eval에 노출되는 프리루드입니다. 창과 디스플레이를 찾고, 스크린샷을 찍고, 운영체제 접근성(AX) 요소를 조회하며, 키보드·포인터·클립보드를 다룹니다. 브라우저 DOM을 읽는 API가 아니므로 웹 페이지의 선택자나 JavaScript가 필요하면 `browser`를 사용합니다.',
        },
        {
          kind: 'execution-path',
          title: '설정 창의 저장 버튼을 누르는 두 방법',
          input: { label: '주어진 상태', text: '제목이 `Settings`인 창 하나가 열려 있고 `Save` 버튼을 눌러야 한다.' },
          labels: { choose: '관찰 결과' },
          paths: [
            {
              label: 'AX에서 버튼을 찾음',
              stages: [
                { label: '창 선택', text: '`computer.window({ title: "Settings" })`로 정확히 한 창을 고릅니다.', state: 'complete' },
                { label: '의미 검색', text: '`win.find({ role: "button", title: "Save" })` 결과가 하나인지 확인합니다.', state: 'complete' },
                { label: '동작', text: '그 요소의 `press()`를 호출합니다.', state: 'complete' },
              ],
              result: { label: '결과', text: '화면 위치와 무관하게 저장 버튼을 조작합니다.' },
            },
            {
              label: 'AX에 버튼이 없음',
              stages: [
                { label: '같은 창 캡처', text: '`win.screenshot()`으로 현재 프레임과 크기를 얻습니다.', state: 'complete' },
                { label: '좌표 확인', text: '캡처 안에서 버튼 중심 좌표를 정합니다.', state: 'complete' },
                { label: '입력', text: '같은 창 핸들에 `click(x, y)`를 보냅니다.', state: 'complete' },
              ],
              result: { label: '결과', text: '최신 캡처에 속한 좌표만 사용합니다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: 'AX 동작은 의미 있는 요소를 직접 가리키므로 화면 배치가 조금 바뀌어도 견고합니다. 픽셀 입력은 반드시 같은 대상의 가장 최근 스크린샷 좌표를 사용해야 하며, 창 크기나 디스플레이 배치가 바뀌면 프레임이 무효가 됩니다. AX의 전역 데스크톱 좌표와 스크린샷 픽셀 좌표도 서로 바꾸어 쓰지 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 데스크톱 대상, 캡처, AX와 입력', href: `${source}/docs/computer-use.md` },
            { text: 'OMP · computer 프리루드 계약', href: `${source}/docs/tools/computer.md` },
          ],
        },
      ],
    },
    {
      id: 'worker-permissions-and-safety',
      title: '지속 세션의 권한과 실패를 다루기',
      blocks: [
        {
          kind: 'paragraph',
          text: '`computer`는 기본으로 꺼져 있으며 세션 설정으로 활성화합니다. 첫 호출 때 별도 Bun 워커와 네이티브 `DesktopSession`을 만들고, 이후 호출에서 창 핸들·최근 스크린샷·AX 참조를 재사용합니다. 호출은 한 번에 하나씩 실행됩니다. 중단으로 워커가 종료되면 다음 호출은 새 세션을 만들기 때문에 이전 좌표와 참조도 다시 얻어야 합니다.',
        },
        {
          kind: 'exchange',
          input: { label: '호출 종류', text: '창 목록·스크린샷·AX 읽기 또는 클릭·입력·클립보드 쓰기' },
          outputs: [
            { label: '읽기 호출', text: '승인 정책에서 `read`로 분류하고 워커의 읽기 전용 접근 계층으로 캡처·조회만 허용' },
            { label: '변경 호출', text: '`exec`로 분류해 승인 뒤 실제 키보드·포인터·클립보드 동작 수행' },
            { label: '`computer.run`', text: '`read_only: true`일 때 접근 계층의 변경 메서드를 막지만, 실행 코드의 일반 Bun/Node 접근까지 격리하지는 않음' },
          ],
        },
        {
          kind: 'paragraph',
          text: '운영체제마다 화면 캡처·입력·AX 권한과 백엔드가 다릅니다. 코드는 플랫폼 이름만 보고 기능을 가정하지 말고 `computer.capabilities()`에서 실제 지원 여부와 전달 방식을 확인해야 합니다. 예를 들어 Wayland에서는 임의 창을 활성화하는 입력이 제한될 수 있고, macOS에서는 화면 기록과 접근성 권한이 따로 필요합니다.',
        },
        {
          kind: 'paragraph',
          text: '화면과 접근성 트리의 문구는 외부 애플리케이션이 제공하는 신뢰할 수 없는 데이터입니다. 그 문구가 비밀 전송이나 승인 우회를 요구해도 권한으로 취급하지 않습니다. 보내기·게시·구매·삭제처럼 결과가 큰 행동은 사용자가 정확히 요청한 대상과 내용인지 실행 전에 확인해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 워커와 네이티브 데스크톱 수명', href: `${source}/docs/tools/computer.md#flow-and-lifecycle` },
            { text: 'OMP · 플랫폼 권한과 안전 경계', href: `${source}/docs/computer-use.md#platforms` },
            { text: 'OMP · 데스크톱 네이티브 구현 진입점', href: `${source}/crates/pi-natives/src/desktop/mod.rs` },
          ],
        },
      ],
    },
  ],
};

const githubAutomationServiceTopic: Topic = {
  id: 'github-automation-service',
  number: '46',
  title: 'GitHub 자동화 서비스',
  description: '웹훅을 내구성 있는 작업으로 바꾸고 이슈별 OMP 세션과 제한된 GitHub 쓰기를 조정하는 서비스.',
  sections: [
    {
      id: 'webhook-to-rpc-session',
      title: '웹훅을 이슈별 작업 공간과 세션으로 바꾸기',
      blocks: [
        {
          kind: 'paragraph',
          text: 'RoboOMP는 GitHub 이슈와 풀 리퀘스트 이벤트를 받아 OMP를 실행하는 FastAPI 서비스입니다. 허용 목록의 저장소인지와 웹훅 HMAC 서명을 확인하고, `X-GitHub-Delivery`를 키로 SQLite 큐에 중복 없이 저장합니다. HTTP 요청 안에서 에이전트를 끝까지 실행하지 않으므로 GitHub에는 빠르게 응답하고, 워커가 내구성 있는 큐에서 작업을 가져갑니다.',
        },
        {
          kind: 'tool-sequence',
          title: '버그 이슈 하나가 수정 PR이 되기까지',
          prompt: '`issues.opened`: “TTL=0에서 캐시가 만료되지 않습니다.”',
          actors: ['GitHub', 'RoboOMP 조정 서비스', 'OMP RPC 작업 세션'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '웹훅 수신', detail: '서명 · 전달 ID · 저장소 허용 목록 검증 후 SQLite에 `queued`로 저장' },
            { from: 1, to: 1, kind: 'read', label: '작업 선점', detail: '같은 저장소·이슈 번호의 이벤트를 한 워커만 처리하도록 직렬화' },
            { from: 1, to: 2, kind: 'request', label: '이슈 작업 시작', detail: '전용 작업 트리와 지속 세션 디렉터리에서 `omp --mode rpc` 실행' },
            { from: 2, to: 1, kind: 'call', label: '호스트 도구 호출', detail: '`gh_open_pr`의 `title`·`body`와 선택적인 `base`·`draft`·`skip_checks` 전달' },
            { from: 1, to: 0, kind: 'call', label: 'PR 게시', detail: '브랜치 검사를 통과한 뒤 `git push`와 REST API로 PR 생성' },
            { from: 0, to: 1, kind: 'result', label: '게시 결과', detail: '생성된 PR 번호와 URL 또는 GitHub 오류' },
            { from: 1, to: 2, kind: 'result', label: '호스트 도구 결과', detail: '조정 서비스가 검증한 PR 정보나 오류를 RPC 세션에 반환' },
            { from: 0, to: 1, kind: 'answer', label: '후속 이벤트', detail: '리뷰 댓글이 오면 같은 JSONL 세션과 작업 트리를 재개' },
          ],
        },
        {
          kind: 'paragraph',
          text: '이슈마다 `farm/<hash>/<slug>` 브랜치와 작업 트리, 세션 기록을 유지합니다. 버그와 문서 이슈는 재현·수정·검증 뒤 PR로 이어지고, 질문·제안·중복 이슈는 분류에 맞는 댓글 흐름을 택합니다. 같은 이슈의 후속 댓글과 리뷰는 새 에이전트를 만들지 않고 `--continue`로 기존 대화를 복원합니다.',
        },
        {
          kind: 'paragraph',
          text: '서비스가 재시작되면 실행 중으로 남은 큐 항목을 다시 `queued`로 돌리고, 기존 JSONL이 있으면 같은 세션을 이어 갑니다. 웹훅 중복 제거, 이슈별 직렬화, 작업 공간과 세션의 지속성이 함께 있어야 네트워크 재전송이나 프로세스 장애가 중복 PR과 잃어버린 진행으로 이어지지 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · RoboOMP 동작과 아키텍처', href: `${source}/python/robomp/README.md` },
            { text: 'OMP · 웹훅 검증과 라우팅', href: `${source}/python/robomp/src/github_events.py` },
            { text: 'OMP · 큐와 워커 조정', href: `${source}/python/robomp/src/queue.py` },
            { text: 'OMP · OMP RPC 작업 실행기', href: `${source}/python/robomp/src/worker.py` },
          ],
        },
      ],
    },
    {
      id: 'credential-boundary-and-auditing',
      title: '에이전트와 GitHub 자격 증명 사이에 경계 세우기',
      blocks: [
        {
          kind: 'paragraph',
          text: '기본 배포는 `robomp`와 `gh-proxy` 두 컨테이너로 권한을 나눕니다. 조정 서비스는 웹훅 비밀과 작업 큐를 가지지만 GitHub PAT를 받지 않습니다. `gh-proxy`만 PAT를 보유하고, 내부 네트워크에서 HMAC 서명된 요청을 검증한 뒤 GitHub REST 호출과 `git push`를 수행합니다.',
        },
        {
          kind: 'exchange',
          input: { label: '에이전트의 GitHub 요청', text: '`gh_open_pr` · `title` · `body` · 선택적인 `base`·`draft`·`skip_checks`' },
          outputs: [
            { label: 'RoboOMP 호스트 도구', text: '에이전트가 준 인자와 호스트 도구가 선별한 결과 요약을 `tool_calls`에 기록하며 PAT는 이 경계에 들어오지 않음' },
            { label: '게시 전 게이트', text: '브랜치·작성자·깨끗한 작업 트리를 필수 확인하고, `skip_checks`가 아니며 스크립트가 있을 때 포매터·검사·테스트 실행' },
            { label: '`gh-proxy`', text: 'REST 요청에는 내부 인증 클라이언트가 `Authorization` 헤더를 붙이고, Git 하위 프로세스에만 PAT를 일시적 환경 값으로 주입' },
          ],
        },
        {
          kind: 'paragraph',
          text: '에이전트가 쓸 수 있는 GitHub 변경은 `host_tools.py`에 등록된 연산으로 제한됩니다. PR 본문은 재현·원인·수정·검증 구역과 이슈 종료 참조를 갖춰야 하고, 게시 전 검사에 실패하면 오류가 RPC 세션으로 돌아가 모델이 수정하게 됩니다. 모델에게 PAT나 범용 GitHub 셸을 주는 대신 좁은 연산과 검증 결과만 제공하는 구조입니다.',
        },
        {
          kind: 'paragraph',
          text: '이 서비스에서 OMP는 코드를 조사하고 바꾸는 실행 엔진이고, RoboOMP는 외부 이벤트·재시도·작업 공간·게시 정책을 소유하는 하네스입니다. GitHub 자동화가 신뢰할 수 있으려면 모델의 작업 능력뿐 아니라 중복 전달, 장애 복구, 자격 증명 보관, 감사 기록, 게시 전 검사를 하나의 실행 계약으로 다뤄야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · RoboOMP 보안 경계', href: `${source}/python/robomp/README.md#security-posture` },
            { text: 'OMP · 감사되는 GitHub 호스트 도구', href: `${source}/python/robomp/src/host_tools.py` },
            { text: 'OMP · 자격 증명 sidecar 클라이언트', href: `${source}/python/robomp/src/proxy_client.py` },
          ],
        },
      ],
    },
  ],
};

export const workflowAndAgentCoordinationTopics: readonly Topic[] = [
  planModeTopic,
  goalsTopic,
  taskTrackingTopic,
  subagentsTopic,
  agentCommunicationTopic,
];

export const interfacesAndInfrastructureTopics: readonly Topic[] = [
  terminalInterfaceTopic,
  sdkRpcAcpTopic,
  usageStatisticsTopic,
  benchmarksTopic,
];

export const specializedComponentTopics: readonly Topic[] = [
  nativeModulesTopic,
  bitmapContextCompressionTopic,
  liveCollaborationTopic,
  desktopAutomationTopic,
  githubAutomationServiceTopic,
];
