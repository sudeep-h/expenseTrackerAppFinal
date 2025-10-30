import type { Metadata } from 'next';

export type PageMeta = {
  title?: string;
  description?: string;
};

export function buildPageMetadata(meta: PageMeta): Metadata {
  const title = meta.title ? `${meta.title}` : undefined;
  const description =
    meta.description ?? 'A modern expense tracking application';

  return {
    title,
    description,
    openGraph: {
      title: title ?? 'MeraBachat',
      description,
    },
    twitter: {
      card: 'summary',
      title: title ?? 'MeraBachat',
      description,
    },
  };
}
