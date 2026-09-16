import type {
  ArticleLabels,
  CodeBlock,
  ContentSection,
  DemoRegistry,
  MountedDemo,
  MountedView,
} from '../content.ts';
import { el, icon } from './dom.ts';
import { appendInlineText } from './inline-text.ts';
import { highlightCode } from './syntax.ts';
import { createExchangeExample } from './exchange-example.ts';
import { createTokenizationExample } from './tokenization-example.ts';
import { createContextWindowExample } from './context-window-example.ts';
import { createResponseComparisonExample } from './response-comparison-example.ts';
import { createConversationHistoryExample } from './conversation-history-example.ts';
import { createToolSequenceExample } from './tool-sequence-example.ts';
import { createExecutionPathExample } from './execution-path-example.ts';

export function renderCodeBlock(block: CodeBlock, labels: ArticleLabels): MountedView {
  const element = el('figure', 'article-code');
  const header = el('figcaption', 'article-code-header');
  const caption = el('span', 'article-code-caption');
  appendInlineText(caption, block.caption);
  const language = el('span', 'article-code-language', block.language);
  const copy = el('button', 'button article-copy');
  const copyLabel = el('span', '', labels.copy);
  copy.type = 'button';
  copy.append(icon('copy'), copyLabel);
  header.append(caption, language, copy);

  const pre = el('pre', 'article-code-pre');
  const code = el('code', 'article-code-source');
  highlightCode(code, block.code, block.language);
  pre.tabIndex = 0;
  pre.dir = 'ltr';
  pre.setAttribute('aria-label', `${labels.codeExample} — ${caption.textContent}`);
  pre.append(code);

  const status = el('p', 'article-copy-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  element.append(header, pre, status);

  let disposed = false;
  let resetTimer: number | undefined;
  const events = new AbortController();

  async function copyCode() {
    window.clearTimeout(resetTimer);
    copy.disabled = true;
    status.textContent = '';
    try {
      await navigator.clipboard.writeText(block.code);
      if (disposed) return;
      copyLabel.textContent = labels.copied;
      copy.replaceChildren(icon('check'), copyLabel);
      status.textContent = labels.copied;
      resetTimer = window.setTimeout(() => {
        copyLabel.textContent = labels.copy;
        copy.replaceChildren(icon('copy'), copyLabel);
        status.textContent = '';
      }, 2800);
    } catch {
      if (disposed) return;
      copyLabel.textContent = labels.copy;
      copy.replaceChildren(icon('copy'), copyLabel);
      status.textContent = labels.copyFailed;
      pre.focus({ preventScroll: true });
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } finally {
      if (!disposed) copy.disabled = false;
    }
  }

  copy.addEventListener('click', copyCode, { signal: events.signal });

  return {
    element,
    dispose() {
      disposed = true;
      window.clearTimeout(resetTimer);
      events.abort();
    },
  };
}

export function renderArticle(
  sections: readonly ContentSection[],
  labels: ArticleLabels,
  demos: DemoRegistry,
): MountedView {
  const element = el('article', 'topic-article');
  const children: MountedView[] = [];
  const printDemos: { demo: MountedDemo; holder: HTMLElement }[] = [];
  const events = new AbortController();
  let groupLabel: string | undefined;

  for (const data of sections) {
    if (data.group) {
      const group = el('p', 'article-group-title', data.group.title);
      group.id = `${data.group.id}-label`;
      groupLabel = group.id;
      element.append(group);
    }
    const section = el('section', 'article-section');
    const heading = el('h2', 'article-heading', data.title);
    section.id = data.id;
    heading.id = `${data.id}-heading`;
    heading.tabIndex = -1;
    section.setAttribute('aria-labelledby', heading.id);
    if (groupLabel) section.setAttribute('aria-describedby', groupLabel);
    section.append(heading);

    for (const block of data.blocks) {
      switch (block.kind) {
        case 'subheading': {
          const subheading = el('h3', 'article-subheading');
          subheading.id = block.id;
          subheading.tabIndex = -1;
          appendInlineText(subheading, block.title);
          section.append(subheading);
          break;
        }
        case 'paragraph': {
          const paragraph = el('p', 'article-paragraph');
          appendInlineText(paragraph, block.text);
          section.append(paragraph);
          break;
        }
        case 'exchange':
          section.append(createExchangeExample(block));
          break;
        case 'tokenization': {
          const child = createTokenizationExample(block);
          children.push(child);
          section.append(child.element);
          break;
        }
        case 'context-window': {
          const child = createContextWindowExample(block);
          children.push(child);
          section.append(child.element);
          break;
        }
        case 'response-comparison': {
          const child = createResponseComparisonExample(block);
          children.push(child);
          section.append(child.element);
          break;
        }
        case 'conversation-history':
          section.append(createConversationHistoryExample(block));
          break;
        case 'tool-sequence':
          section.append(createToolSequenceExample(block));
          break;
        case 'execution-path': {
          const child = createExecutionPathExample(block);
          children.push(child);
          section.append(child.element);
          break;
        }
        case 'references': {
          const references = el('ul', 'article-references');
          for (const source of block.links) {
            const item = el('li');
            const link = el('a', '', source.text);
            link.href = source.href;
            item.append(link);
            references.append(item);
          }
          section.append(references);
          break;
        }
        case 'note': {
          const note = el('aside', 'article-note');
          const title = el('p', 'article-note-title', block.title);
          const text = el('p', 'article-note-text');
          appendInlineText(text, block.text);
          note.append(title, text);
          section.append(note);
          break;
        }
        case 'code': {
          const child = renderCodeBlock(block, labels);
          children.push(child);
          section.append(child.element);
          break;
        }
        case 'demo': {
          const createDemo = demos[block.demo];
          if (!createDemo) throw new Error(`Unregistered demo: ${block.demo}`);
          const child = createDemo();
          children.push(child);
          child.element.classList.add('demo-screen');
          const holder = el('div', 'demo-print');
          printDemos.push({ demo: child, holder });
          section.append(child.element, holder);
          break;
        }
        default: {
          const unexpected: never = block;
          throw new Error(`Unsupported content block: ${unexpected}`);
        }
      }
    }
    element.append(section);
  }

  function renderPrint(): void {
    for (const { demo, holder } of printDemos) {
      holder.replaceChildren(demo.renderPrint());
    }
  }

  function clearPrint(): void {
    for (const { holder } of printDemos) holder.replaceChildren();
  }

  window.addEventListener('beforeprint', renderPrint, { signal: events.signal });
  window.addEventListener('afterprint', clearPrint, { signal: events.signal });

  return {
    element,
    dispose() {
      events.abort();
      clearPrint();
      for (const child of children) child.dispose?.();
      children.length = 0;
      printDemos.length = 0;
    },
  };
}
