'use client';
import * as React from 'react';
import { AccessStatus } from '@repo/components/error';
import { User } from '@/types/user';
import { strictRole } from '../lib/const/role-status';

type Nullish<T> = T | null | undefined;

interface StrictAccessProps {
  user: User;
  children: React.ReactNode;
  data?: Nullish<{ id?: Nullish<string>; userId?: Nullish<string> }>;
}

export function StrictAccess(props: StrictAccessProps) {
  const { user, children, data } = props;

  if (!user) return null;

  const strictUser = strictRole(user) ? false : user.refId !== data?.userId;

  if (data && strictUser) return <AccessStatus status="access-denied" />;

  return <>{children}</>;
}
