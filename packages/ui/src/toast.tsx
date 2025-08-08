'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';
import { useIsMobile } from '@repo/hooks';

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = (props: ToasterProps) => {
  const { theme = 'system' } = useTheme();
  const isMobile = useIsMobile();
  return (
    <Sonner
      {...props}
      theme={theme as ToasterProps['theme']}
      position={props.position || (isMobile ? 'top-center' : 'bottom-right')}
      className="toaster group md:max-w-[426px] [--width:100%_!important] flex items-center justify-center"
      toastOptions={{
        classNames: {
          toast:
            'group toast !gap-3 *:select-none *:pointer-events-none *:font-inter !z-[calc(121+var(--z-index,0))] group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg bg-background-theme [--border-radius:1rem]',
          description: 'group-[.toast]:!text-muted-foreground group-[.toast]:whitespace-pre-wrap text-[.8125rem]',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          title: 'whitespace-pre-wrap font-bold text-sm',
          icon: '[--sz:1.5rem] size-[var(--sz)] [&_svg]:size-[var(--sz)] relative flex items-center justify-center',
          loader:
            'group loader [&:where(.group.loader)]:![--size:calc(var(--sz)/1.5)] has-[.sonner-spinner]:top-1/2 has-[.sonner-spinner]:left-1/2 has-[.sonner-spinner]:-translate-x-1/2 has-[.sonner-spinner]:-translate-y-1/2 ',
          loading: 'loading'
        }
      }}
      offset={{ bottom: '50px' }}
    />
  );
};
