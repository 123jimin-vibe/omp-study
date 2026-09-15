export interface TitleInteractionState {
  pointerX: number;
  pointerY: number;
  flowX: number;
  flowY: number;
  pulseX: number;
  pulseY: number;
  pulse: number;
  hover: number;
}

/** Canvas-relative coordinates and CSS-pixel flow, advanced by the renderer's seconds clock. */
export function createTitleInteraction(
  heading: HTMLElement, stage: HTMLElement, canvas: HTMLCanvasElement, invalidate: () => void,
): { update(time: number): Readonly<TitleInteractionState>; dispose(): void } {
  const events = new AbortController();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const state: TitleInteractionState = {
    pointerX: 0.5, pointerY: 0.5, flowX: 0, flowY: 0,
    pulseX: 0.5, pulseY: 0.5, pulse: 0, hover: 0,
  };
  let disposed = false;
  let previousTime: number | null = null;
  let tracking = false;
  let previousX = 0, previousY = 0;
  let pointerX = 0.5, pointerY = 0.5, hover = 0;
  let flowX = 0, flowY = 0;
  let pulseX = 0.5, pulseY = 0.5;
  let pressureVelocity = 0, hold = 0;

  function trackPointer(event: PointerEvent): void {
    if (event.pointerType === 'touch' || reducedMotion.matches || disposed) return;
    const bounds = canvas.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    pointerX = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    pointerY = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    if (tracking) {
      flowX += (event.clientX - previousX) * 0.28;
      flowY += (event.clientY - previousY) * 0.28;
      const scale = Math.min(1, 8 / Math.max(8, Math.hypot(flowX, flowY)));
      flowX *= scale;
      flowY *= scale;
    }
    // The first sample establishes a baseline, never a movement from the old entry.
    previousX = event.clientX;
    previousY = event.clientY;
    tracking = true;
    hover = 1;
    invalidate();
  }

  function leavePointer(): void {
    tracking = false;
    hover = 0;
    flowX = flowY = 0;
    invalidate();
  }

  function activate(event?: MouseEvent): void {
    if (reducedMotion.matches || disposed || event?.defaultPrevented) return;
    const bounds = canvas.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    if (event && event.detail > 0) {
      pulseX = (event.clientX - bounds.left) / bounds.width;
      pulseY = (event.clientY - bounds.top) / bounds.height;
    } else {
      const title = heading.getBoundingClientRect();
      pulseX = (title.left + title.width / 2 - bounds.left) / bounds.width;
      pulseY = (title.top + title.height / 2 - bounds.top) / bounds.height;
    }
    pulseX = Math.max(0, Math.min(1, pulseX));
    pulseY = Math.max(0, Math.min(1, pulseY));
    if (state.pulse === 0) {
      state.pulseX = pulseX;
      state.pulseY = pulseY;
    }
    // Extend the bounded forcing, preserving the existing pressure and velocity.
    hold = Math.max(hold, 1.2);
    invalidate();
  }

  function stepPressure(target: number, dt: number): void {
    // Exact critically damped spring: zero initial velocity, no overshoot or phase reset.
    const offset = state.pulse - target;
    const transient = pressureVelocity + 3 * offset;
    const decay = Math.exp(-3 * dt);
    state.pulse = Math.max(0, Math.min(1, target + (offset + transient * dt) * decay));
    pressureVelocity = (pressureVelocity - 3 * transient * dt) * decay;
  }

  function update(time: number): Readonly<TitleInteractionState> {
    if (disposed) return state;
    const dt = previousTime === null ? 0 : Math.max(0, Math.min(0.1, time - previousTime));
    previousTime = time;
    if (reducedMotion.matches || dt === 0) return state;
    const pointerEase = 1 - Math.exp(-8 * dt);
    state.pointerX += (pointerX - state.pointerX) * pointerEase;
    state.pointerY += (pointerY - state.pointerY) * pointerEase;
    const flowDecay = Math.exp(-5 * dt);
    const flowEase = Math.exp(-10 * dt);
    // Smooth the exponentially decaying motion exactly; the vector stays within 8px.
    state.flowX = state.flowX * flowEase + flowX * 2 * (flowDecay - flowEase);
    state.flowY = state.flowY * flowEase + flowY * 2 * (flowDecay - flowEase);
    flowX *= flowDecay;
    flowY *= flowDecay;
    state.hover += (hover - state.hover) * (1 - flowDecay);
    const centerEase = 1 - Math.exp(-3.2 * dt);
    state.pulseX += (pulseX - state.pulseX) * centerEase;
    state.pulseY += (pulseY - state.pulseY) * centerEase;
    const rise = Math.min(hold, dt);
    if (rise > 0) stepPressure(1, rise);
    hold -= rise;
    if (dt > rise) stepPressure(0, dt - rise);
    return state;
  }

  stage.addEventListener('pointerenter', trackPointer, { signal: events.signal, passive: true });
  stage.addEventListener('pointermove', trackPointer, { signal: events.signal, passive: true });
  stage.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'touch') leavePointer();
  }, { signal: events.signal });
  stage.addEventListener('pointercancel', (event) => {
    if (event.pointerType !== 'touch') leavePointer();
  }, { signal: events.signal });
  stage.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') leavePointer();
  }, { signal: events.signal, passive: true });
  window.addEventListener('blur', leavePointer, { signal: events.signal });
  heading.addEventListener('click', activate, { signal: events.signal });
  heading.addEventListener('keydown', (event) => {
    if (event.target !== heading || heading.ownerDocument.activeElement !== heading
      || event.defaultPrevented || event.isComposing || reducedMotion.matches
      || (event.key !== 'Enter' && event.key !== ' ')) return;
    if (event.key === ' ') event.preventDefault();
    if (!event.repeat) activate();
  }, { signal: events.signal });
  reducedMotion.addEventListener('change', () => {
    tracking = false;
    hover = state.hover = 0;
    flowX = flowY = state.flowX = state.flowY = 0;
    hold = pressureVelocity = state.pulse = 0;
    invalidate();
  }, { signal: events.signal });

  return {
    update,
    dispose() {
      if (disposed) return;
      disposed = true;
      events.abort();
    },
  };
}
