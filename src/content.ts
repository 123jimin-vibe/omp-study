// Locales share content structures and renderers; demo blocks name registered components.
export type LocaleCode = 'ko' | 'en' | 'ja';

export type ParagraphBlock = { kind: 'paragraph'; text: string };
export type NoteBlock = { kind: 'note'; title: string; text: string };
export type CodeBlock = { kind: 'code'; language: string; caption: string; code: string };
export type DemoBlock = { kind: 'demo'; demo: string };
export type ContentBlock = ParagraphBlock | NoteBlock | CodeBlock | DemoBlock;

export interface ContentSection {
  id: string;
  title: string;
  blocks: readonly ContentBlock[];
}

export interface Topic {
  id: string;
  number: string;
  title: string;
  description: string;
  sections: readonly ContentSection[];
}

export interface TopicGroup {
  id: string;
  title: string;
  topics: readonly Topic[];
}

export interface ArticleLabels {
  back: string;
  onThisPage: string;
  sectionNavigation: string;
  currentSection: string;
  previousSection: string;
  nextSection: string;
  copy: string;
  copied: string;
  copyFailed: string;
  codeExample: string;
  end: string;
}

export interface ThemeLabels {
  toggle: string;
  light: string;
  dark: string;
}

export interface ReadingLabels {
  controls: string;
  present: string;
  exit: string;
  entered: string;
  exited: string;
  fullscreenUnavailable: string;
  fullscreenExitFailed: string;
}

export interface MountedView {
  element: HTMLElement;
  dispose?(): void;
}

export interface MountedDemo extends MountedView {
  dispose(): void;
  // Produce a static snapshot of current state only when printing is requested.
  renderPrint(): HTMLElement;
}

export type DemoRegistry = Record<DemoBlock['demo'], () => MountedDemo>;

export interface Locale {
  code: LocaleCode;
  title: string;
  siteName: string;
  home: {
    eyebrow: string;
    title: readonly [string, string];
    browse: string;
    contents: string;
  };
  nav: { contents: string; language: string; skip: string };
  footer: { label: string };
  notFound: { title: string; description: string; back: string };
  article: ArticleLabels;
  reading: ReadingLabels;
  theme: ThemeLabels;
  topics: readonly Topic[];
  topicGroups: readonly TopicGroup[];
}
