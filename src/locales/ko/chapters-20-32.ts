import type { Topic } from '../../content.ts';

const source = 'https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec';
const treeSource = 'https://github.com/can1357/oh-my-pi/tree/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec';

export const modelProvidersTopic: Topic = {
  id: 'model-providers',
  number: '20',
  title: '모델 제공자',
  description: '하나의 에이전트 요청을 서로 다른 모델 API의 메시지와 도구 형식으로 바꾸는 어댑터 계층.',
  sections: [
    {
      id: 'provider-neutral-request',
      title: '에이전트는 공통 형식으로 요청한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '에이전트 루프는 대화를 OMP의 공통 `Context`와 메시지 타입으로 다룹니다. 현재 모델의 `api` 값을 확인하면 `packages/ai`의 스트림 함수가 `anthropic-messages`, `openai-responses`, `google-generative-ai` 등에 맞는 제공자 어댑터를 고릅니다. 이 경계 덕분에 루프는 제공자별 HTTP 본문을 직접 조립하지 않고도 같은 사용자 메시지와 도구 정의를 보낼 수 있습니다.',
        },
        {
          kind: 'exchange',
          input: {
            label: 'OMP 내부 요청',
            text: '`systemPrompt` + `messages` + `tools`\n사용자: `package.json의 test 스크립트를 읽어 줘.`',
          },
          outputs: [
            {
              label: 'Anthropic Messages 어댑터',
              text: '시스템 텍스트와 콘텐츠 블록으로 변환\n도구 호출·결과를 `tool_use`와 `tool_result`로 연결',
            },
            {
              label: 'OpenAI Responses 어댑터',
              text: '입력 항목과 함수 도구로 변환\n호출 ID를 함수 호출과 출력 항목에 보존',
            },
            {
              label: 'Google 어댑터',
              text: '`contents`와 함수 선언으로 변환\n역할·파트·도구 응답을 Gemini 형식에 맞춤',
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '응답도 반대 방향으로 변환됩니다. 각 어댑터는 제공자가 보낸 텍스트, 추론, 도구 호출과 사용량을 공통 `AssistantMessageEvent`와 최종 `AssistantMessage`로 바꿉니다. 세션과 화면은 이 공통 이벤트를 구독하므로 모델을 바꾸어도 에이전트 루프의 도구 실행 계약은 유지됩니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 모델 요청에서 제공자 스트림까지', href: `${source}/docs/provider-streaming-internals.md#end-to-end-flow` },
            { text: 'OMP · 공통 메시지와 스트림 타입', href: `${source}/packages/ai/src/types.ts` },
            { text: 'OMP · 제공자별 메시지 변환', href: `${source}/packages/ai/src/providers/transform-messages.ts` },
          ],
        },
      ],
    },
    {
      id: 'schema-and-tool-compatibility',
      title: '도구 스키마도 전송 전에 맞춘다',
      blocks: [
        {
          kind: 'paragraph',
          text: '모델에게 보여 줄 도구는 하나의 JSON Schema로 정의하지만, API마다 허용하는 키워드와 엄격 모드가 다릅니다. OMP의 공통 스키마 정규화기는 제공자에 맞춰 참조와 결합자를 정리하고, 지원하지 않는 제약을 제거하거나 설명으로 옮깁니다. OpenAI Responses에서는 `oneOf`를 `anyOf`로 바꾸고 거부되는 정규식 구문을 제거하며, Google 계열에는 별도의 허용 규칙을 적용합니다.',
        },
        {
          kind: 'code',
          language: 'json',
          caption: '하네스가 보유한 도구 스키마',
          code: `{
  "name": "read",
  "description": "Read a file",
  "parameters": {
    "type": "object",
    "properties": {
      "path": { "type": "string" }
    },
    "required": ["path"]
  }
}`,
        },
        {
          kind: 'paragraph',
          text: '예를 들어 모델이 `read({ path: "package.json" })`을 생성하면 어댑터는 호출 ID와 인자를 OMP의 도구 호출 블록으로 복원합니다. 하네스가 `read`를 실행한 뒤 같은 호출 ID를 가진 결과를 다음 요청에 넣어야 모델이 어느 호출의 응답인지 알 수 있습니다. 스키마 변환은 전송 형식의 호환성을 맡고, 이름 조회·승인·실행은 세션의 도구 레지스트리가 맡습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 제공자별 도구 스키마 정규화', href: `${source}/docs/ai-schema-normalize.md` },
            { text: 'OMP · Anthropic 도구 변환', href: `${source}/docs/toolconv/anthropic.md` },
            { text: 'OMP · Gemini 도구 변환', href: `${source}/docs/toolconv/gemini.md` },
          ],
        },
      ],
    },
    {
      id: 'endpoint-and-compatibility',
      title: '같은 API 이름만으로는 충분하지 않다',
      blocks: [
        {
          kind: 'paragraph',
          text: '모델 레코드는 제공자 ID뿐 아니라 `api`, `baseUrl`, 헤더와 `compat` 설정을 함께 가집니다. OpenAI 호환 엔드포인트라도 엄격한 도구 스키마를 받는지, 추론 내용을 다음 도구 호출에 다시 보내야 하는지, 최대 출력 필드가 무엇인지가 다를 수 있습니다. 카탈로그의 호환성 규칙이 이 차이를 어댑터 옵션으로 전달합니다.',
        },
        {
          kind: 'execution-path',
          title: '사내 OpenAI 호환 게이트웨이에 도구 요청을 보낼 때',
          input: {
            label: '주어진 설정',
            text: '`api: openai-completions` · 사내 `baseUrl` · `disableStrictTools: true`',
          },
          labels: { choose: '하네스가 택한 전송 방식' },
          paths: [
            {
              label: '카탈로그 설정을 적용함',
              stages: [
                { label: '라우팅', text: '모델 레코드의 `baseUrl`로 요청을 보냅니다.', state: 'complete' },
                { label: '스키마', text: '엄격 모드를 끄고 호환 가능한 함수 정의를 만듭니다.', state: 'complete' },
                { label: '응답', text: '수신한 도구 호출을 공통 호출 블록으로 복원합니다.', state: 'complete' },
              ],
              result: { label: '호환 요청', text: '에이전트 루프는 기존 `read` 실행 흐름을 그대로 이어 갑니다.' },
            },
            {
              label: '호환성 설정을 무시함',
              stages: [
                { label: '라우팅', text: '기본 제공자 주소나 잘못된 경로를 사용할 수 있습니다.', state: 'blocked' },
                { label: '스키마', text: '게이트웨이가 지원하지 않는 엄격 스키마를 거부할 수 있습니다.', state: 'blocked' },
                { label: '응답', text: '모델 호출이 끝나지 않아 도구 실행으로 넘어가지 못합니다.', state: 'skipped' },
              ],
              result: { label: '전송 실패', text: '하네스는 이 실패를 로컬 도구 오류가 아니라 제공자 요청 오류로 다뤄야 합니다.' },
            },
          ],
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 사용자 정의 제공자와 엔드포인트', href: `${source}/docs/providers.md#custom-providers-in-modelsyml` },
            { text: 'OMP · 모델의 호환성·라우팅 필드', href: `${source}/docs/models.md#compatibility-and-routing-fields` },
            { text: 'OMP · 제공자 엔드포인트 제약', href: `${source}/docs/provider-endpoint-constraints.md` },
          ],
        },
      ],
    },
    {
      id: 'provider-errors',
      title: '제공자 오류를 다음 결정으로 바꾼다',
      blocks: [
        {
          kind: 'paragraph',
          text: '어댑터는 HTTP 실패와 스트림 오류를 제공자 응답의 원문으로 끝내지 않고 인증, 사용량 제한, 컨텍스트 초과, 일시적 전송 실패처럼 하네스가 처리할 수 있는 오류로 분류합니다. 세션은 분류 결과에 따라 같은 요청을 지연해 재시도하거나, 다른 자격 증명으로 전환하거나, 컨텍스트 압축을 시작합니다.',
        },
        {
          kind: 'paragraph',
          text: '경계는 분명해야 합니다. 잘못된 도구 인자는 도구 검증 단계의 실패이고, `401`은 자격 증명 경로의 실패이며, 컨텍스트 길이 오류는 입력 예산의 실패입니다. 모두 “모델 호출 실패”로만 기록하면 재시도해도 해결되지 않는 요청을 반복하거나, 도구가 한 번도 실행되지 않았는데 실행 실패로 표시할 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 완료 이유와 전송 오류의 구분', href: `${source}/docs/provider-streaming-internals.md#stop-reasons-vs-transportruntime-errors` },
            { text: 'OMP · 제공자 오류 분류', href: `${treeSource}/packages/ai/src/error` },
            { text: 'OMP · 세션의 재시도와 컨텍스트 복구', href: `${source}/packages/coding-agent/src/session/session-maintenance.ts` },
          ],
        },
      ],
    },
  ],
};

export const modelCatalogTopic: Topic = {
  id: 'model-catalog',
  number: '21',
  title: '모델 카탈로그',
  description: '모델의 정체성·기능·한도를 기록하고 세션의 역할에 맞는 실제 모델을 고르는 레지스트리.',
  sections: [
    {
      id: 'identity-and-transport',
      title: '모델 정보와 전송 코드를 나눈다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`packages/catalog`는 모델의 정체성과 메타데이터를 보유하고, `packages/ai`는 그 모델에 요청을 보내는 전송 코드를 보유합니다. 세션은 `provider/model-id` 조합으로 실제 모델을 가리킵니다. 같은 모델 ID가 여러 게이트웨이에 있어도 제공자까지 기록하면 어떤 가격·엔드포인트·자격 증명으로 실행했는지 잃지 않습니다.',
        },
        {
          kind: 'exchange',
          input: { label: '구체 모델', text: '`anthropic/claude-sonnet-…`\n제공자 ID와 모델 ID의 조합' },
          outputs: [
            { label: '카탈로그가 답하는 것', text: '컨텍스트 한도 · 최대 출력 · 입력 형식\n추론·도구 지원 · 가격 · 호환성 설정' },
            { label: '레지스트리가 답하는 것', text: '현재 설정과 인증에서 선택 가능한가?\n별칭이나 검색어가 어느 구체 모델을 뜻하는가?' },
            { label: '전송 계층이 답하는 것', text: '어느 API와 엔드포인트로 보낼까?\n요청과 스트림을 어떻게 변환할까?' },
          ],
        },
        {
          kind: 'paragraph',
          text: '이 분리는 하네스의 결정을 검증하기 쉽게 만듭니다. 예를 들어 컨텍스트 압축 임계값은 카탈로그의 `contextWindow`를 참고하고, 이미지가 든 요청은 `input` 기능을 확인하며, 실제 HTTP 본문은 모델 레코드의 `api`가 고른 어댑터가 만듭니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 카탈로그와 제공자 계층의 경계', href: `${source}/AGENTS.md#package-structure` },
            { text: 'OMP · 공개 모델 타입', href: `${source}/packages/catalog/src/types.ts` },
            { text: 'OMP · 모델과 제공자 식별', href: `${source}/docs/models.md#provider-and-model-identity` },
          ],
        },
      ],
    },
    {
      id: 'catalog-sources',
      title: '번들에서 발견된 모델까지 합친다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`ModelRegistry`는 번들 카탈로그를 오프라인 기준으로 시작해 `models.yml`의 사용자 정의와 덮어쓰기, 캐시된 모델, 실행 중 발견한 로컬·원격 모델, 확장이 등록한 제공자를 합칩니다. 같은 `provider + id`의 사용자 정의 모델은 기존 항목을 대체하며, 모델별 덮어쓰기는 병합 뒤에도 다시 적용됩니다.',
        },
        {
          kind: 'paragraph',
          text: '레지스트리에 존재하는 모델과 지금 선택 가능한 모델은 다릅니다. `getAll()`은 합쳐진 전체 목록을 반환하지만, `getAvailable()`은 제공자가 비활성화되지 않았고 자격 증명을 해결할 수 있거나 키가 필요 없는 모델만 남깁니다. 따라서 모델 선택 화면이 비었다면 카탈로그 누락과 인증 누락을 따로 조사해야 합니다.',
        },
        {
          kind: 'execution-path',
          title: '카탈로그에는 있지만 선택할 수 없는 모델',
          input: { label: '주어진 상태', text: '번들에 `acme/code-large`가 있고, 이 제공자는 API 키가 필요합니다.' },
          labels: { choose: '현재 설정' },
          paths: [
            {
              label: '키를 해결할 수 있음',
              stages: [
                { label: '카탈로그 조회', text: '모델 레코드와 기능 정보를 찾습니다.', state: 'complete' },
                { label: '제공자 필터', text: '`disabledProviders`에 없음을 확인합니다.', state: 'complete' },
                { label: '인증 확인', text: '저장된 키나 환경 변수에서 자격 증명을 얻습니다.', state: 'complete' },
              ],
              result: { label: '사용 가능', text: '모델 선택과 역할 해석의 후보가 됩니다.' },
            },
            {
              label: '키가 없거나 제공자가 비활성화됨',
              stages: [
                { label: '카탈로그 조회', text: '모델 정보 자체는 남아 있습니다.', state: 'complete' },
                { label: '가용성 검사', text: '제공자 또는 인증 조건을 통과하지 못합니다.', state: 'blocked' },
                { label: '모델 선택', text: '실행 후보에서는 제외합니다.', state: 'skipped' },
              ],
              result: { label: '등록됨, 사용 불가', text: '하네스는 “알 수 없는 모델”과 “현재 인증으로 쓸 수 없는 모델”을 구분할 수 있습니다.' },
            },
          ],
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 카탈로그 병합 순서와 캐시', href: `${source}/docs/models.md#merge-and-override-order` },
            { text: 'OMP · 제공자의 가용성 조건', href: `${source}/docs/providers.md#how-omp-decides-a-provider-is-available` },
            { text: 'OMP · 모델 레지스트리 구현', href: `${source}/packages/coding-agent/src/config/model-registry.ts` },
          ],
        },
      ],
    },
    {
      id: 'capabilities-and-limits',
      title: '메타데이터가 실행 결정을 제한한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '모델 레코드의 `contextWindow`와 `maxTokens`는 요청 길이와 생성 상한을 계산하는 데 쓰입니다. `input`은 텍스트·이미지 같은 입력 형식을, `supportsTools`는 도구 호출 가능 여부를, `reasoning`과 `thinking`은 추론 설정의 범위를 나타냅니다. 가격 정보는 사용량 추정에 쓰이지만, 서버가 실제 비용을 반환하면 OMP는 그 값을 우선합니다.',
        },
        {
          kind: 'note',
          title: '카탈로그 값은 정책 입력입니다',
          text: '하네스는 선언된 기능을 근거로 요청을 구성해야 합니다. 이미지 미지원 모델에는 이미지 블록을 그대로 보내지 않고, 작은 컨텍스트 모델에서는 더 이른 압축이나 명시된 승격 대상을 선택합니다. 카탈로그가 낡았을 가능성은 발견·캐시의 출처와 갱신 시각으로 추적합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 모델 값 검증과 메타데이터', href: `${source}/docs/models.md#model-value-checks` },
            { text: 'OMP · 사용량 비용 계산', href: `${source}/docs/models.md#usage-costs-and-time-based-pricing` },
            { text: 'OMP · 컨텍스트 승격 대상', href: `${source}/docs/models.md#context-promotion-model-level-fallback-chains` },
          ],
        },
      ],
    },
    {
      id: 'roles-and-resolution',
      title: '역할 별칭을 실제 모델로 해석한다',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP는 `default`, `smol`, `slow`, `vision`, `plan`, `commit`, `tiny`, `task`, `advisor` 같은 역할에 모델 선택자를 연결합니다. 역할은 새 모델이 아니라 용도별 간접 참조입니다. 제목 생성과 같은 가벼운 배경 작업은 `@tiny`가 있으면 그 역할을, 없으면 `@smol`을 쓰며, 요청 전송 전에 인증 가능한 구체 `provider/model-id`로 해석됩니다.',
        },
        {
          kind: 'code',
          language: 'yaml',
          caption: '용도별 모델 역할 설정',
          code: `modelRoles:
  default: anthropic/claude-sonnet-4-6
  smol: openai/gpt-5-mini:minimal
  plan: "@slow"
  slow: openai/gpt-5.4:high`,
        },
        {
          kind: 'paragraph',
          text: '초기 모델은 명시한 CLI 선택, 제한된 모델 목록, 저장한 기본 모델, 알려진 제공자 기본값, 첫 가용 모델 순으로 찾습니다. 세션 기록에는 별칭이 아니라 실제 실행한 제공자와 모델을 남깁니다. 그래야 재개 시 같은 실행 조건을 복원하고, 평가 결과를 어느 모델이 만들었는지 확인할 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 모델 선택자와 해석 순서', href: `${source}/docs/models.md#runtime-model-resolution` },
            { text: 'OMP · 역할 별칭과 설정', href: `${source}/docs/models.md#role-aliases-and-settings` },
            { text: 'OMP · 모델 해석 구현', href: `${source}/packages/coding-agent/src/config/model-resolver.ts` },
          ],
        },
      ],
    },
  ],
};

export const responseStreamingTopic: Topic = {
  id: 'response-streaming',
  number: '22',
  title: '응답 스트리밍',
  description: '제공자가 보내는 텍스트와 도구 호출 조각을 순서 있는 이벤트로 조립해 세션에 전달하는 흐름.',
  sections: [
    {
      id: 'unified-event-stream',
      title: '서로 다른 스트림을 같은 이벤트로 바꾼다',
      blocks: [
        {
          kind: 'paragraph',
          text: '제공자 어댑터는 SSE, WebSocket, SDK 스트림 등에서 받은 데이터를 `AssistantMessageEventStream`에 넣습니다. 소비자는 전송 방식과 관계없이 `start`, 콘텐츠 블록의 시작·증분·끝, 마지막 `done` 또는 `error` 이벤트를 받습니다. `result()`는 같은 스트림의 최종 `AssistantMessage`를 돌려줍니다.',
        },
        {
          kind: 'exchange',
          input: { label: '제공자에서 도착한 조각', text: '`"테"` → `"스트"` → `"를"` → `" 실행"`' },
          outputs: [
            { label: '에이전트 상태', text: '`text_start` 뒤 `text_delta`를 순서대로 반영\n진행 중인 `assistant` 메시지가 `테스트를 실행`으로 자람' },
            { label: '세션 이벤트', text: '`message_update`에 원래 증분 이벤트를 실어 전달\n화면과 SDK 구독자가 같은 진행을 관찰' },
            { label: '완료 메시지', text: '`text_end`와 `done` 뒤 하나의 `AssistantMessage` 확정\n완료된 메시지를 세션 기록에 추가' },
          ],
        },
        {
          kind: 'paragraph',
          text: '스트림 객체는 이벤트를 받은 순서대로 즉시 전달하며 자체적으로 증분을 합치지 않습니다. 화면은 렌더링 비용을 줄이기 위해 여러 `message_update`를 모아 그릴 수 있지만, 최종 메시지 조립과 UI 갱신 주기를 같은 버퍼로 묶어서는 안 됩니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 통합 스트림 이벤트 계약', href: `${source}/docs/provider-streaming-internals.md#unified-stream-contract-in-oh-my-pipi-ai` },
            { text: 'OMP · EventStream 구현', href: `${source}/packages/ai/src/utils/event-stream.ts` },
            { text: 'OMP · 세션 이벤트로 전달되는 스트림', href: `${source}/docs/provider-streaming-internals.md#how-stream-events-surface-as-agentsession-events` },
          ],
        },
      ],
    },
    {
      id: 'tool-call-deltas',
      title: '도구 인자는 완성될 때까지 조립한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '도구 호출도 한 번에 도착하지 않습니다. 어댑터는 `toolcall_start`에서 이름과 호출 식별자를 만들고, `toolcall_delta`의 인자 문자열을 누적한 뒤 `toolcall_end`에서 JSON을 확정합니다. 누적 중인 `{"path":"pack`은 아직 실행 가능한 인자가 아니므로 에이전트 루프는 도구 호출 블록이 끝날 때까지 기다립니다.',
        },
        {
          kind: 'tool-sequence',
          title: '스트리밍된 `read` 호출이 실행되기까지',
          prompt: '`package.json`의 test 스크립트를 확인해 줘.',
          actors: ['제공자 어댑터', '에이전트 루프', '`read` 도구'],
          events: [
            { from: 0, to: 0, kind: 'call', label: '호출 시작 조각 수신', detail: '제공자 고유 형식에서 호출 ID와 도구 이름 `read`를 확인합니다.', correlation: 'call_7' },
            { from: 0, to: 1, kind: 'call', label: '`toolcall_start`', detail: '호출 ID와 도구 이름을 공통 이벤트로 엽니다.', correlation: 'call_7' },
            { from: 0, to: 0, kind: 'call', label: '인자 조각 수신', detail: '`{"path":"pack` 다음 `age.json"}`을 순서대로 누적합니다.', correlation: 'call_7' },
            { from: 0, to: 1, kind: 'call', label: '`toolcall_delta`', detail: '누적 중인 JSON을 진행 중 도구 호출 블록에 반영합니다.', correlation: 'call_7' },
            { from: 0, to: 1, kind: 'call', label: '`toolcall_end`', detail: '인자를 `{"path":"package.json"}`으로 확정해 완성된 호출을 전달합니다.', correlation: 'call_7' },
            { from: 1, to: 2, kind: 'call', label: '검증 후 실행', detail: '완성된 인자를 스키마로 검증하고 등록된 `read`를 호출합니다.', correlation: 'call_7' },
            { from: 2, to: 1, kind: 'result', label: '도구 결과', detail: '파일 내용을 같은 호출 ID와 연결해 다음 모델 요청에 넣습니다.', correlation: 'call_7' },
          ],
        },
        {
          kind: 'paragraph',
          text: '일부 제공자는 부분 JSON 조각의 모양이 다르거나 스트림 종료 전에 완전한 인자 객체를 따로 줍니다. 이 차이는 어댑터가 흡수합니다. 하네스가 지켜야 할 조건은 호출 ID별로 조각을 섞지 않고, 완성·검증된 인자만 도구 실행기로 넘기는 것입니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 도구 호출 JSON 누적과 복구', href: `${source}/docs/provider-streaming-internals.md#partial-tool-call-json-accumulation-and-recovery` },
            { text: 'OMP · 에이전트 루프의 스트림 소비', href: `${source}/packages/agent/src/agent-loop.ts` },
          ],
        },
      ],
    },
    {
      id: 'completion-errors-and-cancel',
      title: '완료, 오류, 취소를 서로 다르게 끝낸다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`done`은 정상적인 스트림 종단이며 이유는 `stop`, `length`, `toolUse` 가운데 하나입니다. `toolUse`라면 에이전트 루프가 도구를 실행하고 다음 모델 요청을 만들고, `length`라면 세션이 출력 미완료 복구를 검토합니다. `error`는 `aborted` 또는 `error`로 끝나며 정상 완료로 기록하지 않습니다.',
        },
        {
          kind: 'paragraph',
          text: '사용자가 중단하면 취소 신호가 현재 제공자 요청으로 전달됩니다. 이미 화면에 그린 텍스트가 있어도 에이전트 루프는 이를 `stopReason: "aborted"`인 `assistant` 메시지로 확정하고 세션은 실패한 트랜스크립트 항목으로 남길 수 있습니다. 다음 제공자 요청을 만들 때는 중단·오류 응답과 연결된 합성 `toolResult`를 빼서, 화면·감사 기록과 모델 재생 문맥을 분리합니다.',
        },
        {
          kind: 'note',
          title: '`end()`와 `fail()`도 결과를 끝내야 합니다',
          text: '종단 이벤트 없이 스트림만 닫히면 `result()`는 오류로 끝납니다. 내부 예외를 `fail(error)`로 전달한 경우에는 비동기 반복과 `result()`가 모두 거부됩니다. 소비자가 영원히 기다리지 않도록 모든 종료 경로가 최종 상태를 결정합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 완료 이유와 런타임 오류', href: `${source}/docs/provider-streaming-internals.md#stop-reasons-vs-transportruntime-errors` },
            { text: 'OMP · 스트림 취소 경계', href: `${source}/docs/provider-streaming-internals.md#cancellation-boundaries` },
            { text: 'OMP · 세션의 중단 처리', href: `${source}/packages/coding-agent/src/session/agent-session.ts` },
            { text: 'OMP · 오류·중단 턴의 모델 재생 제외', href: `${source}/packages/coding-agent/src/session/session-context.ts` },
          ],
        },
      ],
    },
    {
      id: 'delivery-boundaries',
      title: '수신 속도와 소비 속도를 분리한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`AssistantMessageEventStream`은 메모리 큐에 이벤트를 넣고 기다리는 소비자를 깨웁니다. 느린 화면 렌더러가 제공자 소켓에 직접 역압을 걸지는 않습니다. 그래서 하네스는 첫 진행과 유휴 시간을 감시하고, 화면에서는 갱신을 묶으며, 완료 이벤트를 처리하기 전에 남은 텍스트 갱신을 먼저 반영합니다.',
        },
        {
          kind: 'paragraph',
          text: '이 분리로 사용자는 빠르게 텍스트를 보면서도 세션에는 하나의 완전한 메시지가 남습니다. 반대로 모든 증분을 JSONL 항목으로 저장하면 불완전한 블록이 재개 입력에 섞이고 저장 비용도 커집니다. OMP는 진행 이벤트를 화면과 구독자에게 전달하되, 완료된 메시지를 세션의 대화 항목으로 확정합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 스트림의 역압 경계', href: `${source}/docs/provider-streaming-internals.md#backpressure-boundaries` },
            { text: 'OMP · 터미널 갱신 병합', href: `${source}/packages/coding-agent/src/modes/controllers/event-controller.ts` },
            { text: 'OMP · 세션 메시지 영속화 경계', href: `${source}/docs/session.md#persistence-guarantees-and-failure-model` },
          ],
        },
      ],
    },
  ],
};

export const authenticationAndCredentialsTopic: Topic = {
  id: 'authentication-and-credentials',
  number: '23',
  title: '인증과 자격 증명',
  description: '모델 요청에 쓸 키와 OAuth 토큰을 선택·갱신하고 노출 범위를 제한하는 자격 증명 계층.',
  sections: [
    {
      id: 'credential-resolution',
      title: '요청할 때 사용할 자격 증명을 고른다',
      blocks: [
        {
          kind: 'paragraph',
          text: '자격 증명은 제공자별로 해결됩니다. Anthropic에 로그인해도 OpenAI 요청이 인증되지는 않습니다. OMP는 현재 프로세스에 넘긴 키, `models.yml`에 고정한 키, 저장된 OAuth, 로그인으로 저장한 API 키, 제공자 환경 변수와 그 밖의 저장 키를 우선순위에 따라 확인합니다.',
        },
        {
          kind: 'exchange',
          input: { label: '`openai` 요청 직전', text: 'CLI 키 없음 · `models.yml` 키 없음\n저장된 OAuth 있음 · 환경 변수 키도 있음' },
          outputs: [
            { label: '선택', text: '우선순위가 높은 저장 OAuth를 사용\n환경 변수 키는 이번 요청의 후보에서 밀림' },
            { label: '전송', text: '어댑터가 해결된 액세스 토큰을 인증 헤더에 넣음\n모델 메시지나 도구 인자에는 넣지 않음' },
            { label: '기록', text: '세션은 선택한 모델·제공자를 기록\n원문 토큰을 대화 메시지로 저장하지 않음' },
          ],
        },
        {
          kind: 'paragraph',
          text: '`disabledProviders`는 이 탐색보다 먼저 적용됩니다. 유효한 토큰이 있어도 제공자가 비활성화되어 있으면 그 모델을 선택할 수 없습니다. 반대로 Ollama 같은 키 없는 로컬 제공자는 엔진이 응답하면 로그인 없이 가용 모델이 될 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 자격 증명 해석 순서', href: `${source}/docs/providers.md#credentials-and-precedence` },
            { text: 'OMP · 제공자별 가용성 조건', href: `${source}/docs/providers.md#how-omp-decides-a-provider-is-available` },
            { text: 'OMP · 자격 증명 저장과 선택', href: `${source}/packages/ai/src/auth-storage.ts` },
          ],
        },
      ],
    },
    {
      id: 'oauth-lifecycle',
      title: 'OAuth 액세스 토큰을 갱신한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`/login <provider>`는 해당 제공자의 브라우저 로그인이나 키 입력 흐름을 실행하고 자격 증명을 로컬 인증 저장소에 넣습니다. OAuth 행에는 액세스 토큰, 갱신 토큰, 만료 시각과 계정 범위가 들어갈 수 있습니다. `AuthStorage`는 만료 전에 액세스 토큰을 갱신하고 갱신된 값을 저장한 뒤 요청에 전달합니다.',
        },
        {
          kind: 'tool-sequence',
          title: '만료가 가까운 OAuth로 모델을 호출할 때',
          prompt: '현재 세션의 모델로 다음 응답을 생성해 줘.',
          actors: ['세션', '`AuthStorage`', 'OAuth 제공자'],
          events: [
            { from: 0, to: 1, kind: 'request', label: '자격 증명 요청', detail: '제공자와 세션 식별자를 넘겨 사용할 토큰을 요청합니다.' },
            { from: 1, to: 2, kind: 'call', label: '토큰 갱신', detail: '만료가 가까운 OAuth 자격 증명의 갱신 토큰으로 새 액세스 토큰을 요청합니다.' },
            { from: 2, to: 1, kind: 'result', label: '갱신 결과', detail: '새 액세스 토큰과 만료 시각을 반환합니다.' },
            { from: 1, to: 0, kind: 'result', label: '사용할 토큰', detail: '저장소를 갱신하고 이번 제공자 요청에 쓸 값을 돌려줍니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '갱신이 영구적으로 거부되면 해당 자격 증명을 계속 반복하지 않도록 비활성 상태로 기록할 수 있습니다. 여러 계정이 저장된 제공자에서는 사용량과 차단 상태를 고려해 다른 자격 증명을 선택할 수 있습니다. 세션에 어느 계정을 고정할지와 토큰 자체의 수명은 별개의 상태입니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 로그인과 OAuth 제공자 등록', href: `${treeSource}/packages/ai/src/registry/oauth` },
            { text: 'OMP · OAuth 갱신과 자격 증명 회전', href: `${source}/packages/ai/src/auth-storage.ts` },
            { text: 'OMP · 원격 브로커의 갱신 경계', href: `${source}/docs/auth-broker-gateway.md` },
          ],
        },
      ],
    },
    {
      id: 'storage-and-broker',
      title: '토큰을 실행 호스트 안에 가둔다',
      blocks: [
        {
          kind: 'paragraph',
          text: '기본 인증 저장소는 에이전트 디렉터리의 SQLite 데이터베이스에 API 키와 OAuth 자격 증명을 보관합니다. 원격 실행 환경에서는 인증 브로커를 둘 수 있습니다. 브로커가 갱신 토큰의 원본을 보유하고 클라이언트에는 갱신 토큰 대신 센티널이 든 스냅샷을 제공합니다. 만료 시 클라이언트가 브로커에 갱신을 요청하므로 장기 토큰을 개발 컨테이너에 복사할 필요가 없습니다.',
        },
        {
          kind: 'paragraph',
          text: '인증 게이트웨이는 브로커에서 자격 증명을 해결한 뒤 `pi-ai`의 제공자 로직으로 요청을 전달합니다. 이 경계도 네트워크 보안을 대신하지 않습니다. 운영자는 브로커와 게이트웨이의 bearer 토큰, TLS 또는 사설망, 접근 범위를 따로 관리해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 로컬·원격 인증 저장소 계약', href: `${source}/packages/ai/src/auth-storage.ts` },
            { text: 'OMP · 인증 브로커와 게이트웨이', href: `${source}/docs/auth-broker-gateway.md` },
          ],
        },
      ],
    },
    {
      id: 'secret-display-and-provider-context',
      title: '자격 증명과 대화 속 비밀을 따로 보호한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '인증 토큰은 제공자 요청의 헤더에 필요하지만, 진단 화면과 일반 설정 목록에는 원문으로 노출할 이유가 없습니다. `omp config list`는 자격 증명 설정을 마스킹하고 JSON 목록에서는 값을 생략합니다. 단일 키를 명시해 조회하는 `omp config get <key>`는 사용자가 요청한 값이므로 다른 표시 계약을 가집니다.',
        },
        {
          kind: 'paragraph',
          text: '도구 결과나 파일 내용에 우연히 등장한 비밀은 인증 저장소만으로 보호되지 않습니다. `secrets.enabled`를 켜면 OMP가 환경 변수와 `secrets.yml`의 값을 제공자에게 보내기 전에 결정적 자리표시자로 바꾸고, 모델이 그 자리표시자를 도구 인자에 사용하면 로컬 실행 직전에 원래 값으로 복원합니다. `replace` 모드는 한 방향 치환이라 복원하지 않습니다.',
        },
        {
          kind: 'execution-path',
          title: '로그 파일에 API 키가 들어 있을 때',
          input: { label: '주어진 상태', text: '`read` 결과에 실제 키가 포함됨 · `secrets.enabled: true`' },
          labels: { choose: '데이터가 이동하는 곳' },
          paths: [
            {
              label: '모델 제공자에게 보냄',
              stages: [
                { label: '탐지', text: '설정된 비밀이나 알려진 토큰 모양을 찾습니다.', state: 'complete' },
                { label: '치환', text: '원문을 `$$…$$` 자리표시자로 바꿉니다.', state: 'complete' },
                { label: '요청', text: '모델은 자리표시자가 든 도구 결과를 받습니다.', state: 'complete' },
              ],
              result: { label: '외부 노출 제한', text: '제공자 입력에는 원문 키가 포함되지 않습니다.' },
            },
            {
              label: '후속 로컬 도구를 실행함',
              stages: [
                { label: '모델 호출', text: '모델이 자리표시자를 포함한 도구 인자를 생성합니다.', state: 'complete' },
                { label: '복원', text: '하네스가 실행 직전에 복원 가능한 값을 되돌립니다.', state: 'complete' },
                { label: '실행', text: '로컬 도구는 실제 값으로 작업합니다.', state: 'complete' },
              ],
              result: { label: '로컬 사용 유지', text: '외부 모델에 원문을 보내지 않으면서 필요한 로컬 실행을 이어 갑니다.' },
            },
          ],
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 설정 출력의 자격 증명 마스킹', href: `${source}/docs/settings.md#subcommands` },
            { text: 'OMP · 대화 속 비밀 난독화와 복원', href: `${source}/docs/secrets.md` },
            { text: 'OMP · 비밀 처리 구현', href: `${treeSource}/packages/coding-agent/src/secrets` },
          ],
        },
      ],
    },
  ],
};

export const sessionStorageAndResumeTopic: Topic = {
  id: 'session-storage-and-resume',
  number: '24',
  title: '세션 저장과 재개',
  description: '전체 대화 트리를 JSONL 기록으로 남기고 선택한 분기만 다음 모델 입력으로 복원하는 세션 저장 구조.',
  sections: [
    {
      id: 'append-only-tree',
      title: '한 파일에 대화 트리를 덧붙인다',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP의 기본 `SessionManager`는 세션을 JSONL로 저장합니다. 논리적인 첫 항목은 세션 ID, 작업 디렉터리, 버전 등을 담은 헤더이고, 뒤에는 메시지·모델 변경·압축·분기 요약 같은 항목이 한 줄씩 붙습니다. 각 항목의 `id`와 `parentId`가 부모를 가리키므로 파일은 선형 채팅 로그가 아니라 트리입니다.',
        },
        {
          kind: 'code',
          language: 'jsonl',
          caption: '간단히 줄인 세션 트리 기록',
          code: `{"type":"session","version":3,"id":"session-a","cwd":"/work/app"}
{"type":"message","id":"u1","parentId":null,"message":{"role":"user","content":"설정을 읽어 줘"}}
{"type":"message","id":"a1","parentId":"u1","message":{"role":"assistant","content":"…read 호출…"}}
{"type":"message","id":"r1","parentId":"a1","message":{"role":"toolResult","content":"…"}}
{"type":"message","id":"u2","parentId":"r1","message":{"role":"user","content":"A 방식으로 수정해"}}
{"type":"message","id":"u3","parentId":"r1","message":{"role":"user","content":"B 방식으로 수정해"}}`,
        },
        {
          kind: 'paragraph',
          text: '`u2`와 `u3`은 같은 `r1`에서 갈라진 두 후속 요청입니다. 분기를 바꿀 때 OMP는 기존 항목을 삭제하지 않고 현재 잎을 가리키는 `leafId`만 옮깁니다. 새 메시지는 선택한 잎을 부모로 삼아 덧붙으므로 버린 분기도 파일에 남아 나중에 다시 살펴볼 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 세션 JSONL 형식과 항목 종류', href: `${source}/docs/session.md#file-format` },
            { text: 'OMP · 트리와 활성 잎의 의미', href: `${source}/docs/session.md#tree-and-leaf-semantics` },
            { text: 'OMP · 세션 항목 타입', href: `${source}/packages/coding-agent/src/session/session-entries.ts` },
          ],
        },
      ],
    },
    {
      id: 'saved-tree-and-model-context',
      title: '저장된 트리에서 한 경로만 복원한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`buildSessionContext()`는 현재 잎에서 `parentId`를 따라 루트까지 올라간 뒤 순서를 뒤집습니다. 이 경로에 있는 모델·추론 수준 변경을 상태로 복원하고, 메시지와 분기 요약을 모델용 대화로 바꿉니다. 다른 분기의 메시지는 JSONL에 남지만 이번 모델 요청에는 들어가지 않습니다.',
        },
        {
          kind: 'execution-path',
          title: '`r1` 뒤에서 B 분기를 선택한 경우',
          input: { label: '저장 파일', text: '`u1 → a1 → r1` 뒤에 `u2`와 `u3`가 모두 존재\n현재 `leafId = u3`' },
          labels: { choose: '읽는 표면' },
          paths: [
            {
              label: '세션 기록을 감사함',
              stages: [
                { label: '파일 읽기', text: '삽입 순서의 모든 항목을 읽습니다.', state: 'complete' },
                { label: '트리 구성', text: '`u2`와 `u3`가 같은 부모에서 갈라졌음을 확인합니다.', state: 'complete' },
                { label: '표시', text: '필요하면 두 분기를 모두 탐색할 수 있습니다.', state: 'complete' },
              ],
              result: { label: '저장된 트리', text: 'A와 B 선택이 모두 남습니다.' },
            },
            {
              label: '다음 모델 요청을 만듦',
              stages: [
                { label: '잎 선택', text: '`u3`에서 부모를 따라갑니다.', state: 'complete' },
                { label: '경로 복원', text: '`u1 → a1 → r1 → u3`만 대화로 바꿉니다.', state: 'complete' },
                { label: '다른 분기', text: '`u2`는 이번 입력에서 제외합니다.', state: 'skipped' },
              ],
              result: { label: '모델 컨텍스트', text: '공통 조사와 B 요청만 다음 응답의 전제가 됩니다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '최신 압축 항목이나 `/clear`의 `reset_boundary`가 경로에 있으면 방출 범위가 더 좁아집니다. 전체 기록을 보존하는 일과 다음 호출의 컨텍스트를 구성하는 일은 같은 연산이 아닙니다. 하네스는 저장 형식과 모델 입력 형식을 분리해야 분기·압축·초기화를 되돌릴 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 활성 경로의 컨텍스트 재구성', href: `${source}/docs/session.md#context-reconstruction-buildsessioncontext` },
            { text: 'OMP · 컨텍스트 구성 구현', href: `${source}/packages/coding-agent/src/session/session-context.ts` },
          ],
        },
      ],
    },
    {
      id: 'resume-and-fork',
      title: '재개는 열고, 포크는 새 정체성을 만든다',
      blocks: [
        {
          kind: 'paragraph',
          text: '재개는 기존 세션 파일을 열어 현재 경로의 메시지, 모델, 추론 수준과 모드 상태를 실행 중인 세션에 적용합니다. 다른 프로젝트의 세션을 열면 기록된 작업 디렉터리로 범위를 바꾸고 그 디렉터리의 설정과 리소스를 다시 불러옵니다. 세션 전환 중 오류가 나면 캡처해 둔 이전 상태를 복구합니다.',
        },
        {
          kind: 'paragraph',
          text: '포크는 기존 기록을 바탕으로 새 세션 ID와 새 JSONL 파일을 만듭니다. 새 헤더의 `parentSession`은 원본 계보를 가리키고, 기존 비헤더 항목은 그대로 유지됩니다. 대화는 같은 출발점을 갖지만 이후 항목은 서로 다른 파일에 쌓입니다. 세션 아티팩트 디렉터리는 가능하면 새 세션 쪽으로 복사하고, 전역 콘텐츠 해시로 저장한 이미지 blob은 복사하지 않아도 됩니다.',
        },
        {
          kind: 'exchange',
          input: { label: '원본 세션', text: '`session-a` · 현재 분기 `u1 → a1 → r1 → u3`' },
          outputs: [
            { label: '재개', text: '같은 세션 파일과 ID를 다시 엶\n새 대화 항목은 원본 트리에 이어서 기록' },
            { label: '포크', text: '새 `session-b` 파일과 `parentSession: session-a` 생성\n복사한 출발점 뒤에서 독립적으로 기록' },
            { label: '새 세션', text: '빈 정체성과 빈 대화에서 시작\n원본 경로를 자동으로 가져오지 않음' },
          ],
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 재개·포크 동작 표', href: `${source}/docs/session-operations-export-share-fork-resume.md#operation-matrix` },
            { text: 'OMP · 세션 전환이 복원하는 런타임 상태', href: `${source}/docs/session-operations-export-share-fork-resume.md#how-session-switching-actually-mutates-runtime-state` },
            { text: 'OMP · 포크의 파일과 헤더 처리', href: `${source}/docs/session-operations-export-share-fork-resume.md#fork` },
          ],
        },
      ],
    },
    {
      id: 'persistence-boundary',
      title: '완료된 항목을 내구성의 경계로 삼는다',
      blocks: [
        {
          kind: 'paragraph',
          text: '생성 중인 텍스트 조각은 세션 파일에 매번 쓰지 않습니다. 하나의 메시지가 완료되어 항목으로 추가될 때 메모리와 저장소가 함께 갱신됩니다. 새 세션은 첫 `assistant` 메시지가 생기거나 `ensureOnDisk()`를 호출하기 전까지 메모리에만 있을 수 있습니다.',
        },
        {
          kind: 'paragraph',
          text: '`flush()`는 대기 중인 쓰기를 비우지만 디스크의 `fsync`까지 보장하지 않습니다. 저장 실패는 내부에 보관했다가 뒤의 쓰기·종료에서 다시 던집니다. 따라서 “화면에 스트리밍되었다”, “완료 메시지로 기록되었다”, “전원 손실에도 안전하게 동기화되었다”는 서로 다른 보장입니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 세션 쓰기와 실패 모델', href: `${source}/docs/session.md#persistence-guarantees-and-failure-model` },
            { text: 'OMP · 교체 가능한 세션 저장소', href: `${source}/docs/session.md#storage-abstractions` },
          ],
        },
      ],
    },
  ],
};

export const contextCompactionTopic: Topic = {
  id: 'context-compaction',
  number: '25',
  title: '컨텍스트 압축',
  description: '오래된 대화를 요약 항목으로 바꾸고 최근 작업은 원문으로 남겨 제한된 모델 입력을 다시 구성하는 유지 관리.',
  sections: [
    {
      id: 'why-and-when',
      title: '한도에 닿기 전에 입력을 다시 짠다',
      blocks: [
        {
          kind: 'paragraph',
          text: '세션 기록은 계속 늘지만 모델은 한 번에 유한한 컨텍스트만 읽습니다. OMP의 압축은 이전 항목을 삭제하는 대신, 현재 분기의 오래된 구간을 요약하고 최근 메시지의 원문을 유지한 `compaction` 항목을 덧붙입니다. 다음 요청은 이 요약과 보존 구간으로 입력을 다시 만듭니다.',
        },
        {
          kind: 'paragraph',
          text: '압축은 사용자의 `/compact`, 컨텍스트 초과 복구, 출력 길이 제한으로 끝난 응답의 복구, 성공한 턴 뒤의 임계값 검사, 도구 루프 중간의 안전한 경계, 유휴 유지 관리에서 시작될 수 있습니다. 컨텍스트 초과와 출력 미완료에서는 더 큰 컨텍스트 모델로 승격할 대상이 있는지 먼저 확인하고, 없을 때 압축을 시도합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 압축 트리거', href: `${source}/docs/compaction.md#triggers` },
            { text: 'OMP · 초과·미완료·임계값 경로의 차이', href: `${source}/docs/compaction.md#overflowincomplete-recovery-vs-thresholdidle-maintenance` },
            { text: 'OMP · 세션 유지 관리', href: `${source}/packages/coding-agent/src/session/session-maintenance.ts` },
          ],
        },
      ],
    },
    {
      id: 'select-and-retain',
      title: '요약할 구간과 남길 구간을 나눈다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`prepareCompaction()`은 현재 활성 경로에서 최신 압축과 `/clear` 경계를 반영한 뒤 하나의 메시지 열을 만듭니다. 이 열을 오래되어 요약할 메시지, 한 턴의 중간에서 잘릴 때 별도로 요약할 앞부분, 원문으로 남길 최근 메시지로 나눕니다. `toolResult`에서 바로 자르지 않아 도구 호출과 결과의 짝을 보존합니다.',
        },
        {
          kind: 'execution-path',
          title: '100k 토큰 대화에서 최근 20k를 남기는 예',
          input: { label: '압축 전 활성 경로', text: '초기 조사 60k · 중간 수정 20k · 최근 실행과 결과 20k' },
          labels: { choose: '압축 뒤 보는 표면' },
          paths: [
            {
              label: '세션 JSONL',
              stages: [
                { label: '기존 항목', text: '초기 조사부터 최근 결과까지 원래 항목이 남습니다.', state: 'complete' },
                { label: '압축 항목', text: '`summary`, `firstKeptEntryId`, `tokensBefore`를 덧붙입니다.', state: 'complete' },
                { label: '계속 기록', text: '새 메시지는 압축 항목 뒤에 추가됩니다.', state: 'complete' },
              ],
              result: { label: '감사 가능한 기록', text: '원문 트리와 압축 시점·경계를 함께 보존합니다.' },
            },
            {
              label: '다음 모델 입력',
              stages: [
                { label: '이전 80k', text: '결정·문제·파일 작업을 담은 압축 요약으로 바꿉니다.', state: 'complete' },
                { label: '최근 20k', text: '`firstKeptEntryId`부터 원문 메시지를 다시 넣습니다.', state: 'complete' },
                { label: '새 대화', text: '압축 뒤에 추가된 메시지도 이어 붙입니다.', state: 'complete' },
              ],
              result: { label: '줄어든 컨텍스트', text: '최근 도구 호출의 정확한 인자와 결과를 유지하면서 오래된 세부를 요약합니다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '요약 전에는 큰 도구 결과를 잘라 토큰을 줄일 수 있습니다. 최근 출력, 스킬 내용, 활성 계획 파일처럼 다시 필요한 결과는 보호하고, 오래된 검색 결과나 뒤의 읽기로 대체된 출력은 자리표시자로 줄입니다. 이 단계도 저장 항목의 호출·결과 짝을 유지합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 압축 경계와 절단점', href: `${source}/docs/compaction.md#boundary-and-cut-point-logic` },
            { text: 'OMP · 압축 전 도구 결과 가지치기', href: `${source}/docs/compaction.md#pre-compaction-pruning` },
            { text: 'OMP · 압축 준비 구현', href: `${source}/packages/agent/src/compaction/compaction.ts` },
          ],
        },
      ],
    },
    {
      id: 'summary-and-record',
      title: '요약을 세션 항목으로 기록한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '일반 요약 방식은 선택한 대화를 직렬화하고 이전 요약과 추가 컨텍스트를 함께 요약 모델에 보냅니다. 결과에는 진행 중인 목표와 결정뿐 아니라 누적해서 읽거나 수정한 파일 목록도 붙습니다. 한 턴의 중간을 잘랐다면 이전 대화 요약과 그 턴 앞부분의 요약을 나눠 만들어 도구 작업의 맥락을 잃지 않게 합니다.',
        },
        {
          kind: 'paragraph',
          text: '완성된 결과는 `CompactionEntry`로 저장됩니다. `summary`는 모델에 다시 넣을 내용이고, `firstKeptEntryId`는 원문으로 되살릴 시작점이며, `tokensBefore`는 압축 전 규모를 기록합니다. 세션을 재개할 때도 이 항목에서 같은 입력 경계를 다시 구성할 수 있습니다.',
        },
        {
          kind: 'note',
          title: '요약은 원문을 대체하는 모델 입력입니다',
          text: '압축 뒤 화면의 이전 대화는 그대로 보일 수 있지만 모델은 그 구간의 원문 대신 요약을 읽습니다. 요약이 빠뜨린 세부는 현재 컨텍스트에 없는 정보이므로, 중요한 파일 내용과 현재 상태는 도구로 다시 확인해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 요약 생성과 파일 작업 문맥', href: `${source}/docs/compaction.md#summary-generation` },
            { text: 'OMP · 압축 항목의 저장과 재구성', href: `${source}/docs/compaction.md#persist-and-reload` },
            { text: 'OMP · 세션의 압축 항목 모델', href: `${source}/docs/compaction.md#session-entry-model` },
          ],
        },
      ],
    },
    {
      id: 'strategies-and-failure',
      title: '압축 방식이 달라도 같은 경계를 지킨다',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP는 제공자 자체 압축, 대화를 이미지 프레임으로 직렬화하는 SnapCompact, `handoff` 문서, 기계적으로 내용을 덜어 내는 `shake`, 일반 텍스트 요약을 설정한 순서대로 시도할 수 있습니다. 방식마다 보존 표현은 다르지만, 성공하면 압축 항목을 기록하고 활성 메시지를 그 경계에서 다시 구성합니다.',
        },
        {
          kind: 'paragraph',
          text: '자동 압축이 실패하면 초과 복구, 미완료 복구, 임계값 유지 관리에 맞는 오류를 내고 무한 재시도를 막습니다. 확장은 `session_before_compact`에서 취소하거나 완성된 압축 결과를 제공할 수 있고, `session.compacting`에서 기본 요약의 프롬프트와 추가 컨텍스트를 조정할 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 압축 전략과 기본 순서', href: `${source}/docs/compaction.md#settings-and-defaults` },
            { text: 'OMP · 압축 훅', href: `${source}/docs/compaction.md#extension-and-hook-touchpoints` },
            { text: 'OMP · 실패와 취소 동작', href: `${source}/docs/compaction.md#runtime-behavior-and-failure-semantics` },
          ],
        },
      ],
    },
  ],
};

export const crossSessionMemoryTopic: Topic = {
  id: 'cross-session-memory',
  number: '26',
  title: '세션 간 메모리',
  description: '과거 세션에서 남긴 지식과 결정을 별도 저장소에서 찾아 새 세션의 배경 문맥으로 돌려주는 계층.',
  sections: [
    {
      id: 'memory-time-scale',
      title: '세션 기록보다 오래 남는 문맥',
      blocks: [
        {
          kind: 'paragraph',
          text: '세션 재개는 한 JSONL 트리의 활성 경로를 복원하고, 압축은 그 경로의 입력 크기를 줄입니다. 메모리는 여러 세션에서 다시 쓸 만한 결정·제약·작업 방식을 별도 저장소에 보관합니다. 새 세션은 이전 대화를 통째로 읽는 대신 현재 요청과 관련된 메모리만 받아 시작할 수 있습니다.',
        },
        {
          kind: 'exchange',
          input: { label: '세션 A에서 확인한 사실', text: '`packages/api`의 공개 응답 필드는 `snake_case`를 유지한다.' },
          outputs: [
            { label: '세션 기록', text: '질문·파일 읽기·수정·검사 전체를 JSONL 트리에 보존\n세션 A를 재개할 때 사용' },
            { label: '압축 요약', text: '세션 A의 오래된 구간을 현재 분기용 요약으로 대체\n같은 세션의 다음 모델 요청에 사용' },
            { label: '장기 메모리', text: '응답 필드 규칙과 근거를 내구성 있는 지식으로 보관\n관련된 세션 B에서 회상' },
          ],
        },
        {
          kind: 'paragraph',
          text: 'OMP는 `off`, 프로젝트 세션을 요약하는 `local`, 원격 Hindsight, 로컬 SQLite 기반 `mnemopi`, 결정 파일을 관리하는 `sharpshooter` 가운데 하나를 `memory.backend`로 선택합니다. 백엔드마다 저장 형식과 도구가 다르므로 세션은 공통 메모리 인터페이스를 통해 주입·회상·종료 처리를 요청합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 메모리 백엔드와 주입', href: `${source}/docs/memory.md` },
            { text: 'OMP · 메모리 백엔드 계약', href: `${treeSource}/packages/coding-agent/src/memory-backend` },
          ],
        },
      ],
    },
    {
      id: 'retain-and-recall',
      title: '보존한 내용을 다음 세션에서 회상한다',
      blocks: [
        {
          kind: 'tool-sequence',
          title: 'Mnemopi에 보존한 규칙이 새 세션 입력에 들어가기까지',
          prompt: '새 API 엔드포인트를 추가해 줘.',
          actors: ['세션 A 런타임', 'Mnemopi 백엔드', '세션 B 런타임'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '보존', detail: '완료한 대화에서 재사용할 규칙과 근거를 저장합니다.' },
            { from: 2, to: 1, kind: 'request', label: '회상', detail: '새 요청과 최근 문맥으로 관련 메모리를 검색합니다.' },
            { from: 1, to: 2, kind: 'result', label: '배경 문맥', detail: '`snake_case` 규칙의 미리보기와 메모리 ID를 반환합니다.' },
            { from: 2, to: 2, kind: 'request', label: '첫 모델 입력', detail: '회상 결과를 `<memories>` 배경 블록으로 구성해 모델에게 전달합니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '자동 보존은 모든 문장을 그대로 복사하는 기능이 아닙니다. 백엔드는 완료된 턴에서 내구성 있는 사실을 추출하거나, 모델이 `retain`·`learn` 도구로 넘긴 명시적 교훈을 저장합니다. 회상 결과에는 토큰 예산과 개수 제한이 적용되며, 긴 행은 미리보기로 잘릴 수 있습니다.',
        },
        {
          kind: 'paragraph',
          text: '회상한 텍스트는 지시가 아니라 배경 문맥입니다. 현재 사용자 요청과 저장소의 실제 코드가 우선합니다. 메모리가 작업 방향을 바꾸면 전체 메모리와 현재 파일을 함께 확인해야 오래된 결정을 현재 규칙으로 오인하지 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 세션 시작의 메모리 주입과 신뢰 규칙', href: `${source}/docs/memory.md#what-gets-injected` },
            { text: 'OMP · memory:// 읽기', href: `${source}/docs/memory.md#reading-memory-artifacts` },
            { text: 'OMP · 메모리 URL 처리기', href: `${source}/packages/coding-agent/src/internal-urls/memory-protocol.ts` },
          ],
        },
      ],
    },
    {
      id: 'mnemopi-example',
      title: 'Mnemopi: 로컬 SQLite 메모리의 예',
      blocks: [
        {
          kind: 'paragraph',
          text: '`memory.backend: mnemopi`를 선택하면 OMP가 로컬 Mnemopi SQLite 은행을 엽니다. 기본 프로젝트 범위에서는 작업 디렉터리에서 유도한 은행에 쓰고 같은 프로젝트에서 회상합니다. `per-project-tagged`는 프로젝트 은행에 쓰면서 공용 은행의 메모리도 함께 검색합니다.',
        },
        {
          kind: 'code',
          language: 'yaml',
          caption: '프로젝트 메모리와 공용 메모리를 함께 검색',
          code: `memory:
  backend: mnemopi
mnemopi:
  scoping: per-project-tagged
  autoRecall: true
  autoRetain: true
  recallLimit: 8`,
        },
        {
          kind: 'paragraph',
          text: 'Mnemopi를 쓰면 `recall`, `retain`, `reflect`, `memory_edit`가 발견 가능한 도구가 됩니다. `recall` 결과는 짧은 미리보기와 ID를 반환합니다. `memory_edit update`는 내용을 통째로 바꾸므로 먼저 `read memory://<memory-id>`로 잘리지 않은 행을 읽어야 보이지 않던 뒤쪽 내용을 지우지 않습니다.',
        },
        {
          kind: 'paragraph',
          text: '세션의 첫 모델 턴에는 자동 회상 결과가 `<memories>` 블록으로 들어갈 수 있고, 압축 때도 백엔드가 추가 문맥을 제공할 수 있습니다. 종료 시에는 현재 턴의 보존과 진행 중 추출을 제한된 시간 동안 비웁니다. 더 강한 처리 경계가 필요하면 `/memory enqueue`로 현재 세션 보존과 대기 중 작업을 명시적으로 실행합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · Mnemopi 백엔드 동작', href: `${source}/docs/mnemosyne-memory-backend.md` },
            { text: 'OMP · Mnemopi 도구와 전체 행 읽기', href: `${source}/docs/mnemosyne-memory-backend.md#agent-tools` },
            { text: 'OMP · 종료와 내구성 경계', href: `${source}/docs/mnemosyne-memory-backend.md#shutdown-and-durability` },
          ],
        },
      ],
    },
    {
      id: 'local-memory-pipeline',
      title: '로컬 요약 백엔드는 두 단계로 정리한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`local` 백엔드는 과거의 영속 세션마다 결정·제약·실패 해결법을 먼저 추출하고, 두 번째 모델 단계에서 여러 추출물을 `MEMORY.md`, 짧은 주입용 요약, 재사용 가능한 스킬로 통합합니다. 사용자가 `learn`으로 남긴 `learned.md`는 이 통합이 덮어쓰지 않습니다.',
        },
        {
          kind: 'paragraph',
          text: '최근에 아직 실행 중인 세션, 너무 오래된 세션, 비영속 세션과 하위 에이전트 세션은 처리 대상에서 빠질 수 있습니다. 여러 프로세스가 동시에 시작해도 임대와 하트비트로 같은 통합 작업을 중복 수행하지 않도록 조정합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 로컬 메모리 추출과 통합', href: `${source}/docs/memory.md#how-it-works` },
            { text: 'OMP · 로컬 메모리 파이프라인', href: `${treeSource}/packages/coding-agent/src/memories` },
          ],
        },
      ],
    },
  ],
};

export const artifactsAndInternalUrlsTopic: Topic = {
  id: 'artifacts-and-internal-urls',
  number: '27',
  title: '아티팩트와 내부 URL',
  description: '큰 도구 출력과 바이너리를 세션 기록 밖에 저장하고 짧은 미리보기와 주소로 다시 읽게 하는 저장 계층.',
  sections: [
    {
      id: 'bounded-tool-output',
      title: '모델에는 미리보기, 저장소에는 전체 출력',
      blocks: [
        {
          kind: 'paragraph',
          text: '셸이나 Python 실행이 큰 출력을 만들면 `OutputSink`는 모델에게 보낼 메모리 버퍼를 일정 크기로 제한합니다. 출력이 임계값을 넘거나 한 줄의 열 제한으로 일부를 버려야 하면, 세션에 파일 기반 아티팩트 경로가 있을 때 정제된 전체 스트림을 아티팩트 파일에도 씁니다.',
        },
        {
          kind: 'exchange',
          input: { label: '`npm test` 출력', text: '수천 개 테스트의 로그와 마지막 실패 스택\n전체 출력이 모델용 버퍼 한도를 넘음' },
          outputs: [
            { label: '이번 도구 결과의 모델 문맥', text: '설정에 따라 `tail` 또는 `head+tail`로 줄인 출력과 생략 표시\n전체 파일을 가리키는 `artifact://7`' },
            { label: '세션 아티팩트 파일', text: '`7.bash.log`에 정제된 전체 스트림 보존\n다음 요청에 자동으로 전부 삽입하지 않음' },
            { label: '후속 조사', text: '`read artifact://7:120-180` 또는 실제 파일 검색\n실패 근처만 골라 새 도구 결과로 가져옴' },
          ],
        },
        {
          kind: 'paragraph',
          text: '처음 모델 입력에 들어가는 것은 도구가 반환한 제한된 미리보기와 아티팩트 ID뿐입니다. 전체 로그는 모델이 `read`로 필요한 범위를 요청했을 때 새 결과로 들어옵니다. 이 구분이 없으면 한 번의 장황한 명령이 컨텍스트를 소진하고 뒤의 수정·검사 단계를 밀어냅니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 큰 도구 출력의 분리 저장과 미리보기', href: `${source}/docs/blob-artifact-architecture.md#3-tool-output-spilltruncation-path` },
            { text: 'OMP · 스트리밍 출력 구현', href: `${source}/packages/coding-agent/src/session/streaming-output.ts` },
          ],
        },
      ],
    },
    {
      id: 'artifact-urls',
      title: '`artifact://`로 저장한 출력을 다시 연다',
      blocks: [
        {
          kind: 'paragraph',
          text: '아티팩트 ID는 세션 안에서 0부터 증가하는 숫자입니다. `artifact://<id>` 처리기는 호출 세션의 아티팩트 디렉터리를 먼저 찾고 `<id>.`로 시작하는 파일의 텍스트를 반환합니다. 세션을 재개하면 기존 번호를 스캔해 그 다음 ID부터 할당하므로 파일을 덮어쓰지 않습니다.',
        },
        {
          kind: 'paragraph',
          text: '`read`는 내부 URL에도 줄 범위와 `raw` 선택자를 적용합니다. 크기와 관계없이 범위 선택 읽기는 백잉 파일에서 필요한 줄만 스트리밍하고, 선택자 없는 읽기는 제한된 기본 페이지를 돌려줍니다. 무제한 `:raw`는 50 KiB를 넘으면 거부되고, 다른 소비자가 프로토콜 수준에서 전체 리소스를 물질화할 때는 8 MiB 상한이 적용됩니다. 두 경우 모두 범위 선택자나 백잉 파일 경로로 조사를 이어 갈 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · artifact:// 해석과 크기 제한', href: `${source}/docs/blob-artifact-architecture.md#artifactid` },
            { text: 'OMP · read의 artifact:// 선택자와 상한', href: `${source}/docs/tools/read.md#internal-urls` },
            { text: 'OMP · 아티팩트 URL 처리기', href: `${source}/packages/coding-agent/src/internal-urls/artifact-protocol.ts` },
            { text: 'OMP · 아티팩트 ID 할당', href: `${source}/packages/coding-agent/src/session/artifacts.ts` },
          ],
        },
      ],
    },
    {
      id: 'three-reference-systems',
      title: '텍스트 출력과 바이너리의 수명을 구분한다',
      blocks: [
        {
          kind: 'exchange',
          input: { label: '세션 기록 밖에 둘 데이터', text: '큰 셸 로그 · 하위 에이전트 보고서 · 이미지 `base64`' },
          outputs: [
            { label: '`artifact://<number>`', text: '세션별 큰 도구 텍스트 출력\n숫자 ID와 `.log` 파일' },
            { label: '`agent://<name>`', text: '세션별 하위 에이전트 Markdown 출력\n이름 기반 ID와 선택적 JSON 추출' },
            { label: '`blob:sha256:<hash>`', text: '세션 항목 안의 큰 이미지 페이로드\n전역 콘텐츠 해시 저장소에서 로드할 때 복원' },
          ],
        },
        {
          kind: 'paragraph',
          text: '`blob:`은 내부 URL 라우터가 모델 요청 중에 읽는 주소가 아니라 세션 영속화용 참조입니다. 세션을 열 때 `SessionManager`가 `blob`을 다시 `base64`나 `data` URL로 복원합니다. 같은 바이트는 여러 세션에서 같은 해시를 쓰지만, `artifact://7`은 세션마다 다른 파일을 뜻할 수 있습니다.',
        },
        {
          kind: 'paragraph',
          text: '포크가 성공적으로 아티팩트 디렉터리를 복사하면 새 세션은 복사한 최대 숫자 다음부터 ID를 이어 갑니다. blob은 전역이라 복사하지 않습니다. 저장 체계별 정체성과 수명을 지켜야 포크나 재개 뒤에 같은 주소가 다른 데이터를 가리키지 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · blob과 아티팩트를 나눈 이유', href: `${source}/docs/blob-artifact-architecture.md#why-two-storage-systems-exist` },
            { text: 'OMP · 내부 URL 접근 모델', href: `${source}/docs/blob-artifact-architecture.md#url-access-model` },
            { text: 'OMP · 재개·포크·이동 시 의미', href: `${source}/docs/blob-artifact-architecture.md#resume-fork-and-move-semantics` },
          ],
        },
      ],
    },
    {
      id: 'artifact-failure-boundary',
      title: '저장 실패를 미리보기 성공과 혼동하지 않는다',
      blocks: [
        {
          kind: 'paragraph',
          text: '아티팩트 파일을 열지 못해도 도구는 제한된 메모리 출력으로 계속 반환할 수 있습니다. 이때 전체 출력은 저장되지 않았으므로 존재하지 않는 `artifactId`를 결과에 넣지 않습니다. 반대로 blob 파일을 찾지 못한 세션 로드는 경고를 남기고 참조 문자열을 유지한 채 계속됩니다.',
        },
        {
          kind: 'paragraph',
          text: '하네스는 “도구가 끝났다”와 “전체 출력이 나중에 다시 읽을 수 있다”를 따로 기록해야 합니다. 테스트 명령의 마지막 실패 줄만 남고 아티팩트 저장이 실패했다면, 사용자는 명령을 좁혀 다시 실행하거나 원래 출력원을 다시 만들어야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 아티팩트와 blob의 실패 처리', href: `${source}/docs/blob-artifact-architecture.md#failure-handling-and-fallback-paths` },
          ],
        },
      ],
    },
  ],
};

export const checkpointsAndRewindTopic: Topic = {
  id: 'checkpoints-and-rewind',
  number: '28',
  title: '체크포인트와 되돌리기',
  description: '조사 전 대화 경계를 표시하고 탐색 분기를 짧은 보고서로 접어 다음 모델 입력을 되돌리는 기능.',
  sections: [
    {
      id: 'conversation-checkpoint',
      title: '파일이 아니라 대화 경계를 표시한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`checkpoint`와 `rewind`는 기본으로 꺼져 있으며 `checkpoint.enabled`를 켜야 등록됩니다. 모델이 `checkpoint({ goal })`을 성공적으로 호출하면 세션은 그 도구 결과 뒤의 메시지 수와 세션 항목 ID, 시작 시각을 활성 체크포인트로 기억합니다. 별도의 Git 커밋이나 파일 스냅샷은 만들지 않습니다.',
        },
        {
          kind: 'exchange',
          input: { label: '`checkpoint`가 포착하는 것', text: '조사를 시작하기 직전의 활성 대화 위치' },
          outputs: [
            { label: '포함', text: '메시지 개수 · 세션 항목 ID · 시작 시각\n재개 뒤에도 성공한 도구 결과에서 경계를 재구성' },
            { label: '포함하지 않음', text: '작업 트리 파일 · Git 인덱스 · 실행 중 프로세스\n아티팩트와 blob · 인증 저장소' },
          ],
        },
        {
          kind: 'paragraph',
          text: '활성 체크포인트가 있는데 모델이 보고 없이 끝내려 하면 세션은 `rewind`를 호출하라는 개발자 메시지를 넣고 실행을 이어 갑니다. 한 세션에는 활성 체크포인트를 하나만 둘 수 있어 어느 경계로 돌아갈지 모호하지 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · checkpoint의 캡처 범위', href: `${source}/docs/tools/checkpoint.md` },
            { text: 'OMP · checkpoint와 rewind 구현', href: `${source}/packages/coding-agent/src/tools/checkpoint.ts` },
          ],
        },
      ],
    },
    {
      id: 'rewind-flow',
      title: '탐색 대화를 보고서 하나로 접는다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`rewind({ report })` 도구가 성공하면 즉시 메시지를 지우지 않습니다. 세션은 보고서를 보관했다가 그 assistant 턴이 끝나는 시점에 체크포인트 항목으로 분기합니다. 이어 탐색 분기의 요약인 `branch_summary`와 다음 턴에 쓸 숨은 `rewind-report` 메시지를 추가하고 활성 모델 컨텍스트를 다시 만듭니다.',
        },
        {
          kind: 'tool-sequence',
          title: '두 구현을 조사한 뒤 핵심만 유지하기',
          prompt: '캐시 무효화 방식 A와 B를 조사하고 추천해 줘.',
          actors: ['모델', '세션 런타임', '읽기·검색 도구'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '`checkpoint`', detail: '조사 목표를 남기고 현재 대화 경계를 표시합니다.' },
            { from: 0, to: 1, kind: 'call', label: '탐색 호출 생성', detail: 'A·B 구현을 읽고 검색하는 도구 호출을 만듭니다.' },
            { from: 1, to: 2, kind: 'call', label: '읽기·검색 실행', detail: '등록된 읽기 전용 도구로 현재 저장소를 조사합니다.' },
            { from: 2, to: 1, kind: 'result', label: '탐색 결과', detail: '파일 내용과 검색 일치를 런타임에 돌려줍니다.' },
            { from: 1, to: 0, kind: 'result', label: '도구 결과', detail: '체크포인트 뒤 대화에 결과를 추가해 다음 모델 턴에 전달합니다.' },
            { from: 0, to: 1, kind: 'call', label: '`rewind`', detail: '“A는 전역 삭제, B는 키별 무효화…”라는 보고서를 제출합니다.' },
            { from: 1, to: 1, kind: 'result', label: '분기와 요약 기록', detail: '턴 종료 시 세션 트리의 잎을 체크포인트로 옮기고 보고서 항목을 덧붙입니다.' },
            { from: 1, to: 0, kind: 'request', label: '재구성한 컨텍스트', detail: '긴 탐색 로그 대신 체크포인트 이전 대화와 보고서를 다음 턴에 제공합니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '원래 탐색 항목과 성공한 `rewind` 호출은 JSONL에서 삭제되지 않습니다. 새 활성 분기의 부모 경로에 없어서 다음 모델 요청에서 빠질 뿐입니다. 따라서 컨텍스트는 짧아지면서도 사용자는 세션 트리에서 버린 탐색 분기를 감사할 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · rewind 적용 순서', href: `${source}/docs/tools/rewind.md#flow` },
            { text: 'OMP · 분기 요약을 모델 입력으로 복원', href: `${source}/packages/coding-agent/src/session/session-context.ts` },
            { text: 'OMP · 체크포인트 상태 재구성', href: `${source}/packages/coding-agent/src/session/checkpoint-entries.ts` },
          ],
        },
      ],
    },
    {
      id: 'filesystem-consequence',
      title: '대화는 돌아가도 파일 변경은 남는다',
      blocks: [
        {
          kind: 'paragraph',
          text: '조사 중 도구가 파일을 수정했다면 `rewind` 뒤에도 그 변경은 작업 트리에 남습니다. 체크포인트는 파일 내용을 캡처하지 않고, 되돌리기는 파일·프로세스·아티팩트를 복원하지 않기 때문입니다. 탐색만 버릴 계획이라면 읽기 전용 도구를 쓰거나 파일 복구 수단을 별도로 마련해야 합니다.',
        },
        {
          kind: 'execution-path',
          title: '체크포인트 뒤 `config.ts`를 수정한 경우',
          input: { label: '주어진 상태', text: '체크포인트 → `edit config.ts` 성공 → 테스트 실패 → 보고서와 함께 `rewind`' },
          labels: { choose: '되돌린 뒤 확인할 대상' },
          paths: [
            {
              label: '모델 대화',
              stages: [
                { label: '분기 이동', text: '활성 잎을 체크포인트 위치로 옮깁니다.', state: 'complete' },
                { label: '탐색 로그', text: '편집 호출과 실패 로그가 다음 입력에서 빠집니다.', state: 'skipped' },
                { label: '보고서', text: '실패 원인과 결론을 짧게 유지합니다.', state: 'complete' },
              ],
              result: { label: '짧아진 컨텍스트', text: '다음 모델 턴은 보고서에서 이어 갑니다.' },
            },
            {
              label: '작업 트리',
              stages: [
                { label: '파일 스냅샷', text: '체크포인트가 파일을 저장하지 않았습니다.', state: 'skipped' },
                { label: '자동 복원', text: '`rewind`는 역편집을 실행하지 않습니다.', state: 'skipped' },
                { label: '현재 파일', text: '`config.ts`에는 앞서 성공한 편집이 남습니다.', state: 'complete' },
              ],
              result: { label: '변경 유지', text: '필요하면 별도의 편집이나 버전 관리 작업으로 복구해야 합니다.' },
            },
          ],
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · rewind가 복원하지 않는 상태', href: `${source}/docs/tools/rewind.md#notes` },
            { text: 'OMP · checkpoint의 제한', href: `${source}/docs/tools/checkpoint.md#limits--caps` },
          ],
        },
      ],
    },
    {
      id: 'resume-and-errors',
      title: '중단된 체크포인트도 세션에서 복원한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '프로세스가 `checkpoint` 뒤 `rewind` 전에 끝나도 성공한 체크포인트 도구 결과는 세션에 남습니다. 재개 시 현재 분기에서 최근의 미완료 체크포인트를 찾아 활성 경계를 복원합니다. 이미 완료한 `rewind-report`가 있으면 다시 되돌리지 않고 그 보고서에서 계속하라는 오류를 반환합니다.',
        },
        {
          kind: 'paragraph',
          text: '활성 체크포인트가 없거나 보고서가 빈 문자열이면 `rewind` 호출은 거부됩니다. 실제 적용은 턴 종료에 지연되므로 도구 결과가 보였다는 것만으로 컨텍스트 재구성이 끝났다고 판단해서도 안 됩니다. 세션은 분기와 보고서 추가를 마친 뒤 새 메시지 배열을 교체합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 재개된 체크포인트와 오류', href: `${source}/docs/tools/rewind.md#errors` },
            { text: 'OMP · turn_end의 rewind 적용', href: `${source}/packages/coding-agent/src/session/agent-session.ts` },
          ],
        },
      ],
    },
  ],
};

export const settingsAndResourceDiscoveryTopic: Topic = {
  id: 'settings-and-resource-discovery',
  number: '29',
  title: '설정과 리소스 탐색',
  description: '여러 범위의 설정과 기능 리소스를 찾아 우선순위·충돌 규칙으로 현재 세션의 구성을 확정하는 계층.',
  sections: [
    {
      id: 'settings-layers',
      title: '낮은 범위에서 높은 범위로 덮어쓴다',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP의 유효 설정은 기본값, 전역 `config.yml`, 현재 작업 디렉터리의 프로젝트 설정, `PI_CONFIG_FILES`와 `--config` 오버레이, 실행 중 덮어쓰기 순으로 합칩니다. 뒤의 계층이 앞의 계층보다 우선합니다. 전역 설정은 평소 선호를, 프로젝트 설정은 저장소별 정책을, CLI 오버레이와 플래그는 이번 프로세스만의 선택을 담습니다.',
        },
        {
          kind: 'execution-path',
          title: '`compaction.enabled`의 최종 값 추적',
          input: {
            label: '설정 출처',
            text: '기본값 `true` · 전역 `true` · 프로젝트 `false` · `--config demo.yml`에서 `true` · 런타임 덮어쓰기 없음',
          },
          labels: { choose: '확인할 계층' },
          paths: [
            {
              label: '지속 설정까지만 읽음',
              stages: [
                { label: '기본값', text: '`true`로 시작합니다.', state: 'complete' },
                { label: '전역', text: '`true`가 유지됩니다.', state: 'complete' },
                { label: '프로젝트', text: '더 높은 범위의 `false`가 적용됩니다.', state: 'complete' },
              ],
              result: { label: '프로젝트 유효값', text: '`false`' },
            },
            {
              label: '현재 프로세스 전체를 읽음',
              stages: [
                { label: '지속 설정', text: '프로젝트 계층까지는 `false`입니다.', state: 'complete' },
                { label: 'CLI 오버레이', text: '`demo.yml`의 `true`가 다시 덮습니다.', state: 'complete' },
                { label: '런타임', text: '추가 값이 없어 `true`를 유지합니다.', state: 'complete' },
              ],
              result: { label: '실행 유효값', text: '`true` · 파일에는 오버레이 값을 쓰지 않습니다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '이 출처 추적은 “설정을 바꿨는데 동작하지 않는다”는 문제를 해결하는 핵심입니다. `omp config get`은 현재 디렉터리와 프로세스에서 합친 값을 보여 줍니다. `omp config set`과 `/settings`의 일반 저장은 전역 파일에 쓰므로 프로젝트 계층이나 이번 실행의 오버레이가 다시 덮을 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 설정 위치와 쓰기 범위', href: `${source}/docs/settings.md#where-settings-live` },
            { text: 'OMP · 설정 우선순위', href: `${source}/docs/settings.md#precedence` },
            { text: 'OMP · 설정 해석 흐름', href: `${source}/docs/config-usage.md` },
          ],
        },
      ],
    },
    {
      id: 'merge-rules',
      title: '객체는 합치고 배열은 교체한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '설정 계층을 합칠 때 객체는 키별로 깊게 병합하지만 스칼라와 배열은 높은 계층의 값으로 통째로 교체합니다. 전역 `disabledProviders`에 두 제공자가 있고 프로젝트 파일에 한 제공자만 적으면 세 항목이 합쳐지는 것이 아니라 프로젝트의 한 항목만 남습니다.',
        },
        {
          kind: 'code',
          language: 'yaml',
          caption: '프로젝트 계층이 배열 전체를 교체하는 예',
          code: `# 전역 config.yml
disabledProviders: [ollama, groq]
tools:
  approval:
    bash: prompt
    write: allow

# 프로젝트 .omp/config.yml
disabledProviders: [openai]
tools:
  approval:
    write: prompt

# 결과
# disabledProviders: [openai]
# tools.approval: { bash: prompt, write: prompt }`,
        },
        {
          kind: 'paragraph',
          text: '하네스는 값뿐 아니라 병합 규칙도 설정 계약으로 고정해야 합니다. 배열을 자동으로 덧붙이면 프로젝트가 전역 허용 목록을 제거할 수 없고, 반대로 객체 전체를 교체하면 한 도구 정책을 바꾸면서 형제 키를 잃습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 설정 병합 규칙', href: `${source}/docs/settings.md#merge-rules` },
            { text: 'OMP · 설정 스키마', href: `${source}/packages/coding-agent/src/config/settings-schema.ts` },
          ],
        },
      ],
    },
    {
      id: 'resource-discovery',
      title: '여러 생태계에서 기능 후보를 모은다',
      blocks: [
        {
          kind: 'paragraph',
          text: '리소스 탐색은 설정 병합보다 넓은 문제입니다. OMP는 `.omp`뿐 아니라 Claude, Codex, Gemini 등 호환 가능한 위치에서 스킬·명령·규칙·도구·MCP 서버 같은 기능 항목을 찾습니다. 각 탐색 제공자가 후보와 출처·범위를 반환하면 기능 레지스트리가 제공자 우선순위로 정렬합니다.',
        },
        {
          kind: 'exchange',
          input: { label: '이름이 같은 `review` 스킬 세 개', text: '프로젝트 `.omp` · 사용자 Claude · `.github/skills`에서 발견' },
          outputs: [
            { label: '후보 수집', text: '각 제공자가 파일 경로와 `project`/`user` 범위를 붙임' },
            { label: '우선순위 정렬', text: '기본 `.omp` 제공자가 Claude와 GitHub 제공자보다 앞섬' },
            { label: '키 중복 제거', text: '스킬의 키인 `name`이 같으므로 첫 `review`만 활성 후보로 유지' },
          ],
        },
        {
          kind: 'paragraph',
          text: '중복 키는 기능 종류마다 다릅니다. 스킬과 도구는 이름, 훅은 유형·도구·이름 조합을 사용합니다. 설정 기능은 항목을 먼저 제거하지 않고 하위 시스템의 병합 규칙을 적용합니다. 탐색 우선순위와 최종 설정 우선순위를 같은 규칙으로 간주하면 출처를 잘못 설명할 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 탐색 제공자 우선순위', href: `${source}/docs/config-usage.md#provider-ordering` },
            { text: 'OMP · capability 중복 제거', href: `${source}/docs/config-usage.md#dedup-semantics` },
            { text: 'OMP · 기능 레지스트리', href: `${source}/packages/coding-agent/src/capability/index.ts` },
          ],
        },
      ],
    },
    {
      id: 'scope-profiles-and-activation',
      title: '발견과 활성화를 분리한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '발견된 항목이 모두 활성화되는 것은 아닙니다. 제공자 토글, `disabledExtensions`, 스킬의 `include`·`ignore` 패턴, `mcp.enableProjectConfig` 같은 하위 시스템 설정이 후보를 다시 거릅니다. 탐색이 “무엇이 존재하는가”를 답하면 활성화 정책은 “이번 세션에서 무엇을 사용할까”를 답합니다.',
        },
        {
          kind: 'paragraph',
          text: '프로젝트 범위도 리소스마다 다릅니다. 일반 프로젝트 설정은 현재 작업 디렉터리의 `.omp/config.yml`을 읽고 조상 디렉터리를 걷지 않습니다. 반면 스킬은 저장소 경계까지 조상의 `.omp/skills`를 찾을 수 있고, 프로젝트 지침은 가장 가까운 적용 파일을 탐색합니다. 하네스는 하나의 “설정 폴더 검색” 함수로 이 차이를 지워서는 안 됩니다.',
        },
        {
          kind: 'paragraph',
          text: '이름 있는 프로필은 OMP 사용자 디렉터리를 별도 위치로 옮겨 사용자 설정·세션·인증·스킬·MCP 구성을 분리합니다. 프로젝트 리소스와 외부 도구의 사용자 설정은 각자의 범위 규칙을 따릅니다. 프로필을 바꾸었을 때 무엇이 공유되고 무엇이 격리되는지 출처 메타데이터로 표시해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · native 리소스별 탐색 범위', href: `${source}/docs/config-usage.md` },
            { text: 'OMP · 프로필의 사용자 범위 격리', href: `${source}/docs/config-usage.md#profiles` },
            { text: 'OMP · discovery 구현', href: `${source}/packages/coding-agent/src/discovery/index.ts` },
          ],
        },
      ],
    },
  ],
};

export const skillsAndPromptTemplatesTopic: Topic = {
  id: 'skills-and-prompt-templates',
  number: '30',
  title: '스킬과 프롬프트 템플릿',
  description: '필요할 때 읽는 작업 지침과 반복 요청을 펼치는 템플릿을 파일 리소스로 발견·주입하는 방식.',
  sections: [
    {
      id: 'skill-resource',
      title: '스킬은 이름 있는 작업 지침이다',
      blocks: [
        {
          kind: 'paragraph',
          text: '스킬은 한 디렉터리의 `SKILL.md`와 그 문서가 참조하는 스크립트·템플릿·참고 자료를 묶습니다. 탐색 제공자는 보통 `skills/<skill-name>/SKILL.md` 한 단계 구조를 찾고, `frontmatter`의 `name`과 `description`을 읽습니다. 같은 이름이 충돌하면 제공자 우선순위가 높은 스킬이 남습니다.',
        },
        {
          kind: 'code',
          language: 'markdown',
          caption: '`skills/release/SKILL.md`의 최소 형태',
          code: `---
name: release
description: Verify and publish a tagged release.
---

1. Read \`references/checklist.md\`.
2. Run \`scripts/verify.ts\`.
3. Report the tag and produced artifacts.`,
        },
        {
          kind: 'paragraph',
          text: '`read` 도구가 활성화되어 있으면 시스템 프롬프트에는 스킬 본문 전체가 아니라 발견된 이름과 설명이 들어갑니다. 모델은 현재 작업에 필요할 때 `read skill://release`로 본문을 읽고, 상대 경로의 자료는 `skill://release/references/checklist.md`처럼 같은 디렉터리 안에서 엽니다. 경로 이탈과 절대 경로는 URL 처리기가 거부합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 스킬 형식과 탐색', href: `${source}/docs/skills.md#required-layout-and-skillmd-expectations` },
            { text: 'OMP · 시스템 프롬프트 노출', href: `${source}/docs/skills.md#system-prompt-exposure` },
            { text: 'OMP · skill:// 경로 처리', href: `${source}/docs/skills.md#skill-url-behavior` },
          ],
        },
      ],
    },
    {
      id: 'skill-loading-and-invocation',
      title: '발견과 본문 주입은 다른 순간에 일어난다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`loadSkills()`는 기능 제공자, 사용자가 지정한 추가 디렉터리, 자동 학습이 만든 관리 스킬 순으로 후보를 합칩니다. `ignoredSkills`, `includeSkills`, 소스별 토글과 비활성화 설정이 최종 목록을 결정합니다. `hide: true`는 시스템 프롬프트 목록에서만 감추며 스킬 자체를 비활성화하지 않습니다.',
        },
        {
          kind: 'tool-sequence',
          title: '사용자가 `release` 스킬을 직접 호출할 때',
          prompt: '`/skill:release v2.4.0`',
          actors: ['세션 런타임', '모델', '도구 실행기'],
          events: [
            { from: 0, to: 0, kind: 'request', label: '사용자의 스킬 호출', detail: '`/skill:release v2.4.0`에서 이름과 인자를 해석합니다.' },
            { from: 0, to: 0, kind: 'read', label: '본문 읽기', detail: '`SKILL.md`에서 `frontmatter`를 빼고 지침과 기본 디렉터리를 준비합니다.' },
            { from: 0, to: 1, kind: 'request', label: '사용자 호출 메시지', detail: '스킬 본문·디렉터리·사용자 인자를 하나의 사용자 정의 메시지로 주입합니다.' },
            { from: 1, to: 0, kind: 'call', label: '도구 호출 생성', detail: '체크리스트 읽기와 검증 스크립트 실행을 요청합니다.' },
            { from: 0, to: 2, kind: 'call', label: '승인·실행', detail: '도구 정책을 적용한 뒤 허용된 읽기와 검사를 실행합니다.' },
            { from: 2, to: 0, kind: 'result', label: '실행 결과', detail: '체크리스트 내용과 검사 성공·실패를 반환합니다.' },
            { from: 0, to: 1, kind: 'result', label: '도구 결과', detail: '실행 결과를 다음 모델 턴의 문맥에 넣습니다.' },
            { from: 1, to: 0, kind: 'answer', label: '릴리스 검사 보고', detail: '`v2.4.0`의 검사 결과와 생성된 아티팩트를 사용자에게 전달할 답변으로 만듭니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '이 호출은 스킬 파일을 실행하는 것이 아니라 모델 문맥에 지침을 넣습니다. 실제 부작용은 모델이 선택한 도구 호출과 하네스의 승인·실행 단계에서 발생합니다. 자동 로드된 스킬과 사용자가 부른 스킬은 서로 다른 템플릿을 써서 호출 주체도 정확히 표시합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 스킬 로딩 순서와 필터', href: `${source}/docs/skills.md#discovery-pipeline` },
            { text: 'OMP · /skill 호출 동작', href: `${source}/docs/skills.md#interactive-skillname-commands` },
            { text: 'OMP · 스킬 로더 구현', href: `${source}/packages/coding-agent/src/extensibility/skills.ts` },
          ],
        },
      ],
    },
    {
      id: 'prompt-template-expansion',
      title: '프롬프트 템플릿은 요청문으로 펼친다',
      blocks: [
        {
          kind: 'paragraph',
          text: '프롬프트 템플릿은 사용자 디렉터리와 프로젝트 `.omp/prompts/` 아래의 Markdown 파일입니다. 파일 이름이 명령 이름이 되고, `frontmatter`의 설명이나 본문의 첫 줄이 자동 완성 설명이 됩니다. 하위 디렉터리는 재귀적으로 찾지만 명령 이름은 파일의 기본 이름을 사용합니다.',
        },
        {
          kind: 'code',
          language: 'markdown',
          caption: '인자를 받는 `prompts/review-api.md`',
          code: `---
description: Review one API surface.
---

Review $1 for backward compatibility.
Compare it with $@[2] and report breaking changes.`,
        },
        {
          kind: 'paragraph',
          text: '사용자가 `/review-api UserService v1 v2`를 입력하면 세션은 위치 인자와 전체 인자 표기를 치환하고 템플릿 렌더러를 거친 문자열을 일반 사용자 프롬프트로 보냅니다. 템플릿이 인자를 직접 사용하지 않았다면 남은 인자를 본문 뒤에 붙입니다. 확장 명령이나 사용자 정의 명령이 같은 이름을 처리하면 그 단계가 프롬프트 템플릿보다 먼저 실행됩니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 프롬프트 템플릿 로딩과 확장', href: `${source}/packages/coding-agent/src/config/prompt-templates.ts` },
            { text: 'OMP · 슬래시 입력 처리 순서', href: `${source}/docs/slash-command-internals.md#5-routing-and-prompt-pipeline-placement` },
            { text: 'OMP · 파일 명령의 인자 치환', href: `${source}/docs/slash-command-internals.md#6-expansion-semantics-for-file-based-slash-commands` },
          ],
        },
      ],
    },
    {
      id: 'choose-the-right-resource',
      title: '지침, 반복 입력, 실행 코드를 구분한다',
      blocks: [
        {
          kind: 'exchange',
          input: { label: '추가하려는 동작', text: '팀의 검토 절차 · 반복 질문 · 새 API 호출' },
          outputs: [
            { label: '스킬', text: '여러 파일과 절차를 모델이 필요할 때 읽음\n작업 방식과 참고 자료에 적합' },
            { label: '프롬프트 템플릿', text: '사용자 명령 하나를 반복 가능한 요청문으로 펼침\n짧은 입력 양식에 적합' },
            { label: '도구·확장', text: '스키마가 있는 실행 코드와 런타임 상태를 제공\nI/O, 정책 가로채기, UI가 필요할 때 사용' },
          ],
        },
        {
          kind: 'paragraph',
          text: '스킬을 실행 권한으로 취급하거나 프롬프트 템플릿을 정책 훅으로 사용하면 실행 경계가 흐려집니다. 하네스는 수동 문맥 주입과 코드 실행을 다른 기능 유형으로 유지하고, 어느 파일이 실제 요청에 들어갔는지 출처를 남겨야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 스킬·명령·도구·훅의 차이', href: `${source}/docs/skills.md#skills-vs-agentsmd-commands-tools-hooks` },
          ],
        },
      ],
    },
  ],
};

export const extensionsAndPluginsTopic: Topic = {
  id: 'extensions-and-plugins',
  number: '31',
  title: '확장 기능과 플러그인',
  description: '런타임 API를 등록하는 코드 모듈과 그 모듈·스킬·명령을 설치 단위로 묶는 플러그인 체계.',
  sections: [
    {
      id: 'extension-factory',
      title: '확장은 런타임 표면을 등록한다',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP 확장은 기본 함수를 내보내는 TypeScript 또는 JavaScript 모듈입니다. 로더가 모듈을 `import`하고 팩터리에 `ExtensionAPI`를 넘기면 확장은 도구, 슬래시 명령, 제공자, 단축키, 렌더러와 이벤트 핸들러를 등록합니다. 하나의 확장이 여러 표면을 함께 제공할 수 있습니다.',
        },
        {
          kind: 'code',
          language: 'typescript',
          caption: '위험한 셸 호출을 막고 상태 명령을 추가하는 확장',
          code: `import type { ExtensionAPI } from '@oh-my-pi/pi-coding-agent';

export default function register(pi: ExtensionAPI) {
  pi.on('tool_call', async event => {
    if (event.toolName === 'bash' && event.input.command?.includes('rm -rf')) {
      return { block: true, reason: 'Project policy blocks recursive deletion.' };
    }
  });

  pi.registerCommand('policy-status', {
    description: 'Show the active project policy.',
    handler: async (_args, ctx) => ctx.ui.notify('Deletion guard active', 'info'),
  });
}`,
        },
        {
          kind: 'paragraph',
          text: '`tool_call` 핸들러는 도구 실행 전에 인자를 검사·수정하거나 호출을 막을 수 있고, `tool_result` 핸들러는 실행 결과를 차례로 보완할 수 있습니다. `registerProvider`는 모델 엔드포인트와 동적 모델·사용량 조회를 등록합니다. 등록한 도구도 기본 도구와 같은 승인·확장 래퍼를 거쳐 실행됩니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 확장 API와 빠른 예제', href: `${source}/docs/extensions.md#quick-start` },
            { text: 'OMP · 도구·세션 이벤트', href: `${source}/docs/extensions.md#event-surface-current-names-and-behavior` },
            { text: 'OMP · 확장 타입 계약', href: `${source}/packages/coding-agent/src/extensibility/extensions/types.ts` },
          ],
        },
      ],
    },
    {
      id: 'load-then-initialize',
      title: '등록 단계와 실행 단계를 나눈다',
      blocks: [
        {
          kind: 'tool-sequence',
          title: '확장 파일이 도구 호출을 가로채기까지',
          prompt: '확장 모듈을 로드하고 세션을 시작한다.',
          actors: ['확장 로더', '`ExtensionRunner`', '도구 실행기'],
          events: [
            { from: 0, to: 0, kind: 'read', label: '`import`와 팩터리 실행', detail: '모듈을 불러와 도구·명령·이벤트 핸들러를 등록합니다.' },
            { from: 0, to: 1, kind: 'result', label: '등록 결과', detail: '확장 정의와 경로별 로드 오류를 전달합니다.' },
            { from: 1, to: 1, kind: 'call', label: '런타임 초기화', detail: '현재 세션·모드·도구 레지스트리에 실제 동작 함수를 연결합니다.' },
            { from: 2, to: 1, kind: 'call', label: '`tool_call`', detail: '실행 직전 호출을 모든 관련 핸들러에 전달합니다.' },
            { from: 1, to: 2, kind: 'result', label: '허용·수정·차단', detail: '합친 정책 결과에 따라 도구 실행을 진행하거나 중단합니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '팩터리가 실행되는 로드 단계에서는 `registerTool` 같은 등록 함수만 사용할 수 있습니다. `sendMessage`처럼 살아 있는 세션이 필요한 동작을 이때 호출하면 `ExtensionRuntimeNotInitializedError`가 발생합니다. 실제 동작은 세션 이벤트, 명령 또는 도구 실행 함수에서 시작해야 합니다.',
        },
        {
          kind: 'paragraph',
          text: '각 파일의 `import`나 팩터리 오류는 그 확장의 로드 오류로 수집되고 다른 확장 로드는 계속됩니다. 실행 중 핸들러 예외도 실행기가 확장 오류로 격리합니다. 다만 `tool_call` 단계의 오류는 안전하게 실행을 막는 방향으로 처리됩니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 확장 런타임 생명주기', href: `${source}/docs/extensions.md#runtime-model` },
            { text: 'OMP · 모듈 팩터리 계약', href: `${source}/docs/extension-loading.md#module-import-and-factory-contract` },
            { text: 'OMP · 로드 실패와 격리', href: `${source}/docs/extension-loading.md#failure-handling-and-isolation` },
          ],
        },
      ],
    },
    {
      id: 'discovery-and-reload',
      title: '여러 진입점을 한 로더로 모은다',
      blocks: [
        {
          kind: 'paragraph',
          text: '확장 로더는 프로젝트와 사용자 `.omp/extensions`, 코드로 작성된 훅, 설치한 플러그인의 매니페스트 진입점, `--extension`과 설정의 명시 경로를 순서대로 모읍니다. 정규화한 절대 경로가 같은 항목은 처음 한 번만 로드합니다. 디렉터리 진입점은 패키지 매니페스트, `index.ts`, `index.js`, 한 단계 아래 항목 순으로 해석합니다.',
        },
        {
          kind: 'paragraph',
          text: '모듈은 수정 시각을 붙인 `import` URL로 다시 불러오며 확장이 소유한 의존성에도 캐시 무효화 표식을 전파합니다. 그러나 모든 기능이 같은 순간에 다시 만들어지는 것은 아닙니다. 플러그인 설치 뒤 `/reload-plugins`는 스킬·명령·MCP를 갱신할 수 있지만 새 도구·훅·확장 모듈처럼 세션 구성 때 고정된 표면은 재시작이 필요할 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 확장 입력과 로드 순서', href: `${source}/docs/extension-loading.md#inputs-to-extension-loading` },
            { text: 'OMP · 확장 경로 해석', href: `${source}/docs/extension-loading.md#path-and-entry-resolution` },
            { text: 'OMP · 플러그인 변경 뒤 갱신 범위', href: `${source}/docs/marketplace.md#cli-equivalents` },
          ],
        },
      ],
    },
    {
      id: 'plugins-and-trust',
      title: '플러그인은 설치 단위이지 격리 경계가 아니다',
      blocks: [
        {
          kind: 'paragraph',
          text: '플러그인은 확장 모듈뿐 아니라 스킬, 명령, 에이전트, 규칙, 훅, custom tool, MCP·LSP 설정을 한 디렉터리에 묶는 배포 단위입니다. marketplace 카탈로그는 플러그인의 이름·버전·출처를 설명하고, 설치기는 사용자 또는 프로젝트 범위의 플러그인 레지스트리와 `node_modules` 연결을 갱신합니다.',
        },
        {
          kind: 'exchange',
          input: { label: '마켓플레이스의 `code-review` 플러그인', text: '스킬 1개 · `/review` 명령 · 확장 모듈 · MCP 서버 정의' },
          outputs: [
            { label: '설치기', text: '소스를 캐시에 가져오고 범위별 레지스트리에 기록\n활성 기능과 버전을 잠금 파일로 관리' },
            { label: '탐색기', text: '각 하위 시스템이 플러그인 트리의 스킬·명령·MCP를 후보로 수집' },
            { label: '확장 로더', text: '`package.json`의 `omp.extensions` 진입점을 `import`\n같은 프로세스에서 팩터리를 실행' },
          ],
        },
        {
          kind: 'paragraph',
          text: '확장은 OMP 프로세스 안에서 실행되며 샌드박스되지 않습니다. 다른 파일을 읽거나 네트워크를 호출할 수 있고, 스킬도 모델이 명령을 실행하도록 유도할 수 있습니다. 로드 오류를 격리하는 기능은 악성 코드의 권한을 제한하지 않으므로 설치 전 출처와 코드를 검토해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 마켓플레이스와 플러그인 개념', href: `${source}/docs/marketplace.md#concepts` },
            { text: 'OMP · 설치 범위와 저장 구조', href: `${source}/docs/marketplace.md#on-disk-layout` },
            { text: 'OMP · 확장의 비격리 실행 모델', href: `${source}/docs/extension-loading.md#runtime-isolation-model` },
          ],
        },
      ],
    },
  ],
};

export const mcpIntegrationTopic: Topic = {
  id: 'mcp-integration',
  number: '32',
  title: 'MCP 연동',
  description: '외부 MCP 서버의 도구를 발견하고 전송 계층을 연결해 세션 도구로 호출·복구·정리하는 프로토콜 브리지.',
  sections: [
    {
      id: 'servers-and-transports',
      title: '서버 정의와 전송 방식을 고른다',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP는 프로젝트 `.omp/mcp.json`, 사용자 `mcp.json`, 여러 도구의 호환 설정과 설치한 플러그인에서 MCP 서버를 찾습니다. 같은 서버 이름은 병합하지 않고 우선순위가 높은 정의 하나를 고릅니다. 사용자 `disabledServers`는 어느 출처에서 온 같은 이름의 서버도 끌 수 있습니다.',
        },
        {
          kind: 'code',
          language: 'json',
          caption: 'stdio 서버와 Streamable HTTP 서버',
          code: `{
  "mcpServers": {
    "project-files": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    },
    "team-search": {
      "type": "http",
      "url": "https://mcp.example.com/api",
      "headers": { "Authorization": "TEAM_MCP_AUTH" }
    }
  }
}`,
        },
        {
          kind: 'paragraph',
          text: '`stdio`는 자식 프로세스의 JSONL 입출력을 사용하고 `command`가 필요합니다. `http`는 요청별 POST와 선택적인 SSE 수신을 사용하는 Streamable HTTP이며 `url`이 필요합니다. `sse`는 먼저 지속적인 GET 스트림에서 POST 엔드포인트를 받는 이전 전송 방식입니다. 설정 검증은 이 구조를 확인할 뿐 실제 서버 도달 가능성은 연결 단계에서 판정합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · MCP 설정 위치와 우선순위', href: `${source}/docs/mcp-config.md#preferred-config-locations` },
            { text: 'OMP · stdio·HTTP·SSE 설정', href: `${source}/docs/mcp-config.md#supported-server-fields` },
            { text: 'OMP · 프로토콜과 전송 계층의 경계', href: `${source}/docs/mcp-protocol-transports.md#layer-boundaries` },
          ],
        },
      ],
    },
    {
      id: 'connect-and-discover',
      title: '초기화한 서버에서 도구를 발견한다',
      blocks: [
        {
          kind: 'tool-sequence',
          title: 'MCP 서버가 세션 도구로 들어오기까지',
          prompt: '`team-search` 서버를 세션에 연결한다.',
          actors: ['`MCPManager`', 'MCP 서버', '도구 레지스트리'],
          events: [
            { from: 0, to: 1, kind: 'request', label: '`initialize`', detail: '프로토콜 버전과 클라이언트 기능을 보내고 서버 기능을 받습니다.' },
            { from: 0, to: 1, kind: 'call', label: '`notifications/initialized`', detail: '초기화 완료를 알린 뒤에 세션 트래픽을 시작합니다.' },
            { from: 0, to: 1, kind: 'request', label: '`tools/list`', detail: '서버가 제공하는 이름·설명·`inputSchema` 목록을 요청합니다.' },
            { from: 1, to: 0, kind: 'result', label: '도구 정의', detail: '`search_docs`와 JSON Schema를 반환합니다.' },
            { from: 0, to: 2, kind: 'result', label: '브리지 등록', detail: '`mcp__team_search_search_docs`로 변환해 세션 도구에 합칩니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '서버 연결과 `tools/list`는 병렬로 시작합니다. 빠른 시작 게이트가 250ms 뒤 열렸을 때 캐시한 정의가 있으면 아직 연결 중인 서버도 `DeferredMCPTool`로 먼저 등록할 수 있습니다. 캐시가 없으면 연결이 끝난 뒤 도구 변경 콜백으로 늦게 등록합니다. 느린 서버 하나가 전체 세션 시작을 막지 않습니다.',
        },
        {
          kind: 'paragraph',
          text: '도구 다음에는 리소스, 리소스 템플릿, 프롬프트와 구독 정보를 읽습니다. 이 단계의 실패는 전체 연결을 중단하지 않습니다. 서버 하나가 실패하면 해당 서버의 오류만 기록하고 다른 서버의 연결과 도구는 유지합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · MCP 연결 파이프라인', href: `${source}/docs/mcp-runtime-lifecycle.md#per-server-connect-pipeline` },
            { text: 'OMP · 빠른 시작과 지연 도구', href: `${source}/docs/mcp-runtime-lifecycle.md#fast-startup-gate--deferred-fallback` },
            { text: 'OMP · MCP 관리자 구현', href: `${source}/packages/coding-agent/src/mcp/manager.ts` },
          ],
        },
      ],
    },
    {
      id: 'schema-and-invocation-bridge',
      title: '원격 스키마를 로컬 도구 계약에 연결한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`MCPTool`은 서버의 `inputSchema`를 `normalizeSchemaForMCP()`로 정리해 OMP의 사용자 정의 도구 스키마로 등록합니다. 실행 이름은 `mcp__<server>_<tool>` 형태로 소문자와 밑줄만 남기며, 길면 해시 접미사를 붙입니다. 서로 다른 원래 이름이 같은 실행 이름이 되면 원본 서버·도구 이름을 비교해 항상 같은 하나를 남깁니다.',
        },
        {
          kind: 'tool-sequence',
          title: '모델 호출이 원격 `tools/call`이 되기까지',
          prompt: '`mcp__team_search_search_docs({ query: "session tree" })`',
          actors: ['모델', '세션의 `MCPTool` 브리지', 'MCP 서버'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '로컬 도구 호출', detail: '모델이 등록된 `mcp__team_search_search_docs`의 이름과 인자를 생성합니다.' },
            { from: 1, to: 1, kind: 'call', label: '조회·검증', detail: '세션 레지스트리가 이름으로 브리지를 찾고 로컬 도구 스키마를 검증합니다.' },
            { from: 1, to: 1, kind: 'call', label: '인자 정리', detail: '하네스 전용 `i` 필드와 비어 있는 선택 인자를 제거하고 로컬 파일 URL을 해석합니다.' },
            { from: 1, to: 2, kind: 'call', label: '`tools/call`', detail: '원래 도구 이름 `search_docs`와 정리한 인자를 JSON-RPC 요청으로 보냅니다.' },
            { from: 2, to: 1, kind: 'result', label: 'MCP 결과', detail: '콘텐츠 블록과 `isError`를 반환합니다.' },
            { from: 1, to: 0, kind: 'result', label: '도구 결과', detail: '브리지가 표시 가능한 콘텐츠와 서버·원래 도구 메타데이터로 바꾸고, 세션이 다음 모델 입력에 넣습니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '전송 오류가 연결 복구 가능한 종류라면 브리지는 서버를 다시 연결하고 같은 호출을 한 번 더 시도합니다. 서버가 구조화된 인증 요구를 반환하면 대화형 인증 핸들러를 거쳐 재연결한 뒤 한 번 재시도할 수 있습니다. 그 뒤에도 실패하면 `MCP error: …` 도구 결과로 돌려 에이전트 루프가 실패를 관찰하게 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · MCP 도구 이름과 스키마 변환', href: `${source}/docs/mcp-server-tool-authoring.md` },
            { text: 'OMP · MCP tool bridge 구현', href: `${source}/packages/coding-agent/src/mcp/tool-bridge.ts` },
            { text: 'OMP · MCP 호출 오류와 재시도', href: `${source}/docs/mcp-runtime-lifecycle.md#tool-calls` },
          ],
        },
      ],
    },
    {
      id: 'refresh-reconnect-shutdown',
      title: '변경, 단절, 종료를 수명 주기로 다룬다',
      blocks: [
        {
          kind: 'paragraph',
          text: '연결된 서버가 `notifications/tools/list_changed`를 보내면 MCP 관리자가 도구 목록을 다시 읽고 세션의 `mcp__` 도구를 교체합니다. `/mcp reload`는 모든 서버를 끊고 설정을 다시 발견한 뒤 도구를 재등록하며, `/mcp reconnect <name>`은 한 서버의 저장된 원본 설정에서 자격 증명을 다시 해결해 연결합니다.',
        },
        {
          kind: 'paragraph',
          text: '전송 계층이 예기치 않게 종료되면 0.5초부터 대기 시간을 늘려 가며 자동 재연결합니다. 30초 안에 재연결 시도가 5회를 넘으면 연쇄 충돌 차단기가 자동 시도를 멈춥니다. 전송 계층 자체는 일반 요청을 반복하거나 종료된 프로세스를 다시 띄우지 않으며, 재연결은 MCP 관리자와 도구 브리지가 맡습니다.',
        },
        {
          kind: 'paragraph',
          text: '최상위 세션이 만든 MCP 관리자는 그 세션이 소유합니다. `AgentSession.dispose()`는 소유한 관리자의 연결을 제한된 시간 안에 닫습니다. 부모 관리자를 빌린 하위 세션은 공유 서버를 끊지 않습니다. `disconnectAll()`은 늦게 끝난 재연결이 종료 뒤 연결을 되살리지 못하도록 수명 세대 값을 바꾸고 모든 상태와 구독을 비웁니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 서버 알림과 실시간 도구 갱신', href: `${source}/docs/mcp-runtime-lifecycle.md#server-initiated-notifications` },
            { text: 'OMP · 연결 복구와 부분 실패', href: `${source}/docs/mcp-runtime-lifecycle.md#health-reconnect-and-partial-failure-behavior` },
            { text: 'OMP · MCP 종료와 소유권', href: `${source}/docs/mcp-runtime-lifecycle.md#teardown-semantics` },
            { text: 'OMP · 전송 계층과 관리자의 재시도 경계', href: `${source}/docs/mcp-protocol-transports.md#retryreconnect-responsibilities` },
          ],
        },
      ],
    },
  ],
};

export const modelAccessTopics: readonly Topic[] = [
  modelProvidersTopic,
  modelCatalogTopic,
  responseStreamingTopic,
  authenticationAndCredentialsTopic,
];

export const contextAndPersistenceTopics: readonly Topic[] = [
  sessionStorageAndResumeTopic,
  contextCompactionTopic,
  crossSessionMemoryTopic,
  artifactsAndInternalUrlsTopic,
  checkpointsAndRewindTopic,
];

export const configurationAndExtensionsTopics: readonly Topic[] = [
  settingsAndResourceDiscoveryTopic,
  skillsAndPromptTemplatesTopic,
  extensionsAndPluginsTopic,
  mcpIntegrationTopic,
];

export const chapters20Through32: readonly Topic[] = [
  ...modelAccessTopics,
  ...contextAndPersistenceTopics,
  ...configurationAndExtensionsTopics,
];
