import type { Topic } from '../../content.ts';

const source = 'https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec';

export const toolDefinitionsAndRegistryTopic: Topic = {
  id: 'tool-definitions-and-registry',
  number: '07',
  title: '도구 정의와 레지스트리',
  description: '모델이 호출한 도구 이름을 세션의 실행 코드와 연결하는 구조.',
  sections: [
    {
      id: 'definition-and-implementation',
      title: '모델용 정의와 실행 구현',
      blocks: [
        {
          kind: 'paragraph',
          text: '모델이 `read`를 호출하려면 도구의 이름과 인자 형식을 알아야 하고, 하네스에는 파일을 읽는 실행 코드가 있어야 합니다. OMP의 `AgentTool`은 모델에게 보낼 `name`, `description`, `parameters`와 하네스에서 사용할 실행 함수·메타데이터를 한 객체에 담습니다. `name`은 호출할 구현을 찾는 키이고, `description`은 기능과 사용법을 설명하며, `parameters`는 인자의 구조를 정합니다.',
        },
        {
          kind: 'exchange',
          input: { label: '세션의 도구 객체', text: '`ReadTool`\n`name: "read"`' },
          outputs: [
            { label: '모델 요청을 만드는 쪽', text: '`name` · `description` · `parameters`\n파일을 읽을 때 사용할 이름과 인자 형식' },
            { label: '로컬 실행을 맡는 쪽', text: '`execute` · `approval` · `loadMode`\n실행 코드, 승인 판단, 도구 표시 방식' },
            { label: '화면에 표시하는 쪽', text: '`label` · `renderCall` · `renderResult`\n호출과 결과의 UI 표현' },
          ],
        },
        {
          kind: 'paragraph',
          text: '`ReadTool`의 기본 스키마에는 문자열 `path`가 하나 있습니다. `package.json:raw` 같은 선택자도 이 문자열에 포함됩니다. `description`은 `prompts/tools/read.md`를 렌더링해 만들며, 파일 표시 모드에 맞는 사용법을 함께 제공합니다. 따라서 스키마가 같아도 세션 설정에 따라 모델이 보는 설명과 도구의 출력 형식은 달라질 수 있습니다.',
        },
        {
          kind: 'code',
          language: 'typescript',
          caption: '`ReadTool`의 기본 인자 스키마',
          code: `const readSchema = type({
  path: type("string").describe(
    "Local path, internal URI (e.g. memory://, skill://), or URL. Inline selectors are supported.",
  ),
});`,
        },
        {
          kind: 'paragraph',
          text: '모델 API에는 이 객체 전체가 아니라 도구 정의에 필요한 정보만 보냅니다. OpenAI Responses 어댑터는 이름, 설명, 변환된 스키마와 해당되는 `strict` 설정으로 함수 도구 정의를 만듭니다. `execute` 함수, `ToolSession`, UI 렌더러는 세션에 남습니다. 모델이 `path` 값을 생성하면 하네스는 같은 이름으로 등록된 실행 함수를 찾습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · AgentTool의 실행·표시 계약', href: `${source}/packages/agent/src/types.ts#L783-L880` },
            { text: 'OMP · ReadTool의 스키마와 설명 생성', href: `${source}/packages/coding-agent/src/tools/read.ts#L620-L749` },
            { text: 'OMP · read 설명 원문', href: `${source}/packages/coding-agent/src/prompts/tools/read.md#L1-L33` },
            { text: 'OMP · OpenAI Responses의 함수 정의 변환', href: `${source}/packages/ai/src/providers/openai-responses.ts#L1441-L1482` },
          ],
        },
      ],
    },
    {
      id: 'constructing-registry',
      title: '팩터리에서 세션의 레지스트리로',
      blocks: [
        {
          kind: 'paragraph',
          text: '`BUILTIN_TOOLS`에는 완성된 도구가 아니라 이름별 팩터리가 들어 있습니다. `read`는 `s => new ReadTool(s)`, `bash`는 `s => new BashTool(s)`로 등록됩니다. `createTools(session, toolNames)`는 요청한 이름과 설정을 확인한 뒤 각 팩터리에 같은 `ToolSession`을 전달합니다. 생성된 도구는 이름을 키로 하는 `toolRegistry`에 저장됩니다.',
        },
        {
          kind: 'code',
          language: 'typescript',
          caption: '`createTools`의 인스턴스 생성과 등록 부분',
          code: `const baseResults = await Promise.all(
  baseEntries.map(async ([name, factory]) => {
    const tool = await logger.time(\`createTools:\${name}\`, factory as ToolFactory, session);
    return tool ? wrapToolWithMetaNotice(tool) : null;
  }),
);
let tools = baseResults.filter((r): r is Tool => r !== null);
const toolRegistry = session.toolRegistry ?? new Map<string, Tool>();
session.toolRegistry = toolRegistry;
const builtInNames = new Set(tools.map(tool => tool.name));
for (const tool of tools) toolRegistry.set(tool.name, tool);`,
        },
        {
          kind: 'paragraph',
          text: '팩터리에 등록된 도구가 모든 세션에 만들어지는 것은 아닙니다. 예를 들어 `bash.enabled: false`이면 생성 대상에서 빠지고, 조건부 팩터리는 실행 환경에 따라 `null`을 반환할 수 있습니다. `eval`은 허용된 실행 백엔드가 실제로 사용 가능한지도 확인합니다. 명시적인 도구 목록을 전달해도 이러한 설정 검사를 건너뛰지 않으며, 자동 포함 규칙에 따라 요청한 이름과 최종 목록이 달라질 수도 있습니다.',
        },
        {
          kind: 'paragraph',
          text: '`createAgentSession`은 확장과 SDK에서 받은 도구도 어댑터를 거쳐 같은 레지스트리에 합칩니다. 확장이 같은 이름의 도구를 등록하면 기존 항목을 대체할 수 있습니다. 마지막에는 모든 도구를 `ExtensionToolWrapper`로 감싸 승인 정책과 확장 훅을 연결합니다. 따라서 일반 세션에서 `read.execute`를 호출하면 파일 읽기 구현으로 바로 가지 않고 먼저 승인과 확장 훅을 거칩니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 팩터리 지도와 생성 조건', href: `${source}/packages/coding-agent/src/tools/index.ts#L455-L553` },
            { text: 'OMP · 요청 목록 확장, 설정 필터, 인스턴스 등록', href: `${source}/packages/coding-agent/src/tools/index.ts#L555-L714` },
            { text: 'OMP · 외부 도구의 합류와 동일 이름 대체', href: `${source}/packages/coding-agent/src/sdk.ts#L2840-L2901` },
            { text: 'OMP · 모든 등록 도구에 실행 래퍼 설치', href: `${source}/packages/coding-agent/src/sdk.ts#L2918-L2923` },
          ],
        },
      ],
    },
    {
      id: 'enabled-and-active',
      title: '등록된 도구와 지금 노출된 도구',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP는 도구 상태를 세 가지로 구분합니다. 등록된 도구는 세션이 구현을 찾을 수 있는 도구이고, 활성화된 도구는 현재 세션에서 사용하도록 선택한 도구입니다. 그중에서도 모델 요청의 최상위 도구 목록에 직접 보이는 도구는 더 적을 수 있습니다. `loadMode`는 선택된 도구의 정의를 어떻게 노출할지 정할 뿐, 사용 권한을 결정하지는 않습니다.',
        },
        {
          kind: 'exchange',
          input: { label: '같은 세션에서 확인할 세 가지', text: '구현이 등록되었는가?\n현재 세션에서 사용할 수 있는가?\n최상위 도구 목록에 보이는가?' },
          outputs: [
            { label: '`getAllToolNames()`', text: '레지스트리에 등록된 모든 도구 이름\n`getAllToolInfos()`로 정의와 출처도 조회' },
            { label: '`getEnabledToolNames()`', text: '현재 세션에서 사용하도록 선택된 도구\n최상위 + `xd://` 마운트 + Code Mode 브리지' },
            { label: '`getActiveToolNames()`', text: '`agent.state.tools`에 들어 있는 이름\n현재 최상위 목록에 직접 노출된 도구' },
          ],
        },
        {
          kind: 'paragraph',
          text: '예를 들어 `ast_edit`를 `xd://` 장치로 마운트하면 전체 스키마를 매 요청의 최상위 목록에 넣지 않고 `write`를 통해 호출할 수 있습니다. 최상위 목록에 보이지 않아도 이 경로로 실행할 수 있습니다. 반면 `getToolByName()`은 등록 여부만 확인합니다. Eval 브리지에서는 등록된 도구를 모두 허용하지 않도록 `getToolForEvalBridge()`가 `getEnabledToolNames()`를 별도로 검사합니다.',
        },
        {
          kind: 'paragraph',
          text: '이 구분을 이용하면 모델 입력의 크기와 도구 사용 가능 여부를 따로 조정할 수 있습니다. 긴 스키마를 필요할 때만 불러오게 하는 것은 노출 방식의 변경이고, 도구를 사용하지 못하게 하는 것은 활성 목록의 변경입니다. `setActiveToolsByName()`은 새 구현을 만드는 함수가 아니라 레지스트리에서 사용할 도구를 골라 노출 방식을 다시 적용하는 함수입니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · loadMode와 도구 선택의 구분', href: `${source}/packages/agent/src/types.ts#L710-L719` },
            { text: 'OMP · active·enabled·브리지 조회의 실제 의미', href: `${source}/packages/coding-agent/src/session/session-tools.ts#L385-L419` },
            { text: 'OMP · 등록 도구의 전체 목록과 출처', href: `${source}/packages/coding-agent/src/session/session-tools.ts#L521-L549` },
            { text: 'OMP · xd:// 마운트와 최상위 목록 분리', href: `${source}/packages/coding-agent/src/tools/index.ts#L716-L798` },
            { text: 'OMP · 이름으로 활성 집합 변경', href: `${source}/packages/coding-agent/src/session/session-tools.ts#L1289-L1300` },
          ],
        },
      ],
    },
    {
      id: 'tool-session-services',
      title: '도구의 실행 환경은 세션이 제공한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`new ReadTool(session)`은 모델이 생성하는 `path` 외에 실행에 필요한 환경을 `ToolSession`에서 받습니다. 여기에는 작업 디렉터리, 설정, 아티팩트 저장소, 클라이언트 브리지 등의 서비스가 들어 있습니다. 이 값들은 모델이 생성하는 호출 인자가 아니라 세션을 만들 때 하네스가 정하는 실행 환경입니다.',
        },
        {
          kind: 'exchange',
          input: { label: '`ReadTool`이 보관한 `ToolSession`', text: '같은 `path`를\n현재 세션의 환경에서 해석' },
          outputs: [
            { label: '`cwd`', text: '`package.json`을 찾을 기준 디렉터리\n`resolveReadPath(path, session.cwd)`' },
            { label: '`settings`', text: '기본 읽기 범위, 이미지 처리, 출력 방식\n`ReadTool`의 설명과 실행에 반영' },
            { label: '아티팩트·세션 서비스', text: '`getArtifactsDir` · `getSessionId`\n`allocateOutputArtifact`로 큰 출력을 저장할 위치 배정' },
            { label: '`getClientBridge`', text: '연결된 편집기의 파일 접근\n지원되는 경우 디스크보다 메모리 버퍼를 먼저 읽음' },
          ],
        },
        {
          kind: 'paragraph',
          text: '같은 `read({ path: "package.json" })` 호출도 작업 디렉터리에 따라 다른 파일을 읽습니다. 편집기 브리지가 연결되어 있으면 디스크 파일보다 편집기의 메모리 버퍼를 먼저 읽을 수 있습니다. 따라서 도구 이름과 스키마만으로 실행 동작이 모두 정해지지는 않습니다. 도구가 연결된 세션의 경로·설정·클라이언트도 실행 계약의 일부입니다.',
        },
        {
          kind: 'paragraph',
          text: '각 호출에는 `toolCallId`, 취소 신호 `signal`, 중간 결과 콜백 `onUpdate`, 호출 시점의 `AgentToolContext`도 전달됩니다. `ToolSession`이 모든 호출에 공통인 실행 환경이라면, 이 값들은 개별 호출을 식별하고 진행 상태와 취소를 제어합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · ToolSession의 작업 디렉터리와 기능 설정', href: `${source}/packages/coding-agent/src/tools/index.ts#L155-L238` },
            { text: 'OMP · 아티팩트·작업·설정·클라이언트 서비스', href: `${source}/packages/coding-agent/src/tools/index.ts#L323-L381` },
            { text: 'OMP · 편집기 버퍼 우선 읽기', href: `${source}/packages/coding-agent/src/tools/read.ts#L1090-L1127` },
            { text: 'OMP · 로컬 경로를 cwd 기준으로 해석', href: `${source}/packages/coding-agent/src/tools/read.ts#L1422-L1442` },
            { text: 'OMP · 호출별 execute 인자', href: `${source}/packages/agent/src/types.ts#L746-L761` },
          ],
        },
      ],
    },
    {
      id: 'registered-read-invocation',
      title: '등록된 read가 실제 호출이 되기까지',
      blocks: [
        {
          kind: 'paragraph',
          text: '작업 디렉터리의 `package.json`에 아래 내용이 있고 `read`가 최상위 도구로 활성화되어 있다고 합시다. 편집기 브리지는 연결하지 않았으며, 승인 정책은 이 로컬 파일 읽기를 허용합니다.',
        },
        {
          kind: 'code',
          language: 'json',
          caption: '`package.json`',
          code: '{"scripts":{"test":"vitest run"}}',
        },
        {
          kind: 'tool-sequence',
          title: '`read` 호출에서 파일 내용이 반환되기까지',
          prompt: '`package.json`에서 `test` 스크립트를 확인해 줘.',
          actors: ['모델', '세션과 에이전트 루프', '로컬 파일 시스템'],
          events: [
            { from: 1, to: 0, kind: 'request', label: '정의 제공', detail: '`read`의 이름·설명·인자 스키마를 전달\n실행 함수는 세션에 유지' },
            { from: 0, to: 1, kind: 'call', label: 'read 호출 생성', detail: '`{"path":"package.json:raw"}`', correlation: 'call_read_package' },
            { from: 1, to: 2, kind: 'read', label: '구현 실행', detail: '도구 조회 → 인자 검증 → 실행 래퍼\n`ReadTool.execute`가 cwd 기준으로 파일 읽기' },
            { from: 2, to: 1, kind: 'result', label: '파일 내용', detail: '`{"scripts":{"test":"vitest run"}}`' },
            { from: 1, to: 0, kind: 'request', label: '호출과 결과 연결', detail: '`role: "toolResult"` · `toolName: "read"`\n`content`에 파일 내용, `isError: false`', correlation: 'call_read_package' },
            { from: 0, to: 1, kind: 'answer', label: '내용에 근거한 답변', detail: '`test` 스크립트는 `vitest run`입니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '루프는 현재 도구 집합과 대체 조회 경로에서 호출 이름을 찾고, 선택된 도구의 스키마로 인자를 검증합니다. 검증에 실패하면 `ReadTool.execute`를 호출하지 않고 오류 결과를 만듭니다. 검증에 성공하면 실행 래퍼를 거쳐 구현을 호출하고, 반환된 `content`를 같은 `toolCallId`의 `toolResult` 메시지에 넣습니다. 모델은 이 결과가 추가된 다음 요청에서 답변을 생성합니다.',
        },
        {
          kind: 'subheading',
          id: 'normalized-tool-schema',
          title: '모델용 스키마에는 실행 전처리가 반영된다',
        },
        {
          kind: 'paragraph',
          text: '위 도식에는 실행 인자인 `path`만 표시했습니다. `intentTracing`이 켜져 있으면 하네스는 모델용 스키마에 의도 필드 `i`를 추가합니다. 호출을 실행할 때는 이 필드를 분리한 뒤 원래 스키마로 나머지 인자를 검증합니다. 전체 도구 설명을 시스템 프롬프트에 넣는 설정에서는 요청의 도구 정의에서 중복 설명을 제거할 수도 있습니다. 원본 `parameters`와 모델 API에 전달된 스키마를 비교할 때는 이 정규화 단계까지 확인해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 도구 조회, 의도 분리, 인자 검증', href: `${source}/packages/agent/src/agent-loop.ts#L2344-L2424` },
            { text: 'OMP · execute 호출과 오류 처리', href: `${source}/packages/agent/src/agent-loop.ts#L2700-L2759` },
            { text: 'OMP · toolResult 메시지 생성', href: `${source}/packages/agent/src/agent-loop.ts#L2581-L2615` },
            { text: 'OMP · 로컬 파일 바이트 읽기', href: `${source}/packages/coding-agent/src/tools/read.ts#L194-L200` },
            { text: 'OMP · 모델용 도구 정의 정규화', href: `${source}/packages/agent/src/agent-loop.ts#L891-L914` },
          ],
        },
      ],
    },
  ],
};
