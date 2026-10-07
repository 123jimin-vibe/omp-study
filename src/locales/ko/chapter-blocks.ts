import type { CodeBlock, ContentBlock, ContentSection, ExecutionPathBlock, ParagraphBlock, ReferencesBlock, TableBlock, ToolSequenceBlock, Topic } from '../../content.ts';

export const ompRevision = '3f000c524cf82279f804ffd7526280cc9a5f25fe';
export const p = (text: string): ParagraphBlock => ({ kind: 'paragraph', text });
export const code = (caption: string, language: string, code: string): CodeBlock => ({ kind: 'code', caption, language, code });
export const table = (title: string, columns: readonly string[], rows: readonly (readonly string[])[]): TableBlock => ({ kind: 'table', title, columns, rows });
export const section = (id: string, title: string, ...blocks: ContentBlock[]): ContentSection => ({ id, title, blocks });
export const refs = (...paths: string[]): ReferencesBlock => ({ kind: 'references', links: paths.map(path => ({ text: `OMP · ${path}`, href: `https://github.com/can1357/oh-my-pi/blob/${ompRevision}/${path}` })) });
export const related = (title: string, id: string): ReferencesBlock => ({ kind: 'references', links: [{ text: `함께 읽기 · ${title}`, href: `#/topic/${id}` }] });
export const topic = (id: string, title: string, description: string, ...sections: ContentSection[]): Topic => ({ id, number: '', title, description, sections });
export const paths = (title: string, input: string, cases: readonly { label: string; stages: readonly [string, string, 'complete' | 'blocked' | 'skipped'][]; result: string }[]): ExecutionPathBlock => ({
  kind: 'execution-path', title, input: { label: '주어진 상황', text: input }, labels: { choose: '조건 선택' },
  paths: cases.map(c => ({ label: c.label, stages: c.stages.map(([label, text, state]) => ({ label, text, state })), result: { label: '결과', text: c.result } })),
});
export const sequence = (title: string, prompt: string, actors: ToolSequenceBlock['actors'], events: ToolSequenceBlock['events']): ToolSequenceBlock => ({ kind: 'tool-sequence', title, prompt, actors, events, controls: { previous: '이전 단계', next: '다음 단계', all: '전체 보기', step: '단계' } });
