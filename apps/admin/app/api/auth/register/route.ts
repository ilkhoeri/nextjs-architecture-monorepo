import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { ObjectId } from 'bson';
import { NextResponse } from 'next/server';
import { getRequest, getResponse } from '../../../config/req-res';
import { sanitizedWord } from '@repo/utils/text-parser';
import { getFromUser, getNameParts } from '@/lib/const/get-from-user';
import { getUserByEmail, getUserByUserName } from '@/lib/get-user';

export async function POST(req: Request) {
  try {
    // const { email, name, password, confirmPassword } = await req.json();
    const body = await getRequest(req);
    const { email, name, password, confirmPassword } = body;

    const username = sanitizedWord(name);
    const [firstName, lastName] = getNameParts(name);
    const refId: string = new ObjectId().toHexString();
    const existingEmail = await getUserByEmail(email);
    const existingUsername = await getUserByUserName(sanitizedWord(name));
    const hashedPassword = await bcrypt.hash(password, 12);

    // Validasi input dasar sebelum melanjutkan
    if (!email || !name || !password || !confirmPassword) return getResponse('Missing required fields', 400);

    if (password !== confirmPassword) return getResponse("Password does't match", 309);

    if (existingEmail && existingUsername) return getResponse('Email and Name already exists', 400);

    if (existingEmail) return getResponse('Email already exists', 401);

    if (existingUsername) return getResponse('Name already used', 402);

    const newUser = await db.user?.create({
      data: {
        refId,
        username,
        name: getFromUser().name(name),
        firstName,
        lastName,
        email: email.replace(/[^a-zA-Z0-9@_.-]/g, ''),
        role: 'USER',
        password: hashedPassword
      }
    });

    const redirectAfterSuccess = email && email.trim() !== '' ? `/auth/sign-in?email=${encodeURIComponent(email)}` : '/auth/sign-in';

    // For server-side redirect, typically do this:
    // return NextResponse.redirect(new URL(redirectAfterSuccess, req.url));
    // However, since returning JSON, a redirect might not be intended here.
    // If intend to return JSON and then client-side redirect, keep as is or handle on client.

    return NextResponse.json(newUser);
  } catch (error) {
    console.log('[USER_CREATE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
