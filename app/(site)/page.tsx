import ArticleCard from '@/components/article/ArticleCard';
import FeaturedSection from '@/components/article/FeaturedSection';
import Container from '@/components/layout/Container';
import { getFeaturedArticles, getRecentArticles, getSiteSettings } from '@/lib/data';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.siteTitle,
    description: settings.tagline
  };
}

export default async function HomePage() {
  const [featured, recent] = await Promise.all([getFeaturedArticles(), getRecentArticles()]);

  return (
    <Container className="space-y-10 py-10">
      <FeaturedSection articles={featured} />
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Artikel Terbaru</h2>
        {recent.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </section>
    </Container>
  );
}
