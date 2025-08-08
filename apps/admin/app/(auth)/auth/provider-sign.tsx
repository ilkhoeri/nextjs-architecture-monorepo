'use client';

import { signIn, useSession } from 'next-auth/react';
import { Button } from '@repo/ui/button';
import { GithubFillIcon, GoogleColorIcon } from '@repo/icons';
import { useSearchParams } from 'next/navigation';
import { SIGNIN_REDIRECT } from '@/routes';

export function ProviderSign() {
  return (
    <div className="flex flex-row items-center gap-2">
      <ProviderSignIn provider="github" />
      <ProviderSignIn provider="google" />
    </div>
  );
}

const providerIcons = {
  google: { name: 'Google', icon: GoogleColorIcon },
  github: { name: 'GitHub', icon: GithubFillIcon }
};

type ProviderSignInProps = {
  provider: keyof typeof providerIcons;
};
export function ProviderSignIn({ provider }: ProviderSignInProps) {
  const Icon = providerIcons[provider].icon;
  const name = providerIcons[provider].name;

  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl');

  function handleSignIn() {
    signIn(provider, {
      callbackUrl: callbackUrl || SIGNIN_REDIRECT
    });
  }

  return (
    <Button type="submit" className="w-full" size="sm" variant="outline" onClick={handleSignIn}>
      <Icon className="mr-2 size-5" />
      <span>{name}</span>
    </Button>
  );
}
