'use client';
import React from 'react';
import { cn } from '@repo/utils';
import { User } from '@/types/user';
import { SignOutFillIcon } from '@repo/icons';
import { HeadImageSign } from '@/components/form/components';
import { buttonVariants, Dialog, DialogClose, DialogContent, DialogTrigger, Loader } from '@repo/ui';

export function SignOutAction({ user, onConfirm }: { user: User; onConfirm: React.MouseEventHandler<HTMLButtonElement> }) {
  const [loading, setLoading] = React.useState(false);

  const disabledProp = {
    disabled: loading,
    'aria-disabled': loading
  };

  return (
    <>
      <HeadImageSign icon={<SignOutFillIcon size={48} color="#52a9ff" />} title="" description="" className="mb-6" />

      <Dialog>
        <DialogTrigger
          type="button"
          role="button"
          tabIndex={0}
          {...disabledProp}
          className={cn(buttonVariants({ variant: 'danger', size: 'sm' }), 'w-full transition-[height] duration-500 group-focus-within:opacity-100 disabled:pointer-events-none')}
        >
          Sign Out
        </DialogTrigger>
        <DialogContent
          {...disabledProp}
          title="Are you sure you want to log out?"
          description={user?.email && `Log out of App as ${user?.email}?`}
          classNames={{
            close: 'hidden sr-only',
            content: 'rounded-3xl sm:rounded-3xl bg-background-theme max-w-[373px] sm:max-w-[400px] px-6 py-8 sm:p-10 *:font-system',
            header: 'text-center text-balance',
            title: 'text-h4',
            description: 'text-paragraph text-muted-foreground mt-4'
          }}
        >
          <button
            type="button"
            role="button"
            tabIndex={0}
            {...disabledProp}
            className={cn(buttonVariants({ variant: 'danger', size: 'lg' }), 'relative overflow-hidden gap-2 rounded-full')}
            onClick={e => {
              setLoading(true);
              onConfirm?.(e);
            }}
          >
            {loading && <Loader type="spinner" size={17.5} color="white" />} Sign Out
          </button>
          <DialogClose {...disabledProp} className={cn(buttonVariants({ size: 'lg' }), 'relative overflow-hidden gap-2 rounded-full bg-muted -mt-2')}>
            Cancel
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
