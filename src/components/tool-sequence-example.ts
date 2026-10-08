import type { ToolSequenceBlock, MountedView } from '../content.ts';
import { el } from './dom.ts';
import { appendInlineText } from './inline-text.ts';

let sequenceCount = 0;

export function createToolSequenceExample(data: ToolSequenceBlock): MountedView {
  const listeners = new AbortController();
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
  const actorGap = 80 / (data.actors.length - 1);
  for (const [index] of data.actors.entries()) {
    const line = el('span', 'tool-sequence-lifeline');
    line.style.left = `${10 + index * actorGap}%`;
    lifelines.append(line);
  }

  const events = el('ol', 'tool-sequence-events');
  events.setAttribute('role', 'list');
  for (const [index, event] of data.events.entries()) {
    const row = el('li', `tool-sequence-event tool-sequence-${event.kind}`);
    const actorPosition = 10 + event.from * actorGap;
    const eventWidth = Math.abs(event.to - event.from) * actorGap;
    const messageWidth = Math.max(40, eventWidth);
    const midpoint = 10 + (event.from + event.to) / 2 * actorGap;
    row.style.setProperty('--sequence-message-width', `${messageWidth}%`);
    row.style.setProperty('--sequence-message-start', `${Math.max(0, Math.min(100 - messageWidth, midpoint - messageWidth / 2))}%`);
    if (event.from === event.to) {
      const selfEventWidth = 40;
      const selfEventStart = Math.max(0, Math.min(100 - selfEventWidth, actorPosition - selfEventWidth / 2));
      row.classList.add('tool-sequence-self');
      row.style.setProperty('--sequence-start', `${selfEventStart}%`);
      row.style.setProperty('--sequence-width', `${selfEventWidth}%`);
      row.style.setProperty('--sequence-anchor', `${actorPosition}%`);
    } else {
      row.style.setProperty('--sequence-start', `${10 + Math.min(event.from, event.to) * actorGap}%`);
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
    appendInlineText(route, data.actors[event.from]!);
    route.append(' → ');
    appendInlineText(route, data.actors[event.to]!);

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
  if (data.controls) {
    const labels = data.controls;
    const controls = el('div', 'example-controls sequence-controls');
    const previous = el('button', 'button', labels.previous);
    const next = el('button', 'button', labels.next);
    const all = el('button', 'button', labels.all);
    const status = el('span', 'sequence-status');
    status.setAttribute('role', 'status');
    const rows = Array.from(events.children) as HTMLElement[];
    let current = 0;
    function show(index: number) {
      current = index;
      for (const [i, row] of rows.entries()) row.dataset.active = String(index < 0 || i === index);
      previous.disabled = index === 0;
      next.disabled = index === rows.length - 1;
      all.setAttribute('aria-pressed', String(index < 0));
      status.textContent = index < 0 ? labels.all : `${labels.step} ${index + 1} / ${rows.length}`;
    }
    previous.addEventListener('click', () => show(current < 0 ? 0 : Math.max(0, current - 1)), { signal: listeners.signal });
    next.addEventListener('click', () => show(current < 0 ? 0 : Math.min(rows.length - 1, current + 1)), { signal: listeners.signal });
    all.addEventListener('click', () => show(current < 0 ? 0 : -1), { signal: listeners.signal });
    for (const button of [previous, next, all]) button.type = 'button';
    controls.append(previous, status, next, all);
    figure.insertBefore(controls, actors);
    figure.classList.add('sequence-interactive');
    show(0);
  }
  return { element: figure, dispose: () => listeners.abort() };
}
