import db from './db';
// import jwt from 'jsonwebtoken';
// import { headers } from 'next/headers';
import { auth } from '@/auth/auth';
import { Prisma } from '@prisma/client';
import { User } from '@/types/user';
import { isEmail } from '@repo/utils/text-parser';
import { strictRole } from '@/lib/const/role-status';
import { DefaultArgs } from '@prisma/client/runtime/library';

/**
 * @param status (username, padStart)
 * @returns Promise<string>
 */
export async function getUsername(username: string, padStart: number = 1): Promise<string> {
  try {
    const userCount = await db.user.count({ where: { username } });
    const entry = String(userCount + 1).padStart(padStart, '0');

    return username + entry;
  } catch (error) {
    console.error('[GENERATE USERNAME ERROR]:', error);
    return 'Error';
  }
}

type GetUsersOptions = Prisma.UserWhereInput;

export async function getUsers(where: GetUsersOptions = {}) {
  const session = await auth();

  if (!session?.user?.email) return [];

  try {
    return await db.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        NOT: {
          email: session.user.email
        },
        ...where
      }
    });
  } catch (error: any) {
    return [];
  }
}

export async function getCurrentRole() {
  try {
    return (await auth())?.user?.role;
  } catch (_e) {
    return undefined;
  }
}

export async function gerUserById(id: string) {
  try {
    return await db.user.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth();

    if (!session || !session?.user) return null;

    const data = await db.user?.findUnique({
      where: { id: session.user.id },
      include: {
        address: true,
        about: true,
        links: true
      }
    });

    return data as User;
  } catch (_e) {
    return null;
  }
}

/**
// JWT_SECRET diatur di .env, sama dengan yang digunakan untuk menandatangani customJwt
const JWT_SECRET = process.env.JWT_SECRET;

export async function getCurrentUser() {
  // --- Opsi 1: Coba dapatkan user dari sesi NextAuth.js (menggunakan cookie) ---
  try {
    const session = await auth();

    if (session?.user?.id) {
      const user = await db.user?.findUnique({
        where: { id: session.user.id },
        include: {
          address: true,
          about: true,
          links: true
        }
      });
      if (user) return user as User; // Mengembalikan user jika ditemukan dari sesi
    }
  } catch (e) {
    console.error('Error getting user from NextAuth.js session:', e);
    // Lanjutkan ke validasi JWT jika sesi gagal
  }

  // --- Opsi 2: Jika tidak ada sesi atau sesi tidak valid, coba validasi JWT dari Header Authorization ---
  const headersList = await headers();
  const authorization = headersList.get('authorization');

  if (!authorization) {
    return null; // Tidak ada header Authorization
  }

  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer' || !token) {
    return null; // Format token tidak valid
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined! Cannot validate JWT.');
    return null; // Secret tidak ada
  }

  try {
    // Asumsi payload JWT Anda memiliki properti yang cukup untuk mengidentifikasi user
    // Misalnya, 'id' atau 'email' yang unik
    const decoded = jwt.verify(token, JWT_SECRET) as { id?: string; email?: string; [key: string]: any };

    let user = null;
    if (decoded.id) {
      user = await db.user?.findUnique({
        where: { id: decoded.id },
        include: {
          address: true,
          about: true,
          links: true
        }
      });
    } else if (decoded.email) {
      user = await db.user?.findUnique({
        where: { email: decoded.email },
        include: {
          address: true,
          about: true,
          links: true
        }
      });
    }

    if (user) return user as User; // jika ditemukan dari JWT

    return null; // User tidak ditemukan dari JWT
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null; // Token tidak valid atau kadaluarsa
  }
}
*/

type GetOptions = {
  /** Choose, which related nodes to fetch as well */
  include?: Prisma.UserInclude<DefaultArgs> | null | undefined;
  /** Select specific fields to fetch from the User */
  select?: Prisma.UserSelect<DefaultArgs> | null | undefined;
};

export async function getUserByEmail(email: string, args: GetOptions = {}) {
  try {
    return await db.user.findUnique({ where: { email }, ...args });
  } catch {
    return null;
  }
}

export async function getUserByRefId(refId: string) {
  try {
    return await db.user.findUnique({ where: { refId }, include: { accounts: true } });
  } catch {
    return null;
  }
}

export async function getUserByUserName(username: string) {
  try {
    return await db.user.findUnique({ where: { username }, include: { accounts: true } });
  } catch {
    return null;
  }
}

export async function getUserByIdentifier(identifier: string) {
  try {
    return isEmail(identifier) ? await getUserByEmail(identifier, { include: { accounts: true } }) : await getUserByUserName(identifier);
  } catch {
    return null;
  }
}

export async function getAccountByUserId(userId: string) {
  try {
    const account = await db.account.findFirst({
      where: { userId }
    });
    return account;
  } catch {
    return null;
  }
}

export async function getallUserExceptActive(currentSession: User) {
  try {
    return await db.user?.findMany({
      where: strictRole(currentSession)
        ? undefined
        : {
            NOT: { role: 'DEVELOPER', refId: currentSession?.refId, id: currentSession?.id }
          }
    });
  } catch {
    return null;
  }
}
