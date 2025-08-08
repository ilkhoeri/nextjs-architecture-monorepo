import { getCurrentUser } from '@/lib/get-user';
import { pickFromOtherUser } from '@/types/user';
import db from '@/lib/db';
import { NextResponse } from 'next/server';

const getResponse = (body: BodyInit, status: number) => new NextResponse(body, { status });

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return getResponse('Unauthorized', 401);

    const allUser = await db.user?.findMany({
      where: {
        NOT: { role: 'DEVELOPER' }
      },
      select: {
        ...pickFromOtherUser,
        about: {
          select: {
            birthDay: true,
            birthPlace: true,
            gender: true,
            bio: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(allUser);
  } catch (error) {
    console.error('Error fetching chat group:', error);
    return getResponse('Internal Error', 500);
  }
}
