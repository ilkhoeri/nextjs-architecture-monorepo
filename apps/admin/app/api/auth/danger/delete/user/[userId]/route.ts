import db from '@/lib/db';
import { auth } from '@/auth/auth';
import { NextResponse } from 'next/server';
import { isValidId } from '@repo/utils/text-parser';
import { getResponse } from '../../../../../../config/req-res';

export async function DELETE(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const [session, { userId }] = await Promise.all([auth(), params]);

    if (!session) return getResponse('Unauthenticated', 403);

    if (!userId) return getResponse('Unauthorized', 400);

    const isId = isValidId(userId);

    if (!isId) return getResponse('Forbidden', 403);

    const currentFind = db.user.findUnique({ where: { id: userId }, select: { id: true } });

    if (!currentFind) return getResponse('Not Found', 404);

    const deleteAvatar = await db.user.deleteMany({
      where: { id: userId }
    });

    return NextResponse.json(deleteAvatar);
  } catch (error) {
    console.error('[IMAGE_DELETE]', error);
    return getResponse('Internal error', 500);
  }
}
