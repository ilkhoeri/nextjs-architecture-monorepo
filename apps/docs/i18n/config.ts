import { dictionaries } from './intl';
import { Locale } from './types';
import { Config } from 'next-i18n-router/dist/types';

export const mockLocales = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Bahasa Indonesia' }
  // { code: "es", name: "Español" },
  // { code: "fr", name: "Français" },
  // { code: "de", name: "Deutsch" },
  // { code: "ja", name: "日本語" },
  // { code: "ar", name: "العربية" },
  // { code: "ms", name: "Malay" },
  // { code: "th", name: "Thai" }
] as const;

export const mockTranslations: { [key in Locale]: string } = mockLocales.reduce(
  (acc, locale) => {
    acc[locale.code as Locale] = locale.name;
    return acc;
  },
  {} as { [key in Locale]: string }
);

export const locales: Locale[] = mockLocales.map(item => item.code);

// export const locales: Locale[] = Object.keys(dictionaries) as (keyof typeof dictionaries)[];

export const defaultLocale: Locale = 'en';

export const i18n: Config = { locales, defaultLocale } as const;
