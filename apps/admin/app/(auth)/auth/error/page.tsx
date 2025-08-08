import db from '@/lib/db';
import { AuthErrorMessage } from '../components';
import { configMetadata } from '../../../config/site';
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata({}: {}, parent: ResolvingMetadata): Promise<Metadata> {
  return configMetadata({
    url: '/auth/error',
    title: 'Error',
    images: (await parent).openGraph?.images
  });
}

async function getAccountsUser(email: string) {
  try {
    return await db.user.findUnique({ where: { email }, select: { accounts: true } });
  } catch {
    return null;
  }
}

interface ErrorPageParams {
  searchParams: Promise<{ email: string }>;
}

export default async function ErrorPage({ searchParams }: ErrorPageParams) {
  const email = decodeURIComponent((await searchParams).email);
  const user = await getAccountsUser(email);
  return (
    <div className="size-full flex flex-col justify-center items-center">
      <AuthErrorMessage accounts={user?.accounts} />
    </div>
  );
}
