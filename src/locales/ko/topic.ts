import type { ArticleLabels, Topic, TopicGroup } from '../../content.ts';
import { tokenizationExample } from './tokenization.ts';
import { contextWindowExample } from './context-window.ts';
import { responseComparisonExample } from './response-comparison.ts';

export const topicGroups: readonly TopicGroup[] = [
  {
    id: 'llm-fundamentals',
    number: 'I',
    title: 'LLM 기초',
    topics: [
      {
        id: 'large-language-models',
        number: '01',
        title: '대규모 언어 모델',
        description: '주어진 문맥을 바탕으로 텍스트를 생성하는 모델.',
        sections: [
          {
            id: 'input-and-output',
            title: '입력에서 출력으로',
            group: { id: 'model-mechanics', title: '작동 방식과 자원' },
            blocks: [
              {
                kind: 'paragraph',
                text: '대규모 언어 모델(large language model, LLM)은 많은 텍스트에서 배운 패턴을 바탕으로, 주어진 입력에 이어질 텍스트를 생성하는 모델입니다. 질문에 답하고, 문서를 요약하고, 코드를 작성하는 데 쓸 수 있습니다.',
              },
              {
                kind: 'paragraph',
                text: '입력에는 사용자가 쓴 질문뿐 아니라 이전 대화나 참고 자료도 포함될 수 있습니다.',
              },
              {
                kind: 'exchange',
                input: {
                  label: '입력',
                  text: '회의는 금요일 오후 2시, 3층 회의실에서 열립니다.\n시간과 장소만 남겨 줘.',
                },
                outputs: [
                  { label: '출력', text: '금요일 오후 2시 · 3층 회의실' },
                ],
              },
              {
                kind: 'references',
                links: [
                  { text: 'Hugging Face · 텍스트 생성', href: 'https://huggingface.co/docs/transformers/llm_tutorial' },
                  { text: 'OpenAI · 대화 상태와 이전 응답 전달', href: 'https://developers.openai.com/api/docs/guides/conversation-state' },
                ],
              },
            ],
          },
          {
            id: 'tokens',
            title: '길이를 세는 단위, 토큰',
            blocks: [
              {
                kind: 'paragraph',
                text: '모델은 텍스트를 토큰(token)이라는 단위로 나누어 처리합니다. 토큰은 단어 전체일 수도, 단어의 일부나 문장 부호일 수도 있습니다. 한 글자나 한 단어가 항상 한 토큰인 것은 아닙니다. 같은 문장도 모델의 토크나이저와 언어에 따라 토큰 수가 달라집니다.',
              },
              tokenizationExample,
              {
                kind: 'paragraph',
                text: '토큰 수는 모델이 처리할 수 있는 길이와 사용량을 파악하는 기준입니다. 토큰 기반 요금제에서는 입력과 출력의 단가가 다를 수 있습니다. 글자 수로 비용을 단정하지 말고, 사용할 모델의 토크나이저와 요청 후 제공되는 사용량을 확인하세요.',
              },
              {
                kind: 'references',
                links: [
                  { text: 'Hugging Face · 토크나이저와 텍스트 분할', href: 'https://huggingface.co/learn/llm-course/en/chapter2/4' },
                  { text: 'OpenAI · 토큰 계산과 사용량', href: 'https://help.openai.com/en/articles/4936856-understanding-and-counting-tokens' },
                ],
              },
            ],
          },
          {
            id: 'context-and-output-limits',
            title: '읽는 한도와 쓰는 한도',
            blocks: [
              {
                kind: 'paragraph',
                text: '컨텍스트 창(context window)은 한 번의 요청에서 모델이 다룰 수 있는 토큰의 범위입니다. 입력과 출력을 합쳐 제한하는 모델에서는 입력이 길수록 생성에 쓸 수 있는 공간이 줄어듭니다. 최대 출력 길이는 이와 별도로 정해진 생성량의 상한입니다.',
              },
              {
                kind: 'paragraph',
                text: '추론 모델은 답변을 만드는 과정에서 내부 추론 토큰도 생성합니다. OpenAI의 추론 모델에서는 이 토큰이 컨텍스트 공간을 차지하며, 사용자에게 보이는 답변과 함께 출력 사용량에 포함됩니다. 따라서 화면에 나타난 답변이 짧더라도 출력 토큰을 많이 쓸 수 있습니다.',
              },
              contextWindowExample,
              {
                kind: 'references',
                links: [
                  { text: 'OpenAI · 추론 토큰과 컨텍스트·출력 한도', href: 'https://developers.openai.com/api/docs/guides/reasoning#how-reasoning-works' },
                  { text: 'OpenAI · 토큰 유형과 사용량', href: 'https://help.openai.com/en/articles/4936856-understanding-and-counting-tokens' },
                ],
              },
            ],
          },
          {
            id: 'prompt-caching',
            title: '반복해서 읽는 입력, 프롬프트 캐싱',
            blocks: [
              {
                kind: 'paragraph',
                text: '코딩 에이전트는 여러 번 모델을 호출하면서 같은 지침, 도구 정의, 이전 대화를 되풀이해 보냅니다. 프롬프트 캐싱(prompt caching)은 입력의 앞부분이 토큰 단위로 정확히 일치할 때, 그 부분을 처리한 계산을 재사용하는 기능입니다. 이전 답변을 꺼내 주는 응답 캐시가 아니므로, 캐시에 적중해도 답변은 새로 생성됩니다.',
              },
              {
                kind: 'paragraph',
                text: '재사용한 토큰도 이번 요청의 입력이며 컨텍스트 공간을 차지합니다. 캐싱은 같은 입력을 다시 처리하는 비용과 시간을 줄이는 수단이지, 컨텍스트 창을 늘리거나 오래된 대화를 요약하는 기능은 아닙니다.',
              },
              {
                kind: 'paragraph',
                text: '하네스가 요청을 구성할 때는 잘 바뀌지 않는 지침과 도구 정의를 앞에, 현재 질문이나 시각처럼 매번 달라지는 내용을 뒤에 배치하는 편이 재사용에 유리합니다. 예를 들어 공통 지침보다 앞에 현재 시각을 넣으면 그 지점부터 접두부가 달라집니다. 내용이 같아도 메시지나 도구 정의의 순서를 바꾸면 일치하는 범위가 줄 수 있으므로, 필요한 입력의 순서를 안정적으로 유지해야 합니다.',
              },
              {
                kind: 'paragraph',
                text: '캐시가 항상 남아 있거나 모든 요청에서 동작하는 것은 아닙니다. 제공자와 모델마다 최소 입력 길이, 캐시 지정 방식, 보관 시간, 요금이 다르고, 항목이 만료되거나 제거되면 다시 처리해야 합니다. OpenAI에서는 요청이 일치하는 캐시를 가진 서버에 도달해야 하므로 같은 접두부만으로 적중을 보장하지 않습니다. 하네스의 비용 예산은 기대 할인율이 아니라 실제 입력·출력·캐시 사용량과 지연 시간을 측정해 잡아야 합니다. OpenAI Responses API의 재사용량은 usage.input_tokens_details.cached_tokens에서 확인할 수 있습니다.',
              },
              {
                kind: 'references',
                links: [
                  { text: 'OpenAI · 프롬프트 캐싱, 입력 구성과 사용량 측정', href: 'https://developers.openai.com/api/docs/guides/prompt-caching' },
                  { text: 'Anthropic · 캐시 일치 조건과 전체 입력 토큰', href: 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching' },
                ],
              },
            ],
          },
          {
            id: 'response-variability',
            title: '같은 질문, 다른 답변',
            group: { id: 'response-reliability', title: '응답의 변동성과 신뢰성' },
            blocks: [
              {
                kind: 'paragraph',
                text: '같은 입력을 다시 보내도 표현이나 내용이 달라질 수 있습니다. 모델과 생성 설정에 따라 여러 가능한 응답 중 다른 응답이 나올 수 있기 때문입니다.',
              },
              responseComparisonExample,
              {
                kind: 'paragraph',
                text: '두 코드 모두 일반적인 점수에서는 같은 평균을 내지만, 0점을 포함한 검사에서는 결과가 갈립니다. 코드의 길이나 설명의 유창함, 정답 문구와의 일치만으로는 이 차이를 잡을 수 없습니다. 하네스는 생성된 코드가 요구한 동작을 하는지 검사해야 합니다.',
              },
              {
                kind: 'paragraph',
                text: '실패한 요청을 재시도할 때도 같은 코드나 같은 도구 호출이 되풀이된다고 가정할 수 없습니다. 하네스를 비교할 때는 모델과 생성 설정, 제공한 도구, 입력 문맥을 함께 기록하고 동일한 과제를 여러 번 실행해 성공과 실패를 살펴봐야 합니다. 한 번 잘 끝난 대화만으로 안정성을 판단하기는 어렵습니다.',
              },
              {
                kind: 'references',
                links: [
                  { text: 'Hugging Face · 생성 설정과 다양한 출력', href: 'https://huggingface.co/docs/transformers/llm_tutorial#decoding-strategy' },
                  { text: 'OpenAI · 응답 변동성과 동작 중심 평가', href: 'https://developers.openai.com/api/docs/guides/evaluation-best-practices' },
                ],
              },
            ],
          },
          {
            id: 'checking-results',
            title: '유창한 답변도 확인하기',
            blocks: [
              {
                kind: 'paragraph',
                text: '자연스럽고 자신 있게 쓴 답변도 틀릴 수 있습니다. 모델은 존재하지 않는 함수나 출처를 제시하거나, 오래된 정보를 현재 사실처럼 설명할 수 있습니다. 이런 그럴듯한 오류를 흔히 환각(hallucination)이라고 부릅니다. 출처 링크가 붙어 있다는 이유만으로 사실이 확인된 것은 아닙니다.',
              },
              {
                kind: 'paragraph',
                text: '코딩 에이전트가 “수정했고 테스트도 통과했다”고 말해도, 그 문장 자체가 실행 증거는 아닙니다. 하네스는 모델의 제안과 도구의 결과를 분리해서 다뤄야 합니다. 실제 파일 변경, 실행한 명령과 종료 상태, 어떤 검사가 통과하거나 실패했는지가 작업의 상태를 보여 줍니다.',
              },
              {
                kind: 'paragraph',
                text: '도구를 썼다는 사실만으로 모든 주장이 검증되는 것도 아닙니다. 실행한 검사가 0점 같은 경계 조건을 빠뜨렸을 수 있고, 열어 본 문서가 다른 버전의 설명일 수 있습니다. 결과가 원래 요구사항을 확인하는 증거인지 연결해 읽어야, 그럴듯한 완료 보고와 실제 완료를 구분할 수 있습니다.',
              },
              {
                kind: 'references',
                links: [
                  { text: 'OpenAI · 잘못된 답변과 정보 검증', href: 'https://help.openai.com/en/articles/8313428-does-chatgpt-tell-the-truth' },
                ],
              },
            ],
          },
        ],
      },
      { id: 'messages-and-prompts', number: '02', title: '메시지와 프롬프트', description: '', sections: [] },
      { id: 'function-calling', number: '03', title: '함수 호출', description: '', sections: [] },
    ],
  },
  {
    id: 'core-runtime',
    number: 'II',
    title: '핵심 런타임',
    topics: [
      { id: 'coding-agents-and-omp', number: '04', title: '코딩 에이전트와 OMP', description: '', sections: [] },
      { id: 'session-runtime', number: '05', title: '세션 런타임', description: '', sections: [] },
      { id: 'project-instructions-and-prompt-assembly', number: '06', title: '프로젝트 지침과 프롬프트 구성', description: '', sections: [] },
      { id: 'agent-loop', number: '07', title: '에이전트 루프', description: '', sections: [] },
      { id: 'tool-definitions-and-registry', number: '08', title: '도구 정의와 레지스트리', description: '', sections: [] },
      { id: 'tool-permissions', number: '09', title: '도구 권한', description: '', sections: [] },
    ],
  },
  {
    id: 'tools-and-execution',
    number: 'III',
    title: '도구와 실행',
    topics: [
      { id: 'file-reading-and-search', number: '10', title: '파일 읽기와 검색', description: '', sections: [] },
      { id: 'file-editing', number: '11', title: '파일 편집', description: '', sections: [] },
      { id: 'shell-execution', number: '12', title: '셸 실행', description: '', sections: [] },
      { id: 'background-jobs', number: '13', title: '백그라운드 작업', description: '', sections: [] },
      { id: 'managed-processes', number: '14', title: '프로세스 관리', description: '', sections: [] },
      { id: 'python-and-javascript-execution', number: '15', title: 'Python과 JavaScript 실행', description: '', sections: [] },
      { id: 'ast-search-and-editing', number: '16', title: 'AST 검색과 편집', description: '', sections: [] },
      { id: 'language-servers', number: '17', title: '언어 서버', description: '', sections: [] },
      { id: 'debuggers', number: '18', title: '디버거', description: '', sections: [] },
      { id: 'web-search-and-document-retrieval', number: '19', title: '웹 검색과 문서 가져오기', description: '', sections: [] },
      { id: 'browser-automation', number: '20', title: '브라우저 자동화', description: '', sections: [] },
    ],
  },
  {
    id: 'model-access',
    number: 'IV',
    title: '모델 연동',
    topics: [
      { id: 'model-providers', number: '21', title: '모델 제공자', description: '', sections: [] },
      { id: 'model-catalog', number: '22', title: '모델 카탈로그', description: '', sections: [] },
      { id: 'response-streaming', number: '23', title: '응답 스트리밍', description: '', sections: [] },
      { id: 'authentication-and-credentials', number: '24', title: '인증과 자격 증명', description: '', sections: [] },
    ],
  },
  {
    id: 'context-and-persistence',
    title: '컨텍스트와 저장',
    number: 'V',
    topics: [
      { id: 'session-storage-and-resume', number: '25', title: '세션 저장과 재개', description: '', sections: [] },
      { id: 'context-compaction', number: '26', title: '컨텍스트 압축', description: '', sections: [] },
      { id: 'cross-session-memory', number: '27', title: '세션 간 메모리', description: '', sections: [] },
      { id: 'artifacts-and-internal-urls', number: '28', title: '아티팩트와 내부 URL', description: '', sections: [] },
      { id: 'checkpoints-and-rewind', number: '29', title: '체크포인트와 되돌리기', description: '', sections: [] },
    ],
  },
  {
    id: 'configuration-and-extensions',
    number: 'VI',
    title: '설정과 확장',
    topics: [
      { id: 'settings-and-resource-discovery', number: '30', title: '설정과 리소스 탐색', description: '', sections: [] },
      { id: 'skills-and-prompt-templates', number: '31', title: '스킬과 프롬프트 템플릿', description: '', sections: [] },
      { id: 'extensions-and-plugins', number: '32', title: '확장 기능과 플러그인', description: '', sections: [] },
      { id: 'mcp-integration', number: '33', title: 'MCP 연동', description: '', sections: [] },
    ],
  },
  {
    id: 'workflow-and-agent-coordination',
    number: 'VII',
    title: '작업 흐름과 에이전트 조정',
    topics: [
      { id: 'plan-mode', number: '34', title: '계획 모드', description: '', sections: [] },
      { id: 'goals', number: '35', title: '목표', description: '', sections: [] },
      { id: 'task-tracking', number: '36', title: '작업 추적', description: '', sections: [] },
      { id: 'subagents', number: '37', title: '하위 에이전트', description: '', sections: [] },
      { id: 'agent-communication', number: '38', title: '에이전트 간 통신', description: '', sections: [] },
    ],
  },
  {
    id: 'interfaces-and-infrastructure',
    number: 'VIII',
    title: '인터페이스와 지원 시스템',
    topics: [
      { id: 'terminal-interface', number: '39', title: '터미널 인터페이스', description: '', sections: [] },
      { id: 'sdk-rpc-and-acp-interfaces', number: '40', title: 'SDK, RPC, ACP 인터페이스', description: '', sections: [] },
      { id: 'usage-statistics', number: '41', title: '사용량 통계', description: '', sections: [] },
      { id: 'benchmarks', number: '42', title: '벤치마크', description: '', sections: [] },
    ],
  },
  {
    id: 'specialized-components',
    number: 'IX',
    title: '전문 구성 요소',
    topics: [
      { id: 'native-modules', number: '43', title: '네이티브 모듈', description: '', sections: [] },
      { id: 'bitmap-context-compression', number: '44', title: '비트맵 컨텍스트 압축', description: '', sections: [] },
      { id: 'live-collaboration', number: '45', title: '실시간 협업', description: '', sections: [] },
      { id: 'desktop-automation', number: '46', title: '데스크톱 자동화', description: '', sections: [] },
      { id: 'github-automation-service', number: '47', title: 'GitHub 자동화 서비스', description: '', sections: [] },
    ],
  },
];

export const topics: readonly Topic[] = topicGroups.flatMap(group => group.topics);

export const article: ArticleLabels = {
  back: '목차',
  onThisPage: '이 페이지에서',
  sectionNavigation: '섹션 탐색',
  currentSection: '현재 섹션',
  previousSection: '이전 섹션',
  nextSection: '다음 섹션',
  chapterNavigation: '글 탐색',
  previousChapter: '이전 글',
  nextChapter: '다음 글',
  copy: '코드 복사',
  copied: '복사했습니다',
  copyFailed: '자동 복사를 사용할 수 없습니다. 코드를 선택해 직접 복사해 주세요.',
  codeExample: '예시 코드',
  end: '목차로 돌아가기',
};
