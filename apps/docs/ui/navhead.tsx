'use client';
import React from 'react';
import Link from 'next/link';
import { cn } from '@repo/utils';
import { Sheets } from '@repo/ui/sheets';
import { Button } from '@repo/ui';
import { ROUTES } from '@/routes';
import { NavLinkItem } from './navlink';
import { LogoImage } from './logo-image';
import { Burger } from '@repo/ui/burger';
import { useNavContext } from './nav-ctx';
import { siteConfig } from '@/app/site/config';
import { TextDirectionIcon } from '@repo/icons';
import { useApp } from '../context/app-context';
import { LocaleSwitcher } from '@/i18n/components/locale-switcher';
import { cvx, cvxVariants } from 'xuxi';

export function NavHead() {
  const { toggleDirection, dir, isHome, dict, lang } = useApp();
  const { isMobile, toggle, open, setOpen } = useNavContext();

  return (
    <header
      dir={dir}
      className={cn(
        'max-w-var border-b-muted/75 bg-background-theme/95 supports-[backdrop-filter]:bg-background-theme/60 fixed inset-x-0 top-0 z-[var(--z,88)] mr-[var(--has-scrollbar)] flex h-[var(--navbar)] w-[calc(100%-var(--has-scrollbar,0px))] items-center justify-between border-0 border-b-[0.04rem] py-4 backdrop-blur md:px-5 xl:px-6'
      )}
    >
      <div dir={dir} className="max-w-screen-3xl 3xl:px-12 relative mx-auto flex w-full items-center">
        <LinkHome open={isMobile && !isHome ? open : undefined} className="[transition:all_0.5s_ease] max-md:data-[state=open]:translate-x-[-32px] max-md:data-[state=open]:opacity-0" />

        {!isMobile && ROUTES?.['services'] && ROUTES?.['services']?.length > 0 && (
          <div dir={dir} className="relative hidden h-full items-center justify-between rounded-sm text-sm font-medium md:flex ltr:ml-10 ltr:mr-auto rtl:ml-auto rtl:mr-10">
            {ROUTES['services'].map(i => (
              <Link key={i.href} href={i.href} role="button" className={toggleHeadClasses({ toggle: 'inAll' })}>
                <span className="z-1 relative px-2 py-1">{i.title}</span>
              </Link>
            ))}
          </div>
        )}

        <div dir={dir} className={cn('flex items-center ltr:ml-auto rtl:ml-0 rtl:mr-auto gap-1.5', { 'px-2': isHome })}>
          <div className="grid grid-flow-col gap-0.5">
            <LinksSection />

            <LocaleSwitcher
              dict={dict}
              lang={lang}
              align={dir === 'ltr' ? 'end' : 'start'}
              className={toggleHeadClasses({ toggle: 'inLarge', className: '[--color:white] p-0 overflow-hidden border-0' })}
            />

            <Button unstyled onClick={toggleDirection} className={toggleHeadClasses({ toggle: 'inLarge', className: '[--color:#167ee6] text-white max-md:hidden' })}>
              <TextDirectionIcon dir={dir} size={22} />
            </Button>
          </div>
        </div>

        <ButtonAside
          {...{ open, onOpenChange: setOpen, onClick: toggle }}
          hidden={!isMobile || isHome}
          className="max-md:mx-2 max-md:data-[state=open]:translate-x-[212px] max-md:data-[state=open]:opacity-0 ltr:[--x:calc(212px)] rtl:[--x:calc(212px*-1)]"
        />
      </div>
    </header>
  );
}

export function LinkHome({ className, open }: { open?: boolean; className?: string }) {
  const { dir } = useApp();
  return (
    <Sheets.Dropdown align={dir === 'rtl' ? 'end' : 'start'} sideOffset={0} clickOutsideToClose modal>
      <Sheets.Trigger unstyled openChangeOnContextMenu>
        <Link
          data-state={typeof open !== 'undefined' ? (open ? 'open' : 'closed') : undefined}
          href="/"
          aria-label="oeri"
          className={cn('flex flex-row items-center gap-2 rounded-lg px-2 py-1 text-3xl leading-none duration-75 hover:text-constructive-foreground', className)}
        >
          <LogoImage size={30} />
          <span className="font-orelega-one tracking-wide">{siteConfig().name}</span>
        </Link>
      </Sheets.Trigger>

      <Sheets.Content className="w-44 z-99 min-w-[12.5rem] rounded-xl bg-background-theme p-2 shadow-[0_10px_32px_rgba(34,42,53,0.15),0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.08),0_1px_1px_rgba(34,42,53,0.1),0_24px_68px_rgba(47,48,55,0.1)] ring-constructive/5">
        <Link
          className="block w-full gap-2 rounded-sm p-2 text-sm/5 outline-none transition-colors duration-75 hover:bg-constructive-emphasis/5"
          role="menuitem"
          tabIndex={-1}
          data-orientation="vertical"
          href="/branding"
        >
          <div className="flex items-center gap-x-2">
            <LogoImage size={20} />
            <div className="font-medium">Branding assets</div>
          </div>
          <div className="mt-0.5 text-left rtl:text-right text-muted-foreground">View Logos</div>
        </Link>
      </Sheets.Content>
    </Sheets.Dropdown>
  );
}

const toggleHeadVariants = cvx({
  assign: 'centered transition-colors cursor-pointer',
  variants: {
    toggle: {
      inAll: 'data-[active]:text-color h-6 select-none rounded-sm',
      inLarge:
        'relative rounded-md ring-offset-background-theme text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:text-color sizer [--sz:32px] p-0.5 bg-[var(--color)] border border-[var(--color)] focus-visible:ring-[var(--color)] [&_svg]:hover:text-white hover:bg-[var(--color)] [@media(hover:hover)]:hover:bg-[var(--color)]'
    }
  }
});

function toggleHeadClasses({ className, toggle }: { className?: string } & cvxVariants<typeof toggleHeadVariants> = {}) {
  return cn(toggleHeadVariants({ toggle }), className);
}

function LinksSection() {
  if (!ROUTES?.['sections']?.length) return null;

  return ROUTES['sections'].map((i, __i) => (
    <NavLinkItem
      key={__i}
      icon={i.icon}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label={i.label}
      href={i.href}
      iconProps={{
        currentFill: i.label.includes('Collective') ? 'fill-stroke' : 'fill',
        fill: 'white',
        stroke: 'white',
        size: 22
      }}
      className={toggleHeadClasses({ toggle: 'inLarge', className: 'max-md:hidden max-md:last-of-type:flex' })}
      style={{
        '--color': i.color
      }}
    />
  ));
}

export function ButtonAside(_props: React.ComponentProps<typeof Burger>) {
  const { hidden, open, onClick, onOpenChange, className } = _props;
  if (hidden) return null;
  return (
    <Burger
      {...{
        open,
        onOpenChange,
        className: cn('relative z-10 scale-100 opacity-100 md:sr-only md:hidden lg:scale-0 lg:opacity-0', className),
        onClick
      }}
    />
  );
}
