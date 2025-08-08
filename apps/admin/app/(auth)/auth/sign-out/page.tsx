import { signOut } from '@/auth/auth';
import { getCurrentUser } from '@/lib/get-user';
import { configMetadata } from '../../../config/site';
import type { Metadata, ResolvingMetadata } from 'next';
import { SignOutAction } from '@/components/form/signout-form';

export async function generateMetadata({}: {}, parent: ResolvingMetadata): Promise<Metadata> {
  return configMetadata({
    url: '/auth/sign-out',
    title: 'Sign Out',
    images: (await parent).openGraph?.images
  });
}

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) return null;

  return (
    <div className="size-full flex flex-col justify-center items-center pb-6">
      <SignOutAction
        user={user}
        onConfirm={async function () {
          'use server';
          await signOut();
        }}
      />
    </div>
  );
}
