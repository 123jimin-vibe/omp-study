import { el, icon } from './dom.js';

/**
 * @param {import('../content.js').CodeBlock} block
 * @param {import('../content.js').ArticleLabels} labels
 * @returns {import('../content.js').MountedView}
 */
export function renderCodeBlock(block, labels) {
  const element = el('figure', 'article-code');
  const header = el('figcaption', 'article-code-header');
  const caption = el('span', 'article-code-caption', block.caption);
  const language = el('span', 'article-code-language', block.language);
  const copy = el('button', 'button article-copy');
  const copyLabel = el('span', '', labels.copy);
  copy.type = 'button';
  copy.append(icon('copy'), copyLabel);
  header.append(caption, language, copy);

  const pre = el('pre', 'article-code-pre');
  const code = el('code', 'article-code-source', block.code);
  pre.tabIndex = 0;
  pre.dir = 'ltr';
  pre.setAttribute('aria-label', `${labels.codeExample} — ${block.caption}`);
  pre.append(code);

  const status = el('p', 'article-copy-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  element.append(header, pre, status);

  let disposed = false;
  /** @type {number | undefined} */
  let resetTimer;
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

/**
 * @param {import('../content.js').ContentSection[]} sections
 * @param {import('../content.js').ArticleLabels} labels
 * @param {import('../content.js').DemoRegistry} demos
 * @returns {import('../content.js').MountedView}
 */
export function renderArticle(sections, labels, demos) {
  const element = el('article', 'topic-article');
  /** @type {import('../content.js').MountedView[]} */
  const children = [];

  for (const data of sections) {
    const section = el('section', 'article-section');
    const heading = el('h2', 'article-heading', data.title);
    section.id = data.id;
    heading.id = `${data.id}-heading`;
    heading.tabIndex = -1;
    section.setAttribute('aria-labelledby', heading.id);
    section.append(heading);

    for (const block of data.blocks) {
      switch (block.kind) {
        case 'paragraph':
          section.append(el('p', 'article-paragraph', block.text));
          break;
        case 'note': {
          const note = el('aside', 'article-note');
          const title = el('p', 'article-note-title', block.title);
          note.append(title, el('p', 'article-note-text', block.text));
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
          const child = demos[block.demo]();
          children.push(child);
          section.append(child.element);
          break;
        }
      }
    }
    element.append(section);
  }

  return {
    element,
    dispose() {
      for (const child of children) child.dispose();
      children.length = 0;
    },
  };
}
