import type { ReadingLabels } from '../content.ts';
import { el, icon } from './dom.ts';

export function createReadingTools(labels: ReadingLabels, onModeChange: () => void) {
  const root = document.documentElement;
  const element = el('div', 'reading-tools');
  element.hidden = true;
  element.setAttribute('role', 'group');
  element.setAttribute('aria-label', labels.controls);

  const present = el('button', 'button reading-tool');
  present.type = 'button';
  present.dataset.readingAction = 'present';
  present.setAttribute('aria-pressed', 'false');
  present.title = labels.present;
  const presentLabel = el('span', 'reading-tool-label', labels.present);
  present.append(icon('expand'), presentLabel);

  const status = el('p', 'reading-status page-width sr-only');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  element.append(present);

  let presenting = false;
  let ownsFullscreen = false;
  let opening: Promise<void> | null = null;
  let closing: Promise<void> | null = null;

  function announce(message: string, visible = false) {
    status.textContent = message;
    status.classList.toggle('sr-only', !visible);
  }

  function updateMode(enabled: boolean) {
    if (presenting === enabled) return;
    onModeChange();
    presenting = enabled;
    root.toggleAttribute('data-presentation', enabled);
    present.setAttribute('aria-pressed', String(enabled));
    present.title = enabled ? labels.exit : labels.present;
    present.replaceChildren(icon(enabled ? 'collapse' : 'expand'), presentLabel);
    announce(enabled ? labels.entered : labels.exited);
  }

  function updateBusy() {
    // Keep the focused control in the keyboard order during the native request.
    present.setAttribute('aria-disabled', String(Boolean(opening || closing)));
  }

  function enterPresentation() {
    updateMode(true);
    if (document.fullscreenElement) return;
    if (typeof root.requestFullscreen !== 'function') {
      announce(labels.fullscreenUnavailable, true);
      return;
    }
    opening = root.requestFullscreen().then(
      () => { ownsFullscreen = document.fullscreenElement === root; },
      () => { if (presenting) announce(labels.fullscreenUnavailable, true); },
    ).finally(() => {
      opening = null;
      updateBusy();
    });
    updateBusy();
  }

  async function closeFullscreen() {
    // A route change or Escape can arrive before an enter request has settled.
    await opening;
    if (ownsFullscreen && document.fullscreenElement === root) {
      try {
        await document.exitFullscreen();
      } catch {
        announce(labels.fullscreenExitFailed, true);
      }
    }
    ownsFullscreen = false;
  }

  function exitPresentation(): Promise<void> {
    updateMode(false);
    if (!closing) {
      closing = closeFullscreen().finally(() => {
        closing = null;
        updateBusy();
      });
      updateBusy();
    }
    return closing;
  }

  present.addEventListener('click', () => {
    if (element.hidden || opening || closing) return;
    if (presenting) void exitPresentation();
    else enterPresentation();
  });
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      ownsFullscreen = false;
      updateMode(false);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && presenting) void exitPresentation();
  });

  return {
    element,
    status,
    get presenting() { return presenting; },
    get changing() { return Boolean(opening || closing); },
    setAvailable(available: boolean) {
      element.hidden = !available;
      if (!available && (presenting || opening)) void exitPresentation();
    },
    exitPresentation,
  };
}
