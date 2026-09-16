import { el } from './dom.ts';

/** Append paired backtick spans as code; all other content stays literal text. */
export function appendInlineText(parent: HTMLElement, text: string): void {
  let offset = 0;
  for (const match of text.matchAll(/`([^`]+)`/g)) {
    if (match.index > offset) parent.append(text.slice(offset, match.index));
    parent.append(el('code', 'article-inline-code', match[1]));
    offset = match.index + match[0].length;
  }
  if (offset < text.length) parent.append(text.slice(offset));
}
