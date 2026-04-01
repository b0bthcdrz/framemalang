import type { Article } from '@/lib/types';
import ArticleCard from './ArticleCard';

export default function FeaturedSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold text-brand-900">Featured</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </section>
  );
}
