import type { TokenizationBlock } from '../../content.ts';

export const tokenizationExample: TokenizationBlock = {
  kind: 'tokenization',
  title: '한 문장이 토큰으로 나뉘는 모습',
  sentence: '오늘은 날씨가 좋아요.',
  encoding: 'o200k_base',
  tokens: [
    { id: 149830, text: '오늘' },
    { id: 4740, text: '은' },
    { id: 61781, text: ' 날' },
    { id: 68282, text: '씨' },
    { id: 4081, text: '가' },
    { id: 90032, text: ' 좋아' },
    { id: 7952, text: '요' },
    { id: 13, text: '.' },
  ],
  labels: {
    sentence: '원문',
    tokens: '토큰',
    tokenId: 'ID',
    space: '공백 한 칸',
  },
  source: {
    text: '출처 · OpenAI tiktoken 0.13.0 — o200k_base 정의',
    href: 'https://github.com/openai/tiktoken/blob/0.13.0/tiktoken_ext/openai_public.py',
  },
};
