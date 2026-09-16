import type { Topic } from '../../content.ts';

const source = 'https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec';

export const sessionRuntimeTopic: Topic = {
  id: 'session-runtime',
  number: '04',
  title: '세션 런타임',
  description: '모델·도구·대화 기록을 묶어 한 작업의 실행 수명을 관리하는 객체.',
  sections: [
    {
      id: 'constructing-a-session',
      title: '세션을 조립하는 팩터리',
      blocks: [
        {
          kind: 'paragraph',
          text: '세션은 한 작업 대화의 모델·도구·환경·기록을 연결하는 실행 단위입니다. SDK의 `createAgentSession(options)`가 이 구성을 조립하고, 반환값의 `session`으로 완성된 `AgentSession`을 제공합니다.',
        },
        {
          kind: 'paragraph',
          text: '팩터리는 작업 디렉터리와 설정을 확인하고 인증 저장소와 `ModelRegistry`를 준비합니다. `options.sessionManager`가 없으면 JSONL 파일에 기록을 저장하는 기본 `SessionManager`를 만듭니다. 기존 기록이 있으면 `buildSessionContext()`로 현재 대화를 복원합니다. 이어 도구와 시스템 프롬프트를 준비해 `Agent`를 만들고, 이 객체들과 서비스들을 `new AgentSession(config)`에 전달합니다.',
        },
        {
          kind: 'exchange',
          input: { label: '`createAgentSession(options)`', text: '`cwd` + 모델·도구 선택 + 설정·확장 + 새 기록 또는 기존 기록' },
          outputs: [
            { label: 'AgentSession · 작업의 수명', text: '`prompt`, `abort`, `subscribe`, `dispose`\n이미 만들어진 `Agent`와 `SessionManager`를 연결하고 세션 차원의 처리를 조정' },
            { label: 'Agent · 실행 중인 대화', text: '`systemPrompt`, `model`, `tools`, `messages`\n모델·도구 반복을 실행하고 현재 진행 상태를 보유' },
            { label: 'SessionManager · 대화 기록', text: '메시지와 설정 변경의 기록, 현재 분기 선택\n저장된 항목에서 실행에 사용할 대화를 재구성' },
          ],
        },
        {
          kind: 'paragraph',
          text: '`AgentSession` 생성자는 `config.agent`와 `config.sessionManager`를 받아 둘 사이의 이벤트 구독을 연결합니다. `createAgentSession`의 반환값에는 완성된 `session` 외에도 확장 로딩 결과, 도구 UI 연결 함수인 `setToolUIContext`, 공유 `eventBus` 등이 들어 있습니다. 터미널 UI나 SDK 호출자는 이 조립 결과를 사용합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · createAgentSession의 진입점과 설정·인증 구성', href: `${source}/packages/coding-agent/src/sdk.ts#L1305-L1355` },
            { text: 'OMP · 기록 저장소와 기존 대화 준비', href: `${source}/packages/coding-agent/src/sdk.ts#L1435-L1498` },
            { text: 'OMP · Agent 생성과 기존 메시지 복원', href: `${source}/packages/coding-agent/src/sdk.ts#L3527-L3548` },
            { text: 'OMP · 복원된 대화를 Agent에 적용', href: `${source}/packages/coding-agent/src/sdk.ts#L3624-L3646` },
            { text: 'OMP · AgentSession 생성자의 입력', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L1223-L1239` },
            { text: 'OMP · SDK 반환값의 실제 타입', href: `${source}/packages/coding-agent/src/sdk.ts#L661-L681` },
          ],
        },
      ],
    },
    {
      id: 'live-state-and-history',
      title: '현재 상태와 저장된 기록',
      blocks: [
        {
          kind: 'paragraph',
          text: '`session.state`는 `session.agent.state`를 그대로 반환합니다. 여기에는 현재 모델, 시스템 프롬프트, 도구, 완료 메시지와 스트리밍 중인 메시지가 있습니다. `AgentSession`은 입력 준비, 후속 처리, 취소와 자원 정리처럼 실행 전후의 조정을 맡고, `SessionManager`는 나중에 대화를 복원할 수 있도록 완료된 기록을 관리합니다.',
        },
        {
          kind: 'exchange',
          input: { label: 'average.ts를 수정하는 중', text: '파일 읽기 결과는 완료했고, 모델은 다음 응답을 생성 중' },
          outputs: [
            { label: '완료한 대화', text: '`Agent.state.messages`에 사용자 요청·도구 호출·읽기 결과가 있음' },
            { label: '진행 중인 실행', text: '`streamMessage`에 생성 중 응답이 있고 `isStreaming`이 켜짐\n`pendingToolCalls`는 실행 중 도구 호출 ID를 추적' },
            { label: '재개할 기록', text: '`SessionManager`의 활성 분기에 완료 메시지가 남음\n생성 중 텍스트 조각은 아직 완료 메시지 기록이 아님' },
          ],
        },
        {
          kind: 'subheading',
          id: 'active-model-and-tools',
          title: '등록된 것과 현재 사용하는 것',
        },
        {
          kind: 'paragraph',
          text: '`ModelRegistry`는 사용 가능한 여러 모델을 보관하지만, 현재 요청에 쓰이는 모델은 `session.model`, 즉 `Agent.state.model`입니다. 모델을 따로 지정하지 않았다면 팩터리는 기존 세션의 모델을 먼저 복원하고, 실패하면 설정의 기본 모델 등을 차례로 확인합니다. 저장된 모델을 복원할 수 없으면 반환값의 `modelFallbackMessage`에 안내 문구를 담을 수 있습니다. 인증 정보는 모델 레지스트리가 요청할 때마다 확인해 전달합니다.',
        },
        {
          kind: 'paragraph',
          text: '도구에도 등록된 목록과 현재 사용할 목록이 따로 있습니다. `getActiveToolNames()`는 모델 요청의 최상위 목록에 노출된 도구를 반환합니다. `getEnabledToolNames()`에는 최상위 도구와 동적으로 찾을 수 있는 도구가 모두 포함되고, `getMountedXdevToolNames()`는 `xd://` 아래에 배치된 도구만 반환합니다. 현재 모델이 직접 볼 수 있는 도구를 표시하려면 전체 레지스트리가 아니라 활성 목록을 사용해야 합니다.',
        },
        {
          kind: 'paragraph',
          text: '기본 파일 저장에서 기록 항목은 `id`와 `parentId`로 트리를 만들고 현재 끝점이 활성 경로를 정합니다. `buildSessionContext()`는 모든 분기를 합치는 대신 선택된 경로에서 대화를 구성합니다. 저장소 구현은 교체할 수 있어 기본 JSONL 파일 외의 방식으로도 기록을 관리할 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · AgentState의 실제 필드', href: `${source}/packages/agent/src/types.ts#L664-L678` },
            { text: 'OMP · session.state와 session.model', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L4972-L4980` },
            { text: 'OMP · 저장된 모델 복원과 설정 기본값', href: `${source}/packages/coding-agent/src/sdk.ts#L1539-L1592` },
            { text: 'OMP · 요청별 인증 해결 함수 연결', href: `${source}/packages/coding-agent/src/sdk.ts#L3562-L3564` },
            { text: 'OMP · 활성·활성화·동적 도구 목록', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L5198-L5211` },
            { text: 'OMP · 도구 선택 API', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L5340-L5343` },
            { text: 'OMP · 기록 트리와 영속화 경계', href: `${source}/packages/coding-agent/src/session/session-manager.ts#L453-L464` },
            { text: 'OMP · 활성 경로의 컨텍스트 구성', href: `${source}/packages/coding-agent/src/session/session-manager.ts#L2617-L2631` },
            { text: 'OMP · 교체 가능한 SessionStorage', href: `${source}/packages/coding-agent/src/session/session-manager.ts#L2812-L2822` },
          ],
        },
      ],
    },
    {
      id: 'preparing-a-prompt',
      title: '입력이 모델 요청이 되기까지',
      blocks: [
        {
          kind: 'paragraph',
          text: '`session.prompt(text, options)`는 모델을 호출하기 전에 확장 명령과 사용자 정의 명령을 확인하고 프롬프트 템플릿을 펼칩니다. 명령이 로컬 처리만으로 끝나면 모델을 호출하지 않고 `false`를 반환합니다. 일반 요청은 이미지와 파일 멘션 등을 처리해 사용자 메시지로 만든 뒤 코어 에이전트에 전달합니다.',
        },
        {
          kind: 'paragraph',
          text: '예를 들어 `@average.ts`가 포함된 요청은 파일 멘션 처리 단계에서 해당 파일을 읽어 추가 메시지로 넣습니다. 이어 `before_agent_start` 확장이 메시지나 이번 실행의 시스템 프롬프트를 보완합니다. 필요한 컨텍스트 정리를 마치면 세션이 준비된 입력을 코어 `Agent`에 넘겨 실행을 시작합니다.',
        },
        {
          kind: 'tool-sequence',
          title: '세션의 입력 처리와 코어 실행 사이',
          prompt: '`@average.ts`에서 0점을 제외하는 로직을 수정해 줘.',
          actors: ['SDK 호출자', 'AgentSession', 'Agent'],
          events: [
            { from: 0, to: 1, kind: 'request', label: '`prompt(text)`', detail: '파일 멘션이 있는 일반 사용자 요청' },
            { from: 1, to: 2, kind: 'request', label: '준비된 메시지 전달', detail: '사용자 요청 + 파일 멘션의 내용 + 실행 전 준비 결과\n기존 대화를 가진 코어 `Agent`가 모델·도구 반복을 시작' },
            { from: 2, to: 1, kind: 'result', label: '실행 이벤트', detail: '`message_update`, `message_end`, 도구 이벤트 등' },
            { from: 1, to: 0, kind: 'result', label: '구독자 알림', detail: '호출자는 생성 중 텍스트와 실행 진행을 표시' },
            { from: 2, to: 1, kind: 'answer', label: '코어 실행 완료', detail: '세션은 필요한 후속 처리를 이어서 정리' },
            { from: 1, to: 0, kind: 'answer', label: '`prompt` 반환', detail: '이 일반 요청은 실행을 거쳐 `true` 반환\n답변 내용은 이벤트와 세션 메시지에 있음' },
          ],
        },
        {
          kind: 'paragraph',
          text: '모델을 다시 호출할 때마다 메시지는 한 번 더 변환됩니다. `transformContext`가 확장의 컨텍스트 변환과 `steer` 입력 처리를 적용하고, `convertToLlm`이 내부 메시지를 LLM 메시지로 바꿉니다. 그 뒤 시스템 프롬프트와 도구를 포함한 제공자용 컨텍스트를 만들고 `transformProviderContext`를 적용합니다. 현재 모델이 이미지를 지원하지 않는다면 SDK는 이미지 블록을 안내 텍스트로 바꿉니다. 따라서 저장된 대화와 API에 보내기 직전의 요청 데이터는 다를 수 있습니다.',
        },
        {
          kind: 'paragraph',
          text: '이미 실행 중인 세션에 입력을 추가하려면 `streamingBehavior`를 지정해야 합니다. 현재 구현은 `steer`, `followUp`, `aside`에 따라 입력을 큐에 넣고 `true`를 반환하며, 옵션 없이 보내면 `AgentBusyError`가 발생합니다. 이때의 `true`는 입력을 큐에 넣었다는 뜻이지, 그 입력에 대한 답변이 완성됐다는 뜻이 아닙니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · prompt 반환 계약과 명령·템플릿 처리', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L6094-L6150` },
            { text: 'OMP · 실행 중 입력의 큐 처리', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L6169-L6181` },
            { text: 'OMP · 파일 멘션과 before_agent_start', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L6476-L6543` },
            { text: 'OMP · 실행 전 컨텍스트 정리와 후처리 대기', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L6577-L6615` },
            { text: 'OMP · SDK의 메시지 변환과 이미지 처리', href: `${source}/packages/coding-agent/src/sdk.ts#L3385-L3417` },
            { text: 'OMP · 제공자 요청 전 변환 순서', href: `${source}/packages/agent/src/agent-loop.ts#L1593-L1627` },
          ],
        },
      ],
    },
    {
      id: 'subscribing-to-events',
      title: '응답을 기다리면서 진행을 받기',
      blocks: [
        {
          kind: 'paragraph',
          text: '`session.subscribe(listener)`는 이벤트 리스너를 등록하고 그 리스너만 해제하는 함수를 반환합니다. 텍스트가 늘어나는 순간은 `message_update`, 하나의 메시지가 완료되는 순간은 `message_end`입니다. 사용자 메시지와 도구 결과에도 메시지 시작·완료 이벤트가 발생합니다. 응답 텍스트만 표시하려면 이벤트 종류뿐 아니라 메시지 안의 콘텐츠 종류도 확인해야 합니다.',
        },
        {
          kind: 'exchange',
          input: { label: '하나의 세션 이벤트 흐름', text: '`session.subscribe(listener)`\n실행·메시지·도구의 경계를 서로 다르게 해석' },
          outputs: [
            { label: '텍스트 표시', text: '`message_update` 안의 `text_delta`\n이미 표시한 글에 새 텍스트를 덧붙임' },
            { label: '도구 진행 표시', text: '`tool_execution_start` → 갱신 → `tool_execution_end`\n`toolCallId`로 같은 도구 실행의 상태를 연결' },
            { label: '대화·실행 완료', text: '`message_end`는 한 메시지의 완료\n`turn_end`는 한 응답과 관련 도구 처리의 경계\n`agent_end`는 코어 실행의 종료를 세션이 전달하는 이벤트' },
          ],
        },
        {
          kind: 'paragraph',
          text: '세션은 코어 이벤트에 자동 컨텍스트 정리, 재시도, 모델 변경 등의 이벤트를 더합니다. 세션이 후속 실행을 예정한 경우 `agent_end`의 `isTerminal`은 `false`입니다. 이 이벤트를 무조건 전체 작업의 종료로 처리하면 뒤이은 응답을 놓칠 수 있습니다. `waitForIdle()`은 현재 코어 실행과 세션의 후속 처리가 모두 끝날 때까지 기다립니다.',
        },
        {
          kind: 'paragraph',
          text: '기록 저장은 내부 구독자가 맡으므로 화면 리스너가 메시지를 따로 저장할 필요가 없습니다. 터미널 UI의 `EventController`는 잦은 `message_update`를 모아 화면을 갱신하고, 완료 이벤트를 처리하기 전에 아직 반영하지 않은 갱신부터 처리합니다. 생성 속도와 화면 갱신 속도를 분리하면서도 마지막 텍스트가 완료 표시보다 늦게 나타나지 않게 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 구독과 리스너별 해제', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L4296-L4311` },
            { text: 'OMP · 메시지·턴·도구 이벤트 타입', href: `${source}/packages/agent/src/types.ts#L889-L915` },
            { text: 'OMP · 세션 추가 이벤트와 isTerminal', href: `${source}/packages/coding-agent/src/session/agent-session-events.ts#L11-L50` },
            { text: 'OMP · 후속 실행 여부를 반영한 agent_end 전달', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L3277-L3292` },
            { text: 'OMP · 세션 waitForIdle', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L5134-L5139` },
            { text: 'OMP · 내부 이벤트 구독', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L1920-L1924` },
            { text: 'OMP · 터미널의 갱신 병합과 완료 순서', href: `${source}/packages/coding-agent/src/modes/controllers/event-controller.ts#L585-L615` },
          ],
        },
      ],
    },
    {
      id: 'completion-abort-dispose',
      title: '작업을 멈추는 것과 세션을 닫는 것',
      blocks: [
        {
          kind: 'paragraph',
          text: '일반 요청이 끝나면 같은 세션에 다음 요청을 보낼 수 있습니다. `abort()`는 진행 중인 작업을 중단하고 정리하는 연산이고, `dispose()`는 이 세션을 더 이상 쓰지 않을 때 자원과 구독을 해제하는 연산입니다. 정상 완료, 작업 중단, 세션 폐기는 서로 다른 수명 경계입니다.',
        },
        {
          kind: 'execution-path',
          title: '편집 호출 전에 중단하면 무엇이 남을까요?',
          input: { label: '공통 시작 상태', text: '`average.ts` 읽기는 완료했습니다. 모델은 수정 방향을 설명하는 텍스트를 생성 중이며, `edit` 호출은 아직 없습니다. 대기 중인 다른 요청은 없습니다.' },
          labels: { choose: '이후 상황' },
          paths: [
            {
              label: '작업을 계속함',
              stages: [
                { label: '응답 생성', text: '모델이 설명을 마치고 `edit` 호출을 생성합니다.', state: 'complete' },
                { label: '편집 실행', text: '도구가 0점 제외 로직을 제거하고 결과를 반환합니다.', state: 'complete' },
                { label: '실행 정리', text: '결과를 받은 모델이 답변을 마칩니다. 세션이 완료 메시지와 후속 처리를 정리합니다.', state: 'complete' },
                { label: '다음 입력', text: '세션과 기록을 유지한 채 새 요청을 받을 수 있습니다.', state: 'complete' },
              ],
              result: { label: '작업 완료', text: '파일 변경과 도구 결과가 있으며, 그 결과를 포함한 대화가 다음 요청의 출발점이 됩니다.' },
            },
            {
              label: '현재 응답을 중단함',
              stages: [
                { label: '응답 생성', text: '`session.abort()`가 코어의 취소 신호를 올려 진행 중 응답을 중단합니다.', state: 'blocked' },
                { label: '편집 실행', text: '편집 호출 전에 중단했으므로 파일 수정은 실행되지 않습니다.', state: 'skipped' },
                { label: '실행 정리', text: '진행 중 실행과 취소 관련 처리를 기다립니다. 앞서 완료한 읽기 결과는 대화에 남습니다.', state: 'complete' },
                { label: '다음 입력', text: '세션을 폐기하지 않았으므로 새 사용자 요청으로 작업을 이어 갈 수 있습니다.', state: 'complete' },
              ],
              result: { label: '작업 중단', text: '파일은 변경 전 상태입니다. 중단 전에 완료한 조사와 기록을 가진 세션이 남습니다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '`Agent.abort()`는 실행 중인 요청의 `AbortController`에 취소 신호를 전달합니다. 세션의 `abort()`는 재시도·컨텍스트 정리·셸·Eval 등 관련 작업에도 취소를 요청하고 코어가 유휴 상태가 될 때까지 기다립니다. 이미 적용된 파일 변경을 되돌리는 기능은 아닙니다.',
        },
        {
          kind: 'paragraph',
          text: '`dispose()`는 세션 폐기를 시작하고 내부 구독과 소유한 자원을 해제합니다. 실행과 이벤트 처리기가 종료되기를 제한된 시간 동안 기다린 뒤 저장소를 닫고 메모리의 대화 기록을 비웁니다. 여러 번 호출하면 같은 폐기 Promise를 반환합니다. SDK 호출자는 마지막 응답을 받은 뒤에도 `await session.dispose()`까지 기다려야 합니다.',
        },
        {
          kind: 'code',
          language: 'typescript',
          caption: 'SDK 사용 · Bun 및 모델·인증 설정 필요',
          code: `import { createAgentSession } from '@oh-my-pi/pi-coding-agent';

const { session } = await createAgentSession({ cwd: process.cwd() });
const unsubscribe = session.subscribe(event => {
  if (
    event.type === 'message_update' &&
    event.assistantMessageEvent.type === 'text_delta'
  ) {
    process.stdout.write(event.assistantMessageEvent.delta);
  }
});

try {
  await session.prompt('average.ts에서 0점이 제외되는 이유를 조사해 줘.');
} finally {
  unsubscribe();
  await session.dispose();
}`,
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 코어 abort와 waitForIdle', href: `${source}/packages/agent/src/agent.ts#L1103-L1109` },
            { text: 'OMP · AgentSession.abort의 취소와 대기', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L7742-L7805` },
            { text: 'OMP · 반복 호출에 안전한 dispose', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L4527-L4541` },
            { text: 'OMP · 세션 소유 자원의 정리', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L4681-L4721` },
            { text: 'OMP · 이벤트 대기·저장소 닫기·메모리 해제', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L4768-L4835` },
            { text: 'OMP · SDK의 공개 내보내기', href: `${source}/packages/coding-agent/src/index.ts#L39-L52` },
            { text: 'OMP · createAgentSession의 실제 함수 서명', href: `${source}/packages/coding-agent/src/sdk.ts#L1305-L1309` },
          ],
        },
      ],
    },
  ],
};
