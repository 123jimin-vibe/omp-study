import type { Topic } from '../../content.ts';

const ompSource = 'https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec';
const piSource = 'https://github.com/earendil-works/pi/blob/d12cd92e45e308d4af000554292165ef1984253b';

export const codingAgentsAndOmpTopic: Topic = {
  id: 'coding-agents-and-omp',
  number: '03',
  title: '코딩 에이전트와 OMP',
  description: '모델의 선택을 파일 변경과 명령 실행으로 이어 주는 하네스.',
  sections: [
    {
      id: 'from-answer-to-change',
      title: '답변에서 코드 변경으로',
      blocks: [
        {
          kind: 'paragraph',
          text: '코딩 에이전트는 개발 요청을 받아 코드를 조사하고, 파일을 수정하고, 실행 결과를 확인하며 작업을 이어 가는 프로그램입니다. 모델은 다음 행동과 그 인자를 생성하고, 하네스는 이를 작업 공간에 적용한 뒤 결과를 다음 모델 요청에 포함합니다. OMP는 이 하네스와 터미널 인터페이스를 함께 제공하는 코딩 에이전트입니다.',
        },
        {
          kind: 'paragraph',
          text: '예를 들어 사용자가 “평균을 계산할 때 0점도 포함하고, 수정한 결과를 확인해 줘”라고 요청했다고 합시다. 작업 공간의 `average.ts`에는 아래 함수가 있고, 입력은 비어 있지 않은 점수 배열로 정해져 있습니다. `[0, 100]`의 요구 결과는 `50`이지만, 현재 함수는 `filter(Boolean)`로 `0`을 제거해 `100`을 반환합니다.',
        },
        {
          kind: 'code',
          language: 'typescript',
          caption: '`average.ts` · 변경 전 코드',
          code: `export function average(scores: number[]): number {
  const counted = scores.filter(Boolean);
  return counted.reduce((sum, score) => sum + score, 0) / counted.length;
}`,
        },
        {
          kind: 'exchange',
          input: { label: '사용자의 작업 요청', text: '0점을 포함하도록 `average.ts`를 수정하고 실행 결과를 확인한다.' },
          outputs: [
            { label: '모델이 결정하는 것', text: '어떤 파일을 읽을지, 어떤 수정을 요청할지, 결과를 보고 추가 작업이 필요한지.' },
            { label: '하네스가 수행하는 것', text: '입력 구성 → 도구 호출 처리 → 파일·프로세스 접근 → 결과를 대화에 추가.' },
            { label: '사용자가 받는 것', text: '바뀐 파일과 실행 결과, 그리고 이를 근거로 한 작업 보고.' },
          ],
        },
        {
          kind: 'paragraph',
          text: 'OMP의 `createAgentSession`은 모델과 도구를 가진 `Agent`를 만들고 `AgentSession`에 연결합니다. 코어 루프가 도구 객체의 `execute`를 호출하면 도구 구현이 파일이나 프로세스에 접근합니다. 모델은 도구 이름과 인자를 생성하고, 작업 공간을 실제로 바꾸는 코드는 `execute` 안에서 실행됩니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · Agent 생성과 활성 모델·도구', href: `${ompSource}/packages/coding-agent/src/sdk.ts#L3527-L3548` },
            { text: 'OMP · AgentSession에 실행 구성 연결', href: `${ompSource}/packages/coding-agent/src/sdk.ts#L3712-L3729` },
            { text: 'OMP · 실제 도구 execute 호출', href: `${ompSource}/packages/agent/src/agent-loop.ts#L2663-L2747` },
          ],
        },
      ],
    },
    {
      id: 'read-edit-run',
      title: '읽고 고친 뒤 실행하기',
      blocks: [
        {
          kind: 'paragraph',
          text: '다음 흐름에서는 `read`, `edit`, `bash` 도구가 사용 가능하다고 합시다. `check-average.ts`는 `average.ts`가 제대로 동작하는지 두 테스트 케이스 `[0, 100]`과 `[80, 100]`으로 검사하는 프로젝트의 기존 확인 스크립트입니다.',
        },
        {
          kind: 'tool-sequence',
          title: '읽기·수정·실행 결과를 다음 요청에 반영하기',
          prompt: '`average.ts`에서 0점도 평균에 포함되게 고치고 `check-average.ts`로 확인해 줘.',
          actors: ['모델', 'OMP 하네스', '작업 공간'],
          events: [
            { from: 1, to: 0, kind: 'request', label: '조사 요청', detail: '프로젝트 지침 + 사용자 요청 + 활성 도구 정의' },
            { from: 0, to: 1, kind: 'call', label: '`read` 호출', detail: '`average.ts`와 `check-average.ts`의 내용 요청' },
            { from: 1, to: 2, kind: 'read', label: '파일 읽기', detail: '도구가 작업 디렉터리를 기준으로 파일에 접근' },
            { from: 2, to: 1, kind: 'result', label: '현재 코드', detail: '`scores.filter(Boolean)` 발견\n확인 스크립트의 기대값 확인' },
            { from: 1, to: 0, kind: 'request', label: '읽기 결과 포함', detail: '기존 대화 + `read` 호출 + 파일 내용' },
            { from: 0, to: 1, kind: 'call', label: '`edit` 호출', detail: '`const counted = scores.filter(Boolean);`을\n`const counted = scores;`로 변경 요청' },
            { from: 1, to: 2, kind: 'read', label: '수정 적용', detail: '편집 도구가 `average.ts`를 변경' },
            { from: 2, to: 1, kind: 'result', label: '편집 결과', detail: '요청한 변경이 적용됨' },
            { from: 1, to: 0, kind: 'request', label: '편집 결과 포함', detail: '수정된 파일과 적용 결과를 바탕으로 다음 행동 생성' },
            { from: 0, to: 1, kind: 'call', label: '`bash` 호출', detail: '`bun run check-average.ts` 실행 요청' },
            { from: 1, to: 2, kind: 'read', label: '프로세스 실행', detail: '프로젝트 디렉터리에서 확인 스크립트 실행' },
            { from: 2, to: 1, kind: 'result', label: '검사 결과', detail: '`[0, 100] → 50`, `[80, 100] → 90`\n검사 통과, 종료 코드 `0`' },
            { from: 1, to: 0, kind: 'request', label: '실행 결과 포함', detail: '명령 출력과 종료 상태가 대화에 추가됨' },
            { from: 0, to: 1, kind: 'answer', label: '작업 보고', detail: '0점 제외 로직을 제거했고 두 입력의 결과를 확인했다고 보고' },
          ],
        },
        {
          kind: 'paragraph',
          text: '이 흐름에서 모델 요청은 네 번 이루어집니다. 첫 번째 요청에서 모델은 읽을 파일을 고릅니다. 두 번째 요청에는 읽은 코드가 추가되어 있어 수정할 부분을 정할 수 있습니다. 세 번째 요청에는 편집 결과가 들어가므로 변경을 확인할 명령을 고를 수 있고, 네 번째 요청에는 실행 결과가 들어가므로 작업의 성공 여부를 판단할 수 있습니다. 확인 스크립트가 실패했다면 모델은 그 오류를 보고 다시 파일을 읽거나 수정할 수 있습니다.',
        },
        {
          kind: 'paragraph',
          text: '실제 OMP의 `ReadTool`은 세션의 작업 디렉터리를 기준으로 경로를 해석합니다. `EditTool`은 네이티브 편집 구현인 `EditSession`과 연결되고, `BashTool`은 명시한 `cwd` 또는 세션의 작업 디렉터리에서 명령을 실행합니다. 모델이 생성한 경로나 명령 문자열 등의 텍스트는 이 도구들을 통해 실제 작업으로 이루어집니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 루프의 컨텍스트 준비와 제공자 요청', href: `${ompSource}/packages/agent/src/agent-loop.ts#L1593-L1627` },
            { text: 'OMP · ReadTool의 경로 해석', href: `${ompSource}/packages/coding-agent/src/tools/read.ts#L1434-L1442` },
            { text: 'OMP · 편집 도구와 네이티브 EditSession', href: `${ompSource}/packages/coding-agent/src/edit/index.ts#L13-L23` },
            { text: 'OMP · BashTool의 작업 디렉터리', href: `${ompSource}/packages/coding-agent/src/tools/bash.ts#L1097-L1109` },
          ],
        },
      ],
    },
    {
      id: 'one-execution-several-views',
      title: '실행을 기록하고 보여 주기',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP는 실행 중인 진행 상황을 화면에 보여 주면서, 완료된 대화를 저장해 다음 실행에서 이어 쓸 수 있어야 합니다. 이를 위해 실행 상태, 영속 기록, 화면 표시를 나누고 도구 실행과 응답 생성에서 발생한 이벤트로 연결합니다.',
        },
        {
          kind: 'exchange',
          input: { label: '한 메시지의 완료', text: '`message_end`\n예: 확인 스크립트의 결과가 `toolResult` 메시지로 완료됨' },
          outputs: [
            { label: 'Agent · 다음 요청의 대화', text: '완료한 메시지를 `state.messages`에 추가합니다. 생성 중인 응답은 별도의 `streamMessage`로 관리합니다.' },
            { label: 'AgentSession → SessionManager · 기록', text: '내부 이벤트 처리기가 완료한 메시지를 세션 기록에 추가합니다. 현재 대화 경로를 나중에 복원할 수 있습니다.' },
            { label: 'AgentSession → UI · 표시', text: '구독자가 완료 이벤트를 받습니다. 터미널에서는 스트리밍 응답과 도구 실행 표시를 갱신합니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '`AgentSession`은 UI 연결 여부와 관계없이 코어 `Agent`의 이벤트를 내부적으로 구독합니다. 터미널의 `EventController`는 별도의 구독자로 연결되고, 출력 모드는 같은 이벤트를 JSON으로 내보낼 수 있습니다. 실행과 기록이 터미널 렌더링에 묶여 있지 않으므로 SDK에서도 같은 런타임을 사용할 수 있습니다.',
        },
        {
          kind: 'paragraph',
          text: '화면에 보이는 진행 중 텍스트와 저장된 메시지의 시점도 다릅니다. `SessionManager`의 기본 파일 저장은 JSONL 형식이며, 완료 메시지는 `message_end`에서 기록합니다. 생성 중인 텍스트 조각은 아직 영속 기록이 아닙니다. 강제 종료 뒤 복원할 수 있는 범위를 이해하려면 화면에 마지막으로 보인 글자보다 기록된 메시지의 경계를 보아야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · Agent의 메시지·도구 상태 갱신', href: `${ompSource}/packages/agent/src/agent.ts#L1532-L1579` },
            { text: 'OMP · UI와 독립적인 내부 구독', href: `${ompSource}/packages/coding-agent/src/session/agent-session.ts#L1920-L1924` },
            { text: 'OMP · 터미널의 이벤트 구독', href: `${ompSource}/packages/coding-agent/src/modes/controllers/event-controller.ts#L585-L615` },
            { text: 'OMP · 출력 모드의 JSON 이벤트', href: `${ompSource}/packages/coding-agent/src/modes/print-mode.ts#L154-L159` },
            { text: 'OMP · JSONL 기록과 스트리밍의 영속화 경계', href: `${ompSource}/packages/coding-agent/src/session/session-manager.ts#L453-L464` },
          ],
        },
      ],
    },
    {
      id: 'pi-package-map',
      title: 'Pi의 패키지 지도',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP의 README는 OMP를 Mario Zechner의 Pi에서 갈라진 포크로 소개합니다. 여기서는 Pi의 `d12cd92`와 OMP의 `3b3a6dc` 소스를 기준으로 현재 설명에 필요한 패키지 책임을 비교합니다.',
        },
        {
          kind: 'exchange',
          input: { label: 'Pi · 코딩 에이전트 구성', text: '`packages/coding-agent`\n`@earendil-works/pi-coding-agent`\n사용자와 만나는 대화형 CLI' },
          outputs: [
            { label: '행동 반복', text: '`packages/agent` · `pi-agent-core`\n도구 호출과 상태 관리를 담당하는 에이전트 런타임' },
            { label: '모델 접근', text: '`packages/ai` · `pi-ai`\n여러 제공자를 위한 공통 LLM API' },
            { label: '터미널 표현', text: '`packages/tui` · `pi-tui`\n변경된 영역을 갱신하는 터미널 UI 라이브러리' },
          ],
        },
        {
          kind: 'paragraph',
          text: 'Pi README의 전체 패키지 목록에는 `packages/chord`와 `packages/telemetry`도 있습니다. `chord`는 서비스·상태 복제·RPC·플러그인을 위한 독립적인 애플리케이션 구성 런타임이고, `pi-telemetry`는 제공자에 종속되지 않는 관측 계약과 참조 어댑터를 담습니다.',
        },
        {
          kind: 'paragraph',
          text: '이 구분을 앞의 작업에 대입하면, 파일을 고치라는 사용자 요청은 코딩 에이전트가 받고, 모델과 도구를 번갈아 호출하는 반복은 에이전트 런타임이 맡으며, 제공자별 요청 차이는 LLM API 계층으로 내려갑니다. 터미널 출력은 이 실행을 사용자에게 보여 주는 별도 책임입니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · Pi 포크 출처', href: `${ompSource}/README.md#L21-L23` },
            { text: 'Pi d12cd92 · 핵심 구성과 전체 패키지 목록', href: `${piSource}/README.md#L13-L37` },
          ],
        },
      ],
    },
    {
      id: 'omp-package-map',
      title: 'OMP에서 확장된 실행 환경',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP도 `coding-agent`, `agent`, `ai`, `tui`를 핵심 패키지로 둡니다. npm 패키지 범위는 `@oh-my-pi`이며, `coding-agent`가 CLI와 SDK를 제공합니다. 여기에 모델 목록, 네이티브 연산, 메모리, 컨텍스트 압축 등을 담당하는 지원 패키지가 연결됩니다.',
        },
        {
          kind: 'exchange',
          input: { label: 'OMP · 사용자 작업의 조립 지점', text: '`packages/coding-agent`\n`createAgentSession` · `AgentSession` · 코딩 도구 · 실행 모드' },
          outputs: [
            { label: '반복과 모델 연결', text: '`packages/agent` → 모델·도구 반복과 상태\n`packages/ai` → 제공자 API와 응답 스트리밍\n`packages/catalog` → 모델 데이터와 제공자 메타데이터' },
            { label: '작업 공간과 화면', text: '`packages/natives` → 검색·셸·이미지·텍스트 등의 네이티브 바인딩\n`packages/tui` → 터미널 렌더링' },
            { label: '공유 기반', text: '`packages/utils` → 로그·스트림·디렉터리·프로세스 유틸리티\n`packages/omptype` → 스키마 검증\n`packages/wire` → 협업 세션의 공통 프로토콜 타입' },
            { label: '기억과 사용량', text: '`packages/mnemopi` → SQLite 기반 로컬 메모리\n`packages/snapcompact` → 비트맵 프레임 기반 컨텍스트 압축\n`packages/stats` → AI 사용량 대시보드' },
          ],
        },
        {
          kind: 'paragraph',
          text: '같은 모노레포에는 협업 세션용 브라우저 클라이언트 `collab-web`, 기존 Chrome 탭을 Eval 브라우저 API에 연결하는 `browser-relay`, 벤치마크 실행과 결과 저장을 맡는 `metaharness`, 편집 성능을 측정하는 `typescript-edit-benchmark`도 있습니다.',
        },
        {
          kind: 'paragraph',
          text: '하네스를 조사할 때는 질문이 속한 경계부터 찾는 편이 빠릅니다. “어떤 모델과 도구를 넘겼는가”는 `coding-agent/src/sdk.ts`, “도구 결과 뒤 왜 모델을 다시 호출하는가”는 `agent/src/agent-loop.ts`, “파일 변경을 실제로 적용하는 코드는 어디인가”는 편집 도구, “화면에 보인 내용이 왜 복원되지 않았는가”는 세션 이벤트와 저장 경계에서 확인할 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP 3b3a6dc · 모노레포 패키지 지도', href: `${ompSource}/README.md#L634-L653` },
            { text: 'OMP · coding-agent의 실제 패키지 의존성', href: `${ompSource}/packages/coding-agent/package.json#L49-L61` },
          ],
        },
      ],
    },
  ],
};
