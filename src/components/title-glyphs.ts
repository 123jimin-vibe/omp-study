import type { CanvasFrame } from './canvas-animation.ts';

// Home.xy, stable seeds.xy, glyph coverage, character reveal time.
export const TITLE_PARTICLE_STRIDE = 6;
const CHARACTER_INTERVAL_SECONDS = 0.15;
export const TITLE_REVEAL_SECONDS = CHARACTER_INTERVAL_SECONDS * 0.8;

export interface GlyphUpload {
  x: number;
  y: number;
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
}

export interface TitleGlyphScene {
  particles: Float32Array;
  grain: number;
  timeOffset: number;
  update(time: number, upload: (change: Readonly<GlyphUpload>) => void): void;
}

function seed(value: number): number {
  let n = Math.imul(value ^ 0x9e3779b9, 0x85ebca6b);
  n = Math.imul(n ^ (n >>> 13), 0xc2b2ae35);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

/** Character-sized masks reveal immutable particles without rebuilding their geometry. */
export function createTitleGlyphs(
  heading: HTMLElement, canvas: HTMLCanvasElement, frame: Readonly<CanvasFrame>, animate = true,
): TitleGlyphScene | null {
  const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!context) return null;
  const ratio = frame.rasterWidth / frame.width;
  const origin = canvas.getBoundingClientRect();
  const style = getComputedStyle(heading);
  const size = parseFloat(style.fontSize);
  const grain = Math.max(0.85, Math.min(2.0, size / 65));
  const spacing = grain * ratio;
  const font = `${style.fontWeight} ${size * ratio}px ${style.fontFamily}`;
  const tracking = `${parseFloat(style.letterSpacing) * ratio || 0}px`;
  const configure = (): void => {
    context.font = font;
    context.letterSpacing = tracking;
    context.textBaseline = 'alphabetic';
  };
  configure();
  const metrics = context.measureText('한Mg');
  const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
  const glyphs: (GlyphUpload & { at: number })[] = [];
  const samples: number[][] = [];
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  let at = CHARACTER_INTERVAL_SECONDS * 1.5;
  let count = 0;

  for (const line of heading.querySelectorAll<HTMLElement>('.hero-title-line')) {
    const rect = line.getBoundingClientRect();
    const top = Math.round((rect.top - origin.top) * ratio);
    const height = Math.max(1, Math.ceil(rect.height * ratio));
    let prefix = '';
    for (const { segment } of segmenter.segment(line.textContent ?? '')) {
      configure();
      const left = context.measureText(prefix).width;
      prefix += segment;
      const right = context.measureText(prefix).width;
      const reveal = at;
      at += CHARACTER_INTERVAL_SECONDS;
      if (/^\s+$/u.test(segment)) continue;
      const x = Math.round((rect.left - origin.left) * ratio + left);
      const width = Math.max(1, Math.round(right) - Math.round(left));
      context.canvas.width = width;
      context.canvas.height = height;
      configure();
      context.fillText(segment, 0, (height - fontHeight) / 2 + metrics.fontBoundingBoxAscent);
      const pixels = context.getImageData(0, 0, width, height).data;
      const points: number[] = [];
      const coverage = (px: number, py: number): number => {
        const ix = Math.floor(px), iy = Math.floor(py);
        if (ix < 0 || iy < 0 || ix >= width - 1 || iy >= height - 1) return 0;
        const dx = px - ix, dy = py - iy, p = (iy * width + ix) * 4 + 3;
        return ((pixels[p] * (1 - dx) + pixels[p + 4] * dx) * (1 - dy)
          + (pixels[p + width * 4] * (1 - dx) + pixels[p + width * 4 + 4] * dx) * dy) / 255;
      };
      for (let py = spacing / 2; py < height; py += spacing) {
        for (let px = spacing / 2; px < width; px += spacing) {
          const r = spacing * 0.3;
          const alpha = (coverage(px, py) * 2 + coverage(px - r, py) + coverage(px + r, py)
            + coverage(px, py - r) + coverage(px, py + r)) / 6;
          if (alpha > 0) points.push((x + px + 0.5) / frame.rasterWidth,
            (top + py + 0.5) / frame.rasterHeight, alpha);
        }
      }
      count += points.length / 3;
      samples.push(points);
      glyphs.push({ x, y: top, width, height, pixels, at: reveal });
    }
    at += CHARACTER_INTERVAL_SECONDS;
  }
  if (!count) return null;
  const particles = new Float32Array(count * TITLE_PARTICLE_STRIDE);
  let index = 0;
  for (let g = 0; g < glyphs.length; g++) {
    const points = samples[g];
    for (let p = 0; p < points.length; p += 3) {
      const offset = index * TITLE_PARTICLE_STRIDE;
      particles[offset] = points[p];
      particles[offset + 1] = points[p + 1];
      particles[offset + 2] = seed(index);
      particles[offset + 3] = seed(index + 7919);
      particles[offset + 4] = points[p + 2];
      particles[offset + 5] = glyphs[g].at;
      index++;
    }
  }
  let next = 0;
  const timeOffset = animate ? 0 : at;
  function update(time: number, upload: (change: Readonly<GlyphUpload>) => void): void {
    while (next < glyphs.length && glyphs[next].at <= time + timeOffset) upload(glyphs[next++]);
    if (glyphs.length && next === glyphs.length) glyphs.length = 0;
  }
  return { particles, grain, timeOffset, update };
}
