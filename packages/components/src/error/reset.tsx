'use client';

import { cn } from '@repo/utils';
import { HttpErrorProps } from './lib';
import { ArrowSyncFillIcon, HomeFillIcon, ArrowRepeatAllFillIcon } from '@repo/icons';

type ErrorResetProps = Pick<HttpErrorProps, 'reset'> &
  React.ComponentProps<'div'> & {
    classNames?: Partial<Record<'wrap' | 'buttons', string>>;
  };

export function ErrorReset({ reset, classNames, className, ...props }: ErrorResetProps) {
  const detailActions = [
    { label: 'Reload', icon: ArrowSyncFillIcon, onClick: () => window.location.reload() },
    { label: 'Reset', icon: ArrowRepeatAllFillIcon, onClick: reset },
    { label: 'Home', icon: HomeFillIcon, onClick: () => (window.location.href = '/') }
  ];

  return (
    <div {...props} className={cn('flex flex-row items-center gap-1.5', classNames?.wrap, className)}>
      {detailActions.map(({ label, icon: Icon, onClick }) => (
        <button
          type="button"
          role="button"
          key={label}
          title={label}
          aria-label={label}
          onClick={onClick}
          className={cn(
            'size-7 inline-flex items-center justify-center ring-offset-background transition-colors focus-visible:outline-0 focus-visible:ring-transparent disabled:pointer-events-none disabled:opacity-50 border border-border rounded-full text-muted-foreground hover:bg-muted hover:text-color',
            classNames?.buttons
          )}
        >
          <Icon size={18} className="transition-colors" />
          <span className="sr-only hidden">{label}</span>
        </button>
      ))}
    </div>
  );
}
