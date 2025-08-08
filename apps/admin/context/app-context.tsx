'use client';

import * as React from 'react';
import { Session } from 'next-auth';
import { User } from '@/types/user';
import { setCookies } from '@repo/store';
import { SessionProvider } from 'next-auth/react';
import { ThemeToggle as ThemeButton, type ThemeToggleProps, type Theme } from '@repo/components/theme';

interface RequiredSession {
  session: Session | null | undefined;
  user: User;
  theme: Theme;
}

interface AppContext extends RequiredSession {
  setCookies(name: string, value: string, days?: number): Promise<void>;
}

const ctx = React.createContext<AppContext | undefined>(undefined);

export function useApp() {
  const _ctx = React.useContext(ctx);
  if (!_ctx) throw new Error('main layout must be used within an <AppProvider>');
  return _ctx;
}

interface AppProviderProps extends RequiredSession {
  children: React.ReactNode;
}
export function AppProvider(props: AppProviderProps) {
  const { children, user, session, ...others } = props;

  const contextValue = React.useMemo<AppContext>(
    () => ({
      setCookies,
      user,
      session,
      ...others
    }),
    [setCookies, user, session, others]
  );

  return (
    <ctx.Provider value={contextValue}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </ctx.Provider>
  );
}

export function ThemeToggle(props: Omit<ThemeToggleProps, 'value'>) {
  const { theme } = useApp();
  return <ThemeButton {...props} value={theme} />;
}
