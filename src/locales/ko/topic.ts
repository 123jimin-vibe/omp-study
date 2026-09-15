import type { ArticleLabels, Topic, TopicGroup } from '../../content.ts';

export const topicGroups: readonly TopicGroup[] = [
  {
    id: 'llm-fundamentals',
    title: 'LLM 기초',
    topics: [
      { id: 'large-language-models', number: '01', title: '대규모 언어 모델', description: '', sections: [] },
      { id: 'messages-and-prompts', number: '02', title: '메시지와 프롬프트', description: '', sections: [] },
      { id: 'function-calling', number: '03', title: '함수 호출', description: '', sections: [] },
    ],
  },
  {
    id: 'core-runtime',
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
  copy: '코드 복사',
  copied: '복사했습니다',
  copyFailed: '자동 복사를 사용할 수 없습니다. 코드를 선택해 직접 복사해 주세요.',
  codeExample: '예시 코드',
  end: '목차로 돌아가기',
};
