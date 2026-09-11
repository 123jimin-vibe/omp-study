/**
 * Content is data, not markup. Locales share this structure and the same renderers.
 * Demo blocks name a registered component; they never embed executable code.
 *
 * @typedef {'ko' | 'en' | 'ja'} LocaleCode
 * @typedef {{ kind: 'paragraph', text: string }} ParagraphBlock
 * @typedef {{ kind: 'note', title: string, text: string }} NoteBlock
 * @typedef {{ kind: 'code', language: string, caption: string, code: string }} CodeBlock
 * @typedef {{ kind: 'demo', demo: 'sample-flow' }} DemoBlock
 * @typedef {ParagraphBlock | NoteBlock | CodeBlock | DemoBlock} ContentBlock
 * @typedef {{ id: string, title: string, blocks: ContentBlock[] }} ContentSection
 * @typedef {{ id: string, number: string, title: string, description: string, sections: ContentSection[] }} Topic
 * @typedef {{ back: string, onThisPage: string, placeholder: string, copy: string, copied: string, copyFailed: string, codeExample: string, end: string }} ArticleLabels
 * @typedef {{ title: string, description: string, next: string, reset: string, stages: [string, string, string], states: [string, string, string, string], step: string, complete: string }} DemoLabels
 * @typedef {{ element: HTMLElement, dispose: () => void }} MountedView
 * @typedef {Record<DemoBlock['demo'], () => MountedView>} DemoRegistry
 * @typedef {{ code: LocaleCode, title: string, siteName: string, home: { eyebrow: string, title: [string, string], browse: string, contents: string, placeholder: string, topicMeta: string, figure: string, projection: string }, nav: { contents: string, source: string, language: string, skip: string }, footer: { label: string, source: string }, notFound: { title: string, description: string, back: string }, article: ArticleLabels, topics: Topic[], demo: DemoLabels }} Locale
 */

export {};
