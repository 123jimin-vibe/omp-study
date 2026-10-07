import type { MountedView, SessionCompositionBlock } from '../content.ts';
import { el } from './dom.ts';
import { appendInlineText } from './inline-text.ts';

export function createSessionComposition(data: SessionCompositionBlock): MountedView {
  const element = el('figure', 'learning-figure session-composition');
  element.append(el('figcaption', 'learning-figure-heading', data.title));
  element.append(el('p', 'session-composition-caller', data.caller));
  const connections = el('div', 'session-composition-connections');
  for (const [arrow, label] of [['↓', data.request], ['↑', data.events]]) {
    const connection = el('p');
    const marker = el('span', 'session-composition-arrow', arrow);
    marker.setAttribute('aria-hidden', 'true');
    connection.append(marker);
    appendInlineText(connection, label);
    connections.append(connection);
  }
  const session = el('div', 'session-composition-boundary');
  session.append(el('h4', 'session-composition-title', data.session));
  const parts = el('dl', 'session-composition-parts');
  for (const part of data.parts) {
    const group = el('div');
    const label = el('dt');
    const detail = el('dd');
    appendInlineText(label, part.label);
    appendInlineText(detail, part.detail);
    group.append(label, detail);
    parts.append(group);
  }
  session.append(parts);
  element.append(connections, session);
  return { element };
}
