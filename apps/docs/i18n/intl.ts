// "use server";

'server-only';

// import { cookies } from "next/headers";
import { createIntl } from '@formatjs/intl';
import { MessageFormatElement } from 'react-intl';
import { defaultLocale } from './config';

import type { Dictionaries, Locale } from './types';

// import en from "./dictionaries/en.json" with { type: "json" };
// import id from "./dictionaries/id.json" with { type: "json" };

export const dictionaries = {
  en: () => import('./dictionaries/en.json').then(module => module.default),
  id: () => import('./dictionaries/id.json').then(module => module.default)
  // ar: () => import("./dictionaries/ar.json").then(module => module.default),
  // ja: () => import("./dictionaries/ja.json").then(module => module.default),
  // ms: () => import("./dictionaries/ms.json").then(module => module.default),
  // th: () => import("./dictionaries/th.json").then(module => module.default)
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export async function geti18n(lang: string | undefined): Promise<{ messages: Dictionaries; locale: Locale }> {
  // const cookieStore = await cookies();
  // const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = (lang ?? defaultLocale) as Locale;
  const messages = await dictionaries[locale]?.();

  // const intl = createIntl({ locale });

  return { locale, messages };
}

type IntlDictionary = Record<string, MessageFormatElement[]> | Record<string, string>;
export async function getIntlDictionary(lang: Locale): Promise<IntlDictionary> {
  /**
  try {
    const locale = lang ?? defaultLocale;
    return (await import(`./dictionaries/${locale}.json`)).default;
  } catch (error) {
    return {};
  }
 */

  return (await dictionaries[lang]?.()) as any;
}

export async function getIntl(lang: string | undefined) {
  const locale = (lang ?? defaultLocale) as Locale;
  const messages = await getIntlDictionary(locale);

  return createIntl({
    locale,
    messages,
    defaultLocale
  });
}
