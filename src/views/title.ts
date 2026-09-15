import type { Locale, MountedView } from '../content.ts';
import { el, icon } from '../components/dom.ts';
import { createTitleTypography } from '../components/typography.ts';

export function renderTitle(
  locale: Locale,
  {
    enter = true,
    expandedGroups,
    revealTopicId,
  }: { enter?: boolean; expandedGroups?: Set<string>; revealTopicId?: string } = {},
): MountedView {
  const page = el('div', 'title-page page-width');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  let printing = false;
  const disclosures: { details: HTMLDetailsElement; settle: () => void }[] = [];
  const expansion = expandedGroups ?? new Set<string>();
  if (!expandedGroups && locale.topicGroups[0]) expansion.add(locale.topicGroups[0].id);
  const revealGroup = revealTopicId
    ? locale.topicGroups.find(group => group.topics.some(topic => topic.id === revealTopicId))
    : undefined;
  if (revealGroup) expansion.add(revealGroup.id);
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
  const sectionNumber = new Intl.NumberFormat(locale.code, { minimumIntegerDigits: 2 });
  const count = sectionNumber.format(locale.topics.length);
  contentsHeader.append(contentsHeading, el('span', 'contents-count', count));

  const groups = el('div', 'contents-groups');
  for (const [index, group] of locale.topicGroups.entries()) {
    const details = el('details', 'contents-group');
    details.dataset.groupId = group.id;
    const summary = el('summary', 'contents-group-toggle');
    const number = el('span', 'contents-group-number', sectionNumber.format(index + 1));
    number.setAttribute('aria-hidden', 'true');
    const label = el('span', 'contents-group-title', group.title);
    const range = el('span', 'contents-group-range', `${group.topics[0]?.number ?? ''}–${group.topics.at(-1)?.number ?? ''}`);
    const chevron = el('span', 'contents-group-chevron');
    chevron.setAttribute('aria-hidden', 'true');
    summary.append(number, label, range, chevron);
    const panel = el('div', 'contents-group-panel');
    const list = el('ol', 'contents-list');
    for (const topic of group.topics) {
      const item = el('li');
      const link = el('a', 'topic-link');
      link.href = `#/topic/${encodeURIComponent(topic.id)}`;
      link.dataset.topicId = topic.id;
      const number = el('span', 'topic-number', topic.number);
      number.setAttribute('aria-hidden', 'true');
      const text = el('div', 'topic-link-copy');
      const title = el('span', 'topic-title', topic.title);
      title.dataset.topicTitle = topic.id;
      title.style.viewTransitionName = CSS.escape(`topic-${topic.id}`);
      text.append(title);
      const arrow = el('span', 'topic-link-arrow');
      arrow.append(icon('right'));
      link.append(number, text, arrow);
      item.append(link);
      list.append(item);
    }
    panel.append(list);
    details.append(summary, panel);
    groups.append(details);

    let expanded = expansion.has(group.id);
    let animation: Animation | null = null;
    const rowAnimations: Animation[] = [];
    function syncExpanded(open: boolean): void {
      expanded = open;
      if (open) expansion.add(group.id);
      else expansion.delete(group.id);
      details.toggleAttribute('data-expanded', open);
    }
    function cancelAnimations(): void {
      if (animation) {
        animation.onfinish = null;
        animation.cancel();
        animation = null;
      }
      for (const row of rowAnimations) row.cancel();
      rowAnimations.length = 0;
    }
    function settle(): void {
      cancelAnimations();
      details.open = expanded;
      panel.inert = false;
      delete details.dataset.animating;
    }
    syncExpanded(expanded);
    settle();
    disclosures.push({ details, settle });
    details.addEventListener('contents-reveal', () => {
      syncExpanded(true);
      settle();
    }, { signal: events.signal });
    summary.addEventListener('click', event => {
      event.preventDefault();
      if (printing) return;
      const startHeight = details.open ? panel.getBoundingClientRect().height : 0;
      cancelAnimations();
      syncExpanded(!expanded);
      if (reducedMotion.matches) {
        settle();
        return;
      }
      details.open = true;
      panel.inert = !expanded;
      details.dataset.animating = '';
      animation = panel.animate(
        [{ height: `${startHeight}px` }, { height: `${expanded ? panel.scrollHeight : 0}px` }],
        { duration: expanded ? 260 : 200, easing: 'cubic-bezier(0.22, 0.7, 0.2, 1)', fill: 'both' },
      );
      animation.onfinish = settle;
      if (expanded) {
        for (let rowIndex = 0; rowIndex < list.children.length; rowIndex++) {
          rowAnimations.push(list.children[rowIndex]!.animate(
            [{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }],
            { duration: 160, delay: Math.min(rowIndex * 18, 60), easing: 'ease-out', fill: 'backwards' },
          ));
        }
      } else {
        rowAnimations.push(list.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' }));
      }
    }, { signal: events.signal });
    details.addEventListener('toggle', () => {
      if (!printing && !animation) syncExpanded(details.open);
    }, { signal: events.signal });
  }
  contents.append(contentsHeader, groups);
  page.append(hero, contents);

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
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) for (const disclosure of disclosures) disclosure.settle();
  }, { signal: events.signal });
  window.addEventListener('beforeprint', () => {
    if (printing) return;
    printing = true;
    for (const disclosure of disclosures) {
      disclosure.settle();
      disclosure.details.open = true;
    }
  }, { signal: events.signal });
  window.addEventListener('afterprint', () => {
    for (const disclosure of disclosures) disclosure.settle();
    printing = false;
  }, { signal: events.signal });

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
      for (const disclosure of disclosures) disclosure.settle();
      for (const animation of page.getAnimations({ subtree: true })) {
        if (animation instanceof CSSAnimation && animation.animationName === 'hero-reveal') {
          animation.cancel();
        }
      }
      typography?.dispose();
    },
  };
}
