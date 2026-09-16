import type { ToolSequenceBlock } from '../content.ts';
import { el } from './dom.ts';
import { appendInlineText } from './inline-text.ts';

let sequenceCount = 0;

export function createToolSequenceExample(data: ToolSequenceBlock): HTMLElement {
  const figure = el('figure', 'learning-figure tool-sequence-example');
  const heading = el('h3', 'learning-figure-heading');
  heading.id = `tool-sequence-${++sequenceCount}`;
  appendInlineText(heading, data.title);
  figure.setAttribute('aria-labelledby', heading.id);

  const prompt = el('p', 'tool-sequence-prompt');
  appendInlineText(prompt, data.prompt);

  const actors = el('div', 'tool-sequence-actors');
  for (const actor of data.actors) {
    const label = el('span', 'tool-sequence-actor');
    appendInlineText(label, actor);
    actors.append(label);
  }

  const timeline = el('div', 'tool-sequence-timeline');
  const lifelines = el('div', 'tool-sequence-lifelines');
  lifelines.setAttribute('aria-hidden', 'true');
  for (const [index] of data.actors.entries()) {
    const line = el('span', 'tool-sequence-lifeline');
    line.style.left = `${10 + index * 40}%`;
    lifelines.append(line);
  }

  const events = el('ol', 'tool-sequence-events');
  events.setAttribute('role', 'list');
  for (const [index, event] of data.events.entries()) {
    const row = el('li', `tool-sequence-event tool-sequence-${event.kind}`);
    const actorPosition = 10 + event.from * 40;
    const eventWidth = Math.abs(event.to - event.from) * 40;
    if (event.from === event.to) {
      const selfEventWidth = 40;
      const selfEventStart = Math.max(0, Math.min(100 - selfEventWidth, actorPosition - selfEventWidth / 2));
      row.classList.add('tool-sequence-self');
      row.style.setProperty('--sequence-start', `${selfEventStart}%`);
      row.style.setProperty('--sequence-width', `${selfEventWidth}%`);
      row.style.setProperty('--sequence-anchor', `${actorPosition}%`);
    } else {
      row.style.setProperty('--sequence-start', `${10 + Math.min(event.from, event.to) * 40}%`);
      row.style.setProperty('--sequence-width', `${eventWidth}%`);
      if (event.to < event.from) row.classList.add('tool-sequence-leftward');
    }

    const message = el('div', 'tool-sequence-message');
    const title = el('h4', 'tool-sequence-label');
    const number = el('span', 'tool-sequence-number', `${index + 1}`);
    number.setAttribute('aria-hidden', 'true');
    title.append(number);
    appendInlineText(title, event.label);

    const route = el('p', 'tool-sequence-route');
    appendInlineText(route, data.actors[event.from]);
    route.append(' → ');
    appendInlineText(route, data.actors[event.to]);

    const detail = el('p', 'tool-sequence-detail');
    appendInlineText(detail, event.detail);
    message.append(title, route, detail);
    if (event.correlation) {
      const correlation = el('code', 'tool-sequence-correlation', event.correlation);
      message.append(correlation);
    }

    const arrow = el('div', 'tool-sequence-arrow');
    arrow.setAttribute('aria-hidden', 'true');
    row.append(message, arrow);
    events.append(row);
  }
  timeline.append(lifelines, events);
  figure.append(heading, prompt, actors, timeline);
  return figure;
}
