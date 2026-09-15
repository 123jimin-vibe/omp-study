import type { Locale, MountedView } from '../content.ts';
import { el, icon } from '../components/dom.ts';
import { createTitleTypography } from '../components/typography.ts';

export function renderTitle(locale: Locale, { enter = true } = {}): MountedView {
  const page = el('div', 'title-page page-width');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (enter && !reducedMotion.matches) page.dataset.enter = '';
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
  hero.append(copy);
  const typography = reducedMotion.matches ? null : createTitleTypography(heading, hero, { typing: enter });

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

  const events = new AbortController();
  let copyVisible = false;
  function syncMotion(): void {
    copy.style.setProperty('--title-motion', copyVisible && !document.hidden ? 'running' : 'paused');
  }
  const intersection = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.target === copy) copyVisible = entry.isIntersecting;
    }
    syncMotion();
  });
  intersection.observe(copy);
  document.addEventListener('visibilitychange', syncMotion, { signal: events.signal });

  function finishEntrance(event: AnimationEvent): void {
    if (event.animationName === 'hero-reveal' && (event.type === 'animationcancel' || event.target === browse)) {
      delete page.dataset.enter;
    }
  }
  copy.addEventListener('animationend', finishEntrance, { signal: events.signal });
  copy.addEventListener('animationcancel', finishEntrance, { signal: events.signal });
  return {
    element: page,
    dispose() {
      intersection.disconnect();
      events.abort();
      for (const animation of page.getAnimations({ subtree: true })) {
        if (animation instanceof CSSAnimation && animation.animationName === 'hero-reveal') {
          animation.cancel();
        }
      }
      typography?.dispose();
    },
  };
}
