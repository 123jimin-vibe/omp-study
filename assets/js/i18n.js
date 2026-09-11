/** @typedef {import('./content.js').Locale} Locale */
/** @typedef {import('./content.js').LocaleCode} LocaleCode */

const defaultLoader = () => import('../locales/ko.js');

/**
 * Only completed translations are registered. Adding en/ja changes data,
 * not navigation, page markup, or demo behavior.
 * @type {Partial<Record<LocaleCode, () => Promise<{ default: Locale }>>>}
 */
const locales = {
  ko: defaultLoader,
};

/** @param {string | null} requested @returns {Promise<Locale>} */
export async function loadLocale(requested) {
  const code = /** @type {LocaleCode} */ (requested);
  const loader = Object.hasOwn(locales, code) ? locales[code] : undefined;
  return (await (loader ?? defaultLoader)()).default;
}
