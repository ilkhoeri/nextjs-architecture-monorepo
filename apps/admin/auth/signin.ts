'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { signIn } from './auth';
import { User } from '@/types/user';
import { AuthError } from 'next-auth';
import { SIGNIN_REDIRECT } from '../routes';
import { SignInSchema } from '@/schemas/user';
import { getUserByIdentifier } from '../lib/get-user';
import { isEmail, roster } from '@repo/utils/text-parser';

/** uncomment if activate resend for verificationToken */
// import { generateTwoFactorToken, generateVerificationToken } from './tokens';
// import { sendTwoFactorTokenEmail, sendVerificationEmail } from '../resource/server/mail';
// import { getTwoFactorConfirmationByUserId } from './tokens/two-factor-confirmation';
// import { getTwoFactorTokenByEmail } from './tokens/two-factor-token';

export async function signin(values: z.infer<typeof SignInSchema>, callbackUrl?: string | null) {
  const validatedFields = SignInSchema.safeParse(values);
  if (!validatedFields.success) return { error: 'Input tidak sesuai', desc: 'Pastikan masukan Anda sesuai.' };

  const { identifier, password, code: _ } = validatedFields.data;
  // const { identifier, password, code: _ } = values;

  try {
    const existingUser = (await getUserByIdentifier(identifier)) as User;

    const identifierIsEmail = isEmail(identifier);

    if (existingUser?.accounts && !existingUser.password) {
      const providerList = existingUser.accounts?.map(acc => acc.provider);
      return { error: 'Email terdaftar di provider lain', desc: `Silakan login menggunakan ${roster(providerList, 'atau')}.` };
    }

    if (!existingUser || !existingUser.email || !existingUser?.password) {
      return {
        error: identifierIsEmail ? 'Email tidak terdaftar' : 'Nama pengguna tidak ditemukan',
        desc: identifierIsEmail ? 'Pastikan alamat email Anda benar.' : 'Pastikan nama pengguna Anda benar.'
      };
    }

    if (!password) return { error: 'Kata sandi diperlukan', desc: 'Pastikan kata sandi sudah sesuai ketentuan.' };

    const passwordsMatch = await bcrypt.compare(password, existingUser?.password);

    if (!passwordsMatch) return { error: 'Kata sandi keliru', desc: 'Pastikan kata sandi Anda benar.' };

    /**
   * Aktifkan jika berlangganan resend (plugin)
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: 'token verifikasi telah terkirim! Cek Email Anda.' };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) return { error: 'Token tidak sah!' };

      if (twoFactorToken.token !== code) return { error: 'Token tidak sah!' };

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) return { error: 'Token kedaluwarsa!' };

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id }
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id }
        });
      }

      await db.twoFactorConfirmation.create({
        data: { userId: existingUser.id }
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }
   */

    await signIn('credentials', {
      email: existingUser.email, // tetap gunakan email sebagai identitas ke signIn()
      password,
      redirectTo: callbackUrl || SIGNIN_REDIRECT
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Pengguna tidak ditemukan', desc: 'Pastikan email / nama pengguna dan kata sandi Anda benar.' };
        default:
          return { error: 'Error', desc: 'Something went wrong.' };
      }
    }

    throw error;
  }

  return { success: 'Login berhasil', desc: 'Selamat datang kembali, halaman segera dialihkan.' };
}
