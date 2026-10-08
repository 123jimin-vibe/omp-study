import { el } from './dom.ts';

export type InlineTokenKind = 'setting' | 'value' | 'command';
let tokenLabels: Readonly<Record<InlineTokenKind, string>> | undefined;

export function configureInlineText(labels: Readonly<Record<InlineTokenKind, string>>): void {
  tokenLabels = labels;
}

/** Authored definitions and typed code spans; never interpret arbitrary HTML. */
export function appendInlineText(parent: HTMLElement, text: string): void {
  let offset = 0;
  for (const match of text.matchAll(/`([^`]+)`(?:\{(setting|value|command)\})?|\*\*([^*\n]+)\*\*|\[([^\]\n]+)\]\((#\/topic\/[a-z0-9-]+)\)/g)) {
    if (match.index > offset) parent.append(text.slice(offset, match.index));
    if (match[1] !== undefined) {
      const code = el('code', 'article-inline-code', match[1]);
      if (match[2] && tokenLabels) {
        const label = tokenLabels[match[2] as InlineTokenKind];
        code.classList.add('article-token');
        code.dataset.kind = match[2];
        code.dataset.label = label;
        code.title = label;
        code.setAttribute('aria-label', `${label}: ${match[1]}`);
      }
      parent.append(code);
    } else if (match[3] !== undefined) {
      const definition = el('dfn', 'article-definition');
      definition.append(el('strong', '', match[3]));
      parent.append(definition);
    } else {
      const link = el('a', 'article-inline-link');
      link.href = match[5];
      appendInlineText(link, match[4]);
      parent.append(link);
    }
    offset = match.index + match[0].length;
  }
  if (offset < text.length) parent.append(text.slice(offset));
}
