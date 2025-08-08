import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { CredentialsSchema } from '@/schemas/user';

import type { NextAuthConfig } from 'next-auth';

async function getUserByEmail(email: string) {
  try {
    return await db.user.findUnique({ where: { email } });
  } catch {
    return null;
  }
}

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string
    }),
    // https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/refreshing-user-access-tokens#refreshing-a-user-access-token-with-a-refresh-token
    Github({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = CredentialsSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      }
    })
  ]
} satisfies NextAuthConfig;
