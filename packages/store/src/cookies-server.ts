'use server';
import { cookies } from 'next/headers';

/**
 * Sets an HTTP-only, secure cookie with a specified expiration time (in days).
 *
 * @param name - The name of the cookie.
 * @param value - The value to store in the cookie.
 * @param days - Number of days before the cookie expires (default is 365 days).
 *
 * @example
 * // Set a cookie named 'token' that expires in 7 days
 * await setCookies('token', 'abc123', 7);
 *
 * // Set a cookie named 'theme' that expires in 1 year (365 days)
 * await setCookies('theme', 'dark', 365);
 */
export async function setCookies(name: string, value: string, days: number = 365) {
  const maxAgeInSeconds = days * 60 * 60 * 24;
  (await cookies()).set({
    name,
    value,
    secure: true,
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    maxAge: maxAgeInSeconds
  });
}
