import React from 'react';
import { cn } from '@repo/utils';

export function Footer({ children, className, ...props }: React.ComponentProps<'footer'>) {
  return (
    <footer {...props} className={cn('flex gap-4 flex-col items-center justify-between p-4 dark:bg-slate-800', className)}>
      {children}
    </footer>
  );
}
