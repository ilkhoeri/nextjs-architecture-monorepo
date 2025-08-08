import db from '@/lib/db';
import { auth } from '@/auth/auth';
import { NextResponse } from 'next/server';
import { getRequest, getResponse } from '../../../../config/req-res';

export async function PATCH(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const [session, { userId }] = await Promise.all([auth(), params]);

    const body = await getRequest(req);

    if (!session || !session?.user) return getResponse('Unauthenticated', 403);

    if (!userId) return getResponse('Missing Account ID', 400);

    if (!body || Object.keys(body).length === 0) return getResponse('Empty update data', 400);

    const findUser = await db.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        email: true,
        refId: true
      }
    });

    if (!findUser) return getResponse('Unauthorized', 401);

    const updateAvatar = await db.user.update({
      where: { id: userId },
      data: body,
      include: { address: true, links: true, about: true }
    });

    return NextResponse.json(updateAvatar);
  } catch (error) {
    console.error('[UPDATED_ACCOUNT_ERROR]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
