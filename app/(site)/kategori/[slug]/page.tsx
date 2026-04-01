import ArticleCard from '@/components/article/ArticleCard';
import Container from '@/components/layout/Container';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { getAllCategories, getArticlesByCategory } from '@/lib/data';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ slug: category.slug.current }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((item) => item.slug.current === slug);
  if (!category) notFound();
  const articles = await getArticlesByCategory(slug);

  return (
    <Container className="space-y-5 py-10">
      <BreadcrumbJsonLd items={[{ name: 'Home', item: '/' }, { name: category.title, item: `/kategori/${slug}` }]} />
      <h1 className="text-3xl font-bold">Kategori: {category.title}</h1>
      {articles.length ? articles.map((a) => <ArticleCard key={a._id} article={a} />) : <p>Belum ada artikel.</p>}
    </Container>
  );
}
