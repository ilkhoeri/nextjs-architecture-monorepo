import { ProviderSign } from '../provider-sign';
import { configMetadata } from '@/app/config/site';
import { RegisterForm } from '@/components/form/signup-form';

import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata({}: {}, parent: ResolvingMetadata): Promise<Metadata> {
  return configMetadata({
    url: '/auth/sign-up',
    title: 'Register',
    images: (await parent).openGraph?.images
  });
}

type Params = Readonly<{
  searchParams: Promise<{ token: string }>;
}>;

export default async function RegisterPage(params: Params) {
  const { token } = await params.searchParams;

  return <RegisterForm providerSign={<ProviderSign />} />;
}
