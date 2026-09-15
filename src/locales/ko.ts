import type { Locale } from '../content.ts';
import { topics, topicGroups, article } from './ko/topic.ts';

const ko: Locale = {
  code: 'ko',
  title: 'OMP로 알아보는 하네스 엔지니어링 — omp.study',
  siteName: 'omp.study',
  home: {
    eyebrow: 'HARNESS ENGINEERING',
    title: ['OMP로 알아보는', '하네스 엔지니어링'],
    browse: '목차 살펴보기',
    contents: '목차',
  },
  nav: {
    contents: '목차',
    language: '한국어',
    skip: '본문으로 건너뛰기',
  },
  footer: {
    label: 'HARNESS ENGINEERING',
  },
  notFound: {
    title: '페이지를 찾을 수 없습니다',
    description: '주소를 확인하거나 목차로 돌아가 주세요.',
    back: '목차로 돌아가기',
  },
  article,
  reading: {
    controls: '읽기 도구',
    present: '발표 보기',
    exit: '발표 종료 (Esc)',
    entered: '발표 보기입니다. Esc 키로 나갈 수 있습니다.',
    exited: '기본 보기로 돌아왔습니다.',
    fullscreenUnavailable: '전체 화면을 사용할 수 없어 발표용 레이아웃만 적용했습니다.',
    fullscreenExitFailed: '전체 화면을 종료하지 못했습니다. Esc 키로 나가 주세요.',
  },
  theme: {
    toggle: '다크 모드',
    light: '밝은 화면으로 전환',
    dark: '어두운 화면으로 전환',
  },
  topics,
  topicGroups,
};

export default ko;
