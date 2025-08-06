import React from 'react';
import { cn } from '@repo/utils';

export function PageLayout({ children, className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main {...props} className={cn('flex flex-col items-center justify-center gap-4 min-h-screen', className)}>
      {children}
    </main>
  );
}
