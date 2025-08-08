import { configMetadata } from '@/app/config/site';
import { VerificationForm } from '@/components/form/verification-form';

import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata({}: {}, parent: ResolvingMetadata): Promise<Metadata> {
  return configMetadata({
    url: '/auth/verification',
    title: 'Verification',
    images: (await parent).openGraph?.images
  });
}

export default function VerificationPage() {
  return <VerificationForm />;
}
