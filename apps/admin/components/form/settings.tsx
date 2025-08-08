'use client';

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { LoaderSpinner } from '@repo/ui/loader';
import { User } from '@prisma/client';
import { Form, useForm } from '@repo/components/fields';
import { Button } from '@repo/ui/button';
import { toast } from 'sonner';

export const formSettingsSchema = z.object({
  name: z.string().min(2),
  image: z.optional(z.string()).nullable(),
  email: z.string().min(0).optional()
});

type SettingsFormValues = z.infer<typeof formSettingsSchema>;

export type StoreFormProps = { data: User };

export function SettingsForm({ data }: StoreFormProps) {
  const [open, setOpen] = useState(false);

  const { form, router, params, loading, setLoading } = useForm<SettingsFormValues>({
    schema: formSettingsSchema,
    defaultValues: data || {
      name: '',
      image: '',
      email: ''
    }
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      toast(`Saving ${open ? 'image' : 'store'}...`);
      await axios.patch(open ? `/api/auth/image/${params.storeId}` : `/api/auth/${params.storeId}`, data);
      router.refresh();
    } catch (error: any) {
      toast.error('Uh oh! Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
      toast.success(`${open ? 'Image' : 'Store'} updated.`);
    }
  };

  return (
    <>
      <Form.Provider {...form}>
        <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full flex-1 lg:max-w-3xl">
          <Form.Field
            control={form.control}
            name="image"
            render={({ field }) => (
              <Form.AvatarField
                name="image"
                label="Avatar"
                disabled={loading}
                value={field.value ? field.value : ''}
                onChange={url => field.onChange(url)}
                // openModal={() => setOpen(true)}
              />
            )}
          />

          {/* <ImageUploadProfileModal
            isOpen={open}
            loading={loading}
            onClose={() => {
              setOpen(false);
            }}
          /> */}

          <Form.Field
            control={form.control}
            disabled={loading}
            name="name"
            render={({ field }) => (
              <Form.InputField
                disabled={loading}
                placeholder="Store name"
                label="Name"
                description="This is your public display name. It can be your real name or a pseudonym."
                {...field}
              />
            )}
          />

          <Form.Field
            control={form.control}
            name="email"
            render={({ field }) => (
              <Form.InputField
                disabled={loading}
                type="email"
                placeholder="Email"
                label="Email"
                description="You can manage verified email addresses in your email settings."
                {...field}
              />
            )}
          />

          <Button disabled={loading} aria-disabled={loading} title="Save" className="flex w-[130px] min-w-[130px]" variant="green" type="submit">
            {loading ? <LoaderSpinner /> : 'Update profile'}
          </Button>
        </Form>
      </Form.Provider>
    </>
  );
}
