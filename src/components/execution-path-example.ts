import type { ExecutionPathBlock, MountedView } from '../content.ts';
import { el } from './dom.ts';
import { appendInlineText } from './inline-text.ts';

let pathSequence = 0;

export function createExecutionPathExample(data: ExecutionPathBlock): MountedView {
  const id = `execution-path-${++pathSequence}`;
  const events = new AbortController();
  const element = el('figure', 'learning-figure execution-path-example');
  const heading = el('h3', 'learning-figure-heading');
  heading.id = `${id}-heading`;
  appendInlineText(heading, data.title);
  element.setAttribute('aria-labelledby', heading.id);

  const input = el('div', 'execution-path-input');
  const inputLabel = el('p', 'execution-path-label');
  const inputText = el('p', 'execution-path-text');
  appendInlineText(inputLabel, data.input.label);
  appendInlineText(inputText, data.input.text);
  input.append(inputLabel, inputText);

  const controls = el('div', 'execution-path-controls');
  controls.setAttribute('role', 'tablist');
  controls.setAttribute('aria-label', data.labels.choose);
  const panels = el('div', 'execution-path-panels');

  const paths = data.paths.map((path, index) => {
    const button = el('button', 'execution-path-button');
    appendInlineText(button, path.label);
    button.type = 'button';
    button.id = `${id}-tab-${index}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `${id}-panel-${index}`);
    button.addEventListener('click', () => selectPath(index), { signal: events.signal });
    button.addEventListener('keydown', event => {
      let next: number;
      switch (event.key) {
        case 'ArrowLeft': next = (index + paths.length - 1) % paths.length; break;
        case 'ArrowRight': next = (index + 1) % paths.length; break;
        case 'Home': next = 0; break;
        case 'End': next = paths.length - 1; break;
        default: return;
      }
      event.preventDefault();
      selectPath(next);
      paths[next]?.button.focus();
    }, { signal: events.signal });

    const panel = el('div', 'execution-path-panel');
    panel.id = `${id}-panel-${index}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', button.id);
    const pathHeading = el('h4', 'execution-path-case');
    appendInlineText(pathHeading, path.label);
    const stages = el('ol', 'execution-path-stages');
    stages.setAttribute('role', 'list');
    for (const [stageIndex, stage] of path.stages.entries()) {
      const row = el('li', `execution-path-stage execution-path-${stage.state}`);
      const marker = el('span', 'execution-path-marker', stage.state === 'blocked' ? '×' : String(stageIndex + 1));
      marker.setAttribute('aria-hidden', 'true');
      const body = el('div', 'execution-path-stage-body');
      const label = el('p', 'execution-path-label');
      const text = el('p', 'execution-path-text');
      appendInlineText(label, stage.label);
      appendInlineText(text, stage.text);
      body.append(label, text);
      row.append(marker, body);
      stages.append(row);
    }
    const result = el('div', 'execution-path-result');
    const resultLabel = el('p', 'execution-path-label');
    const resultText = el('p', 'execution-path-text');
    appendInlineText(resultLabel, path.result.label);
    appendInlineText(resultText, path.result.text);
    result.append(resultLabel, resultText);
    panel.append(pathHeading, stages, result);
    controls.append(button);
    panels.append(panel);
    return { button, panel };
  });

  function selectPath(index: number): void {
    for (const [pathIndex, path] of paths.entries()) {
      const selected = pathIndex === index;
      path.button.setAttribute('aria-selected', String(selected));
      path.button.tabIndex = selected ? 0 : -1;
      path.panel.dataset.active = String(selected);
      path.panel.tabIndex = selected ? 0 : -1;
    }
  }

  selectPath(0);
  element.append(heading, input, controls, panels);
  return { element, dispose: () => events.abort() };
}
