import type { ArticleLabels, DemoRegistry, MountedView, Topic } from '../content.ts';
import { renderArticle } from '../components/article.ts';
import { createSectionNavigation } from '../components/section-navigation.ts';
import { el, icon } from '../components/dom.ts';

function fitTopicTitle(title: HTMLHeadingElement, header: HTMLElement): () => void {
  const events = new AbortController();
  let disposed = false;
  let fittedWidth = 0;

  function fit() {
    if (disposed || !title.isConnected) return;
    fittedWidth = header.getBoundingClientRect().width;
    if (!fittedWidth) return;
    title.classList.remove('topic-title-fitted');
    const width = title.getBoundingClientRect().width;
    if (width <= fittedWidth) return;
    const size = parseFloat(getComputedStyle(title).fontSize);
    title.style.setProperty('--topic-title-size', `${size * (fittedWidth - 0.5) / width}px`);
    title.classList.add('topic-title-fitted');
  }

  const resize = new ResizeObserver(([entry]) => {
    if (entry.contentRect.width !== fittedWidth) fit();
  });
  resize.observe(header);
  const presentation = new MutationObserver(fit);
  presentation.observe(document.documentElement, {
    attributes: true, attributeFilter: ['data-presentation'],
  });
  window.addEventListener('resize', fit, { signal: events.signal });
  window.addEventListener('afterprint', fit, { signal: events.signal });
  document.fonts.addEventListener('loadingdone', fit, { signal: events.signal });
  void document.fonts.ready.then(fit);
  // The view is mounted synchronously; fit before its first paint or transition snapshot.
  queueMicrotask(fit);

  return () => {
    disposed = true;
    events.abort();
    resize.disconnect();
    presentation.disconnect();
  };
}

function createChapterLink(topic: Topic, direction: 'prev' | 'next', label: string): HTMLAnchorElement {
  const link = el('a', `chapter-link chapter-link-${direction}`);
  link.href = `#/topic/${encodeURIComponent(topic.id)}`;
  link.rel = direction;
  link.setAttribute('aria-keyshortcuts', direction === 'prev' ? 'ArrowLeft' : 'ArrowRight');
  const copy = el('span', 'chapter-link-copy');
  const title = el('span', 'chapter-link-title');
  title.append(el('span', 'chapter-link-number', topic.number), document.createTextNode(` ${topic.title}`));
  copy.append(el('span', 'chapter-link-label', label), title);
  if (direction === 'prev') link.append(icon('left'), copy);
  else link.append(copy, icon('right'));
  return link;
}

function isInteractiveKeyboardTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest([
    'a', 'button', 'input', 'select', 'textarea', 'summary', 'audio', 'video',
    '[contenteditable]:not([contenteditable="false"])',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]', '[role="checkbox"]', '[role="combobox"]', '[role="link"]',
    '[role="listbox"]', '[role="menuitem"]', '[role="option"]', '[role="radio"]',
    '[role="slider"]', '[role="spinbutton"]', '[role="switch"]', '[role="tab"]',
    '[role="textbox"]', '[role="treeitem"]',
  ].join(',')));
}

function activateLink(link: HTMLAnchorElement | undefined): boolean {
  if (!link || !link.hasAttribute('href') || link.getAttribute('aria-disabled') === 'true') return false;
  link.click();
  return true;
}

function bindKeyboardNavigation(
  previous: HTMLAnchorElement | undefined,
  next: HTMLAnchorElement | undefined,
  moveSection: (direction: -1 | 1) => boolean,
): AbortController {
  const keyboard = new AbortController();
  document.addEventListener('keydown', (event) => {
    if (
      event.defaultPrevented || event.isComposing
      || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
      || isInteractiveKeyboardTarget(event.target)
    ) return;

    let navigated = false;
    switch (event.key) {
      case 'ArrowLeft': navigated = activateLink(previous); break;
      case 'ArrowRight': navigated = activateLink(next); break;
      case 'ArrowUp': navigated = moveSection(-1); break;
      case 'ArrowDown': navigated = moveSection(1); break;
      default: return;
    }
    if (navigated) event.preventDefault();
  }, { signal: keyboard.signal });
  return keyboard;
}

export function renderTopic(
  topic: Topic, topics: readonly Topic[], labels: ArticleLabels, demos: DemoRegistry,
): MountedView {
  const element = el('div', 'topic-page page-width');
  const back = el('a', 'topic-back', labels.back);
  back.href = '#/?section=contents';
  back.prepend(icon('left'));

  const header = el('header', 'topic-header');
  const meta = el('div', 'topic-meta');
  meta.append(el('span', 'topic-number', topic.number));
  const title = el('h1', 'topic-title', topic.title);
  title.tabIndex = -1;
  title.dataset.topicTitle = topic.id;
  title.style.viewTransitionName = CSS.escape(`topic-${topic.id}`);
  header.append(meta, title);
  if (topic.description) header.append(el('p', 'topic-description', topic.description));
  element.append(back, header);
  const disposeTitle = fitTopicTitle(title, header);
  const footer = el('footer', 'topic-end');
  const navigation = el('nav', 'chapter-navigation');
  navigation.setAttribute('aria-label', labels.chapterNavigation);
  const position = topics.findIndex(entry => entry.id === topic.id);
  const previous = topics[position - 1];
  const next = position >= 0 ? topics[position + 1] : undefined;
  const previousLink = previous ? createChapterLink(previous, 'prev', labels.previousChapter) : undefined;
  const nextLink = next ? createChapterLink(next, 'next', labels.nextChapter) : undefined;
  if (previousLink) navigation.append(previousLink);
  if (nextLink) navigation.append(nextLink);
  if (navigation.childElementCount) footer.append(navigation);
  const end = el('a', 'topic-back', labels.end);
  end.href = '#/?section=contents';
  end.prepend(icon('left'));
  footer.append(end);
  if (!topic.sections.length) {
    element.append(footer);
    const keyboard = bindKeyboardNavigation(previousLink, nextLink, () => false);
    return {
      element,
      dispose() {
        keyboard.abort();
        disposeTitle();
      },
    };
  }

  const layout = el('div', 'topic-layout');
  const index = el('nav', 'topic-index');
  index.setAttribute('aria-label', labels.onThisPage);
  const indexTitle = el('p', 'topic-index-title', labels.onThisPage);
  const links = el('ul', 'topic-index-list');
  const indexLinks: HTMLAnchorElement[] = [];
  let groupLinks = links;
  for (const section of topic.sections) {
    if (section.group) {
      const group = el('li', 'topic-index-group');
      groupLinks = el('ul', 'topic-index-group-list');
      group.append(el('p', 'topic-index-group-title', section.group.title), groupLinks);
      links.append(group);
    }
    const item = el('li');
    const link = el('a', 'topic-index-link', section.title);
    link.href = `#/topic/${encodeURIComponent(topic.id)}?section=${encodeURIComponent(section.id)}`;
    item.append(link);
    indexLinks.push(link);
    groupLinks.append(item);
  }
  index.append(indexTitle, links);

  const article = renderArticle(topic.sections, labels, demos);
  layout.append(index, article.element);

  element.append(layout, footer);
  const sectionNavigation = createSectionNavigation(topic, labels, element, indexLinks);
  element.append(sectionNavigation.element);
  const keyboard = bindKeyboardNavigation(previousLink, nextLink, direction => sectionNavigation.move(direction));
  return {
    element,
    dispose() {
      keyboard.abort();
      disposeTitle();
      sectionNavigation.dispose?.();
      article.dispose?.();
    },
  };
}
