import type { Locale, LocaleCode } from './content.ts';

const defaultLoader = () => import('./locales/ko.ts');

/**
 * Only completed translations are registered. Adding en/ja changes data,
 * not navigation, page markup, or demo behavior.
 */
const locales: Partial<Record<LocaleCode, () => Promise<{ default: Locale }>>> = {
  ko: defaultLoader,
};

export async function loadLocale(requested: string | null): Promise<Locale> {
  const code = requested as LocaleCode;
  const loader = Object.hasOwn(locales, code) ? locales[code] : undefined;
  return (await (loader ?? defaultLoader)()).default;
}
