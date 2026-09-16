import type { ArticleLabels, MountedView, Topic } from '../content.ts';
import { el, icon } from './dom.ts';

export interface SectionNavigation extends MountedView {
  move(direction: -1 | 1): boolean;
}

export function createSectionNavigation(
  topic: Topic,
  labels: ArticleLabels,
  root: HTMLElement,
  indexLinks: readonly HTMLAnchorElement[],
): SectionNavigation {
  const element = el('nav', 'section-nav');
  element.setAttribute('aria-label', labels.sectionNavigation);
  if (!topic.sections.length) {
    element.hidden = true;
    return { element, move: () => false };
  }

  const heading = el('div', 'section-nav-heading');
  const counter = el('span', 'section-nav-counter');
  heading.append(el('span', 'section-nav-label', labels.currentSection), counter);
  const current = el('a', 'section-nav-current');
  current.setAttribute('aria-current', 'location');
  const track = el('span', 'section-nav-track');
  track.setAttribute('aria-hidden', 'true');
  track.append(el('span', 'section-nav-progress'));
  const actions = el('div', 'section-nav-actions');
  const previous = el('a', 'section-nav-step');
  previous.setAttribute('aria-keyshortcuts', 'ArrowUp');
  previous.append(icon('left'));
  const next = el('a', 'section-nav-step');
  next.setAttribute('aria-keyshortcuts', 'ArrowDown');
  next.append(icon('right'));
  actions.append(previous, next);
  element.append(heading, current, track, actions);

  const targets = Array.from(root.querySelectorAll<HTMLElement>('.topic-article > .article-section'));
  const hrefs = topic.sections.map((section) =>
    `#/topic/${encodeURIComponent(topic.id)}?section=${encodeURIComponent(section.id)}`);
  const tops = new Float64Array(targets.length);
  const events = new AbortController();
  let selected = -1;
  let frame = 0;
  let geometryDirty = true;
  let viewportHeight = 0;
  let maxScroll = 0;
  let requested = -1;
  let requestedReset = 0;

  function clearRequested() {
    requested = -1;
    if (requestedReset) window.clearTimeout(requestedReset);
    requestedReset = 0;
  }

  function rememberRequested(index: number) {
    clearRequested();
    requested = index;
    requestedReset = window.setTimeout(clearRequested, 1000);
  }

  function updateStep(link: HTMLAnchorElement, index: number, label: string) {
    const section = topic.sections[index];
    if (!section) {
      link.removeAttribute('href');
      link.removeAttribute('title');
      link.setAttribute('aria-disabled', 'true');
      link.setAttribute('aria-label', label);
      link.tabIndex = -1;
      return;
    }
    link.href = hrefs[index];
    link.title = section.title;
    link.setAttribute('aria-label', `${label}: ${section.title}`);
    link.removeAttribute('aria-disabled');
    link.removeAttribute('tabindex');
  }

  function select(index: number) {
    if (index === selected) return;
    selected = index;
    current.textContent = topic.sections[index].title;
    current.href = hrefs[index];
    current.title = topic.sections[index].title;
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(topic.sections.length).padStart(2, '0')}`;
    element.style.setProperty('--section-progress', `${(index + 1) / topic.sections.length * 100}%`);
    updateStep(previous, index - 1, labels.previousSection);
    updateStep(next, index + 1, labels.nextSection);
    for (let linkIndex = 0; linkIndex < indexLinks.length; linkIndex += 1) {
      indexLinks[linkIndex].removeAttribute('aria-keyshortcuts');
      if (linkIndex === index) indexLinks[linkIndex].setAttribute('aria-current', 'location');
      else indexLinks[linkIndex].removeAttribute('aria-current');
      if (linkIndex === index - 1) indexLinks[linkIndex].setAttribute('aria-keyshortcuts', 'ArrowUp');
      if (linkIndex === index + 1) indexLinks[linkIndex].setAttribute('aria-keyshortcuts', 'ArrowDown');
    }
  }

  function update() {
    frame = 0;
    if (!root.isConnected) return;
    const scroll = window.scrollY;
    if (geometryDirty) {
      for (let index = 0; index < targets.length; index += 1) {
        tops[index] = targets[index].getBoundingClientRect().top + scroll;
      }
      viewportHeight = window.innerHeight;
      maxScroll = Math.max(0, document.documentElement.scrollHeight - viewportHeight);
      geometryDirty = false;
    }
    if (maxScroll > 1 && scroll >= maxScroll - 2) {
      const index = topic.sections.length - 1;
      select(index);
      if (requested === index) clearRequested();
      return;
    }
    const readingLine = scroll + viewportHeight * 0.25;
    let first = 0;
    let last = tops.length;
    while (first < last) {
      const middle = (first + last) >>> 1;
      if (tops[middle] <= readingLine) first = middle + 1;
      else last = middle;
    }
    const index = Math.max(0, first - 1);
    select(index);
    if (requested === index) clearRequested();
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  function measure() {
    geometryDirty = true;
    schedule();
  }
  // Cache geometry on layout changes; scrolling only searches numeric offsets.
  const resize = new ResizeObserver(measure);
  resize.observe(root);
  resize.observe(document.body);
  window.addEventListener('resize', measure, { signal: events.signal });
  window.addEventListener('scroll', schedule, { passive: true, signal: events.signal });
  window.addEventListener('wheel', clearRequested, { passive: true, signal: events.signal });
  window.addEventListener('touchstart', clearRequested, { passive: true, signal: events.signal });
  window.addEventListener('pointerdown', clearRequested, { passive: true, signal: events.signal });
  select(0);
  schedule();

  return {
    element,
    move(direction) {
      // Synchronize the cached selection before resolving a keyboard command.
      // This covers a key press between a scroll and the next animation frame.
      if (frame) cancelAnimationFrame(frame);
      update();
      const targetIndex = (requested >= 0 ? requested : selected) + direction;
      const target = indexLinks[targetIndex];
      if (!target) return false;
      // Update immediately so rapid repeated keys advance before smooth scrolling settles.
      rememberRequested(targetIndex);
      select(targetIndex);
      target.click();
      return true;
    },
    dispose() {
      events.abort();
      resize.disconnect();
      cancelAnimationFrame(frame);
      clearRequested();
    },
  };
}
