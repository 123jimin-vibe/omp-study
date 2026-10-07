import type { SessionTreeBlock, CompactionBudgetBlock, MountedView } from '../content.ts';
import { el } from './dom.ts';
import { appendInlineText } from './inline-text.ts';

let exampleId = 0;
export function createSessionTree(data: SessionTreeBlock): MountedView {
  const events = new AbortController();
  const element = el('figure', 'learning-figure session-tree-example');
  const heading = el('h3', 'learning-figure-heading', data.title);
  heading.id = `session-tree-${++exampleId}`;
  element.setAttribute('aria-labelledby', heading.id);
  const controls = el('div', 'example-controls');
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', data.labels.choose);
  const saved = el('div', 'session-tree-saved');
  saved.append(el('h4', '', data.labels.saved));
  const tree = el('ul', 'session-tree');
  const items = new Map<string, HTMLElement>();
  function children(parent: string | null, list: HTMLElement) {
    for (const node of data.nodes.filter(node => node.parent === parent)) {
      const item = el('li');
      const label = el('span', 'session-tree-node');
      label.append(el('code', '', node.id), ' ');
      appendInlineText(label, node.text);
      items.set(node.id, label);
      item.append(label);
      if (data.nodes.some(child => child.parent === node.id)) {
        const nested = el('ul'); children(node.id, nested); item.append(nested);
      }
      list.append(item);
    }
  }
  children(null, tree); saved.append(tree);
  const results = el('div', 'session-tree-results');
  const options = data.branches.map(id => {
    const node = data.nodes.find(node => node.id === id)!;
    const button = el('button', 'button', node.text);
    button.type = 'button';
    const path: string[] = [];
    let cursor: typeof node | undefined = node;
    while (cursor) { path.unshift(cursor.id); cursor = data.nodes.find(n => n.id === cursor?.parent); }
    const result = el('section', 'tree-path-result');
    result.id = `tree-path-${exampleId}-${id}`;
    button.setAttribute('aria-controls', result.id);
    result.append(el('h4', '', `${data.labels.input} — ${id}`));
    const list = el('ol');
    for (const itemId of path) {
      const entry = data.nodes.find(n => n.id === itemId)!;
      list.append(el('li', '', `${entry.id}: ${entry.text}`));
    }
    result.append(list);
    button.addEventListener('click', () => select(id), { signal: events.signal });
    controls.append(button); results.append(result);
    return { id, button, path, result };
  });
  function select(id: string) {
    const selected = options.find(option => option.id === id)!;
    for (const option of options) {
      option.button.setAttribute('aria-pressed', String(option.id === id));
      option.result.dataset.active = String(option.id === id);
    }
    for (const [nodeId, item] of items) item.dataset.active = String(selected.path.includes(nodeId));
  }
  select(data.branches[0]!);
  element.append(heading, controls, saved, results);
  return { element, dispose: () => events.abort() };
}

export function createCompactionBudget(data: CompactionBudgetBlock): MountedView {
  const events = new AbortController();
  const element = el('figure', 'learning-figure compaction-budget-example');
  const heading = el('h3', 'learning-figure-heading', data.title);
  heading.id = `budget-${++exampleId}`;
  element.setAttribute('aria-labelledby', heading.id);
  const controls = el('div', 'example-controls');
  controls.setAttribute('role', 'group'); controls.setAttribute('aria-label', data.labels.choose);
  const format = (n: number) => n.toLocaleString(document.documentElement.lang);
  const panels = [data.before, data.after].map((segments, index) => {
    const name = index === 0 ? data.labels.before : data.labels.after;
    const button = el('button', 'button', name); button.type = 'button';
    const panel = el('section', 'budget-panel'); panel.id = `budget-${exampleId}-${index}`;
    button.setAttribute('aria-controls', panel.id);
    const used = segments.reduce((sum, segment) => sum + segment.tokens, 0);
    panel.append(el('h4', '', `${name}: ${format(used)} / ${format(data.capacity)} ${data.labels.tokens}`));
    const bar = el('div', 'budget-bar'); bar.setAttribute('aria-hidden', 'true');
    const legend = el('ul', 'budget-legend');
    for (const [i, segment] of [...segments, { label: data.labels.free, tokens: data.capacity - used }].entries()) {
      const slice = el('span', `budget-segment budget-segment-${i}`);
      slice.style.width = `${segment.tokens / data.capacity * 100}%`; bar.append(slice);
      const item = el('li'); const swatch = el('span', `budget-swatch budget-segment-${i}`);
      swatch.setAttribute('aria-hidden', 'true'); item.append(swatch, `${segment.label}: ${format(segment.tokens)} ${data.labels.tokens}`); legend.append(item);
    }
    const threshold = el('span', 'budget-threshold'); threshold.style.left = `${data.threshold / data.capacity * 100}%`; bar.append(threshold);
    panel.append(bar, legend);
    button.addEventListener('click', () => select(index), { signal: events.signal }); controls.append(button);
    return { button, panel };
  });
  function select(index: number) {
    for (const [i, view] of panels.entries()) {
      view.button.setAttribute('aria-pressed', String(i === index)); view.panel.dataset.active = String(i === index);
    }
  }
  select(0);
  element.append(heading, controls, ...panels.map(view => view.panel), el('p', 'learning-figure-caption', data.labels.note));
  return { element, dispose: () => events.abort() };
}
