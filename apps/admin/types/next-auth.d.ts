import type { User } from '@prisma/client';
import type { DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & User & { isOAuth: boolean };

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
