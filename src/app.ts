import type { DemoRegistry, MountedView, Topic } from './content.ts';
import { el, icon } from './components/dom.ts';
import { createReadingTools } from './components/reading-tools.ts';
import { createThemeToggle } from './components/theme-toggle.ts';
import { createAmbient } from './components/ambient.ts';
import { loadLocale } from './i18n.ts';
import { renderTitle } from './views/title.ts';
import { renderTopic } from './views/topic.ts';
import brandMark from '../assets/favicon.svg';

type Route = { href: string; section: string | null } & (
  { view: 'home' | 'missing' } | { view: 'topic'; topic: Topic }
);

let activeTransition: ViewTransition | null = null;

const locale = await loadLocale(new URL(window.location.href).searchParams.get('lang'));
document.documentElement.lang = locale.code;
const host = document.getElementById('site');
if (!host) throw new Error('Missing site root');
const ambient = createAmbient();

const skip = el('a', 'skip-link', locale.nav.skip);
skip.href = '#main-content';
const header = el('header', 'site-header page-width');
const brand = el('a', 'brand');
brand.href = '#/';
brand.setAttribute('aria-label', locale.siteName);
const mark = el('img', 'brand-mark');
mark.src = brandMark;
mark.alt = '';
mark.width = 28;
mark.height = 28;
brand.append(mark, el('span', 'brand-name', locale.siteName));
const navigation = el('nav', 'header-nav');
navigation.setAttribute('aria-label', locale.nav.contents);
const contentsLink = el('a', 'nav-link', locale.nav.contents);
contentsLink.href = '#/?section=contents';
const language = el('span', 'locale-tag', locale.code.toUpperCase());
language.setAttribute('aria-label', locale.nav.language);
language.title = locale.nav.language;
navigation.append(contentsLink, createThemeToggle(locale.theme), language);
const readingTools = createReadingTools(locale.reading, () => activeTransition?.skipTransition());
header.append(brand, navigation, readingTools.element);

const main = el('main', 'site-main');
main.id = 'main-content';
main.tabIndex = -1;
const footer = el('footer', 'site-footer page-width');
footer.append(el('span', 'footer-label', locale.footer.label));
host.append(ambient.element, skip, header, readingTools.status, main, footer);
skip.addEventListener('click', (event) => {
  event.preventDefault();
  main.focus();
});

const demos: DemoRegistry = {};
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const scrollPositions = new Map<string, number>();
const contentsPositions = new Map<string, number>();
const expandedGroups = new Set<string>();
if (locale.topicGroups[0]) expandedGroups.add(locale.topicGroups[0].id);
let currentRoute: Route | null = null;
let mounted: MountedView | null = null;
let generation = 0;
let lastLocation = window.location.href;
history.scrollRestoration = 'manual';

function routeFromHash(hash: string): Route {
  const href = !hash || hash === '#' ? '#/' : hash;
  const [path, query] = href.slice(1).split('?');
  const section = new URLSearchParams(query).get('section');
  const topic = locale.topics.find((entry) => path === `/topic/${encodeURIComponent(entry.id)}`);
  return topic ? { view: 'topic', topic, href, section }
    : { view: path === '/' ? 'home' : 'missing', href, section };
}

function renderMissing(): MountedView {
  const page = el('section', 'not-found page-width');
  const heading = el('h1', '', locale.notFound.title);
  heading.tabIndex = -1;
  const back = el('a', 'button', locale.notFound.back);
  back.href = '#/';
  back.prepend(icon('left'));
  page.append(heading, el('p', '', locale.notFound.description), back);
  return { element: page };
}

function topicTitle(id: string): HTMLElement | null {
  return main.querySelector<HTMLElement>(`[data-topic-title="${CSS.escape(id)}"]`);
}

function setTransitionTopic(id?: string): void {
  for (const title of main.querySelectorAll<HTMLElement>('[data-topic-title]')) {
    title.style.viewTransitionName = title.dataset.topicTitle === id && id !== undefined
      ? CSS.escape(`topic-${id}`) : 'none';
  }
}

function revealTitle(title: HTMLElement): void {
  const bounds = title.getBoundingClientRect();
  const margin = Math.min(48, window.innerHeight * 0.1);
  if (bounds.top < margin || bounds.bottom > window.innerHeight - margin) {
    window.scrollTo({
      top: window.scrollY + bounds.top - Math.max(margin, (window.innerHeight - bounds.height) / 3),
      behavior: 'instant',
    });
  }
}

function reportNavigationError(error: unknown): void {
  console.error('Unable to display the requested page', error);
}

/**
 * Hash URLs work unchanged on GitHub Pages, including project subdirectories.
 * Same-page section changes preserve the mounted article and demonstration state.
 */
async function showRoute(
  route: Route,
  { restore = false, animate = true, focus = true } = {},
) {
  const request = ++generation;
  const previousTransition = activeTransition;
  if (previousTransition) {
    previousTransition.skipTransition();
    // The old overlay must be gone, not merely updated, before taking another snapshot.
    // Its own navigation invocation reports any document-update failure.
    await Promise.allSettled([previousTransition.finished]);
  }
  if (request !== generation) return;
  const leavingPresentation = route.view !== 'topic' && (readingTools.presenting || readingTools.changing);
  if (leavingPresentation) await readingTools.exitPresentation();
  if (request !== generation) return;

  const restoredY = restore ? scrollPositions.get(route.href) : undefined;
  if (currentRoute) scrollPositions.set(currentRoute.href, window.scrollY);
  const samePage = currentRoute?.href.split('?')[0] === route.href.split('?')[0];
  const returningTopicId = currentRoute?.view === 'topic' && route.view === 'home'
    && (route.section === 'contents' || (restore && !route.section))
    ? currentRoute.topic.id : undefined;
  const canAnimate = animate && !samePage && !leavingPresentation
    && !readingTools.presenting && !readingTools.changing && !reducedMotion.matches
    && typeof document.startViewTransition === 'function';
  let transitionTopicId = canAnimate ? returningTopicId
    ?? (currentRoute?.view === 'home' && route.view === 'topic' && !route.section ? route.topic.id : undefined)
    : undefined;

  if (transitionTopicId) {
    const title = topicTitle(transitionTopicId);
    // Settle an opening/closing disclosure before capturing a clicked or history-restored row.
    title?.closest('details.contents-group')?.dispatchEvent(new Event('contents-reveal'));
    if (title && title.getClientRects().length) revealTitle(title);
    else transitionTopicId = undefined;
  }
  if (currentRoute?.view === 'home' && route.view === 'topic') {
    contentsPositions.set(route.topic.id, window.scrollY);
  }
  setTransitionTopic(transitionTopicId);
  const commit = () => {
    if (request !== generation) return;
    ambient.setView(route.view === 'home' ? 'cover' : 'reading');
    if (!samePage || !mounted) {
      mounted?.dispose?.();
      mounted = route.view === 'home' ? renderTitle(locale, {
        enter: currentRoute === null, expandedGroups, revealTopicId: returningTopicId,
      })
        : route.view === 'topic' ? renderTopic(route.topic, locale.article, demos)
          : renderMissing();
      main.replaceChildren(mounted.element);
    }
    readingTools.setAvailable(route.view === 'topic');
    document.title = route.view === 'home' ? locale.title
      : `${route.view === 'topic' ? route.topic.title : locale.notFound.title} — ${locale.siteName}`;
    if (route.view === 'home') contentsLink.setAttribute('aria-current', 'page');
    else contentsLink.removeAttribute('aria-current');

    const section = route.section ? document.getElementById(route.section) : null;
    const target = section && main.contains(section) ? section : null;
    const heading = target?.matches('h1, h2, h3') ? target
      : target?.querySelector('h2, h3') ?? main.querySelector('h1');
    const returningTitle = returningTopicId ? topicTitle(returningTopicId) : null;
    if (returningTitle && returningTopicId) {
      const contentsY = restoredY ?? contentsPositions.get(returningTopicId);
      if (contentsY !== undefined) window.scrollTo({ top: contentsY, behavior: 'instant' });
      revealTitle(returningTitle);
    } else if (restoredY !== undefined) window.scrollTo({ top: restoredY, behavior: 'instant' });
    else if (target) target.scrollIntoView({
      block: 'start', behavior: samePage && animate && !reducedMotion.matches ? 'smooth' : 'instant',
    });
    else window.scrollTo({ top: 0, behavior: 'instant' });
    if (transitionTopicId && route.view === 'topic') {
      const title = topicTitle(transitionTopicId);
      if (title) revealTitle(title);
    }
    setTransitionTopic(transitionTopicId);
    const focusTarget = returningTitle?.closest('a') ?? heading;
    if (focus && focusTarget instanceof HTMLElement) focusTarget.focus({ preventScroll: true });
    currentRoute = route;
  };

  if (!canAnimate) {
    commit();
    return;
  }
  const transition = document.startViewTransition(commit);
  activeTransition = transition;
  void transition.ready.catch((error: unknown) => {
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      console.error('Page transition could not capture its endpoints', error);
    }
  });
  // finished reports update failures; observe this separate rejection as well.
  void transition.updateCallbackDone.catch(() => {});
  try {
    await transition.finished;
  } finally {
    if (activeTransition === transition) {
      activeTransition = null;
      setTransitionTopic();
    }
  }
}

// Keep links native for modified clicks, new tabs, copying URLs, and direct loading.
document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element ? event.target.closest('a') : null;
  if (!link || !link.getAttribute('href')?.startsWith('#/') || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
  event.preventDefault();
  const destination = new URL(link.href);
  const route = routeFromHash(destination.hash);
  if (route.href !== routeFromHash(window.location.hash).href) history.pushState(null, '', destination);
  lastLocation = window.location.href;
  void showRoute(route).catch(reportNavigationError);
});

function onLocationChange() {
  // Traversing a fragment history entry emits both popstate and hashchange.
  if (lastLocation === window.location.href) return;
  lastLocation = window.location.href;
  void showRoute(routeFromHash(window.location.hash), { restore: true }).catch(reportNavigationError);
}
window.addEventListener('popstate', onLocationChange);
window.addEventListener('hashchange', onLocationChange);
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) activeTransition?.skipTransition();
});
window.addEventListener('beforeprint', () => activeTransition?.skipTransition());

await showRoute(routeFromHash(window.location.hash), { animate: false, focus: false });
