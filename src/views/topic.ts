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

export function renderTopic(topic: Topic, labels: ArticleLabels, demos: DemoRegistry): MountedView {
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
  if (!topic.sections.length) return { element, dispose: disposeTitle };

  const layout = el('div', 'topic-layout');
  const index = el('nav', 'topic-index');
  index.setAttribute('aria-label', labels.onThisPage);
  const indexTitle = el('p', 'topic-index-title', labels.onThisPage);
  const links = el('ul', 'topic-index-list');
  const indexLinks: HTMLAnchorElement[] = [];
  for (const section of topic.sections) {
    const item = el('li');
    const link = el('a', 'topic-index-link', section.title);
    link.href = `#/topic/${encodeURIComponent(topic.id)}?section=${encodeURIComponent(section.id)}`;
    item.append(link);
    indexLinks.push(link);
    links.append(item);
  }
  index.append(indexTitle, links);

  const article = renderArticle(topic.sections, labels, demos);
  layout.append(index, article.element);

  const footer = el('footer', 'topic-end');
  const end = el('a', 'topic-back', labels.end);
  end.href = '#/?section=contents';
  end.prepend(icon('left'));
  footer.append(end);

  element.append(layout, footer);
  const sectionNavigation = createSectionNavigation(topic, labels, element, indexLinks);
  element.append(sectionNavigation.element);
  return {
    element,
    dispose() {
      disposeTitle();
      sectionNavigation.dispose?.();
      article.dispose?.();
    },
  };
}
