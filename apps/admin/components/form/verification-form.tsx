'use client';
import React from 'react';
import { HeadImageSign } from './components';
import { useRouter, useSearchParams } from 'next/navigation';
import { verification } from '@/auth/tokens/verification';
import { LoaderSpinner } from '@repo/ui/loader';
import { Alert } from '@repo/ui/alert';

export function VerificationForm() {
  const router = useRouter();
  const [error, setError] = React.useState<string | undefined>();
  const [success, setSuccess] = React.useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const onSubmit = React.useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError('Missing token!');
      return;
    }

    verification(token)
      .then(data => {
        if (data?.error) setError(data.error);

        if (data?.success) {
          router.push('/auth/sign-in');
          router.refresh();
          setSuccess(data.success);
        }
      })
      .catch(() => setError('Ada sesuatu yang salah!'));
  }, [token, success, error, router]);

  React.useEffect(() => {
    if (token) onSubmit();
  }, [token, onSubmit]);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-40">
      {!success && !error && <LoaderSpinner size={28} className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />}
      <HeadImageSign icon="/assets/key.png" />
      <Alert withCloseButton={false} success={success} error={error} className="relative" />
    </section>
  );
}
