import type { ContextWindowBlock, MountedView } from '../content.ts';
import { el } from './dom.ts';

export function createContextWindowExample(data: ContextWindowBlock): MountedView {
  const { labels } = data;
  const numberFormat = new Intl.NumberFormat(document.documentElement.lang || undefined);
  const count = (value: number) => `${numberFormat.format(value)} ${labels.tokens}`;
  const capacityCount = count(data.capacity);
  const reasoningEnd = 1100;
  const duration = 2200;
  const events = new AbortController();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const printMedia = matchMedia('print');
  const element = el('figure', 'learning-figure context-window-example');
  element.setAttribute('aria-label', data.title);
  element.append(el('h3', 'learning-figure-heading', data.title));

  const controls = el('div', 'context-scenarios');
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', labels.scenario);
  const summary = el('div', 'context-scenario-summary');
  const scenarios = data.scenarios.map((scenario, index) => {
    const button = el('button', 'context-scenario-button', scenario.label);
    button.type = 'button';
    button.addEventListener('click', () => selectScenario(index), { signal: events.signal });
    controls.append(button);
    const panel = el('div', 'context-scenario-panel');
    panel.append(
      el('p', 'context-selected-scenario', `${labels.scenario} · ${scenario.label}`),
      el('p', 'context-scenario-explanation', scenario.description),
    );
    summary.append(panel);
    return { button, panel };
  });

  const playback = el('div', 'context-playback');
  const play = el('button', 'context-play-button');
  play.type = 'button';
  const playLabels = [labels.play, labels.pause, labels.replay, labels.step];
  const playSpans = playLabels.map((text) => {
    const span = el('span', 'context-play-label', text);
    span.setAttribute('aria-hidden', 'true');
    play.append(span);
    return span;
  });
  const phase = el('p', 'context-phase');
  const phaseLabels = [labels.phaseReasoning, labels.phaseAnswer, labels.phaseComplete];
  const phaseSpans = phaseLabels.map((text) => {
    const span = el('span', 'context-phase-label', text);
    phase.append(span);
    return span;
  });
  const status = el('p', 'sr-only');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  playback.append(play, phase);

  const context = el('div', 'context-window-diagram');
  const heading = el('div', 'context-heading');
  const contextUsage = el('strong', 'context-usage');
  const usageReserve = el('span', 'context-usage-reserve',
    `${labels.used} ${numberFormat.format(data.capacity)} / ${capacityCount}`);
  usageReserve.setAttribute('aria-hidden', 'true');
  const usageValue = el('span', 'context-usage-value');
  contextUsage.append(usageReserve, usageValue);
  heading.append(el('h4', '', labels.context), contextUsage);
  const rangeLabels = el('div', 'context-range-labels');
  const generationValue = el('strong');
  for (const [label, value] of [
    [labels.outputLimit, el('strong', '', count(data.outputLimit))],
    [labels.generationRange, generationValue],
  ] as const) {
    const item = el('span', 'context-range-label');
    item.append(document.createTextNode(label), value);
    rangeLabels.append(item);
  }
  const graphic = el('div', 'context-window-graphic');
  graphic.setAttribute('aria-hidden', 'true');
  const markings = el('div', 'context-window-markings');
  const generationRange = el('span', 'context-generation-range');
  markings.append(generationRange);
  const bar = el('div', 'context-window-bar');
  const legend = el('dl', 'context-role-labels');
  const segments = [
    { key: 'input', label: labels.input, detail: labels.inputDetail },
    { key: 'reasoning', label: labels.reasoning, detail: labels.reasoningDetail },
    { key: 'output', label: labels.output, detail: labels.outputDetail },
    { key: 'remaining', label: labels.remaining, detail: labels.remainingDetail },
  ].map(({ key, label, detail }) => {
    const segment = el('span', `context-segment context-${key}`);
    bar.append(segment);
    const item = el('div', `context-role context-${key}`);
    const term = el('dt', 'context-role-name');
    const swatch = el('span', 'context-role-swatch');
    swatch.setAttribute('aria-hidden', 'true');
    term.append(swatch, document.createTextNode(label));
    const value = el('dd', 'context-role-count');
    item.append(term, value, el('dd', 'context-role-detail', detail));
    legend.append(item);
    return { segment, value };
  });
  const unavailableRegion = el('span', 'context-unavailable-region');
  bar.append(unavailableRegion);
  graphic.append(markings, bar);
  const scale = el('div', 'context-scale');
  scale.setAttribute('aria-hidden', 'true');
  for (const amount of [0, data.capacity / 2, data.capacity]) {
    scale.append(el('span', '', numberFormat.format(amount)));
  }
  const unavailableNote = el('p', 'context-unavailable-note');
  const unavailableSwatch = el('span', 'context-unavailable-swatch');
  unavailableSwatch.setAttribute('aria-hidden', 'true');
  unavailableNote.append(unavailableSwatch, document.createTextNode(labels.unavailable));
  context.append(heading, rangeLabels, graphic, scale, unavailableNote, legend);
  element.append(controls, summary, playback, status, context,
    el('figcaption', 'learning-figure-caption', data.caption));

  let selected = 0;
  let elapsed = 0;
  let playing = false;
  let visible = false;
  let disposed = false;
  let printing = false;
  let resumeAfterPrint = false;
  let frame = 0;
  let lastTick: number | null = null;
  let lastPaint = -Infinity;
  let currentPhase = -1;
  let currentPlay = -1;

  function announce(text = phaseLabels[currentPhase]): void {
    status.textContent = `${data.scenarios[selected].label} · ${text}`;
  }
  function paintSegment(index: number, amount: number): void {
    const { segment, value } = segments[index];
    segment.style.width = `${amount / data.capacity * 100}%`;
    segment.hidden = amount === 0;
    value.textContent = count(amount);
  }
  function fill(amount: number, start: number, end: number, time: number): number {
    return Math.floor(amount * Math.max(0, Math.min(1, (time - start) / (end - start))));
  }
  function render(announcePhase = false): void {
    const scenario = data.scenarios[selected];
    const time = printing ? duration : elapsed;
    const input = scenario.input;
    const reasoning = fill(scenario.reasoning, 0, reasoningEnd, time);
    const output = fill(scenario.output, reasoningEnd, duration, time);
    const used = input + reasoning + output;
    usageValue.textContent = `${labels.used} ${numberFormat.format(used)} / ${capacityCount}`;
    paintSegment(1, reasoning);
    paintSegment(2, output);
    paintSegment(3, data.capacity - used);
    const nextPhase = time >= duration ? 2 : time < reasoningEnd ? 0 : 1;
    if (nextPhase !== currentPhase) {
      currentPhase = nextPhase;
      phaseSpans.forEach((span, index) => {
        span.classList.toggle('is-active', index === currentPhase);
        span.setAttribute('aria-hidden', String(index !== currentPhase));
      });
      if (announcePhase && !printing) announce();
    }
    const action = elapsed >= duration ? 2 : playing ? 1 : reducedMotion.matches ? 3 : 0;
    if (action !== currentPlay) {
      currentPlay = action;
      play.setAttribute('aria-label', playLabels[action]);
      playSpans.forEach((span, index) => span.classList.toggle('is-active', index === action));
    }
  }
  function cancelFrame(): void {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTick = null;
    lastPaint = -Infinity;
  }
  function pause(): void {
    playing = false;
    cancelFrame();
    render();
  }
  function canAnimate(): boolean {
    return !disposed && !printing && visible && element.isConnected && !document.hidden && !reducedMotion.matches;
  }
  function tick(timestamp: number): void {
    frame = 0;
    if (!playing || !canAnimate()) {
      pause();
      return;
    }
    if (lastTick !== null) elapsed = Math.min(duration, elapsed + Math.min(timestamp - lastTick, 100));
    lastTick = timestamp;
    if (timestamp - lastPaint >= 1000 / 30 || elapsed >= duration) {
      lastPaint = timestamp;
      if (elapsed >= duration) playing = false;
      render(true);
    }
    if (playing) frame = requestAnimationFrame(tick);
  }
  function selectScenario(index: number): void {
    playing = false;
    cancelFrame();
    selected = index;
    elapsed = 0;
    scenarios.forEach(({ button, panel }, scenarioIndex) => {
      const active = scenarioIndex === selected;
      button.setAttribute('aria-pressed', String(active));
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-hidden', String(!active));
    });
    const input = data.scenarios[selected].input;
    paintSegment(0, input);
    const allowance = Math.min(data.capacity - input, data.outputLimit);
    const unavailable = data.capacity - input - allowance;
    generationRange.style.left = `${input / data.capacity * 100}%`;
    generationRange.style.width = `${allowance / data.capacity * 100}%`;
    generationValue.textContent = count(allowance);
    unavailableRegion.style.width = `${unavailable / data.capacity * 100}%`;
    unavailableRegion.hidden = unavailable === 0;
    unavailableNote.classList.toggle('is-active', unavailable > 0);
    unavailableNote.setAttribute('aria-hidden', String(unavailable === 0));
    render();
    announce();
  }

  play.addEventListener('click', () => {
    if (playing) {
      pause();
      announce(labels.pause);
      return;
    }
    if (elapsed >= duration) elapsed = 0;
    if (reducedMotion.matches) {
      elapsed = elapsed < reasoningEnd ? reasoningEnd : duration;
      render();
      announce();
    } else if (canAnimate()) {
      playing = true;
      lastTick = null;
      render();
      announce(labels.play);
      frame = requestAnimationFrame(tick);
    }
  }, { signal: events.signal });
  function syncVisibility(): void {
    if (!printing && !canAnimate()) pause();
  }
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncVisibility();
  });
  intersection.observe(element);
  document.addEventListener('visibilitychange', syncVisibility, { signal: events.signal });
  reducedMotion.addEventListener('change', pause, { signal: events.signal });

  function beginPrint(): void {
    if (printing) return;
    resumeAfterPrint = playing;
    playing = false;
    cancelFrame();
    printing = true;
    render();
  }
  function endPrint(): void {
    if (!printing) return;
    printing = false;
    playing = resumeAfterPrint && canAnimate();
    resumeAfterPrint = false;
    render();
    if (playing) frame = requestAnimationFrame(tick);
  }
  window.addEventListener('beforeprint', beginPrint, { signal: events.signal });
  window.addEventListener('afterprint', endPrint, { signal: events.signal });
  printMedia.addEventListener('change', () => {
    if (printMedia.matches) beginPrint();
    else endPrint();
  }, { signal: events.signal });

  selectScenario(0);
  if (printMedia.matches) beginPrint();
  return {
    element,
    dispose() {
      disposed = true;
      cancelFrame();
      intersection.disconnect();
      events.abort();
    },
  };
}
