import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('json', json);

export function highlightCode(element: HTMLElement, source: string, language: string): void {
  const name = language.trim().toLowerCase();
  if (!hljs.getLanguage(name)) {
    element.textContent = source;
    return;
  }

  // Only the lexer's escaped output becomes markup; preserve carriage returns during HTML parsing.
  const highlighted = hljs.highlight(source, { language: name, ignoreIllegals: true });
  element.innerHTML = highlighted.value.replace(/\r/g, '&#13;');

  // Keep native selection exact if HTML parsing normalizes otherwise unrepresentable characters.
  if (element.textContent !== source) element.textContent = source;
}
