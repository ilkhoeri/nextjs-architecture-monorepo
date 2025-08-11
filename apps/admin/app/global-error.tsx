'use client';
import { geistMono, geistSans } from './config/font';
import { ErrorMessages } from '@repo/components/error';
import { HttpErrorProps } from '@repo/components/error';
import { ThemeProvider, ThemeStateHidden } from '@repo/components/theme/index';

export default function GlobalError({ error, reset }: HttpErrorProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background overflow-x-hidden overflow-y-auto pt-4 pb-8`}>
        <ThemeProvider>
          <div className="size-full min-h-max flex flex-col items-center justify-center pt-12 pb-20 px-4 text-center gap-6">
            <ErrorMessages error={error} reset={reset} origin={process.env.NEXT_PUBLIC_SITE_URL} />
            <ThemeStateHidden />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
