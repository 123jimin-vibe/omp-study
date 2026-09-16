import type { Topic } from '../../content.ts';

const source = 'https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec';

export const projectInstructionsAndPromptAssemblyTopic: Topic = {
  id: 'project-instructions-and-prompt-assembly',
  number: '05',
  title: '프로젝트 지침과 프롬프트 구성',
  description: '프로젝트의 작업 규칙을 모델 요청에 담는 과정.',
  sections: [
    {
      id: 'discovery',
      title: '어떤 파일이 지침이 되는가',
      blocks: [
        { kind: 'paragraph', text: 'OMP는 세션을 시작할 때 프로젝트 지침 파일을 찾아 읽고 시스템 프롬프트에 넣습니다. 예를 들어 저장소 루트의 `AGENTS.md`에 “의존성 명령은 pnpm을 사용한다”라고 적혀 있으면, 하위 디렉터리에서 시작한 세션에도 이 지침이 포함될 수 있습니다.' },
        { kind: 'paragraph', text: '지침 파일은 `context-files` 기능에 등록된 공급자들이 찾습니다. 독립된 `AGENTS.md` 공급자는 `cwd`에서 상위 디렉터리로 거슬러 올라갑니다. 홈 디렉터리 아래의 Git 저장소에서는 저장소 루트를 넘어 홈 바로 아래까지 탐색하되 홈 자체의 파일은 제외합니다. 홈 밖의 저장소에서는 저장소 루트에서 멈춥니다. Git 저장소가 아니면 홈 아래에서는 홈까지, 그 밖에서는 파일 시스템 루트까지 탐색합니다.' },
        { kind: 'paragraph', text: '네이티브 `.omp` 공급자는 활성 에이전트 디렉터리의 `AGENTS.md`와 가장 가까운 프로젝트 설정 디렉터리의 `AGENTS.md`를 읽습니다. 공급자마다 탐색 범위와 우선순위가 다르므로 모든 상위 디렉터리의 지침을 무조건 합치지는 않습니다. SDK 호출자가 `contextFiles`를 직접 전달하면 자동 검색 대신 그 목록을 사용합니다.' },
        { kind: 'references', links: [
          { text: '독립 컨텍스트 파일의 탐색 경계', href: `${source}/packages/coding-agent/src/discovery/helpers.ts#L683-L749` },
          { text: '네이티브 컨텍스트 파일 공급자', href: `${source}/packages/coding-agent/src/discovery/builtin.ts#L906-L945` },
          { text: '세션의 컨텍스트 발견 시작', href: `${source}/packages/coding-agent/src/sdk.ts#L1389-L1393` },
        ] },
      ],
    },
    {
      id: 'selection-and-limits',
      title: '합치기 전에 선택하고 정리한다',
      blocks: [
        { kind: 'paragraph', text: '`context-files`는 사용자 지침을 하나의 범위로 묶고, 프로젝트 지침은 디렉터리 깊이마다 별도 범위로 구분합니다. 같은 범위에서 `AGENTS.md`, `CLAUDE.md` 등 여러 파일을 발견하면 공급자 우선순위가 가장 높은 파일만 선택합니다. 선택이 끝나면 각 파일의 내용을 읽어 지침 목록을 만듭니다.' },
        { kind: 'paragraph', text: '`loadProjectContextFiles`는 본문 속 `@path` 참조를 지침 파일이 있는 디렉터리를 기준으로 펼칩니다. 참조를 따라 최대 다섯 단계까지 재귀적으로 읽되, 코드 블록과 인라인 코드 안의 참조는 그대로 둡니다. 이미 읽었거나 열 수 없는 파일을 가리키는 참조도 원문에 남습니다. 이 과정에는 파일별 바이트 제한이나 전체 토큰 예산에 맞춰 본문을 줄이는 기능이 없으므로, 긴 지침은 요청 크기를 그대로 늘립니다.' },
        { kind: 'paragraph', text: '사용자 지침이 먼저 오고, 프로젝트 지침은 현재 디렉터리에서 먼 파일부터 가까운 파일 순으로 이어집니다. 뒤에 오는 파일이 앞선 파일의 정규화된 문단을 빠짐없이 연속해서 포함하면 앞선 파일은 생략합니다. 문장 일부만 겹치거나 뜻만 비슷하면 두 파일을 모두 남깁니다. 이 과정은 동일한 문단의 중복만 줄일 뿐, 서로 충돌하는 규칙을 해석해 하나를 선택하지는 않습니다.' },
        { kind: 'exchange', input: { label: '선택된 두 파일', text: '상위 `AGENTS.md`: “명령은 pnpm을 사용한다.”\n현재 디렉터리 `AGENTS.md`: “명령은 pnpm을 사용한다.” + 별도 문단 “테스트는 pnpm test로 실행한다.”' }, outputs: [
          { label: '포함 관계가 성립하면', text: '현재 디렉터리 파일에 상위 파일의 문단 전체가 연속해서 들어 있으므로 상위 파일은 생략합니다. 가까운 파일의 두 문단만 남습니다.' },
          { label: '상위 문장을 바꾸면', text: '상위 지침이 “명령은 npm을 사용한다.”라면 포함 관계가 사라져 두 파일을 모두 남깁니다. 배열 순서만으로 어느 규칙이 우선하는지는 결정하지 않습니다.' },
        ] },
        { kind: 'paragraph', text: '하위 디렉터리의 지침 본문은 세션을 시작할 때 시스템 프롬프트에 넣지 않습니다. 프로젝트 프롬프트의 `<dir-context>`에는 발견한 하위 지침의 경로와 “그 디렉터리를 수정하기 전에 읽으라”는 요구만 넣습니다. 즉, 상위 지침은 세션 시작 시 본문을 전달하고 하위 지침은 작업 중 필요할 때 도구로 읽습니다.' },
        { kind: 'references', links: [
          { text: '범위별 중복 키', href: `${source}/packages/coding-agent/src/capability/context-file.ts#L27-L43` },
          { text: '확장·정렬·문단 포함 관계 정리', href: `${source}/packages/coding-agent/src/system-prompt.ts#L411-L485` },
          { text: '참조 확장 깊이와 제외 조건', href: `${source}/packages/coding-agent/src/discovery/at-imports.ts#L30-L185` },
          { text: '일반 파일 확인과 내용 캐시', href: `${source}/packages/coding-agent/src/capability/fs.ts#L11-L34` },
          { text: '본문 주입과 하위 지침 목록', href: `${source}/packages/coding-agent/src/prompts/system/project-prompt.md#L8-L29` },
        ] },
      ],
    },
    {
      id: 'rulebook',
      title: '규칙의 목록과 자동 매칭은 다르다',
      blocks: [
        { kind: 'paragraph', text: '규칙 파일은 컨텍스트 파일과 별개인 `rules` 기능에서 찾습니다. `name`이 같은 규칙이 여러 개면 공급자 우선순위가 가장 높은 하나만 남깁니다. 그런 다음 비활성화 목록, 내장 규칙 사용 여부, 현재 에이전트 이름과 `agents` 패턴을 확인합니다. 남은 규칙에 지원되는 `condition` 또는 `astCondition`이 있으면 TTSR에 등록합니다. 그렇지 않은 규칙은 `alwaysApply: true`일 때 본문을 항상 넣고, `description`이 있으면 `rulebook` 목록에 싣습니다.' },
        { kind: 'exchange', input: { label: '같은 규칙 본문: “SQL 값은 매개변수로 전달한다”', text: '규칙의 메타데이터에 따라 본문이 입력에 추가되는 시점이 달라집니다.' }, outputs: [
          { label: '`alwaysApply: true`', text: 'TTSR 규칙이 아니라면 전체 본문이 시스템 프롬프트의 상시 규칙 영역에 들어갑니다.' },
          { label: '`description`과 `globs`', text: '이름·설명·경로 패턴만 rulebook 목록에 들어갑니다. 모델이 필요하다고 판단해 `rule://sql`을 읽으면 본문이 도구 결과로 전달됩니다.' },
          { label: '`condition` 또는 `astCondition`', text: 'TTSR 매처가 지정된 스트림 범위를 검사합니다. 조건이 일치하면 중단 정책에 따라 생성을 멈추거나 계속하면서 규칙 본문을 주입합니다.' },
        ] },
        { kind: 'paragraph', text: 'rulebook의 `globs`는 모델에게 적용 대상을 알려 주는 힌트입니다. 예를 들어 `src/db/query.ts`를 수정해도 하네스가 경로만 보고 규칙 본문을 자동으로 넣지는 않습니다. 모델이 필요하다고 판단해 `rule://sql`을 읽어야 본문이 반환됩니다. 반면 TTSR의 `globs`는 실제 경로 필터이며, `scope`는 텍스트·생각·도구 인자 중 검사할 범위를 정합니다.' },
        { kind: 'paragraph', text: 'TTSR은 모델이 생성하는 텍스트와 도구 인자의 스트림을 검사합니다. AST 규칙은 편집 또는 쓰기 호출이 적용된 뒤의 파일 상태를 재구성해 검사합니다. 규칙이 일치해도 `interruptMode: never`이면 생성을 멈추지 않고 주입을 준비하며, `tool-only`이면 도구 인자에서 일치했을 때만 중단합니다. 모델이 직접 읽는 rulebook과 하네스가 생성 도중 검사하는 TTSR은 적용 시점과 중단 방식이 다릅니다.' },
        { kind: 'references', links: [
          { text: '규칙 이름·공급자 우선순위와 매칭 의미', href: `${source}/docs/rulebook-matching-pipeline.md#L176-L260` },
          { text: '실제 규칙 분류 순서', href: `${source}/packages/coding-agent/src/capability/rule-buckets.ts#L42-L76` },
          { text: '규칙 URL의 이름 기반 조회', href: `${source}/packages/coding-agent/src/internal-urls/rule-protocol.ts#L14-L36` },
          { text: 'TTSR 스트림 검사', href: `${source}/packages/coding-agent/src/session/ttsr-coordinator.ts#L83-L115` },
          { text: 'TTSR 중단 정책과 일치 처리', href: `${source}/packages/coding-agent/src/session/ttsr-coordinator.ts#L259-L270` },
        ] },
      ],
    },
    {
      id: 'assembly',
      title: '지침 한 문장이 요청에 들어가기까지',
      blocks: [
        { kind: 'paragraph', text: '기본 설정에서 `buildSystemPrompt`는 도구 안내, 상시 규칙, rulebook 등을 각각 블록으로 만들고 마지막에 프로젝트 블록을 붙입니다. 프로젝트 블록에는 환경 정보, `<repo-rules>` 안의 지침 본문, 하위 지침 목록과 추가 프롬프트가 들어갑니다. 완성된 `systemPrompt`는 이 블록들을 순서대로 담은 문자열 배열입니다.' },
        { kind: 'tool-sequence', title: '`AGENTS.md`에서 Anthropic 요청의 시스템 블록으로', prompt: '저장소 루트의 `AGENTS.md`에 “의존성 명령은 pnpm을 사용한다”가 있고 사용자가 “테스트 의존성 설치 명령을 알려 줘”라고 요청합니다.', actors: ['프로젝트 파일', 'OMP 하네스', '모델 API'], events: [
          { from: 1, to: 0, label: '지침 발견·읽기', detail: '`context-files`가 선택한 `AGENTS.md`를 읽고 본문 속 참조를 펼칩니다.', kind: 'read' },
          { from: 0, to: 1, label: '파일 본문 전달', detail: '“의존성 명령은 pnpm을 사용한다”가 `contextFiles[].content`에 저장됩니다.', kind: 'result' },
          { from: 1, to: 2, label: '프로젝트 블록 조립 → 공급자 요청', detail: '파일 본문을 `<repo-rules>` 안에 넣어 `Context.systemPrompt`를 만들고, Anthropic 어댑터가 이를 시스템 텍스트 블록으로 변환합니다. 사용자 메시지와 도구 정의는 별도 필드로 전달합니다.', kind: 'request' },
          { from: 2, to: 1, label: '지침과 질문을 반영한 응답', detail: '모델은 전달된 지침에 따라 `pnpm add -D vitest`와 같은 명령을 답할 수 있습니다.', kind: 'answer' },
        ] },
        { kind: 'paragraph', text: '`SYSTEM.md`는 시스템 프롬프트 템플릿 전체를 바꾸는 별도 경로입니다. 프로젝트 수준 파일이 있으면 사용자 수준 파일보다 우선합니다. 호출자가 `customPrompt`를 지정하면 `SYSTEM.md`를 찾지 않고 지정된 템플릿을 사용합니다. 템플릿이 컨텍스트와 추가 문구를 직접 렌더링하므로 기본 프로젝트 블록은 다시 붙이지 않습니다.' },
        { kind: 'references', links: [
          { text: '시스템 프롬프트 사용자화 선택', href: `${source}/packages/coding-agent/src/system-prompt.ts#L487-L504` },
          { text: '호출자 프롬프트 우선권', href: `${source}/packages/coding-agent/src/system-prompt.ts#L789-L808` },
          { text: '템플릿 데이터와 블록 조립', href: `${source}/packages/coding-agent/src/system-prompt.ts#L978-L1048` },
          { text: '세션에서 에이전트에 프롬프트 설정', href: `${source}/packages/coding-agent/src/session/agent-session.ts#L6497-L6543` },
          { text: '루프의 공급자 입력 구성', href: `${source}/packages/agent/src/agent-loop.ts#L1593-L1639` },
          { text: 'Anthropic 시스템·도구 변환', href: `${source}/packages/ai/src/providers/anthropic.ts#L3923-L3939` },
        ] },
      ],
    },
    {
      id: 'stable-and-dynamic',
      title: '기본 지침과 실행 중 추가되는 내용',
      blocks: [
        { kind: 'paragraph', text: '세션 시작 시 읽은 지침 파일은 디스크에서 바뀌어도 자동으로 갱신되지 않으며, 파일 리더도 읽은 내용을 캐시합니다. 실행 중에는 `rulebook`을 읽은 결과, TTSR이 주입한 규칙, 메모리 백엔드가 준비한 프롬프트, 확장의 `before_agent_start` 반환값 등이 입력에 추가될 수 있습니다. 따라서 세션 시작 시 만든 시스템 프롬프트와 각 모델 요청 직전에 추가되는 내용을 구분해야 합니다.' },
        { kind: 'paragraph', text: '`buildSystemPrompt`의 준비 작업은 모두 같은 `deadline` 안에 끝나야 합니다. 기한 안에 완료되지 않거나 실패한 작업은 기본값으로 대신하고, 늦게 끝난 결과는 다음 요청에서 사용할 캐시로 보관합니다. 이는 긴 본문을 토큰 예산에 맞춰 줄이는 기능이 아닙니다. SDK가 미리 제공한 컨텍스트는 기본값에도 유지됩니다.' },
        { kind: 'paragraph', text: '입력의 앞부분을 안정적으로 유지하면 공급자의 프롬프트 캐시를 활용하기 쉽습니다. OMP의 Anthropic 어댑터는 시스템 블록과 도구 정의의 순서를 안정화한 뒤, 지연 로딩하지 않는 마지막 도구 정의와 마지막 시스템 블록에 캐시 경계를 설정할 수 있습니다. 같은 시스템·도구 접두부 뒤에 새 메시지만 붙이면 앞부분을 재사용할 수 있지만, 지침 본문이나 도구 순서가 요청마다 바뀌면 캐시 적중 범위가 줄어듭니다.' },
        { kind: 'references', links: [
          { text: '준비 마감과 대체값', href: `${source}/packages/coding-agent/src/system-prompt.ts#L740-L787` },
          { text: '메모리 백엔드와 기본 프롬프트 갱신', href: `${source}/packages/coding-agent/src/session/session-tools.ts#L1487-L1524` },
          { text: 'Anthropic의 접두부 캐시 경계', href: `${source}/packages/ai/src/providers/anthropic.ts#L3510-L3565` },
          { text: '안정화와 캐시 적용 순서', href: `${source}/packages/ai/src/providers/anthropic.ts#L4034-L4045` },
        ] },
      ],
    },
  ],
};
