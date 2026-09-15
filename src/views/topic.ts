import type { ArticleLabels, DemoRegistry, MountedView, Topic } from '../content.ts';
import { renderArticle } from '../components/article.ts';
import { createSectionNavigation } from '../components/section-navigation.ts';
import { el, icon } from '../components/dom.ts';

export function renderTopic(topic: Topic, labels: ArticleLabels, demos: DemoRegistry): MountedView {
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

  element.append(back, header, layout, footer);
  const sectionNavigation = createSectionNavigation(topic, labels, element, indexLinks);
  element.append(sectionNavigation.element);
  return {
    element,
    dispose() {
      sectionNavigation.dispose?.();
      article.dispose?.();
    },
  };
}
