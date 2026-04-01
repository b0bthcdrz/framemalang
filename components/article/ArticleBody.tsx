import { PortableText } from '@portabletext/react';
import type { TypedObject } from '@portabletext/types';

export default function ArticleBody({ value }: { value?: TypedObject[] }) {
  if (!value?.length) return null;

  return (
    <div className="prose max-w-none">
      <PortableText value={value} />
    </div>
  );
}
