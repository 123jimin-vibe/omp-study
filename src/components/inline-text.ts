import { el } from './dom.ts';

/** Render inline code and explicit local chapter links; other text stays literal. */
export function appendInlineText(parent: HTMLElement, text: string): void {
  let offset = 0;
  for (const match of text.matchAll(/`([^`]+)`|\[([^\]\n]+)\]\((#\/topic\/[a-z0-9-]+)\)/g)) {
    if (match.index > offset) parent.append(text.slice(offset, match.index));
    if (match[1] !== undefined) {
      parent.append(el('code', 'article-inline-code', match[1]));
    } else {
      const link = el('a', 'article-inline-link');
      link.href = match[3];
      appendInlineText(link, match[2]);
      parent.append(link);
    }
    offset = match.index + match[0].length;
  }
  if (offset < text.length) parent.append(text.slice(offset));
}
