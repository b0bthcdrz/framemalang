import type { Article } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function ArticleMeta({ article }: { article: Article }) {
  return (
    <div className="mt-2 text-sm text-slate-500">
      <span>{article.author?.name ?? 'Unknown author'}</span>
      <span> · {formatDate(article.publishedAt)}</span>
    </div>
  );
}
