'use server';

import * as z from 'zod';
import { generatePasswordResetToken } from '.';
import { ResetSchema } from '../../schemas/user';
import { getUserByEmail } from '../../lib/get-user';

export async function reset(values: z.infer<typeof ResetSchema>) {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) return { error: 'Email tidak valid' };

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) return { error: 'Email tidak ditemukan.' };

  const passwordResetToken = await generatePasswordResetToken(email);
  // await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

  return { success: 'Setel ulang email terkirim!' };
}
