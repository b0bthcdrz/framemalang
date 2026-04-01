import ArticleCard from '@/components/article/ArticleCard';
import Container from '@/components/layout/Container';
import PersonJsonLd from '@/components/seo/PersonJsonLd';
import { getAllAuthors, getAuthorWithArticles } from '@/lib/data';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const authors = await getAllAuthors();
  return authors.map((author) => ({ slug: author.slug.current }));
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await getAuthorWithArticles(slug);
  if (!author) notFound();

  return (
    <Container className="space-y-6 py-10">
      <PersonJsonLd author={author} />
      <h1 className="text-3xl font-bold">{author.name}</h1>
      <p>{author.bio}</p>
      <h2 className="text-xl font-semibold">Artikel</h2>
      {author.articles?.map((article) => <ArticleCard key={article._id} article={article} />)}
    </Container>
  );
}
