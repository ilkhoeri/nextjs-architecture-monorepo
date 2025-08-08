import { ProviderSign } from '../provider-sign';
import { configMetadata } from '@/app/config/site';
import { SignInForm } from '@/components/form/signin-form';

import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata({}: {}, parent: ResolvingMetadata): Promise<Metadata> {
  return configMetadata({
    url: '/auth/sign-in',
    title: 'Login',
    images: (await parent).openGraph?.images
  });
}

export default function Page() {
  return <SignInForm providerSign={<ProviderSign />} />;
}
