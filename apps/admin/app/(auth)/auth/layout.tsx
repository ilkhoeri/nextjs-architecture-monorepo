import { Navigation } from '@repo/ui/navigation';
import { AuthFooter } from './components';
import { Suspense } from 'react';

export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-svh">
      <div className="relative size-full flex flex-col gap-4 p-6 md:p-10 bg-background transition-[padding] max-sm:has-[form:focus-within_input:focus-visible]:pb-[40svh]">
        <div className="grid grid-cols-3 justify-items-center items-center">
          <Navigation instance="back" className="mr-auto rtl:mr-0 rtl:ml-auto text-color" />
          <p></p>
          <p className="ml-auto">
            <span tabIndex={-1} className="text-sm font-bold text-muted hover:text-muted-foreground transition-colors duration-300"></span>
          </p>
        </div>

        <Suspense>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 box-zko3ih">
            <div className="box-hkbunq">{children}</div>
            <AuthFooter />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
