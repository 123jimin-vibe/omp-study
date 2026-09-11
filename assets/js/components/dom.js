/**
 * @template {keyof HTMLElementTagNameMap} T
 * @param {T} tag
 * @param {string} [className]
 * @param {string} [text]
 * @returns {HTMLElementTagNameMap[T]}
 */
export function el(tag, className = '', text = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

/** @param {'right' | 'left' | 'up-right' | 'down' | 'copy' | 'check'} name */
export function icon(name) {
  const paths = {
    right: 'M4 12h16m-6-6 6 6-6 6',
    left: 'M20 12H4m6-6-6 6 6 6',
    'up-right': 'M6 18 18 6M6 6h12v12',
    down: 'M12 4v16m-6-6 6 6 6-6',
    copy: 'M9 9h11v11H9zM15 9V4H4v11h5',
    check: 'm5 12 4 4L19 6',
  };
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
  path.setAttribute('d', paths[name]);
  svg.append(path);
  return svg;
}
