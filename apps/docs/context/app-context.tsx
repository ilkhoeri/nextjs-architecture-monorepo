'use client';
import * as React from 'react';
import { Cookies } from './types';
import { i18n as i18nConfig } from '@/i18n';
import { usePathname } from 'next/navigation';
import { Dictionaries, Locale } from '@/i18n/types';
import { setCookies } from '@repo/hooks/use-cookies';
import { useDirection, type Direction } from '@repo/hooks';
import { useCurrentLocale } from 'next-i18n-router/client';
import { ThemeToggle as ThemeButton, type ThemeToggleProps, type Theme } from '@repo/components/theme';

export type CookiesName = `${Cookies}` | (string & {});
type __T_ = 'dir' | 'theme' | 'isOpenAside'; // cookies value
type IntrinsicAppProvider = Partial<Record<__T_, string | undefined>>;
type useAppProps = IntrinsicAppProvider & {};

interface AppProviderProps extends IntrinsicAppProvider {
  children: React.ReactNode;
  dict: Dictionaries;
  lang: string;
}

interface CtxProps {
  openAside: Booleanish;
  setOpenAside: (v: Booleanish) => void;
  setCookies(name: string, value: string, days?: number): void;
  toggleDirection: () => void;
  setDirection: (dir: Direction) => void;
  // initial type
  dir: Direction;
  theme: Theme;
  isHome: boolean;
  pathname: string;
  dict: Dictionaries;
  lang: Locale;
}

const ctx = React.createContext<CtxProps | undefined>(undefined);

export const useApp = () => {
  const _ctx = React.useContext(ctx);
  if (!_ctx) throw new Error('main layout must be used within an <AppProvider>');
  return _ctx;
};

function useAppFuntions(_app: useAppProps) {
  const { isOpenAside = 'true', theme = 'system', dir = 'ltr', ...others } = _app;
  const [openAside, setOpenAside] = React.useState<Booleanish>(isOpenAside as Booleanish);
  const { dir: _dir, ..._direction } = useDirection({ initialDirection: dir as Direction });
  return { theme, dir: _dir, openAside, setOpenAside, ..._direction, ...others };
}

export function AppProvider({ children, dict, lang, ...props }: AppProviderProps) {
  const { theme, ...app } = useAppFuntions({ ...props });
  const pathname = usePathname();

  const isHome = pathname === `/${lang}` || pathname === '/';
  const locale = useCurrentLocale(i18nConfig);

  const value = { dict, lang: (locale || lang) as Locale, theme: theme as Theme, setCookies, isHome, pathname, ...app };

  return <ctx.Provider value={value}>{children}</ctx.Provider>;
}

export function ThemeToggle(props: Omit<ThemeToggleProps, 'value'>) {
  const { theme } = useApp();
  return <ThemeButton {...props} value={theme} />;
}
