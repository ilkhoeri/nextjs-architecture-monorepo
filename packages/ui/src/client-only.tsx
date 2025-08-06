'use client';
import * as React from 'react';

export function useClient() {
  const [mounted, setMounted] = React.useState<boolean>(false);
  React.useEffect(() => setMounted(true), []);
  return [mounted, setMounted] as const;
}

export function ClientOnly({ children }: Readonly<{ children: React.ReactNode }>) {
  const [mounted] = useClient();
  if (!mounted) return null;
  return <>{children}</>;
}
