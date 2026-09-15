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

// Broad, chromatically separated light envelopes, not moving detail behind the text.
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
void main() {
  vec2 p = vec2(v_uv.x * u_aspect, v_uv.y);
  float t = u_time * 0.055;
  float center = u_aspect * (0.83 + 0.045 * sin(t));
  float bend = 0.19 * sin(p.y * 4.0 + t * 0.8);
  float x = p.x - center + bend;
  float spread = 0.10 + 0.055 * (0.5 + 0.5 * sin(p.y * 5.0 - t));
  float cyan = exp(-pow((x + 0.095) / spread, 2.0));
  float violet = exp(-pow((x - 0.08) / (spread * 1.5), 2.0));
  float gold = exp(-pow((x - 0.27 - p.y * 0.12) / 0.17, 2.0));
  float envelope = 0.65 + 0.35 * sin(p.y * 2.4 + t * 0.65);
  float weight = cyan + violet + gold;
  vec3 color = (u_light1 * cyan + u_light2 * violet + u_light3 * gold) / max(weight, 0.001);
  float alpha = min(weight * 0.62, 0.85) * envelope;
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
