'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useNavContext } from './nav-ctx';
import { NavLinkItem } from '@/ui/navlink';
import { ScrollArea } from '@/ui/scroll-area';
import { ButtonAside, LinkHome } from './navhead';
import { Sheets, SheetsContent, SheetsTrigger } from '@/ui/sheets';
import { formatTitle, FormatTransform } from '@repo/utils';
import { useApp } from '../context/app-context';
import { cvx, cvxVariants } from 'xuxi';
import { ChevronIcon } from '@repo/icons';
import { ROUTES } from '@/routes';
import { cn } from '@repo/utils';

const SPONSORS = {
  navleft: {
    label: 'Oeri UI',
    href: 'https://oeri.vercel.app/',
    images: [
      //
      '/assets/sponsors/diamond/opengraph-oeri.png',
      '/assets/sponsors/diamond/opengraph-3.png',
      '/assets/sponsors/diamond/opengraph-2-solid.png',
      '/assets/sponsors/diamond/oeri-prose.png'
    ]
  }
};

import type { SingleRoute, NestedRoute, InnerRoutes } from '@/routes';

import style from './nav.module.css';

interface NavLeftProps {
  classNames?: { aside?: string; overlay?: string };
  routes?: (InnerRoutes | SingleRoute | NestedRoute)[] | null;
}
export function NavLeft(_props: NavLeftProps) {
  const { classNames, routes = ROUTES['docs'] } = _props;
  const { isMobile, open, setOpen, toggle } = useNavContext();
  const { dir, isHome } = useApp();

  if (isHome) return null;

  return (
    <>
      <aside data-state={isMobile ? (open ? 'open' : 'closed') : undefined} {...getStyles('aside', { className: classNames?.aside })}>
        {isMobile && (
          <hgroup {...getStyles('hgroup')}>
            <LinkHome />
            <ButtonAside
              {...{
                open,
                onOpenChange: setOpen,
                hidden: !isMobile,
                onClick: toggle,
                className: '-mr-1.5 rtl:mr-0 rtl:-ml-1.5'
              }}
            />
          </hgroup>
        )}

        <ScrollArea dir={dir} classNames={{ viewport: classes({ selector: 'nav' }), thumb: 'max-md:sr-only' }}>
          <NavRoutes {...{ routes, setOpen, isMobile }} />
        </ScrollArea>

        <Sponsors />
      </aside>

      <Overlay isMobile={isMobile} open={open} setOpen={setOpen} className={classNames?.overlay} />
    </>
  );
}

function Sponsors() {
  const sponsors = SPONSORS['navleft'];

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const allImages = sponsors.images;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % allImages.length);
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, [allImages.length]);

  const currentImage = allImages[currentIndex];

  if (!sponsors) return null;

  return (
    <Link href={sponsors.href} target="_blank" rel="noopener noreferrer nofollow" className="block mt-2 md:-mb-4 relative size-full max-h-[140px]">
      <Image alt={sponsors.label} fill sizes="500" className="object-cover object-left align-middle rounded-[13px]" src={currentImage} />
    </Link>
  );
}

interface RequiredNavProps {
  isMobile?: boolean;
  setOpen: (v: boolean) => void;
}

interface InnerItemProps extends RequiredNavProps, InnerRoutes {
  format?: FormatTransform;
}
function InnerItem(props: InnerItemProps) {
  const { title, href, format = 'unset', setOpen, isMobile } = props;
  return (
    <NavLinkItem
      href={href}
      title={formatTitle(title, format)}
      className={style.link}
      onClick={() => {
        if (isMobile) {
          setTimeout(() => setOpen(false), 350);
        }
      }}
    />
  );
}

interface SingleItemProps extends RequiredNavProps {
  routes: InnerRoutes[];
}
function SingleItem({ routes, ...props }: SingleItemProps) {
  if (!routes || routes?.length === 0) return null;
  return routes.map((route, index) => <InnerItem key={index} {...route} {...props} />);
}

interface NavRoutesProps extends RequiredNavProps {
  routes: (InnerRoutes | SingleRoute | NestedRoute)[] | null;
}
const isNestedRoute = (route: SingleRoute | NestedRoute): route is NestedRoute => route.data.some(item => 'data' in item);

function NavRoutes(props: NavRoutesProps) {
  const { routes, isMobile, setOpen } = props;
  const required = { isMobile, setOpen };

  if (!routes) return null;

  return routes.map((route, index) => {
    if ('data' in route) {
      if (isNestedRoute(route)) {
        const nestedRoute = route;
        const value = nestedRoute.title.replace(/\s/g, '-').toLowerCase();
        return (
          <Sheets.Accordion key={`nested-${index}`} defaultOpen={value} className={style.collapse}>
            <Sheets.Item value={value}>
              <div data-sheets="trigger-snap">
                <InnerItem href={nestedRoute.href || ''} title={nestedRoute.title} {...required} />
              </div>
              <SheetsContent unstyled data-nested className="z-1 w-full">
                <NavRoutes routes={nestedRoute.data} {...required} />
              </SheetsContent>
            </Sheets.Item>
          </Sheets.Accordion>
        );
      } else {
        const singleRoute = route;
        const value = singleRoute.title.replace(/\s/g, '-').toLowerCase();
        return (
          <Sheets.Accordion key={`single-${index}`} defaultOpen={value} className={style.collapse}>
            <Sheets.Item value={value}>
              <div data-sheets="trigger-snap">
                <InnerItem href={singleRoute.href || ''} title={singleRoute.title} {...required} />
                <SheetsTrigger unstyled aria-label={singleRoute.title} {...getStyles('trigger')}>
                  <ChevronIcon chevron="down" data-sheets="chevron" />
                </SheetsTrigger>
              </div>
              <SheetsContent data-single>
                {singleRoute.data.map((item, i) =>
                  'data' in item ? <NavRoutes key={`nested-in-single-${i}`} routes={[item]} {...required} /> : <InnerItem key={`inner-${i}`} {...item} {...required} />
                )}
              </SheetsContent>
            </Sheets.Item>
          </Sheets.Accordion>
        );
      }
    } else {
      return <InnerItem key={`${route.href}-${index}`} {...route} {...required} />;
    }
  });
}

function Overlay({ isMobile, open, setOpen, className }: { isMobile?: boolean; open?: boolean; setOpen: (value: boolean) => void; className?: string }) {
  if (!isMobile || !open) return null;

  return <span onClick={() => setOpen(false)} {...getStyles('overlay', { className })} />;
}

function getStyles(selector: NonNullable<cvxVariants<typeof classes>['selector']>, opts: { className?: string } = {}) {
  return { className: cn(classes({ selector }), opts.className) };
}

const classes = cvx({
  variants: {
    selector: {
      aside:
        'flex flex-col bg-background-theme w-0 m-0 h-[--aside-h] max-h-[--aside-h] [--aside-h:100dvh] md:[--aside-h:calc(100dvh-2rem)] md:mt-[2rem] top-0 bottom-0 md:sticky md:top-[calc(var(--navbar)+2rem)] max-md:data-[state=closed]:opacity-0 overflow-hidden md:transition-none [transition:all_0.5s_ease] focus-visible:outline-0 [--aside-w:calc(var(--aside)-1rem)] md:ltr:pr-6 md:ltr:pl-4 md:rtl:pl-6 md:rtl:pr-4 md:ltr:left-0 md:rtl:right-0 md:w-[--aside-w] md:min-w-[--aside-w] md:max-w-[--aside-w] max-md:fixed max-md:z-[111] max-md:ltr:left-0 max-md:rtl:right-0 max-md:border-0 max-md:ltr:border-r-[0.04rem] max-md:rtl:border-l-[0.04rem] max-md:border-muted/75 max-md:rtl:border-r-0 max-md:rtl:border-l max-md:data-[state=open]:w-[--aside-w] max-md:data-[state=open]:min-w-[--aside-w] max-md:data-[state=open]:max-w-[--aside-w] data-[state=open]:ltr:pl-6 data-[state=open]:ltr:pr-6 data-[state=open]:rtl:pr-3 max-md:data-[state=closed]:ltr:pl-0 max-md:data-[state=closed]:rtl:pr-0 max-md:data-[state=closed]:ltr:pr-0 max-md:data-[state=closed]:rtl:pl-0 max-md:pb-4 md:pb-20',
      hgroup: 'mt-2 mb-4 flex h-[--navbar] flex-row items-center justify-between md:sr-only md:hidden',
      nav: 'relative items-start justify-start max-md:pt-0 overflow-y-auto overflow-x-hidden webkit-scrollbar px-4',
      overlay:
        'pl-8 rtl:pl-0 rtl:pr-8 text-color flex flex-row-reverse items-center gap-2 md:hidden md:sr-only fixed max-md:z-[95] w-full h-full min-w-full min-h-full inset-y-0 inset-x-0 backdrop-blur-[0.5px] bg-background/35 supports-[backdrop-filter]:bg-background/35',
      trigger: ' flex items-center justify-center focus-visible:ring-inset focus-visible:ring-offset-[-2px] text-muted-foreground data-[state*=open]:text-color'
    }
  }
});
