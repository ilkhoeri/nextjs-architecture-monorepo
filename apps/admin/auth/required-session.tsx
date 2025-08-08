'use client';
import * as React from 'react';
import { notFound, redirect } from 'next/navigation';
import { SIGNIN_REDIRECT } from '../routes';
import { useApp } from '../context/app-context';
import { IsRole } from '../types/user';

export type RequiredSessionProps = Readonly<{
  children: React.ReactNode;
  slug?: string[];
  redirect?: 'notFound()' | (string & {});
}>;

export function RequiredSession(props: RequiredSessionProps) {
  const { children, slug, redirect: redirectingTo = SIGNIN_REDIRECT } = props;
  const { user } = useApp();

  function redirectRoute() {
    return redirectingTo === 'notFound()' ? notFound() : redirect(redirectingTo);
  }

  // Slug validation
  if (slug && slug?.length) {
    const [firstSlug, ..._] = slug;
    const isFirstSlugNotSame = firstSlug !== user?.refId;

    if ((slug.length === 1 && isFirstSlugNotSame) || (slug.length === 2 && isFirstSlugNotSame)) {
      redirectRoute();
    }
  }

  return <>{children}</>;
}

type StrictProps = Readonly<{
  children: React.ReactNode;
  strictRole?: boolean | IsRole | IsRole[];
}>;

export function Strict(props: StrictProps) {
  const { children, strictRole } = props;
  const { user } = useApp();

  if (!user) return null;

  const strictByRole = strictRole && typeof strictRole !== 'boolean' ? (Array.isArray(strictRole) ? !strictRole.includes(user?.role) : user?.role !== strictRole) : strictRole === true;

  if (strictByRole) return null;

  return <React.Suspense>{children}</React.Suspense>;
}
