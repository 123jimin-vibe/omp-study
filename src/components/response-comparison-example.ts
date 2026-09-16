import type { MountedView, ResponseComparisonBlock } from '../content.ts';
import { el } from './dom.ts';
import { highlightCode } from './syntax.ts';

let comparisonSequence = 0;

export function createResponseComparisonExample(data: ResponseComparisonBlock): MountedView {
  const { labels } = data;
  const id = `response-comparison-${++comparisonSequence}`;
  const events = new AbortController();
  const element = el('figure', 'learning-figure response-comparison-example');
  const heading = el('h3', 'learning-figure-heading', data.title);
  heading.id = `${id}-heading`;
  element.setAttribute('aria-labelledby', heading.id);

  const prompt = el('div', 'response-comparison-prompt');
  prompt.append(
    el('p', 'response-comparison-label', data.prompt.label),
    el('p', 'response-comparison-request', data.prompt.text),
  );

  const controls = el('div', 'response-comparison-controls');
  controls.setAttribute('role', 'tablist');
  controls.setAttribute('aria-label', labels.candidates);
  const panels = el('div', 'response-comparison-panels');

  const candidates = data.candidates.map((candidate, index) => {
    const button = el('button', 'response-comparison-button', candidate.label);
    button.type = 'button';
    button.id = `${id}-tab-${index}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `${id}-panel-${index}`);
    button.addEventListener('click', () => selectCandidate(index), { signal: events.signal });
    button.addEventListener('keydown', event => {
      let next: number;
      switch (event.key) {
        case 'ArrowLeft': next = (index - 1 + data.candidates.length) % data.candidates.length; break;
        case 'ArrowRight': next = (index + 1) % data.candidates.length; break;
        case 'Home': next = 0; break;
        case 'End': next = data.candidates.length - 1; break;
        default: return;
      }
      event.preventDefault();
      selectCandidate(next);
      candidates[next]?.button.focus();
    }, { signal: events.signal });

    const panel = el('div', 'response-comparison-candidate');
    panel.id = `${id}-panel-${index}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', button.id);
    const codeBlock = el('div', 'response-comparison-code-block');
    const candidateHeading = el('h4', 'response-comparison-candidate-heading', candidate.label);
    const pre = el('pre', 'response-comparison-code');
    pre.dir = 'ltr';
    pre.setAttribute('aria-label', candidate.label);
    const code = el('code', 'article-code-source response-comparison-source');
    highlightCode(code, candidate.code, 'javascript');
    pre.append(code);
    codeBlock.append(candidateHeading, pre);

    const table = el('table', 'response-comparison-checks');
    table.setAttribute('aria-label', `${candidate.label} — ${labels.results}`);
    const tableHead = el('thead');
    const headerRow = el('tr');
    for (const label of [labels.input, labels.expected, labels.results]) {
      const cell = el('th', '', label);
      cell.scope = 'col';
      headerRow.append(cell);
    }
    tableHead.append(headerRow);
    const body = el('tbody');
    for (const check of data.checks) {
      const actual = check.actual[index];
      const passed = actual === check.expected;
      const row = el('tr');
      row.dataset.result = passed ? 'pass' : 'fail';
      const input = el('th', 'response-comparison-check-input');
      input.scope = 'row';
      input.append(el('code', '', check.input));
      const expected = el('td');
      expected.append(el('code', '', check.expected));
      const result = el('td');
      const resultValue = el('span', 'response-comparison-result');
      resultValue.append(
        el('code', '', actual),
        el('span', 'response-comparison-verdict', passed ? labels.pass : labels.fail),
      );
      result.append(resultValue);
      row.append(input, expected, result);
      body.append(row);
    }
    table.append(tableHead, body);
    panel.append(codeBlock, el('p', 'response-comparison-explanation', candidate.explanation), table);
    controls.append(button);
    panels.append(panel);
    return { button, panel, pre };
  });

  function selectCandidate(index: number) {
    for (const [candidateIndex, candidate] of candidates.entries()) {
      const selected = candidateIndex === index;
      candidate.button.setAttribute('aria-selected', String(selected));
      candidate.button.tabIndex = selected ? 0 : -1;
      candidate.panel.dataset.active = String(selected);
      candidate.pre.tabIndex = selected ? 0 : -1;
    }
  }

  selectCandidate(0);
  element.append(heading, prompt, controls, panels);
  return {
    element,
    dispose() {
      events.abort();
    },
  };
}
