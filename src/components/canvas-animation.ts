export interface CanvasFrame {
  width: number;
  height: number;
  rasterWidth: number;
  rasterHeight: number;
  time: number;
  theme: 'light' | 'dark';
}

/** Owns timing and raster limits; renderers own their geometry and drawing resources. */
export function animateCanvas(
  canvas: HTMLCanvasElement,
  draw: (frame: Readonly<CanvasFrame>) => void,
  { fps = 24, maxPixels = 800_000, maxDpr = 1.5 } = {},
): { invalidate(): void; dispose(): void } {
  const root = document.documentElement;
  const events = new AbortController();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const excluded = matchMedia('print, (forced-colors: active)');
  const interval = 1000 / fps;
  const state: CanvasFrame = {
    width: 0, height: 0, rasterWidth: 0, rasterHeight: 0, time: 0,
    theme: root.dataset.theme === 'dark' ? 'dark' : 'light',
  };
  let pixelRatio = devicePixelRatio || 1;
  let visible = false;
  let active = false;
  let dirty = true;
  let rasterDirty = true;
  let disposed = false;
  let pending = 0;
  let lastTick: number | null = null;
  let lastPaint = -Infinity;
  let clock = 0;

  function canPaint(): boolean {
    return !disposed && visible && !document.hidden && !excluded.matches && state.width > 0 && state.height > 0;
  }

  function schedule(): void {
    if (!pending && canPaint() && (dirty || active)) pending = requestAnimationFrame(paint);
  }

  function paint(timestamp: number): void {
    pending = 0;
    if (!canPaint()) return;
    if (active && lastTick !== null) clock += Math.min(timestamp - lastTick, 100) / 1000;
    lastTick = active ? timestamp : null;
    const elapsed = timestamp - lastPaint;
    if (dirty || elapsed >= interval) {
      if (rasterDirty) {
        const ratio = Math.min(pixelRatio, maxDpr, Math.sqrt(maxPixels / (state.width * state.height)));
        state.rasterWidth = Math.max(1, Math.floor(state.width * ratio));
        state.rasterHeight = Math.max(1, Math.floor(state.height * ratio));
        if (canvas.width !== state.rasterWidth) canvas.width = state.rasterWidth;
        if (canvas.height !== state.rasterHeight) canvas.height = state.rasterHeight;
        rasterDirty = false;
      }
      state.time = clock;
      lastPaint = dirty || !Number.isFinite(lastPaint) ? timestamp : timestamp - elapsed % interval;
      dirty = false;
      draw(state);
    }
    schedule();
  }

  function sync(): void {
    const nextTheme = root.dataset.theme === 'dark' ? 'dark' : 'light';
    if (nextTheme !== state.theme) {
      state.theme = nextTheme;
      dirty = true;
    }
    const nextActive = canPaint() && !reducedMotion.matches && !root.hasAttribute('data-presentation');
    if (nextActive !== active) {
      active = nextActive;
      // Resume from the last displayed phase, not time spent hidden or presenting.
      clock = state.time;
      lastTick = null;
      lastPaint = -Infinity;
    }
    if (!canPaint() || (!active && !dirty)) {
      cancelAnimationFrame(pending);
      pending = 0;
    }
    schedule();
  }

  function invalidate(): void {
    dirty = true;
    schedule();
  }

  const resize = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    if (width === state.width && height === state.height) return;
    state.width = width;
    state.height = height;
    rasterDirty = true;
    dirty = true;
    sync();
  });
  resize.observe(canvas);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  intersection.observe(canvas);
  const attributes = new MutationObserver(sync);
  attributes.observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-presentation'] });
  document.addEventListener('visibilitychange', sync, { signal: events.signal });
  reducedMotion.addEventListener('change', sync, { signal: events.signal });
  excluded.addEventListener('change', sync, { signal: events.signal });
  window.addEventListener('resize', () => {
    const next = devicePixelRatio || 1;
    if (next === pixelRatio) return;
    pixelRatio = next;
    rasterDirty = true;
    invalidate();
  }, { signal: events.signal });

  return {
    invalidate,
    dispose() {
      disposed = true;
      cancelAnimationFrame(pending);
      resize.disconnect();
      intersection.disconnect();
      attributes.disconnect();
      events.abort();
      canvas.width = 0;
      canvas.height = 0;
    },
  };
}
