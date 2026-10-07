import type { MountedView, TaskTranscriptBlock } from '../content.ts';
import { el } from './dom.ts';
import { appendInlineText } from './inline-text.ts';
import { highlightCode } from './syntax.ts';

let transcriptCount = 0;

export function createTaskTranscript(data: TaskTranscriptBlock): MountedView {
  const events = new AbortController();
  const figure = el('figure', 'learning-figure task-transcript');
  const heading = el('h3', 'learning-figure-heading', data.title);
  heading.id = `task-transcript-${++transcriptCount}`;
  figure.setAttribute('aria-labelledby', heading.id);
  const caption = el('p', 'transcript-caption', data.caption);
  const prompt = el('div', 'transcript-prompt');
  const promptText = el('p');
  appendInlineText(promptText, data.prompt.text);
  prompt.append(el('p', 'transcript-label', data.prompt.label), promptText);

  const controls = el('div', 'transcript-controls');
  const previous = el('button', 'button', data.controls.previous);
  const next = el('button', 'button', data.controls.next);
  const all = el('button', 'button', data.controls.all);
  const status = el('span', 'transcript-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-atomic', 'true');
  for (const button of [previous, next, all]) button.type = 'button';
  controls.append(previous, status, next, all);

  const list = el('ol', 'transcript-steps');
  list.setAttribute('role', 'list');
  const rows = data.steps.map((step, index) => {
    const row = el('li', 'transcript-step');
    const number = el('span', 'transcript-number', String(index + 1));
    number.setAttribute('aria-hidden', 'true');
    const card = el('div', 'transcript-card');
    const label = el('p', 'transcript-label');
    appendInlineText(label, step.label);
    const title = el('h4', 'transcript-title', step.title);
    const text = el('p');
    appendInlineText(text, step.text);
    card.append(label, title, text);
    if (step.code) {
      const pre = el('pre', 'transcript-code');
      const code = el('code', 'article-code-source');
      if (step.code.language === 'diff') {
        for (const line of step.code.source.split('\n')) {
          const kind = line.startsWith('+') ? 'added' : line.startsWith('-') ? 'removed' : 'context';
          code.append(el('span', `transcript-diff-${kind}`, `${line}\n`));
        }
      } else {
        highlightCode(code, step.code.source, step.code.language);
      }
      pre.dir = 'ltr';
      pre.append(code);
      card.append(pre);
    }
    row.append(number, card);
    list.append(row);
    return row;
  });

  // Reveal a growing transcript; earlier tool results stay visible for context.
  let current = 0;
  function show(index: number) {
    current = index;
    rows.forEach((row, i) => {
      row.dataset.visible = String(i <= index);
      if (i === index) row.setAttribute('aria-current', 'step');
      else row.removeAttribute('aria-current');
    });
    previous.disabled = index === 0;
    next.disabled = index === rows.length - 1;
    all.disabled = index === rows.length - 1;
    status.textContent = `${data.controls.step} ${index + 1} / ${rows.length} · ${data.steps[index].title}`;
  }
  previous.addEventListener('click', () => show(Math.max(0, current - 1)), { signal: events.signal });
  next.addEventListener('click', () => show(Math.min(rows.length - 1, current + 1)), { signal: events.signal });
  all.addEventListener('click', () => show(rows.length - 1), { signal: events.signal });
  figure.append(heading, caption, prompt, controls, list);
  show(0);
  return { element: figure, dispose: () => events.abort() };
}
