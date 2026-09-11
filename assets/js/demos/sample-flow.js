import { el, icon } from '../components/dom.js';

/**
 * @param {import('../content.js').DemoLabels} labels
 * @returns {import('../content.js').MountedView}
 */
export function createSampleFlow(labels) {
  const element = el('section', 'sample-flow');
  element.setAttribute('aria-label', labels.title);

  const header = el('div', 'sample-flow__header');
  const introduction = el('div', 'sample-flow__introduction');
  introduction.append(
    el('h3', 'sample-flow__title', labels.title),
    el('p', 'sample-flow__description', labels.description),
  );

  const progress = el('div', 'sample-flow__progress');
  progress.setAttribute('role', 'progressbar');
  progress.setAttribute('aria-label', labels.step);
  progress.setAttribute('aria-valuemin', '0');
  progress.setAttribute('aria-valuemax', String(labels.stages.length));
  header.append(introduction, progress);

  const rail = el('ol', 'sample-flow__rail');
  rail.setAttribute('aria-label', labels.step);
  const stages = labels.stages.map((label, index) => {
    const item = el('li', 'sample-flow__stage');
    const marker = el('span', 'sample-flow__marker');
    marker.setAttribute('aria-hidden', 'true');
    const number = el('span', 'sample-flow__number', String(index + 1).padStart(2, '0'));
    const check = icon('check');
    check.classList.add('sample-flow__check');
    marker.append(number, check);
    const name = el('span', 'sample-flow__stage-name', label);
    const complete = el('span', 'sample-flow__stage-complete', labels.complete);
    item.append(marker, name, complete);
    rail.append(item);
    return { item, marker, complete };
  });

  const footer = el('div', 'sample-flow__footer');
  const status = el('p', 'sample-flow__status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');

  const controls = el('div', 'sample-flow__controls');
  const reset = el('button', 'button sample-flow__reset', labels.reset);
  reset.type = 'button';
  const next = el('button', 'button sample-flow__next');
  next.type = 'button';
  next.append(el('span', '', labels.next), icon('right'));
  controls.append(reset, next);
  footer.append(status, controls);
  element.append(header, rail, footer);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let completed = 0;
  /** @type {Animation | null} */
  let motion = null;

  function cancelMotion() {
    motion?.cancel();
    motion = null;
  }

  function renderState() {
    progress.textContent = `${completed} / ${stages.length}`;
    progress.setAttribute('aria-valuenow', String(completed));
    status.textContent = labels.states[completed];
    next.disabled = completed === stages.length;
    reset.disabled = completed === 0;
    stages.forEach(({ item, complete }, index) => {
      const done = index < completed;
      item.dataset.state = done ? 'complete' : index === completed ? 'current' : 'pending';
      complete.hidden = !done;
      if (index === completed) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
  }

  function advance() {
    if (completed === stages.length) return;
    cancelMotion();
    const stage = stages[completed];
    completed += 1;
    renderState();
    if (!reducedMotion.matches) {
      motion = stage.marker.animate(
        [
          { transform: 'translateY(5px) scale(0.94)', opacity: 0.45 },
          { transform: 'translateY(0) scale(1)', opacity: 1 },
        ],
        { duration: 180, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
      );
    }
  }

  function restart() {
    cancelMotion();
    completed = 0;
    renderState();
  }

  function motionPreferenceChanged() {
    if (reducedMotion.matches) cancelMotion();
  }

  next.addEventListener('click', advance);
  reset.addEventListener('click', restart);
  reducedMotion.addEventListener('change', motionPreferenceChanged);
  renderState();

  return {
    element,
    dispose() {
      cancelMotion();
      next.removeEventListener('click', advance);
      reset.removeEventListener('click', restart);
      reducedMotion.removeEventListener('change', motionPreferenceChanged);
    },
  };
}
