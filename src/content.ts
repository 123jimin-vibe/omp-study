// Locales share content structures and renderers; demo blocks name registered components.
export type LocaleCode = 'ko' | 'en' | 'ja';

export type ParagraphBlock = { kind: 'paragraph'; text: string };
export type NoteBlock = { kind: 'note'; title: string; text: string };
export type CodeBlock = { kind: 'code'; language: string; caption: string; code: string };
export type DemoBlock = { kind: 'demo'; demo: string };
export type ReferencesBlock = { kind: 'references'; links: readonly { text: string; href: string }[] };
export interface ExchangeBlock {
  kind: 'exchange';
  input: { label: string; text: string };
  outputs: readonly { label: string; text: string }[];
}

export interface TokenizationBlock {
  kind: 'tokenization';
  title: string;
  sentence: string;
  encoding: string;
  tokens: readonly { id: number; text: string }[];
  labels: { sentence: string; tokens: string; tokenId: string; space: string };
  source: { text: string; href: string };
}

export interface ContextWindowBlock {
  kind: 'context-window';
  title: string;
  caption: string;
  capacity: number;
  outputLimit: number;
  scenarios: readonly {
    label: string;
    input: number;
    reasoning: number;
    output: number;
    description: string;
  }[];
  labels: {
    context: string;
    input: string;
    reasoning: string;
    output: string;
    remaining: string;
    outputLimit: string;
    generationRange: string;
    unavailable: string;
    used: string;
    tokens: string;
    scenario: string;
    inputDetail: string;
    reasoningDetail: string;
    outputDetail: string;
    remainingDetail: string;
    play: string;
    pause: string;
    replay: string;
    step: string;
    phaseReasoning: string;
    phaseAnswer: string;
    phaseComplete: string;
  };
}

export interface ResponseComparisonBlock {
  kind: 'response-comparison';
  title: string;
  prompt: { label: string; text: string };
  candidates: readonly { label: string; code: string; explanation: string }[];
  checks: readonly { input: string; expected: string; actual: readonly string[] }[];
  labels: {
    candidates: string;
    results: string;
    input: string;
    expected: string;
    pass: string;
    fail: string;
  };
}

export type ContentBlock = ParagraphBlock | NoteBlock | CodeBlock | DemoBlock | ReferencesBlock
  | ExchangeBlock | TokenizationBlock | ContextWindowBlock | ResponseComparisonBlock;

export interface ContentSection {
  id: string;
  title: string;
  // Starts a content group continuing until the next group marker.
  group?: { id: string; title: string };
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
  number: string;
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
  chapterNavigation: string;
  previousChapter: string;
  nextChapter: string;
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
