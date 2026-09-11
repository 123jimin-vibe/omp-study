import { topic, article } from './ko/topic.js';
import { demo } from './ko/demo.js';

/** @type {import('../js/content.js').Locale} */
const ko = {
  code: 'ko',
  title: '하네스 엔지니어링 — omp.study',
  siteName: 'omp.study',
  home: {
    eyebrow: 'HARNESS ENGINEERING',
    title: ['하네스', '엔지니어링'],
    browse: '목차 살펴보기',
    contents: '목차',
    placeholder: '임시 콘텐츠',
    topicMeta: '본문 · 코드 · 인터랙션',
    figure: 'FIG. 01',
    projection: 'ISOMETRIC / 30°',
  },
  nav: {
    contents: '목차',
    source: 'GitHub',
    language: '한국어',
    skip: '본문으로 건너뛰기',
  },
  footer: {
    label: 'HARNESS ENGINEERING',
    source: '소스 보기',
  },
  notFound: {
    title: '페이지를 찾을 수 없습니다',
    description: '주소를 확인하거나 목차로 돌아가 주세요.',
    back: '목차로 돌아가기',
  },
  article,
  topics: [topic],
  demo,
};

export default ko;
