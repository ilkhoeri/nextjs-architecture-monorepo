'use server';
import { cookies } from 'next/headers';

export async function setCookies(name: string, value: string) {
  (await cookies()).set({
    name,
    value,
    secure: true,
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365 // Cookie values ​​are valid for one year
  });
}
