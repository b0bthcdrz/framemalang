import { PortableText } from '@portabletext/react';

export default function ArticleBody({ value }: { value?: unknown[] }) {
  if (!value?.length) return null;
  return <div className="prose max-w-none"><PortableText value={value} /></div>;
}
