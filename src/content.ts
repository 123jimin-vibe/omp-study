// Locales share content structures and renderers; demo blocks name registered components.
export type LocaleCode = 'ko' | 'en' | 'ja';

export type ParagraphBlock = { kind: 'paragraph'; text: string };
export type SubheadingBlock = { kind: 'subheading'; id: string; title: string };
export type NoteBlock = { kind: 'note'; title: string; text: string };
export type CodeBlock = { kind: 'code'; language: string; caption: string; code: string };
export type DemoBlock = { kind: 'demo'; demo: string };
export interface SessionCompositionBlock {
  kind: 'session-composition';
  title: string;
  caller: string;
  request: string;
  events: string;
  session: string;
  parts: readonly { label: string; detail: string }[];
}

export interface TaskTranscriptBlock {
  kind: 'task-transcript';
  title: string;
  caption: string;
  prompt: { label: string; text: string };
  steps: readonly {
    label: string;
    title: string;
    text: string;
    code?: { language: string; source: string };
  }[];
  controls: { previous: string; next: string; all: string; step: string };
}
export type ReferencesBlock = { kind: 'references'; links: readonly { text: string; href: string }[] };
export interface TableBlock {
  kind: 'table';
  title: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
}
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

export interface ConversationHistoryBlock {
  kind: 'conversation-history';
  title: string;
  labels: {
    firstRequest: string;
    secondRequest: string;
    input: string;
    response: string;
    carried: string;
    newQuestion: string;
  };
  priorInput: readonly { role: string; text: string }[];
  previousResponse: { role: string; text: string };
  nextMessage: { role: string; text: string };
  nextResponse: { role: string; text: string };
}

export interface ToolSequenceBlock {
  kind: 'tool-sequence';
  title: string;
  prompt: string;
  controls?: { previous: string; next: string; all: string; step: string };
  actors: readonly [string, string, string];
  events: readonly {
    from: 0 | 1 | 2;
    to: 0 | 1 | 2;
    label: string;
    detail: string;
    kind: 'request' | 'call' | 'read' | 'result' | 'answer' | 'process' | 'event';
    correlation?: string;
  }[];
}

export interface ExecutionPathBlock {
  kind: 'execution-path';
  title: string;
  input: { label: string; text: string };
  labels: { choose: string };
  paths: readonly {
    label: string;
    stages: readonly {
      label: string;
      text: string;
      state: 'complete' | 'blocked' | 'skipped';
    }[];
    result: { label: string; text: string };
  }[];
}

export interface SessionTreeBlock {
  kind: 'session-tree'; title: string;
  labels: { choose: string; input: string; saved: string; print: string };
  nodes: readonly { id: string; parent: string | null; text: string }[];
  branches: readonly string[];
}
export interface CompactionBudgetBlock {
  kind: 'compaction-budget'; title: string; capacity: number; threshold: number;
  labels: { before: string; after: string; free: string; tokens: string; choose: string; note: string };
  retainedPrefix: readonly { kind: 'instructions' | 'tools'; label: string; tokens: number }[];
  before: readonly { kind: 'history' | 'recent'; label: string; tokens: number }[];
  after: readonly { kind: 'summary' | 'recent'; label: string; tokens: number }[];
}

export type ContentBlock = ParagraphBlock | SubheadingBlock | NoteBlock | CodeBlock | DemoBlock | ReferencesBlock | TableBlock | TaskTranscriptBlock | SessionCompositionBlock
  | ExchangeBlock | TokenizationBlock | ContextWindowBlock | ResponseComparisonBlock
  | ConversationHistoryBlock | ToolSequenceBlock | ExecutionPathBlock | SessionTreeBlock | CompactionBudgetBlock;

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
  reviewed?: boolean;
}

export interface TopicGroup {
  id: string;
  number: string;
  title: string;
  topics: readonly Topic[];
}

export interface ArticleLabels {
  inlineTokens: Readonly<Record<'setting' | 'value' | 'command', string>>;
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
    unwritten: string;
    unreviewed: string;
  };
  nav: { contents: string; language: string; skip: string };
  footer: { label: string };
  notFound: { title: string; description: string; back: string };
  article: ArticleLabels;
  reading: ReadingLabels;
  theme: ThemeLabels;
  topicAliases?: Readonly<Record<string, string>>;
  topics: readonly Topic[];
  topicGroups: readonly TopicGroup[];
}
