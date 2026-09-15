import type { ThemeLabels } from '../content.ts';
import { el, icon } from './dom.ts';

type Theme = 'light' | 'dark';

export function createThemeToggle(labels: ThemeLabels): HTMLButtonElement {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference: Theme | 'system' = root.dataset.themePreference === 'light' ? 'light'
    : root.dataset.themePreference === 'dark' ? 'dark' : 'system';
  const chromeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const button = el('button', 'theme-toggle');
  button.type = 'button';
  button.setAttribute('aria-label', labels.toggle);

  function apply(theme: Theme) {
    root.dataset.theme = theme;
    root.dataset.themePreference = preference;
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.title = theme === 'dark' ? labels.light : labels.dark;
    button.replaceChildren(icon(theme === 'dark' ? 'sun' : 'moon'));
    if (chromeColor) chromeColor.content = getComputedStyle(root).getPropertyValue('--paper').trim();
  }

  button.addEventListener('click', () => {
    preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(preference);
    try {
      localStorage.setItem('omp-study.theme', preference);
    } catch {
      // The current page remains switchable when storage is unavailable.
    }
  });
  system.addEventListener('change', () => {
    if (preference === 'system') apply(system.matches ? 'dark' : 'light');
  });
  apply(preference === 'system' ? (system.matches ? 'dark' : 'light') : preference);
  return button;
}
