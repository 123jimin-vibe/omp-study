import type { MountedView, TokenizationBlock } from '../content.ts';
import { el } from './dom.ts';

export function createTokenizationExample(data: TokenizationBlock): MountedView {
  const element = el('figure', 'learning-figure tokenization-example');
  element.setAttribute('aria-label', data.title);
  const heading = el('h3', 'learning-figure-heading', data.title);

  const original = el('div', 'tokenization-original');
  original.append(
    el('p', 'tokenization-label', data.labels.sentence),
    el('p', 'tokenization-sentence', data.sentence),
  );

  const mapping = el('div', 'tokenization-mapping');
  mapping.setAttribute('aria-hidden', 'true');

  const summary = el('div', 'tokenization-summary');
  const count = el('p', 'tokenization-count');
  count.append(
    el('strong', '', String(data.tokens.length)),
    document.createTextNode(` ${data.labels.tokens}`),
  );
  summary.append(count, el('code', 'tokenization-encoding', data.encoding));

  const tokens = el('ol', 'tokenization-strip');
  tokens.setAttribute('role', 'list');
  tokens.setAttribute('aria-label', `${data.tokens.length} ${data.labels.tokens}`);
  for (const token of data.tokens) {
    const chip = el('li', 'tokenization-chip');
    const text = el('span', 'tokenization-piece');
    for (const part of token.text.split(/( )/)) {
      if (part === ' ') {
        const space = el('span', 'tokenization-space', part);
        space.setAttribute('role', 'img');
        space.setAttribute('aria-label', data.labels.space);
        text.append(space);
      } else if (part) {
        text.append(document.createTextNode(part));
      }
    }
    chip.append(text, el('span', 'tokenization-id', `${data.labels.tokenId} ${token.id}`));
    tokens.append(chip);
  }

  const legend = el('p', 'tokenization-legend');
  const spaceMark = el('span', 'tokenization-space', ' ');
  spaceMark.setAttribute('aria-hidden', 'true');
  legend.append(spaceMark, document.createTextNode(data.labels.space));

  const caption = el('figcaption', 'learning-figure-caption');
  const source = el('a', 'tokenization-source', data.source.text);
  source.href = data.source.href;
  caption.append(source);
  element.append(heading, original, mapping, summary, tokens, legend, caption);
  return { element };
}
