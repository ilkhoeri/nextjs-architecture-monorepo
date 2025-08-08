'use server';

import * as z from 'zod';
import db from '@/lib/db';
import { auth } from '../auth';
import { ObjectId } from 'bson';
import { LinkSchema } from '@/schemas/link';

type HandlerModel = 'create' | 'update' | 'delete';

export async function handlerLinkUser(model: HandlerModel, id: string | null | undefined, values: Partial<z.infer<typeof LinkSchema>>) {
  if (!id) return { error: 'Required ID' };

  if (!ObjectId.isValid(id)) return { error: 'ID tidak valid!' };

  const validatedFields = LinkSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Field tidak valid!', details: JSON.stringify(validatedFields.error.format()) };
  }

  const fields = validatedFields.data;

  const template = `${fields.name ?? ''} link successfully`;

  const successByModel = {
    create: `${template} added`,
    update: `${template} updated`,
    delete: `${template} deleted`
  };

  try {
    const session = await db.user.findUnique({ where: { id: (await auth())?.user?.id } });
    if (!session) {
      return { error: 'Required session!' };
    }

    const existingUser = await db.user.findUnique({ where: { id } });
    if (!existingUser) {
      return { error: 'User tidak ditemukan!' };
    }

    if (model === 'create') {
      await db.link.create({
        data: { ...fields, name: fields.name ?? '', userId: id }
      });
    } else if (model === 'update') {
      if (!fields.id) return { error: 'Required Link ID!' };

      await db.link.update({
        where: { id: fields.id, userId: id },
        data: { name: fields.name ?? '', url: fields.url }
      });
    } else if (model === 'delete') {
      if (!fields.id) return { error: 'Required Link ID!' };

      await db.link.delete({
        where: { id: fields.id, userId: id }
      });
    }

    return { success: successByModel[model] };
  } catch (error) {
    console.error('Catch Error:', error);
    return { error: 'Error', details: String(error) };
  }
}
