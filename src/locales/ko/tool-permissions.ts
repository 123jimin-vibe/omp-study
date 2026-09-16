import type { Topic } from '../../content.ts';

const source = 'https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec';

export const toolPermissionsTopic: Topic = {
  id: 'tool-permissions',
  number: '08',
  title: '도구 권한',
  description: '모델이 제안한 도구 호출을 실행 전에 허용·확인·거부하는 경계.',
  sections: [
    {
      id: 'approval-policy',
      title: '실행 능력과 실행 허가는 별개다',
      blocks: [
        {
          kind: 'paragraph',
          text: '레지스트리에 `bash`가 있으면 하네스는 명령을 실행할 구현을 찾을 수 있습니다. 그러나 해당 호출을 실제로 실행할지는 승인 정책이 결정합니다. OMP의 `resolveApproval()`은 호출을 `allow`, `prompt`, `deny` 중 하나로 분류하고, `ExtensionToolWrapper`는 내부 `execute`를 호출하기 전에 이 결정을 적용합니다.',
        },
        {
          kind: 'paragraph',
          text: '도구는 `approval` 필드에 능력 등급인 `read`, `write`, `exec`를 선언하거나, 호출 인자에 따라 등급과 정책을 계산하는 함수를 둘 수 있습니다. 선언이 없으면 `exec` 등급으로 취급합니다. 등급은 도구 이름이 아니라 `approval` 선언으로 정해지며, `ReadTool`도 `ssh://` 같은 일부 대상을 읽을 때는 `exec` 등급을 반환합니다.',
        },
        {
          kind: 'exchange',
          input: { label: '별도 정책이 없는 호출', text: '도구의 능력 등급\n`read` < `write` < `exec`' },
          outputs: [
            { label: '`always-ask` 모드', text: '`read`는 자동 허용\n`write`·`exec`는 확인 요청' },
            { label: '`write` 모드', text: '`read`·`write`는 자동 허용\n`exec`는 확인 요청' },
            { label: '`yolo` 모드', text: '세 등급 모두 자동 허용\n명시적 정책은 별도로 평가' },
          ],
        },
        {
          kind: 'paragraph',
          text: '이 소스 버전의 기본 설정은 `tools.approvalMode: yolo`와 `tools.approval: {}`입니다. `always-ask` 모드에서는 `read` 등급을 자동으로 허용하고 `write`와 `exec`만 사용자에게 묻습니다. SDK는 사용자 확장이 없어도 모든 등록 도구에 승인 래퍼를 설치합니다. 실제 확인 여부는 호출별 정책과 승인 모드가 결정하며, ACP 편집기의 추가 승인은 뒤에서 별도로 설명합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 등급과 모드의 비교, 생략된 선언의 처리', href: `${source}/packages/coding-agent/src/tools/approval.ts#L31-L101` },
            { text: 'OMP · read 인자에 따른 등급', href: `${source}/packages/coding-agent/src/tools/read.ts#L708-L717` },
            { text: 'OMP · 승인 설정 기본값', href: `${source}/packages/coding-agent/src/config/settings-schema.ts#L4178-L4225` },
            { text: 'OMP · 확장 유무와 무관한 runner 생성', href: `${source}/packages/coding-agent/src/sdk.ts#L2795-L2812` },
            { text: 'OMP · 모든 등록 도구에 승인 래퍼 설치', href: `${source}/packages/coding-agent/src/sdk.ts#L2918-L2923` },
          ],
        },
      ],
    },
    {
      id: 'denied-invocation',
      title: '같은 호출이 어디에서 멈추는가',
      blocks: [
        {
          kind: 'paragraph',
          text: '`bash`로 `npm publish`를 실행하는 호출이 승인 정책에 따라 어느 단계에서 멈추는지 비교합니다. `bash`는 활성화되어 있고 인자는 유효하며, ACP 승인과 인자를 수정하는 확장 훅은 없다고 가정합니다. `bash.patterns`는 비어 있고 Bash 인터셉터는 꺼져 있습니다.',
        },
        {
          kind: 'execution-path',
          title: '`npm publish` 호출의 승인 경로',
          input: { label: '모델이 제안한 같은 호출', text: '`bash` · `call_publish`\n`{"command":"npm publish"}`' },
          labels: { choose: '승인 상태' },
          paths: [
            {
              label: '기본 yolo',
              stages: [
                { label: '정책 사전 확인', text: '명시적 거부 없음\n등급은 `exec`', state: 'complete' },
                { label: '확장 훅', text: '등록된 `tool_call` 핸들러 없음\n원래 인자 유지', state: 'complete' },
                { label: '승인 게이트', text: '`yolo` → `allow`\n확인 창 없이 통과', state: 'complete' },
                { label: '도구 본문', text: '`BashTool.execute` 진입\n명령을 실행 백엔드로 전달', state: 'complete' },
              ],
              result: { label: '실행 허용', text: '승인 게이트를 통과한 명령이 실행 백엔드로 전달됩니다.\n게시 성공 여부는 실제 명령 결과로 결정됩니다.' },
            },
            {
              label: 'prompt 후 승인',
              stages: [
                { label: '정책 사전 확인', text: '`tools.approval.bash: prompt`\n사전 거부는 아님', state: 'complete' },
                { label: '확장 훅', text: '등록된 `tool_call` 핸들러 없음\n원래 인자 유지', state: 'complete' },
                { label: '승인 게이트', text: '대화형 UI에서 `Approve` 선택\n이번 호출 통과', state: 'complete' },
                { label: '도구 본문', text: '`BashTool.execute` 진입\n명령을 실행 백엔드로 전달', state: 'complete' },
              ],
              result: { label: '이번 호출 승인', text: '명령이 실행 백엔드로 전달됩니다.\n다음 호출은 당시의 정책과 인자로 다시 판단합니다.' },
            },
            {
              label: 'prompt 후 거절',
              stages: [
                { label: '정책 사전 확인', text: '`tools.approval.bash: prompt`\n사전 거부는 아님', state: 'complete' },
                { label: '확장 훅', text: '등록된 `tool_call` 핸들러 없음\n원래 인자 유지', state: 'complete' },
                { label: '승인 게이트', text: '대화형 UI에서 `Deny` 선택\n예외를 던져 실행 중단', state: 'blocked' },
                { label: '도구 본문', text: '`BashTool.execute` 호출 안 함\n명령 실행 백엔드에 전달 안 함', state: 'skipped' },
              ],
              result: { label: '오류 결과 반환', text: '`call_publish` · `isError: true`\n`Tool call denied by user: bash`' },
            },
            {
              label: '설정에서 deny',
              stages: [
                { label: '정책 사전 확인', text: '`tools.approval.bash: deny`\n래퍼가 즉시 거부', state: 'blocked' },
                { label: '확장 훅', text: '이미 거부된 호출에는\n`tool_call` 이벤트를 보내지 않음', state: 'skipped' },
                { label: '승인 게이트', text: '사용자에게 다시 묻지 않음\n사전 확인의 예외가 그대로 전파', state: 'skipped' },
                { label: '도구 본문', text: '`BashTool.execute` 호출 안 함\n명령 실행 백엔드에 전달 안 함', state: 'skipped' },
              ],
              result: { label: '오류 결과 반환', text: '`call_publish` · `isError: true`\n`Tool "bash" is blocked by user policy.`\n설정의 거부 항목을 설명하는 문구가 함께 반환된다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '사용자가 호출을 거절하면 셸 프로세스는 시작되지 않습니다. 승인 래퍼가 내부 도구의 `execute`를 호출하기 전에 예외를 던지고, 루프는 이 예외를 원래 호출 ID의 `toolResult`로 바꿉니다. 이 결과의 `isError`는 `true`입니다. 설정에서 거부한 경우에는 `Tool "bash" is blocked by user policy.`와 원인이 된 설정 키도 함께 반환합니다.',
        },
        {
          kind: 'paragraph',
          text: '`tool_execution_start` 이벤트는 승인 래퍼에 진입하기 전에 발생합니다. 따라서 이 이벤트만 보고 운영체제 명령이 실행되었다고 기록해서는 안 됩니다. 실제 실행 경계는 래퍼 안의 `this.tool.execute(...)` 호출입니다. 정책이 `prompt`인데 대화형 UI를 사용할 수 없다면 자동으로 허용하지 않고 오류를 반환합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 사전 거부와 승인 UI, 실제 execute 경계', href: `${source}/packages/coding-agent/src/extensibility/extensions/wrapper.ts#L185-L362` },
            { text: 'OMP · 정책 거부 오류의 내용', href: `${source}/packages/coding-agent/src/tools/approval.ts#L224-L233` },
            { text: 'OMP · 시작 이벤트와 예외의 오류 결과 변환', href: `${source}/packages/agent/src/agent-loop.ts#L2674-L2759` },
            { text: 'OMP · 같은 ID로 toolResult 생성', href: `${source}/packages/agent/src/agent-loop.ts#L2581-L2615` },
          ],
        },
      ],
    },
    {
      id: 'matching-and-precedence',
      title: '규칙의 순서가 허용 결과를 바꾼다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`tools.approval`은 도구 이름별 정책이고, `bash.patterns`는 명령 문자열별 정책입니다. Bash 패턴은 공백을 정규화하고 `*`만 와일드카드로 해석합니다. 일반 명령에서는 목록을 위에서부터 확인해 처음 일치하는 규칙을 사용합니다.',
        },
        {
          kind: 'code',
          language: 'yaml',
          caption: '프로젝트 `.omp/config.yml`에 둘 수 있는 승인 설정 · 일반 패턴보다 거부 패턴을 먼저 배치',
          code: `tools:
  approvalMode: write
bash:
  patterns:
    - match: "git push*"
      approval: deny
    - match: "git *"
      approval: allow`,
        },
        {
          kind: 'paragraph',
          text: '이 설정에서 `git push origin main`은 첫 번째 규칙에 따라 거부되고 `git status`는 두 번째 규칙에 따라 허용됩니다. 두 규칙의 순서를 바꾸면 범위가 넓은 `git *` 허용 규칙이 먼저 일치하므로 `git push origin main`도 허용됩니다. 뒤에 있는 구체적인 거부 규칙이 앞선 일치 결과를 덮어쓰지는 않습니다.',
        },
        {
          kind: 'paragraph',
          text: '복합 명령에는 추가 규칙이 적용됩니다. 기본 설정에서 `allow` 규칙은 셸 제어 구문이 들어 있는 명령을 허용하지 않지만, `deny`와 `prompt`는 명령 전체나 개별 구간에 일치할 수 있습니다. `bash.allowCompoundCommands: true`이고 명령이 POSIX 셸의 리터럴 `&&` 체인으로 해석되면 각 구간에 처음 일치한 결과를 모읍니다. 하나라도 `deny`이면 전체를 거부하고, 그다음으로 `prompt`를 반영합니다. 일치하는 규칙이 없는 구간은 일반 도구 정책과 승인 모드에 따라 판단합니다.',
        },
        {
          kind: 'subheading',
          id: 'approval-resolution-order',
          title: '명령 규칙 다음에는 공통 승인 해석기가 있다',
        },
        {
          kind: 'paragraph',
          text: 'Bash가 계산한 정책도 마지막에는 `resolveApproval()`이 해석합니다. 이 함수는 도구가 반환한 `deny`, 사용자 설정의 `deny`, 도구의 명시적 정책이나 강제 확인, 사용자 설정의 나머지 정책, 승인 모드에 따른 등급 비교 순으로 판단합니다. `yolo`는 등급에 따른 확인과 정책이 없는 `override`의 강제 확인을 생략하지만, 명시적인 `deny`와 `prompt`는 그대로 적용합니다. 따라서 `bash.patterns`에 지정한 `prompt`는 `yolo` 모드에서도 확인을 요청합니다.',
        },
        {
          kind: 'paragraph',
          text: '이 우선순위에서는 `tools.approval.bash: deny`가 Bash의 허용 규칙보다 강하지만, Bash가 반환한 명시적 `allow`는 사용자 설정의 `prompt`보다 먼저 적용됩니다. `autoApprove`는 승인 모드를 `yolo`로 바꿀 뿐 명시적 거부를 없애지는 않습니다. `xd://`처럼 다른 도구로 호출을 전달할 때는 `policyKey`에 지정된 정책을 먼저 확인하고, 유효한 값이 없으면 바깥 도구 이름의 정책을 사용합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · Bash 패턴 정규화와 첫 일치', href: `${source}/packages/coding-agent/src/tools/bash.ts#L224-L306` },
            { text: 'OMP · 복합 명령과 위험 패턴의 승인 판단', href: `${source}/packages/coding-agent/src/tools/bash.ts#L595-L680` },
            { text: 'OMP · 실제 공통 승인 우선순위', href: `${source}/packages/coding-agent/src/tools/approval.ts#L120-L219` },
            { text: 'OMP · autoApprove를 모드에 반영', href: `${source}/packages/coding-agent/src/extensibility/extensions/wrapper.ts#L196-L204` },
          ],
        },
        {
          kind: 'subheading',
          id: 'policy-configuration-layers',
          title: '어느 설정 파일을 읽었는지도 정책의 일부다',
        },
        {
          kind: 'paragraph',
          text: '승인 설정은 일반 설정과 같은 순서로 병합됩니다. 전역 에이전트 설정 위에 프로젝트의 `.omp/config.yml` 같은 프로젝트 설정, 추가 `--config` 오버레이, 런타임 재정의를 차례로 적용하며 뒤의 값이 앞의 값을 덮어씁니다. 객체는 깊게 병합하지만 배열은 통째로 교체합니다. 따라서 프로젝트의 `bash.patterns`는 전역 배열 뒤에 이어 붙지 않으며, 프로젝트의 `tools.approval.bash`는 전역의 같은 키를 바꿀 수 있습니다. 정책을 신뢰 경계로 사용하는 호스트는 프로젝트가 수정할 수 있는 설정과 호스트가 최종적으로 강제하는 정책을 구분해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 전역·프로젝트·오버레이·런타임 설정 계층', href: `${source}/packages/coding-agent/src/config/settings.ts#L480-L498` },
            { text: 'OMP · 프로젝트 설정 공급자 로딩', href: `${source}/packages/coding-agent/src/config/settings.ts#L1810-L1844` },
            { text: 'OMP · 병합 순서와 배열 교체', href: `${source}/packages/coding-agent/src/config/settings.ts#L2962-L3001` },
          ],
        },
      ],
    },
    {
      id: 'extension-and-interceptor',
      title: '확장 훅과 명령 인터셉터가 막는 것',
      blocks: [
        {
          kind: 'paragraph',
          text: '`tool_call` 확장 훅은 호출을 검사해 `{ block: true, reason }`을 반환하거나 실행 인자를 수정할 수 있습니다. 모델이 생성한 일반 호출에서는 세션이 이 훅을 인자 준비 단계에 연결합니다. 정책에서 이미 거부된 호출은 훅으로 보내지 않습니다. 훅이 인자를 바꾸면 루프가 스키마로 다시 검증하고, 승인 래퍼도 최종 인자로 정책을 다시 계산합니다. 승인 화면에는 이 최종 인자가 표시됩니다.',
        },
        {
          kind: 'paragraph',
          text: '핸들러는 확장 목록의 순서와 각 확장 안의 등록 순서대로 실행됩니다. 한 핸들러가 호출을 차단하면 나머지는 실행하지 않으며, 핸들러의 오류나 제한 시간 초과도 차단으로 처리합니다. 루프를 거치지 않는 중첩 `xd://` 호출과 직접 실행 경로에서는 래퍼가 훅을 호출합니다. 루프에서 이미 훅을 실행했다면 마커를 사용해 중복 호출을 피합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 세션의 사전 tool_call 연결과 이미 거부된 호출 처리', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L3990-L4035` },
            { text: 'OMP · 훅이 수정한 인자의 재검증', href: `${source}/packages/agent/src/agent-loop.ts#L2395-L2422` },
            { text: 'OMP · 확장 실행 순서와 실패 시 차단', href: `${source}/packages/coding-agent/src/extensibility/extensions/runner.ts#L1455-L1511` },
            { text: 'OMP · 직접 호출의 훅과 최종 인자 승인', href: `${source}/packages/coding-agent/src/extensibility/extensions/wrapper.ts#L185-L254` },
          ],
        },
        {
          kind: 'subheading',
          id: 'bash-interception',
          title: '전용 도구로 돌려보내는 Bash 인터셉터',
        },
        {
          kind: 'paragraph',
          text: '`bashInterceptor`는 `cat`이나 `grep` 같은 셸 명령 대신 `read`, `grep` 등의 전용 도구를 사용하도록 유도하는 기능이며 기본값은 비활성입니다. 이 기능을 켜면 `BashTool.execute`가 원래 명령과 앞에 붙은 `cd`를 정규화하고 정규식 규칙과 비교합니다. 규칙이 일치하면 실행 백엔드에 명령을 넘기기 전에 `ToolError`를 던집니다. 따라서 승인 게이트를 통과한 명령도 이 단계에서 중단될 수 있습니다.',
        },
        {
          kind: 'paragraph',
          text: '인터셉터는 추천할 전용 도구가 현재 호출 문맥에서 사용 가능할 때만 규칙을 적용하고, 첫 번째 일치에서 검사를 끝냅니다. 잘못된 정규식은 건너뜁니다. 파이프 앞부분의 출력을 입력으로 받는 구간은 전용 파일 도구로 바로 바꾸기 어려워 검사 대상에서 제외합니다. 이 기능은 셸의 파일·네트워크 접근을 차단하는 보안 경계가 아니라 특정 명령을 전용 도구로 유도하는 실행 규칙입니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · Bash 인터셉터 기본 비활성', href: `${source}/packages/coding-agent/src/config/settings-schema.ts#L4014-L4025` },
            { text: 'OMP · 정규식 컴파일 실패 처리', href: `${source}/packages/coding-agent/src/tools/bash-interceptor.ts#L23-L34` },
            { text: 'OMP · 파이프 입력, 가용 도구, 첫 일치 조건', href: `${source}/packages/coding-agent/src/tools/bash-interceptor.ts#L97-L148` },
            { text: 'OMP · 도구 본문 안의 인터셉터 집행 위치', href: `${source}/packages/coding-agent/src/tools/bash.ts#L1004-L1050` },
          ],
        },
      ],
    },
    {
      id: 'client-permission-gates',
      title: '연결된 클라이언트의 승인은 별도 경계다',
      blocks: [
        {
          kind: 'paragraph',
          text: 'ACP 클라이언트가 `requestPermission`을 지원하면 `SessionTools`는 `bash`, `edit`, `delete`, `move`에 추가 승인 프록시를 설치합니다. `edit`는 패치에서 삭제나 이동 의도를 발견했을 때만 ACP 확인을 요청합니다. 일반 텍스트 수정과 `write`는 ACP 승인 대상에 포함되지 않습니다. 앞에서 설명한 공통 승인 래퍼의 정책도 별도로 적용됩니다.',
        },
        {
          kind: 'paragraph',
          text: 'ACP는 `allow_once`, `allow_always`, `reject_once`, `reject_always`를 선택지로 제공합니다. 항상 허용하거나 거부하는 선택은 세션에 저장됩니다. Bash의 캐시 키는 개별 명령 문자열이 아니라 `bash`이므로, 한 명령에서 선택한 `allow_always`가 이후의 다른 Bash 명령에도 적용됩니다. 삭제와 이동은 각각 `edit:delete`, `edit:move`를 키로 사용합니다. 클라이언트를 바꿔 승인 게이트를 갱신하면 저장된 결정은 초기화됩니다.',
        },
        {
          kind: 'paragraph',
          text: '설정 스키마의 기본값인 `yolo`만으로 ACP 게이트가 생략되지는 않습니다. SDK·CLI의 `autoApprove` 또는 사용자가 명시한 `tools.approvalMode: yolo`가 있고, 해당 도구의 정책이 없거나 `allow`일 때만 이 추가 게이트를 건너뜁니다. 터미널에서 확인 창 없이 실행된 호출도 ACP 편집기에서는 승인을 요구할 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · ACP 대상 도구와 선택지', href: `${source}/packages/coding-agent/src/session/acp-permission-gate.ts#L6-L23` },
            { text: 'OMP · 파괴적 편집 감지와 캐시 키', href: `${source}/packages/coding-agent/src/session/acp-permission-gate.ts#L25-L99` },
            { text: 'OMP · ACP 프록시 조건, 결정 저장, 명시적 자동 승인', href: `${source}/packages/coding-agent/src/session/session-tools.ts#L697-L814` },
            { text: 'OMP · 클라이언트 변경 시 승인 캐시 초기화', href: `${source}/packages/coding-agent/src/session/session-tools.ts#L367-L378` },
          ],
        },
        {
          kind: 'subheading',
          id: 'provider-safety-checks',
          title: '제공자가 요청한 안전 확인',
        },
        {
          kind: 'paragraph',
          text: '컴퓨터 사용 호출에 제공자 메타데이터의 `pendingSafetyChecks`가 있으면 승인 래퍼가 별도의 확인을 요구합니다. `yolo`, 도구별 `allow`, 앞선 `xd://` 전달 단계의 승인으로 이 확인을 대신할 수는 없습니다. 대화형 UI가 없으면 호출은 실패하고, 사용자가 승인하면 호출 문맥에 `providerSafetyApproved`가 기록됩니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 컴퓨터 사용 안전 확인의 별도 조건', href: `${source}/packages/coding-agent/src/extensibility/extensions/wrapper.ts#L255-L346` },
          ],
        },
      ],
    },
    {
      id: 'trust-and-isolation',
      title: '호출 승인과 프로세스 격리를 구분하기',
      blocks: [
        {
          kind: 'paragraph',
          text: '지금까지 설명한 정책은 하네스의 도구 호출 경로를 통제합니다. 승인된 `bash` 명령이 실행된 뒤, 해당 프로세스가 수행하는 파일 접근이나 네트워크 연결까지 다시 승인하지는 않습니다. 일반 실행 경로는 명령과 `cwd`, 환경 변수, 취소 신호 등을 실행 백엔드에 전달합니다. 명령 문자열에 적용하는 승인 규칙은 운영체제 수준의 파일·네트워크 접근 제한을 대신하지 않습니다.',
        },
        {
          kind: 'paragraph',
          text: '작업 디렉터리도 파일 접근의 최상위 경계는 아닙니다. `read`는 절대 경로를 그대로 사용하고 상대 경로만 `path.resolve(cwd, path)`로 해석합니다. `..`로 작업 디렉터리 밖을 가리키는 경로도 일괄 거부하지 않습니다. 여러 도구가 같은 파일에 접근할 수 있다면 특정 도구 하나의 `deny` 정책만으로 그 파일을 보호할 수도 없습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 명령을 로컬 실행기로 전달', href: `${source}/packages/coding-agent/src/tools/bash.ts#L1513-L1540` },
            { text: 'OMP · 네이티브 셸에 넘기는 실행 옵션', href: `${source}/packages/coding-agent/src/exec/bash-executor.ts#L644-L658` },
            { text: 'OMP · 절대 경로와 cwd 상대 경로의 실제 처리', href: `${source}/packages/coding-agent/src/tools/path-utils.ts#L598-L626` },
          ],
        },
        {
          kind: 'subheading',
          id: 'trusted-runtime-code',
          title: '승인 래퍼 밖의 코드는 신뢰 대상이다',
        },
        {
          kind: 'paragraph',
          text: 'SDK 호스트가 `BUILTIN_TOOLS.read(session)`으로 도구를 직접 만들고 `execute`를 호출하면 세션 조립 단계의 승인 래퍼를 거치지 않습니다. 내장 도구와 같은 이름으로 등록된 확장도 `ctx.invokeTool(params)`를 통해 원래 구현을 직접 호출할 수 있습니다. 이 경로는 바깥 호출의 승인 문맥을 이어받으며, 새 인자에 대해 승인 게이트를 다시 실행하지 않습니다. 즉, 확장 코드와 SDK 호스트는 모델이 생성한 호출보다 높은 신뢰를 받는 실행 코드입니다.',
        },
        {
          kind: 'paragraph',
          text: '`xd://` 전달 호출은 중복 확인을 피하려고 앞선 승인 정보를 이어받을 수 있습니다. 다만 명시적 `prompt`, 도구가 요구한 강제 확인, 내부 훅의 인자 변경이 있으면 다시 확인합니다. 반면 신뢰된 확장이 원래 내장 구현을 직접 호출하는 경로에는 이러한 재승인 단계가 없습니다. 승인 범위를 파악하려면 각 진입점이 어떤 래퍼와 승인 문맥을 거치는지 확인해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 직접 호출 가능한 내장 팩터리', href: `${source}/packages/coding-agent/src/tools/index.ts#L455-L464` },
            { text: 'OMP · 동일 이름 확장의 원래 구현 위임', href: `${source}/packages/coding-agent/src/extensibility/extensions/runner.ts#L559-L596` },
            { text: 'OMP · xd:// 중복 승인 생략 조건', href: `${source}/packages/coding-agent/src/extensibility/extensions/wrapper.ts#L255-L269` },
          ],
        },
        {
          kind: 'subheading',
          id: 'workspace-isolation',
          title: '작업 트리 분리는 호스트 접근 제한과 다르다',
        },
        {
          kind: 'paragraph',
          text: 'OMP의 격리된 서브에이전트는 별도 작업 트리에서 자식 작업을 실행한 뒤 변경분을 원래 작업 공간으로 가져옵니다. `ensureIsolation()`은 백엔드가 만든 `mergedDir`와 분리된 Git 메타데이터를 준비하고, `runIsolatedSubprocess()`는 이 경로를 자식의 `worktree`로 전달합니다. 이 기능의 목적은 병렬 작업 사이의 파일·Git 상태 충돌을 줄이고 변경분을 회수하는 것입니다.',
        },
        {
          kind: 'paragraph',
          text: '호스트 자원 접근까지 제한하려면 별도의 실행 환경이 필요합니다. 파일 시스템은 허용한 경로만 보이는 마운트나 OS 접근 제어로, 네트워크는 연결 경로의 정책으로, 자격 증명은 환경 변수·설정 파일·소켓의 전달 제한으로 보호해야 합니다. 실제 격리 범위는 컨테이너나 VM의 종류뿐 아니라 공유한 경로와 부여한 권한에 따라 달라집니다. 프로세스나 작업 트리를 분리하는 것만으로 이러한 제한이 생기지는 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 격리 뷰 생성과 Git 메타데이터 분리', href: `${source}/packages/coding-agent/src/task/worktree.ts#L495-L543` },
            { text: 'OMP · 자식 작업의 격리 경로와 변경분 수집', href: `${source}/packages/coding-agent/src/task/isolation-runner.ts#L179-L235` },
          ],
        },
      ],
    },
  ],
};
