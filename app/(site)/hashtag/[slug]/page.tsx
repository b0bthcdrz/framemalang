import ArticleCard from '@/components/article/ArticleCard';
import Container from '@/components/layout/Container';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { getAllHashtags, getArticlesByHashtag } from '@/lib/data';

export async function generateStaticParams() {
  const hashtags = await getAllHashtags();
  return hashtags.map((slug) => ({ slug }));
}

export default async function HashtagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getArticlesByHashtag(slug);

  return (
    <Container className="space-y-5 py-10">
      <BreadcrumbJsonLd items={[{ name: 'Home', item: '/' }, { name: `#${slug}`, item: `/hashtag/${slug}` }]} />
      <h1 className="text-3xl font-bold">Hashtag #{slug}</h1>
      {articles.length ? articles.map((a) => <ArticleCard key={a._id} article={a} />) : <p>Tidak ada artikel dengan hashtag ini.</p>}
    </Container>
  );
}
