export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  text = '',
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

const iconPaths = {
  right: 'M4 12h16m-6-6 6 6-6 6',
  left: 'M20 12H4m6-6-6 6 6 6',
  down: 'M12 4v16m-6-6 6 6 6-6',
  copy: 'M9 9h11v11H9zM15 9V4H4v11h5',
  check: 'm5 12 4 4L19 6',
  expand: 'M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5',
  collapse: 'M3 8h5V3m8 0v5h5M8 21v-5H3m18 0h-5v5',
  sun: 'M12 8a4 4 0 1 1 0 8 4 4 0 1 1 0-8M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5',
  moon: 'M20.4 13.5A8.5 8.5 0 0 1 10.5 3.6 8.5 8.5 0 1 0 20.4 13.5Z',
} as const;

export function icon(name: keyof typeof iconPaths): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('icon');
  const path = document.createElementNS(svg.namespaceURI, 'path');
  path.setAttribute('d', iconPaths[name]);
  svg.append(path);
  return svg;
}
