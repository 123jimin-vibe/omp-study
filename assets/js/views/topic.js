import { renderArticle } from '../components/article.js';
import { el, icon } from '../components/dom.js';

/**
 * @param {import('../content.js').Topic} topic
 * @param {import('../content.js').ArticleLabels} labels
 * @param {import('../content.js').DemoRegistry} demos
 * @returns {import('../content.js').MountedView}
 */
export function renderTopic(topic, labels, demos) {
  const element = el('div', 'topic-page page-width');
  const back = el('a', 'topic-back', labels.back);
  back.href = '#/?section=contents';
  back.prepend(icon('left'));

  const header = el('header', 'topic-header');
  const meta = el('div', 'topic-meta');
  meta.append(
    el('span', 'topic-number', topic.number),
    el('span', 'badge', labels.placeholder),
  );
  const title = el('h1', 'topic-title', topic.title);
  title.tabIndex = -1;
  title.style.viewTransitionName = CSS.escape(`topic-${topic.id}`);
  const description = el('p', 'topic-description', topic.description);
  header.append(meta, title, description);

  const layout = el('div', 'topic-layout');
  const index = el('nav', 'topic-index');
  index.setAttribute('aria-label', labels.onThisPage);
  const indexTitle = el('p', 'topic-index-title', labels.onThisPage);
  const links = el('ul', 'topic-index-list');
  for (const section of topic.sections) {
    const item = el('li');
    const link = el('a', 'topic-index-link', section.title);
    link.href = `#/topic/${encodeURIComponent(topic.id)}?section=${encodeURIComponent(section.id)}`;
    item.append(link);
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

  element.append(back, header, layout, footer);
  return { element, dispose: article.dispose };
}
