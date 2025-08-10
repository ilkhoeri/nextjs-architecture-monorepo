'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useCurrentLocale } from 'next-i18n-router/client';
import { i18n } from '../config';
import { Locale } from '../types';

type Options = {
  days?: number;
};

export function setCookies(name: string, value: string, opts: Options = {}) {
  const { days = 30 } = opts;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
}

export function useLocaleSwitcher() {
  const router = useRouter();
  const currentPathname = usePathname();
  const currentLocale = useCurrentLocale(i18n);
  const [locale, setLocale] = React.useState<Locale>(currentLocale as Locale); // Optimistic UI

  const lastLocaleRef = React.useRef<string | undefined>(currentLocale);

  const handleChange = React.useCallback(
    (newLocale: string) => {
      setLocale(newLocale as Locale);
      // Set cookie for next-i18n-router
      setCookies('NEXT_LOCALE', newLocale);
      // Jika locale saat ini adalah default dan tidak ingin menambahkan prefix default
      if (currentLocale === i18n.defaultLocale && !i18n.prefixDefault) {
        router.replace('/' + newLocale + currentPathname, { scroll: false });
      } else {
        router.replace(currentPathname.replace(`/${currentLocale}`, `/${newLocale}`), { scroll: false });
      }
      router.refresh();
    },
    [currentPathname, currentLocale]
  );

  return {
    handleChange,
    currentLocale: locale,
    loading: lastLocaleRef.current !== locale
  };
}
