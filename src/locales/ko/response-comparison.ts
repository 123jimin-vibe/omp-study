import type { ResponseComparisonBlock } from '../../content.ts';

export const responseComparisonExample: ResponseComparisonBlock = {
  kind: 'response-comparison',
  title: '0점을 지우면 평균이 달라진다',
  prompt: {
    label: '동일한 요청',
    text: '점수 배열의 평균을 구하는 `averageScore(scores)`를 JavaScript로 작성해 줘. 항목은 0 이상의 유한한 수, `null`, `undefined` 중 하나야. `null`과 `undefined`만 빼고 0은 포함해. 남은 점수가 없으면 `null`을 반환해.',
  },
  candidates: [
    {
      label: '가능한 응답 A',
      code: `function averageScore(scores) {
  const valid = scores.filter(Boolean);
  if (valid.length === 0) return null;
  const sum = valid.reduce((a, b) => a + b, 0);
  return sum / valid.length;
}`,
      explanation: '`filter(Boolean)`은 누락 값뿐 아니라 0도 버립니다. `[0, 100]`이 `[100]`으로 바뀌어 평균이 100이 됩니다.',
    },
    {
      label: '가능한 응답 B',
      code: `function averageScore(scores) {
  const valid = scores.filter(
    score => score !== null && score !== undefined
  );
  if (valid.length === 0) return null;
  const sum = valid.reduce((a, b) => a + b, 0);
  return sum / valid.length;
}`,
      explanation: '`null`과 `undefined`만 제외해 0점을 남깁니다. `[0, 100]`의 합계 100을 두 점수로 나누어 평균 50을 구합니다.',
    },
  ],
  checks: [
    { input: '[80, 100]', expected: '90', actual: ['90', '90'] },
    { input: '[0, 100]', expected: '50', actual: ['100', '50'] },
    { input: '[null, undefined, 60]', expected: '60', actual: ['60', '60'] },
    { input: '[]', expected: 'null', actual: ['null', 'null'] },
  ],
  labels: {
    candidates: '비교할 응답',
    results: '계산 결과',
    input: '점수 배열',
    expected: '기대값',
    pass: '통과',
    fail: '실패',
  },
};
