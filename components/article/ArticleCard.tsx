import Link from 'next/link';
import type { Article } from '@/lib/types';
import ArticleMeta from './ArticleMeta';

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="rounded-lg border bg-white p-5 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">
        <Link href={`/artikel/${article.slug.current}`}>{article.title}</Link>
      </h3>
      <p className="mt-2 text-slate-600">{article.excerpt}</p>
      <ArticleMeta article={article} />
    </article>
  );
}
