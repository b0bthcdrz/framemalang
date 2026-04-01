import ArticleCard from '@/components/article/ArticleCard';
import Container from '@/components/layout/Container';
import { getRecentArticles } from '@/lib/data';

export default async function ArtikelPage() {
  const articles = await getRecentArticles();

  return (
    <Container className="space-y-4 py-10">
      <h1 className="text-3xl font-bold">Semua Artikel</h1>
      {articles.map((article) => (
        <ArticleCard key={article._id} article={article} />
      ))}
    </Container>
  );
}
