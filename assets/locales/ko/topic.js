/** @type {import('../../js/content.js').Topic} */
export const topic = {
  id: 'sample',
  number: '00',
  title: '예시 문서',
  description: '본문의 배치와 동작을 살펴보는 임시 페이지입니다. 실제 내용은 아직 정하지 않았습니다.',
  sections: [
    {
      id: 'text',
      title: '임시 본문',
      blocks: [
        {
          kind: 'paragraph',
          text: '이 문단은 본문이 놓일 자리를 보여 줍니다. 문장과 안내 상자의 읽기 흐름을 확인하기 위한 예시이며, 실제 학습 내용은 아닙니다.',
        },
        {
          kind: 'note',
          title: '아직 정해지지 않았습니다',
          text: '문서의 주제와 구성은 추후 결정합니다. 아래 코드와 데모도 화면 동작을 확인하기 위한 임시 예시입니다.',
        },
      ],
    },
    {
      id: 'code',
      title: '코드 표시 예시',
      blocks: [
        {
          kind: 'code',
          language: 'JavaScript',
          caption: '임시 코드',
          code: "const sample = '임시 예시';\nconsole.log(sample);",
        },
      ],
    },
    {
      id: 'demo',
      title: '동작 예시',
      blocks: [
        {
          kind: 'paragraph',
          text: '버튼을 눌러 단계 표시가 바뀌는지 확인할 수 있습니다. 특정 개념이나 실제 작업을 설명하는 데모는 아닙니다.',
        },
        { kind: 'demo', demo: 'sample-flow' },
      ],
    },
  ],
};

/** @type {import('../../js/content.js').ArticleLabels} */
export const article = {
  back: '목차',
  onThisPage: '이 페이지에서',
  placeholder: '임시 페이지',
  copy: '코드 복사',
  copied: '복사했습니다',
  copyFailed: '자동 복사를 사용할 수 없습니다. 코드를 선택해 직접 복사해 주세요.',
  codeExample: '예시 코드',
  end: '목차로 돌아가기',
};
