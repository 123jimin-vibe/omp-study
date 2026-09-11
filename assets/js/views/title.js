import { el, icon } from '../components/dom.js';
import { createBlueprint } from '../components/blueprint.js';

/** @param {import('../content.js').Locale} locale */
export function renderTitle(locale) {
  const page = el('div', 'title-page page-width');
  const hero = el('section', 'hero');
  hero.setAttribute('aria-labelledby', 'site-title');

  const copy = el('div', 'hero-copy');
  const eyebrow = el('p', 'eyebrow hero-eyebrow', locale.home.eyebrow);
  const heading = el('h1', 'hero-title');
  heading.id = 'site-title';
  heading.tabIndex = -1;
  for (const line of locale.home.title) heading.append(el('span', 'hero-title-line', line));
  const browse = el('a', 'browse-link');
  browse.href = '#/?section=contents';
  browse.append(el('span', '', locale.home.browse), icon('down'));
  copy.append(eyebrow, heading, browse);

  const visual = el('div', 'hero-visual');
  visual.setAttribute('aria-hidden', 'true');
  visual.append(createBlueprint());
  const coordinates = el('div', 'figure-coordinates');
  coordinates.append(el('span', '', locale.home.figure), el('span', '', locale.home.projection));
  visual.append(coordinates);
  hero.append(copy, visual);

  const contents = el('section', 'contents');
  contents.setAttribute('aria-labelledby', 'contents');
  const contentsHeader = el('div', 'contents-header');
  const contentsHeading = el('h2', 'contents-heading', locale.home.contents);
  contentsHeading.id = 'contents';
  contentsHeading.tabIndex = -1;
  const count = new Intl.NumberFormat(locale.code, { minimumIntegerDigits: 2 }).format(locale.topics.length);
  contentsHeader.append(contentsHeading, el('span', 'contents-count', count));

  const list = el('ol', 'contents-list');
  for (const topic of locale.topics) {
    const item = el('li');
    const link = el('a', 'topic-link');
    link.href = `#/topic/${encodeURIComponent(topic.id)}`;
    const number = el('span', 'topic-number', topic.number);
    number.setAttribute('aria-hidden', 'true');
    const text = el('div', 'topic-link-copy');
    const title = el('span', 'topic-title', topic.title);
    title.style.viewTransitionName = CSS.escape(`topic-${topic.id}`);
    text.append(title, el('span', 'topic-link-meta', locale.home.topicMeta));
    const arrow = el('span', 'topic-link-arrow');
    arrow.append(icon('right'));
    link.append(number, text, el('span', 'badge topic-placeholder', locale.home.placeholder), arrow);
    item.append(link);
    list.append(item);
  }
  contents.append(contentsHeader, list);
  page.append(hero, contents);
  return { element: page, dispose() {} };
}
