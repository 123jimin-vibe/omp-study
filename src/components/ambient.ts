import type { MountedView } from '../content.ts';
import { animateCanvas, type CanvasFrame } from './canvas-animation.ts';
import { el } from './dom.ts';

const VERTEX = `#version 300 es
precision highp float;
out vec2 v_uv;
void main() {
  vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  v_uv = corner;
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`;

// Soft, refracted light volumes drift through the margins. The domain warp moves
// their color overlap, without sharp bands, fine noise, or full-screen pulsing.
// The reading-column exclusion is CSS-owned; this shader stays independent of layout.
const FRAGMENT = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform float u_aspect;
uniform float u_time;
uniform vec3 u_light1;
uniform vec3 u_light2;
uniform vec3 u_light3;
out vec4 outColor;
float envelope(vec2 p, vec2 center, vec2 spread, float shear) {
  vec2 q = p - center;
  q.x += q.y * shear;
  q /= spread;
  return exp(-dot(q, q) * 2.0);
}
void main() {
  float t = u_time * 0.085;
  // Limit aspect correction so the same volumes stay broad on portrait screens.
  vec2 scale = vec2(clamp(u_aspect, 0.7, 1.8), 1.0);
  vec2 p = v_uv;
  p += 0.055 * vec2(
    sin(p.y * 4.5 + t * 0.73),
    sin(p.x * 3.8 - t * 0.61)
  );
  vec2 cyanCenter = vec2(0.84 + 0.065 * sin(t), 0.68 + 0.12 * cos(t * 0.81));
  vec2 violetCenter = vec2(0.98 + 0.06 * cos(t * 0.67), 0.42 + 0.15 * sin(t * 0.76));
  vec2 goldCenter = vec2(0.92 + 0.08 * sin(t * 0.59), 0.12 + 0.10 * cos(t * 0.93));
  float cyan = envelope(p * scale, cyanCenter * scale, vec2(0.34, 0.55), 0.18);
  float violet = envelope(p * scale, violetCenter * scale, vec2(0.30, 0.48), -0.24);
  float gold = envelope(p * scale, goldCenter * scale, vec2(0.32, 0.42), 0.28);
  // A quieter counterlight keeps the composition from becoming a right-edge stripe.
  cyan += 0.42 * envelope(p * scale, vec2(-0.03, 0.22 + 0.12 * sin(t * 0.71)) * scale, vec2(0.30, 0.48), -0.18);
  violet += 0.32 * envelope(p * scale, vec2(0.02, 0.64 + 0.10 * cos(t * 0.83)) * scale, vec2(0.27, 0.40), 0.22);
  float weight = cyan + violet + gold;
  vec3 color = (u_light1 * cyan + u_light2 * violet + u_light3 * gold) / max(weight, 0.001);
  float alpha = 0.78 * (1.0 - exp(-weight));
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
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

export function createAmbient(): MountedView & { setView(view: 'cover' | 'reading'): void } {
  const element = el('div', 'ambient-field');
  element.setAttribute('aria-hidden', 'true');
  element.dataset.view = 'cover';
  const canvas = el('canvas', 'ambient-canvas');
  const gl = canvas.getContext('webgl2', { antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
  const program = gl && compile(gl);
  element.append(canvas);

  const lights = [0, 1, 2].map((band) => gl && program ? gl.getUniformLocation(program, `u_light${band + 1}`) : null);
  const aspect = gl && program ? gl.getUniformLocation(program, 'u_aspect') : null;
  const time = gl && program ? gl.getUniformLocation(program, 'u_time') : null;
  let paletteDirty = true;
  let theme: CanvasFrame['theme'] | undefined;

  function draw(frame: Readonly<CanvasFrame>): void {
    if (!gl || !program || gl.isContextLost()) return;
    gl.useProgram(program);
    if (paletteDirty || theme !== frame.theme) {
      const style = getComputedStyle(element);
      for (let band = 0; band < lights.length; band++) {
        const [r, g, b] = style.getPropertyValue(`--ambient-light-${band + 1}`).trim().split(/\s+/).map(Number);
        gl.uniform3f(lights[band], r / 255, g / 255, b / 255);
      }
      paletteDirty = false;
      theme = frame.theme;
    }
    gl.viewport(0, 0, frame.rasterWidth, frame.rasterHeight);
    gl.uniform1f(aspect, frame.rasterWidth / frame.rasterHeight);
    gl.uniform1f(time, frame.time);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  // A 24k-pixel raster at twelve frames per second; the compositor supplies the soft upscale.
  const animation = program ? animateCanvas(canvas, draw, { fps: 12, maxPixels: 24_000, maxDpr: 1 }) : undefined;
  return {
    element,
    setView(view) {
      if (element.dataset.view === view) return;
      element.dataset.view = view;
      paletteDirty = true;
      animation?.invalidate();
    },
    dispose() {
      animation?.dispose();
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
