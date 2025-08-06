'use client';

import * as React from 'react';
import { cn } from '@repo/utils';
import { Button } from './button';
import { useRouter } from 'next/navigation';
import { ChevronIcon } from '@repo/icons';

enum PrefetchKind {
  AUTO = 'auto',
  FULL = 'full',
  TEMPORARY = 'temporary'
}
interface NavigateOptions {
  scroll?: boolean;
}
interface PrefetchOptions {
  kind: PrefetchKind;
}
interface NavigationBaseProps extends React.ComponentPropsWithRef<typeof Button> {
  label?: string;
}

export type NavigationProps =
  | ({ instance: 'forward' | 'refresh' | 'break' } & NavigationBaseProps)
  | ({ instance: 'back'; onBackResolve?: (location: Location) => string | null } & NavigationBaseProps)
  | ({ instance: 'push'; href: string; options?: NavigateOptions } & NavigationBaseProps)
  | ({ instance: 'replace'; href: string; options?: NavigateOptions } & NavigationBaseProps)
  | ({ instance: 'prefetch'; href: string; options?: PrefetchOptions } & NavigationBaseProps);

export function Navigation(_props: NavigationProps) {
  const { label = 'Back', children, onClick, className, instance, 'aria-label': aL, disabled, ...props } = _props;
  const router = useRouter();

  const hasRecentPushState = React.useRef(false);

  const [canGoBack, setCanGoBack] = React.useState(true);

  React.useEffect(() => {
    // Aturan umum: jika history length <= 1, maka tidak ada halaman sebelumnya
    setCanGoBack(window.history.length > 1);
  }, []);

  // Override pushState to detect open:true
  React.useEffect(() => {
    const originalPushState = window.history.pushState;

    window.history.pushState = function (state, title, url) {
      if (state && state.open) {
        hasRecentPushState.current = true;

        // Reset flag after a short time, to not persist across unrelated navigations
        setTimeout(() => {
          hasRecentPushState.current = false;
        }, 300);
      }

      return originalPushState.apply(this, arguments as any);
    };

    return () => {
      window.history.pushState = originalPushState;
    };
  }, []);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    switch (instance) {
      case 'back': {
        if (!canGoBack) return; // tidak bisa kembali

        if (!hasRecentPushState.current) {
          const resolved = _props.onBackResolve?.(window.location);
          if (resolved) {
            router.replace(resolved);
            break;
          }
        }

        router.back();
        break;
      }

      case 'forward':
      case 'refresh':
        router[instance]();
        break;

      case 'push':
      case 'replace':
        router[instance](_props.href, _props.options);
        break;

      case 'prefetch':
        router[instance](_props.href, _props.options);
        break;

      case 'break':
        break;
    }
    onClick?.(e);
  }

  return (
    <Button {...props} onClick={handleClick} disabled={disabled || (instance === 'back' && !canGoBack)} aria-label={aL || label} className={cn('text-sm font-bold', className)}>
      {children ?? (
        <>
          <ChevronIcon chevron="left" size={28} />
          {label}
        </>
      )}
    </Button>
  );
}
