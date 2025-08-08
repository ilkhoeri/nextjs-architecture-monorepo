'use server';

import db from '@/lib/db';
import { ObjectId } from 'bson';
import { Prisma } from '@prisma/client';
// import { OAuthProvider } from '@/types/user';
import { sanitizedWord } from '@repo/utils/text-parser';
import { getNameParts } from '../lib/const/get-from-user';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { SignUpFormValues } from '@/schemas/user';
import { getUserByEmail, getUserByUserName } from '../lib/get-user';

/** uncomment if activate resend for verificationToken */
// import { generateVerificationToken } from '../tokens';
// import { sendVerificationEmail } from '../mail';

type RegisterRequired = {
  name: string;
  email: string;
  password?: string | null | undefined;
  image?: string | null | undefined;
  refId?: string;
  username?: string;
  firstName?: string;
  // provider: OAuthProvider | (string & {});
};

type RegisterOptions = Omit<
  | (Prisma.Without<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput> & Prisma.UserUncheckedCreateInput)
  | (Prisma.Without<Prisma.UserUncheckedCreateInput, Prisma.UserCreateInput> & Prisma.UserCreateInput),
  keyof RegisterRequired
>;

type RegisterData = {
  data: Merge<RegisterRequired & RegisterOptions>;
  /** Choose, which related nodes to fetch as well */
  include?: Prisma.UserInclude<DefaultArgs> | null | undefined;
};

export async function register({ data, include }: RegisterData) {
  try {
    const [firstName, lastName] = getNameParts(data.name);
    const refId = new ObjectId().toHexString();
    const username = sanitizedWord(data.name);

    await db.user?.create({
      data: {
        refId: refId,
        username: username,
        firstName: firstName,
        lastName: lastName,
        role: 'USER',
        ...data,
        // address: { create: { country: 'Indonesia' } },
        name: data.name.replace(/\s+/g, '').toLowerCase(),
        email: data.email.replace(/[^a-zA-Z0-9@_.-]/g, '')
      },
      include
    });

    /** if activate resend for verificationToken */
    // const verificationToken = await generateVerificationToken(email);
    // await sendVerificationEmail(verificationToken.email, verificationToken.token);
  } catch (_e) {}
}

export async function signup(values: SignUpFormValues) {
  // const validatedFields = SignUpSchema.safeParse(values);
  // if (!validatedFields.success) return { error: 'Invalid input', desc:'Data yang dikirim tidak sesuai format yang diminta.' };

  const { email, password, name } = values;

  try {
    const existingEmail = await getUserByEmail(email);
    const existingUsername = await getUserByUserName(sanitizedWord(name));
    // const hashedPassword = await bcrypt.hash(password, 10);

    if (existingEmail && existingUsername) return { error: 'Email dan Nama sudah terdaftar', desc: 'Gunakan email dan nama lain untuk mendaftar.' };

    if (existingEmail) return { error: 'Email sudah terdaftar', desc: 'Silakan gunakan email lain atau login jika itu email Anda.' };

    if (existingUsername) return { error: 'username sudah terdaftar', desc: 'Silakan gunakan nama lain sebagai username.' };

    const newUser = await register({ data: { email, password, name } });
    // return { success: "Confirmation email sent!" };

    return { newUser, success: 'Registration successful, please login.', desc: 'Akun Anda telah dibuat dan siap digunakan.' };
  } catch (error) {
    console.error('Signup Error:', error);
    return { error: 'Error', desc: 'Silakan coba beberapa saat lagi, atau hubungi tim support.' };
  }
}
