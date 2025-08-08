import db from '@/lib/db';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'bson';
import NextAuth from 'next-auth';
import authConfig from './config';
import { register } from './signup';
import { pickUserEmail } from '@repo/utils';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { AccountStatus, UserRole } from '@prisma/client';
import { getNameParts } from '@/lib/const/get-from-user';
import { getAccountByUserId, gerUserById, getUsername } from '@/lib/get-user';
// import { getTwoFactorConfirmationByUserId } from './tokens/two-factor-confirmation';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update: update
} = NextAuth({
  adapter: PrismaAdapter(db as any),
  session: { strategy: 'jwt' },
  pages: {
    newUser: '/auth/sign-up',
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-out',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request'
  },
  events: {
    async linkAccount({ user }) {
      try {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() }
        });
      } catch (error) {
        console.error('Error in linkAccount event:', error);
      }
    }
  },
  callbacks: {
    async signIn({ account, profile, user }) {
      try {
        // Skip untuk credentials provider
        if (account?.provider === 'credentials') return true;

        if (!user.email) {
          console.error('No email found in user object');
          return false;
        }

        // Normalisasi data dari berbagai provider
        const email = user.email.toLowerCase();
        const name = user.name || profile?.name || ((profile as any)?.login as string) || pickUserEmail(email);
        const image = user.image || profile?.picture || (profile as any)?.avatar_url;

        // Cari user yang sudah ada
        const existingUser = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            password: true,
            accounts: true
          }
        });

        const newAccount = {
          type: 'oauth',
          provider: account?.provider!,
          providerAccountId: account?.providerAccountId!,
          access_token: account?.access_token,
          token_type: account?.token_type,
          scope: account?.scope
        };

        if (!existingUser) {
          // Jika user belum ada, buat user + account baru
          const username = await getUsername(name);
          await register({
            data: {
              email: user.email!,
              name: name,
              image: image,
              username: username,
              accounts: {
                create: newAccount
              }
            },
            include: {
              accounts: true
            }
          });
          return true;
        }

        // 1. Cek apakah user sudah terdaftar (berdasarkan email)
        // Cek apakah provider sudah terdaftar
        // const existingAccount = existingUser.accounts.find(acc => acc.provider === account?.provider && acc.providerAccountId === account?.providerAccountId);
        const existingAccount = await db.account.findFirst({
          where: {
            userId: existingUser.id,
            provider: account?.provider,
            providerAccountId: account?.providerAccountId
          }
        });

        // 2. Cek apakah user memiliki account dan tidak memiliki password
        // asumsi jika user login menggunakan provider harus dipastikan tidak memiliki password
        if (!existingAccount && !existingUser.password && account) {
          // Tambahkan account baru jika belum ada
          // 3. Jika user.account sudah ada, cek apakah provider sudah terhubung / sudah ada di user.account
          // Jika provider belum terdaftar, tambahkan
          await db.account.create({
            data: {
              ...newAccount,
              userId: existingUser.id
            }
          });
        }

        // Update data user (jika perlu)
        await db.user.update({
          where: { id: existingUser.id },
          data: {}
        });

        /** uncomment ketika subscribe plugin `resend`
        // Prevent sign in without email verification
        if (!existingUser?.emailVerified) return false;

        if (existingUser.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
          if (!twoFactorConfirmation) return false;
          // Delete two factor confirmation for next sign in
          await db.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id }
          });
        }
          */

        return true;
      } catch (error) {
        // Redirect ke halaman error dengan membawa email dan error detail
        const errorUrl = new URL('/auth/error', `${process.env.NEXT_PUBLIC_SITE_URL}/`);
        // errorUrl.searchParams.set('error', 'AccessDenied');
        errorUrl.searchParams.set('error', 'OAuthSignInFailed');

        if (user?.email) {
          errorUrl.searchParams.set('email', encodeURIComponent(user.email));
        }

        if (account?.provider) {
          errorUrl.searchParams.set('provider', encodeURIComponent(account.provider));
        }

        if (error instanceof Error) {
          errorUrl.searchParams.set('details', encodeURIComponent(error.message));
        }

        return errorUrl.toString();
      }
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (token.status && session.user) {
        session.user.status = token.status as AccountStatus;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        const [firstName, lastName] = getNameParts(token.name as string);

        session.user.refId = token.refId as string;
        session.user.username = token.username as string;
        session.user.firstName = firstName as string;
        session.user.lastName = lastName as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.phone = token.phone as string;
        session.user.isOAuth = token.isOAuth as boolean;

        // Kirim JWT kustom Anda ke sesi klien
        // session.googleAccessToken = (token as any).googleAccessToken;
        (session as any).custom_jwt = (token as any).custom_jwt; // Tambahkan ke objek sesi
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existing = await gerUserById(token.sub);

      if (!existing) return token;

      const existingAccount = await getAccountByUserId(existing.id);

      token.isOAuth = !!existingAccount;
      token.refId = existing.refId;
      token.username = existing.username;
      token.firstName = existing.firstName;
      token.lastName = existing.lastName;
      token.name = existing.name;
      token.email = existing.email;
      token.isTwoFactorEnabled = existing.isTwoFactorEnabled;
      token.role = existing.role;
      token.status = existing.status;
      token.phone = existing.phone;

      // Simpan access_token dari Google
      // token.googleAccessToken = existing.access_token;

      // Jika user object dari authorize memiliki properti 'jwt'
      token.custom_jwt = jwt.sign(existing, process.env.JWT_SECRET!, { expiresIn: '1h' }); // Simpan JWT kustom Anda di token Auth.js

      return token;
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.AUTH_SECRET,
  ...authConfig
});
