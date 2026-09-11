const NS = 'http://www.w3.org/2000/svg';
const SIZE = 246;
const X_SCALE = Math.sqrt(3) * 0.55;

/** @param {number} x @param {number} y @param {number} z */
function project(x, y, z) {
  return [302 + (x - y) * X_SCALE, 154 + (x + y) * 0.55 - z];
}

/** @param {string} name @param {Record<string, string | number>} attributes */
function svgNode(name, attributes) {
  const node = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
  return node;
}

/** @param {number[][]} points */
function pointsAttribute(points) {
  return points.map((point) => point.join(',')).join(' ');
}

/** @param {number} z @param {number} [inset] */
function planePoints(z, inset = 0) {
  return pointsAttribute([
    project(inset, inset, z), project(SIZE - inset, inset, z),
    project(SIZE - inset, SIZE - inset, z), project(inset, SIZE - inset, z),
  ]);
}

/**
 * A fixed orthographic projection, drawn once. No canvas, render loop, filters,
 * pointer tracking, or runtime 3D dependency; replace this component to re-skin it.
 */
export function createBlueprint() {
  const svg = svgNode('svg', {
    viewBox: '0 0 604 474', fill: 'none', class: 'blueprint',
    'aria-hidden': 'true', focusable: 'false',
  });
  const defs = svgNode('defs', {});
  const pattern = svgNode('pattern', { id: 'blueprint-grid', width: 20, height: 20, patternUnits: 'userSpaceOnUse' });
  pattern.append(svgNode('circle', { cx: 2, cy: 2, r: 0.65, fill: 'currentColor' }));
  defs.append(pattern);
  svg.append(defs, svgNode('rect', { x: 22, y: 22, width: 560, height: 420, fill: 'url(#blueprint-grid)', opacity: 0.19 }));

  const construction = svgNode('g', { stroke: 'currentColor', 'stroke-width': 0.7, opacity: 0.35 });
  for (const [x, y] of [[22, 22], [582, 22], [22, 442], [582, 442]]) {
    construction.append(svgNode('path', { d: `M${x - 5} ${y}h10M${x} ${y - 5}v10` }));
  }
  for (const [x, y] of [[0, 0], [SIZE, 0], [SIZE, SIZE], [0, SIZE]]) {
    construction.append(svgNode('polyline', {
      points: pointsAttribute([project(x, y, 126), project(x, y, -10)]), 'stroke-dasharray': '3 5',
    }));
  }
  svg.append(construction);

  for (let index = 0; index < 3; index += 1) {
    const z = index * 63;
    const layer = svgNode('g', { class: `blueprint-layer blueprint-layer-${index}` });
    layer.append(svgNode('polygon', {
      points: planePoints(z), fill: ['#edf0e9', '#eef1f5', '#f9faf6'][index],
      stroke: index === 1 ? '#9ba9c8' : '#899486', 'stroke-width': 0.9,
    }));
    const grid = svgNode('g', { stroke: index === 1 ? '#c7d1e4' : '#d4dacf', 'stroke-width': 0.65 });
    for (let line = 1; line < 6; line += 1) {
      const offset = SIZE * line / 6;
      grid.append(
        svgNode('polyline', { points: pointsAttribute([project(offset, 0, z), project(offset, SIZE, z)]) }),
        svgNode('polyline', { points: pointsAttribute([project(0, offset, z), project(SIZE, offset, z)]) }),
      );
    }
    layer.append(grid, svgNode('polygon', { points: planePoints(z, 20), stroke: '#aeb8a8', 'stroke-width': 0.6 }));

    if (index === 1) {
      layer.append(svgNode('polyline', {
        points: pointsAttribute([[41, 205], [82, 205], [82, 164], [205, 164]].map(([x, y]) => project(x, y, z))),
        stroke: '#8b9ecc', 'stroke-width': 1.7,
      }));
    }
    if (index === 2) {
      const tile = [[82, 123], [123, 123], [123, 164], [82, 164]];
      layer.append(svgNode('polygon', { points: pointsAttribute(tile.map(([x, y]) => project(x, y, z))), fill: '#e8edfb', stroke: '#adbde7', 'stroke-width': 0.8 }));
      const route = [[41, 205], [82, 205], [82, 164], [164, 164], [164, 82]];
      layer.append(svgNode('polyline', {
        points: pointsAttribute(route.map(([x, y]) => project(x, y, z))),
        stroke: '#315bea', 'stroke-width': 2.3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round',
      }));
      const origin = project(41, 205, z);
      layer.append(
        svgNode('circle', { cx: origin[0], cy: origin[1], r: 5, fill: '#f9faf6', stroke: '#315bea', 'stroke-width': 1.5 }),
        svgNode('circle', { cx: origin[0], cy: origin[1], r: 1.7, fill: '#315bea' }),
      );
      const box = [[144, 62], [184, 62], [184, 102], [144, 102]];
      layer.append(
        svgNode('polygon', { points: pointsAttribute([project(184, 62, z + 12), project(184, 102, z + 12), project(184, 102, z), project(184, 62, z)]), fill: '#2348bf' }),
        svgNode('polygon', { points: pointsAttribute([project(144, 102, z + 12), project(184, 102, z + 12), project(184, 102, z), project(144, 102, z)]), fill: '#163796' }),
        svgNode('polygon', { points: pointsAttribute(box.map(([x, y]) => project(x, y, z + 12))), fill: '#315bea', stroke: '#2348bf', 'stroke-width': 0.6 }),
        svgNode('polyline', { points: pointsAttribute([project(154, 83, z + 12), project(162, 91, z + 12), project(176, 77, z + 12)]), stroke: '#fff', 'stroke-width': 1.4, 'stroke-linejoin': 'round' }),
      );
    }

    for (const [x, y] of [[0, 0], [SIZE, 0], [SIZE, SIZE], [0, SIZE]]) {
      const point = project(x, y, z);
      layer.append(svgNode('circle', { cx: point[0], cy: point[1], r: 2.3, fill: '#f6f7f3', stroke: '#788474', 'stroke-width': 0.8 }));
    }
    const tip = project(SIZE, 0, z);
    layer.append(svgNode('path', { d: `M${tip[0] + 12} ${tip[1]}h22`, stroke: '#a9b2a2', 'stroke-width': 0.8 }));
    const label = svgNode('text', { x: tip[0] + 41, y: tip[1] + 3.5, fill: '#687169', class: 'blueprint-label' });
    label.textContent = String(index + 1).padStart(2, '0');
    layer.append(label);
    svg.append(layer);
  }
  return svg;
}
