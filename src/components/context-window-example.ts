import type { ContextWindowBlock, MountedView } from '../content.ts';
import { el } from './dom.ts';

export function createContextWindowExample(data: ContextWindowBlock): MountedView {
  const { labels } = data;
  const numberFormat = new Intl.NumberFormat(document.documentElement.lang || undefined);
  const count = (value: number) => `${numberFormat.format(value)} ${labels.tokens}`;
  const usage = (value: number, limit: number) =>
    `${labels.used} ${numberFormat.format(value)} / ${count(limit)}`;
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
  const playLabels = [labels.play, labels.pause, labels.replay, labels.step].map((text) => {
    const span = el('span', 'context-play-label', text);
    span.setAttribute('aria-hidden', 'true');
    play.append(span);
    return span;
  });
  const scrubLabel = el('label', 'context-progress-label');
  const progressValue = el('span', 'context-progress-value');
  progressValue.setAttribute('aria-hidden', 'true');
  const progressHeading = el('span', 'context-progress-heading');
  progressHeading.append(document.createTextNode(labels.progress), progressValue);
  const scrubber = el('input', 'context-progress');
  scrubber.type = 'range';
  scrubber.min = '0';
  scrubber.step = '1';
  scrubber.setAttribute('aria-label', labels.progress);
  scrubLabel.append(progressHeading, scrubber);
  const phase = el('p', 'context-phase');
  const phaseLabels = [labels.phaseInput, labels.phaseReasoning, labels.phaseAnswer, labels.phaseComplete];
  const phaseSpans = phaseLabels.map((text) => {
    const span = el('span', 'context-phase-label', text);
    phase.append(span);
    return span;
  });
  const status = el('p', 'sr-only');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  playback.append(play, scrubLabel, phase);

  function scale(limit: number): HTMLElement {
    const ticks = el('div', 'context-scale');
    ticks.setAttribute('aria-hidden', 'true');
    for (const amount of [0, limit / 2, limit]) ticks.append(el('span', '', numberFormat.format(amount)));
    return ticks;
  }

  const context = el('div', 'context-window-diagram');
  const contextHeading = el('div', 'context-budget-heading');
  const contextUsage = el('strong', 'context-budget-usage');
  const contextUsageReserve = el('span', 'context-usage-reserve', usage(data.capacity, data.capacity));
  contextUsageReserve.setAttribute('aria-hidden', 'true');
  const contextUsageValue = el('span', 'context-usage-value');
  contextUsage.append(contextUsageReserve, contextUsageValue);
  contextHeading.append(el('h4', '', labels.context), contextUsage);
  const contextBar = el('div', 'context-window-bar');
  contextBar.setAttribute('aria-hidden', 'true');
  const legend = el('dl', 'context-role-labels');
  const roles = [
    { key: 'input', label: labels.input, detail: labels.inputDetail },
    { key: 'reasoning', label: labels.reasoning, detail: labels.reasoningDetail },
    { key: 'output', label: labels.output, detail: labels.outputDetail },
    { key: 'remaining', label: labels.remaining, detail: labels.remainingDetail },
  ] as const;
  const segments = roles.map(({ key, label, detail }) => {
    const segment = el('span', `context-segment context-${key}`);
    contextBar.append(segment);
    const item = el('div', `context-role context-${key}`);
    const term = el('dt', 'context-role-name');
    const swatch = el('span', 'context-role-swatch');
    swatch.setAttribute('aria-hidden', 'true');
    term.append(swatch, document.createTextNode(label));
    const value = el('dd', 'context-role-count');
    item.append(term, value, el('dd', 'context-role-detail', detail));
    legend.append(item);
    return { key, segment, value };
  });
  context.append(contextHeading, contextBar, scale(data.capacity), legend);

  const generation = el('div', 'context-generation');
  const generationHeading = el('div', 'context-budget-heading');
  const generationUsage = el('strong', 'context-equation-total');
  generationHeading.append(el('h4', '', labels.outputBudget));
  const constraints = el('dl', 'context-output-constraints');
  const contextRemainder = el('dd', 'context-limit-value');
  const outputLimit = el('dd', 'context-limit-value', count(data.outputLimit));
  const effectiveOutput = el('dd', 'context-limit-value');
  for (const [label, value, className] of [
    [labels.contextRemaining, contextRemainder, ''],
    [labels.outputLimit, outputLimit, ''],
    [labels.effectiveOutput, effectiveOutput, ' context-effective-limit'],
  ] as const) {
    const item = el('div', `context-output-limit${className}`);
    item.append(el('dt', '', label), value);
    constraints.append(item);
  }

  const generationBar = el('div', 'context-generation-bar');
  generationBar.setAttribute('aria-hidden', 'true');
  const generationSegments = ['reasoning', 'output', 'free', 'blocked'].map((key) => {
    const segment = el('span', `context-segment context-${key}`);
    generationBar.append(segment);
    return segment;
  });
  const equation = el('div', 'context-generation-equation');
  const reasoningValue = el('strong', 'context-equation-value');
  const outputValue = el('strong', 'context-equation-value');
  const reasoningTerm = el('span', 'context-equation-term context-reasoning');
  const outputTerm = el('span', 'context-equation-term context-output');
  reasoningTerm.append(el('span', '', labels.reasoning), reasoningValue);
  outputTerm.append(el('span', '', labels.output), outputValue);
  equation.append(reasoningTerm, el('span', 'context-equation-operator', '+'), outputTerm, generationUsage);
  const unused = el('dl', 'context-unused');
  const unusedValues = [
    { key: 'free', label: labels.outputFree, detail: '' },
    { key: 'blocked', label: labels.outputBlocked, detail: labels.outputBlockedDetail },
  ].map(({ key, label, detail }) => {
    const item = el('div', `context-role context-${key}`);
    const term = el('dt', 'context-role-name');
    const swatch = el('span', 'context-role-swatch');
    swatch.setAttribute('aria-hidden', 'true');
    term.append(swatch, document.createTextNode(label));
    const value = el('dd', 'context-role-count');
    item.append(term, value);
    if (detail) item.append(el('dd', 'context-role-detail', detail));
    unused.append(item);
    return value;
  });
  generation.append(
    generationHeading,
    el('p', 'context-generation-detail', labels.outputBudgetDetail),
    constraints,
    generationBar,
    scale(data.outputLimit),
    equation,
    unused,
  );
  element.append(controls, summary, playback, status, context, generation,
    el('figcaption', 'learning-figure-caption', data.caption));

  let selected = 0;
  let position = 0;
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

  function total(): number {
    const scenario = data.scenarios[selected];
    return scenario.input + scenario.reasoning + scenario.output;
  }

  function updatePlay(): void {
    const index = position >= total() ? 2 : playing ? 1 : reducedMotion.matches ? 3 : 0;
    if (index === currentPlay) return;
    currentPlay = index;
    play.setAttribute('aria-label', playLabels[index].textContent!);
    playLabels.forEach((span, labelIndex) => span.classList.toggle('is-active', labelIndex === index));
  }

  function announce(text = phaseLabels[currentPhase]): void {
    status.textContent = `${data.scenarios[selected].label} · ${text}`;
  }

  function render(announcePhase = false): void {
    const scenario = data.scenarios[selected];
    const shown = printing ? total() : Math.floor(position);
    const input = Math.min(shown, scenario.input);
    const reasoning = Math.min(Math.max(0, shown - input), scenario.reasoning);
    const output = Math.max(0, shown - input - reasoning);
    const generated = reasoning + output;
    const remaining = data.capacity - shown;
    const remainingContext = data.capacity - input;
    const allowance = Math.min(remainingContext, data.outputLimit);
    const free = allowance - generated;
    const blocked = data.outputLimit - allowance;
    const amounts = { input, reasoning, output, remaining };
    contextUsageValue.textContent = usage(shown, data.capacity);
    for (const { key, segment, value } of segments) {
      segment.style.width = `${(amounts[key] / data.capacity) * 100}%`;
      segment.hidden = amounts[key] === 0;
      value.textContent = count(amounts[key]);
    }
    const outputAmounts = [reasoning, output, free, blocked];
    generationSegments.forEach((segment, index) => {
      segment.style.width = `${(outputAmounts[index] / data.outputLimit) * 100}%`;
      segment.hidden = outputAmounts[index] === 0;
    });
    contextRemainder.textContent = count(remainingContext);
    effectiveOutput.textContent = count(allowance);
    reasoningValue.textContent = count(reasoning);
    outputValue.textContent = count(output);
    generationUsage.textContent = `= ${usage(generated, data.outputLimit)}`;
    unusedValues[0].textContent = count(free);
    unusedValues[1].textContent = count(blocked);
    const nextPhase = shown >= total() ? 3 : shown < scenario.input ? 0
      : shown < scenario.input + scenario.reasoning ? 1 : 2;
    if (nextPhase !== currentPhase) {
      currentPhase = nextPhase;
      phaseSpans.forEach((span, index) => {
        span.classList.toggle('is-active', index === currentPhase);
        span.setAttribute('aria-hidden', String(index !== currentPhase));
      });
      if (announcePhase && !printing) announce();
    }
    scrubber.value = String(shown);
    scrubber.setAttribute('aria-valuetext', `${phaseLabels[currentPhase]} · ${count(shown)} / ${count(total())}`);
    progressValue.textContent = `${numberFormat.format(Math.round(shown / total() * 100))}%`;
    updatePlay();
  }

  function cancelFrame(): void {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTick = null;
    lastPaint = -Infinity;
  }

  function pause(): void {
    if (playing) position = scrubber.valueAsNumber;
    playing = false;
    cancelFrame();
    updatePlay();
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
    if (lastTick !== null) position = Math.min(total(), position + Math.min(timestamp - lastTick, 100) * total() / 9000);
    lastTick = timestamp;
    if (timestamp - lastPaint >= 1000 / 30 || position >= total()) {
      lastPaint = timestamp;
      if (position >= total()) playing = false;
      render(true);
    }
    if (playing) frame = requestAnimationFrame(tick);
  }

  function selectScenario(index: number): void {
    pause();
    selected = index;
    position = 0;
    scenarios.forEach(({ button, panel }, scenarioIndex) => {
      const active = scenarioIndex === selected;
      button.setAttribute('aria-pressed', String(active));
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-hidden', String(!active));
    });
    scrubber.max = String(total());
    render();
    announce();
  }

  play.addEventListener('click', () => {
    if (playing) {
      pause();
      announce(labels.pause);
      return;
    }
    if (position >= total()) position = 0;
    if (reducedMotion.matches) {
      const scenario = data.scenarios[selected];
      position = position < scenario.input ? scenario.input
        : position < scenario.input + scenario.reasoning ? scenario.input + scenario.reasoning : total();
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
  scrubber.addEventListener('focus', pause, { signal: events.signal });
  scrubber.addEventListener('input', () => {
    pause();
    position = scrubber.valueAsNumber;
    render();
  }, { signal: events.signal });
  scrubber.addEventListener('change', () => announce(), { signal: events.signal });

  function syncVisibility(): void {
    if (!printing && !canAnimate()) pause();
  }
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncVisibility();
  });
  intersection.observe(element);
  document.addEventListener('visibilitychange', syncVisibility, { signal: events.signal });
  reducedMotion.addEventListener('change', () => {
    pause();
    render();
  }, { signal: events.signal });

  function beginPrint(): void {
    if (printing) return;
    resumeAfterPrint = playing;
    pause();
    printing = true;
    render();
  }
  function endPrint(): void {
    if (!printing) return;
    printing = false;
    render();
    if (resumeAfterPrint && canAnimate()) {
      playing = true;
      updatePlay();
      frame = requestAnimationFrame(tick);
    }
    resumeAfterPrint = false;
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
