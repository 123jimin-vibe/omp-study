import { animateCanvas, type CanvasFrame } from './canvas-animation.ts';
import { createTitleGlyphs, TITLE_REVEAL_SECONDS, TITLE_PARTICLE_STRIDE, type GlyphUpload, type TitleGlyphScene } from './title-glyphs.ts';
import { createTitleInteraction } from './title-interaction.ts';

const STRIDE = TITLE_PARTICLE_STRIDE;

// Every grain originates in the glyph. Binding changes continuously, but its
// transport, color, and soft kernel do not switch to a separate background effect.
const VERTEX = `#version 300 es
precision highp float;
layout(location = 0) in vec2 a_home;
layout(location = 1) in vec2 a_seed;
layout(location = 2) in vec2 a_glyph;
uniform vec2 u_size;
uniform float u_time;
uniform float u_clock;
uniform float u_pixelRatio;
uniform vec4 u_cursor;
uniform float u_hover;
uniform float u_pressure;
uniform vec2 u_origin;
uniform float u_grain;
uniform vec2 u_focusBand;
uniform sampler2D u_glyphMask;
out float v_alpha;
out float v_color;
out float v_tint;
out float v_attachment;
out float v_shade;
out float v_feather;

vec2 transport(vec2 p) {
  // Composed shears mix the entire field without fixed lanes or particle orbits.
  p.x += 0.20 * sin(p.y * 6.283185 + u_time * 0.14);
  p.y += 0.16 * sin(p.x * 7.3 - u_time * 0.11);
  p.x += 0.12 * cos(p.y * 9.7 + u_time * 0.09);
  return p;
}

void main() {
  float present = smoothstep(0.0, ${TITLE_REVEAL_SECONDS.toFixed(3)}, u_clock - a_glyph.y);
  vec2 aspect = vec2(u_size.x / u_size.y, 1.0);
  vec2 p = a_home * aspect * 4.8;
  vec2 warped = p + 0.8 * vec2(sin(p.y * 0.91 + u_time * 0.12), cos(p.x * 0.73 - u_time * 0.09));
  float field = 0.72 * sin(warped.x * 1.6 + warped.y * 0.7 - u_time * 0.27)
    * cos(warped.y * 2.1 - warped.x * 0.35 + u_time * 0.18)
    + 0.28 * sin(warped.x * 3.1 - warped.y * 1.9 + u_time * 0.23);
  float distance = length((a_home - u_origin) * aspect)
    * (1.0 + 0.13 * sin(warped.x * 1.9 + warped.y * 0.7)
      + 0.09 * cos(warped.y * 2.3 - warped.x));
  float influence = u_pressure * exp(-pow(distance / 0.28, 2.0));
  float wave = smoothstep(-0.08, 0.80, field);
  float cohort = 0.5 + 0.5
    * sin(warped.x * 2.7 + sin(warped.y * 1.4) + u_clock * 0.30)
    * cos(warped.y * 3.1 - u_clock * 0.23);
  float release = smoothstep(0.72, 0.98, cohort + influence * 0.25)
    * smoothstep(0.30, 1.50, u_clock - a_glyph.y);
  float cycle = 0.5 + 0.5 * sin(u_time * 0.19 + a_seed.y * 6.283185);
  float binding = smoothstep(0.64, 0.76, a_seed.x);
  float free = max(wave, smoothstep(0.40, 0.75, cycle) * 0.78);
  // Local cohorts take the same home-to-field path as the surrounding grains.
  // Their different travel distances open readable gaps instead of moving a solid stroke.
  float travel = binding * (free + (1.0 - free) * influence * 0.06);
  travel += (1.0 - binding) * release * mix(0.018, 0.095, a_seed.x);

  vec2 seed = vec2(a_seed.y * 1.18 - 0.09, fract(a_seed.x * 17.17) * 0.85 + 0.03);
  vec2 base = mix(a_home, seed, travel);
  vec2 displacement = (transport(base) - base) * u_size / u_pixelRatio;
  float phase = a_seed.y * 6.283185;
  vec2 local = vec2(sin(warped.y * 2.2 + u_clock * 0.40 + phase),
    cos(warped.x * 2.1 - u_clock * 0.32 + phase))
    * u_grain * (0.12 + release * 1.6);
  vec2 position = base + mix(local, displacement, travel) * u_pixelRatio / u_size;
  float excursion = length((position - a_home) * u_size) / u_pixelRatio;
  float detached = smoothstep(0.5, u_grain * 2.0, excursion);
  v_attachment = 1.0 - detached;
  v_shade = 0.80 + a_seed.y * 0.20;
  vec2 cursorDistance = (position - u_cursor.xy) * u_size / u_pixelRatio;
  float brush = u_hover * exp(-dot(cursorDistance, cursorDistance) / 25600.0);
  position += u_cursor.zw * brush * mix(0.25, 1.0, detached) * u_pixelRatio / u_size;
  position += vec2(sin(a_seed.x * 6.283185), cos(a_seed.y * 6.283185))
    * (1.0 - present) * (1.0 - travel) * 12.0 * u_pixelRatio / u_size;

  // A grain carries the same color and softness through departure and return.
  v_color = a_home.x * 0.85 + a_home.y * 0.30 + u_time * 0.015;
  v_tint = 0.42 + wave * 0.48;
  v_alpha = a_glyph.x * mix(0.98, 0.56, detached)
    * mix(binding * 0.16, 1.0, present);
  float boundary = smoothstep(-0.08, 0.04, position.x) * (1.0 - smoothstep(0.96, 1.08, position.x))
    * smoothstep(-0.08, 0.04, position.y) * (1.0 - smoothstep(0.96, 1.08, position.y));
  v_alpha *= mix(1.0, boundary, detached);
  v_alpha *= 1.0 - texture(u_glyphMask, position).a * detached
    * mix(0.25, 0.92, smoothstep(0.08, 0.30, travel));
  float pointSize = u_grain * u_pixelRatio * mix(2.10, 2.30, a_seed.y)
    * (1.0 + v_attachment * 0.50);
  float defocus = smoothstep(0.0, 1.0, max(
    (u_focusBand.x - position.y) / max(u_focusBand.x, 0.001),
    (position.y - u_focusBand.y) / max(1.0 - u_focusBand.y, 0.001)));
  float spread = 8.0 * u_pixelRatio * defocus;
  gl_PointSize = sqrt(pointSize * pointSize + 16.0 * spread * spread);
  v_feather = mix(0.22, 0.50, defocus);
  // Broaden the soft kernel without changing its integrated particle coverage.
  float kernelArea = 0.25 - 0.50 * v_feather + 0.30 * v_feather * v_feather;
  v_alpha *= (pointSize * pointSize) / (gl_PointSize * gl_PointSize)
    * 0.15452 / kernelArea;
  v_attachment *= present;
  vec2 ndc = position * 2.0 - 1.0;
  gl_Position = vec4(ndc.x, -ndc.y, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
in float v_alpha;
in float v_color;
in float v_tint;
in float v_attachment;
in float v_shade;
in float v_feather;
uniform vec2 u_size;
uniform sampler2D u_glyphMask;
uniform vec3 u_ink;
uniform vec3 u_cyan;
uniform vec3 u_violet;
uniform vec3 u_rose;
uniform vec3 u_gold;
out vec4 outColor;
void main() {
  float x = fract(v_color) * 4.0;
  vec3 spectral = x < 1.0 ? mix(u_cyan, u_violet, x)
    : x < 2.0 ? mix(u_violet, u_rose, x - 1.0)
    : x < 3.0 ? mix(u_rose, u_gold, x - 2.0)
    : mix(u_gold, u_cyan, x - 3.0);
  float radius = length(gl_PointCoord - 0.5);
  float feather = max(v_feather, fwidth(radius) * 0.5);
  float kernel = 1.0 - smoothstep(0.5 - feather, 0.5, radius);
  float alpha = v_alpha * kernel;
  if (v_attachment > 0.0) {
    vec2 uv = vec2(gl_FragCoord.x, u_size.y - gl_FragCoord.y) / u_size;
    alpha *= mix(1.0, texture(u_glyphMask, uv).a, v_attachment);
  }
  vec3 color = mix(u_ink, spectral, v_tint) * v_shade;
  outColor = vec4(color * alpha, alpha);
}`;

function compile(gl: WebGL2RenderingContext): WebGLProgram | null {
  const program = gl.createProgram();
  for (const [type, source] of [[gl.VERTEX_SHADER, VERTEX], [gl.FRAGMENT_SHADER, FRAGMENT]] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  gl.deleteProgram(program);
  return null;
}


/** One glyph-to-field particle renderer; the DOM heading remains the accessible fallback. */
export function createTitleTypography(
  heading: HTMLElement, stage: HTMLElement, { typing = true } = {},
): { dispose(): void } | null {
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-typography';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl2', { antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
  const program = gl && compile(gl);
  if (!gl || !program) {
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return null;
  }
  const uniforms = {
    size: gl.getUniformLocation(program, 'u_size'),
    time: gl.getUniformLocation(program, 'u_time'),
    clock: gl.getUniformLocation(program, 'u_clock'),
    pixelRatio: gl.getUniformLocation(program, 'u_pixelRatio'),
    ink: gl.getUniformLocation(program, 'u_ink'),
    cursor: gl.getUniformLocation(program, 'u_cursor'),
    hover: gl.getUniformLocation(program, 'u_hover'),
    pressure: gl.getUniformLocation(program, 'u_pressure'),
    origin: gl.getUniformLocation(program, 'u_origin'),
    grain: gl.getUniformLocation(program, 'u_grain'),
    focusBand: gl.getUniformLocation(program, 'u_focusBand'),
    glyphMask: gl.getUniformLocation(program, 'u_glyphMask'),
  };
  const colorNames = ['cyan', 'violet', 'rose', 'gold'] as const;
  const colors = colorNames.map(name => gl.getUniformLocation(program, `u_${name}`));
  const buffer = gl.createBuffer();
  const vao = gl.createVertexArray();
  const glyphMask = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, glyphMask);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, STRIDE * 4, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, STRIDE * 4, 8);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 2, gl.FLOAT, false, STRIDE * 4, 16);
  let count = 0;
  let width = 0, height = 0;
  let glyphsDirty = true;
  let theme: CanvasFrame['theme'] | undefined;
  let live = false;
  let glyphs: TitleGlyphScene | null = null;

  function uploadGlyph(change: Readonly<GlyphUpload>): void {
    gl!.texSubImage2D(gl!.TEXTURE_2D, 0, change.x, change.y, change.width, change.height,
      gl!.RGBA, gl!.UNSIGNED_BYTE, change.pixels);
  }

  function render(frame: Readonly<CanvasFrame>): void {
    if (gl!.isContextLost()) return;
    gl!.useProgram(program);
    if (glyphsDirty || width !== frame.rasterWidth || height !== frame.rasterHeight) {
      glyphs = createTitleGlyphs(heading, canvas, frame, typing);
      if (!glyphs) return;
      count = glyphs.particles.length / STRIDE;
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
      gl!.bufferData(gl!.ARRAY_BUFFER, glyphs.particles, gl!.STATIC_DRAW);
      gl!.uniform1f(uniforms.grain, glyphs.grain);
      const canvasBounds = canvas.getBoundingClientRect();
      const titleBounds = heading.getBoundingClientRect();
      gl!.uniform2f(uniforms.focusBand,
        (titleBounds.top - canvasBounds.top - 12) / frame.height,
        (titleBounds.bottom - canvasBounds.top + 12) / frame.height);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, frame.rasterWidth, frame.rasterHeight,
        0, gl!.RGBA, gl!.UNSIGNED_BYTE, null);
      gl!.uniform1i(uniforms.glyphMask, 0);
      width = frame.rasterWidth;
      height = frame.rasterHeight;
      glyphsDirty = false;
    }
    glyphs!.update(frame.time, uploadGlyph);
    if (theme !== frame.theme) {
      const style = getComputedStyle(stage);
      for (let i = 0; i < colorNames.length; i++) {
        const [r, g, b] = style.getPropertyValue(`--spectral-${colorNames[i]}`).trim().split(/\s+/).map(Number);
        gl!.uniform3f(colors[i], r / 255, g / 255, b / 255);
      }
      const ink = getComputedStyle(heading).color.match(/[\d.]+/g)!.map(Number);
      gl!.uniform3f(uniforms.ink, ink[0] / 255, ink[1] / 255, ink[2] / 255);
      theme = frame.theme;
    }
    const input = interaction.update(frame.time);
    gl!.viewport(0, 0, width, height);
    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.enable(gl!.BLEND);
    gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
    gl!.uniform2f(uniforms.size, width, height);
    gl!.uniform1f(uniforms.time, frame.time * 0.12);
    gl!.uniform1f(uniforms.clock, frame.time + glyphs!.timeOffset);
    gl!.uniform1f(uniforms.pixelRatio, width / frame.width);
    gl!.uniform4f(uniforms.cursor, input.pointerX, input.pointerY, input.flowX, input.flowY);
    gl!.uniform1f(uniforms.hover, input.hover);
    gl!.uniform1f(uniforms.pressure, input.pulse);
    gl!.uniform2f(uniforms.origin, input.pulseX, input.pulseY);
    gl!.bindVertexArray(vao);
    gl!.drawArrays(gl!.POINTS, 0, count);
    if (!live) {
      heading.dataset.live = '';
      if (!reducedMotion.matches) {
        heading.tabIndex = 0;
        heading.setAttribute('aria-keyshortcuts', 'Enter Space');
      }
      live = true;
    }
  }

  stage.append(canvas);
  const animation = animateCanvas(canvas, render, { fps: 30, maxPixels: 1_400_000, maxDpr: 2 });
  const interaction = createTitleInteraction(heading, stage, canvas, animation.invalidate);
  const events = new AbortController();
  let disposed = false;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotion.addEventListener('change', () => {
    heading.tabIndex = reducedMotion.matches ? -1 : 0;
    if (reducedMotion.matches) heading.removeAttribute('aria-keyshortcuts');
    else heading.setAttribute('aria-keyshortcuts', 'Enter Space');
  }, { signal: events.signal });
  const invalidateGlyphs = (): void => {
    if (disposed) return;
    glyphsDirty = true;
    animation.invalidate();
  };
  const style = getComputedStyle(heading);
  const family = style.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '');
  document.fonts.load(`${style.fontWeight} 16px "${family}"`, heading.textContent ?? '').then(invalidateGlyphs, () => {});
  const resize = new ResizeObserver(invalidateGlyphs);
  resize.observe(heading);

  function dispose(): void {
    if (disposed) return;
    disposed = true;
    events.abort();
    interaction.dispose();
    resize.disconnect();
    animation.dispose();
    canvas.remove();
    delete heading.dataset.live;
    heading.tabIndex = -1;
    heading.removeAttribute('aria-keyshortcuts');
    if (!gl!.isContextLost()) {
      gl!.deleteTexture(glyphMask);
      gl!.deleteBuffer(buffer);
      gl!.deleteVertexArray(vao);
      gl!.deleteProgram(program);
      gl!.getExtension('WEBGL_lose_context')?.loseContext();
    }
  }
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    dispose();
  }, { signal: events.signal });
  return { dispose };
}
