'use client';

import React from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Svg } from '@repo/ui/svg';
import { Dialog } from '@repo/ui/dialog';
import { Button } from '@repo/ui/button';
import { LoaderSpinner } from '@repo/ui/loader';
import { useStoreModal } from '@/context/use-store-modal';
import { SheetsBreakpoint } from '@repo/ui/sheets-breakpoint';
import { SignUpFormValues, SignUpSchema } from '@/schemas/user';
import { ClientOnly } from '@repo/ui/client-only';
import { Form, useForm } from '@repo/components/fields';

export function RegisterPage() {
  const onOpen = useStoreModal(state => state.onOpen);
  const isOpen = useStoreModal(state => state.isOpen);

  React.useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
}

export function RegisterModal() {
  const storeModal = useStoreModal();

  const { form, router, params, loading, setLoading } = useForm<SignUpFormValues>({
    schema: SignUpSchema,
    defaultValues: {
      name: '',
      email: ''
      // phone: '',
      // bio: '',
    }
  });

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth', values);
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientOnly>
      <SheetsBreakpoint
        openWith="dialog"
        disabled={loading}
        title="Create Store"
        open
        // open={storeModal.isOpen}
        // onClose={storeModal.onClose}
        classNames={{ content: 'flex flex-col [&_[data-role="button-close"]]:hidden' }}
        trigger={null}
        content={
          <>
            <Dialog.Header>
              <CloudIcon />
              <div className="grid">
                <Dialog.Title className="text-[#47b7f8]">Create store</Dialog.Title>
                <Dialog.Description>Add a new store to manage products and categories.</Dialog.Description>
              </div>
            </Dialog.Header>

            <div className="space-y-4 -mt-4">
              <div className="space-y-2">
                <Form.Provider {...form}>
                  <Form onSubmit={form.handleSubmit(onSubmit)}>
                    <Form.Field control={form.control} name="name" render={({ field }) => <Form.InputField label="Name" disabled={loading} placeholder="Name Store" {...field} />} />
                    <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                      <Button disabled={loading} variant="danger" onClick={storeModal.onClose}>
                        Cancel
                      </Button>
                      <Button disabled={loading} type="submit" className="w-[96px] min-w-[96px]" variant="green">
                        {loading ? <LoaderSpinner /> : 'Continue'}
                      </Button>
                    </div>
                  </Form>
                </Form.Provider>
              </div>
            </div>
          </>
        }
      />
    </ClientOnly>
  );
}

function CloudIcon() {
  return (
    <Svg viewBox="0 0 32 32" size={64} className="text-[#47b7f8]" currentFill="none">
      <path
        d="M9 25H8C4.68629 25 2 22.3137 2 19C2 15.6863 4.68629 13 8 13C8.74978 13 9.46744 13.1375 10.1291 13.3887C10.8996 8.63198 15.0257 5 20 5C25.5228 5 30 9.47715 30 15C30 20.1853 26.0533 24.4489 21 24.9506"
        strokeWidth="2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 25C14 25.5523 13.5523 26 13 26C12.4477 26 12 25.5523 12 25C12 24.4477 12.4477 24 13 24C13.5523 24 14 24.4477 14 25Z" fill="currentColor" opacity="0.5" />
      <path d="M18 25C18 25.5523 17.5523 26 17 26C16.4477 26 16 25.5523 16 25C16 24.4477 16.4477 24 17 24C17.5523 24 18 24.4477 18 25Z" fill="currentColor" opacity="0.5" />
      <path d="M20 9C22.973 9 25.441 11.1623 25.917 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </Svg>
  );
}
