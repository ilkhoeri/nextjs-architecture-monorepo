import { allDocs } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { Mdx } from '@/ui/mdx-component';
import { getTableOfContents } from '@/ui/toc/config';
import { DashboardTableOfContents } from '@/ui/toc/toc';
import { configMetadata, siteConfig } from '../site/config';

import type { Metadata, ResolvingMetadata } from 'next';

interface DocsParams {
  params: Promise<{ docs: string[] }>;
}

async function getPathFromParams({ params }: DocsParams) {
  const slug = (await params).docs?.join('/') || '';
  const docs = allDocs.find(doc => doc.slug === slug);
  if (!docs) return null;
  return docs;
}

export async function generateStaticParams() {
  const generateParams = allDocs.map(doc => ({ docs: [doc._raw.flattenedPath] }));
  return generateParams;
}

export async function generateMetadata({ params }: DocsParams, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = (await params).docs;
  const doc = allDocs.find(doc => slug?.includes(doc._raw.flattenedPath));
  const currentSlug = !slug?.length ? '/' : `/${slug.join('/')}`;
  return configMetadata({
    url: currentSlug,
    title: doc?.title,
    description: siteConfig().description,
    images: (await parent).openGraph?.images
  });
}

export default async function Home({ params }: DocsParams) {
  const [{ docs: slug }, docs] = await Promise.all([params, getPathFromParams({ params })]);
  const toc = await getTableOfContents(docs?.body?.raw || '');

  if (!docs) notFound();

  return (
    <>
      <article className="relative w-full max-w-full overflow-x-hidden max-md:px-6 pt-9 flex flex-col">
        <Mdx code={docs.body.code} />
      </article>
      {docs?.toc && slug?.length && <DashboardTableOfContents toc={toc} />}
    </>
  );
}
