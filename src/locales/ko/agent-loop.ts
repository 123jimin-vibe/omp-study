import type { Topic } from '../../content.ts';

const source = 'https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec';

export const agentLoopTopic: Topic = {
  id: 'agent-loop',
  number: '06',
  title: '에이전트 루프',
  description: '도구 결과를 다음 모델 요청에 넣어 조사·수정·확인을 이어 가는 반복.',
  sections: [
    {
      id: 'round-trip',
      title: '결과를 본 뒤에 다음 작업을 고른다',
      blocks: [
        { kind: 'paragraph', text: '사용자가 “평균 계산에서 0점도 포함하도록 고치고 테스트해 줘”라고 요청했다고 합시다. 모델은 먼저 관련 파일을 읽고, 확인한 구현에 맞춰 수정 도구를 호출합니다. 에이전트 루프는 모델 요청 → 도구 실행 → 결과 추가를 반복하며, 각 도구의 결과를 다음 모델 요청에 전달합니다.' },
        { kind: 'tool-sequence', title: '도구 결과가 다음 모델 요청의 입력이 된다', prompt: '`average`가 `[0, 100]`에서 `100`을 반환하는 버그를 고쳐 줘.', actors: ['모델', '에이전트 루프', '도구 구현'], events: [
          { from: 1, to: 0, label: '첫 모델 요청', detail: '사용자 요구, 대화 기록, 시스템 지침과 사용 가능한 도구를 전달합니다.', kind: 'request' },
          { from: 0, to: 1, label: '읽기 호출', detail: '모델이 `read`를 호출해 평균 계산 코드를 요청합니다.', kind: 'call', correlation: 'read-1' },
          { from: 1, to: 2, label: '읽기 실행', detail: '인자를 검증한 뒤 등록된 `read` 구현을 호출합니다.', kind: 'read', correlation: 'read-1' },
          { from: 2, to: 1, label: '읽기 결과', detail: '`filter(Boolean)`이 0을 제거하는 현재 구현을 반환합니다.', kind: 'result', correlation: 'read-1' },
          { from: 1, to: 0, label: '두 번째 모델 요청', detail: '기존 대화에 `read` 호출과 해당 `toolResult`를 추가합니다.', kind: 'request', correlation: 'read-1' },
          { from: 0, to: 1, label: '수정 호출', detail: '모델이 읽은 코드를 바탕으로 0점 필터를 없애는 `edit` 호출을 생성합니다.', kind: 'call', correlation: 'edit-1' },
        ] },
        { kind: 'paragraph', text: '`packages/agent`는 대화 내용을 `AgentMessage`로 보관합니다. 모델을 호출하기 직전에 `transformContext`, `convertToLlm`, 공급자별 정규화를 차례로 적용하고, 시스템 프롬프트·메시지·정규화된 도구를 `Context`로 묶습니다. 필요한 경우 `transformProviderContext`까지 적용한 뒤 응답 스트림을 시작합니다. 하네스가 입력과 실행 가능한 도구를 준비하면 모델은 그 안에서 다음 행동을 선택합니다.' },
        { kind: 'references', links: [
          { text: '공급자 입력 준비', href: `${source}/packages/agent/src/agent-loop.ts#L1593-L1639` },
          { text: '실제 스트림 함수 호출', href: `${source}/packages/agent/src/agent-loop.ts#L1749-L1763` },
          { text: '실행 결과를 이력에 추가', href: `${source}/packages/agent/src/agent-loop.ts#L1437-L1453` },
        ] },
      ],
    },
    {
      id: 'stream-and-dispatch',
      title: '인자가 보이는 시점과 실행되는 시점',
      blocks: [
        { kind: 'paragraph', text: '도구 이름과 JSON 인자는 응답 스트림에서 여러 조각으로 도착할 수 있습니다. `toolcall_start`, `toolcall_delta`, `toolcall_end`는 호출 하나가 만들어지는 과정을 나타냅니다. `openArgStream`을 제공하는 도구는 완성 전의 인자 조각을 받을 수 있지만, 일반 도구의 `execute`는 이 시점에 실행되지 않습니다. 인자 스트림 처리와 도구 실행은 별도 단계입니다.' },
        { kind: 'paragraph', text: '모델 응답 스트림이 끝나면 루프는 완성된 호출만 담은 최종 `assistant` 메시지를 만듭니다. `transformAssistantMessage`를 적용한 뒤 호출 순서대로 도구를 찾고, 인자를 검증한 다음 `beforeToolCall`을 실행합니다. 훅이 인자를 바꾸면 새 인자를 다시 검증하고 호출 메시지도 수정합니다. 이후 스케줄링, 화면 표시, 기록, 실행에는 모두 수정된 호출을 사용합니다.' },
        { kind: 'paragraph', text: '스키마 검증에 실패하면 오류 결과를 만들고 `execute`는 호출하지 않습니다. `lenientArgValidation`을 켠 도구만 검증 실패 뒤에도 원시 인자를 구현에 넘길 수 있습니다. 검증을 통과하더라도 사전 훅이 차단하면 실행하지 않습니다. 실행 중 발생한 예외와 도구가 반환한 `isError`도 오류 결과로 정리해 다음 모델 요청에 넣습니다.' },
        { kind: 'execution-path', title: '같은 편집 의도, 다른 실행 경계', input: { label: '읽기는 끝난 상태', text: '모델이 0점 필터를 제거하려고 `edit` 호출을 냈습니다. 일반 스키마 검증을 사용하는 경로를 비교합니다.' }, labels: { choose: '호출 상태' }, paths: [
          { label: '유효한 호출', stages: [
            { label: '완료된 호출', text: '필수 필드와 편집 내용이 갖춰진 인자입니다.', state: 'complete' },
            { label: '인자 검증', text: '스키마를 통과하고 사전 훅도 허용합니다.', state: 'complete' },
            { label: '구현 실행', text: '도구가 기준 내용을 확인하고 변경을 적용합니다.', state: 'complete' },
            { label: '다음 모델 입력', text: '성공한 `toolResult`를 포함하여 다음 요청을 만듭니다.', state: 'complete' },
          ], result: { label: '이어서 선택할 작업', text: '모델은 적용 결과를 보고 테스트 호출을 만들 수 있습니다.' } },
          { label: '스키마 위반', stages: [
            { label: '완료된 호출', text: '응답은 끝났지만 도구 스키마의 필수 필드가 빠졌습니다.', state: 'complete' },
            { label: '인자 검증', text: '누락된 필수 필드를 검증 오류로 기록합니다.', state: 'blocked' },
            { label: '구현 실행', text: '`execute`를 호출하지 않아 이 호출은 파일을 바꾸지 않습니다.', state: 'skipped' },
            { label: '다음 모델 입력', text: '`isError: true`인 결과에 검증 오류를 담아 돌려줍니다.', state: 'complete' },
          ], result: { label: '이어서 선택할 작업', text: '모델은 누락된 필드를 채운 새 호출을 만들 수 있습니다.' } },
          { label: '편집 적용 실패', stages: [
            { label: '완료된 호출', text: '호출 형식과 필수 필드는 올바릅니다.', state: 'complete' },
            { label: '인자 검증', text: '스키마와 사전 훅을 통과합니다.', state: 'complete' },
            { label: '구현 실행', text: '파일 내용이 달라 기준 내용을 찾지 못했다는 오류를 반환합니다.', state: 'blocked' },
            { label: '다음 모델 입력', text: '검증 오류가 아니라 실제 편집 구현의 오류 결과를 전달합니다.', state: 'complete' },
          ], result: { label: '이어서 선택할 작업', text: '모델은 파일을 다시 읽고 현재 내용에 맞춘 편집을 만들 수 있습니다.' } },
        ] },
        { kind: 'references', links: [
          { text: '최종 메시지와 실행 준비', href: `${source}/packages/agent/src/agent-loop.ts#L1845-L1896` },
          { text: '인자 스트림 처리', href: `${source}/packages/agent/src/agent-loop.ts#L1906-L1950` },
          { text: '검증·훅·재검증', href: `${source}/packages/agent/src/agent-loop.ts#L2334-L2424` },
          { text: '검증 오류의 결과화', href: `${source}/packages/agent/src/agent-loop.ts#L2648-L2661` },
          { text: '구현 호출과 예외 처리', href: `${source}/packages/agent/src/agent-loop.ts#L2700-L2759` },
        ] },
      ],
    },
    {
      id: 'scheduling',
      title: '한 응답 안의 호출은 어떻게 배치되는가',
      blocks: [
        { kind: 'paragraph', text: '하나의 `assistant` 메시지에는 여러 도구 호출이 들어갈 수 있습니다. OMP 루프는 각 도구의 `concurrency`를 확인해 호출을 `shared` 또는 `exclusive`로 배치합니다. `shared` 호출은 앞선 배타 호출이 끝난 뒤 다른 공유 호출과 함께 실행할 수 있습니다. `exclusive` 호출은 앞서 예약된 호출이 모두 끝날 때까지 기다리며, 뒤의 호출도 이 배타 호출이 끝난 뒤 시작합니다. 값을 지정하지 않은 도구는 `shared`로 처리합니다.' },
        { kind: 'code', language: 'text', caption: '한 `assistant` 메시지의 호출 순서와 실행 장벽', code: '호출 순서: read A → read B → edit → read C\n\n실행:      read A ─┐\n           read B ─┴─→ edit ─→ read C\n           shared     exclusive  shared' },
        { kind: 'paragraph', text: '`coding-agent`의 `edit`는 `exclusive`입니다. `bash`는 `pty: true`일 때만 `exclusive`이고 그 밖에는 `shared`입니다. `concurrency`가 함수이면 검증과 훅 수정이 끝난 인자를 넘겨 실행 방식을 계산합니다. 이 함수에서 예외가 발생하면 안전을 위해 `exclusive`로 처리합니다.' },
        { kind: 'paragraph', text: '실행 장벽은 호출 순서만 조정합니다. 앞선 호출의 출력을 뒤 호출의 인자에 넣거나, 앞선 호출이 실패했을 때 나머지를 자동으로 취소하지는 않습니다. `edit`와 테스트 호출을 같은 응답에 넣으면 테스트가 편집 완료 뒤에 실행되도록 할 수 있습니다. 그러나 편집 결과를 모델이 확인한 뒤 테스트 명령을 고르게 하려면 모델 요청을 한 번 더 해야 합니다.' },
        { kind: 'paragraph', text: '동시에 실행한 `shared` 호출의 결과는 완료된 순서대로 도착할 수 있습니다. 각 결과는 `toolCallId`로 원래 호출과 연결해야 하며, 배열 위치에 의존하면 안 됩니다. 이 스케줄러는 여러 에이전트의 모델 HTTP 요청 수를 제한하는 제공자 동시성 제어와 별개입니다. `coding-agent`는 응답 스트림 함수를 제공자 동시성 제한기로 감쌉니다.' },
        { kind: 'references', links: [
          { text: '공유·배타 스케줄러', href: `${source}/packages/agent/src/agent-loop.ts#L2903-L2953` },
          { text: '편집 도구의 배타 선언', href: `${source}/packages/coding-agent/src/edit/index.ts#L329-L335` },
          { text: 'PTY 여부에 따른 bash 동시성', href: `${source}/packages/coding-agent/src/tools/bash.ts#L704-L712` },
          { text: '결과 메시지와 호출 식별자', href: `${source}/packages/agent/src/agent-loop.ts#L2581-L2619` },
          { text: '모델 요청 단위의 동시성 제한', href: `${source}/packages/coding-agent/src/sdk.ts#L3503-L3508` },
        ] },
      ],
    },
    {
      id: 'continuation',
      title: '무엇이 다음 요청을 만들고 무엇이 멈추는가',
      blocks: [
        { kind: 'paragraph', text: '도구 결과는 `role: "toolResult"`, `toolCallId`, `toolName`, `content`, `isError`를 가진 메시지로 저장됩니다. 실행 중 출력은 `tool_execution_update` 이벤트로 화면에 보낼 수 있지만, 모델에는 도구 배치가 끝난 뒤 완성된 결과 메시지를 전달합니다. 따라서 화면에 표시된 중간 출력과 다음 모델 요청에 들어가는 최종 결과가 다를 수 있습니다.' },
        { kind: 'paragraph', text: '모델 응답의 종료 사유가 `toolUse` 또는 `stop`이고 실행할 도구 호출이 남아 있으면, 루프는 도구를 실행한 뒤 모델을 다시 호출합니다. 호출 없이 답변이 끝나고 대기 중인 입력도 없으면 `agent_end`에 도달합니다. 도구가 실패하면 대개 오류 결과를 모델에 보여 주고 다음 행동을 받습니다. 최종 `assistant` 상태가 `error` 또는 `aborted`이면 현재 루프 실행을 종료합니다.' },
        { kind: 'paragraph', text: '`length`처럼 도구를 실행할 수 없는 종료 사유가 오면 남은 호출에는 실제 실행 결과 대신 합성 결과를 붙입니다. 길이 제한으로 잘린 호출은 이 결과를 전달한 뒤 모델을 다시 호출할 수 있으며, 제공자의 `pause_turn`도 정해진 횟수 안에서 이어 갑니다. 설정된 `deadline`이나 호출 전 게이트도 루프를 중단할 수 있으므로, 모델의 텍스트 생성이 끝난 시점과 전체 작업이 끝난 시점을 구분해야 합니다.' },
        { kind: 'references', links: [
          { text: 'assistant 오류·중단과 합성 결과', href: `${source}/packages/agent/src/agent-loop.ts#L1318-L1363` },
          { text: '실행 가능한 종료 사유', href: `${source}/packages/agent/src/agent-loop.ts#L1381-L1391` },
          { text: '길이 제한·pause_turn 처리', href: `${source}/packages/agent/src/agent-loop.ts#L1454-L1505` },
          { text: '최종 대기열 확인과 종료', href: `${source}/packages/agent/src/agent-loop.ts#L1526-L1555` },
        ] },
      ],
    },
    {
      id: 'interrupts-and-queues',
      title: '새 입력과 취소는 같은 신호가 아니다',
      blocks: [
        { kind: 'paragraph', text: '`steer`는 진행 중인 작업의 방향을 바꾸는 입력이고, `followUp`은 현재 작업이 끝난 뒤 처리할 입력입니다. “테스트만 하고 추가 편집은 하지 마”는 `steer`, “끝나면 변경 설명도 작성해 줘”는 `followUp`에 해당합니다. 루프는 현재 도구 배치가 끝난 뒤 `steer`를 다음 모델 요청에 넣고, 실행할 호출이 더 없을 때 `followUp`을 꺼냅니다. `coding-agent`의 기본 큐 모드는 둘 다 `one-at-a-time`이며 설정으로 `all`을 선택할 수 있습니다.' },
        { kind: 'paragraph', text: '기본 `interruptMode: "immediate"`에서도 이미 생성된 호출을 모두 폐기하지는 않습니다. 새 입력을 감지하면 대기 중인 `interruptible` 도구에 중단 신호를 보내고, 아직 시작하지 않은 해당 호출은 건너뜁니다. 다른 도구는 실행 중이거나 배치에서 기다리는 상태여도 계속 진행합니다. 이 도구들에는 협조적 중단 신호인 `steeringSignal`을 전달하므로 구현이 직접 중단 여부를 결정할 수 있습니다. `wait` 모드는 현재 도구 배치가 끝날 때까지 기다립니다.' },
        { kind: 'paragraph', text: '따라서 편집 호출이 이미 배치에 들어간 뒤 “편집하지 마”를 `steer`로 보내도 해당 편집이 실행될 수 있습니다. 새 입력은 다음 모델 판단부터 반영됩니다. 현재 실행 전체를 멈추려면 `Agent.abort`를 사용해야 하며, 이 취소 신호는 모델 요청과 일반 도구에 전달됩니다. 취소 전에 파일이나 프로세스에 생긴 변화는 자동으로 되돌리지 않습니다.' },
        { kind: 'paragraph', text: '취소 신호가 도착하기 전에 도구가 실행을 마쳤다면 실제 성공·실패 결과를 보존합니다. 실행 도중 중단된 호출과 시작하지 않은 호출은 결과 메타데이터로 구별합니다. 모델 스트림이 끊겨 실행하지 못한 호출에는 합성 결과를 붙여 호출과 결과의 짝을 맞춥니다. 외부 취소가 발생하면 `steer`와 `followUp` 큐를 소비하지 않으므로 입력은 다음 실행에 남습니다.' },
        { kind: 'references', links: [
          { text: '입력 큐 API와 취소 API', href: `${source}/packages/agent/src/agent.ts#L989-L1006` },
          { text: '실행 취소 신호', href: `${source}/packages/agent/src/agent.ts#L1103-L1105` },
          { text: 'coding-agent 큐·중단 설정', href: `${source}/packages/coding-agent/src/sdk.ts#L3549-L3551` },
          { text: '강제·협조적 신호의 분리', href: `${source}/packages/agent/src/agent-loop.ts#L2459-L2476` },
          { text: 'steering 감지와 대기 생략 경계', href: `${source}/packages/agent/src/agent-loop.ts#L2550-L2578` },
          { text: '일반 호출은 계속 실행', href: `${source}/packages/agent/src/agent-loop.ts#L2622-L2641` },
          { text: '완료된 실제 결과 보존', href: `${source}/packages/agent/src/agent-loop.ts#L2800-L2818` },
          { text: '큐 주입과 외부 취소 시 보존', href: `${source}/packages/agent/src/agent-loop.ts#L1507-L1548` },
        ] },
      ],
    },
  ],
};
