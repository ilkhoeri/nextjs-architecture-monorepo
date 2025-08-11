'use client';

import * as React from 'react';
import { cvx, cvxVariants } from 'xuxi';
import { cn } from '@repo/utils';

const separatorVariant = cvx({
  assign: 'shrink-0 m-0 bg-transparent',
  variants: {
    variant: {
      default: 'border-solid',
      dashed: 'border-dashed'
    },
    orientation: {
      horizontal: 'h-0 w-full border-b border-b-border',
      vertical: 'h-full w-0 border-r border-r-border'
    }
  }
});

export interface SeparatorProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, cvxVariants<typeof separatorVariant> {
  label?: React.ReactNode;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(({ className, variant = 'default', orientation = 'horizontal', label, ...props }, ref) => {
  if (!label) return <div ref={ref} data-orientation={orientation} className={cn(separatorVariant({ variant, orientation }), className)} {...props} />;

  return (
    <div ref={ref} data-orientation={orientation} className={cn('flex flex-row items-center justify-center', className)} {...props}>
      <div className="flex flex-row items-stretch justify-start h-px flex-[1_1_0%] bg-border" />
      <p data-localization-key="dividerText" className="text-[0.8125rem] text-border my-0 mx-4">
        {label}
      </p>
      <div className="flex flex-row items-stretch justify-start h-px flex-[1_1_0%] bg-border" />
    </div>
  );
});
Separator.displayName = 'Separator';
