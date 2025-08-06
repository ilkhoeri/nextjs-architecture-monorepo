import Link from 'next/link';
import { cn } from '@repo/utils';
import { ROUTES } from '@/routes';
import { NavLinkItem } from './navlink';
import { cvx, cvxVariants } from 'xuxi';
import { LogoImage } from './logo-image';
import { ThemeToggle } from '@/ui/toggle';
import { BrandOeriIcon } from '@repo/icons';
import { siteConfig } from '@/app/site/config';
import { Polymorphic } from '@repo/ui/polymorphic-slot';

const classes = cvx({
  variants: {
    selector: {
      footer: 'mx-auto flex flex-col w-full relative text-sm bg-background-theme max-w-screen-3xl',
      section: 'px-6 md:px-8 lg:px-10 xl:px-10',
      list: 'gap-x-6 grid sm:grid-cols-2 md:grid-flow-col md:grid-cols-4 md:grid-rows-5 lg:grid-cols-5',
      listitem: 'content-center !list-none flex items-center',
      link: 'line-clamp-1 text-xs md:text-sm 2xl:text-base text-muted-foreground hover:text-color transition ease-in-out duration-150 rounded-md py-1 underline-hover data-[path=active]:font-semibold data-[path=active]:text-constructive [&_mark]:data-[mark=true]:ml-[10px]'
    },
    section: {
      top: 'border-t border-t-muted pt-4 w-full grid items-start grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 text-muted-foreground',
      bottom: 'py-2 gap-4 flex flex-col md:flex-row justify-between items-center text-muted-foreground text-sm font-geist-mono'
    }
  }
});

interface StylesProps {
  selector?: NonNullable<cvxVariants<typeof classes>['selector']>;
  opts?: { section?: NonNullable<cvxVariants<typeof classes>['section']>; className?: string };
}
function getStyles(selector: StylesProps['selector'], opts: StylesProps['opts'] = {}) {
  return { className: cn(classes({ selector, section: opts.section }), opts.className) };
}

export async function NavFoot() {
  const currentYear = new Date().getFullYear();

  return (
    <footer {...getStyles('footer')}>
      <Polymorphic el="section" {...getStyles('section', { section: 'top' })}>
        <div className="col-span-1 w-max lg:col-span-2">
          <Link href="/" className="flex flex-initial items-center rounded-lg font-semibold text-muted-foreground hover:text-color" aria-label="HOME">
            <LogoImage className="mr-2 flex h-[72px] w-[72px] flex-none items-center justify-center rounded-xl bg-background-theme p-1" />
          </Link>
        </div>

        {ROUTES['footRoutes'] && ROUTES['footRoutes']?.length > 0 && (
          <Polymorphic el="nav" className="col-span-1 lg:col-span-10">
            <ul role="list" {...getStyles('list')}>
              {ROUTES['footRoutes'].map((i, index) => (
                <li key={index} role="listitem" {...getStyles('listitem')}>
                  <NavLinkItem href={i.href} title={i.title} {...getStyles('link')} />
                </li>
              ))}
            </ul>
          </Polymorphic>
        )}
      </Polymorphic>

      <Polymorphic el="section" className="relative flex w-full flex-row flex-nowrap justify-end gap-px border-b border-b-muted px-4 pb-4 pt-2 text-muted-foreground">
        <ThemeToggle
          unstyled={{ wrapper: true, buttons: true }}
          classNames={{
            wrapper: cn('flex items-center p-[3px] border rounded-full w-max'),
            buttons: cn(
              'inline-flex items-center justify-center ring-offset-background-theme transition-colors text-muted-foreground [@media(hover:hover)]:hover:data-[state=active]:bg-constructive/75 [@media(hover:hover)]:hover:bg-muted/75 [@media(hover:hover)]:hover:text-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background-theme focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sizer [--sz:32px] p-0.5 rounded-full data-[state=active]:bg-constructive data-[state=active]:text-white'
            )
          }}
        />
      </Polymorphic>

      <Polymorphic el="section" {...getStyles('section', { section: 'bottom' })}>
        <div className="flex flex-col items-center gap-x-4 sm:flex-row">
          <p>
            &copy; {currentYear} {siteConfig().creator}
          </p>
          <hr className="hidden h-4 w-[1px] border-l border-l-neutral-400 sm:inline-block" />
          <p>Designed in Earth-616</p>
        </div>

        <div dir="ltr" className="group flex cursor-default items-center md:ml-auto md:rtl:ml-0 md:rtl:mr-auto">
          Build by
          <a
            tabIndex={-1}
            rel="noopener noreferrer nofollow"
            target="_blank"
            href="https://oeri.vercel.app/"
            aria-label="Oeri UI"
            className="flex flex-row items-center justify-center mx-2 cursor-pointer gap-2 rounded-lg transition-colors duration-200 hover:text-color"
          >
            <BrandOeriIcon size={22} aria-label="oeri Logo" className="duration-200 ease-linear group-hover:scale-110" /> oeri
          </a>
        </div>
      </Polymorphic>
    </footer>
  );
}
