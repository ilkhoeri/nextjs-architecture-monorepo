'use client';
import React from 'react';
import { cnx } from 'xuxi';
import Link from 'next/link';
import { User } from '@/types/user';
import { siteUrl } from '@/app/config/site';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { StatusAccess } from '@repo/components/error';
import { buttonVariants, ClientOnly } from '@repo/ui';
import { cn, formatTitle, TextTransform } from '@repo/utils';

export function AuthFooter() {
  const path = usePathname();

  const matchPath = [
    { path: 'sign-up', label: 'Already have an account?', title: 'Sign in', redirect: 'sign-in', color: '#846bff' },
    { path: 'sign-in', label: 'Don’t have an account?', title: 'Sign up', redirect: 'sign-up', color: '#f36b16' },
    { path: 'sign-out', color: '#52a9ff' },
    { path: 'error', color: '#fb2c36' },
    { path: 'verification', color: '#0092b8' }
  ].find(x => `/auth/${x.path}` === path);

  return (
    <div className="auth-footer 🔒️ auth-1m2f0ge" suppressHydrationWarning style={{ '--match-color': matchPath?.color } as React.CSSProperties}>
      {matchPath && matchPath.redirect && (
        <div className="py-4 px-8 flex flex-row items-stretch justify-start gap-1 m-0">
          <span className="m-0 text-tiny text-color" data-localization-key="signUp.start.actionText">
            {matchPath.label}
          </span>
          <Link
            className="inline-flex items-center justify-center cursor-pointer text-tiny font-medium text-[var(--match-color)] hover:underline hover:underline-offset-4"
            href={siteUrl(`/auth/${matchPath.redirect}`)}
          >
            {matchPath.title}
          </Link>
        </div>
      )}

      <div className="auth-internal-1dauvpw">
        <div className="auth-internal-1k7jtru"></div>
        <div className="auth-internal-pe6vm4">
          <div className="auth-internal-y44tp9">
            <div className="flex flex-row items-center justify-center gap-1 text-color">
              <p className="text-tiny font-medium leading-[1.33333]">Powered by</p>
              <a
                aria-label="logo"
                className="group inline-flex [-webkit-box-align:center] items-center gap-0.5 cursor-pointer [text-decoration:none] font-normal text-[.8125rem] leading-[1.38462]"
                href="https://github.com/ilkhoeri"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                <img src="/assets/oeri-logo.png" alt="Logo" className="size-[.875rem]" />
                <span className="font-bold text-muted-foreground group-hover:text-purple-500 transition-colors duration-300">oeri</span>
              </a>
            </div>
          </div>
          <p className="text-tiny text-[#f36b16] font-semibold hidden"></p>
        </div>
      </div>
    </div>
  );
}

export function AuthErrorMessage({ accounts }: { accounts: User['accounts'] | null }) {
  const params = useSearchParams();
  const error = params.get('error');
  const email = params.get('email');
  const provider = params.get('provider');
  const message = params.get('details');

  const accessDenied = error === 'AccessDenied';
  const OAuthFailed = error === 'OAuthSignInFailed';

  const isDev = process.env.NODE_ENV !== 'production';

  const providerList = accounts?.map(acc => `• ${TextTransform.text(acc.provider)}`);
  const errorDescription = [
    cnx(isDev ? formatTitle(error, 'auto') : provider && `Failed to sign in with ${decodeURIComponent(provider)}`),
    cnx(email ? `(${email && decodeURIComponent(email)})` : 'Please try again or contact support')
  ];
  const oAuthFailedMessage = isDev
    ? message && decodeURIComponent(message).trim()
    : OAuthFailed && `Your email is already registered with:\n${providerList?.join(`\n`)}\nTry different login method`;

  return (
    <div className="size-full flex flex-col justify-center items-center">
      <StatusAccess
        status="internal-error"
        title={error && 'Authentication Error'}
        description={error && accounts && errorDescription}
        classNames={{ root: '-my-20', title: 'text-red-500', svg: 'mt-4' }}
      />
      {accessDenied && !accounts && (
        <p className="text-sm text-muted-foreground">
          <b>Possible reasons</b>: <br />
          Email not verified or account not linked.
        </p>
      )}

      {OAuthFailed && (
        <ClientOnly>
          <div className="space-y-2 *:text-[.8125rem] w-full max-w-full">
            {accounts && oAuthFailedMessage && <p className="text-red-600 whitespace-pre-wrap overflow-x-auto text-left w-full max-w-full rounded-lg">{oAuthFailedMessage}</p>}

            {isDev && (
              <div className="mt-4 *:text-[.8125rem] text-muted-foreground">
                <p>Possible solutions:</p>
                <ul className="list-disc pl-5 text-left">
                  <li>Try again later</li>
                  <li>Contact support with this error details</li>
                  <li>Try different login method</li>
                </ul>
              </div>
            )}
          </div>
        </ClientOnly>
      )}

      <a href="/auth/sign-in" className={cn(buttonVariants({ size: 'sm' }), 'relative bg-gradient-button w-full mt-6 mb-2 group text-white')}>
        <span className="tracking-normal leading-0 mr-2 -mt-[2px] font-bold">←</span>
        <span className="group-hover:underline underline-offset-4">Back to Sign In</span>
      </a>
    </div>
  );
}
